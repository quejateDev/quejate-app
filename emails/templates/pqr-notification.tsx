import { statusMap, typeMap } from "@/constants/pqrMaps";
import {
  Heading,
  Link,
  Text,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles, colors } from "../styles/shared";
import * as React from "react";

interface PQRNotificationEmailProps {
  entityName: string;
  pqrInfo: {
    id: string;
    type: string;
    subject: string;
    description: string;
    createdAt: string;
    status: string;
    isAnonymous: boolean;
    consecutiveCode: string;
    location?: {
      latitude: number;
      longitude: number;
      address?: string;
    } | null;
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

      {/* Header entidad */}
      <Text style={{ fontSize: '13px', color: colors.text.muted, margin: '0 0 8px 0' }}>
        {entityName.toUpperCase()} — BANDEJA PQRSD
      </Text>

      {/* Banner principal — Radicado */}
      <div style={{
        backgroundColor: colors.tertiary,
        borderRadius: pqrInfo.location ? '8px 8px 0 0' : '8px',
        padding: '24px',
        margin: '0 0 0 0',
      }}>
        <Text style={{ fontSize: '11px', color: colors.secondary, margin: '0 0 4px 0', letterSpacing: '1px' }}>
          NÚMERO DE RADICADO
        </Text>
        <Text style={{ fontSize: '22px', fontWeight: '700', color: colors.white, margin: '0 0 8px 0' }}>
          {pqrInfo.consecutiveCode}
        </Text>
        <Text style={{ fontSize: '12px', color: colors.secondary, margin: '0 0 12px 0' }}>
          {pqrTypeLabel} · {pqrInfo.createdAt}
        </Text>
        <span style={{
          backgroundColor: colors.quaternary,
          color: colors.white,
          borderRadius: '20px',
          padding: '4px 12px',
          fontSize: '12px',
          fontWeight: '600',
        }}>
          Plazo: 15 días hábiles
        </span>
      </div>

      {/* Banner geográfico */}
      {pqrInfo.location && (
        <div style={{
          backgroundColor: '#1a3f6f',
          padding: '16px 24px',
          borderRadius: '0 0 8px 8px',
          margin: '0 0 24px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <Text style={{ fontSize: '10px', color: colors.secondary, margin: '0 0 4px 0', letterSpacing: '1px' }}>
              REFERENCIA GEOGRÁFICA DEL SOLICITANTE
            </Text>
            <Text style={{ fontSize: '16px', fontWeight: '700', color: colors.white, margin: '0 0 2px 0' }}>
              {pqrInfo.location.address?.split(',').slice(0, 2).join(',') || 'Ubicación registrada'}
            </Text>
            {pqrInfo.location.address && (
              <Text style={{ fontSize: '12px', color: colors.secondary, margin: '0 0 4px 0' }}>
                {pqrInfo.location.address.split(',').slice(2, 4).join(',')}
              </Text>
            )}
            <Text style={{ fontSize: '12px', color: colors.secondary, margin: '0', fontFamily: 'monospace' }}>
              {pqrInfo.location.latitude.toFixed(4)}° N, {pqrInfo.location.longitude.toFixed(4)}° W
            </Text>
          </div>
          <Link
            href={`https://www.google.com/maps?q=${pqrInfo.location.latitude},${pqrInfo.location.longitude}`}
            style={{
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: colors.white,
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: '600',
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            Ver en mapa ↗
          </Link>
        </div>
      )}

      {!pqrInfo.location && <div style={{ margin: '0 0 24px 0' }} />}

      {/* Descripción */}
      <Text style={{ fontSize: '11px', color: colors.text.muted, letterSpacing: '1px', margin: '0 0 8px 0' }}>
        DESCRIPCIÓN DEL CIUDADANO
      </Text>
      <div style={{
        borderLeft: `4px solid ${colors.quaternary}`,
        paddingLeft: '16px',
        margin: '0 0 24px 0',
      }}>
        <Text style={{ ...baseStyles.paragraph, margin: '0', fontStyle: 'italic' }}>
          "{pqrInfo.description}"
        </Text>
      </div>

      {/* Asunto y estado */}
      <div style={{ margin: '0 0 24px 0' }}>
        <div style={{ backgroundColor: colors.accent, borderRadius: '8px', padding: '16px', marginBottom: '8px' }}>
          <Text style={{ fontSize: '10px', color: colors.text.muted, margin: '0 0 4px 0', letterSpacing: '1px' }}>ASUNTO</Text>
          <Text style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary, margin: '0' }}>{pqrInfo.subject}</Text>
        </div>
        <div style={{ backgroundColor: colors.accent, borderRadius: '8px', padding: '16px' }}>
          <Text style={{ fontSize: '10px', color: colors.text.muted, margin: '0 0 4px 0', letterSpacing: '1px' }}>ESTADO</Text>
          <Text style={{ fontSize: '14px', fontWeight: '600', color: colors.text.primary, margin: '0' }}>{statusLabel}</Text>
        </div>
      </div>

      {/* Información del ciudadano */}
      <Heading style={baseStyles.subheading}>Información del Ciudadano</Heading>
      <div style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '20px',
        margin: '0 0 16px 0',
      }}>
        {!pqrInfo.isAnonymous ? (
          <>
            <Text style={{ ...baseStyles.paragraph, margin: '0 0 8px 0' }}>
              <strong>Nombre:</strong> {creatorInfo.name}
            </Text>
            <Text style={{ ...baseStyles.paragraph, margin: '0 0 8px 0' }}>
              <strong>Email:</strong> {creatorInfo.email}
            </Text>
            {creatorInfo.phone && (
              <Text style={{ ...baseStyles.paragraph, margin: '0' }}>
                <strong>Teléfono:</strong> {creatorInfo.phone}
              </Text>
            )}
          </>
        ) : (
          <Text style={{ ...baseStyles.paragraph, margin: '0', color: colors.text.muted }}>
            <strong>PQRSD Anónima</strong><br />
            El ciudadano ha optado por mantener su identidad anónima.
          </Text>
        )}
      </div>

      {/* Campos personalizados */}
      {customFields && customFields.length > 0 && (
        <>
          <Heading style={baseStyles.subheading}>📝 Información Adicional</Heading>
          <div style={{ backgroundColor: colors.muted, borderRadius: '8px', padding: '20px', margin: '0 0 16px 0' }}>
            {customFields.map((field, index) => (
              <Text key={index} style={{ ...baseStyles.paragraph, margin: '0 0 8px 0' }}>
                <strong>{field.name}:</strong> {field.value}
              </Text>
            ))}
          </div>
        </>
      )}

      {/* Adjuntos */}
      {attachments && attachments.length > 0 && (
        <>
          <Heading style={baseStyles.subheading}>📎 Archivos Adjuntos</Heading>
          <div style={{ backgroundColor: '#F8FAFC', borderRadius: '8px', padding: '20px', margin: '0 0 16px 0' }}>
            {attachments.map((attachment, index) => {
              const cleanName = attachment.name.substring(37);
              return (
                <Text key={index} style={{ ...baseStyles.paragraph, margin: '0 0 8px 0' }}>
                  • <Link href={attachment.url} style={baseStyles.link}>{cleanName}</Link> ({attachment.type})
                </Text>
              );
            })}
          </div>
        </>
      )}

      <Hr style={baseStyles.divider} />

      <Link href={pqrUrl} style={baseStyles.button}>
        Ver PQRSD en el Sistema
      </Link>

      <div style={baseStyles.alert}>
        <Text style={baseStyles.alertText}>
          <strong>⏰ Recordatorio:</strong> Según la Ley 1755 de 2015 &ldquo;Por medio de la cual se regula el Derecho Fundamental de Petición y se sustituye un título del Código de Procedimiento Administrativo y de lo Contencioso Administrativo&rdquo;, tiene 15 días hábiles para dar respuesta a esta PQRSD.
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Para gestionar esta PQRSD, acceda al sistema utilizando sus credenciales institucionales.
      </Text>

    </EmailLayout>
  );
}