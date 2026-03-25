@echo off
set COMPOSE_FILE=docker-compose.yml
set MODE=Release

for %%a in (%*) do (
    if "%%a"=="--dev" (
        set COMPOSE_FILE=docker-compose.dev.yml
        set MODE=Development
    )
)

echo Starting network in %MODE% mode...

docker compose -f %COMPOSE_FILE% up --build -d

if %ERRORLEVEL% equ 0 (
    echo Network started successfully in %MODE% mode.
    if "%MODE%"=="Development" (
        echo Frontend: http://localhost:5173
    ) else (
        echo Frontend: http://localhost:8080
    )
    echo Backend: http://localhost:3000
) else (
    echo Failed to start network.
    exit /b 1
)
