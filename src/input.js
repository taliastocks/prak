var fs = require('fs');

var logger = require('./logger.js');
var Class = require('./lib/class.js').Class;

exports.Input = Class({
    _init: function (path) {
        this.path = path;
    },
    toString: function () {
        return this.path;
    },
    read: function (callback) {
        fs.readFile(this.path, 'utf8', function (err, data) {
            if (err)
                return logger.log('error', err);
            callback(data);
        });
    }
});
