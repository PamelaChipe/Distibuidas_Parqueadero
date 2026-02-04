@echo off
REM Script para ejecutar análisis de SonarQube en Windows
REM Requiere tener SonarQube ejecutándose en http://localhost:9000

setlocal enabledelayedexpansion

echo.
echo ===== Analisis de SonarQube - Sistema de Gestion de Parqueadero =====
echo.

REM Verificar si SonarQube está corriendo
echo Verificando si SonarQube esta ejecutandose...

for /f "tokens=*" %%i in ('curl -s -o /dev/null -w "%%{http_code}" http://localhost:9000 2^>nul') do set HTTP_CODE=%%i

if NOT "%HTTP_CODE%"=="200" (
    echo.
    color 4F
    echo Error: SonarQube no esta ejecutandose en http://localhost:9000
    echo.
    echo Para ejecutar SonarQube con Docker:
    echo   docker run -d --name sonarqube -p 9000:9000 sonarqube:latest
    echo.
    echo O inicia SonarQube manualmente desde su carpeta de instalacion.
    echo.
    color 07
    pause
    exit /b 1
)

echo SonarQube esta ejecutandose
echo.

REM Cambiar al directorio del backend
cd /d "%~dp0zone_core\zone_core" || exit /b 1

echo Ejecutando Maven clean test...
call mvn clean test
if errorlevel 1 (
    color 4F
    echo Error: Las pruebas fallaron
    color 07
    pause
    exit /b 1
)

echo.
echo Ejecutando analisis de SonarQube...
echo.

REM Ejecutar análisis de SonarQube
call mvn sonar:sonar ^
    -Dsonar.projectKey=Distibuidas_Parqueadero ^
    -Dsonar.projectName="Sistema Gestion Parqueadero" ^
    -Dsonar.sources=src/main ^
    -Dsonar.tests=src/test ^
    -Dsonar.host.url=http://localhost:9000 ^
    -Dsonar.login=admin

if errorlevel 1 (
    color 4F
    echo Error: SonarQube analisis fallo
    color 07
    pause
    exit /b 1
)

echo.
color 2F
echo ===== Analisis completado =====
color 07
echo.
echo Resultados disponibles en:
echo   http://localhost:9000/dashboard?id=Distibuidas_Parqueadero
echo.
pause
