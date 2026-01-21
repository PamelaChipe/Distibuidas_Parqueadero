/**
 * Componente de Zonas
 * Gestiona la renderización y lógica de zonas
 */

const ZonesComponent = {
    zones: [],
    editingZoneId: null,

    /**
     * Inicializar el componente
     */
    init() {
        this.setupEventListeners();
        this.loadZones();
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botón nueva zona
        document.getElementById('btn-new-zone')?.addEventListener('click', () => {
            this.openModal();
        });

        // Búsqueda de zonas
        document.getElementById('zone-search')?.addEventListener('input', (e) => {
            this.filterZones(e.target.value);
        });

        // Formulario
        document.getElementById('zone-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveZone();
        });

        // Botón cerrar modal
        document.querySelectorAll('#zone-modal .btn-close, #zone-modal [data-action="cancel"]')
            .forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });

        // Cerrar modal al hacer clic afuera
        document.getElementById('zone-modal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('zone-modal')) {
                this.closeModal();
            }
        });
    },

    /**
     * Cargar zonas del API
     */
    async loadZones() {
        try {
            this.showLoading('zones-grid');
            this.zones = await API.zones.getAllZones();
            this.renderZones(this.zones);
            this.updateAnalytics();
        } catch (error) {
            console.error('Error cargando zonas:', error);
            showNotification('Error al cargar las zonas', 'error');
            document.getElementById('zones-grid').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <p>Error al cargar las zonas. Verifique que el servidor esté ejecutándose.</p>
                </div>
            `;
        }
    },

    /**
     * Renderizar zonas
     */
    renderZones(zones = this.zones) {
        const container = document.getElementById('zones-grid');
        
        if (!zones || zones.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🅿️</div>
                    <p>No hay zonas registradas. ¡Crea la primera zona!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = zones.map(zone => this.createZoneCard(zone)).join('');
        this.attachZoneCardListeners();
    },

    /**
     * Crear tarjeta de zona
     */
    createZoneCard(zone) {
        const statusClass = zone.isActive ? 'zone-status-active' : 'zone-status-inactive';
        const statusText = zone.isActive ? '✅ Activa' : '❌ Inactiva';
        const typeClass = `zone-type-${zone.type?.toLowerCase() || 'standard'}`;

        return `
            <div class="zone-card">
                <div class="card-header">
                    <div class="zone-title">
                        <h3 class="zone-name">${zone.name}</h3>
                        <span class="badge badge-info zone-type-badge ${typeClass}">${zone.type || 'N/A'}</span>
                    </div>
                    <div class="zone-actions">
                        <button class="btn btn-primary btn-small" data-action="edit" data-id="${zone.id}">✏️</button>
                        <button class="btn btn-danger btn-small" data-action="delete" data-id="${zone.id}">🗑️</button>
                    </div>
                </div>

                <p class="zone-description">${zone.description || 'Sin descripción'}</p>

                <div class="zone-stats">
                    <div class="zone-stat">
                        <div class="zone-stat-value">${zone.capacity}</div>
                        <div class="zone-stat-label">Capacidad</div>
                    </div>
                    <div class="zone-stat">
                        <div class="zone-stat-value">0</div>
                        <div class="zone-stat-label">Ocupados</div>
                    </div>
                </div>

                <div class="zone-footer">
                    <span class="zone-status ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    },

    /**
     * Adjuntar listeners a botones de tarjetas
     */
    attachZoneCardListeners() {
        document.querySelectorAll('#zones-grid [data-action]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const zoneId = btn.dataset.id;

                if (action === 'edit') {
                    this.editZone(zoneId);
                } else if (action === 'delete') {
                    this.deleteZone(zoneId);
                }
            });
        });
    },

    /**
     * Abrir modal para crear/editar zona
     */
    openModal(zoneId = null) {
        const modal = document.getElementById('zone-modal');
        const form = document.getElementById('zone-form');
        const title = document.getElementById('zone-modal-title');

        form.reset();
        this.editingZoneId = zoneId;

        if (zoneId) {
            title.textContent = 'Editar Zona';
            const zone = this.zones.find(z => z.id === zoneId);
            if (zone) {
                document.getElementById('zone-name').value = zone.name;
                document.getElementById('zone-description').value = zone.description || '';
                document.getElementById('zone-capacity').value = zone.capacity;
                document.getElementById('zone-type').value = zone.type || '';
                document.getElementById('zone-active').checked = zone.isActive !== false;
            }
        } else {
            title.textContent = 'Nueva Zona';
        }

        modal.classList.remove('hidden');
    },

    /**
     * Cerrar modal
     */
    closeModal() {
        document.getElementById('zone-modal').classList.add('hidden');
        this.editingZoneId = null;
    },

    /**
     * Guardar zona
     */
    async saveZone() {
        try {
            const zoneData = {
                name: document.getElementById('zone-name').value,
                description: document.getElementById('zone-description').value,
                capacity: parseInt(document.getElementById('zone-capacity').value),
                type: document.getElementById('zone-type').value,
                isActive: document.getElementById('zone-active').checked
            };

            if (this.editingZoneId) {
                await API.zones.updateZone(this.editingZoneId, zoneData);
                showNotification('Zona actualizada correctamente', 'success');
            } else {
                await API.zones.createZone(zoneData);
                showNotification('Zona creada correctamente', 'success');
            }

            this.closeModal();
            await this.loadZones();
        } catch (error) {
            console.error('Error guardando zona:', error);
            showNotification('Error al guardar la zona', 'error');
        }
    },

    /**
     * Editar zona
     */
    editZone(zoneId) {
        this.openModal(zoneId);
    },

    /**
     * Eliminar zona
     */
    async deleteZone(zoneId) {
        if (!confirm('¿Está seguro de que desea eliminar esta zona?')) return;

        try {
            await API.zones.deleteZone(zoneId);
            showNotification('Zona eliminada correctamente', 'success');
            await this.loadZones();
        } catch (error) {
            console.error('Error eliminando zona:', error);
            showNotification('Error al eliminar la zona', 'error');
        }
    },

    /**
     * Filtrar zonas por búsqueda
     */
    filterZones(searchTerm) {
        const filtered = this.zones.filter(zone =>
            zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (zone.description && zone.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        this.renderZones(filtered);
    },

    /**
     * Actualizar opciones de zonas en select
     */
    updateZoneSelects() {
        const selects = document.querySelectorAll('#space-zone');
        selects.forEach(select => {
            select.innerHTML = '<option value="">Seleccionar zona</option>' +
                this.zones.map(zone => `<option value="${zone.id}">${zone.name}</option>`).join('');
        });
    },

    /**
     * Mostrar loading
     */
    showLoading(containerId) {
        document.getElementById(containerId).innerHTML = '<div class="loading">Cargando zonas...</div>';
    },

    /**
     * Actualizar analytics
     */
    updateAnalytics() {
        document.getElementById('total-zones').textContent = this.zones.length;
        this.renderZonesInDashboard();
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
                <div class="zone-list-icon">🅿️</div>
                <div class="zone-list-content">
                    <h4 class="zone-list-name">${zone.name}</h4>
                    <p class="zone-list-info">Capacidad: ${zone.capacity} espacios</p>
                </div>
                <div class="zone-list-status">
                    ${zone.isActive ? '<span style="color: #27ae60;">✓ Activa</span>' : '<span style="color: #e74c3c;">✗ Inactiva</span>'}
                </div>
            </div>
        `).join('');
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ZonesComponent.init();
});
