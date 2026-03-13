#!/bin/bash

COMPOSE_FILE="docker-compose.yml"
MODE="Release"

for arg in "$@"; do
    if [ "$arg" == "--dev" ]; then
        COMPOSE_FILE="docker-compose.dev.yml"
        MODE="Development"
    fi
done

echo "Taking down the $MODE network..."

docker compose -f "$COMPOSE_FILE" down

if [ $? -eq 0 ]; then
    echo "Network stopped successfully."
else
    echo "Failed to stop network."
    exit 1
fi
