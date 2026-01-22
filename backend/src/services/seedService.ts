import bcrypt from "bcrypt";

import { env } from "../config/env";
import { createUser, findUserByEmail } from "../models/userModel";
import { logDebug, logInfo } from "../utils/logger";

export const seedAdminUser = async () => {
  logInfo("Seed service start");
  const existingAdmin = await findUserByEmail(env.adminSeedEmail);
  if (!existingAdmin) {
    logDebug("Seeding admin user", { email: env.adminSeedEmail });
    const hashed = await bcrypt.hash(env.adminSeedPassword, 10);
    await createUser(
      env.adminSeedName,
      env.adminSeedEmail,
      hashed,
      "ADMIN"
    );
  }

  const seedEmployees = [
    { name: "Adamya", email: "adamya@masteroapp.com" },
    { name: "Tanmay", email: "tanmay@masteroapp.com" },
    { name: "Radeep", email: "radeep@masteroapp.com" },
  ];

  for (const employee of seedEmployees) {
    const existingEmployee = await findUserByEmail(employee.email);
    if (!existingEmployee) {
      logDebug("Seeding employee", { email: employee.email });
      const hashed = await bcrypt.hash(env.adminSeedPassword, 10);
      await createUser(employee.name, employee.email, hashed, "EMPLOYEE");
    }
  }
};
