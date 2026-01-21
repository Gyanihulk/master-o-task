import { Router } from "express";

import {
  createTask,
  getTaskById,
  listTasks,
  updateTask,
} from "../controllers/taskController";
import { authenticate } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/roleMiddleware";

const router = Router();

router.post("/", authenticate, requireRole("ADMIN"), createTask);
router.get("/", authenticate, listTasks);
router.get("/:id", authenticate, getTaskById);
router.put("/:id", authenticate, updateTask);

export default router;
