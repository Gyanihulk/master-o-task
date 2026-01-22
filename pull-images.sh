#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-south-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-703139106911}"
COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
CONFIG_DIR="${CONFIG_DIR:-/var/www/config/tasks}"

ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

if [ ! -d "$CONFIG_DIR" ]; then
  echo "Config directory $CONFIG_DIR not found." >&2
  exit 1
fi


echo "Syncing env files..."
cp "$CONFIG_DIR/backend.env" backend/.env.production
cp "$CONFIG_DIR/frontend.env" frontend/.env.production

echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$ECR_BASE"

echo "Pulling latest images..."
docker compose -f "$COMPOSE_FILE" pull

echo "Restarting services..."
docker compose -f "$COMPOSE_FILE" up -d

echo "Done."
