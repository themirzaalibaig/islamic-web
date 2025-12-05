import { commonSchemas } from "@/validations";
import z from "zod";

export const loginSchema = z.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
});

export type LoginSchema = z.infer<typeof loginSchema>

export const signupSchema = z.object({
    username: commonSchemas.username,
    email: commonSchemas.email,
    password: commonSchemas.password,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});
export type SignupSchema = z.infer<typeof signupSchema>

export const verifyEmailSchema = z.object({
    email: commonSchemas.email,
    otp: z.string().min(6).max(6),
})
export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>

export const emailSchema = z.object({
    email: commonSchemas.email,
})
export type EmailSchema = z.infer<typeof emailSchema>


export const otpSchema = z.object({
    otp: z.string().min(6).max(6),
})
export type OtpSchema = z.infer<typeof otpSchema>


export const resetPasswordSchema = z.object({
    otp: z.string().min(6).max(6),
    password: commonSchemas.password,
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
});
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>
