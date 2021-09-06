var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/remote/Jassi", "de/remote/Kunde", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Property_1, Jassi_1, Kunde_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KundeView = void 0;
    //;
    let KundeView = class KundeView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; is initialized in super
            this.layout(this.me);
        }
        /*async setdata() {
            var kunden = await Kunde.find()[2];
    
        }*/
        get title() {
            return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
        }
        layout(me) {
            //this.setdata();
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.textbox5 = new Textbox_1.Textbox();
            me.textbox6 = new Textbox_1.Textbox();
            me.textbox7 = new Textbox_1.Textbox();
            me.main.isAbsolute = true;
            me.main.width = "300";
            me.main.height = "300";
            me.main.add(me.textbox2);
            me.main.add(me.textbox1);
            me.main.add(me.textbox3);
            me.main.add(me.databinder);
            me.main.add(me.textbox4);
            me.main.add(me.textbox6);
            me.main.add(me.textbox5);
            me.main.add(me.textbox7);
            me.textbox1.x = 5;
            me.textbox1.y = 45;
            me.textbox1.label = "Vorname";
            me.textbox1.width = 95;
            me.textbox1.bind(me.databinder, "vorname");
            me.textbox1.css({
                color: "#3dbbac",
            });
            me.textbox2.x = 5;
            me.textbox2.y = 5;
            me.textbox2.label = "Id";
            me.textbox2.width = 50;
            me.textbox2.bind(me.databinder, "id");
            me.textbox2.converter = new NumberConverter_1.NumberConverter();
            me.textbox3.x = 110;
            me.textbox3.y = 45;
            me.textbox3.label = "Nachname";
            me.textbox3.width = 120;
            me.textbox3.bind(me.databinder, "nachname");
            me.textbox4.x = 5;
            me.textbox4.y = 95;
            me.textbox4.bind(me.databinder, "strasse");
            me.textbox4.label = "Straße";
            me.textbox4.width = 145;
            me.textbox5.x = 5;
            me.textbox5.y = 145;
            me.textbox5.width = 55;
            me.textbox5.bind(me.databinder, "PLZ");
            me.textbox5.label = "PLZ";
            me.textbox6.x = 160;
            me.textbox6.y = 95;
            me.textbox6.label = "Hausnummer";
            me.textbox6.width = 70;
            me.textbox6.bind(me.databinder, "hausnummer");
            me.textbox7.x = 75;
            me.textbox7.y = 145;
            me.textbox7.label = "Ort";
            me.textbox7.bind(me.databinder, "ort");
            me.textbox7.height = 15;
            me.textbox7.width = 155;
            me.toolbar.height = 30;
            this.add(me.main);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], KundeView.prototype, "value", void 0);
    KundeView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "de.Kunde" }),
        (0, Jassi_1.$Class)("de.KundeView"),
        __metadata("design:paramtypes", [])
    ], KundeView);
    exports.KundeView = KundeView;
    async function test() {
        var v = new KundeView();
        var test = await Kunde_1.Kunde.findOne(1);
        v.value = test;
        return v;
    }
    exports.test = test;
});
//# sourceMappingURL=KundeView.js.map