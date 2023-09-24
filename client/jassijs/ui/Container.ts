import { $Class } from "jassijs/remote/Registry";
import { Component, ComponentConfig } from "jassijs/ui/Component";

export interface ContainerConfig extends ComponentConfig {
    /**
     * child components
     */
    children?: Component[];
}
@$Class("jassijs.ui.Container")
export class Container extends Component implements Omit<ContainerConfig, "children">{
    _components: Component[];
    _designDummy: any;

    /**
     * 
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties = undefined) {//id connect to existing(not reqired)
        super(properties);
        this._components = [];
    }
    config(config: ContainerConfig): Container {
        if (config.children) {
            this.removeAll(false);
            for (var x = 0; x < config.children.length; x++) {
                this.add(config.children[x]);
            }
            delete config.children;
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


var React = {
    createElement(atype: any, props, ...children) {
        var ret = new HTMLComponent();
        ret.tag = atype;
        ret.dom = document.createElement(atype);
        for (var prop in props) {
            debugger;
            if (prop === "style") {
                for (var key in props.style) {
                    var val = props.style[key];
                    ret.dom.style[key] = val;
                }
            } else if (prop in ret.dom) {
                Reflect.set(ret.dom, prop, [props[prop]])
            } else if (prop.toLocaleLowerCase() in ret.dom) {
                Reflect.set(ret.dom, prop.toLocaleLowerCase() , props[prop])
            } else if (ret.dom.hasAttribute(prop)) {
                ret.dom.setAttribute(prop, props[prop]);
            }
        }
        ret.init(ret.dom, { noWrapper: true });

        if (children !== undefined) {
            if (props === null || props === undefined)
                props = {};
            props.children = children;
            for (var x = 0; x < props.children.length; x++) {
                var child = props.children[x];
                if (typeof child === "string") {

                    var nd = document.createTextNode(child);
                    child = new TextComponent();
                    child.tag = "";
                    child.init(nd, { noWrapper: true });
                    //child.dom = nd;
                }
                ret.add(child);
            }
        }

        return ret;
    }
}
declare global {
    interface React {
        createElement(atype: any, props, ...children);
    }
}
//@ts-ignore;
window.React = React;

export class HTMLComponent extends Component {
    tag: string;
    _components: Component[] = [];
    _designDummy: any;
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
export class TextComponent extends Component {
    tag: string;
}