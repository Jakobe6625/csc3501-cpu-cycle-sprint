import { JOBS } from "./jobs.js";

const JOBS_PER_SHIFT = 5;
const POINTS_PER_CORRECT_STAGE = 100;
const SATISFACTION_PENALTY = 8;

const state = {jobs:[],jobIndex:0,stageIndex:0,score:0,streak:0,bestStreak:0,satisfaction:100,answered:false};

const el = {
  jobNumber:document.getElementById("jobNumber"), jobTotal:document.getElementById("jobTotal"),
  score:document.getElementById("score"), streak:document.getElementById("streak"),
  satisfactionText:document.getElementById("satisfactionText"), satisfactionBar:document.getElementById("satisfactionBar"),
  ticketId:document.getElementById("ticketId"), ticketType:document.getElementById("ticketType"),
  instruction:document.getElementById("instruction"), ticketDescription:document.getElementById("ticketDescription"),
  priority:document.getElementById("priority"), stationLabel:document.getElementById("stationLabel"),
  stagePrompt:document.getElementById("stagePrompt"), stageBadge:document.getElementById("stageBadge"),
  options:document.getElementById("options"), feedback:document.getElementById("feedback"),
  feedbackIcon:document.getElementById("feedbackIcon"), feedbackTitle:document.getElementById("feedbackTitle"),
  feedbackText:document.getElementById("feedbackText"), continueBtn:document.getElementById("continueBtn"),
  shiftComplete:document.getElementById("shiftComplete"), finalSummary:document.getElementById("finalSummary"),
  finalScore:document.getElementById("finalScore"), finalSatisfaction:document.getElementById("finalSatisfaction"),
  bestStreak:document.getElementById("bestStreak"), restartBtn:document.getElementById("restartBtn"),
  stations:[...document.querySelectorAll(".station")]
};

function shuffle(items){const copy=[...items];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function currentJob(){return state.jobs[state.jobIndex];}
function currentStage(){return currentJob().stages[state.stageIndex];}

function updateHud(){
  el.jobNumber.textContent=Math.min(state.jobIndex+1,JOBS_PER_SHIFT);
  el.jobTotal.textContent=JOBS_PER_SHIFT;
  el.score.textContent=state.score;
  el.streak.textContent=state.streak;
  el.satisfactionText.textContent=state.satisfaction+"%";
  el.satisfactionBar.style.width=state.satisfaction+"%";
}

function renderTicket(){
  const job=currentJob();
  el.ticketId.textContent=job.id; el.ticketType.textContent=job.type; el.instruction.textContent=job.instruction;
  el.ticketDescription.textContent=job.description; el.priority.textContent=job.priority;
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

  stage.choices.forEach((choice,index)=>{
    const button=document.createElement("button");
    button.className="choice"; button.type="button"; button.textContent=choice;
    button.addEventListener("click",()=>choose(index,button));
    el.options.appendChild(button);
  });
  renderPipeline();
}

function choose(choiceIndex,clicked){
  if(state.answered)return;
  state.answered=true;
  const stage=currentStage();
  const buttons=[...el.options.querySelectorAll(".choice")];
  const correct=choiceIndex===stage.correct;

  buttons.forEach((button,index)=>{
    button.disabled=true;
    if(index===stage.correct)button.classList.add("correct");
  });

  if(correct){
    state.score+=POINTS_PER_CORRECT_STAGE; state.streak+=1; state.bestStreak=Math.max(state.bestStreak,state.streak);
    el.feedback.classList.remove("bad"); el.feedbackIcon.textContent="✓"; el.feedbackTitle.textContent="Correct station work"; el.feedbackText.textContent=stage.explanation;
  }else{
    clicked.classList.add("wrong"); state.streak=0; state.satisfaction=Math.max(0,state.satisfaction-SATISFACTION_PENALTY);
    el.feedback.classList.add("bad"); el.feedbackIcon.textContent="!"; el.feedbackTitle.textContent="Shop error caught";
    el.feedbackText.textContent="The highlighted action is correct. "+stage.explanation;
  }

  el.feedback.hidden=false; el.continueBtn.hidden=false; el.continueBtn.textContent=continueLabel(); updateHud();
}

function continueLabel(){
  if(state.stageIndex===0)return "Move to Decode Desk";
  if(state.stageIndex===1)return "Move to Execute Bay";
  if(state.jobIndex<JOBS_PER_SHIFT-1)return "Complete ticket & take next job";
  return "Close out the shift";
}

function advance(){
  if(!state.answered)return;
  if(state.stageIndex<2){state.stageIndex+=1;renderStage();return;}
  if(state.jobIndex<JOBS_PER_SHIFT-1){state.jobIndex+=1;state.stageIndex=0;renderJob();return;}
  finishShift();
}

function renderJob(){renderTicket();renderStage();updateHud();}

function finishShift(){
  const max=JOBS_PER_SHIFT*3*POINTS_PER_CORRECT_STAGE;
  const percent=Math.round((state.score/max)*100);
  el.finalScore.textContent=state.score+" / "+max; el.finalSatisfaction.textContent=state.satisfaction+"%"; el.bestStreak.textContent=state.bestStreak;
  el.finalSummary.textContent=percent>=90
    ?"Excellent shift. You consistently recognized what the processor should do during Fetch, Decode, and Execute."
    :percent>=70
      ?"Solid shift. You understand the CPU cycle, with a few station decisions worth reviewing."
      :"Training shift complete. Use the shop manual and try again to strengthen how each instruction moves through the CPU cycle.";
  el.shiftComplete.hidden=false;
}

function startShift(){
  state.jobs=shuffle(JOBS).slice(0,JOBS_PER_SHIFT); state.jobIndex=0; state.stageIndex=0; state.score=0; state.streak=0;
  state.bestStreak=0; state.satisfaction=100; state.answered=false; el.shiftComplete.hidden=true; renderJob();
}

el.continueBtn.addEventListener("click",advance);
el.restartBtn.addEventListener("click",startShift);
startShift();