var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Property", "de/remote/Kunde"], function (require, exports, Jassi_1, Property_1, Kunde_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportKunde = exports.reportdesign = void 0;
    var reportdesign = {
        content: [
            "aHallo Herr ${nachname}",
            "ok",
            {
                columns: [
                    "text",
                    "text"
                ]
            }
        ]
    };
    exports.reportdesign = reportdesign;
    let ReportKunde = class ReportKunde {
        constructor() {
            this.me = {};
            this.reportdesign = reportdesign;
        }
        get title() {
            return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
        }
        fill() {
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], ReportKunde.prototype, "value", void 0);
    ReportKunde = __decorate([
        (0, Jassi_1.$Class)("de.ReportKunde")
    ], ReportKunde);
    exports.ReportKunde = ReportKunde;
    async function test() {
        var dlg = new ReportKunde();
        dlg.value = new Kunde_1.Kunde();
        dlg.value.nachname = "Klaus";
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportKunden.js.map