// --- UI Navigation Logic ---
function showSection(sectionId, btnElement) {
    // 1. Update Sidebar Active States
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    // 2. Hide all sections
    const sections = document.querySelectorAll('main section');
    sections.forEach(section => {
        section.classList.remove('active-section');
        section.classList.remove('animate-fade-in');
        section.classList.add('hidden-section');
    });

    // 3. Show the targeted section and animate
    const activeSection = document.getElementById(sectionId);
    activeSection.classList.remove('hidden-section');
    activeSection.classList.add('active-section');
    
    // Force reflow to restart animation
    void activeSection.offsetWidth; 
    activeSection.classList.add('animate-fade-in');

    // 4. Trigger data fetches based on the tab opened
    if (sectionId === 'canvas') loadCanvasData();
    if (sectionId === 'hac') loadHacData();
}

// --- Iframe Logic ---
function loadIframeApp() {
    const selector = document.getElementById('app-selector');
    const iframe = document.getElementById('app-frame');
    const url = selector.value;
    
    if (url) {
        iframe.src = url;
    } else {
        iframe.src = "";
    }
}

// --- Data Stream Logic (Mock API Calls) ---

async function loadCanvasData() {
    const canvasContainer = document.getElementById('canvas-data');
    
    // Only load if empty to prevent re-fetching every single click during testing
    if(canvasContainer.children.length > 0) return; 

    canvasContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching Canvas data...</p>';

    setTimeout(() => {
        const mockCanvasApiData = [
            { course: "AP US History", assignment: "Chapter 10 Essay", due: "Tomorrow", icon: "fa-book-journal-whills" },
            { course: "Calculus", assignment: "Problem Set 4", due: "Friday", icon: "fa-calculator" },
            { course: "Physics", assignment: "Lab Report", due: "Next Monday", icon: "fa-atom" }
        ];

        canvasContainer.innerHTML = ''; 
        
        mockCanvasApiData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card animate-slide-up';
            card.style.animationDelay = `${index * 0.1}s`; // Staggered animation
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <h3>${item.course}</h3>
                    <i class="fa-solid ${item.icon}" style="color: var(--primary); font-size: 20px;"></i>
                </div>
                <p><strong><i class="fa-regular fa-clipboard"></i> To Do:</strong> ${item.assignment}</p>
                <p><strong><i class="fa-regular fa-clock"></i> Due:</strong> ${item.due}</p>
            `;
            canvasContainer.appendChild(card);
        });
    }, 800);
}

async function loadHacData() {
    const hacContainer = document.getElementById('hac-data');
    
    if(hacContainer.children.length > 0) return;

    hacContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Syncing with HAC...</p>';

    setTimeout(() => {
        const mockHacApiData = [
            { class: "AP US History", grade: "94%", status: "A" },
            { class: "Calculus", grade: "88%", status: "B" },
            { class: "Physics", grade: "91%", status: "A" },
            { class: "English Lit", grade: "97%", status: "A" }
        ];

        hacContainer.innerHTML = ''; 
        
        mockHacApiData.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'card animate-slide-up';
            card.style.animationDelay = `${index * 0.1}s`;
            
            // Dynamic color based on grade
            let gradeColor = item.status === 'A' ? 'var(--success)' : 'var(--warning)';

            card.innerHTML = `
                <h3>${item.class}</h3>
                <h2 style="color: ${gradeColor}; font-size: 2.5rem; margin-top: 10px; font-weight: 700;">${item.grade}</h2>
                <p style="margin-top: 10px; font-size: 12px;"><i class="fa-solid fa-arrow-trend-up"></i> Last updated 2 mins ago</p>
            `;
            hacContainer.appendChild(card);
        });
    }, 1000);
}

function handleCredentialResponse(response) {
    // response.credential contains a JWT (JSON Web Token)
    console.log("Encoded JWT ID token: " + response.credential);
    
    // You would typically decode this token to get their name/email, 
    // or send it to your backend to log them in securely.
    alert("Successfully authenticated with Google!");
    
    // Hide the auth warning banner
    document.querySelector('.auth-warning').style.display = 'none';
}

// --- Google API Logic ---
const CLIENT_ID = '218198682167-8u3rjqchskh0q1f5nnbahs43hddaa51h.apps.googleusercontent.com'; // PASTE YOUR CLIENT ID HERE!
const SCOPES = 'https://www.googleapis.com/auth/gmail.readonly';

let tokenClient;
let accessToken = null;

// Initialize the Google Token Client when the window loads
window.onload = function () {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (tokenResponse) => {
            if (tokenResponse && tokenResponse.access_token) {
                accessToken = tokenResponse.access_token;
                document.getElementById('auth-gmail-btn').style.display = 'none'; // Hide auth button
                fetchEmails(); // Fetch the emails now that we have permission
            }
        },
    });
};

function authorizeGmail() {
    // If we haven't built the tokenClient yet, build it now
    if (!tokenClient) {
        try {
            tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: SCOPES,
                callback: (tokenResponse) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        accessToken = tokenResponse.access_token;
                        document.getElementById('auth-gmail-btn').style.display = 'none';
                        fetchEmails(); 
                    }
                },
            });
        } catch (error) {
            console.error("Google library not loaded yet!", error);
            alert("Google login is still loading. Please try again in a second.");
            return;
        }
    }
    
    // Trigger the popup
    tokenClient.requestAccessToken();
}

let nextPageToken = null; 
// Keeps track of where we left off
async function fetchEmails(loadMore = false) {
    const gmailContainer = document.getElementById('gmail-data');
    
    if (!loadMore) {
        gmailContainer.innerHTML = '<p style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your inbox...</p>';
    }

    if (!accessToken) return;

    try {
        // Build the URL, adding the page token if we are loading more
        let url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=10';
        if (loadMore && nextPageToken) {
            url += `&pageToken=${nextPageToken}`;
        }

        const listResponse = await fetch(url, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = await listResponse.json();

        if (!loadMore) gmailContainer.innerHTML = ''; // Clear loading text
        
        // Save the token for the next batch
        nextPageToken = listData.nextPageToken || null;

        if (!listData.messages || listData.messages.length === 0) {
            gmailContainer.innerHTML += '<p>No more emails found.</p>';
            return;
        }

        // Fetch details for each message (requesting "full" format now)
        for (const message of listData.messages) {
            const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const msgData = await msgResponse.json();

            let subject = "No Subject";
            let from = "Unknown Sender";
            
            msgData.payload.headers.forEach(header => {
                if (header.name === 'Subject') subject = header.value;
                if (header.name === 'From') from = header.value;
            });

            // Extract the body using our helper function
            const fullBody = getEmailBody(msgData.payload);

            const card = document.createElement('div');
            card.className = 'card animate-slide-up';
            card.style.cursor = 'pointer'; // Make it look clickable
            
            // The Header (Clickable) + The Hidden Body
            card.innerHTML = `
                <div onclick="toggleEmail(this)">
                    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                        <i class="fa-solid fa-envelope" style="color: var(--primary); font-size: 20px;"></i>
                        <h3 style="margin: 0; font-size: 16px;">${subject}</h3>
                    </div>
                    <p style="color: var(--text-muted); font-size: 14px; margin: 0;"><strong>From:</strong> ${from}</p>
                </div>
                <div class="email-body-content" style="display: none;">
                    ${fullBody}
                </div>
            `;
            gmailContainer.appendChild(card);
        }

        // Add or update the "Load More" button at the bottom
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

// Decodes Google's specific Base64URL format
function decodeBase64(str) {
    try {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        return decodeURIComponent(escape(window.atob(base64)));
    } catch (e) {
        return "Error decoding email body.";
    }
}

// Digs through the email payload to find the actual text or HTML
function getEmailBody(payload) {
    let bodyText = '';
    
    if (payload.parts) {
        // Look for plain text first to keep the UI clean, fallback to HTML
        let part = payload.parts.find(p => p.mimeType === 'text/plain') || 
                   payload.parts.find(p => p.mimeType === 'text/html');
        
        if (part && part.body && part.body.data) {
            bodyText = decodeBase64(part.body.data);
        } else {
            // If it's deeply nested, dig deeper
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
    
    return bodyText || "No readable content found.";
}

// Toggles the email body open and closed
function toggleEmail(element) {
    const bodyDiv = element.nextElementSibling;
    if (bodyDiv.style.display === "none") {
        bodyDiv.style.display = "block";
    } else {
        bodyDiv.style.display = "none";
    }
}