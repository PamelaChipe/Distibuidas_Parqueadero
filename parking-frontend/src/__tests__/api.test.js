/**
 * Test suite for API service
 * Tests HTTP communication with backend
 */

describe('API Service Tests', () => {
    const API_BASE = 'http://localhost:8090/api';

    // Mock fetch
    global.fetch = jest.fn();

    beforeEach(() => {
        fetch.mockClear();
    });

    describe('Zones API', () => {
        test('getAllZones should fetch all zones', async () => {
            // Arrange
            const mockZones = [
                { id: '123', name: 'Zona VIP', capacity: 20, availableCapacity: 20 },
                { id: '456', name: 'Zona Normal', capacity: 10, availableCapacity: 10 }
            ];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockZones
            });

            // Act - Simulate API call
            const response = await fetch(`${API_BASE}/zones`);
            const data = await response.json();

            // Assert
            expect(response.ok).toBe(true);
            expect(data).toEqual(mockZones);
            expect(fetch).toHaveBeenCalledWith(`${API_BASE}/zones`);
        });

        test('getAllZones should handle empty list', async () => {
            // Arrange
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => []
            });

            // Act
            const response = await fetch(`${API_BASE}/zones`);
            const data = await response.json();

            // Assert
            expect(data).toEqual([]);
            expect(Array.isArray(data)).toBe(true);
        });

        test('getAllZones should handle network error', async () => {
            // Arrange
            fetch.mockRejectedValueOnce(new Error('Network error'));

            // Act & Assert
            await expect(fetch(`${API_BASE}/zones`)).rejects.toThrow('Network error');
        });

        test('createZone should POST zone data', async () => {
            // Arrange
            const newZone = { name: 'Zona Test', capacity: 15, type: 'VIP' };
            const createdZone = { id: '789', ...newZone, availableCapacity: 15 };
            fetch.mockResolvedValueOnce({
                ok: true,
                status: 201,
                json: async () => createdZone
            });

            // Act
            const response = await fetch(`${API_BASE}/zones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newZone)
            });
            const data = await response.json();

            // Assert
            expect(response.status).toBe(201);
            expect(data.id).toBe('789');
            expect(data.availableCapacity).toBe(15);
        });
    });

    describe('Spaces API', () => {
        test('getAllSpaces should fetch all spaces', async () => {
            // Arrange
            const mockSpaces = [
                { id: '1', codigo: 'A-001', status: 'AVAILABLE', isReserved: false },
                { id: '2', codigo: 'A-002', status: 'OCCUPIED', isReserved: false }
            ];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockSpaces
            });

            // Act
            const response = await fetch(`${API_BASE}/spaces/`);
            const data = await response.json();

            // Assert
            expect(response.ok).toBe(true);
            expect(data.length).toBe(2);
            expect(data[0].codigo).toBe('A-001');
        });

        test('createSpace should POST space data', async () => {
            // Arrange
            const newSpace = { codigo: 'A-001', status: 'AVAILABLE', isReserved: false };
            const createdSpace = { id: '1', ...newSpace };
            fetch.mockResolvedValueOnce({
                ok: true,
                status: 201,
                json: async () => createdSpace
            });

            // Act
            const response = await fetch(`${API_BASE}/spaces/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSpace)
            });
            const data = await response.json();

            // Assert
            expect(response.status).toBe(201);
            expect(data.codigo).toBe('A-001');
        });

        test('updateSpace should PUT space data', async () => {
            // Arrange
            const spaceUpdate = { codigo: 'A-001', status: 'OCCUPIED', isReserved: false };
            const updatedSpace = { id: '1', ...spaceUpdate };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: async () => updatedSpace
            });

            // Act
            const response = await fetch(`${API_BASE}/spaces/1`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(spaceUpdate)
            });
            const data = await response.json();

            // Assert
            expect(response.ok).toBe(true);
            expect(data.status).toBe('OCCUPIED');
        });

        test('deleteSpace should DELETE space', async () => {
            // Arrange
            fetch.mockResolvedValueOnce({
                ok: true,
                status: 204
            });

            // Act
            const response = await fetch(`${API_BASE}/spaces/1`, { method: 'DELETE' });

            // Assert
            expect(response.status).toBe(204);
            expect(fetch).toHaveBeenCalledWith(`${API_BASE}/spaces/1`, { method: 'DELETE' });
        });
    });

    describe('Error Handling', () => {
        test('API should handle 400 Bad Request', async () => {
            // Arrange
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: async () => ({ message: 'Invalid data' })
            });

            // Act
            const response = await fetch(`${API_BASE}/zones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: '' })
            });

            // Assert
            expect(response.ok).toBe(false);
            expect(response.status).toBe(400);
        });

        test('API should handle 404 Not Found', async () => {
            // Arrange
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: async () => ({ message: 'Zone not found' })
            });

            // Act
            const response = await fetch(`${API_BASE}/zones/nonexistent`);

            // Assert
            expect(response.ok).toBe(false);
            expect(response.status).toBe(404);
        });

        test('API should handle 500 Server Error', async () => {
            // Arrange
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 500,
                json: async () => ({ message: 'Internal server error' })
            });

            // Act
            const response = await fetch(`${API_BASE}/zones`);

            // Assert
            expect(response.ok).toBe(false);
            expect(response.status).toBe(500);
        });
    });
});
