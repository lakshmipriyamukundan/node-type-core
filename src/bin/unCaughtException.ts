import { get as getConfig } from 'config';
import { v4 } from 'public-ip';
import * as serializeError from 'serialize-error';
import { IssueMaker } from 'issue-maker';

import { AppEmailTemplates, sendEmail } from '../email/send-email';

const gitlabIssue = new IssueMaker({
  service: getConfig('issue-maker.service'),
  endPoint: getConfig('issue-maker.endPoint'),
  privateToken: getConfig('issue-maker.privateToken'),
  projectId: getConfig('issue-maker.projectId'),
});

const ERR_EMAIL: string = getConfig('mails.errMails');

// handle uncaught exception
process.on('uncaughtException', async error => {
  // tslint:disable-next-line:no-console
  console.log('########################################\n');
  // tslint:disable-next-line:no-console
  console.log(error);
  // tslint:disable-next-line:no-console
  console.trace(error);
  // tslint:disable-next-line:no-console
  console.log('\n########################################\n');
  try {
    if (
      process.env.NODE_ENV !== 'development' &&
      process.env.TESTING !== 'true'
    ) {
      await gitlabIssue.reportIssue({
        title: 'app terminated (uncaught exception)',
        description: `${error}`,
        labels: 'by-issue-maker',
      });
    }
  } catch (err) {
    // tslint:disable-next-line:no-console
    console.log('>> ERRR in reporting to gitlab', err);
    if (process.env.NODE_ENV === 'development') {
      console.error('-----------------catch', error); // tslint:disable-line
      // FORCE exit the process too.
      return process.exit(1);
    }

    try {
      const err = serializeError(error);
      const pubIp = await v4();
      if (
        process.env.NODE_ENV !== 'development' &&
        process.env.TESTING !== 'true'
      ) {
        await sendEmail({
          toAddresses: [ERR_EMAIL],
          template: AppEmailTemplates.ERR_REPORTER,
          fromName: 'Miwago err Reporter',
          subject: `App terminated on uncaughtException in ${process.env.USER}`,
          fields: {
            errCode: 0,
            ENV_USER: process.env.USER,
            NODE_ENV: process.env.NODE_ENV,
            NODE_CONFIG: JSON.stringify(
              JSON.parse(process.env.NODE_CONFIG || '{}'),
              null,
              2,
            ),
            host: pubIp,
            NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE,
            databaseName: getConfig('database.url'),
            databaseHost: `getConfig('database.host')`,
            time: new Date(),
            errDetails: JSON.stringify(err, null, 2),
            requestIp: '',
            resLocals: '',
            requestOrigin: '',
            requestedUrl: '',
            reqMethod: '',
            reqHeaders: '',
            reqBody: '',
            reqQuery: '',
          },
        });
        console.log('err emailed'); // tslint:disable-line
      }
      await sendEmail({
        toAddresses: [ERR_EMAIL],
        template: AppEmailTemplates.ERR_REPORTER,
        fromName: 'Miwago err Reporter',
        subject: `App terminated on uncaughtException in ${process.env.USER}`,
        fields: {
          errCode: 0,
          ENV_USER: process.env.USER,
          NODE_ENV: process.env.NODE_ENV,
          NODE_CONFIG: JSON.stringify(
            JSON.parse(process.env.NODE_CONFIG || '{}'),
            null,
            2,
          ),
          host: pubIp,
          NODE_APP_INSTANCE: process.env.NODE_APP_INSTANCE,
          databaseName: getConfig('database.url'),
          databaseHost: `getConfig('database.host')`,
          time: new Date(),
          errDetails: JSON.stringify(err, null, 2),
          requestIp: '',
          resLocals: '',
          requestOrigin: '',
          requestedUrl: '',
          reqMethod: '',
          reqHeaders: '',
          reqBody: '',
          reqQuery: '',
        },
      });
      console.log('err emailed'); // tslint:disable-line

      console.error('-----------------', error); // tslint:disable-line
      // FORCE exit the process too.
      process.exit(1);
    } catch (err) {
      // tslint:disable-next-line
      console.log('err in sending err-reporter-email', err);
      console.error('-----------------catch', error); // tslint:disable-line
      // FORCE exit the process too.
      process.exit(1);
    }
  }
});
