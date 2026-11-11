import { JOBS } from "./jobs.js";

const MODES = {
  training: {label:"Training Shift", jobs:5, seconds:null, penalty:8, basePoints:100},
  rush: {label:"Rush Hour", jobs:7, seconds:12, penalty:12, basePoints:125}
};

const state = {
  modeKey:"training", jobs:[], jobIndex:0, stageIndex:0, score:0, streak:0, bestStreak:0,
  satisfaction:100, answered:false, correctAnswers:0, resolvedAnswers:0, timeRemaining:null
};

let timerId=null;

const el = {
  jobNumber:document.getElementById("jobNumber"), jobTotal:document.getElementById("jobTotal"),
  score:document.getElementById("score"), streak:document.getElementById("streak"), timer:document.getElementById("timer"),
  satisfactionText:document.getElementById("satisfactionText"), satisfactionBar:document.getElementById("satisfactionBar"),
  modeLabel:document.getElementById("modeLabel"), rewardLabel:document.getElementById("rewardLabel"),
  ticketId:document.getElementById("ticketId"), ticketType:document.getElementById("ticketType"),
  instruction:document.getElementById("instruction"), ticketDescription:document.getElementById("ticketDescription"),
  priority:document.getElementById("priority"), stationLabel:document.getElementById("stationLabel"),
  stagePrompt:document.getElementById("stagePrompt"), stageBadge:document.getElementById("stageBadge"),
  options:document.getElementById("options"), feedback:document.getElementById("feedback"),
  feedbackIcon:document.getElementById("feedbackIcon"), feedbackTitle:document.getElementById("feedbackTitle"),
  feedbackText:document.getElementById("feedbackText"), continueBtn:document.getElementById("continueBtn"),
  startScreen:document.getElementById("startScreen"), shiftComplete:document.getElementById("shiftComplete"),
  finalSummary:document.getElementById("finalSummary"), finalScore:document.getElementById("finalScore"),
  finalAccuracy:document.getElementById("finalAccuracy"), finalSatisfaction:document.getElementById("finalSatisfaction"),
  bestStreak:document.getElementById("bestStreak"), restartBtn:document.getElementById("restartBtn"),
  changeModeBtn:document.getElementById("changeModeBtn"), changeModeTop:document.getElementById("changeModeTop"),
  stations:[...document.querySelectorAll(".station")], ticketPanel:document.querySelector(".ticket-panel"),
  console:document.querySelector(".console"), modeButtons:[...document.querySelectorAll(".mode-option")]
};

function mode(){return MODES[state.modeKey];}
function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function currentJob(){return state.jobs[state.jobIndex];}
function currentStage(){return currentJob().stages[state.stageIndex];}
function animate(node,className){node.classList.remove(className);void node.offsetWidth;node.classList.add(className);}
function stopTimer(){if(timerId){clearInterval(timerId);timerId=null;}}

function updateTimerDisplay(){
  if(mode().seconds===null){
    el.timer.textContent="—"; el.timer.classList.remove("warning","danger"); return;
  }
  el.timer.textContent=state.timeRemaining+"s";
  el.timer.classList.toggle("warning",state.timeRemaining<=6 && state.timeRemaining>3);
  el.timer.classList.toggle("danger",state.timeRemaining<=3);
}

function startTimer(){
  stopTimer();
  if(mode().seconds===null){state.timeRemaining=null;updateTimerDisplay();return;}
  state.timeRemaining=mode().seconds; updateTimerDisplay();
  timerId=setInterval(()=>{
    state.timeRemaining-=1; updateTimerDisplay();
    if(state.timeRemaining<=0){stopTimer();resolveAnswer(null,null,true);}
  },1000);
}

function updateHud(){
  el.jobNumber.textContent=Math.min(state.jobIndex+1,mode().jobs);
  el.jobTotal.textContent=mode().jobs;
  el.score.textContent=state.score;
  el.streak.textContent=state.streak;
  el.satisfactionText.textContent=state.satisfaction+"%";
  el.satisfactionBar.style.width=state.satisfaction+"%";
  el.modeLabel.textContent=mode().label;
  el.rewardLabel.textContent=mode().basePoints+" pts";
}

function renderTicket(){
  const job=currentJob();
  el.ticketId.textContent=job.id; el.ticketType.textContent=job.type; el.instruction.textContent=job.instruction;
  el.ticketDescription.textContent=job.description; el.priority.textContent=job.priority;
  animate(el.ticketPanel,"bump");
}

function renderPipeline(){
  el.stations.forEach((station,index)=>{
    station.classList.toggle("active",index===state.stageIndex);
    station.classList.toggle("complete",index<state.stageIndex);
  });
}

function renderStage(){
  state.answered=false;
  const stage=currentStage();
  const suffix=stage.name==="Fetch"?" BENCH":stage.name==="Decode"?" DESK":" BAY";
  el.stationLabel.textContent=stage.name.toUpperCase()+suffix;
  el.stagePrompt.textContent=stage.prompt;
  el.stageBadge.textContent="Stage "+(state.stageIndex+1)+" of 3";
  el.feedback.hidden=true; el.feedback.classList.remove("bad"); el.continueBtn.hidden=true; el.options.innerHTML="";

  const options=shuffle(stage.choices.map((text,index)=>({text,isCorrect:index===stage.correct})));
  options.forEach(option=>{
    const button=document.createElement("button");
    button.className="choice"; button.type="button"; button.textContent=option.text;
    button.dataset.correct=String(option.isCorrect);
    button.addEventListener("click",()=>resolveAnswer(option,button,false));
    el.options.appendChild(button);
  });

  renderPipeline(); animate(el.console,"swap"); startTimer();
}

function resolveAnswer(option,clicked,timedOut){
  if(state.answered)return;
  state.answered=true; stopTimer(); state.resolvedAnswers+=1;

  const stage=currentStage();
  const buttons=[...el.options.querySelectorAll(".choice")];
  const correct=!timedOut && option?.isCorrect===true;

  buttons.forEach(button=>{
    button.disabled=true;
    if(button.dataset.correct==="true")button.classList.add("correct");
  });

  if(correct){
    state.correctAnswers+=1; state.streak+=1; state.bestStreak=Math.max(state.bestStreak,state.streak);
    const streakBonus=Math.min((state.streak-1)*10,50);
    const timeBonus=mode().seconds===null?0:Math.max(state.timeRemaining,0)*5;
    const earned=mode().basePoints+streakBonus+timeBonus;
    state.score+=earned;
    el.feedback.classList.remove("bad"); el.feedbackIcon.textContent="✓"; el.feedbackTitle.textContent="Correct station work +"+earned;
    el.feedbackText.textContent=stage.explanation+(timeBonus? " Time bonus: +"+timeBonus+".":"");
  }else{
    if(clicked)clicked.classList.add("wrong");
    state.streak=0; state.satisfaction=Math.max(0,state.satisfaction-mode().penalty);
    el.feedback.classList.add("bad"); el.feedbackIcon.textContent=timedOut?"⏱":"!";
    el.feedbackTitle.textContent=timedOut?"Time ran out":"Shop error caught";
    el.feedbackText.textContent="The highlighted action is correct. "+stage.explanation;
  }

  el.feedback.hidden=false; el.continueBtn.hidden=false; el.continueBtn.textContent=continueLabel(); updateHud();
}

function continueLabel(){
  if(state.stageIndex===0)return "Move to Decode Desk";
  if(state.stageIndex===1)return "Move to Execute Bay";
  if(state.jobIndex<mode().jobs-1)return "Complete ticket & take next job";
  return "Close out the shift";
}

function advance(){
  if(!state.answered)return;
  if(state.stageIndex<2){state.stageIndex+=1;renderStage();return;}
  if(state.jobIndex<mode().jobs-1){state.jobIndex+=1;state.stageIndex=0;renderJob();return;}
  finishShift();
}

function renderJob(){renderTicket();renderStage();updateHud();}

function finishShift(){
  stopTimer();
  const accuracy=state.resolvedAnswers?Math.round((state.correctAnswers/state.resolvedAnswers)*100):0;
  el.finalScore.textContent=state.score;
  el.finalAccuracy.textContent=accuracy+"%";
  el.finalSatisfaction.textContent=state.satisfaction+"%";
  el.bestStreak.textContent=state.bestStreak;
  el.finalSummary.textContent=accuracy>=90
    ?"Excellent shift. You consistently recognized the work performed during Fetch, Decode, and Execute."
    :accuracy>=70
      ?"Solid shift. Your CPU-cycle reasoning is working; review the few station decisions that tripped you up."
      :"Training shift complete. Use the shop manual and replay to strengthen how each instruction moves through the cycle.";
  el.shiftComplete.hidden=false;
}

function startShift(modeKey=state.modeKey){
  stopTimer(); state.modeKey=modeKey; state.jobs=shuffle(JOBS).slice(0,mode().jobs); state.jobIndex=0; state.stageIndex=0;
  state.score=0; state.streak=0; state.bestStreak=0; state.satisfaction=100; state.answered=false;
  state.correctAnswers=0; state.resolvedAnswers=0; state.timeRemaining=mode().seconds;
  el.startScreen.hidden=true; el.shiftComplete.hidden=true; renderJob();
}

function showModeScreen(){
  stopTimer(); el.shiftComplete.hidden=true; el.startScreen.hidden=false;
}

el.continueBtn.addEventListener("click",advance);
el.restartBtn.addEventListener("click",()=>startShift(state.modeKey));
el.changeModeBtn.addEventListener("click",showModeScreen);
el.changeModeTop.addEventListener("click",showModeScreen);
el.modeButtons.forEach(button=>button.addEventListener("click",()=>startShift(button.dataset.mode)));

updateHud(); updateTimerDisplay();