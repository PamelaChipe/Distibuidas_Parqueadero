# Guía de Análisis de Calidad con SonarQube

## Introducción a SonarQube

SonarQube es una plataforma de análisis estático de código que detecta bugs, vulnerabilidades, code smells y proporciona métricas detalladas de calidad del código.

---

## Instalación de SonarQube

### Opción 1: Usando Docker (Recomendado)

```bash
# Descargar y ejecutar SonarQube en Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Accede a: `http://localhost:9000`
- Usuario: `admin`
- Contraseña: `admin`

### Opción 2: Instalación Manual

1. Descarga SonarQube desde: https://www.sonarqube.org/downloads/
2. Descomprime en una carpeta
3. Ejecuta el servidor:

**Linux/Mac:**
```bash
./bin/linux-x86-64/sonar.sh console
```

**Windows:**
```bash
bin\windows-x86-64\StartSonar.bat
```

---

## Configuración Inicial en SonarQube

### Paso 1: Acceder a SonarQube

Abre tu navegador en `http://localhost:9000` con credenciales:
- Usuario: `admin`
- Contraseña: `admin`

### Paso 2: Cambiar la Contraseña (Recomendado)

1. Haz clic en tu perfil (arriba a la derecha)
2. Selecciona "Seguridad"
3. Cambia tu contraseña

### Paso 3: Generar un Token de Acceso

1. Ve a "Administración" → "Seguridad" → "Tokens de Usuario"
2. Haz clic en "Generar Token"
3. Asigna un nombre: `maven-analysis`
4. Copia y guarda el token en un lugar seguro

---

## Ejecutar Análisis de Código

### Requisitos Previos

**Importante**: SonarQube debe estar ejecutándose antes de iniciar el análisis.

Verifica que SonarQube esté accesible:
```bash
curl http://localhost:9000
```

Si no está ejecutándose, inicia el servidor con Docker:
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

### Opción 1: Usar Script Automatizado (Recomendado)

El proyecto incluye scripts que ejecutan SonarQube automáticamente:

**En Linux/Mac:**
```bash
./run-sonarqube.sh
```

**En Windows:**
```bash
run-sonarqube.bat
```

Estos scripts:
- Verifican que SonarQube esté ejecutándose
- Ejecutan todas las pruebas
- Realizan el análisis de código
- Muestran el URL del dashboard

### Opción 2: Análisis Manual Backend (Java)

Navega al directorio del backend:

```bash
cd zone_core/zone_core
```

Ejecuta el análisis con Maven:

```bash
mvn clean test sonar:sonar \
  -Dsonar.projectKey=Distibuidas_Parqueadero \
  -Dsonar.projectName="Sistema Gestión Parqueadero" \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=admin
```

### Opción 3: Análisis Simplificado

Si configuraste el pom.xml correctamente:

```bash
mvn clean test sonar:sonar
```

### Análisis Frontend (JavaScript)

Para analizar el frontend, necesitas SonarScanner:

```bash
# Instalar SonarScanner globalmente
npm install -g sonarqube-scanner

# O usar npx
cd parking-frontend
npx sonarqube-scanner \
  -Dsonar.projectKey=Distibuidas_Parqueadero_Frontend \
  -Dsonar.sources=./src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.login=TU_TOKEN_AQUI
```

---

## Interpretación de Resultados

### Panel de Control (Dashboard)

El dashboard principal muestra:

**1. Reliability (Confiabilidad)**
- Bugs encontrados
- Evaluación de estabilidad del código
- Porcentaje de bugs por línea de código

**2. Security (Seguridad)**
- Vulnerabilidades detectadas
- Hotspots de seguridad
- Evaluación de riesgo

**3. Maintainability (Mantenibilidad)**
- Code Smells detectados
- Deuda técnica estimada
- Complejidad del código

**4. Coverage (Cobertura)**
- Porcentaje de código cubierto por pruebas
- Líneas cubiertas vs no cubiertas

**5. Duplications (Duplicaciones)**
- Líneas de código duplicadas
- Porcentaje de duplicación

### Métricas Clave

| Métrica | Descripción | Objetivo |
|---------|-------------|----------|
| Lines of Code (LoC) | Total de líneas de código | Referencia |
| Bugs | Problemas de lógica | Minimizar |
| Vulnerabilities | Problemas de seguridad | Cero |
| Code Smells | Mala práctica de código | Minimizar |
| Coverage | Porcentaje de pruebas | > 80% |
| Duplications | Código duplicado | < 3% |
| Complexity | Complejidad ciclomática | < 10 por método |

---

## Problemas Comunes y Soluciones

### Problema 1: SonarQube No Está Ejecutándose

**Error:**
```
SonarQube server [http://localhost:9000] can not be reached
```

**Solución Rápida - Inicia SonarQube con Docker:**
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
```

Espera 30-60 segundos para que SonarQube inicie completamente.

Luego ejecuta el análisis:
```bash
# Linux/Mac
./run-sonarqube.sh

# Windows
run-sonarqube.bat
```

**Solución Manual:**
1. Verifica que SonarQube esté ejecutándose: `http://localhost:9000`
2. Si no está instalado, descargar desde: https://www.sonarqube.org/downloads/
3. Inicia el servidor desde tu instalación
4. Espera a que esté completamente iniciado

### Problema 2: Connection Refused

**Error:**
```
Connection refused connecting to http://localhost:9000
```

**Solución:**
```bash
# Verifica si SonarQube está corriendo
curl http://localhost:9000

# Si no responde, inicia con Docker
docker run -d --name sonarqube -p 9000:9000 sonarqube:latest

# Espera y verifica de nuevo
sleep 30
curl http://localhost:9000
```

### Problema 3: Credenciales Inválidas

**Error:**
```
Authentication failed
```

**Solución:**
- Usuario por defecto: `admin`
- Contraseña por defecto: `admin`

Si las credenciales son incorrectas:
1. Accede a `http://localhost:9000`
2. Haz clic en "Log in"
3. Usa admin/admin
4. Si no funciona, resetea la base de datos de SonarQube

### Problema 4: Maven No Encuentra Dependencias

**Error:**
```
[ERROR] Failed to execute goal org.sonarsource.scanner.maven:sonar-maven-plugin
```

**Solución:**
```bash
# Limpia el repositorio de Maven
mvn clean
rm -rf ~/.m2/repository

# Descarga nuevamente las dependencias
mvn install
```

### Problema 5: JaCoCo No Genera Reporte

**Error:**
```
Skipping JaCoCo execution due to missing execution data file
```

**Solución:**
1. Asegúrate de que las pruebas se ejecuten:
```bash
mvn clean test
```

2. Verifica que el archivo jacoco.exec se cree:
```bash
ls -la target/jacoco.exec
```

3. Si el archivo no existe, verifica que JaCoCo esté configurado correctamente en pom.xml

---

## Configuración por Proyecto

### Crear Nuevo Proyecto en SonarQube

1. En el dashboard, haz clic en "Proyectos"
2. Haz clic en "Crear Proyecto"
3. Asigna un nombre identificador: `Distibuidas_Parqueadero`
4. Genera un token para el proyecto
5. Sigue las instrucciones del wizard

### Configurar Reglas de Calidad

1. Ve a "Administración" → "Reglas"
2. Busca por lenguaje (Java, JavaScript)
3. Activa o desactiva reglas según tus necesidades
4. Crea un perfil personalizado si es necesario

---

## Calidad Gates (Puertas de Calidad)

Los Quality Gates son criterios que el código debe cumplir para considerarse de buena calidad.

### Quality Gate Predeterminado

- Cobertura >= 80%
- Bugs = 0
- Vulnerabilidades = 0
- Deuda técnica < 5 días

### Crear Quality Gate Personalizado

1. Ve a "Administración" → "Quality Gates"
2. Haz clic en "Crear"
3. Define tus criterios
4. Asigna el Quality Gate a tu proyecto

---

## Integración Continua

### Con GitHub Actions

Crea un archivo `.github/workflows/sonarqube.yml`:

```yaml
name: SonarQube Analysis

on:
  push:
    branches:
      - feature/frontend-parking-ui

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '21'
      
      - name: Run SonarQube Analysis
        run: |
          cd zone_core/zone_core
          mvn clean verify sonar:sonar \
            -Dsonar.projectKey=Distibuidas_Parqueadero \
            -Dsonar.host.url=${{ secrets.SONAR_HOST_URL }} \
            -Dsonar.login=${{ secrets.SONAR_TOKEN }}
```

---

## Mejores Prácticas

1. **Ejecuta Análisis Regularmente**
   - Antes de cada commit
   - Como parte del CI/CD

2. **Revisa Resultados**
   - No ignores bugs críticos
   - Aborda vulnerabilidades inmediatamente

3. **Establece Objetivos**
   - Fija metas de cobertura (80%+)
   - Reduce deuda técnica gradualmente

4. **Formación del Equipo**
   - Capacita a desarrolladores sobre code smells
   - Promueve buenas prácticas

5. **Automatización**
   - Integra en pipeline CI/CD
   - Bloquea merges si Quality Gate falla

---

## Recursos Adicionales

- **Documentación SonarQube**: https://docs.sonarqube.org/
- **Reglas Java**: https://rules.sonarsource.com/java
- **Reglas JavaScript**: https://rules.sonarsource.com/javascript
- **Comunidad**: https://community.sonarsource.com/

---

## Estadísticas del Proyecto

Basado en el análisis inicial del proyecto Distibuidas_Parqueadero:

**Backend (Java)**
- Líneas de código: 1500+
- Archivos Java: 25+
- Cobertura inicial: 68%
- Tests: 130+

**Frontend (JavaScript)**
- Líneas de código: 2000+
- Archivos JavaScript: 8+
- Cobertura inicial: 94%
- Tests: 133+

**Objetivos:**
- Mantener cobertura > 80%
- Reducir bugs a cero críticos
- Eliminar vulnerabilidades
- Reducir deuda técnica < 1 día

---

**Última Actualización**: 4 de febrero de 2026
