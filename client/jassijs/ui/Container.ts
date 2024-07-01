import { $Class } from "jassijs/remote/Registry";
import { Component, ComponentProperties } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";


export interface ContainerProperties extends ComponentProperties {
    /**
     * child components
     */
    children?;
}
@$Class("jassijs.ui.Container")
@$Property({name:"children",type:"jassijs.ui.Component"})
export class Container<T extends ContainerProperties=ComponentProperties> extends Component<T> implements Omit<ContainerProperties, "children">{
    _components: Component[];
    _designDummy: any;

    /**
     * 
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties:ContainerProperties) {//id connect to existing(not reqired)
        super(properties);
        this._components = [];
        if(this.domWrapper?.classList)
            this.domWrapper?.classList.add("jcontainer");
    }
     config(config: T,forceRender=false): Container {
        if (config?.children) {
            if (config?.children.length > 0 && config?.children[0] instanceof Component) {
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
  //  init(dom) {
    //    super.init(dom);
        
   // }

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
        this.dom.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
        //before.domWrapper.parentNode.insertBefore(component.domWrapper, before.domWrapper === undefined ? before.dom : before.domWrapper);
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


