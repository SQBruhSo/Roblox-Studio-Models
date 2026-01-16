// Lista de mundos - CAMBIA ESTO
const mundos = [
    {
        id: 1,
        titulo: "Custom Chat System",
        archivo: "CustomChatSystem.rbxl",
        descripcion: "Un sistema de chat customizado para que los jugadores no tengan que verifiarse. Y contiene un filtro que evita los insultos.",
        tamano: "128 KB",
        fecha: "2025-01-16",
        descargas: 0
    },
    // Añade más mundos aquí
];

// Cargar cuando la página esté lista
document.addEventListener('DOMContentLoaded', function() {
    cargarMundos();
});

// Mostrar los mundos en la página
function cargarMundos() {
    const contenedor = document.getElementById('lista-mundos');
    
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    
    mundos.forEach(function(mundo) {
        const div = document.createElement('div');
        div.className = 'mundo';
        
        div.innerHTML = `
            <h3>${mundo.nombre}</h3>
            <p>${mundo.descripcion}</p>
            <p><strong>Tamaño:</strong> ${mundo.tamano}</p>
            <a href="worlds/${mundo.archivo}" class="btn" download>
                Descargar ${mundo.nombre}
            </a>
        `;
        
        contenedor.appendChild(div);
    });
}

// Cambiar entre secciones
function mostrarSeccion(id) {
    // Ocultar todas
    document.querySelectorAll('.seccion').forEach(function(seccion) {
        seccion.classList.remove('activo');
    });
    
    // Mostrar la seleccionada
    const seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add('activo');
    }
    
    return false; // Para evitar que el enlace recargue la página
}
