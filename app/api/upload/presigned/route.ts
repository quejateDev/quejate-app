import { proxyToBackend } from "@/lib/api/proxy";

/**
 * URL prefirmada para subir a S3 → `POST /upload/presigned`.
 *
 * Bloque A (contrato congelado). Devuelve `{ url, key, bucket }` con **200**
 * —`@HttpCode(OK)` explícito en el backend— y exige sesión, como ya hacía aquí.
 *
 * ⚠️ **Lo que sí cambia es que el backend valida.** Aquí `contentType` estaba
 * comentado y `folder` no se comprobaba. El backend valida los dos contra lista
 * blanca, así que un destino desconocido pasa de 200 a **400** — y eso, en un
 * binario publicado, no tendría arreglo.
 *
 * ✅ Verificado destino por destino contra las llamadas reales de la móvil:
 * manda `uploads` (`s3Upload.ts:13`), `avatars` (`useProfileActions.ts:44`) y
 * `lawyers` (`useLawyers.ts:128,129`); **los tres están en la lista blanca**
 * (`upload-policy.ts:51-59`). Y el `application/octet-stream` que produce el
 * selector de documentos de Android cuando no informa el tipo se resuelve por
 * la extensión (`upload-policy.ts:178-192`).
 */
export async function POST(request: Request) {
  return proxyToBackend(request, "/upload/presigned");
}
