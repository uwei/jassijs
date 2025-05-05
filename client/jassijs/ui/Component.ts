//import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
//import { CSSProperties } from "jassijs/ui/CSSProperties";
import { State, States, createRefs, createStates, resolveState } from "jassijs/ui/State";


let _nextID: number = 10;
/**
* with every call a new id is generated - used to create a free id for the dom
* @returns {number} - the id
*/
export function nextID() {
    _nextID = _nextID + 1;
    return _nextID.toString();
}



declare global {
    interface Element {
        _this: Component<any>;
        _id?: string;
        _thisOther: Component<any>[];
    }

}


export interface SimpleComponentProperties extends Omit<ComponentProperties, "height" | "hidden" | "label" | "replaceNode" | "style" | "styles" | "tooltip" | "contextMenu" | "useWrapper" | "width" | "x" | "y" | "onblur" | "onfocus"> {

}
export interface ComponentProperties {
    exists?: boolean;
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
    useWrapper?: boolean;
    replaceNode?: any;

}


var React = {
    createElement(type: any, props, ...children) {

        if (props === undefined || props === null)//TODO is this right?
            props = {};
        if (children?.length > 0) {
            if (props.children === undefined)
                props.children = children;
            else {
                children.forEach((c) => props.children.push(c));
            }
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
declare global {
    namespace React {
        interface ClassAttributes<T> extends React.RefAttributes<T> {
            exists?: boolean;
            label?: string;
        }
        interface Component<P = {}, S = {}, SS = any> {
            //@ts-ignore
            context?: never;
            //@ts-ignore
            setState?: never;
            //@ts-ignore
            //forceUpdate?: never;
        }
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
export function jc(type: "input", props?: React.InputHTMLAttributes<HTMLInputElement> & React.ClassAttributes<HTMLInputElement> | null, ...children: React.ReactNode[]): React.DetailedReactHTMLElement<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;
export function jc<P extends React.HTMLAttributes<T>, T extends HTMLElement>(type: keyof React.ReactHTML, props?: React.ClassAttributes<T> & P | null, ...children: React.ReactNode[]): React.DetailedReactHTMLElement<P, T>;
export function jc<P extends React.SVGAttributes<T>, T extends SVGElement>(type: keyof React.ReactSVG, props?: React.ClassAttributes<T> & P | null, ...children: React.ReactNode[]): React.ReactSVGElement;
export function jc<P extends React.DOMAttributes<T>, T extends Element>(type: string, props?: React.ClassAttributes<T> & P | null, ...children: React.ReactNode[]): React.DOMElement<P, T>;


export function jc<P extends {}>(type: React.FunctionComponent<P>, props?: React.Attributes & P | null, ...children: React.ReactNode[]): React.FunctionComponentElement<P>;
export function jc<P extends {}>(type: React.ClassType<P, React.ClassicComponent<P, React.ComponentState>, React.ClassicComponentClass<P>>, props?: React.ClassAttributes<React.ClassicComponent<P, React.ComponentState>> & P | null, ...children: React.ReactNode[]): React.CElement<P, React.ClassicComponent<P, React.ComponentState>>;
export function jc<P extends {}, T extends React.Component<P, React.ComponentState>, C extends React.ComponentClass<P>>(type: React.ClassType<P, T, C>, props?: React.ClassAttributes<T> & P | null, ...children: React.ReactNode[]): React.CElement<P, T>;
export function jc<P extends {}>(type: React.FunctionComponent<P> | React.ComponentClass<P> | string, props?: React.Attributes & P | null, ...children: React.ReactNode[]): React.ReactElement<P>;

export function jc(type: any, props: any, ...children): any {
    return React.createElement(type, props, ...children);
}
function createFunctionComponent<P extends {}>(
    type: React.FunctionComponent<P>,
    props?: React.Attributes & P | null,
    ...children: React.ReactNode[]): FunctionComponent<P> {
    var p: any = props || {};
    p.renderFunc = type;
    var ret = new FunctionComponent(p);
    return ret;
}
window.React = React;
export function createComponent<T>(node: React.FunctionComponentElement<T>): FunctionComponent<T>;
export function createComponent<T>(node: React.ReactElement<T>): T;//node: { key: string, props: any, type: any }):Component {


export function createComponent(node: React.ReactNode): any {//node: { key: string, props: any, type: any }):Component {
    var atype = (<any>node).type;
    var props = (<any>node).props;
    var aref = (<any>node).props?.ref;
    var ret;
    if (atype === undefined)
        debugger;
    if (typeof atype === "string") {
        if (props === undefined)
            props = {};
        props.tag = atype;
        ret = new HTMLComponent(props);
    } else if (atype.constructor !== undefined) {

        if (atype.prototype.forceUpdate === undefined) {//Functioncompoment
            var p = props || {};
            p.renderFunc = atype;
            ret = new FunctionComponent(p);

        } else {
            ret = new atype(props);

        }
    }
    if (aref) {
        aref.current = ret;
        //  delete props?.ref;
    }
    return ret;

}


//class TC <Prop>extends React.Component<Prop,{}>{
//@$Class("jassijs.ui.Component")

export class Component<T extends ComponentProperties = {}> implements React.Component<T> {

    refs;
    props: T;
    state: States<T>;
    private static _componentHook = [];
    _eventHandler;
    __dom: HTMLElement;
    public domWrapper: HTMLElement;
    _id: string;
    _parent;
    events;


    _styles?: any[];

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
        this.refs = createRefs();
        this.state = <any>createStates(properties);
        this.props = <any>properties;
        resolveState(this, this.props);
        this.forceUpdate(<any>true);//first Time
        this.config(this.props);
    }
    /**
     * force rerender the component with initial props and changed states
     */
    public forceUpdate(callback: () => void = undefined) {
        if (this?.state?.exists?.current === false) {
            var node = document.createComment(this.constructor.name + " with exists=false");
            var save = this.props;
            this.props = <any>{};
            this._initComponent(<any>node);
            this.props = save;
            return;
        }
        var domOld = this.domWrapper;
        //@ts-ignore
        var rend = this.render(this.state);
        if (rend) {
            if (rend instanceof Node) {
                this._initComponent(<any>rend);
            } else {

                var comp = createComponent(rend);
                this._initComponent((<any>comp).dom);
            }
        }
        if (domOld?.parentNode) {
            domOld.parentNode.replaceChild(this.dom, domOld);
        }
        //@ts-ignore
        if (callback === true)
            this.componentDidMount();
        else {
            var props = Object.assign({}, this.props);
            var keys = this.state._used;
            keys.forEach((k) => props[k] = this.state[k].current);
            this.config(props);
            if (callback !== undefined)
                callback();
        }
    }
    componentDidMount() {

    }
    render() {
        return undefined;
    }
    /*  rerender() {
          var alt = this.dom;
          this.init(this.lastinit, { replaceNode: this.dom });
          this.config(this.lastconfig);
      }*/
    config(config: T): Component {
        if (config?.exists === false || (config?.exists === undefined && this.state?.exists?.current === false)) {
            if (config?.exists === false)
                this.exists = false;
            return undefined;
        }
        var con: any = Object.assign({}, config);
        // delete con.useWrapper; why?
        delete con.replaceNode;
        // this.lastconfig = config;
        var notfound = <any>{}

        for (var key in con) {
            if (key in this) {
                var me = <any>this;


                var val = con[key];
                if (val?._$isState$_) {
                    val?._observe_(this, key, "property");
                    con[key] = val.current;
                    config[key] = con[key];
                }


                if (typeof me[key] === 'function') {
                    me[key](config[key]);
                } else {
                    if (me[key]?._$isState$_ !== undefined) {
                        me[key].current = config[key];
                    } else
                        me[key] = config[key];

                }
            } else if (this.state && this.state._used.indexOf(key) !== -1) {
                this.state[key].current = config[key];
            } else
                notfound[key] = con;
        }
        Object.assign(this.props === undefined ? {} : this.props, config);

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
    get exists(): boolean {

        return this.state.exists.current;
    }

    set exists(value: boolean) {
        var old = this.state.exists.current;
        this.state.exists.current = value;
        if (old !== value) {
            this.forceUpdate();

        }
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
//            this.dom.classList.add("jinlinecomponent");
            this.dom.classList.add("jresizeable");
            if (domalt !== undefined && domalt.classList) {
            //    domalt.classList.remove("jinlinecomponent");
                domalt.classList.remove("jresizeable");
            }
        }
        if (this.dom._this && this.dom._this !== this) {
            if (this.dom._thisOther === undefined)
                this.dom._thisOther = [];
            this.dom._thisOther.splice(0, 0, this.dom._this);
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
        this._id = olddom?.id ? olddom.id : ("j" + nextID());
        if (this.dom.setAttribute !== undefined)//Textnode
            this.dom.setAttribute("id", this._id);
        /** @member {Object.<string,function>} - all event handlers*/
        this._eventHandler = {};
        //add _this to the dom element
        var lid = oldwrapper?.id ? oldwrapper.id : ("j" + nextID());
        /*  var st = 'style="display: inline-block"';
          if (this instanceof classes.getClass("jassijs.ui.Container")) {
              st = "";
          }*/

        if (this.props !== undefined && (<any>this.props).useWrapper === true) {
            /** @member {dom} - the dom element for label*/
            let strdom = '<div class="jwrapper" id="' + lid  + /*st +*/ '"></div>';
            //let strdom = '<div id="' + lid + '" class ="jcomponent"' + /*st +*/ '></div>';
            this.domWrapper = Component.createHTMLElement(strdom);
            this.domWrapper._this = this;
            this.domWrapper._id = lid;
            this.domWrapper.appendChild(dom);
        } else {
            this.domWrapper = this.dom;
            this.domWrapper._id = this._id;  
           // if (this.domWrapper.classList !== undefined)
           //     this.domWrapper.classList.add("jcomponent");
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
    //@$Property({ description: "wraps the component with div" })

    set useWrapper(value: boolean) {
        if (value === true && this.dom === this.domWrapper) {//wrap
            var lid = "j" + nextID();
            var st = "";/*'style="display: inline-block"';
            if (this instanceof classes.getClass("jassijs.ui.Container")) {
                st = "";
            }*/
            /** @member {dom} - the dom element for label*/
            let strdom = '<div class="jwrapper" id="' + lid + '"' + st + '></div>';
            this.domWrapper = Component.createHTMLElement(strdom);
            this.domWrapper._this = this;
            this.domWrapper._id = lid;
            if (this.dom.parentNode)
                this.dom.parentNode.replaceChild(this.domWrapper, this.dom);//removeChild(this.domWrapper);
            this.domWrapper.appendChild(this.dom);
        }
        if (value === false && this.dom !== this.domWrapper) {//unwrap
            if (this.domWrapper.parentNode)
                this.domWrapper.parentNode.replaceChild(this.dom, this.domWrapper);//removeChild(this.domWrapper);
            this.domWrapper = this.dom;
            this.domWrapper._id = this._id;
            //if (this.domWrapper.classList !== undefined)
                //this.domWrapper.classList.add("jcomponent");
        }
    }
    //@$Property({ default: "function(event){\n\t\n}" })
    onfocus(handler) {
        return this.on("focus", handler);
    }

    //@$Property({ default: "function(event){\n\t\n}" })
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
            olddom.parentNode.replaceChild(dom, olddom);
        }
        this.dom = dom;
        if (oldwrapper === olddom)
            this.domWrapper = dom;
        if (this.dom.setAttribute && olddom.getAttribute)
            this.dom.setAttribute("id", olddom.getAttribute("id"));
    }



    //@$Property({ description: "adds a label above the component" })
    set label(value: string) { //the Code
        this.state.label.current = value;
        if (value !== undefined)
            this.useWrapper = true;
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
        return this.state.label.current; //this.domWrapper.querySelector(".jlabel")?.innerHTML;
    }

    //@$Property({ description: "tooltip are displayed on mouse over" })
    get tooltip(): string {
        return this.dom.getAttribute("title");
    }
    set tooltip(value: string) { //the Code
        this.dom.setAttribute("title", value);

    }

    //@$Property()
    get x(): number {
        return Number(this.domWrapper.style.left.replace("px", ""));
    }

    set x(value: number) { //the Code
        this.domWrapper.style.left = value.toString().replace("px", "") + "px";
        this.domWrapper.style.position = "absolute";
        this.state.x.current = value;
    }

    //@$Property()
    get y(): number {
        return Number(this.domWrapper.style.top.replace("px", ""));
    }

    set y(value: number) { //the Code
        this.domWrapper.style.top = value.toString().replace("px", "") + "px";
        this.domWrapper.style.position = "absolute";
        this.state.y.current = value;
    }

    //@$Property()
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
            this.domWrapper.style.width = ""
            this.dom.style.width = value.toString();

        }
        this.state.width.current = value;
        //  
    }
    //@$Property({ type: "number" })
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
            this.domWrapper.style.height = "";
            this.dom.style.height = value.toString();

        }
        this.state.height.current = value;
    }
    //@$Property({ type: "number" })
    get height() {
        if (this.domWrapper.style.height !== undefined)
            return this.domWrapper.style.height;
        if (this.dom.style.height !== undefined)
            return undefined;
        return this.dom.style.height.replace("px", "");
    }
    //@$Property({ type: "json", componentType: "jassijs.ui.CSSProperties" })
    set style(properties: React.CSSProperties) {
        var prop = properties;//CSSProperties.applyTo(properties, this);
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
    //@$Property({ type: "componentselector", componentType: "[jassijs.ui.Style]" })
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

    //@$Property({ type: "componentselector", componentType: "jassijs.ui.ContextMenu" })
    get contextMenu() {
        return this.state.contextMenu.current;
    }
    set contextMenu(value) {
        if (this.contextMenu !== undefined)
            this.contextMenu.unregisterComponent(this);
        if (value !== undefined) {
            // var ContextMenu = classes.getClass("jassijs.ui.ContextMenu");
            // if ((<any>value) instanceof ContextMenu === false) {
            //     throw new Error("value is not of type jassijs.ui.ContextMenu");
            // }
            this.state.contextMenu.current = value;
            value.registerComponent(this);
        } else
            this.state.contextMenu.current = undefined;
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
        this.events = [];
    }
    /**
     * @deprecated React-things not use it.
     */
    current: any;//allow ref=Component


    extensionCalled(action: ExtensionAction) {
    }

}

export class FunctionComponent<T> extends Component<T> {
    _components: Component[];
    constructor(properties: T) {
        super(properties);
    }

    config(config: T, forceRender = false): FunctionComponent<T> {
        super.config(config);
        return this;
    }

    render() {
        var Rend = (<any>this.props).renderFunc;
        var p: any = this.props;
        if (p === undefined)
            p = <any>{};
        p.connectComponents = 1;
        var ret: any = <React.ReactNode>new Rend(p, this.state);
        return ret;
    }
    //add dom children to _components
    set connectComponents(value) {

        this._components = [];
        var nodes = this.dom.childNodes;
        for (var x = 0; x < nodes.length; x++) {
            //@ts-ignore
            this._components.push(nodes[x]._this);
        }
    }
    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component) {//add a component to the container
        if (this._components === undefined)
            this._components = [];
        if (component._parent !== undefined) {
            component._parent.remove(component);
        }
        component._parent = this;
        component.domWrapper._parent = this;
        this._components.push(component);
        this.dom.appendChild(component.domWrapper);
    }
    /**
     * adds a component to the container before an other component
     * @param {jassijs.ui.Component} component - the component to add
     * @param {jassijs.ui.Component} before - the component before then component to add
     */
    addBefore(component: Component, before: Component) {//add a component to the container
        if (this._components === undefined)
            this._components = [];
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
        while (this._components?.length > 0) {
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
//@$UIComponent({ fullPath: "common/HTMLComponent", icon: "mdi mdi-cloud-tags" , initialize:{tag:"input"},} )
//@$Class("jassijs.ui.HTMLComponent")
//@$Property({ name: "children", type: "jassijs.ui.Component", createDummyInDesigner: doCreateDummyForHTMLComponent })
export class HTMLComponent<T extends HTMLComponentProperties = {}> extends Component<HTMLComponentProperties> implements HTMLComponentProperties {
    _components: Component[];

    constructor(prop: HTMLComponentProperties = {}) {
        super(prop);

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
    private createChildren(props) {
        if (props?.children) {
            this.removeAll(false);
            this._components = [];
            for (var x = 0; x < props.children.length; x++) {
                var child = props.children[x];
                var cchild;
                if (typeof child === "string") {
                    cchild = new TextComponent();
                    cchild.tag = "";
                    cchild.text = child;
                } else if (child?._$isState$_) {
                    cchild = new TextComponent();
                    cchild.tag = "";
                    child?._observe_(cchild, "text", "property");
                    cchild.text = child.current;
                } else {
                    cchild = createComponent(child);
                }
                this.add(cchild);
            }
            delete props.children;
        }
    }
    config(props: HTMLComponentProperties,) {
        if (!super.config(props))
            return;

        this.createChildren(props);

        for (var prop in props) {


            var val = props[prop];
            if (prop === "style") {
                for (var key in (<any>props).style) {
                    val = (<any>props).style[key];
                    this.dom.style[key] = val;
                }
            } else if (prop in this.dom) {
                Reflect.set(this.dom, prop, val);
                //Reflect.set(this.dom, prop, [val])
            } else if (prop.toLocaleLowerCase() in this.dom) {
                Reflect.set(this.dom, prop.toLocaleLowerCase(), val);

            } else if (prop in this.dom) {
                if (val?._$isState$_) {
                    val?._observe_(this, prop, "attribute");
                    val = val.current;
                }
                this.dom.setAttribute(prop, val);
            }
            // }
        }
        /*  if (props?.children) {
              if (props?.children.length > 0 && props?.children[0] instanceof Component) {
                  this.removeAll(false);
                  for (var x = 0; x < props.children.length; x++) {
                      this.add(props.children[x]);
                  }
                  delete props.children;
              }
          }*/
        return this;
    }
    set tag(value: string) {
        var tag = value == undefined ? "span" : value;
        if (tag !== this.state.tag.current?.toLowerCase()) {
            var childs = this.dom?.childNodes;
            this.replaceDom(document.createElement(tag));
            //            this.init(document.createElement(tag), { replaceNode: this.dom, noWrapper: true });
            if (childs?.length > 0)
                this.dom.append(...<any>childs);
        }
        this.state.tag.current = value;
    }
    /* @$Property({
         chooseFromStrict: true,
         chooseFrom: (comp) => {
             const allElements = <any>document.body.getElementsByTagName('*');
             const uniqueTags = new Set();
 
             for (let element of allElements) {
                 uniqueTags.add(element.tagName.toLowerCase());
             }
             return Array.from(uniqueTags).sort();
         }
     })*/
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
        if (this._components === undefined)
            this._components = [];

        if (this?.state?.exists?.current === false) {
            return;
        }
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
    addBefore(component: Component, before: Component) {//add a component to the container
        if (this._components === undefined)
            this._components = [];

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
        while (this._components?.length > 0) {
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

//@$Class("jassijs.ui.TextComponent")
export class TextComponent<T extends TextComponentProperties = {}> extends Component<TextComponentProperties> implements TextComponentProperties {
    constructor(props: TextComponentProperties = {}) {
        super(props);

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
        var text = this.props?.text;
        if (text === undefined)
            text = "";
        return <any>document.createTextNode(text);
    }
    config(props: TextComponentProperties) {
        //  if (this.dom === undefined) {
        //      this.init(<any>document.createTextNode(props?.text));
        //  }
        super.config(props);
        return this;
    }
    //@$Property()
    get text() {
        return this.dom?.textContent;
    };
    set text(value: string) {

        // var p = JSON.parse(value);//`{"a":"` + value + '"}').a;
        this.dom.textContent = value;
    };
}
export function migrateModul(oldModul, newModul) {
    if (newModul) {
        newModul._nextID = oldModul._nextID;
    }
}