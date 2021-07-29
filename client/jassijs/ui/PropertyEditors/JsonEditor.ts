import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Textbox } from "jassijs/ui/Textbox";
import { Editor, $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import { Button } from "jassijs/ui/Button";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { Tools } from "jassijs/util/Tools";
import { classes } from "jassijs/remote/Classes";
import { $Property } from "jassijs/ui/Property";

@$PropertyEditor(["json"])
@$Class("jassijs.ui.PropertyEditors.JsonEditor")
export class JsonEditor extends Editor {
    showThisProperties;
    parentPropertyEditor: Editor;
    /**
     * Editor for number and string 
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.DefaultEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Button();
        var _this = this;
        this.component.onclick(function(param) {
            _this._onclick(param);
        });
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        var value = this.propertyEditor.getPropertyValue(this.property);
        //set cache for propertyvalues

        var empty = value === undefined || value.length === 0;
        if (empty) {
            this.component.icon = "mdi mdi-decagram-outline"
        } else
            this.component.icon = "mdi mdi-decagram";
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


    _getPropertyValue(property) {

    }
    /**
     * register an event if the property has changed
     * @param {function} handler - the function that is called on change
     */
    onpropertyChanged(handler) {
        this.addEvent("propertyChanged", handler);
    }
    private makePropertyChangedEvent(propEditor: PropertyEditor) {
        var _this = this;
        propEditor.onpropertyChanged(function(param) {
            _this.callEvent("propertyChanged", param);
            if (_this.propertyEditor.parentPropertyEditor === undefined) {//only if the last JSON-PropertyEditor Window is closed
                var space = "";//_this.propertyEditor.getSpace(_this.property.name);
                //var str = Tools.objectToJson(propEditor.value, space);
                var str = Tools.stringObjectToJson(propEditor.codeChanges, space);

                if (_this.property.constructorClass !== undefined) {
                    var shortClassname: string = _this.property.constructorClass.split(".")[_this.property.constructorClass.split(".").length - 1];

                    str = "new " + shortClassname + "(" + str + ")";
                }
                var line = _this.propertyEditor.setPropertyInCode(_this.property.name, str);
                //set Property in Design
                //???Alternativ: 
                var test = _this._ob;//Tools.stringObjectToObject
                if (typeof (_this._ob[_this.property.name]) === "function")
                    _this._ob[_this.property.name](propEditor.value);
                else
                    _this._ob[_this.property.name] = propEditor.value;
                _this.callEvent("edit", param);
            } else
                propEditor.parentPropertyEditor.callEvent("propertyChanged", param);
            let val = propEditor.value;
            if (!val) {
                _this.component.icon = "mdi mdi-decagram-outline"
            } else{
                _this.component.icon = "mdi mdi-decagram";
			}
        });

    }
    /** 
     * initiate the default values in the PropertyEditor from code
     **/
    private setCode(propEditor: PropertyEditor) {
        var _this = this;
        var av = this.propertyEditor.getPropertyValue(this.property);
        if (av !== undefined) {
            if (_this.propertyEditor.parentPropertyEditor === undefined) {
                //we convert the ob to a stringobject and initialize the values
                let textob = Tools.jsonToStringObject(av);
                propEditor.codeChanges = textob === undefined ? {} : textob;

            } else {
                propEditor.codeChanges = av;
            }
        } else {
            if (_this.propertyEditor.parentPropertyEditor === undefined) {
                propEditor.codeChanges = {};
            } else {
                this.propertyEditor.codeChanges[this.property.name] = {};
                propEditor.codeChanges = <any>this.propertyEditor.codeChanges[this.property.name];
            }
        }

    }
    /**
     * intern the value changes
     * @param {type} param
     */
    _onclick(param) {
        var val = this.component.text;
        //if(val!=="function"){//function is still empty
        var propEditor = new PropertyEditor();
        propEditor.readPropertyValueFromDesign=this.propertyEditor.readPropertyValueFromDesign;
        propEditor.showThisProperties = this.showThisProperties;
        var _this = this;

        this.setCode(propEditor);
        this.makePropertyChangedEvent(propEditor);

        propEditor.parentPropertyEditor = this.propertyEditor;
        propEditor.variablename = this.property.name;
        var newclass = classes.getClass(this.property.componentType);
        var newvalue = new newclass();
        //only the top-PropertyEditor changed something
        if (this.propertyEditor.parentPropertyEditor === undefined) {
            var code = this.propertyEditor.getPropertyValue(this.property);
          
            if (this.property.constructorClass !== undefined) {
                var param = code=== undefined ? undefined : code.substring(code.indexOf("(") + 1, code.indexOf(")"));
                if (param === "")
                    param = undefined;
                classes.loadClass(this.property.constructorClass).then((oclass) => {
                    let oparam = Tools.jsonToObject(param);
                    var vv = new oclass(param === undefined ? undefined : oparam);
                    propEditor.value = vv;


                });
            } else {
                let val = undefined;
                if (code === undefined) {
                    val = {};
                } else if(typeof(code)==="string"){
                    val = Tools.jsonToObject(code);
                }else
                    val=code;
                Object.assign(newvalue, val);
                val = newvalue;
                propEditor.value = val;
            }

        } else {
            propEditor.showThisProperties = this.propertyEditor.showThisProperties;
            var val = this.propertyEditor.value[this.property.name];

            //if (propEditor.value === undefined) {
            if (val === undefined) {
                propEditor.value = newvalue;
                this.propertyEditor.value[this.property.name] = propEditor.value;
            } else {
                Object.assign(newvalue, val);
                val = newvalue;
                propEditor.value = val;
            }
        }
        var docheight = $(document).height();
        var docwidth = $(document).width();
        $(propEditor.dom).dialog({
            height: docheight,
            width: "320px",
            beforeClose: function(event, ui) {
                if (propEditor.variablename === "new") {
                    propEditor.parentPropertyEditor.updateCodeEditor();
                }
            }
        });

    }
}
@$Class("jassijs.ui.PropertyEditorTestProperties")
class TestProperties {
    @$Property({ decription: "name of the dialog" })
    dialogname: string;
    @$Property({ name: "jo/selectMode", type: "number", default: 3, chooseFrom: [1, 2, 3], description: "1=single 2=multi 3=multi_hier" })
    @$Property({ name: "jo", type: "json", componentType: "jassijs.ui.PropertyEditorTestProperties2" })
    jo: any;

}
@$Class("jassijs.ui.PropertyEditorTestProperties2")
class TestProperties2 {
    @$Property({ decription: "name of the dialog" })
    name1: string;
    @$Property({ decription: "name of the dialog" })
    name2: string;
}
export function test() {
    var ret = new PropertyEditor();
    ret.value = new TestProperties();
    return ret;
}
