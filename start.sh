#!/bin/bash

COMPOSE_FILE="docker-compose.yml"
MODE="Release"

for arg in "$@"; do
    if [ "$arg" == "--dev" ]; then
        COMPOSE_FILE="docker-compose.dev.yml"
        MODE="Development"
    fi
done

echo "Starting network in $MODE mode..."

docker compose -f "$COMPOSE_FILE" up --build -d

if [ $? -eq 0 ]; then
    echo "Network started successfully in $MODE mode."
    if [ "$MODE" == "Development" ]; then
        echo "Frontend: http://localhost:5173"
    else
        echo "Frontend: http://localhost:8080"
    fi
    echo "Backend: http://localhost:3000"

    echo "You can see the logs using: docker compose -f $COMPOSE_FILE logs -f"
else
    echo "Failed to start network."
    exit 1
fi
