import { $Class } from "jassijs/remote/Registry";
import {Checkbox} from "jassijs/ui/Checkbox";
import {Editor, $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import { Textbox } from "jassijs/ui/Textbox";

@$PropertyEditor(["jassijs.ui.Component"])
@$Class("jassijs.ui.PropertyEditors.ComponentEditor")
export class BooleanEditor extends Editor
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ {
    constructor( property, propertyEditor) {
        super( property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Textbox();
        var _this = this;
        this.component.onclick(function (param) {
            _this._onclick(param);
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        var value = this.propertyEditor.getPropertyValue(this.property);
     /*   this.component.value = value;*/
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
    _onclick(param) {
       /* var val = this.component.value;
        this.propertyEditor.setPropertyInCode(this.property.name, val.toString());
        this.propertyEditor.setPropertyInDesign(this.property.name, val);
        super.callEvent("edit", param);*/
    }
}
