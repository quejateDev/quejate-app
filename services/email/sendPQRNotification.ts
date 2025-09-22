import { Resend } from 'resend';
import PQRNotificationEmail from '@/emails/templates/pqr-notification';
import { formatDate } from '@/lib/dateUtils';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPQRNotificationEmail(
  entityEmail: string,
  entityName: string,
  pqrData: any,
  contactInfo?: { name: string; email: string; phone: string } | null,
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
          createdAt: formatDate(pqrData.createdAt),
          status: pqrData.status,
          isAnonymous: pqrData.anonymous,
          consecutiveCode: pqrData.consecutiveCode,
        },
        creatorInfo: {
          name: pqrData.anonymous ? 'Anónimo' : (contactInfo?.name || pqrData.creator?.name || 'No proporcionado'),
          email: pqrData.anonymous ? 'Anónimo' : (contactInfo?.email || pqrData.creator?.email || 'No proporcionado'),
          phone: pqrData.anonymous ? 'Anónimo' : (contactInfo?.phone || pqrData.creator?.phone || 'No proporcionado'),
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