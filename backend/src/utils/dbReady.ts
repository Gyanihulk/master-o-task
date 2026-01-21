import { pool } from "../config/db";

export const waitForDb = async (
  retries = 10,
  delayMs = 2000
): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      await pool.query("SELECT 1");
      return;
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
};
