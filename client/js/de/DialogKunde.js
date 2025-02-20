var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel", "de/remote/Kunde", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ui/Select", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/ui/Component"], function (require, exports, Component_1, Panel_1, Kunde_1, NumberConverter_1, Button_1, Textbox_1, Select_1, Registry_1, Property_1, Router_1, Actions_1, Component_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DialogKunde = void 0;
    let DialogKunde = class DialogKunde extends Panel_1.Panel {
        get value() {
            return this.state.value.current;
        }
        set value(val) {
            this.state.value.current = val;
        }
        set items(val) {
            this.state.items.current = val;
        }
        render() {
            this.setdata();
            return (0, Component_2.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_2.jc)(Select_1.Select, { bind: this.state.value.bind, width: 500, items: this.state.items, display: "nachname" }),
                    (0, Component_2.jc)("br", {}),
                    (0, Component_2.jc)(Textbox_1.Textbox, {
                        converter: new NumberConverter_1.NumberConverter(), bind: this.state.value.bind.id, label: "Id"
                    }),
                    (0, Component_2.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.vorname, label: "Vorname" }),
                    (0, Component_2.jc)(Textbox_1.Textbox, {
                        bind: this.state.value.bind.nachname, label: "Nachname",
                    }),
                    (0, Component_2.jc)(Button_1.Button, {
                        text: "Save", onclick: async (event) => {
                            this.state.value.bind.$fromForm();
                            this.state.value.current.save();
                        }
                    })
                ]
            });
        }
        static async showDialog() {
            Router_1.router.navigate("#do=de.DialogKunde");
        }
        async setdata() {
            var kunden = await Kunde_1.Kunde.find();
            this.state.items.current = kunden;
        }
        get title() {
            return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde),
        __metadata("design:paramtypes", [Kunde_1.Kunde])
    ], DialogKunde.prototype, "value", null);
    __decorate([
        (0, Actions_1.$Action)({
            name: "Demo",
            icon: "mdi mdi-television-play"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], DialogKunde.prototype, "render", null);
    __decorate([
        (0, Actions_1.$Action)({
            name: "Demo/Kunden",
            icon: "mdi mdi-account"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DialogKunde, "showDialog", null);
    DialogKunde = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("de.DialogKunde")
    ], DialogKunde);
    exports.DialogKunde = DialogKunde;
    class HH extends Component_1.Component {
        constructor() {
            super(...arguments);
            this.kk = "oo";
        }
        hallo() {
            var h = {
                oo: () => alert(this.kk)
            };
            return h;
        }
        render() {
            return (0, Component_2.jc)("button", {
                onClick: () => {
                    debugger;
                    var h = this;
                }
            });
        }
        ;
    }
    async function test() {
        var kunden = await Kunde_1.Kunde.find();
        var dlg = new DialogKunde({
            value: kunden[0],
            items: kunden
        });
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=DialogKunde.js.map