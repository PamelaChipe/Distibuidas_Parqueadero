/**
 * Utilidades globales
 * Notificaciones y manejo de errores
 */

function showNotification(message, type = 'info', duration = 4000) {
    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    container.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

(function setupGlobalErrorHandlers() {
    window.addEventListener('error', (e) => {
        console.error('Error global:', e.error);
        showNotification('Ocurrió un error inesperado', 'error');
    });

    window.addEventListener('unhandledrejection', (e) => {
        console.error('Promise rechazada no manejada:', e.reason);
        showNotification('Error en la solicitud', 'error');
    });
})();

function setConnectionStatus(isOnline) {
    const dot = document.getElementById('connection-status-dot');
    const text = document.getElementById('connection-status-text');
    if (!dot || !text) return;

    dot.classList.toggle('online', isOnline);
    dot.classList.toggle('offline', !isOnline);
    text.textContent = isOnline ? 'Sistema Conectado' : 'Sistema Desconectado';
}

async function checkConnectionStatus() {
    if (!window.API_BASE_URL) return;
    try {
        const baseUrl = window.API_BASE_URL.replace(/\/api\/?$/, '');
        const healthResponse = await fetch(`${baseUrl}/actuator/health`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        });
        if (healthResponse.ok) {
            setConnectionStatus(true);
            return;
        }

        const fallbackResponse = await fetch(`${window.API_BASE_URL}/zones`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store'
        });
        setConnectionStatus(fallbackResponse.ok);
    } catch (error) {
        setConnectionStatus(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkConnectionStatus();
    setInterval(checkConnectionStatus, 30000);
});

window.addEventListener('online', () => checkConnectionStatus());
window.addEventListener('offline', () => setConnectionStatus(false));

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
