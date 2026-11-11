# CPU Cycle Shop

A browser-based game for the CSC 3501 Game-Based Learning Project.

## Concept

CPU Cycle Shop turns Computer Organization topics into a repair-shop game loop.

The customer does not tell the player the technical answer. Each ticket starts with a normal-person symptom. The player must diagnose the underlying course topic, then complete three repair steps built around that concept.

Core loop:

1. Clock in.
2. Receive a random customer ticket.
3. Diagnose the underlying Computer Organization topic.
4. Correct diagnoses add repair time; wrong diagnoses remove time.
5. Complete three topic-specific repair steps.
6. Get paid based on shift rate, accuracy, and remaining time.
7. Take the next random ticket.

## Main shift topics

- Pointers / memory addressing
- Two's complement / signed integers
- IEEE 754 / floating point
- Boolean logic / circuits
- Branching / control flow
- x86 registers

The main pool currently contains 12 tickets, with multiple complaints for each major topic so the player cannot memorize one symptom-to-answer pairing.

## Overtime topics

Overtime is the advanced bonus shift. It pulls from topics that are harder to diagnose and pays a premium:

- Endianness
- Multithreading / race conditions
- GPU / parallelism
- Memory hierarchy / cache

The Overtime pool currently contains 8 tickets.

## Shift modes

### Training Shift
- 5 random main-pool tickets
- 55 seconds per ticket
- +8 seconds for a correct diagnosis
- Forgiving penalties
- Standard base pay

### Rush Hour
- 7 random main-pool tickets
- 38 seconds per ticket
- +5 seconds for a correct diagnosis
- Tougher penalties
- 1.15x base pay

### Overtime
- 5 random advanced tickets
- 36 seconds per ticket
- +4 seconds for a correct diagnosis
- Harshest penalties
- 1.75x base pay

## Current gameplay systems

- Random ticket order every shift
- Random answer order
- Symptom-first diagnosis system
- Shared ticket timer across diagnosis and repair
- Topic-specific repair stages
- Money-based payouts instead of points
- Speed bonus
- Mistake-based payout reduction
- Customer satisfaction
- Repair streaks
- Accuracy tracking
- Training, Rush Hour, and Overtime modes
- Responsive shop-style interface

## Project structure

- index.html — game interface
- css/style.css — base visual design
- css/rebuild-v2.css — v2 layout and Overtime overrides
- js/jobs.js — topic definitions, ticket scenarios, and repair content
- js/game.js — modes, timer, diagnosis, payouts, progression, and rendering

## Deployment

Production currently follows main.

The active rebuild remains on rebuild/tech-shop-v1 and is tracked in draft PR #2 until playtesting is complete.

## Next milestones

1. Playtest all three shift modes.
2. Tune timers and payouts from real playtest feedback.
3. Add more complaint variants to reduce repetition further.
4. Add optional perks/hints if schedule permits.
5. Gather team feedback and divide ownership of content, UI, testing, and assets.
6. Add optional sound effects and visual polish.
7. Create final thumbnail and presentation notes.
