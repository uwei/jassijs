var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/ui/PropertyEditors/Editor", "jassijs/remote/Jassi", "jassijs/ui/Select"], function (require, exports, Textbox_1, Editor_1, Jassi_1, Select_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DefaultEditor = class DefaultEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            if (property.chooseFrom !== undefined) {
                if (typeof (property.chooseFrom) === "function") {
                    this.component = new Textbox_1.Textbox();
                    this.component.autocompleter = function () {
                        return property.chooseFrom(_this.ob);
                    };
                }
                else {
                    if (property.chooseFromStrict) {
                        this.component = new Select_1.Select();
                        this.component.items = property.chooseFrom;
                    }
                    else {
                        this.component = new Textbox_1.Textbox();
                        this.component.autocompleter = property.chooseFrom;
                    }
                }
            }
            else {
                this.component = new Textbox_1.Textbox();
            }
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
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value !== undefined && this.property.type === "string" && typeof value === 'string' && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length - 1);
            }
            else if (value !== undefined && (this.property.type === "number[]" || this.property.type === "boolean[]")) {
                if (typeof (value) === "string")
                    value = value.replaceAll("[", "").replaceAll("]", "");
                else {
                    value = value.join(",");
                }
            }
            this.component.value = value;
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
            if (this.property.type === "string")
                val = "\"" + val + "\"";
            if (this.property.type === "number[]" || this.property.type === "boolean[]")
                val = (val === "" ? "undefined" : "[" + val + "]");
            this.propertyEditor.setPropertyInCode(this.property.name, val);
            var oval = this.component.value;
            if (this.property.type === "number") {
                oval = Number(oval);
            }
            if (this.property.type === "number[]") {
                if (oval === "")
                    oval = undefined;
                else {
                    var all = oval.split(",");
                    oval = [];
                    for (var x = 0; x < all.length; x++) {
                        oval.push(Number(all[x].trim()));
                    }
                }
            }
            if (this.property.type === "boolean[]") {
                if (oval === "")
                    oval = undefined;
                else {
                    var all = oval.split(",");
                    oval = [];
                    for (var x = 0; x < all.length; x++) {
                        oval.push(all[x].trim() === "true");
                    }
                }
            }
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    DefaultEditor = __decorate([
        Editor_1.$PropertyEditor(["string", "number", "number[]", "boolean[]"]),
        Jassi_1.$Class("jassijs.ui.PropertyEditors.DefaultEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DefaultEditor);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVmYXVsdEVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2phc3NpanMvdWkvUHJvcGVydHlFZGl0b3JzL0RlZmF1bHRFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBT0EsSUFBTSxhQUFhLEdBQW5CLE1BQU0sYUFBYyxTQUFRLGVBQU07UUFNOUIsWUFBWSxRQUFRLEVBQUUsY0FBYztZQUNoQyxLQUFLLENBQUMsUUFBUSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2hDLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxTQUFTLEVBQUU7Z0JBQ25DLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxVQUFVLEVBQUU7b0JBQzdDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7b0JBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHO3dCQUMzQixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN6QyxDQUFDLENBQUE7aUJBQ0o7cUJBQU07b0JBQ0gsSUFBSSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQzt3QkFDOUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztxQkFDOUM7eUJBQU07d0JBQ0gsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQzt3QkFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLFVBQVUsQ0FBQztxQkFDdEQ7aUJBQ0o7YUFDSjtpQkFBTTtnQkFDSCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO2FBRWxDO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFL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QXVHbEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgRWRpdG9yLCAkUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvcnMvRWRpdG9yXCI7XG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFNlbGVjdCB9IGZyb20gXCJqYXNzaWpzL3VpL1NlbGVjdFwiO1xuXG5AJFByb3BlcnR5RWRpdG9yKFtcInN0cmluZ1wiLCBcIm51bWJlclwiLCBcIm51bWJlcltdXCIsXCJib29sZWFuW11cIl0pXG5AJENsYXNzKFwiamFzc2lqcy51aS5Qcm9wZXJ0eUVkaXRvcnMuRGVmYXVsdEVkaXRvclwiKVxuY2xhc3MgRGVmYXVsdEVkaXRvciBleHRlbmRzIEVkaXRvclxuICAgIC8qKlxuICAgICAqIEVkaXRvciBmb3IgbnVtYmVyIGFuZCBzdHJpbmcgXG4gICAgICogdXNlZCBieSBQcm9wZXJ0eUVkaXRvclxuICAgICAqIEBjbGFzcyBqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EZWZhdWx0RWRpdG9yXG4gICAgICovIHtcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0eSwgcHJvcGVydHlFZGl0b3IpIHtcbiAgICAgICAgc3VwZXIocHJvcGVydHksIHByb3BlcnR5RWRpdG9yKTtcbiAgICAgICAgaWYgKHByb3BlcnR5LmNob29zZUZyb20gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiAocHJvcGVydHkuY2hvb3NlRnJvbSkgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudC5hdXRvY29tcGxldGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVydHkuY2hvb3NlRnJvbShfdGhpcy5vYik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuY2hvb3NlRnJvbVN0cmljdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbXBvbmVudCA9IG5ldyBTZWxlY3QoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuaXRlbXMgPSBwcm9wZXJ0eS5jaG9vc2VGcm9tO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tcG9uZW50ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21wb25lbnQuYXV0b2NvbXBsZXRlciA9IHByb3BlcnR5LmNob29zZUZyb207XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb21wb25lbnQgPSBuZXcgVGV4dGJveCgpO1xuXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jb21wb25lbnQud2lkdGggPSBcIjEwMCVcIjtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jb21wb25lbnQub25jaGFuZ2UoZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgICBfdGhpcy5fb25jaGFuZ2UocGFyYW0pO1xuICAgICAgICB9KTtcblxuICAgIH1cbiAgICAvKipcbiAgICAgKiBAbWVtYmVyIHtvYmplY3R9IG9iIC0gdGhlIG9iamVjdCB3aGljaCBpcyBlZGl0ZWRcbiAgICAgKi9cbiAgICBzZXQgb2Iob2IpIHtcbiAgICAgICAgc3VwZXIub2IgPSBvYjtcbiAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5wcm9wZXJ0eUVkaXRvci5nZXRQcm9wZXJ0eVZhbHVlKHRoaXMucHJvcGVydHkpO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0aGlzLnByb3BlcnR5LnR5cGUgPT09IFwic3RyaW5nXCIgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyAmJiB2YWx1ZS5zdGFydHNXaXRoKFwiXFxcIlwiKSAmJiB2YWx1ZS5lbmRzV2l0aChcIlxcXCJcIikpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDEsIHZhbHVlLmxlbmd0aCAtIDEpO1xuICAgICAgICB9IGVsc2UgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQgJiYgKHRoaXMucHJvcGVydHkudHlwZSA9PT0gXCJudW1iZXJbXVwifHx0aGlzLnByb3BlcnR5LnR5cGUgPT09IFwiYm9vbGVhbltdXCIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZSkgPT09IFwic3RyaW5nXCIpXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlQWxsKFwiW1wiLCBcIlwiKS5yZXBsYWNlQWxsKFwiXVwiLCBcIlwiKTtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUuam9pbihcIixcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gXG4gICAgICAgIHRoaXMuY29tcG9uZW50LnZhbHVlID0gdmFsdWU7XG4gICAgfVxuICAgIGdldCBvYigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29iO1xuICAgIH1cblxuICAgIC8qKlxuICAgKiBnZXQgdGhlIHJlbmRlcmVyIGZvciB0aGUgUHJvcGVydHlFZGl0b3JcbiAgICogQHJldHVybnMgLSB0aGUgVUktY29tcG9uZW50IGZvciB0aGUgZWRpdG9yXG4gICAqL1xuICAgIGdldENvbXBvbmVudCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBpbnRlcm4gdGhlIHZhbHVlIGNoYW5nZXNcbiAgICAgKiBAcGFyYW0ge3R5cGV9IHBhcmFtXG4gICAgICovXG4gICAgX29uY2hhbmdlKHBhcmFtKSB7XG4gICAgICAgIHZhciB2YWwgPSB0aGlzLmNvbXBvbmVudC52YWx1ZTtcbiAgICAgICAgaWYgKHRoaXMucHJvcGVydHkudHlwZSA9PT0gXCJzdHJpbmdcIilcbiAgICAgICAgICAgIHZhbCA9IFwiXFxcIlwiICsgdmFsICsgXCJcXFwiXCI7XG4gICAgICAgIGlmICh0aGlzLnByb3BlcnR5LnR5cGUgPT09IFwibnVtYmVyW11cInx8dGhpcy5wcm9wZXJ0eS50eXBlID09PSBcImJvb2xlYW5bXVwiKVxuICAgICAgICAgICAgdmFsID0gKHZhbCA9PT0gXCJcIiA/IFwidW5kZWZpbmVkXCIgOiBcIltcIiArIHZhbCArIFwiXVwiKTtcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluQ29kZSh0aGlzLnByb3BlcnR5Lm5hbWUsIHZhbCk7XG4gICAgICAgIHZhciBvdmFsID0gdGhpcy5jb21wb25lbnQudmFsdWU7XG4gICAgICAgIGlmICh0aGlzLnByb3BlcnR5LnR5cGUgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgICAgIG92YWwgPSBOdW1iZXIob3ZhbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcGVydHkudHlwZSA9PT0gXCJudW1iZXJbXVwiKSB7XG4gICAgICAgICAgICBpZiAob3ZhbCA9PT0gXCJcIilcbiAgICAgICAgICAgICAgICBvdmFsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGFsbCA9IG92YWwuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgICAgIG92YWwgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgICAgICAgICBvdmFsLnB1c2goTnVtYmVyKGFsbFt4XS50cmltKCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucHJvcGVydHkudHlwZSA9PT0gXCJib29sZWFuW11cIikge1xuICAgICAgICAgICAgaWYgKG92YWwgPT09IFwiXCIpXG4gICAgICAgICAgICAgICAgb3ZhbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBhbGwgPSBvdmFsLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgICAgICBvdmFsID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBhbGwubGVuZ3RoOyB4KyspIHtcbiAgICAgICAgICAgICAgICAgICAgb3ZhbC5wdXNoKGFsbFt4XS50cmltKCk9PT1cInRydWVcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5wcm9wZXJ0eUVkaXRvci5zZXRQcm9wZXJ0eUluRGVzaWduKHRoaXMucHJvcGVydHkubmFtZSwgb3ZhbCk7XG4gICAgICAgIHN1cGVyLmNhbGxFdmVudChcImVkaXRcIiwgcGFyYW0pO1xuICAgIH1cbn1cblxuIl19