exports.logger = require('./logger.js');

var Input = require('./input.js').Input;

exports.build = function (entrypoint) {
    var input = Input(entrypoint);
    console.log('Building ' + JSON.stringify(entrypoint) + '.');
};
