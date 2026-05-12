// ==========================================
// 1. SETTINGS & PERSONALIZATION LOGIC
// ==========================================
applySavedSettings(); // Run immediately on load

const TODO_TASKS_KEY = 'todoGeneratedTasks';
const TODO_STARRED_KEY = 'todoStarredAssignments';
let recentTodoCanvasAssignments = [];
let recentEmailSummaries = [];
let todoGeneratedTasks = JSON.parse(localStorage.getItem(TODO_TASKS_KEY) || '[]');
let starredAssignmentIds = JSON.parse(localStorage.getItem(TODO_STARRED_KEY) || '[]');

function saveTodoTasks() {
    localStorage.setItem(TODO_TASKS_KEY, JSON.stringify(todoGeneratedTasks));
}

function saveStarredAssignments() {
    localStorage.setItem(TODO_STARRED_KEY, JSON.stringify(starredAssignmentIds));
}

function toggleStarAssignment(assignmentId) {
    if (starredAssignmentIds.includes(assignmentId)) {
        starredAssignmentIds = starredAssignmentIds.filter(id => id !== assignmentId);
    } else {
        starredAssignmentIds.push(assignmentId);
    }
    saveStarredAssignments();
    renderStarredAssignments();
}

function isAssignmentStarred(assignmentId) {
    return starredAssignmentIds.includes(assignmentId);
}

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

// Canvas Settings Functions
function initCanvasSettings() {
    const baseUrl = localStorage.getItem('canvasBaseUrl') || 'https://learn.irvingisd.net';
    const accessToken = localStorage.getItem('canvasAccessToken') || '';

    document.getElementById('canvas-base-url').value = baseUrl;
    document.getElementById('canvas-access-token').value = accessToken;
}

function updateCanvasSettings() {
    const baseUrl = document.getElementById('canvas-base-url').value;
    const accessToken = document.getElementById('canvas-access-token').value;

    localStorage.setItem('canvasBaseUrl', baseUrl);
    localStorage.setItem('canvasAccessToken', accessToken);
}

async function testCanvasConnection() {
    const testBtn = document.getElementById('test-canvas-btn');
    const resultDiv = document.getElementById('canvas-test-result');

    const baseUrl = document.getElementById('canvas-base-url').value;
    const accessToken = document.getElementById('canvas-access-token').value;

    if (!baseUrl || !accessToken) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fee';
        resultDiv.style.border = '1px solid #fcc';
        resultDiv.style.color = '#c33';
        resultDiv.innerHTML = '<i class="fa-solid fa-exclamation-triangle"></i> Please enter both Canvas URL and access token.';
        return;
    }

    testBtn.disabled = true;
    testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Testing...';
    resultDiv.style.display = 'none';

    try {
        const testConfig = { baseUrl, accessToken };
        const userData = await canvasApiRequest(testConfig, '/api/v1/users/self/profile');

        resultDiv.style.display = 'block';
        resultDiv.style.background = '#efe';
        resultDiv.style.border = '1px solid #cfc';
        resultDiv.style.color = '#363';
        resultDiv.innerHTML = `<i class="fa-solid fa-check-circle"></i> Connected successfully! Welcome, ${userData.name || 'User'}.`;
    } catch (error) {
        resultDiv.style.display = 'block';
        resultDiv.style.background = '#fee';
        resultDiv.style.border = '1px solid #fcc';
        resultDiv.style.color = '#c33';
        resultDiv.innerHTML = `<i class="fa-solid fa-exclamation-triangle"></i> Connection failed: ${error.message}`;
    } finally {
        testBtn.disabled = false;
        testBtn.innerHTML = '<i class="fa-solid fa-plug"></i> Test Connection';
    }
}

function getCanvasConfig() {
    return {
        baseUrl: localStorage.getItem('canvasBaseUrl') || 'https://irvingisd.instructure.com',
        accessToken: localStorage.getItem('canvasAccessToken') || ''
    };
}

async function canvasApiRequest(config, path, method = 'GET', body = null) {
    const response = await fetch('/canvas/proxy', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            baseUrl: config.baseUrl,
            accessToken: config.accessToken,
            path,
            method,
            body
        })
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Proxy request failed ${response.status}: ${response.statusText}${errorText ? ' - ' + errorText : ''}`);
    }

    return response.json();
}

// ==========================================
// 2. DYNAMIC PAGE ROUTING (SPA LOGIC)
// ==========================================
async function loadPage(pageName, btn) {
    const contentArea = document.getElementById('main-content-area');
    if (!contentArea) {
        console.error("CRITICAL: #main-content-area not found.");
        return;
    }

    // --- Update sidebar active state ---
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    try {
        // Cache-bust so Chromebook never serves a stale page
        const response = await fetch(`pages/${pageName}.html?v=${Date.now()}`);
        if (!response.ok) throw new Error(`${response.status} — pages/${pageName}.html not found`);

        // .text() only — never call both .json() and .text() on the same response
        const html = await response.text();
        contentArea.innerHTML = html;

        // Re-execute any <script> tags injected with the page HTML
        // (innerHTML doesn't run scripts automatically)
        contentArea.querySelectorAll('script').forEach(oldScript => {
            const newScript = document.createElement('script');
            Array.from(oldScript.attributes).forEach(attr =>
                newScript.setAttribute(attr.name, attr.value)
            );
            newScript.textContent = oldScript.textContent;
            oldScript.replaceWith(newScript);
        });

        // Fade-in animation
        contentArea.classList.remove('animate-fade-in');
        void contentArea.offsetWidth; // force reflow
        contentArea.classList.add('animate-fade-in');

        // --- Page-specific init hooks ---
        const hooks = {
            gmail:    () => { if (accessToken) fetchEmails(); },
            canvas:   loadCanvasData,
            hac:      loadHacData,
            playlist: renderPlaylist,
            settings: () => { initSettings(); initCanvasSettings(); },
            todo:     loadTodoPage,
            zipper:   initZipper,
        };
        hooks[pageName]?.();

        console.log(`Loaded: pages/${pageName}.html`);

    } catch (err) {
        console.error('loadPage error: ' + err.message);
        contentArea.innerHTML = `
            <div style="text-align:center; margin-top:60px;">
                <i class="fa-solid fa-triangle-exclamation" style="font-size:48px; color:var(--warning);"></i>
                <h2 style="margin-top:16px;">Module Not Found</h2>
                <p style="color:var(--text-muted); margin-top:8px;">
                    Make sure <strong>pages/${pageName}.html</strong> exists.
                </p>
                <p style="color:#ef4444; font-size:12px; margin-top:8px;">${err.message}</p>
            </div>`;
    }
}

// ==========================================
// 3. GOOGLE AUTH & GMAIL LOGIC
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
    if (!tokenClient) {
        alert("Google library is still loading. Please try again in a second.");
        return;
    }
    tokenClient.requestAccessToken();
}

function signOutGoogle() {
    if (accessToken) {
        google.accounts.oauth2.revoke(accessToken, () => console.log('Token revoked.'));
        accessToken = null;
    }
    alert("You have been signed out of Google.");
    loadPage('settings', document.querySelector('.nav-btn.active')); // Reload page to reset UI
}

function decodeBase64(str) {
    try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) {
        return "<i>Error decoding email text.</i>";
    }
}

function getEmailBody(payload) {
    let bodyText = '';
    if (payload.parts) {
        let part = payload.parts.find(p => p.mimeType === 'text/html') || 
                   payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body && part.body.data) {
            bodyText = decodeBase64(part.body.data);
        } else {
            for (let subPart of payload.parts) {
                if (subPart.parts) {
                    let nestedBody = getEmailBody(subPart);
                    if (nestedBody) return nestedBody;
                }
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
        nextPageToken = listData.nextPageToken || null;

        if (!listData.messages || listData.messages.length === 0) {
            gmailContainer.innerHTML += '<p>No emails found.</p>';
            return;
        }

        for (const message of listData.messages) {
            const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const msgData = await msgResponse.json();
        
            let subject = "No Subject";
            let from = "Unknown Sender";
            
            msgData.payload.headers.forEach(header => {
                if (header.name.toLowerCase() === 'subject') subject = header.value;
                if (header.name.toLowerCase() === 'from') from = header.value;
            });
        
            const fullBody = getEmailBody(msgData.payload);
        
            const card = document.createElement('div');
            card.className = 'card animate-slide-up';
        
            const headerDiv = document.createElement('div');
            headerDiv.style.cursor = 'pointer';
            headerDiv.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <i class="fa-solid fa-envelope" style="color: var(--primary); font-size: 20px;"></i>
                    <h3 style="margin: 0; font-size: 16px;">${subject}</h3>
                </div>
                <p style="color: var(--text-muted); font-size: 14px; margin: 0;"><strong>From:</strong> ${from}</p>
            `;
        
            // The Hidden Body Div
            const bodyDiv = document.createElement('div');
            bodyDiv.className = 'email-body-content';
            bodyDiv.style.display = 'none';
            bodyDiv.style.marginTop = '15px'; // Forced spacing
            
            // 1. Clean broken image links
            const cleanBody = fullBody.replace(/src=["']cid:[^"']+["']/g, 'alt="[Inline Image Hidden]" style="display:none;"');

            // 2. Build the iframe sandbox
            const emailFrame = document.createElement('iframe');
            emailFrame.style.width = '100%';
            emailFrame.style.height = '400px'; // Forced height so it doesn't collapse
            emailFrame.style.border = '1px solid #e2e8f0';
            emailFrame.style.borderRadius = '8px';
            emailFrame.style.backgroundColor = 'white';
            emailFrame.srcdoc = cleanBody; 

            // Put the iframe inside the hidden div
            bodyDiv.appendChild(emailFrame);
        
            // The Click Event
            headerDiv.addEventListener('click', () => {
                const isHidden = bodyDiv.style.display === "none";
                
                if (isHidden) {
                    // OPENING THE EMAIL
                    bodyDiv.style.display = "block";
                    
                    // NUCLEAR OVERRIDES: Force the card to let the content spill out and grow
                    card.style.height = "auto";
                    card.style.maxHeight = "none";
                    card.style.overflow = "visible"; 
                    
                    const icon = headerDiv.querySelector('i');
                    if (icon) {
                        icon.className = "fa-solid fa-envelope-open";
                        icon.style.color = "var(--primary)";
                    }
                } else {
                    // CLOSING THE EMAIL
                    bodyDiv.style.display = "none";
                    
                    const icon = headerDiv.querySelector('i');
                    if (icon) {
                        icon.className = "fa-solid fa-envelope";
                        icon.style.color = "var(--primary)";
                    }
                }
            });
        
            // CRUCIAL: Attach BOTH the header and the body to the card
            card.appendChild(headerDiv);
            card.appendChild(bodyDiv); 
            
            // Attach the card to the page
            gmailContainer.appendChild(card);
        }

        const oldBtn = document.getElementById('load-more-btn');
        if (oldBtn) oldBtn.remove();

        if (nextPageToken) {
            const loadBtn = document.createElement('button');
            loadBtn.id = 'load-more-btn';
            loadBtn.innerText = 'Load More Emails';
            loadBtn.style = "padding: 10px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px;";
            loadBtn.onclick = () => fetchEmails(true);
            gmailContainer.appendChild(loadBtn);
        }

    } catch (error) {
        console.error("Error fetching emails:", error);
        gmailContainer.innerHTML += '<p style="color: var(--warning);">Failed to load emails.</p>';
    }
}

// ==========================================
// 4. MOCK DATA LOGIC (Canvas & HAC)
// ==========================================
// ==========================================
// 4. CANVAS API INTEGRATION
// ==========================================
async function loadCanvasData() {
    const container = document.getElementById('canvas-data');
    const statusDiv = document.getElementById('canvas-status');
    const refreshBtn = document.getElementById('refresh-canvas-btn');

    if(!container) return;

    // Show loading state
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching Canvas data...</p>';
    if (statusDiv) statusDiv.style.display = 'none';
    if (refreshBtn) {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading...';
    }

    try {
        // Get Canvas configuration from localStorage
        const canvasConfig = getCanvasConfig();

        if (!canvasConfig.accessToken) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">
                    <i class="fa-solid fa-key"></i>
                    <p>Canvas API token not configured.</p>
                    <p style="font-size: 14px; margin-top: 8px;">
                        Go to <a href="#" onclick="loadPage('settings')" style="color: var(--primary);">Settings</a> to configure your Canvas integration.
                    </p>
                </div>
            `;
            return;
        }

        // Fetch upcoming assignments
        const assignments = await fetchCanvasAssignments(canvasConfig);

        if (assignments && assignments.length > 0) {
            renderCanvasAssignments(container, assignments);
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.innerHTML = `<div style="background: #efe; color: #363; padding: 10px; border-radius: 6px; border: 1px solid #cfc;"><i class="fa-solid fa-check-circle"></i> Found ${assignments.length} upcoming assignment${assignments.length !== 1 ? 's' : ''}.</div>`;
            }
        } else {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);">No upcoming assignments found.</p>';
            if (statusDiv) {
                statusDiv.style.display = 'block';
                statusDiv.innerHTML = `<div style="background: #eef; color: #336; padding: 10px; border-radius: 6px; border: 1px solid #ccf;"><i class="fa-solid fa-info-circle"></i> No upcoming assignments found.</div>`;
            }
        }

    } catch (error) {
        console.error('Canvas API Error:', error);
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: var(--warning);">
                <i class="fa-solid fa-exclamation-triangle"></i>
                <p>Failed to load Canvas data. Check your API token configuration.</p>
                <p style="font-size: 12px; margin-top: 8px;">${error.message}</p>
                <button onclick="loadPage('settings')" style="margin-top: 10px; padding: 8px 16px; background: var(--primary); color: white; border: none; border-radius: 6px; cursor: pointer;">
                    Configure Settings
                </button>
            </div>
        `;
        if (statusDiv) {
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = `<div style="background: #fee; color: #c33; padding: 10px; border-radius: 6px; border: 1px solid #fcc;"><i class="fa-solid fa-exclamation-triangle"></i> Error loading assignments: ${error.message}</div>`;
        }
    } finally {
        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh';
        }
    }
}

async function fetchCanvasAssignments(config) {
    try {
        const courses = await canvasApiRequest(config, '/api/v1/courses?enrollment_state=active&per_page=50');
        const assignments = [];

        for (const course of courses.slice(0, 10)) {
            try {
                const courseAssignments = await canvasApiRequest(config, `/api/v1/courses/${course.id}/assignments?bucket=upcoming&per_page=20`);
                courseAssignments.forEach(assignment => {
                    assignment.context_name = course.name;
                    assignment.html_url = assignment.html_url || `${config.baseUrl}/courses/${course.id}/assignments/${assignment.id}`;
                });
                assignments.push(...courseAssignments);
            } catch (error) {
                console.warn(`Failed to fetch assignments for course ${course.name}:`, error);
            }
        }

        const now = new Date();
        const upcomingAssignments = assignments
            .filter(assignment => assignment.due_at && new Date(assignment.due_at) > now)
            .sort((a, b) => new Date(a.due_at) - new Date(b.due_at))
            .slice(0, 20);

        return upcomingAssignments;

    } catch (error) {
        console.warn('Failed to fetch assignments from courses, trying planner items:', error);

        const plannerItems = await canvasApiRequest(config, `/api/v1/planner/items?start_date=${new Date().toISOString().split('T')[0]}&per_page=50`);

        const assignments = plannerItems
            .filter(item => item.plannable_type === 'assignment' && item.plannable)
            .map(item => ({
                ...item.plannable,
                context_name: item.context_name || item.course_name,
                html_url: item.html_url
            }));

        return assignments;
    }
}

async function loadTodoPage() {
    await refreshTodoData();
}

async function refreshTodoData() {
    const todoList = document.getElementById('todo-list');
    const canvasContext = document.getElementById('canvas-context');
    const emailContext = document.getElementById('email-context');
    const starredContainer = document.getElementById('starred-assignments');
    const aiPanel = document.getElementById('ai-agent-output');

    if (todoList) todoList.innerHTML = '<p style="color: var(--text-muted);">Loading task suggestions...</p>';
    if (canvasContext) canvasContext.innerHTML = '<p style="color: var(--text-muted);">Loading Canvas context...</p>';
    if (emailContext) emailContext.innerHTML = '<p style="color: var(--text-muted);">Loading email context...</p>';
    if (starredContainer) starredContainer.innerHTML = '<p style="color: var(--text-muted);">Loading starred assignments...</p>';
    if (aiPanel) aiPanel.innerHTML = '<p style="color: var(--text-muted);">AI agent ready. Click Generate Tasks to create a plan.</p>';

    const canvasConfig = getCanvasConfig();
    recentTodoCanvasAssignments = [];
    recentEmailSummaries = [];

    if (canvasConfig.accessToken) {
        try {
            recentTodoCanvasAssignments = await fetchCanvasAssignments(canvasConfig);
        } catch (error) {
            console.warn('Todo page canvas load failed:', error);
            if (canvasContext) canvasContext.innerHTML = `<p style="color: var(--warning);">Unable to load Canvas assignments: ${error.message}</p>`;
        }
    } else if (canvasContext) {
        canvasContext.innerHTML = '<p style="color: var(--warning);">Canvas token missing. Set it in Settings.</p>';
    }

    if (accessToken) {
        try {
            recentEmailSummaries = await fetchEmailContext();
        } catch (error) {
            console.warn('Todo page email load failed:', error);
            if (emailContext) emailContext.innerHTML = `<p style="color: var(--warning);">Unable to load email context: ${error.message}</p>`;
        }
    } else if (emailContext) {
        emailContext.innerHTML = '<p style="color: var(--warning);">Google sign-in required to load Gmail context.</p>';
    }

    renderCanvasContext();
    renderEmailContext();
    renderStarredAssignments();
    renderTodoList();
}

async function fetchEmailContext() {
    const summary = [];
    if (!accessToken) return summary;

    const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5';
    const listResponse = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const listData = await listResponse.json();
    if (!listData.messages) return summary;

    for (const message of listData.messages) {
        const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const msgData = await msgResponse.json();
        let subject = 'No Subject';
        let from = 'Unknown Sender';

        msgData.payload.headers.forEach(header => {
            if (header.name.toLowerCase() === 'subject') subject = header.value;
            if (header.name.toLowerCase() === 'from') from = header.value;
        });

        summary.push({ subject, from, snippet: msgData.snippet || '' });
    }

    return summary;
}

function renderCanvasContext() {
    const canvasContext = document.getElementById('canvas-context');
    if (!canvasContext) return;

    if (!recentTodoCanvasAssignments.length) {
        canvasContext.innerHTML = '<p style="color: var(--text-muted);">No Canvas assignments available yet.</p>';
        return;
    }

    canvasContext.innerHTML = recentTodoCanvasAssignments.slice(0, 5).map(assignment => {
        const dueDate = assignment.due_at ? new Date(assignment.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date';
        return `<div class="context-item"><strong>${assignment.name || assignment.title}</strong><span>${assignment.context_name || 'Course'}</span><span>${dueDate}</span></div>`;
    }).join('');
}

function renderEmailContext() {
    const emailContext = document.getElementById('email-context');
    if (!emailContext) return;

    if (!recentEmailSummaries.length) {
        emailContext.innerHTML = '<p style="color: var(--text-muted);">No Gmail context available yet.</p>';
        return;
    }

    emailContext.innerHTML = recentEmailSummaries.map(email => {
        return `<div class="context-item"><strong>${email.subject}</strong><span>${email.from}</span></div>`;
    }).join('');
}

function renderStarredAssignments() {
    const starredContainer = document.getElementById('starred-assignments');
    if (!starredContainer) return;

    const starred = recentTodoCanvasAssignments.filter(a => isAssignmentStarred(a.id || a.assignment_id || a.name));

    if (!starred.length) {
        starredContainer.innerHTML = '<p style="color: var(--text-muted);">No starred assignments yet. Star items from Canvas or use AI suggestions.</p>';
        return;
    }

    starredContainer.innerHTML = starred.map(assignment => {
        const title = assignment.name || assignment.title || 'Untitled';
        const due = assignment.due_at ? new Date(assignment.due_at).toLocaleDateString('en-US') : 'No date';
        return `<div class="task-row"><div><strong>${title}</strong><p>${assignment.context_name || 'Course'} • ${due}</p></div></div>`;
    }).join('');
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    if (!todoList) return;

    if (!todoGeneratedTasks.length) {
        todoList.innerHTML = '<p style="color: var(--text-muted);">Press Generate Tasks with AI to build your first study plan.</p>';
        return;
    }

    todoList.innerHTML = todoGeneratedTasks.map((task, index) => {
        const priorityColor = task.priority === 'High' ? 'var(--error)' :
                             task.priority === 'Medium' ? 'var(--warning)' : 'var(--success)';
        const priorityIcon = task.priority === 'High' ? 'fa-exclamation-triangle' :
                            task.priority === 'Medium' ? 'fa-minus' : 'fa-check';

        return `
            <div class="task-row">
                <div class="task-header">
                    <strong>${index + 1}. ${task.title}</strong>
                    <span class="task-priority" style="color: ${priorityColor};">
                        <i class="fa-solid ${priorityIcon}"></i> ${task.priority || 'Medium'}
                    </span>
                </div>
                <div class="task-details">
                    <p>${task.details}</p>
                    ${task.estimatedTime ? `<p><i class="fa-solid fa-clock"></i> ${task.estimatedTime}</p>` : ''}
                    ${task.importance ? `<p><i class="fa-solid fa-lightbulb"></i> ${task.importance}</p>` : ''}
                </div>
            </div>
        `;
    }).join('');
}

async function generateAiTasks() {
    const aiPanel = document.getElementById('ai-agent-output');
    const button = document.querySelector('button[onclick="generateAiTasks()"]');

    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';
    }

    try {
        // Show loading state
        if (aiPanel) {
            aiPanel.innerHTML = '<p><i class="fa-solid fa-spinner fa-spin"></i> Analyzing your Canvas assignments and emails...</p>';
        }

        // Prepare context data
        const contextData = {
            canvasAssignments: recentTodoCanvasAssignments.slice(0, 5),
            emailSummaries: recentEmailSummaries.slice(0, 3),
            existingTasks: todoGeneratedTasks.filter(task => !task.title.includes('No available context'))
        };

        // Call Gemini API
        const response = await fetch('/api/gemini/generate-tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contextData)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        const result = await response.json();

        // Update tasks with AI-generated ones
        todoGeneratedTasks = result.tasks || [];

        // Save and render
        saveTodoTasks();
        renderTodoList();

        // Update AI panel with success message
        if (aiPanel) {
            aiPanel.innerHTML = `
                <p style="color: var(--success);"><i class="fa-solid fa-check"></i> AI generated ${todoGeneratedTasks.length} personalized tasks!</p>
                <p style="font-size: 0.9em; color: var(--text-muted);">Based on your Canvas assignments and recent emails.</p>
            `;
        }

    } catch (error) {
        console.error('AI task generation failed:', error);

        // Fallback to manual generation
        console.log('Falling back to manual task generation');
        const assignments = recentTodoCanvasAssignments.slice(0, 5);
        assignments.forEach((assignment, index) => {
            const dueDate = assignment.due_at ? new Date(assignment.due_at) : null;
            const dueText = dueDate ? `due ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` : 'no due date';
            todoGeneratedTasks.push({
                title: assignment.name || assignment.title || `Assignment ${index + 1}`,
                details: `From ${assignment.context_name || 'Canvas'}. ${dueText}.`,
                priority: 'Medium',
                estimatedTime: '30 minutes',
                importance: 'Complete this assignment on time'
            });
        });

        if (recentEmailSummaries.length && todoGeneratedTasks.length < 5) {
            recentEmailSummaries.slice(0, 3).forEach(email => {
                todoGeneratedTasks.push({
                    title: `Review email: ${email.subject}`,
                    details: `From ${email.from}. ${email.snippet || 'Check the message for details.'}`,
                    priority: 'Low',
                    estimatedTime: '10 minutes',
                    importance: 'Stay updated on important communications'
                });
            });
        }

        if (!todoGeneratedTasks.length) {
            todoGeneratedTasks.push({
                title: 'No available context found.',
                details: 'Sign in to Google and configure Canvas before generating tasks.',
                priority: 'Low',
                estimatedTime: '5 minutes',
                importance: 'Set up integrations to get AI recommendations'
            });
        }

        saveTodoTasks();
        renderTodoList();

        if (aiPanel) {
            aiPanel.innerHTML = `<p style="color: var(--error);"><i class="fa-solid fa-exclamation-triangle"></i> AI generation failed: ${error.message}. Using fallback method.</p>`;
        }
    } finally {
        // Reset button
        if (button) {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-robot"></i> Generate Tasks with AI';
        }
    }
}

function connectAiAgent() {
    const aiPanel = document.getElementById('ai-agent-output');

    // Check if Gemini is configured by making a test request
    fetch('/api/gemini/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canvasAssignments: [], emailSummaries: [] })
    })
    .then(response => {
        if (response.status === 503) {
            throw new Error('Gemini not configured - missing service account key');
        }
        return response.json();
    })
    .then(() => {
        if (aiPanel) {
            aiPanel.innerHTML = '<p style="color: var(--success);"><i class="fa-solid fa-check"></i> Gemini AI is connected and ready!</p>';
        }
    })
    .catch(error => {
        if (aiPanel) {
            aiPanel.innerHTML = `<p style="color: var(--error);"><i class="fa-solid fa-exclamation-triangle"></i> Gemini connection failed: ${error.message}</p>`;
        }
    });
}

function composeAiPrompt() {
    const assignmentLines = recentTodoCanvasAssignments.slice(0, 5).map(a => `- ${a.name || a.title} (${a.context_name || 'Course'}) due ${a.due_at || 'unknown'}`);
    const emailLines = recentEmailSummaries.slice(0, 5).map(e => `- ${e.subject} from ${e.from}`);
    return `You are a student study coach. Here are the current assignments and email action items:\n\nAssignments:\n${assignmentLines.join('\n')}\n\nEmails:\n${emailLines.join('\n')}\n\nSuggest the top 3 tasks for the student.`;
}

function composeAiPromptSummary() {
    return composeAiPrompt();
}

function renderCanvasAssignments(container, assignments) {
    const html = assignments.map((assignment, index) => {
        const dueDate = new Date(assignment.due_at);
        const now = new Date();
        const timeDiff = dueDate - now;
        const daysUntilDue = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let urgencyClass = '';
        let urgencyText = '';

        if (daysUntilDue < 0) {
            urgencyClass = 'overdue';
            urgencyText = 'Overdue';
        } else if (daysUntilDue === 0) {
            urgencyClass = 'due-today';
            urgencyText = 'Due Today';
        } else if (daysUntilDue === 1) {
            urgencyClass = 'due-tomorrow';
            urgencyText = 'Due Tomorrow';
        } else if (daysUntilDue <= 3) {
            urgencyClass = 'due-soon';
            urgencyText = `Due in ${daysUntilDue} days`;
        } else {
            urgencyText = `Due in ${daysUntilDue} days`;
        }

        const formattedDate = dueDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });

        const courseName = assignment.context_name || assignment.course_name || 'Unknown Course';
        const title = assignment.name || assignment.title || 'Untitled Assignment';
        const description = assignment.description ? assignment.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...' : '';

        return `
            <div class="card animate-slide-up ${urgencyClass}" style="animation-delay: ${index * 0.1}s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h3 style="margin-bottom: 8px;">${title}</h3>
                        <p style="color: var(--primary); font-weight: 500; margin-bottom: 4px;">${courseName}</p>
                        ${description ? `<p style="font-size: 14px; color: var(--text-muted); margin-bottom: 8px;">${description}</p>` : ''}
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-calendar-days" style="color: var(--text-muted);"></i>
                            <span style="font-size: 14px; color: var(--text-muted);">${formattedDate}</span>
                            ${urgencyText ? `<span style="font-size: 12px; padding: 2px 6px; border-radius: 10px; background: var(--primary); color: white;">${urgencyText}</span>` : ''}
                        </div>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 8px; align-items: flex-end;">
                        <i class="fa-solid fa-book" style="color: var(--primary); font-size: 24px;"></i>
                        ${assignment.html_url ? `<a href="${assignment.html_url}" target="_blank" style="color: var(--primary); text-decoration: none; font-size: 12px;"><i class="fa-solid fa-external-link"></i> View</a>` : ''}
                    </div>
                </div>
                ${assignment.points_possible ? `<div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border); font-size: 14px; color: var(--text-muted);"><i class="fa-solid fa-star"></i> ${assignment.points_possible} points</div>` : ''}
            </div>
        `;
    }).join('');

    container.innerHTML = html;
}

function loadIframeApp() {
    const selector = document.getElementById('app-selector');
    const iframe = document.getElementById('app-frame');
    if (selector && iframe) iframe.src = selector.value || "";
}

// ==========================================
// 5. INVISIBLE PLAYER & PLAYLIST LOGIC
// ==========================================
let playlistTracks = [];
let currentTrackIndex = -1;
let loopMode = 'all';

function handleAudioUpload(event) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        playlistTracks.push({
            name: files[i].name.replace(/\.[^/.]+$/, ""),
            url: URL.createObjectURL(files[i]),
            type: 'local'
        });
    }
    renderPlaylist();
}

async function addYoutubeTrack() {
    const input = document.getElementById('yt-url');
    const status = document.getElementById('yt-status');
    const url = input.value.trim();

    if (!url) return;
    console.log("Analyzing YouTube URL...");
    status.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Fetching audio stream...';

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length == 11) ? match[2] : null;

    if (!videoId) {
        console.error("Invalid YouTube URL provided.");
        status.innerText = "Invalid URL.";
        return;
    }

    try {
        // We are using a 3rd party converter that returns a direct link
        // This is a "best-effort" API. If it fails, check the green console.
        const apiUrl = `https://api.v2.vevioz.com/@api/json/mp3/${videoId}`;
        
        console.log(`Requesting stream for ID: ${videoId}...`);
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.link) {
            playlistTracks.push({
                name: data.title || "YouTube Track",
                url: data.link,
                type: 'youtube'
            });
            console.log("Success! Track added to queue.");
            status.style.color = "var(--success)";
            status.innerText = "Track added!";
            input.value = "";
            renderPlaylist();
        } else {
            throw new Error("API did not return a streamable link.");
        }
    } catch (e) {
        console.error("YT Conversion Error: " + e.message);
        status.style.color = "var(--warning)";
        status.innerText = "Link failed. Try another video.";
    }
}

function playTrack(index) {
    if (index < 0 || index >= playlistTracks.length) return;
    
    currentTrackIndex = index;
    const player = document.getElementById('main-audio-player');
    const track = playlistTracks[index];

    console.log(`Attempting to play: ${track.name}`);

    // ERROR MONITORING
    player.onerror = () => {
        console.error(`Playback Failed: ${track.name}. The link might have expired or been blocked.`);
        // Optional: Skip to next track automatically on error
        // setTimeout(() => playTrack((currentTrackIndex + 1) % playlistTracks.length), 2000);
    };

    player.oncanplay = () => {
        console.log(`Stream Buffer Ready for: ${track.name}`);
    };

    player.src = track.url;
    
    // Some browsers require a fresh play() call after src change
    player.play().catch(err => {
        console.error("Autoplay blocked or link invalid: " + err.message);
    });

    updateControlUI(true, track.name);
    renderPlaylist();

    player.onended = () => {
        let next = (currentTrackIndex + 1) % playlistTracks.length;
        playTrack(next);
    };
}

function togglePlay() {
    const player = document.getElementById('main-audio-player');
    const btn = document.getElementById('master-play-btn');
    
    if (player.paused) {
        player.play();
        updateControlUI(true);
    } else {
        player.pause();
        updateControlUI(false);
    }
}

function updateVolume(val) {
    document.getElementById('main-audio-player').volume = val;
}

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

    container.innerHTML = playlistTracks.length === 0 ? '<p style="text-align:center; color:gray; padding:20px;">Queue is empty.</p>' : '';

    playlistTracks.forEach((track, index) => {
        const isPlaying = index === currentTrackIndex;
        const div = document.createElement('div');
        div.className = 'card';
        div.style = `padding: 12px; cursor: pointer; display: flex; align-items: center; gap: 15px; border-left: 4px solid ${isPlaying ? 'var(--primary)' : 'transparent'}; margin:0;`;
        
        div.innerHTML = `
            <i class="fa-solid ${isPlaying ? 'fa-circle-pause' : 'fa-circle-play'}" style="color: var(--primary); font-size: 20px;"></i>
            <div style="flex-grow:1;">
                <div style="font-weight: ${isPlaying ? 'bold' : 'normal'}; font-size: 14px;">${track.name}</div>
                <div style="font-size: 10px; color: var(--text-muted); text-transform: uppercase;">${track.type}</div>
            </div>
        `;
        div.onclick = () => isPlaying ? togglePlay() : playTrack(index);
        container.appendChild(div);
    });
}

function toggleConsole() {
    const DC = document.getElementById("debug-console");
    DC.style.display = DC.style.display === "none" ? "block" : "none";
}

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
        if (files.length === 0) return;

        currentZip = new JSZip();
        let count = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fullPath = file.webkitRelativePath;
            const pathParts = fullPath.split('/');
            pathParts.shift(); 
            const internalPath = pathParts.join('/');

            if (internalPath) {
                currentZip.file(internalPath, file);
                count++;
            }
        }

        status.innerText = `Prepared ${count} items.`;
        dlBtn.disabled = false;
    };

    dlBtn.onclick = async () => {
        status.innerText = "Zipping... please wait.";
        dlBtn.disabled = true;

        try {
            const blob = await currentZip.generateAsync({type: "blob"});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "bundle.zip";
            a.click();
            URL.revokeObjectURL(url);
            status.innerText = "Download complete!";
        } catch (err) {
            status.innerText = "Error: " + err.message;
            console.error(err);
        } finally {
            dlBtn.disabled = false;
        }
    };
}
