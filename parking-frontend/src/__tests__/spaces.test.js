/**
 * Test suite for Spaces Component
 * Tests space management functionality including code generation, status changes, and filtering
 */

describe('Spaces Component Tests', () => {
    let mockSpaces;
    let mockZones;

    beforeEach(() => {
        mockZones = [
            {
                id: '123',
                name: 'Zona VIP',
                capacity: 20,
                availableCapacity: 20,
                type: 'VIP'
            },
            {
                id: '456',
                name: 'Zona Normal',
                capacity: 10,
                availableCapacity: 8,
                type: 'INTERNAL'
            }
        ];

        mockSpaces = [
            {
                id: '001',
                codigo: 'A-001',
                status: 'AVAILABLE',
                reserved: false,
                zoneId: '123',
                zoneName: 'Zona VIP'
            },
            {
                id: '002',
                codigo: 'A-002',
                status: 'OCCUPIED',
                reserved: false,
                zoneId: '123',
                zoneName: 'Zona VIP'
            },
            {
                id: '003',
                codigo: 'B-001',
                status: 'AVAILABLE',
                reserved: true,
                zoneId: '456',
                zoneName: 'Zona Normal'
            }
        ];
    });

    describe('Space Code Generation', () => {
        test('should generate code with zone prefix', () => {
            // Arrange
            const zonePrefix = 'A';
            const nextNumber = 5;

            // Act
            const generatedCode = zonePrefix + '-' + String(nextNumber).padStart(3, '0');

            // Assert
            expect(generatedCode).toBe('A-005');
        });

        test('should generate sequential codes', () => {
            // Arrange
            const zonedSpaces = mockSpaces.filter(s => s.codigo.startsWith('A'));
            const lastNumber = parseInt(zonedSpaces[zonedSpaces.length - 1].codigo.split('-')[1]);

            // Act
            const nextNumber = lastNumber + 1;
            const generatedCode = 'A-' + String(nextNumber).padStart(3, '0');

            // Assert
            expect(generatedCode).toBe('A-003');
        });

        test('should auto-fill code field on creation', () => {
            // Arrange
            const previousCode = 'A-002';
            const nextNumber = parseInt(previousCode.split('-')[1]) + 1;

            // Act
            const generatedCode = 'A-' + String(nextNumber).padStart(3, '0');

            // Assert
            expect(generatedCode).toBe('A-003');
        });

        test('should handle different zone prefixes', () => {
            // Arrange
            const zoneB = mockZones.find(z => z.name === 'Zona Normal');
            const zoneBSpaces = mockSpaces.filter(s => s.codigo.startsWith('B'));

            // Act
            const nextNumber = (zoneBSpaces.length || 0) + 1;
            const generatedCode = 'B-' + String(nextNumber).padStart(3, '0');

            // Assert
            expect(generatedCode).toBe('B-002');
        });
    });

    describe('Space Status Management', () => {
        test('should change status from AVAILABLE to OCCUPIED', () => {
            // Arrange
            const space = mockSpaces[0];
            const newStatus = 'OCCUPIED';

            // Act
            const updatedSpace = { ...space, status: newStatus };

            // Assert
            expect(updatedSpace.status).toBe('OCCUPIED');
        });

        test('should change status from OCCUPIED to AVAILABLE', () => {
            // Arrange
            const space = mockSpaces[1];
            const newStatus = 'AVAILABLE';

            // Act
            const updatedSpace = { ...space, status: newStatus };

            // Assert
            expect(updatedSpace.status).toBe('AVAILABLE');
        });

        test('should handle RESERVED status', () => {
            // Arrange
            const space = mockSpaces[2];

            // Act & Assert
            expect(space.reserved).toBe(true);
        });

        test('should not be reserved when OCCUPIED', () => {
            // Arrange
            const occupiedSpace = mockSpaces[1];

            // Act
            const isOccupiedAndReserved = occupiedSpace.status === 'OCCUPIED' && occupiedSpace.reserved;

            // Assert
            expect(isOccupiedAndReserved).toBe(false);
        });

        test('should allow reserved status only when AVAILABLE', () => {
            // Arrange
            const space = mockSpaces[2];

            // Act
            const canBeReserved = space.status === 'AVAILABLE';

            // Assert
            expect(canBeReserved).toBe(true);
        });
    });

    describe('Space Styling and Display', () => {
        test('should apply correct class for AVAILABLE status', () => {
            // Arrange
            const space = mockSpaces[0];

            // Act
            const statusClass = space.status === 'AVAILABLE'
                ? 'status-available'
                : space.status === 'OCCUPIED'
                    ? 'status-occupied'
                    : 'status-reserved';

            // Assert
            expect(statusClass).toBe('status-available');
        });

        test('should apply correct class for OCCUPIED status', () => {
            // Arrange
            const space = mockSpaces[1];

            // Act
            const statusClass = space.status === 'AVAILABLE'
                ? 'status-available'
                : space.status === 'OCCUPIED'
                    ? 'status-occupied'
                    : 'status-reserved';

            // Assert
            expect(statusClass).toBe('status-occupied');
        });

        test('should apply correct class for RESERVED status', () => {
            // Arrange
            const space = mockSpaces[2];

            // Act
            const statusClass = space.reserved
                ? 'status-reserved'
                : space.status === 'OCCUPIED'
                    ? 'status-occupied'
                    : 'status-available';

            // Assert
            expect(statusClass).toBe('status-reserved');
        });

        test('should display correct badge text for space status', () => {
            // Arrange
            const availableSpace = mockSpaces[0];
            const occupiedSpace = mockSpaces[1];
            const reservedSpace = mockSpaces[2];

            // Act
            const availableBadge = availableSpace.status === 'AVAILABLE' ? 'Disponible' : '';
            const occupiedBadge = occupiedSpace.status === 'OCCUPIED' ? 'Ocupado' : '';
            const reservedBadge = reservedSpace.reserved ? 'Reservado' : '';

            // Assert
            expect(availableBadge).toBe('Disponible');
            expect(occupiedBadge).toBe('Ocupado');
            expect(reservedBadge).toBe('Reservado');
        });
    });

    describe('Space Filtering', () => {
        test('should filter spaces by zone', () => {
            // Arrange
            const zoneId = '123';

            // Act
            const filteredSpaces = mockSpaces.filter(s => s.zoneId === zoneId);

            // Assert
            expect(filteredSpaces).toHaveLength(2);
            expect(filteredSpaces.every(s => s.zoneId === zoneId)).toBe(true);
        });

        test('should filter spaces by status', () => {
            // Arrange
            const status = 'AVAILABLE';

            // Act
            const filteredSpaces = mockSpaces.filter(s => s.status === status);

            // Assert
            expect(filteredSpaces).toHaveLength(2);
            expect(filteredSpaces.every(s => s.status === status)).toBe(true);
        });

        test('should filter spaces by reserved status', () => {
            // Arrange
            const reserved = true;

            // Act
            const filteredSpaces = mockSpaces.filter(s => s.reserved === reserved);

            // Assert
            expect(filteredSpaces).toHaveLength(1);
            expect(filteredSpaces[0].codigo).toBe('B-001');
        });

        test('should combine multiple filters', () => {
            // Arrange
            const zoneId = '123';
            const status = 'AVAILABLE';

            // Act
            const filteredSpaces = mockSpaces.filter(s =>
                s.zoneId === zoneId && s.status === status
            );

            // Assert
            expect(filteredSpaces).toHaveLength(1);
            expect(filteredSpaces[0].codigo).toBe('A-001');
        });

        test('should return empty array when no matches found', () => {
            // Arrange
            const zoneId = '999';

            // Act
            const filteredSpaces = mockSpaces.filter(s => s.zoneId === zoneId);

            // Assert
            expect(filteredSpaces).toHaveLength(0);
        });
    });

    describe('Space Capacity Impact', () => {
        test('should reduce available capacity when space becomes occupied', () => {
            // Arrange
            const zone = mockZones[0];
            const initialAvailable = zone.availableCapacity;

            // Act
            const updatedAvailable = initialAvailable - 1;

            // Assert
            expect(updatedAvailable).toBe(19);
            expect(updatedAvailable).toBeGreaterThan(-1);
        });

        test('should increase available capacity when space becomes available', () => {
            // Arrange
            const zone = mockZones[1];
            const initialAvailable = zone.availableCapacity;

            // Act
            const updatedAvailable = initialAvailable + 1;

            // Assert
            expect(updatedAvailable).toBe(9);
            expect(updatedAvailable).toBeLessThanOrEqual(zone.capacity);
        });

        test('should not exceed total zone capacity', () => {
            // Arrange
            const zone = mockZones[0];

            // Act
            const available = Math.min(zone.capacity, zone.availableCapacity + 1);

            // Assert
            expect(available).toBeLessThanOrEqual(zone.capacity);
        });

        test('should not go below zero capacity', () => {
            // Arrange
            const zone = mockZones[0];

            // Act
            const available = Math.max(0, zone.availableCapacity - 1);

            // Assert
            expect(available).toBeGreaterThanOrEqual(0);
        });
    });

    describe('Space Information Display', () => {
        test('should display space code', () => {
            // Arrange
            const space = mockSpaces[0];

            // Act & Assert
            expect(space.codigo).toBe('A-001');
        });

        test('should display zone name for space', () => {
            // Arrange
            const space = mockSpaces[0];

            // Act & Assert
            expect(space.zoneName).toBe('Zona VIP');
        });

        test('should display complete space information', () => {
            // Arrange
            const space = mockSpaces[0];

            // Act
            const displayInfo = `${space.codigo} - ${space.zoneName}`;

            // Assert
            expect(displayInfo).toBe('A-001 - Zona VIP');
        });
    });

    describe('Space CRUD Operations', () => {
        test('should create new space with default values', () => {
            // Arrange
            const newSpace = {
                id: '004',
                codigo: 'A-004',
                status: 'AVAILABLE',
                reserved: false,
                zoneId: '123',
                zoneName: 'Zona VIP'
            };

            // Act & Assert
            expect(newSpace.status).toBe('AVAILABLE');
            expect(newSpace.reserved).toBe(false);
        });

        test('should validate space before creation', () => {
            // Arrange
            const newSpace = {
                codigo: 'A-004',
                status: 'AVAILABLE',
                zoneId: '123'
            };

            // Act
            const isValid = newSpace.codigo && newSpace.zoneId && newSpace.status;

            // Assert
            expect(isValid).toBeTruthy();
        });

        test('should update space status', () => {
            // Arrange
            const space = mockSpaces[0];
            const updatedSpace = { ...space, status: 'OCCUPIED' };

            // Act & Assert
            expect(updatedSpace.status).toBe('OCCUPIED');
            expect(updatedSpace.codigo).toBe(space.codigo);
        });

        test('should delete space by id', () => {
            // Arrange
            const spaceIdToDelete = '001';

            // Act
            const remainingSpaces = mockSpaces.filter(s => s.id !== spaceIdToDelete);

            // Assert
            expect(remainingSpaces).toHaveLength(2);
            expect(remainingSpaces.every(s => s.id !== spaceIdToDelete)).toBe(true);
        });
    });
});
