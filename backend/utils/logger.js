/**
 * This file is used to create a logs for the application in the logs directory
 * @parent utils
 * @module logger
 * 
 * @requires winston from node modules to create the logs
 * @requires path from node core modules to get the path of the current file
 * @requires fs from node core modules to create the directory
 * @requires envs from utils/dotenv.js to get the environment variables
 * @requires __dirname from utils/path.js to get the path of the current file
 * 
 * @example import logger from './utils/logger.js';
 * 
 * @returns {Object} logger - The logger object
 */
import winston from 'winston';
import __dirname from './path.js';
import path from 'path';
import fs from 'fs';

const loggerPath = path.join(__dirname, '../logs');

if (!fs.existsSync(loggerPath)) {
        fs.mkdirSync(loggerPath);
}

const type = process.env.CONTEXT;
const { timestamp, combine, printf } = winston.format;

const logger = winston.createLogger({
        transports: [
                new winston.transports.File({
                        level: 'info',
                        filename: path.join(__dirname, '/info.log'),
                        handleExceptions: true,
                        json: true,
                        maxsize: 5242880, // 5MB
                        maxFiles: 5,
                        colorize: true,
                }),
                new winston.transports.File({
                        level: 'error',
                        filename: path.join(__dirname, '/error.log'),
                        handleExceptions: true,
                        json: true,
                        maxsize: 5242880, // 5MB
                        maxFiles: 5,
                        colorize: true,
                }),
                new winston.transports.File({
                        level: 'warn',
                        filename: path.join(__dirname, '/warn.log'),
                        handleExceptions: true,
                        json: true,
                        maxsize: 5242880, // 5MB
                        maxFiles: 5,
                        colorize: true,
                }),
                new winston.transports.Console({
                        level: 'debug',
                        handleExceptions: true,
                        json: false,
                        colorize: true,
                }),
        ],
        format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf((info) => `${info.timestamp} ${info.level}: ${JSON.stringify(info.message)}`),
        ),
        format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf((error) => `${error.timestamp} ${error.level}: ${JSON.stringify(error.message)}`),
        ),
        format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                printf((warn) => `${warn.timestamp} ${warn.level}: ${JSON.stringify(warn.message)}`),
        ),
});

logger.transports.forEach((t) => {
        if (type === 'production') {
                if (t instanceof winston.transports.Console) { //checks if the transport is a console transport
                        t.silent = true; // disables the console transport
                } else {
                        t.silent = false; // enables the file transports
                }
        }
        if (t instanceof winston.transports.File) { //checks if the transport is a file transport
                t.dirname = loggerPath; // the path to the log directory
        }
});

export default logger;