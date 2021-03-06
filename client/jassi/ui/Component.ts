import jassi, { $Class } from "jassi/remote/Jassi";
import { Property, $Property } from "jassi/ui/Property";
import { ComponentDescriptor } from "jassi/ui/ComponentDescriptor";
import registry from "jassi/remote/Registry";
import { classes } from "jassi/remote/Classes";
import { CSSProperties } from "jassi/ui/CSSProperties";

//import { CSSProperties } from "jassi/ui/Style";



declare global {
    interface Element {
        _this: Component;
        _id?: string;
    }

}



export class UIComponentProperties {

    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    fullPath?: string;
    icon?: string;
    /**
     * initproperties are automatically set on new created Components
     * e.g. {text:"button"}
     */
    initialize?: { [initproperties: string]: any };
    /**
     * allcomponents 
     */
    editableChildComponents?: string[];
}
export function $UIComponent(properties: UIComponentProperties): Function {
    return function(pclass) {
        registry.register("$UIComponent", pclass, properties);
    }
}
export class ComponentCreateProperties {
    id?: string;
    noWrapper?: boolean;
}
@$Class("jassi.ui.Component")
export class Component {
    _eventHandler;
    __dom: HTMLElement;
    public domWrapper: Element;
    _id: string;
    _contextMenu?;
    $: JQuery;
    _parent;
    events;
    _designMode;
    _styles?: any[];
    protected designDummies: Component[];
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
     * @class jassi.ui.Component
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties: ComponentCreateProperties = undefined) {//id connect to existing(not reqired)
        if (properties === undefined || properties.id === undefined) {
        } else {

            this._id = properties.id;
            this.__dom = document.getElementById(properties.id);
            this.dom._this = this;
        }
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
        for (var x = 0;x < events.length;x++) {
            ret.push(events[x](param1, param2, param3, param4));
        }
        return ret;
    }

    /**
     * @member {dom} - the dom element
     */
    get dom(): HTMLElement {
        return this.__dom;
    }
    set dom(value: HTMLElement) {
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
    private static cloneAttributes(target, source) {
        [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue) })
    }
    static replaceWrapper(old: Component, newWrapper: HTMLElement) {
        //Component.cloneAttributes(newWrapper,old.domWrapper);
        var cls = $(old.domWrapper).attr("class");
        //var st=$(old.domWrapper).attr("style");
        var id = $(old.domWrapper).attr("id");//old.domWrapper._id;
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
    init(dom, properties: ComponentCreateProperties = undefined) {
        //is already attached
        if (this.domWrapper !== undefined) {
            if (this.domWrapper.parentNode !== undefined)
                this.domWrapper.parentNode.removeChild(this.domWrapper);
            this.domWrapper._this = undefined;
        }
        if (this.dom !== undefined) {
            this.__dom._this = undefined;
        }
        //allready watched?
        if (jassi.componentSpy !== undefined) {
            jassi.componentSpy.unwatch(this);
        }
        this.dom = dom;
        this._id = registry.nextID();
        $(this.dom).attr("id", this._id);
        /** @member {Object.<string,function>} - all event handlers*/
        this._eventHandler = {};
        //add _this to the dom element
        var lid = registry.nextID();
        var st = 'style="display: inline"';
        if (this instanceof classes.getClass("jassi.ui.Container")) {
            st = "";
        }

        if (properties !== undefined && properties.noWrapper === true) {
            this.domWrapper = this.dom;
            this.domWrapper._id = this._id;
            $(this.domWrapper).addClass("jcomponent");
        } else {
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
        //for profilling save code pos
        if (jassi.componentSpy !== undefined) {
            jassi.componentSpy.watch(this);
        }
        $("#jassitemp")[0].appendChild(this.domWrapper);

    }

    set label(value: string) { //the Code
        if (value === undefined) {
            var lab = $(this.domWrapper).find(".jlabel");
            if (lab.length === 1)
                this.domWrapper.removeChild(lab[0]);
        } else {
            //CHECK children(0)-> first() 
            if ($(this.domWrapper).find(".jlabel").length === 0) {
                let lab = $('<label class="jlabel" for="' + this._id + '"></label>')[0]; //
                $(this.domWrapper).prepend(lab);
            }
            $(this.domWrapper).children(":first").html(value);
        }
    }

    /**
     * @member {string} - the label over the component
     */
    @$Property({ description: "adds a label above the component" })
    get label(): string {
        //CHECK children(0)-> first()
        if ($(this.domWrapper).first().attr('class') === undefined || !$(this.domWrapper).first().attr('class').startsWith("jlabel")) {
            return "";
        }
        return $(this.domWrapper).children(":first").text();
    }
    @$Property({ description: "tooltip are displayed on mouse over" })
    get tooltip(): string {
        return $(this.dom).attr("title");
    }
    /**
    * @member {string} - tooltip for the component
    */
    set tooltip(value: string) { //the Code
        $(this.domWrapper).attr("title", value);
        $(this.domWrapper).tooltip();
    }

    @$Property({})
    get x(): number {
        return Number($(this.domWrapper).css("left").replace("px", ""));
    }
    /**
     * @member {number} - the left absolute position
     */
    set x(value: number) { //the Code
        $(this.domWrapper).css("left", value);
        $(this.domWrapper).css("position", "absolute");
    }



    @$Property()
    get y(): number {
        return Number($(this.domWrapper).css("top").replace("px", ""));
    }
    /**
     * @member {number|string} - the top absolute position
     */
    set y(value: number) { //the Code
        $(this.domWrapper).css("top", value);
        $(this.domWrapper).css("position", "absolute");
    }

	/**
     * @member {boolean} - component is hidden
     */
    @$Property()
    get hidden(): boolean {
        return $(this.__dom).is(":hidden");
    }
    set hidden(value: boolean) {
        if (value) {
            this["old_display"] = $(this.__dom).css('display');
            $(this.__dom).css('display', 'none');
        } else if ($(this.__dom).css('display') === "none") {
            if (this["old_display"] !== undefined)
                $(this.__dom).css('display', this["old_display"]);
            else
                $(this.__dom).removeAttr('display');
        }
    }

    /**
     * @member {string|number} - the height of the component 
     * e.g. 50 or "100%"
     */
    set height1(value) { //the Code
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
    set width1(value) { //the Code
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
    /**
    * @member {string|number} - the width of the component 
    * e.g. 50 or "100%"
    */
    set width(value: string | number) { //the Code
        //  if($.isNumeric(value))
        if (value === undefined)
            value = "";
        if (typeof (value) === "string" && value.indexOf("%") > -1 && $(this.domWrapper).css("display") !== "inline") {//&&$(this.domWrapper).is("div"))7
            $(this.dom).css("width", "100%");
            $(this.domWrapper).css("width", value);
        } else {
            $(this.dom).css("width", value);
            $(this.domWrapper).css("width", "");
        }
        //  
    }
    @$Property({ type: "string" })
    get width() {
        if ($(this.domWrapper).css("width") !== undefined)
            return $(this.domWrapper).css("width");
        return $(this.dom).css("width").replace("px", "");
    }
    /**
     * @member {string|number} - the height of the component 
     * e.g. 50 or "100%"
     */
    set height(value: string | number) { //the Code
        //  if($.isNumeric(value))
        if (value === undefined)
            value = "";
        if (typeof (value) === "string" && value.indexOf("%") > -1) {
            $(this.dom).css("height", "100%");
            $(this.domWrapper).css("height", value);
        } else {
            $(this.dom).css("height", value);
            $(this.domWrapper).css("height", "");
        }
        //$(this.domWrapper).css("height",value);
    }
    @$Property({ type: "string" })
    get height() {
        if ($(this.domWrapper).css("height") !== undefined)
            return $(this.domWrapper).css("height");
        if ($(this.dom).css("height") !== undefined)
            return undefined;
        return $(this.dom).css("height").replace("px", "");
    }
    /**
    * sets CSS Properties
    */
    @$Property({ type: "json", componentType: "jassi.ui.CSSProperties" })
    css(properties: CSSProperties, removeOldProperties: boolean = true) {
        var prop = CSSProperties.applyTo(properties, this);
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
    @$Property({ type: "componentselector", componentType: "[jassi.ui.Style]" })
    get styles(): any[] {
        return this._styles;
    }
    set styles(styles: any[]) {
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

    @$Property({ type: "componentselector", componentType: "jassi.ui.ContextMenu" })
    get contextMenu() {
        return this._contextMenu;
    }
    /**
     * @member {jassi.ui.ContextMenu} - the contextmenu of the component
     **/
    set contextMenu(value) {

        if (this._contextMenu !== undefined)
            this._contextMenu.unregisterComponent(this);


        if (value !== undefined) {
            var ContextMenu = classes.getClass("jassi.ui.ContextMenu");
            if (value instanceof ContextMenu === false) {
                throw "value is not of type jassi.ui.ContextMenu";
            }
            this._contextMenu = value;
            value.registerComponent(this);
        } else
            this._contextMenu = undefined;

    }


    destroy() {
        if (this.contextMenu !== undefined) {
            this.contextMenu.destroy();
        }
        if (jassi.componentSpy !== undefined) {
            jassi.componentSpy.unwatch(this);
        }
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
            this.designDummies.forEach((dummy) => { dummy.destroy() });
        }
        this.events = [];
        this.$ = undefined;
    }
    extensionCalled(action: ExtensionAction) {
    }

}
