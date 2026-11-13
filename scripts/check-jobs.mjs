// Checks the ticket content in js/jobs.js.
//
//   npm run check            (or: node scripts/check-jobs.mjs)
//
// Errors (exit code 1): things that break the game, such as a bad correct-answer
// index, duplicate IDs, unknown topics, or a pool too small for its shift mode.
// Warnings (exit code 0): things that make questions easy to guess, such as a
// correct answer much longer than the wrong ones, or a missing hint.

import { JOBS, TOPICS } from "../js/jobs.js";

// Keep in sync with MODES in js/game.js.
const POOL_SIZE_NEEDED = { main: 7, overtime: 5 };
const LENGTH_RATIO = 1.4;

const errors = [];
const warnings = [];
const ids = new Set();
const ticketsPerTopic = {};

for (const job of JOBS) {
  if (ids.has(job.id)) errors.push(`${job.id}: duplicate ticket ID`);
  ids.add(job.id);

  const topic = TOPICS.find(t => t.key === job.topic);
  if (!topic) errors.push(`${job.id}: unknown topic "${job.topic}"`);
  else if (topic.tier !== job.tier) errors.push(`${job.id}: tier "${job.tier}" does not match topic tier "${topic.tier}"`);

  ticketsPerTopic[job.topic] = (ticketsPerTopic[job.topic] ?? 0) + 1;

  for (const field of ["symptom", "instruction", "description"]) {
    if (!job[field]) errors.push(`${job.id}: missing ${field}`);
  }
  if (!job.stages?.length) errors.push(`${job.id}: has no repair stages`);

  (job.stages ?? []).forEach((stage, i) => {
    const where = `${job.id} step ${i + 1} (${stage.name})`;

    if (!Number.isInteger(stage.correct) || stage.correct < 0 || stage.correct >= stage.choices.length) {
      errors.push(`${where}: correct index ${stage.correct} is out of range`);
      return;
    }
    if (new Set(stage.choices).size !== stage.choices.length) {
      errors.push(`${where}: duplicate answer choices`);
    }
    if (!stage.explanation) errors.push(`${where}: missing explanation`);

    const lengths = stage.choices.map(c => c.length);
    const longestWrong = Math.max(...lengths.filter((_, k) => k !== stage.correct));
    if (lengths[stage.correct] > LENGTH_RATIO * longestWrong) {
      warnings.push(`${where}: correct answer is ${lengths[stage.correct]} chars vs ${longestWrong} for the longest wrong one`);
    }
    if (!stage.hint) warnings.push(`${where}: no hint`);
  });
}

for (const topic of TOPICS) {
  if ((ticketsPerTopic[topic.key] ?? 0) < 2) {
    errors.push(`Topic "${topic.key}" has fewer than 2 tickets, so its symptom is easy to memorize`);
  }
}

for (const [tier, needed] of Object.entries(POOL_SIZE_NEEDED)) {
  const have = JOBS.filter(j => j.tier === tier).length;
  if (have < needed) errors.push(`The ${tier} pool has ${have} tickets, but a shift needs ${needed}`);
}

const lengthWarnings = warnings.filter(w => !w.endsWith("no hint"));
const hintWarnings = warnings.length - lengthWarnings.length;

console.log(`Checked ${JOBS.length} tickets.\n`);
console.log(errors.length ? `ERRORS (${errors.length}):\n  ` + errors.join("\n  ") : "No errors.");
console.log(`\nAnswer-length warnings (${lengthWarnings.length}):` + (lengthWarnings.length ? "\n  " + lengthWarnings.join("\n  ") : " none"));
console.log(`\nSteps without a hint: ${hintWarnings}`);

process.exit(errors.length ? 1 : 0);
