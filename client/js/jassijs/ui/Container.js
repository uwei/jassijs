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
    exports.Container = void 0;
    let Container = class Container extends Component_1.Component {
        /**
         *
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties) {
            var _a, _b;
            super(properties);
            if ((_a = this.domWrapper) === null || _a === void 0 ? void 0 : _a.classList)
                (_b = this.domWrapper) === null || _b === void 0 ? void 0 : _b.classList.add("jcontainer");
        }
        createChildren(props) {
            if (this._components === undefined)
                this._components = [];
            if (props === null || props === void 0 ? void 0 : props.children) {
                this.removeAll(false);
                this._components = [];
                for (var x = 0; x < props.children.length; x++) {
                    var child = props.children[x];
                    var cchild;
                    if (typeof child === "string") {
                        cchild = new Component_1.TextComponent();
                        cchild.tag = "";
                        cchild.text = child;
                    }
                    else if (child === null || child === void 0 ? void 0 : child._$isState$_) {
                        cchild = new Component_1.TextComponent();
                        cchild.tag = "";
                        child === null || child === void 0 ? void 0 : child._observe_(cchild, "text", "property");
                        cchild.text = child.current;
                    }
                    else {
                        cchild = (0, Component_1.createComponent)(child);
                    }
                    this.add(cchild);
                }
                //delete props.children;
            }
            // this.state.children=props?.children;
        }
        /*   if (config?.children) {
                       if (config?.children.length > 0 && config?.children[0] instanceof Component) {
                           this.removeAll(false);
                           for (var x = 0; x < config.children.length; x++) {
                               this.add(config.children[x]);
                           }
                           delete config.children;
                       }
           }*/
        config(config, forceRender = false) {
            if (super.config(config))
                this.createChildren(config);
            /*if (config?.children) {
                if (config?.children.length > 0 && config?.children[0] instanceof Component) {
                    this.removeAll(false);
                    for (var x = 0; x < config.children.length; x++) {
                        this.add(config.children[x]);
                    }
                    delete config.children;
                }
            }*/
            return this;
        }
        /**
        * inits the component
        * @param {dom} dom - init the dom element
        * @paran {object} properties - properties to init
       */
        //  init(dom) {
        //    super.init(dom);
        // }
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
            this._components.splice(index, 0, component);
            this.dom.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
            //before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
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
            //@ts-ignore
            let posd = (_a = this.designDummies) === null || _a === void 0 ? void 0 : _a.indexOf(component);
            if (posd >= 0) {
                //@ts-ignore
                this.designDummies.splice(posd, 1);
            }
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
            var _a;
            while (((_a = this._components) === null || _a === void 0 ? void 0 : _a.length) > 0) {
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
        (0, Property_1.$Property)({ name: "children", type: "jassijs.ui.Component" }),
        __metadata("design:paramtypes", [Object])
    ], Container);
    exports.Container = Container;
});
//# sourceMappingURL=Container.js.map