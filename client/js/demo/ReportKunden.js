var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportKunden = void 0;
    var reportdesign = {
        content: [
            "{{parameter.Datum}}",
            {
                table: {
                    body: [
                        [
                            "Name",
                            "Nachname"
                        ],
                        {
                            foreach: "kunde",
                            do: [
                                "{{kunde.name}}",
                                "{{kunde.nachname}}"
                            ]
                        }
                    ]
                }
            }
        ]
    };
    let ReportKunden = class ReportKunden {
        constructor() {
            this.reportdesign = reportdesign;
        }
    };
    ReportKunden = __decorate([
        (0, Jassi_1.$Class)("demo.ReportKunden"),
        __metadata("design:paramtypes", [])
    ], ReportKunden);
    exports.ReportKunden = ReportKunden;
    async function test() {
        // kk.o=0;
        var dlg = new ReportKunden();
        dlg.parameter = {
            "Datum": "18.03.2021"
        };
        dlg.value = [{ name: "Klaus", nachname: "Meier" },
            { name: "Heinz", nachname: "Melzer" }];
        //  this.design = {"content":{"stack":[{"text":"Halloso"},{"text":"sdsfsdf"}]}};
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //console.log(JSON.stringify(dlg.toJSON()));
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportKunden.js.map