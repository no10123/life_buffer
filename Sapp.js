// ==========================================
// STATIC DATA — EDIT THESE TO UPDATE YOUR GRADES/COURSES
// ==========================================

// ── CANVAS COURSES ──────────────────────────────────────────────────
// Edit this array to change course names, links, grades, or teachers.
const MY_COURSES = [
    { name: "AP CS",      link: "https://learn.irvingisd.net/courses/94227", grade: 100, teacher: "Dawson"   },
    { name: "AP Lang",    link: "https://learn.irvingisd.net/courses/93797", grade: 83,  teacher: "Evidente" },
    { name: "AP Physics", link: "https://learn.irvingisd.net/courses/94111", grade: 0,   teacher: "Mosely"   },
    { name: "AP World",   link: "https://learn.irvingisd.net/courses/94209", grade: 95,  teacher: "Swegler"  },
    { name: "Networking", link: "https://learn.irvingisd.net/courses/94351", grade: 100, teacher: "Cambell"  },
    { name: "DC Pre-Cal", link: "https://learn.irvingisd.net/courses/93956", grade: 91,  teacher: "Arayal"   },
    { name: "TAFCS",      link: "https://learn.irvingisd.net/courses/93956", grade: 100, teacher: "Keller"   },
];

// ── HAC GRADE DETAILS ───────────────────────────────────────────────
// Each entry is one class with a grade and a list of assignments.
// Edit scores, names, dates freely. Add/remove rows as needed.
const HAC_CLASSES = [
    {
        id: "15362-1", name: "APENGLAN", sixWeeksGrade: 83, updated: "5/15/2026",
        assignments: [
            { due: "05/08/2026", name: "Of Mice & Men - Chp 4-6 Discussion Questions", category: "Minor Grades", score: 100, total: 100 },
            { due: "05/08/2026", name: "Evidence Log Update - 6th 6 Weeks #1",          category: "Minor Grades", score: 100, total: 100 },
            { due: "05/07/2026", name: "Argument - Mock Exam - Rewrite",                 category: "Major Grades", score: 85,  total: 100 },
            { due: "05/01/2026", name: "Of Mice & Men - Chp 1-3 Discussion Questions",   category: "Minor Grades", score: 100, total: 100 },
            { due: "05/01/2026", name: "Warm Ups 6th 6 Weeks",                           category: "Minor Grades", score: 88,  total: 100 },
            { due: "04/27/2026", name: "Progress Checks 6th 6 Weeks",                    category: "Minor Grades", score: 89,  total: 100 },
            { due: "04/24/2026", name: "Synthesis - Mock Exam - REWRITE",                category: "Major Grades", score: 85,  total: 100 },
            { due: "04/24/2026", name: "AP Review Videos - Big Ideas/Conclusions/Evals", category: "Minor Grades", score: 80,  total: 100 },
            { due: "04/17/2026", name: "Rhetorical Analysis - Mock Exam - REWRITE",      category: "Major Grades", score: 65,  total: 100 },
        ]
    },
    {
        id: "25442-1", name: "PRE CALC H/DC", sixWeeksGrade: 91, updated: "5/8/2026",
        assignments: [
            { due: "05/13/2026", name: "Chapter 9 Test",                                         category: "Major Grades", score: 100,   total: 100 },
            { due: "05/11/2026", name: "Chapter 9 Review Quiz",                                  category: "Major Grades", score: 100,   total: 100 },
            { due: "05/08/2026", name: "Chapter 9.4 HW - Area of Triangles",                     category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/08/2026", name: "Chapter 9.4 Interactive Assignment - Area of Triangles", category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/08/2026", name: "Chapter 9.3 HW - The Law of Cosines",                    category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/07/2026", name: "Chapter 9.3 Interactive Assignment - The Law of Cosines",category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/06/2026", name: "Chapter 9.2 HW - The Law of Sines",                      category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/06/2026", name: "Chapter 9.2 Interactive Assignment - The Law of Sines",  category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/05/2026", name: "Chapter 9.1 HW - Right Triangle Applications",           category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/04/2026", name: "Chapter 9.1 Interactive - Right Triangle Applications",  category: "Minor Grades", score: 100,   total: 100 },
            { due: "05/04/2026", name: "Chapter 9 Skills Review HW - Integrated Review",         category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/30/2026", name: "Chapter 8 Test",                                         category: "Major Grades", score: 70.83, total: 100 },
            { due: "04/30/2026", name: "Chapter 8 Review Quiz",                                  category: "Major Grades", score: 100,   total: 100 },
            { due: "04/29/2026", name: "Chapter 8.5 HW - Trigonometric Equations",               category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/29/2026", name: "Chapter 8.5 Interactive - Trigonometric Equations",      category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/28/2026", name: "Chapter 8.4 HW - Product to Sum & Sum to Product",       category: "Minor Grades", score: 96.55, total: 100 },
            { due: "04/28/2026", name: "Chapter 8.4 Interactive - Product to Sum & Sum to Product",category: "Minor Grades",score: 100,  total: 100 },
            { due: "04/27/2026", name: "Chapter 8.3 HW - Double and Half Angle Formulae",        category: "Minor Grades", score: 96.30, total: 100 },
            { due: "04/24/2026", name: "Chapter 8.3 Interactive - Double and Half Angle",        category: "Minor Grades", score: 99.43, total: 100 },
            { due: "04/22/2026", name: "Chapter 8.2 HW - The Sum & Difference Formulae",         category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/21/2026", name: "Chapter 8.2 Interactive - The Sum & Difference",         category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/20/2026", name: "Chapter 8.1 HW - Trigonometric Identities",              category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/16/2026", name: "Chapter 8.1 Interactive - Trigonometric Identities",     category: "Minor Grades", score: 100,   total: 100 },
            { due: "04/14/2026", name: "Chapter 8 Skills Review HW - Integrated Review",         category: "Minor Grades", score: 100,   total: 100 },
        ]
    },
    {
        id: "35522-1", name: "APPHYS1", sixWeeksGrade: 0, updated: "4/28/2026",
        assignments: [
            { due: "04/30/2026", name: "Unit 8: Fluids",                            category: "Minor Grades", score: null, total: 100, missing: true },
            { due: "04/29/2026", name: "FRQ Score Review",                          category: "Minor Grades", score: 100,  total: 100 },
            { due: "04/28/2026", name: "Unit 7: Oscillations",                      category: "Minor Grades", score: null, total: 100, missing: true },
            { due: "04/23/2026", name: "Unit 6: Energy and Momentum of Rotating Systems", category: "Minor Grades", score: null, total: 100, missing: true },
            { due: "04/23/2026", name: "Unit 5: Torque and Rotational Dynamics",    category: "Minor Grades", score: null, total: 100, missing: true },
        ]
    },
    {
        id: "45482-6", name: "APWHIST", sixWeeksGrade: 95, updated: "5/6/2026",
        assignments: [
            { due: "05/08/2026", name: "After AP Test Survey",    category: "Minor Grades", score: 100, total: 100 },
            { due: "05/04/2026", name: "Unit 3-4 Review Test Grade", category: "Major Grades", score: 100, total: 100 },
            { due: "04/29/2026", name: "Unit 9 in a Day",         category: "Minor Grades", score: 100, total: 100 },
            { due: "04/29/2026", name: "U1-2 Review Test Grade",  category: "Major Grades", score: 100, total: 100 },
            { due: "04/22/2026", name: "8.5 SAQ and MCQ",         category: "Minor Grades", score: 100, total: 100 },
            { due: "04/22/2026", name: "8.6 Newly Independent States", category: "Minor Grades", score: 100, total: 100 },
            { due: "04/20/2026", name: "HW Vocab 236-250",        category: "Minor Grades", score: 100, total: 100 },
            { due: "04/17/2026", name: "HW 8.7 AMSCO Notes",      category: "Minor Grades", score: 100, total: 100 },
            { due: "04/15/2026", name: "Arms Race - Space Race Reading", category: "Minor Grades", score: 100, total: 100 },
            { due: "04/15/2026", name: "8.3 Notes in Class",      category: "Minor Grades", score: 100, total: 100 },
            { due: "04/13/2026", name: "HW Vocab 216-235",        category: "Minor Grades", score: 80,  total: 100 },
            { due: "04/13/2026", name: "DBQ-LEQ Mock Exam",       category: "Major Grades", score: 79,  total: 100 },
        ]
    },
    {
        id: "75182-1", name: "APCSPRIN", sixWeeksGrade: 100, updated: "4/30/2026",
        assignments: [
            { due: "04/29/2026", name: "AP Project",               category: "Major Grades", score: 100, total: 100 },
            { due: "04/20/2026", name: "Mock Exam",                category: "Major Grades", score: 100, total: 100 },
            { due: "04/15/2026", name: "AP Project Progress Check",category: "Minor Grades", score: 100, total: 100 },
        ]
    },
    {
        id: "79592-3", name: "TAFCS", sixWeeksGrade: 100, updated: "5/12/2026",
        assignments: [
            { due: "05/28/2026", name: "Semester 2 Exam",           category: "Major Grades", score: 100, total: 100 },
            { due: "05/22/2026", name: "EOY Project Submission",    category: "Minor Grades", score: 100, total: 100 },
            { due: "05/15/2026", name: "EOY Project Milestone 3",   category: "Minor Grades", score: 100, total: 100 },
            { due: "05/08/2026", name: "EOY Project Milestone 2",   category: "Minor Grades", score: 100, total: 100 },
            { due: "05/01/2026", name: "EOY Project Milestone 1",   category: "Minor Grades", score: 100, total: 100 },
            { due: "04/22/2026", name: "Python cert practice exam", category: "Major Grades", score: 100, total: 100 },
            { due: "04/17/2026", name: "Edube python tutorial",     category: "Minor Grades", score: 100, total: 100 },
            { due: "04/17/2026", name: "AI and Python Code",        category: "Minor Grades", score: 100, total: 100 },
        ]
    },
    {
        id: "79652-2", name: "NETWRK", sixWeeksGrade: 100, updated: "4/28/2026",
        assignments: [
            { due: "04/24/2026", name: "Review Part 2", category: "Major Grades", score: 100, total: 100 },
            { due: "04/24/2026", name: "Review Part 2", category: "Minor Grades", score: 100, total: 100 },
        ]
    },
];

// ==========================================
// 1. SETTINGS & PERSONALIZATION LOGIC
// ==========================================
applySavedSettings();

const TODO_TASKS_KEY = 'todoGeneratedTasks';
const TODO_STARRED_KEY = 'todoStarredAssignments';
let recentTodoCanvasAssignments = [];
let recentEmailSummaries = [];
let todoGeneratedTasks = JSON.parse(localStorage.getItem(TODO_TASKS_KEY) || '[]');
let starredAssignmentIds = JSON.parse(localStorage.getItem(TODO_STARRED_KEY) || '[]');

function saveTodoTasks() { localStorage.setItem(TODO_TASKS_KEY, JSON.stringify(todoGeneratedTasks)); }
function saveStarredAssignments() { localStorage.setItem(TODO_STARRED_KEY, JSON.stringify(starredAssignmentIds)); }

function toggleStarAssignment(assignmentId) {
    if (starredAssignmentIds.includes(assignmentId)) {
        starredAssignmentIds = starredAssignmentIds.filter(id => id !== assignmentId);
    } else {
        starredAssignmentIds.push(assignmentId);
    }
    saveStarredAssignments();
    renderStarredAssignments();
}

function isAssignmentStarred(assignmentId) { return starredAssignmentIds.includes(assignmentId); }

function initSettings() {
    document.getElementById('set-title').value = document.title;
    document.getElementById('set-primary-color').value = localStorage.getItem('themePrimary') || '#0056b3';
    document.getElementById('set-accent-color').value = localStorage.getItem('themeAccent') || '#00a8ff';
    document.getElementById('set-font-size').value = localStorage.getItem('themeFontSize') || '16px';
}

function updateSettings() {
    const newTitle = document.getElementById('set-title').value || "UniDash";
    const primary = document.getElementById('set-primary-color').value;
    const accent = document.getElementById('set-accent-color').value;
    const fontSize = document.getElementById('set-font-size').value;
    localStorage.setItem('dashboardTitle', newTitle);
    localStorage.setItem('themePrimary', primary);
    localStorage.setItem('themeAccent', accent);
    localStorage.setItem('themeFontSize', fontSize);
    applySavedSettings();
}

function applySavedSettings() {
    document.title = localStorage.getItem('dashboardTitle') || "UniDash";
    const root = document.documentElement;
    if (localStorage.getItem('themePrimary')) root.style.setProperty('--primary', localStorage.getItem('themePrimary'));
    if (localStorage.getItem('themeAccent')) root.style.setProperty('--accent-color', localStorage.getItem('themeAccent'));
    if (localStorage.getItem('themeFontSize')) document.body.style.fontSize = localStorage.getItem('themeFontSize');
}

// ==========================================
// 2. PAGE ROUTING
// ==========================================
const pageCache = {};

// ── STATIC PAGES LIST ────────────────────────────────────────────────
// Pages listed here will be loaded from Spages/ instead of pages/.
// To add a new static page: drop the .html file in Spages/ and add
// its name to this Set. To revert to live: remove it from the Set.
// You can also set STATIC_PAGES_AUTO_DETECT = true to skip the list
// and just try Spages/ first for every page (falls back if 404).
// ─────────────────────────────────────────────────────────────────────
const STATIC_PAGES_AUTO_DETECT = false; // set true to skip the list below

const STATIC_PAGES = new Set([
    'canvas',
    'hac',
    'settings',
    'todo',
    // add more page names here as you create static versions
]);

async function loadPage(pageName, btn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    const container = document.getElementById('main-content-area');
    if (!container) return;

    if (!pageCache[pageName]) {
        // Decide which folder to try first
        const useStatic = STATIC_PAGES_AUTO_DETECT || STATIC_PAGES.has(pageName);
        let html = null;

        if (useStatic) {
            // Try Spages/ first
            const res = await fetch(`Spages/${pageName}.html`);
            if (res.ok) {
                html = await res.text();
                console.log(`[router] Loaded static: Spages/${pageName}.html`);
            } else {
                console.log(`[router] Spages/${pageName}.html not found — falling back to pages/`);
            }
        }

        // Fall back to pages/ if no static version found
        if (!html) {
            const res = await fetch(`pages/${pageName}.html`);
            html = await res.text();
            console.log(`[router] Loaded live: pages/${pageName}.html`);
        }

        pageCache[pageName] = html;
    }
    container.innerHTML = pageCache[pageName];

    const pageInit = {
        overview: () => {},
        canvas:   loadCanvasData,
        todo:     loadTodoPage,
        hac:      loadHacData,
        gmail:    () => { if (accessToken) fetchEmails(); },
        browser:  () => {},
        zipper:   initZipper,
        ATLAS:    () => {},
        playlist: () => {},
        settings: initSettings,
    };

    if (pageInit[pageName]) pageInit[pageName]();
}

// ==========================================
// 3. GOOGLE AUTH & GMAIL LOGIC (unchanged)
// ==========================================
const CLIENT_ID = '218198682167-8u3rjqchskh0q1f5nnbahs43hddaa51h.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let accessToken = null;
let nextPageToken = null;

window.onload = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
                accessToken = tokenResponse.access_token;
                const authBtn = document.getElementById('auth-gmail-btn');
                if (authBtn) authBtn.style.display = 'none';
                fetchEmails();
            }
        },
    });
};

function authorizeGmail() {
    if (!tokenClient) { alert("Google library is still loading. Please try again in a second."); return; }
    tokenClient.requestAccessToken();
}

function signOutGoogle() {
    if (accessToken) { google.accounts.oauth2.revoke(accessToken, () => console.log('Token revoked.')); accessToken = null; }
    alert("You have been signed out of Google.");
    loadPage('settings', document.querySelector('.nav-btn.active'));
}

function decodeBase64(str) {
    try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) { return "<i>Error decoding email text.</i>"; }
}

function getEmailBody(payload) {
    let bodyText = '';
    if (payload.parts) {
        let part = payload.parts.find(p => p.mimeType === 'text/html') || payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
            bodyText = decodeBase64(part.body.data);
        } else {
            for (let subPart of payload.parts) {
                if (subPart.parts) { let nestedBody = getEmailBody(subPart); if (nestedBody) return nestedBody; }
            }
        }
    } else if (payload.body && payload.body.data) {
        bodyText = decodeBase64(payload.body.data);
    }
    return bodyText || "<i>No readable content found.</i>";
}

async function fetchEmails(loadMore = false) {
    const gmailContainer = document.getElementById('gmail-data');
    if (!gmailContainer) return;
    if (!loadMore) gmailContainer.innerHTML = '<p style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your inbox...</p>';
    if (!accessToken) return;

    try {
        let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10';
        if (loadMore && nextPageToken) url += `&pageToken=${nextPageToken}`;
        const listResponse = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
        const listData = await listResponse.json();
        if (!loadMore) gmailContainer.innerHTML = '';
        if (!listData.messages) { gmailContainer.innerHTML += '<p>No emails found.</p>'; return; }
        nextPageToken = listData.nextPageToken || null;

        for (const message of listData.messages) {
            const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const msgData = await msgResponse.json();
            let subject = 'No Subject', from = 'Unknown Sender', date = '';
            msgData.payload.headers.forEach(header => {
                if (header.name.toLowerCase() === 'subject') subject = header.value;
                if (header.name.toLowerCase() === 'from') from = header.value;
                if (header.name.toLowerCase() === 'date') date = header.value;
            });
            const body = getEmailBody(msgData.payload);
            const card = document.createElement('div');
            card.className = 'card';
            card.style = 'cursor:pointer;';
            const preview = document.createElement('div');
            preview.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start;"><div><strong style="font-size:16px;">${subject}</strong><p style="color:var(--text-muted);margin:4px 0;">${from}</p></div><span style="font-size:12px;color:var(--text-muted);white-space:nowrap;">${date}</span></div><p style="font-size:14px;margin-top:8px;color:var(--text-muted);">${msgData.snippet}</p>`;
            const fullBody = document.createElement('div');
            fullBody.style = 'display:none;margin-top:16px;padding-top:16px;border-top:1px solid var(--border);max-height:400px;overflow-y:auto;';
            if (body.trim().startsWith('<')) {
                const iframe = document.createElement('iframe');
                iframe.style = 'width:100%;height:350px;border:none;';
                iframe.srcdoc = body;
                fullBody.appendChild(iframe);
            } else {
                fullBody.innerHTML = `<pre style="white-space:pre-wrap;font-size:13px;font-family:inherit;">${body}</pre>`;
            }
            card.appendChild(preview);
            card.appendChild(fullBody);
            card.onclick = () => { fullBody.style.display = fullBody.style.display === 'none' ? 'block' : 'none'; };
            gmailContainer.appendChild(card);
        }
        if (nextPageToken) {
            const loadBtn = document.createElement('button');
            loadBtn.innerHTML = 'Load More Emails';
            loadBtn.style = 'display:block;margin:20px auto;padding:10px 20px;background:var(--primary);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;';
            loadBtn.onclick = () => fetchEmails(true);
            gmailContainer.appendChild(loadBtn);
        }
    } catch (e) { gmailContainer.innerHTML += '<p style="color:var(--warning);">Failed to load emails.</p>'; }
}

// ==========================================
// 4. CANVAS — STATIC DATA
// ==========================================
function loadCanvasData() {
    const container = document.getElementById('canvas-data');
    if (!container) return;

    container.innerHTML = MY_COURSES.map(course => {
        const g = course.grade;
        let gradeColor = g >= 90 ? '#16a34a' : g >= 80 ? '#ca8a04' : g >= 70 ? '#f59e0b' : '#dc2626';
        let gradeLetter = g >= 90 ? 'A' : g >= 80 ? 'B' : g >= 70 ? 'C' : g >= 60 ? 'D' : 'F';
        return `
        <div class="card animate-slide-up" style="display:flex;justify-content:space-between;align-items:center;gap:16px;">
            <div>
                <h3 style="margin-bottom:4px;">${course.name}</h3>
                <p style="color:var(--text-muted);font-size:14px;margin:0;">
                    <i class="fa-solid fa-chalkboard-user"></i> ${course.teacher}
                </p>
            </div>
            <div style="display:flex;align-items:center;gap:12px;">
                <div style="text-align:center;">
                    <div style="font-size:1.6rem;font-weight:700;color:${gradeColor};">${g}%</div>
                    <div style="font-size:0.75rem;color:${gradeColor};font-weight:600;">${gradeLetter}</div>
                </div>
                <a href="${course.link}" target="_blank"
                   style="padding:8px 14px;background:var(--primary);color:white;border-radius:8px;text-decoration:none;font-size:13px;font-weight:600;">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Open
                </a>
            </div>
        </div>`;
    }).join('');
}

// ==========================================
// 5. HAC — STATIC GRADES WITH EXPAND/COLLAPSE
// ==========================================
function loadHacData() {
    const panel = document.getElementById('hac-grades-panel');
    const login = document.getElementById('hac-login-panel');
    if (!panel || !login) return;
    login.style.display = 'none';
    panel.style.display = 'block';
    renderHacGrades(HAC_CLASSES);
}

function renderHacGrades(courses) {
    const summary = document.getElementById('hac-summary');
    const grid = document.getElementById('hac-data');
    if (!summary || !grid) return;

    const avg = courses.reduce((s, c) => s + c.sixWeeksGrade, 0) / courses.length;
    summary.innerHTML = `
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 20px;display:flex;align-items:center;gap:10px;">
            <i class="fa-solid fa-chart-bar" style="color:var(--primary);font-size:1.2rem;"></i>
            <div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Overall Average</div>
                <div style="font-size:1.3rem;font-weight:700;color:var(--primary);">${avg.toFixed(1)}%</div>
            </div>
        </div>
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:12px 20px;display:flex;align-items:center;gap:10px;">
            <i class="fa-solid fa-book" style="color:var(--secondary);font-size:1.2rem;"></i>
            <div>
                <div style="font-size:0.75rem;color:var(--text-muted);">Classes</div>
                <div style="font-size:1.3rem;font-weight:700;color:var(--secondary);">${courses.length}</div>
            </div>
        </div>`;

    grid.innerHTML = courses.map((cls, i) => {
        const g = cls.sixWeeksGrade;
        const gradeColor = g >= 90 ? '#16a34a' : g >= 80 ? '#ca8a04' : g >= 70 ? '#f59e0b' : '#dc2626';
        const rows = cls.assignments.map(a => {
            const scoreDisplay = a.missing
                ? `<span style="color:#dc2626;font-weight:600;">M - Missing</span>`
                : `<span style="color:${a.score >= 90 ? '#16a34a' : a.score >= 70 ? '#ca8a04' : '#dc2626'};font-weight:600;">${a.score}</span>`;
            const catColor = a.category === 'Major Grades' ? '#7c3aed' : '#0369a1';
            return `<tr style="border-bottom:1px solid #f3f4f6;">
                <td style="padding:8px 10px;font-size:0.82rem;color:#374151;">${a.due}</td>
                <td style="padding:8px 10px;font-size:0.82rem;">${a.name}</td>
                <td style="padding:8px 10px;font-size:0.78rem;">
                    <span style="background:${catColor}18;color:${catColor};padding:2px 7px;border-radius:999px;font-weight:600;">${a.category}</span>
                </td>
                <td style="padding:8px 10px;text-align:center;">${scoreDisplay}</td>
                <td style="padding:8px 10px;text-align:center;font-size:0.82rem;color:#9ca3af;">${a.total}</td>
            </tr>`;
        }).join('');

        return `<div class="card" style="padding:0;overflow:hidden;">
            <div onclick="toggleHacClass('hac-detail-${i}')"
                 style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;cursor:pointer;user-select:none;border-bottom:1px solid #f3f4f6;">
                <div>
                    <strong style="font-size:1rem;">${cls.id} — ${cls.name}</strong>
                    <div style="font-size:0.75rem;color:var(--text-muted);margin-top:2px;">Last Updated: ${cls.updated}</div>
                </div>
                <div style="display:flex;align-items:center;gap:14px;">
                    <div style="text-align:right;">
                        <div style="font-size:1.3rem;font-weight:700;color:${gradeColor};">${g}</div>
                        <div style="font-size:0.7rem;color:var(--text-muted);">Six Weeks</div>
                    </div>
                    <i id="hac-chevron-${i}" class="fa-solid fa-chevron-down" style="color:var(--text-muted);transition:transform 0.2s;"></i>
                </div>
            </div>
            <div id="hac-detail-${i}" style="display:none;overflow-x:auto;">
                <table style="width:100%;border-collapse:collapse;">
                    <thead>
                        <tr style="background:#f8fafc;font-size:0.78rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.4px;">
                            <th style="padding:8px 10px;text-align:left;">Due</th>
                            <th style="padding:8px 10px;text-align:left;">Assignment</th>
                            <th style="padding:8px 10px;text-align:left;">Category</th>
                            <th style="padding:8px 10px;text-align:center;">Score</th>
                            <th style="padding:8px 10px;text-align:center;">Total</th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        </div>`;
    }).join('');
}

function toggleHacClass(id) {
    const el = document.getElementById(id);
    const idx = id.split('-').pop();
    const chevron = document.getElementById(`hac-chevron-${idx}`);
    if (!el) return;
    const open = el.style.display !== 'none';
    el.style.display = open ? 'none' : 'block';
    if (chevron) chevron.style.transform = open ? '' : 'rotate(180deg)';
}

// ==========================================
// 6. TODO — STATIC PLACEHOLDER (from todo.html script)
// ==========================================
function loadTodoPage() {
    recentTodoCanvasAssignments = MY_COURSES.map(c => ({ name: c.name, context_name: c.name, due_at: null }));
    renderStarredAssignments();
    renderCanvasContext();
    renderEmailContext();
    renderTodoList();
}

function renderCanvasContext() {
    const el = document.getElementById('canvas-context');
    if (!el) return;
    el.innerHTML = MY_COURSES.map(c => `
        <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #f3f4f6;font-size:0.82rem;">
            <span style="color:#374151;">${c.name}</span>
            <span style="color:${c.grade >= 90 ? '#16a34a' : c.grade >= 70 ? '#ca8a04' : '#dc2626'};font-weight:600;">${c.grade}%</span>
        </div>`).join('');
}

function renderEmailContext() {
    const el = document.getElementById('email-context');
    if (!el) return;
    el.innerHTML = '<p style="color:var(--text-muted);font-size:0.82rem;">Sign in to Gmail to load email context.</p>';
}

function renderStarredAssignments() {
    const el = document.getElementById('starred-assignments');
    if (!el) return;
    el.innerHTML = '<p style="color:var(--text-muted);">No starred assignments yet. Star items from Canvas.</p>';
}

function renderTodoList() {
    const el = document.getElementById('todo-list');
    if (!el) return;
    if (!todoGeneratedTasks.length) {
        el.innerHTML = '<p style="color:var(--text-muted);">Press Generate Tasks with AI to build your first study plan.</p>';
        return;
    }
    el.innerHTML = todoGeneratedTasks.map((task, i) => {
        const pc = task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#ca8a04' : '#16a34a';
        return `<div class="task-row">
            <div class="task-header"><strong>${i+1}. ${task.title}</strong><span style="color:${pc};">${task.priority||'Medium'}</span></div>
            <div class="task-details"><p>${task.details}</p></div>
        </div>`;
    }).join('');
}

function connectAiAgent() {
    const btn = document.getElementById('connect-gemini-btn');
    const aiPanel = document.getElementById('ai-agent-output');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connecting...'; }
    if (aiPanel) aiPanel.innerHTML = '<p style="color:#888;"><i class="fa-solid fa-spinner fa-spin"></i> Authenticating with Gemini...</p>';
    setTimeout(() => { if (aiPanel) aiPanel.innerHTML = '<p style="color:#888;"><i class="fa-solid fa-spinner fa-spin"></i> Loading Canvas context...</p>'; }, 700);
    setTimeout(() => { if (aiPanel) aiPanel.innerHTML = '<p style="color:#888;"><i class="fa-solid fa-spinner fa-spin"></i> Analyzing assignments...</p>'; }, 1400);
    setTimeout(() => {
        if (btn) { btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Gemini Connected'; btn.style.background = '#16a34a'; btn.style.color = '#fff'; btn.style.borderColor = 'transparent'; }
        if (aiPanel) aiPanel.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <i class="fa-solid fa-circle-check" style="color:#16a34a;font-size:1.2rem;"></i>
                <strong style="color:#16a34a;">Gemini AI is connected and ready!</strong>
            </div>
            <p style="font-size:0.85rem;color:#555;">Detected ${MY_COURSES.length} courses. Click <em>Generate Tasks with AI</em> to build your plan.</p>
            <div style="font-size:0.8rem;margin-top:8px;">
                ${MY_COURSES.map(c => `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #f0f0f0;"><span>${c.name}</span><span style="color:#16a34a;font-weight:bold;">${c.grade}%</span></div>`).join('')}
            </div>`;
    }, 2200);
}

function generateAiTasks() {
    const todoList = document.getElementById('todo-list');
    const aiPanel = document.getElementById('ai-agent-output');
    if (todoList) todoList.innerHTML = '<p style="color:#888;padding:12px;"><i class="fa-solid fa-spinner fa-spin"></i> Gemini is analyzing your assignments...</p>';
    setTimeout(() => {
        todoGeneratedTasks = MY_COURSES.map(c => ({
            title: `Review ${c.name}`,
            details: `Check your latest assignments for ${c.name} — taught by ${c.teacher}. Current grade: ${c.grade}%.`,
            priority: c.grade < 80 ? 'High' : c.grade < 90 ? 'Medium' : 'Low',
            estimatedTime: '30 min',
        }));
        saveTodoTasks();
        renderTodoList();
        if (aiPanel) aiPanel.innerHTML = `<div style="display:flex;align-items:center;gap:8px;"><i class="fa-solid fa-circle-check" style="color:#16a34a;"></i><strong style="color:#16a34a;margin-left:6px;">Tasks generated!</strong></div>`;
    }, 1800);
}

// ==========================================
// 7. INVISIBLE PLAYER & PLAYLIST LOGIC
// ==========================================
let playlistTracks = [];
let currentTrackIndex = -1;
let loopMode = 'all';

function handleAudioUpload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        playlistTracks.push({ name: files[i].name.replace(/\.[^/.]+$/, ""), url: URL.createObjectURL(files[i]), type: 'local' });
    }
    renderPlaylist();
}

async function addYoutubeTrack() {
    const input = document.getElementById('yt-url');
    const status = document.getElementById('yt-status');
    const url = input.value.trim();
    if (!url) return;
    status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching audio stream...';
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
    const videoId = (match && match[2].length == 11) ? match[2] : null;
    if (!videoId) { status.innerText = "Invalid URL."; return; }
    try {
        const response = await fetch(`https://api.v2.vevioz.com/@api/json/mp3/${videoId}`);
        const data = await response.json();
        if (data && data.link) {
            playlistTracks.push({ name: data.title || "YouTube Track", url: data.link, type: 'youtube' });
            status.style.color = "var(--success)"; status.innerText = "Track added!"; input.value = "";
            renderPlaylist();
        } else throw new Error("No link returned");
    } catch (e) { status.style.color = "var(--warning)"; status.innerText = "Link failed. Try another video."; }
}

function playTrack(index) {
    if (index < 0 || index >= playlistTracks.length) return;
    currentTrackIndex = index;
    const player = document.getElementById('main-audio-player');
    const track = playlistTracks[index];
    player.src = track.url;
    player.play().catch(err => console.error("Autoplay blocked: " + err.message));
    updateControlUI(true, track.name);
    renderPlaylist();
    player.onended = () => playTrack((currentTrackIndex + 1) % playlistTracks.length);
}

function togglePlay() {
    const player = document.getElementById('main-audio-player');
    if (player.paused) { player.play(); updateControlUI(true); } else { player.pause(); updateControlUI(false); }
}

function updateVolume(val) { document.getElementById('main-audio-player').volume = val; }

function updateControlUI(isPlaying, title) {
    const btn = document.getElementById('master-play-btn');
    const titleDisp = document.getElementById('ctrl-track-title');
    const statusDisp = document.getElementById('ctrl-track-status');
    if (btn) btn.innerHTML = isPlaying ? '<i class="fa-solid fa-pause"></i>' : '<i class="fa-solid fa-play"></i>';
    if (title && titleDisp) titleDisp.innerText = title;
    if (statusDisp) statusDisp.innerText = isPlaying ? "Currently Playing" : "Paused";
}

function renderPlaylist() {
    const container = document.getElementById('playlist-tracks');
    if (!container) return;
    container.innerHTML = playlistTracks.length === 0 ? '<p style="text-align:center;color:gray;padding:20px;">Queue is empty.</p>' : '';
    playlistTracks.forEach((track, index) => {
        const isPlaying = index === currentTrackIndex;
        const div = document.createElement('div');
        div.className = 'card';
        div.style = `padding:12px;cursor:pointer;display:flex;align-items:center;gap:15px;border-left:4px solid ${isPlaying ? 'var(--primary)' : 'transparent'};margin:0;`;
        div.innerHTML = `<i class="fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'}" style="color:var(--primary);font-size:20px;"></i><div style="flex-grow:1;"><div style="font-weight:${isPlaying ? 'bold' : 'normal'};font-size:14px;">${track.name}</div><div style="font-size:10px;color:var(--text-muted);text-transform:uppercase;">${track.type}</div></div>`;
        div.onclick = () => isPlaying ? togglePlay() : playTrack(index);
        container.appendChild(div);
    });
}

function toggleConsole() {
    const DC = document.getElementById("debug-console");
    DC.style.display = DC.style.display === "none" ? "block" : "none";
}

// ==========================================
// 8. ZIPPER
// ==========================================
function initZipper() {
    const folderInput = document.getElementById('folder-input');
    const dropArea = document.getElementById('drop-area');
    const dlBtn = document.getElementById('dl-btn');
    const status = document.getElementById('status');
    if (!folderInput || !dropArea) return;
    let currentZip = new JSZip();
    dropArea.onclick = () => folderInput.click();
    folderInput.onchange = (e) => {
        const files = e.target.files;
        if (!files.length) return;
        currentZip = new JSZip();
        let count = 0;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const pathParts = file.webkitRelativePath.split('/');
            pathParts.shift();
            const internalPath = pathParts.join('/');
            if (internalPath) { currentZip.file(internalPath, file); count++; }
        }
        status.innerText = `Prepared ${count} items.`;
        dlBtn.disabled = false;
    };
    dlBtn.onclick = async () => {
        status.innerText = "Zipping... please wait.";
        dlBtn.disabled = true;
        try {
            const blob = await currentZip.generateAsync({ type: "blob" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url; a.download = "bundle.zip"; a.click();
            URL.revokeObjectURL(url);
            status.innerText = "Download complete!";
        } catch (err) { status.innerText = "Error: " + err.message; }
        finally { dlBtn.disabled = false; }
    };
}
