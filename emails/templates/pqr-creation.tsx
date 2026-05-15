import {
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles, colors } from "../styles/shared";
import * as React from "react";

interface PqrCreationEmailProps {
  userName: string;
  pqrNumber: string;
  creationDate: string;
  pqrLink?: string;
  entityName: string;
  entityEmail?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const PqrCreationEmail = ({
  userName,
  pqrNumber,
  creationDate,
  pqrLink,
  entityName,
  entityEmail,
}: PqrCreationEmailProps) => {
  const trackingLink = pqrLink || `${baseUrl}/dashboard/pqr/${pqrNumber}`;

  return (
    <EmailLayout preview="Tu PQRSD ha sido registrada correctamente">

      {/* Label superior */}
      <Text style={{ fontSize: '13px', color: colors.text.muted, margin: '0 0 8px 0' }}>
        QUEJATE — CONFIRMACIÓN DE RADICADO
      </Text>

      {/* Banner principal */}
      <div style={{
        backgroundColor: colors.tertiary,
        borderRadius: '8px',
        padding: '24px',
        margin: '0 0 24px 0',
      }}>
        <Text style={{ fontSize: '11px', color: colors.secondary, margin: '0 0 4px 0', letterSpacing: '1px' }}>
          NÚMERO DE RADICADO
        </Text>
        <Text style={{ fontSize: '22px', fontWeight: '700', color: colors.white, margin: '0 0 8px 0' }}>
          {pqrNumber}
        </Text>
        <Text style={{ fontSize: '12px', color: colors.secondary, margin: '0 0 12px 0' }}>
          {creationDate}
        </Text>
        <span style={{
          backgroundColor: '#22c55e',
          color: colors.white,
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: '500',
        }}>
          ✓ Registrada exitosamente
        </span>
      </div>

      {/* Saludo */}
      <Text style={{ ...baseStyles.paragraph, margin: '0 0 8px 0' }}>
        Hola <strong>{userName}</strong>,
      </Text>
      <Text style={{ ...baseStyles.paragraph, margin: '0 0 20px 0' }}>
        Tu PQRSD ha sido registrada correctamente. A continuación encontrarás los detalles de tu radicado.
      </Text>

      {/* Detalles */}
      <div style={{ margin: '0 0 24px 0' }}>
        <div style={{ backgroundColor: colors.accent, borderRadius: '8px 8px 0 0', padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
          <Text style={{ fontSize: '10px', color: colors.text.muted, margin: '0 0 2px 0', letterSpacing: '1px' }}>ENTIDAD DESTINO</Text>
          <Text style={{ fontSize: '14px', fontWeight: '500', color: colors.text.primary, margin: '0' }}>{entityName}</Text>
        </div>
        {entityEmail && (
          <div style={{ backgroundColor: colors.accent, padding: '14px 16px', borderBottom: `1px solid ${colors.border}` }}>
            <Text style={{ fontSize: '10px', color: colors.text.muted, margin: '0 0 2px 0', letterSpacing: '1px' }}>CORREO DE LA ENTIDAD</Text>
            <Text style={{ fontSize: '14px', fontWeight: '500', color: colors.text.primary, margin: '0' }}>{entityEmail}</Text>
          </div>
        )}
        <div style={{ backgroundColor: colors.accent, borderRadius: '0 0 8px 8px', padding: '14px 16px' }}>
          <Text style={{ fontSize: '10px', color: colors.text.muted, margin: '0 0 2px 0', letterSpacing: '1px' }}>PLAZO DE RESPUESTA</Text>
          <Text style={{ fontSize: '14px', fontWeight: '500', color: colors.text.primary, margin: '0' }}>15 días hábiles</Text>
        </div>
      </div>

      {/* Botón */}
      <div style={{ textAlign: 'center', margin: '0 0 24px 0' }}>
        <Link href={trackingLink} style={baseStyles.button}>
          Ver mi PQRSD
        </Link>
      </div>

      <Hr style={baseStyles.divider} />

      {/* Recordatorio */}
      <div style={{ ...baseStyles.alert, margin: '0 0 16px 0' }}>
        <Text style={baseStyles.alertText}>
          <strong>💡 Recordatorio:</strong> Guarda tu número de radicado <strong>{pqrNumber}</strong> para futuras consultas.
        </Text>
      </div>

      <Text style={{ ...baseStyles.paragraph, margin: '0' }}>
        Gracias por confiar en Quejate para hacer valer tus derechos ciudadanos.
      </Text>

    </EmailLayout>
  );
};

export default PqrCreationEmail;