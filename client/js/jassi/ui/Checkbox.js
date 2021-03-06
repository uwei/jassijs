var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Component", "jassi/ui/Property"], function (require, exports, Jassi_1, Component_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Checkbox = void 0;
    let Checkbox = class Checkbox extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<div><input type="checkbox"><span class="checkboxtext" style="width:100%"></span></div>')[0]);
            this.checkbox = this.dom.firstChild;
            //             $(this.domWrapper).append($('<span class="checkboxtext"></span>'));
        }
        onclick(handler) {
            $(this.checkbox).click(function () {
                handler();
            });
        }
        /**
         * @member {string} - the caption of the button
         */
        set value(value) {
            if (value === "true")
                value = true;
            if (value === "false")
                value = false;
            $(this.checkbox).prop("checked", value);
        }
        get value() {
            return $(this.checkbox).prop("checked");
        }
        /**
        * @member {string} - the caption of the button
        */
        set text(value) {
            $(this.domWrapper).find(".checkboxtext").html(value);
        }
        get text() {
            return $(this.domWrapper).find(".checkboxtext").html();
        }
    };
    __decorate([
        Property_1.$Property({ type: "boolean" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], Checkbox.prototype, "value", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], Checkbox.prototype, "text", null);
    Checkbox = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Ceckbox", icon: "mdi mdi-checkbox-marked-outline" }),
        Jassi_1.$Class("jassi.ui.Checkbox"),
        __metadata("design:paramtypes", [])
    ], Checkbox);
    exports.Checkbox = Checkbox;
});
//@class({longname:"jassi.ui.Checkbox"})
//# sourceMappingURL=Checkbox.js.map