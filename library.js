/* ================= AUTH CHECK ================= */
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    alert("Login required");
    window.location.href = "login.html";
}

/* ================= PAGE LOAD ================= */
window.onload = function () {

    const usernameEl = document.getElementById("username");
    const mobileEl = document.getElementById("usermobile");
    const issueDateEl = document.getElementById("issueDate");
    const returnDateEl = document.getElementById("returnDate");

    if (usernameEl && mobileEl) {
        usernameEl.value = user.name;
        mobileEl.value = user.mobile;
    }

    if (issueDateEl) {
        issueDateEl.addEventListener("change", function () {
            const d = new Date(this.value);
            d.setDate(d.getDate() + 15);
            returnDateEl.value = d.toISOString().split("T")[0];
        });
    }
};

/* ================= ISSUE BOOK ================= */
function issueBook() {

    const book = document.getElementById("book").value.trim();
    const author = document.getElementById("author").value.trim();
    const issueDate = document.getElementById("issueDate").value;
    const returnDate = document.getElementById("returnDate").value;

    if (!book || !author || !issueDate) {
        alert("Please fill all fields");
        return;
    }

    let issues = JSON.parse(localStorage.getItem("issues")) || [];

    const newIssue = {
        id: Date.now() + Math.floor(Math.random() * 1000), // ✅ UNIQUE ID
        mobile: user.mobile,
        name: user.name,
        book: book,
        author: author,
        issueDate: issueDate,
        returnDate: returnDate,
        status: "Issued"
    };

    issues.push(newIssue);

    localStorage.setItem("issues", JSON.stringify(issues));

    alert("Book issued successfully");
    window.location.href = "home.html";
}

/* ================= DISPLAY HISTORY ================= */
function displayRecentHistory(mobile) {

    const container = document.getElementById("historyContainer");
    if (!container) return;

    let issues = JSON.parse(localStorage.getItem("issues")) || [];

    const userIssues = issues.filter(issue => issue.mobile === mobile);

    container.innerHTML = "";

    if (userIssues.length === 0) {
        container.innerHTML = "<p>No books issued yet.</p>";
        return;
    }

    userIssues
        .slice()
        .reverse()
        .forEach(issue => {
            container.innerHTML += `
                <div class="history-item">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4>${issue.book}</h4>
                        <span 
                            onclick="deleteHistory(${issue.id})"
                            style="cursor:pointer; color:#dc3545; font-size:18px;"
                            title="Delete"
                        >🗑️</span>
                    </div>
                    <p><strong>Author:</strong> ${issue.author}</p>
                    <p><strong>Issue Date:</strong> ${issue.issueDate}</p>
                    <p><strong>Return Date:</strong> ${issue.returnDate}</p>
                    <p><strong>Status:</strong> ${issue.status}</p>
                </div>
            `;
        });
}

/* ================= DELETE SINGLE ISSUE ================= */
function deleteHistory(issueId) {

    if (!confirm("Delete this issue record?")) return;

    let issues = JSON.parse(localStorage.getItem("issues")) || [];

    // ✅ remove ONLY the selected issue
    issues = issues.filter(issue => issue.id !== issueId);

    localStorage.setItem("issues", JSON.stringify(issues));

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        displayRecentHistory(user.mobile);
    }
}
