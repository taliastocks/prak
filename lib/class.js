'use strict';


var counter = (function () {
    var val = 0;
    return function () {
        return val++;
    };
})();
var Base = Object.freeze(function () {});
var magic = {};


function Class (/* optional */ Parents, members) {
    if (members === undefined) {
        members = Parents || {};
        Parents = undefined;
    }

    if (Parents === undefined)
        Parents = [];

    var ancestors = {};
    for (var i = 0; i < Parents.length; ++i) {
        var Parent = Parents[i];
        if (! Parent.prototype instanceof Base)
            throw new Error('Parent must be a Class');
        ancestors[Parent._id] = true;
        var p_ancestors = Parent._getInternal(magic).ancestors;
        var keys = Object.keys(p_ancestors);
        for (var j = 0; j < keys.length; ++j)
            ancestors[keys[i]] = true;
    }

    var internal = {
        ancestors: ancestors
    };

    var F = function () {
        var that = {};
        var priv = Object.create(that);
        var parents = {};

        for (var i = 0; i < Parents.length; ++i) {
            var Parent = Parents[i];
            var parent = new Parent;
            var keys = Object.keys(parent);
            for (var j = 0; j < keys.length; ++j) {
                var key = keys[j];
                that[key] = parent[key];
            }
            parents[Parent._id] = Parent;
        }

        var keys = Object.keys(members);
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var val = members[key];
            if (typeof val === 'function')
                val = val.bind(priv);
            if (key[0] === '_')
                priv[key] = val;
            else
                that[key] = val;
        }

        if (priv._init) priv._init();

        that._class = F;
        that._instanceof = function (cls) {
            return cls === F || F._subclassof(cls);
        };

        that._getPrivate = function (m, id) {
            if (m !== magic)
                throw new Error('no permission to access private');
            if (id === F.id)
                return priv;
            if (parents[id])
                return parents[id];
            throw new Error('should never get here');
        };

        priv.getPrivate = function (other) {
            if (! other instanceof Base)
                throw new Error('not a Class instance');
            if (! Class.isinstance(other, F))
                throw new Error('not an instance');
            return other._getPrivate(magic, F._id);
        };

        return Object.freeze(that);
    };

    F.prototype = new Base;
    F._getInternal = function (m) {
        if (m !== magic)
            throw new Error('no permission to access internal');
        return internal;
    };
    F._id = counter();
    F._subclassof = function (B) {
        if (! B.prototype instanceof Base)
            return false;
        return !!ancestors[B._id];
    };

    return Object.freeze(F);
};


Class.issubclass = function (A, B) {
    if (! A.prototype instanceof Base)
        return false;
    return A._subclassof(B);
};


Class.isinstance = function (a, B) {
    if (! a instanceof Base)
        return false;
    return a._instanceof(B);
};


exports.Class = Object.freeze(Class);
