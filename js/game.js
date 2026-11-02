let current = 0;
let score = 0;
let answered = false;

const scoreEl = document.getElementById("score");
const roundEl = document.getElementById("round");
const totalEl = document.getElementById("total");
const promptEl = document.getElementById("prompt");
const feedbackEl = document.getElementById("feedback");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const stageButtons = [...document.querySelectorAll(".stage")];

totalEl.textContent = questions.length;

function renderQuestion() {
  answered = false;
  const q = questions[current];
  roundEl.textContent = current + 1;
  promptEl.textContent = q.text;
  feedbackEl.textContent = "";
  nextBtn.hidden = true;
  stageButtons.forEach(btn => btn.disabled = false);
}

function chooseStage(stage) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const correct = stage === q.answer;

  if (correct) {
    score++;
    scoreEl.textContent = score;
    feedbackEl.textContent = `Correct — ${q.explanation}`;
  } else {
    feedbackEl.textContent = `Not quite. The correct stage is ${q.answer}. ${q.explanation}`;
  }

  stageButtons.forEach(btn => btn.disabled = true);

  if (current < questions.length - 1) {
    nextBtn.hidden = false;
  } else {
    promptEl.textContent = `Finished! You scored ${score}/${questions.length}.`;
    restartBtn.hidden = false;
  }
}

stageButtons.forEach(button => {
  button.addEventListener("click", () => chooseStage(button.dataset.stage));
});

nextBtn.addEventListener("click", () => {
  current++;
  renderQuestion();
});

restartBtn.addEventListener("click", () => {
  current = 0;
  score = 0;
  scoreEl.textContent = score;
  restartBtn.hidden = true;
  renderQuestion();
});

renderQuestion();
