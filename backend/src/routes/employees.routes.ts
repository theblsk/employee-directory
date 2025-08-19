import { Router } from "express";
import * as employeeController from "../controllers/employees.controller";

const router = Router();

router.get("/", employeeController.list);
router.get("/by-department/:department", employeeController.listByDepartment);
router.get("/by-title/:title", employeeController.listByTitle);
router.get("/:id", employeeController.getById);
router.post("/", employeeController.create);
router.put("/:id", employeeController.update);
router.delete("/:id", employeeController.remove);

export default router;


