'use strict';

exports.Class = (function (Object, WeakMap) {

    var class_info = new WeakMap;
    var instance_info = new WeakMap;
    var id_count = 0;
    var magic = {};

    var Class = function (/* optional */ Parents, members) {
        if (!members) {
            members = Parents || {};
            Parents = [];
        }
        if (!Parents)
            Parents = [];
        Object.freeze(Parents);
        Object.freeze(members);

        var F = function (m) {
            var f = {};
            var priv = Object.create(f);
            var parents = new WeakMap;
            var iinfo = {a: ancestors, p: parents, h: priv};
            instance_info.set(f, iinfo);

            for (var i = 0; i < Parents.length; ++i) {
                var Parent = Parents[i]
                var parent = new Parent(magic);
                parents.set(Parent, parent);
                Object.assign(f, parent);
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
                    f[key] = val;
            }

            if (m !== magic)
                F.init(f, arguments);

            return Object.freeze(f);
        };

        F.init = function (f, args) {
            var iinfo = instance_info.get(f);
            // If f has already been initialized, throw.
            if (iinfo.i) throw new Error('already initialized');
            iinfo.i = 1;
            // If f has an initializer, call it with arguments.
            var priv = iinfo.h;
            if (priv._init) priv._init.apply(priv, args);
            // For each parent:
            for (var i = 0; i < Parents.length; ++i) {
                // Get the parent object.
                var parent = iinfo.p.get(Parents[i]);
                // Initialize the parent object if not already initialized.
                if (!instance_info.get(parent).i)
                    Parents[i].init(parent, []);
            }
        };

        var cinfo = {I: id_count++};
        class_info.set(F, cinfo);
        var ancestors = cinfo.a = {};
        ancestors[cinfo.i] = 1;
        for (var i = 0; i < Parents.length; ++i) {
            var Parent = Parents[i];
            if (!class_info.has(Parent))
                throw new Error('parent '+i+' not a class');
            Object.assign(ancestors, class_info.get(Parent).a);
        }

        return Object.freeze(F);
    }

    Class.issubclass = function (A, B) {
        return !!(class_info.has(A)
            && class_info.has(B)
            && class_info.get(A).a[class_info.get(B).I]);
    };

    Class.isinstance = function (a, B) {
        return !!(instance_info.has(a)
            && class_info.has(B)
            && instance_info.get(a).a[class_info.get(B).I]);
    };

    return Object.freeze(Class);

})(Object, WeakMap);
