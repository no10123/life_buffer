// ==========================================
// 1. SETTINGS & PERSONALIZATION LOGIC
// ==========================================
applySavedSettings(); // Run immediately on load

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
// 2. DYNAMIC PAGE ROUTING (SPA LOGIC)
// ==========================================
async function loadPage(pageName) {
    const contentArea = document.getElementById('main-content-area');
    
    try {
        const response = await fetch(`pages/${pageName}.html?v=${Date.now()}`);
        if (!response.ok) throw new Error("Page not found");
        
        const html = await response.json(); // If using a JSON api, otherwise use .text()
        const text = await response.text();

        // 1. Inject the HTML
        contentArea.innerHTML = text;

        // 2. Extract and run Scripts
        const scripts = contentArea.querySelectorAll("script");
        scripts.forEach(oldScript => {
            const newScript = document.createElement("script");
            
            // Copy attributes (src, type, etc.)
            Array.from(oldScript.attributes).forEach(attr => {
                newScript.setAttribute(attr.name, attr.value);
            });

            // Copy inline code
            newScript.appendChild(document.createTextNode(oldScript.innerHTML));
            
            // Remove the "dead" script and add the "live" one
            oldScript.parentNode.removeChild(oldScript);
            document.body.appendChild(newScript);
        });

        console.log(`Successfully initialized page: ${pageName}`);
        
    } catch (err) {
        contentArea.innerHTML = `<div class="card"><h1>404</h1><p>Page not found.</p></div>`;
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
function loadCanvasData() {
    const container = document.getElementById('canvas-data');
    if(!container || container.children.length > 0) return; 
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted);"><i class="fa-solid fa-spinner fa-spin"></i> Fetching Canvas data...</p>';

    setTimeout(() => {
        container.innerHTML = `
            <div class="card animate-slide-up"><div style="display: flex; justify-content: space-between;"><h3>AP US History</h3><i class="fa-solid fa-book-journal-whills" style="color: var(--primary); font-size: 20px;"></i></div><p><strong>To Do:</strong> Chapter 10 Essay</p><p><strong>Due:</strong> Tomorrow</p></div>
            <div class="card animate-slide-up" style="animation-delay: 0.1s;"><div style="display: flex; justify-content: space-between;"><h3>Calculus</h3><i class="fa-solid fa-calculator" style="color: var(--primary); font-size: 20px;"></i></div><p><strong>To Do:</strong> Problem Set 4</p><p><strong>Due:</strong> Friday</p></div>
        `;
    }, 800);
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

async function initSidebar() {
    const sidebarNav = document.getElementById('sidebar-nav'); // Ensure your <ul> has this ID
    try {
        const response = await fetch(`${HAC_PROXY_URL}/api/pages`);
        const apps = await response.json();

        sidebarNav.innerHTML = apps.map(app => `
            <li class="nav-item" onclick="loadPage('${app.id}')">
                <i class="fa-solid ${app.icon}"></i>
                <span>${app.name}</span>
            </li>
        `).join('');
    } catch (err) {
        console.error("Failed to load dynamic menu:", err);
    }
}