var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Databinder", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/remote/Jassi"], function (require, exports, Panel_1, Databinder_1, Component_1, Property_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Repeater = void 0;
    let RepeaterDesignPanel = class RepeaterDesignPanel extends Panel_1.Panel {
    };
    RepeaterDesignPanel = __decorate([
        (0, Component_1.$UIComponent)({ editableChildComponents: ["databinder"] }),
        (0, Jassi_1.$Class)("jassijs.ui.RepeaterDesignPanel")
    ], RepeaterDesignPanel);
    let Repeater = class Repeater extends Panel_1.Panel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super();
            this._autocommit = false;
            this.design = new RepeaterDesignPanel();
            this.add(this.design);
            this.design.width = "100%";
            this.design.height = "100%";
            $(this.design.domWrapper).addClass("designerNoDraggable");
            $(this.design.dom).addClass("designerNoSelectable");
            $(this.design.dom).addClass("designerNoResizable");
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
        (0, Jassi_1.$Class)("jassijs.ui.Repeater"),
        __metadata("design:paramtypes", [Object])
    ], Repeater);
    exports.Repeater = Repeater;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwZWF0ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzL3VpL1JlcGVhdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFhQSxJQUFNLG1CQUFtQixHQUF6QixNQUFNLG1CQUFvQixTQUFRLGFBQUs7S0FJdEMsQ0FBQTtJQUpLLG1CQUFtQjtRQUZ4QixJQUFBLHdCQUFZLEVBQUMsRUFBRSx1QkFBdUIsRUFBRSxDQUFDLFlBQVksQ0FBQyxFQUFDLENBQUM7UUFDeEQsSUFBQSxjQUFNLEVBQUMsZ0NBQWdDLENBQUM7T0FDbkMsbUJBQW1CLENBSXhCO0lBbUJELElBQWEsUUFBUSxHQUFyQixNQUFhLFFBQVMsU0FBUSxhQUFLO1FBZS9COzs7Ozs7VUFNRTtRQUNGLFlBQVksVUFBVSxHQUFHLFNBQVM7WUFFOUIsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksbUJBQW1CLEVBQUUsQ0FBQztZQUN4QyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDM0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQzFELENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3BELENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFDRCxN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QUFXLEdBQUcsTUFBTSxDQUFDO1lBQzlCLCtCQUErQjtRQUNuQyxDQUFDO1FBR0QsSUFBSSxJQUFJLENBQUMsVUFBZ0I7WUFDckIsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN4RCxDQUFDO1FBRUQsT0FBTztZQUNOLElBQUksQ0FBQyxNQUFNLEdBQUMsU0FBUyxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7S0FDSixDQUFBO0lBVkc7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBQyxJQUFJLEVBQUMsWUFBWSxFQUFDLENBQUM7Ozt3Q0FJOUI7SUEvSlEsUUFBUTtRQUZwQixJQUFBLHdCQUFZLEVBQUMsRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsSUFBSSxFQUFFLHlCQUF5QixFQUFDLHVCQUF1QixFQUFFLENBQUMsTUFBTSxFQUFDLFFBQVEsQ0FBQyxFQUFDLENBQUM7UUFDeEgsSUFBQSxjQUFNLEVBQUMscUJBQXFCLENBQUM7O09BQ2pCLFFBQVEsQ0FzS3BCO0lBdEtZLDRCQUFRIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBqYXNzaSBmcm9tIFwiamFzc2lqcy9qYXNzaVwiO1xyXG5pbXBvcnQge0NvbnRhaW5lcn0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7UGFuZWwsIFBhbmVsQ29uZmlnfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQge0NvbXBvbmVudERlc2lnbmVyfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIjtcclxuaW1wb3J0IHtEYXRhYmluZGVyfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XHJcbmltcG9ydCB7Q29tcG9uZW50LCAgJFVJQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7UHJvcGVydHksICAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgRGF0YUNvbXBvbmVudENvbmZpZyB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFDb21wb25lbnRcIjtcclxuXHJcbkAkVUlDb21wb25lbnQoeyBlZGl0YWJsZUNoaWxkQ29tcG9uZW50czogW1wiZGF0YWJpbmRlclwiXX0pXHJcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLlJlcGVhdGVyRGVzaWduUGFuZWxcIilcclxuY2xhc3MgUmVwZWF0ZXJEZXNpZ25QYW5lbCBleHRlbmRzIFBhbmVsIHtcclxuICAgIGRhdGFiaW5kZXI6IERhdGFiaW5kZXI7XHJcbiAgICBtZTtcclxuICAgIFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlcGVhdGVyQ29uZmlnIGV4dGVuZHMgUGFuZWxDb25maWcge1xyXG5cclxuICAgICAvKipcclxuICAgICAqICBAbWVtYmVyIHthcnJheX0gdmFsdWUgLSB0aGUgYXJyYXkgd2hpY2ggb2JqZWN0cyB1c2VkIHRvIGNyZWF0ZSB0aGUgcmVwZWF0aW5nIGNvbXBvbmVudHNcclxuICAgICAqL1xyXG4gICAgdmFsdWU/O1xyXG4gIC8qKlxyXG4gICAgICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXHJcbiAgICAgKiBAcGFyYW0ge2phc3NpanMudWkuRGF0YWJpbmRlcn0gZGF0YWJpbmRlciAtIHRoZSBkYXRhYmluZGVyIHRvIGJpbmRcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBwcm9wZXJ0eSAtIHRoZSBwcm9wZXJ0eSB0byBiaW5kXHJcbiAgICAgKi9cclxuICAgYmluZD86YW55W107XHJcbiAgIGNyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudD8oZnVuYyk7XHJcblxyXG59XHJcbkAkVUlDb21wb25lbnQoeyBmdWxsUGF0aDogXCJjb21tb24vUmVwZWF0ZXJcIiwgaWNvbjogXCJtZGkgbWRpLWxvY2tlci1tdWx0aXBsZVwiLGVkaXRhYmxlQ2hpbGRDb21wb25lbnRzOiBbXCJ0aGlzXCIsXCJkZXNpZ25cIl19KVxyXG5AJENsYXNzKFwiamFzc2lqcy51aS5SZXBlYXRlclwiKVxyXG5leHBvcnQgY2xhc3MgUmVwZWF0ZXIgZXh0ZW5kcyBQYW5lbCBpbXBsZW1lbnRzIERhdGFDb21wb25lbnRDb25maWd7XHJcbiAgICBfY29tcG9uZW50RGVzaWduZXI6IENvbXBvbmVudERlc2lnbmVyO1xyXG4gICAgX2F1dG9jb21taXQ6IGJvb2xlYW47XHJcbiAgICBfY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50O1xyXG4gICAgX3ZhbHVlO1xyXG4gICAgX2lzQ3JlYXRlZDogYm9vbGVhbjtcclxuICAgIF9kZXNpZ25lcjogQ29tcG9uZW50O1xyXG4gICAgX2RhdGFiaW5kZXI6IERhdGFiaW5kZXI7XHJcbiAgICBkZXNpZ246IFJlcGVhdGVyRGVzaWduUGFuZWw7XHJcbiAgICBtZTtcclxuICAgIC8qKlxyXG4gICAgICogY2FuIGJlIHVzZWQgZm9yIGNvbnRyb2xzIGluIHJlcGVhdGluZyBncm91cFxyXG4gICAgICovXHJcbiAgICBiaW5kZXI6IERhdGFiaW5kZXI7XHJcbiAgXHJcbiAgICAvKipcclxuICAgICogXHJcbiAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wZXJ0aWVzIC0gcHJvcGVydGllcyB0byBpbml0XHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBbcHJvcGVydGllcy5pZF0gLSAgY29ubmVjdCB0byBleGlzdGluZyBpZCAobm90IHJlcWlyZWQpXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gW3Byb3BlcnRpZXMudXNlU3Bhbl0gLSAgdXNlIHNwYW4gbm90IGRpdlxyXG4gICAgKiBcclxuICAgICovXHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzID0gdW5kZWZpbmVkKSB7Ly9pZCBjb25uZWN0IHRvIGV4aXN0aW5nKG5vdCByZXFpcmVkKVxyXG5cclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuX2F1dG9jb21taXQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmRlc2lnbiA9IG5ldyBSZXBlYXRlckRlc2lnblBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5hZGQodGhpcy5kZXNpZ24pO1xyXG4gICAgICAgIHRoaXMuZGVzaWduLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgdGhpcy5kZXNpZ24uaGVpZ2h0ID0gXCIxMDAlXCI7XHJcbiAgICAgICAgJCh0aGlzLmRlc2lnbi5kb21XcmFwcGVyKS5hZGRDbGFzcyhcImRlc2lnbmVyTm9EcmFnZ2FibGVcIik7XHJcbiAgICAgICAgJCh0aGlzLmRlc2lnbi5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1NlbGVjdGFibGVcIik7XHJcbiAgICAgICAgJCh0aGlzLmRlc2lnbi5kb20pLmFkZENsYXNzKFwiZGVzaWduZXJOb1Jlc2l6YWJsZVwiKTtcclxuICAgIH1cclxuICAgIGNvbmZpZyhjb25maWc6IFJlcGVhdGVyQ29uZmlnKTogUmVwZWF0ZXIge1xyXG4gICAgICAgIHN1cGVyLmNvbmZpZyhjb25maWcpO1xyXG4gICAgICAgIHJldHVybiB0aGlzO1xyXG4gICAgfVxyXG4gICAgY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50KGZ1bmMpIHtcclxuICAgICAgICB0aGlzLl9jcmVhdGVSZXBlYXRpbmdDb21wb25lbnQgPSBmdW5jO1xyXG4gICAgICAgIGZ1bmMuYmluZCh0aGlzKTtcclxuICAgICAgICBpZiAodGhpcy5fdmFsdWUgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuXHJcbiAgICB9XHJcbiAgICBfY29weU1lRnJvbVBhcmVudChtZSwgcGFyZW50LCBvdmVycmlkZSA9IHRydWUpIHtcclxuICAgICAgICBpZiAocGFyZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICBpZiAocGFyZW50Lm1lICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcmVudC5tZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG92ZXJyaWRlID09PSB0cnVlIHx8IG1lW2tleV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1lW2tleV0gPSBwYXJlbnQubWVba2V5XTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvcHlNZUZyb21QYXJlbnQobWUsIHBhcmVudC5fcGFyZW50KTtcclxuICAgIH1cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICBpZiAodGhpcy5fY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50ID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbk1vZGUgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGVzaWduLl9wYXJlbnQgIT09IHRoaXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZCh0aGlzLmRlc2lnbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuX2lzQ3JlYXRlZCAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNpZ24uZGF0YWJpbmRlciA9IG5ldyBEYXRhYmluZGVyKCk7XHJcbiAgICAgICAgICAgICAgIC8vIHZhciBjb2RlOnN0cmluZz10aGlzLl9jcmVhdGVSZXBlYXRpbmdDb21wb25lbnQudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgLy8gdmFyIHZhcm5hbWU9Y29kZS5zdWJzdHJpbmcoY29kZS5pbmRleE9mKFwiKFwiKSsxLGNvZGUuaW5kZXhPZihcIilcIikpO1xyXG4gICAgICAgICAgICAgICAvLyB0aGlzLl9jb21wb25lbnREZXNpZ25lci5fY29kZUVkaXRvci52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFybmFtZSx0aGlzLmRlc2lnbi5kYXRhYmluZGVyKTtcclxuICAgICAgICAgICAgICAgIHRoaXMubWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvcHlNZUZyb21QYXJlbnQodGhpcy5tZSwgdGhpcy5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudCh0aGlzLm1lKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb21wID0gdGhpcy5fY29tcG9uZW50RGVzaWduZXIuZGVzaWduZWRDb21wb25lbnQ7XHJcbiAgICAgICAgICAgICAgICBpZihjb21wW1wibWVcIl0hPT11bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvcHlNZUZyb21QYXJlbnQoY29tcFtcIm1lXCJdLCB0aGlzLCBmYWxzZSk7Ly9tZSBmcm9tIERpYWxvZ1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudERlc2lnbmVyLl9jb2RlRWRpdG9yLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcIm1lXCIsIGNvbXBbXCJtZVwiXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY29tcG9uZW50RGVzaWduZXIuX2NvZGVFZGl0b3IudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5faXNDcmVhdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkIHx8IHRoaXMudmFsdWUgPT09IG51bGwgfHwgdGhpcy52YWx1ZS5sZW5ndGggPCAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNpZ24uZGF0YWJpbmRlci52YWx1ZSA9IHVuZGVmaW5lZDsgXHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzaWduLmRhdGFiaW5kZXIudmFsdWUgPSB0aGlzLnZhbHVlWzBdO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2lnbi5leHRlbnNpb25DYWxsZWQoe1xyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5hYmxlOiB0aGlzLl9kZXNpZ25Nb2RlLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudERlc2lnbmVyOiB1bmRlZmluZWRcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy90aGlzLmRlc2lnbi5fc2V0RGVzaWduTW9kZSh0aGlzLl9kZXNpZ25Nb2RlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZSh0aGlzLmRlc2lnbik7Ly9ubyBkZXN0cm95IHRoZSBkZXNpZ25cclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVBbGwodHJ1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBzaWMgPSB0aGlzLmRlc2lnbjtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0aGlzLnZhbHVlLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2lnbiA9IG5ldyBSZXBlYXRlckRlc2lnblBhbmVsKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2IgPSB0aGlzLnZhbHVlW3hdO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNpZ24uZGF0YWJpbmRlciA9IG5ldyBEYXRhYmluZGVyKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2lnbi5kYXRhYmluZGVyLnZhbHVlID0gb2I7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2lnbi5tZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29weU1lRnJvbVBhcmVudCh0aGlzLmRlc2lnbi5tZSwgdGhpcy5fcGFyZW50KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NyZWF0ZVJlcGVhdGluZ0NvbXBvbmVudCh0aGlzLmRlc2lnbi5tZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZCh0aGlzLmRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2lnbi5hZGQodGhpcy5kZXNpZ24uZGF0YWJpbmRlcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNpZ24gPSBzaWM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGRzIGEgY29tcG9uZW50IHRvIHRoZSBjb250YWluZXJcclxuICAgICAqIEBwYXJhbSB7amFzc2lqcy51aS5Db21wb25lbnR9IGNvbXBvbmVudCAtIHRoZSBjb21wb25lbnQgdG8gYWRkXHJcbiAgICAgKi9cclxuICAgIGFkZChjb21wb25lbnQpIHtcclxuICAgICAgICBzdXBlci5hZGQoY29tcG9uZW50KTtcclxuXHJcbiAgICB9XHJcbiAgICBfZHVtbXkoZnVuYykge1xyXG4gICAgICAgIC8vZHVtbXlcclxuICAgIH1cclxuICBcclxuICAgIHNldCB2YWx1ZSh2YWwpIHtcclxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcclxuICAgIH1cclxuICAgIGV4dGVuc2lvbkNhbGxlZChhY3Rpb246IEV4dGVuc2lvbkFjdGlvbikge1xyXG4gICAgICAgIGlmIChhY3Rpb24uY29tcG9uZW50RGVzaWduZXJTZXREZXNpZ25Nb2RlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX3NldERlc2lnbk1vZGUoYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZS5lbmFibGUsYWN0aW9uLmNvbXBvbmVudERlc2lnbmVyU2V0RGVzaWduTW9kZS5jb21wb25lbnREZXNpZ25lcik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhY3RpdmF0ZXMgb3IgZGVhY3RpdmF0ZXMgZGVzaWdubW9kZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSBlbmFibGUgLSB0cnVlIGlmIGFjdGl2YXRlIGRlc2lnbk1vZGVcclxuICAgICAqL1xyXG4gICAgX3NldERlc2lnbk1vZGUoZW5hYmxlLCBkZXNpZ25lciA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudERlc2lnbmVyID0gZGVzaWduZXI7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbk1vZGUgIT09IGVuYWJsZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25Nb2RlID0gZW5hYmxlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25Nb2RlID0gZW5hYmxlO1xyXG4gICAgICAgIC8vXHRzdXBlci5zZXREZXNpZ25Nb2RlKGVuYWJsZSk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIEAkUHJvcGVydHkoe3R5cGU6XCJkYXRhYmluZGVyXCJ9KVxyXG4gICAgc2V0IGJpbmQoZGF0YWJpbmRlcjphbnlbXSkge1xyXG4gICAgICAgIHRoaXMuX2RhdGFiaW5kZXIgPSBkYXRhYmluZGVyWzBdO1xyXG4gICAgICAgIHRoaXMuX2RhdGFiaW5kZXIuYWRkKGRhdGFiaW5kZXJbMV0sIHRoaXMsIFwiX2R1bW15XCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICBcdHRoaXMuX3ZhbHVlPXVuZGVmaW5lZDtcclxuICAgICAgICB0aGlzLmRlc2lnbi5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG59XHJcblxyXG5cclxuIl19