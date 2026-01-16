// ===== TUS MUNDOS - MODIFICA ESTO =====
const mundos = [
    {
        id: 1,
        titulo: "Ciudad Moderna",
        archivo: "ciudad_moderna.rbxl",
        descripcion: "Una ciudad completa con edificios, calles y vehículos. Perfecta para juegos de rol urbano.",
        tamano: "12.5 MB",
        fecha: "2024-01-10",
        descargas: 0
    },
    {
        id: 2,
        titulo: "Castillo Medieval",
        archivo: "castillo_medieval.rbxl",
        descripcion: "Castillo con murallas, torres y mazmorras. Incluye pueblo y bosques alrededor.",
        tamano: "8.3 MB",
        fecha: "2024-01-05",
        descargas: 0
    },
    {
        id: 3,
        titulo: "Base Espacial",
        archivo: "base_espacial.rbxl",
        descripcion: "Estación espacial en órbita con hangares, laboratorios y vista al espacio exterior.",
        tamano: "18.7 MB",
        fecha: "2024-01-01",
        descargas: 0
    }
    // Añade más mundos aquí...
];

// ===== VARIABLES GLOBALES =====
let mundoSeleccionado = null;

// ===== CUANDO LA PÁGINA CARGA =====
document.addEventListener('DOMContentLoaded', function() {
    // Configurar navegación
    configurarMenu();
    
    // Cargar los mundos
    cargarMundos();
    
    // Configurar modal
    configurarModal();
    
    // Mostrar sección inicial
    mostrarSeccion('inicio');
});

// ===== CONFIGURAR MENÚ DE NAVEGACIÓN =====
function configurarMenu() {
    const itemsMenu = document.querySelectorAll('.menu-item');
    
    itemsMenu.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Quitar activo de todos
            itemsMenu.forEach(i => i.classList.remove('active'));
            
            // Añadir activo al clickeado
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            const seccionId = this.getAttribute('href').substring(1);
            mostrarSeccion(seccionId);
        });
    });
}

// ===== MOSTRAR SECCIÓN =====
function mostrarSeccion(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('.section').forEach(seccion => {
        seccion.classList.remove('active');
    });
    
    // Mostrar la sección seleccionada
    const seccionActiva = document.getElementById(id);
    if (seccionActiva) {
        seccionActiva.classList.add('active');
    }
}

// ===== CARGAR Y MOSTRAR MUNDOS =====
function cargarMundos() {
    const contenedor = document.getElementById('mundos-container');
    
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    mundos.forEach(mundo => {
        // Crear tarjeta del mundo
        const tarjeta = document.createElement('div');
        tarjeta.className = 'mundo-card';
        tarjeta.dataset.id = mundo.id;
        
        tarjeta.innerHTML = `
            <h3>${mundo.titulo}</h3>
            <p class="desc">${mundo.descripcion.substring(0, 80)}...</p>
            <div class="mundo-info">
                <span>📦 ${mundo.tamano}</span>
                <span>📅 ${mundo.fecha}</span>
                <span>⬇️ ${mundo.descargas}</span>
            </div>
            <button class="btn-descargar" onclick="descargarMundo(${mundo.id})">
                DESCARGAR
            </button>
            <button onclick="verDetalles(${mundo.id})" 
                    style="margin-top: 10px; width: 100%; padding: 8px; background: transparent; color: #00adb5; border: 1px solid #00adb5; border-radius: 5px; cursor: pointer;">
                Ver Detalles
            </button>
        `;
        
        contenedor.appendChild(tarjeta);
    });
}

// ===== CONFIGURAR MODAL =====
function configurarModal() {
    const modal = document.getElementById('modal');
    const cerrarBtn = document.querySelector('.cerrar-modal');
    
    // Cerrar con el botón X
    cerrarBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Cerrar al hacer clic fuera del contenido
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}

// ===== VER DETALLES DE UN MUNDO =====
function verDetalles(id) {
    const mundo = mundos.find(m => m.id === id);
    
    if (!mundo) {
        alert('Mundo no encontrado');
        return;
    }
    
    // Guardar mundo seleccionado
    mundoSeleccionado = mundo;
    
    // Actualizar contenido del modal
    document.getElementById('modal-titulo').textContent = mundo.titulo;
    document.getElementById('modal-descripcion').textContent = mundo.descripcion;
    document.getElementById('modal-tamano').textContent = mundo.tamano;
    document.getElementById('modal-fecha').textContent = mundo.fecha;
    document.getElementById('modal-descargas').textContent = mundo.descargas;
    
    // Configurar enlace de descarga
    const enlaceDescarga = document.getElementById('modal-descargar');
    enlaceDescarga.href = `worlds/${mundo.archivo}`;
    enlaceDescarga.download = mundo.archivo;
    
    // Mostrar modal
    document.getElementById('modal').style.display = 'flex';
}

// ===== DESCARGAR UN MUNDO =====
function descargarMundo(id) {
    const mundo = mundos.find(m => m.id === id);
    
    if (!mundo) {
        alert('Error: Mundo no encontrado');
        return;
    }
    
    // Aumentar contador de descargas
    mundo.descargas++;
    
    // Actualizar la vista
    cargarMundos();
    
    // Si el modal está abierto, actualizar también
    if (mundoSeleccionado && mundoSeleccionado.id === id) {
        document.getElementById('modal-descargas').textContent = mundo.descargas;
    }
    
    // Mostrar mensaje
    mostrarMensaje(`✅ Descargando: ${mundo.titulo}`);
    
    // Iniciar descarga automática
    const enlaceTemporal = document.createElement('a');
    enlaceTemporal.href = `worlds/${mundo.archivo}`;
    enlaceTemporal.download = mundo.archivo;
    enlaceTemporal.style.display = 'none';
    
    document.body.appendChild(enlaceTemporal);
    enlaceTemporal.click();
    document.body.removeChild(enlaceTemporal);
}

// ===== MOSTRAR MENSAJE TEMPORAL =====
function mostrarMensaje(texto) {
    // Crear mensaje
    const mensaje = document.createElement('div');
    mensaje.textContent = texto;
    mensaje.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #00adb5;
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(mensaje);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        mensaje.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (mensaje.parentNode) {
                document.body.removeChild(mensaje);
            }
        }, 300);
    }, 3000);
}

// ===== AÑADIR ANIMACIONES CSS =====
const estilosAnimacion = document.createElement('style');
estilosAnimacion.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(estilosAnimacion);
