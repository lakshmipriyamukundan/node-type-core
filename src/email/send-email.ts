import { get as getConfig } from 'config';
import { render } from 'ejs';

import { ses } from '../aws/ses';
import { AppEmailTemplates } from './app-templates';
import { EmailSignatures } from './signatures';
import { EmailTemplates } from './templates';

class MailOptions {
  public toAddresses: string[];
  public subject: string;
  public fields: any;
  public template: string;
  public bccAddresses?: string[];
  public fromName?: string;
  public fromEmail?: string;
}

export const sendEmail = (mailOptions: MailOptions) => {
  // email config
  const params = {
    Destination: {
      ToAddresses: mailOptions.toAddresses,
      BccAddresses: mailOptions.bccAddresses,
    },
    Message: {
      Body: {
        Html: {
          Data: render(mailOptions.template, mailOptions.fields),
        },
      },
      Subject: { Data: mailOptions.subject },
    },
    Source: `${mailOptions.fromName ||
      'Miwago Services'} ${mailOptions.fromEmail ||
      `<${getConfig('mails.defaultFrom')}>`}` /* required */,
  };
  if (getConfig('mails.enable')) {
    return ses.sendEmail(params).promise();
  }

  return new Promise(resolve => resolve());
};

export { AppEmailTemplates, EmailTemplates, EmailSignatures };

/**
 * un-comment below function for quick testing sendEmail()
 */
// const year = new Date().getFullYear().toString();
// let month = (new Date().getMonth() + 1).toString();
// let day = new Date().getDay().toString();
// const hrs = new Date().getHours().toString();
// const mns = new Date().getMinutes().toString();
// const secs = new Date().getSeconds().toString();

// if (month.length === 1) {
//   month = `0${month}`;
// }

// if (day.length === 1) {
//   day = `0${day}`;
// }

// let dateString = `${year}${month}${day}T${hrs}${mns}${secs}Z/`;
// let dateString1 = `${year}${month}22T${hrs}${mns}${secs}Z`;
// dateString = encodeURI(dateString);
// dateString1 = encodeURI(dateString1);

// console.log('nnnnnnnnnnnnnnnn', dateString);
// sendEmail({
//   toAddresses: ['lakshmipriya.m@cubettech.com'],
//   subject: 'Test Email markup - ' + new Date(),
//   template: EmailTemplates.SAMPLE,
//   fields: {
//     url: `http://www.google.com/calendar/event?`, // tslint:disable-line
//   },
// })
//   .then(data => {
//     console.log('mailed', data); // tslint:disable-line
//   })
//   .catch(err => console.log('ERR', err)); // tslint:disable-line

/**
 * ORIGINAL PARAMS:
 */

// const params = {
// 	Destination: {
// 		/* required */
// 		BccAddresses: [
// 			// 'STRING_VALUE',
// 			/* more items */
// 		],
// 		CcAddresses: [
// 			// 'STRING_VALUE',
// 			/* more items */
// 		],
// 		ToAddresses: [
// 			// 'STRING_VALUE',
// 			/* more items */
// 		],
// 	},
// 	Message: {
// 		/* required */
// 		Body: {
// 			/* required */
// 			Html: {
// 				Data: '' /* required */,
// 				// Charset: 'STRING_VALUE',
// 			},
// 			// Text: {
// 			// 	Data: 'STRING_VALUE' /* required */,
// 			// 	Charset: 'STRING_VALUE',
// 			// },
// 		},
// 		Subject: {
// 			/* required */
// 			Data: 'Default subject' /* required */,
// 			// Charset: 'STRING_VALUE',
// 		},
// 	},
// 	Source: 'no_reply@aumet.me' /* required */,
// 	ConfigurationSetName: 'STRING_VALUE',
// 	ReplyToAddresses: [
// 		'STRING_VALUE',
// 		/* more items */
// 	],
// 	ReturnPath: 'STRING_VALUE',
// 	ReturnPathArn: 'STRING_VALUE',
// 	SourceArn: 'STRING_VALUE',
// 	Tags: [
// 		{
// 			Name: 'STRING_VALUE' /* required */,
// 			Value: 'STRING_VALUE' /* required */,
// 		},
// 		/* more items */
// 	],
// };
