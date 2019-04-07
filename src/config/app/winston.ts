import {get as getConfig } from 'config';
import * as userHome from 'user-home';
import * as path from 'path';
import { createLogger, Logger, LoggerOptions, transports } from "winston";
import winston = require('winston');
const DailyRotateFile = require("winston-daily-rotate-file");

const defaultLogLevel: string = getConfig('app.defaultLogLevel');

const INFO_FILE_PATH = path.join(userHome, 'Projects', 'type-core', 'info.log');
const ERROR_FILE_PATH = path.join(userHome, 'Projects', 'type-core', 'error.log');
const SILLY_FILE_PATH = path.join(userHome, 'Projects', 'type-core', 'silly.log');

const options: LoggerOptions = {
    exitOnError: false,
    level: defaultLogLevel,
    transports: [
        new DailyRotateFile({
            name: "info",
            filename: INFO_FILE_PATH,
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "14d",
            showLevel: true,
            timestamp: true,
            level: "info", // info and below to rotate
        }),
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
        new DailyRotateFile({
            name: "silly",
            filename: SILLY_FILE_PATH,
            datePattern: "YYYY-MM-DD-HH",
            zippedArchive: true,
            maxSize: "20m",
            maxFiles: "1d",
            showLevel: true,
            timestamp: true,
            level: "silly", // error and below to rotate
        }),
    ],
};

const logger: Logger  = createLogger(options);

if (process.env.NODE_ENV === 'development') {
    logger.add(new winston.transports.Console({
        level: "debug", // debug and below to console
    }));
}

// logger.add(new winston.transports.Stream({
//     stream: {
//         write: (message: string) => {
//             logger.info(message)
//         }
//     }
//   }));

// create a stream object with a 'write' function that will be used by `morgan`
// logger.stream = {
//     write: (message: string, encoding: string)=> {
//       // use the 'info' log level so the output will be picked up by both transports (file and console)
//       logger.info(message);
//     },
//   };

export const stream = {
    write: (message: string) => {
      logger.info(message);
    },
  };

export { logger };

