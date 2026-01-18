// ===== MODELS DATA =====
const models = [
    {
        id: 1,
        name: "Custom Chat System",
        filename: "CustomChatSystem.rbxl",
        description: "This chat system is fully customizable and designed to integrate easily into your projects. Make sure to follow the rules provided to avoid errors or conflicts within the system.",
        category: "Game Systems"
    }
];

// ===== APP STATE =====
let currentSection = 'home';
let modelsLoaded = false;

// ===== CONFIGURACIÓN DE TEMA =====
const defaultConfig = {
    darkMode: false,
    primaryColor: '#4CAF50',
    clickCount: 0,
    easterEggUnlocked: false
};

let config = JSON.parse(localStorage.getItem('rsm_config')) || {...defaultConfig};

// ===== FUNCIONES DE TEMA =====
function updateTheme() {
    const root = document.documentElement;
    
    if (config.darkMode) {
        // Modo oscuro
        root.style.setProperty('--bg-color', '#1a1a1a');
        root.style.setProperty('--sidebar-color', '#2d2d2d');
        root.style.setProperty('--card-color', '#333333');
        root.style.setProperty('--text-color', '#ffffff');
        root.style.setProperty('--text-secondary', '#b0b0b0');
        root.style.setProperty('--border-color', '#404040');
        
        // Invertir iconos en modo oscuro
        document.querySelectorAll('.menu-icon').forEach(icon => {
            icon.style.filter = 'brightness(0) invert(1)';
        });
        
        // Invertir iconos de características
        document.querySelectorAll('.feature-icon').forEach(icon => {
            icon.style.filter = 'brightness(0) invert(1)';
        });
        
    } else {
        // Modo claro (valores por defecto)
        root.style.setProperty('--bg-color', '#f5f5f5');
        root.style.setProperty('--sidebar-color', '#e0e0e0');
        root.style.setProperty('--card-color', '#ffffff');
        root.style.setProperty('--text-color', '#333333');
        root.style.setProperty('--text-secondary', '#666666');
        root.style.setProperty('--border-color', '#d6d6d6');
        
        // Restaurar iconos a su estado normal
        document.querySelectorAll('.menu-icon').forEach(icon => {
            if (!icon.closest('.menu-item.active') && !icon.closest('.menu-item:hover')) {
                icon.style.filter = 'none';
            }
        });
        
        // Restaurar iconos de características
        document.querySelectorAll('.feature-icon').forEach(icon => {
            icon.style.filter = 'none';
        });
    }
    
    // Actualizar color primario
    root.style.setProperty('--primary-color', config.primaryColor);
    
    // Calcular color hover automáticamente
    const hoverColor = darkenColor(config.primaryColor, 10);
    root.style.setProperty('--primary-hover', hoverColor);
}

function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1);
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
        const icon = item.querySelector('.menu-icon');
        if (icon) {
            if (config.darkMode) {
                icon.style.filter = 'brightness(0) invert(1)';
            } else {
                icon.style.filter = 'none';
            }
        }
    });
    
    // Find and activate the corresponding menu item
    const menuItem = document.querySelector(`.menu-item[data-section="${sectionId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
        const icon = menuItem.querySelector('.menu-icon');
        if (icon) {
            icon.style.filter = 'brightness(0) invert(1)';
        }
    }
    
    // Update title
    document.title = `RSM - ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
    
    // Load models if necessary
    if (sectionId === 'models' && !modelsLoaded) {
        loadModels();
        modelsLoaded = true;
    }
    
    // Update statistics if necessary
    if (sectionId === 'home') {
        updateStats();
    }
    
    // Actualizar configuración si es necesario
    if (sectionId === 'settings') {
        updateSettingsUI();
    }
}

// ===== INITIALIZE APP =====
function initApp() {
    console.log('🚀 Initializing RSM...');
    
    // Aplicar tema guardado
    updateTheme();
    
    // Setup navigation
    setupNavigation();
    
    // Setup settings
    setupSettings();
    
    // Setup easter egg
    setupEasterEgg();
    
    // Update statistics
    updateStats();
    
    // Actualizar UI de settings
    updateSettingsUI();
    
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

// ===== SETUP SETTINGS =====
function setupSettings() {
    // Configurar toggle de modo oscuro
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = config.darkMode;
        darkModeToggle.addEventListener('change', function() {
            config.darkMode = this.checked;
            saveConfig();
            updateTheme();
            
            // Aplicar filtro a iconos activos después del cambio
            const activeMenuItem = document.querySelector('.menu-item.active');
            if (activeMenuItem) {
                const activeIcon = activeMenuItem.querySelector('.menu-icon');
                if (activeIcon) {
                    activeIcon.style.filter = 'brightness(0) invert(1)';
                }
            }
        });
    }
    
    // Configurar opciones de color predefinidas
    document.querySelectorAll('.color-option').forEach(button => {
        button.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            config.primaryColor = color;
            saveConfig();
            updateTheme();
            updateSettingsUI();
        });
    });
    
    // Configurar botón para ocultar easter egg
    const hideEasterEggBtn = document.getElementById('hideEasterEgg');
    if (hideEasterEggBtn) {
        hideEasterEggBtn.addEventListener('click', function() {
            document.getElementById('easterEggCard').style.display = 'none';
        });
    }
}

// ===== ACTUALIZAR UI DE SETTINGS =====
function updateSettingsUI() {
    // Actualizar toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = config.darkMode;
    }
    
    // Actualizar opciones de color activas
    document.querySelectorAll('.color-option').forEach(option => {
        const color = option.getAttribute('data-color');
        if (color === config.primaryColor) {
            option.classList.add('active');
            option.style.borderColor = config.darkMode ? '#fff' : '#333';
        } else {
            option.classList.remove('active');
            option.style.borderColor = 'transparent';
        }
    });
    
    // Mostrar/ocultar easter egg
    const easterEggCard = document.getElementById('easterEggCard');
    if (easterEggCard) {
        easterEggCard.style.display = config.easterEggUnlocked ? 'block' : 'none';
    }
}

// ===== GUARDAR CONFIGURACIÓN =====
function saveConfig() {
    localStorage.setItem('rsm_config', JSON.stringify(config));
}

// ===== LOAD MODELS =====
function loadModels() {
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
    models.forEach(model => {
        // Create card
        const card = document.createElement('div');
        card.className = 'model-card';
        
        card.innerHTML = `
            <h3>${model.name}</h3>
            <p>${model.description}</p>
            <div class="model-info">
                <span><strong>Category:</strong> ${model.category}</span>
                <span><strong>Format:</strong> .rbxl</span>
            </div>
            <a href="worlds/${model.filename}" class="download-btn" download>
                Download
            </a>
        `;
        
        container.appendChild(card);
    });
    
    console.log(`✅ Loaded ${models.length} models`);
}

// ===== UPDATE STATISTICS =====
function updateStats() {
    // Total models
    const totalModelsElement = document.getElementById('total-models');
    if (totalModelsElement) {
        totalModelsElement.textContent = models.length;
    }
    
    // Total downloads (siempre 0)
    const totalDownloadsElement = document.getElementById('total-downloads');
    if (totalDownloadsElement) {
        totalDownloadsElement.textContent = '0';
    }
    
    // Top model (siempre None)
    const topModelElement = document.getElementById('top-model');
    if (topModelElement) {
        topModelElement.textContent = 'None';
    }
    
    // Last update (fecha actual)
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        const now = new Date();
        const options = { month: 'short', day: 'numeric' };
        lastUpdateElement.textContent = now.toLocaleDateString('en-US', options);
    }
}

// ===== SETUP EASTER EGG =====
function setupEasterEgg() {
    const secretElement = document.querySelector('.sidebar h2');
    
    if (!secretElement) return;
    
    secretElement.style.cursor = 'pointer';
    secretElement.title = "Click me...";
    
    secretElement.addEventListener('click', function() {
        config.clickCount = (config.clickCount || 0) + 1;
        
        // Efecto visual
        this.style.transform = 'scale(1.1)';
        this.style.transition = 'transform 0.2s';
        
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
        
        // Comprobar si se ha desbloqueado el easter egg
        if (config.clickCount === 7 && !config.easterEggUnlocked) {
            config.easterEggUnlocked = true;
            saveConfig();
            
            // Mostrar mensaje especial
            alert('🎉 Congratulations! You found the secret easter egg! 🎉\n\nCheck the Settings section for something special!');
            
            // Si estamos en settings, actualizar
            if (currentSection === 'settings') {
                updateSettingsUI();
            }
        }
        
        saveConfig();
    });
}

// ===== START APP WHEN DOM IS READY =====
document.addEventListener('DOMContentLoaded', initApp);
