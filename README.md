# Employee Task Tracker

Full-stack app to manage employees and tasks with role-based access.

## Tech Stack
- Backend: Node.js, Express, TypeScript, MySQL, JWT, bcrypt
- Frontend: React (Vite), TypeScript, Tailwind CSS
- Docker: MySQL + backend + frontend services

## Project Structure
- `backend/` Express API
- `frontend/` React UI
- `sql/` database schema dump
- `docs/` API docs + Postman collection

## Quick Start (Docker)
1. `docker compose up --build`
2. Frontend: `http://localhost:5173`
3. Backend: `http://localhost:5001`

MySQL credentials are defined in `docker-compose.yml`.

## Local Setup (without Docker)
### Backend
1. Create a MySQL database using `sql/schema.sql`.
2. Copy env file: `cp backend/.env.example backend/.env` and update values.
3. Install deps: `cd backend && npm install`
4. Start dev server: `npm run dev`

### Frontend
1. Copy env file: `cp frontend/.env.example frontend/.env`
2. Install deps: `cd frontend && npm install`
3. Start dev server: `npm run dev`

## API Overview
Base URL: `http://localhost:5001`

Auth
- `POST /auth/register`
- `POST /auth/login`

Users (admin only)
- `GET /users`
- `POST /users` (create employee)
- `GET /users/:id/tasks`

Tasks
- `POST /tasks` (admin only)
- `GET /tasks`
- `GET /tasks/:id`
- `PUT /tasks/:id`

See `docs/employee-task-tracker.postman_collection.json` for details.

## Notes
- Employees can only update the `status` of their assigned tasks.
- Admins can create and edit all tasks.
- Roles and statuses use uppercase enums (e.g., `ADMIN`, `IN_PROGRESS`).

## Image-Based Deployment (ECR)
This repo includes production Dockerfiles and a production compose file:
- `backend/Dockerfile.prod`
- `frontend/Dockerfile.prod`
- `docker-compose.prod.yml`

Use ECR with these repositories:
- `703139106911.dkr.ecr.ap-south-1.amazonaws.com/tasks-backend`
- `703139106911.dkr.ecr.ap-south-1.amazonaws.com/tasks-frontend`
- On startup, the backend seeds a default admin if none exists:
  - Email: `admin@masteroapp.com`
  - Password: `Password123`
  - Configure via `ADMIN_SEED_*` in `backend/.env`.
- Also seeds three employees on startup if missing:
  - Adamya (`adamya@masteroapp.com`)
  - Tanmay (`tanmay@masteroapp.com`)
  - Radeep (`radeep@masteroapp.com`)
  - Password: `Password123`
