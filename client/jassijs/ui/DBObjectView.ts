import {Button} from "jassijs/ui/Button";
import {BoxPanel} from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Jassi";
import {Panel} from "jassijs/ui/Panel";
import { Databinder } from "jassijs/ui/Databinder";
import { $UIComponent } from "jassijs/ui/Component";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { DBObject } from "jassijs/remote/DBObject";
import { $Property } from "jassijs/ui/Property";
import { $ActionProvider, ActionProperties } from "jassijs/base/Actions";

export type DBObjectViewMe = {
	databinder?:Databinder,
	create?:Button,
	main?:Panel,
	toolbar?:BoxPanel,
	save?:Button,
	remove?:Button,
	refresh?:Button
}
export class DBObjectViewProperties {
    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    classname: string;
    actionname?:string;
    icon?:string;
}
export function $DBObjectView(properties: DBObjectViewProperties): Function {
    return function (pclass) {
        registry.register("$DBObjectView", pclass, properties);
    }
}
type Me=DBObjectViewMe;

@$UIComponent({ editableChildComponents: ["this","me.main","me.toolbar","me.save","me.remove","me.refresh"] })
@$Class("jassijs/ui/DBObjectView")
export class DBObjectView extends Panel {
	me:DBObjectViewMe;
	value:any;
    constructor() {
        super();
        this.me={};
        $(this.dom).addClass("designerNoResizable");//this should not be resized only me.main
        //everytime call super.layout
        DBObjectView.prototype.layout.bind(this)(this.me);
       // this.layout(this.me);
    }
    protected _setDesignMode(enable) {
    	//no Icons to add Components in designer
    }
    /**
     * create a new object
     */
    createObject():any{
    	var clname=registry.getData("$DBObjectView",classes.getClassName(this))[0].params[0].classname;
    	var cl=classes.getClass(clname);
		this["value"]=new cl();
		this.callEvent("created", this["value"]);
		return this["value"];
    }
     /**
     * register an event if the object is created
     * @param {function} handler - the function that is called
     */
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    oncreated(handler: (obj:DBObject ) => void) {
        this.addEvent("deleted", handler);
    }
    /**
     * saves the object
     */
    saveObject(){
    	var ob = this.me.databinder.fromForm();
        ob.save().then((obj)=>{
        	this["value"]=obj;
        	this.callEvent("saved", obj);
        });
        
    }
    /**
     * register an event if the object is saved
     * @param {function} handler - the function that is called
     */
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onsaved(handler: (obj:DBObject ) => void) {
        this.addEvent("saved", handler);
    }
    /**
     * refresh the object
     */
    refreshObject(){
		this.me.databinder.toForm(this["value"]);
		this.callEvent("refreshed", this["value"]);
    }
    /**
     * register an event if the object is refreshed
     * @param {function} handler - the function that is called
     */
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onrefreshed(handler: (obj:DBObject ) => void) {
        this.addEvent("refreshed", handler);
    }
    /**
     * deletes Object
     **/
    deleteObject(){
    	var ob:DBObject = <DBObject>this.me.databinder.fromForm();
        ob.remove();
        
        //set obj to null
        var clname=registry.getData("$DBObjectView",classes.getClassName(this))[0].params[0].classname;
    	var cl=classes.getClass(clname);
		this["value"]=new cl();
        this.callEvent("deleted", ob);
    }
    /**
     * register an event if the object is deleted
     * @param {function} handler - the function that is called
     */
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    ondeleted(handler: (obj:DBObject ) => void) {
        this.addEvent("deleted", handler);
    }
  
    layout(me:Me) {
    	var _this=this;
	    me.toolbar=new BoxPanel();
	    me.save=new Button();
	    me.remove=new Button();
	    me.refresh=new Button();
	    me.create=new Button();
    	me.databinder = new Databinder();
    	me.main=new Panel();
    	me.databinder.definePropertyFor(this, "value");
    	this.add(me.toolbar);
    	this.add(me.main);
    	me.main.width="100%";
    	me.main.height="100%";
    	me.main.css({ position: "relative" });
    	//$(me.main.dom).css("background-color","coral");
    	me.toolbar.add(me.create);
    	me.toolbar.add(me.save);
    	me.toolbar.horizontal=true;
    	me.toolbar.add(me.refresh);
    	me.toolbar.add(me.remove);
    	me.save.text="";
 		me.save.tooltip="save";
    	me.save.icon="mdi mdi-content-save";
    	me.save.onclick(function(event){
    		_this.saveObject();
    	});
    	me.remove.text="";
    	me.remove.icon="mdi mdi-delete";
    	me.remove.onclick(function(event){
    		_this.deleteObject();
    	});
    	me.remove.tooltip="remove";
    	me.refresh.text="";
    	me.refresh.icon="mdi mdi-refresh";
    	me.refresh.onclick(function(event){
    		_this.refreshObject();
    	});
    	me.refresh.tooltip="refresh";
    	me.create.text="";
    	me.create.icon="mdi mdi-tooltip-plus-outline";
    	
    	me.create.onclick(function(event){
    		_this.createObject();
			//me.binder.toForm();
    	});
    
    	me.create.tooltip="new";
    
	}
}

export async function test(){
	var ret=new DBObjectView();
	return ret;
}