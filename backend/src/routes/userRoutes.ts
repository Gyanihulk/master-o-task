import { Router } from "express";

import { createUser, listUsers, listUserTasks } from "../controllers/userController";
import { authenticate } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.get("/", authenticate, requireRole("ADMIN"), listUsers);
router.post("/", authenticate, requireRole("ADMIN"), createUser);
router.get("/:id/tasks", authenticate, listUserTasks);

export default router;
