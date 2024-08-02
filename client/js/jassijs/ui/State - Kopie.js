define(["require", "exports", "jassijs/ui/StateBinder"], function (require, exports, StateBinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createState = exports.State = exports.createClientState = exports.createStates = exports.resolveState = void 0;
    var teset = new StateBinder_1.StateDatabinder();
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
    function createClientState(parentState) {
        var data = {
            $parentState: parentState
        };
        return new Proxy(data, {
            get(target, key) {
                if (key === "current")
                    return data === null || data === void 0 ? void 0 : data.$parentState.current;
                if (target[key] === undefined) {
                    var pdata = data === null || data === void 0 ? void 0 : data.$parentState.current;
                    var newstate = createState(pdata === undefined ? undefined : pdata[key]);
                    newstate.pppp = 19;
                    data === null || data === void 0 ? void 0 : data.$parentState._observe_(newstate, key);
                    var nc = createClientState(newstate);
                    target[key] = nc; //createState(data._data[key]);
                }
                return target[key];
            },
            set(target, prop, value) {
                debugger;
                target[prop].current = value;
                return true;
            }
        });
    }
    exports.createClientState = createClientState;
    class State {
        constructor(data = undefined) {
            this.self = this;
            this.props = createClientState(this);
            this._comps_ = [];
            this.bind = createBoundProperty(this);
            this.data = data;
        }
        _observe_(control, property, atype = undefined) {
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
                if (c.ob.config)
                    c.ob.config(newVal);
                else
                    c.ob[c.proppath[0]] = data;
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
    function createBoundProperty(state = undefined, parent = undefined, propertyname = "this") {
        var data = {
            _databinder: (parent === undefined ? new StateBinder_1.StateDatabinder() : parent._databinder),
            _propertyname: propertyname,
            $fromForm() { return this._databinder.fromForm(); },
            $toForm() { return this._databinder.toForm(); }
        };
        if (state)
            data._databinder.connectedState = state;
        var ret = new Proxy(data, {
            get(target, key) {
                if (key === "_observe_")
                    return undefined;
                if (target[key] === undefined) {
                    var pname = key;
                    if (target._propertyname !== "this") {
                        pname = target._propertyname + "." + key;
                    }
                    target[key] = createBoundProperty(undefined, ret, pname);
                }
                return target[key];
            },
            set(target, key, value) {
                if (key === "_propertyname") {
                    target[key] = value;
                    return true;
                }
                throw "not implemented " + key;
            }
        });
        if (state !== undefined) {
            state._observe_(data._databinder, "value", "property");
        }
        return ret;
    }
    var j = {};
    var invoices = [
        {
            title: "R1",
            customer: {
                id: 1,
                name: "Meier"
            },
            positions: [{ id: 1, text: "P1" }, { id: 2, text: "P2" }]
        },
        {
            title: "R2",
            customer: {
                id: 2,
                name: "Lehmann"
            },
            positions: [{ id: 3, text: "P3" }, { id: 4, text: "P4" }]
        },
        {
            title: "R3",
            customer: {
                id: 3,
                name: "Schulze"
            },
            positions: [{ id: 6, text: "P6" }, { id: 6, text: "P6" }]
        },
    ];
    var inv = {
        invoice: invoices[1],
        invoices: invoices
    };
    function test() {
        var k = createStates(inv);
        var ll = k.invoice.props.customer.current;
        debugger;
        var vname = k.invoice.props.customer.name;
        var ll2 = k.invoice.props.customer.name.current;
        debugger;
        k.invoice.current = invoices[0];
        var hhl = k.invoice.props.customer;
        ll = k.invoice.props.customer.name.current;
    }
    exports.test = test;
});
//# sourceMappingURL=State%20-%20Kopie.js.map