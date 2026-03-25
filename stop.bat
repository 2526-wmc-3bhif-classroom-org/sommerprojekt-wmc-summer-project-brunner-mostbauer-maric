@echo off
set COMPOSE_FILE=docker-compose.yml
set MODE=Release

for %%a in (%*) do (
    if "%%a"=="--dev" (
        set COMPOSE_FILE=docker-compose.dev.yml
        set MODE=Development
    )
)

echo Taking down the %MODE% network...

docker compose -f %COMPOSE_FILE% down

if %ERRORLEVEL% equ 0 (
    echo Network stopped successfully.
) else (
    echo Failed to stop network.
    exit /b 1
)
