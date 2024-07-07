define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createRef = exports.createState = exports.State = exports.createRefs = exports.createStates = exports.resolveState = void 0;
    class StateProp {
    }
    //window.timecount=0;
    function _resolve(ob, props, path, recurseCount) {
        if (recurseCount > 3)
            return;
        for (var key in props) {
            var val = props[key];
            if (val instanceof State) {
                props[key] = val.current;
                val._comps_.push({ ob: ob, proppath: [...path, key] });
                continue;
            }
            if (typeof val === "object" && Array.isArray(val) === false && ((val === null || val === void 0 ? void 0 : val._rerenderMe) === undefined)) {
                _resolve(ob, val, [...path, key], recurseCount++);
            }
        }
    }
    function resolveState(ob, config) {
        var test = new Date().getTime();
        _resolve(ob, config, [], 0);
        //window.timecount=window.timecount+new Date().getTime()-test;
    }
    exports.resolveState = resolveState;
    function createStates(initialValues = {}) {
        var data = { _used: [], _data: initialValues };
        return new Proxy(data, {
            get(target, key) {
                if (key === "_onconfig")
                    return target._onconfig;
                if (target[key] === undefined) {
                    target[key] = createState(data._data[key]);
                    if (target._used.indexOf(key) === -1)
                        target._used.push(key);
                }
                return target[key];
            },
            set(target, key, value) {
                if (key === "_onconfig")
                    target._onconfig = value;
                else
                    throw "not implemented " + key;
                return true;
            }
        });
    }
    exports.createStates = createStates;
    function createRefs(data = {}) {
        var me = {};
        var ret = new Proxy(me, {
            get(target, key) {
                if (target[key] === undefined) {
                    target[key] = {
                        _current: undefined,
                        set current(value) {
                            data[key] = value;
                            this._current = value;
                        },
                        get current() {
                            return this._current;
                        }
                    };
                }
                return target[key];
            }
        });
        return ret;
    }
    exports.createRefs = createRefs;
    class State {
        constructor(data = undefined) {
            this.self = this;
            this._comps_ = [];
            this.data = data;
        }
        _observe_(control, property, atype) {
            this._comps_.push({ ob: control, proppath: [property] });
        }
        get current() {
            return this.data;
        }
        set current(data) {
            if (this.data === data)
                return;
            this.data = data;
            for (var x = 0; x < this._comps_.length; x++) {
                var c = this._comps_[x];
                var newVal = {};
                var cur = newVal;
                for (var y = 0; y < c.proppath.length; y++) {
                    var prop = c.proppath[y];
                    cur[prop] = {};
                    if (y == c.proppath.length - 1) {
                        cur[prop] = data;
                    }
                    else
                        cur = cur[prop];
                }
                c.ob.config(newVal);
                /* if (c.atype === "style") {
                     //for (var key in (<any>props).style) {
                     //var val = (<any>props).style[key];
                     ob.dom.style[prop] = data;
                     //}
                 }else    if (c.atype === "dom") {
                     Reflect.set(ob.dom, prop, data);
                 }else     if (c.atype === "attribute") {
     
                     ob.dom.setAttribute(prop, data);
                 }else{
                     Reflect.set(ob,prop,data);
                 }*/
                /*else if (prop in this.dom) {
                           Reflect.set(this.dom, prop, [props[prop]])
                       } else if (prop.toLocaleLowerCase() in this.dom) {
                           Reflect.set(this.dom, prop.toLocaleLowerCase(), props[prop])
                       } else if (prop in this.dom)
                       this.dom.setAttribute(prop, (<any>props)[prop]);*/
            }
        }
    }
    exports.State = State;
    function createState(val = undefined) {
        var ret = new State();
        ret.current = val;
        return ret;
    }
    exports.createState = createState;
    function createRef(val = undefined) {
        var ret;
        ret.current = val;
        return ret;
    }
    exports.createRef = createRef;
    function test() {
        var me = { a: 6 };
        var refs = createRefs(me);
        refs.hallo.current = "JJJ";
        console.log(me.hallo);
    }
    exports.test = test;
});
//# sourceMappingURL=State.js.map