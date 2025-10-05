// Elements
const generateBtn = document.getElementById("generateBtn");
const inputText = document.getElementById("inputText");
const numQuestions = document.getElementById("numQuestions");
const homeMCQs = document.getElementById("homeMCQs");
const quizMCQs = document.getElementById("quizMCQs");
const submitQuiz = document.getElementById("submitQuiz");
const scoreText = document.getElementById("scoreText");
const evaluationText = document.getElementById("evaluationText");
const newMCQs = document.getElementById("newMCQs");
const themeToggle = document.getElementById("themeToggle");

const homePage = document.getElementById("homePage");
const quizPage = document.getElementById("quizPage");
const dashboardPage = document.getElementById("dashboardPage");
const tabBtns = document.querySelectorAll(".tab-btn");

let mcqs = [];
let userAnswers = [];

// Theme toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Tab navigation
tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    homePage.classList.add("hidden");
    quizPage.classList.add("hidden");
    dashboardPage.classList.add("hidden");
    document.getElementById(target).classList.remove("hidden");
  });
});

// Utility functions
function getRandomElement(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function generateMCQs(text,count){
  const sentences=text.split(/[.?!]/).map(s=>s.trim()).filter(s=>s.length>5);
  const words=text.split(/\s+/).filter(w=>w.length>3);
  const arr=[];
  for(let i=0;i<count && sentences.length>0;i++){
    const sentence=sentences.splice(Math.floor(Math.random()*sentences.length),1)[0];
    const sentenceWords=sentence.split(" ");
    const keyword=getRandomElement(sentenceWords.filter(w=>w.length>4));
    const questionText=sentence.replace(keyword,"_____");
    const options=[keyword];
    while(options.length<4){
      const randWord=getRandomElement(words);
      if(!options.includes(randWord)) options.push(randWord);
    }
    options.sort(()=>Math.random()-0.5);
    arr.push({question:questionText,options,answer:keyword});
  }
  return arr;
}

// Generate MCQs
generateBtn.addEventListener("click", ()=>{
  const text=inputText.value;
  const count=parseInt(numQuestions.value);
  if(!text.trim()){ alert("⚠️ Please enter some text!"); return; }
  mcqs=generateMCQs(text,count);
  if(mcqs.length===0){ alert("Not enough text to generate MCQs."); return; }

  // Display MCQs on Home with A/B/C/D
  homeMCQs.innerHTML="";
  const optionLabels = ["A","B","C","D"];
  mcqs.forEach((mcq,index)=>{
    const div=document.createElement("div");
    div.className="p-4 border border-indigo-300 rounded-lg bg-white/50 shadow-md mb-4";
    let optionsHtml="";
    mcq.options.forEach((opt,i)=>{
      optionsHtml+=`<p class="p-1"><strong>${optionLabels[i]}.</strong> ${opt}</p>`;
    });
    div.innerHTML=`
      <p class="font-bold text-indigo-600 mb-2">Q${index+1}. ${mcq.question}</p>
      ${optionsHtml}
      <p class="mt-2 font-bold text-black-600">Answer: ${mcq.answer}</p>
    `;
    homeMCQs.appendChild(div);
  });

  displayQuiz();
  homePage.classList.remove("hidden");
  quizPage.classList.add("hidden");
  dashboardPage.classList.add("hidden");
});

// Display Quiz
function displayQuiz(){
  quizMCQs.innerHTML="";
  const optionLabels=["A","B","C","D"];
  mcqs.forEach((mcq,index)=>{
    const div=document.createElement("div");
    div.className="p-4 border border-indigo-300 rounded-lg fade-in bg-white/50 shadow-md";
    let optionsHtml="";
    mcq.options.forEach((opt,i)=>{
      optionsHtml+=`<label class="block p-2 mcq-option cursor-pointer text-gray-900">
        <input type="radio" name="q${index}" value="${opt}" class="mr-2"> <strong>${optionLabels[i]}.</strong> ${opt}
      </label>`;
    });
    div.innerHTML=`<p class="font-bold text-indigo-600 mb-3">Q${index+1}. ${mcq.question}</p>${optionsHtml}`;
    quizMCQs.appendChild(div);
  });
}

// Submit Quiz
submitQuiz.addEventListener("click",()=>{
  let score=0;
  mcqs.forEach((mcq,index)=>{
    const selected=document.querySelector(`input[name="q${index}"]:checked`);
    if(selected && selected.value===mcq.answer) score++;
  });

  scoreText.textContent=`Your Score: ${score} / ${mcqs.length}`;
  const percentage=(score/mcqs.length)*100;
  if(percentage>=90) evaluationText.textContent="Excellent 👍 No Improvement Needed";
  else if(percentage>=70) evaluationText.textContent="Good 🙂 Minor Improvement Needed";
  else if(percentage>=50) evaluationText.textContent="Average 😐 Improvement Needed";
  else evaluationText.textContent="Poor 👎 Significant Improvement Needed";

  dashboardPage.classList.remove("hidden");
  homePage.classList.add("hidden");
  quizPage.classList.add("hidden");
});

// Generate New MCQs
newMCQs.addEventListener("click",()=>{
  inputText.value="";
  mcqs=[];
  homeMCQs.innerHTML="";
  dashboardPage.classList.add("hidden");
  homePage.classList.remove("hidden");
});
