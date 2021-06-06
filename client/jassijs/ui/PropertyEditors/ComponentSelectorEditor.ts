import {Editor,  $PropertyEditor } from "jassijs/ui/PropertyEditors/Editor";
import {Select} from "jassijs/ui/Select";

import { classes } from "jassijs/remote/Classes";
import { $Class } from "jassijs/remote/Jassi";
/**
 * select one or more instances of an class
 * used by PropertyEditor
 **/
@$PropertyEditor(["componentselector"])
@$Class("jassijs.ui.PropertyEditors.ComponentSelectorEditor")
export class ComponentSelectorEditor extends Editor {
		constructor(property,propertyEditor){
            super(property,propertyEditor);
            /** @member - the renedering component **/
            this.component=new Select({
            	multiple:(property.componentType.indexOf("[")===0) 
            });
            this.component.width="100%";
            var _this=this;
            this.component.onchange(function(param){
                _this._onchange(param);
            });
            
           
        }
        
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob){
            super.ob=ob;
            var scomponentType=this.property.componentType.replace("[","").replace("]","");
            
            var data=this.propertyEditor.getVariablesForType( classes.getClass(scomponentType));
            this.component.items=data===undefined?[]:data;
            var value=this.propertyEditor.getPropertyValue(this.property);
			if(this.property.componentType.indexOf("[")===0&&value){
				value=value.substring(1,value.length-1).split(",");
			}
            this.component.value=value;
        }
        get ob(){
           return this._ob;
        }
        
          /**
         * get the renderer for the PropertyEditor
         * @returns - the UI-component for the editor
         */
        getComponent(){
            return this.component;
        }
        /**
         * intern the value changes
         * @param {type} param
         */
        _onchange(param){
        	var val=this.component.value;
            
            if(this.property.componentType.indexOf("[")===0){
            	let oval=[];
            	let code="";
            	for(var x=0;x<val.length;x++){
            		code=code+(code===""?"":",")+val[x];
            		let o=this.propertyEditor.getObjectFromVariable(val[x]);
            		oval.push(o);
            	}
            	this.propertyEditor.setPropertyInCode(this.property.name,"["+code+"]");
	            this.propertyEditor.setPropertyInDesign(this.property.name,oval);
            }else{
            	let oval=this.propertyEditor.getObjectFromVariable(val);
	            this.propertyEditor.setPropertyInCode(this.property.name,val);
	            this.propertyEditor.setPropertyInDesign(this.property.name,oval);
            }
            super.callEvent("edit",param);
        }
    }
export function test(){

}