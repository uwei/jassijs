
import jassi from "jassi/jassi";
import {Component,  $UIComponent } from "jassi/ui/Component";
import {Menu} from "jassi/ui/Menu";
import {Property,  $Property } from "jassi/ui/Property";
import { $Class } from "jassi/remote/Jassi";
import {Container} from "jassi/ui/Container";

//jassi.myRequire("lib/contextMenu.css");

@$UIComponent({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] })
@$Class("jassi.ui.MenuItem")
export  class MenuItem extends Container {
    /* get dom(){
         return this.dom;
     }*/
    _text: string;
    items: Menu;
    _icon: string;
    _mainMenu: Menu;
    _components: Component[];
    constructor() {
        super();

        super.init($('<li style="white-space: nowrap"><div><img class="menuitemicon" src="res/dummy.ico"/><span class="menuitemtext">.</span></div></li>')[0], { noWrapper: true });
        $(this.dom).addClass("designerNoResizable");
        this._text = "";
        this._icon = "";
        this.items = new Menu();
        $(this.items.dom).menu("destroy");
        this.items._parent = this;
        this._components = [this.items];//neede for getEditableComponents
        delete this.items._isRoot;

    }


    @$Property({ default: "function(event){\n\t\n}" })
    onclick(handler) {
        var _this = this;
        $("#" + this._id).click(function(ob) {
            handler(ob);
            //_this.this.items._parent.close();
        });
    }
    /**
    * @member {string} - the icon of the button
    */
    set icon(icon: string) { //the Code
        this._icon = icon;
        if (icon === "")
            icon = "res/dummy.ico";
        $(this.dom).find(".menuitemicon").attr("src", icon);
    }
    @$Property()
    get icon(): string { //the Code
        var ret = $(this.dom).find(".menuitemicon").attr("src");
        if (ret === "res/dummy.ico")
            ret = "";
        return ret;
    }
    /**
     * @member {string} - the caption of the button
     */
    set text(value: string) { //the Code
        //<li><div><img  src="res/car.ico" /><span>Save</span></div></li>
        this._text = value;
        var h: HTMLElement;

        (<HTMLElement>$(this.dom).find(".menuitemtext")[0]).innerText = value;
    }
    @$Property()
    get text(): string {
        return (<HTMLElement>$(this.dom).find(".menuitemtext")[0]).innerText;
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
            $(this.items.dom).addClass("jcontainer");//for drop-target

        }
        if (this.items._components.length > 0)
            $(this.dom).addClass("iw-has-submenu");
        else
            $(this.dom).removeClass("iw-has-submenu");

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
jassi.test = async function() {
    // kk.o=0;
    var menu = new Menu();
    var save = new MenuItem();
    var save2 = new MenuItem();

    menu.width = 200;
    menu.add(save);
    save.onclick(function() {
        alert("ok");
    });
    save.text = "dd";
    menu.add(save2);
    save2.text = "pppq";
    save2.icon = "res/button";
    save2.onclick(function(event) {

    });
    return menu;
}


