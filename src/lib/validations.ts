import { z } from "zod";

export const staffRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  institutionName: z.string().max(200).optional(),
});

export const studentRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address").toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  standard: z.enum(["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12"]),
  schoolId: z.string().min(1, "Please select a school"),
  affiliateCode: z.string().length(8, "Affiliate code must be 8 characters").toUpperCase(),
  guardianEmail: z.string().email("Invalid guardian email").optional().or(z.literal("")),
});

export const progressUpdateSchema = z.object({
  completed: z.boolean(),
  score: z.number().int().min(0).max(100).optional(),
});

export type StaffRegisterInput = z.infer<typeof staffRegisterSchema>;
export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>;
export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>;
