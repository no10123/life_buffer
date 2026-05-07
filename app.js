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
const CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID_HERE'; // PASTE YOUR CLIENT ID HERE!
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
    // This triggers the Google popup asking for permission to read emails
    tokenClient.requestAccessToken();
}

async function fetchEmails() {
    const gmailContainer = document.getElementById('gmail-data');
    gmailContainer.innerHTML = '<p style="color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching your latest emails...</p>';

    if (!accessToken) return;

    try {
        // 1. Ask Google for a list of the 5 most recent message IDs
        const listResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = await listResponse.json();

        if (!listData.messages || listData.messages.length === 0) {
            gmailContainer.innerHTML = '<p>Your inbox is empty!</p>';
            return;
        }

        gmailContainer.innerHTML = ''; // Clear loading text

        // 2. Loop through each message ID and fetch its details
        for (const message of listData.messages) {
            const msgResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const msgData = await msgResponse.json();

            // Extract Subject and Sender from the messy metadata headers
            let subject = "No Subject";
            let from = "Unknown Sender";
            
            msgData.payload.headers.forEach(header => {
                if (header.name === 'Subject') subject = header.value;
                if (header.name === 'From') from = header.value;
            });

            // 3. Create the UI card for the email
            const card = document.createElement('div');
            card.className = 'card animate-slide-up';
            card.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                    <i class="fa-solid fa-envelope-open-text" style="color: var(--accent-color); font-size: 20px;"></i>
                    <h3 style="margin: 0; font-size: 18px;">${subject}</h3>
                </div>
                <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 8px;"><strong>From:</strong> ${from}</p>
                <p style="font-size: 14px;">${msgData.snippet}...</p>
            `;
            gmailContainer.appendChild(card);
        }
    } catch (error) {
        console.error("Error fetching emails:", error);
        gmailContainer.innerHTML = '<p style="color: var(--warning);">Failed to fetch emails. Check the console for details.</p>';
    }
}
