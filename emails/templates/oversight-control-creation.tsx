import {
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles } from "../styles/shared";
import * as React from "react";

export interface OversightCreationEmailProps {
  userName: string;
  creationDate: string;
  pqrLink?: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const OversightCreationEmail = ({
  userName,
  creationDate,
  pqrLink,
}: OversightCreationEmailProps) => {

  return (
    <EmailLayout preview="Tu solicitud de seguimiento ha sido registrada correctamente">
      <Heading style={baseStyles.heading}>
        ✅ Solicitud de Control y Seguimiento Registrada
      </Heading>
      
      <Text style={baseStyles.paragraph}>
        Hola {userName},
      </Text>
      
      <Text style={baseStyles.paragraph}>
        Te confirmamos que tu solicitud de control y seguimiento de tu PQRSD ha sido registrada exitosamente en nuestra plataforma.
      </Text>

      <div style={{
        ...baseStyles.alert,
        backgroundColor: '#ECFDF5',
        borderColor: '#10B981',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}>
        <Text style={{...baseStyles.alertText, color: '#065F46'}}>
          <strong>📅 Fecha de registro:</strong> {creationDate}
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Tu solicitud será procesada y enviada a los organismos de control correspondientes para que realicen el seguimiento pertinente.
      </Text>

      <Link
        href={pqrLink}
        style={baseStyles.button}
      >
        Ver mi Solicitud de Seguimiento
      </Link>

      <Hr style={baseStyles.divider} />

      <Text style={baseStyles.paragraph}>
        Gracias por utilizar Quejate para promover la transparencia y el control ciudadano.
      </Text>
    </EmailLayout>
  );
};

export default OversightCreationEmail;