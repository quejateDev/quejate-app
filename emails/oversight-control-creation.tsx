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

export interface OversightCreationEmailProps {
  userName: string;
  creationDate: string;
  pqrLink?: string;
}

export const OversightCreationEmail = ({
  userName,
  creationDate,
  pqrLink,
}: OversightCreationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu solicitud de seguimiento de tu PQRSD ha sido registrada correctamente</Preview>
      <Body style={baseStyles.main}>
        <Container style={baseStyles.container}>
          <Heading style={baseStyles.heading}>Confirmación de Solicitud de Seguimiento</Heading>

          <Text style={baseStyles.paragraph}>Estimado {userName},</Text>

          <Text style={baseStyles.paragraph}>
            Le informamos que su solicitud de seguimiento ha sido registrada
            correctamente en nuestro sistema.
          </Text>

          <Text style={baseStyles.paragraph}>
            <strong>Fecha de Creación:</strong> {creationDate}
          </Text>

          <Text style={baseStyles.paragraph}>
            Se procesará su solicitud y se le responderá lo antes posible.
          </Text>

          {pqrLink && (
            <Text style={baseStyles.paragraph}>
              Para ver los detalles de su PQRSD, por favor{" "}
              <Link href={pqrLink} style={baseStyles.link}>
                haga click aquí
              </Link>
            </Text>
          )}
        </Container>
      </Body>
    </Html>
  );
};

export default OversightCreationEmail;