import { Router } from "express";
import employeesRoutes from "./employees.routes";
import departmentsRoutes from "./departments.routes";

const router = Router();

router.use("/employees", employeesRoutes);
router.use("/departments", departmentsRoutes);

export default router;


