var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Textbox", "jassi/ui/PropertyEditors/Editor", "jassi/remote/Jassi"], function (require, exports, Textbox_1, Editor_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let DefaultEditor = class DefaultEditor extends Editor_1.Editor {
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Textbox_1.Textbox();
            var _this = this;
            this.component.onchange(function (param) {
                _this._onchange(param);
            });
            if (property.chooseFrom !== undefined) {
                if (typeof (property.chooseFrom) === "function") {
                    this.component.autocompleter = function () {
                        return property.chooseFrom(_this.ob);
                    };
                }
                else
                    this.component.autocompleter = property.chooseFrom;
            }
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
            else if (value !== undefined && this.property.type === "number[]") {
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
            if (this.property.type === "number[]")
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
            this.propertyEditor.setPropertyInDesign(this.property.name, oval);
            super.callEvent("edit", param);
        }
    };
    DefaultEditor = __decorate([
        Editor_1.$PropertyEditor(["string", "number", "number[]"]),
        Jassi_1.$Class("jassi.ui.PropertyEditors.DefaultEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], DefaultEditor);
});
//# sourceMappingURL=DefaultEditor.js.map