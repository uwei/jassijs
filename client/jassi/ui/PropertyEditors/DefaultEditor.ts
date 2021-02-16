import {Textbox} from "jassi/ui/Textbox";
import {Editor, $PropertyEditor } from "jassi/ui/PropertyEditors/Editor";
import jassi, { $Class } from "jassi/remote/Jassi";

@$PropertyEditor(["string", "number","number[]"])
@$Class("jassi.ui.PropertyEditors.DefaultEditor")
class DefaultEditor extends Editor
    /**
     * Editor for number and string 
     * used by PropertyEditor
     * @class jassi.ui.PropertyEditors.DefaultEditor
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
        if(property.chooseFrom!==undefined){
        	if(typeof(property.chooseFrom)==="function"){
    			this.component.autocompleter=function(){
    				return property.chooseFrom(_this.ob);		
    			} 		
        	}else
	        	this.component.autocompleter=property.chooseFrom;
        }
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
        super.ob = ob;
        var value = this.propertyEditor.getPropertyValue(this.property);
        if (value !== undefined && this.property.type === "string" &&typeof value === 'string'&& value.startsWith("\"") && value.endsWith("\"")) {
            value = value.substring(1, value.length - 1);
        }else if (value !== undefined &&this.property.type === "number[]") {
        	if(typeof(value)==="string")
            	value=value.replaceAll("[","").replaceAll("]","");
            else{
            	value=value.join(",");
            }
        	
        }
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
        var val = this.component.value;
        if(this.property.type==="string")
            val = "\"" + val + "\"";
        if(this.property.type==="number[]")
        	val=(val===""?"undefined":"["+val+"]");
        this.propertyEditor.setPropertyInCode(this.property.name, val);
        var oval=this.component.value;
        if(this.property.type==="number"){
        	oval=Number(oval);
        }
        if(this.property.type==="number[]"){
        	if(oval==="")
        		oval=undefined;
        	else {
	        	var all=oval.split(",");
	        	oval=[];
	        	for(var x=0;x<all.length;x++){
	        		oval.push(Number(all[x].trim()));
	        	}
        	}
        }
       
        this.propertyEditor.setPropertyInDesign(this.property.name, oval);
        super.callEvent("edit", param);
    }
}

