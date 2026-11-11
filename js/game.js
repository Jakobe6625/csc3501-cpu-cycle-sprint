import { JOBS, TOPICS } from "./jobs.js";

const MODES = {
  training: {
    label: "Training Shift",
    pool: "main",
    jobs: 5,
    seconds: 55,
    diagnosisBonus: 8,
    diagnosisPenalty: 6,
    repairPenalty: 4,
    satisfactionPenalty: 6,
    payMultiplier: 1,
    timeBonusCap: 12
  },
  rush: {
    label: "Rush Hour",
    pool: "main",
    jobs: 7,
    seconds: 38,
    diagnosisBonus: 5,
    diagnosisPenalty: 8,
    repairPenalty: 6,
    satisfactionPenalty: 10,
    payMultiplier: 1.15,
    timeBonusCap: 16
  },
  overtime: {
    label: "Overtime",
    pool: "overtime",
    jobs: 5,
    seconds: 36,
    diagnosisBonus: 4,
    diagnosisPenalty: 9,
    repairPenalty: 7,
    satisfactionPenalty: 11,
    payMultiplier: 1.75,
    timeBonusCap: 18
  }
};

const state = {
  modeKey: "training",
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
  ticketExpired: false
};

let timerId = null;

const el = {
  jobNumber: document.getElementById("jobNumber"),
  jobTotal: document.getElementById("jobTotal"),
  earnings: document.getElementById("earnings"),
  streak: document.getElementById("streak"),
  timer: document.getElementById("timer"),
  clockMirror: document.getElementById("clockMirror"),
  satisfactionText: document.getElementById("satisfactionText"),
  satisfactionBar: document.getElementById("satisfactionBar"),
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
  restartBtn: document.getElementById("restartBtn"),
  changeModeBtn: document.getElementById("changeModeBtn"),
  changeModeTop: document.getElementById("changeModeTop"),
  stations: [...document.querySelectorAll(".station")],
  ticketPanel: document.querySelector(".ticket-panel"),
  console: document.querySelector(".console"),
  modeButtons: [...document.querySelectorAll(".mode-option")]
};

function mode() {
  return MODES[state.modeKey];
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
  el.clockMirror.textContent = text;

  [el.timer, el.clockMirror].forEach(node => {
    node.classList.toggle("warning", state.timeRemaining <= 15 && state.timeRemaining > 7);
    node.classList.toggle("danger", state.timeRemaining <= 7);
  });
}

function startTicketTimer() {
  stopTimer();
  state.timeRemaining = mode().seconds;
  updateTimerDisplay();

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

function handleTicketExpired() {
  if (state.answered) return;

  state.answered = true;
  state.ticketMistakes += 2;
  state.streak = 0;
  state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty * 2);

  [...el.options.querySelectorAll(".choice")].forEach(button => {
    button.disabled = true;
  });

  el.feedback.hidden = false;
  el.feedback.classList.add("bad");
  el.feedbackIcon.textContent = "⏱";
  el.feedbackTitle.textContent = "Ticket clock expired";
  el.feedbackText.textContent = "This repair missed its deadline, so this ticket earns no pay. Move on and recover on the next job.";
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
  el.modeLabel.textContent = mode().label;
  el.rewardLabel.textContent = money(potentialPay());
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
      setStationContent(station, "?", "Diagnose", "Identify the topic");
    } else {
      const stage = job.stages[index - 1];
      const marker = stage.name.charAt(0).toUpperCase();
      setStationContent(station, marker, stage.name, stage.short);
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
  const availableTopics = TOPICS.filter(topic => topic.tier === mode().pool && topic.key !== job.topic);
  const distractors = shuffle(availableTopics).slice(0, 3);
  const choices = shuffle([correctTopic, ...distractors]);

  el.stationLabel.textContent = "DIAGNOSTIC TERMINAL";
  el.stagePrompt.textContent = "What is actually causing this customer's problem?";
  el.stageBadge.textContent = "Diagnosis";
  el.hintText.textContent = state.modeKey === "overtime"
    ? "Overtime tickets use the advanced topic pool. Diagnose the underlying concept before the premium repair clock gets away from you."
    : "Read the symptom, not the hidden technical answer. Choose the course topic that best explains the customer's complaint.";

  choices.forEach(topic => {
    addChoice(topic.label, topic.key === job.topic, resolveDiagnosis);
  });

  animate(el.console, "swap");
}

function resolveDiagnosis(option, clicked) {
  if (state.answered || state.ticketExpired) return;

  state.answered = true;
  state.resolvedAnswers += 1;

  const correct = option.isCorrect;
  const buttons = [...el.options.querySelectorAll(".choice")];

  buttons.forEach(button => {
    button.disabled = true;
    if (button.dataset.correct === "true") button.classList.add("correct");
  });

  if (correct) {
    state.correctAnswers += 1;
    state.streak += 1;
    state.bestStreak = Math.max(state.bestStreak, state.streak);
    state.timeRemaining += mode().diagnosisBonus;

    el.feedback.classList.remove("bad");
    el.feedbackIcon.textContent = "✓";
    el.feedbackTitle.textContent = "Diagnosis confirmed";
    el.feedbackText.textContent = "+" + mode().diagnosisBonus + " seconds added. The technician finding and topic-specific repair are now unlocked.";
  } else {
    clicked.classList.add("wrong");
    state.ticketMistakes += 1;
    state.streak = 0;
    state.timeRemaining = Math.max(1, state.timeRemaining - mode().diagnosisPenalty);
    state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty);

    el.feedback.classList.add("bad");
    el.feedbackIcon.textContent = "!";
    el.feedbackTitle.textContent = "Misdiagnosed";
    el.feedbackText.textContent = "This is a " + topicLabel(currentJob().topic) + " ticket. -" + mode().diagnosisPenalty + " seconds from the repair clock.";
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

  animate(el.console, "swap");
}

function resolveRepairAnswer(option, clicked) {
  if (state.answered || state.ticketExpired) return;

  state.answered = true;
  state.resolvedAnswers += 1;

  const stage = currentStage();
  const buttons = [...el.options.querySelectorAll(".choice")];

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
    el.feedbackText.textContent = stage.explanation;
  } else {
    clicked.classList.add("wrong");
    state.ticketMistakes += 1;
    state.streak = 0;
    state.timeRemaining = Math.max(1, state.timeRemaining - mode().repairPenalty);
    state.satisfaction = Math.max(0, state.satisfaction - mode().satisfactionPenalty);

    el.feedback.classList.add("bad");
    el.feedbackIcon.textContent = "!";
    el.feedbackTitle.textContent = "Repair error";
    el.feedbackText.textContent = "The highlighted action is correct. " + stage.explanation + " -" + mode().repairPenalty + " seconds.";
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
  const payout = Math.max(5, Math.round(basePay * accuracyMultiplier + timeBonus));

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
    return;
  }

  if (state.stageIndex < currentJob().stages.length - 1) {
    state.stageIndex += 1;
    renderStage();
    return;
  }

  completeTicket();
}

function finishShift() {
  stopTimer();

  const accuracy = state.resolvedAnswers
    ? Math.round((state.correctAnswers / state.resolvedAnswers) * 100)
    : 0;

  el.finalEarnings.textContent = money(state.earnings);
  el.finalAccuracy.textContent = accuracy + "%";
  el.finalSatisfaction.textContent = state.satisfaction + "%";
  el.bestStreak.textContent = state.bestStreak;

  if (state.modeKey === "overtime") {
    el.finalSummary.textContent = accuracy >= 80
      ? "Overtime cleared. You handled the advanced tickets and earned the premium shift rate."
      : "Overtime complete. The premium tickets pay more, but the advanced topics punish weak diagnoses quickly.";
  } else {
    el.finalSummary.textContent = accuracy >= 90
      ? "Excellent shift. You diagnosed the customer's symptoms and completed the topic-specific repairs with very few mistakes."
      : accuracy >= 70
        ? "Solid shift. Your repairs are working; a few diagnosis or repair decisions still need tightening."
        : "Shift complete. Replay the shop and use the technician board to strengthen the topics that cost you time.";
  }

  el.shiftComplete.hidden = false;
}

function startShift(modeKey = state.modeKey) {
  stopTimer();

  state.modeKey = modeKey;

  const pool = JOBS.filter(job => job.tier === mode().pool);
  state.jobs = shuffle(pool).slice(0, mode().jobs);
  state.jobIndex = 0;
  state.phase = "diagnosis";
  state.stageIndex = 0;
  state.earnings = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.satisfaction = 100;
  state.answered = false;
  state.correctAnswers = 0;
  state.resolvedAnswers = 0;
  state.ticketMistakes = 0;
  state.ticketExpired = false;

  el.startScreen.hidden = true;
  el.shiftComplete.hidden = true;
  startTicketTimer();
  renderDiagnosis();
  updateHud();
}

function showModeScreen() {
  stopTimer();
  el.shiftComplete.hidden = true;
  el.startScreen.hidden = false;
}

el.continueBtn.addEventListener("click", advance);
el.restartBtn.addEventListener("click", () => startShift(state.modeKey));
el.changeModeBtn.addEventListener("click", showModeScreen);
el.changeModeTop.addEventListener("click", showModeScreen);
el.modeButtons.forEach(button => {
  button.addEventListener("click", () => startShift(button.dataset.mode));
});

state.jobs = [JOBS.find(job => job.tier === "main")];
state.timeRemaining = mode().seconds;
updateHud();
updateTimerDisplay();
renderPipeline();
