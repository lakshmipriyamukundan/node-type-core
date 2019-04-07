import * as bodyParser from 'body-parser';
import { get as getConfig } from 'config';
import * as cookieParser from 'cookie-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import * as favicon from 'serve-favicon';

import { stream, logger} from './config/app/winston';

import { apis } from './routes';
export const app = express();

const morganEnabled: boolean = getConfig('app.combinedLogger');

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

if (morganEnabled) {
  app.use(morgan('combined', { stream }));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1', apis);



// error handler
const requestErrHandler: express.ErrorRequestHandler = (
  err: any,
  req,
  res,
  next,
) => {
  //if (err.statusCode >= 500) {
  //   logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`)
  //   // stdout to log
  //   console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); // tslint:disable-line
  //   console.log(err); // tslint:disable-line
  //   // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!'); // tslint:disable-line
  // //}

  // if (req.xhr) {
  //   // remove sensitive err details
  //   if (err.statusCode >= 500) {
  //     return res.status(err.statusCode).send({
  //       status: 'failed',
  //       message: err.message,
  //       statusCode: err.statusCode,
  //       remarks: 'This incident has reported.',
  //     });
  //   } else {
  //     return res.status(err.statusCode).send(err);
  //   }
  // }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.statusCode);
  res.render('error');
};

app.use(requestErrHandler);
