// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "Custom chat system for Roblox with advanced commands and configuration.",
        size: null // Will be detected automatically
    }
    // Add more models here if needed
];

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let settings = JSON.parse(localStorage.getItem('rsm_settings') || '{}');

// Default settings
const defaultSettings = {
    theme: 'dark',
    primaryColor: '#4CAF50',
    language: 'en',
    autoSize: true
};

// ===== INITIALIZE APP =====
function initApp() {
    console.log('Initializing RSM App...');
    
    // Merge with default settings
    settings = { ...defaultSettings, ...settings };
    
    // Apply saved settings
    applySettings();
    
    // Setup all event listeners
    setupEventListeners();
    
    // Load models immediately
    loadModels(true);
    
    // Update statistics
    updateStats();
    
    // Check URL for section
    checkUrlHash();
    
    console.log('RSM App initialized successfully');
}

// ===== APPLY SETTINGS =====
function applySettings() {
    console.log('Applying settings:', settings);
    
    // Apply theme
    const themeToggle = document.getElementById('theme-toggle');
    if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        if (themeToggle) themeToggle.checked = true;
    }
    
    // Apply primary color
    if (settings.primaryColor) {
        document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
        const colorSelect = document.getElementById('color-select');
        if (colorSelect) colorSelect.value = settings.primaryColor;
        updateHoverColor(settings.primaryColor);
    }
    
    // Apply language
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = settings.language;
    }
    
    // Apply auto-size
    const autoSizeToggle = document.getElementById('auto-size');
    if (autoSizeToggle) {
        autoSizeToggle.checked = settings.autoSize !== false;
    }
}

// ===== UPDATE HOVER COLOR =====
function updateHoverColor(color) {
    try {
        const hex = color.replace('#', '');
        if (hex.length !== 6) return;
        
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 30);
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 30);
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 30);
        
        const hoverColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
        document.documentElement.style.setProperty('--primary-hover', hoverColor);
    } catch (error) {
        console.warn('Error updating hover color:', error);
    }
}

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Navigation menu
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active from all
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Get section
            const section = this.getAttribute('data-section');
            console.log('Navigating to:', section);
            
            // Show section
            showSection(section);
            
            // Update URL
            window.location.hash = section;
        });
    });
    
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            console.log('Theme toggled:', this.checked ? 'light' : 'dark');
            if (this.checked) {
                document.body.classList.add('light-mode');
                settings.theme = 'light';
            } else {
                document.body.classList.remove('light-mode');
                settings.theme = 'dark';
            }
            saveSettings();
        });
    }
    
    // Color select
    const colorSelect = document.getElementById('color-select');
    if (colorSelect) {
        colorSelect.addEventListener('change', function() {
            const color = this.value;
            console.log('Color changed to:', color);
            document.documentElement.style.setProperty('--primary-color', color);
            updateHoverColor(color);
            settings.primaryColor = color;
            saveSettings();
        });
    }
    
    // Language select
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            settings.language = this.value;
            console.log('Language changed to:', this.value);
            saveSettings();
            // Language change logic would go here
        });
    }
    
    // Reset button
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            if (confirm('Reset all download counters?')) {
                downloads = {};
                localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
                loadModels();
                updateStats();
                alert('Download counters reset!');
            }
        });
    }
    
    // Auto-size toggle
    const autoSizeToggle = document.getElementById('auto-size');
    if (autoSizeToggle) {
        autoSizeToggle.addEventListener('change', function() {
            settings.autoSize = this.checked;
            console.log('Auto-size:', this.checked ? 'enabled' : 'disabled');
            saveSettings();
            if (this.checked) {
                loadModels(true);
            }
        });
    }
    
    // Hash change listener
    window.addEventListener('hashchange', checkUrlHash);
    
    console.log('Event listeners setup complete');
}

// ===== CHECK URL HASH =====
function checkUrlHash() {
    const hash = window.location.hash.substring(1);
    console.log('URL hash detected:', hash);
    
    if (hash && ['home', 'models', 'configs'].includes(hash)) {
        // Update menu
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === hash) {
                link.classList.add('active');
            }
        });
        
        // Show section
        showSection(hash);
    } else {
        // Default to home
        showSection('home');
    }
}

// ===== SHOW SECTION =====
function showSection(section) {
    console.log('Showing section:', section);
    
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = section;
        
        // Update page title
        document.title = `RSM - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        
        // Load models if needed
        if (section === 'models') {
            console.log('Loading models for models section...');
            loadModels();
        }
        
        // Update stats if needed
        if (section === 'home') {
            updateStats();
        }
    }
}

// ===== LOAD MODELS =====
async function loadModels(detectSize = false) {
    const container = document.getElementById('models-container');
    
    if (!container) {
        console.error('ERROR: models-container not found!');
        return;
    }
    
    console.log('Loading models... Container found:', !!container);
    console.log('Number of models:', models.length);
    
    // Clear container
    container.innerHTML = '';
    
    // Show message if no models
    if (models.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No models available.</p>';
        console.log('No models to display');
        return;
    }
    
    // Process each model
    for (const model of models) {
        console.log('Processing model:', model.name);
        
        // Detect file size if enabled
        if (detectSize && settings.autoSize !== false) {
            try {
                console.log('Detecting size for:', model.filename);
                const size = await getFileSize(`worlds/${model.filename}`);
                model.size = size;
                console.log('Size detected:', size);
            } catch (error) {
                model.size = 'Unknown';
                console.warn('Could not detect size:', error);
            }
        }
        
        // Create model card
        const card = createModelCard(model);
        if (card) {
            container.appendChild(card);
        }
    }
    
    console.log('Models loaded successfully');
}

// ===== CREATE MODEL CARD =====
function createModelCard(model) {
    const card = document.createElement('div');
    card.className = 'model-card';
    
    const downloadCount = downloads[model.id] || 0;
    
    card.innerHTML = `
        <h3>${model.name}</h3>
        <p>${model.description}</p>
        <div class="model-info">
            <span><strong>Size:</strong> ${model.size || 'Loading...'}</span>
            <span><strong>Downloads:</strong> ${downloadCount}</span>
            <span><strong>Format:</strong> .rbxl</span>
        </div>
        <a href="worlds/${model.filename}" class="download-btn" download 
           onclick="RSM.registerDownload(${model.id}); return true;">
            Download
        </a>
    `;
    
    return card;
}

// ===== GET FILE SIZE =====
async function getFileSize(url) {
    return new Promise((resolve) => {
        // Try HEAD request first
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    const size = response.headers.get('content-length');
                    if (size) {
                        resolve(formatSize(parseInt(size)));
                        return;
                    }
                }
                // Fallback to fetch with blob
                return fetch(url);
            })
            .then(response => {
                if (response && response.ok) {
                    return response.blob();
                }
                return null;
            })
            .then(blob => {
                if (blob) {
                    resolve(formatSize(blob.size));
                } else {
                    resolve('Unknown');
                }
            })
            .catch(error => {
                console.warn('File size detection failed:', error);
                resolve('Unknown');
            });
    });
}

// ===== FORMAT SIZE =====
function formatSize(bytes) {
    if (isNaN(bytes) || bytes === 0) return '0 B';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    if (i === 0) return `${bytes} ${units[i]}`;
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

// ===== REGISTER DOWNLOAD =====
function registerDownload(modelId) {
    console.log('Registering download for model:', modelId);
    
    // Increment counter
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    
    // Save to localStorage
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Update stats
    updateStats();
    
    // Reload models to update counter display
    if (currentSection === 'models') {
        setTimeout(() => loadModels(), 100);
    }
    
    console.log(`Model ${modelId} downloaded ${downloads[modelId]} times`);
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    console.log('Updating statistics...');
    
    // Total models
    const totalModelsEl = document.getElementById('total-models');
    if (totalModelsEl) {
        totalModelsEl.textContent = models.length;
    }
    
    // Calculate total size
    calculateTotalSize().then(totalSize => {
        const totalSizeEl = document.getElementById('total-size');
        if (totalSizeEl) {
            totalSizeEl.textContent = totalSize;
        }
    });
}

// ===== CALCULATE TOTAL SIZE =====
async function calculateTotalSize() {
    let totalBytes = 0;
    let processed = 0;
    
    for (const model of models) {
        if (model.size && model.size !== 'Unknown') {
            const match = model.size.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/i);
            if (match) {
                let bytes = parseFloat(match[1]);
                const unit = match[2].toUpperCase();
                
                switch(unit) {
                    case 'GB': bytes *= 1024 * 1024 * 1024; break;
                    case 'MB': bytes *= 1024 * 1024; break;
                    case 'KB': bytes *= 1024; break;
                }
                
                totalBytes += bytes;
                processed++;
            }
        }
    }
    
    console.log(`Processed ${processed} model sizes, total: ${totalBytes} bytes`);
    return formatSize(totalBytes);
}

// ===== SAVE SETTINGS =====
function saveSettings() {
    localStorage.setItem('rsm_settings', JSON.stringify(settings));
    console.log('Settings saved:', settings);
}

// ===== PUBLIC API =====
window.RSM = {
    initApp,
    registerDownload,
    loadModels,
    updateStats,
    showSection,
    getFileSize,
    formatSize
};

// ===== INITIALIZE =====
// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded, initializing app...');
        initApp();
    });
} else {
    console.log('DOM already loaded, initializing app...');
    initApp();
}

// Debug info
console.log('RSM script loaded successfully');
console.log('Models configured:', models.length);
console.log('Current settings:', settings);
