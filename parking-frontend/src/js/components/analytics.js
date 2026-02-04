/**
 * Componente de Analytics
 * Gestiona la visualización de análisis y reportes
 */

const AnalyticsComponent = {
    zones: [],
    spaces: [],

    /**
     * Inicializar el componente
     */
    init() {
        this.setupEventListeners();
        const analyticsSection = document.getElementById('analytics-section');
        if (analyticsSection && analyticsSection.classList.contains('active')) {
            this.loadAnalytics();
        }
    },

    /**
     * Configurar event listeners
     */
    setupEventListeners() {
        // Escuchar cambios en la sección de analytics
        document.querySelectorAll('[data-section="analytics"]').forEach(link => {
            link.addEventListener('click', () => {
                setTimeout(() => this.loadAnalytics(), 100);
            });
        });
    },

    /**
     * Cargar datos de analytics
     */
    async loadAnalytics() {
        try {
            // Cargar zonas y espacios
            this.zones = await API.zones.getAllZones();
            this.spaces = await API.spaces.getAllSpaces();

            this.generateOccupancyChart();
            this.generateStatusChart();
            this.generateAnalyticsTable();
        } catch (error) {
            console.error('Error cargando datos para analytics:', error);
            showNotification('Error al cargar el análisis', 'error');
        }
    },

    /**
     * Generar gráfico de ocupación por zona
     */
    generateOccupancyChart() {
        const container = document.getElementById('occupancy-chart');
        if (!container || !this.zones || this.zones.length === 0) {
            if (container) {
                container.innerHTML = '<p class="text-muted">No hay datos disponibles</p>';
            }
            return;
        }

        try {
            const zoneStats = this.zones.map(zone => {
                const spaceInZone = this.spaces.filter(s => s.idZone === zone.id);
                const occupied = spaceInZone.filter(s => s.status === 'OCCUPIED').length;
                const total = zone.capacity ?? (spaceInZone.length || 1);
                const percentage = Math.round((occupied / total) * 100);
                return { name: zone.name, occupied, total, percentage };
            });

            const chartHTML = `
                <div class="chart-content">
                    ${zoneStats.length > 0 ? zoneStats.map(stat => `
                        <div class="chart-item">
                            <div class="chart-label">
                                <strong>${stat.name}</strong>
                                <span>${stat.occupied}/${stat.total}</span>
                            </div>
                            <div class="chart-bar">
                                <div class="chart-bar-fill" style="width: ${stat.percentage}%;"></div>
                            </div>
                            <div class="chart-value">${stat.percentage}%</div>
                        </div>
                    `).join('') : '<p class="text-muted">No hay datos disponibles</p>'}
                </div>
            `;

            container.innerHTML = chartHTML;
        } catch (error) {
            console.error('Error generando gráfico de ocupación:', error);
            container.innerHTML = '<p class="text-danger">Error al cargar el gráfico</p>';
        }
    },

    /**
     * Generar gráfico de distribución de estados
     */
    generateStatusChart() {
        const container = document.getElementById('status-chart');
        if (!container || !this.spaces || this.spaces.length === 0) {
            if (container) {
                container.innerHTML = '<p class="text-muted">No hay datos disponibles</p>';
            }
            return;
        }

        try {
            const available = this.spaces.filter(s => s.status === 'AVAILABLE').length;
            const occupied = this.spaces.filter(s => s.status === 'OCCUPIED').length;
            const maintenance = this.spaces.filter(s => s.status === 'MAINTENANCE').length;
            const total = this.spaces.length || 1;

            const availablePercent = Math.round((available / total) * 100);
            const occupiedPercent = Math.round((occupied / total) * 100);
            const maintenancePercent = Math.round((maintenance / total) * 100);

            const chartHTML = `
                <div class="chart-content">
                    <div class="chart-item">
                        <div class="chart-label">
                            <strong><span class="material-icons icon-inline">check_circle</span>Disponibles</strong>
                            <span>${available}</span>
                        </div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill success-fill" style="width: ${availablePercent}%;"></div>
                        </div>
                        <div class="chart-value">${availablePercent}%</div>
                    </div>
                    <div class="chart-item">
                        <div class="chart-label">
                            <strong><span class="material-icons icon-inline">cancel</span>Ocupados</strong>
                            <span>${occupied}</span>
                        </div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill danger-fill" style="width: ${occupiedPercent}%;"></div>
                        </div>
                        <div class="chart-value">${occupiedPercent}%</div>
                    </div>
                    <div class="chart-item">
                        <div class="chart-label">
                            <strong><span class="material-icons icon-inline">build</span>Mantenimiento</strong>
                            <span>${maintenance}</span>
                        </div>
                        <div class="chart-bar">
                            <div class="chart-bar-fill warning-fill" style="width: ${maintenancePercent}%;"></div>
                        </div>
                        <div class="chart-value">${maintenancePercent}%</div>
                    </div>
                </div>
            `;

            container.innerHTML = chartHTML;
        } catch (error) {
            console.error('Error generando gráfico de estados:', error);
            container.innerHTML = '<p class="text-danger">Error al cargar el gráfico</p>';
        }
    },

    /**
     * Generar tabla de analytics
     */
    generateAnalyticsTable() {
        const tbody = document.getElementById('analytics-table-body');
        if (!tbody || !this.zones || this.zones.length === 0) {
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No hay datos disponibles</td></tr>';
            }
            return;
        }

        try {
            const rows = this.zones.map(zone => {
                const spaceInZone = this.spaces.filter(s => s.idZone === zone.id);
                const availableComputed = spaceInZone.filter(s => s.status === 'AVAILABLE').length;
                const occupied = spaceInZone.filter(s => s.status === 'OCCUPIED').length;
                const maintenance = spaceInZone.filter(s => s.status === 'MAINTENANCE').length;
                const total = zone.capacity ?? spaceInZone.length;
                const available = zone.availableCapacity ?? availableComputed;
                const occupancyPercent = total > 0 ? Math.round((occupied / total) * 100) : 0;

                return `
                    <tr>
                        <td><strong>${zone.name}</strong></td>
                        <td class="text-center">${available}</td>
                        <td class="text-center">${occupied}</td>
                        <td class="text-center">${maintenance}</td>
                        <td class="text-center"><strong>${total}</strong></td>
                        <td class="text-center">
                            <div class="occupancy-bar">
                                <div class="occupancy-bar-fill" style="width: ${occupancyPercent}%;"></div>
                            </div>
                            ${occupancyPercent}%
                        </td>
                    </tr>
                `;
            });

            tbody.innerHTML = rows.length > 0 ? rows.join('') : '<tr><td colspan="6" class="text-center text-muted">No hay datos disponibles</td></tr>';
        } catch (error) {
            console.error('Error generando tabla de analytics:', error);
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error al cargar la tabla</td></tr>';
        }
    }
};

// Agregar estilos de analytics
const analyticsStyles = `
    .chart-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .chart-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .chart-label {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        min-width: 120px;
    }

    .chart-label strong {
        font-size: 0.9rem;
    }

    .chart-label span {
        font-size: 0.75rem;
        color: var(--text-light);
    }

    .chart-bar {
        flex: 1;
        height: 30px;
        background-color: var(--light-bg);
        border-radius: var(--radius-md);
        overflow: hidden;
    }

    .chart-bar-fill {
        height: 100%;
        background-color: var(--primary-color);
        transition: width 0.3s ease;
    }

    .chart-bar-fill.success-fill {
        background-color: var(--success-color);
    }

    .chart-bar-fill.danger-fill {
        background-color: var(--danger-color);
    }

    .chart-bar-fill.warning-fill {
        background-color: var(--warning-color);
    }

    .chart-value {
        min-width: 50px;
        text-align: right;
        font-weight: 600;
        color: var(--text-dark);
    }

    .text-center {
        text-align: center;
    }

    .occupancy-bar {
        width: 100%;
        height: 20px;
        background-color: var(--light-bg);
        border-radius: var(--radius-md);
        overflow: hidden;
        margin-bottom: var(--spacing-sm);
    }

    .occupancy-bar-fill {
        height: 100%;
        background-color: var(--primary-color);
        transition: width 0.3s ease;
    }
`;

// Inyectar estilos
const analyticsStyleSheet = document.createElement('style');
analyticsStyleSheet.textContent = analyticsStyles;
document.head.appendChild(analyticsStyleSheet);

// Inicializar cuando el DOM esté listo (solo si existe analytics-section)
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('analytics-section')) {
        AnalyticsComponent.init();
    }
});
