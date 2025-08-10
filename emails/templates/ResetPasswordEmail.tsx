import {
  Button,
  Heading,
  Link,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from '../components/EmailLayout';
import { baseStyles } from '../styles/shared';

interface ResetPasswordEmailProps {
  userName: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const ResetPasswordEmail = ({
  userName,
  token,
}: ResetPasswordEmailProps) => {
  const resetLink = `${baseUrl}/auth/new-password?token=${token}`;

  return (
    <EmailLayout preview="Restablece tu contraseña en Quejate">
      <Heading style={baseStyles.heading}>
        Solicitud de restablecimiento de contraseña
      </Heading>
      
      <Text style={baseStyles.paragraph}>
        Hola,
      </Text>
      
      <Text style={baseStyles.paragraph}>
        Recibimos una solicitud para restablecer la contraseña de tu cuenta en Quejate. 
      </Text>
      
      <Text style={baseStyles.paragraph}>
        Si solicitaste este cambio, haz clic en el botón de abajo para crear una nueva contraseña:
      </Text>

      <Button
        href={resetLink}
        style={baseStyles.button}
      >
        Restablecer mi contraseña
      </Button>

      <Hr style={baseStyles.divider} />

      <Text style={baseStyles.paragraph}>
        Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
      </Text>
      
      <Text style={{...baseStyles.paragraph, wordBreak: 'break-all' as const}}>
        <Link href={resetLink} style={baseStyles.link}>
          {resetLink}
        </Link>
      </Text>

      <div style={baseStyles.alert}>
        <Text style={baseStyles.alertText}>
          <strong>⚠️ Importante:</strong> Este enlace expirará por razones de seguridad.
        </Text>
      </div>

      <div style={{...baseStyles.alert, backgroundColor: '#FEF2F2', borderColor: '#FECACA'}}>
        <Text style={{...baseStyles.alertText, color: '#DC2626'}}>
          <strong>¿No solicitaste este cambio?</strong><br />
          Si no pediste restablecer tu contraseña, puedes ignorar este correo de forma segura. 
          Tu contraseña actual permanecerá sin cambios.
        </Text>
      </div>

    </EmailLayout>
  );
};

export default ResetPasswordEmail;
