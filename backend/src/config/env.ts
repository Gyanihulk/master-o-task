import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? "5000"),
  jwtSecret: process.env.JWT_SECRET ?? "supersecret",
  dbHost: process.env.DB_HOST ?? "localhost",
  dbPort: Number(process.env.DB_PORT ?? "3306"),
  dbUser: process.env.DB_USER ?? "root",
  dbPassword: process.env.DB_PASSWORD ?? "",
  dbName: process.env.DB_NAME ?? "employee_task_tracker",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  adminSeedName: process.env.ADMIN_SEED_NAME ?? "Admin User",
  adminSeedEmail: process.env.ADMIN_SEED_EMAIL ?? "admin@masteroapp.com",
  adminSeedPassword: process.env.ADMIN_SEED_PASSWORD ?? "Password123",
  logLevel: process.env.LOG_LEVEL ?? "info",
};
