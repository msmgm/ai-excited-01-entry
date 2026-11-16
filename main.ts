/**
 * make.fun ai-excited-01 Entry: The Mailbox Rocket
 *
 * Program overview:
 * - Writes a single verified image to the output directory as entry.png.
 * - Carries entry.png: a white rocket blasting vertically out of a small red
 *   mailbox at dawn, letters flying like confetti, a mailman looking up in shock.
 * - Image specs: JPEG bytes, 1024x1024 dimensions, 166,121 bytes.
 *
 * Gate validation limits:
 * - Format: PNG or JPEG detected via magic bytes.
 * - Size: <= 1 MiB (1,048,576 bytes).
 * - Dimensions: <= 1024x1024 pixels.
 *
 * Determinism & environment:
 * - Byte-identical output every run.
 * - No network access, no randomness, standard library only.
 *
 * Local execution:
 *   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
 */

import { readFileSync, copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const MAX_SIZE = 1 * 1024 * 1024; // 1 MiB
const MAX_DIM = 1024;

function parseDimensions(buffer: Buffer, format: 'png' | 'jpeg'): { width: number; height: number } {
  if (format === 'png') {
    if (buffer.length < 24) throw new Error('Invalid PNG buffer: too short for IHDR');
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  let offset = 2; // Skip SOI (FF D8)
  while (offset < buffer.length) {
    if (buffer[offset] === 0xFF) {
      const type = buffer[offset + 1];
      if (type >= 0xC0 && type <= 0xC3) {
        if (offset + 9 >= buffer.length) throw new Error('Invalid JPEG SOF marker: truncated');
        return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
      }
      if (type !== 0xD8 && type !== 0xD9 && (type < 0xD0 || type > 0xD7)) {
        offset += 2 + buffer.readUInt16BE(offset + 2);
        continue;
      }
    }
    offset++;
  }
  throw new Error('Could not find JPEG SOF marker to parse dimensions');
}

/**
 * Detects whether the buffer is PNG or JPEG based on magic bytes.
 * Throws if the buffer is too short or format is unrecognized.
 */
function detectFormat(buffer: Buffer): 'png' | 'jpeg' {
  if (buffer.length < 4) throw new Error('Image file is too short');
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8) return 'jpeg';
  throw new Error('Invalid image format: must be PNG or JPEG');
}

function validateImage(filePath: string): { format: 'png' | 'jpeg'; size: number; width: number; height: number } {
  if (!existsSync(filePath)) throw new Error(`Image file not found: ${filePath}`);
  const size = statSync(filePath).size;
  if (size > MAX_SIZE) throw new Error(`Image size exceeds gate limit: ${size} bytes (max ${MAX_SIZE})`);
  const buffer = readFileSync(filePath);
  const format = detectFormat(buffer);
  const { width, height } = parseDimensions(buffer, format);
  if (width <= 0 || height <= 0) throw new Error(`Invalid dimensions: ${width}x${height}`);
  if (width > MAX_DIM || height > MAX_DIM) throw new Error(`Dimensions exceed gate limit: ${width}x${height} (max ${MAX_DIM}x${MAX_DIM})`);
  return { format, size, width, height };
}

/**
 * Resolves the absolute path to entry.png.
 * Uses import.meta.dirname because the image sits beside main.ts in the repo snapshot.
 */
function resolveImagePath(): string {
  return join(import.meta.dirname, 'entry.png');
}

/**
 * Verifies that the destination file is byte-identical to the source file.
 * Throws an error if contents differ.
 */
function verifyCopy(sourcePath: string, destPath: string): void {
  const copied = readFileSync(destPath);
  const original = readFileSync(sourcePath);
  if (!copied.equals(original)) throw new Error('Copy verification failed: output bytes differ from source');
}

/**
 * Resolves the output directory path.
 * Reads MAKEFUN_OUTPUT_DIR if set (useful for local runs), or defaults to '/output' (used in the grader container).
 */
function resolveOutputDir(): string {
  return resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
}

/**
 * Main entry point: validates image, resolves output directory, copies file, and verifies byte-identical output.
 */
function main(): void {
  // Validate
  const imagePath = resolveImagePath();
  const info = validateImage(imagePath);
  console.log(`[make.fun] Image validated: ${info.format.toUpperCase()} ${info.size} bytes ${info.width}x${info.height}`);

  // Resolve out dir
  const outDir = resolveOutputDir();
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const destPath = join(outDir, 'entry.png');

  // Copy
  copyFileSync(imagePath, destPath);

  // Verify
  verifyCopy(imagePath, destPath);
  console.log(`[make.fun] Copied ${info.size} bytes to ${destPath} (byte-identical)`);
}

main();
