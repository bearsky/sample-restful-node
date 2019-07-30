const winston = require('winston');

const options = {
    combined: {
        level: 'info',
        filename: `${appRoot}/logs/combined.log`,
        handleExceptions: true,
        json: true,
        colorize: false,
    },
    error: {
        level: 'error',
        filename: `${appRoot}/logs/error.log`,
        handleExceptions: true,
        json: true,
        colorize: false
    },
    console: {
       level: 'debug',
       handleExceptions: true,
       json: false,
       colorize: true,
    }
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.combined),
        new winston.transports.File(options.error),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    }
};

module.exports = logger;