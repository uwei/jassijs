import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Container } from "jassijs/ui/Container";
import { Component, $UIComponent, ComponentCreateProperties } from "jassijs/ui/Component";
import { Property, $Property } from "jassijs/ui/Property";
import { Image } from "jassijs/ui/Image";
import { DesignDummy } from "jassijs/ui/DesignDummy";

@$Class("jassijs.ui.PanelCreateProperties")
class PanelCreateProperties extends ComponentCreateProperties {
    @$Property({ default: false })
    useSpan?: boolean;
}

@$UIComponent({ fullPath: "common/Panel", icon: "mdi mdi-checkbox-blank-outline", editableChildComponents: ["this"] })
@$Class("jassijs.ui.Panel")
@$Property({ name: "new", type: "json", componentType: "jassijs.ui.PanelCreateProperties" })
//@$Property({ name: "new/useSpan", type: "boolean", default: false })
export class Panel extends Container {
    _isAbsolute: boolean;
    private _activeComponentDesigner:any;
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties: PanelCreateProperties = undefined) {//id connect to existing(not reqired)
        var addStyle = "";
        var tag = properties !== undefined && properties.useSpan === true ? "span" : "div";
        if (properties != undefined && properties.id === "body") {
            super();

            this.dom = document.body;
            this.domWrapper = this.dom;
            /** @member {numer}  - the id of the element */
            this._id = "body";
            this.dom.id = "body";
            //super.init($('<div class="Panel" style="border:1px solid #ccc;"/>')[0]);

            //            $(document.body).append(this.domWrapper); 
        } else {
            super(properties);
            if (properties === undefined || properties.id === undefined) {
                //super.init($('<div class="Panel"/>')[0]);
                super.init($('<' + tag + ' class="Panel" />')[0]);
            }
        }
        this._designMode = false;
        this.isAbsolute = false;
    }
    /**
     * @param {boolean} the elements are ordered absolute
     **/
    set isAbsolute(value: boolean) {
        this._isAbsolute = value;
        if (value)
            $(this.dom).addClass("jabsolutelayout");
        else
            $(this.dom).removeClass("jabsolutelayout");
        if (this._designMode !== undefined)
            this._setDesignMode(this._designMode);
        if(this._designMode&&this._activeComponentDesigner){
            this._activeComponentDesigner.editDialog(true);
        }
    }
    @$Property()
    get isAbsolute(): boolean {
        return this._isAbsolute;
    }
    max() {
        if (this._id == "body") {
            $(this.domWrapper).css("width", "100%");
            $(this.domWrapper).css("height", "calc(100vh - 2px)");
        } else {
            $(this.domWrapper).css("width", "100%");
            $(this.domWrapper).css("height", "100%");
        }
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._activeComponentDesigner=action.componentDesignerSetDesignMode.componentDesigner;
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
        this._designMode = enable; 
        if (enable) {//dummy in containers at the end
            if (this.isAbsolute === false) {
                DesignDummy.createIfNeeded(this, "atEnd", (this["_editorselectthis"] ? this["_editorselectthis"] : this));

                /*            if (this._designDummy === undefined && this.isAbsolute === false) {
                                this._designDummy = new Image();
                                this._designDummy._parent=this;
                                console.log(this._designDummy._id);
                                $(this._designDummy.domWrapper).removeClass("jcomponent");
                                $(this._designDummy.domWrapper).addClass("jdesigndummy");
                                $(this._designDummy.domWrapper).css("width","16px");
                                this._designDummy["designDummyFor"] = "atEnd";
                                this._designDummy["src"] = "res/add-component.ico";
                                this._designDummy["_editorselectthis"]=(this["_editorselectthis"]?this["_editorselectthis"]:this);
                                //$(this.domWrapper).append(this._designDummy.domWrapper);
                                this.domWrapper.appendChild(this._designDummy.domWrapper);
                            } else if (this._designDummy !== undefined && this.isAbsolute === true) {
                                this.remove(this._designDummy);
                                this._designDummy.destroy();
                                this._designDummy = undefined;
                            }*/
            } else {
                DesignDummy.destroyIfNeeded(this, "atEnd");
                /* if (this._designDummy !== undefined) {
                     this.remove(this._designDummy);
                     this._designDummy = undefined;
                 }*/
            }
        }else{
        	DesignDummy.destroyIfNeeded(this, "atEnd");
        }
            if (enable) {//dummy in containers at the end

                if (this.isAbsolute === false) {
                    for (var x = 0;x < this._components.length;x++) {
                        var comp = this._components[x];
                        if (comp instanceof Container && !$(comp.dom).hasClass("jdisableaddcomponents")) {
                        	 DesignDummy.createIfNeeded(comp, "beforeComponent", (this["_editorselectthis"] ? this["_editorselectthis"] : this));
                        }
                    }
                }
            } else {
                for (var x = 0;x < this._components.length;x++) {
                    var comp = this._components[x];
                    DesignDummy.destroyIfNeeded(comp, "beforeComponent");
                     
                }
            }
        

    }
    destroy() {
        super.destroy();
        if (this._designDummy)
            this._designDummy.destroy();
        this._activeComponentDesigner=undefined;
    }
}




