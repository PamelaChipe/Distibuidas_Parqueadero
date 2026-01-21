/**
 * API Service
 * Maneja toda la comunicación con el backend de Spring Boot
 */

const API_BASE_URL = 'http://localhost:8090/api';

// Configuración de headers
const getHeaders = () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
});

// Manejo de errores
const handleError = (error, context = '') => {
    console.error(`Error en ${context}:`, error);
    
    if (error.response) {
        // Error de respuesta del servidor
        const status = error.response.status;
        const message = error.response.data?.message || 'Error del servidor';
        
        if (status === 404) {
            return { error: 'Recurso no encontrado', status };
        } else if (status === 400) {
            return { error: 'Solicitud inválida', status };
        } else if (status === 500) {
            return { error: 'Error del servidor', status };
        }
        return { error: message, status };
    } else if (error.request) {
        // Error de conexión
        return { error: 'Error de conexión con el servidor', status: 0 };
    }
    return { error: error.message || 'Error desconocido', status: -1 };
};

/**
 * ZONAS API
 */
const ZonesAPI = {
    /**
     * Obtener todas las zonas
     */
    getAllZones: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/zones`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener zonas:', error);
            throw error;
        }
    },

    /**
     * Obtener una zona por ID
     */
    getZoneById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener zona ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear una nueva zona
     */
    createZone: async (zoneData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/zones`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(zoneData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error al crear zona:', error);
            throw error;
        }
    },

    /**
     * Actualizar una zona
     */
    updateZone: async (id, zoneData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(zoneData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar zona ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar una zona
     */
    deleteZone: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/zones/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return { success: true };
        } catch (error) {
            console.error(`Error al eliminar zona ${id}:`, error);
            throw error;
        }
    }
};

/**
 * ESPACIOS API
 */
const SpacesAPI = {
    /**
     * Obtener todos los espacios
     */
    getAllSpaces: async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/spaces/`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener espacios:', error);
            throw error;
        }
    },

    /**
     * Obtener un espacio por ID
     */
    getSpaceById: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
                method: 'GET',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener espacio ${id}:`, error);
            throw error;
        }
    },

    /**
     * Crear un nuevo espacio
     */
    createSpace: async (spaceData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/spaces/`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(spaceData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error al crear espacio:', error);
            throw error;
        }
    },

    /**
     * Actualizar un espacio
     */
    updateSpace: async (id, spaceData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(spaceData)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar espacio ${id}:`, error);
            throw error;
        }
    },

    /**
     * Eliminar un espacio
     */
    deleteSpace: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/spaces/${id}`, {
                method: 'DELETE',
                headers: getHeaders()
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return { success: true };
        } catch (error) {
            console.error(`Error al eliminar espacio ${id}:`, error);
            throw error;
        }
    }
};

/**
 * API combinada para exportar
 */
const API = {
    zones: ZonesAPI,
    spaces: SpacesAPI
};
