var Class = require('./lib/class.js').Class;

exports.Input = Class({
    _init: function (path) {
        this.path = path;
    },
    toString: function () {
        return this.path;
    }
});
