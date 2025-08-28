// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyBt6sfCYmc3wsQ-EoCZnQUe87Lnvm3YVbk",
  authDomain: "amptest-258fd.firebaseapp.com",
  databaseURL: "https://amptest-258fd-default-rtdb.firebaseio.com",
  projectId: "amptest-258fd",
  storageBucket: "amptest-258fd.appspot.com",
  messagingSenderId: "207766817109",
  appId: "1:207766817109:web:fcf9275cb39e994130c7dc",
  measurementId: "G-V6TGFDQ4K8"
};

// Initialize Firebase
if (!window.firebase?.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ✅ Questions array
const allQuestions = [
  {
    q: "1. Arrange the given fractions in ascending order 9/17, 7/23, 11/21 and 13/19",
    options: [
      "13/19, 9/17, 7/23, 11/21",
      "9/17, 11/21, 7/23, 13/19",
      "7/23, 11/21, 9/17, 13/19",
      "11/21, 9/17, 7/23, 13/19",
      "None of these"
    ],
    answer: "7/23, 11/21, 9/17, 13/19"
  },
  {
    q: "2.3^0.6×81×91.3×270.2=3?",
    options: [
      "7.8",
      "3.9",
      "4.5",
      "5.4",
      "None of these"
    ],
    answer: "3.9"
  },
  {
    q: "3. The difference between two numbers is 3 and the difference between their squares is 63. What is the larger number?",
    options: [
      "12",
      "9",
      "15",
      "Cannot be determined",
      "None of these"
    ],
    answer: "12"
  },
  {
    q: "4. What is the smallest digit which should replace * in the number 296*12 to make it divisible by 12?",
    options: [
      "1",
      "2",
      "3",
      "4",
      "None of these"
    ],
    answer: "2"
  },
  {
    q: "5. A, B, C, D and E are five consecutive odd numbers. The sum of A and C is 146. What is the value of E?",
    options: [
      "75",
      "81",
      "71",
      "79",
      "None of these"
    ],
    answer: "79"
  },
  {
    q: "6. What is the largest number that can exactly divide 52, 65 and 165?",
    options: [
      "11",
      "13",
      "14",
      "12",
      "none of these"
    ],
    answer: "13"
  },
  {
    q: "7. If the HCF of two numbers is 11 and their LCM is 7700. If one of these numbers is 275, then what is the other number?",
    options: [
      "279",
      "283",
      "308",
      "318",
      "None of these"
    ],
    answer: "308"
  },
  {
    q: "8. Find the smallest number which gives a remainder 5, when divided by any of the numbers 8, 12 and 15?",
    options: [
      "120",
      "240",
      "125",
      "65",
      "101"
    ],
    answer: "125"
  },
  {
    q: "9. What will be the greatest number that divides 68, 59 and 43 leaving the remainder 8, 9 and 3 respectively?",
    options: [
      "8",
      "10",
      "24",
      "35",
      "None of these"
    ],
    answer: "10"
  },
  {
    q: "10. Find the greatest number of 4 digits, which is exactly divisible by 8,12,18,15 and 20.",
    options: [
      "9840",
      "9720",
      "9280",
      "9630",
      "none of these"
    ],
    answer: "9720"
  },
  {
    q: "11. The distance between two stations A and B is 778 km. A train covers the journey from A to B at 84 km per hour and returns back to A with a uniform speed of 56 km per hour. Find the average speed of train during the whole journey.",
    options: [
      "60.3 km/hr",
      "35.0 km/hr",
      "57.5 km/hr",
      "57.5 km/hr"
    ],
    answer: "67.2 km/hr"
  },
  {
    q: "12. The mean weight of a group of seven boys is 56 kg. The individual weights (in kg) of six of them are 52, 57, 55, 60, 59 and 55. Find the weight of the seventh boy.",
    options: [
      "64",
      "54",
      "88",
      "28"
    ],
    answer: "64"
  },
  {
    q: "13. The following observations are 8, 11, 12, x+6, 17, 18, 23. The median of the data is 15 find the value of x.",
    options: [
      "9",
      "7",
      "8",
      "6"
    ],
    answer: "9"
  },
  {
    q: "14. Class A has 15 students with mean marks of 60, and Class B has 12 students with mean marks of 48. Calculate the combined mean.",
    options: [
      "54.8",
      "54",
      "55.2",
      "56"
    ],
    answer: "54.8"
  },
  {
    q: "15. If the mean and mode of some data are 4 & 10 respectively its median will be",
    options: [
      "8",
      "6",
      "7",
      "9"
    ],
    answer: "6"
  },
  {
    q: "16. Sonali invests 15% of her monthly salary in insurance policies. She spends 55% of her monthly salary in shopping and on household expenses. She saves the remaining amount of ₹12750. What is Sonali’s monthly income?",
    options: [
      "42,500",
      "38,800",
      "40,000",
      "35,500",
      "None of these"
    ],
    answer: "42,500"
  },
  {
    q: "17. The price of a car is ₹325000. It was insured to 85% of its price. The car was damaged completely in an accident and the insurance company paid 90% of the insurance. What was the difference between the price of the car and the amount received?",
    options: [
      "32,500",
      "48,750",
      "76,375",
      "81,250",
      "None of these"
    ],
    answer: "76,375"
  },
  {
    q: "18. In a college election between two students, 10% of the votes cast are invalid. The winner gets 70% of the valid votes and defeats the loser by 1800 votes. How many votes were totally cast?",
    options: [
      "1800",
      "7200",
      "5000",
      "3600",
      "None of these"
    ],
    answer: "7200"
  },
  {
    q: "19. The sale of Company N is 40% less than that of Company T. Then by what per cent is the sale of company T more than that of N?",
    options: [
      "66%",
      "20%",
      "40%",
      "10%",
      "None of these"
    ],
    answer: "66%"
  },
  {
    q: "20. When the cost of petroleum increases by 40%, a man reduces his annual consumption by 20%. Find the percentage change in his annual expenditure on petroleum.",
    options: [
      "20%",
      "16%",
      "12%",
      "40%",
      "None of these"
    ],
    answer: "12%"
  },
  {
    q: "21. A certain amount is to be distributed among Samiksha, Purva and Neha in the proportion of 5:3:4. If the difference between Purva's and Samiksha's share is 1200. How much did Neha get?",
    options: [
      "2400",
      "1600",
      "2200",
      "Cannot be determined",
      "None of these"
    ],
    answer: "1600"
  },
  {
    q: "22. A sum of money is divided among A, B, C and D in the ratio 5:8:9:11. If the share of B is ₹2475 more than the share of A then what is the total amount of money of A & C together?",
    options: [
      "9900",
      "11550",
      "10725",
      "9075",
      "None of these"
    ],
    answer: "10725"
  },
  {
    q: "23. A, B and C divide an amount of ₹4000 amongst themselves in the ratio of 2:5:1 respectively. If an amount of 800 is added to each of their shares, what will be the new ratio of their shares of the amount?",
    options: [
      "18:33:13",
      "6:7:4",
      "7:8:9",
      "3:6:2",
      "None of these"
    ],
    answer: "6:7:4"
  },
  {
    q: "24. If 1/4th area of a rectangular plot is 2700 sq m and the width of that plot is 90 m, what is the ratio between the width and the length of the plot?",
    options: [
      "3:4",
      "4:3",
      "3:1",
      "1:3",
      "None of these"
    ],
    answer: "3:4"
  },
  {
    q: "25. There are 2304 workers in company A and 2816 in company B. What is the ratio of workers in company A to that of B?",
    options: [
      "7:13",
      "13:7",
      "9:11",
      "11:9",
      "None of these"
    ],
    answer: "9:11"
  }
];


// Global variables
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 25 * 60; // Changed from 30 * 60 to 25 * 60 (25 minutes)
let timer;
let cheatingDetected = false;
let testCompleted = false;

// DOM elements
const questionText = document.getElementById("questionBox");
const optionsContainer = document.getElementById("optionsBox");
const timerText = document.getElementById("timer");
const scoreBox = document.getElementById("scoreBox");
const nextBtn = document.getElementById("nextBtn");
const studentIdText = document.getElementById("studentId");

/// <reference path="https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js" />
/// <reference path="https://www.gstatic.com/firebasejs/9.1.2/firebase-database.js" />


// Navigation functions
function goToLogin() {
  document.getElementById("welcomePage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
  document.getElementById("adminLoginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.add("hidden");
  document.getElementById("adminPanel").classList.add("hidden");
}

function login() {
  const rollNumber = document.getElementById("rollNumber").value.trim();
  const password = document.getElementById("password").value.trim();
  const loginError = document.getElementById("loginError");

  if (rollNumber === "" || password === "") {
    loginError.textContent = "Please enter both Roll Number and Password.";
    return;
  }

  // Check if roll number already exists in Firebase
  db.ref("studentResults")
    .orderByChild("rollNumber")
    .equalTo(rollNumber)
    .once("value", (snapshot) => {
      if (snapshot.exists()) {
        loginError.textContent = "This roll number has already taken the test.";
        return;
      } else {
        loginError.textContent = "";

        document.getElementById("loginPage").classList.add("hidden");
        document.getElementById("quizPage").classList.remove("hidden");

        studentIdText.textContent = `Roll Number: ${rollNumber}`;

        currentQuestionIndex = 0;
        score = 0;
        timeLeft = 25 * 60; // Changed from 30 * 60 to 25 * 60 (25 minutes)
        testCompleted = false;
        cheatingDetected = false;
        nextBtn.style.display = "none";
        timerText.style.display = "block";

        showQuestion();
        startTimer();

        document.documentElement.requestFullscreen().catch(() => {});
      }
    });
}

function showQuestion() {
  const currentQuestion = allQuestions[currentQuestionIndex];
  questionText.textContent = currentQuestion.q;
  optionsContainer.innerHTML = "";

  currentQuestion.options.forEach((option) => {
    const optionElem = document.createElement("div");
    optionElem.className = "option";
    optionElem.textContent = option;
    optionElem.onclick = () => selectOption(optionElem, option);
    optionsContainer.appendChild(optionElem);
  });

  // Remove selection and enable all options for new question
  nextBtn.style.display = "none";
}

let selectedOptionValue = null;

function selectOption(optionElem, selectedOption) {
  if (testCompleted) return;

  // Remove previous selection
  const allOptionElems = optionsContainer.querySelectorAll(".option");
  allOptionElems.forEach((elem) => {
    elem.classList.remove("selected");
  });

  // Mark current as selected
  optionElem.classList.add("selected");
  selectedOptionValue = selectedOption;
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  // Score only if selectedOptionValue is correct
  const currentQuestion = allQuestions[currentQuestionIndex];
  if (selectedOptionValue === currentQuestion.answer) {
    score++;
  }

  // Disable further selection for this question
  const allOptionElems = optionsContainer.querySelectorAll(".option");
  allOptionElems.forEach((elem) => {
    elem.onclick = null;
    elem.style.pointerEvents = "none";
  });

  // Prepare for next question
  currentQuestionIndex++;
  selectedOptionValue = null;
  if (currentQuestionIndex >= allQuestions.length) {
    endTest();
  } else {
    showQuestion();
  }
}

function startTimer() {
  timerText.textContent = `Time Left: ${formatTime(timeLeft)}`;
  timer = setInterval(() => {
    timeLeft--;
    timerText.textContent = `Time Left: ${formatTime(timeLeft)}`;
    if (timeLeft <= 0) {
      clearInterval(timer);
      endTest();
    }
  }, 1000);
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Cheating detection
document.addEventListener("visibilitychange", () => {
  if (document.hidden && !testCompleted) {
    cheatingDetected = true;
    alert("Test ended due to switching tabs or background apps!");
    endTest();
  }
});

document.addEventListener("keydown", (e) => {
  if (
    !testCompleted &&
    (e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J")) ||
      (e.ctrlKey && (e.key === "U" || e.key === "S")))
  ) {
    cheatingDetected = true;
    alert("Test ended due to forbidden keyboard action!");
    e.preventDefault();
    endTest();
  }
});

document.addEventListener("contextmenu", (e) => {
  if (!testCompleted) {
    e.preventDefault();
    alert("Right-click is disabled during the test.");
  }
});

document.addEventListener("fullscreenchange", () => {
  if (
    !document.fullscreenElement &&
    !testCompleted &&
    document.getElementById("quizPage") &&
    !document.getElementById("quizPage").classList.contains("hidden")
  ) {
    cheatingDetected = true;
    alert("Test ended because you exited fullscreen mode!");
    endTest();
  }
});

// ✅ Store student result in Firebase
function storeStudentResult(rollNumber, score) {
  const resultRef = db.ref("studentResults").push();
  resultRef.set({
    rollNumber: rollNumber,
    score: score,
    timestamp: new Date().toISOString()
  });
}

function endTest() {
  testCompleted = true;
  clearInterval(timer);

  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  const rollNumber = studentIdText.textContent.replace("Roll Number: ", "").trim();
  storeStudentResult(rollNumber, score);

  scoreBox.innerHTML =
    `<div style="font-weight:bold;margin-bottom:8px;">Roll Number: ${rollNumber}</div>` +
    (cheatingDetected
      ? `Test ended due to cheating or switching apps. Your score is ${score} out of ${allQuestions.length}.`
      : `Your score is ${score} out of ${allQuestions.length}.`);

  timerText.style.display = "none";
  nextBtn.style.display = "none";

  if (document.fullscreenElement) {
    document.getElementById("resultPage").requestFullscreen().catch(() => {});
  }
}

// Admin login and result view
function showAdminLogin() {
  // Show the admin login page styled like student login
  document.getElementById("welcomePage").classList.add("hidden");
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("adminLoginPage").classList.remove("hidden");
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.add("hidden");
  document.getElementById("adminPanel").classList.add("hidden");
}

function adminLogin() {
  const user = document.getElementById("adminUser").value.trim();
  const pass = document.getElementById("adminPass").value.trim();
  const err = document.getElementById("adminLoginError");

  if (user === "admin" && pass === "admin12345") {
    document.getElementById("adminLoginPage").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    showAllResults();
    err.textContent = "";
  } else {
    err.textContent = "Invalid admin credentials";
  }
}

function showAllResults() {
  const table = document.getElementById("adminResultsTable");
  table.innerHTML = `<tr><th>Roll Number</th><th>Score</th><th>Submitted At</th></tr>`;
  db.ref("studentResults").once("value", (snapshot) => {
    const results = snapshot.val() || {};
    Object.values(results)
      .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
      .forEach((r) => {
        table.innerHTML += `<tr>
          <td>${r.rollNumber}</td>
          <td>${r.score}</td>
          <td>${r.timestamp || "-"}</td>
        </tr>`;
      });
  });
}

function adminLogout() {
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("welcomePage").classList.remove("hidden");
}

// ✅ Expose functions globally
window.goToLogin = goToLogin;
window.login = login;
window.nextQuestion = nextQuestion;
window.showAdminLogin = showAdminLogin;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
