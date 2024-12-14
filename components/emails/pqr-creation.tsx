// components/emails/pqr-creation.tsx
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
  Link,
} from "@react-email/components";
import * as React from "react";

interface PqrCreationEmailProps {
  userName: string;
  pqrNumber: string;
  creationDate: string;
  pqrLink?: string;
}

export const PqrCreationEmail = ({
  userName,
  pqrNumber,
  creationDate,
  pqrLink,
}: PqrCreationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu PQR ha sido registrada correctamente</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Confirmación de PQR</Heading>

          <Text style={paragraph}>Estimado {userName},</Text>

          <Text style={paragraph}>
            Le informamos que su solicitud de PQR ha sido registrada
            correctamente en nuestro sistema.
          </Text>

          <Text style={paragraph}>
            <strong>Número de Seguimiento:</strong> {pqrNumber}
            <br />
            <strong>Fecha de Creación:</strong> {creationDate}
          </Text>

          <Text style={paragraph}>
            Procesaremos su solicitud y le responderemos lo antes posible. Puede
            seguir el estado de su PQR utilizando el número de referencia
            anterior.
          </Text>

          {pqrLink && (
            <Text style={paragraph}>
              Para ver los detalles de su PQR, por favor{" "}
              <Link href={pqrLink} style={link}>
                haga click aquí
              </Link>
            </Text>
          )}

          <Text style={paragraph}>
            Si tiene alguna pregunta, por favor no dude en contactarnos.
          </Text>

          <Text style={paragraph}>
            Atentamente,
            <br />
            El equipo de Atención al Cliente
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Ubuntu,sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const link = {
  color: "#2754C5",
  textDecoration: "underline",
};

export default PqrCreationEmail;
