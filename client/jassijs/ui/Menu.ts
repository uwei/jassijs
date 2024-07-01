import "jassijs/ext/jquerylib";
import { Container, ContainerProperties } from "jassijs/ui/Container";
import { Button } from "jassijs/ui/Button";
import { Property, $Property } from "jassijs/ui/Property";
import { MenuItem } from "jassijs/ui/MenuItem";
import { $Class } from "jassijs/remote/Registry";
import { $UIComponent } from "jassijs/ui/Component";
import { DesignDummy } from "jassijs/ui/DesignDummy";
/*declare global {
    interface JQuery {
            //menu: any;
    }
}*/


export interface MenuProperties extends ContainerProperties {
    domProperties?:React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLUListElement>, HTMLUListElement>;
    noUpdate?:boolean;
    onclick?(handler);
}

@$UIComponent({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } })
@$Class("jassijs.ui.Menu")
export class Menu<T extends MenuProperties=MenuProperties> extends Container<T> implements MenuProperties {

    _isRoot: boolean;
    _text: string;
    _icon: string;
    _noUpdate: boolean;
    _mainMenu;
    constructor(options = undefined) {
        super(options);
        this._isRoot = true;
        if (this.props?.noUpdate === true) {
            this._noUpdate = true;
        } else
            $(this.dom).menu();
        this._text = "";
        this._icon = "";

    }
    componentDidMount() {

    }
    render() {
        return React.createElement("ul", { className: "InvisibleComponent"/*, style= "Menu" */ });
    }
    config(config: T): Menu {
        super.config(config);
        return this;
    }
    _sample() {
        /*   
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
    </ul>`);*/
    }

    _menueChanged() {
        if (this._isRoot && this._noUpdate !== true) {
            $(this.dom).menu();
            $(this.dom).menu("destroy");
            $(this.dom).menu();
        }

        if (this._parent !== undefined && this._parent._menueChanged !== undefined)
            this._parent._menueChanged();

    }
    getMainMenu() {

        if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
            return this._parent.getMainMenu();
        if (this._mainMenu !== undefined)
            return this._mainMenu;
        return this;
    }
    /**
    * adds a component to the container before an other component
    * @param {jassijs.ui.Component} component - the component to add
    * @param {jassijs.ui.Component} before - the component before then component to add
    */
    addBefore(component, before) {//add a component to the container
        super.addBefore(component, before);
        this._menueChanged();
    }
    /**
      * adds a component to the container
      * @param {jassijs.ui.Menu} component - the component to add
      */
    add(component) {//add a component to the container
        if (this._designDummy !== undefined && this._components[this._components.length - 1] === this._designDummy)
            super.addBefore(component, this._designDummy);
        else
            super.add(component);
        this._menueChanged();
    }


    @$Property({ name: "onclick", type: "function", default: "function(event){\n\t\n}" })
    onclick(handler) {
        document.getElementById(this._id).addEventListener("click", function (ob) {
            handler(ob);
        });
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
        }
        super.extensionCalled(action);
    }
    /**
    * activates or deactivates designmode
    * @param {boolean} enable - true if activate designMode
    */
    protected _setDesignMode(enable) {
        this._designMode = enable;
        if (enable) {//dummy at the end
            DesignDummy.createIfNeeded(this, "atEnd", undefined, MenuItem);
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
        } else {
            DesignDummy.destroyIfNeeded(this, "atEnd");
            /* if(this._designDummy!==undefined){
                this.remove(this._designDummy);
                this._designDummy=undefined;
            }*/
        }
    }
    destroy() {
        $(this.dom).menu();
        $(this.dom).menu("destroy");
        super.destroy();
    }
}


export function test() {
    var men = new Menu();
    var it = new MenuItem();
    it.text = "Hallo";
    //it.onclick(() => alert("ok"));
    men.add(it);
    return men;
}