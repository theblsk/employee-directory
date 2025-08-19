import { Router } from "express";
import * as departmentController from "../controllers/departments.controller";

const router = Router();

router.get("/", departmentController.list);
router.get("/:id", departmentController.getById);
router.post("/", departmentController.create);
router.put("/:id", departmentController.update);
router.delete("/:id", departmentController.remove);

export default router;


