import {Textbox} from "jassi/ui/Textbox";
import {Editor, $PropertyEditor } from "jassi/ui/PropertyEditors/Editor";
import jassi, { $Class } from "jassi/remote/Jassi";
import { PropertyEditor } from "jassi/ui/PropertyEditor";
import { Component } from "jassi/ui/Component";


export class LoadingEditor extends Editor{
	_property;
	_propertyEditor;
	_editor;
    constructor( property, propertyEditor,waitforclass:Promise<any>) {
    	super(property,propertyEditor);
        this._property=property;
        this._propertyEditor=propertyEditor;
        /** @member - the renedering component **/
        this.component = new Textbox();
        let _this=this;
		waitforclass.then((cl)=>{
			_this._editor=new cl(_this.property,_this.propertyEditor);
			(<Component>_this.component).dom.parentNode.replaceChild(_this._editor.getComponent().dom,_this.component.dom);
			_this._editor.ob=_this.ob;
			_this.component=_this._editor.component;
		});
    }
    /**
     * @member {object} ob - the object which is edited
     */
    set ob(ob) {
    	if(this._editor)
    		this._editor=ob;
    	else
	        super.ob = ob;
        

    }
    get ob() {
    	if(this._editor)
    		return this._editor.ob;
    	else
        	return this._ob;
    }

    /**
   * get the renderer for the PropertyEditor
   * @returns - the UI-component for the editor
   */
    getComponent() {
        return this.component;
    }

}

