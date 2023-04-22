import { $Class } from "jassijs/remote/Registry";
import {PropertyEditor} from "jassijs/ui/PropertyEditor";
import { classes } from "jassijs/remote/Classes";
import registry from "jassijs/remote/Registry";
import {Editor} from "jassijs/ui/PropertyEditors/Editor";
import {Property} from "jassijs/ui/Property";


@$Class("jassijs.base.PropertyEditorService")
export class PropertyEditorService {
    data;//:{ [key:string]:[string]; };
    private funcRegister;
    /**
    * manage all PropertyEditors
    * @class jassijs.ui.PropertyEditorService
    */
    constructor() {
        /** @member {Object.<string,[class]>}
         *  data[type]*/
        this.data = {};
        this.funcRegister=registry.onregister("$PropertyEditor",this.register.bind(this));
    }
    reset() {
        this.data = {};
    }
    destroy(){
        registry.offregister("$PropertyEditor",this.funcRegister);
    }
    private async loadType(type:string){
    	 if (this.data[type] === undefined){
                var dat=await registry.getJSONData("$PropertyEditor");
                for(var x=0;x<dat.length;x++){
                		if(dat[x].params[0].indexOf(type)!==-1){
							await classes.loadClass(dat[x].classname);
						}
                	
                }
                if (this.data[type] === undefined)
                    throw "PropertyEditor not found for type:" + type;
            }
            return classes.loadClass(this.data[type]);
    }
    /**
     * creates PropertyEditor for type
     * 
     * @param {string} variablename - the name of the variable
     * @param {jassijs.ui.Property} property - name of the type 
     * @param {jassijs.ui.PropertyEditor} propertyEditor - the PropertyEditor instance 
     */
    createFor( property:Property, propertyEditor:PropertyEditor):Editor|Promise<any> {
        var sclass = undefined;
        var promise=undefined;
        if (property.editor !== undefined) {
            sclass = property.editor;
        } else {
            if (this.data[property.type] === undefined){
                return this.loadType(property.type);
            }else
	            sclass = this.data[property.type][0];
        }
        	var oclass = classes.getClass(sclass);
        	if(oclass)
	        	return new (oclass)( property, propertyEditor);
	        throw new Error("class not loaded "+sclass);
                 
                    //return new LoadingEditor(property,propertyEditor,classes.loadClass(sclass));
        
    }
    private register(oclass: new (...args: any[]) => any, types:string[]){
        var name:string=classes.getClassName(oclass);
        for (var x = 0; x < types.length; x++) {
            if (this.data[types[x]] === undefined)
                this.data[types[x]] = [];
            if (this.data[types[x]].indexOf(name) === -1)
                this.data[types[x]].push(name);
        }
    }
}
var propertyeditor=new PropertyEditorService();
export {propertyeditor};

