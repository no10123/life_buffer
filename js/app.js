document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
});

function initApp() {
    // Default load
    loadView('workspace');

    // Listen for global navigation events if needed
    window.addEventListener('hashchange', handleHashChange);
}

function handleHashChange() {
    const hash = window.location.hash.substring(1); // remove #
    if (hash) {
        loadModule(hash);
    }
}

// Loads the main shell
async function loadView(viewName) {
    const app = document.getElementById('app');
    try {
        const response = await fetch(`views/${viewName}.html`);
        const html = await response.text();
        app.innerHTML = html;
        
        // If loading workspace, set up the internal routing
        if(viewName === 'workspace') {
            setupWorkspaceNav();
            // Load default inner module
            loadModule('view-editor'); 
        }
    } catch (e) {
        console.error("Error loading view:", e);
        app.innerHTML = "<p>Error loading application.</p>";
    }
}

// Loads inner modules into the workspace viewport
async function loadModule(moduleName) {
    const viewport = document.getElementById('main-viewport');
    if (!viewport) return;

    try {
        const response = await fetch(`views/${moduleName}.html`);
        const html = await response.text();
        viewport.innerHTML = html;

        // Trigger module specific JS initialization
        if (moduleName === 'view-editor') window.AtlasEditor.init();
        if (moduleName === 'view-dice') window.AtlasDice.init();
        if (moduleName === 'view-map') window.AtlasMap.init();

        // Re-render MathJax
        if (window.MathJax) MathJax.typesetPromise();

    } catch (e) {
        console.error("Error loading module:", e);
    }
}

function setupWorkspaceNav() {
    document.querySelectorAll('[data-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const target = e.target.getAttribute('data-target');
            loadModule(target);
            
            // Update UI active state
            document.querySelectorAll('.nav-links button').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
}