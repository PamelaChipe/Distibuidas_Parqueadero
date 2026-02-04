/**
 * Componente de Espacios
 * Gestiona la renderización y lógica de espacios de parqueadero
 */

const SpacesComponent = {
    spaces: [],
    filteredSpaces: [],
    editingSpaceId: null,

    /**
     * Inicializar el componente
     */
    init() {
        this.setupEventListeners();
        this.loadSpaces();
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Botón nuevo espacio
        document.getElementById('btn-new-space')?.addEventListener('click', () => {
            this.openModal();
        });

        // Filtros
        document.getElementById('filter-by-zone')?.addEventListener('change', () => {
            this.applyFilters();
        });

        document.getElementById('filter-by-status')?.addEventListener('change', () => {
            this.applyFilters();
        });

        // Formulario
        document.getElementById('space-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSpace();
        });

        // Botones del modal
        document.querySelectorAll('#space-modal .btn-close, #space-modal [data-action="cancel"]')
            .forEach(btn => {
                btn.addEventListener('click', () => this.closeModal());
            });

        // Cerrar modal al hacer clic afuera
        document.getElementById('space-modal')?.addEventListener('click', (e) => {
            if (e.target === document.getElementById('space-modal')) {
                this.closeModal();
            }
        });
    },

    /**
     * Cargar espacios del API
     */
    async loadSpaces() {
        try {
            this.showLoading('spaces-grid');
            this.spaces = await API.spaces.getAllSpaces();
            this.filteredSpaces = this.spaces;
            this.renderSpaces(this.spaces);
            this.updateAnalytics();
            this.updateFilters();
        } catch (error) {
            console.error('Error cargando espacios:', error);
            showNotification('Error al cargar los espacios', 'error');
            document.getElementById('spaces-grid').innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon"><span class="material-icons">warning</span></div>
                    <p>Error al cargar los espacios. Verifique que el servidor esté ejecutándose.</p>
                </div>
            `;
        }
    },

    /**
     * Renderizar espacios
     */
    renderSpaces(spaces = this.filteredSpaces) {
        const container = document.getElementById('spaces-grid');

        if (!spaces || spaces.length === 0) {
            container.innerHTML = `
                <div class="empty-space" style="grid-column: 1 / -1;">
                    <div class="empty-space-icon"><span class="material-icons">local_parking</span></div>
                    <p>No hay espacios registrados o coincidentes con los filtros</p>
                </div>
            `;
            return;
        }

        container.innerHTML = spaces.map(space => this.createSpaceCard(space)).join('');
        this.attachSpaceCardListeners();
    },

    /**
     * Crear tarjeta de espacio
     */
    createSpaceCard(space) {
        const statusClass = space.status?.toLowerCase() || 'available';
        const statusIcons = {
            available: '<span class="material-icons">check_circle</span>',
            occupied: '<span class="material-icons">cancel</span>',
            maintenance: '<span class="material-icons">build</span>'
        };
        const statusTexts = {
            available: 'Disponible',
            occupied: 'Ocupado',
            maintenance: 'Mantenimiento'
        };

        const icon = statusIcons[statusClass] || '❓';
        const statusText = statusTexts[statusClass] || space.status;

        const priorityStars = Array(10).fill(0).map((_, i) =>
            `<span class="priority-dot ${i < (space.priority || 5) ? 'active' : ''}"></span>`
        ).join('');

        return `
            <div class="space-card card shadow-sm ${statusClass} ${space.isReserved ? 'reserved' : ''}">
                <div class="space-header">
                    <h3 class="space-codigo">${space.codigo || 'N/A'}</h3>
                    <span class="space-badge badge ${statusClass}">${statusText}</span>
                </div>

                <div class="space-status-icon">${icon}</div>

                <div class="space-info">
                    <div class="space-info-row">
                        <span class="space-info-label">Zona</span>
                        <span class="space-zone-name">${space.zoneName || 'N/A'}</span>
                    </div>
                    <div class="space-info-row">
                        <span class="space-info-label">Prioridad</span>
                        <div class="priority-dots">${priorityStars}</div>
                    </div>
                    ${space.isReserved ? `
                        <div class="space-info-row">
                            <span class="space-reserved-flag"><span class="material-icons icon-inline">lock</span>Reservado</span>
                        </div>
                    ` : ''}
                </div>

                <div class="space-card-actions">
                    <button class="btn btn-outline-primary btn-sm" data-action="edit" data-id="${space.id}"><span class="material-icons icon-inline">edit</span>Editar</button>
                    <button class="btn btn-outline-danger btn-sm" data-action="delete" data-id="${space.id}"><span class="material-icons icon-inline">delete</span>Eliminar</button>
                </div>
            </div>
        `;
    },

    /**
     * Adjuntar listeners a botones de tarjetas
     */
    attachSpaceCardListeners() {
        document.querySelectorAll('#spaces-grid [data-action]').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const spaceId = btn.dataset.id;

                if (action === 'edit') {
                    this.editSpace(spaceId);
                } else if (action === 'delete') {
                    this.deleteSpace(spaceId);
                }
            });
        });
    },

    /**
     * Abrir modal para crear/editar espacio
     */
    openModal(spaceId = null) {
        const modal = document.getElementById('space-modal');
        const form = document.getElementById('space-form');
        const title = document.getElementById('space-modal-title');

        form.reset();
        this.editingSpaceId = spaceId;

        // Actualizar dropdown de zonas
        this.populateZoneDropdown();

        if (spaceId) {
            title.textContent = 'Editar Espacio';
            const space = this.spaces.find(s => s.id === spaceId);
            if (space) {
                document.getElementById('space-codigo').value = space.codigo || '';
                document.getElementById('space-zone').value = space.idZone || '';
                document.getElementById('space-status').value = space.status || 'AVAILABLE';
                document.getElementById('space-priority').value = space.priority || 5;
                document.getElementById('space-reserved').checked = space.isReserved || false;
            }
        } else {
            title.textContent = 'Nuevo Espacio';
            // Generar código automático
            document.getElementById('space-codigo').value = this.generateCode();
        }

        modal.classList.remove('hidden');
    },

    /**
     * Cerrar modal
     */
    closeModal() {
        document.getElementById('space-modal').classList.add('hidden');
        this.editingSpaceId = null;
    },

    /**
     * Guardar espacio
     */
    async saveSpace() {
        try {
            const spaceData = {
                codigo: document.getElementById('space-codigo').value,
                idZone: document.getElementById('space-zone').value,
                status: document.getElementById('space-status').value,
                priority: parseInt(document.getElementById('space-priority').value),
                isReserved: document.getElementById('space-reserved').checked
            };

            if (this.editingSpaceId) {
                await API.spaces.updateSpace(this.editingSpaceId, spaceData);
                showNotification('Espacio actualizado correctamente', 'success');
            } else {
                await API.spaces.createSpace(spaceData);
                showNotification('Espacio creado correctamente', 'success');
            }

            this.closeModal();
            await this.loadSpaces();
        } catch (error) {
            console.error('Error guardando espacio:', error);
            showNotification('Error al guardar el espacio', 'error');
        }
    },

    /**
     * Editar espacio
     */
    editSpace(spaceId) {
        this.openModal(spaceId);
    },

    /**
     * Eliminar espacio
     */
    async deleteSpace(spaceId) {
        if (!confirm('¿Está seguro de que desea eliminar este espacio?')) return;

        try {
            await API.spaces.deleteSpace(spaceId);
            showNotification('Espacio eliminado correctamente', 'success');
            await this.loadSpaces();
        } catch (error) {
            console.error('Error eliminando espacio:', error);
            showNotification('Error al eliminar el espacio', 'error');
        }
    },

    /**
     * Aplicar filtros
     */
    applyFilters() {
        const zoneFilter = document.getElementById('filter-by-zone').value;
        const statusFilter = document.getElementById('filter-by-status').value;

        this.filteredSpaces = this.spaces.filter(space => {
            const zoneMatch = !zoneFilter || space.idZone === zoneFilter;
            const statusMatch = !statusFilter || space.status === statusFilter;
            return zoneMatch && statusMatch;
        });

        this.renderSpaces();
    },

    /**
     * Actualizar opciones de filtros
     */
    updateFilters() {
        const zoneSelect = document.getElementById('filter-by-zone');
        if (zoneSelect && ZonesComponent.zones) {
            zoneSelect.innerHTML = '<option value="">Todas las zonas</option>' +
                ZonesComponent.zones.map(zone => `<option value="${zone.id}">${zone.name}</option>`).join('');
        }
    },

    /**
     * Poblar dropdown de zonas en modal
     */
    async populateZoneDropdown() {
        const zoneSelect = document.getElementById('space-zone');
        if (!zoneSelect) return;

        try {
            let zones;
            // Si ZonesComponent está disponible, usar sus zonas
            if (typeof ZonesComponent !== 'undefined' && ZonesComponent.zones && ZonesComponent.zones.length > 0) {
                zones = ZonesComponent.zones;
            } else {
                // Si no, obtener las zonas del API
                zones = await API.zones.getAllZones();
            }

            zoneSelect.innerHTML = '<option value="">Seleccionar zona...</option>' +
                zones.map(zone => `<option value="${zone.id}">${zone.name}</option>`).join('');
        } catch (error) {
            console.error('Error cargando zonas para dropdown:', error);
            zoneSelect.innerHTML = '<option value="">Error al cargar zonas</option>';
        }
    },

    /**
     * Generar código automático para espacio
     */
    generateCode() {
        // Contar espacios existentes y generar siguiente código
        const lastSpace = this.spaces.length > 0
            ? this.spaces.sort((a, b) => {
                // Extraer número del código (ej: A-001 -> 1)
                const aNum = parseInt(a.codigo?.split('-')[1] || 0);
                const bNum = parseInt(b.codigo?.split('-')[1] || 0);
                return bNum - aNum;
            })[0]
            : null;

        let nextNumber = 1;
        if (lastSpace) {
            const match = lastSpace.codigo?.match(/-(\d+)$/);
            if (match) {
                nextNumber = parseInt(match[1]) + 1;
            }
        }

        return `A-${String(nextNumber).padStart(3, '0')}`;
    },

    /**
     * Mostrar loading
     */
    showLoading(containerId) {
        document.getElementById(containerId).innerHTML = '<div class="loading">Cargando espacios...</div>';
    },

    /**
     * Actualizar analytics
     */
    updateAnalytics() {
        const available = this.spaces.filter(s => s.status === 'AVAILABLE').length;
        const occupied = this.spaces.filter(s => s.status === 'OCCUPIED').length;

        const totalSpacesEl = document.getElementById('total-spaces');
        const availableSpacesEl = document.getElementById('available-spaces');
        const occupiedSpacesEl = document.getElementById('occupied-spaces');

        if (totalSpacesEl) {
            totalSpacesEl.textContent = this.spaces.length;
        }
        if (availableSpacesEl) {
            availableSpacesEl.textContent = available;
        }
        if (occupiedSpacesEl) {
            occupiedSpacesEl.textContent = occupied;
        }

        if (typeof AnalyticsComponent !== 'undefined' && document.getElementById('analytics-section')) {
            AnalyticsComponent.loadAnalytics();
        }
    }
};

// Inicializar cuando el DOM esté listo (solo si estamos en la página de espacios)
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si el elemento spaces-grid existe (página de spaces.html)
    if (document.getElementById('spaces-grid')) {
        SpacesComponent.init();
    }
});
