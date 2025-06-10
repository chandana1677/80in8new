const home = document.getElementById("home")
let countdownInterval  //creating two intervels one for 3..2..1..Go other for 8 mins timer
let durationInterval
let qno=1
let score=0
let questionhistory=[]

function Home() {//creating a function to return home after game is done
  home.innerHTML = `
    <h1>80 in 8</h1>
    <h2>(Solve 80 questions in 8 minutes)</h2>
    <div class="start">
      <button id="start-btn">Start Game</button>
    </div>
    <div id="popup">
      <div id="popup-content"></div>
    </div>
  `
  document.getElementById("start-btn").addEventListener("click", Countdown)
}
// Countdown before game starts (3, 2, 1, Go!!!)
function Countdown() {
  let counter = 3
  const popup = document.getElementById("popup")
  const popupContent = document.getElementById("popup-content")
  //adding style
  popup.style.display = "flex"
  popupContent.style.fontSize = "100px"
  popupContent.style.color = "white"
  popupContent.style.fontWeight = "bold"
  
  clearIntervals() // Clearing any existing intervals
  
  countdownInterval = setInterval(function() {
    popupContent.textContent = counter //setting numbers to popup
    
    if (counter > 0) {
      counter--
    } 
    else if(counter===0) {
      clearInterval(countdownInterval)
      popup.style.display = "none"
      startGame()
    }
  }, 1000)
}

// function to start the game
function startGame() {
  qno=1
  score=0
  questionhistory=[]

  const startingMinutes = 8; // Setting game time
  let timeRemaining = startingMinutes * 60;//converting to seconds
  home.innerHTML = `
    <div id="game-screen">
    <div class="header">
      <div id="score">Score: 0</div>
      <div id="duration"></div>
      <button id="play-again"><img height="40px" src="replay.jpg"><div class="info">Re-Start</div></button>
      <button id="back-home"><img  height="40px" src="restart.webp"><div class="info">Back</div></button>
      </div>
      <div id="question"></div>
   
    </div>
  `
  document.getElementById("play-again").addEventListener("click",function(){
    startGame()
    createQuestion()
  })
  document.getElementById("back-home").addEventListener("click", Home)
  const countElement = document.getElementById("duration")
  
  updateDuration() // to avoid 1sec delay
  createQuestion()
  durationInterval = setInterval(updateDuration, 1000);
  
  function updateDuration() {
    const minutes = Math.floor(timeRemaining / 60);
    let seconds = timeRemaining % 60;
    if(seconds<10){
      seconds="0"+seconds //to maintain 2 digits
    }
    countElement.innerHTML = `${minutes}:${seconds}`;
    
    timeRemaining--;
    
    if (timeRemaining <= 0) {//if time is up then questions game is stopped
      clearInterval(durationInterval)
      endGame();
    }
  }
}

function createQuestion(){
  let question=document.getElementById("question")
  let x= Math.random()*1000
  let y= Math.random()*100+1//to avoid division by zero
  let displayX = x;
  let displayY = y;
  const dmas=["/","*","+","-"]
  let randomIndex=Math.floor(Math.random() * dmas.length)
  let randomOperation=dmas[randomIndex]
  let ans=0
  
  if(randomIndex===0){
    ans=Math.floor(x)//ensuring integers for division case
    y=Math.floor(y)
    x=ans*y
    displayY = y;
    displayX = x;
  }
  else if(randomIndex===1){
    x=Math.floor(x)//ensuring integers for multiplication case
    y=Math.floor(y)
    displayX = x;
    displayY = y;
    ans=Math.floor(x*y)
  }
  if(randomIndex===2){
    ans=parseFloat((x+y).toFixed(2))//genearal notation parseFloat("string")
  }
  if(randomIndex===3){
    ans=parseFloat((x-y).toFixed(2))
  }

  let d=Math.floor(Math.random()*4)
  let options=[
    ans,
    parseFloat((ans + Math.random()*5+1).toFixed(2)),
    parseFloat((ans + Math.random()*5+6).toFixed(2)),
    parseFloat((ans -Math.random()-1).toFixed(2))
  ]
  let isCorrect=options[0]
  options[0]=options[d]
  options[d]=isCorrect
  let buttonsHTML = ""
  for (let i = 0; i < options.length; i++) {
    const isCorrect = options[i] === ans
    buttonsHTML += `<button class="option-btn" data-correct="${isCorrect}">${options[i]}</button>`
  }

  question.innerHTML = `
    <p>${qno}. ${displayX.toFixed(2)} ${randomOperation} ${displayY.toFixed(2)} =</p>
    ${buttonsHTML}
  `;

  questionhistory.push({
    number: qno,
    question: `${displayX.toFixed(2)} ${randomOperation} ${displayY.toFixed(2)}`,
    answer: ans,
    userCorrect: null
  })

  document.querySelectorAll(".option-btn").forEach(function(button) {
    button.addEventListener("click", function () {
      const isCorrect=this.getAttribute("data-correct")==="true"
      questionhistory[qno - 1].userCorrect = isCorrect; // record correctness
      score += isCorrect ? 1 : -1;

         document.getElementById("score").textContent = `Score: ${score}`;
      qno++
      if (qno <= 80) {
        createQuestion()
      } else {
        endGame()
      }
    })
  })

}

// Game over screen
function endGame() {
  clearInterval(durationInterval)
  
  home.innerHTML = `
    <h1>Your Test is Over</h1>
    <h3>Your Score:${score}</h3>
    <h3 style="text-decoration:underline; font-weigth:300; font-size:25px;">Test Questions</h3>
    <div id="review"></div>
    <p class="par" style="font-size:24px;">Click below to return to home page</p>
    <div class="start">
      <button id="back-btn">Back</button>
    </div>
  
  `
    const review = document.getElementById("review")
  questionhistory.forEach((entry) => {
    const symbol = entry.userCorrect ? "✅" : "❌"
  
    review.innerHTML += `
     <div class="review-block">
      <div >${symbol} Question #${entry.number}</div>
      <div class="review-question">${entry.question} = </div>
     </div>
      `
  })

  
  document.getElementById("back-btn").addEventListener("click", Home)
}

// Cleanup function
function clearIntervals() {
  if (countdownInterval) clearInterval(countdownInterval);
  if (durationInterval) clearInterval(durationInterval);
}

// Initialize the app
Home()