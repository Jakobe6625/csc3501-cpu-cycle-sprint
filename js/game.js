import { JOBS, TOPICS } from "./jobs.js";

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SHIFT_TYPES = {
  slow: {
    label: "Slow Shift",
    minJobs: 3,
    maxJobs: 4,
    seconds: 58,
    advancedChance: 0,
    diagnosisBonus: 8,
    diagnosisPenalty: 5,
    repairPenalty: 3,
    satisfactionPenalty: 5,
    payMultiplier: 0.9,
    timeBonusCap: 12
  },
  steady: {
    label: "Steady Shift",
    minJobs: 4,
    maxJobs: 5,
    seconds: 52,
    advancedChance: 0,
    diagnosisBonus: 7,
    diagnosisPenalty: 6,
    repairPenalty: 4,
    satisfactionPenalty: 6,
    payMultiplier: 1,
    timeBonusCap: 13
  },
  busy: {
    label: "Busy Shift",
    minJobs: 5,
    maxJobs: 6,
    seconds: 46,
    advancedChance: 0.15,
    diagnosisBonus: 6,
    diagnosisPenalty: 7,
    repairPenalty: 5,
    satisfactionPenalty: 8,
    payMultiplier: 1.1,
    timeBonusCap: 14
  },
  rush: {
    label: "Rush Shift",
    minJobs: 6,
    maxJobs: 7,
    seconds: 39,
    advancedChance: 0.35,
    diagnosisBonus: 5,
    diagnosisPenalty: 8,
    repairPenalty: 6,
    satisfactionPenalty: 10,
    payMultiplier: 1.25,
    timeBonusCap: 16
  },
  overtime: {
    label: "Overtime Shift",
    minJobs: 4,
    maxJobs: 6,
    seconds: 36,
    advancedChance: 0.75,
    diagnosisBonus: 4,
    diagnosisPenalty: 9,
    repairPenalty: 7,
    satisfactionPenalty: 11,
    payMultiplier: 1.75,
    timeBonusCap: 18
  }
};

const state = {
  week: [],
  dayIndex: 0,
  modeKey: "steady",
  dayStartEarnings: 0,
  dayResults: [],
  weekLog: [],
  jobs: [],
  jobIndex: 0,
  phase: "diagnosis",
  stageIndex: 0,
  earnings: 0,
  streak: 0,
  bestStreak: 0,
  satisfaction: 100,
  answered: false,
  correctAnswers: 0,
  resolvedAnswers: 0,
  timeRemaining: 0,
  ticketMistakes: 0,
  ticketExpired: false,
  log: [],
  powerups: { time: 0, hint: 0, shield: 0, double: 0 },
  doublePayActive: false
};

let timerId = null;

const el = {
  jobNumber: document.getElementById("jobNumber"),
  jobTotal: document.getElementById("jobTotal"),
  earnings: document.getElementById("earnings"),
  streak: document.getElementById("streak"),
  timer: document.getElementById("timer"),
  satisfactionText: document.getElementById("satisfactionText"),
  satisfactionBar: document.getElementById("satisfactionBar"),
  dayLabel: document.getElementById("dayLabel"),
  modeLabel: document.getElementById("modeLabel"),
  rewardLabel: document.getElementById("rewardLabel"),
  ticketId: document.getElementById("ticketId"),
  ticketType: document.getElementById("ticketType"),
  ticketSymptom: document.getElementById("ticketSymptom"),
  instruction: document.getElementById("instruction"),
  ticketDescription: document.getElementById("ticketDescription"),
  priority: document.getElementById("priority"),
  stationLabel: document.getElementById("stationLabel"),
  stagePrompt: document.getElementById("stagePrompt"),
  stageBadge: document.getElementById("stageBadge"),
  hintText: document.getElementById("hintText"),
  options: document.getElementById("options"),
  powerupButtons: [...document.querySelectorAll("[data-powerup]")],
  powerupNotice: document.getElementById("powerupNotice"),
  feedback: document.getElementById("feedback"),
  feedbackIcon: document.getElementById("feedbackIcon"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),
  continueBtn: document.getElementById("continueBtn"),
  startScreen: document.getElementById("startScreen"),
  shiftComplete: document.getElementById("shiftComplete"),
  finalSummary: document.getElementById("finalSummary"),
  finalEarnings: document.getElementById("finalEarnings"),
  finalAccuracy: document.getElementById("finalAccuracy"),
  finalSatisfaction: document.getElementById("finalSatisfaction"),
  bestStreak: document.getElementById("bestStreak"),
  topicBreakdown: document.getElementById("topicBreakdown"),
  missedCount: document.getElementById("missedCount"),
  missedList: document.getElementById("missedList"),
  review: document.getElementById("missedReview"),
  restartBtn: document.getElementById("restartBtn"),
  startWeekBtn: document.getElementById("startWeekBtn"),
  stations: [...document.querySelectorAll(".station")],
  ticketPanel: document.querySelector(".ticket-panel"),
  console: document.querySelector(".console")
};

function mode() {
  const scheduled = state.week[state.dayIndex];
  if (scheduled) return scheduled;

  return {
    day: WEEK_DAYS[0],
    typeKey: "steady",
    jobs: 4,
    ...SHIFT_TYPES.steady
  };
}

function currentJob() {
  return state.jobs[state.jobIndex];
}

function currentStage() {
  return currentJob().stages[state.stageIndex];
}

function topicLabel(key) {
  return TOPICS.find(topic => topic.key === key)?.label ?? key;
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateWeekSchedule() {
  // Every week contains a mix of calm and difficult shifts, but the order is
  // hidden from the player. The sixth day is an extra steady/busy/rush draw.
  const extraType = shuffle(["steady", "busy", "rush"])[0];
  const typeBag = shuffle(["slow", "steady", "busy", "rush", "overtime", extraType]);

  return WEEK_DAYS.map((day, index) => {
    const typeKey = typeBag[index];
    const type = SHIFT_TYPES[typeKey];

    return {
      day,
      typeKey,
      ...type,
      jobs: randomInt(type.minJobs, type.maxJobs)
    };
  });
}

function buildJobsForShift(shift) {
  const mainJobs = shuffle(JOBS.filter(job => job.tier === "main"));
  const advancedJobs = shuffle(JOBS.filter(job => job.tier === "overtime"));
  const advancedCount = Math.min(
    advancedJobs.length,
    Math.round(shift.jobs * shift.advancedChance)
  );
  const mainCount = Math.min(mainJobs.length, shift.jobs - advancedCount);

  const selected = [
    ...advancedJobs.slice(0, advancedCount),
    ...mainJobs.slice(0, mainCount)
  ];

  if (selected.length < shift.jobs) {
    const used = new Set(selected.map(job => job.id));
    const leftovers = shuffle(JOBS.filter(job => !used.has(job.id)));
    selected.push(...leftovers.slice(0, shift.jobs - selected.length));
  }

  return shuffle(selected).slice(0, shift.jobs);
}

function money(value) {
  return "$" + Math.max(0, Math.round(value));
}

function potentialPay(job = currentJob()) {
  if (!job) return 0;
  return Math.round(job.pay * mode().payMultiplier);
}

function animate(node, className) {
  node.classList.remove(className);
  void node.offsetWidth;
  node.classList.add(className);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function updateTimerDisplay() {
  const text = state.timeRemaining + "s";
  el.timer.textContent = text;
  el.timer.classList.toggle("warning", state.timeRemaining <= 15 && state.timeRemaining > 7);
  el.timer.classList.toggle("danger", state.timeRemaining <= 7);
}

// Resumes the ticket clock without resetting it. The clock only runs while a
// question is waiting for an answer; it is paused while feedback is shown.
function runTimer() {
  stopTimer();

  timerId = setInterval(() => {
    state.timeRemaining -= 1;
    updateTimerDisplay();

    if (state.timeRemaining <= 0) {
      state.timeRemaining = 0;
      state.ticketExpired = true;
      stopTimer();
      handleTicketExpired();
    }
  }, 1000);
}

// Resets the clock for a brand-new ticket and starts it.
function startTicketTimer() {
  state.timeRemaining = mode().seconds;
  updateTimerDisplay();
  runTimer();
}

function isShiftActive() {
  return el.startScreen.hidden && el.shiftComplete.hidden;
}

// Records one answered (or timed-out) question for the end-of-shift review.
function logAnswer({ prompt, chosen, answer, explanation, correct }) {
  const entry = {
    topic: currentJob().topic,
    jobId: currentJob().id,
    prompt,
    chosen,
    answer,
    explanation,
    correct
  };
  state.log.push(entry);
  state.weekLog.push(entry);
}

const POWERUP_MILESTONES = { 2: "time", 3: "hint", 4: "shield", 5: "double" };
const POWERUP_NAMES = { time: "Time Boost", hint: "50/50 Hint", shield: "Repair Shield", double: "Double Pay" };

function updatePowerups() {
  const canUse = isShiftActive() && !state.answered && !state.ticketExpired && state.phase !== "payout";
  el.powerupButtons.forEach(button => {
    const kind = button.dataset.powerup;
    button.querySelector(".powerup-count").textContent = "×" + state.powerups[kind];
    button.disabled = kind === "shield" || !canUse || state.powerups[kind] === 0 ||
      (kind === "double" && state.doublePayActive) ||
      (kind === "hint" && el.options.querySelectorAll(".choice:not(:disabled)").length <= 2);
    button.classList.toggle("armed", kind === "double" && state.doublePayActive);
  });
}

function announcePowerup(message) {
  el.powerupNotice.textContent = message;
}

function earnStreakReward() {
  const kind = POWERUP_MILESTONES[state.streak];
  if (!kind) return "";
  state.powerups[kind] += 1;
  announcePowerup("Unlocked: " + POWERUP_NAMES[kind] + "! Click it when you need it.");
  updatePowerups();
  return " Power-up earned: " + POWERUP_NAMES[kind] + "!";
}

function usePowerup(kind) {
  if (!isShiftActive() || state.answered || state.ticketExpired || state.phase === "payout" || !state.powerups[kind]) return;
  if (kind === "double" && state.doublePayActive) return;
  if (kind === "hint") {
    const wrong = [...el.options.querySelectorAll('.choice:not(:disabled)')].filter(button => button.dataset.correct === "false");
    if (wrong.length < 2) return;
    wrong.slice(0, 2).forEach(button => { button.disabled = true; button.classList.add("eliminated"); });
  } else if (kind === "time") {
    state.timeRemaining += 10;
    updateTimerDisplay();
  } else if (kind === "double") {
    state.doublePayActive = true;
  } else if (kind === "shield") {
    // Shield is consumed automatically on the next incorrect answer.
    announcePowerup("Shield ready! It will block your next wrong-answer penalty.");
    return;
  }
  state.powerups[kind] -= 1;
  announcePowerup(kind === "time" ? "+10 seconds added!" : kind === "hint" ? "Two wrong answers eliminated." : "Double Pay armed for this ticket!");
  updatePowerups();
}

function absorbMistake() {
  if (!state.powerups.shield) return false;
  state.powerups.shield -= 1;
  announcePowerup("Repair Shield absorbed the penalty!");
  return true;
}

function handleTicketExpired() {
  if (state.answered) return;

  const job = currentJob();
  if (state.phase === "diagnosis") {
    logAnswer({
      prompt: "Diagnose: " + job.symptom,
      chosen: "(ran out of time)",
      answer: topicLabel(job.topic),
      explanation: job.instruction,
      correct: false
    });
  } else {
    const stage = currentStage();
    logAnswer({
      prompt: stage.prompt,
      chosen: "(ran out of time)",
      answer: stage.choices[stage.correct],
      explanation: stage.explanation,
      correct: false
    });
  }

  state.answered = true;
  state.resolvedAnswers += 1;
  state.ticketMistakes += 2;
  state.streak = 0;
  state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty * 2);

  [...el.options.querySelectorAll(".choice")].forEach(button => {
    button.disabled = true;
  });

  el.feedback.hidden = false;
  el.feedback.classList.add("bad");
  el.feedbackIcon.textContent = "!";
  el.feedbackTitle.textContent = "Ticket clock expired";
  el.feedbackText.textContent = "This repair missed its deadline, so this ticket earns no pay. Move on and recover on the next job.";
  state.doublePayActive = false;
  el.continueBtn.hidden = false;
  el.continueBtn.textContent = "Close failed ticket";
  updateHud();
}

function updateHud() {
  el.jobNumber.textContent = Math.min(state.jobIndex + 1, mode().jobs);
  el.jobTotal.textContent = mode().jobs;
  el.earnings.textContent = money(state.earnings);
  el.streak.textContent = state.streak;
  el.satisfactionText.textContent = state.satisfaction + "%";
  el.satisfactionBar.style.width = state.satisfaction + "%";
  if (el.dayLabel) el.dayLabel.textContent = mode().day;
  if (el.modeLabel) el.modeLabel.textContent = mode().label;
  el.rewardLabel.textContent = money(potentialPay());
  updatePowerups();
}

function renderTicket() {
  const job = currentJob();

  el.ticketId.textContent = job.id;
  el.ticketType.textContent = state.phase === "diagnosis"
    ? "UNDIAGNOSED"
    : topicLabel(job.topic).toUpperCase();
  el.ticketSymptom.textContent = job.symptom;
  el.instruction.textContent = state.phase === "diagnosis" ? "Hidden until diagnosis" : job.instruction;
  el.ticketDescription.textContent = state.phase === "diagnosis"
    ? "Use the customer's symptoms to identify the Computer Organization topic before opening the repair procedure."
    : job.description;
  el.priority.textContent = job.priority;
  el.rewardLabel.textContent = money(potentialPay(job));
  animate(el.ticketPanel, "bump");
}

function setStationContent(station, marker, title, subtitle) {
  station.querySelector("b").textContent = marker;
  station.querySelector("strong").textContent = title;
  station.querySelector("small").textContent = subtitle;
}

function renderPipeline() {
  const job = currentJob();
  const activeIndex = state.phase === "diagnosis" ? 0 : state.stageIndex + 1;

  el.stations.forEach((station, index) => {
    if (index === 0) {
      setStationContent(station, "1", "Diagnose", "Identify the topic");
    } else {
      const stage = job.stages[index - 1];
      setStationContent(station, String(index + 1), stage.name, stage.short);
    }

    station.classList.toggle("active", index === activeIndex);
    station.classList.toggle("complete", index < activeIndex);
  });
}

function clearRoundUi() {
  state.answered = false;
  el.feedback.hidden = true;
  el.feedback.classList.remove("bad");
  el.continueBtn.hidden = true;
  el.options.innerHTML = "";
  updatePowerups();
}

function addChoice(text, isCorrect, onChoose) {
  const button = document.createElement("button");
  button.className = "choice";
  button.type = "button";
  button.textContent = text;
  button.dataset.correct = String(isCorrect);
  button.addEventListener("click", () => onChoose({ text, isCorrect }, button));
  el.options.appendChild(button);
}

function renderDiagnosis() {
  state.phase = "diagnosis";
  clearRoundUi();
  renderTicket();
  renderPipeline();

  const job = currentJob();
  const correctTopic = TOPICS.find(topic => topic.key === job.topic);
  const availableTopics = TOPICS.filter(topic => topic.tier === job.tier && topic.key !== job.topic);
  const distractors = shuffle(availableTopics).slice(0, 3);
  const choices = shuffle([correctTopic, ...distractors]);

  el.stationLabel.textContent = "DIAGNOSTIC TERMINAL";
  el.stagePrompt.textContent = "What is actually causing this customer's problem?";
  el.stageBadge.textContent = "Diagnosis";
  el.hintText.textContent = job.tier === "overtime"
    ? "Advanced ticket: diagnose the underlying concept before the tougher repair clock gets away from you."
    : "Read the symptom, not the hidden technical answer. Choose the course topic that best explains the customer's complaint.";

  choices.forEach(topic => {
    addChoice(topic.label, topic.key === job.topic, resolveDiagnosis);
  });

  updatePowerups();
  animate(el.console, "swap");
}

function resolveDiagnosis(option, clicked) {
  if (state.answered || state.ticketExpired) return;

  state.answered = true;
  state.resolvedAnswers += 1;
  stopTimer();

  const correct = option.isCorrect;
  const buttons = [...el.options.querySelectorAll(".choice")];
  const job = currentJob();

  logAnswer({
    prompt: "Diagnose: " + job.symptom,
    chosen: option.text,
    answer: topicLabel(job.topic),
    explanation: job.instruction,
    correct
  });

  buttons.forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("correct");
  });

  if (correct) {
    state.correctAnswers += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.timeRemaining += mode().diagnosisBonus;
    const rewardMessage = earnStreakReward();

    el.feedback.classList.remove("bad");
    el.feedbackIcon.textContent = "✓";
    el.feedbackTitle.textContent = "Diagnosis confirmed";
    el.feedbackText.textContent = "+" + mode().diagnosisBonus + " seconds added. The technician finding and topic-specific repair are now unlocked." + rewardMessage;
  } else {
    clicked.classList.add("wrong");
    const shielded = absorbMistake();
    if (!shielded) {
      state.ticketMistakes += 1;
      state.timeRemaining = Math.max(1, state.timeRemaining - mode().diagnosisPenalty);
      state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty);
    }
    state.streak = 0;

    el.feedback.classList.add("bad");
    el.feedbackIcon.textContent = "!";
    el.feedbackTitle.textContent = "Misdiagnosed";
    el.feedbackText.textContent = "This is a " + topicLabel(currentJob().topic) + " ticket. " + (shielded ? "Shield blocked the penalty!" : "-" + mode().diagnosisPenalty + " seconds from the repair clock.");
  }

  updateTimerDisplay();
  updateHud();
  el.feedback.hidden = false;
  el.continueBtn.hidden = false;
  el.continueBtn.textContent = "Open repair procedure";
}

function renderStage() {
  state.phase = "repair";
  clearRoundUi();
  renderTicket();
  renderPipeline();

  const stage = currentStage();
  const totalStages = currentJob().stages.length;

  el.stationLabel.textContent = stage.name.toUpperCase();
  el.stagePrompt.textContent = stage.prompt;
  el.stageBadge.textContent = "Repair " + (state.stageIndex + 1) + " of " + totalStages;
  el.hintText.textContent = stage.hint || "Choose the action that best repairs or verifies this specific topic. The ticket clock keeps running.";

  const options = shuffle(stage.choices.map((text, index) => ({
    text,
    isCorrect: index === stage.correct
  })));

  options.forEach(option => {
    addChoice(option.text, option.isCorrect, resolveRepairAnswer);
  });

  updatePowerups();
  animate(el.console, "swap");
}

function resolveRepairAnswer(option, clicked) {
  if (state.answered || state.ticketExpired) return;

  state.answered = true;
  state.resolvedAnswers += 1;
  stopTimer();

  const stage = currentStage();
  const buttons = [...el.options.querySelectorAll(".choice")];

  logAnswer({
    prompt: stage.prompt,
    chosen: option.text,
    answer: stage.choices[stage.correct],
    explanation: stage.explanation,
    correct: option.isCorrect
  });

  buttons.forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("correct");
  });

  if (option.isCorrect) {
    state.correctAnswers += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);

    el.feedback.classList.remove("bad");
    el.feedbackIcon.textContent = "✓";
    el.feedbackTitle.textContent = "Repair step correct";
    el.feedbackText.textContent = stage.explanation + earnStreakReward();
  } else {
    clicked.classList.add("wrong");
    const shielded = absorbMistake();
    if (!shielded) {
      state.ticketMistakes += 1;
      state.timeRemaining = Math.max(1, state.timeRemaining - mode().repairPenalty);
      state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty);
    }
    state.streak = 0;

    el.feedback.classList.add("bad");
    el.feedbackIcon.textContent = "!";
    el.feedbackTitle.textContent = "Repair error";
    el.feedbackText.textContent = "The highlighted action is correct. " + stage.explanation + (shielded ? " Shield blocked the penalty!" : " -" + mode().repairPenalty + " seconds.");
  }

  updateTimerDisplay();
  updateHud();
  el.feedback.hidden = false;
  el.continueBtn.hidden = false;
  el.continueBtn.textContent = continueLabel();
}

function continueLabel() {
  if (state.phase === "diagnosis") return "Open repair procedure";

  const nextStage = currentJob().stages[state.stageIndex + 1];
  if (nextStage) return "Move to " + nextStage.name;

  return "Close ticket & collect pay";
}

function completeTicket() {
  stopTimer();

  const job = currentJob();
  const basePay = potentialPay(job);
  const accuracyMultiplier = Math.max(0.35, 1 - state.ticketMistakes * 0.18);
  const timeBonus = Math.min(mode().timeBonusCap, Math.floor(state.timeRemaining / 5));
  const payout = Math.max(5, Math.round(basePay * accuracyMultiplier + timeBonus)) * (state.doublePayActive ? 2 : 1);
  const doubled = state.doublePayActive;
  state.doublePayActive = false;

  state.earnings += payout;
  state.phase = "payout";
  state.answered = true;

  el.feedback.hidden = false;
  el.feedback.classList.remove("bad");
  el.feedbackIcon.textContent = "$";
  el.feedbackTitle.textContent = "Ticket paid " + money(payout);
  el.feedbackText.textContent = state.ticketMistakes === 0
    ? "Clean repair. Full shift-rate pay plus a speed bonus."
    : "The ticket was completed, but mistakes reduced the final payout.";
  if (doubled) el.feedbackText.textContent += " Double Pay applied (2×)!";

  el.continueBtn.hidden = false;
  el.continueBtn.textContent = state.jobIndex < mode().jobs - 1 ? "Take next ticket" : "Clock out";
  updateHud();
}

function moveToNextTicketOrFinish() {
  if (state.jobIndex < mode().jobs - 1) {
    state.jobIndex += 1;
    state.stageIndex = 0;
    state.phase = "diagnosis";
    state.ticketMistakes = 0;
    state.ticketExpired = false;
    state.doublePayActive = false;
    startTicketTimer();
    renderDiagnosis();
    updateHud();
    return;
  }

  finishShift();
}

function advance() {
  if (!state.answered) return;

  if (state.ticketExpired || state.phase === "payout") {
    moveToNextTicketOrFinish();
    return;
  }

  if (state.phase === "diagnosis") {
    state.stageIndex = 0;
    renderStage();
    runTimer();
    return;
  }

  if (state.stageIndex < currentJob().stages.length - 1) {
    state.stageIndex += 1;
    renderStage();
    runTimer();
    return;
  }

  completeTicket();
}

function finishShift() {
  stopTimer();

  const accuracy = state.resolvedAnswers
    ? Math.round((state.correctAnswers / state.resolvedAnswers) * 100)
    : 0;
  const dayEarnings = state.earnings - state.dayStartEarnings;
  const weekFinished = state.dayIndex >= WEEK_DAYS.length - 1;

  state.dayResults.push({
    day: mode().day,
    shift: mode().label,
    earnings: dayEarnings,
    accuracy,
    satisfaction: state.satisfaction
  });

  if (weekFinished) {
    const weeklyCorrect = state.weekLog.filter(entry => entry.correct).length;
    const weeklyAccuracy = state.weekLog.length
      ? Math.round((weeklyCorrect / state.weekLog.length) * 100)
      : 0;
    const averageSatisfaction = state.dayResults.length
      ? Math.round(state.dayResults.reduce((sum, result) => sum + result.satisfaction, 0) / state.dayResults.length)
      : 100;

    el.finalEarnings.textContent = money(state.earnings);
    el.finalAccuracy.textContent = weeklyAccuracy + "%";
    el.finalSatisfaction.textContent = averageSatisfaction + "%";
    el.bestStreak.textContent = state.bestStreak;
    el.finalSummary.textContent =
      "Work week complete. You survived six randomized shifts and finished with " +
      money(state.earnings) + " in total earnings.";
    renderReview(state.weekLog);
    el.restartBtn.textContent = "Start a new week";
  } else {
    el.finalEarnings.textContent = money(state.earnings);
    el.finalAccuracy.textContent = accuracy + "%";
    el.finalSatisfaction.textContent = state.satisfaction + "%";
    el.bestStreak.textContent = state.bestStreak;
    el.finalSummary.textContent =
      mode().day + " complete — " + mode().label + ". You earned " +
      money(dayEarnings) + " today. Weekly total: " + money(state.earnings) + ".";
    renderReview(state.log);
    el.restartBtn.textContent = "Continue to " + WEEK_DAYS[state.dayIndex + 1];
  }

  el.shiftComplete.hidden = false;
}

// End-of-shift review: score per topic (weakest first) plus every missed
// question with the correct answer and explanation.
function renderReview(entries = state.log) {
  const byTopic = {};
  for (const entry of entries) {
    const tally = (byTopic[entry.topic] ??= { right: 0, total: 0 });
    tally.total += 1;
    if (entry.correct) tally.right += 1;
  }

  el.topicBreakdown.replaceChildren(
    ...Object.entries(byTopic)
      .sort(([, a], [, b]) => a.right / a.total - b.right / b.total)
      .map(([key, tally]) => {
        const item = document.createElement("li");
        const label = document.createElement("span");
        const score = document.createElement("strong");
        label.textContent = topicLabel(key);
        score.textContent = tally.right + "/" + tally.total;
        item.append(label, score);
        if (tally.right < tally.total) item.classList.add("weak");
        return item;
      })
  );

  const missed = entries.filter(entry => !entry.correct);
  el.missedCount.textContent = missed.length;
  el.review.hidden = missed.length === 0;
  el.review.open = false;

  el.missedList.replaceChildren(
    ...missed.map(entry => {
      const item = document.createElement("li");
      const question = document.createElement("strong");
      const answers = document.createElement("p");
      const why = document.createElement("p");
      question.textContent = entry.jobId + " — " + entry.prompt;
      answers.textContent = "You picked: " + entry.chosen + " • Correct: " + entry.answer;
      why.textContent = entry.explanation;
      item.append(question, answers, why);
      return item;
    })
  );
}

function startDay() {
  stopTimer();

  const shift = mode();
  state.modeKey = shift.typeKey;
  state.jobs = buildJobsForShift(shift);
  state.jobIndex = 0;
  state.phase = "diagnosis";
  state.stageIndex = 0;
  state.dayStartEarnings = state.earnings;
  state.streak = 0;
  state.satisfaction = 100;
  state.answered = false;
  state.correctAnswers = 0;
  state.resolvedAnswers = 0;
  state.ticketMistakes = 0;
  state.ticketExpired = false;
  state.log = [];
  state.doublePayActive = false;

  el.startScreen.hidden = true;
  el.shiftComplete.hidden = true;
  announcePowerup(
    shift.day + ": " + shift.label + " — " + shift.jobs +
    " tickets scheduled. Future shifts stay hidden until you clock in."
  );
  startTicketTimer();
  renderDiagnosis();
  updateHud();
}

function startNewWeek() {
  stopTimer();

  state.week = generateWeekSchedule();
  state.dayIndex = 0;
  state.modeKey = state.week[0].typeKey;
  state.earnings = 0;
  state.bestStreak = 0;
  state.dayResults = [];
  state.weekLog = [];
  state.powerups = { time: 0, hint: 0, shield: 0, double: 0 };
  state.doublePayActive = false;

  startDay();
}

function advanceWeek() {
  if (state.dayIndex >= WEEK_DAYS.length - 1) {
    startNewWeek();
    return;
  }

  state.dayIndex += 1;
  startDay();
}

el.continueBtn.addEventListener("click", advance);
el.powerupButtons.forEach(button => button.addEventListener("click", () => usePowerup(button.dataset.powerup)));

// Pause the ticket clock while the tab is hidden; resume only if a question
// is still waiting for an answer.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopTimer();
  } else if (isShiftActive() && !state.answered && !state.ticketExpired && state.phase !== "payout") {
    runTimer();
  }
});

el.restartBtn.addEventListener("click", advanceWeek);
el.startWeekBtn?.addEventListener("click", startNewWeek);
state.jobs = [JOBS.find(job => job.tier === "main")];
state.timeRemaining = mode().seconds;
updateHud();
updateTimerDisplay();
renderPipeline();
