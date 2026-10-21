"use client";

import { GoogleTagManager } from "@next/third-parties/google";
import { usePathname } from "next/navigation";
import { isEntityLinkPath } from "@/lib/entity-link";

/**
 * Google Tag Manager de todo el sitio **menos la página del enlace de la
 * entidad** (`/entidad/{token}`, R-42).
 *
 * 🔴 GTM manda a Google la dirección de cada página que se ve, y en esa
 * página la dirección lleva el token: con él cualquiera lee la PQRSD y
 * confirma por la entidad. Ahí no se pinta nada, así que el HTML no lleva ni
 * el `preload` de `gtm.js` que `next/script` emite en el servidor ni el script
 * que monta en el cliente.
 *
 * En el resto de páginas pinta exactamente lo de antes.
 */
export function SiteGoogleTagManager() {
  const pathname = usePathname();
  if (isEntityLinkPath(pathname)) {
    return null;
  }
  return <GoogleTagManager gtmId="GTM-K8H7JGNP" />;
}
