document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const loginScreen = document.getElementById('login-screen');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginError = document.getElementById('login-error');

    const osContainer = document.getElementById('os-container');
    const modeDashboard = document.getElementById('mode-dashboard');
    const modeViewContainer = document.getElementById('mode-view-container'); // Parent for mode views
    const modeViewTemplate = document.getElementById('mode-view-template'); // Template to clone

    const footerBar = document.getElementById('footer-bar');
    const currentModeDisplay = document.getElementById('current-mode-display');
    const clockElement = document.getElementById('clock');

    // --- State ---
    let currentMode = null; // e.g., 'hacker', 'student', null if dashboard is shown
    let activeModeViewElement = null; // Holds the currently displayed mode view div

    // --- Credentials ---
    const LOGIN_USERNAME = "user1";
    const LOGIN_PASSWORD = "securepasswd";
    const CHANGE_MODE_PASSWORD = "changepasswd";

    // --- Mode Definitions (Unchanged) ---
    // --- UPDATED Mode Definitions (Using <img> tags) ---
const modes = {
    hacker: {
        name: "Hacker Mode", theme: "theme-hacker",
        apps: [
            { name: "Terminal", icon: '<img src="icons/terminal.svg" class="app-icon-svg" alt="Terminal">' },
            { name: "Nmap", icon: '<img src="icons/radar.svg" class="app-icon-svg" alt="Nmap">' }, // Placeholder icon name
            { name: "Wireshark", icon: '<img src="icons/brand-surfshark.svg" class="app-icon-svg" alt="Wireshark">' }, // Placeholder icon name
            { name: "Metasploit", icon: '<img src="icons/exploit.svg" class="app-icon-svg" alt="Metasploit">' }, // Placeholder icon name
            { name: "Code Editor", icon: '<img src="icons/code.svg" class="app-icon-svg" alt="Code Editor">' },
            { name: "Tor Browser", icon: '<img src="icons/onion.svg" class="app-icon-svg" alt="Tor Browser">' }, // Placeholder icon name
            { name: "Firewall", icon: '<img src="icons/firewall.svg" class="app-icon-svg" alt="Firewall">' },
            { name: "Keylogger", icon: '<img src="icons/keyboard.svg" class="app-icon-svg" alt="Keylogger">' } // Placeholder icon name
        ]
    },
    student: {
        name: "Student Mode", theme: "theme-student",
        apps: [
            { name: "Word Processor", icon: '<img src="icons/file-word.svg" class="app-icon-svg" alt="Word Processor">' }, // Placeholder icon name
            { name: "Web Browser", icon: '<img src="icons/compass.svg" class="app-icon-svg" alt="Web Browser">' }, // Placeholder icon name
            { name: "PDF Reader", icon: '<img src="icons/file-pdf.svg" class="app-icon-svg" alt="PDF Reader">' }, // Placeholder icon name
            { name: "Presentation", icon: '<img src="icons/presentation.svg" class="app-icon-svg" alt="Presentation">' }, // Placeholder icon name
            { name: "Notepad", icon: '<img src="icons/notepad.svg" class="app-icon-svg" alt="Notepad">' },
            { name: "Calculator", icon: '<img src="icons/calculator.svg" class="app-icon-svg" alt="Calculator">' },
            { name: "Calendar", icon: '<img src="icons/calendar.svg" class="app-icon-svg" alt="Calendar">' },
            { name: "Music Player", icon: '<img src="icons/music.svg" class="app-icon-svg" alt="Music Player">' }
        ]
    },
    researcher: {
        name: "Researcher Mode", theme: "theme-researcher",
        apps: [
            { name: "Data Analysis", icon: '<img src="icons/chart-line.svg" class="app-icon-svg" alt="Data Analysis">' }, // Placeholder icon name
            { name: "Ref Manager", icon: '<img src="icons/book.svg" class="app-icon-svg" alt="Ref Manager">' }, // Placeholder icon name
            { name: "Lab Notebook", icon: '<img src="icons/microscope.svg" class="app-icon-svg" alt="Lab Notebook">' }, // Placeholder icon name
            { name: "Stats Pkg", icon: '<img src="icons/chart-bar.svg" class="app-icon-svg" alt="Stats Pkg">' }, // Placeholder icon name
            { name: "Secure Cloud", icon: '<img src="icons/cloud.svg" class="app-icon-svg" alt="Secure Cloud">' },
            { name: "Journal Access", icon: '<img src="icons/newspaper.svg" class="app-icon-svg" alt="Journal Access">' }, // Placeholder icon name
            { name: "Collaboration", icon: '<img src="icons/users.svg" class="app-icon-svg" alt="Collaboration">' }, // Placeholder icon name
            { name: "Graph Plotter", icon: '<img src="icons/chart-scatter.svg" class="app-icon-svg" alt="Graph Plotter">' } // Placeholder icon name
        ]
    },
    developer: {
        name: "Developer Mode", theme: "theme-developer",
        apps: [
            { name: "VS Code", icon: '<img src="icons/code.svg" class="app-icon-svg" alt="VS Code">' }, // Reusing code icon
            { name: "Git Client", icon: '<img src="icons/git-branch.svg" class="app-icon-svg" alt="Git Client">' }, // Placeholder icon name
            { name: "Docker", icon: '<img src="icons/docker.svg" class="app-icon-svg" alt="Docker">' }, // Placeholder icon name
            { name: "DB GUI", icon: '<img src="icons/database.svg" class="app-icon-svg" alt="DB GUI">' },
            { name: "API Tester", icon: '<img src="icons/plug.svg" class="app-icon-svg" alt="API Tester">' }, // Placeholder icon name
            { name: "DevTools", icon: '<img src="icons/wrench.svg" class="app-icon-svg" alt="DevTools">' }, // Placeholder icon name
            { name: "Terminal", icon: '<img src="icons/terminal.svg" class="app-icon-svg" alt="Terminal">' }, // Reusing terminal icon
            { name: "Compiler", icon: '<img src="icons/cogs.svg" class="app-icon-svg" alt="Compiler">' } // Placeholder icon name
        ]
    },
    guest: {
        name: "Guest Mode", theme: "theme-guest", locked: true,
        apps: [
            { name: "Web Browser", icon: '<img src="icons/compass.svg" class="app-icon-svg" alt="Web Browser">' }, // Reusing browser icon
            { name: "Image Viewer", icon: '<img src="icons/image.svg" class="app-icon-svg" alt="Image Viewer">' },
            { name: "Notepad", icon: '<img src="icons/notepad.svg" class="app-icon-svg" alt="Notepad">' }, // Reusing notepad icon
            { name: "Maps", icon: '<img src="icons/map.svg" class="app-icon-svg" alt="Maps">' }
        ]
    },
    child: {
        name: "Child Mode", theme: "theme-child", locked: true,
        apps: [
            { name: "Drawing App", icon: '<img src="icons/paint-brush.svg" class="app-icon-svg" alt="Drawing App">' }, // Placeholder icon name
            { name: "Edu Game", icon: '<img src="icons/gamepad.svg" class="app-icon-svg" alt="Edu Game">' }, // Placeholder icon name
            { name: "Story Books", icon: '<img src="icons/book-open.svg" class="app-icon-svg" alt="Story Books">' }, // Placeholder icon name
            { name: "Safe Browser", icon: '<img src="icons/shield.svg" class="app-icon-svg" alt="Safe Browser">' }, // Placeholder icon name
            { name: "Puzzles", icon: '<img src="icons/puzzle-piece.svg" class="app-icon-svg" alt="Puzzles">' }, // Placeholder icon name
            { name: "Video Player", icon: '<img src="icons/video.svg" class="app-icon-svg" alt="Video Player">' }
        ]
    }
};

// --- UPDATED createModeView Function ---
function createModeView(modeId) {
    const modeData = modes[modeId];
    if (!modeData) return null;

    const newModeView = modeViewTemplate.cloneNode(true);
    newModeView.id = `mode-view-${modeId}`;
    newModeView.classList.remove('hidden');
    newModeView.classList.remove('mode-view-template');
    newModeView.classList.add(modeData.theme);

    newModeView.querySelector('.mode-title').textContent = modeData.name;

    const appGrid = newModeView.querySelector('.app-grid');
    appGrid.innerHTML = ''; // Clear template content

    modeData.apps.forEach(app => {
        const appDiv = document.createElement('div');
        appDiv.className = 'app-icon';
        // Inject the HTML string which now contains the <img> tag
        appDiv.innerHTML = `
            ${app.icon}
            <div class="app-icon-name">${app.name}</div>
        `;
        appDiv.addEventListener('click', () => alert(`Launched ${app.name} (simulation)`));
        appGrid.appendChild(appDiv);
    });

    const changeModeBtn = newModeView.querySelector('.change-mode-button');
    changeModeBtn.addEventListener('click', handleChangeModeRequest);

    return newModeView;
}

// --- Keep the rest of your script.js the same ---
// (DOMContentLoaded listener, other functions like handleLogin, showDashboard, etc.)


    // --- Functions ---

    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (clockElement) {
             clockElement.textContent = timeString;
        }
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = usernameInput.value.trim();
        const password = passwordInput.value;

        if (username === LOGIN_USERNAME && password === LOGIN_PASSWORD) {
            loginScreen.classList.add('hidden');
            osContainer.classList.remove('hidden');
            showDashboard();
            setInterval(updateClock, 1000);
            updateClock();
        } else {
            loginError.textContent = "Invalid username or password.";
            passwordInput.value = "";
        }
    }

    function showDashboard() {
        // Hide any active mode view
        if (activeModeViewElement) {
            activeModeViewElement.classList.remove('active-view');
            // We don't strictly need to add 'hidden', as the container controls visibility
            // Optional: remove the element from DOM after transition ends
            setTimeout(() => {
                if (activeModeViewElement && !activeModeViewElement.classList.contains('active-view')) {
                    modeViewContainer.removeChild(activeModeViewElement);
                    activeModeViewElement = null;
                }
            }, 400); // Match CSS transition duration
        }

        // Show dashboard (it's inside the main container now)
        modeDashboard.classList.add('active-view');

        currentMode = null;
        currentModeDisplay.textContent = "Mode: Dashboard";
        // No theme class needed on os-container itself anymore
    }

    function createModeView(modeId) {
        const modeData = modes[modeId];
        if (!modeData) return null;

        const newModeView = modeViewTemplate.cloneNode(true);
        newModeView.id = `mode-view-${modeId}`;
        newModeView.classList.remove('hidden'); // Make it ready
        newModeView.classList.remove('mode-view-template'); // Remove template class if needed
        newModeView.classList.add(modeData.theme); // Apply theme class directly to the view

        newModeView.querySelector('.mode-title').textContent = modeData.name;

        const appGrid = newModeView.querySelector('.app-grid');
        appGrid.innerHTML = ''; // Clear template content

        modeData.apps.forEach(app => {
            const appDiv = document.createElement('div');
            appDiv.className = 'app-icon';
            appDiv.innerHTML = `
                <div class="app-icon-img">${app.icon}</div>
                <div class="app-icon-name">${app.name}</div>
            `;
            appDiv.addEventListener('click', () => alert(`Launched ${app.name} (simulation)`));
            appGrid.appendChild(appDiv);
        });

        const changeModeBtn = newModeView.querySelector('.change-mode-button');
        changeModeBtn.addEventListener('click', handleChangeModeRequest);

        return newModeView;
    }


    function switchToMode(modeId) {
        const modeData = modes[modeId];
        if (!modeData) return;

        // Hide dashboard
        modeDashboard.classList.remove('active-view');

        // Hide previous mode view immediately (or start fade out)
        if (activeModeViewElement) {
             activeModeViewElement.classList.remove('active-view');
              // Optional: Remove the previous view from DOM after transition
            setTimeout(() => {
                if (activeModeViewElement && !activeModeViewElement.classList.contains('active-view')) {
                    modeViewContainer.removeChild(activeModeViewElement);
                }
            }, 400); // Match CSS transition duration
        }

        // Create the new view
        const targetModeView = createModeView(modeId);
        if (!targetModeView) {
            console.error("Failed to create mode view for:", modeId);
            showDashboard();
            return;
        }

        // Add the new view to the container (it starts hidden via CSS opacity/visibility)
        modeViewContainer.appendChild(targetModeView);

        // Force reflow/repaint before adding active class for transition
        void targetModeView.offsetWidth;

        // Show the target mode view by adding active class (triggers transition)
        targetModeView.classList.add('active-view');
        activeModeViewElement = targetModeView; // Track the active view element

        currentMode = modeId;
        currentModeDisplay.textContent = `Mode: ${modeData.name}`;
    }

    function handleChangeModeRequest() {
        const modeData = modes[currentMode];

        if (modeData && modeData.locked) {
            const password = prompt(`Password required to exit ${modeData.name}:`);
            if (password === CHANGE_MODE_PASSWORD) {
                showDashboard();
            } else if (password !== null) {
                alert("Incorrect password. Cannot change mode.");
            }
        } else {
            showDashboard();
        }
    }


    // --- Event Listeners ---
    loginForm.addEventListener('submit', handleLogin);

    document.querySelectorAll('.mode-button').forEach(button => {
        button.addEventListener('click', () => {
            const modeId = button.getAttribute('data-mode');
            switchToMode(modeId);
        });
    });

    // Initial Setup - Clock update
    updateClock(); // Call once immediately in case login is fast

}); // End DOMContentLoaded
