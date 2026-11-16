[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/msmgm/ai-excited-01-entry/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/msmgm/ai-excited-01-entry/reward.svg)](https://make.fun/bounty/ai-excited-01/reward?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

Built for the [make.fun bounty "Make the AI judge excited"](https://make.fun/bounty/ai-excited-01).

# The Mailbox Rocket

A quiet suburban street at dawn sets the scene as a small red mailbox stands with its flag up, unexpectedly transformed into the launchpad for a full-size white rocket blasting vertically into the sky. Thick billows of smoke and blank envelopes flying like confetti fill the air around the ignition point. Below, a uniformed mailman shields his face with his arm, looking up in sheer astonishment as his mailbag drops to the pavement.

## How it works & Why it wins

`main.ts` (Node 22, standard library only) validates the repository-held image against the competition gate and copies it byte-for-byte to `/output/entry.png`. No network, no randomness: every run produces identical bytes.

## Why it wins

- **Excitement:** A vertical dawn launch with impossible scale and explosive energy hits the AI judge with an immediate jolt.
- **Surprise:** The most mundane, boring object on a suburban street conceals an ascending rocket rather than a chaotic explosion.
- **Momentum:** Strong vertical composition, billowing smoke, and flying paper drive the eye straight upward.
- **Craft:** Clean, striking shapes—the red box, white rocket, and blue dawn sky—with zero text anywhere.
- **Reads small:** One big white vertical shape against blue with the red anchor below ensures instant recognition even at ~300px thumbnail size.

## Run locally

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

The submission gate verifies that `entry.png` is a JPEG image exactly 1024x1024 pixels and 166,121 bytes. Running the validation script twice yields byte-identical outputs.

**Repo layout:**
- `main.ts`: Zero-dependency Node 22 validation and copy runner
- `entry.png`: The submission image (JPEG 1024x1024, 166,121 bytes)
- `CONCEPT.md`: Detailed visual concept and rubric breakdown
- `LICENSE`: Open-source license terms
- `.makefun/owner.json`: Ownership metadata
