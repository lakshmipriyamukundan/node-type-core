import * as SendGrid from '@sendgrid/mail';
import { get as getConfig } from 'config';

const SENDGRID_API_KEY: string = getConfig('sendGrid.apiKey');

SendGrid.setApiKey(SENDGRID_API_KEY);

export const sendEmail = async (mailOptions: any) => {
  const messageData = {
    to: mailOptions.toAddress,
    from: mailOptions.fromAddress,
    subject: mailOptions.subject,
    text: mailOptions.text,
    html: mailOptions.html,
  };
  return await SendGrid.send(messageData as any);
};

// sendEmail();
