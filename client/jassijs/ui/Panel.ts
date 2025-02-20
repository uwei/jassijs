import { $Class } from "jassijs/remote/Registry";
import { Container, ContainerProperties } from "jassijs/ui/Container";
import { Component, $UIComponent, ComponentProperties } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";


export interface PanelProperties extends ContainerProperties {
    /**
      * @param {boolean} the elements are ordered absolute
      **/

    isAbsolute?: boolean;
    useSpan?: boolean;
    domProperties?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}



@$UIComponent({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] })
@$Class("jassijs.ui.Panel")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.PanelProperties" })
@$Property({ name: "new/useSpan", type: "boolean", default: false })
export class Panel<T extends PanelProperties = PanelProperties> extends Container<T> implements PanelProperties {
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties: T = <any>{}) {//id connect to existing(not reqired)
        super(properties);
        this.isAbsolute = properties?.isAbsolute === true;
    }
    render(): React.ReactElement {
        var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
        return React.createElement(tag, { ...this.props.domProperties, className: "Panel" });
    }
    @$Property()
    set isAbsolute(value: boolean) {
        this.state.isAbsolute.current = value;
        if (this.dom.classList) {
            if (value)
                this.dom.classList.add("jabsolutelayout");
            else
                this.dom.classList.remove("jabsolutelayout");
        }
       // if (this._designMode !== undefined)
        //    this._setDesignMode(this._designMode);
        //if (this._designMode && this._activeComponentDesigner) {
        //    this._activeComponentDesigner.editDialog(true);
       // }
    }
    get isAbsolute(): boolean {
        return this.state.isAbsolute.current;
    }
    max() {
        if (this._id == "body") {
            this.domWrapper.style.width = "100%";
            this.domWrapper.style.height = "calc(100vh - 2px)";
        } else {
            this.domWrapper.style.width = "100%";
            this.domWrapper.style.height = "100%";
        }
    }
    /*extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            return action.componentDesignerSetDesignMode.enable;
        }
        super.extensionCalled(action);
    }*/
    /**
    * adds a component to the container
    * @param {jassijs.ui.Component} component - the component to add
    */
    add(component: Component) {//add a component to the container
        // $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});

        return super.add(component);
    }
    /**
     * adds a component to the container before an other component
     * @param {jassijs.ui.Component} component - the component to add
     * @param {jassijs.ui.Component} before - the component before then component to add
     */
    addBefore(component: Component, before: Component) {//add a component to the container
        //   $(component.domWrapper).css({position:(this.isAbsolute ? "absolute" : "relative")});
        return super.addBefore(component, before);
    }
   
    destroy() {

        super.destroy();
   
    }
}




