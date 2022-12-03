var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs/ui/FileExplorer"], function (require, exports, Actions_1, Registry_1, OptionDialog_1, FileExplorer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateReport = void 0;
    const code = `reportdesign = {
	content: [
    ]
};`;
    let TemplateReport = class TemplateReport {
        static async newFile(all) {
            var res = await OptionDialog_1.OptionDialog.show("Create new Report:", ["ok", "cancel"], undefined, false, "Report1");
            if (res.button === "ok") {
                FileExplorer_1.FileActions.newFile(all, res.text + ".ts", code, true);
            }
        }
    };
    TemplateReport.code = code;
    __decorate([
        (0, Actions_1.$Action)({
            name: "New/Report",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateReport, "newFile", null);
    TemplateReport = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.remote.FileNode"),
        (0, Registry_1.$Class)("jassijs_report.TemplateReport")
    ], TemplateReport);
    exports.TemplateReport = TemplateReport;
});
//# sourceMappingURL=TemplateReport.js.map