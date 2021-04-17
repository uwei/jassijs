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
define(["require", "exports", "jassi/remote/Jassi", "jassi/base/Actions", "jassi/ui/Panel", "jassi/ui/HTMLPanel", "jassi/ui/Button"], function (require, exports, Jassi_1, Actions_1, Panel_1, HTMLPanel_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KK4 = exports.KK3 = void 0;
    let KK3 = class KK3 {
    };
    KK3 = __decorate([
        Actions_1.$ActionProvider("3"),
        Jassi_1.$Class("de.KK3")
    ], KK3);
    exports.KK3 = KK3;
    let KK4 = class KK4 {
    };
    KK4 = __decorate([
        Actions_1.$ActionProvider("4"),
        Jassi_1.$Class("de.KK4")
    ], KK4);
    exports.KK4 = KK4;
    function test() {
        var pan = new Panel_1.Panel();
        //pan.tooltip="Pan";
        pan.width = "100%";
        pan.height = "100%";
        var div = new HTMLPanel_1.HTMLPanel();
        div.value = "Hallo";
        div.height = 50;
        div.tooltip = "div";
        pan.add(div);
        var button = new Button_1.Button();
        button.tooltip = "But";
        button.text = "Button";
        pan.add(button);
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=TestTab.js.map
//# sourceMappingURL=TestTab.js.map