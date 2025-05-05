var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Container", "jassijs/ui/Property", "jassijs/ui/MenuItem", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/UIComponents", "jassijs/ext/jquerylib"], function (require, exports, Container_1, Property_1, MenuItem_1, Registry_1, Component_1, UIComponents_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Menu = void 0;
    let Menu = class Menu extends Container_1.Container {
        constructor(options = {}) {
            var _a;
            options.useWrapper = true;
            super(options);
            this._isRoot = true;
            if (((_a = this.props) === null || _a === void 0 ? void 0 : _a.noUpdate) === true) {
                this._noUpdate = true;
            }
            else
                $(this.dom).menu();
            this._text = "";
            this._icon = "";
        }
        componentDidMount() {
        }
        render() {
            return React.createElement("ul", { className: "InvisibleComponent" /*, style= "Menu" */ });
        }
        config(config) {
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
        addBefore(component, before) {
            super.addBefore(component, before);
            this._menueChanged();
        }
        /**
          * adds a component to the container
          * @param {jassijs.ui.Menu} component - the component to add
          */
        add(component) {
            super.add(component);
            this._menueChanged();
        }
        onclick(handler) {
            document.getElementById(this._id).addEventListener("click", function (ob) {
                handler(ob);
            });
        }
        destroy() {
            $(this.dom).menu();
            $(this.dom).menu("destroy");
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Menu.prototype, "onclick", null);
    Menu = __decorate([
        (0, UIComponents_1.$UIComponent)({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } }),
        (0, Registry_1.$Class)("jassijs.ui.Menu"),
        __metadata("design:paramtypes", [Object])
    ], Menu);
    exports.Menu = Menu;
    function test() {
        var men = (0, Component_1.jc)(Menu, {
            children: [
                (0, Component_1.jc)(MenuItem_1.MenuItem, {
                    text: "Hallodd",
                    children: []
                }),
                (0, Component_1.jc)(MenuItem_1.MenuItem, { text: "sdfsdf" })
            ]
        });
        return (0, Component_1.createComponent)(men);
    }
    exports.test = test;
});
//# sourceMappingURL=Menu.js.map