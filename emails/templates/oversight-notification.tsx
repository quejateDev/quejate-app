import {
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles } from "../styles/shared";
import * as React from "react";

interface OversightNotificationEmailProps {
  oversightName: string;
  entityName: string;
  creatorInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  pqrUrl: string;
  documentUrl: string;
}

export default function OversightNotificationEmail({
  oversightName,
  entityName,
  creatorInfo,
  pqrUrl,
  documentUrl
}: OversightNotificationEmailProps) {
  return (
    <EmailLayout preview={`Nueva solicitud de control - ${entityName}`}>
      <Heading style={baseStyles.heading}>
        🏛️ Nueva Solicitud de Control y Seguimiento
      </Heading>

      <Text style={baseStyles.paragraph}>
        Estimado equipo de <strong>{oversightName}</strong>,
      </Text>

      <Text style={baseStyles.paragraph}>
        Se ha recibido una nueva solicitud de control y seguimiento que requiere la intervención de su organismo para supervisar el desempeño de una entidad.
      </Text>

      <div style={{
        ...baseStyles.alert,
        backgroundColor: '#FEF3C7',
        borderColor: '#F59E0B',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}>
        <Text style={{...baseStyles.alertText, color: '#92400E'}}>
          <strong>🏢 Entidad supervisada:</strong> {entityName}
        </Text>
      </div>

      <Heading style={baseStyles.subheading}>
        📋 Resumen de la Solicitud
      </Heading>

      <Heading style={baseStyles.subheading}>
        👤 Información del Ciudadano Solicitante
      </Heading>

      <div style={{
        backgroundColor: baseStyles.brandColors.white,
        border: `1px solid ${baseStyles.brandColors.border}`,
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0',
      }}>
        <Text style={{...baseStyles.paragraph, margin: '0 0 8px 0'}}>
          <strong>Nombre:</strong> {creatorInfo.name}
        </Text>
        <Text style={{...baseStyles.paragraph, margin: '0 0 8px 0'}}>
          <strong>Email:</strong> {creatorInfo.email}
        </Text>
        {creatorInfo.phone && (
          <Text style={{...baseStyles.paragraph, margin: '0'}}>
            <strong>Teléfono:</strong> {creatorInfo.phone}
          </Text>
        )}
      </div>

      <Hr style={baseStyles.divider} />

      <Heading style={baseStyles.subheading}>
        📊 Acciones Requeridas
      </Heading>

      <Link
        href={pqrUrl}
        style={baseStyles.button}
      >
        Ver Detalles de la Solicitud Original
      </Link>

      {documentUrl && (
        <>
          <Text style={baseStyles.paragraph}>
            El ciudadano ha proporcionado documentación de respaldo:
          </Text>
          <Link
            href={documentUrl}
            style={baseStyles.buttonSecondary}
          >
            📎 Descargar Documentos Adjuntos
          </Link>
        </>
      )}

      <div style={{
        ...baseStyles.alert,
        backgroundColor: '#FEF2F2',
        borderColor: '#EF4444',
      }}>
        <Text style={{...baseStyles.alertText, color: '#DC2626'}}>
          <strong>⚠️ Importante:</strong> De acuerdo con los protocolos establecidos, se requiere que su organismo notifique directamente al ciudadano sobre las acciones tomadas y el seguimiento realizado.
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Para cualquier consulta adicional sobre esta solicitud, puede contactar a nuestro equipo técnico a través de los canales oficiales.
      </Text>

      <Text style={baseStyles.paragraph}>
        <strong>Sistema de Control Ciudadano Quejate</strong><br />
        Promoviendo la transparencia y la rendición de cuentas
      </Text>
    </EmailLayout>
  );
}
