var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "jassi/ui/ContextMenu", "jassi/ui/MenuItem", "jassi/ui/Button", "jassi/remote/Jassi"], function (require, exports, Panel_1, ContextMenu_1, MenuItem_1, Button_1, Jassi_1) {
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
            me.contextmenu1 = new ContextMenu_1.ContextMenu();
            me.car = new MenuItem_1.MenuItem();
            me.button1 = new Button_1.Button();
            me.menuitem1 = new MenuItem_1.MenuItem();
            me.menuitem2 = new MenuItem_1.MenuItem();
            me.menuitem3 = new MenuItem_1.MenuItem();
            me.menuitem4 = new MenuItem_1.MenuItem();
            me.menuitem5 = new MenuItem_1.MenuItem();
            me.car.text = "car sdf sdf aaa";
            me.car.icon = "mdi mdi-car";
            me.contextmenu1.menu.add(me.car);
            me.contextmenu1.menu.add(me.menuitem1);
            me.contextmenu1.menu.add(me.menuitem4);
            this.width = 872;
            this.height = 320;
            this.isAbsolute = true;
            me.button1.text = "Test2";
            this.add(me.button1);
            this.add(me.contextmenu1);
            me.button1.text = "button4";
            me.button1.x = 1;
            me.button1.contextMenu = me.contextmenu1;
            me.button1.y = 20;
            me.button1.height = 40;
            me.menuitem1.text = "menu";
            me.menuitem1.items.add(me.menuitem2);
            me.menuitem2.text = "menu";
            me.menuitem2.items.add(me.menuitem3);
            me.menuitem3.text = "menu";
            me.menuitem4.text = "menu";
            me.menuitem5.text = "menu";
            me.menuitem4.items.add(me.menuitem5);
        }
    };
    Testcontextmenu = __decorate([
        Jassi_1.$Class("demo.Testcontextmenu"),
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