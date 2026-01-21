# 🅿️ ParkingHub Frontend

Sistema de gestión interactivo para parqueaderos distribuidos. Frontend moderno que visualiza e integra el backend de Spring Boot.

## 📋 Descripción

ParkingHub es una solución completa para la gestión de parqueaderos que incluye:

- ✅ **Dashboard** - Visualización general del sistema
- 🅿️ **Gestión de Zonas** - Crear, editar y eliminar zonas de parqueadero
- 🎟️ **Gestión de Espacios** - Administrar espacios y sus estados
- 📊 **Análisis y Reportes** - Estadísticas detalladas de ocupación
- 🔄 **Sincronización en Tiempo Real** - Conexión con backend distribuido
- 📱 **Diseño Responsive** - Funciona en desktop, tablet y móvil

## 🛠️ Requisitos

### Backend
- Spring Boot 3.5.7
- Java 25
- PostgreSQL
- RabbitMQ
- El backend debe estar ejecutándose en `http://localhost:8090`

### Frontend
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para CORS)

## 📁 Estructura del Proyecto

```
parking-frontend/
├── index.html                 # Archivo principal HTML
├── README.md                  # Este archivo
├── src/
│   ├── styles/
│   │   ├── main.css          # Estilos principales
│   │   ├── zones.css         # Estilos de zonas
│   │   ├── spaces.css        # Estilos de espacios
│   │   └── responsive.css    # Media queries
│   └── js/
│       ├── app.js            # Aplicación principal
│       ├── services/
│       │   └── api.js        # Servicio de API
│       └── components/
│           ├── zones.js      # Componente de Zonas
│           ├── spaces.js     # Componente de Espacios
│           ├── dashboard.js  # Componente de Dashboard
│           └── analytics.js  # Componente de Analytics
```

## 🚀 Inicio Rápido

### 1. Asegurar que el Backend esté ejecutándose

```bash
# En la carpeta del backend (zone_core)
cd zone_core
mvn spring-boot:run
```

El backend debe estar disponible en `http://localhost:8090`

### 2. Abrir el Frontend

Simplemente abre el archivo `index.html` en tu navegador:

```bash
# Opción 1: Doble clic en index.html
# Opción 2: Con un servidor local (recomendado)
cd parking-frontend
python -m http.server 8000
# O con Node.js
npx http-server
```

Luego accede a `http://localhost:8000`

### 3. Usar la Aplicación

- **Dashboard**: Visualización de estadísticas generales
- **Zonas**: CRUD completo de zonas de parqueadero
- **Espacios**: CRUD completo de espacios con filtros
- **Análisis**: Gráficos y estadísticas detalladas

## 🔌 Configuración de API

La URL base de la API está configurada en `src/js/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8090/api';
```

Si tu backend está en una dirección diferente, modifica esta línea.

### CORS en el Backend

Asegúrate de que el backend permita CORS. En `ZoneCoreApplication.java` o en una clase de configuración:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowCredentials(false)
                    .maxAge(3600);
            }
        };
    }
}
```

## 📡 Endpoints de API Utilizados

### Zonas
- `GET /api/zones` - Obtener todas las zonas
- `GET /api/zones/{id}` - Obtener zona por ID
- `POST /api/zones` - Crear nueva zona
- `PUT /api/zones/{id}` - Actualizar zona
- `DELETE /api/zones/{id}` - Eliminar zona

### Espacios
- `GET /api/spaces/` - Obtener todos los espacios
- `GET /api/spaces/{id}` - Obtener espacio por ID
- `POST /api/spaces/` - Crear nuevo espacio
- `PUT /api/spaces/{id}` - Actualizar espacio
- `DELETE /api/spaces/{id}` - Eliminar espacio

## 🎨 Personalización

### Colores
Edita las variables en `src/styles/main.css`:

```css
:root {
    --primary-color: #3498db;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    /* ... más colores */
}
```

### Textos
Los textos están principalmente en el HTML (`index.html`) y componentes JavaScript.

## 🐛 Troubleshooting

### Error: "Failed to fetch from API"
- Verifica que el backend está ejecutándose
- Verifica que la URL en `api.js` es correcta
- Abre la consola del navegador (F12) para ver errores CORS

### Error: "CORS error"
- Asegúrate de tener CORS configurado en el backend
- Verifica los orígenes permitidos en la configuración CORS

### Elementos no se cargan
- Verifica la consola del navegador (F12) para errores JavaScript
- Comprueba que todos los archivos `.js` están en el lugar correcto

## 📱 Características Responsive

- **Desktop (1200px+)**: 4 columnas en grid
- **Tablet (768px-1199px)**: 2 columnas
- **Móvil (480px-767px)**: 1 columna
- **Pequeño móvil (<480px)**: Diseño apilado

## 🔐 Seguridad

- Las contraseñas se envían a través de HTTPS en producción
- No se almacenan datos sensibles en localStorage
- Las credenciales se pueden configurar en el backend

## 📊 Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Backend**: Spring Boot 3.5.7, JPA, PostgreSQL
- **Mensajería**: RabbitMQ
- **Diseño**: CSS Grid, Flexbox, Media Queries
- **Desarrollo**: VSCode, Git

## 🤝 Contribuciones

Para contribuir al proyecto:

1. Crear una rama (`git checkout -b feature/nueva-caracteristica`)
2. Hacer commit de cambios (`git commit -am 'Agregar nueva característica'`)
3. Push a la rama (`git push origin feature/nueva-caracteristica`)
4. Crear un Pull Request

## 📄 Licencia

Proyecto de Universidad ESPE - Semestre Sep25-Mar26

## 👥 Autores

- **Frontend**: Desarrollado como parte del proyecto distribuido
- **Backend**: Equipo de zona_core

## 📞 Soporte

Para problemas técnicos:
1. Revisar la consola del navegador (F12)
2. Verificar los logs del backend
3. Consultar la documentación del API

## ✨ Funcionalidades Futuras

- [ ] Autenticación de usuarios
- [ ] Integración con pagos
- [ ] Reservas en línea
- [ ] Notificaciones en tiempo real con WebSocket
- [ ] Reportes avanzados con exportación a PDF
- [ ] Integración con sistemas de entrada/salida
- [ ] Aplicación móvil nativa

## 🔄 Rama del Proyecto

Este frontend se desarrolla en la rama `feature/frontend-parking-ui` para no afectar el proyecto original en la rama `main`.

```bash
# Para cambiar entre ramas
git checkout main              # Rama principal original
git checkout feature/frontend-parking-ui  # Rama del frontend
```

---

**Versión**: 1.0.0  
**Última actualización**: Enero 2025  
**Estado**: En desarrollo
