import "jassijs/ext/jquerylib";
import "jquery.contextMenu";
import { $Class } from "jassijs/remote/Registry";
import { Menu } from "jassijs/ui/Menu";
import { InvisibleComponent, InvisibleComponentProperties } from "jassijs/ui/InvisibleComponent";
import { Component,  ComponentProperties } from "jassijs/ui/Component";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { $Property } from "jassijs/ui/Property";
import { Actions, Action } from "jassijs/base/Actions";
import { MenuItem } from "jassijs/ui/MenuItem";
import { Container } from "jassijs/ui/Container";
import { $UIComponent } from "jassijs/ui/UIComponents";

jassijs.includeCSSFile("contextMenu.css");
declare global {
    interface JQuery {
        contextMenu: any;
    }
}
export interface ContextMenuProperties extends InvisibleComponentProperties {
    /**
     * @member - includes Actions from @ActionProvider for the objects in value
     */
    includeClassActions?: boolean;
    /**
    * register an event if the contextmenu is showing
    * @param {function} handler - the function that is called on change
    * @returns {boolean} - false if the contextmenu should not been shown
    */
    onbeforeshow?(handler);
    children?;
}
//https://github.com/s-yadav/contextMenu.js/
@$UIComponent({ fullPath: "common/ContextMenu", icon: "mdi mdi-dots-vertical", editableChildComponents: ["menu"] })
@$Class("jassijs.ui.ContextMenu")
export class ContextMenu<T extends ContextMenuProperties=ContextMenuProperties> extends InvisibleComponent<T> implements ContextMenuProperties {
    _menu: Menu;
    contextComponents;
    _components: Component[];
    target: any;
    @$Property()
    includeClassActions: boolean;
    private _value;
    constructor(props:ContextMenuProperties={}) {//id connect to existing(not reqired)
        super(props);
    }
    set menu(val) {
        this._menu=val;
    }
    get menu(){
        return this._menu;
    }
    add(menu:MenuItem){
        
        if(menu instanceof MenuItem)
           this.menu.add(menu); 
    }
     /**
   * remove all component
   * @param {boolean} destroy - if true the component would be destroyed
   */
    removeAll(destroy = undefined) {
        while (this.menu._components?.length > 0) {
            this.remove(this._components[0]);
        }
       

    }
    addBefore(menu:MenuItem,before){
        this.menu.addBefore(menu,before); 
    }
    remove(item){
        this.remove(item);
    }
   /* set children(data){
        if(data.length>0)
            this.menu=data[0];
    }*/
    /**
     * @member - the objects for the includeClassActions @ActionProvider if  is enabled
     **/
    set value(value: any[]) {
        this._value = value;
    }

    get value(): any[] {
        return this._value;
    }


    render() {
        return React.createElement("span", { className: "InvisibleComponent" });
    }
    componentDidMount() {
        var _this = this;
        this.menu = new Menu({ noUpdate: true });
        this.menu._mainMenu = this;
        //this.menu._parent=this;
        this.dom.append(this.menu.dom);
        $(this.menu.dom).contextMenu("menu", "#" + this.menu._id, { triggerOn: 'dummyevent' });
        this.contextComponents = [];
        //this.menu._parent=this;
        this.menu.dom.classList.add("jcontainer");
        this._components = [this.menu];//neede for getEditablecontextComponents
        this.onbeforeshow(function () {
            return _this._updateClassActions();
        })
    }


    config(config: T): ContextMenu {
        if(super.config(config))//@ts-ignore
            Container.prototype.createChildren.bind(this)(config);
        return this;
    }
    /**
     * could be override to provide Context-actions
     * exsample:
     * cmen.getActions=async function(objects:[]){
     *		return [{name:"hallo",call:ob=>{}]
     *	};
     **/
    async getActions(data: any[]): Promise<Action[]> {
        return [];
    }
    //		static async  getActionsFor(oclass:new (...args: any[]) => any):Promise<{name:string,icon?:string,call:(objects:any[])}[]>{
    /*	registerActions(func:{(any[]):Promise<{name:string,icon?:string,call:(objects:any[])}[]}>){
            this._getActions=func;
        }*/
    private _removeClassActions(menu) {
        for (var y = 0; y < menu._components.length; y++) {
            var test = menu._components[y];
            if (test["_classaction"] == true) {
                menu.remove(test);
                test.destroy();
                y--;
            }
            if (test._components !== undefined) {
                this._removeClassActions(test);
            }
        }
    }
 
    private async _updateClassActions() {


        //remove classActions
        this._removeClassActions(this.menu);
        var _this = this;
        var actions = await this.getActions(this.value);

        if (this.value === undefined || this.includeClassActions !== true || this.value.length <= 0)
            actions = actions;//do nothing
        else {
            var a = await Actions.getActionsFor(this.value);//Class Actions
            for (var x = 0; x < a.length; x++) {
                actions.push(a[x]);
            }
        }
        actions.forEach(action => {
            var path = action.name.split("/");//childmenus
            var parent: Menu = this.menu;
            for (var i = 0; i < path.length; i++) {
                if (i === path.length - 1) {
                    var men = new MenuItem();
                    men["_classaction"] = true;
                    men.text = path[i];
                    if (action.icon !== undefined)
                        men.icon = action.icon;
                    men.onclick(() => action.call(_this.value));
                    parent.add(men);
                } else {
                    var name = path[i];
                    var found = undefined;
                    parent._components.forEach((men) => {
                        if ((<MenuItem>men).text === name)
                            found = (<MenuItem>men).items;
                    });
                    if (found === undefined) {
                        var men = new MenuItem();
                        men["_classaction"] = true;
                        men.text = name;
                        parent.add(men);
                        parent = men.items;
                    } else {
                        parent = found;
                    }
                }
            }
        })
    }
    _menueChanged() {

    }
    getMainMenu() {
        return this;
    }

    @$Property({ default: "function(event){\n\t\n}" })
    onbeforeshow(handler) {
        this.addEvent("beforeshow", handler);
    }
    async _callContextmenu(evt) {
        this.target = evt.target;
        var cancel = this.callEvent("beforeshow", evt);
        if (cancel !== undefined) {
            for (var x = 0; x < cancel.length; x++) {
                if (cancel[x] !== undefined && cancel[x].then !== undefined)
                    cancel[x] = await cancel[x];
                if (cancel[x] === false)
                    return;
            }
        }
        let y = evt.originalEvent.clientY;
        this.show({ left: evt.originalEvent.clientX, top: y });
    }


    /**
     * register the contextMenu (right click) on the component
     * @member {jassijs.ui.Component} - the component which gets the contextmenu
     **/
    registerComponent(component) {
        this.contextComponents.push(component);
        var _this = this;
        $(component.dom).contextmenu(function (evt) {
            if (evt.preventDefault !== undefined)
                evt.preventDefault();
            setTimeout(() => {//timout because Table._oncontext should be called first
                _this._callContextmenu(evt);
            }, 10);
        });
    }
    /**
     * unregister the contextMenu (right click) on the component
     * @member {jassijs.ui.Component} - the component which gets the contextmenu
     **/
    unregisterComponent(component) {
        //$(component.dom).contextmenu(function(ob){});//now we always can destroy
        $(component.dom).off("contextmenu");
        //$(component.dom).contextmenu("destroy");
        var pos = this.contextComponents.indexOf(component);
        if (pos >= 0)
            this.contextComponents.splice(pos, 1);
    }

    /**
     * shows the contextMenu
     */
    show(event) {
        //@ts-ignore
        if (this.domWrapper.parentNode.getAttribute('id') === "jassitemp" && this.contextComponents.length > 0) {
            //the contextmenu is not added to a container to we add the contextmenu to the contextComponent
            this.contextComponents[0].domWrapper.appendChild(this.domWrapper);
        }
        var _this = this;
        window.setTimeout(function () {
            $(_this.menu.dom).menu();
            $(_this.menu.dom).menu("destroy");
            $(_this.menu.dom).contextMenu("menu", "#" + _this.menu._id, { triggerOn: 'dummyevent' });
            //correct pos menu not visible

            if (!event) {
                event = $(':hover').last().offset();
            }
            if (event.top + $(_this.menu.dom).height() > window.innerHeight) {
                event.top = window.innerHeight - $(_this.menu.dom).height();
            }
            if (event.left + $(_this.menu.dom).width() > window.innerWidth) {
                event.left = window.innerWidth - $(_this.menu.dom).width();
            }
            $(_this.menu.dom).contextMenu('open', event);
        }, 10);
    }
    close() {
        $(this.menu.dom).contextMenu('close', event);
    }

    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            return this.menu.extensionCalled(action);
        }
        if (action.componentDesignerInvisibleComponentClicked) {
            var design = action.componentDesignerInvisibleComponentClicked.designButton.dom;
            return this.show(design);//{ top: $(design).offset().top, left: $(design).offset().left });

        }
        super.extensionCalled(action);
    }

    destroy() {
        this._value = undefined;
        while (this.contextComponents.length > 0) {
            this.unregisterComponent(this.contextComponents[0]);
        }
        $(this.menu.dom).contextMenu("menu", "#" + this.menu._id);
        $(this.menu.dom).contextMenu("destroy");
        this.menu.destroy();
        super.destroy();
    }

}
export async function test() {

    var Panel = classes.getClass("jassijs.ui.Panel");
    var Button = classes.getClass("jassijs.ui.Button");
    var MenuItem = classes.getClass("jassijs.ui.MenuItem");
    var FileNode = classes.getClass("jassijs.remote.FileNode");

    var bt = new Button();
    var cmen = new ContextMenu();
    var men = new MenuItem();
    //var pan=new Panel();

    men.text = "static Menu";
    men.onclick(() => { alert("ok"); });
    cmen.includeClassActions = true;
    cmen.menu.add(men);
    var nd = new FileNode();
    nd.name = "File";
    cmen.value = [nd];
    cmen.getActions = async function (objects: []): Promise<Action[]> {
        var all = objects;
        return [{
            name: "getActions-Action", call: function (ob: any[]) {
                alert(ob[0]["name"]);
            }
        }]
    };
    bt.contextMenu = cmen;
    bt.text = "hallo";
    //pan.add(bt);

    //bt.domWrapper.appendChild(cmen.domWrapper);
    //pan.add(cmen);
    return bt;
}