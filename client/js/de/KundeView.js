var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/Panel", "jassijs/remote/Registry", "de/remote/Kunde", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Textbox_1, Panel_1, Registry_1, Kunde_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KundeView = void 0;
    //;
    let KundeView = class KundeView extends DBObjectView_1.DBObjectView {
        /*async setdata() {
            var kunden = await Kunde.find()[2];
    
        }*/
        get title() {
            return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
        }
        render() {
            return ((0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Id", bind: this.states.value.bind.id, converter: new NumberConverter_1.NumberConverter() }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.vorname, label: "Vorname" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Nachname", bind: this.states.value.bind.nachname }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.strasse, label: "Straße" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.PLZ, label: "PLZ" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.states.value.bind.ort, label: "Ort" }),
                    (0, Component_1.jc)("br", { label: "" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { label: "Land", bind: this.states.value.bind.land })
                ]
            }));
        }
    };
    KundeView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "de.Kunde" }),
        (0, Registry_1.$Class)("de.KundeView")
    ], KundeView);
    exports.KundeView = KundeView;
    async function test() {
        var t = await Kunde_1.Kunde.findOne(1);
        var v = new KundeView({
            value: t
        });
        return v;
    }
    exports.test = test;
});
//# sourceMappingURL=KundeView.js.map