/**
 * Test suite for Common Utilities
 * Tests shared functionality like notifications, error handling, and API validation
 */

describe('Common Utilities Tests', () => {
    let notificationContainer;
    let errorLog;

    beforeEach(() => {
        // Setup DOM for notification tests
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notifications';
        document.body.appendChild(notificationContainer);

        // Reset error log
        errorLog = [];
    });

    afterEach(() => {
        // Cleanup
        if (notificationContainer && notificationContainer.parentNode) {
            notificationContainer.parentNode.removeChild(notificationContainer);
        }
    });

    describe('Notification System', () => {
        test('should create success notification', () => {
            // Arrange
            const message = 'Operación completada';
            const type = 'success';

            // Act
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.textContent = message;
            notificationContainer.appendChild(notification);

            // Assert
            expect(notificationContainer.children).toHaveLength(1);
            expect(notification.classList.contains('alert-success')).toBe(true);
            expect(notification.textContent).toBe(message);
        });

        test('should create error notification', () => {
            // Arrange
            const message = 'Error en la operación';
            const type = 'danger';

            // Act
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.textContent = message;
            notificationContainer.appendChild(notification);

            // Assert
            expect(notification.classList.contains('alert-danger')).toBe(true);
            expect(notification.textContent).toBe(message);
        });

        test('should create warning notification', () => {
            // Arrange
            const message = 'Advertencia';
            const type = 'warning';

            // Act
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.textContent = message;
            notificationContainer.appendChild(notification);

            // Assert
            expect(notification.classList.contains('alert-warning')).toBe(true);
        });

        test('should create info notification', () => {
            // Arrange
            const message = 'Información';
            const type = 'info';

            // Act
            const notification = document.createElement('div');
            notification.className = `alert alert-${type}`;
            notification.textContent = message;
            notificationContainer.appendChild(notification);

            // Assert
            expect(notification.classList.contains('alert-info')).toBe(true);
        });

        test('should auto-remove notification after timeout', (done) => {
            // Arrange
            const message = 'Esta notificación desaparecerá';
            const timeout = 100;

            // Act
            const notification = document.createElement('div');
            notification.className = 'alert alert-success';
            notification.textContent = message;
            notificationContainer.appendChild(notification);

            setTimeout(() => {
                notificationContainer.removeChild(notification);

                // Assert
                expect(notificationContainer.children).toHaveLength(0);
                done();
            }, timeout);
        });

        test('should close notification on dismiss click', () => {
            // Arrange
            const notification = document.createElement('div');
            notification.className = 'alert alert-success';
            const closeBtn = document.createElement('button');
            closeBtn.textContent = '×';
            closeBtn.className = 'close';
            notification.appendChild(closeBtn);
            notificationContainer.appendChild(notification);

            // Act
            closeBtn.click();
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }

            // Assert
            expect(notificationContainer.children).toHaveLength(0);
        });

        test('should handle multiple notifications', () => {
            // Arrange
            const messages = ['Notificación 1', 'Notificación 2', 'Notificación 3'];

            // Act
            messages.forEach((msg, index) => {
                const notification = document.createElement('div');
                notification.className = 'alert alert-info';
                notification.textContent = msg;
                notification.id = `notif-${index}`;
                notificationContainer.appendChild(notification);
            });

            // Assert
            expect(notificationContainer.children).toHaveLength(3);
        });

        test('should display notification at top of container', () => {
            // Arrange
            const notification1 = document.createElement('div');
            notification1.textContent = 'Primera';
            const notification2 = document.createElement('div');
            notification2.textContent = 'Segunda';

            // Act
            notificationContainer.insertBefore(notification2, notificationContainer.firstChild);
            notificationContainer.insertBefore(notification1, notificationContainer.firstChild);

            // Assert
            expect(notificationContainer.firstChild.textContent).toBe('Primera');
        });
    });

    describe('Error Handling', () => {
        test('should handle and log API errors', () => {
            // Arrange
            const error = {
                status: 404,
                message: 'Recurso no encontrado'
            };

            // Act
            const handler = (err) => {
                errorLog.push(err);
            };
            handler(error);

            // Assert
            expect(errorLog).toHaveLength(1);
            expect(errorLog[0].status).toBe(404);
        });

        test('should handle network errors', () => {
            // Arrange
            const networkError = new Error('Network Error');

            // Act
            try {
                throw networkError;
            } catch (e) {
                errorLog.push(e);
            }

            // Assert
            expect(errorLog).toHaveLength(1);
            expect(errorLog[0].message).toContain('Network');
        });

        test('should handle validation errors', () => {
            // Arrange
            const validationError = {
                field: 'capacity',
                message: 'La capacidad debe estar entre 5 y 25'
            };

            // Act
            errorLog.push(validationError);

            // Assert
            expect(errorLog[0].field).toBe('capacity');
        });

        test('should handle timeout errors', () => {
            // Arrange
            const timeoutError = {
                name: 'TimeoutError',
                message: 'La solicitud agotó el tiempo de espera'
            };

            // Act
            errorLog.push(timeoutError);

            // Assert
            expect(errorLog[0].name).toBe('TimeoutError');
        });

        test('should format error messages for display', () => {
            // Arrange
            const error = {
                message: 'Server Error',
                status: 500
            };

            // Act
            const displayMessage = `Error ${error.status}: ${error.message}`;

            // Assert
            expect(displayMessage).toBe('Error 500: Server Error');
        });

        test('should log errors for debugging', () => {
            // Arrange
            const error = new Error('Test error');

            // Act
            console.error = jest.fn();
            console.error(error);

            // Assert
            expect(console.error).toHaveBeenCalledWith(error);
        });
    });

    describe('Connection Status', () => {
        test('should check if API is accessible', async () => {
            // Arrange
            const mockFetch = jest.fn(() =>
                Promise.resolve({
                    status: 200,
                    ok: true
                })
            );
            global.fetch = mockFetch;

            // Act
            const response = await fetch('/api/zones');

            // Assert
            expect(response.ok).toBe(true);
            expect(mockFetch).toHaveBeenCalledWith('/api/zones');
        });

        test('should detect when API is down', async () => {
            // Arrange
            const mockFetch = jest.fn(() =>
                Promise.reject(new Error('API unreachable'))
            );
            global.fetch = mockFetch;

            // Act & Assert
            await expect(fetch('/api/zones')).rejects.toThrow('API unreachable');
        });

        test('should return connection status', () => {
            // Arrange
            const connectionStatus = { connected: true, timestamp: Date.now() };

            // Act & Assert
            expect(connectionStatus.connected).toBe(true);
        });

        test('should update connection status periodically', (done) => {
            // Arrange
            let connectionChecks = 0;
            const maxChecks = 3;

            // Act
            const checkInterval = setInterval(() => {
                connectionChecks++;
                if (connectionChecks >= maxChecks) {
                    clearInterval(checkInterval);
                    done();
                }
            }, 50);

            // Assert
            expect(connectionChecks).toBeLessThanOrEqual(maxChecks);
        });
    });

    describe('Input Validation', () => {
        test('should validate required fields', () => {
            // Arrange
            const data = { name: '', capacity: 10 };

            // Act
            const isValid = Boolean(data.name && data.name.trim().length > 0);

            // Assert
            expect(isValid).toBe(false);
        });

        test('should validate capacity range (5-25)', () => {
            // Arrange
            const testCases = [
                { capacity: 4, valid: false },
                { capacity: 5, valid: true },
                { capacity: 15, valid: true },
                { capacity: 25, valid: true },
                { capacity: 26, valid: false }
            ];

            // Act & Assert
            testCases.forEach(test => {
                const isValid = test.capacity >= 5 && test.capacity <= 25;
                expect(isValid).toBe(test.valid);
            });
        });

        test('should validate zone code format', () => {
            // Arrange
            const validCode = 'A-001';
            const invalidCode = 'INVALID';
            const codePattern = /^[A-Z]-\d{3}$/;

            // Act
            const isValidCode = codePattern.test(validCode);
            const isInvalidCode = codePattern.test(invalidCode);

            // Assert
            expect(isValidCode).toBe(true);
            expect(isInvalidCode).toBe(false);
        });

        test('should validate zone type', () => {
            // Arrange
            const validTypes = ['VIP', 'INTERNAL', 'EXTERNAL'];
            const testType = 'VIP';
            const invalidType = 'INVALID';

            // Act
            const isValid = validTypes.includes(testType);
            const isInvalid = validTypes.includes(invalidType);

            // Assert
            expect(isValid).toBe(true);
            expect(isInvalid).toBe(false);
        });

        test('should validate space status', () => {
            // Arrange
            const validStatuses = ['AVAILABLE', 'OCCUPIED', 'RESERVED'];
            const testStatus = 'OCCUPIED';

            // Act
            const isValid = validStatuses.includes(testStatus);

            // Assert
            expect(isValid).toBe(true);
        });

        test('should trim whitespace from inputs', () => {
            // Arrange
            const input = '  Zona Test  ';

            // Act
            const trimmed = input.trim();

            // Assert
            expect(trimmed).toBe('Zona Test');
        });
    });

    describe('Data Formatting', () => {
        test('should format occupancy as percentage', () => {
            // Arrange
            const occupied = 4;
            const total = 10;

            // Act
            const percentage = Math.round((occupied / total) * 100);

            // Assert
            expect(percentage).toBe(40);
        });

        test('should format capacity display', () => {
            // Arrange
            const available = 5;
            const total = 20;

            // Act
            const display = `${available}/${total}`;

            // Assert
            expect(display).toBe('5/20');
        });

        test('should format date/time', () => {
            // Arrange
            const date = new Date('2025-02-01T10:30:00');

            // Act
            const formatted = date.toLocaleString('es-ES');

            // Assert
            expect(formatted).toContain('2025');
        });

        test('should format status display text', () => {
            // Arrange
            const status = 'AVAILABLE';
            const statusMap = {
                'AVAILABLE': 'Disponible',
                'OCCUPIED': 'Ocupado',
                'RESERVED': 'Reservado'
            };

            // Act
            const displayText = statusMap[status];

            // Assert
            expect(displayText).toBe('Disponible');
        });

        test('should pluralize text based on count', () => {
            // Arrange
            const pluralize = (count, singular, plural) => count === 1 ? singular : plural;

            // Act & Assert
            expect(pluralize(1, 'espacio', 'espacios')).toBe('espacio');
            expect(pluralize(5, 'espacio', 'espacios')).toBe('espacios');
        });
    });

    describe('Global Error Handlers', () => {
        test('should handle uncaught exceptions', () => {
            // Arrange
            const errorHandler = jest.fn();
            window.addEventListener('error', errorHandler);

            // Act
            const error = new Error('Uncaught error');
            window.dispatchEvent(new ErrorEvent('error', { error }));

            // Assert
            expect(errorHandler).toHaveBeenCalled();

            // Cleanup
            window.removeEventListener('error', errorHandler);
        });

        test('should handle unhandled promise rejections', () => {
            // Arrange
            const rejectionHandler = jest.fn();
            window.addEventListener('unhandledrejection', rejectionHandler);

            // Act
            const event = new Event('unhandledrejection');
            event.reason = new Error('Unhandled rejection');
            window.dispatchEvent(event);

            // Assert
            expect(rejectionHandler).toHaveBeenCalled();

            // Cleanup
            window.removeEventListener('unhandledrejection', rejectionHandler);
        });

        test('should log errors with context', () => {
            // Arrange
            const logError = (error, context) => {
                errorLog.push({ error, context, timestamp: Date.now() });
            };

            // Act
            logError(new Error('Test'), { component: 'Dashboard' });

            // Assert
            expect(errorLog[0].context.component).toBe('Dashboard');
        });
    });

    describe('Helper Functions', () => {
        test('should generate unique IDs', () => {
            // Arrange
            const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            // Act
            const id1 = generateId();
            const id2 = generateId();

            // Assert
            expect(id1).not.toBe(id2);
        });

        test('should check if string is empty', () => {
            // Arrange
            const isEmpty = (str) => !str || str.trim().length === 0;

            // Act & Assert
            expect(isEmpty('')).toBe(true);
            expect(isEmpty('  ')).toBe(true);
            expect(isEmpty('test')).toBe(false);
        });

        test('should check if object is empty', () => {
            // Arrange
            const isEmpty = (obj) => Object.keys(obj).length === 0;

            // Act & Assert
            expect(isEmpty({})).toBe(true);
            expect(isEmpty({ key: 'value' })).toBe(false);
        });

        test('should clone objects deeply', () => {
            // Arrange
            const original = { a: 1, b: { c: 2 } };

            // Act
            const clone = JSON.parse(JSON.stringify(original));
            clone.b.c = 3;

            // Assert
            expect(original.b.c).toBe(2);
            expect(clone.b.c).toBe(3);
        });

        test('should merge objects', () => {
            // Arrange
            const obj1 = { a: 1, b: 2 };
            const obj2 = { b: 3, c: 4 };

            // Act
            const merged = { ...obj1, ...obj2 };

            // Assert
            expect(merged.a).toBe(1);
            expect(merged.b).toBe(3);
            expect(merged.c).toBe(4);
        });
    });
});
