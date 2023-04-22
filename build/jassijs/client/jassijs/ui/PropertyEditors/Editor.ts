import {Property} from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import {PropertyEditor} from "jassijs/ui/PropertyEditor";
import registry from "jassijs/remote/Registry";

export function $PropertyEditor(supportedtypes:string[]):Function{
    return function(pclass){
        registry.register("$PropertyEditor",pclass,supportedtypes);
    }
}
@$Class("jassijs.ui.PropertyEditors.Editor")
export  class Editor {
    component;
    _ob;
    property:Property;
    propertyEditor:PropertyEditor;
    _eventHandler;

    /**
    * Editor for number and string 
    * used by PropertyEditor
    * @class jassijs.ui.PropertyEditors.DefaultEditor
    */
    constructor(property, propertyEditor) {
        /** @member - the renedering component **/
        this.component = undefined;
        /** @member - the edited object */
        this._ob = undefined;
        /** @member {string} - the name of the variable */
        /** @member {jassijs.ui.Property} - the property to edit */
        this.property = property;
        /** @member {jassijs.ui.PropertEditor} - the PropertyEditor instance */
        this.propertyEditor = propertyEditor;
        /** @member {Object.<string,function>} - all event handlers*/
        this._eventHandler = {};
    }
    /**
     * adds an event
     * @param {type} name - the name of the event
     * @param {function} func - callfunction for the event
     */
    addEvent(name, func) {
        var events = this._eventHandler[name];
        if (events === undefined) {
            events = [];
            this._eventHandler[name] = events;
        }
        events.push(func);
    }
    /**
     * call the event
     * @param {name} name - the name of the event
     * @param {object} param 1- parameter for the event
     * @param {object} param 2- parameter for the event
     * @param {object} param 3- parameter for the event
     */
    callEvent(name, param1=undefined, param2=undefined, param3=undefined) {
        var events = this._eventHandler[name];
        if (events === undefined)
            return;
        if (name === "edit") {
            if (param1 === undefined)
                param1 = {};
            param1.property = this.property.name;
        }
        for (var x = 0; x < events.length; x++) {
            events[x](param1, param2, param3);
        }
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        this._ob = ob;
    }
    get ob() {
        return this._ob;
    }

    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return undefined;
    }
    /**
     * called on value changes
     * @param handler - function(oldValue,newValue)
     */
    onedit(handler) {
        this.addEvent("edit", handler);

    }
    destroy() {
        if (this.component !== undefined) {
            this.component.destroy();
        }
    }

}
