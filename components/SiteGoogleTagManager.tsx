"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { isEntityLinkPath } from "@/lib/entity-link";

/**
 * Páginas legales que la app móvil abre dentro de un WebView
 * (`quejate-mobile-app/src/shared/constants/legalUrls.ts`).
 *
 * Google Play cuenta lo que carga ese WebView como datos que recoge la app:
 * con GTM ahí habría que declarar «Análisis» en el formulario de seguridad de
 * los datos.
 */
const WEBVIEW_LEGAL_PATHS = ["/policy", "/terms"];

function isWebViewLegalPath(pathname: string): boolean {
  return WEBVIEW_LEGAL_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

/**
 * Google Tag Manager de todo el sitio **menos**:
 *
 * - la página del enlace de la entidad (`/entidad/{token}`, R-42). 🔴 GTM
 *   manda a Google la dirección de cada página que se ve, y en esa página la
 *   dirección lleva el token: con él cualquiera lee la PQRSD y confirma por la
 *   entidad.
 * - las páginas legales que abre la app móvil (`/policy`, `/terms`): ver
 *   arriba.
 *
 * Ahí no se pinta nada, así que el HTML no lleva ni el `preload` de `gtm.js`
 * que `next/script` emite en el servidor ni el script que monta en el cliente.
 *
 * En el resto de páginas pinta exactamente lo de antes.
 */
export function SiteGoogleTagManager() {
  const pathname = usePathname();
  if (isEntityLinkPath(pathname) || isWebViewLegalPath(pathname)) {
    return null;
  }
  return <GoogleTagManager gtmId="GTM-K8H7JGNP" />;
}
