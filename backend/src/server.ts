import app from "./app";
import { env } from "./config/env";
import { seedAdminUser } from "./services/seedService";
import { waitForDb } from "./utils/dbReady";

const startServer = async () => {
  try {
    await waitForDb();
    await seedAdminUser();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Admin seed failed:", error);
  }

  app.listen(env.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();
