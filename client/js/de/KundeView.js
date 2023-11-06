var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/remote/Registry", "de/remote/Kunde", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Property_1, Registry_1, Kunde_1, DBObjectView_1) {
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
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.textbox6 = new Textbox_1.Textbox();
            me.textbox5 = new Textbox_1.Textbox();
            me.textbox7 = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "300",
                height: "300",
                children: [
                    me.textbox2.config({
                        x: 5,
                        y: 0,
                        label: "Id",
                        width: 50,
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.textbox1.config({
                        x: 5,
                        y: 40,
                        label: "Vorname",
                        width: 95,
                        bind: [me.databinder, "vorname"],
                        style: {
                            color: "#3dbbac",
                        }
                    }),
                    me.textbox3.config({
                        x: 110,
                        y: 40,
                        label: "Nachname",
                        width: 120,
                        bind: [me.databinder, "nachname"]
                    }),
                    me.textbox4.config({
                        x: 5,
                        y: 100,
                        bind: [me.databinder, "strasse"],
                        label: "Straße",
                        width: 145
                    }),
                    me.textbox6.config({
                        x: 160,
                        y: 100,
                        label: "Hausnummer",
                        width: 70,
                        bind: [me.databinder, "hausnummer"]
                    }),
                    me.textbox5.config({
                        x: 5,
                        y: 155,
                        width: 55,
                        bind: [me.databinder, "PLZ"],
                        label: "PLZ"
                    }),
                    me.textbox7.config({
                        x: 75,
                        y: 155,
                        label: "Ort",
                        bind: [me.databinder, "ort"],
                        height: 15,
                        width: 155
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], KundeView.prototype, "value", void 0);
    KundeView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "de.Kunde" }),
        (0, Registry_1.$Class)("de.KundeView"),
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