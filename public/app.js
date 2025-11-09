// Social Media Blocker - Client-side JavaScript

let timerInterval = null;
let remainingSeconds = 0;
let isBlocking = false;
let blockedSites = new Set();

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadBlockedSites();
});

function initializeEventListeners() {
    // Timer preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const minutes = parseInt(btn.dataset.minutes);
            setTimer(minutes);
        });
    });

    // Custom timer
    document.getElementById('setCustomTimer').addEventListener('click', () => {
        const minutes = parseInt(document.getElementById('customMinutes').value);
        if (minutes && minutes > 0 && minutes <= 240) {
            setTimer(minutes);
            document.getElementById('customMinutes').value = '';
        } else {
            alert('Please enter a valid time between 1 and 240 minutes');
        }
    });

    // Timer controls
    document.getElementById('startTimer').addEventListener('click', startFocusSession);
    document.getElementById('stopTimer').addEventListener('click', stopFocusSession);

    // Site toggles
    document.querySelectorAll('.site-toggle').forEach(toggle => {
        toggle.addEventListener('change', handleSiteToggle);
    });

    // Add custom site
    document.getElementById('addCustomSite').addEventListener('click', addCustomSite);
    
    // Allow Enter key to add custom site
    document.getElementById('customSiteUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addCustomSite();
        }
    });
}

function setTimer(minutes) {
    remainingSeconds = minutes * 60;
    updateTimerDisplay();
    document.getElementById('timerStatus').textContent = `${minutes} minutes set - Ready to start`;
    document.getElementById('startTimer').disabled = false;
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    document.getElementById('timerDisplay').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function startFocusSession() {
    if (remainingSeconds === 0) {
        alert('Please set a timer duration first');
        return;
    }

    // Get all enabled sites
    const enabledSites = [];
    document.querySelectorAll('.site-toggle:checked').forEach(toggle => {
        const siteCard = toggle.closest('.site-card');
        const siteName = siteCard.querySelector('.site-name').textContent;
        const siteUrl = siteCard.dataset.site;
        enabledSites.push({ name: siteName, url: siteUrl });
        blockedSites.add(siteUrl);
    });

    if (enabledSites.length === 0) {
        alert('Please select at least one site to block');
        return;
    }

    isBlocking = true;
    updateBlockingStatus(true);
    updateBlockedSitesList();

    // Disable controls
    document.getElementById('startTimer').disabled = true;
    document.getElementById('stopTimer').disabled = false;
    document.querySelectorAll('.preset-btn').forEach(btn => btn.disabled = true);
    document.getElementById('setCustomTimer').disabled = true;
    document.querySelectorAll('.site-toggle').forEach(toggle => toggle.disabled = true);

    // Start countdown
    timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();
        
        if (remainingSeconds <= 0) {
            stopFocusSession();
            showCompletionMessage();
        }
    }, 1000);

    document.getElementById('timerStatus').textContent = '🔒 Focus session active - Stay focused!';

    // Save session to database
    saveSession(enabledSites, remainingSeconds / 60);
}

function stopFocusSession() {
    clearInterval(timerInterval);
    timerInterval = null;
    isBlocking = false;
    blockedSites.clear();
    
    updateBlockingStatus(false);
    updateBlockedSitesList();

    // Re-enable controls
    document.getElementById('startTimer').disabled = false;
    document.getElementById('stopTimer').disabled = true;
    document.querySelectorAll('.preset-btn').forEach(btn => btn.disabled = false);
    document.getElementById('setCustomTimer').disabled = false;
    document.querySelectorAll('.site-toggle').forEach(toggle => toggle.disabled = false);

    document.getElementById('timerStatus').textContent = 'Session ended';
}

function showCompletionMessage() {
    document.getElementById('timerStatus').textContent = '🎉 Focus session completed! Great work!';
    setTimeout(() => {
        document.getElementById('timerStatus').textContent = 'Ready to focus';
    }, 5000);
}

function updateBlockingStatus(active) {
    const statusIndicator = document.getElementById('blockingStatus');
    const statusDot = statusIndicator.querySelector('.status-dot');
    const statusText = statusIndicator.querySelector('.status-text');

    if (active) {
        statusDot.classList.remove('inactive');
        statusDot.classList.add('active');
        statusText.textContent = 'Actively blocking';
    } else {
        statusDot.classList.remove('active');
        statusDot.classList.add('inactive');
        statusText.textContent = 'Not blocking';
    }
}

function updateBlockedSitesList() {
    const listElement = document.getElementById('blockedSitesList');
    
    if (blockedSites.size === 0) {
        listElement.innerHTML = '<li class="empty-state">No sites blocked. Start a focus session to block selected sites.</li>';
        return;
    }

    listElement.innerHTML = '';
    blockedSites.forEach(site => {
        const li = document.createElement('li');
        li.textContent = site;
        listElement.appendChild(li);
    });
}

function handleSiteToggle(event) {
    const toggle = event.target;
    const siteCard = toggle.closest('.site-card');
    const siteName = siteCard.querySelector('.site-name').textContent;
    
    if (toggle.checked) {
        siteCard.classList.add('selected');
        console.log(`${siteName} will be blocked during focus sessions`);
    } else {
        siteCard.classList.remove('selected');
        console.log(`${siteName} will not be blocked`);
    }
}

function addCustomSite() {
    const input = document.getElementById('customSiteUrl');
    let url = input.value.trim();
    
    if (!url) {
        alert('Please enter a website URL');
        return;
    }

    // Clean up URL
    url = url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    if (!url.includes('.')) {
        alert('Please enter a valid domain (e.g., example.com)');
        return;
    }

    // Check if site already exists
    const existingSite = document.querySelector(`[data-site="${url}"]`);
    if (existingSite) {
        alert('This site is already in your list');
        return;
    }

    // Create new site card
    const sitesGrid = document.getElementById('sitesGrid');
    const siteCard = document.createElement('div');
    siteCard.className = 'site-card';
    siteCard.dataset.site = url;
    
    siteCard.innerHTML = `
        <div class="site-info">
            <span class="site-icon">🌐</span>
            <span class="site-name">${url}</span>
        </div>
        <label class="toggle-switch">
            <input type="checkbox" class="site-toggle">
            <span class="toggle-slider"></span>
        </label>
        <button class="remove-site-btn" title="Remove site">×</button>
    `;
    
    sitesGrid.appendChild(siteCard);
    
    // Add event listeners
    const toggle = siteCard.querySelector('.site-toggle');
    toggle.addEventListener('change', handleSiteToggle);
    
    const removeBtn = siteCard.querySelector('.remove-site-btn');
    removeBtn.addEventListener('click', () => {
        if (confirm(`Remove ${url} from your list?`)) {
            siteCard.remove();
        }
    });
    
    input.value = '';
    console.log(`Added custom site: ${url}`);
}

function loadBlockedSites() {
    // Load saved preferences from localStorage
    const saved = localStorage.getItem('blockedSitesPreferences');
    if (saved) {
        try {
            const preferences = JSON.parse(saved);
            preferences.forEach(site => {
                const siteCard = document.querySelector(`[data-site="${site}"]`);
                if (siteCard) {
                    const toggle = siteCard.querySelector('.site-toggle');
                    toggle.checked = true;
                    siteCard.classList.add('selected');
                }
            });
        } catch (e) {
            console.error('Error loading preferences:', e);
        }
    }
}

function saveSession(sites, duration) {
    const sessionData = {
        sites: sites,
        duration: duration,
        startTime: new Date().toISOString()
    };

    // Save to localStorage
    const sessions = JSON.parse(localStorage.getItem('focusSessions') || '[]');
    sessions.unshift(sessionData);
    if (sessions.length > 10) sessions.pop();
    localStorage.setItem('focusSessions', JSON.stringify(sessions));

    // Save current preferences
    const enabledSites = Array.from(document.querySelectorAll('.site-toggle:checked'))
        .map(toggle => toggle.closest('.site-card').dataset.site);
    localStorage.setItem('blockedSitesPreferences', JSON.stringify(enabledSites));

    // Optionally save to database
    fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
    }).catch(err => console.log('Could not save to database:', err));
}

// Warning message for blocked sites
function showBlockedSiteWarning(siteName) {
    const warning = document.createElement('div');
    warning.className = 'blocked-warning';
    warning.innerHTML = `
        <h2>🛡️ Site Blocked</h2>
        <p><strong>${siteName}</strong> is blocked during your focus session.</p>
        <p>Stay focused! You can access this site after your session ends.</p>
    `;
    document.body.appendChild(warning);
    
    setTimeout(() => warning.remove(), 3000);
}
