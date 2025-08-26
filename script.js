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
if (!window.firebase?.apps?.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// ✅ Questions array
const allQuestions = [
  {
    q: "Question 1. A seller allows a discount of 5% on a watch. If he allows a discount of 7%, he earns ₹15 less in the profit. What is the marked price?",
    options: ["₹ 697.50", "₹ 712.50", "₹ 750", "₹ 800"],
    answer: "₹ 750"
  },
  {
    q: "Question 2. Jatin bought a refrigerator with 20% discount on the labelled price. He had to pay ₹8000. At what price did he buy the refrigerator?",
    options: ["₹ 10000", "₹ 12000", "₹ 15000", "₹ 8000"],
    answer: "₹ 10000"
  },
  {
    q: "Question 3. A sells a scooter priced at ₹36000. He gives a discount of 8% on the first ₹20000 and 5% on the next ₹10000. How much discount can he afford on the remaining ₹6000 if he is to make an overall profit of 8%?",
    options: ["₹ 12250", "₹ 12500", "₹ 12800", "₹ 13500"],
    answer: "₹ 12500"
  },
  {
    q: "Question 4. A tradesman gives 4% di2scount on the marked price and gives 1 article free for buying every 15 articles and thus gains 35%. The marked price is above the cost price by:",
    options: ["20%", "39%", "40%", "50%"],
    answer: "50%"
  },
  {
    q: "Question 5. A trader marked the selling price of an article at 10% above the cost price. At the time of selling, he allows certain discount and suffers a loss of 1%. He allowed a discount of:",
    options: ["9%", "10%", "10.5%", "11%"],
    answer: "10%"
     },

  {
    q: "Question 6. A man marked price of a watch 20% above its cost price. He then allowed a discount of 10%. Find his gain percent?",
    options: ["8%", "10%", "12%", "15%"],
    answer: "8%"
  },
  {
    q: "Question 7. Three successive discounts of 10%, 12% and 15% amount to a single discount of:",
    options: ["33.68%", "32.68%", "36.68%", "38.25%"],
    answer: "33.68%"
  },
  {
    q: "Question 8. A discount series of p%, q% and r% is same as a single discount of:",
    options: ["100 - [p + q + r - (pq/100) - (qr/100) - (rp/100) + (pqr/10000)] %", "p + q + r %", "p - q - r %", "None of these"],
    answer: "100 - [p + q + r - (pq/100) - (qr/100) - (rp/100) + (pqr/10000)] %"
  },
  {
    q: "Question 9. Three successive discounts of 20% on the marked price of a commodity amount to a net discount of:",
    options: ["48%", "49%", "50%", "50.2%"],
    answer: "50.2%"
  },
  {
    q: "Question 10. An article is listed at ₹900 and two successive discounts of 8% and 8% are given on it. How much would the seller gain or lose, if he gives a single discount of 16% instead of two discounts?",
    options: ["Gain of ₹4.76", "Loss of ₹4.76", "Gain of ₹5.76", "Loss of ₹5.76"],
    answer: "Loss of ₹5.76"
  },
  {
    q: "Question 11. Two shopkeepers announce the same price of ₹700 for a sewing machine. The first offers successive discounts of 30% and 6% while the second offers successive discounts of 20% and 16%. The shopkeeper that offers better discount, charges ______ less than the other shopkeeper.",
    options: ["₹9.80", "₹16.80", "₹22.40", "₹36.40"],
    answer: "₹16.80"
  },
  {
    q: "Question 12. A company offers three types of successive discounts (i) 25% and 15%; (ii) 30% and 10%; (iii) 35% and 5%. Which offer is the best for a customer?",
    options: ["First offer", "Second offer", "Third offer", "Any one; all are equally good"],
    answer: "Second offer"
  },
  {
    q: "Question 13. On a ₹1000 payment order, a person has choice between 3 successive discounts of 10%, 10% and 30%, and 3 successive discounts of 40%, 5% and 5%. By choosing the better one he can save (in rupees):",
    options: ["200", "255", "400", "433"],
    answer: "255"
  },
  {
    q: "Question 14. A shopkeeper gives 3 consecutive discounts of 10%, 15% and 15% after which he sells his goods at a percentage profit of 30.05 percent on the cost price. Find the value of the percentage profit that the shopkeeper would have earned if he had given discounts of 10% and 15% only.",
    options: ["53%", "62.5%", "68.6%", "72.5%"],
    answer: "62.5%"
  },
  {
    q: "Question 15. A shopkeeper gives two successive discounts on an article marked ₹450. The first discount is 10%. If the customer pays ₹344.25 for the article, the second discount given is:",
    options: ["10%", "12%", "14%", "15%"],
    answer: "15%"
  },
  {
    q: "Question 16. The marked price of a watch was ₹820. A man bought the same for ₹707.20 after getting two successive discounts of which the first was 20%. The rate of the second discount is:",
    options: ["10%", "12%", "15%", "18%"],
    answer: "12%"
  },
  {
    q: "Question 17. A shopkeeper purchased 150 identical pieces of calculator at the rate of ₹250 each. He spent an amount of ₹2500 on transport and packing. He fixed the labelled price of each calculator at ₹320. However, he decided to give a discount of 5% on the labelled price. What is the percentage profit earned by him?",
    options: ["12%", "14%", "15%", "16%"],
    answer: "15%"
  },
  {
    q: "Question 18. A person first increases the price of a commodity by 10% and then announces a discount of 15% on that. The actual discount on the original price is:",
    options: ["5%", "6.5%", "7.5%", "12.5%"],
    answer: "6.5%"
  },
  {
    q: "Question 19. Raman bought a camera and paid 20% less than its original price. He sold it at 40% profit on the price he had paid. The percentage of profit earned by Raman on the original price was:",
    options: ["12", "15", "22", "32"],
    answer: "12"
  },
  {
    q: "Question 20. A trader marked the price of a product in such a way that it is 20% more than the cost price. If he allows 10% discount on the marked price to the customer then his gain is:",
    options: ["8%", "10%", "15%", "20%"],
    answer: "8%"
  },
  {
    q: "Question 21. A trader marked the price of his commodity so as to include a profit of 25%. He allowed discount of 16% on the marked price. His actual profit was:",
    options: ["5%", "9%", "16%", "25%"],
    answer: "9%"
  },
  {
    q: "Question 22. A tradesman marks his goods 30% above the C.P. If he allows a discount of 6 1/4 %, then his gain percent is:",
    options: ["21 7/20 %", "22%", "23 3/4 %", "None of these"],
    answer: "22%"
  },
  {
    q: "Question 23. A shopkeeper earns a profit of 12% on selling a book at 10% discount on the printed price. The ratio of the cost price and the printed price of the book is:",
    options: ["45 : 56", "45 : 61", "50 : 61", "50 : 65"],
    answer: "45 : 56"
  },
  {
    q: "Question 24. The price of an article is raised by 30% and then two successive discounts of 10% each are allowed. Ultimately, the price of the article is:",
    options: ["Decreased by 5.3%", "Increased by 3%", "Increased by 5.3%", "Increased by 10%"],
    answer: "Increased by 3%"
  },
  {
    q: "Question 25. A retailer buys 30 articles from a wholesaler at the price of 27. If he sells them at their marked price, the gain percent in the transaction is:",
    options: ["9 1/11 %", "10%", "11 1/9 %", "16 2/3 %"],
    answer: "11 1/9 %"
  },
  {
    q: "Question 26. By selling an article at 2/5 of the marked price, there is a loss of 25%. The ratio of the marked price and the cost price of the article is:",
    options: ["2 : 5", "5 : 2", "8 : 15", "15 : 8"],
    answer: "8 : 15"
  },
  {
    q: "Question 27. A shopkeeper fixes the marked price of an item 35% above its cost price. The percentage of discount allowed to gain 8% is:",
    options: ["20%", "25%", "31%", "43%"],
    answer: "25%"
  },
  {
    q: "Question 28. A retailer allows a trade discount of 20% and a cash discount of 5% on the cost price. If he sells his goods at the marked price, one of the discounts must be adjusted. What is his total gain percent?",
    options: ["20%", "22%", "24%", "25%"],
    answer: "25%"
  },
  {
    q: "Question 29. Mohan sold an article for ₹1500. Had he offered a discount of 10% on the selling price he would have earned a profit of 8%. What is the cost price?",
    options: ["₹ 1225", "₹ 1250", "₹ 1280", "₹ 1350"],
    answer: "₹ 1250"
  },
  {
  q: "Question 30. A train 150 meters long passes a pole in 15 seconds. What is the speed of the train in km/h?",
  options: ["30 km/h", "36 km/h", "54 km/h", "60 km/h"],
  answer: "36 km/h"
  },

];

let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 30 * 60;
let timer;
let cheatingDetected = false;
let testCompleted = false;

const questionText = document.getElementById("questionBox");
const optionsContainer = document.getElementById("optionsBox");
const timerText = document.getElementById("timer");
const scoreBox = document.getElementById("scoreBox");
const nextBtn = document.getElementById("nextBtn");
const studentIdText = document.getElementById("studentId");

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
  loginError.textContent = "";

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");

  studentIdText.textContent = `Roll Number: ${rollNumber}`;

  currentQuestionIndex = 0;
  score = 0;
  timeLeft = 30 * 60;
  testCompleted = false;
  cheatingDetected = false;
  nextBtn.style.display = "none";
  timerText.style.display = "block";

  showQuestion();
  startTimer();

  document.documentElement.requestFullscreen().catch(() => {});
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
}

function selectOption(optionElem, selectedOption) {
  if (testCompleted) return;

  const currentQuestion = allQuestions[currentQuestionIndex];

  if (selectedOption === currentQuestion.answer) {
    score++;
  }

  // Remove previous selection and disable all options
  const allOptionElems = optionsContainer.querySelectorAll(".option");
  allOptionElems.forEach((elem) => {
    elem.classList.remove("selected");
    elem.onclick = null;
    elem.style.pointerEvents = "none";
    elem.style.backgroundColor = "";
    elem.style.color = "";
  });

  optionElem.classList.add("selected");
  nextBtn.style.display = "inline-block";
}

function nextQuestion() {
  currentQuestionIndex++;
  if (currentQuestionIndex >= allQuestions.length) {
    endTest();
  } else {
    showQuestion();
    nextBtn.style.display = "none";
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

// Cheating detection handlers
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
  if (!document.fullscreenElement && !testCompleted && document.getElementById("quizPage") && !document.getElementById("quizPage").classList.contains("hidden")) {
    cheatingDetected = true;
    alert("Test ended because you exited fullscreen mode!");
    endTest();
  }
});

// Store student result in Firebase
function storeStudentResult(rollNumber, score) {
  db.ref("studentResults/" + rollNumber).set({ rollNumber, score });
}

function endTest() {
  testCompleted = true;
  clearInterval(timer);

  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");

  const rollNumber = studentIdText.textContent.replace("Roll Number: ", "").trim();
  storeStudentResult(rollNumber, score);

  scoreBox.innerHTML = `<div style="font-weight:bold;margin-bottom:8px;">Roll Number: ${rollNumber}</div>` +
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
  if (user === "admin" && pass === "admin123") {
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
  table.innerHTML = `<tr><th>Roll Number</th><th>Score</th></tr>`;
  db.ref("studentResults").once("value", snapshot => {
    const results = snapshot.val() || {};
    Object.values(results)
      .sort((a, b) => a.rollNumber.localeCompare(b.rollNumber))
      .forEach(r => {
        table.innerHTML += `<tr><td>${r.rollNumber}</td><td>${r.score}</td></tr>`;
      });
  });
}

function adminLogout() {
  document.getElementById("adminPanel").classList.add("hidden");
  document.getElementById("welcomePage").classList.remove("hidden");
}

// Expose only the correct functions globally
window.goToLogin = goToLogin;
window.login = login;
window.nextQuestion = nextQuestion;
window.showAdminLogin = showAdminLogin;
window.adminLogin = adminLogin;
window.adminLogout = adminLogout;
