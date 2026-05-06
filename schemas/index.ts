import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico es requerido"
  }),
  password: z.string().min(1, {
    message: "La contraseña es requerida"
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico debe ser válido"
  }),
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres"
  }),
  name: z.string().min(1, {
    message: "El nombre es requerido"
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico es requerido"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres"
  }),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico es requerido"
  }),
});

export const ResetPasswordCodeSchema = z.object({
  email: z.string().email({
    message: "El correo electrónico es requerido"
  }),
  code: z.string().regex(/^\d{6}$/, {
    message: "El código debe tener 6 dígitos"
  }),
  newPassword: z.string().min(6, {
    message: "La contraseña debe tener al menos 6 caracteres"
  }),
});