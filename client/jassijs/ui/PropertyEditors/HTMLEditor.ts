import {Checkbox} from "jassijs/ui/Checkbox";
import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import {Databinder} from "jassijs/ui/Databinder";
import jassijs, { $Class } from "jassijs/remote/Jassi";
import {Textbox} from "jassijs/ui/Textbox";
import {ObjectChooser} from "jassijs/ui/ObjectChooser";
import {Panel} from "jassijs/ui/Panel";

@$PropertyEditor(["html"])
@$Class("jassijs.ui.PropertyEditors.HTMLEditor")
export  class HTMLEditor extends Editor{
    _textbox :Textbox;
    _objectchooser:ObjectChooser;
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */ 
    constructor( property, propertyEditor) {
        super( property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel(/*{useSpan:true}*/);
        this._textbox = new Textbox();
        this._objectchooser = new ObjectChooser();
        this._objectchooser.width = 24;
        this._textbox.width = "calc(100% - 28px)";
        this.component.height = 24;
        this.component.add(this._textbox);
        this.component.add(this._objectchooser);

        var _this = this;
        this._textbox.onchange(function (param) {
            _this._onchange('"' + param + '"');
        });
        this._objectchooser.onclick(function (ob) {
            _this._objectchooser.items = _this.property.type;
        });
        this._objectchooser.onchange(function (ob) {
            _this._textbox.value = _this._objectchooser.value.id;
            _this._onchange();
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        //databinder,"prop"
        var value = this.propertyEditor.getPropertyValue(this.property);
        if (value !== undefined && this.property.type === "string" && value.startsWith("\"") && value.endsWith("\"")) {
            value = value.substring(1, value.length - 1);
        }
        this._textbox.value = value;
        var _this = this;

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
    _onchange(param=undefined) {
        var val = this._textbox.value;
        var type = this.property.type;
        // var sval="jassijs.db.load(\""+type+"\","+val+")";
        this.propertyEditor.setPropertyInCode(this.property.name, val);
        this.propertyEditor.setPropertyInDesign(this.property.name, val);
        /* var _this=this;
         jassijs.db.load("de.Kunde",val).then(function(ob){
             _this.propertyEditor.setPropertyInDesign(_this.property.name,ob);
         });*/
        /*
        var func=this.propertyEditor.value[this.property.name];
        var binder=this.propertyEditor.getObjectFromVariable(sp[1]);
        this.propertyEditor.value[this.property.name](binder,sp[0]);
        //setPropertyInDesign(this.property.name,val);*/
        super.callEvent("edit", param);
    }
}
