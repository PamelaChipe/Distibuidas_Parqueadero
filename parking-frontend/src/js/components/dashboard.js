/**
 * Componente de Dashboard
 * Gestiona la visualización del dashboard principal
 */

const DashboardComponent = {
    zones: [],
    spaces: [],

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
    async loadDashboardData() {
        try {
            await this.loadZones();
            await this.loadSpaces();
            this.updateStatistics();
            this.renderRecentActivity();
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
        }
    },

    /**
     * Cargar zonas
     */
    async loadZones() {
        try {
            this.zones = await API.zones.getAllZones();
            this.renderZonesInDashboard();
        } catch (error) {
            console.error('Error cargando zonas:', error);
            showNotification('Error al cargar las zonas', 'error');
            const container = document.getElementById('zones-list-dashboard');
            if (container) {
                container.innerHTML = `
                    <div class="no-activity">Error al cargar zonas</div>
                `;
            }
        }
    },

    /**
     * Cargar espacios
     */
    async loadSpaces() {
        try {
            this.spaces = await API.spaces.getAllSpaces();
        } catch (error) {
            console.error('Error cargando espacios:', error);
            showNotification('Error al cargar los espacios', 'error');
        }
    },

    /**
     * Renderizar zonas en dashboard
     */
    renderZonesInDashboard() {
        const container = document.getElementById('zones-list-dashboard');
        if (!container) return;

        if (this.zones.length === 0) {
            container.innerHTML = '<div class="no-activity">No hay zonas registradas</div>';
            return;
        }

        container.innerHTML = this.zones.slice(0, 3).map(zone => `
            <div class="zone-list-item">
                <div class="zone-list-icon"><span class="material-icons">local_parking</span></div>
                <div class="zone-list-content">
                    <h4 class="zone-list-name">${zone.name}</h4>
                    <p class="zone-list-info">Disponibles: ${zone.availableCapacity ?? zone.capacity} / Total: ${zone.capacity}</p>
                </div>
                <div class="zone-list-status">
                    ${zone.isActive
                ? '<span style="color: #27ae60;"><span class="material-icons icon-inline">check_circle</span>Activa</span>'
                : '<span style="color: #e74c3c;"><span class="material-icons icon-inline">cancel</span>Inactiva</span>'}
                </div>
            </div>
        `).join('');
    },

    /**
     * Actualizar estadísticas
     */
    updateStatistics() {
        // Actualizar zonas totales
        const totalZonesEl = document.getElementById('total-zones');
        if (totalZonesEl) {
            totalZonesEl.textContent = this.zones.length;
        }

        // Actualizar espacios
        const totalSpacesEl = document.getElementById('total-spaces');
        const availableSpacesEl = document.getElementById('available-spaces');
        const occupiedSpacesEl = document.getElementById('occupied-spaces');

        const available = this.spaces.filter(s => s.status === 'AVAILABLE').length;
        const occupied = this.spaces.filter(s => s.status === 'OCCUPIED').length;

        if (totalSpacesEl) {
            totalSpacesEl.textContent = this.spaces.length;
        }
        if (availableSpacesEl) {
            availableSpacesEl.textContent = available;
        }
        if (occupiedSpacesEl) {
            occupiedSpacesEl.textContent = occupied;
        }
    },

    /**
     * Renderizar actividad reciente
     */
    renderRecentActivity() {
        const container = document.getElementById('recent-activity');
        if (!container) return;

        if (this.spaces.length === 0) {
            container.innerHTML = '<div class="no-activity">No hay actividad reciente</div>';
            return;
        }

        // Mostrar los últimos 5 espacios creados (últimos de la lista)
        const recentSpaces = this.spaces.slice(-5).reverse();

        container.innerHTML = recentSpaces.map(space => {
            const zone = this.zones.find(z => z.id === space.idZone);
            const zoneName = zone ? zone.name : 'Desconocida';
            const statusColor = space.status === 'AVAILABLE' ? '#27ae60' :
                space.status === 'OCCUPIED' ? '#e74c3c' : '#f39c12';
            const statusText = space.status === 'AVAILABLE' ? 'Disponible' :
                space.status === 'OCCUPIED' ? 'Ocupado' : 'Mantenimiento';

            return `
                <div class="activity-item" style="padding: 12px 0; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <p style="margin: 0; font-weight: 500; color: #333;">${space.codigo}</p>
                        <p style="margin: 4px 0 0; font-size: 0.85rem; color: #666;">Zona: ${zoneName}</p>
                    </div>
                    <span style="background-color: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500;">
                        ${statusText}
                    </span>
                </div>
            `;
        }).join('');
    },

    /**
     * Configurar refresco automático
     */
    setupRefresh() {
        // Refrescar cada 30 segundos
        setInterval(() => {
            if (document.getElementById('dashboard-section')?.classList.contains('active')) {
                this.loadDashboardData();
            }
        }, 30000);
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    DashboardComponent.init();
});
