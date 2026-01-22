#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/var/www/tasks"
COMPOSE_FILE="docker-compose.prod.yml"

echo "Deploying Employee Task Tracker..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is not installed. Install Docker first." >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "AWS CLI is not installed. Install and configure it first." >&2
  exit 1
fi

if [ ! -d "$APP_DIR" ]; then
  echo "App directory $APP_DIR not found. Clone the repo there first." >&2
  exit 1
fi

cd "$APP_DIR"

echo "Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

echo "Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d

echo "Pruning unused images..."
docker image prune -f

echo "Done."
