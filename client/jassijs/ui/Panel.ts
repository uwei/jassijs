import { $Class } from "jassijs/remote/Registry";
import { Container, ContainerProperties } from "jassijs/ui/Container";
import { Component, $UIComponent, ComponentProperties } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { Image } from "jassijs/ui/Image";
import { DesignDummy } from "jassijs/ui/DesignDummy";

export interface PanelProperties extends ContainerProperties {
    /**
      * @param {boolean} the elements are ordered absolute
      **/
   
    isAbsolute?: boolean;
    useSpan?: boolean;
    domProperties?:React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
}



@$UIComponent({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] })
@$Class("jassijs.ui.Panel")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.PanelProperties" })
@$Property({ name: "new/useSpan", type: "boolean", default: false })
export class Panel<T extends PanelProperties=PanelProperties > extends Container<T> implements PanelProperties {
    _isAbsolute: boolean;
    private _activeComponentDesigner: any;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties: PanelProperties = <any>{}) {//id connect to existing(not reqired)
        super(properties); 
        this._designMode = false;
        this.isAbsolute = properties?.isAbsolute === true;
    }
    render():React.ReactElement{ 
        var tag = this.props !== undefined && this.props.useSpan === true ? "span" : "div";
        return React.createElement(tag, { ...this.props.domProperties,className: "Panel" });
    }
    @$Property()
    set isAbsolute(value: boolean) {
        this._isAbsolute = value;
        if (value)
            this.dom.classList.add("jabsolutelayout");
        else
            this.dom.classList.remove("jabsolutelayout");
        if (this._designMode !== undefined)
            this._setDesignMode(this._designMode);
        if (this._designMode && this._activeComponentDesigner) {
            this._activeComponentDesigner.editDialog(true);
        }
    }
    get isAbsolute(): boolean {
        return this._isAbsolute;
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
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
        }
        super.extensionCalled(action);
    }
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
    /**
     * activates or deactivates designmode
     * @param {boolean} enable - true if activate designMode
     */
    protected _setDesignMode(enable) {
        return;
        this._designMode = enable;
        if (enable) {//dummy in containers at the end
            if (this.isAbsolute === false) {
                DesignDummy.createIfNeeded(this, "atEnd", (this["_editorselectthis"] ? this["_editorselectthis"] : this));

            } else {
                DesignDummy.destroyIfNeeded(this, "atEnd");
                /* if (this._designDummy !== undefined) {
                     this.remove(this._designDummy);
                     this._designDummy = undefined;
                 }*/
            }
        } else {
            DesignDummy.destroyIfNeeded(this, "atEnd");
        }
        if (enable) {//dummy in containers at the end

            if (this.isAbsolute === false&&this._components) {
                for (var x = 0; x < this._components.length; x++) {
                    var comp = this._components[x];
                    if (comp instanceof Container && !comp.dom.classList.contains("jdisableaddcomponents")) {
                        DesignDummy.createIfNeeded(comp, "beforeComponent", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                    }
                }
            }
        } else {
            if (this._components) {
                for (var x = 0; x < this._components.length; x++) {
                    var comp = this._components[x];
                    DesignDummy.destroyIfNeeded(comp, "beforeComponent");

                }
            }
        }


    }
    destroy() {
        
        super.destroy();
        if (this._designDummy)
            this._designDummy.destroy();
        this._activeComponentDesigner = undefined;
    }
}




