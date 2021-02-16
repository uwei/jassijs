var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "jassi/ui/Button", "jassi/ui/Textbox", "jassi/ui/converters/NumberConverter", "jassi/remote/Jassi"], function (require, exports, Panel_1, Button_1, Textbox_1, NumberConverter_1, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HalloPhillip = void 0;
    let HalloPhillip = class HalloPhillip extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        layout(me) {
            me.aboutbutton = new Button_1.Button();
            me.text = new Textbox_1.Textbox();
            me.zahl1 = new Textbox_1.Textbox();
            me.zahl2 = new Textbox_1.Textbox();
            me.ergebnis = new Textbox_1.Textbox();
            this.isAbsolute = true;
            this.width = 574;
            this.height = 529;
            this.add(me.text);
            this.add(me.zahl1);
            this.add(me.zahl2);
            this.add(me.ergebnis);
            this.add(me.aboutbutton);
            me.aboutbutton.text = "about us";
            me.aboutbutton.x = 3;
            me.aboutbutton.y = 3;
            me.aboutbutton.onclick(function (event) {
                me.text.value = "mein papa und ich haben diese textbox programiert";
            });
            me.aboutbutton.height = 20;
            me.text.x = 5;
            me.text.y = 30;
            me.text.width = 165;
            me.zahl1.x = 5;
            me.zahl1.y = 60;
            me.zahl1.label = "zahl 1";
            me.zahl1.converter = new NumberConverter_1.NumberConverter();
            me.zahl1.oninput(function (event) {
                me.ergebnis.value = me.zahl1.value + me.zahl2.value;
            });
            me.zahl1.height = 15;
            me.zahl2.x = 5;
            me.zahl2.y = 109;
            me.zahl2.label = "zahl 2";
            me.zahl2.converter = new NumberConverter_1.NumberConverter();
            me.zahl2.oninput(function (event) {
                me.ergebnis.value = me.zahl1.value + me.zahl2.value;
            });
            me.ergebnis.x = 5;
            me.ergebnis.y = 165;
            me.ergebnis.label = "ergebnis";
            me.ergebnis.converter = new NumberConverter_1.NumberConverter();
        }
        destroy() {
            //$(this.me.text.dom).draggable("destroy");
            super.destroy();
        }
    };
    HalloPhillip = __decorate([
        Jassi_1.$Class("demo.HalloPhillip"),
        __metadata("design:paramtypes", [])
    ], HalloPhillip);
    exports.HalloPhillip = HalloPhillip;
    ;
    function test() {
        var t = new HalloPhillip();
        $.notify.addStyle('download extension', {
            html: '<a href="https://www.w3schools.com" target="_blank"><span data-notify-text/></a>'
        });
        $.notify('For debugging in edge an chrome the jassi debugging extension must be installed. Click here to download.', {
            style: 'download extension'
        });
        // kk.o=0;
        return t;
    }
    exports.test = test;
});
//# sourceMappingURL=HalloPhillip.js.map