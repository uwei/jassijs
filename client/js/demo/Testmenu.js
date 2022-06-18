var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Menu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/remote/Registry"], function (require, exports, Panel_1, Menu_1, MenuItem_1, Button_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Testmenu = void 0;
    let Testmenu = class Testmenu extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.menu1 = new Menu_1.Menu();
            me.menuitem1 = new MenuItem_1.MenuItem();
            me.menuitem2 = new MenuItem_1.MenuItem();
            me.menuitem3 = new MenuItem_1.MenuItem();
            me.menuitem4 = new MenuItem_1.MenuItem();
            me.menuitem5 = new MenuItem_1.MenuItem();
            me.button1 = new Button_1.Button();
            me.menuitem6 = new MenuItem_1.MenuItem();
            me.menuitem7 = new MenuItem_1.MenuItem();
            me.menu1.width = 205;
            me.menu1.height = 185;
            this.add(me.menu1);
            me.save = new MenuItem_1.MenuItem();
            me.save.text = "save";
            me.save.icon = "mdi mdi-content-save";
            me.save.height = 40;
            me.del = new MenuItem_1.MenuItem();
            me.del.text = "delete";
            me.del.icon = "mdi mdi-delete";
            me.del.onclick(function () {
                window.setTimeout(function () {
                    $(me.menu1.dom).menu("expand", null, true);
                }, 2000);
            });
            me.car = new MenuItem_1.MenuItem();
            me.car.text = "car sdf sdf aaa";
            me.car.icon = "mdi mdi-car";
            me.menu1.add(me.save);
            me.menu1.add(me.menuitem5);
            me.menu1.add(me.del);
            me.menu1.x = 10;
            me.menu1.y = 5;
            me.save.items.add(me.car);
            me.save.items.add(me.menuitem4);
            me.save.items.add(me.menuitem6);
            this.width = 872;
            this.height = 320;
            this.isAbsolute = true;
            this.add(me.button1);
            me.car.items.add(me.menuitem1);
            me.car.items.add(me.menuitem2);
            me.car.items.add(me.menuitem3);
            me.menuitem1.text = "ooopp";
            me.menuitem2.text = "menu";
            me.menuitem3.text = "menu";
            me.menuitem4.text = "menus";
            me.menuitem5.text = "ret";
            me.menuitem5.icon = "mdi mdi-car";
            me.button1.text = "button";
            me.button1.x = 398;
            me.button1.y = 26;
            me.button1.height = 25;
            me.menuitem6.text = "menu";
            me.menuitem5.items.add(me.menuitem7);
            me.menuitem7.text = "menupppp";
        }
    };
    Testmenu = __decorate([
        (0, Registry_1.$Class)("demo.Testmenu"),
        __metadata("design:paramtypes", [])
    ], Testmenu);
    exports.Testmenu = Testmenu;
});
//# sourceMappingURL=Testmenu.js.map