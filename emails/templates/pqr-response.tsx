import {
  Link,
  Text,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles, colors } from "../styles/shared";
import * as React from "react";

interface PqrResponseEmailProps {
  userName: string;
  pqrNumber: string;
  entityName: string;
  responseText: string;
  responseDate: string;
  responderName?: string;
  pqrLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://quejate.com.co";

export const PqrResponseEmail = ({
  userName,
  pqrNumber,
  entityName,
  responseText,
  responseDate,
  responderName,
  pqrLink,
}: PqrResponseEmailProps) => {
  const trackingLink = pqrLink || `${baseUrl}/dashboard/pqr/${pqrNumber}`;

  return (
    <EmailLayout preview={`${entityName} ha respondido a tu PQRSD`}>

      <Text style={{ fontSize: "13px", color: colors.text.muted, margin: "0 0 8px 0" }}>
        QUEJATE — RESPUESTA A TU PQRSD
      </Text>

      <div style={{
        backgroundColor: colors.tertiary,
        borderRadius: "8px",
        padding: "24px",
        margin: "0 0 24px 0",
      }}>
        <Text style={{ fontSize: "11px", color: colors.secondary, margin: "0 0 4px 0", letterSpacing: "1px" }}>
          NÚMERO DE RADICADO
        </Text>
        <Text style={{ fontSize: "22px", fontWeight: "700", color: colors.white, margin: "0 0 8px 0" }}>
          {pqrNumber}
        </Text>
        <Text style={{ fontSize: "12px", color: colors.secondary, margin: "0 0 12px 0" }}>
          {responseDate}
        </Text>
        <span style={{
          backgroundColor: colors.quaternary,
          color: colors.white,
          borderRadius: "20px",
          padding: "4px 12px",
          fontSize: "11px",
          fontWeight: "500",
        }}>
           Respuesta recibida
        </span>
      </div>

      <Text style={{ ...baseStyles.paragraph, margin: "0 0 8px 0" }}>
        Hola <strong>{userName}</strong>,
      </Text>
      <Text style={{ ...baseStyles.paragraph, margin: "0 0 20px 0" }}>
        <strong>{entityName}</strong> ha publicado una respuesta a tu PQRSD. A continuación encontrarás el contenido de la respuesta.
      </Text>

      <div style={{ margin: "0 0 24px 0" }}>
        <div style={{ backgroundColor: colors.accent, borderRadius: "8px 8px 0 0", padding: "14px 16px", borderBottom: `1px solid ${colors.border}` }}>
          <Text style={{ fontSize: "10px", color: colors.text.muted, margin: "0 0 2px 0", letterSpacing: "1px" }}>ENTIDAD</Text>
          <Text style={{ fontSize: "14px", fontWeight: "500", color: colors.text.primary, margin: "0" }}>{entityName}</Text>
        </div>
        {responderName && (
          <div style={{ backgroundColor: colors.accent, padding: "14px 16px", borderBottom: `1px solid ${colors.border}` }}>
            <Text style={{ fontSize: "10px", color: colors.text.muted, margin: "0 0 2px 0", letterSpacing: "1px" }}>RESPONDIDO POR</Text>
            <Text style={{ fontSize: "14px", fontWeight: "500", color: colors.text.primary, margin: "0" }}>{responderName}</Text>
          </div>
        )}
        <div style={{ backgroundColor: colors.accent, borderRadius: responderName ? "0 0 8px 8px" : "0 0 8px 8px", padding: "14px 16px" }}>
          <Text style={{ fontSize: "10px", color: colors.text.muted, margin: "0 0 8px 0", letterSpacing: "1px" }}>RESPUESTA</Text>
          <Text style={{ fontSize: "14px", color: colors.text.primary, margin: "0", whiteSpace: "pre-wrap" }}>
            {responseText}
          </Text>
        </div>
      </div>

      <div style={{ textAlign: "center", margin: "0 0 24px 0" }}>
        <Link href={trackingLink} style={baseStyles.button}>
          Ver respuesta completa
        </Link>
      </div>

      <Hr style={baseStyles.divider} />

      <div style={{ ...baseStyles.alert, margin: "0 0 16px 0" }}>
        <Text style={baseStyles.alertText}>
          <strong>💡 Recordatorio:</strong> Puedes consultar el historial completo de tu PQRSD <strong>{pqrNumber}</strong> en cualquier momento desde tu panel de Quejate.
        </Text>
      </div>

      <Text style={{ ...baseStyles.paragraph, margin: "0" }}>
        Gracias por confiar en Quejate para hacer valer tus derechos ciudadanos.
      </Text>

    </EmailLayout>
  );
};

export default PqrResponseEmail;
