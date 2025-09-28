// Wrap all code in DOMContentLoaded to ensure DOM is ready before accessing elements
document.addEventListener("DOMContentLoaded", function() {
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

  // Global variables
  let currentQuestionIndex = 0;
  let score = 0;
  let timeLeft = 25 * 60;
  let timer;
  let cheatingDetected = false;
  let testCompleted = false;
  let allQuestions = []; // Will be loaded from Firebase

  // DOM elements
  const questionText = document.getElementById("questionBox");
  const optionsContainer = document.getElementById("optionsBox");
  const timerText = document.getElementById("timer");
  const scoreBox = document.getElementById("scoreBox");
  const nextBtn = document.getElementById("nextBtn");
  const studentIdText = document.getElementById("studentId");

  // ==================== NAVIGATION FUNCTIONS ====================
  function goToLogin() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("loginPage").classList.remove("hidden");
    document.getElementById("adminLoginPage").classList.add("hidden");
    document.getElementById("trainerLoginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("trainerPanel").classList.add("hidden");
  }

  function showAdminLogin() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("adminLoginPage").classList.remove("hidden");
    document.getElementById("trainerLoginPage").classList.add("hidden");
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("trainerPanel").classList.add("hidden");
  }

  function showTrainerLogin() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("adminLoginPage").classList.add("hidden");
    document.getElementById("trainerLoginPage").classList.remove("hidden");
    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("trainerPanel").classList.add("hidden");
  }

  // ==================== STUDENT LOGIN & QUIZ FUNCTIONS ====================
  function login() {
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const password = document.getElementById("password").value.trim();
    const loginError = document.getElementById("loginError");

    if (rollNumber === "" || password === "") {
      loginError.textContent = "Please enter both Roll Number and Password.";
      return;
    }

    if (rollNumber.length < 3 || password !== rollNumber.slice(-3)) {
      loginError.textContent = "Password must be the last 3 digits of your Roll Number.";
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

          // Load questions from Firebase
          loadQuizQuestions((questions) => {
            allQuestions = questions;
            
            if (allQuestions.length === 0) {
              loginError.textContent = "No questions available. Please contact administrator.";
              return;
            }

            document.getElementById("loginPage").classList.add("hidden");
            document.getElementById("quizPage").classList.remove("hidden");

            studentIdText.textContent = `Roll Number: ${rollNumber}`;

            currentQuestionIndex = 0;
            score = 0;
            timeLeft = 25 * 60;
            testCompleted = false;
            cheatingDetected = false;
            nextBtn.style.display = "none";
            timerText.style.display = "block";

            showQuestion();
            startTimer();

            document.documentElement.requestFullscreen().catch(() => {});
          });
        }
      });
  }

  function loadQuizQuestions(callback) {
    db.ref("questions").once("value", (snapshot) => {
      const questions = snapshot.val() || {};
      const questionsArray = Object.values(questions);
      callback(questionsArray);
    });
  }

  function showQuestion() {
    if (currentQuestionIndex >= allQuestions.length) {
      endTest();
      return;
    }

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

    nextBtn.style.display = "none";
  }

  let selectedOptionValue = null;

  function selectOption(optionElem, selectedOption) {
    if (testCompleted) return;

    const allOptionElems = optionsContainer.querySelectorAll(".option");
    allOptionElems.forEach((elem) => {
      elem.classList.remove("selected");
    });

    optionElem.classList.add("selected");
    selectedOptionValue = selectedOption;
    nextBtn.style.display = "inline-block";
  }

  function nextQuestion() {
    const currentQuestion = allQuestions[currentQuestionIndex];
    if (selectedOptionValue === currentQuestion.answer) {
      score++;
    }

    const allOptionElems = optionsContainer.querySelectorAll(".option");
    allOptionElems.forEach((elem) => {
      elem.onclick = null;
      elem.style.pointerEvents = "none";
    });

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
    if (
      document.hidden &&
      !testCompleted &&
      !document.getElementById("quizPage").classList.contains("hidden")
    ) {
      cheatingDetected = true;
      alert("Test ended due to switching tabs or background apps!");
      endTest();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (
      !testCompleted &&
      !document.getElementById("quizPage").classList.contains("hidden") &&
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
    if (
      !testCompleted &&
      !document.getElementById("quizPage").classList.contains("hidden")
    ) {
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

  function storeStudentResult(rollNumber, score, cheating) {
    const resultRef = db.ref("studentResults").push();
    resultRef.set({
      rollNumber: rollNumber,
      score: score,
      totalQuestions: allQuestions.length,
      cheating: !!cheating,
      timestamp: new Date().toISOString()
    });
  }

  function endTest() {
    testCompleted = true;
    clearInterval(timer);

    document.getElementById("quizPage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    const rollNumber = studentIdText.textContent.replace("Roll Number: ", "").trim();
    storeStudentResult(rollNumber, score, cheatingDetected);

    scoreBox.innerHTML =
      `<div style="font-weight:bold;margin-bottom:8px;">Roll Number: ${rollNumber}</div>` +
      `<div style="font-size:1.3em;margin:10px 0;">Score: ${score} out of ${allQuestions.length}</div>` +
      (cheatingDetected
        ? `<div style="color:#ff6b81;font-weight:bold;">⚠️ Test terminated due to policy violation</div>`
        : `<div style="color:#50fa7b;font-weight:bold;">✅ Test completed successfully</div>`);

    timerText.style.display = "none";
    nextBtn.style.display = "none";

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  }

  // ==================== ADMIN FUNCTIONS ====================
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
    table.innerHTML = `<tr>
      <th>Roll Number</th>
      <th>Score</th>
      <th>Total Questions</th>
      <th>Submitted At</th>
      <th>Cheating</th>
      <th>Delete</th>
    </tr>`;

    db.ref("studentResults").once("value", (snapshot) => {
      const results = snapshot.val() || {};
      const now = new Date();
      Object.entries(results)
        .filter(([_, r]) => r.rollNumber && r.rollNumber.trim() !== "")
        .sort((a, b) => a[1].rollNumber.localeCompare(b[1].rollNumber))
        .forEach(([key, r]) => {
          const row = document.createElement("tr");
          let dateLabel = "-";
          if (r.timestamp) {
            const dateObj = new Date(r.timestamp);
            const dateStr = dateObj.toLocaleDateString();
            const todayStr = now.toLocaleDateString();
            const yest = new Date(now);
            yest.setDate(now.getDate() - 1);
            const yestStr = yest.toLocaleDateString();
            if (dateStr === todayStr) {
              dateLabel = "Today";
            } else if (dateStr === yestStr) {
              dateLabel = "Yesterday";
            } else {
              dateLabel = dateStr;
            }
            dateLabel += " " + dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          row.innerHTML = `
            <td>${r.rollNumber}</td>
            <td>${r.score}</td>
            <td>${r.totalQuestions || 'N/A'}</td>
            <td>${dateLabel}</td>
            <td style="text-align:center;">${r.cheating ? "✔️" : ""}</td>
            <td>
              <button style="background:#ff4757;color:#fff;border:none;padding:6px 14px;border-radius:6px;cursor:pointer;" onclick="deleteStudentResult('${key}')">Delete</button>
            </td>
          `;
          table.appendChild(row);
        });
    });

    let delAllBtn = document.getElementById("deleteAllBtn");
    if (!delAllBtn) {
      delAllBtn = document.createElement("button");
      delAllBtn.id = "deleteAllBtn";
      delAllBtn.textContent = "Delete All Results";
      delAllBtn.style = "background:#ff4757;color:#fff;border:none;padding:8px 24px;border-radius:8px;cursor:pointer;margin-bottom:12px;margin-top:8px;font-weight:700;font-size:1.08rem;";
      delAllBtn.onclick = deleteAllResults;
      table.parentNode.insertBefore(delAllBtn, table);
    }

    let downloadBtn = document.getElementById("downloadResultsBtn");
    if (!downloadBtn) {
      downloadBtn = document.createElement("button");
      downloadBtn.id = "downloadResultsBtn";
      downloadBtn.textContent = "Download Results CSV";
      downloadBtn.style = "background:#00e6d3;color:#232526;border:none;padding:8px 24px;border-radius:8px;cursor:pointer;margin-bottom:12px;margin-top:8px;font-weight:700;font-size:1.08rem;margin-left:12px;";
      downloadBtn.onclick = downloadAllResults;
      table.parentNode.insertBefore(downloadBtn, table);
    }
  }

  function downloadAllResults() {
    db.ref("studentResults").once("value", (snapshot) => {
      const results = snapshot.val() || {};
      const now = new Date();
      let csv = "Roll Number,Score,Total Questions,Submitted At,Cheating\n";
      Object.values(results).forEach(r => {
        let dateLabel = "-";
        if (r.timestamp) {
          const dateObj = new Date(r.timestamp);
          dateLabel = dateObj.toLocaleString();
        }
        csv += `"${r.rollNumber}","${r.score}","${r.totalQuestions || 'N/A'}","${dateLabel}","${r.cheating ? "Yes" : "No"}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_results.csv";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
    });
  }

  function deleteStudentResult(key) {
    if (confirm("Are you sure you want to delete this student's result?")) {
      db.ref("studentResults/" + key).remove().then(() => {
        showAllResults();
      });
    }
  }

  function deleteAllResults() {
    if (confirm("Are you sure you want to delete ALL student results? This cannot be undone.")) {
      db.ref("studentResults").remove().then(() => {
        showAllResults();
      });
    }
  }

  function adminLogout() {
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("welcomePage").classList.remove("hidden");
  }

  // ==================== TRAINER FUNCTIONS ====================
  function trainerLogin() {
    const user = document.getElementById("trainerUser").value.trim();
    const pass = document.getElementById("trainerPass").value.trim();
    const err = document.getElementById("trainerLoginError");

    if (user === "trainer" && pass === "trainer123") {
      document.getElementById("trainerLoginPage").classList.add("hidden");
      document.getElementById("trainerPanel").classList.remove("hidden");
      loadQuestions();
      err.textContent = "";
    } else {
      err.textContent = "Invalid trainer credentials.";
    }
  }

  function loadQuestions() {
    const questionsList = document.getElementById("questionsList");
    questionsList.innerHTML = "<p style='text-align:center; color:#00e6d3;'>Loading questions...</p>";
    
    db.ref("questions").once("value", (snapshot) => {
      const questions = snapshot.val() || {};
      questionsList.innerHTML = "";
      
      document.getElementById("questionsCount").textContent = Object.keys(questions).length;
      
      if (Object.keys(questions).length === 0) {
        questionsList.innerHTML = "<p style='text-align:center; color:#ff6b81;'>No questions found. Add some questions to get started!</p>";
        return;
      }
      
      Object.entries(questions).forEach(([key, q], index) => {
        const questionDiv = document.createElement("div");
        questionDiv.style.border = "1px solid #00e6d3";
        questionDiv.style.padding = "15px";
        questionDiv.style.margin = "10px 0";
        questionDiv.style.borderRadius = "8px";
        questionDiv.style.background = "rgba(0,230,211,0.05)";
        questionDiv.style.transition = "all 0.3s ease";
        
        questionDiv.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div style="flex: 1;">
              <strong style="color:#00e6d3;">Q${index + 1}:</strong> ${q.q}<br>
              <div style="margin: 8px 0; font-size: 0.9em;">
                <strong>Options:</strong> ${q.options.map(opt => `<span style="color:#8be9fd;">"${opt}"</span>`).join(", ")}<br>
                <strong style="color:#50fa7b;">Answer:</strong> <span style="color:#50fa7b;">${q.answer}</span>
              </div>
            </div>
            <div style="margin-left: 15px;">
              <button onclick="editQuestion('${key}')" 
                      style="background:#0072ff; color:white; padding:6px 12px; margin:2px; border:none; border-radius:4px; cursor:pointer; font-size:0.8em;">
                Edit
              </button>
              <button onclick="deleteQuestion('${key}')" 
                      style="background:#ff4757; color:white; padding:6px 12px; margin:2px; border:none; border-radius:4px; cursor:pointer; font-size:0.8em;">
                Delete
              </button>
            </div>
          </div>
        `;
        
        questionDiv.onmouseenter = () => {
          questionDiv.style.transform = "translateX(5px)";
          questionDiv.style.boxShadow = "0 4px 12px rgba(0,230,211,0.2)";
        };
        questionDiv.onmouseleave = () => {
          questionDiv.style.transform = "translateX(0)";
          questionDiv.style.boxShadow = "none";
        };
        
        questionsList.appendChild(questionDiv);
      });
    });
  }

  function addQuestion() {
    const question = document.getElementById("newQuestion").value.trim();
    const option1 = document.getElementById("option1").value.trim();
    const option2 = document.getElementById("option2").value.trim();
    const option3 = document.getElementById("option3").value.trim();
    const option4 = document.getElementById("option4").value.trim();
    const option5 = document.getElementById("option5").value.trim();
    const answer = document.getElementById("correctAnswer").value.trim();
    
    if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
      alert("❌ Please fill all required fields (marked with *)");
      return;
    }
    
    const options = [option1, option2, option3, option4];
    if (option5) options.push(option5);
    
    if (!options.includes(answer)) {
      alert("❌ Correct answer must match exactly one of the options!");
      return;
    }
    
    const newQuestion = {
      q: question,
      options: options,
      answer: answer,
      timestamp: new Date().toISOString()
    };
    
    db.ref("questions").push(newQuestion)
      .then(() => {
        alert("✅ Question added successfully!");
        
        document.getElementById("newQuestion").value = "";
        document.getElementById("option1").value = "";
        document.getElementById("option2").value = "";
        document.getElementById("option3").value = "";
        document.getElementById("option4").value = "";
        document.getElementById("option5").value = "";
        document.getElementById("correctAnswer").value = "";
        
        loadQuestions();
      })
      .catch((error) => {
        alert("❌ Error adding question: " + error.message);
      });
  }

  function deleteQuestion(key) {
    if (confirm("🗑️ Are you sure you want to delete this question?")) {
      db.ref("questions/" + key).remove()
        .then(() => {
          loadQuestions();
        })
        .catch((error) => {
          alert("❌ Error deleting question: " + error.message);
        });
    }
  }

  function editQuestion(key) {
    db.ref("questions/" + key).once("value", (snapshot) => {
      const question = snapshot.val();
      
      document.getElementById("newQuestion").value = question.q;
      document.getElementById("option1").value = question.options[0] || "";
      document.getElementById("option2").value = question.options[1] || "";
      document.getElementById("option3").value = question.options[2] || "";
      document.getElementById("option4").value = question.options[3] || "";
      document.getElementById("option5").value = question.options[4] || "";
      document.getElementById("correctAnswer").value = question.answer;
      
      deleteQuestion(key);
      
      window.scrollTo(0, 0);
    });
  }

  function trainerLogout() {
    document.getElementById("trainerPanel").classList.add("hidden");
    document.getElementById("welcomePage").classList.remove("hidden");
  }

  // ==================== UTILITY FUNCTIONS ====================
  const rollInput = document.getElementById("rollNumber");
  if (rollInput) {
    rollInput.setAttribute("inputmode", "numeric");
    rollInput.setAttribute("pattern", "[0-9]*");
    rollInput.addEventListener("input", function () {
      this.value = this.value.replace(/[^0-9]/g, "");
    });
  }

  // ✅ Expose functions globally
  window.goToLogin = goToLogin;
  window.login = login;
  window.nextQuestion = nextQuestion;
  window.showAdminLogin = showAdminLogin;
  window.adminLogin = adminLogin;
  window.adminLogout = adminLogout;
  window.deleteStudentResult = deleteStudentResult;
  window.deleteAllResults = deleteAllResults;
  window.downloadAllResults = downloadAllResults;
  window.showTrainerLogin = showTrainerLogin;
  window.trainerLogin = trainerLogin;
  window.trainerLogout = trainerLogout;
  window.addQuestion = addQuestion;
  window.editQuestion = editQuestion;
  window.deleteQuestion = deleteQuestion;
});