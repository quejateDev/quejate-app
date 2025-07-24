import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
  Button
} from "@react-email/components";
import { baseStyles } from "./styles/shared";
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
  documentUrl,
}: OversightNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Notificación de Seguimiento - {entityName}</Preview>
      <Body style={baseStyles.main}>
        <Container style={baseStyles.container}>
          <Heading style={baseStyles.heading}>
            Seguimiento de PQRSD no respondida
          </Heading>

          <Text style={baseStyles.paragraph}>Estimado {oversightName},</Text>

          <Text style={baseStyles.paragraph}>
            Por medio del presente comunicado, se informa formalmente que un usuario ha escalado
            una PQRSD dirigida a {entityName}, la cual no obtuvo respuesta dentro del plazo
            legal establecido.
          </Text>

          <Container style={{
            backgroundColor: '#f8f9fa',
            padding: '15px',
            margin: '15px 0',
            borderRadius: '4px',
            borderLeft: '4px solid #2754C5'
          }}>
            <Text style={baseStyles.paragraph}>
              <strong>Entidad supervisada:</strong> {entityName}
            </Text>
            <Text style={baseStyles.paragraph}>
              <strong>Ciudadano solicitante:</strong> {creatorInfo.name}
            </Text>
            {creatorInfo.phone && (
              <Text style={baseStyles.paragraph}>
                <strong>Contacto:</strong> {creatorInfo.phone}, {creatorInfo.email}
              </Text>
            )}
          </Container>

          <Text style={baseStyles.paragraph}>
            Puede consultar los detalles completos de la solicitud original a través del 
            siguiente enlace:{" "}
            <Link href={pqrUrl} style={baseStyles.link}>
              PQRSD
            </Link>.
          </Text>

          {documentUrl && (
            <>
              <Text style={baseStyles.paragraph}>
                Documento adjunto disponible para descarga:
              </Text>
              <Button href={documentUrl} style={baseStyles.buttonStyle}>
                Descargar Documento
              </Button>
            </>
          )}

          <Text style={baseStyles.paragraph}>
            De acuerdo con los protocolos establecidos, solicitamos a su despacho realizar
            el seguimiento correspondiente a esta situación y notificar directamente al
            ciudadano sobre las acciones tomadas.
          </Text>

          <Text style={{...baseStyles.paragraph, ...baseStyles.footerStyle}}>
            <em>Nota: Este correo es generado automáticamente por nuestra plataforma.
            Por favor no responder directamente a este mensaje.</em>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
