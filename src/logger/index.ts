/*
 * Open Syk @common
 * MIT Licensed
 * Code taken from https://github.com/mercadoni/elementals
 */

import flat from 'flat';
import logfmt from 'logfmt';
import { VError } from 'verror';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, label, printf, colorize, json } = format;
import maskData from 'maskdata';

const LOG_FORMAT = process.env.LOG_FORMAT;
const LOG_MAX_DEPTH = process.env.LOG_MAX_DEPTH;
const LOG_SILENT = process.env.LOG_SILENT;
const LOG_MASK_SYMBOL = process.env.LOG_MASK_SYMBOL;
const LOG_LEVEL = process.env.LOG_LEVEL;

const logFormat = (LOG_FORMAT ?? 'logfmt') as string;
const maxDepth = (LOG_MAX_DEPTH ? parseInt(LOG_MAX_DEPTH) : 3) as number;
const silent = (LOG_SILENT || false) as boolean;
const maskSymbol = (LOG_MASK_SYMBOL ?? '*') as string;

export const formats = (tag: string) => {
  return {
    logfmt: combine(
      label({ label: tag }),
      timestamp(),
      colorize(),
      printf((info) => {
        const { timestamp, label, level, message, ...data } = info;
        const logData = { ...data['data'], stacktrace: data['stacktrace'] };
        Object.keys(logData).forEach((key) => logData[key] === undefined && delete logData[key]);
        const logOptions = { maxDepth };
        return `[${timestamp}] ${message} level=${level} label=${label} ${logfmt.stringify(flat(logData, logOptions))}`;
      }),
    ),
    json: combine(label({ label: tag }), timestamp(), json()),
  };
};

const maskRequestData = (input: JSON, maskedFields: string[]) => {
  const maskJSONOptions = {
    maskWith: maskSymbol,
    fields: maskedFields,
  };
  return maskData.maskJSONFields(input, maskJSONOptions);
};

interface Logger {
  debug: (message: string, data?: any, maskedFields?: string[]) => void;
  info: (message: string, data?: any, maskedFields?: string[]) => void;
  error: (message: string, err: any, data?: any, maskedFields?: string[]) => void;
}

const logger = (tag: string, loggerLevel?: string): Logger => {
  const level = (loggerLevel ?? LOG_LEVEL ?? 'debug') as string;
  const taggedFormats = formats(tag);
  const format = logFormat === 'logfmt' ? taggedFormats.logfmt : taggedFormats.json;
  const log = createLogger({
    level,
    format,
    transports: [new transports.Console()],
    silent,
  });
  const error = (message: string, err: Error, data?: any, maskedFields?: string[]) => {
    const stacktrace = VError.fullStack(err);
    data = maskedFields ? maskRequestData(data, maskedFields) : data;
    log.error(message, { data, stacktrace });
  };
  const info = (message: string, data?: any, maskedFields?: string[]) => {
    data = maskedFields ? maskRequestData(data, maskedFields) : data;
    log.info(message, { data });
  };
  const debug = (message: string, data?: any, maskedFields?: string[]) => {
    data = maskedFields ? maskRequestData(data, maskedFields) : data;
    log.debug(message, { data });
  };

  return { debug, info, error };
};

export default logger;
