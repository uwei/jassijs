import { PropertyAccessor, StateDatabinder } from "jassijs/ui/StateBinder";
import { createComponent } from "jassijs/ui/Component";

var teset = new StateDatabinder()

class StateProp {
    ob;
    proppath: string[];

}
//window.timecount=0;
function _resolve(ob, props, path: string[], recurseCount) {
    if (recurseCount > 3)
        return;
    for (var key in props) {
        var val = props[key];

        if (val instanceof State) {
            props[key] = val.current;
            val._comps_.push({ ob: ob, proppath: [...path, key] });
            continue;
        }
        if (typeof val === "object" && Array.isArray(val) === false && (val?._rerenderMe === undefined)) {
            _resolve(ob, val, [...path, key], recurseCount++)
        }
    }
}
export function resolveState(ob, config) {
    var test = new Date().getTime();
    _resolve(ob, config, [], 0);
    //window.timecount=window.timecount+new Date().getTime()-test;
}
interface P {
    t1: string;
    st1: State<any>;
}

export function foreach(stateWithArray: { current: any[] }, func: (ob) => any): State<React.ReactElement> {

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
    }
    updateOB.value = { initial: true };//fill state
    (<any>stateWithArray)._observe_(updateOB, "value");

    return <any>retState;
}


export type States<T> = { [Property in keyof T]: States<T[Property]> & { bind?: BoundProperty<T[Property]> } } & { current: T, _used?: string[], _onconfig?: (props) => void, _onStateChanged?: (handler: (value) => void) => void };
export function createStates<T>(initialValues: T = undefined, propertyname: string = undefined): States<T> {
    var data: any = new StateGroup(initialValues);// { _used: [], _data: initialValues };
    data._$propertyname_ = propertyname;
    
    return new Proxy(data as any, {
        get(target: State, key: string) {

            if (key === "_onconfig")
                return target._onconfig;
            if (target[key] === undefined && key !== "data" && key !== "_comps_" && key != "_used" && key !== "bind" && key !== "current" && key !== "statechanged") {
                var newstate: State = <any>createStates(data.current !== undefined ? data.current[key] : undefined, key);

                target[key] = newstate;
                target._observe_(newstate, "_$setparentobject");
                newstate._observe_(target, "statechanged");
                if (target._used.indexOf(key) === -1)
                    target._used.push(key);
            }
            return target[key];
        },
        set(target, key: string, value) {
            var all = Object.getOwnPropertyNames(target);

            if (key === "_$setparentobject") {
                var propname: string = data._$propertyname_;
                target.current = value[propname];
            }
            else if (key === "_onconfig")
                target._onconfig = value;
            else if (key === "current") {
                target.current = value;
            } else if (key === "statechanged") {
                target.statechanged = value;
            } else
                throw "not implemented " + key;
            return true;
        }
    });
}
export type OnlyType<T, D> = { [K in keyof T as  T[K] extends D ? K : never]: T[K] };
export type DropType<T, D> = { [K in keyof T as  T[K] extends D ? never : K]: T[K] };
export type GroupState<T> = DropType<T, State> & { readonly refs: { readonly [Property in keyof DropType<T, State>]-?: any } } &
{ readonly states: { readonly [Property in keyof OnlyType<T, State>]-?: T[Property] } }

type ClientState<T> = { [K in keyof T]: ClientState<T[K]> & { current: State<T> } };
export class State<T = {}> {
    protected data?;
    self:any=this;
    _listener_ = [];
    //self: any = this;
    _comps_?: StateProp[] = [];
    _used?: string[] = [];
    _$isState$_? = true;
    constructor(data = undefined) {
        this.data = data;
    }

    _observe_?(control, property, atype = undefined) {
        this._comps_.push({ ob: control, proppath: [property] });
    }
    bind?: BoundProperty<T> = createBoundProperty(this);
    get current(): T {
        return this.data;
    }

    set current(data: T) {
        if (this.data === data||(Number.isNaN(data)&&Number.isNaN(this.data)))
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
                } else
                    cur = cur[prop];

            }
            if (c.ob?._$isState$_ !== true && typeof c.ob.config === "function")
                c.ob.config(newVal);
            else
                c.ob[c.proppath[0]] = data;
        }

    }
}
export function createState<T>(val: T = undefined):State<T> {
    var ret: (T & State<T>) = <any>new State<T>();//use <>{ret}<> is possible
    ret.current = val;
    return ret;
}
class ComputedState<T> extends State<T> {
    func: () => T;

    get current(): T {
        return this.func();
    }
    set current(data: T) {
        super.current = data;
    }
    private set valueChanged(val) {

        this.current = this.current;
    }
}
class StateGroup<T> extends State<T> {
    _stateChangedHandler = [];
    _onStateChanged(handler: (value) => void) {
        this._stateChangedHandler.push(handler);
    }

    set statechanged(value) {
        this._stateChangedHandler.forEach((e) => e(value));
        //this.stateHasChanged();
    }
}
/**
 * shortcut for createComputedState
 */
export function ccs<T>(func: () => T, ...consumedStates: (States<{}> | State)[]) {
    return createComputedState(func,...consumedStates);
}
/**
 * creates a state which is computed with func if one of the consumedStates are changed
 */
export function createComputedState<T>(func: () => T, ...consumedStates: (States<{}> | State)[]) {
    var ret: T & ComputedState<T> = <any>new ComputedState<T>();//use <>{ret}<> is possible
    ret.func = func;
    consumedStates.forEach((st) => {
        if (st instanceof StateGroup) {

            st._onStateChanged((value) => {
                //@ts-ignore
                ret.valueChanged = undefined;
            });
             (<State>st)._observe_(ret, "valueChanged");
        } else {
            (<State>st)._observe_(ret, "valueChanged");
           
        }
    });
    return ret;
}


export type BoundProperty<T = {}> = { $fromForm: () => T } & { $toForm: () => any } & { [Property in keyof T]: BoundProperty<T[Property]> } & { _databinder: StateDatabinder } & { _propertyname: string };

function createBoundProperty<T>(state: State = undefined, parent: BoundProperty<any> = undefined, propertyname: string = "this"): BoundProperty<T> {
    var data: any = {
        _databinder: (parent === undefined ? new StateDatabinder() : parent._databinder),
        _propertyname: propertyname,
        $fromForm() { return this._databinder.fromForm() },
        $toForm() { return this._databinder.toForm() }
    };
    if (state)
        data._databinder.connectedState = state;
    var ret = new Proxy(data as any, {
        get(target, key: string) {
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
        set(target, key: string, value) {
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
interface Invoice {
    title?: string;
    customer?: Customer;
    positions?: Position[];
}
interface Customer {
    name: string;
    id: number;
}
interface Position {
    id?: number;
    text?: string;
}
interface Props2 {
    text?: string;
    invoice?: Invoice;
    invoices?: Invoice[];
    currentPosition?: Position;
}
var j: Props2 = {};
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
var inv: Props2 = {
    text: "Hallo",
    invoice: invoices[1],
    invoices: invoices
};
export function test() {
    var k = createStates(inv);

    k.text.current = "OO";
    var ll: any = k.invoice.customer.current;

    var vname: string = k.invoice.customer.name;
    var ll2: any = k.invoice.customer.name.current;

    k.invoice.current = invoices[0];

    var hhl = k.invoice.customer;
    ll = k.invoice.customer.name.current;

}

