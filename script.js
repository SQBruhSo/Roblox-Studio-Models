// ======================
// DATOS DE LOS MUNDOS
// ======================
// MODIFICA ESTO CON TUS MUNDOS
const mundos = [
    {
        id: 1,
        nombre: "Custom Chat System",
        archivo: "CustomChatSystem.rbxl",  // Nombre exacto del archivo en /worlds/
        descripcion: "Este sistema de chat es completamente personalizable y está diseñado para integrarse fácilmente en tus proyectos. Asegúrate de seguir las reglas proporcionadas para evitar errores o conflictos dentro del sistema.",
        tamano: "138 KB"  // CAMBIA ESTO AL TAMAÑO REAL DE TU ARCHIVO
    }
];

// ======================
// CUANDO LA PÁGINA CARGA
// ======================
document.addEventListener('DOMContentLoaded', function() {
    console.log('Página cargada, inicializando...');
    
    // 1. Configurar navegación
    configurarNavegacion();
    
    // 2. Cargar mundos inmediatamente
    cargarMundos();
    
    // 3. Verificar la sección actual
    verificarSeccionActual();
});

// ======================
// CONFIGURAR NAVEGACIÓN
// ======================
function configurarNavegacion() {
    const menuLinks = document.querySelectorAll('.menu-link');
    
    menuLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            
            console.log('Clic en:', this.textContent);
            
            // Quitar 'active' de todos los enlaces
            menuLinks.forEach(l => l.classList.remove('active'));
            
            // Añadir 'active' al enlace clickeado
            this.classList.add('active');
            
            // Obtener la sección a mostrar
            const targetId = this.getAttribute('href').substring(1);
            
            // Mostrar la sección
            mostrarSeccion(targetId);
        });
    });
}

// ======================
// MOSTRAR SECCIÓN
// ======================
function mostrarSeccion(seccionId) {
    console.log('Mostrando sección:', seccionId);
    
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(seccionId);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
        
        // Si es la sección de mundos, recargar los mundos
        if (seccionId === 'mundos') {
            setTimeout(cargarMundos, 50);
        }
    }
}

// ======================
// CARGAR Y MOSTRAR MUNDOS
// ======================
function cargarMundos() {
    const container = document.getElementById('worlds-container');
    
    if (!container) {
        console.error('No se encontró el contenedor de mundos');
        return;
    }
    
    console.log('Cargando mundos...');
    console.log('Total de mundos:', mundos.length);
    
    // Limpiar contenedor
    container.innerHTML = '';
    
    // Si no hay mundos
    if (mundos.length === 0) {
        container.innerHTML = '<p style="color: #888; font-style: italic;">No hay mundos disponibles.</p>';
        return;
    }
    
    // Crear tarjeta para cada mundo
    mundos.forEach(mundo => {
        console.log('Creando tarjeta para:', mundo.nombre);
        
        const worldCard = document.createElement('div');
        worldCard.className = 'world-card';
        
        worldCard.innerHTML = `
            <h3>${mundo.nombre}</h3>
            <p>${mundo.descripcion}</p>
            <div class="world-info">
                <span><strong>Tamaño:</strong> ${mundo.tamano}</span>
                <span><strong>Formato:</strong> .rbxl</span>
            </div>
            <a href="worlds/${mundo.archivo}" class="download-btn" download>
                Descargar
            </a>
        `;
        
        container.appendChild(worldCard);
    });
}

// ======================
// VERIFICAR SECCIÓN ACTUAL
// ======================
function verificarSeccionActual() {
    // Verificar si hay hash en la URL
    const hash = window.location.hash.substring(1);
    
    if (hash && ['inicio', 'mundos', 'config'].includes(hash)) {
        // Actualizar menú
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });
        
        // Mostrar sección correspondiente
        mostrarSeccion(hash);
    } else {
        // Por defecto mostrar inicio
        mostrarSeccion('inicio');
    }
}

// ======================
// FUNCIÓN PARA DESCARGAR
// ======================
// Esta función se llama desde el botón de descarga
function descargarMundo(archivo) {
    console.log('Iniciando descarga de:', archivo);
    // La descarga se maneja automáticamente con el atributo "download" en el enlace
}

// ======================
// PARA DEPURACIÓN
// ======================
console.log('Script cargado correctamente');
console.log('Mundos disponibles:', mundos);
