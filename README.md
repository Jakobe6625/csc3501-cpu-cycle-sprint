# CPU Cycle Shop

A browser-based game for the CSC 3501 Game-Based Learning Project.

## Concept
CPU Cycle Shop teaches the Fetch-Decode-Execute instruction cycle through a tech-shop workflow. Instead of answering a predictable quiz sequence, the player receives CPU instruction job tickets and processes each one through three stations:

1. Fetch Bench
2. Decode Desk
3. Execute Bay

Correct decisions earn points and build a streak. Mistakes reduce customer satisfaction and immediately explain the correct reasoning.

## Learning objective
After completing a shift, the player should be able to:
- Explain the role of Fetch, Decode, and Execute.
- Recognize how arithmetic, logic, memory, and control-flow instructions move through the CPU cycle.
- Distinguish retrieving an instruction from interpreting it and carrying it out.

## Current rebuild
- Randomized job tickets
- Five jobs per shift
- Three decisions per instruction
- Arithmetic, logic, load/store, and branch examples
- Score, streak, and customer-satisfaction systems
- Immediate educational feedback
- Responsive browser UI
- Built-in quick-reference shop manual

## Project structure
- `index.html` — game interface
- `css/style.css` — visual design and responsive layout
- `js/jobs.js` — instruction tickets and educational content
- `js/game.js` — game state, scoring, progression, and rendering

## Production deployment
Current live site: https://cpu-cycle-sprint.netlify.app/

The production site follows `main`. The tech-shop rebuild is being developed on a separate branch before it is merged.

## Next milestones
1. Playtest the full shift loop.
2. Add stronger station/ticket animations.
3. Add difficulty modes and a rush-hour mechanic.
4. Add optional sound effects.
5. Expand the instruction bank.
6. Create the required 800x450 thumbnail.
7. Add final authors and presentation notes.
