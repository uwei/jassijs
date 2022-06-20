
import { Component, $UIComponent } from "jassijs/ui/Component";
import { Menu } from "jassijs/ui/Menu";
import { Property, $Property } from "jassijs/ui/Property";
import { $Class } from "jassijs/remote/Registry";
import { Container, ContainerConfig } from "jassijs/ui/Container";

export interface MenuItemConfig extends ContainerConfig {

    onclick?(handler);
    /**
     * @member {string} - the icon of the button
     */
    icon: string;
    /**
    * @member {string} - the caption of the button
    */
    text?: string;
}
@$UIComponent({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] })
@$Class("jassijs.ui.MenuItem")
export class MenuItem extends Container implements ContainerConfig {
    /* get dom(){
         return this.dom;
     }*/
    _text: string;
    items: Menu;
    _icon: string;
    _mainMenu: Menu;
    //_components: Component[];
    constructor() {
        super();

        super.init('<li style="white-space: nowrap"><div><span class="menuitemspan"><img style="display: none" class="menuitemicon" /></span><span class="menuitemtext">.</span></div></li>', { noWrapper: true });
        this.dom.classList.add("designerNoResizable");
        this._text = "";
        this._icon = "";
        this.items = new Menu();
        $(this.items.dom).menu("destroy");
        this.items._parent = this;
        this._components = [this.items];//neede for getEditableComponents
        delete this.items._isRoot;

    }
    config(config: MenuItemConfig): MenuItem {
        super.config(config);
        return this;
    }

    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        this.on("click",handler);
    }
    set icon(icon: string) { //the Code
        this._icon = icon;
        var img;
        var el1 = this.dom.querySelector(".menuitemspan");
        el1.setAttribute("class","");//removeClass();
        el1.classList.add("menuitemspan");
        this.dom.querySelector(".menuitemicon").setAttribute("src", "");
        if (icon?.startsWith("mdi")) {
            icon.split(" ").forEach((cl)=>el1.classList.add(cl)) ;
            (<HTMLElement> this.dom.querySelector(".menuitemicon")).style.display= "none";
        } else {
            if (icon)
                (<HTMLElement> this.dom.querySelector(".menuitemicon")).style.display="initial";
            this.dom.querySelector(".menuitemicon").setAttribute("src", icon);
        }

        //if (icon === "")
        //    icon = "res/dummy.ico";
        //$(this.dom).find(".menuitemicon").attr("src", icon);
    }
    @$Property()
    get icon(): string { //the Code
        var ret = this.dom.querySelector(".menuitemicon").getAttribute("src");
        if (ret === "") {
            ret = this.dom.querySelector(".menuitemicon").getAttribute("class").replace("menuitemspan ", "");
        }
        return ret;

    }
    set text(value: string) { //the Code
        //<li><div><img  src="res/car.ico" /><span>Save</span></div></li>
        this._text = value;
        var h: HTMLElement;

        (<HTMLElement>this.dom.querySelector(".menuitemtext")).innerText = value;
    }
    @$Property()
    get text(): string {
        return (<HTMLElement>this.dom.querySelector(".menuitemtext")).innerText;
    }
    destroy() {
        super.destroy();
        this.items.destroy;
    }
    getMainMenu() {
        if (this._parent !== undefined && this._parent.getMainMenu !== undefined)
            return this._parent.getMainMenu();
        if (this._mainMenu !== undefined)
            return this._mainMenu;
        return undefined;
    }
    _menueChanged() {
        if (this.items._components.length > 0 && this.items.dom.parentNode !== this.dom) {
            this.items.dom.parentNode.removeChild(this.items.dom);
            this.dom.appendChild(this.items.dom);
            this.items.dom.classList.add("jcontainer");//for drop-target

        }
        if (this.items._components.length > 0)
            this.dom.classList.add("iw-has-submenu");
        else
            this.dom.classList.remove("iw-has-submenu");

        if (this._parent !== undefined && this._parent._menueChanged !== undefined)
            this._parent._menueChanged();
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._designMode = action.componentDesignerSetDesignMode.enable;
            return this.items.extensionCalled(action); //setDesignMode(enable);
        }
        if (action.componentDesignerComponentCreated) {
            var x = 0;
            var test = this.getMainMenu();
            if (test !== undefined) {
                //$(test.menu.dom).css("display","inline-block");//
                test._menueChanged();
            }
            return;
            //var design=codeeditor._design.dom;
            //component.show({top:$(design).offset().top+30,left:$(design).offset().left+5});
        }
        super.extensionCalled(action);
    }


}
export async function test() {
    // kk.o=0;
    var menu = new Menu();
    var save = new MenuItem();
    var save2 = new MenuItem();

    menu.width = 200;
    menu.add(save);
    save.onclick(function () {
        alert("ok");
    });
    save.text = "dd";
    save.items.add(save2);
    save2.text = "pppq";
    save2.icon = "mdi mdi-car";//"res/red.jpg";
    save2.onclick(function (event) {

    });
    return menu;
}


