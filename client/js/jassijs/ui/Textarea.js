var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/ui/Textbox"], function (require, exports, Component_1, Registry_1, Property_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Textarea = void 0;
    let Textarea = class Textarea extends Textbox_1.Textbox {
        constructor(props = {}) {
            super(props);
        }
        render() {
            var _this = this;
            return React.createElement("textarea", { className: "Textarea" });
        }
        componentDidMount() {
        }
    };
    Textarea = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/Textarea", icon: "mdi mdi-text-box-outline" }),
        (0, Registry_1.$Class)("jassijs.ui.Textarea"),
        (0, Property_1.$Property)({ name: "new", type: "string" }),
        __metadata("design:paramtypes", [Object])
    ], Textarea);
    exports.Textarea = Textarea;
    function test() {
        debugger;
        var t = new Textarea();
        return t;
    }
    exports.test = test;
});
//# sourceMappingURL=Textarea.js.map