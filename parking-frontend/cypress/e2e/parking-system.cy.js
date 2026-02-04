/**
 * Cypress E2E Tests - Parking System
 * Tests critical user workflows and integrations
 */

describe('Parking System E2E Tests', () => {
    beforeEach(() => {
        // Visit the application before each test
        cy.visit('http://localhost:8000');
        // Wait for the page to load
        cy.get('body').should('exist');
    });

    describe('Zone Management Workflows', () => {
        it('should create a new zone successfully', () => {
            // Navigate to zone creation
            cy.contains('Crear Zona').click();

            // Fill form
            cy.get('input[name="name"]').type('Zona Test E2E');
            cy.get('input[name="capacity"]').clear().type('15');
            cy.get('select[name="type"]').select('VIP');

            // Submit form
            cy.get('button[type="submit"]').click();

            // Verify success
            cy.contains('Zona creada exitosamente').should('be.visible');
            cy.contains('Zona Test E2E').should('be.visible');
        });

        it('should display zone in list after creation', () => {
            // Create zone
            cy.contains('Crear Zona').click();
            cy.get('input[name="name"]').type('Zona Lista E2E');
            cy.get('input[name="capacity"]').clear().type('10');
            cy.get('button[type="submit"]').click();

            // Navigate to zones list
            cy.contains('Zonas').click();

            // Verify zone appears in list
            cy.contains('Zona Lista E2E').should('be.visible');
        });

        it('should edit zone details', () => {
            // Find and open zone for editing
            cy.contains('Zonas').click();
            cy.contains('Zona VIP').parent().contains('Editar').click();

            // Update zone name
            cy.get('input[name="name"]').clear().type('Zona VIP Actualizada');
            cy.get('button[type="submit"]').click();

            // Verify update
            cy.contains('Zona actualizada exitosamente').should('be.visible');
        });

        it('should delete a zone', () => {
            // Navigate to zones
            cy.contains('Zonas').click();

            // Find zone and delete
            cy.contains('Zona Normal')
                .parent()
                .contains('Eliminar')
                .click();

            // Confirm deletion
            cy.get('.modal-footer').contains('Confirmar').click();

            // Verify deletion
            cy.contains('Zona eliminada exitosamente').should('be.visible');
        });

        it('should validate zone capacity range (5-25)', () => {
            cy.contains('Crear Zona').click();
            cy.get('input[name="name"]').type('Zona Invalid');

            // Try with capacity < 5
            cy.get('input[name="capacity"]').type('3');
            cy.get('button[type="submit"]').click();
            cy.contains('debe estar entre 5 y 25').should('be.visible');

            // Try with capacity > 25
            cy.get('input[name="capacity"]').clear().type('30');
            cy.get('button[type="submit"]').click();
            cy.contains('debe estar entre 5 y 25').should('be.visible');
        });
    });

    describe('Space Management Workflows', () => {
        it('should create a space in a zone', () => {
            // Navigate to spaces
            cy.contains('Espacios').click();
            cy.contains('Crear Espacio').click();

            // Select zone
            cy.get('select[name="zoneId"]').select('Zona VIP');

            // Code should auto-generate
            cy.get('input[name="codigo"]').should('have.value', 'A-001');

            // Set status
            cy.get('select[name="status"]').select('AVAILABLE');

            // Submit
            cy.get('button[type="submit"]').click();

            // Verify
            cy.contains('Espacio creado exitosamente').should('be.visible');
            cy.contains('A-001').should('be.visible');
        });

        it('should update space status from AVAILABLE to OCCUPIED', () => {
            // Navigate to spaces
            cy.contains('Espacios').click();

            // Find available space
            cy.contains('A-001')
                .parent()
                .within(() => {
                    cy.contains('Disponible').should('be.visible');
                });

            // Click edit
            cy.contains('A-001').parent().contains('Editar').click();

            // Change status
            cy.get('select[name="status"]').select('OCCUPIED');
            cy.get('button[type="submit"]').click();

            // Verify status change
            cy.contains('Espacio actualizado exitosamente').should('be.visible');
            cy.contains('A-001').parent().contains('Ocupado').should('be.visible');
        });

        it('should verify capacity decreases when space becomes occupied', () => {
            // Get initial capacity
            cy.contains('Zonas').click();
            cy.contains('Zona VIP').parent().within(() => {
                cy.get('[data-testid="available-capacity"]')
                    .invoke('text')
                    .as('initialCapacity');
            });

            // Navigate to spaces and occupy one
            cy.contains('Espacios').click();
            cy.contains('A-001').parent().contains('Editar').click();
            cy.get('select[name="status"]').select('OCCUPIED');
            cy.get('button[type="submit"]').click();

            // Verify capacity decreased
            cy.contains('Zonas').click();
            cy.contains('Zona VIP').parent().within(() => {
                cy.get('[data-testid="available-capacity"]')
                    .invoke('text')
                    .then(currentCapacity => {
                        expect(parseInt(currentCapacity)).to.be.lessThan(20);
                    });
            });
        });

        it('should filter spaces by zone', () => {
            cy.contains('Espacios').click();

            // Select filter
            cy.get('select[name="zoneFilter"]').select('Zona VIP');

            // Verify only Zona VIP spaces shown
            cy.get('[data-testid="space-item"]').each(space => {
                cy.wrap(space).should('contain', 'A-');
            });
        });

        it('should filter spaces by status', () => {
            cy.contains('Espacios').click();

            // Select status filter
            cy.get('select[name="statusFilter"]').select('AVAILABLE');

            // Verify all displayed spaces are available
            cy.get('[data-testid="space-item"]').each(space => {
                cy.wrap(space).should('contain', 'Disponible');
            });
        });

        it('should reserve a space', () => {
            cy.contains('Espacios').click();
            cy.contains('A-002').parent().contains('Editar').click();

            // Check reserved checkbox
            cy.get('input[type="checkbox"][name="reserved"]').check();
            cy.get('button[type="submit"]').click();

            // Verify
            cy.contains('Espacio actualizado exitosamente').should('be.visible');
            cy.contains('A-002').parent().should('contain', 'Reservado');
        });
    });

    describe('Dashboard Functionality', () => {
        it('should display dashboard with statistics', () => {
            cy.contains('Dashboard').click();

            // Verify key statistics are visible
            cy.get('[data-testid="total-spaces"]').should('be.visible');
            cy.get('[data-testid="occupied-spaces"]').should('be.visible');
            cy.get('[data-testid="available-spaces"]').should('be.visible');
            cy.get('[data-testid="occupancy-percentage"]').should('be.visible');
        });

        it('should display zone summary cards', () => {
            cy.contains('Dashboard').click();

            // Verify zone cards
            cy.get('[data-testid="zone-card"]').should('have.length.greaterThan', 0);

            // Each card should show zone info
            cy.get('[data-testid="zone-card"]').first().within(() => {
                cy.contains('Zona').should('be.visible');
                cy.get('[data-testid="zone-occupancy"]').should('be.visible');
            });
        });

        it('should display recent activities', () => {
            cy.contains('Dashboard').click();

            // Recent activities section
            cy.get('[data-testid="recent-activities"]').should('be.visible');
            cy.get('[data-testid="activity-item"]').should('have.length.greaterThan', 0);
        });

        it('should show occupancy percentage correctly', () => {
            cy.contains('Dashboard').click();

            // Get occupancy percentage
            cy.get('[data-testid="occupancy-percentage"]').invoke('text').then(text => {
                const percentage = parseInt(text);
                expect(percentage).to.be.greaterThanOrEqual(0);
                expect(percentage).to.be.lessThanOrEqual(100);
            });
        });

        it('should update dashboard statistics in real-time', () => {
            // Get initial stats
            cy.contains('Dashboard').click();
            cy.get('[data-testid="occupied-spaces"]')
                .invoke('text')
                .as('initialOccupied');

            // Create and occupy a space
            cy.contains('Espacios').click();
            cy.contains('Crear Espacio').click();
            cy.get('select[name="zoneId"]').select('Zona VIP');
            cy.get('select[name="status"]').select('OCCUPIED');
            cy.get('button[type="submit"]').click();

            // Return to dashboard
            cy.contains('Dashboard').click();

            // Verify stats updated
            cy.get('[data-testid="occupied-spaces"]')
                .invoke('text')
                .then(newOccupied => {
                    cy.get('@initialOccupied').then(initial => {
                        expect(parseInt(newOccupied)).to.equal(parseInt(initial) + 1);
                    });
                });
        });
    });

    describe('Analytics Functionality', () => {
        it('should display analytics page', () => {
            cy.contains('Analytics').click();
            cy.get('[data-testid="analytics-container"]').should('be.visible');
        });

        it('should show zone occupancy chart', () => {
            cy.contains('Analytics').click();
            cy.get('[data-testid="zone-occupancy-chart"]').should('be.visible');
        });

        it('should display occupancy trend', () => {
            cy.contains('Analytics').click();
            cy.get('[data-testid="occupancy-trend"]').should('be.visible');
        });
    });

    describe('Navigation and UI', () => {
        it('should navigate between main sections', () => {
            // Test navigation to each main section
            cy.contains('Zonas').click();
            cy.get('[data-testid="zones-container"]').should('be.visible');

            cy.contains('Espacios').click();
            cy.get('[data-testid="spaces-container"]').should('be.visible');

            cy.contains('Dashboard').click();
            cy.get('[data-testid="dashboard-container"]').should('be.visible');
        });

        it('should display responsive layout on mobile', () => {
            cy.viewport('iphone-x');

            // Menu should be accessible
            cy.get('[data-testid="mobile-menu"]').should('exist');

            // Click menu
            cy.get('[data-testid="mobile-menu"]').click();

            // Navigation items should be visible
            cy.contains('Zonas').should('be.visible');
        });

        it('should close notifications automatically', () => {
            cy.contains('Crear Zona').click();
            cy.get('input[name="name"]').type('Quick Zone');
            cy.get('input[name="capacity"]').clear().type('10');
            cy.get('button[type="submit"]').click();

            // Notification should be visible initially
            cy.contains('exitosamente').should('be.visible');

            // Wait for auto-close
            cy.contains('exitosamente', { timeout: 5000 }).should('not.exist');
        });
    });

    describe('Error Handling', () => {
        it('should display error when zone creation fails', () => {
            cy.contains('Crear Zona').click();

            // Submit without filling required fields
            cy.get('button[type="submit"]').click();

            // Error message should appear
            cy.contains('requerido').should('be.visible');
        });

        it('should handle API connection errors gracefully', () => {
            // Simulate network error by intercepting API
            cy.intercept('GET', '/api/zones', { forceNetworkError: true });

            cy.contains('Zonas').click();

            // Error message should be displayed
            cy.contains('Error|conexión|no disponible', { timeout: 5000 }).should('exist');
        });

        it('should handle 404 errors', () => {
            cy.intercept('GET', '/api/zones/*', { statusCode: 404 });

            cy.contains('Zonas').click();
            cy.contains('Zona Test').click();

            // Should show 404 error
            cy.contains('no encontrado|No existe', { timeout: 5000 }).should('exist');
        });
    });

    describe('Data Persistence', () => {
        it('should persist data after page reload', () => {
            // Create a zone
            cy.contains('Crear Zona').click();
            cy.get('input[name="name"]').type('Persistent Zone');
            cy.get('input[name="capacity"]').clear().type('12');
            cy.get('button[type="submit"]').click();

            // Reload page
            cy.reload();

            // Zone should still be visible
            cy.contains('Persistent Zone').should('be.visible');
        });

        it('should maintain filter selections after page reload', () => {
            cy.contains('Espacios').click();
            cy.get('select[name="zoneFilter"]').select('Zona VIP');

            // Reload
            cy.reload();

            // Filter should still be applied
            cy.get('select[name="zoneFilter"]').should('have.value', 'Zona VIP');
        });
    });
});
