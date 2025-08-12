import { Resend } from 'resend';
import PQRNotificationEmail from '@/emails/templates/pqr-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPQRNotificationEmail(
  entityEmail: string,
  entityName: string,
  pqrData: any,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'PQR System <notificaciones@quejate.com.co>',
      to: entityEmail,
      subject: `Nueva PQRSD Recibida - ${entityName}`,
      react: PQRNotificationEmail({
        entityName,
        pqrInfo: {
          id: pqrData.id,
          type: pqrData.type,
          subject: pqrData.subject,
          description: pqrData.description,
          createdAt: new Date(pqrData.createdAt).toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
          }),
          status: pqrData.status,
          isAnonymous: pqrData.anonymous,
          consecutiveCode: pqrData.consecutiveCode,
        },
        creatorInfo: {
          name: pqrData.creator ? `${pqrData.creator.name}` : 'Anónimo',
          email: pqrData.creator ? pqrData.creator.email : 'Anónimo',
          phone: pqrData.creator ? pqrData.creator.phone : 'Anónimo',
        },
        customFields: pqrData.customFieldValues,
        attachments: pqrData.attachments,
        pqrUrl: `https://quejate.com.co/dashboard/pqr/${pqrData.id}`,
      }),
    });

    if (error) {
      console.error('Error sending PQRSD notification email:', error);
    }

    return data;
  } catch (error) {
    console.error('Error sending PQRSD notification email:', error);
    throw error;
  }
} 