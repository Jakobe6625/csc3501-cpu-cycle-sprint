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
- Recognize how arithmetic, logic, memory, data-move, and control-flow instructions move through the CPU cycle.
- Distinguish retrieving an instruction from interpreting it and carrying it out.

## Current rebuild
- Randomized job tickets and randomized answer positions
- Expanded instruction bank with arithmetic, logic, load/store, data-move, and branch examples
- Training Shift: 5 untimed tickets
- Rush Hour: 7 tickets with a 12-second timer per stage
- Time bonuses and streak bonuses
- Score, accuracy, streak, and customer-satisfaction systems
- Immediate educational feedback
- Responsive browser UI
- Ticket and station transition animations
- Built-in quick-reference shop manual

## Project structure
- `index.html` — game interface
- `css/style.css` — visual design and responsive layout
- `js/jobs.js` — instruction tickets and educational content
- `js/game.js` — modes, timer, scoring, progression, and rendering

## Production deployment
Current live site: https://cpu-cycle-sprint.netlify.app/

The production site follows `main`. The tech-shop rebuild remains on `rebuild/tech-shop-v1` until playtesting is complete.

## Next milestones
1. Playtest Training Shift and Rush Hour.
2. Tune timer length, penalties, and scoring.
3. Add optional sound effects and mute controls.
4. Add more visual CPU feedback between stations.
5. Create the required 800x450 thumbnail.
6. Add final authors and presentation notes.
