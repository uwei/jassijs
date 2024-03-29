var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Panel_1, Databinder_1, Component_1, Property_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater = void 0;
    let RepeaterDesignPanel = class RepeaterDesignPanel extends Panel_1.Panel {
    };
    RepeaterDesignPanel = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.RepeaterDesignPanel")
    ], RepeaterDesignPanel);
    let Repeater = class Repeater extends Panel_1.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = {}) {
            super();
            this._autocommit = false;
            this.design = new RepeaterDesignPanel();
            this.add(this.design);
            this.design.width = "100%";
            this.design.height = "100%";
            this.design.domWrapper.classList.add("designerNoDraggable");
            this.design.dom.classList.add("designerNoSelectable");
            this.design.dom.classList.add("designerNoResizable");
        }
        config(config) {
            super.config(config);
            return this;
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
                    this.design.databinder = new Databinder_1.Databinder();
                    // var code:string=this._createRepeatingComponent.toString();
                    // var varname=code.substring(code.indexOf("(")+1,code.indexOf(")"));
                    // this._componentDesigner._codeEditor.variables.addVariable(varname,this.design.databinder);
                    this.me = {};
                    this._copyMeFromParent(this.me, this._parent);
                    this._createRepeatingComponent(this.me);
                    var comp = this._componentDesigner.designedComponent;
                    if (comp["me"] !== undefined) {
                        this._copyMeFromParent(comp["me"], this, false); //me from Dialog
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
            }
            else {
                this.remove(this.design); //no destroy the design
                this.removeAll(true);
                if (this.value === undefined)
                    return;
                var sic = this.design;
                for (var x = 0; x < this.value.length; x++) {
                    this.design = new RepeaterDesignPanel();
                    var ob = this.value[x];
                    this.design.databinder = new Databinder_1.Databinder();
                    this.design.databinder.value = ob;
                    this.design.me = {};
                    this._copyMeFromParent(this.design.me, this._parent);
                    this._createRepeatingComponent(this.design.me);
                    this.add(this.design);
                    this.design.add(this.design.databinder);
                }
                this.design = sic;
            }
        }
        /**
         * adds a component to the container
         * @param {jassijs.ui.Component} component - the component to add
         */
        add(component) {
            super.add(component);
        }
        _dummy(func) {
            //dummy
        }
        set value(val) {
            this._value = val;
            this.update();
        }
        get value() {
            return this._value;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._setDesignMode(action.componentDesignerSetDesignMode.enable, action.componentDesignerSetDesignMode.componentDesigner);
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
            }
            else
                this._designMode = enable;
            //	super.setDesignMode(enable);
        }
        set bind(databinder) {
            this._databinder = databinder[0];
            this._databinder.add(databinder[1], this, "_dummy");
        }
        destroy() {
            this._value = undefined;
            this.design.destroy();
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], Repeater.prototype, "bind", null);
    Repeater = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Repeater", icon: "mdi mdi-locker-multiple", editableChildComponents: ["this", "design"] }),
        (0, Registry_1.$Class)("jassijs.ui.Repeater"),
        __metadata("design:paramtypes", [Object])
    ], Repeater);
    exports.Repeater = Repeater;
});
//# sourceMappingURL=Repeater.js.map