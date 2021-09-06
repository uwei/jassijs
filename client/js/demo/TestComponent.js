var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/HTMLPanel", "jassijs/remote/Jassi", "jassijs/ui/Component"], function (require, exports, Panel_1, Button_1, HTMLPanel_1, Jassi_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestComponent = void 0;
    let TestComponent = class TestComponent extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return "TestComponent ";
        }
        layout(me) {
            me.button1 = new Button_1.Button();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.button2 = new Button_1.Button();
            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
            me.panel2 = new Panel_1.Panel();
            me.button3 = new Button_1.Button();
            me.button4 = new Button_1.Button();
            this.add(me.button2);
            this.add(me.button1);
            this.add(me.htmlpanel2);
            this.add(me.htmlpanel1);
            this.add(me.panel2);
            //this.value="rrr";
            me.button1.text = "ende";
            me.htmlpanel1.value = "Test";
            me.htmlpanel1.width = 25;
            me.button2.text = "start";
            me.htmlpanel2.text = "rrrere";
            me.htmlpanel2.width = 85;
            me.panel2.width = "100";
            me.panel2.height = "100";
            me.panel2.isAbsolute = true;
            me.panel2.add(me.button4);
            me.panel2.add(me.button3);
            me.button4.text = "Test";
            me.button4.x = 15;
            me.button4.y = 35;
            me.button3.height = 30;
            me.button3.width = 20;
            me.button3.x = 75;
            me.button3.y = 30;
        }
    };
    TestComponent = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/TestComponent", editableChildComponents: ["this", "me.button4"] }),
        (0, Jassi_1.$Class)("demo.TestComponent"),
        __metadata("design:paramtypes", [])
    ], TestComponent);
    exports.TestComponent = TestComponent;
    async function test() {
        var dlg = new TestComponent();
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=TestComponent.js.map