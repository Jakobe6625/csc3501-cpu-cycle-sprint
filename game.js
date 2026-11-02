const questions = [
  { text: "The CPU reads the next instruction from memory using the program counter.", answer: "Fetch",
    explanation: "Fetch retrieves the next instruction from memory." },
  { text: "The control unit determines which operation the instruction requests.", answer: "Decode",
    explanation: "Decode interprets the instruction's opcode and operands." },
  { text: "The ALU adds two register values.", answer: "Execute",
    explanation: "Execute performs the operation requested by the instruction." },
  { text: "The instruction register receives the instruction that was just read from memory.", answer: "Fetch",
    explanation: "This happens as the CPU brings the instruction into the processor." },
  { text: "The CPU figures out which registers are needed by the instruction.", answer: "Decode",
    explanation: "Decode identifies the instruction's required operands/resources." },
  { text: "The processor compares two values for a conditional branch.", answer: "Execute",
    explanation: "The comparison is the work performed by the instruction." },
  { text: "The program counter identifies the address of the instruction to retrieve.", answer: "Fetch",
    explanation: "The program counter participates in locating the next instruction." },
  { text: "The control unit interprets the binary instruction format.", answer: "Decode",
    explanation: "Decode translates the instruction bits into control decisions." },
  { text: "The CPU performs the requested arithmetic or logical operation.", answer: "Execute",
    explanation: "Execute is where the instruction's actual operation occurs." }
];

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
