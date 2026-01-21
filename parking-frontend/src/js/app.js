/**
 * Aplicación Principal
 * Maneja la navegación y la lógica general de la aplicación
 */

const App = {
    /**
     * Inicializar la aplicación
     */
    init() {
        this.setupNavigation();
        this.setupGlobalEventListeners();
        this.initializeComponents();
    },

    /**
     * Configurar navegación
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();

                const section = link.dataset.section;
                if (!section) return;

                // Remover clase active de todos los links
                navLinks.forEach(l => l.classList.remove('active'));
                // Agregar active al link actual
                link.classList.add('active');

                // Remover clase active de todas las secciones
                document.querySelectorAll('.section').forEach(s => {
                    s.classList.remove('active');
                });

                // Mostrar sección seleccionada
                const targetSection = document.getElementById(`${section}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');

                    // Recargar datos si es necesario
                    if (section === 'zones' && ZonesComponent) {
                        ZonesComponent.loadZones();
                    } else if (section === 'spaces' && SpacesComponent) {
                        SpacesComponent.loadSpaces();
                    } else if (section === 'analytics' && AnalyticsComponent) {
                        AnalyticsComponent.loadAnalytics();
                    }
                }
            });
        });

        // Cargar dashboard por defecto
        document.querySelector('[data-section="dashboard"]').click();
    },

    /**
     * Configurar event listeners globales
     */
    setupGlobalEventListeners() {
        // Manejar errores globales
        window.addEventListener('error', (e) => {
            console.error('Error global:', e.error);
            showNotification('Ocurrió un error inesperado', 'error');
        });

        // Manejar errores de promise no manejados
        window.addEventListener('unhandledrejection', (e) => {
            console.error('Promise rechazada no manejada:', e.reason);
            showNotification('Error en la solicitud', 'error');
        });
    },

    /**
     * Inicializar componentes
     */
    initializeComponents() {
        // Los componentes se inicializan automáticamente cuando el DOM está listo
        // Esto es solo para asegurar que se inicialicen en el orden correcto
        if (typeof ZonesComponent !== 'undefined') {
            console.log('✓ Componente de Zonas inicializado');
        }
        if (typeof SpacesComponent !== 'undefined') {
            console.log('✓ Componente de Espacios inicializado');
        }
        if (typeof DashboardComponent !== 'undefined') {
            console.log('✓ Componente de Dashboard inicializado');
        }
        if (typeof AnalyticsComponent !== 'undefined') {
            console.log('✓ Componente de Analytics inicializado');
        }
    }
};

/**
 * Función global para mostrar notificaciones
 */
function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    // Auto remover después de duration
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

/**
 * Inicializar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Iniciando ParkingHub Frontend...');
    App.init();
    console.log('✅ ParkingHub Frontend iniciado correctamente');
});

// Agregar animación de salida para notificaciones
const notificationStyles = `
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
