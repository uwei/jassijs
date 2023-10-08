var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property"], function (require, exports, Registry_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Container = exports.ContainerProperties = void 0;
    let ContainerProperties = class ContainerProperties extends Component_1.ComponentProperties {
    };
    __decorate([
        (0, Property_1.$Property)({ type: "jassijs.ui.Component" }),
        __metadata("design:type", Object)
    ], ContainerProperties.prototype, "children", void 0);
    ContainerProperties = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.ContainerProperties")
    ], ContainerProperties);
    exports.ContainerProperties = ContainerProperties;
    let Container = class Container extends Component_1.Component {
        /**
         *
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            super(properties);
            this._components = [];
        }
        config(config, forceRender = false) {
            if (config === null || config === void 0 ? void 0 : config.children) {
                if ((config === null || config === void 0 ? void 0 : config.children.length) > 0 && (config === null || config === void 0 ? void 0 : config.children[0]) instanceof Component_1.Component) {
                    this.removeAll(false);
                    for (var x = 0; x < config.children.length; x++) {
                        this.add(config.children[x]);
                    }
                    delete config.children;
                }
            }
            super.config(config);
            return this;
        }
        /**
        * inits the component
        * @param {dom} dom - init the dom element
        * @paran {object} properties - properties to init
       */
        init(dom, properties = undefined) {
            super.init(dom, properties);
            this.domWrapper.classList.add("jcontainer");
        }
        /**
         * adds a component to the container
         * @param {jassijs.ui.Component} component - the component to add
         */
        add(component) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper._parent = this;
            /* component._parent=this;
             component.domWrapper._parent=this;
             if(component.domWrapper.parentNode!==null&&component.domWrapper.parentNode!==undefined){
                  component.domWrapper.parentNode.removeChild(component.domWrapper);
             }*/
            if (this["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.push(component);
            this.dom.appendChild(component.domWrapper);
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component._parent !== undefined) {
                component._parent.remove(component);
            }
            component._parent = this;
            component.domWrapper["_parent"] = this;
            var index = this._components.indexOf(before);
            if (component.domWrapper.parentNode !== null && component.domWrapper.parentNode !== undefined) {
                component.domWrapper.parentNode.removeChild(component.domWrapper);
            }
            if (component["designDummyFor"])
                this.designDummies.push(component);
            else
                this._components.splice(index, 0, component);
            before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        }
        /**
       * remove the component
       * @param {jassijs.ui.Component} component - the component to remove
       * @param {boolean} destroy - if true the component would be destroyed
       */
        remove(component, destroy = false) {
            var _a;
            if (destroy)
                component.destroy();
            component._parent = undefined;
            if (component.domWrapper !== undefined)
                component.domWrapper._parent = undefined;
            if (this._components) {
                var pos = this._components.indexOf(component);
                if (pos >= 0)
                    this._components.splice(pos, 1);
            }
            let posd = (_a = this.designDummies) === null || _a === void 0 ? void 0 : _a.indexOf(component);
            if (posd >= 0)
                this.designDummies.splice(posd, 1);
            try {
                this.dom.removeChild(component.domWrapper);
            }
            catch (ex) {
            }
        }
        /**
       * remove all component
       * @param {boolean} destroy - if true the component would be destroyed
       */
        removeAll(destroy = undefined) {
            while (this._components.length > 0) {
                this.remove(this._components[0], destroy);
            }
        }
        destroy() {
            if (this._components !== undefined) {
                var tmp = [].concat(this._components);
                for (var k = 0; k < tmp.length; k++) {
                    tmp[k].destroy();
                }
                this._components = [];
            }
            super.destroy();
        }
    };
    Container = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.Container"),
        __metadata("design:paramtypes", [Object])
    ], Container);
    exports.Container = Container;
});
//# sourceMappingURL=Container.js.map