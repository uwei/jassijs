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
            val = sp[1] + ',"' + sp[0] + '"';
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var func = this.propertyEditor.value[this.property.name];
            var binder = this.propertyEditor.getObjectFromVariable(sp[1]);
            this.propertyEditor.value[this.property.name](binder, sp[0]);
            //setPropertyInDesign(this.property.name,val);
            super.callEvent("edit", param);
        }
    };
    DatabinderEditor = __decorate([
        Editor_1.$PropertyEditor(["databinder"]),
        Jassi_1.$Class("jassijs.ui.PropertyEditors.DatabinderEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DatabinderEditor);
    exports.DatabinderEditor = DatabinderEditor;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJpbmRlckVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2phc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0RhdGFiaW5kZXJFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVVBLElBQWEsZ0JBQWdCLEdBQTdCLE1BQWEsZ0JBQWlCLFNBQVEsZUFBTTtRQU14QyxZQUFZLFFBQVEsRUFBRSxjQUFjO1lBQ2hDLEtBQUssQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7WUFDaEMsMENBQTBDO1lBQzFDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUMsQ0FBQSxXQUFXO1lBQzFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztZQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUFLO2dCQUNuQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNEOztXQUVHO1FBQ0gsSUFBSSxFQUFFLENBQUMsRUFBRTtZQUNMLEtBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2QsbUJBQW1CO1lBQ25CLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2hFLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtnQkFDckIsSUFBSTtvQkFDQSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUs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L3VpL0NoZWNrYm94XCI7XG5pbXBvcnQgeyBFZGl0b3IsICRQcm9wZXJ0eUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9ycy9FZGl0b3JcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyBTZWxlY3QgfSBmcm9tIFwiamFzc2lqcy91aS9TZWxlY3RcIjtcblxuXG5AJFByb3BlcnR5RWRpdG9yKFtcImRhdGFiaW5kZXJcIl0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcnMuRGF0YWJpbmRlckVkaXRvclwiKVxuZXhwb3J0IGNsYXNzIERhdGFiaW5kZXJFZGl0b3IgZXh0ZW5kcyBFZGl0b3JcbiAgICAvKipcbiAgICAgKiBDaGVja2JveCBFZGl0b3IgZm9yIGJvb2xlYW4gdmFsdWVzXG4gICAgICogdXNlZCBieSBQcm9wZXJ0eUVkaXRvclxuICAgICAqIEBjbGFzcyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5Cb29sZWFuRWRpdG9yXG4gICAgICovIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpIHtcbiAgICAgICAgc3VwZXIocHJvcGVydHksIHByb3BlcnR5RWRpdG9yKTtcbiAgICAgICAgLyoqIEBtZW1iZXIgLSB0aGUgcmVuZWRlcmluZyBjb21wb25lbnQgKiovXG4gICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IFRleHRib3goKTsvL1NlbGVjdCgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC53aWR0aCA9IFwiMTAwJVwiO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNvbXBvbmVudC5vbmNoYW5nZShmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgICAgIF90aGlzLl9vbmNoYW5nZShwYXJhbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IG9iIC0gdGhlIG9iamVjdCB3aGljaCBpcyBlZGl0ZWRcbiAgICAgKi9cbiAgICBzZXQgb2Iob2IpIHtcbiAgICAgICAgc3VwZXIub2IgPSBvYjtcbiAgICAgICAgLy9kYXRhYmluZGVyLFwicHJvcFwiXG4gICAgICAgIHZhciB2YWx1ZSA9IHRoaXMucHJvcGVydHlFZGl0b3IuZ2V0UHJvcGVydHlWYWx1ZSh0aGlzLnByb3BlcnR5KTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgdmFyIHNwID0gdmFsdWUucmVwbGFjZUFsbCgnXCInLCBcIlwiKS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSBzcFsxXSArIFwiLVwiICsgc3BbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIH0gY2F0Y2ggeyAvL1Byb3BlcnR5RWRpdG9yIHdpdGhvdXQgY29kZWVkaXRvclxuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LnZhbHVlID0gXCJcIjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgLy9UT0RPIGNhbGwgdGhpcyBvbiBmb2N1c1xuICAgICAgICB2YXIgYmluZGVycyA9IHRoaXMucHJvcGVydHlFZGl0b3IuZ2V0VmFyaWFibGVzRm9yVHlwZShEYXRhYmluZGVyKTtcbiAgICAgICAgaWYgKGJpbmRlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFyIGNvbXBzID0gW107XG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGJpbmRlcnMubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICB2YXIgYmluZGVyID0gdGhpcy5wcm9wZXJ0eUVkaXRvci5nZXRPYmplY3RGcm9tVmFyaWFibGUoYmluZGVyc1t4XSk7XG4gICAgICAgICAgICAgICAgaWYgKGJpbmRlciA9PT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBsZXQgb2IgPSBiaW5kZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKG9iICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbSBpbiBvYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tcHMucHVzaChtICsgXCItXCIgKyBiaW5kZXJzW3hdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29tcG9uZW50LmF1dG9jb21wbGV0ZXIgPSBjb21wcztcbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXQgb2IoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYjtcbiAgICB9XG5cbiAgICAvKipcbiAgICogZ2V0IHRoZSByZW5kZXJlciBmb3IgdGhlIFByb3BlcnR5RWRpdG9yXG4gICAqIEByZXR1cm5zIC0gdGhlIFVJLWNvbXBvbmVudCBmb3IgdGhlIGVkaXRvclxuICAgKi9cbiAgICBnZXRDb21wb25lbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbXBvbmVudDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAqIGludGVybiB0aGUgdmFsdWUgY2hhbmdlc1xuICAgICogQHBhcmFtIHt0eXBlfSBwYXJhbVxuICAgICovXG4gICAgX29uY2hhbmdlKHBhcmFtKSB7XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLmNvbXBvbmVudC52YWx1ZTtcbiAgICAgICAgdmFyIHNwID0gdmFsLnNwbGl0KFwiLVwiKTtcbiAgICAgICAgdmFsID0gc3BbMV0gKyAnLFwiJyArIHNwWzBdICsgJ1wiJztcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZSh0aGlzLnByb3BlcnR5Lm5hbWUsIHZhbCk7XG5cbiAgICAgICAgdmFyIGZ1bmMgPSB0aGlzLnByb3BlcnR5RWRpdG9yLnZhbHVlW3RoaXMucHJvcGVydHkubmFtZV07XG4gICAgICAgIHZhciBiaW5kZXIgPSB0aGlzLnByb3BlcnR5RWRpdG9yLmdldE9iamVjdEZyb21WYXJpYWJsZShzcFsxXSk7XG4gICAgICAgIHRoaXMucHJvcGVydHlFZGl0b3IudmFsdWVbdGhpcy5wcm9wZXJ0eS5uYW1lXShiaW5kZXIsIHNwWzBdKTtcbiAgICAgICAgLy9zZXRQcm9wZXJ0eUluRGVzaWduKHRoaXMucHJvcGVydHkubmFtZSx2YWwpO1xuICAgICAgICBzdXBlci5jYWxsRXZlbnQoXCJlZGl0XCIsIHBhcmFtKTtcbiAgICB9XG59Il19