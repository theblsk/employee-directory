import { Router } from "express";
import * as ctrl from "../controllers/employees.controller";

const router = Router();

router.get("/", ctrl.list);
router.get("/by-department/:department", ctrl.listByDepartment);
router.get("/by-title/:title", ctrl.listByTitle);
router.get("/:id", ctrl.getById);
router.post("/", ctrl.create);
router.put("/:id", ctrl.update);
router.delete("/:id", ctrl.remove);

export default router;


