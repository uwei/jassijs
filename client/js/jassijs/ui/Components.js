var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Button", "jassijs/ui/Property"], function (require, exports, Registry_1, Button_1, Property_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    let Dummy = class Dummy {
    };
    Dummy = __decorate([
        (0, Property_1.$Property)({ name: "text", type: "string" })
        //@$UIComponent({ fullPath: "common/Button", icon: "mdi mdi-gesture-tap-button", initialize: { text: "button" } })
        ,
        (0, Registry_1.$Class)("jassijs.ui.Button", Button_1.Button)
    ], Dummy);
});
//# sourceMappingURL=Components.js.map