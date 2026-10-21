import authConfig from "./auth.config";
import NextAuth from "next-auth"
import { NextResponse } from "next/server";
import { apiAuthPrefix, authRoutes, DEFAULT_LOGIN_REDIRECT, privateRoutes } from "./route";
import { ENTITY_LINK_HEADERS, isEntityLinkPath } from "./lib/entity-link";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // La página del enlace de la entidad (R-42) es pública: no se redirige, solo
  // lleva sus cabeceras para que el token no salga de ella.
  if (isEntityLinkPath(nextUrl.pathname)) {
    const response = NextResponse.next();
    for (const [name, value] of Object.entries(ENTITY_LINK_HEADERS)) {
      response.headers.set(name, value);
    }
    return response;
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname) || 
                        privateRoutes.some(route => 
                          route.endsWith('*') && 
                          nextUrl.pathname.startsWith(route.slice(0, -1))
                        );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (nextUrl.pathname === "/") {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }

  if(isApiAuthRoute) {
    return null;
  }

  if(isAuthRoute){
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (isPrivateRoute && !isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null;
})
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}