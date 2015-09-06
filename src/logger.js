var loggers = [];

exports.register = function (logger) {
    loggers.push(logger);
};

exports.log = function (level, message) {
    loggers.forEach(function (logger) {
        logger(level, message);
    });
};
