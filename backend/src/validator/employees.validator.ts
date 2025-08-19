import { z } from "zod";

export const createEmployeeSchema = z.object({
  uuid: z.string().min(1, "uuid is required").trim(),
  name: z.string().min(1, "name is required").trim(),
  title: z.string().min(1, "title is required").trim(),
  email: z.email("email must be valid").trim(),
  location: z.string().min(1, "location is required").trim(),
  avatar: z.string().trim().optional().nullable(),
  departmentId: z.coerce.number().int().positive("departmentId must be a positive number"),
});

export type CreateEmployeePayload = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = z
  .object({
    name: z.string().min(1).trim().optional(),
    title: z.string().min(1).trim().optional(),
    email: z.email("email must be valid").trim().optional(),
    location: z.string().min(1).trim().optional(),
    avatar: z.string().trim().optional().nullable(),
    departmentId: z.coerce.number().int().positive().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type UpdateEmployeePayload = z.infer<typeof updateEmployeeSchema>;

export function validateCreateEmployee(input: unknown): CreateEmployeePayload {
  return createEmployeeSchema.parse(input);
}

export function validateUpdateEmployee(input: unknown): UpdateEmployeePayload {
  return updateEmployeeSchema.parse(input);
}


