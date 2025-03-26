import { Resend } from 'resend';
import PQRNotificationEmail from '@/emails/pqr-notification';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPQRNotificationEmail(
  entityEmail: string,
  entityName: string,
  pqrData: any,
  creatorData: any,
  customFields: any[],
  attachments: any[],
  consecutiveCode: string
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
          title: pqrData.title,
          description: pqrData.description,
          createdAt: new Date(pqrData.createdAt).toLocaleString('es-CO', {
            timeZone: 'America/Bogota',
          }),
          status: pqrData.status,
          isAnonymous: pqrData.anonymous,
          consecutiveCode: consecutiveCode,
        },
        creatorInfo: {
          name: creatorData ? `${creatorData?.firstName} ${creatorData?.lastName}` : 'Anónimo',
          email: creatorData ? creatorData?.email : 'Anónimo',
          phone: creatorData ? creatorData?.phone : 'Anónimo',
        },
        customFields,
        attachments,
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