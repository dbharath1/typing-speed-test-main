const passageEl=document.getElementById("passage");
const inputEl=document.getElementById("input");
const startBtn=document.getElementById("startBtn");
const restartBtn=document.getElementById("restartBtn");

const wpmEl=document.getElementById("wpm");
const accEl=document.getElementById("accuracy");
const timeEl=document.getElementById("time");
const bestText=document.getElementById("bestText");

const startOverlay=document.getElementById("startOverlay");
const resultOverlay=document.getElementById("resultOverlay");

let passages,startTime=null,timer=null,timeLeft=60;

// load passages
fetch("data.json").then(r=>r.json()).then(d=>passages=d);

// get random
function random(level){
const arr=passages[level];
return arr[Math.floor(Math.random()*arr.length)].text;
}

// show spans
function display(text){
passageEl.innerHTML="";
text.split("").forEach(c=>{
const span=document.createElement("span");
span.textContent=c;
passageEl.appendChild(span);
});
}

// start
function startTest(){

resultOverlay.classList.add("hidden");
startOverlay.classList.add("hidden");

const level=document.getElementById("difficulty").value;
const mode=document.getElementById("mode").value;

display(random(level));

inputEl.value="";
inputEl.focus();

startTime=null;
clearInterval(timer);

if(mode==="timed"){
timeLeft=60;
timeEl.textContent=60;

timer=setInterval(()=>{
if(startTime){
timeLeft--;
timeEl.textContent=timeLeft;
if(timeLeft<=0)finishTest();
}
},1000);

}else{

timer=setInterval(()=>{
if(startTime){
const sec=Math.floor((Date.now()-startTime)/1000);
timeEl.textContent=sec;
}
},1000);

}

}

startBtn.onclick=startTest;
restartBtn.onclick=startTest;

inputEl.addEventListener("input",()=>{

if(!startTime)startTime=Date.now();

const typed=inputEl.value.split("");
const spans=passageEl.querySelectorAll("span");

let correct=0;

spans.forEach((span,i)=>{
if(typed[i]==null){
span.classList.remove("correct","wrong");
}
else if(typed[i]===span.textContent){
span.classList.add("correct");
span.classList.remove("wrong");
correct++;
}
else{
span.classList.add("wrong");
span.classList.remove("correct");
}
});

const total=typed.length;
const acc=total?Math.round(correct/total*100):100;
accEl.textContent=acc;

const seconds=(Date.now()-startTime)/1000;
const wpm=Math.round((correct/5)/(seconds/60)||0);
wpmEl.textContent=wpm;

if(total===spans.length)finishTest();

});

// finish
function finishTest(){

clearInterval(timer);

const wpm=parseInt(wpmEl.textContent);
const acc=parseInt(accEl.textContent);
const chars=inputEl.value.length;
const total=passageEl.textContent.length;

document.getElementById("finalWpm").textContent=wpm;
document.getElementById("finalAcc").textContent=acc+"%";
document.getElementById("finalChars").textContent=chars+"/"+total;

let best=localStorage.getItem("bestWPM");

const icon=document.getElementById("resultIcon");
const title=document.getElementById("resultTitle");
const msg=document.getElementById("resultMsg");

if(!best){
title.textContent="Baseline Established!";
msg.textContent="You've set the bar. Now beat it!";
icon.innerHTML='<img src="assets/images/icon-completed.svg">';
localStorage.setItem("bestWPM",wpm);
}

else if(wpm>best){
title.textContent="High Score Smashed!";
msg.textContent="You're getting faster. Incredible!";
icon.innerHTML='<img src="assets/images/icon-new-pb.svg">';
localStorage.setItem("bestWPM",wpm);
}

else{
title.textContent="Test Complete!";
msg.textContent="Solid run. Keep pushing.";
icon.innerHTML='<img src="assets/images/icon-completed.svg">';
}

bestText.textContent="Personal best: "+localStorage.getItem("bestWPM")+" WPM";

resultOverlay.classList.remove("hidden");
}

window.onload=()=>{
const best=localStorage.getItem("bestWPM")||0;
bestText.textContent="Personal best: "+best+" WPM";
};