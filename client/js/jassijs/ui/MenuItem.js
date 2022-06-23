var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Menu", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ext/jquerylib"], function (require, exports, Component_1, Menu_1, Property_1, Registry_1, Container_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MenuItem = void 0;
    let MenuItem = class MenuItem extends Container_1.Container {
        //_components: Component[];
        constructor() {
            super();
            super.init('<li style="white-space: nowrap"><div><span class="menuitemspan"><img style="display: none" class="menuitemicon" /></span><span class="menuitemtext">.</span></div></li>', { noWrapper: true });
            this.dom.classList.add("designerNoResizable");
            this._text = "";
            this._icon = "";
            this.items = new Menu_1.Menu();
            $(this.items.dom).menu("destroy");
            this.items._parent = this;
            this._components = [this.items]; //neede for getEditableComponents
            delete this.items._isRoot;
        }
        config(config) {
            super.config(config);
            return this;
        }
        onclick(handler) {
            this.on("click", handler);
        }
        set icon(icon) {
            this._icon = icon;
            var img;
            var el1 = this.dom.querySelector(".menuitemspan");
            el1.setAttribute("class", ""); //removeClass();
            el1.classList.add("menuitemspan");
            this.dom.querySelector(".menuitemicon").setAttribute("src", "");
            if (icon === null || icon === void 0 ? void 0 : icon.startsWith("mdi")) {
                icon.split(" ").forEach((cl) => el1.classList.add(cl));
                this.dom.querySelector(".menuitemicon").style.display = "none";
            }
            else {
                if (icon)
                    this.dom.querySelector(".menuitemicon").style.display = "initial";
                this.dom.querySelector(".menuitemicon").setAttribute("src", icon);
            }
            //if (icon === "")
            //    icon = "res/dummy.ico";
            //$(this.dom).find(".menuitemicon").attr("src", icon);
        }
        get icon() {
            var ret = this.dom.querySelector(".menuitemicon").getAttribute("src");
            if (ret === "") {
                ret = this.dom.querySelector(".menuitemicon").getAttribute("class").replace("menuitemspan ", "");
            }
            return ret;
        }
        set text(value) {
            //<li><div><img  src="res/car.ico" /><span>Save</span></div></li>
            this._text = value;
            var h;
            this.dom.querySelector(".menuitemtext").innerText = value;
        }
        get text() {
            return this.dom.querySelector(".menuitemtext").innerText;
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
                this.items.dom.classList.add("jcontainer"); //for drop-target
            }
            if (this.items._components.length > 0)
                this.dom.classList.add("iw-has-submenu");
            else
                this.dom.classList.remove("iw-has-submenu");
            if (this._parent !== undefined && this._parent._menueChanged !== undefined)
                this._parent._menueChanged();
        }
        extensionCalled(action) {
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
    };
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], MenuItem.prototype, "onclick", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "icon", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], MenuItem.prototype, "text", null);
    MenuItem = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/MenuItem", icon: "mdi mdi-menu-open", initialize: { text: "menu" }, editableChildComponents: ["items"] }),
        (0, Registry_1.$Class)("jassijs.ui.MenuItem"),
        __metadata("design:paramtypes", [])
    ], MenuItem);
    exports.MenuItem = MenuItem;
    async function test() {
        // kk.o=0;
        var menu = new Menu_1.Menu();
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
        save2.icon = "mdi mdi-car"; //"res/red.jpg";
        save2.onclick(function (event) {
        });
        return menu;
    }
    exports.test = test;
});
//# sourceMappingURL=MenuItem.js.map