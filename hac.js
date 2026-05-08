// ==========================================
// 6. HAC (HOME ACCESS CENTER) LOGIC
// ==========================================
//const API_BASE = 'http://localhost:3000/hac'; // Adjust if your server is on a different port/host
//let sessionId = ''; // We use sessionId now instead of raw cookies
const HAC_BASE  = 'https://accesscenter.roundrockisd.org/HomeAccess';
const HAC_PROXY = 'https://corsproxy.io/?url=';

let hacCookies = ''; // session cookies forwarded as header

// Called by loadPage('hac') — show login if not authed, grades if already fetched
function loadHacData() {
    if (hacCookies) {
        showHacGradesPanel();
        fetchHacGrades();
    }
    // else: login panel is already visible by default in hac.html
}

async function hacLogin() {
    const user = document.getElementById('hac-username').value.trim();
    const pass = document.getElementById('hac-password').value.trim();
    const errEl = document.getElementById('hac-login-error');
    errEl.style.display = 'none';

    if (!user || !pass) {
        showHacError('Please enter both username and password.');
        return;
    }

    showHacLoading('Connecting to HAC...');

    try {
        // Step 1: GET login page → scrape __RequestVerificationToken
        setHacLoadingMsg('Fetching login token...');
        const loginPageRes = await fetch(HAC_PROXY + encodeURIComponent(`${HAC_BASE}/Account/LogOn`));
        if (!loginPageRes.ok) throw new Error(`Proxy returned ${loginPageRes.status}. Try again shortly.`);

        const loginPageHtml = await loginPageRes.text();

        // Grab the anti-forgery token from the hidden input
        const tokenMatch = loginPageHtml.match(/name="__RequestVerificationToken"\s+type="hidden"\s+value="([^"]+)"/);
        if (!tokenMatch) throw new Error('Could not find login token. The HAC page structure may have changed.');
        const rvToken = tokenMatch[1];

        // Grab any Set-Cookie headers the proxy forwards
        const initCookies = loginPageRes.headers.get('x-corsproxy-set-cookie') || '';

        // Step 2: POST credentials
        setHacLoadingMsg('Authenticating...');
        const body = new URLSearchParams({
            '__RequestVerificationToken': rvToken,
            'SCKTY00328510CustomEnabled': 'False',
            'SCKTY00436568CustomEnabled': 'False',
            'Database': '10',
            'VerificationOption': 'UsernamePassword',
            'LogOnDetails.UserName': user,
            'LogOnDetails.Password': pass,
        });

        const loginRes = await fetch(HAC_PROXY + encodeURIComponent(`${HAC_BASE}/Account/LogOn`), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Corsproxy-Cookie': initCookies,
            },
            body: body.toString(),
        });

        const loginHtml = await loginRes.text();

        // Check for login failure (HAC redirects to /Home on success; failure stays on /LogOn)
        if (loginHtml.includes('Invalid') || loginHtml.includes('LogOn')) {
            throw new Error('Invalid username or password. Please try again.');
        }

        // Save session cookie for subsequent requests
        hacCookies = loginRes.headers.get('x-corsproxy-set-cookie') || initCookies;

        // Step 3: Fetch grades
        await fetchHacGrades();

    } catch (err) {
        console.error('HAC Login Error: ' + err.message);
        hideHacLoading();
        showHacError(err.message);
    }
}

async function fetchHacGrades() {
    showHacLoading('Loading your grades...');

    try {
        const res = await fetch(HAC_PROXY + encodeURIComponent(`${HAC_BASE}/Classes/Classwork`), {
            headers: { 'X-Corsproxy-Cookie': hacCookies }
        });

        if (!res.ok) throw new Error(`HAC returned status ${res.status}`);
        const html = await res.text();

        const courses = parseHacGrades(html);
        if (!courses.length) throw new Error('No grade data found. You may need to log in again.');

        renderHacGrades(courses);

    } catch (err) {
        console.error('HAC Fetch Error: ' + err.message);
        hideHacLoading();
        showHacError(err.message);
        hacCookies = '';
    }
}

// Parses HAC Classwork HTML into an array of course objects
function parseHacGrades(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const courses = [];

    // Each course is wrapped in a <div class="AssignmentClass"> block
    const classBlocks = doc.querySelectorAll('.AssignmentClass');

    classBlocks.forEach(block => {
        // Course name and current average are in the header row
        const headerRow = block.querySelector('.ClassHeader tr');
        if (!headerRow) return;

        const cells = headerRow.querySelectorAll('td');
        const courseName = cells[0]?.innerText?.trim() || 'Unknown Course';
        const average    = cells[1]?.innerText?.trim() || '—';
        const teacher    = cells[2]?.innerText?.trim() || '';
        const period     = cells[3]?.innerText?.trim() || '';

        // Individual assignments live in the table body rows
        const assignments = [];
        const rows = block.querySelectorAll('.AssignmentRow');

        rows.forEach(row => {
            const cols = row.querySelectorAll('td');
            if (cols.length < 5) return;

            assignments.push({
                name:     cols[0]?.innerText?.trim() || '—',
                due:      cols[2]?.innerText?.trim() || '—',
                category: cols[3]?.innerText?.trim() || '—',
                score:    cols[4]?.innerText?.trim() || '—',
                max:      cols[5]?.innerText?.trim() || '—',
            });
        });

        courses.push({ courseName, average, teacher, period, assignments });
    });

    return courses;
}

function renderHacGrades(courses) {
    showHacGradesPanel();

    // Summary bar — overall GPA-style average
    const numericAverages = courses
        .map(c => parseFloat(c.average))
        .filter(n => !isNaN(n));
    const overallAvg = numericAverages.length
        ? (numericAverages.reduce((a, b) => a + b, 0) / numericAverages.length).toFixed(1)
        : '—';

    const summaryEl = document.getElementById('hac-summary');
    if (summaryEl) {
        summaryEl.innerHTML = `
            <div style="padding:14px 22px; background:var(--primary); color:white; border-radius:12px; text-align:center;">
                <div style="font-size:11px; text-transform:uppercase; letter-spacing:1px; opacity:0.85;">Overall Average</div>
                <div style="font-size:28px; font-weight:700;">${overallAvg}%</div>
            </div>
            <div style="color:var(--text-muted); font-size:13px;">
                <i class="fa-solid fa-circle-check" style="color:var(--success);"></i>
                ${courses.length} courses loaded &nbsp;·&nbsp;
                <span id="hac-refresh-btn" onclick="fetchHacGrades()" style="cursor:pointer; color:var(--primary); font-weight:600;">
                    <i class="fa-solid fa-rotate-right"></i> Refresh
                </span>
            </div>`;
    }

    const container = document.getElementById('hac-data');
    if (!container) return;
    container.innerHTML = '';

    courses.forEach((course, idx) => {
        const avg = parseFloat(course.average);
        const color = isNaN(avg) ? 'var(--text-muted)'
                    : avg >= 90  ? 'var(--success)'
                    : avg >= 70  ? 'var(--warning)'
                    : '#ef4444';

        const assignmentRows = course.assignments.slice(0, 5).map(a => `
            <tr style="border-top:1px solid #f1f5f9;">
                <td style="padding:7px 4px; font-size:12px; color:var(--text-main);">${a.name}</td>
                <td style="padding:7px 4px; font-size:12px; color:var(--text-muted);">${a.due}</td>
                <td style="padding:7px 4px; font-size:12px; font-weight:600; color:${a.score === 'M' ? '#ef4444' : 'var(--text-main)'};">${a.score}${a.max !== '—' ? ' / ' + a.max : ''}</td>
            </tr>`).join('');

        const card = document.createElement('div');
        card.className = 'card animate-slide-up';
        card.style.animationDelay = `${idx * 0.07}s`;
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                <div>
                    <h3 style="font-size:15px; margin-bottom:4px;">${course.courseName}</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin:0;">
                        ${course.teacher ? course.teacher + ' &nbsp;·&nbsp; ' : ''}Period ${course.period || '—'}
                    </p>
                </div>
                <div style="font-size:28px; font-weight:700; color:${color}; line-height:1;">
                    ${course.average}%
                </div>
            </div>

            ${assignmentRows ? `
            <table style="width:100%; border-collapse:collapse; margin-top:10px;">
                <thead>
                    <tr>
                        <th style="font-size:11px; text-align:left; color:var(--text-muted); padding:4px; font-weight:600;">Assignment</th>
                        <th style="font-size:11px; text-align:left; color:var(--text-muted); padding:4px; font-weight:600;">Due</th>
                        <th style="font-size:11px; text-align:left; color:var(--text-muted); padding:4px; font-weight:600;">Score</th>
                    </tr>
                </thead>
                <tbody>${assignmentRows}</tbody>
            </table>
            ${course.assignments.length > 5 ? `<p style="font-size:11px; color:var(--text-muted); margin-top:8px; text-align:right;">+${course.assignments.length - 5} more assignments</p>` : ''}
            ` : '<p style="color:var(--text-muted); font-size:13px;">No assignments recorded yet.</p>'}
        `;
        container.appendChild(card);
    });
}

// ---- HAC UI State Helpers ----
function showHacLoading(msg) {
    const lp = document.getElementById('hac-login-panel');
    const ld = document.getElementById('hac-loading');
    const gp = document.getElementById('hac-grades-panel');
    if (lp) lp.style.display = 'none';
    if (gp) gp.style.display = 'none';
    if (ld) { ld.style.display = 'block'; setHacLoadingMsg(msg); }
}

function setHacLoadingMsg(msg) {
    const el = document.getElementById('hac-loading-msg');
    if (el) el.textContent = msg;
}

function hideHacLoading() {
    const ld = document.getElementById('hac-loading');
    if (ld) ld.style.display = 'none';
}

function showHacGradesPanel() {
    hideHacLoading();
    const lp = document.getElementById('hac-login-panel');
    const gp = document.getElementById('hac-grades-panel');
    if (lp) lp.style.display = 'none';
    if (gp) gp.style.display = 'block';
}

function showHacError(msg) {
    const errEl = document.getElementById('hac-login-error');
    const lp    = document.getElementById('hac-login-panel');
    if (lp) lp.style.display = 'block';
    if (errEl) { errEl.textContent = '⚠ ' + msg; errEl.style.display = 'block'; }
}

function hacLogout() {
    hacCookies = '';
    const lp = document.getElementById('hac-login-panel');
    const gp = document.getElementById('hac-grades-panel');
    if (gp) gp.style.display = 'none';
    if (lp) { lp.style.display = 'block'; }
    const errEl = document.getElementById('hac-login-error');
    if (errEl) errEl.style.display = 'none';
    console.log('Signed out of HAC.');
}