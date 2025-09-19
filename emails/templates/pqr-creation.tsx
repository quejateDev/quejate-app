import {
  Heading,
  Text,
  Link,
  Hr,
} from "@react-email/components";
import { EmailLayout } from "../components/EmailLayout";
import { baseStyles } from "../styles/shared";
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
      <Heading style={baseStyles.heading}>
        ¡Tu PQRSD ha sido registrada exitosamente!
      </Heading>
      
      <Text style={baseStyles.paragraph}>
        Hola {userName},
      </Text>
      
      <Text style={baseStyles.paragraph}>
        Te confirmamos que tu PQRSD ha sido registrada correctamente en nuestra plataforma.
      </Text>

      <div style={{
        ...baseStyles.alert,
        backgroundColor: '#F0F9FF',
        borderColor: '#0EA5E9',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
      }}>
        <Text style={{...baseStyles.alertText, color: baseStyles.brandColors.text.primary}}>
          <strong>📋 Número de radicado:</strong> {pqrNumber}<br />
          <strong>📅 Fecha de registro:</strong> {creationDate}<br />
          <strong>🏢 Entidad destino:</strong> {entityName}
          {entityEmail && (
            <>
              <br />
              <strong>📧 Correo de la entidad:</strong> {entityEmail}
            </>
          )}
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Puedes hacer seguimiento al estado de tu PQRSD en cualquier momento utilizando el número de radicado proporcionado.
      </Text>

      <Link
        href={trackingLink}
        style={baseStyles.button}
      >
        Ver mi PQRSD
      </Link>

      <Hr style={baseStyles.divider} />

      <div style={baseStyles.alert}>
        <Text style={baseStyles.alertText}>
          <strong>💡 Recordatorio:</strong> Guarda tu número de radicado {pqrNumber} para futuras consultas.
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Gracias por confiar en Quejate para hacer valer tus derechos ciudadanos.
      </Text>
    </EmailLayout>
  );
};

export default PqrCreationEmail;
