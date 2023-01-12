const winston = require('winston');
const config = require('./config');
const DailyRotateFile = require('winston-daily-rotate-file');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const options = (level) => ({
  name: `${level}-log`,
  filename: `Boiler.${level}.%DATE%.log`,
  dirname: `logs`,
  datePattern: 'YYYY-MM-DD-HH',
  maxSize: '20m',
  maxFiles: '7d',
  auditFile: `logs/Boiler.${level}-audit.json`,
  level,
})

const logger = winston.createLogger({
  // level: config.env === 'development' ? 'info' : 'info',
  level: 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      stderrLevels: ['error'],
    }),
    new DailyRotateFile(options('error'))
  ],
});

module.exports = logger;
