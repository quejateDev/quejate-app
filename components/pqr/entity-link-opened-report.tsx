"use client";

import { useEffect, useRef } from "react";

/**
 * Avisa de que la entidad abrió su enlace (R-42), con un `POST` sin cuerpo a
 * `app/api/entity-links/[token]/opened`. No pinta nada.
 *
 * El aviso sale de un efecto, que solo corre en un navegador que ejecuta
 * JavaScript, y nunca del servidor que pinta la página: los antivirus del
 * correo abren los enlaces solos para revisarlos, y casi ninguno ejecuta
 * JavaScript. Así su visita no cuenta como una apertura.
 *
 * Una vez por visita y sin reintentos: si falla, la página sigue igual y esa
 * apertura no queda registrada. La señal segura es la confirmación.
 */
export function EntityLinkOpenedReport({ token }: { token: string }) {
  // En desarrollo, el modo estricto de React corre cada efecto dos veces.
  const reported = useRef(false);

  useEffect(() => {
    if (reported.current) return;
    reported.current = true;

    fetch(`/api/entity-links/${encodeURIComponent(token)}/opened`, {
      method: "POST",
    }).catch(() => {
      // Nada que enseñar: la página no depende de este aviso.
    });
  }, [token]);

  return null;
}
