"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ─── Firebase ─────────────────────────────────────────────────
  const firebaseConfig = {
    apiKey:            "AIzaSyBt6sfCYmc3wsQ-EoCZnQUe87Lnvm3YVbk",
    authDomain:        "amptest-258fd.firebaseapp.com",
    databaseURL:       "https://amptest-258fd-default-rtdb.firebaseio.com",
    projectId:         "amptest-258fd",
    storageBucket:     "amptest-258fd.appspot.com",
    messagingSenderId: "207766817109",
    appId:             "1:207766817109:web:fcf9275cb39e994130c7dc",
    measurementId:     "G-V6TGFDQ4K8"
  };

  if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
  const db = firebase.database();

  // ─── State ────────────────────────────────────────────────────
  let currentQuestionIndex = 0;
  let score               = 0;
  let timeLeft            = 25 * 60;
  let timerInterval       = null;
  let cheatingDetected    = false;
  let testCompleted       = false;
  let allQuestions        = [];
  let selectedOption      = null;  // { elem, value }
  let currentRollNumber   = "";

  // ─── DOM References ───────────────────────────────────────────
  const $id  = id => document.getElementById(id);
  const dom  = {
    questionBox:  $id("questionBox"),
    optionsBox:   $id("optionsBox"),
    timerEl:      $id("timer"),
    scoreBox:     $id("scoreBox"),
    nextBtn:      $id("nextBtn"),
    studentIdEl:  $id("studentId"),
    progressFill: $id("progressFill"),
  };

  // ─── Page Navigation ──────────────────────────────────────────
  // Single utility: hide everything, show one page.
  const PAGES = [
    "welcomePage", "loginPage", "adminLoginPage", "trainerLoginPage",
    "quizPage", "adminPanel", "trainerPanel", "resultPage"
  ];

  function showPage(pageId) {
    PAGES.forEach(id => {
      $id(id).classList.toggle("hidden", id !== pageId);
    });
  }

  // ─── Student Login ─────────────────────────────────────────────
  function login() {
    const roll    = $id("rollNumber").value.trim();
    const pass    = $id("password").value.trim();
    const errEl   = $id("loginError");

    if (!roll || !pass) {
      errEl.textContent = "Please enter your roll number and password.";
      return;
    }
    if (roll.length < 3 || pass !== roll.slice(-3)) {
      errEl.textContent = "Password must be the last 3 digits of your roll number.";
      return;
    }

    errEl.textContent = "Checking…";

    db.ref("studentResults")
      .orderByChild("rollNumber")
      .equalTo(roll)
      .once("value")
      .then(snap => {
        if (snap.exists()) {
          errEl.textContent = "This roll number has already completed the test.";
          return;
        }
        errEl.textContent = "";
        loadQuizQuestions(questions => {
          if (!questions.length) {
            errEl.textContent = "No questions available. Please contact the administrator.";
            return;
          }
          allQuestions     = questions;
          currentRollNumber = roll;
          startQuiz();
        });
      })
      .catch(err => {
        errEl.textContent = "Connection error. Please try again.";
        console.error("Firebase login check error:", err);
      });
  }

  function loadQuizQuestions(callback) {
    db.ref("questions")
      .once("value")
      .then(snap => callback(Object.values(snap.val() || {})))
      .catch(err => {
        console.error("Failed to load questions:", err);
        callback([]);
      });
  }

  function startQuiz() {
    currentQuestionIndex = 0;
    score                = 0;
    timeLeft             = 25 * 60;
    testCompleted        = false;
    cheatingDetected     = false;
    selectedOption       = null;

    dom.studentIdEl.textContent = `Roll No: ${currentRollNumber}`;
    dom.nextBtn.style.display   = "none";
    dom.timerEl.classList.remove("warning");

    showPage("quizPage");
    showQuestion();
    startTimer();

    document.documentElement.requestFullscreen().catch(() => {/* optional feature */});
  }

  // ─── Quiz Logic ────────────────────────────────────────────────
  function showQuestion() {
    if (currentQuestionIndex >= allQuestions.length) {
      endTest();
      return;
    }

    const q = allQuestions[currentQuestionIndex];
    dom.questionBox.textContent = `Q${currentQuestionIndex + 1}. ${q.q}`;
    dom.optionsBox.innerHTML    = "";
    selectedOption              = null;
    dom.nextBtn.style.display   = "none";

    // Update progress bar
    const pct = (currentQuestionIndex / allQuestions.length) * 100;
    dom.progressFill.style.width = `${pct}%`;

    q.options.forEach(optText => {
      const btn = document.createElement("button");
      btn.className   = "option";
      btn.textContent = optText;
      btn.addEventListener("click", () => selectOption(btn, optText));
      dom.optionsBox.appendChild(btn);
    });
  }

  function selectOption(btn, value) {
    if (testCompleted) return;

    // Deselect all, mark chosen
    dom.optionsBox.querySelectorAll(".option").forEach(el => el.classList.remove("selected"));
    btn.classList.add("selected");

    selectedOption = { elem: btn, value };
    dom.nextBtn.style.display = "inline-block";
  }

  function nextQuestion() {
    if (!selectedOption) return;

    const q = allQuestions[currentQuestionIndex];
    if (selectedOption.value === q.answer) score++;

    // Lock options during transition
    dom.optionsBox.querySelectorAll(".option").forEach(el => {
      el.style.pointerEvents = "none";
    });

    currentQuestionIndex++;
    selectedOption = null;

    if (currentQuestionIndex >= allQuestions.length) {
      endTest();
    } else {
      showQuestion();
    }
  }

  // ─── Timer ────────────────────────────────────────────────────
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        endTest();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, "0");
    const s = (timeLeft % 60).toString().padStart(2, "0");
    dom.timerEl.textContent = `${m}:${s}`;
    dom.timerEl.classList.toggle("warning", timeLeft <= 60);
  }

  // ─── End Test ─────────────────────────────────────────────────
  function endTest() {
    if (testCompleted) return; // Guard against double-call
    testCompleted = true;
    clearInterval(timerInterval);

    // Final progress
    dom.progressFill.style.width = "100%";

    storeStudentResult(currentRollNumber, score, cheatingDetected);
    renderResultPage();
    showPage("resultPage");

    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  }

  function renderResultPage() {
    const total      = allQuestions.length;
    const isViolation = cheatingDetected;
    const pct        = total ? Math.round((score / total) * 100) : 0;

    dom.scoreBox.innerHTML = `
      <div class="score-roll">Roll Number: ${currentRollNumber}</div>
      <div class="score-value">${score}<span style="font-size:1.4rem;color:var(--text-muted);font-weight:400;"> / ${total}</span></div>
      <div class="score-label">${pct}% correct</div>
      <div class="score-badge ${isViolation ? "warning" : "success"}">
        ${isViolation
          ? "⚠️ Test terminated — policy violation detected"
          : "✅ Test completed successfully"}
      </div>
    `;
  }

  function storeStudentResult(rollNumber, finalScore, cheating) {
    db.ref("studentResults").push({
      rollNumber,
      score:          finalScore,
      totalQuestions: allQuestions.length,
      cheating:       !!cheating,
      timestamp:      new Date().toISOString()
    }).catch(err => console.error("Failed to save result:", err));
  }

  // ─── Anti-cheat ───────────────────────────────────────────────
  function isQuizActive() {
    return !testCompleted && !$id("quizPage").classList.contains("hidden");
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && isQuizActive()) {
      cheatingDetected = true;
      alert("Test ended: you switched away from the tab.");
      endTest();
    }
  });

  document.addEventListener("keydown", e => {
    if (!isQuizActive()) return;
    const forbidden =
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && ["I", "J"].includes(e.key)) ||
      (e.ctrlKey && ["U", "S"].includes(e.key));
    if (forbidden) {
      e.preventDefault();
      cheatingDetected = true;
      alert("Test ended: forbidden keyboard shortcut detected.");
      endTest();
    }
  });

  document.addEventListener("contextmenu", e => {
    if (isQuizActive()) e.preventDefault();
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && isQuizActive()) {
      cheatingDetected = true;
      alert("Test ended: fullscreen mode was exited.");
      endTest();
    }
  });

  // ─── Admin ────────────────────────────────────────────────────
  function adminLogin() {
    const user  = $id("adminUser").value.trim();
    const pass  = $id("adminPass").value.trim();
    const errEl = $id("adminLoginError");

    if (user === "admin" && pass === "admin12345") {
      errEl.textContent = "";
      showPage("adminPanel");
      loadAllResults();
    } else {
      errEl.textContent = "Invalid admin credentials.";
    }
  }

  function adminLogout() {
    showPage("welcomePage");
  }

  function loadAllResults() {
    const table    = $id("adminResultsTable");
    const actionsEl = $id("adminActions");

    // Render action buttons once
    if (!$id("deleteAllBtn")) {
      actionsEl.innerHTML = `
        <button id="deleteAllBtn" class="btn-danger" onclick="deleteAllResults()">
          Delete All Results
        </button>
        <button id="downloadResultsBtn" class="btn-teal" onclick="downloadAllResults()">
          Download PDF
        </button>
      `;
    }

    table.innerHTML = `
      <thead>
        <tr>
          <th>Roll Number</th>
          <th>Score</th>
          <th>Total Qs</th>
          <th>Submitted</th>
          <th>Violation</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody id="adminTableBody"></tbody>
    `;

    db.ref("studentResults")
      .once("value")
      .then(snap => {
        const results = snap.val() || {};
        const tbody   = $id("adminTableBody");
        const now     = new Date();

        const sorted = Object.entries(results)
          .filter(([, r]) => r.rollNumber?.trim())
          .sort((a, b) => a[1].rollNumber.localeCompare(b[1].rollNumber));

        if (!sorted.length) {
          tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:32px;">No results yet.</td></tr>`;
          return;
        }

        sorted.forEach(([key, r]) => {
          const dateLabel = formatDateLabel(r.timestamp, now);
          const row       = document.createElement("tr");
          row.innerHTML   = `
            <td style="font-weight:600;color:var(--text-primary);">${r.rollNumber}</td>
            <td>${r.score}</td>
            <td>${r.totalQuestions ?? "—"}</td>
            <td>${dateLabel}</td>
            <td style="text-align:center;">${r.cheating ? '<span style="color:var(--accent-red);">Yes</span>' : "—"}</td>
            <td>
              <button class="btn-danger" style="font-size:0.78rem;padding:5px 12px;"
                      onclick="deleteStudentResult('${key}')">
                Delete
              </button>
            </td>
          `;
          tbody.appendChild(row);
        });
      })
      .catch(err => console.error("Failed to load results:", err));
  }

  function formatDateLabel(timestamp, now) {
    if (!timestamp) return "—";
    const d       = new Date(timestamp);
    const dateStr = d.toLocaleDateString();
    const todayStr = now.toLocaleDateString();
    const yest     = new Date(now);
    yest.setDate(now.getDate() - 1);

    let label =
      dateStr === todayStr          ? "Today" :
      dateStr === yest.toLocaleDateString() ? "Yesterday" :
      dateStr;

    return `${label} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function deleteStudentResult(key) {
    if (!confirm("Delete this student's result?")) return;
    db.ref("studentResults/" + key)
      .remove()
      .then(() => loadAllResults())
      .catch(err => alert("Error deleting: " + err.message));
  }

  function deleteAllResults() {
    if (!confirm("Delete ALL student results? This cannot be undone.")) return;
    db.ref("studentResults")
      .remove()
      .then(() => loadAllResults())
      .catch(err => alert("Error: " + err.message));
  }

  function downloadAllResults() {
    db.ref("studentResults")
      .once("value")
      .then(snap => {
        const results = snap.val() || {};
        const entries = Object.values(results).filter(r => r.rollNumber?.trim());

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        const pageW   = doc.internal.pageSize.getWidth();
        const pageH   = doc.internal.pageSize.getHeight();
        const margin  = 16;
        const now     = new Date();
        const dateStr = now.toLocaleString();

        // ── Header band ──────────────────────────────────────────
        doc.setFillColor(17, 19, 24);
        doc.rect(0, 0, pageW, 22, "F");

        doc.setFillColor(0, 230, 211);
        doc.rect(0, 22, pageW, 1.2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(212, 175, 55);
        doc.text("Jayaraj Annapackiam CSI College of Engineering", margin, 10);

        doc.setFontSize(8);
        doc.setTextColor(160, 168, 184);
        doc.setFont("helvetica", "normal");
        doc.text("Placement Aptitude Test — Student Results Report", margin, 17);
        doc.text(`Generated: ${dateStr}`, pageW - margin, 17, { align: "right" });

        // ── Summary row ──────────────────────────────────────────
        const total     = entries.length;
        const cheated   = entries.filter(r => r.cheating).length;
        const avgScore  = total
          ? (entries.reduce((s, r) => s + (r.score || 0), 0) / total).toFixed(1)
          : "—";

        doc.setFillColor(30, 35, 48);
        doc.rect(0, 23.2, pageW, 14, "F");

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 230, 211);

        const stats = [
          ["Total Students", total],
          ["Avg Score",      avgScore],
          ["Violations",     cheated],
        ];
        const colW = (pageW - margin * 2) / stats.length;
        stats.forEach(([label, val], i) => {
          const x = margin + i * colW;
          doc.setTextColor(160, 168, 184);
          doc.setFont("helvetica", "normal");
          doc.text(label, x, 29);
          doc.setTextColor(238, 240, 244);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(String(val), x, 35);
          doc.setFontSize(8.5);
        });

        // ── Table ────────────────────────────────────────────────
        const headers  = ["#", "Roll Number", "Score", "Total Qs", "Percentage", "Submitted At", "Violation"];
        const colWidths = [10, 52, 22, 22, 28, 52, 24];
        const startY   = 44;
        const rowH     = 9;
        let   y        = startY;

        // Table header
        doc.setFillColor(24, 28, 36);
        doc.rect(margin, y, pageW - margin * 2, rowH, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(0, 230, 211);

        let x = margin + 3;
        headers.forEach((h, i) => {
          doc.text(h, x, y + 6);
          x += colWidths[i];
        });
        y += rowH;

        // Table rows
        const sorted = entries.sort((a, b) => a.rollNumber.localeCompare(b.rollNumber));

        sorted.forEach((r, idx) => {
          // Page break
          if (y + rowH > pageH - 12) {
            doc.addPage();
            y = 16;

            // Repeat header on new page
            doc.setFillColor(24, 28, 36);
            doc.rect(margin, y, pageW - margin * 2, rowH, "F");
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7.5);
            doc.setTextColor(0, 230, 211);
            let hx = margin + 3;
            headers.forEach((h, i) => { doc.text(h, hx, y + 6); hx += colWidths[i]; });
            y += rowH;
          }

          // Alternating row background
          doc.setFillColor(idx % 2 === 0 ? 24 : 20, idx % 2 === 0 ? 28 : 24, idx % 2 === 0 ? 36 : 32);
          doc.rect(margin, y, pageW - margin * 2, rowH, "F");

          const pct    = r.totalQuestions ? Math.round((r.score / r.totalQuestions) * 100) + "%" : "—";
          const date   = r.timestamp ? new Date(r.timestamp).toLocaleString() : "—";
          const cells  = [String(idx + 1), r.rollNumber, String(r.score), String(r.totalQuestions ?? "—"), pct, date, r.cheating ? "YES" : "—"];

          doc.setFont("helvetica", "normal");
          doc.setFontSize(7.5);

          let cx = margin + 3;
          cells.forEach((cell, ci) => {
            // Colour-code violation column
            if (ci === 6 && r.cheating) {
              doc.setTextColor(255, 71, 87);
              doc.setFont("helvetica", "bold");
            } else if (ci === 1) {
              doc.setTextColor(238, 240, 244);
              doc.setFont("helvetica", "bold");
            } else {
              doc.setTextColor(160, 168, 184);
              doc.setFont("helvetica", "normal");
            }
            doc.text(cell, cx, y + 6);
            cx += colWidths[ci];
          });

          // Bottom border per row
          doc.setDrawColor(40, 46, 58);
          doc.setLineWidth(0.2);
          doc.line(margin, y + rowH, pageW - margin, y + rowH);

          y += rowH;
        });

        // ── Footer ───────────────────────────────────────────────
        const totalPages = doc.internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          doc.setPage(p);
          doc.setFillColor(17, 19, 24);
          doc.rect(0, pageH - 10, pageW, 10, "F");
          doc.setFontSize(7);
          doc.setTextColor(92, 98, 117);
          doc.setFont("helvetica", "normal");
          doc.text("JACSICE Placement Cell — Confidential", margin, pageH - 3.5);
          doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 3.5, { align: "right" });
        }

        doc.save(`student_results_${now.toISOString().slice(0, 10)}.pdf`);
      })
      .catch(err => alert("Error generating PDF: " + err.message));
  }

  // ─── Word File Import ─────────────────────────────────────────
  let parsedQuestionsBuffer = []; // Holds questions parsed from .docx before confirming

  function handleWordUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".docx")) {
      showUploadStatus("error", "❌ Invalid file type. Please upload a .docx Word file.");
      $id("uploadPreview").style.display = "block";
      return;
    }

    $id("uploadLabelText").textContent = `📎 ${file.name}`;
    $id("uploadPreview").style.display = "block";
    showUploadStatus("loading", "⏳ Reading file…");
    $id("parsedPreviewList").innerHTML = "";
    $id("confirmImportBtn").style.display = "none";

    const reader = new FileReader();
    reader.onload = e => {
      mammoth.extractRawText({ arrayBuffer: e.target.result })
        .then(result => {
          const text = result.value;
          if (!text.trim()) {
            showUploadStatus("error", "❌ The file appears to be empty.");
            return;
          }
          const questions = parseQuestionsFromText(text);
          if (!questions.length) {
            showUploadStatus("error",
              "❌ No valid questions found. Make sure your file matches the required format (Q1., A., B., C., D., Answer:)."
            );
            return;
          }

          parsedQuestionsBuffer = questions;
          renderParsedPreview(questions);
          showUploadStatus("success",
            `✅ Found ${questions.length} question${questions.length !== 1 ? "s" : ""} ready to import.`
          );
          $id("confirmImportBtn").style.display = "inline-block";
        })
        .catch(err => {
          showUploadStatus("error", "❌ Failed to read file: " + err.message);
          console.error("mammoth error:", err);
        });
    };
    reader.readAsArrayBuffer(file);
  }

  /**
   * Parses raw text extracted from a .docx file into question objects.
   *
   * Supported formats:
   *   Q1. Question text?       or   1. Question text?
   *   A. Option                or   a) Option
   *   B. Option
   *   C. Option
   *   D. Option
   *   E. Option (optional 5th)
   *   Answer: B                or   Ans: B   or   Answer: B. Option text
   */
  function parseQuestionsFromText(rawText) {
    const questions = [];

    // Normalise line endings and split
    const lines = rawText
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .split("\n")
      .map(l => l.trim())
      .filter(l => l.length > 0);

    let current = null;

    const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

    // Regex patterns (case-insensitive where sensible)
    const reQuestion  = /^(?:Q\s*\d+[.):\-]?\s*|\d+[.):\-]\s*)(.+)/i;
    const reOption    = /^([A-Ea-e])[.):\-]\s*(.+)/;
    const reAnswer    = /^(?:ans(?:wer)?)\s*[:\-]\s*([A-Ea-e])/i;

    function pushCurrent() {
      if (!current) return;
      const { q, options, answerLetter } = current;
      if (q && options.length >= 2 && answerLetter) {
        // Map letter → option text
        const idx        = answerLetter.toUpperCase().charCodeAt(0) - 65; // A=0, B=1…
        const answerText = options[idx];
        if (answerText) {
          questions.push({ q, options, answer: answerText, timestamp: new Date().toISOString() });
        }
      }
      current = null;
    }

    for (const line of lines) {
      // New question?
      const qMatch = reQuestion.exec(line);
      if (qMatch) {
        pushCurrent();
        current = { q: qMatch[1].trim(), options: [], answerLetter: null };
        continue;
      }

      if (!current) continue;

      // Option line?
      const optMatch = reOption.exec(line);
      if (optMatch) {
        current.options.push(optMatch[2].trim());
        continue;
      }

      // Answer line?
      const ansMatch = reAnswer.exec(line);
      if (ansMatch) {
        current.answerLetter = ansMatch[1].toUpperCase();
        continue;
      }

      // Continuation of question text (multi-line question)
      if (!current.options.length && !current.answerLetter) {
        current.q += " " + line;
      }
    }

    pushCurrent(); // Don't forget the last question
    return questions;
  }

  function renderParsedPreview(questions) {
    const list = $id("parsedPreviewList");
    list.innerHTML = "";

    questions.forEach((q, i) => {
      const card = document.createElement("div");
      card.style.cssText = `
        background: var(--bg-overlay); border: 1px solid var(--border-subtle);
        border-radius: var(--r-md); padding: 12px 16px;
      `;

      const pills = q.options.map(opt => `
        <span style="font-size:0.75rem; padding:2px 10px; border-radius:20px; display:inline-block; margin:2px;
              background:${opt === q.answer ? "rgba(0,230,118,0.15)" : "var(--bg-surface)"};
              color:${opt === q.answer ? "var(--accent-green)" : "var(--text-muted)"};
              border:1px solid ${opt === q.answer ? "rgba(0,230,118,0.30)" : "var(--border-subtle)"};">
          ${opt}${opt === q.answer ? " ✓" : ""}
        </span>
      `).join("");

      card.innerHTML = `
        <div style="font-size:0.75rem;font-weight:700;color:var(--brand-gold);
                    text-transform:uppercase;letter-spacing:0.08em;margin-bottom:4px;">
          Question ${i + 1}
        </div>
        <div style="font-size:0.9rem;color:var(--text-primary);font-weight:500;margin-bottom:8px;">
          ${q.q}
        </div>
        <div>${pills}</div>
      `;
      list.appendChild(card);
    });
  }

  function confirmImport() {
    if (!parsedQuestionsBuffer.length) return;

    const btn = $id("confirmImportBtn");
    btn.disabled    = true;
    btn.textContent = "⏳ Importing…";

    // Push all questions in parallel
    const writes = parsedQuestionsBuffer.map(q => db.ref("questions").push(q));

    Promise.all(writes)
      .then(() => {
        showUploadStatus("success",
          `🎉 ${parsedQuestionsBuffer.length} question${parsedQuestionsBuffer.length !== 1 ? "s" : ""} imported successfully! Students can now attempt them.`
        );
        btn.style.display = "none";
        parsedQuestionsBuffer = [];
        loadQuestions();             // Refresh the questions list below
      })
      .catch(err => {
        showUploadStatus("error", "❌ Import failed: " + err.message);
        btn.disabled    = false;
        btn.textContent = "✅ Import All Questions";
      });
  }

  function resetUpload() {
    parsedQuestionsBuffer = [];
    $id("wordFileInput").value        = "";
    $id("uploadLabelText").textContent = "Click to choose a .docx file";
    $id("uploadPreview").style.display = "none";
    $id("parsedPreviewList").innerHTML  = "";
    $id("confirmImportBtn").style.display = "none";
  }

  function showUploadStatus(type, message) {
    const el = $id("uploadStatus");
    const styles = {
      success: "background:rgba(0,230,118,0.10);color:var(--accent-green);border:1px solid rgba(0,230,118,0.25);",
      error:   "background:rgba(255,71,87,0.10);color:var(--accent-red);border:1px solid rgba(255,71,87,0.25);",
      loading: "background:rgba(0,230,211,0.08);color:var(--brand-teal);border:1px solid rgba(0,230,211,0.20);",
    };
    el.style.cssText = styles[type] || styles.loading;
    el.textContent   = message;
  }

  // ─── Trainer ──────────────────────────────────────────────────
  function trainerLogin() {
    const user  = $id("trainerUser").value.trim();
    const pass  = $id("trainerPass").value.trim();
    const errEl = $id("trainerLoginError");

    if (user === "trainer" && pass === "trainer123") {
      errEl.textContent = "";
      showPage("trainerPanel");
      loadQuestions();
    } else {
      errEl.textContent = "Invalid trainer credentials.";
    }
  }

  function trainerLogout() {
    cancelEdit();
    showPage("welcomePage");
  }

  function loadQuestions() {
    const listEl = $id("questionsList");
    listEl.innerHTML = `<p class="questions-empty">Loading questions…</p>`;

    db.ref("questions")
      .once("value")
      .then(snap => {
        const questions = snap.val() || {};
        const entries   = Object.entries(questions);

        $id("questionsCount").textContent = entries.length;

        if (!entries.length) {
          listEl.innerHTML = `<p class="questions-empty">No questions yet. Add one above!</p>`;
          return;
        }

        listEl.innerHTML = "";
        entries.forEach(([key, q], i) => {
          const card = document.createElement("div");
          card.className = "question-card";

          const optionPills = q.options.map(opt => `
            <span class="question-option-pill ${opt === q.answer ? "correct-pill" : ""}">
              ${opt}${opt === q.answer ? " ✓" : ""}
            </span>
          `).join("");

          card.innerHTML = `
            <div class="question-card-body">
              <div class="question-card-num">Question ${i + 1}</div>
              <div class="question-card-text">${q.q}</div>
              <div class="question-card-options">${optionPills}</div>
            </div>
            <div class="question-card-actions">
              <button class="btn-secondary" style="font-size:0.78rem;padding:5px 12px;"
                      onclick="editQuestion('${key}')">Edit</button>
              <button class="btn-danger"    style="font-size:0.78rem;padding:5px 12px;"
                      onclick="deleteQuestion('${key}')">Delete</button>
            </div>
          `;
          listEl.appendChild(card);
        });
      })
      .catch(err => {
        listEl.innerHTML = `<p class="questions-empty" style="color:var(--accent-red);">Failed to load questions.</p>`;
        console.error("loadQuestions error:", err);
      });
  }

  function addQuestion() {
    const question = $id("newQuestion").value.trim();
    const opt1     = $id("option1").value.trim();
    const opt2     = $id("option2").value.trim();
    const opt3     = $id("option3").value.trim();
    const opt4     = $id("option4").value.trim();
    const opt5     = $id("option5").value.trim();
    const answer   = $id("correctAnswer").value.trim();
    const editKey  = $id("editingKey").value;

    if (!question || !opt1 || !opt2 || !opt3 || !opt4 || !answer) {
      alert("Please fill in all required fields (marked *).");
      return;
    }

    const options = [opt1, opt2, opt3, opt4];
    if (opt5) options.push(opt5);

    if (!options.includes(answer)) {
      alert("The correct answer must exactly match one of the options.");
      return;
    }

    const payload = {
      q:         question,
      options,
      answer,
      timestamp: new Date().toISOString()
    };

    // BUG FIX: Use update/set on existing key when editing — no delete dialog.
    const operation = editKey
      ? db.ref("questions/" + editKey).update(payload)
      : db.ref("questions").push(payload);

    operation
      .then(() => {
        clearQuestionForm();
        loadQuestions();
      })
      .catch(err => alert("Error saving question: " + err.message));
  }

  function editQuestion(key) {
    db.ref("questions/" + key)
      .once("value")
      .then(snap => {
        const q = snap.val();
        if (!q) return;

        $id("newQuestion").value    = q.q;
        $id("option1").value        = q.options[0] ?? "";
        $id("option2").value        = q.options[1] ?? "";
        $id("option3").value        = q.options[2] ?? "";
        $id("option4").value        = q.options[3] ?? "";
        $id("option5").value        = q.options[4] ?? "";
        $id("correctAnswer").value  = q.answer;
        $id("editingKey").value     = key;
        $id("cancelEditBtn").style.display = "inline-block";

        // Scroll add-section into view
        document.querySelector(".trainer-add-section").scrollIntoView({ behavior: "smooth" });
      })
      .catch(err => alert("Failed to load question for editing: " + err.message));
  }

  function cancelEdit() {
    clearQuestionForm();
  }

  function clearQuestionForm() {
    ["newQuestion", "option1", "option2", "option3", "option4", "option5", "correctAnswer"].forEach(id => {
      $id(id).value = "";
    });
    $id("editingKey").value = "";
    $id("cancelEditBtn").style.display = "none";
  }

  function deleteQuestion(key) {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    db.ref("questions/" + key)
      .remove()
      .then(() => loadQuestions())
      .catch(err => alert("Error deleting: " + err.message));
  }

  // ─── Roll Number Input: digits only ──────────────────────────
  $id("rollNumber")?.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
  });

  // ─── Expose to global scope (called from inline HTML onclick) ─
  Object.assign(window, {
    goToLogin:           () => showPage("loginPage"),
    showAdminLogin:      () => showPage("adminLoginPage"),
    showTrainerLogin:    () => showPage("trainerLoginPage"),
    login,
    nextQuestion,
    adminLogin,
    adminLogout,
    deleteStudentResult,
    deleteAllResults,
    downloadAllResults,
    trainerLogin,
    trainerLogout,
    addQuestion,
    editQuestion,
    cancelEdit,
    deleteQuestion,
    handleWordUpload,
    confirmImport,
    resetUpload,
  });

});
