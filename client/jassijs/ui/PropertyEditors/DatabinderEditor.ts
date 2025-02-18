import { Editor, $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import { $Class } from "jassijs/remote/Registry";
import { Textbox } from "jassijs/ui/Textbox";
import { Component, FunctionComponent } from "jassijs/ui/Component";
import { BoundProperty } from "jassijs/ui/State";



@$PropertyEditor(["databinder"])
@$Class("jassijs.ui.PropertyEditors.DatabinderEditor")
export class DatabinderEditor extends Editor {
    foundBounds: {
        [key: string]: BoundProperty
    } = {};
    foundFunctionComponents: {
        [key: string]: boolean
    }={};
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Textbox();//Select();
        this.component.width = "100%";
        var _this = this;
        this.component.onchange(function (param) {
            _this._onchange(param);
        });
    }
    private collectStates(comp: Component, found: string[]) {
        var keys = [...comp.dom._this.states._used];
        for (var k in comp.dom._this.props) {
            keys.push(k);
        }
        for (var x = 0; x < keys.length; x++) {
            var prop = keys[x];
            var ob = comp.dom._this.states[prop].current;

            if (found.indexOf(prop) === -1) {
                found.push(prop);
                this.foundBounds[prop] = comp.dom._this.states[prop].bind;
                if (comp.dom._this instanceof FunctionComponent)
                    this.foundFunctionComponents[prop] = true;
            }
            if (ob) {
                for (var key in ob) {
                    if (found.indexOf(prop + "." + key) === -1) {
                        found.push(prop + "." + key);
                        if (comp.dom._this instanceof FunctionComponent)
                            this.foundFunctionComponents[prop + "." + key] = true;
                        this.foundBounds[prop + "." + key] = comp.dom._this.states[prop].bind[key];
                    }
                }
            }
        }
        if (comp._parent)
            this.collectStates(comp._parent, found);
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value: string = this.propertyEditor.getPropertyValue(this.property);
        if (value !== undefined) {
            if (value.startsWith("this."))
                value = value.substring(5);
            if (value.startsWith("states."))
                value = value.substring(7);
            value = value.replace(".bind.", ".");
            this.component.value = value;

        } else {
            this.component.value = "";
        }


        var comps = [];
        this.foundBounds = {};
        this.foundFunctionComponents={};
        this.collectStates(this._ob._parent, comps);
        //TODO call this on focus
        /*var binders = this.propertyEditor.getVariablesForType(Databinder);
        if (binders !== undefined) {
            var comps = [];
            for (var x = 0; x < binders.length; x++) {
                var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                if (binder === undefined)
                    continue;
                let ob = binder.value;
                if (ob !== undefined&&!Array.isArray(ob)) {
                    for (var m in ob) {
                        comps.push(m + "-" + binders[x]);
                    }
                }
                comps.push("this-" + binders[x]);
            }*/
        this.component.autocompleter = comps;

    }
    get ob() {
        return this._ob;
    }

    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return this.component;
    }

    /**
    * intern the value changes
    * @param {type} param
    */
    _onchange(param) {
        var val = <string>this.component.value;
        var sp = "this.states." + val.split(".")[0] + ".bind.";//funcioncomponents doesnt have this
        if(this.foundFunctionComponents[val])
                 sp = "states." + val.split(".")[0] + ".bind.";
        
        if (val.split(".").length > 1)
            sp = sp + val.substring(val.indexOf(".") + 1);
        this.propertyEditor.setPropertyInCode(this.property.name, sp);

        //var func = this.propertyEditor.value[this.property.name];
        //var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
        this.propertyEditor.value[this.property.name] = this.foundBounds[val];
        //setPropertyInDesign(this.property.name,val);
        super.callEvent("edit", param);
    }
}