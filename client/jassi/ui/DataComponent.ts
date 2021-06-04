
import jassi from "jassi/jassi";
import {Component} from "jassi/ui/Component";
import {Databinder} from "jassi/ui/Databinder";
import {Property,  $Property } from "jassi/ui/Property";
import { $Class } from "jassi/remote/Jassi";

var tmpDatabinder = undefined;
@$Class("jassi.ui.DataComponent")
export class DataComponent extends Component {
    _autocommit: boolean;
    _databinder: Databinder;


    /**
    * base class for each Component
    * @class jassi.ui.Component
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this._autocommit = false;
    }
    /**
     * @member {bool} autocommit -  if true the databinder will update the value on every change
     *                              if false the databinder will update the value on databinder.toForm 
     */
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
     * binds a component to a databinder
     * @param {jassi.ui.Databinder} databinder - the databinder to bind
     * @param {string} property - the property to bind
     */
    @$Property({ type: "databinder" })
    bind(databinder, property) {
        this._databinder = databinder;
        if(databinder!==undefined)
            databinder.add(property, this, "onchange");
        //databinder.checkAutocommit(this);
    }
    destroy() {
        if(this._databinder!==undefined){
            this._databinder.remove(this);
            this._databinder=undefined;
        }
        super.destroy();
    }
}
