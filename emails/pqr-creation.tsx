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
import { baseStyles } from "./styles/shared";
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
      <Preview>Tu PQRSD ha sido registrada correctamente</Preview>
      <Body style={baseStyles.main}>
        <Container style={baseStyles.container}>
          <Heading style={baseStyles.heading}>Confirmación de PQRSD</Heading>

          <Text style={baseStyles.paragraph}>Estimado {userName},</Text>

          <Text style={baseStyles.paragraph}>
            Le informamos que su solicitud de PQRSD ha sido registrada
            correctamente en nuestro sistema.
          </Text>

          <Text style={baseStyles.paragraph}>
            <strong>Número de Seguimiento:</strong> {pqrNumber}
            <br />
            <strong>Fecha de Creación:</strong> {creationDate}
          </Text>

          <Text style={baseStyles.paragraph}>
            Procesaremos su solicitud y le responderemos lo antes posible. Puede
            seguir el estado de su PQRSD utilizando el número de referencia
            anterior.
          </Text>

          {pqrLink && (
            <Text style={baseStyles.paragraph}>
              Para ver los detalles de su PQR, por favor{" "}
              <Link href={pqrLink} style={baseStyles.link}>
                haga click aquí
              </Link>
            </Text>
          )}

          <Text style={baseStyles.paragraph}>
            Si tiene alguna pregunta, por favor no dude en contactarnos.
          </Text>

          <Text style={baseStyles.paragraph}>
            Atentamente,
            <br />
            El equipo de Atención al Cliente
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PqrCreationEmail;
