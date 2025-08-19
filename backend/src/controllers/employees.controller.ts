import type { Request, Response, NextFunction } from "express";
import * as service from "../services/employees.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const page = Number((req.query.page as string) ?? 1);
    const limit = Number((req.query.limit as string) ?? 10);
    const searchTerm = (req.query.searchTerm as string) || undefined;
    const title = (req.query.title as string) || undefined;
    const department = (req.query.department as string) || undefined;
    const result = await service.list(page, limit, { searchTerm, title, department });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const row = await service.getById(id);
    if (!row) return res.status(404).json({ message: "Employee not found" });
    res.json(row);
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // Preferrably we would have used Zod or similar here to validate the create body and then autoinsert
    const created = await service.create({
      uuid: String(req.body.uuid),
      name: String(req.body.name),
      title: String(req.body.title),
      email: String(req.body.email),
      location: String(req.body.location),
      avatar: req.body.avatar ?? null,
      departmentId: Number(req.body.departmentId),
    });
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const updated = await service.update(id, {
      name: req.body.name,
      title: req.body.title,
      email: req.body.email,
      location: req.body.location,
      avatar: req.body.avatar,
      departmentId: req.body.departmentId,
    });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const deleted = await service.remove(id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function listByDepartment(req: Request, res: Response, next: NextFunction) {
  try {
    const department = String(req.params.department);
    const page = Number((req.query.page as string) ?? 1);
    const limit = Number((req.query.limit as string) ?? 10);
    const result = await service.listByDepartment(department, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function listByTitle(req: Request, res: Response, next: NextFunction) {
  try {
    const title = String(req.params.title);
    const page = Number((req.query.page as string) ?? 1);
    const limit = Number((req.query.limit as string) ?? 10);
    const result = await service.listByTitle(title, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
}


