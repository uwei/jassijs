import {Checkbox} from "jassi/ui/Checkbox";
import {Editor,  $PropertyEditor } from "jassi/ui/PropertyEditors/Editor";
import {Databinder} from "jassi/ui/Databinder";
import jassi, { $Class } from "jassi/remote/Jassi";
import {Textbox} from "jassi/ui/Textbox";


@$PropertyEditor(["databinder"])
@$Class("jassi.ui.PropertyEditors.DatabinderEditor")
export class DatabinderEditor extends Editor
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassi.ui.PropertyEditors.BooleanEditor
     */ {
    constructor( property, propertyEditor) {
        super( property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Select ();
        this.component.width="100%";
        var _this = this;
        this.component.onchange(function (param) {
            _this._onchange(param);
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value = this.propertyEditor.getPropertyValue(this.property);
        if (value !== undefined) {
            var sp = value.replaceAll('"', "").split(",");
            value = sp[1] + "-" + sp[0];
            this.component.value = value;
        } else {
            this.component.value = "";
        }


        //TODO call this on focus
        var binders = this.propertyEditor.getVariablesForType(Databinder);
        if (binders !== undefined) {
            var comps = [];
            for (var x = 0; x < binders.length; x++) {
                var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                if (binder === undefined)
                    continue;
                let ob = binder.value;
                if (ob !== undefined) {
                    for (var m in ob) {
                        comps.push(m + "-" + binders[x]);
                    }
                }
            }
            this.component.autocompleter = comps;
        }
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
        var val = this.component.value;
        var sp = val.split("-");
        val = sp[1] + ',"' + sp[0] + '"';
        this.propertyEditor.setPropertyInCode(this.property.name, val);

        var func = this.propertyEditor.value[this.property.name];
        var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
        this.propertyEditor.value[this.property.name](binder, sp[0]);
        //setPropertyInDesign(this.property.name,val);
        super.callEvent("edit", param);
    }
}