/**
 * make.fun ai-excited-01 Entry: The Mailbox Rocket
 *
 * This program writes one canonical image to the output destination:
 * a white rocket blasting vertically out of a small red mailbox at dawn,
 * letters flying like confetti, with a mailman looking up in shock.
 * 
 * The image asset is held directly in this repository as entry.png
 * (JPEG format, 1024x1024 dimensions, 166121 bytes) and is copied
 * byte-for-byte after rigorous gate validation.
 *
 * Gate Limits & Validation:
 * - Format: PNG or JPEG verified by magic bytes.
 * - Max File Size: <= 1 MiB (1,048,576 bytes).
 * - Max Dimensions: <= 1024x1024 pixels.
 *
 * Determinism & Design:
 * - 100% deterministic (byte-identical every run).
 * - No external network calls, no randomness, standard library only.
 *
 * Local Execution:
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
 * Detects image format ('png' or 'jpeg') from magic bytes.
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
 * Resolves the target output directory.
 * Reads MAKEFUN_OUTPUT_DIR environment variable (used for local runs)
 * or defaults to '/output' (used in the grader container).
 */
function resolveOutputDir(): string {
  return resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output');
}

/**
 * Verifies that the destination file matches the source file byte-for-byte.
 * Throws an error if the files differ.
 */
function verifyCopy(sourcePath: string, destPath: string): void {
  const copied = readFileSync(destPath);
  const original = readFileSync(sourcePath);
  if (!copied.equals(original)) {
    throw new Error('Copy verification failed: output bytes differ from source');
  }
}

/**
 * Executes the validation, copy, and verification pipeline.
 */
function main(): void {
  // 1. Validate source image against gate limits
  const imagePath = resolveImagePath();
  const info = validateImage(imagePath);
  console.log(`[make.fun] Image validated: ${info.format.toUpperCase()} ${info.size} bytes ${info.width}x${info.height}`);

  // 2. Resolve output directory and ensure it exists
  const outDir = resolveOutputDir();
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  const destPath = join(outDir, 'entry.png');

  // 3. Copy image byte-for-byte to destination
  copyFileSync(imagePath, destPath);

  // 4. Verify copied output matches source exactly
  verifyCopy(imagePath, destPath);
  console.log(`[make.fun] Copied ${info.size} bytes to ${destPath} (byte-identical)`);
}

main();
