var logger = exports.logger = require('./logger.js');

var Input = require('./input.js').Input;

exports.build = function (entrypoint) {
    logger.log('log', 'Building ' + JSON.stringify(entrypoint) + '.');
    var input = Input(entrypoint);
    input.read(function (data) {
        console.log(data);
    });
};
