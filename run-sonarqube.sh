#!/bin/bash

# Script para ejecutar análisis de SonarQube
# Requiere tener SonarQube ejecutándose en http://localhost:9000

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Análisis de SonarQube - Sistema de Gestión de Parqueadero ===${NC}"
echo ""

# Verificar si SonarQube está corriendo
echo -e "${YELLOW}Verificando si SonarQube está ejecutándose...${NC}"
if ! curl -s http://localhost:9000 > /dev/null 2>&1; then
    echo -e "${RED}Error: SonarQube no está ejecutándose en http://localhost:9000${NC}"
    echo ""
    echo -e "${YELLOW}Para ejecutar SonarQube con Docker:${NC}"
    echo "  docker run -d --name sonarqube -p 9000:9000 sonarqube:latest"
    echo ""
    echo -e "${YELLOW}O inicia SonarQube manualmente desde su carpeta de instalación.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ SonarQube está ejecutándose${NC}"
echo ""

# Cambiar al directorio del backend
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/zone_core/zone_core" || exit 1

echo -e "${YELLOW}Ejecutando Maven clean test...${NC}"
mvn clean test || {
    echo -e "${RED}Error: Las pruebas fallaron${NC}"
    exit 1
}

echo ""
echo -e "${YELLOW}Ejecutando análisis de SonarQube...${NC}"
echo ""

# Ejecutar análisis de SonarQube
mvn sonar:sonar \
    -Dsonar.projectKey=Distibuidas_Parqueadero \
    -Dsonar.projectName="Sistema Gestión Parqueadero" \
    -Dsonar.sources=src/main \
    -Dsonar.tests=src/test \
    -Dsonar.host.url=http://localhost:9000 \
    -Dsonar.login=admin

echo ""
echo -e "${GREEN}=== Análisis completado ===${NC}"
echo ""
echo -e "${YELLOW}Resultados disponibles en:${NC}"
echo "  http://localhost:9000/dashboard?id=Distibuidas_Parqueadero"
echo ""
