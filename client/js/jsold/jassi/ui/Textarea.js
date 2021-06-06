var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Jassi", "jassijs/ui/Property", "jassijs/ui/Textbox"], function (require, exports, Component_1, jassijs_1, Property_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Textarea = void 0;
    let Textarea = class Textarea extends Textbox_1.Textbox {
        constructor() {
            super();
            super.init($('<textarea  />')[0]);
        }
    };
    Textarea = __decorate([
        Component_1.$UIComponent({ fullPath: "common/Textarea", icon: "mdi mdi-text-box-outline" }),
        jassijs_1.$Class("jassijs.ui.Textarea"),
        Property_1.$Property({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [])
    ], Textarea);
    exports.Textarea = Textarea;
});
//# sourceMappingURL=Textarea.js.map
//# sourceMappingURL=Textarea.js.map