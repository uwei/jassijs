
import { Component, ComponentProperties } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { StateDatabinder } from "jassijs/ui/StateBinder";
import { BoundProperty } from "jassijs/ui/State";


export interface DataComponentProperties extends ComponentProperties {
    /**
        * binds a component to a databinder
        * @param [{jassijs.ui.Databinder} databinder - the databinder to bind,
        *         {string} property - the property to bind]
        */
  
    bind?: any[]|BoundProperty;
    
    /**
   * @member {bool} autocommit -  if true the databinder will update the value on every change
   *                              if false the databinder will update the value on databinder.toForm 
   */
    autocommit?: boolean;
    value?: any;
}

var tmpDatabinder = undefined;
@$Class("jassijs.ui.DataComponent")
export class DataComponent<T extends DataComponentProperties=DataComponentProperties> extends Component<T> implements DataComponentProperties {
    _autocommit: boolean;
    private _boundProperty:BoundProperty;

    /**
    * base class for each Component
    * @class jassijs.ui.Component
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties:DataComponentProperties={}) {//id connect to existing(not reqired)
        super(properties);
        this._autocommit = false;
    }
   
    

    get autocommit(): boolean {
        return this._autocommit;
    }
    @$Property({ type: "databinder" })
    set autocommit(value: boolean) {
        this._autocommit = value;
        //if (this._databinder !== undefined)
        //    this._databinder.checkAutocommit(this);
    }
    get bind(){
        return this._boundProperty;
    }
    /**
     * @param [databinder:jassijs.ui.Databinder,"propertyToBind"]
     */
    @$Property({ type: "databinder" })
     set bind(boundProperty: BoundProperty) {
        this._boundProperty=boundProperty;
        if(boundProperty===undefined){
            if(boundProperty._databinder!==undefined){
                boundProperty._databinder.remove(this);
            }
            return;
        }
        var property = boundProperty._propertyname;
        if (this._boundProperty !== undefined)
            this._boundProperty._databinder.add(property, this, "onchange");
    }

  /*  rerender(){
         if (this._databinder !== undefined) {
            this._databinder.remove(this);
            this._databinder = undefined;
        }
        super.rerender();
    }*/
    destroy() {
        if(this._boundProperty?._databinder!==undefined){
            this._boundProperty?._databinder.remove(this);
        }
        super.destroy();
    }
}
