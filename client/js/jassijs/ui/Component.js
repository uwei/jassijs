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
    var Component_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TextComponent = exports.HTMLComponent = exports.Component = exports.createComponent = exports.React = exports.$UIComponent = exports.UIComponentProperties = void 0;
    //import { CSSProperties } from "jassijs/ui/Style";
    jassijs.includeCSSFile("jassijs.css");
    jassijs.includeCSSFile("materialdesignicons.min.css");
    //vergleichen
    //jeder bekommt componentid
    //gehe durch baum wenn dom_component fehlt, dann ist kopiert und muss mit id von componentid gerenderd werden
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_2.default.register("$UIComponent", pclass, properties);
        };
    }
    exports.$UIComponent = $UIComponent;
    var React = {
        createElement(type, props, ...children) {
            if (props === undefined || props === null) //TODO is this right?
                props = {};
            if (children) {
                props.children = children;
            }
            var ret = {
                props: props,
                type: type
            };
            //@ts-ignore
            for (var x = 0; x < Component._componentHook.length; x++) {
                //@ts-ignore
                Component._componentHook[x]("create", ret, "React.createElement");
            }
            return ret;
        }
    };
    exports.React = React;
    //@ts-ignore
    React.Component = class {
        constructor(props) {
            this.props = props;
        }
    };
    window.React = React;
    function createComponent(node) {
        var _a, _b;
        var atype = node.type;
        var props = node.props;
        var ret;
        if (typeof atype === "string") {
            if (props === undefined)
                props = {};
            props.tag = atype;
            ret = new HTMLComponent(props);
            //ret.tag = atype;
            var newdom = ret.dom; //document.createElement(atype);
            //ret.init(newdom, { noWrapper: true });
        }
        else if (atype.constructor !== undefined) {
            ret = new atype(props);
        }
        else if (typeof atype === "function") {
            ret = atype(props);
        }
        if (((_a = node === null || node === void 0 ? void 0 : node.props) === null || _a === void 0 ? void 0 : _a.children) !== undefined) {
            if (props === null || props === undefined)
                props = {};
            props.children = (_b = node === null || node === void 0 ? void 0 : node.props) === null || _b === void 0 ? void 0 : _b.children;
            for (var x = 0; x < props.children.length; x++) {
                var child = props.children[x];
                var cchild;
                if (typeof child === "string") {
                    cchild = new TextComponent();
                    cchild.tag = "";
                    cchild.text = child;
                    //child.dom = nd;
                }
                else {
                    cchild = createComponent(child);
                }
                ret.add(cchild);
            }
        }
        return ret;
    }
    exports.createComponent = createComponent;
    //class TC <Prop>extends React.Component<Prop,{}>{
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
            // super(properties, undefined);
            this.props = properties;
            var rend = this.render();
            if (rend) {
                var comp = createComponent(rend);
                this.init(comp.dom);
            }
            this.config(this.props);
        }
        render() {
            return undefined;
        }
        /*  rerender() {
              var alt = this.dom;
              this.init(this.lastinit, { replaceNode: this.dom });
              this.config(this.lastconfig);
          }*/
        config(config, forceRender = false) {
            var con = Object.assign({}, config);
            delete con.noWrapper;
            delete con.replaceNode;
            // this.lastconfig = config;
            var notfound = {};
            for (var key in con) {
                if (key in this) {
                    var me = this;
                    if (typeof me[key] === 'function') {
                        me[key](config[key]);
                    }
                    else {
                        me[key] = config[key];
                    }
                }
                else
                    notfound[key] = con;
            }
            Object.assign(this.props === undefined ? {} : this.props, config);
            if (Object.keys(notfound).length > 0 && forceRender) {
                var rerender = this.render();
                if (rerender) {
                    this.init(createComponent(rerender).dom);
                    console.log("rerender");
                }
            }
            return this;
            //    return new c();
        }
        /**
         * called if the component is created
         */
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
            if (this.dom.classList) { //Textnode!
                this.dom.classList.add("jinlinecomponent");
                this.dom.classList.add("jresizeable");
                if (domalt !== undefined) {
                    domalt.classList.remove("jinlinecomponent");
                    domalt.classList.remove("jresizeable");
                }
            }
            if (this.dom._this && this.dom._this !== this) {
                if (this.dom._thisOther === undefined)
                    this.dom._thisOther = [];
                this.dom._thisOther.push(this.dom._this);
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
            var _a;
            // this.lastinit = dom;
            var oldwrapper = this.domWrapper;
            var olddom = this.dom;
            if (typeof dom === "string")
                dom = Component_1.createHTMLElement(dom);
            //is already attached
            if (this.domWrapper !== undefined) {
                var thisProperties = properties;
                if ((_a = thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode) === null || _a === void 0 ? void 0 : _a.parentNode) {
                    thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode.parentNode.replaceChild(dom, thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode);
                    this.dom = dom;
                    this.dom.setAttribute("id", thisProperties === null || thisProperties === void 0 ? void 0 : thisProperties.replaceNode.getAttribute("id"));
                    return;
                }
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
            this._id = olddom ? olddom.id : ("j" + Registry_2.default.nextID());
            if (this.dom.setAttribute !== undefined) //Textnode
                this.dom.setAttribute("id", this._id);
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
            //add _this to the dom element
            var lid = oldwrapper ? oldwrapper.id : ("j" + Registry_2.default.nextID());
            var st = 'style="display: inline-block"';
            if (this instanceof Classes_1.classes.getClass("jassijs.ui.Container")) {
                st = "";
            }
            if (properties !== undefined && properties.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                if (this.domWrapper.classList !== undefined)
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
            if ((oldwrapper === null || oldwrapper === void 0 ? void 0 : oldwrapper.parentNode) !== undefined) {
                oldwrapper.parentNode.replaceChild(this.domWrapper, oldwrapper); //removeChild(this.domWrapper);
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
            if (!oldwrapper)
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
        setState() {
            throw new Error("not implemented");
        }
        forceUpdate() {
            throw new Error("not implemented");
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
        (0, Property_1.$Property)(),
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
        (0, Property_1.$Property)({ type: "number" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "width", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Component.prototype, "height", null);
    __decorate([
        (0, Property_1.$Property)({ type: "json", componentType: "jassijs.ui.CSSProperties" }),
        __metadata("design:type", CSSProperties_1.CSSProperties),
        __metadata("design:paramtypes", [CSSProperties_1.CSSProperties])
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
        (0, Property_1.$Property)({ name: "testuw", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Component);
    exports.Component = Component;
    // ret.tag = atype;
    //        var newdom = document.createElement(atype);
    let HTMLComponent = class HTMLComponent extends Component {
        constructor(prop = {}) {
            super(prop);
            this._components = [];
            //this.init(document.createElement(tag), { noWrapper: true });
        }
        config(props, forceRender = false) {
            var _a;
            var tag = (props === null || props === void 0 ? void 0 : props.tag) === undefined ? "span" : props === null || props === void 0 ? void 0 : props.tag;
            if ((props === null || props === void 0 ? void 0 : props.tag) !== this.tag.toLowerCase()) {
                var childs = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.childNodes;
                this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
                if ((childs === null || childs === void 0 ? void 0 : childs.length) > 0)
                    this.dom.append(...childs);
            }
            super.config(props, forceRender);
            for (var prop in props) {
                if (prop === "style") {
                    for (var key in props.style) {
                        var val = props.style[key];
                        this.dom.style[key] = val;
                    }
                }
                else if (prop in this.dom) {
                    Reflect.set(this.dom, prop, [props[prop]]);
                }
                else if (prop.toLocaleLowerCase() in this.dom) {
                    Reflect.set(this.dom, prop.toLocaleLowerCase(), props[prop]);
                }
                else if (prop in this.dom)
                    this.dom.setAttribute(prop, props[prop]);
                // }
            }
            return this;
        }
        set tag(value) {
            var tag = value == undefined ? "span" : value;
            if (tag !== this.tag.toLowerCase()) {
                this.props.tag = value;
                this.config(this.props);
                /*
                var childs = this.dom?.childNodes;
                this.init(document.createElement(value), { replaceNode: this.dom, noWrapper: true });
                if (childs?.length > 0)
                    this.dom.append(...<any>childs);
                */
            }
        }
        get tag() {
            var _a;
            var ret = (_a = this.dom) === null || _a === void 0 ? void 0 : _a.tagName;
            if (ret === null || ret === undefined)
                return "";
            return ret;
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
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], HTMLComponent.prototype, "tag", null);
    HTMLComponent = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.HTMLComponent"),
        __metadata("design:paramtypes", [Object])
    ], HTMLComponent);
    exports.HTMLComponent = HTMLComponent;
    let TextComponent = class TextComponent extends Component {
        constructor(props = {}) {
            super(props);
        }
        config(props, forceRender = false) {
            if (this.dom === undefined) {
                this.init(document.createTextNode(props === null || props === void 0 ? void 0 : props.text), { noWrapper: true });
            }
            super.config(props, forceRender);
            return this;
        }
        get text() {
            var _a;
            return (_a = this.dom) === null || _a === void 0 ? void 0 : _a.textContent;
        }
        ;
        set text(value) {
            // var p = JSON.parse(value);//`{"a":"` + value + '"}').a;
            this.dom.textContent = value;
        }
        ;
    };
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], TextComponent.prototype, "text", null);
    TextComponent = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.TextComponent"),
        __metadata("design:paramtypes", [Object])
    ], TextComponent);
    exports.TextComponent = TextComponent;
});
//# sourceMappingURL=Component.js.map