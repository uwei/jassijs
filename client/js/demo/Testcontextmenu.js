var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/remote/Registry"], function (require, exports, Panel_1, ContextMenu_1, MenuItem_1, Button_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Testcontextmenu = void 0;
    let Testcontextmenu = class Testcontextmenu extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var contextmenu1 = new ContextMenu_1.ContextMenu();
            var car = new MenuItem_1.MenuItem();
            var button1 = new Button_1.Button();
            var menuitem1 = new MenuItem_1.MenuItem();
            var menuitem2 = new MenuItem_1.MenuItem();
            var menuitem3 = new MenuItem_1.MenuItem();
            var menuitem4 = new MenuItem_1.MenuItem();
            var menuitem5 = new MenuItem_1.MenuItem();
            car.text = "car sdf sdf aaa";
            car.icon = "mdi mdi-car";
            contextmenu1.menu.add(car);
            contextmenu1.menu.add(menuitem1);
            contextmenu1.menu.add(menuitem4);
            this.width = 872;
            this.height = 320;
            this.isAbsolute = true;
            button1.text = "Test2";
            this.add(button1);
            this.add(contextmenu1);
            button1.text = "button4";
            button1.x = 1;
            button1.contextMenu = contextmenu1;
            button1.y = 20;
            button1.height = 40;
            menuitem1.text = "menu";
            menuitem1.items.add(menuitem2);
            menuitem2.text = "menu";
            menuitem2.items.add(menuitem3);
            menuitem3.text = "menu";
            menuitem4.text = "menu";
            menuitem5.text = "menu";
            menuitem4.items.add(menuitem5);
        }
    };
    Testcontextmenu = __decorate([
        (0, Registry_1.$Class)("demo.Testcontextmenu"),
        __metadata("design:paramtypes", [])
    ], Testcontextmenu);
    exports.Testcontextmenu = Testcontextmenu;
    async function test() {
        // kk.o=0;
        var dlg = new Testcontextmenu();
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=Testcontextmenu.js.map