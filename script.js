// Student roll numbers
const validUsers = [];
for (let i = 1; i <= 60; i++) validUsers.push("23EC" + String(i).padStart(2, "0"));
validUsers.push("23EC301", "23EC302", "23EC701");

// Track logged-in students (prevent re-login)
const usedRolls = new Set();

let currentUser = "";
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 60;
let questions = [];

// Question bank
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

  // FIXED: this object was missing the 'q' field before (which breaks rendering)
  {
    q: "Question ?. (Text missing in source.) Choose the correct option.",
    options: ["10% gain", "25% loss", "40% gain", "6.8% loss"],
    answer: "10% gain"
  },

  {
    q: "Question 4. A tradesman gives 4% discount on the marked price and gives 1 article free for buying every 15 articles and thus gains 35%. The marked price is above the cost price by:",
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
    options: [
      "100 - [p + q + r - (pq/100) - (qr/100) - (rp/100) + (pqr/10000)] %",
      "p + q + r %",
      "p - q - r %",
      "None of these"
    ],
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
  }, // <-- FIXED: comma was missing here

  {
    q: "Question 29. Mohan sold an article for ₹1500. Had he offered a discount of 10% on the selling price he would have earned a profit of 8%. What is the cost price?",
    options: ["₹ 1225", "₹ 1250", "₹ 1280", "₹ 1350"],
    answer: "₹ 1250"
  },
  {
    q: "Question 30. A train 150 meters long passes a pole in 15 seconds. What is the speed of the train in km/h?",
    options: ["30 km/h", "36 km/h", "54 km/h", "60 km/h"],
    answer: "36 km/h"
  }
];

// LOGIN
function login() {
  const roll = document.getElementById("rollNumber").value.trim();
  const pass = document.getElementById("password").value.trim();
  const errorBox = document.getElementById("loginError");

  // Check roll format
  if (!validUsers.includes(roll)) {
    errorBox.textContent = "Invalid Roll Number!";
    return;
  }
  // Password = last TWO characters of roll
  if (roll.slice(-2) !== pass) {
    errorBox.textContent = "Invalid Password! (Tip: last two digits of roll)";
    return;
  }
  if (usedRolls.has(roll)) {
    errorBox.textContent = "This Roll Number has already taken the test!";
    return;
  }

  // Mark roll number as used
  usedRolls.add(roll);
  currentUser = roll;

  // Pick 30 random questions
  questions = allQuestions
    .slice() // don't mutate original
    .sort(() => Math.random() - 0.5)
    .slice(0, 30);

  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("quizPage").classList.remove("hidden");
  document.getElementById("studentId").textContent = "Roll: " + currentUser;

  loadQuestion();
}

// LOAD QUESTION
function loadQuestion() {
  if (currentQuestion >= questions.length) {
    return endQuiz();
  }

  const qData = questions[currentQuestion];
  document.getElementById("questionBox").textContent = qData.q || "(No text provided)";
  const optionsBox = document.getElementById("optionsBox");
  optionsBox.innerHTML = "";

  qData.options.forEach(opt => {
    const div = document.createElement("div");
    div.classList.add("option");
    div.textContent = opt;
    div.onclick = () => checkAnswer(opt);
    optionsBox.appendChild(div);
  });

  // Reset and start timer
  timeLeft = 60;
  document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
  clearInterval(timer);
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = `Time: ${timeLeft}s`;
  if (timeLeft <= 0) {
    nextQuestion();
  }
}

// CHECK ANSWER
function checkAnswer(selected) {
  if (selected === questions[currentQuestion].answer) {
    score++;
  }
  nextQuestion();
}

// NEXT QUESTION
function nextQuestion() {
  clearInterval(timer);
  currentQuestion++;
  loadQuestion();
}

// END QUIZ
function endQuiz() {
  clearInterval(timer);
  document.getElementById("quizPage").classList.add("hidden");
  document.getElementById("resultPage").classList.remove("hidden");
  // FIXED: your HTML uses id="scoreBox"
  document.getElementById("scoreBox").textContent = `You scored ${score} / ${questions.length}`;
}
