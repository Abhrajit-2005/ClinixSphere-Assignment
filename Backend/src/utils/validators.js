import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['doctor', 'patient'])
});

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

export const appointmentCreateSchema = z.object({
    doctorId: z.string().length(24), // Mongo ObjectId length
    time: z.coerce.date()
});

