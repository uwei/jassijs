
import { db, TypeDef } from "jassijs/remote/Database";
import { ValidationError } from "jassijs/remote/Validator";
import { notify } from "jassijs/ui/Notify";
import { State } from "jassijs/ui/State";


type Component = {
    __dom?: HTMLElement
}
export class StateDatabinder {
    connectedState: State;
    components: Component[];
    private _properties: string[];
    private _getter: { (comp: Component): any; }[];
    private _setter: { (comp: Component, value: any): any; }[];
    private _onChange: string[];
    private _autocommit: any[];
    //userObject;
    rollbackObject;
    constructor() {//id connect to existing(not reqired)

        // super.init('<span class="InvisibleComponent"></span>');
        /** @member {[jassijs.ui.Component]} components - all binded components*/
        this.components = [];
        /** @member {[string]} properties - all binded properties*/
        this._properties = [];
        /** @member [[function]] getter - all functions to get the component value*/
        this._getter = [];
        /** @member [[function]] setter - all functions to set the component value*/
        this._setter = [];
        /** @member {[function]} onChange - changeHandler for all components used for autocommit*/
        this._onChange = [];
        /** @member {[function]} autocommit - autocommitHandler for all components*/
        this._autocommit = [];
    }

    /**
    * binds the component to the property of the userObject
    * @param {string} property - the name of the property to bind
    * @param {jassijs.ui.Component} component - the component to bind
    * @param {string} [onChange] - functionname to register the  changehandler - if missing no autocommit is possible
    * @param {function} [getter] - function to get the value of the component - if missing .value is used
    * @param {function} [setter] - function to put the value of the component - if missing .value is used
    */
    add(property, component, onChange = undefined, getter = undefined, setter = undefined) {//add a component to the container
        this.remove(component);
        this.components.push(component);
        this._properties.push(property);
        if (getter === undefined) {
            this._getter.push(function (component: Component) {
                return component["value"];
            });
        } else
            this._getter.push(getter);

        if (setter === undefined) {
            this._setter.push(function (component, value) {
                component["value"] = value;
            });
        } else
            this._setter.push(setter);

        if (onChange === undefined) {
            this._onChange.push(component["onChange"]);
        } else
            this._onChange.push(onChange);
        var ob=this.connectedState?.current;
        if (ob !== undefined) {
            var acc = new PropertyAccessor();
            acc.userObject = ob;
            let setter = this._setter[this._setter.length - 1];
            acc.setProperty(setter, component, property, undefined);
            acc.finalizeSetProperty();
        }
        let _this = this;
        if (component[this._onChange[this._onChange.length - 1]]) {
            component[this._onChange[this._onChange.length - 1]]((event) => {
                _this.componentChanged(component, property, event)
            });
        }
        // this._autocommit.push(undefined);
    }
    componentChanged(component, property, event) {
        let pos = this.components.indexOf(component);
        if (component.autocommit) {

            this._fromForm(pos);
        }
        var val = this._getter[pos](this.components[pos]);//this._getter[pos](this.components[pos]);
        //synchronize the new object to all the other components
        for (let x = 0; x < this.components.length; x++) {

            var test = this._getter[x](this.components[x]);

            if (this._properties[x] === property && test != val && this.components[x] !== component) {

                this._setter[x](this.components[x], val);

            }

        }
        //set nested Properties
        for (let x = 0; x < this.components.length; x++) {
            if (this._properties[x].startsWith(property + ".") && this.components[x] !== component) {
                this._toForm(x);
            }
        }
        if (property === "this" && this.connectedState) {
            this.connectedState.current = val;
        }
    }
    remove(component) {
        for (var x = 0; x < this.components.length; x++) {
            if (this.components[x] === component) {
                this.components.splice(x, 1);
                this._properties.splice(x, 1);
                this._getter.splice(x, 1);
                this._setter.splice(x, 1);
                this._onChange.splice(x, 1);
                this._autocommit.splice(x, 1);
            }
        }
    }
    /**
     * defines getter and setter and connect this to the databinder 
     * @param {object} object - the object where we define the property 
     * @param {string} propertyname - the name of the property
     **/
    definePropertyFor(object, propertyname) {
        var _this = this;
        Object.defineProperty(object, propertyname, {
            get: function () { return _this.value; },
            set: function (newValue) {
                if (newValue !== undefined && newValue.then !== undefined) {
                    newValue.then(function (ob2) {
                        _this.value = ob2;
                    });
                } else
                    _this.value = newValue;

            },
            enumerable: true,
            configurable: true
        });
    }
    /**
     * @member {object} value - the binded userobject - call toForm on set
     */
    get value() {
        // this.fromForm();
        return this.connectedState?.current;
    }
    set value(obj:any) {
        var _this = this;
        if (obj !== undefined && obj?.then !== undefined) {
            obj.then(function (ob2) {
                _this.toForm(ob2);
            });
        } else
            this.toForm(obj);
    }

    async doValidation(ob) {
        var allErr = [];
        if (ob.validate) {
            for (var c = 0; c < this.components.length; c++) {
                var comp = this.components[c];
                comp.__dom.classList.remove("invalid");

            }
            var validationerrors: ValidationError[] = await ob.validate();
            for (var x = 0; x < validationerrors.length; x++) {
                var err = validationerrors[x];
                for (var c = 0; c < this.components.length; c++) {
                    var comp = this.components[c];
                    var prop = this._properties[c];
                    if (err.property === prop) {
                        //@ts-ignore
                        $(comp.__dom).notify(err.message, { position: 'bottom left', className: 'error' });
                        comp.__dom.classList.add("invalid");
                        //(<any>comp.__dom).setCustomValidity(err.message);
                        //(<any>comp.__dom).reportValidity();
                        allErr.push(err.message);
                        break;
                    }
                }
            }
            if (validationerrors.length > 0) {
                notify(allErr.join("\r\n"), "error", { position: "bottom right" });
                return false;
            }
        }
        return true;
    }
    private _toForm(x, setter=undefined) {
        var fin=false;
        var ob=this.connectedState.current;
        if(setter===undefined){
            setter = new PropertyAccessor();
            setter.userObject = ob;
            fin=true;
        }

        var comp = this.components[x];
        var prop = this._properties[x];
        var sfunc = this._setter[x];
        var sget = this._getter[x];
        var oldValue = sget(comp);
        if (prop === "this") {
            if (oldValue !== ob) {
                sfunc(comp, ob);
            }
        } else {
            if (ob === undefined) {
                if (oldValue !== undefined)
                    sfunc(comp, undefined);
            } else {

                setter.setProperty(sfunc, comp, prop, oldValue);

            }
        }
        if(fin){
            setter.finalizeSetProperty();
        }
    }
    /**
     * binds the object to all added components
     * @param {object} obj - the object to bind
     */
    toForm(obj) {
        if(this.connectedState.current !== obj)
            this.connectedState.current = obj;
        var setter = new PropertyAccessor();
        setter.userObject =this.connectedState.current;
        for (var x = 0; x < this.components.length; x++) {
            this._toForm(x,setter);
        }
        setter.finalizeSetProperty();
    }
    async validateObject() {

    }
    /**
     * gets the objectproperties from all added components
     * @return {object}
     */
    async fromForm(): Promise<object> {
        this.rollbackObject = {};
        var ob=this.connectedState.current;
        if (ob === undefined)
            return undefined;
        for (var x = 0; x < this.components.length; x++) {
            this._fromForm(x);
        }
        if (!await this.doValidation(ob)) {//rollback
            for (var x = 0; x < this.components.length; x++) {
                var prop = this._properties[x];
                new PropertyAccessor().setNestedProperty(ob, prop, this.rollbackObject[prop]);
            }
            return undefined;
        }
        return ob;
    }

    /**
     * get objectproperty
     * @param {number} x - the numer of the component
     */
    private _fromForm(x) {
        if (this.rollbackObject === undefined)
            this.rollbackObject = {};
        var comp = this.components[x];
        var prop = this._properties[x];
        var sfunc = this._getter[x];
        var ob=this.connectedState.current;

        var test = sfunc(comp);
        if (test !== undefined) {
            if (prop === "this") {
                var val = test;
                if(this.value!==test)
                    this.value = test;
            } else {
                // if (comp["converter"] !== undefined) {
                //     test = comp["converter"].stringToObject(test);
                // }
                this.rollbackObject[prop] = new PropertyAccessor().getNestedProperty(ob, prop);
                new PropertyAccessor().setNestedProperty(ob, prop, test);
            }
        }
    }
    /**
     * register the autocommit handler if needed
     * @param {jassijs.ui.DataComponent} component
     */
    /* checkAutocommit(component){
         if(component.autocommit!==true)
             return;
         var pos=this.components.indexOf(component);
         if(this._autocommit[pos]!==undefined)
             return;
         var onchange=this._onChange[pos];
         if(onchange===undefined)
             return;
         var _this=this;
         this._autocommit[pos]=function(){
             pos=_this.components.indexOf(component);
             _this._fromForm(pos);
         };
         component[onchange](this._autocommit[pos]);
     }*/
    destroy() {

        this.components = [];
        this._properties = [];
        this._getter = [];
        this._setter = [];
        this._onChange = [];
        this._autocommit = [];
        this.connectedState = undefined;

    }
}
export class PropertyAccessor {
    relationsToResolve: string[] = [];
    userObject;
    todo: any[] = [];
    getNestedProperty(obj, property: string) {
        if (obj === undefined||obj===null)
            return undefined;
        var path = property.split(".");
        var ret = obj[path[0]];
        if (ret === undefined)
            return undefined;
        if (path.length === 1)
            return ret;
        else {
            path.splice(0, 1);
            return this.getNestedProperty(ret, path.join("."));
        }
    }
    setNestedProperty(obj, property: string, value) {
        var path = property.split(".");
        path.splice(path.length - 1, 1);
        var ob = obj;
        if (path.length > 0)
            ob = this.getNestedProperty(ob, path.join("."));
        ob[property.split(".")[property.split(".").length - 1]] = value;
    }
    /**
     * check if relation must be resolved and queue it
     */
    private testRelation(def: TypeDef, property: string, propertypath: string, setter, comp: Component) {
        var rel = def?.getRelation(property);
        var ret = false;
        if (this.getNestedProperty(this.userObject, propertypath) !== undefined)
            return ret;//the relation is resolved
        if (rel) {
            //the relation should be resolved on finalize
            if (this.relationsToResolve.indexOf(propertypath) === -1)
                this.relationsToResolve.push(propertypath);
            ret = true;
        }
        if (setter && (propertypath.indexOf(".") > -1 || ret))
            this.todo.push(() => setter(comp, this.getNestedProperty(this.userObject, propertypath)));
        return ret;
    }
    /**
     * set a nested property and load the db relation if needed
     */
    setProperty(setter, comp: Component, property: string, oldValue) {
        var _this = this;
        var propValue = this.getNestedProperty(this.userObject, property);
        if (oldValue !== propValue) {
            setter(comp, propValue);
        }
        let path = property.split(".");
        let currenttype = this.userObject.constructor;
        var def = db.getMetadata(currenttype);
        if (def !== undefined) {
            let propertypath = "";
            for (let x = 0; x < path.length; x++) {
                propertypath += (propertypath === "" ? "" : ".") + path[x];
                this.testRelation(def, path[x], propertypath, path.length - 1 === x ? setter : undefined, comp);
                currenttype = def.getRelation(path[x])?.oclass;
                if (currenttype === undefined)
                    break;
                def = db.getMetadata(currenttype);
            }
        }

    }
    async finalizeSetProperty() {
        if (this.relationsToResolve.length > 0) {
            await this.userObject.constructor.findOne({ onlyColumns: [], id: this.userObject.id, relations: this.relationsToResolve })
        }
        this.todo.forEach((func) => {
            func();
        })
    }
}
// return CodeEditor.constructor;
