import { $Class } from "jassijs/remote/Registry";
import { Property, $Property } from "jassijs/ui/Property";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { CSSProperties } from "jassijs/ui/CSSProperties";
import { States, createStates, resolveState } from "jassijs/ui/State";



//import { CSSProperties } from "jassijs/ui/Style";

jassijs.includeCSSFile("jassijs.css");
jassijs.includeCSSFile("materialdesignicons.min.css");

declare global {
    interface Element {
        _this: Component<any>;
        _id?: string;
        _thisOther: Component<any>[];
    }

}

//vergleichen
//jeder bekommt componentid
//gehe durch baum wenn dom_component fehlt, dann ist kopiert und muss mit id von componentid gerenderd werden

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
    return function (pclass) {
        registry.register("$UIComponent", pclass, properties);
    }
}


export interface ComponentProperties {
    /**
    * called if the component get the focus
    * @param {function} handler - the function which is executed
    */
    onfocus?(handler);
    /**
    * called if the component lost the focus
    * @param {function} handler - the function which is executed
    */
    onblur?(handler);
    /**
     * @member {string} - the label over the component
     */
    label?: string;
    /**
   * @member {string} - tooltip for the component
   */
    tooltip?: string;
    /**
    * @member {number} - the left absolute position
    */
    x?: number;
    /**
     * @member {number|string} - the top absolute position
     */
    y?: number;
    /**
     * @member {boolean} - component is hidden
     */
    hidden?: boolean;
    /**
   * @member {string|number} - the width of the component 
   * e.g. 50 or "100%"
   */
    width?: string | number;
    /**
     * @member {string|number} - the height of the component 
     * e.g. 50 or "100%"
     */
    height?: string | number;
    /**
     * ccc-Properties
     */
    style?: React.CSSProperties;
    styles?: any[];

    /**
     * @member {jassijs.ui.ContextMenu} - the contextmenu of the component
     **/
    contextMenu?;
    /*
    ** Component has no Wrapper around the dom-Element dom=domWrapper
    */
    noWrapper?: boolean;
    replaceNode?: any;
    /*    //React things - we don't need it
      context: any;
      state;
      refs;
      setState() {
          throw new Error("not implemented");
      }
      forceUpdate() {
          throw new Error("not implemented");
      }*/
    calculateState?: (any) => void
}


var React = {

    createElement(type: any, props, ...children) {

        if (props === undefined || props === null)//TODO is this right?
            props = {};
        if (children) {
            props.children = children;
        }

        var ret = {
            props: props,
            type: type
        }
        //@ts-ignore
        for (var x = 0; x < Component._componentHook.length; x++) {
            //@ts-ignore
            Component._componentHook[x]("create", ret, "React.createElement");
        }

        return ret;

    }
}
//@ts-ignore
React.Component = class {
    props;
    constructor(props: any) {
        this.props = props;
    }
};
export { React };
declare global {
    interface Window {
        fetch: (url: string, options?: {}) => Promise<any>
    }
}
declare global {
    interface Window {
        React: any;
    }
    interface React {
        createElement(atype: any, props, ...children);
    }
}

window.React = React;
export function createComponent(node: React.ReactNode) {//node: { key: string, props: any, type: any }):Component {
    var atype = (<any>node).type;
    var props = (<any>node).props;
    var ret;
    if (typeof atype === "string") {
        if (props === undefined)
            props = {};
        props.tag = atype;
        ret = new HTMLComponent(props);
    } else if (atype.constructor !== undefined) {

        if (atype.prototype._rerenderMe === undefined) {//Functioncompoment
            var p = props || {};
            p.renderFunc = atype;
            ret = new FunctionComponent(p);
            
        } else {
            ret = new atype(props);
   
        }
    }
    if ((<any>node)?.props?.children !== undefined) {
        if (props === null || props === undefined)
            props = {};
        props.children = (<any>node)?.props?.children;
        for (var x = 0; x < props.children.length; x++) {
            //delegate renderFunc

            var child = props.children[x];
            /*if(child?.props?.calculateState){
                props.calculateState=child?.props?.renderFunc;
                delete child?.props?.calculateState;
                

            }*/
            var cchild;
            if (typeof child === "string") {


                cchild = new TextComponent();
                cchild.tag = "";

                cchild.text = child;

                //child.dom = nd;
            } else if (child?._observe_) {
                cchild = new TextComponent();
                cchild.tag = "";
                child?._observe_(cchild, "text", "property");
                cchild.text = child.current;



            } else {
                cchild = createComponent(child);

            }
            ret.add(cchild);
        }
    }
    if (props?.ref) {
        props.ref.current = ret;
        delete props?.ref;
    }
    return ret;

}

//class TC <Prop>extends React.Component<Prop,{}>{
@$Class("jassijs.ui.Component")
@$Property({ name: "testuw", type: "string" })
export class Component<T extends ComponentProperties = {}> implements React.Component<T, {}> {
    props: T;
    states: States<T>;
    private static _componentHook = [];
    _eventHandler;
    __dom: HTMLElement;
    public domWrapper: HTMLElement;
    _id: string;
    _contextMenu?;
    _parent;
    events;
    _designMode;
    _styles?: any[];
    calculateState: (any) => any;
    protected designDummies: Component<{}>[];
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
    constructor(properties: ComponentProperties = {}) {//id connect to existing(not reqired)
        // super(properties, undefined);
        // if(properties===undefined)
        // properties={};
        this.states = createStates(this.props);
        this.props = <any>properties;
        this._rerenderMe(true);
        this.config(this.props);
    }
    private _rerenderMe(firstTime = false) {

        var rend = this.render();
        if (rend) {
            if (rend instanceof Node) {
                this._initComponent(<any>rend);
            } else {
                if ((<any>rend)?.props?.calculateState) {
                    this.calculateState = (<any>rend).props.calculateState;
                    delete (<any>rend).props.calculateState;
                }
                var comp = createComponent(rend);

                this._initComponent((<any>comp).dom);
            }


        }
        if (firstTime)
            this.componentDidMount();
    }
    componentDidMount() {

    }
    render(): React.ReactNode {
        return undefined;
    }
    /*  rerender() {
          var alt = this.dom;
          this.init(this.lastinit, { replaceNode: this.dom });
          this.config(this.lastconfig);
      }*/
    config(config: T): Component {

        var con: any = Object.assign({}, config);
        delete con.noWrapper;
        delete con.replaceNode;
        // this.lastconfig = config;
        var notfound = <any>{}
        resolveState(this, config);
        for (var key in con) {
            if (key in this) {
                var me = <any>this;


                var val = con[key];
                if (val?._observe_) {
                    val?._observe_(this, key, "property");
                    con[key] = val.current;
                    config[key] = con[key];
                }


                if (typeof me[key] === 'function') {
                    me[key](config[key]);
                } else {
                    if (me[key]?._observe_ !== undefined) {
                        me[key].current = config[key];
                    } else
                        me[key] = config[key];

                }
            } else if (this.states&&this.states._used.indexOf(key) !== -1) {
                this.states[key].current = config[key];
            } else
                notfound[key] = con;
        }
        if(this.states?._onconfig) 
            this.states._onconfig(config);
        Object.assign(this.props === undefined ? {} : this.props, config);
        if (Object.keys(notfound).length > 0) {
            if (this.calculateState) {
                this.calculateState(config);
                return <any>this;
            }

            /* var rerender = this.render();
             if (rerender) {
                 this.init(createComponent(rerender).dom);
                 
             }*/
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
    get dom(): HTMLElement {
        return this.__dom;
    }

    set dom(value: HTMLElement) {
        var domalt = this.__dom;
        this.__dom = value;
        /** @member {dom} - the dom-element*/
        /** @member {numer}  - the id of the element */
        if (this.dom.classList) {//Textnode!
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
    /**
   * inits the component
   * @param {dom} dom - init the dom element
   * @paran {object} properties - properties to init
  */
    private _initComponent(dom: HTMLElement) {
        // this.lastinit = dom;
        var oldwrapper = this.domWrapper;
        var olddom = this.dom;

        //is already attached
        if (this.domWrapper !== undefined) {
            var thisProperties: ComponentProperties = this.props;

            this.domWrapper._this = undefined;
        }


        if (this.dom !== undefined) {
            this.__dom._this = undefined;
        }
        //notify Hook
        for (var x = 0; x < Component._componentHook.length; x++) {
            Component._componentHook[x]("precreate", this);
        }
        //allready watched?
        // if (jassijs.componentSpy !== undefined) {
        //   jassijs.componentSpy.unwatch(this);
        // }
        this.dom = dom;
        this._id = olddom ? olddom.id : ("j" + registry.nextID());
        if (this.dom.setAttribute !== undefined)//Textnode
            this.dom.setAttribute("id", this._id);
        /** @member {Object.<string,function>} - all event handlers*/
        this._eventHandler = {};
        //add _this to the dom element
        var lid = oldwrapper ? oldwrapper.id : ("j" + registry.nextID());
        var st = 'style="display: inline-block"';
        if (this instanceof classes.getClass("jassijs.ui.Container")) {
            st = "";
        }

        if (this.props !== undefined && (<any>this.props).noWrapper === true) {

            this.domWrapper = this.dom;
            this.domWrapper._id = this._id;
            if (this.domWrapper.classList !== undefined)
                this.domWrapper.classList.add("jcomponent");
        } else {
            /** @member {dom} - the dom element for label*/
            let strdom = '<div id="' + lid + '" class ="jcomponent"' + st + '></div>';
            this.domWrapper = Component.createHTMLElement(strdom);
            this.domWrapper._this = this;
            this.domWrapper._id = lid;
            this.domWrapper.appendChild(dom);
        }
        if (oldwrapper?.parentNode !== undefined) {
            oldwrapper.parentNode.replaceChild(this.domWrapper, oldwrapper);//removeChild(this.domWrapper);
        }
        //append temporary so new elements must not added immediately
        if (document.getElementById("jassitemp") === null) {
            var temp = Component.createHTMLElement('<template id="jassitemp"></template>');
            document.body.appendChild(temp);
        }
        //notify Hook
        for (var x = 0; x < Component._componentHook.length; x++) {
            Component._componentHook[x]("create", this);
        }
        //for profilling save code pos
        //if (jassijs.componentSpy !== undefined) {
        //     jassijs.componentSpy.watch(this);
        //  }
        if (!oldwrapper)
            document.getElementById("jassitemp").appendChild(this.domWrapper);

    }
    @$Property({ default: "function(event){\n\t\n}" })
    onfocus(handler) {
        return this.on("focus", handler);
    }

    @$Property({ default: "function(event){\n\t\n}" })
    onblur(handler) {
        return this.on("blur", handler);
    }
    /**
     * attach an eventhandler
     * @returns the handler to off the event
     */
    on(eventname: string, handler: EventListenerOrEventListenerObject) {
        this.dom.addEventListener(eventname, handler)
        /*let func = function (e) {
             handler(e);
         };*/
        return handler;
    }
    off(eventname: string, handler: EventListenerOrEventListenerObject = undefined) {
        this.dom.removeEventListener(eventname, handler);
    }
    private static cloneAttributes(target, source) {
        [...source.attributes].forEach(attr => { target.setAttribute(attr.nodeName === "id" ? 'data-id' : attr.nodeName, attr.nodeValue) })
    }
    static replaceWrapper(old: Component<any>, newWrapper: HTMLElement) {
        //Component.cloneAttributes(newWrapper,old.domWrapper);
        var cls = old.domWrapper.getAttribute("class");

        var id = old.domWrapper.getAttribute("id");//old.domWrapper._id;
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
    static createHTMLElement(html: string): HTMLElement {
        var lower = html.toLocaleLowerCase();
        if (lower.startsWith("<td") || lower.startsWith("<tr")) {
            const template = document.createElement("template");
            template.innerHTML = html;
            const node = template.content.firstElementChild;
            return <HTMLElement>node;
        } else
            return <HTMLElement>document.createRange().createContextualFragment(html).children[0];
    }
    replaceDom(dom: HTMLElement) {
        var oldwrapper = this.domWrapper;
        var olddom = this.dom;
        if (olddom?.parentNode) {
            olddom.parentNode.replaceChild(olddom, dom);
        }
        this.dom = dom;
        if (oldwrapper === olddom)
            this.domWrapper = dom;
        this.dom.setAttribute("id", olddom.getAttribute("id"));
    }



    @$Property({ description: "adds a label above the component" })
    set label(value: string) { //the Code
        if (value === undefined) {
            var lab = this.domWrapper.querySelector(".jlabel"); //this.domWrapper.getElementsByClassName("jlabel");
            if (lab)
                this.domWrapper.removeChild(lab);
        } else {
            //CHECK children(0)-> first() 
            if (!this.domWrapper.querySelector(".jlabel")) {
                let lab = Component.createHTMLElement('<label class="jlabel" for="' + this._id + '"></label>'); //
                this.domWrapper.prepend(lab);
            }
            this.domWrapper.querySelector(".jlabel").innerHTML = value;
        }
    }


    get label(): string {
        return this.domWrapper.querySelector(".jlabel")?.innerHTML;
    }

    @$Property({ description: "tooltip are displayed on mouse over" })
    get tooltip(): string {
        return this.dom.getAttribute("title");
    }
    set tooltip(value: string) { //the Code
        this.dom.setAttribute("title", value);

    }

    @$Property()
    get x(): number {
        return Number(this.domWrapper.style.left.replace("px", ""));
    }

    set x(value: number) { //the Code
        this.domWrapper.style.left = value.toString().replace("px", "") + "px";
        this.domWrapper.style.position = "absolute";
    }

    @$Property()
    get y(): number {
        return Number(this.domWrapper.style.top.replace("px", ""));
    }

    set y(value: number) { //the Code
        this.domWrapper.style.top = value.toString().replace("px", "") + "px";
        this.domWrapper.style.position = "absolute";
    }

    @$Property()
    get hidden(): boolean {
        return (this.dom.getAttribute("hidden") === "");
    }
    set hidden(value: boolean) {
        if (value)
            this.dom.setAttribute("hidden", "");
        else
            this.dom.removeAttribute("hidden");
    }

    set width(value: string | number) { //the Code
        //  if($.isNumeric(value))
        if (value === undefined)
            value = "";
        value = value.toString();
        if (!isNaN(<any>value))
            value = value + "px";
        if (typeof (value) === "string" && value.indexOf("%") > -1 && this.domWrapper.style.display !== "inline") {
            this.dom.style.width = "100%";
            this.domWrapper.style.width = value;
        } else {
            this.dom.style.width = value.toString();
            this.domWrapper.style.width = "";
        }
        //  
    }
    @$Property({ type: "number" })
    get width() {
        if (this.domWrapper.style.width !== undefined)
            return this.domWrapper.style.width;
        return this.dom.style.width.replace("px", "");
    }

    set height(value: string | number) { //the Code
        //  if($.isNumeric(value))
        if (value === undefined)
            value = "";
        value = value.toString();
        if (!isNaN(<any>value))
            value = value + "px";
        if (typeof (value) === "string" && value.indexOf("%") > -1) {
            this.dom.style.height = "100%";
            this.domWrapper.style.height = value;
        } else {
            this.dom.style.height = value.toString();
            this.domWrapper.style.height = "";
        }
    }
    @$Property({ type: "number" })
    get height() {
        if (this.domWrapper.style.height !== undefined)
            return this.domWrapper.style.height;
        if (this.dom.style.height !== undefined)
            return undefined;
        return this.dom.style.height.replace("px", "");
    }
    @$Property({ type: "json", componentType: "jassijs.ui.CSSProperties" })
    set style(properties: React.CSSProperties) {
        var prop = CSSProperties.applyTo(properties, this);
        for (let key in prop) {

            this.dom.style[key] = prop[key];
        }
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
    @$Property({ type: "componentselector", componentType: "[jassijs.ui.Style]" })
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

    @$Property({ type: "componentselector", componentType: "jassijs.ui.ContextMenu" })
    get contextMenu() {
        return this._contextMenu;
    }
    set contextMenu(value) {

        if (this._contextMenu !== undefined)
            this._contextMenu.unregisterComponent(this);


        if (value !== undefined) {
            if (value.current)
                value = value.current;
            var ContextMenu = classes.getClass("jassijs.ui.ContextMenu");
            if (value instanceof ContextMenu === false) {
                throw new Error("value is not of type jassijs.ui.ContextMenu");
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
        //notify Hook
        for (var x = 0; x < Component._componentHook.length; x++) {
            Component._componentHook[x]("destroy", this);
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
            this.designDummies.forEach((dummy) => { dummy.destroy() });
        }
        this.events = [];
    }
    extensionCalled(action: ExtensionAction) {
    }
    //React things - we don't need it
    context: any;
    state;
    refs;
    setState() {
        throw new Error("not implemented");
    }
    forceUpdate() {
        throw new Error("not implemented");
    }
}
interface FunctionComponentProperties extends ComponentProperties, Omit<React.HTMLProps<Element>, "contextMenu"> {
    tag?: string;
    children?;
    renderFunc;
    calculateState?: (prop) => void;
}
export class FunctionComponent<T extends FunctionComponentProperties> extends Component<FunctionComponentProperties> {
    _components: Component[] = [];
    _designDummy: any;
    constructor(properties: FunctionComponentProperties) {
        super(properties);
    }

    render() {
        var Rend = this.props.renderFunc;
        var ret: any = <React.ReactNode>new Rend(this.props, this.states);
        if (ret.props.calculateState) {
            //@ts-ignore
            this.calculateState = ret.props.calculateState;
            //this.calculateState(this.props);
        }
        return ret;
    }

    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {//add a component to the container
        if (component._parent !== undefined) {
            component._parent.remove(component);
        }
        component._parent = this;
        component.domWrapper._parent = this;
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
    addBefore(component: Component, before: Component) {//add a component to the container
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
        let posd = this.designDummies?.indexOf(component);
        if (posd >= 0)
            this.designDummies.splice(posd, 1);
        try {
            this.dom.removeChild(component.domWrapper);
        } catch (ex) {

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

}
interface HTMLComponentProperties extends ComponentProperties, Omit<React.HTMLProps<Element>, "contextMenu"> {
    tag?: string;
    children?;
}


// ret.tag = atype;
//        var newdom = document.createElement(atype);
@$Class("jassijs.ui.HTMLComponent")
export class HTMLComponent<T extends HTMLComponentProperties = {}> extends Component<HTMLComponentProperties> implements HTMLComponentProperties {
    _components: Component[] = [];
    _designDummy: any;


    constructor(prop: HTMLComponentProperties = {}) {
        super(Object.assign(prop, { noWrapper: true }));

        //this.init(document.createElement(tag), { noWrapper: true });
    }
    render(): React.ReactNode {
        var ret: any;
        var tag = this.props?.tag === undefined ? "span" : this.props?.tag;
        if (this.props?.tag !== this.tag.toLowerCase()) {
            var childs = this.dom?.childNodes;
            ret = document.createElement(tag);
            //this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
            if (childs?.length > 0)
                ret.append(...<any>childs);
        }
        return ret;
    }
    config(props: HTMLComponentProperties,) {
        var tag = props?.tag === undefined ? "span" : props?.tag;
        if (props?.tag !== undefined && props?.tag !== this.tag.toLowerCase()) {
            var childs = this.dom?.childNodes;
            this.replaceDom(document.createElement(tag));
            //            this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
            if (childs?.length > 0)
                this.dom.append(...<any>childs);
        }
        super.config(props);
        for (var prop in props) {


            var val = props[prop];
            if (prop === "style") {
                for (var key in (<any>props).style) {
                    val = (<any>props).style[key];

                    /*   if (val?._observe_) {
                           val?._observe_(this, key, "style");
                           val = val.current;
                       }*/
                    this.dom.style[key] = val;
                }
            } else if (prop in this.dom) {

                /*  if (val?._observe_) {
                      val?._observe_(this, prop, "dom");
                      val = val.current;
                  }*/
                Reflect.set(this.dom, prop, val);
                //Reflect.set(this.dom, prop, [val])
            } else if (prop.toLocaleLowerCase() in this.dom) {

                /* if (val?._observe_) {
                     val?._observe_(this, prop.toLocaleLowerCase(), "dom");
                     val = val.current;
                 }
                 if (val?._observe_) {
                     val?._observe_(this, prop.toLocaleLowerCase(), "dom");
                     val = val.current;
                 }*/
                Reflect.set(this.dom, prop.toLocaleLowerCase(), val);

            } else if (prop in this.dom) {
                if (val?._observe_) {
                    val?._observe_(this, prop, "attribute");
                    val = val.current;
                }
                this.dom.setAttribute(prop, val);
            }
            // }
        }
        if (props?.children) {
            if (props?.children.length > 0 && props?.children[0] instanceof Component) {
                this.removeAll(false);
                for (var x = 0; x < props.children.length; x++) {
                    this.add(props.children[x]);
                }
                delete props.children;
            }
        }
        return this;
    }
    set tag(value: string) {
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
    @$Property()
    get tag(): string {
        var ret = this.dom?.tagName;
        if (ret === null || ret === undefined)
            return "";
        return ret;
    }
    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {//add a component to the container
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
    addBefore(component: Component, before: Component) {//add a component to the container
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
        let posd = this.designDummies?.indexOf(component);
        if (posd >= 0)
            this.designDummies.splice(posd, 1);
        try {
            this.dom.removeChild(component.domWrapper);
        } catch (ex) {

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

}


export interface TextComponentProperties extends ComponentProperties {
    text?;
}

@$Class("jassijs.ui.TextComponent")
export class TextComponent<T extends TextComponentProperties = {}> extends Component<TextComponentProperties> implements TextComponentProperties {
    constructor(props: TextComponentProperties = {}) {
        super(Object.assign(props, { noWrapper: true }));

    }
    get label() {
        return "";
    }
    get width() {
        return 0;
    }
    get height() {
        return 0;
    }
    get x() {
        return 0;
    }
    get y() {
        return 0;
    }
    get tooltip() {
        return "";
    }
    get hidden() {
        return false;
    }
    render(): React.ReactNode {
        return <any>document.createTextNode(this.props?.text);
    }
    config(props: TextComponentProperties) {
        //  if (this.dom === undefined) {
        //      this.init(<any>document.createTextNode(props?.text));
        //  }
        super.config(props);
        return this;
    }
    @$Property()
    get text() {
        return this.dom?.textContent;
    };
    set text(value: string) {

        // var p = JSON.parse(value);//`{"a":"` + value + '"}').a;
        this.dom.textContent = value;
    };
}