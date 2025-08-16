import type { Request, Response } from "express";
import * as service from "../services/departments.service";

export async function list(req: Request, res: Response) {
  const page = Number((req.query.page as string) ?? 1);
  const limit = Number((req.query.limit as string) ?? 10);
  const result = await service.list(page, limit);
  res.json(result);
}

export async function getById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const row = await service.getById(id);
  if (!row) return res.status(404).json({ message: "Department not found" });
  res.json(row);
}

export async function create(req: Request, res: Response) {
  const created = await service.create({ name: String(req.body.name) });
  res.status(201).json(created);
}

export async function update(req: Request, res: Response) {
  const id = Number(req.params.id);
  const updated = await service.update(id, { name: req.body.name });
  if (!updated) return res.status(404).json({ message: "Department not found" });
  res.json(updated);
}

export async function remove(req: Request, res: Response) {
  const id = Number(req.params.id);
  const deleted = await service.remove(id);
  if (!deleted) return res.status(404).json({ message: "Department not found" });
  res.status(204).send();
}


