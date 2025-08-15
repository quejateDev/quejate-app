export const publicRoutes = [
    "/",
    "/dashboard",
    "/auth/new-verification",
    "/api/entities",
];

export const privateRoutes = [
  "/dashboard/profile",
  "/dashboard/lawyer/lawyer-requests",
  "/dashboard/lawyer"
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