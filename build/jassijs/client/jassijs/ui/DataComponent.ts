
import { Component, ComponentConfig } from "jassijs/ui/Component";
import { Databinder } from "jassijs/ui/Databinder";
import { Property, $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";

export interface DataComponentConfig extends ComponentConfig {
    /**
        * binds a component to a databinder
        * @param [{jassijs.ui.Databinder} databinder - the databinder to bind,
        *         {string} property - the property to bind]
        */
    bind?: any[];
    /**
   * @member {bool} autocommit -  if true the databinder will update the value on every change
   *                              if false the databinder will update the value on databinder.toForm 
   */
    autocommit?: boolean;
    value?: any;
}

var tmpDatabinder = undefined;
@$Class("jassijs.ui.DataComponent")
export class DataComponent extends Component implements DataComponentConfig {
    _autocommit: boolean;
    _databinder: Databinder;


    /**
    * base class for each Component
    * @class jassijs.ui.Component
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this._autocommit = false;
    }
    config(config: DataComponentConfig): DataComponent {
        super.config(config);
        return this;
    }
    @$Property()
    get autocommit(): boolean {
        return this._autocommit;
    }
    set autocommit(value: boolean) {
        this._autocommit = value;
        //if (this._databinder !== undefined)
        //    this._databinder.checkAutocommit(this);
    }
    /**
     * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
     */
    @$Property({ type: "databinder" })
    set bind(databinder: any[]) {
        if(databinder===undefined){
            if(this._databinder!==undefined){
                this._databinder.remove(this);
                this._databinder=undefined;
            }
            return;
        }
        var property = databinder[1];
        this._databinder = databinder[0];
        if (this._databinder !== undefined)
            this._databinder.add(property, this, "onchange");
    }


    destroy() {
        if (this._databinder !== undefined) {
            this._databinder.remove(this);
            this._databinder = undefined;
        }
        super.destroy();
    }
}
