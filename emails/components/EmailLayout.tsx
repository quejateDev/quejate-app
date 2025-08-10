import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';
import { baseStyles } from '../styles/shared';

interface EmailLayoutProps {
  children: React.ReactNode;
  preview?: string;
}


export const EmailLayout = ({ children, preview }: EmailLayoutProps) => {
  return (
    <Html>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      {preview && <Text style={{ display: 'none', opacity: 0, overflow: 'hidden', height: 0, width: 0 }}>{preview}</Text>}
      <Body style={baseStyles.main}>
        <Section style={{ height: '40px' }}></Section>
        <Container style={baseStyles.container}>
          <Section style={baseStyles.header}>
            <Img
              src={`https://quejate-files.s3.us-east-2.amazonaws.com/LogotipoEditableterpng.png`}
              alt="Quejate Logo"
              style={baseStyles.logo}
            />
          </Section>

          <Section style={baseStyles.content}>
            {children}
          </Section>
          <Section style={baseStyles.footer}>
            <Text style={baseStyles.footerText}>
              Este es un correo automático, por favor no respondas a este mensaje.
            </Text>
            <Text style={baseStyles.footerText}>
              Si tienes alguna pregunta, puedes contactarnos en{' '}
              <a href="mailto:soporte@quejate.com.co" style={baseStyles.footerLink}>
                soporte@quejate.com.co
              </a>
            </Text>
            <Text style={baseStyles.footerText}>
              © {new Date().getFullYear()} Quejate. Todos los derechos reservados.
            </Text>
            <Text style={baseStyles.footerText}>
              Santa Marta, Colombia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default EmailLayout;
