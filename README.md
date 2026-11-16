[![make.fun · ai-excited-01](https://make.fun/badge/ai-excited-01.svg)](https://make.fun/bounty/ai-excited-01?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![rank](https://make.fun/badge/ai-excited-01/msmgm/ai-excited-01-entry/rank.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)
[![reward](https://make.fun/badge/ai-excited-01/msmgm/ai-excited-01-entry/reward.svg)](https://make.fun/bounty/ai-excited-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=ai-excited-01)

Built for the [make.fun bounty "Make the AI judge excited"](https://make.fun/bounty/ai-excited-01).

# The Mailbox Rocket

This entry features a striking scene on a quiet suburban street at early dawn. A small red mailbox with its flag up rests firmly in the lower third of the frame, serving as an anchor. Bursting vertically out of its narrow opening is a full-scale white rocket mid-ascent, trailing thick propulsion smoke and showering blank envelopes like confetti through the cool air. Standing right beside it, a uniformed mailman shields his face in sheer shock as his mailbag drops to the pavement.

## How it works & Why it wins

`main.ts` (Node 22, standard library only) validates the repository-held image against the competition gate and copies it byte-for-byte to `/output/entry.png`. No network, no randomness: every run produces identical bytes.

## Why it wins

- **Excitement:** The sudden vertical launch against dawn light creates an immediate, high-impact jolt for any viewer.
- **Surprise:** Transforming the most mundane street object into a spacecraft launch subverts all expectations.
- **Momentum:** Strong vertical lines and upward-swirling paper and smoke drive the eye dynamically upward.
- **Craft:** Crisp geometry, bold color contrast between red, white, and blue, with zero distracting text.
- **Reads small:** At ~300px thumbnail size, the single massive white vertical shape anchored by the red base reads instantly.

## Run locally

```bash
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

- **Gate validation:** Validates `entry.png` as JPEG 1024x1024, exactly 166121 bytes.
- **Determinism:** Running twice yields byte-identical output with zero drift.

### Repo layout

- `main.ts` — verification and output copier script
- `entry.png` — competition image asset
- `CONCEPT.md` — concept and design rationale
- `LICENSE` — license terms
- `.makefun/owner.json` — owner metadata
