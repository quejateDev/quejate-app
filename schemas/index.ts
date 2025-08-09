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
  firstName: z.string().min(1, {
    message: "El nombre es requerido"
  }),
  lastName: z.string().min(1, {
    message: "El apellido es requerido"
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