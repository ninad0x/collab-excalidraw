import { z } from "zod"

export const CreateUserSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
    name: z.string()
})

export const SigninSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
})