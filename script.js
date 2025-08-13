let questions = [];

// Helper to get/set logged-in register numbers
function getLoggedInRegs() {
    const data = localStorage.getItem("loggedInRegs");
    return data ? JSON.parse(data) : [];
}
function setLoggedInRegs(regs) {
    localStorage.setItem("loggedInRegs", JSON.stringify(regs));
}

function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    // Admin login
    if (username === "admin" && password === "admin123") {
        document.getElementById("loginContainer").classList.add("hidden");
        document.getElementById("adminPanel").classList.remove("hidden");
        loadQuestions();
        return;
    }

    // Student login check
    if (/^951323106\d{3}$/.test(username)) {
        const lastThree = username.slice(-3);
        if (password === lastThree) {
            // Check if already logged in
            const regs = getLoggedInRegs();
            if (regs.includes(username)) {
                alert("This register number has already logged in once.");
                return;
            }
            regs.push(username);
            setLoggedInRegs(regs);
            document.getElementById("loginContainer").classList.add("hidden");
            document.getElementById("testPanel").classList.remove("hidden");
            loadTest();
            return;
        }
    }

    alert("Invalid login credentials");
}

function logout() {
    document.getElementById("loginContainer").classList.remove("hidden");
    document.getElementById("adminPanel").classList.add("hidden");
    document.getElementById("testPanel").classList.add("hidden");
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function addQuestion() {
    const question = document.getElementById("question").value.trim();
    const optionA = document.getElementById("optionA").value.trim();
    const optionB = document.getElementById("optionB").value.trim();
    const optionC = document.getElementById("optionC").value.trim();
    const optionD = document.getElementById("optionD").value.trim();
    const correct = document.getElementById("correctOption").value;

    if (!question || !optionA || !optionB || !optionC || !optionD || !correct) {
        alert("Please fill all fields");
        return;
    }

    questions.push({ question, options: { A: optionA, B: optionB, C: optionC, D: optionD }, correct });
    saveQuestions();
    loadQuestions();
    clearAdminFields();
}

function loadQuestions() {
    const list = document.getElementById("questionList");
    list.innerHTML = "";
    questions.forEach((q, index) => {
        const li = document.createElement("li");
        li.textContent = `${index + 1}. ${q.question} (Correct: ${q.correct})`;
        list.appendChild(li);
    });
}

function saveQuestions() {
    localStorage.setItem("questions", JSON.stringify(questions));
}

function loadTest() {
    const saved = localStorage.getItem("questions");
    if (saved) {
        questions = JSON.parse(saved);
    }

    const container = document.getElementById("questionContainer");
    container.innerHTML = "";
    questions.forEach((q, index) => {
        const div = document.createElement("div");
        div.innerHTML = `<h4>Q${index + 1}: ${q.question}</h4>` +
            Object.keys(q.options).map(opt => `
                <label class="option">
                    <input type="radio" name="q${index}" value="${opt}"> ${opt}: ${q.options[opt]}
                </label>
            `).join("");
        container.appendChild(div);
    });
}

function submitTest() {
    let score = 0;
    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === q.correct) {
            score++;
        }
    });
    alert(`Your score: ${score} / ${questions.length}`);
}

function clearAdminFields() {
    document.getElementById("question").value = "";
    document.getElementById("optionA").value = "";
    document.getElementById("optionB").value = "";
    document.getElementById("optionC").value = "";
    document.getElementById("optionD").value = "";
    document.getElementById("correctOption").value = "";
}

// Load saved questions on page load
window.onload = () => {
    const saved = localStorage.getItem("questions");
    if (saved) {
        questions = JSON.parse(saved);
    }
};
