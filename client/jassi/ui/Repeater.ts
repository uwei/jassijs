
import jassi from "jassi/jassi";
import {Container} from "jassi/ui/Container";
import {Panel} from "jassi/ui/Panel";
import {ComponentDesigner} from "jassi_editor/ComponentDesigner";
import {Databinder} from "jassi/ui/Databinder";
import {Component,  $UIComponent } from "jassi/ui/Component";
import {Property,  $Property } from "jassi/ui/Property";
import { $Class } from "jassi/remote/Jassi";
class DesignPanel extends Panel {
    databinder: Databinder;
    me;
}


@$UIComponent({ fullPath: "common/Repeater", icon: "mdi mdi-locker-multiple",editableChildComponents: ["this","design"]})
@$Class("jassi.ui.Repeater")
export class Repeater extends Panel {
    _componentDesigner: ComponentDesigner;
    _autocommit: boolean;
    _createRepeatingComponent;
    _value;
    _isCreated: boolean;
    _designer: Component;
    _databinder: Databinder;
    design: DesignPanel;
    me;
    /**
     * can be used for controls in repeating group
     */
    binder: Databinder;
  
    /**
    * 
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    * 
    */
    constructor(properties = undefined) {//id connect to existing(not reqired)

        super();
        this._autocommit = false;
        this.design = new DesignPanel();
        this.add(this.design);
        this.design.width = "100%";
        this.design.height = "100%";
        $(this.design.domWrapper).addClass("designerNoDraggable");
        $(this.design.dom).addClass("designerNoSelectable");
        $(this.design.dom).addClass("designerNoResizable");
    }

    createRepeatingComponent(func) {
        this._createRepeatingComponent = func;
        func.bind(this);
        if (this._value !== undefined)
            this.update();

    }
    _copyMeFromParent(me, parent, override = true) {
        if (parent === undefined)
            return;
        if (parent.me !== undefined) {
            for (var key in parent.me) {
                if (override === true || me[key] === undefined) {
                    me[key] = parent.me[key];
                }
            }
            return;
        }
        this._copyMeFromParent(me, parent._parent);
    }
    update() {
        if (this._createRepeatingComponent === undefined)
            return;

        if (this._designMode === true) {
            if (this.design._parent !== this) {
                this.removeAll();
                this.add(this.design);
            }
            if (this._isCreated !== true) {
                this.design.databinder = new Databinder();
                this.me = {};
                this._copyMeFromParent(this.me, this._parent);
                this._createRepeatingComponent(this.me);
                var comp = this._componentDesigner.designedComponent;
                if(comp["me"]!==undefined){
                    this._copyMeFromParent(comp["me"], this, false);//me from Dialog
                    this._componentDesigner._codeEditor.variables.addVariable("me", comp["me"]);
                    this._componentDesigner._codeEditor.variables.updateCache();
                }

                this._isCreated = true;
            }
            if (this.value === undefined || this.value === null || this.value.length < 0)
                this.design.databinder.value = undefined;
            else
                this.design.databinder.value = this.value[0];
            this.design.extensionCalled({
                componentDesignerSetDesignMode: {
                    enable: this._designMode,
                    componentDesigner: undefined
                }
            });


            //this.design._setDesignMode(this._designMode);
        } else {
            this.remove(this.design);//no destroy the design
            this.removeAll(true);
            if (this.value === undefined)
                return;
            var sic = this.design;
            for (var x = 0; x < this.value.length; x++) {
                this.design = new DesignPanel();
                var ob = this.value[x];
                this.design.databinder = new Databinder();
                this.design.databinder.value = ob;
                this.design.me = {};
                this._copyMeFromParent(this.design.me, this._parent);
                this._createRepeatingComponent(this.design.me);
                this.add(this.design);
                this.add(this.design.databinder);
            }
            this.design = sic;
        }
    }
    /**
     * adds a component to the container
     * @param {jassi.ui.Component} component - the component to add
     */
    add(component) {
        super.add(component);

    }
    _dummy(func) {
        //dummy
    }
    /**
     *  @member {array} value - the array which objects used to create the repeating components
     */
    set value(val) {
        this._value = val;
        this.update();
    }
    get value() {
        return this._value;
    }
    extensionCalled(action: ExtensionAction) {
        if (action.componentDesignerSetDesignMode) {
            this._setDesignMode(action.componentDesignerSetDesignMode.enable,action.componentDesignerSetDesignMode.componentDesigner);
        }
    }
    /**
     * activates or deactivates designmode
     * @param {boolean} enable - true if activate designMode
     */
    _setDesignMode(enable, designer = undefined) {
        this._componentDesigner = designer;
        if (this._designMode !== enable) {
            this._designMode = enable;
            this.update();
        } else
            this._designMode = enable;
        //	super.setDesignMode(enable);
    }
    /**
     * binds a component to a databinder
     * @param {jassi.ui.Databinder} databinder - the databinder to bind
     * @param {string} property - the property to bind
     */
    @$Property({type:"databinder"})
    bind(databinder, property) {
        this._databinder = databinder;
        databinder.add(property, this, "_dummy");
    }

    destroy() {
    	this._value=undefined;
        this.design.destroy();
        super.destroy();
    }
}


