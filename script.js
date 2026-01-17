// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "	This chat system is fully customizable and designed to integrate easily into your projects. Make sure to follow the rules provided to avoid errors or conflicts within the system.",
        size: null,
        category: "Game Systems",
        addedDate: "2025-01-16"
    }
];

// ===== APP STATE =====
let currentSection = 'home';
let downloads = JSON.parse(localStorage.getItem('rsm_downloads') || '{}');
let modelsLoaded = false;

// ===== CALCULAR ESTADÍSTICAS =====
function calculateStats() {
    // Total de descargas
    let totalDownloads = 0;
    Object.values(downloads).forEach(count => {
        totalDownloads += count;
    });
    
    // Modelo más descargado
    let topModel = "None";
    let maxDownloads = 0;
    
    models.forEach(model => {
        const modelDownloads = downloads[model.id] || 0;
        if (modelDownloads > maxDownloads) {
            maxDownloads = modelDownloads;
            topModel = model.name;
        }
    });
    
    return {
        totalDownloads,
        topModel: maxDownloads > 0 ? topModel : "None"
    };
}

// ===== FUNCTION TO SHOW SECTION =====
function showSection(sectionId) {
    console.log('Showing section:', sectionId);
    
    // Update current section
    currentSection = sectionId;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update active menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Find and activate the corresponding menu item
    document.querySelector(`.menu-item[data-section="${sectionId}"]`).classList.add('active');
    
    // Update title
    document.title = `RSM - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
    
    // Load models if necessary (only once)
    if (sectionId === 'models' && !modelsLoaded) {
        loadModels();
        modelsLoaded = true;
    }
    
    // Update statistics if necessary
    if (sectionId === 'home') {
        updateStats();
    }
}

// ===== INITIALIZE APP =====
function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Setup navigation
    setupNavigation();
    
    // Update statistics
    updateStats();
    
    console.log('✅ RSM initialized');
}

// ===== SETUP NAVIGATION =====
function setupNavigation() {
    // Add events to menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            if (sectionId) {
                showSection(sectionId);
            }
        });
    });
}

// ===== LOAD MODELS =====
async function loadModels() {
    const container = document.getElementById('models-container');
    
    if (!container) {
        console.error('❌ Models container not found!');
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
            console.log('Error getting size:', error);
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
                <span><strong>Category:</strong> ${model.category}</span>
                <span><strong>Size:</strong> ${model.size || 'Loading...'}</span>
                <span><strong>Downloads:</strong> ${downloadCount}</span>
                <span><strong>Format:</strong> .rbxl</span>
            </div>
            <a href="worlds/${model.filename}" class="download-btn" download 
               onclick="registerDownload(${model.id}); return true;">
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
        console.error('Error getting file size:', error);
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
    
    // Update statistics
    updateStats();
    
    // Reload models to update counter
    if (currentSection === 'models') {
        setTimeout(() => {
            loadModels();
        }, 100);
    }
    
    return true;
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    // Total models
    const totalModelsElement = document.getElementById('total-models');
    if (totalModelsElement) {
        totalModelsElement.textContent = models.length;
    }
    
    // Calculate and display other stats
    const stats = calculateStats();
    
    // Total downloads
    const totalDownloadsElement = document.getElementById('total-downloads');
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = stats.totalDownloads;
    }
    
    // Top model
    const topModelElement = document.getElementById('top-model');
    if (topModelElement) {
        topModelElement.textContent = stats.topModel;
    }
}

// ===== START APP WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', initApp);
