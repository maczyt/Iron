var $el = function (select) {
    return document.querySelector(select);
};
var $els = function (select) {
    return document.querySelectorAll(select);
};
var Iron = (function () {
    function Iron(data) {
        var _this = this;
        if (data === void 0) { data = {}; }
        this.data = {};
        this.localData = {};
        this.obv = new Observe();
        this.binds = $els('i-bind');
        var keys = Object.keys(data);
        var that = this;
        keys.forEach(function (key) {
            _this.obv.on(key, function () {
                toArray(getter(key)).forEach(function (el) {
                    el.textContent = that.data[key];
                });
            });
            Object.defineProperty(_this.data, key, {
                enumerable: true,
                configurable: true,
                set: function (val) {
                    that.localData[key] = val;
                    that.obv.emit(key);
                },
                get: function () {
                    return that.localData[key];
                }
            });
            _this.data[key] = data[key];
        });
    }
    Iron.prototype.get = function (name) {
        return this.data[name];
    };
    Iron.prototype.set = function (name, val) {
        this.data[name] = val;
        return true;
    };
    return Iron;
}());
var Observe = (function () {
    function Observe() {
        this.listener = {};
    }
    Observe.prototype.emit = function (name) {
        if (typeof this.listener[name] === 'undefined')
            return;
        var subs = this.listener[name];
        subs.forEach(function (sub) {
            sub();
        });
    };
    Observe.prototype.on = function (name, fn) {
        if (typeof this.listener[name] === 'undefined') {
            this.listener[name] = [];
        }
        this.listener[name].push(fn);
    };
    Observe.prototype.off = function (name) {
        this.listener[name] = [];
    };
    return Observe;
}());
var iron = new Iron({
    name: 'zyt',
    age: 24
});
toArray($els('[i-bind]')).forEach(function (el) {
    var val = iron.get(el.getAttribute('i-bind'));
    console.log(el);
    el.textContent = val;
});
function getter(name) {
    return name ? $els("[i-bind=\"" + name + "\"]") : $els('[i-bind]');
}
function toArray(array) {
    return [].slice.call(array);
}
