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

interface VerificationEmailProps {
  userName: string;
  token: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const VerificationEmail = ({
  userName,
  token,
}: VerificationEmailProps) => {
  const verificationLink = `${baseUrl}/verify-email?token=${token}`;

  return (
    <Html>
      <Head />
      <Preview>Verifica tu correo electrónico en Quejate</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Quejate</Heading>
          <Section style={section}>
            <Text style={text}>Hola {userName},</Text>
            <Text style={text}>
              Gracias por registrarte en Quejate. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el botón de abajo.
            </Text>
            <Button
              href={verificationLink}
              style={button}
            >
              Verificar correo electrónico
            </Button>
            <Text style={text}>
              O copia y pega este enlace en tu navegador:{' '}
              <Link href={verificationLink} style={link}>
                {verificationLink}
              </Link>
            </Text>
            <Text style={text}>
              Si no creaste esta cuenta, puedes ignorar este correo.
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
  margin: '24px 0',
};

const link = {
  color: '#000000',
  textDecoration: 'underline',
};

const footer = {
  color: '#9ca299',
  fontSize: '14px',
  marginTop: '48px',
  textAlign: 'center' as const,
};

export default VerificationEmail;
