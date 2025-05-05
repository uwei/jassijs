var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Container", "jassijs/ui/Property", "jassijs/ui/UIComponent"], function (require, exports, Registry_1, Container_1, Property_1, UIComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Panel = void 0;
    let Panel = class Panel extends Container_1.Container {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = {}) {
            super(properties);
            this.isAbsolute = (properties === null || properties === void 0 ? void 0 : properties.isAbsolute) === true;
        }
        render() {
            var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
            return React.createElement(tag, Object.assign(Object.assign({}, this.props.domProperties), { className: "Panel" }));
        }
        set isAbsolute(value) {
            this.state.isAbsolute.current = value;
            if (this.dom.classList) {
                if (value)
                    this.dom.classList.add("jabsolutelayout");
                else
                    this.dom.classList.remove("jabsolutelayout");
            }
            // if (this._designMode !== undefined)
            //    this._setDesignMode(this._designMode);
            //if (this._designMode && this._activeComponentDesigner) {
            //    this._activeComponentDesigner.editDialog(true);
            // }
        }
        get isAbsolute() {
            return this.state.isAbsolute.current;
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
        /*extensionCalled(action: ExtensionAction) {
            if (action.componentDesignerSetDesignMode) {
                this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return action.componentDesignerSetDesignMode.enable;
            }
            super.extensionCalled(action);
        }*/
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
        destroy() {
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Panel.prototype, "isAbsolute", null);
    Panel = __decorate([
        (0, UIComponent_1.$UIComponent)({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] }),
        (0, Registry_1.$Class)("jassijs.ui.Panel"),
        (0, Property_1.$Property)({ name: "new", type: "json", componentType: "jassijs.ui.PanelProperties" }),
        (0, Property_1.$Property)({ name: "new/useSpan", type: "boolean", default: false }),
        __metadata("design:paramtypes", [Object])
    ], Panel);
    exports.Panel = Panel;
});
//# sourceMappingURL=Panel.js.map