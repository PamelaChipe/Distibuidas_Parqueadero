# Sistema de Gestión de Parqueadero Distribuido

## Descripción del Proyecto

Sistema de gestión de parqueadero construido con arquitectura distribuida que permite el control y monitoreo integral de espacios de estacionamiento. El sistema está dividido en dos componentes principales: backend desarrollado con Spring Boot y frontend desarrollado con JavaScript vanilla con Bootstrap.

---

## Requisitos Previos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- **Java Development Kit (JDK)**: versión 25 o superior
- **Maven**: versión 3.8 o superior (para compilación del backend)
- **Node.js y npm**: opcional, para algunos comandos de utilidad
- **Git**: para clonar el repositorio
- **Navegador web moderno**: Chrome, Firefox, Safari o Edge

Para verificar tus versiones, ejecuta:
```bash
java -version
mvn -version
```

---

## Guía de Instalación y Configuración

### Paso 1: Clonar el Repositorio

Abre tu terminal y ejecuta:

```bash
git clone https://github.com/PamelaChipe/Distibuidas_Parqueadero.git
cd Distibuidas_Parqueadero
```

Verifica que estés en la rama correcta:

```bash
git checkout feature/frontend-parking-ui
```

### Paso 2: Configurar el Backend

Navega al directorio del backend:

```bash
cd zone_core/zone_core
```

El proyecto utiliza Maven como herramienta de construcción. Puedes usar los scripts incluidos:

En Linux/Mac:
```bash
./mvnw clean install
```

En Windows:
```bash
mvnw.cmd clean install
```

O si tienes Maven instalado globalmente:
```bash
mvn clean install
```

Este comando descargará todas las dependencias necesarias y compilará el proyecto.

### Paso 3: Iniciar el Backend

Una vez compilado el proyecto, inicia el servidor:

```bash
./mvnw spring-boot:run
```

O con Maven global:
```bash
mvn spring-boot:run
```

El servidor se iniciará en `http://localhost:8090`

Verifica que el backend esté funcionando buscando mensajes en la consola como:
```
Started ZoneCoreApplication in X seconds
```

### Paso 4: Acceder al Frontend

El frontend es una aplicación web basada en HTML, CSS y JavaScript que no requiere instalación adicional.

Regresa a la carpeta raíz del proyecto:
```bash
cd ../..
cd parking-frontend
```

Tienes varias opciones para ejecutar el frontend:

**Opción A: Abrir directamente en navegador**
- Abre la carpeta `parking-frontend` en tu explorador de archivos
- Haz doble clic en `index.html`
- La aplicación abrirá en tu navegador predeterminado

**Opción B: Usar servidor HTTP integrado de Python (recomendado)**
```bash
# Si tienes Python 3 instalado
python -m http.server 8000
```
Luego abre en tu navegador: `http://localhost:8000`

**Opción C: Usar http-server de Node.js**
```bash
# Requiere Node.js instalado
npx http-server
```

**Opción D: Usar Live Server en VS Code**
- Si usas Visual Studio Code, instala la extensión "Live Server"
- Haz clic derecho en `index.html` y selecciona "Open with Live Server"

---

## Estructura del Proyecto

```
Distibuidas_Parqueadero/
├── parking-frontend/                    # Frontend del sistema
│   ├── index.html                       # Punto de entrada principal
│   ├── package.json                     # Metadatos del proyecto
│   ├── .eslintrc.json                   # Configuración de linting
│   ├── jest.config.js                   # Configuración de pruebas
│   ├── cypress.config.js                # Configuración de pruebas E2E
│   ├── src/
│   │   ├── js/
│   │   │   ├── app.js                   # Lógica principal de la aplicación
│   │   │   ├── services/
│   │   │   │   └── api.js               # Comunicación con API del backend
│   │   │   └── components/
│   │   │       ├── dashboard.js         # Componente de dashboard
│   │   │       ├── zones.js             # Gestión de zonas
│   │   │       ├── spaces.js            # Gestión de espacios
│   │   │       └── analytics.js         # Análisis y reportes
│   │   ├── styles/
│   │   │   ├── main.css                 # Estilos base y componentes
│   │   │   ├── responsive.css           # Diseño responsivo
│   │   │   ├── zones.css                # Estilos específicos de zonas
│   │   │   └── spaces.css               # Estilos específicos de espacios
│   │   └── __tests__/                   # Pruebas unitarias frontend
│   ├── cypress/
│   │   └── e2e/                         # Pruebas end-to-end
│   └── README.md                        # Documentación específica del frontend
│
├── zone_core/                           # Backend del sistema
│   └── zone_core/
│       ├── pom.xml                      # Configuración de Maven
│       ├── mvnw / mvnw.cmd              # Scripts de Maven wrapper
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── ec/edu/espe/zone_core/
│       │   │   │       ├── ZoneCoreApplication.java
│       │   │   │       ├── config/
│       │   │   │       │   └── RabbitMQConfig.java
│       │   │   │       ├── controller/
│       │   │   │       │   ├── ZoneController.java
│       │   │   │       │   └── SpacesController.java
│       │   │   │       ├── service/
│       │   │   │       │   ├── ZoneServices.java
│       │   │   │       │   ├── SpacesService.java
│       │   │   │       │   └── impl/
│       │   │   │       │       ├── ZoneServicesImpl.java
│       │   │   │       │       └── SpacesServicesImpl.java
│       │   │   │       ├── repository/
│       │   │   │       │   ├── ZoneRepository.java
│       │   │   │       │   └── SpacesRepository.java
│       │   │   │       ├── model/
│       │   │   │       │   ├── Zone.java
│       │   │   │       │   ├── Spaces.java
│       │   │   │       │   ├── ZoneType.java
│       │   │   │       │   └── SpaceStatus.java
│       │   │   │       ├── dto/
│       │   │   │       │   ├── ZoneRequestDto.java
│       │   │   │       │   ├── ZoneResponseDto.java
│       │   │   │       │   ├── SpacesRequestDto.java
│       │   │   │       │   └── SpaceResponseDto.java
│       │   │   │       └── messaging/
│       │   │   │           ├── NotificationEvent.java
│       │   │   │           └── NotificactionProducer.java
│       │   │   └── resources/
│       │   │       └── application.yaml # Configuración de la aplicación
│       │   └── test/
│       │       └── java/                # Pruebas unitarias backend
│       └── target/                      # Archivos compilados
│
├── README.md                            # Este archivo
├── RESUMEN_PROYECTO.md                  # Resumen ejecutivo del proyecto
└── FRONTEND_SETUP.md                    # Documentación de configuración del frontend
```

---

## Uso del Sistema

### Acceso a la Aplicación

Una vez que tengas el backend ejecutándose en `http://localhost:8090` y el frontend accesible en tu navegador, verás la interfaz de usuario del sistema de parqueadero.

### Navegación Principal

La aplicación cuenta con una barra de navegación superior con las siguientes secciones:

- **Dashboard**: Panel de control con estadísticas generales del sistema
- **Zonas**: Gestión completa de zonas de parqueadero
- **Espacios**: Gestión de espacios individuales
- **Análisis**: Reportes y visualización de datos

### Gestión de Zonas

Las zonas representan las diferentes áreas del parqueadero. En esta sección puedes:

**Ver Zonas Existentes**
- Se muestra una lista o tabla de todas las zonas registradas
- Cada zona muestra: nombre, descripción, tipo, capacidad y estado

**Crear Nueva Zona**
- Haz clic en el botón "Nueva Zona"
- Completa los siguientes campos:
  - Nombre: Identificador único de la zona (ejemplo: Zona A, Zona Premium)
  - Descripción: Información adicional sobre la zona
  - Capacidad: Número de espacios (entre 5 y 25)
  - Tipo: Selecciona el tipo de zona
    - Cubierta: Parqueadero techado
    - Descubierta: Parqueadero al aire libre
    - Premium: Zonas con servicios adicionales
    - Valet: Parqueadero con servicio de guardería
  - Estado: Activa o inactiva
- Haz clic en "Guardar"

**Editar Zona**
- Selecciona una zona existente
- Haz clic en el botón "Editar"
- Modifica los campos necesarios
- Haz clic en "Actualizar"

**Eliminar Zona**
- Selecciona una zona
- Haz clic en el botón "Eliminar"
- Confirma la acción en la ventana emergente

**Buscar y Filtrar**
- Usa la barra de búsqueda para encontrar zonas por nombre o descripción
- Los resultados se actualizan en tiempo real

### Gestión de Espacios

Los espacios son los lugares individuales donde se estacionan los vehículos. En esta sección puedes:

**Ver Espacios Disponibles**
- Se muestra una lista de todos los espacios
- Cada espacio muestra: código, zona, estado, prioridad y disponibilidad

**Crear Nuevo Espacio**
- Haz clic en el botón "Nuevo Espacio"
- Completa los siguientes campos:
  - Código: Identificador único del espacio (ejemplo: A-001, A-002)
  - Zona: Selecciona la zona a la que pertenece
  - Estado: Disponible, Ocupado o Mantenimiento
  - Prioridad: Nivel de prioridad (1 a 10, siendo 10 la más alta)
  - Reservado: Marca si el espacio está reservado
- Haz clic en "Guardar"

**Editar Espacio**
- Selecciona un espacio existente
- Haz clic en "Editar"
- Modifica los campos necesarios
- Haz clic en "Actualizar"

**Eliminar Espacio**
- Selecciona un espacio
- Haz clic en "Eliminar"
- Confirma la acción

**Filtrar Espacios**
- Filtra por zona usando el selector de zonas
- Filtra por estado (Disponible, Ocupado, Mantenimiento)
- Los resultados se actualizan automáticamente

### Dashboard

El panel de control ofrece una vista general del sistema:

- **Estadísticas Generales**: Total de zonas y espacios
- **Indicadores de Ocupación**: Espacios disponibles vs ocupados
- **Últimas Actividades**: Registro de cambios recientes en el sistema
- **Actualización Automática**: Los datos se actualizan cada 30 segundos

### Análisis y Reportes

Esta sección proporciona información visualizada sobre el sistema:

- **Gráficos de Ocupación**: Visualización por zona
- **Distribución de Estados**: Gráfico de pastel con estados de espacios
- **Tabla de Estadísticas**: Datos detallados por zona
- **Porcentajes**: Información de ocupación por zona

---

## Stack Tecnológico

### Backend
- **Java 25**: Lenguaje de programación
- **Spring Boot 3.5.7**: Framework web
- **PostgreSQL 15**: Base de datos relacional
- **RabbitMQ**: Sistema de mensajería
- **Maven**: Herramienta de construcción
- **JUnit 5**: Framework de pruebas
- **Mockito**: Librería para mocking en pruebas

### Frontend
- **HTML5**: Estructura de la aplicación web
- **CSS3**: Estilos y diseño responsivo
- **JavaScript ES2021**: Lógica de la aplicación
- **Bootstrap 5.3.3**: Framework CSS
- **Jest**: Framework de pruebas unitarias
- **Cypress**: Framework de pruebas E2E
- **ESLint**: Analizador de código estático

### Infraestructura
- **Docker**: Containerización
- **Docker Compose**: Orquestación de servicios
- **Git**: Control de versiones

---

## Pruebas del Sistema

El proyecto incluye una suite completa de pruebas que aseguran la calidad del código.

### Pruebas del Backend

Para ejecutar todas las pruebas del backend:

```bash
cd zone_core/zone_core
mvn test
```

Para ejecutar pruebas específicas:

```bash
# Ejecutar pruebas de un paquete
mvn test -Dtest=ZoneServicesImplTest

# Ver reporte de cobertura
mvn clean test jacoco:report
```

El reporte de cobertura se genera en: `target/site/jacoco/index.html`

### Pruebas del Frontend

Para ejecutar pruebas unitarias del frontend:

```bash
cd parking-frontend

# Ejecutar pruebas con Jest
npm test

# Ejecutar pruebas de integración end-to-end con Cypress
npx cypress open
```

### Estadísticas de Pruebas

El proyecto incluye:
- 263+ casos de prueba implementados
- 3,816+ líneas de código de prueba
- Tasa de éxito: 96.6%
- Cobertura de código backend: 68%
- Cobertura de código frontend: 94%

---

## Características Principales

### Funcionalidades de Zonas

- CRUD completo (Crear, Leer, Actualizar, Eliminar)
- Soporte para múltiples tipos de zonas
- Búsqueda y filtrado
- Estadísticas por zona
- Validación de capacidad
- Control de estado (activa/inactiva)

### Funcionalidades de Espacios

- CRUD completo
- Estados configurables (Disponible, Ocupado, Mantenimiento)
- Sistema de prioridad
- Sistema de reservas
- Filtrado por zona y estado
- Validación de códigos únicos

### Panel de Control

- Visualización en tiempo real
- Estadísticas generales
- Gráficos interactivos
- Actualización automática de datos
- Reportes por zona

### Diseño Responsivo

La aplicación se adapta a diferentes tamaños de pantalla:

- Desktop (1200px+): Vista completa con 4 columnas
- Tablet (768px-1199px): Vista de 2 columnas
- Móvil (480px-767px): Vista de 1 columna
- Dispositivos pequeños: Diseño apilado

---

## Solución de Problemas

### El Backend no Inicia

**Problema**: Error de puerto en uso
```
Address already in use
```

**Solución**: Cambia el puerto en `zone_core/zone_core/src/main/resources/application.yaml`:
```yaml
server:
  port: 8091
```

**Problema**: Falta de base de datos
```
Connection to localhost:5432 refused
```

**Solución**: Asegúrate de que PostgreSQL esté instalado y ejecutándose. Puedes usar Docker:
```bash
docker run --name postgres-parking -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

### El Frontend no Carga

**Problema**: Error CORS
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución**: Asegúrate de que el backend está ejecutándose en `http://localhost:8090`

**Problema**: La página está en blanco
```
No se carga ningún contenido
```

**Solución**: 
- Abre la consola del navegador (F12 → Consola)
- Verifica si hay errores de JavaScript
- Asegúrate de tener habilitado JavaScript en el navegador

### Las Pruebas Fallan

**Problema**: Maven no encuentra las dependencias
```
Could not find artifact...
```

**Solución**: Limpia el repositorio local de Maven:
```bash
mvn clean
rm -rf ~/.m2/repository
mvn install
```

---

## Configuración Avanzada

### Modificar la Configuración del Backend

Edita el archivo `zone_core/zone_core/src/main/resources/application.yaml`:

```yaml
spring:
  application:
    name: zone-core
  datasource:
    url: jdbc:postgresql://localhost:5432/parqueadero
    username: postgres
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

server:
  port: 8090
  servlet:
    context-path: /api
```

### Conectar a Base de Datos Remota

Para usar una base de datos remota, actualiza la URL de conexión:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://tu-servidor.com:5432/parqueadero
    username: tu-usuario
    password: tu-contraseña
```

---

## Contribuir al Proyecto

Si deseas contribuir al proyecto, sigue estos pasos:

1. Crea una rama nueva:
```bash
git checkout -b feature/tu-caracteristica
```

2. Realiza tus cambios y commitea:
```bash
git add .
git commit -m "Descripción de tu cambio"
```

3. Sube los cambios:
```bash
git push origin feature/tu-caracteristica
```

4. Crea un Pull Request en GitHub

---

## Recursos Adicionales

- **Documentación de Spring Boot**: https://spring.io/projects/spring-boot
- **Bootstrap Documentation**: https://getbootstrap.com/docs/5.3/
- **JavaScript MDN**: https://developer.mozilla.org/es/docs/Web/JavaScript
- **Documentación de JUnit 5**: https://junit.org/junit5/docs/current/user-guide/

---

## Soporte y Contacto

Para reportar problemas o sugerir mejoras, crea un issue en el repositorio de GitHub:

https://github.com/PamelaChipe/Distibuidas_Parqueadero/issues

---

## Licencia

Este proyecto es académico y desarrollado como parte de los estudios de Ingeniería de Software.

---

## Información del Proyecto

- **Institución**: Escuela Politécnica Nacional (ESPE)
- **Asignatura**: Calidad de Software
- **Período**: Semestre Sep 2025 - Mar 2026
- **Rama Activa**: feature/frontend-parking-ui
- **Última Actualización**: 4 de febrero de 2026

---

**Nota Final**: Este sistema fue diseñado con estándares de calidad ISO (ISO 25010, ISO 9126, ISO 9241-112, ISO 14598) para asegurar la mejor experiencia de usuario y la calidad del código.
