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

interface VerificationEmailProps {
  userName: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const VerificationEmail = ({
  userName,
  token,
}: VerificationEmailProps) => {
  const verificationLink = `${baseUrl}/auth/new-verification?token=${token}`;

  return (
    <EmailLayout preview="Verifica tu correo electrónico en Quejate">
      <Heading style={baseStyles.heading}>
        ¡Bienvenidos!
      </Heading>
      
      <Text style={baseStyles.paragraph}>
        Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte como parte de nuestra comunidad dedicada a fortalecer la participación ciudadana.
      </Text>
      
      <Text style={baseStyles.paragraph}>
        Para completar tu registro y comenzar a usar todas las funcionalidades de Quejate, necesitamos verificar tu dirección de correo electrónico.
      </Text>

      <Button
        href={verificationLink}
        style={baseStyles.button}
      >
        Verificar mi correo electrónico
      </Button>

      <Hr style={baseStyles.divider} />

      <Text style={baseStyles.paragraph}>
        Si el botón no funciona, puedes copiar y pegar este enlace en tu navegador:
      </Text>
      
      <Text style={{...baseStyles.paragraph, wordBreak: 'break-all' as const}}>
        <Link href={verificationLink} style={baseStyles.link}>
          {verificationLink}
        </Link>
      </Text>

      <div style={baseStyles.alert}>
        <Text style={baseStyles.alertText}>
          <strong>Importante:</strong> Este enlace de verificación expirará en 24 horas por razones de seguridad.
        </Text>
      </div>

      <Text style={baseStyles.paragraph}>
        Si no creaste esta cuenta, puedes ignorar este correo de forma segura. Tu dirección de correo no será utilizada sin tu consentimiento.
      </Text>
    </EmailLayout>
  );
};

export default VerificationEmail;
