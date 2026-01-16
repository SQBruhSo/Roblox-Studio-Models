// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "Custom chat system for Roblox with advanced commands and configuration.",
        size: null
    }
];

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let settings = JSON.parse(localStorage.getItem('rsm_settings') || '{}');

// Default settings
const defaultSettings = {
    theme: 'dark',
    fontSize: 16
};

// ===== SHOW SECTION (GLOBAL FUNCTION) =====
function showSection(section) {
    console.log('📄 Showing section:', section);
    
    // Update menu
    document.querySelectorAll('.menu-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Mark active link
    document.querySelector(`.menu-link[onclick*="${section}"]`).classList.add('active');
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    // Show selected section
    const target = document.getElementById(section);
    if (target) {
        target.classList.add('active');
        currentSection = section;
        
        // Update title
        document.title = `RSM - ${section.charAt(0).toUpperCase() + section.slice(1)}`;
        
        // Load models if needed
        if (section === 'models') {
            loadModels();
        }
        
        // Update stats if needed
        if (section === 'home') {
            updateStats();
        }
    }
    
    return false; // Prevent default behavior
}

// ===== CHANGE FONT SIZE (GLOBAL FUNCTION) =====
function changeFontSize(change) {
    const newSize = settings.fontSize + change;
    applyFontSize(newSize);
}

// ===== INITIALIZE APP =====
function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Merge with default settings
    settings = { ...defaultSettings, ...settings };
    
    // Apply saved settings
    applySettings();
    
    // Setup navigation
    setupNavigation();
    
    // Load models
    loadModels();
    
    // Update stats
    updateStats();
    
    console.log('✅ RSM initialized');
}

// ===== APPLY SETTINGS =====
function applySettings() {
    // Apply theme
    if (settings.theme === 'light') {
        document.body.classList.add('light-mode');
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) themeToggle.checked = true;
    }
    
    // Apply font size
    applyFontSize(settings.fontSize);
}

// ===== APPLY FONT SIZE =====
function applyFontSize(size) {
    // Validate size
    size = Math.max(12, Math.min(24, size));
    settings.fontSize = size;
    
    // Apply to CSS variable
    document.documentElement.style.setProperty('--font-size', `${size}px`);
    
    // Update display
    const fontSizeValue = document.getElementById('font-size-value');
    if (fontSizeValue) fontSizeValue.textContent = `${size}px`;
    
    // Save settings
    saveSettings();
}

// ===== SETUP NAVIGATION =====
function setupNavigation() {
    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
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
}

// ===== LOAD MODELS =====
async function loadModels() {
    const container = document.getElementById('models-container');
    
    if (!container) {
        console.error('❌ No container found!');
        return;
    }
    
    console.log('📦 Loading models...');
    
    // Clear container
    container.innerHTML = '';
    
    // Check if we have models
    if (models.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); padding: 20px; text-align: center;">No models available.</p>';
        return;
    }
    
    // Create model cards
    for (let model of models) {
        // Detect size automatically
        try {
            const size = await getFileSize(`worlds/${model.filename}`);
            model.size = size;
        } catch (error) {
            model.size = 'Unknown';
        }
        
        // Create card
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
               onclick="registerDownload(${model.id});">
                Download
            </a>
        `;
        
        container.appendChild(card);
    }
    
    console.log(`✅ Loaded ${models.length} models`);
}

// ===== GET FILE SIZE =====
async function getFileSize(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
            const size = response.headers.get('content-length');
            if (size) {
                return formatSize(parseInt(size));
            }
        }
        return 'Unknown';
    } catch (error) {
        return 'Unknown';
    }
}

// ===== FORMAT SIZE =====
function formatSize(bytes) {
    if (isNaN(bytes)) return 'Unknown';
    
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// ===== REGISTER DOWNLOAD =====
function registerDownload(modelId) {
    console.log('⬇️ Downloading model:', modelId);
    
    // Count download
    if (!downloads[modelId]) downloads[modelId] = 0;
    downloads[modelId]++;
    
    // Save
    localStorage.setItem('rsm_downloads', JSON.stringify(downloads));
    
    // Update stats
    updateStats();
    
    // Update model display
    if (currentSection === 'models') {
        setTimeout(() => loadModels(), 100);
    }
    
    return true;
}

// ===== UPDATE STATS =====
function updateStats() {
    // Total models
    const totalModelsEl = document.getElementById('total-models');
    if (totalModelsEl) {
        totalModelsEl.textContent = models.length;
    }
    
    // Calculate total size
    let totalBytes = 0;
    models.forEach(model => {
        if (model.size && model.size !== 'Unknown') {
            const match = model.size.match(/(\d+\.?\d*)\s*(B|KB|MB|GB)/);
            if (match) {
                let bytes = parseFloat(match[1]);
                const unit = match[2];
                
                if (unit === 'MB') bytes *= 1024 * 1024;
                else if (unit === 'KB') bytes *= 1024;
                else if (unit === 'GB') bytes *= 1024 * 1024 * 1024;
                
                totalBytes += bytes;
            }
        }
    });
    
    const totalSizeEl = document.getElementById('total-size');
    if (totalSizeEl) {
        totalSizeEl.textContent = formatSize(totalBytes);
    }
}

// ===== SAVE SETTINGS =====
function saveSettings() {
    localStorage.setItem('rsm_settings', JSON.stringify(settings));
}

// ===== EXPORT FUNCTIONS =====
window.showSection = showSection;
window.changeFontSize = changeFontSize;
window.registerDownload = registerDownload;

// ===== START APP =====
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
