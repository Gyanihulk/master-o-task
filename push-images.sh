#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="${AWS_REGION:-ap-south-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-703139106911}"
BACKEND_REPO="${BACKEND_REPO:-tasks-backend}"
FRONTEND_REPO="${FRONTEND_REPO:-tasks-frontend}"
VITE_API_BASE_URL="${VITE_API_BASE_URL:-/api}"

ECR_BASE="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "Logging in to ECR..."
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "$ECR_BASE"

echo "Building backend image..."
docker build -f backend/Dockerfile.prod -t "${BACKEND_REPO}:latest" backend
docker tag "${BACKEND_REPO}:latest" "${ECR_BASE}/${BACKEND_REPO}:latest"

echo "Building frontend image..."
docker build -f frontend/Dockerfile.prod \
  --build-arg VITE_API_BASE_URL="${VITE_API_BASE_URL}" \
  -t "${FRONTEND_REPO}:latest" frontend
docker tag "${FRONTEND_REPO}:latest" "${ECR_BASE}/${FRONTEND_REPO}:latest"

echo "Pushing backend image..."
docker push "${ECR_BASE}/${BACKEND_REPO}:latest"

echo "Pushing frontend image..."
docker push "${ECR_BASE}/${FRONTEND_REPO}:latest"

echo "Done."
