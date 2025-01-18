import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface ResetPasswordEmailProps {
  userName: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const ResetPasswordEmail = ({
  userName,
  token,
}: ResetPasswordEmailProps) => {
  const resetLink = `${baseUrl}/reset-password?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Restablece tu contraseña en Quejate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Quejate</Heading>
          <Section style={section}>
            <Text style={text}>Hola {userName},</Text>
            <Text style={text}>
              Recibimos una solicitud para restablecer la contraseña de tu cuenta. 
              Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña permanecerá sin cambios.
            </Text>
            <Text style={text}>
              Para restablecer tu contraseña, haz clic en el botón de abajo. 
              Este enlace expirará en 1 hora por razones de seguridad.
            </Text>
            <Button
              href={resetLink}
              style={button}
            >
              Restablecer contraseña
            </Button>
            <Text style={text}>
              O copia y pega este enlace en tu navegador:{' '}
              <Link href={resetLink} style={link}>
                {resetLink}
              </Link>
            </Text>
            <Text style={text}>
              Si no solicitaste restablecer tu contraseña, por favor ignora este correo 
              o contacta a soporte si tienes alguna inquietud.
            </Text>
            <Text style={footer}>
              © {new Date().getFullYear()} TuQueja. Todos los derechos reservados.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const section = {
  padding: '0 48px',
};

const heading = {
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
  padding: '0',
  color: '#484848',
};

const text = {
  color: '#484848',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const button = {
  backgroundColor: '#000000',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
  marginTop: '16px',
  marginBottom: '16px',
};

const link = {
  color: '#000000',
  textDecoration: 'underline',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  marginTop: '48px',
  textAlign: 'center' as const,
};

export default ResetPasswordEmail;