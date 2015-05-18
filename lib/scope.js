'use strict';

var Class = require('./class.js').Class;
var Variable = require('./variable.js').Variable;
var prefix = 'S';


exports.Scope = Class({

    _init: function () {
        this.vars = {};
        this.parent = undefined;
    },

    setParent: function (scope) {
        if (! Class.isinstance(scope, Scope))
            throw new Error('must be a Scope instance');
        if (this.parent)
            throw new Error('parent already set');
        this.parent = scope;
    },

    _v: function (stored_name) {
        if (this.vars.hasOwnProperty(stored_name))
            return vars[stored_name];
    },

    v: function (name) {
        var stored_name = prefix + name;
        var scope = this;
        while (1) { // Avoid recursion.
            var val = scope._v(stored_name);
            if (val) return val;
            if (!scope.parent)
                throw new Error('variable "' + name + '" not found in scope');
            scope = this.getPrivate(scope.parent);
        }
    },

    define: function (name) {
        var stored_name = prefix + name;
        if (vars.hasOwnProperty(stored_name))
            throw new Error('variable "' + name + '" already exists');
        vars[stored_name] = new Variable;
    }

});
