import {
  Heading,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { baseStyles } from '../styles/shared';

interface ResetPasswordCodeEmailProps {
  userName: string;
  code: string;
}

export const ResetPasswordCodeEmail = ({
  userName,
  code,
}: ResetPasswordCodeEmailProps) => {
  return (
    <EmailLayout
      preview="Tu código de restablecimiento de contraseña - Quejate"
      inlineLogo
    >
      <Heading style={baseStyles.heading}>
        Restablecimiento de contraseña
      </Heading>

      <Text style={baseStyles.paragraph}>
        Hola {userName},
      </Text>

      <Text style={baseStyles.paragraph}>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en Quejate. Usa el siguiente código en la app para continuar:
      </Text>

      <div
        style={{
          backgroundColor: '#F1F5FF',
          border: '1px solid #C7D7FF',
          borderRadius: '12px',
          padding: '24px',
          margin: '24px 0',
          textAlign: 'center' as const,
        }}
      >
        <Text
          style={{
            fontSize: '40px',
            fontWeight: 700,
            letterSpacing: '8px',
            color: '#2563EB',
            margin: 0,
            lineHeight: '1.2',
            fontFamily: 'monospace',
          }}
        >
          {code}
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Este código expira en 15 minutos. Si no fuiste tú, ignora este mensaje.
      </Text>

      <Hr style={baseStyles.divider} />

      <div style={{ ...baseStyles.alert, backgroundColor: '#FEF2F2', borderColor: '#FECACA' }}>
        <Text style={{ ...baseStyles.alertText, color: '#DC2626' }}>
          <strong>¿No solicitaste este cambio?</strong><br />
          Si no pediste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña actual permanecerá sin cambios.
        </Text>
      </div>
    </EmailLayout>
  );
};

export default ResetPasswordCodeEmail;
