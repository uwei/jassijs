var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Container", "jassijs/ui/Property", "jassijs/ui/MenuItem", "jassijs/remote/Jassi", "jassijs/ui/Component", "jassijs/ui/DesignDummy"], function (require, exports, Container_1, Property_1, MenuItem_1, Jassi_1, Component_1, DesignDummy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Menu = void 0;
    /*declare global {
        interface JQuery {
                //menu: any;
        }
    }*/
    let Menu = class Menu extends Container_1.Container {
        constructor(options = undefined) {
            super();
            this._isRoot = true;
            super.init($('<ul ' + ` style="Menu"></ul>`)[0]);
            if (options !== undefined && options.noUpdate === true) {
                this._noUpdate = true;
            }
            else
                $(this.dom).menu();
            this._text = "";
            this._icon = "";
        }
        _sample() {
            super.init($('<ul ' + ` class="Menu">
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
            if (this._designDummy !== undefined && this._components[this._components.length - 1] === this._designDummy)
                super.addBefore(component, this._designDummy);
            else
                super.add(component);
            this._menueChanged();
        }
        onclick(handler) {
            $("#" + this._id).click(function (ob) {
                handler(ob);
            });
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * activates or deactivates designmode
        * @param {boolean} enable - true if activate designMode
        */
        _setDesignMode(enable) {
            this._designMode = enable;
            if (enable) { //dummy at the end
                DesignDummy_1.DesignDummy.createIfNeeded(this, "atEnd", undefined, MenuItem_1.MenuItem);
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
            }
            else {
                DesignDummy_1.DesignDummy.destroyIfNeeded(this, "atEnd");
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
    };
    __decorate([
        Property_1.$Property({ name: "onclick", type: "function", default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Menu.prototype, "onclick", null);
    Menu = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Menu", icon: "mdi mdi-menu", initialize: { text: "menu" } }),
        Jassi_1.$Class("jassijs.ui.Menu"),
        __metadata("design:paramtypes", [Object])
    ], Menu);
    exports.Menu = Menu;
});
//# sourceMappingURL=Menu.js.map