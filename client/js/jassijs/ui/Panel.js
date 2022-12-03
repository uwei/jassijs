var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/ui/DesignDummy"], function (require, exports, Registry_1, Container_1, Component_1, Property_1, DesignDummy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Panel = exports.PanelCreateProperties = void 0;
    let PanelCreateProperties = class PanelCreateProperties extends Component_1.ComponentCreateProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ default: false }),
        __metadata("design:type", Boolean)
    ], PanelCreateProperties.prototype, "useSpan", void 0);
    PanelCreateProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.PanelCreateProperties")
    ], PanelCreateProperties);
    exports.PanelCreateProperties = PanelCreateProperties;
    let Panel = 
    //@$Property({ name: "new/useSpan", type: "boolean", default: false })
    class Panel extends Container_1.Container {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            var addStyle = "";
            var tag = properties !== undefined && properties.useSpan === true ? "span" : "div";
            if (properties != undefined && properties.id === "body") {
                super();
                this.dom = document.body;
                this.domWrapper = this.dom;
                /** @member {numer}  - the id of the element */
                this._id = "body";
                this.dom.id = "body";
                //super.init($('<div class="Panel" style="border:1px solid #ccc;"/>')[0]);
                //            $(document.body).append(this.domWrapper); 
            }
            else {
                super(properties);
                if (properties === undefined || properties.id === undefined) {
                    //super.init($('<div class="Panel"/>')[0]);
                    super.init('<' + tag + ' class="Panel" />');
                }
            }
            this._designMode = false;
            this.isAbsolute = false;
        }
        config(config) {
            super.config(config);
            return this;
        }
        set isAbsolute(value) {
            this._isAbsolute = value;
            if (value)
                this.dom.classList.add("jabsolutelayout");
            else
                this.dom.classList.remove("jabsolutelayout");
            if (this._designMode !== undefined)
                this._setDesignMode(this._designMode);
            if (this._designMode && this._activeComponentDesigner) {
                this._activeComponentDesigner.editDialog(true);
            }
        }
        get isAbsolute() {
            return this._isAbsolute;
        }
        max() {
            if (this._id == "body") {
                this.domWrapper.style.width = "100%";
                this.domWrapper.style.height = "calc(100vh - 2px)";
            }
            else {
                this.domWrapper.style.width = "100%";
                this.domWrapper.style.height = "100%";
            }
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            // $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.add(component);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //   $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
            return super.addBefore(component, before);
        }
        /**
         * activates or deactivates designmode
         * @param {boolean} enable - true if activate designMode
         */
        _setDesignMode(enable) {
            this._designMode = enable;
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false) {
                    DesignDummy_1.DesignDummy.createIfNeeded(this, "atEnd", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                    /*            if (this._designDummy === undefined && this.isAbsolute === false) {
                                    this._designDummy = new Image();
                                    this._designDummy._parent=this;
                                    console.log(this._designDummy._id);
                                    $(this._designDummy.domWrapper).removeClass("jcomponent");
                                    $(this._designDummy.domWrapper).addClass("jdesigndummy");
                                    $(this._designDummy.domWrapper).css("width","16px");
                                    this._designDummy["designDummyFor"] = "atEnd";
                                    this._designDummy["src"] = "res/add-component.ico";
                                    this._designDummy["_editorselectthis"]=(this["_editorselectthis"]?this["_editorselectthis"]:this);
                                    //$(this.domWrapper).append(this._designDummy.domWrapper);
                                    this.domWrapper.appendChild(this._designDummy.domWrapper);
                                } else if (this._designDummy !== undefined && this.isAbsolute === true) {
                                    this.remove(this._designDummy);
                                    this._designDummy.destroy();
                                    this._designDummy = undefined;
                                }*/
                }
                else {
                    DesignDummy_1.DesignDummy.destroyIfNeeded(this, "atEnd");
                    /* if (this._designDummy !== undefined) {
                         this.remove(this._designDummy);
                         this._designDummy = undefined;
                     }*/
                }
            }
            else {
                DesignDummy_1.DesignDummy.destroyIfNeeded(this, "atEnd");
            }
            if (enable) { //dummy in containers at the end
                if (this.isAbsolute === false) {
                    for (var x = 0; x < this._components.length; x++) {
                        var comp = this._components[x];
                        if (comp instanceof Container_1.Container && !comp.dom.classList.contains("jdisableaddcomponents")) {
                            DesignDummy_1.DesignDummy.createIfNeeded(comp, "beforeComponent", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                        }
                    }
                }
            }
            else {
                for (var x = 0; x < this._components.length; x++) {
                    var comp = this._components[x];
                    DesignDummy_1.DesignDummy.destroyIfNeeded(comp, "beforeComponent");
                }
            }
        }
        destroy() {
            super.destroy();
            if (this._designDummy)
                this._designDummy.destroy();
            this._activeComponentDesigner = undefined;
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Panel.prototype, "isAbsolute", null);
    Panel = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] }),
        (0, Registry_1.$Class)("jassijs.ui.Panel"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.PanelCreateProperties" })
        //@$Property({ name: "new/useSpan", type: "boolean", default: false })
        ,
        __metadata("design:paramtypes", [PanelCreateProperties])
    ], Panel);
    exports.Panel = Panel;
});
//# sourceMappingURL=Panel.js.map