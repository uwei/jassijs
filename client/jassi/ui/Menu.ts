import jassi from "jassi/jassi";
import {Container} from "jassi/ui/Container";
import {Button} from "jassi/ui/Button";
import {Property,  $Property } from "jassi/ui/Property";
import {MenuItem} from "jassi/ui/MenuItem";
import { $Class } from "jassi/remote/Jassi";
import { $UIComponent } from "jassi/ui/Component";
import { DesignDummy } from "jassi/ui/DesignDummy";
/*declare global {
    interface JQuery {
            //menu: any;
    }
}*/

@$UIComponent({fullPath:"common/Menu",icon:"mdi mdi-menu",initialize:{text:"menu"}})
@$Class("jassi.ui.Menu")
export class Menu extends Container{

    _isRoot:boolean;
    _text:string;
    _icon:string;
    _noUpdate:boolean;
    _mainMenu;
    constructor(options=undefined){ 
        super();
        this._isRoot=true;
        super.init($('<ul '+` style="Menu"></ul>`)[0]);
        if(options!==undefined&&options.noUpdate===true){
            this._noUpdate=true;
        }else
            $(this.dom).menu();
        this._text="";
        this._icon="";
    }
    _sample(){
        super.init($('<ul '+` class="Menu">
<li>  <div><img  src="res/car.ico" />Save</div></li>
<li title="create button" onclick="doCreate()"><div><img  src="res/car.ico" />Create</div>
    <ul class="Menu" style="visibility:hidden">
    <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
    </ul>
</li>
<li title="update button2"> <div> <img src="res/tree.ico" />Update2</div>
    <ul style="Menu">
      <li> <div><img   src="res/car.ico" />Hoho</div></li>
     <li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
      </ul>
</li>
<li title="add new" onclick="doCreate()"><div><img  src="res/add-component.ico" /></div></li>
</ul>`)[0]);
    }

    _menueChanged(){
        if(this._isRoot&&this._noUpdate!==true){
             $(this.dom).menu();
            $(this.dom).menu("destroy");
            $(this.dom).menu();
        }
            
        if(this._parent!==undefined&&this._parent._menueChanged!==undefined)
            this._parent._menueChanged();
        
    }
    getMainMenu(){
        
        if(this._parent!==undefined&&this._parent.getMainMenu!==undefined)
            return this._parent.getMainMenu();
        if(this._mainMenu!==undefined)
            return this._mainMenu;
        return this;
    }
    /**
    * adds a component to the container before an other component
    * @param {jassi.ui.Component} component - the component to add
    * @param {jassi.ui.Component} before - the component before then component to add
    */
    addBefore(component,before){//add a component to the container
        super.addBefore(component,before);
        this._menueChanged();
    }
   /**
     * adds a component to the container
     * @param {jassi.ui.Menu} component - the component to add
     */
    add(component){//add a component to the container
    	if(this._designDummy!==undefined&&this._components[this._components.length-1]=== this._designDummy)
    		super.addBefore(component,this._designDummy);
    	else
        	super.add(component);
        this._menueChanged();
    }
   

    @$Property({name:"onclick",type:"function",default:"function(event){\n\t\n}"})
    onclick(handler){ 
       $( "#"+this._id ).click(function(ob) {
            handler(ob);
        }); 
    }
    extensionCalled(action:  ExtensionAction){
		if(action.componentDesignerSetDesignMode){
			return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
        }
        super.extensionCalled(action);
	}  
     /**
     * activates or deactivates designmode
     * @param {boolean} enable - true if activate designMode
     */
    protected _setDesignMode(enable){
        this._designMode=enable;
        if(enable) {//dummy at the end
        	DesignDummy.createIfNeeded(this,"atEnd",undefined,MenuItem);
/*            if(this._designDummy===undefined){
                this._designDummy=new MenuItem();
                this._designDummy.icon="res/add-component.ico";
                $(this._designDummy.domWrapper).removeClass("jcomponent");
                this._designDummy.designDummyFor="atEnd";
                this.add(this._designDummy);
            }else if(this._designDummy!==undefined&& this["isAbsolute"]===true){//TODO isAbsolute relevant?
                this.remove(this._designDummy);
                this._designDummy=undefined;
            }*/
        }else{
        	DesignDummy.destroyIfNeeded(this,"atEnd");
            /* if(this._designDummy!==undefined){
                this.remove(this._designDummy);
                this._designDummy=undefined;
            }*/
        }
    }
    destroy(){
        $(this.dom).menu();
        $(this.dom).menu("destroy");
        super.destroy();
    }
}
 jassi.test=async function(){
   // kk.o=0;
    var menu=new Menu();
        menu.width=200;
/*	var save=new jassi.ui.Menu();
    var save2=new jassi.ui.Menu();

    menu.add(save);
    save.onclick(function(){
        alert("ok");
    });
    save.text="dd";
    menu.add(save2);
    save2.text="pppq";
    save2.icon="res/button";
    save2.onclick(function(event){
        
    });*/
    return menu;
}



