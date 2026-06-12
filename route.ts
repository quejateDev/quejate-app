export const publicRoutes = [
    "/",
    "/dashboard",
    "/auth/new-verification",
    "/api/entities",
];

export const privateRoutes = [
  "/dashboard/profile",
  "/dashboard/lawyer/lawyer-requests",
  "/dashboard/lawyer",
  // Crear PQRSD requiere cuenta (#5). La página de selección de categoría
  // (/dashboard/pqrs/create) queda pública; solo el formulario por entidad
  // (/dashboard/pqrs/create/<entityId>) exige sesión.
  "/dashboard/pqrs/create/*"
];


export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

export const apiAuthPrefix = "/api/auth";

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";