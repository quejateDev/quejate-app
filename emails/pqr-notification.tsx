import { statusMap, typeMap } from "@/constants/pqrMaps";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

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
    <Html>
      <Head />
      <Preview>Nueva PQRSD recibida - {entityName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Nueva PQRSD Recibida</Heading>

          <Section style={section}>
            <Text style={intro}>Estimado equipo de {entityName},</Text>
            <Text style={description}>
              Se ha registrado una nueva {pqrTypeLabel} en el sistema de PQRSD.
              Este mensaje es para notificarle que debe dar seguimiento y
              respuesta dentro de los plazos establecidos.
            </Text>
          </Section>

          <Section style={section}>
            <Heading style={h2}>Información de la Solicitud</Heading>
            <Text>Número de Radicado: {pqrInfo.consecutiveCode}</Text>
            <Text>Tipo de Solicitud: {pqrTypeLabel}</Text>
            <Text>Estado Actual: {statusLabel}</Text>
            <Text>Fecha de Radicación: {pqrInfo.createdAt}</Text>
            <Text style={description}>
              Descripción de la Solicitud: {pqrInfo.description}
            </Text>
          </Section>

          {!pqrInfo.isAnonymous && (
            <Section style={section}>
              <Heading style={h2}>Información del Solicitante</Heading>
              <Text>Nombre Completo: {creatorInfo.name}</Text>
              {creatorInfo.phone && (
                <Text>Teléfono de Contacto: {creatorInfo.phone}</Text>
              )}
              <Text>Correo Electrónico: {creatorInfo.email}</Text>
            </Section>
          )}

          {customFields.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Información Adicional Proporcionada</Heading>
              {customFields.map((field) => (
                <Text key={field.name}>
                  {field.name}: {field.value}
                </Text>
              ))}
            </Section>
          )}

          {attachments.length > 0 && (
            <Section style={section}>
              <Heading style={h2}>Documentos Adjuntos</Heading>
              <Text style={description}>
                El solicitante ha proporcionado los siguientes documentos de
                soporte:
              </Text>
              {attachments.map((file) => (
                <Link key={file.url} href={file.url} style={link}>
                  📎 {file.name}
                </Link>
              ))}
            </Section>
          )}

          <Section style={section}>
            <Text style={description}>
              Para dar respuesta a esta solicitud, por favor ingrese al sistema
              haciendo clic en el siguiente botón:
            </Text>
            <Link href={pqrUrl} style={button}>
              Gestionar Solicitud
            </Link>
          </Section>

          <Section style={footer}>
            <Text style={description}>
              Recuerde que es importante dar respuesta oportuna a las
              solicitudes para mantener la calidad del servicio y cumplir con
              los tiempos establecidos.
            </Text>
            <Text style={description}>
              Este es un mensaje automático, por favor no responda a este
              correo.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  padding: "40px 0",
  width: "100%",
  maxWidth: "600px",
  margin: "0 auto",
};

const container = {
  maxWidth: "580px",
  margin: "0 auto",
  padding: "0 10px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  textAlign: "center" as const,
  margin: "30px 0",
};

const h2 = {
  color: "#444",
  fontSize: "20px",
  margin: "20px 0",
};

const section = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  margin: "20px 0",
  padding: "20px",
  width: "100%",
  maxWidth: "560px",
};

const description = {
  color: "#666",
  lineHeight: "1.5",
  whiteSpace: "pre-wrap" as const,
};

const link = {
  color: "#2563eb",
  display: "block",
  marginBottom: "10px",
  textDecoration: "none",
};

const button = {
  backgroundColor: "#2563eb",
  borderRadius: "5px",
  color: "#fff",
  display: "inline-block",
  padding: "12px 20px",
  textDecoration: "none",
  textAlign: "center" as const,
  margin: "20px 0",
};

const intro = {
  fontSize: "16px",
  lineHeight: "1.5",
  color: "#333",
  marginBottom: "20px",
};

const footer = {
  backgroundColor: "#f8f9fa",
  padding: "20px",
  borderRadius: "5px",
  marginTop: "30px",
};
