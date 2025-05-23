import { $Class } from "jassijs/remote/Registry";
import { Component, ComponentProperties, TextComponent, createComponent } from "jassijs/ui/Component";
import { $Property } from "jassijs/ui/Property";


export interface SimpleContainerProperties extends Omit<ComponentProperties,"children">{
}
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

    /**
     * 
     * @param {object} properties - properties to init
     * @param {string} [properties.id] -  connect to existing id (not reqired)
     * 
     */
    constructor(properties:ContainerProperties) {//id connect to existing(not reqired)
        super(properties);
        if(this.domWrapper?.classList)
            this.domWrapper?.classList.add("jcontainer");
    }
    private createChildren(props){
        if(this._components===undefined)
            this._components=[];
        if(props?.children){
            this.removeAll(false);
            this._components=[];
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

    config(config: T,forceRender=false): Container {
        if(super.config(config))
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
        //@ts-ignore
        let posd = this.designDummies?.indexOf(component);
        if (posd >= 0){
            //@ts-ignore
            this.designDummies.splice(posd, 1);
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


