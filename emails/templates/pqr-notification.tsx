import { statusMap, typeMap } from "@/constants/pqrMaps";
import {
  Heading,
  Link,
  Text,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles } from "../styles/shared";
import * as React from "react";

interface PQRNotificationEmailProps {
  entityName: string;
  pqrInfo: {
    id: string;
    type: string;
    title: string;
    description: string;
    createdAt: string;
    status: string;
    isAnonymous: boolean;
    consecutiveCode: string;
  };
  creatorInfo: {
    name: string;
    email: string;
    phone?: string;
  };
  customFields: Array<{
    name: string;
    value: string;
  }>;
  attachments: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  pqrUrl: string;
}

export default function PQRNotificationEmail({
  entityName,
  pqrInfo,
  creatorInfo,
  customFields,
  attachments,
  pqrUrl,
}: PQRNotificationEmailProps) {

  const pqrTypeLabel = typeMap[pqrInfo.type as keyof typeof typeMap]?.label || pqrInfo.type;
  const statusLabel = statusMap[pqrInfo.status as keyof typeof statusMap]?.label || pqrInfo.status;
  
  return (
    <EmailLayout preview={`Nueva PQRSD recibida - ${entityName}`}>
      <Heading style={baseStyles.heading}>
        🔔 Nueva PQRSD Recibida
      </Heading>

      <Text style={baseStyles.paragraph}>
        Estimado equipo de <strong>{entityName}</strong>,
      </Text>

      <Text style={baseStyles.paragraph}>
        Se ha recibido una nueva {pqrTypeLabel} que requiere su atención y respuesta.
      </Text>

      <div style={{
        ...baseStyles.alert,
        backgroundColor: '#FEF3C7',
        borderColor: '#F59E0B',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}>
        <Text style={{...baseStyles.alertText, color: '#92400E'}}>
          <strong>📋 Código de seguimiento:</strong> {pqrInfo.consecutiveCode}<br />
          <strong>📅 Fecha de recepción:</strong> {new Date(pqrInfo.createdAt).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Text>
      </div>

      <Heading style={baseStyles.subheading}>
        📋 Detalles de la PQRSD
      </Heading>

      <div style={{
        backgroundColor: baseStyles.brandColors.accent,
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0',
      }}>
        <Text style={{...baseStyles.paragraph, margin: '0 0 12px 0'}}>
          <strong>Tipo:</strong> {pqrTypeLabel}
        </Text>
        <Text style={{...baseStyles.paragraph, margin: '0 0 12px 0'}}>
          <strong>Asunto:</strong> {pqrInfo.title}
        </Text>
        <Text style={{...baseStyles.paragraph, margin: '0 0 12px 0'}}>
          <strong>Estado actual:</strong> {statusLabel}
        </Text>
        <Text style={{...baseStyles.paragraph, margin: '0'}}>
          <strong>Descripción:</strong><br />
          {pqrInfo.description}
        </Text>
      </div>

      <Heading style={baseStyles.subheading}>
        👤 Información del Ciudadano
      </Heading>

      <div style={{
        backgroundColor: baseStyles.brandColors.white,
        border: `1px solid ${baseStyles.brandColors.border}`,
        borderRadius: '8px',
        padding: '20px',
        margin: '16px 0',
      }}>
        {!pqrInfo.isAnonymous ? (
          <>
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
          </>
        ) : (
          <Text style={{...baseStyles.paragraph, margin: '0', color: baseStyles.brandColors.text.muted}}>
            <strong>PQRSD Anónima</strong><br />
            El ciudadano ha optado por mantener su identidad anónima.
          </Text>
        )}
      </div>

      {customFields && customFields.length > 0 && (
        <>
          <Heading style={baseStyles.subheading}>
            📝 Información Adicional
          </Heading>
          <div style={{
            backgroundColor: baseStyles.brandColors.muted,
            borderRadius: '8px',
            padding: '20px',
            margin: '16px 0',
          }}>
            {customFields.map((field, index) => (
              <Text key={index} style={{...baseStyles.paragraph, margin: '0 0 8px 0'}}>
                <strong>{field.name}:</strong> {field.value}
              </Text>
            ))}
          </div>
        </>
      )}

      {attachments && attachments.length > 0 && (
        <>
          <Heading style={baseStyles.subheading}>
            📎 Archivos Adjuntos
          </Heading>
          <div style={{
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            padding: '20px',
            margin: '16px 0',
          }}>
            {attachments.map((attachment, index) => (
              <Text key={index} style={{...baseStyles.paragraph, margin: '0 0 8px 0'}}>
                • <Link href={attachment.url} style={baseStyles.link}>
                  {attachment.name}
                </Link> ({attachment.type})
              </Text>
            ))}
          </div>
        </>
      )}

      <Hr style={baseStyles.divider} />

      <Link
        href={pqrUrl}
        style={baseStyles.button}
      >
        Ver PQRSD en el Sistema
      </Link>

      <div style={baseStyles.alert}>
        <Text style={baseStyles.alertText}>
          <strong>⏰ Recordatorio:</strong> Según la normativa vigente, tiene 15 días hábiles para dar respuesta a esta PQRSD.
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Para gestionar esta PQRSD, acceda al sistema utilizando sus credenciales institucionales.
      </Text>

      <Text style={baseStyles.paragraph}>
        <strong>Sistema de Gestión Quejate</strong><br />
        Fortaleciendo la participación ciudadana
      </Text>
    </EmailLayout>
  );
}
