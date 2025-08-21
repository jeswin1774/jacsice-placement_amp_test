let questions = [
  {
    q: "What is 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: "4"
  },
  {
    q: "Capital of India?",
    options: ["Mumbai", "Chennai", "Delhi", "Kolkata"],
    answer: "Delhi"
  },
  {
    q: "Which is a programming language?",
    options: ["HTML", "CSS", "JavaScript", "Photoshop"],
    answer: "JavaScript"
  }
];

let currentUser = {};
let timePerQuestion = 5 * 60; // 5 minutes = 300 seconds
let totalTime = questions.length * timePerQuestion;
let timerInterval;

// Start Test
function startTest() {
  let roll = document.getElementById("rollNumber").value.trim();
  let name = document.getElementById("studentName").value.trim();

  if (!roll || !name) {
    alert("Please enter Roll Number and Name");
    return;
  }

  currentUser = { roll, name, score: 0 };

  document.getElementById("loginPanel").classList.add("hidden");
  document.getElementById("testPanel").classList.remove("hidden");

  loadQuestions();
  startTimer();
  detectCheating();
}

// Load Questions
function loadQuestions() {
  let container = document.getElementById("questionContainer");
  container.innerHTML = "";

  questions.forEach((q, index) => {
    let div = document.createElement("div");
    div.classList.add("questionBlock");

    div.innerHTML = `
      <p class="question">${index + 1}. ${q.q}</p>
      <div class="options">
        ${q.options.map(opt => `
          <label class="option">
            <input type="radio" name="q${index}" value="${opt}"> ${opt}
          </label>
        `).join("")}
      </div>
    `;
    container.appendChild(div);
  });
}

// Timer
function startTimer() {
  let timerDisplay = document.getElementById("timer");
  let startTime = new Date();

  timerInterval = setInterval(() => {
    totalTime--;
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    timerDisplay.textContent = `Time Left: ${minutes}m ${seconds}s`;

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      submitTest();
    }
  }, 1000);

  currentUser.startTime = startTime;
}

// Submit Test
function submitTest(reason = "Completed") {
  clearInterval(timerInterval);

  let score = 0;
  questions.forEach((q, index) => {
    let answer = document.querySelector(`input[name="q${index}"]:checked`);
    if (answer && answer.value === q.answer) score++;
  });

  currentUser.score = score;
  currentUser.endTime = new Date();

  document.getElementById("testPanel").classList.add("hidden");
  document.getElementById("resultPanel").classList.remove("hidden");

  document.getElementById("resultRoll").textContent = currentUser.roll;
  document.getElementById("resultName").textContent = currentUser.name;
  document.getElementById("resultScore").textContent = `${score} / ${questions.length}`;
  document.getElementById("resultTime").textContent = 
    reason === "Cheating" ? "Disqualified (Cheating)" : currentUser.endTime.toLocaleTimeString();
}

// Detect Cheating
function detectCheating() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      alert("You are cheating! Test Ended.");
      submitTest("Cheating");
    }
  });

  window.addEventListener("blur", () => {
    alert("You switched apps! Test Ended.");
    submitTest("Cheating");
  });
}

