var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ui/CSSProperties"], function (require, exports, Jassi_1, Property_1, Registry_1, Classes_1, CSSProperties_1) {
    "use strict";
    var Component_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = exports.ComponentCreateProperties = exports.$UIComponent = exports.UIComponentProperties = void 0;
    class UIComponentProperties {
    }
    exports.UIComponentProperties = UIComponentProperties;
    function $UIComponent(properties) {
        return function (pclass) {
            Registry_1.default.register("$UIComponent", pclass, properties);
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
            this.$ = $(value);
            /** @member {numer}  - the id of the element */
            $(this.dom).addClass("jinlinecomponent");
            $(this.dom).addClass("jresizeable");
            if (domalt !== undefined) {
                $(domalt).removeClass("jinlinecomponent");
                $(domalt).removeClass("jresizeable");
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
            let func = function (e) {
                handler(e);
            };
            $(this.dom).on(eventname, func);
            return func;
        }
        off(eventname, func = undefined) {
            $(this.dom).off(eventname, func);
        }
        static cloneAttributes(target, source) {
            [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue); });
        }
        static replaceWrapper(old, newWrapper) {
            //Component.cloneAttributes(newWrapper,old.domWrapper);
            var cls = $(old.domWrapper).attr("class");
            //var st=$(old.domWrapper).attr("style");
            var id = $(old.domWrapper).attr("id"); //old.domWrapper._id;
            $(newWrapper).attr("id", id);
            $(newWrapper).attr("class", cls);
            //$(newWrapper).attr("style",st);
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
         * inits the component
         * @param {dom} dom - init the dom element
         * @paran {object} properties - properties to init
        */
        init(dom, properties = undefined) {
            if (typeof dom === "string")
                dom = document.createRange().createContextualFragment(dom).children[0];
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
            this._id = Registry_1.default.nextID();
            $(this.dom).attr("id", this._id);
            /** @member {Object.<string,function>} - all event handlers*/
            this._eventHandler = {};
            //add _this to the dom element
            var lid = Registry_1.default.nextID();
            var st = 'style="display: inline-block"';
            if (this instanceof Classes_1.classes.getClass("jassijs.ui.Container")) {
                st = "";
            }
            if (properties !== undefined && properties.noWrapper === true) {
                this.domWrapper = this.dom;
                this.domWrapper._id = this._id;
                $(this.domWrapper).addClass("jcomponent");
            }
            else {
                /** @member {dom} - the dom element for label*/
                this.domWrapper = $('<div id="' + lid + '" class ="jcomponent"' + st + '></div>')[0];
                this.domWrapper._this = this;
                this.domWrapper._id = lid;
                this.domWrapper.appendChild(dom);
            }
            //append temporary so new elements must not added immediately
            if (document.getElementById("jassitemp") === null) {
                var temp = $('<template id="jassitemp"></template>')[0];
                $(document.body).append(temp);
            }
            //notify Hook
            for (var x = 0; x < Component_1._componentHook.length; x++) {
                Component_1._componentHook[x]("create", this);
            }
            //for profilling save code pos
            //if (jassijs.componentSpy !== undefined) {
            //     jassijs.componentSpy.watch(this);
            //  }
            $("#jassitemp")[0].appendChild(this.domWrapper);
        }
        set label(value) {
            if (value === undefined) {
                var lab = $(this.domWrapper).find(".jlabel");
                if (lab.length === 1)
                    this.domWrapper.removeChild(lab[0]);
            }
            else {
                //CHECK children(0)-> first() 
                if ($(this.domWrapper).find(".jlabel").length === 0) {
                    let lab = $('<label class="jlabel" for="' + this._id + '"></label>')[0]; //
                    $(this.domWrapper).prepend(lab);
                }
                $(this.domWrapper).children(":first").html(value);
            }
        }
        get label() {
            //CHECK children(0)-> first()
            if ($(this.domWrapper).first().attr('class') === undefined || !$(this.domWrapper).first().attr('class').startsWith("jlabel")) {
                return "";
            }
            return $(this.domWrapper).children(":first").text();
        }
        get tooltip() {
            return $(this.dom).attr("title");
        }
        set tooltip(value) {
            $(this.domWrapper).attr("title", value);
            $(this.domWrapper).tooltip();
        }
        get x() {
            return Number($(this.domWrapper).css("left").replace("px", ""));
        }
        set x(value) {
            $(this.domWrapper).css("left", value);
            $(this.domWrapper).css("position", "absolute");
        }
        get y() {
            return Number($(this.domWrapper).css("top").replace("px", ""));
        }
        set y(value) {
            $(this.domWrapper).css("top", value);
            $(this.domWrapper).css("position", "absolute");
        }
        get hidden() {
            return $(this.__dom).is(":hidden");
        }
        set hidden(value) {
            $(this.__dom).css('visibility', value ? "hidden" : "visible");
            /*if (value) {
                this["old_display"] = $(this.__dom).css('display');
                $(this.__dom).css('display', 'none');
            } else if ($(this.__dom).css('display') === "none") {
                if (this["old_display"] !== undefined)
                    $(this.__dom).css('display', this["old_display"]);
                else
                    $(this.__dom).removeAttr('display');
            }*/
        }
        /**
         * @member {string|number} - the height of the component
         * e.g. 50 or "100%"
         */
        set height1(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1)
                $(this.dom).css("height", "100%");
            else
                $(this.dom).css("height", value);
            $(this.domWrapper).css("height", value);
        }
        get height1() {
            return $(this.domWrapper).css("height").replace("px", "");
        }
        /**
         * @member {string|number} - the width of the component
         * e.g. 50 or "100%"
         */
        set width1(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && $(this.domWrapper).is("div"))
                $(this.dom).css("width", "100%");
            else
                $(this.dom).css("width", value);
            $(this.domWrapper).css("width", value);
        }
        get width1() {
            return $(this.domWrapper).css("width").replace("px", "");
        }
        set width(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1 && $(this.domWrapper).css("display") !== "inline") { //&&$(this.domWrapper).is("div"))7
                $(this.dom).css("width", "100%");
                $(this.domWrapper).css("width", value);
            }
            else {
                $(this.dom).css("width", value);
                $(this.domWrapper).css("width", "");
            }
            //  
        }
        get width() {
            if ($(this.domWrapper).css("width") !== undefined)
                return $(this.domWrapper).css("width");
            return $(this.dom).css("width").replace("px", "");
        }
        set height(value) {
            //  if($.isNumeric(value))
            if (value === undefined)
                value = "";
            if (typeof (value) === "string" && value.indexOf("%") > -1) {
                $(this.dom).css("height", "100%");
                $(this.domWrapper).css("height", value);
            }
            else {
                $(this.dom).css("height", value);
                $(this.domWrapper).css("height", "");
            }
            //$(this.domWrapper).css("height",value);
        }
        get height() {
            if ($(this.domWrapper).css("height") !== undefined)
                return $(this.domWrapper).css("height");
            if ($(this.dom).css("height") !== undefined)
                return undefined;
            return $(this.dom).css("height").replace("px", "");
        }
        set css(properties) {
            var prop = CSSProperties_1.CSSProperties.applyTo(properties, this);
            //if css-properties are already set and now a properties is deleted
            if (this["_lastCssChange"]) {
                for (let key in this["_lastCssChange"]) {
                    if (prop[key] === undefined) {
                        $(this.dom).css(key, "");
                    }
                }
            }
            this["_lastCssChange"] = prop;
        }
        /**
         * maximize the component
         */
        maximize() {
            // $(this.dom).addClass("jmaximized");
            $(this.dom).css("width", "calc(100% - 2px)");
            $(this.dom).css("height", "calc(100% - 2px)");
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
            var classes = $(this.dom).attr("class").split(" ");
            classes.forEach((cl) => {
                if (cl.startsWith("jassistyle") && newstyles.indexOf(cl) === -1) {
                    $(this.dom).removeClass(cl);
                }
            });
            newstyles.forEach((st) => {
                if (classes.indexOf(st) === -1)
                    $(this.dom).addClass(st);
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
                $(this.__dom).remove();
                this.__dom._this = undefined;
                this.__dom = undefined;
            }
            if (this.domWrapper !== undefined) {
                $(this.domWrapper).remove();
                this.domWrapper._this = undefined;
                this.domWrapper = undefined;
            }
            if (this.designDummies) {
                this.designDummies.forEach((dummy) => { dummy.destroy(); });
            }
            this.events = [];
            this.$ = undefined;
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
        (0, Jassi_1.$Class)("jassijs.ui.Component"),
        __metadata("design:paramtypes", [ComponentCreateProperties])
    ], Component);
    exports.Component = Component;
});
//# sourceMappingURL=Component.js.map