var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi_report/ReportDesign", "jassi/remote/Jassi", "jassi/ui/Property", "remote/de/Kunde"], function (require, exports, ReportDesign_1, Jassi_1, Property_1, Kunde_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportKunde = void 0;
    let ReportKunde = class ReportKunde extends ReportDesign_1.ReportDesign {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        async setdata() {
        }
        get title() {
            return this.value === undefined ? "Kundenreport" : "Kundenreport " + this.value.id;
        }
        layout(me) {
            this.design = { "content": { "stack": [{ "text": "Hallo" }, { "text": "ok" }, { "columns": [{ "text": "text" }, { "text": "text" }] }] } };
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Kunde_1.Kunde)
    ], ReportKunde.prototype, "value", void 0);
    ReportKunde = __decorate([
        Jassi_1.$Class("demo.ReportKunde"),
        __metadata("design:paramtypes", [])
    ], ReportKunde);
    exports.ReportKunde = ReportKunde;
    async function test() {
        // kk.o=0;
        var dlg = new ReportKunde();
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportKunde.js.map