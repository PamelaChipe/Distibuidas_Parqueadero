/**
 * Componente de Dashboard
 * Gestiona la visualización del dashboard principal
 */

const DashboardComponent = {
    /**
     * Inicializar el componente
     */
    init() {
        this.loadDashboardData();
        this.setupRefresh();
    },

    /**
     * Cargar datos del dashboard
     */
    loadDashboardData() {
        // Los datos se cargan desde los componentes de zonas y espacios
        // que ya están inicializados
        this.updateStatistics();
    },

    /**
     * Actualizar estadísticas
     */
    updateStatistics() {
        // Las estadísticas se actualizan automáticamente cuando se cargan
        // zonas y espacios desde sus respectivos componentes
    },

    /**
     * Configurar refresco automático
     */
    setupRefresh() {
        // Refrescar cada 30 segundos
        setInterval(() => {
            if (document.getElementById('dashboard-section').classList.contains('active')) {
                ZonesComponent.loadZones();
                SpacesComponent.loadSpaces();
            }
        }, 30000);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    DashboardComponent.init();
});
