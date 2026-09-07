import { proxyToBackend } from "@/lib/api/proxy";

/**
 * Subida directa de un fichero a través del servidor → `POST /upload`.
 *
 * Bloque B (solo web): la foto de perfil (`UserProfileEdit.tsx:113`,
 * `useProfileForm.ts:114`) y los documentos del registro de abogado
 * (`useLawyerRegistration.ts:203,236,269`). La móvil declara la ruta pero sube
 * siempre por URL prefirmada.
 *
 * Mismo cuerpo (`multipart/form-data` con el fichero en `file`), misma
 * respuesta `{ success, path }` y **200** (`@HttpCode(OK)` en el backend).
 *
 * ⚠️ **Techo nuevo de 20 MB**, que aquí no existía. Y un SVG se guarda con
 * `Content-Disposition: attachment` para que el bucket público lo descargue en
 * vez de renderizarlo — el formato se sigue aceptando (R-18).
 *
 * El cuerpo viaja como stream hasta el backend: un fichero de 20 MB no se
 * materializa en la memoria del servidor de Next solo para reenviarlo.
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/upload");
}
