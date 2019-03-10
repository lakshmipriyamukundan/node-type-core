import * as bodyParser from 'body-parser';
import { get as getConfig } from 'config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as lme from 'lme';
import * as favicon from 'serve-favicon';
import {
  IssueMaker,
  ExpressRequestError,
  ExpressRequestErrorType,
} from 'issue-maker';

// import { attachTokenData } from './access-control/attach-token-data';
// import { rootAccess } from './access-control/root-access';

// import {RequestError, RequestErrorType} from 'issue-maker/dist/src/error-types/express-request-error';
// init db
import { mongooseConnectionPromise, mongoose } from './db.init';

export { mongoose, mongooseConnectionPromise }; // exporting for quick access in tests

import { apis } from './routes';

mongooseConnectionPromise
  .then(() => {
    lme.i(`> database connected:${getConfig('database.url')}`);
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */

    // if this is a forked process, notify parent when the server is ready
    if (process.send) {
      lme.i('sending ready');
      process.send({ msg: 'ready' });
      process.on('message', msg => {
        if (typeof msg === 'object' && msg.msg === 'terminate') {
          console.log('terminating server upon parent request. bye :)'); // tslint:disable-line:no-console
          process.exit(msg.statusCode);
        }
      });
    }
  })
  .catch(err => {
    // tslint:disable-next-line
    lme.e(
      '> MongoDB connection error. Please make sure MongoDB is running. ' + err,
    );
    process.exit(1);
  });

export const app = express();

const morganEnabled: boolean = getConfig('app.morgan');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  cors({
    origin: '*',
  }),
);

// un-comment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

import { UPLOAD_DIR } from './routes/utils/index';

// root files. this need to set acl only for devs
app.use('/root', rootAccess, express.static(path.join(__dirname, 'root')));
app.use('/assets', express.static(UPLOAD_DIR));

if (morganEnabled) {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', apis);

// test for err emails
app.get('/send/cats/to/me/with/500', (req, res, next) =>
  next(
    new ExpressRequestError(
      ExpressRequestErrorType.INTERNAL_SERVER_ERROR,
      new Error('testing 500 with cats api'),
    ),
  ),
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new ExpressRequestError(ExpressRequestErrorType.NOT_FOUND);
  next(err);
});

const gitlabIssue = new IssueMaker({
  service: getConfig('issue-maker.service'),
  endPoint: getConfig('issue-maker.endPoint'),
  privateToken: getConfig('issue-maker.privateToken'),
  projectId: getConfig('issue-maker.projectId'),
});

// error handler
const requestErrHandler: express.ErrorRequestHandler = async (
  err: ExpressRequestError,
  req,
  res,
  next,
) => {
  if (err.statusCode >= 500) {
    // stdout to log
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); // tslint:disable-line
    console.log(err); // tslint:disable-line
    console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); // tslint:disable-line
  }
  if (
    err.statusCode >= 500 &&
    process.env.NODE_ENV !== 'development' &&
    process.env.TESTING !== 'true'
  ) {
    try {
      await gitlabIssue.expressReportError(req, err, {
        labels: 'by-issue-maker',
        resLocals: res.locals,
        databaseHost: getConfig('database.url'),
        databaseName: '',
      });
    } catch (err) {
      console.log('ERR: some error occurred while reporting issue', err); //tslint:disable-line
    }
  }

  if (req.xhr) {
    // remove sensitive err details
    if (err.statusCode >= 500) {
      return res.status(err.statusCode).send({
        status: 'failed',
        message: err.message,
        statusCode: err.statusCode,
        remarks: 'This incident has reported.',
      });
    } else {
      return res.status(err.statusCode).send(err);
    }
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.statusCode);
  res.render('error');
};

app.use(requestErrHandler);
