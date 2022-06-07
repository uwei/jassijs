import {Textbox} from "jassijs/ui/Textbox";
import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import {Button} from "jassijs/ui/Button";
import jassijs, { $Class } from "jassijs/remote/Jassi";

@$PropertyEditor(["function"])
@$Class("jassijs.ui.PropertyEditors.FunctionEditor")
export class FunctionEditor extends Editor
    /**
     * Editor for number and string 
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.DefaultEditor
     */ {
    constructor( property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Button();
        this.component.width="100%";
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
        var value = this.propertyEditor.getPropertyValue(this.property, true);
        if (value === undefined) {
            this.component.text = "none"
        } else
            this.component.text = "function";
    }
    get ob() {
       return  this._ob;
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
        var val = this.component.text;
        if (val !== "function") {//function is still empty
            var value = this.propertyEditor.parser.getPropertyValue(this.propertyEditor.variablename, this.property.name);
            this.propertyEditor.setPropertyInCode(this.property.name, this.property.default);
            this.component.value = "function";
          //  this.propertyEditor.gotoCodeLine(line + 1);
            super.callEvent("edit", param);
        }/* else {//function is already defined so goto
            let line = this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].linestart;
            this.propertyEditor.gotoCodeLine(line + 1);

        }*/
        var node=this.propertyEditor.parser.data[this.propertyEditor.variablename][this.property.name][0].node;
        var pos=-1;
        if(node["expression"])
            pos=node["expression"].arguments[0].body.pos;
        else
            pos=node["initializer"].body.pos;
        this.propertyEditor.gotoCodePosition(pos+2);
    }

}
