var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/PropertyEditors/Editor", "jassijs/ui/Databinder", "jassijs/remote/Jassi", "jassijs/ui/Textbox"], function (require, exports, Editor_1, Databinder_1, Jassi_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DatabinderEditor = void 0;
    let DatabinderEditor = class DatabinderEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_1.Textbox(); //Select();
            this.component.width = "100%";
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined) {
                try {
                    if (value.startsWith("["))
                        value = value.substring(1);
                    if (value.endsWith("]"))
                        value = value.substring(0, value.length - 1);
                    var sp = value.replaceAll('"', "").split(",");
                    value = sp[1] + "-" + sp[0];
                    this.component.value = value;
                }
                catch ( //PropertyEditor without codeeditor
                _a) { //PropertyEditor without codeeditor
                    this.component.value = "";
                }
            }
            else {
                this.component.value = "";
            }
            //TODO call this on focus
            var binders = this.propertyEditor.getVariablesForType(Databinder_1.Databinder);
            if (binders !== undefined) {
                var comps = [];
                for (var x = 0; x < binders.length; x++) {
                    var binder = this.propertyEditor.getObjectFromVariable(binders[x]);
                    if (binder === undefined)
                        continue;
                    let ob = binder.value;
                    if (ob !== undefined) {
                        for (var m in ob) {
                            comps.push(m + "-" + binders[x]);
                        }
                    }
                }
                this.component.autocompleter = comps;
            }
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param) {
            var val = this.component.value;
            var sp = val.split("-");
            val = "[" + sp[1] + ',"' + sp[0] + '"]';
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var func = this.propertyEditor.value[this.property.name];
            var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name] = [binder, sp[0]];
            //setPropertyInDesign(this.property.name,val);
            super.callEvent("edit", param);
        }
    };
    DatabinderEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["databinder"]),
        (0, Jassi_1.$Class)("jassijs.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
    exports.DatabinderEditor = DatabinderEditor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJpbmRlckVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2phc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0RhdGFiaW5kZXJFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWlCLFNBQVEsZUFBTTtRQU14QyxZQUFZLFFBQVEsRUFBRSxjQUFjO1lBQ2hDLEtBQUssQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDaEMsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUMsQ0FBQSxXQUFXO1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUFLO2dCQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNEOztXQUVHO1FBQ0gsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNMLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2QsbUJBQW1CO1lBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsSUFBSTtvQkFDQSxJQUFHLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO3dCQUNwQixLQUFLLEdBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDN0IsSUFBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQzt3QkFDbEIsS0FBSyxH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LEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUM7S0FDSixDQUFBO0lBdkZZLGdCQUFnQjtRQUY1QixJQUFBLHdCQUFlLEVBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUMvQixJQUFBLGNBQU0sRUFBQyw2Q0FBNkMsQ0FBQzs7T0FDekMsZ0JBQWdCLENBdUY1QjtJQXZGWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGVja2JveCB9IGZyb20gXCJqYXNzaWpzL3VpL0NoZWNrYm94XCI7XG5pbXBvcnQgeyBFZGl0b3IsICRQcm9wZXJ0eUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9FZGl0b3JcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiamFzc2lqcy91aS9TZWxlY3RcIjtcblxuXG5AJFByb3BlcnR5RWRpdG9yKFtcImRhdGFiaW5kZXJcIl0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcnMuRGF0YWJpbmRlckVkaXRvclwiKVxuZXhwb3J0IGNsYXNzIERhdGFiaW5kZXJFZGl0b3IgZXh0ZW5kcyBFZGl0b3JcbiAgICAvKipcbiAgICAgKiBDaGVja2JveCBFZGl0b3IgZm9yIGJvb2xlYW4gdmFsdWVzXG4gICAgICogdXNlZCBieSBQcm9wZXJ0eUVkaXRvclxuICAgICAqIEBjbGFzcyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5Cb29sZWFuRWRpdG9yXG4gICAgICovIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpIHtcbiAgICAgICAgc3VwZXIocHJvcGVydHksIHByb3BlcnR5RWRpdG9yKTtcbiAgICAgICAgLyoqIEBtZW1iZXIgLSB0aGUgcmVuZWRlcmluZyBjb21wb25lbnQgKiovXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IFRleHRib3goKTsvL1NlbGVjdCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5vbmNoYW5nZShmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgICAgIF90aGlzLl9vbmNoYW5nZShwYXJhbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IG9iIC0gdGhlIG9iamVjdCB3aGljaCBpcyBlZGl0ZWRcbiAgICAgKi9cbiAgICBzZXQgb2Iob2IpIHtcbiAgICAgICAgc3VwZXIub2IgPSBvYjtcbiAgICAgICAgLy9kYXRhYmluZGVyLFwicHJvcFwiXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcGVydHlFZGl0b3IuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnByb3BlcnR5KTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUuc3RhcnRzV2l0aChcIltcIikpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXZhbHVlLnN1YnN0cmluZygxKTtcbiAgICAgICAgICAgICAgICBpZih2YWx1ZS5lbmRzV2l0aChcIl1cIikpXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlPXZhbHVlLnN1YnN0cmluZygwLHZhbHVlLmxlbmd0aC0xKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgc3AgPSB2YWx1ZS5yZXBsYWNlQWxsKCdcIicsIFwiXCIpLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHNwWzFdICsgXCItXCIgKyBzcFswXTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC52YWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfSBjYXRjaCB7IC8vUHJvcGVydHlFZGl0b3Igd2l0aG91dCBjb2RlZWRpdG9yXG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQudmFsdWUgPSBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQudmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG5cblxuICAgICAgICAvL1RPRE8gY2FsbCB0aGlzIG9uIGZvY3VzXG4gICAgICAgIHZhciBiaW5kZXJzID0gdGhpcy5wcm9wZXJ0eUVkaXRvci5nZXRWYXJpYWJsZXNGb3JUeXBlKERhdGFiaW5kZXIpO1xuICAgICAgICBpZiAoYmluZGVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YXIgY29tcHMgPSBbXTtcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYmluZGVycy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgIHZhciBiaW5kZXIgPSB0aGlzLnByb3BlcnR5RWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShiaW5kZXJzW3hdKTtcbiAgICAgICAgICAgICAgICBpZiAoYmluZGVyID09PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGxldCBvYiA9IGJpbmRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAob2IgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBtIGluIG9iKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wcy5wdXNoKG0gKyBcIi1cIiArIGJpbmRlcnNbeF0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuYXV0b2NvbXBsZXRlciA9IGNvbXBzO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCBvYigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29iO1xuICAgIH1cblxuICAgIC8qKlxuICAgKiBnZXQgdGhlIHJlbmRlcmVyIGZvciB0aGUgUHJvcGVydHlFZGl0b3JcbiAgICogQHJldHVybnMgLSB0aGUgVUktY29tcG9uZW50IGZvciB0aGUgZWRpdG9yXG4gICAqL1xuICAgIGdldENvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xuICAgIH1cblxuICAgIC8qKlxuICAgICogaW50ZXJuIHRoZSB2YWx1ZSBjaGFuZ2VzXG4gICAgKiBAcGFyYW0ge3R5cGV9IHBhcmFtXG4gICAgKi9cbiAgICBfb25jaGFuZ2UocGFyYW0pIHtcbiAgICAgICAgdmFyIHZhbCA9IHRoaXMuY29tcG9uZW50LnZhbHVlO1xuICAgICAgICB2YXIgc3AgPSB2YWwuc3BsaXQoXCItXCIpO1xuICAgICAgICB2YWwgPSBcIltcIitzcFsxXSArICcsXCInICsgc3BbMF0gKyAnXCJdJztcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZSh0aGlzLnByb3BlcnR5Lm5hbWUsIHZhbCk7XG5cbiAgICAgICAgdmFyIGZ1bmMgPSB0aGlzLnByb3BlcnR5RWRpdG9yLnZhbHVlW3RoaXMucHJvcGVydHkubmFtZV07XG4gICAgICAgIHZhciBiaW5kZXIgPSB0aGlzLnByb3BlcnR5RWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShzcFsxXSk7XG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3IudmFsdWVbdGhpcy5wcm9wZXJ0eS5uYW1lXT1bYmluZGVyLCBzcFswXV07XG4gICAgICAgIC8vc2V0UHJvcGVydHlJbkRlc2lnbih0aGlzLnByb3BlcnR5Lm5hbWUsdmFsKTtcbiAgICAgICAgc3VwZXIuY2FsbEV2ZW50KFwiZWRpdFwiLCBwYXJhbSk7XG4gICAgfVxufSJdfQ==