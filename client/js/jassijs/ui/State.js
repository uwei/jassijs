define(["require", "exports", "jassijs/ui/StateBinder"], function (require, exports, StateBinder_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.createComputedState = exports.ccs = exports.createState = exports.State = exports.createStates = exports.createRefs = exports.createRef = exports.foreach = exports.resolveState = void 0;
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
            if (typeof val === "object" && Array.isArray(val) === false && ((val === null || val === void 0 ? void 0 : val.forceUpdate) === undefined)) {
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
    function foreach(stateWithArray, func) {
        var retState = createState();
        //update retState on stateWithArray is changing
        var updateOB = {
            set value(ob) {
                var ret = [];
                var arr = stateWithArray.current;
                if (arr !== undefined) {
                    for (var x = 0; x < arr.length; x++) {
                        // if (ret === undefined)
                        //   ret = [];
                        var comp = func(arr[x]);
                        /*if (ob?.initial !== true) {
                            comp = createComponent(comp);
                        }*/
                        ret.push(comp);
                    }
                }
                retState.current = ret;
            }
        };
        updateOB.value = { initial: true }; //fill state
        stateWithArray._observe_(updateOB, "value");
        return retState;
    }
    exports.foreach = foreach;
    function createRef(val = undefined) {
        //var ret:Ref<T>={current:val};
        var ret = createState(val);
        return ret;
    }
    exports.createRef = createRef;
    function createRefs() {
        var ret = createStates();
        ret._onStateChanged((value, state) => {
            //here we replace the state with real value
            //@ts-ignore
            ret[state._$propertyname_] = value;
        });
        return ret;
    }
    exports.createRefs = createRefs;
    function createStates(initialValues = undefined, propertyname = undefined) {
        var data = new StateGroup(initialValues); // { _used: [], _data: initialValues };
        data._$propertyname_ = propertyname;
        return new Proxy(data, {
            get(target, key) {
                if (target[key] === undefined && key !== "data" && key !== "_comps_" && key != "_used" && key !== "bind" && key !== "current") {
                    var newstate = createStates(data.current !== undefined ? data.current[key] : undefined, key);
                    target[key] = newstate;
                    target._observe_(newstate, "_$setparentobject");
                    newstate._listener_ = [...target._listener_];
                    //newstate._observe_(target, "statechanged");
                    if (target._used.indexOf(key) === -1)
                        target._used.push(key);
                }
                return target[key];
            },
            set(target, key, value) {
                var all = Object.getOwnPropertyNames(target);
                if (key === "_$setparentobject") {
                    var propname = data._$propertyname_;
                    target.current = value[propname];
                }
                else
                    target[key] = value;
                /*            if (key === "current") {
                                target.current = value;
                            }else   if (key === "_listener_") {
                                target._listener_ = value;
                            } else
                                throw "not implemented " + key;*/
                return true;
            }
        });
    }
    exports.createStates = createStates;
    class State {
        constructor(data = undefined) {
            this.self = this;
            this._listener_ = [];
            //self: any = this;
            this._comps_ = [];
            this._used = [];
            this._$isState$_ = true;
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
            var _a;
            if (this.data === data || (Number.isNaN(data) && Number.isNaN(this.data)))
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
                if (((_a = c.ob) === null || _a === void 0 ? void 0 : _a._$isState$_) !== true && typeof c.ob.config === "function")
                    c.ob.config(newVal);
                else
                    c.ob[c.proppath[0]] = data;
            }
            var _this = this;
            if (this._listener_.length > 0) {
                this._listener_.forEach((e) => e(data, _this));
            }
        }
    }
    exports.State = State;
    function createState(val = undefined) {
        var ret = new State(); //use <>{ret}<> is possible
        ret.current = val;
        return ret;
    }
    exports.createState = createState;
    class ComputedState extends State {
        get current() {
            return this.func();
        }
        set current(data) {
            super.current = data;
        }
        set valueChanged(val) {
            this.current = this.current;
        }
    }
    class StateGroup extends State {
        // _stateChangedHandler = [];
        _onStateChanged(handler) {
            this._listener_.push(handler);
            //this._stateChangedHandler.push(handler);
        }
    }
    /**
     * shortcut for createComputedState
     */
    function ccs(func, ...consumedStates) {
        return createComputedState(func, ...consumedStates);
    }
    exports.ccs = ccs;
    /**
     * creates a state which is computed with func if one of the consumedStates are changed
     */
    function createComputedState(func, ...consumedStates) {
        var ret = new ComputedState(); //use <>{ret}<> is possible
        ret.func = func;
        consumedStates.forEach((st) => {
            if (st instanceof StateGroup) {
                st._onStateChanged((value) => {
                    //@ts-ignore
                    ret.valueChanged = undefined;
                });
                st._observe_(ret, "valueChanged");
            }
            else {
                st._observe_(ret, "valueChanged");
            }
        });
        return ret;
    }
    exports.createComputedState = createComputedState;
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
                if (key === "_observe_" || key === "_$isState$_")
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
        text: "Hallo",
        invoice: invoices[1],
        invoices: invoices
    };
    function test() {
        var k = createStates(inv);
        k.text.current = "OO";
        var ll = k.invoice.customer.current;
        var vname = k.invoice.customer.name;
        var ll2 = k.invoice.customer.name.current;
        k.invoice.current = invoices[0];
        var hhl = k.invoice.customer;
        ll = k.invoice.customer.name.current;
    }
    exports.test = test;
});
//# sourceMappingURL=State.js.map