import {Select} from "jassijs/ui/Select";
import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import  {JsonEditor} from "jassijs/ui/PropertyEditors/JsonEditor";
import {Tools} from "jassijs/util/Tools";
import {StringConverter} from "jassijs/ui/converters/StringConverter";
import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";
import {Textbox} from "jassijs/ui/Textbox";
import {PropertyEditor} from "jassijs/ui/PropertyEditor";
import registry from "jassijs/remote/Registry";
import {ComponentDescriptor} from "jassijs/ui/ComponentDescriptor";
import { classes } from "jassijs/remote/Classes";

@$PropertyEditor(["classselector"])
@$Class("jassijs.ui.PropertyEditors.ClassSelectorEditor")
export  class ClassSelectorEditor extends Editor {
    select: Select;
    jsonEditor: JsonEditor;
    me: any;

    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassijs.ui.PropertyEditors.BooleanEditor
     */
    constructor( property = undefined, propertyEditor = undefined) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel();
        this.component.width="100%";
        this.select = new Select();
        this.select.width = "calc(100% - 26px)";
        this.property = Tools.copyObject(property);
        this.jsonEditor = new JsonEditor(this.property, propertyEditor);
        this.jsonEditor.parentPropertyEditor = this;
        this.jsonEditor.component.text = "";
        this.jsonEditor.component.icon = "mdi mdi-glasses";
        this.jsonEditor.component.width = 26;
        this.component.add(this.select);
        this.component.add(this.jsonEditor.getComponent());
        var _this = this;

        this.jsonEditor.onpropertyChanged(function (param) {
            return;
        });
        this.select.onchange(function (sel) {
            var converter = sel.data;
            _this.changeConverter(converter);
        });
        this.initSelect();
        // this.component.onclick(function(param){
        //     _this._onclick(param);
        // });
    }
    changeConverter(converter) {
        var _this = this;
        var testval = _this.propertyEditor.getPropertyValue(_this.property);
        var shortClassname:string=converter.classname.split(".")[converter.classname.split(".").length-1];
        if (testval === undefined || !testval.startsWith("new " + shortClassname)) {
            _this.propertyEditor.setPropertyInCode(_this.property.name, "new " + shortClassname + "()");
            
            var file=converter.classname.replaceAll(".", "/"); 
             var stype = file.split("/")[file.split("/").length - 1];
			_this.propertyEditor.addImportIfNeeded(stype,file);
            
            classes.loadClass(converter.classname).then((pclass)=>{
                _this.propertyEditor.setPropertyInDesign(_this.property.name,new pclass());
            });
        }
        _this.property.constructorClass = converter.classname;
        _this.jsonEditor.showThisProperties = ComponentDescriptor.describe(classes.getClass(converter.classname)).fields;
        for (var x = 0; x < _this.jsonEditor.showThisProperties.length; x++) {
            var test = _this.jsonEditor.showThisProperties[x].name;
            if (test.startsWith("new")) {
                _this.jsonEditor.showThisProperties[x].name = _this.property.name + test.substring(3);
            }
        }
        _this.jsonEditor.ob = {};
        _this.jsonEditor.component.text = "";

    }
    initSelect() {
        var _this = this;

        registry.loadAllFilesForService(this.property.service).then(function () {
            var converters=registry.getData(_this.property.service);
            var data = [];
             /*data.push({
                    classname:undefined,
                    data:""    
                });*/
            for(var x=0;x<converters.length;x++){
                var con=converters[x];
                var cname=classes.getClassName(con.oclass);
                var name=cname;
                if(con.params[0]&&con.params[0].name!==undefined)
                	name=con.params[0].name;
                data.push({
                    classname:cname,
                    data:name   
                });
            }
                _this.select.items = data;
                
                _this.select.display = "data";
                _this.ob = _this.ob;
        });
        //	this.select
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        if (this.propertyEditor === undefined)
            return;
        if (this.select.items === undefined)
            return;//list is not inited
        var value = this.propertyEditor.getPropertyValue(this.property);
        if (value !== undefined) {
            
            for (var x = 0; x < this.select.items.length; x++) {
                var sel=this.select.items[x];
                var shortClassname:string=sel.classname;
                if(shortClassname!==undefined){
                    shortClassname=shortClassname.split(".")[shortClassname.split(".").length-1];
                    if (value.indexOf(shortClassname) > -1) {
                        
                        this.select.value = sel;
                        this.changeConverter(sel);
                        break;
                    }
                }
            }
        }else{
            this.select.value="";
        }
        super.ob = ob;
        // this.component.value=value;
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
        var val = this.component.value;

        this.propertyEditor.setPropertyInCode(this.property.name, val);
        this.propertyEditor.setPropertyInDesign(this.property.name, val);
        super.callEvent("edit", param);
    }
    layout() {
        var me: any = this.me = {};
        me.pan = new Panel();
        me.tb = new Textbox();
        me.pan.height = 15;
        me.pan.add(me.tb);
        me.tb.height = 15;
        me.tb.converter = new StringConverter();
    }
    destroy() {
        this.select.destroy();
        super.destroy();

    }
}
jassijs.test = function () {
    ComponentDescriptor.cache = {};
    var t = new ClassSelectorEditor();
    t.layout();
    return t.me.pan;
}
