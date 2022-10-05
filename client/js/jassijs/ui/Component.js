var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/CSSProperties"], function (require, exports, Registry_1, Property_1, Registry_2, Classes_1, CSSProperties_1) {
    "use strict";
    var Component_1, _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = exports.ComponentCreateProperties = exports.$UIComponent = exports.UIComponentProperties = void 0;
    //import { CSSProperties } from "jassijs/ui/Style";
    jassijs.includeCSSFile("jassijs.css");
    jassijs.includeCSSFile("materialdesignicons.min.css");
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_2.default.register("$UIComponent", pclass, properties);
        };
    }
    exports.$UIComponent = $UIComponent;
    class ComponentCreateProperties {
    }
    exports.ComponentCreateProperties = ComponentCreateProperties;
    let Component = Component_1 = class Component {
        /*  get domWrapper():Element{
              return this._domWrapper;
          }
          set domWrapper(element:Element){
              if(element===undefined){
                  debugger;
              }
              this._domWrapper=element;
          }*/
        /**
         * base class for each Component
         * @class jassijs.ui.Component
         * @param {object} properties - properties to init
         * @param {string} [properties.id] -  connect to existing id (not reqired)
         *
         */
        constructor(properties = undefined) {
            if (properties === undefined || properties.id === undefined) {
            }
            else {
                this._id = properties.id;
                this.__dom = document.getElementById(properties.id);
                this.dom._this = this;
            }
        }
        config(config) {
            for (var key in config) {
                if (typeof this[key] === 'function') {
                    this[key](config[key]);
                }
                else {
                    this[key] = config[key];
                }
            }
            return this;
            //    return new c();
        }
        static onComponentCreated(func) {
            this._componentHook.push(func);
        }
        static offComponentCreated(func) {
            var pos = this._componentHook.indexOf(func);
            if (pos >= 0)
                this._componentHook.splice(pos, 1);
        }
        /**
         * adds an event
         * @param {type} name - the name of the event
         * @param {function} func - callfunction for the event
         */
        addEvent(name, func) {
            var events = this._eventHandler[name];
            if (events === undefined) {
                events = [];
                this._eventHandler[name] = events;
            }
            events.push(func);
        }
        /**
         * call the event
         * @param {name} name - the name of the event
         * @param {object} param 1- parameter for the event
         * @param {object} param 2- parameter for the event
         * @param {object} param 3- parameter for the event
         * @param {object} param 4- parameter for the event
         */
        callEvent(name, param1, param2 = undefined, param3 = undefined, param4 = undefined) {
            var ret = [];
            var events = this._eventHandler[name];
            if (events === undefined)
                return;
            for (var x = 0; x < events.length; x++) {
                ret.push(events[x](param1, param2, param3, param4));
            }
            return ret;
        }
        /**
         * @member {dom} - the dom element
         */
        get dom() {
            return this.__dom;
        }
        set dom(value) {
            var domalt = this.__dom;
            this.__dom = value;
            /** @member {dom} - the dom-element*/
            /** @member {numer}  - the id of the element */
            this.dom.classList.add("jinlinecomponent");
            this.dom.classList.add("jresizeable");
            if (domalt !== undefined) {
                domalt.classList.remove("jinlinecomponent");
                domalt.classList.remove("jresizeable");
            }
            this.dom._this = this;
        }
        onfocus(handler) {
            return this.on("focus", handler);
        }
        onblur(handler) {
            return this.on("blur", handler);
        }
        /**
         * attach an eventhandler
         * @returns the handler to off the event
         */
        on(eventname, handler) {
            this.dom.addEventListener(eventname, handler);
            /*let func = function (e) {
                 handler(e);
             };*/
            return handler;
        }
        off(eventname, handler = undefined) {
            this.dom.removeEventListener(eventname, handler);
        }
        static cloneAttributes(target, source) {
            [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue); });
        }
        static replaceWrapper(old, newWrapper) {
            //Component.cloneAttributes(newWrapper,old.domWrapper);
            var cls = old.domWrapper.getAttribute("class");
            var id = old.domWrapper.getAttribute("id"); //old.domWrapper._id;
            newWrapper.setAttribute("id", id);
            newWrapper.setAttribute("class", cls);
            while (old.domWrapper.children.length > 0) {
                newWrapper.appendChild(old.domWrapper.children[0]);
            }
            if (old.domWrapper.parentNode != null)
                old.domWrapper.parentNode.replaceChild(newWrapper, old.domWrapper);
            old.domWrapper = newWrapper;
            old.domWrapper._this = old;
            old.domWrapper._id = id;
        }
        /**
         * create an Element from an htmlstring e.g. createDom("<input/>")
         */
        static createHTMLElement(html) {
            var lower = html.toLocaleLowerCase();
            if (lower.startsWith("<td") || lower.startsWith("<tr")) {
                const template = document.createElement("template");
                template.innerHTML = html;
                const node = template.content.firstElementChild;
                return node;
            }
            else
                return document.createRange().createContextualFragment(html).children[0];
        }
        /**
         * inits the component
         * @param {dom} dom - init the dom element
         * @paran {object} properties - properties to init
        */
        init(dom, properties = undefined) {
            if (typeof dom === "string")
                dom = Component_1.createHTMLElement(dom);
            //is already attached
            if (this.domWrapper !== undefined) {
                if (this.domWrapper.parentNode !== undefined)
                    this.domWrapper.parentNode.removeChild(this.domWrapper);
                this.domWrapper._this = undefined;
            }
            if (this.dom !== undefined) {
                this.__dom._this = undefined;
            }
            //notify Hook
            for (var x = 0; x < Component_1._componentHook.length; x++) {
                Component_1._componentHook[x]("precreate", this);
            }
            //allready watched?
            // if (jassijs.componentSpy !== undefined) {
            //   jassijs.componentSpy.unwatch(this);
            // }
            this.dom = dom;
            this._id = "j" + Registry_2.default.nextID();
            this.dom.setAttribute("id", this._id);
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
            //add _this to the dom element
            var lid = "j" + Registry_2.default.nextID();
            var st = 'style="display: inline-block"';
            if (this instanceof Classes_1.classes.getClass("jassijs.ui.Container")) {
                st = "";
            }
            if (properties !== undefined && properties.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                this.domWrapper.classList.add("jcomponent");
            }
            else {
                /** @member {dom} - the dom element for label*/
                let strdom = '<div id="' + lid + '" class ="jcomponent"' + st + '></div>';
                this.domWrapper = Component_1.createHTMLElement(strdom);
                this.domWrapper._this = this;
                this.domWrapper._id = lid;
                this.domWrapper.appendChild(dom);
            }
            //append temporary so new elements must not added immediately
            if (document.getElementById("jassitemp") === null) {
                var temp = Component_1.createHTMLElement('<template id="jassitemp"></template>');
                document.body.appendChild(temp);
            }
            //notify Hook
            for (var x = 0; x < Component_1._componentHook.length; x++) {
                Component_1._componentHook[x]("create", this);
            }
            //for profilling save code pos
            //if (jassijs.componentSpy !== undefined) {
            //     jassijs.componentSpy.watch(this);
            //  }
            document.getElementById("jassitemp").appendChild(this.domWrapper);
        }
        set label(value) {
            if (value === undefined) {
                var lab = this.domWrapper.querySelector(".jlabel"); //this.domWrapper.getElementsByClassName("jlabel");
                if (lab)
                    this.domWrapper.removeChild(lab);
            }
            else {
                //CHECK children(0)-> first() 
                if (!this.domWrapper.querySelector(".jlabel")) {
                    let lab = Component_1.createHTMLElement('<label class="jlabel" for="' + this._id + '"></label>'); //
                    this.domWrapper.prepend(lab);
                }
                this.domWrapper.querySelector(".jlabel").innerHTML = value;
            }
        }
        get label() {
            var _a;
            return (_a = this.domWrapper.querySelector(".jlabel")) === null || _a === void 0 ? void 0 : _a.innerHTML;
        }
        get tooltip() {
            return this.dom.getAttribute("title");
        }
        set tooltip(value) {
            this.dom.setAttribute("title", value);
        }
        get x() {
            return Number(this.domWrapper.style.left.replace("px", ""));
        }
        set x(value) {
            this.domWrapper.style.left = value.toString().replace("px", "") + "px";
            this.domWrapper.style.position = "absolute";
        }
        get y() {
            return Number(this.domWrapper.style.top.replace("px", ""));
        }
        set y(value) {
            this.domWrapper.style.top = value.toString().replace("px", "") + "px";
            this.domWrapper.style.position = "absolute";
        }
        get hidden() {
            return (this.dom.getAttribute("hidden") === "");
        }
        set hidden(value) {
            if (value)
                this.dom.setAttribute("hidden", "");
            else
                this.dom.removeAttribute("hidden");
        }
        set width(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            value = value.toString();
            if (!isNaN(value))
                value = value + "px";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && this.domWrapper.style.display !== "inline") {
                this.dom.style.width = "100%";
                this.domWrapper.style.width = value;
            }
            else {
                this.dom.style.width = value.toString();
                this.domWrapper.style.width = "";
            }
            //  
        }
        get width() {
            if (this.domWrapper.style.width !== undefined)
                return this.domWrapper.style.width;
            return this.dom.style.width.replace("px", "");
        }
        set height(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            value = value.toString();
            if (!isNaN(value))
                value = value + "px";
            if (typeof (value) === "string" && value.indexOf("%") > -1) {
                this.dom.style.height = "100%";
                this.domWrapper.style.height = value;
            }
            else {
                this.dom.style.height = value.toString();
                this.domWrapper.style.height = "";
            }
        }
        get height() {
            if (this.domWrapper.style.height !== undefined)
                return this.domWrapper.style.height;
            if (this.dom.style.height !== undefined)
                return undefined;
            return this.dom.style.height.replace("px", "");
        }
        set css(properties) {
            var prop = CSSProperties_1.CSSProperties.applyTo(properties, this);
            //if css-properties are already set and now a properties is deleted
            if (this["_lastCssChange"]) {
                for (let key in this["_lastCssChange"]) {
                    if (prop[key] === undefined) {
                        this.dom.style[key] = "";
                    }
                }
            }
            this["_lastCssChange"] = prop;
        }
        /**
         * maximize the component
         */
        maximize() {
            this.dom.style.width = "calc(100% - 2px)";
            this.dom.style.height = "calc(100% - 2px)";
        }
        get styles() {
            return this._styles;
        }
        set styles(styles) {
            this._styles = styles;
            var newstyles = [];
            styles.forEach((st) => {
                newstyles.push(st.styleid);
            });
            //removeOld
            var classes = this.dom.getAttribute("class").split(" ");
            classes.forEach((cl) => {
                if (cl.startsWith("jassistyle") && newstyles.indexOf(cl) === -1) {
                    this.dom.classList.remove(cl);
                }
            });
            newstyles.forEach((st) => {
                if (classes.indexOf(st) === -1)
                    this.dom.classList.add(st);
            });
        }
        get contextMenu() {
            return this._contextMenu;
        }
        set contextMenu(value) {
            if (this._contextMenu !== undefined)
                this._contextMenu.unregisterComponent(this);
            if (value !== undefined) {
                var ContextMenu = Classes_1.classes.getClass("jassijs.ui.ContextMenu");
                if (value instanceof ContextMenu === false) {
                    throw new Error("value is not of type jassijs.ui.ContextMenu");
                }
                this._contextMenu = value;
                value.registerComponent(this);
            }
            else
                this._contextMenu = undefined;
        }
        destroy() {
            if (this.contextMenu !== undefined) {
                this.contextMenu.destroy();
            }
            //notify Hook
            for (var x = 0; x < Component_1._componentHook.length; x++) {
                Component_1._componentHook[x]("destroy", this);
            }
            // if (jassijs.componentSpy !== undefined) {
            //    jassijs.componentSpy.unwatch(this);
            //  }
            if (this._parent !== undefined) {
                this._parent.remove(this);
            }
            if (this.domWrapper !== undefined && this.domWrapper.parentNode !== undefined && this.domWrapper.parentNode !== null)
                this.domWrapper.parentNode.removeChild(this.domWrapper);
            if (this.__dom !== undefined) {
                this.__dom.remove();
                this.__dom._this = undefined;
                this.__dom = undefined;
            }
            if (this.domWrapper !== undefined) {
                this.domWrapper.remove();
                this.domWrapper._this = undefined;
                this.domWrapper = undefined;
            }
            if (this.designDummies) {
                this.designDummies.forEach((dummy) => { dummy.destroy(); });
            }
            this.events = [];
        }
        extensionCalled(action) {
        }
    };
    Component._componentHook = [];
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Component.prototype, "onfocus", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], Component.prototype, "onblur", null);
    __decorate([
        (0, Property_1.$Property)({ description: "adds a label above the component" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "label", null);
    __decorate([
        (0, Property_1.$Property)({ description: "tooltip are displayed on mouse over" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Component.prototype, "tooltip", null);
    __decorate([
        (0, Property_1.$Property)({}),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "x", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], Component.prototype, "y", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], Component.prototype, "hidden", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "width", null);
    __decorate([
        (0, Property_1.$Property)({ type: "string" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "height", null);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", typeof (_a = typeof CSSProperties_1.CSSProperties !== "undefined" && CSSProperties_1.CSSProperties) === "function" ? _a : Object),
        __metadata("design:paramtypes", [typeof (_b = typeof CSSProperties_1.CSSProperties !== "undefined" && CSSProperties_1.CSSProperties) === "function" ? _b : Object])
    ], Component.prototype, "css", null);
    __decorate([
        (0, Property_1.$Property)({ type: "componentselector", componentType: "[jassijs.ui.Style]" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Component.prototype, "styles", null);
    __decorate([
        (0, Property_1.$Property)({ type: "componentselector", componentType: "jassijs.ui.ContextMenu" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "contextMenu", null);
    Component = Component_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.Component"),
        __metadata("design:paramtypes", [ComponentCreateProperties])
    ], Component);
    exports.Component = Component;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vamFzc2lqcy91aS9Db21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFPQSxtREFBbUQ7SUFFbkQsT0FBTyxDQUFDLGNBQWMsQ0FBRSxhQUFhLENBQUMsQ0FBQztJQUN2QyxPQUFPLENBQUMsY0FBYyxDQUFFLDZCQUE2QixDQUFDLENBQUM7SUFZdkQsTUFBYSxxQkFBcUI7S0FnQmpDO0lBaEJELHNEQWdCQztJQUNELFNBQWdCLFlBQVksQ0FBQyxVQUFpQztRQUMxRCxPQUFPLFVBQVUsTUFBTTtZQUNuQixrQkFBUSxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQTtJQUNMLENBQUM7SUFKRCxvQ0FJQztJQUNELE1BQWEseUJBQXlCO0tBR3JDO0lBSEQsOERBR0M7SUF1REQsSUFBYSxTQUFTLGlCQUF0QixNQUFhLFNBQVM7UUFhbEI7Ozs7Ozs7O2FBUUs7UUFDTDs7Ozs7O1dBTUc7UUFDSCxZQUFZLGFBQXdDLFNBQVM7WUFDekQsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsQ0FBQyxFQUFFLEtBQUssU0FBUyxFQUFFO2FBQzVEO2lCQUFNO2dCQUVILElBQUksQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQztnQkFDekIsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDcEQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUF1QjtZQUMxQixLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDcEIsSUFBSSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxVQUFVLEVBQUU7b0JBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDMUI7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDM0I7YUFDSjtZQUNELE9BQU8sSUFBSSxDQUFDO1lBQ1oscUJBQXFCO1FBQ3pCLENBQUM7UUFDRCxNQUFNLENBQUMsa0JBQWtCLENBQUMsSUFBSTtZQUMxQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUk7WUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDNUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDUixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxRQUFRLENBQUMsSUFBSSxFQUFFLElBQUk7WUFDZixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3RDLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtnQkFDdEIsTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFDWixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQzthQUNyQztZQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNEOzs7Ozs7O1dBT0c7UUFDSCxTQUFTLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEdBQUcsU0FBUyxFQUFFLE1BQU0sR0FBRyxTQUFTLEVBQUUsTUFBTSxHQUFHLFNBQVM7WUFDOUUsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sS0FBSyxTQUFTO2dCQUNwQixPQUFPO1lBQ1gsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7YUFDdkQ7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNmLENBQUM7UUFFRDs7V0FFRztRQUNILElBQUksR0FBRztZQUNILE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN0QixDQUFDO1FBRUQsSUFBSSxHQUFHLENBQUMsS0FBa0I7WUFDdEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUN4QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixxQ0FBcUM7WUFDckMsK0NBQStDO1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUN0QyxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7Z0JBQ3RCLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7Z0JBQzVDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2FBQzFDO1lBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1FBRTFCLENBQUM7UUFFRCxPQUFPLENBQUMsT0FBTztZQUNYLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUVELE1BQU0sQ0FBQyxPQUFPO1lBQ1YsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsRUFBRSxDQUFDLFNBQWlCLEVBQUUsT0FBMkM7WUFDN0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7WUFDN0M7O2lCQUVLO1lBQ0wsT0FBTyxPQUFPLENBQUM7UUFDbkIsQ0FBQztRQUNELEdBQUcsQ0FBQyxTQUFpQixFQUFFLFVBQTRDLFNBQVM7WUFDeEUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNPLE1BQU0sQ0FBQyxlQUFlLENBQUMsTUFBTSxFQUFFLE1BQU07WUFDekMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDdkksQ0FBQztRQUNELE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBYyxFQUFFLFVBQXVCO1lBQ3pELHVEQUF1RDtZQUN2RCxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUUvQyxJQUFJLEVBQUUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBLHFCQUFxQjtZQUNoRSxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsQyxVQUFVLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztZQUN0QyxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3ZDLFVBQVUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN0RDtZQUNELElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLElBQUksSUFBSTtnQkFDakMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDdkUsR0FBRyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7WUFDNUIsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQzNCLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUM1QixDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxNQUFNLENBQUMsaUJBQWlCLENBQUMsSUFBWTtZQUNqQyxJQUFJLEtBQUssR0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztZQUNuQyxJQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUUsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBQztnQkFDaEQsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDcEQsUUFBUSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0JBQzFCLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7Z0JBQ2hELE9BQW9CLElBQUksQ0FBQzthQUM1Qjs7Z0JBQ0csT0FBb0IsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDLHdCQUF3QixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RixDQUFDO1FBQ0Q7Ozs7VUFJRTtRQUNGLElBQUksQ0FBQyxHQUF5QixFQUFFLGFBQXdDLFNBQVM7WUFDN0UsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRO2dCQUN2QixHQUFHLEdBQUcsV0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNDLHFCQUFxQjtZQUNyQixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUMvQixJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxLQUFLLFNBQVM7b0JBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQzVELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQzthQUNyQztZQUNELElBQUksSUFBSSxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQzthQUNoQztZQUNELGFBQWE7WUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RELFdBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsbUJBQW1CO1lBQ25CLDRDQUE0QztZQUM1Qyx3Q0FBd0M7WUFDeEMsSUFBSTtZQUNKLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2YsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUMsa0JBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLDZEQUE2RDtZQUM3RCxJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUN4Qiw4QkFBOEI7WUFDOUIsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFDLGtCQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDaEMsSUFBSSxFQUFFLEdBQUcsK0JBQStCLENBQUM7WUFDekMsSUFBSSxJQUFJLFlBQVksaUJBQU8sQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsRUFBRTtnQkFDMUQsRUFBRSxHQUFHLEVBQUUsQ0FBQzthQUNYO1lBRUQsSUFBSSxVQUFVLEtBQUssU0FBUyxJQUFJLFVBQVUsQ0FBQyxTQUFTLEtBQUssSUFBSSxFQUFFO2dCQUMzRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUMvQztpQkFBTTtnQkFDSCwrQ0FBK0M7Z0JBQy9DLElBQUksTUFBTSxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsdUJBQXVCLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQztnQkFDMUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFTLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztnQkFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO2dCQUMxQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztZQUNELDZEQUE2RDtZQUM3RCxJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUMvQyxJQUFJLElBQUksR0FBRyxXQUFTLENBQUMsaUJBQWlCLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDL0UsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDbkM7WUFDRCxhQUFhO1lBQ2IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVMsQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUN0RCxXQUFTLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUMvQztZQUNELDhCQUE4QjtZQUM5QiwyQ0FBMkM7WUFDM0Msd0NBQXdDO1lBQ3hDLEtBQUs7WUFDTCxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFdEUsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLEtBQWE7WUFDbkIsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLG1EQUFtRDtnQkFDdkcsSUFBSSxHQUFHO29CQUNILElBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILDhCQUE4QjtnQkFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFO29CQUMzQyxJQUFJLEdBQUcsR0FBRyxXQUFTLENBQUMsaUJBQWlCLENBQUMsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ2xHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNoQztnQkFDRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2FBQzlEO1FBQ0wsQ0FBQztRQUdELElBQUksS0FBSzs7WUFDTCxPQUFPLE1BQUEsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLDBDQUFFLFNBQVMsQ0FBQztRQUMvRCxDQUFDO1FBRUQsSUFBSSxPQUFPO1lBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMxQyxDQUFDO1FBQ0QsSUFBSSxPQUFPLENBQUMsS0FBYTtZQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFMUMsQ0FBQztRQUdELElBQUksQ0FBQztZQUNELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEUsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLEtBQWE7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3ZFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDaEQsQ0FBQztRQUtELElBQUksQ0FBQztZQUNELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0QsQ0FBQztRQUVELElBQUksQ0FBQyxDQUFDLEtBQWE7WUFDZixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3RFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDaEQsQ0FBQztRQUdELElBQUksTUFBTTtZQUNOLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBRyxFQUFFLENBQUMsQ0FBQztRQUNsRCxDQUFDO1FBQ0QsSUFBSSxNQUFNLENBQUMsS0FBYztZQUNyQixJQUFHLEtBQUs7Z0JBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFDLEVBQUUsQ0FBQyxDQUFDOztnQkFFbkMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0MsQ0FBQztRQUdELElBQUksS0FBSyxDQUFDLEtBQW9CO1lBQzFCLDBCQUEwQjtZQUMxQixJQUFJLEtBQUssS0FBSyxTQUFTO2dCQUNuQixLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxHQUFHLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsS0FBSyxDQUFNLEtBQUssQ0FBQztnQkFDbEIsS0FBSyxHQUFHLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDekIsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssUUFBUSxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsT0FBTyxLQUFLLFFBQVEsRUFBRTtnQkFDdEcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztnQkFDOUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzthQUN2QztpQkFBTTtnQkFDSCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ3BDO1lBQ0QsSUFBSTtRQUNSLENBQUM7UUFFRCxJQUFJLEtBQUs7WUFDTCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssS0FBSyxTQUFTO2dCQUN6QyxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN2QyxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCxJQUFJLE1BQU0sQ0FBQyxLQUFzQjtZQUM3QiwwQkFBMEI7WUFDMUIsSUFBSSxLQUFLLEtBQUssU0FBUztnQkFDbkIsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNmLEtBQUssR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBTSxLQUFLLENBQUM7Z0JBQ2xCLEtBQUssR0FBRyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUFLLFFBQVEsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO2dCQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO2FBQ3hDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7YUFDckM7UUFDTCxDQUFDO1FBRUQsSUFBSSxNQUFNO1lBQ04sSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUztnQkFDMUMsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7WUFDeEMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssU0FBUztnQkFDbkMsT0FBTyxTQUFTLENBQUM7WUFDckIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuRCxDQUFDO1FBR0QsSUFBSSxHQUFHLENBQUMsVUFBeUI7WUFDN0IsSUFBSSxJQUFJLEdBQUcsNkJBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ25ELG1FQUFtRTtZQUNuRSxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO2dCQUN4QixLQUFLLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO29CQUVwQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxTQUFTLEVBQUU7d0JBQ3pCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztxQkFDNUI7aUJBQ0o7YUFDSjtZQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNsQyxDQUFDO1FBQ0Q7O1dBRUc7UUFDSCxRQUFRO1lBQ0osSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO1lBQzFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQztRQUMvQyxDQUFDO1FBRUQsSUFBSSxNQUFNO1lBQ04sT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7UUFDRCxJQUFJLE1BQU0sQ0FBQyxNQUFhO1lBQ3BCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQ3RCLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztZQUNuQixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ2xCLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ0gsV0FBVztZQUNYLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ25CLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUM3RCxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ2pDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ3JCLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFHRCxJQUFJLFdBQVc7WUFDWCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDN0IsQ0FBQztRQUNELElBQUksV0FBVyxDQUFDLEtBQUs7WUFFakIsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLFNBQVM7Z0JBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7WUFHaEQsSUFBSSxLQUFLLEtBQUssU0FBUyxFQUFFO2dCQUNyQixJQUFJLFdBQVcsR0FBRyxpQkFBTyxDQUFDLFFBQVEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO2dCQUM3RCxJQUFJLEtBQUssWUFBWSxXQUFXLEtBQUssS0FBSyxFQUFFO29CQUN4QyxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7aUJBQ2xFO2dCQUNELElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO2dCQUMxQixLQUFLLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakM7O2dCQUNHLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDO1FBRXRDLENBQUM7UUFHRCxPQUFPO1lBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsRUFBRTtnQkFDaEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQzthQUM5QjtZQUNELGFBQWE7WUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBUyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RELFdBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsNENBQTRDO1lBQzVDLHlDQUF5QztZQUN6QyxLQUFLO1lBQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsRUFBRTtnQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDN0I7WUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsS0FBSyxJQUFJO2dCQUNoSCxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQzVELElBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7YUFDMUI7WUFDRCxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO2dCQUMvQixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDO2dCQUN6QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7Z0JBQ2xDLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUNwQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDOUQ7WUFDRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNyQixDQUFDO1FBQ0QsZUFBZSxDQUFDLE1BQXVCO1FBQ3ZDLENBQUM7S0FFSixDQUFBO0lBeGJrQix3QkFBYyxHQUFHLEVBQUcsQ0FBQTtJQStHbkM7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsQ0FBQzs7Ozs0Q0FHakQ7SUFFRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxDQUFDOzs7OzJDQUdqRDtJQWlJRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFdBQVcsRUFBRSxrQ0FBa0MsRUFBRSxDQUFDOzs7MENBRzlEO0lBRUQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxXQUFXLEVBQUUscUNBQXFDLEVBQUUsQ0FBQzs7OzRDQUdqRTtJQU9EO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsQ0FBQzs7O3NDQUdiO0lBVUQ7UUFEQyxJQUFBLG9CQUFTLEdBQUU7OztzQ0FHWDtJQVFEO1FBREMsSUFBQSxvQkFBUyxHQUFFOzs7MkNBR1g7SUEwQkQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7OzswQ0FLN0I7SUFrQkQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUM7OzsyQ0FPN0I7SUFHRDtRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLDBCQUEwQixFQUFFLENBQUM7c0RBQ25ELDZCQUFhLG9CQUFiLDZCQUFhOzZEQUFiLDZCQUFhLG9CQUFiLDZCQUFhO3dDQVloQztJQVNEO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSxvQkFBb0IsRUFBRSxDQUFDOzs7MkNBRzdFO0lBcUJEO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLGFBQWEsRUFBRSx3QkFBd0IsRUFBRSxDQUFDOzs7Z0RBR2pGO0lBbllRLFNBQVM7UUFEckIsSUFBQSxpQkFBTSxFQUFDLHNCQUFzQixDQUFDO3lDQThCSCx5QkFBeUI7T0E3QnhDLFNBQVMsQ0F5YnJCO0lBemJZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBQcm9wZXJ0eSwgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IENvbXBvbmVudERlc2NyaXB0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnREZXNjcmlwdG9yXCI7XG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcbmltcG9ydCB7IENTU1Byb3BlcnRpZXMgfSBmcm9tIFwiamFzc2lqcy91aS9DU1NQcm9wZXJ0aWVzXCI7XG5cbi8vaW1wb3J0IHsgQ1NTUHJvcGVydGllcyB9IGZyb20gXCJqYXNzaWpzL3VpL1N0eWxlXCI7XG5cbmphc3NpanMuaW5jbHVkZUNTU0ZpbGUoIFwiamFzc2lqcy5jc3NcIik7XG5qYXNzaWpzLmluY2x1ZGVDU1NGaWxlKCBcIm1hdGVyaWFsZGVzaWduaWNvbnMubWluLmNzc1wiKTtcblxuZGVjbGFyZSBnbG9iYWwge1xuICAgIGludGVyZmFjZSBFbGVtZW50IHtcbiAgICAgICAgX3RoaXM6IENvbXBvbmVudDtcbiAgICAgICAgX2lkPzogc3RyaW5nO1xuICAgIH1cblxufVxuXG5cblxuZXhwb3J0IGNsYXNzIFVJQ29tcG9uZW50UHJvcGVydGllcyB7XG5cbiAgICAvKipcbiAgICAgKiBmdWxsIHBhdGggdG8gY2xhc3NpZml5IHRoZSBVSUNvbXBvbmVudCBlLmcgY29tbW9uL1RvcENvbXBvbmVudCBcbiAgICAgKi9cbiAgICBmdWxsUGF0aD86IHN0cmluZztcbiAgICBpY29uPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICAqIGluaXRwcm9wZXJ0aWVzIGFyZSBhdXRvbWF0aWNhbGx5IHNldCBvbiBuZXcgY3JlYXRlZCBDb21wb25lbnRzXG4gICAgICogZS5nLiB7dGV4dDpcImJ1dHRvblwifVxuICAgICAqL1xuICAgIGluaXRpYWxpemU/OiB7IFtpbml0cHJvcGVydGllczogc3RyaW5nXTogYW55IH07XG4gICAgLyoqXG4gICAgICogYWxsY29tcG9uZW50cyBcbiAgICAgKi9cbiAgICBlZGl0YWJsZUNoaWxkQ29tcG9uZW50cz86IHN0cmluZ1tdO1xufVxuZXhwb3J0IGZ1bmN0aW9uICRVSUNvbXBvbmVudChwcm9wZXJ0aWVzOiBVSUNvbXBvbmVudFByb3BlcnRpZXMpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwY2xhc3MpIHtcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoXCIkVUlDb21wb25lbnRcIiwgcGNsYXNzLCBwcm9wZXJ0aWVzKTtcbiAgICB9XG59XG5leHBvcnQgY2xhc3MgQ29tcG9uZW50Q3JlYXRlUHJvcGVydGllcyB7XG4gICAgaWQ/OiBzdHJpbmc7XG4gICAgbm9XcmFwcGVyPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb21wb25lbnRDb25maWcge1xuICAgIC8qKlxuICAgICogY2FsbGVkIGlmIHRoZSBjb21wb25lbnQgZ2V0IHRoZSBmb2N1c1xuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZFxuICAgICovXG4gICAgb25mb2N1cz8oaGFuZGxlcik7XG4gICAgLyoqXG4gICAgKiBjYWxsZWQgaWYgdGhlIGNvbXBvbmVudCBsb3N0IHRoZSBmb2N1c1xuICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZFxuICAgICovXG4gICAgb25ibHVyPyhoYW5kbGVyKTtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIGxhYmVsIG92ZXIgdGhlIGNvbXBvbmVudFxuICAgICAqL1xuICAgIGxhYmVsPzogc3RyaW5nO1xuICAgIC8qKlxuICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdG9vbHRpcCBmb3IgdGhlIGNvbXBvbmVudFxuICAgKi9cbiAgICB0b29sdGlwPzogc3RyaW5nO1xuICAgIC8qKlxuICAgICogQG1lbWJlciB7bnVtYmVyfSAtIHRoZSBsZWZ0IGFic29sdXRlIHBvc2l0aW9uXG4gICAgKi9cbiAgICB4PzogbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge251bWJlcnxzdHJpbmd9IC0gdGhlIHRvcCBhYnNvbHV0ZSBwb3NpdGlvblxuICAgICAqL1xuICAgIHk/OiBudW1iZXI7XG4gICAgLyoqXG4gICAgICogQG1lbWJlciB7Ym9vbGVhbn0gLSBjb21wb25lbnQgaXMgaGlkZGVuXG4gICAgICovXG4gICAgaGlkZGVuPzogYm9vbGVhbjtcbiAgICAvKipcbiAgICogQG1lbWJlciB7c3RyaW5nfG51bWJlcn0gLSB0aGUgd2lkdGggb2YgdGhlIGNvbXBvbmVudCBcbiAgICogZS5nLiA1MCBvciBcIjEwMCVcIlxuICAgKi9cbiAgICB3aWR0aD86IHN0cmluZyB8IG51bWJlcjtcbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd8bnVtYmVyfSAtIHRoZSBoZWlnaHQgb2YgdGhlIGNvbXBvbmVudCBcbiAgICAgKiBlLmcuIDUwIG9yIFwiMTAwJVwiXG4gICAgICovXG4gICAgaGVpZ2h0Pzogc3RyaW5nIHwgbnVtYmVyO1xuICAgIC8qKlxuICAgICAqIGNjYy1Qcm9wZXJ0aWVzXG4gICAgICovXG4gICAgY3NzPzogQ1NTUHJvcGVydGllcztcbiAgICBzdHlsZXM/OiBhbnlbXTtcblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29udGV4dE1lbnV9IC0gdGhlIGNvbnRleHRtZW51IG9mIHRoZSBjb21wb25lbnRcbiAgICAgKiovXG4gICAgY29udGV4dE1lbnU/O1xufVxuQCRDbGFzcyhcImphc3NpanMudWkuQ29tcG9uZW50XCIpXG5leHBvcnQgY2xhc3MgQ29tcG9uZW50IGltcGxlbWVudHMgQ29tcG9uZW50Q29uZmlnIHtcbiAgICBwcml2YXRlIHN0YXRpYyBfY29tcG9uZW50SG9vayA9IFtdO1xuICAgIF9ldmVudEhhbmRsZXI7XG4gICAgX19kb206IEhUTUxFbGVtZW50O1xuICAgIHB1YmxpYyBkb21XcmFwcGVyOiBIVE1MRWxlbWVudDtcbiAgICBfaWQ6IHN0cmluZztcbiAgICBfY29udGV4dE1lbnU/O1xuICAgIF9wYXJlbnQ7XG4gICAgZXZlbnRzO1xuICAgIF9kZXNpZ25Nb2RlO1xuICAgIF9zdHlsZXM/OiBhbnlbXTtcblxuICAgIHByb3RlY3RlZCBkZXNpZ25EdW1taWVzOiBDb21wb25lbnRbXTtcbiAgICAvKiAgZ2V0IGRvbVdyYXBwZXIoKTpFbGVtZW50e1xuICAgICAgICAgIHJldHVybiB0aGlzLl9kb21XcmFwcGVyO1xuICAgICAgfVxuICAgICAgc2V0IGRvbVdyYXBwZXIoZWxlbWVudDpFbGVtZW50KXtcbiAgICAgICAgICBpZihlbGVtZW50PT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgZGVidWdnZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuX2RvbVdyYXBwZXI9ZWxlbWVudDtcbiAgICAgIH0qL1xuICAgIC8qKlxuICAgICAqIGJhc2UgY2xhc3MgZm9yIGVhY2ggQ29tcG9uZW50XG4gICAgICogQGNsYXNzIGphc3NpanMudWkuQ29tcG9uZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BlcnRpZXMgLSBwcm9wZXJ0aWVzIHRvIGluaXRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW3Byb3BlcnRpZXMuaWRdIC0gIGNvbm5lY3QgdG8gZXhpc3RpbmcgaWQgKG5vdCByZXFpcmVkKVxuICAgICAqIFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByb3BlcnRpZXM6IENvbXBvbmVudENyZWF0ZVByb3BlcnRpZXMgPSB1bmRlZmluZWQpIHsvL2lkIGNvbm5lY3QgdG8gZXhpc3Rpbmcobm90IHJlcWlyZWQpXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgfHwgcHJvcGVydGllcy5pZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2lkID0gcHJvcGVydGllcy5pZDtcbiAgICAgICAgICAgIHRoaXMuX19kb20gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChwcm9wZXJ0aWVzLmlkKTtcbiAgICAgICAgICAgIHRoaXMuZG9tLl90aGlzID0gdGhpcztcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25maWcoY29uZmlnOiBDb21wb25lbnRDb25maWcpOiBDb21wb25lbnQge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gY29uZmlnKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXNba2V5XSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XShjb25maWdba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXNba2V5XSA9IGNvbmZpZ1trZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICAvLyAgICByZXR1cm4gbmV3IGMoKTtcbiAgICB9XG4gICAgc3RhdGljIG9uQ29tcG9uZW50Q3JlYXRlZChmdW5jKSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEhvb2sucHVzaChmdW5jKTtcbiAgICB9XG4gICAgc3RhdGljIG9mZkNvbXBvbmVudENyZWF0ZWQoZnVuYykge1xuICAgICAgICB2YXIgcG9zID0gdGhpcy5fY29tcG9uZW50SG9vay5pbmRleE9mKGZ1bmMpO1xuICAgICAgICBpZiAocG9zID49IDApXG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnRIb29rLnNwbGljZShwb3MsIDEpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGFkZHMgYW4gZXZlbnRcbiAgICAgKiBAcGFyYW0ge3R5cGV9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZXZlbnRcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIC0gY2FsbGZ1bmN0aW9uIGZvciB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBhZGRFdmVudChuYW1lLCBmdW5jKSB7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudEhhbmRsZXJbbmFtZV07XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgZXZlbnRzID0gW107XG4gICAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJbbmFtZV0gPSBldmVudHM7XG4gICAgICAgIH1cbiAgICAgICAgZXZlbnRzLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNhbGwgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIHtuYW1lfSBuYW1lIC0gdGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtIDEtIHBhcmFtZXRlciBmb3IgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtIDItIHBhcmFtZXRlciBmb3IgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtIDMtIHBhcmFtZXRlciBmb3IgdGhlIGV2ZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtIDQtIHBhcmFtZXRlciBmb3IgdGhlIGV2ZW50XG4gICAgICovXG4gICAgY2FsbEV2ZW50KG5hbWUsIHBhcmFtMSwgcGFyYW0yID0gdW5kZWZpbmVkLCBwYXJhbTMgPSB1bmRlZmluZWQsIHBhcmFtNCA9IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9ldmVudEhhbmRsZXJbbmFtZV07XG4gICAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBldmVudHMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgIHJldC5wdXNoKGV2ZW50c1t4XShwYXJhbTEsIHBhcmFtMiwgcGFyYW0zLCBwYXJhbTQpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmV0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBtZW1iZXIge2RvbX0gLSB0aGUgZG9tIGVsZW1lbnRcbiAgICAgKi9cbiAgICBnZXQgZG9tKCk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19kb207XG4gICAgfVxuXG4gICAgc2V0IGRvbSh2YWx1ZTogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdmFyIGRvbWFsdCA9IHRoaXMuX19kb207XG4gICAgICAgIHRoaXMuX19kb20gPSB2YWx1ZTtcbiAgICAgICAgLyoqIEBtZW1iZXIge2RvbX0gLSB0aGUgZG9tLWVsZW1lbnQqL1xuICAgICAgICAvKiogQG1lbWJlciB7bnVtZXJ9ICAtIHRoZSBpZCBvZiB0aGUgZWxlbWVudCAqL1xuICAgICAgICB0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKFwiamlubGluZWNvbXBvbmVudFwiKTtcbiAgICAgICAgdGhpcy5kb20uY2xhc3NMaXN0LmFkZChcImpyZXNpemVhYmxlXCIpO1xuICAgICAgICBpZiAoZG9tYWx0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGRvbWFsdC5jbGFzc0xpc3QucmVtb3ZlKFwiamlubGluZWNvbXBvbmVudFwiKTtcbiAgICAgICAgICAgIGRvbWFsdC5jbGFzc0xpc3QucmVtb3ZlKFwianJlc2l6ZWFibGVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kb20uX3RoaXMgPSB0aGlzO1xuXG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50KXtcXG5cXHRcXG59XCIgfSlcbiAgICBvbmZvY3VzKGhhbmRsZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMub24oXCJmb2N1c1wiLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IFwiZnVuY3Rpb24oZXZlbnQpe1xcblxcdFxcbn1cIiB9KVxuICAgIG9uYmx1cihoYW5kbGVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9uKFwiYmx1clwiLCBoYW5kbGVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogYXR0YWNoIGFuIGV2ZW50aGFuZGxlclxuICAgICAqIEByZXR1cm5zIHRoZSBoYW5kbGVyIHRvIG9mZiB0aGUgZXZlbnRcbiAgICAgKi9cbiAgICBvbihldmVudG5hbWU6IHN0cmluZywgaGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdCkge1xuICAgICAgICB0aGlzLmRvbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50bmFtZSwgaGFuZGxlcilcbiAgICAgICAgLypsZXQgZnVuYyA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgaGFuZGxlcihlKTtcbiAgICAgICAgIH07Ki9cbiAgICAgICAgcmV0dXJuIGhhbmRsZXI7XG4gICAgfVxuICAgIG9mZihldmVudG5hbWU6IHN0cmluZywgaGFuZGxlcjogRXZlbnRMaXN0ZW5lck9yRXZlbnRMaXN0ZW5lck9iamVjdD11bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5kb20ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudG5hbWUsIGhhbmRsZXIpO1xuICAgIH1cbiAgICBwcml2YXRlIHN0YXRpYyBjbG9uZUF0dHJpYnV0ZXModGFyZ2V0LCBzb3VyY2UpIHtcbiAgICAgICAgWy4uLnNvdXJjZS5hdHRyaWJ1dGVzXS5mb3JFYWNoKGF0dHIgPT4geyB0YXJnZXQuc2V0QXR0cmlidXRlKGF0dHIubm9kZU5hbWUgPT09IFwiaWRcIiA/ICdkYXRhLWlkJyA6IGF0dHIubm9kZU5hbWUsIGF0dHIubm9kZVZhbHVlKSB9KVxuICAgIH1cbiAgICBzdGF0aWMgcmVwbGFjZVdyYXBwZXIob2xkOiBDb21wb25lbnQsIG5ld1dyYXBwZXI6IEhUTUxFbGVtZW50KSB7XG4gICAgICAgIC8vQ29tcG9uZW50LmNsb25lQXR0cmlidXRlcyhuZXdXcmFwcGVyLG9sZC5kb21XcmFwcGVyKTtcbiAgICAgICAgdmFyIGNscyA9IG9sZC5kb21XcmFwcGVyLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpO1xuXG4gICAgICAgIHZhciBpZCA9IG9sZC5kb21XcmFwcGVyLmdldEF0dHJpYnV0ZShcImlkXCIpOy8vb2xkLmRvbVdyYXBwZXIuX2lkO1xuICAgICAgICBuZXdXcmFwcGVyLnNldEF0dHJpYnV0ZShcImlkXCIsIGlkKTtcbiAgICAgICAgbmV3V3JhcHBlci5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLCBjbHMpO1xuICAgICAgICB3aGlsZSAob2xkLmRvbVdyYXBwZXIuY2hpbGRyZW4ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgbmV3V3JhcHBlci5hcHBlbmRDaGlsZChvbGQuZG9tV3JhcHBlci5jaGlsZHJlblswXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9sZC5kb21XcmFwcGVyLnBhcmVudE5vZGUgIT0gbnVsbClcbiAgICAgICAgICAgIG9sZC5kb21XcmFwcGVyLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG5ld1dyYXBwZXIsIG9sZC5kb21XcmFwcGVyKTtcbiAgICAgICAgb2xkLmRvbVdyYXBwZXIgPSBuZXdXcmFwcGVyO1xuICAgICAgICBvbGQuZG9tV3JhcHBlci5fdGhpcyA9IG9sZDtcbiAgICAgICAgb2xkLmRvbVdyYXBwZXIuX2lkID0gaWQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhbiBFbGVtZW50IGZyb20gYW4gaHRtbHN0cmluZyBlLmcuIGNyZWF0ZURvbShcIjxpbnB1dC8+XCIpXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZUhUTUxFbGVtZW50KGh0bWw6IHN0cmluZyk6IEhUTUxFbGVtZW50IHtcbiAgICAgICAgdmFyIGxvd2VyPWh0bWwudG9Mb2NhbGVMb3dlckNhc2UoKTtcbiAgICAgICAgaWYobG93ZXIuc3RhcnRzV2l0aChcIjx0ZFwiKXx8bG93ZXIuc3RhcnRzV2l0aChcIjx0clwiKSl7XG4gICAgICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKTtcbiAgICAgICAgICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWw7XG4gICAgICAgICAgICBjb25zdCBub2RlID0gdGVtcGxhdGUuY29udGVudC5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHJldHVybjxIVE1MRWxlbWVudD4gbm9kZTtcbiAgICAgICAgfWVsc2VcbiAgICAgICAgICAgIHJldHVybiA8SFRNTEVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlUmFuZ2UoKS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoaHRtbCkuY2hpbGRyZW5bMF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGluaXRzIHRoZSBjb21wb25lbnRcbiAgICAgKiBAcGFyYW0ge2RvbX0gZG9tIC0gaW5pdCB0aGUgZG9tIGVsZW1lbnRcbiAgICAgKiBAcGFyYW4ge29iamVjdH0gcHJvcGVydGllcyAtIHByb3BlcnRpZXMgdG8gaW5pdFxuICAgICovXG4gICAgaW5pdChkb206IEhUTUxFbGVtZW50IHwgc3RyaW5nLCBwcm9wZXJ0aWVzOiBDb21wb25lbnRDcmVhdGVQcm9wZXJ0aWVzID0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgZG9tID09PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgZG9tID0gQ29tcG9uZW50LmNyZWF0ZUhUTUxFbGVtZW50KGRvbSk7XG4gICAgICAgIC8vaXMgYWxyZWFkeSBhdHRhY2hlZFxuICAgICAgICBpZiAodGhpcy5kb21XcmFwcGVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRvbVdyYXBwZXIucGFyZW50Tm9kZSAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgIHRoaXMuZG9tV3JhcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZG9tV3JhcHBlcik7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIuX3RoaXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZG9tICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX19kb20uX3RoaXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgLy9ub3RpZnkgSG9va1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IENvbXBvbmVudC5fY29tcG9uZW50SG9vay5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgQ29tcG9uZW50Ll9jb21wb25lbnRIb29rW3hdKFwicHJlY3JlYXRlXCIsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vYWxscmVhZHkgd2F0Y2hlZD9cbiAgICAgICAgLy8gaWYgKGphc3NpanMuY29tcG9uZW50U3B5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gICBqYXNzaWpzLmNvbXBvbmVudFNweS51bndhdGNoKHRoaXMpO1xuICAgICAgICAvLyB9XG4gICAgICAgIHRoaXMuZG9tID0gZG9tO1xuICAgICAgICB0aGlzLl9pZCA9IFwialwiK3JlZ2lzdHJ5Lm5leHRJRCgpO1xuICAgICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJpZFwiLCB0aGlzLl9pZCk7XG4gICAgICAgIC8qKiBAbWVtYmVyIHtPYmplY3QuPHN0cmluZyxmdW5jdGlvbj59IC0gYWxsIGV2ZW50IGhhbmRsZXJzKi9cbiAgICAgICAgdGhpcy5fZXZlbnRIYW5kbGVyID0ge307XG4gICAgICAgIC8vYWRkIF90aGlzIHRvIHRoZSBkb20gZWxlbWVudFxuICAgICAgICB2YXIgbGlkID0gXCJqXCIrcmVnaXN0cnkubmV4dElEKCk7XG4gICAgICAgIHZhciBzdCA9ICdzdHlsZT1cImRpc3BsYXk6IGlubGluZS1ibG9ja1wiJztcbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqcy51aS5Db250YWluZXJcIikpIHtcbiAgICAgICAgICAgIHN0ID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzICE9PSB1bmRlZmluZWQgJiYgcHJvcGVydGllcy5ub1dyYXBwZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuZG9tV3JhcHBlciA9IHRoaXMuZG9tO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLl9pZCA9IHRoaXMuX2lkO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLmNsYXNzTGlzdC5hZGQoXCJqY29tcG9uZW50XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLyoqIEBtZW1iZXIge2RvbX0gLSB0aGUgZG9tIGVsZW1lbnQgZm9yIGxhYmVsKi9cbiAgICAgICAgICAgIGxldCBzdHJkb20gPSAnPGRpdiBpZD1cIicgKyBsaWQgKyAnXCIgY2xhc3MgPVwiamNvbXBvbmVudFwiJyArIHN0ICsgJz48L2Rpdj4nO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyID0gQ29tcG9uZW50LmNyZWF0ZUhUTUxFbGVtZW50KHN0cmRvbSk7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIuX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLl9pZCA9IGxpZDtcbiAgICAgICAgICAgIHRoaXMuZG9tV3JhcHBlci5hcHBlbmRDaGlsZChkb20pO1xuICAgICAgICB9XG4gICAgICAgIC8vYXBwZW5kIHRlbXBvcmFyeSBzbyBuZXcgZWxlbWVudHMgbXVzdCBub3QgYWRkZWQgaW1tZWRpYXRlbHlcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiamFzc2l0ZW1wXCIpID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgdGVtcCA9IENvbXBvbmVudC5jcmVhdGVIVE1MRWxlbWVudCgnPHRlbXBsYXRlIGlkPVwiamFzc2l0ZW1wXCI+PC90ZW1wbGF0ZT4nKTtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGVtcCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9ub3RpZnkgSG9va1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IENvbXBvbmVudC5fY29tcG9uZW50SG9vay5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgQ29tcG9uZW50Ll9jb21wb25lbnRIb29rW3hdKFwiY3JlYXRlXCIsIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIC8vZm9yIHByb2ZpbGxpbmcgc2F2ZSBjb2RlIHBvc1xuICAgICAgICAvL2lmIChqYXNzaWpzLmNvbXBvbmVudFNweSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vICAgICBqYXNzaWpzLmNvbXBvbmVudFNweS53YXRjaCh0aGlzKTtcbiAgICAgICAgLy8gIH1cbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqYXNzaXRlbXBcIikuYXBwZW5kQ2hpbGQodGhpcy5kb21XcmFwcGVyKTtcblxuICAgIH1cblxuICAgIHNldCBsYWJlbCh2YWx1ZTogc3RyaW5nKSB7IC8vdGhlIENvZGVcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBsYWIgPSB0aGlzLmRvbVdyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5qbGFiZWxcIik7IC8vdGhpcy5kb21XcmFwcGVyLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJqbGFiZWxcIik7XG4gICAgICAgICAgICBpZiAobGFiKVxuICAgICAgICAgICAgICAgIHRoaXMuZG9tV3JhcHBlci5yZW1vdmVDaGlsZChsYWIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy9DSEVDSyBjaGlsZHJlbigwKS0+IGZpcnN0KCkgXG4gICAgICAgICAgICBpZiAoIXRoaXMuZG9tV3JhcHBlci5xdWVyeVNlbGVjdG9yKFwiLmpsYWJlbFwiKSkge1xuICAgICAgICAgICAgICAgIGxldCBsYWIgPSBDb21wb25lbnQuY3JlYXRlSFRNTEVsZW1lbnQoJzxsYWJlbCBjbGFzcz1cImpsYWJlbFwiIGZvcj1cIicgKyB0aGlzLl9pZCArICdcIj48L2xhYmVsPicpOyAvL1xuICAgICAgICAgICAgICAgIHRoaXMuZG9tV3JhcHBlci5wcmVwZW5kKGxhYik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIucXVlcnlTZWxlY3RvcihcIi5qbGFiZWxcIikuaW5uZXJIVE1MID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBAJFByb3BlcnR5KHsgZGVzY3JpcHRpb246IFwiYWRkcyBhIGxhYmVsIGFib3ZlIHRoZSBjb21wb25lbnRcIiB9KVxuICAgIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5kb21XcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoXCIuamxhYmVsXCIpPy5pbm5lckhUTUw7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyBkZXNjcmlwdGlvbjogXCJ0b29sdGlwIGFyZSBkaXNwbGF5ZWQgb24gbW91c2Ugb3ZlclwiIH0pXG4gICAgZ2V0IHRvb2x0aXAoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZG9tLmdldEF0dHJpYnV0ZShcInRpdGxlXCIpO1xuICAgIH1cbiAgICBzZXQgdG9vbHRpcCh2YWx1ZTogc3RyaW5nKSB7IC8vdGhlIENvZGVcbiAgICAgICAgdGhpcy5kb20uc2V0QXR0cmlidXRlKFwidGl0bGVcIiwgdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7fSlcbiAgICBnZXQgeCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTnVtYmVyKHRoaXMuZG9tV3JhcHBlci5zdHlsZS5sZWZ0LnJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XG4gICAgfVxuXG4gICAgc2V0IHgodmFsdWU6IG51bWJlcikgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuZG9tV3JhcHBlci5zdHlsZS5sZWZ0ID0gdmFsdWUudG9TdHJpbmcoKS5yZXBsYWNlKFwicHhcIiwgXCJcIikgKyBcInB4XCI7XG4gICAgICAgIHRoaXMuZG9tV3JhcHBlci5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICB9XG5cblxuXG4gICAgQCRQcm9wZXJ0eSgpXG4gICAgZ2V0IHkoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcih0aGlzLmRvbVdyYXBwZXIuc3R5bGUudG9wLnJlcGxhY2UoXCJweFwiLCBcIlwiKSk7XG4gICAgfVxuXG4gICAgc2V0IHkodmFsdWU6IG51bWJlcikgeyAvL3RoZSBDb2RlXG4gICAgICAgIHRoaXMuZG9tV3JhcHBlci5zdHlsZS50b3AgPSB2YWx1ZS50b1N0cmluZygpLnJlcGxhY2UoXCJweFwiLCBcIlwiKSArIFwicHhcIjtcbiAgICAgICAgdGhpcy5kb21XcmFwcGVyLnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgIH1cblxuICAgIEAkUHJvcGVydHkoKVxuICAgIGdldCBoaWRkZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodGhpcy5kb20uZ2V0QXR0cmlidXRlKFwiaGlkZGVuXCIpPT09XCJcIik7XG4gICAgfVxuICAgIHNldCBoaWRkZW4odmFsdWU6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYodmFsdWUpXG4gICAgICAgICAgICB0aGlzLmRvbS5zZXRBdHRyaWJ1dGUoXCJoaWRkZW5cIixcIlwiKTtcbiAgICAgICAgZWxzZVxuICAgICAgICAgICAgdGhpcy5kb20ucmVtb3ZlQXR0cmlidXRlKFwiaGlkZGVuXCIpO1xuICAgIH1cblxuXG4gICAgc2V0IHdpZHRoKHZhbHVlOiBzdHJpbmd8bnVtYmVyKSB7IC8vdGhlIENvZGVcbiAgICAgICAgLy8gIGlmKCQuaXNOdW1lcmljKHZhbHVlKSlcbiAgICAgICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB2YWx1ZSA9IFwiXCI7XG4gICAgICAgIHZhbHVlID0gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgaWYgKCFpc05hTig8YW55PnZhbHVlKSlcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUgKyBcInB4XCI7XG4gICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gXCJzdHJpbmdcIiAmJiB2YWx1ZS5pbmRleE9mKFwiJVwiKSA+IC0xICYmIHRoaXMuZG9tV3JhcHBlci5zdHlsZS5kaXNwbGF5ICE9PSBcImlubGluZVwiKSB7XG4gICAgICAgICAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLnN0eWxlLndpZHRoID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIuc3R5bGUud2lkdGggPSBcIlwiO1xuICAgICAgICB9XG4gICAgICAgIC8vICBcbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcbiAgICBnZXQgd2lkdGgoKTpzdHJpbmcge1xuICAgICAgICBpZiAodGhpcy5kb21XcmFwcGVyLnN0eWxlLndpZHRoICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kb21XcmFwcGVyLnN0eWxlLndpZHRoO1xuICAgICAgICByZXR1cm4gdGhpcy5kb20uc3R5bGUud2lkdGgucmVwbGFjZShcInB4XCIsIFwiXCIpO1xuICAgIH1cblxuICAgIHNldCBoZWlnaHQodmFsdWU6IHN0cmluZyB8IG51bWJlcikgeyAvL3RoZSBDb2RlXG4gICAgICAgIC8vICBpZigkLmlzTnVtZXJpYyh2YWx1ZSkpXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgdmFsdWUgPSBcIlwiO1xuICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvU3RyaW5nKCk7XG4gICAgICAgIGlmICghaXNOYU4oPGFueT52YWx1ZSkpXG4gICAgICAgICAgICB2YWx1ZSA9IHZhbHVlICsgXCJweFwiO1xuICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09IFwic3RyaW5nXCIgJiYgdmFsdWUuaW5kZXhPZihcIiVcIikgPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCIxMDAlXCI7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIuc3R5bGUuaGVpZ2h0ID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRvbS5zdHlsZS5oZWlnaHQgPSB2YWx1ZS50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy5kb21XcmFwcGVyLnN0eWxlLmhlaWdodCA9IFwiXCI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwic3RyaW5nXCIgfSlcbiAgICBnZXQgaGVpZ2h0KCkge1xuICAgICAgICBpZiAodGhpcy5kb21XcmFwcGVyLnN0eWxlLmhlaWdodCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9tV3JhcHBlci5zdHlsZS5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLmRvbS5zdHlsZS5oZWlnaHQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbS5zdHlsZS5oZWlnaHQucmVwbGFjZShcInB4XCIsIFwiXCIpO1xuICAgIH1cblxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImpzb25cIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLkNTU1Byb3BlcnRpZXNcIiB9KVxuICAgIHNldCBjc3MocHJvcGVydGllczogQ1NTUHJvcGVydGllcykge1xuICAgICAgICB2YXIgcHJvcCA9IENTU1Byb3BlcnRpZXMuYXBwbHlUbyhwcm9wZXJ0aWVzLCB0aGlzKTtcbiAgICAgICAgLy9pZiBjc3MtcHJvcGVydGllcyBhcmUgYWxyZWFkeSBzZXQgYW5kIG5vdyBhIHByb3BlcnRpZXMgaXMgZGVsZXRlZFxuICAgICAgICBpZiAodGhpc1tcIl9sYXN0Q3NzQ2hhbmdlXCJdKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpc1tcIl9sYXN0Q3NzQ2hhbmdlXCJdKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJvcFtrZXldID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb20uc3R5bGVba2V5XSA9IFwiXCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXNbXCJfbGFzdENzc0NoYW5nZVwiXSA9IHByb3A7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIG1heGltaXplIHRoZSBjb21wb25lbnRcbiAgICAgKi9cbiAgICBtYXhpbWl6ZSgpIHtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUud2lkdGggPSBcImNhbGMoMTAwJSAtIDJweClcIjtcbiAgICAgICAgdGhpcy5kb20uc3R5bGUuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSAycHgpXCI7XG4gICAgfVxuICAgIEAkUHJvcGVydHkoeyB0eXBlOiBcImNvbXBvbmVudHNlbGVjdG9yXCIsIGNvbXBvbmVudFR5cGU6IFwiW2phc3NpanMudWkuU3R5bGVdXCIgfSlcbiAgICBnZXQgc3R5bGVzKCk6IGFueVtdIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0eWxlcztcbiAgICB9XG4gICAgc2V0IHN0eWxlcyhzdHlsZXM6IGFueVtdKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlcyA9IHN0eWxlcztcbiAgICAgICAgdmFyIG5ld3N0eWxlcyA9IFtdO1xuICAgICAgICBzdHlsZXMuZm9yRWFjaCgoc3QpID0+IHtcbiAgICAgICAgICAgIG5ld3N0eWxlcy5wdXNoKHN0LnN0eWxlaWQpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9yZW1vdmVPbGRcbiAgICAgICAgdmFyIGNsYXNzZXMgPSB0aGlzLmRvbS5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKS5zcGxpdChcIiBcIik7XG4gICAgICAgIGNsYXNzZXMuZm9yRWFjaCgoY2wpID0+IHtcbiAgICAgICAgICAgIGlmIChjbC5zdGFydHNXaXRoKFwiamFzc2lzdHlsZVwiKSAmJiBuZXdzdHlsZXMuaW5kZXhPZihjbCkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kb20uY2xhc3NMaXN0LnJlbW92ZShjbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBuZXdzdHlsZXMuZm9yRWFjaCgoc3QpID0+IHtcbiAgICAgICAgICAgIGlmIChjbGFzc2VzLmluZGV4T2Yoc3QpID09PSAtMSlcbiAgICAgICAgICAgICAgICB0aGlzLmRvbS5jbGFzc0xpc3QuYWRkKHN0KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgQCRQcm9wZXJ0eSh7IHR5cGU6IFwiY29tcG9uZW50c2VsZWN0b3JcIiwgY29tcG9uZW50VHlwZTogXCJqYXNzaWpzLnVpLkNvbnRleHRNZW51XCIgfSlcbiAgICBnZXQgY29udGV4dE1lbnUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb250ZXh0TWVudTtcbiAgICB9XG4gICAgc2V0IGNvbnRleHRNZW51KHZhbHVlKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbnRleHRNZW51ICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0TWVudS51bnJlZ2lzdGVyQ29tcG9uZW50KHRoaXMpO1xuXG5cbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHZhciBDb250ZXh0TWVudSA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzLnVpLkNvbnRleHRNZW51XCIpO1xuICAgICAgICAgICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgQ29udGV4dE1lbnUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwidmFsdWUgaXMgbm90IG9mIHR5cGUgamFzc2lqcy51aS5Db250ZXh0TWVudVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NvbnRleHRNZW51ID0gdmFsdWU7XG4gICAgICAgICAgICB2YWx1ZS5yZWdpc3RlckNvbXBvbmVudCh0aGlzKTtcbiAgICAgICAgfSBlbHNlXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0TWVudSA9IHVuZGVmaW5lZDtcblxuICAgIH1cblxuXG4gICAgZGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5kZXN0cm95KCk7XG4gICAgICAgIH1cbiAgICAgICAgLy9ub3RpZnkgSG9va1xuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IENvbXBvbmVudC5fY29tcG9uZW50SG9vay5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgQ29tcG9uZW50Ll9jb21wb25lbnRIb29rW3hdKFwiZGVzdHJveVwiLCB0aGlzKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiAoamFzc2lqcy5jb21wb25lbnRTcHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyAgICBqYXNzaWpzLmNvbXBvbmVudFNweS51bndhdGNoKHRoaXMpO1xuICAgICAgICAvLyAgfVxuICAgICAgICBpZiAodGhpcy5fcGFyZW50ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudC5yZW1vdmUodGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZG9tV3JhcHBlciAhPT0gdW5kZWZpbmVkICYmIHRoaXMuZG9tV3JhcHBlci5wYXJlbnROb2RlICE9PSB1bmRlZmluZWQgJiYgdGhpcy5kb21XcmFwcGVyLnBhcmVudE5vZGUgIT09IG51bGwpXG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmRvbVdyYXBwZXIpO1xuICAgICAgICBpZiAodGhpcy5fX2RvbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLl9fZG9tLnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhpcy5fX2RvbS5fdGhpcyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIHRoaXMuX19kb20gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZG9tV3JhcHBlciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIuX3RoaXMgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB0aGlzLmRvbVdyYXBwZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuZGVzaWduRHVtbWllcykge1xuICAgICAgICAgICAgdGhpcy5kZXNpZ25EdW1taWVzLmZvckVhY2goKGR1bW15KSA9PiB7IGR1bW15LmRlc3Ryb3koKSB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmV2ZW50cyA9IFtdO1xuICAgIH1cbiAgICBleHRlbnNpb25DYWxsZWQoYWN0aW9uOiBFeHRlbnNpb25BY3Rpb24pIHtcbiAgICB9XG5cbn1cbiJdfQ==