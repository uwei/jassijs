import {PropertyEditor} from "jassijs/ui/PropertyEditor";
import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import {Textbox} from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";

@$PropertyEditor(["*name*"])
@$Class("jassijs.ui.PropertyEditors.NameEditor")
export class NameEditor extends Editor
    /**
     * Editor for number and string 
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.DefaultEditor
     */ {
    constructor( property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Textbox();
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
        var value = this.propertyEditor.getVariableFromObject(ob);
        if (value.startsWith("this."))
            value = value.substring(5);
        if (value.startsWith("me."))
            value = value.substring(3);
        /*            var value=this.propertyEditor.getPropertyValue(this.property);
                    if(value!==undefined&&value.startsWith("\"")&&value.endsWith("\"")&&this.property.type==="string"){
                        value=value.substring(1,value.length-1);
                    }*/
        this.component.value = value;
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
        var old = this.propertyEditor.getVariableFromObject(this._ob);
        this.propertyEditor.renameVariableInCode(old, this.component.value);
        this.propertyEditor.renameVariableInDesign(old, this.component.value);
        var varname=this.component.value;
        if(old!==undefined&&old.startsWith("me."))
            varname="me."+varname;
        if(old!==undefined&&old.startsWith("this."))
            varname="this."+varname;
            
        this.propertyEditor.variablename = varname;
        /*  var val=this.component.value;
          if(this.property.type==="string")
              val="\""+val+"\"";
          this.propertyEditor.setPropertyInCode(this.property.name,val);
          this.propertyEditor.setPropertyInDesign(this.property.name,val);
          super.callEvent("edit",param);*/
    }
}

