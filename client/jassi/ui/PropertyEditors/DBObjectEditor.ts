import {Checkbox} from "jassi/ui/Checkbox";
import {Editor,  $PropertyEditor } from "jassi/ui/PropertyEditors/Editor";
import {Databinder} from "jassi/ui/Databinder";
import jassi, { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import {Textbox} from "jassi/ui/Textbox";
import {ObjectChooser} from "jassi/ui/ObjectChooser";
import { DBObject } from "jassi/remote/DBObject";
import { classes } from "jassi/remote/Classes";

@$PropertyEditor(["dbobject"])
@$Class("jassi.ui.PropertyEditors.DBObjectEditor")
export  class DBObjectEditor extends Editor {
    _textbox:Textbox;
    _objectchooser:ObjectChooser;
    dbobject:DBObject;
    /**
     * Checkbox Editor for boolean values
     * used by PropertyEditor
     * @class jassi.ui.PropertyEditors.BooleanEditor
     */
    constructor(property, propertyEditor) {
        super(property, propertyEditor);
        /** @member - the renedering component **/
        this.component = new Panel(/*{useSpan:true}*/);
        this._textbox = new Textbox();
        this._objectchooser = new ObjectChooser();
        this._objectchooser.width = 24;
        this._textbox.width = "calc(100% - 34px)";
        this.component.height = 24;
        this.component.add(this._textbox);
        this.component.add(this._objectchooser);

        var _this = this;
        this._textbox.onchange(function (param) {
            _this._onchange(param);
        });
        this._objectchooser.onclick(function (ob) {
            _this._objectchooser.items = _this.property.componentType;
        },false);
        this._objectchooser.onchange(function (ob) {
        	_this.dbobject=_this._objectchooser.value;
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
        if (value !== undefined) {
            //jassi.db.load("de.Kunde",9);
            if (value.startsWith("jassi.db.load")) {
                var nr = value.split(",")[1];
                nr = nr.substring(0, nr.indexOf(")") - 1);
                this._textbox.value = nr;
            }
        } else {
            this._textbox.value = "";
        }
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
    async loadObject(id:string):Promise<DBObject> {
    	var tp=await classes.loadClass(this.property.componentType);
        return await tp["findOne"](parseInt(id));
    }

    /**
    * intern the value changes
    * @param {type} param
    */
    _onchange(param=undefined) {
        var val = this._textbox.value;
        var type = this.property.componentType;
        var sval = "jassi.db.load(\"" + type + "\"," + val + ")";
        var _this=this;
        this.propertyEditor.setPropertyInCode(this.property.name, sval);
        if(val&&val!==""&&this.dbobject===undefined){
        	this.loadObject(<string>val).then((ob)=>{
		        	_this.dbobject=ob;
        			_this.propertyEditor.setPropertyInDesign(_this.property.name, _this.dbobject);
        	});
        }else
	        this.propertyEditor.setPropertyInDesign(this.property.name, this.dbobject);
        /* var _this=this;
         jassi.db.load("de.Kunde",val).then(function(ob){
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
