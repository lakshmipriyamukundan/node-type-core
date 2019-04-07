import {get as getConfig } from 'config';
import * as userHome from 'user-home';
import * as path from 'path';
import { createLogger, Logger, LoggerOptions } from "winston";
import winston = require('winston');
const DailyRotateFile = require("winston-daily-rotate-file");

const defaultLogLevel: string = getConfig('app.defaultLogLevel');

// const INFO_FILE_PATH = path.join(userHome, 'Projects', 'type-core','logs', 'info.log');
const ERROR_FILE_PATH = path.join(userHome, 'Projects', 'type-core', 'logs','error.log');
// const SILLY_FILE_PATH = path.join(userHome, 'Projects', 'type-core', 'logs', 'silly.log');

const options: LoggerOptions = {
    exitOnError: false,
    level: defaultLogLevel,
    transports: [
        new DailyRotateFile({
            name: "error",
            filename: ERROR_FILE_PATH,
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            showLevel: true,
            timestamp: true,
            level: "error", // error and below to rotate
        }),
    ],
};

const logger: Logger  = createLogger(options);

if (process.env.NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({
        level: 'debug',
    }));
}

export const stream = {
    write: (message: string) => {
      logger.debug(message);
    },
  };

export { logger };

