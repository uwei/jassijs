var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Classes", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, ContextMenu_1, Table_1, Registry_1, Panel_1, Router_1, Classes_1, Actions_1, Windows_1) {
    "use strict";
    var Reports_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Reports = void 0;
    Registry_1 = __importStar(Registry_1);
    Windows_1 = __importDefault(Windows_1);
    let Reports = Reports_1 = class Reports extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.table = new Table_1.Table();
            me.contextmenu = new ContextMenu_1.ContextMenu();
            this.config({
                children: [
                    me.table.config({
                        width: "100%",
                        //height: "100%",
                        showSearchbox: true,
                        contextMenu: me.contextmenu
                    }),
                    me.contextmenu.config({})
                ],
            });
            this.setData();
            me.contextmenu.getActions = async function (obs) {
                var ret = [];
                ret.push({
                    name: "View", call: async function (data) {
                        var clname = data[0].classname;
                        var Cl = await Classes_1.classes.loadClass(clname);
                        var report = new Cl();
                        report.view();
                        //await (<Report> new Cl()).open();
                    }
                });
                ret.push({
                    name: "Reportdesign", call: function (data) {
                        var file = data[0].filename;
                        Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                    }
                });
                if (obs[0].serverPath) {
                    ret.push({
                        name: "Reportdesign (Server)", call: function (data) {
                            var file = "$serverside/" + data[0].serverPath + ".ts";
                            Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                        }
                    });
                }
                return ret;
            };
        }
        async setData() {
            var data = [];
            var _this = this;
            var reports = await Registry_1.default.getJSONData("$Report");
            for (var x = 0; x < reports.length; x++) {
                var rep = reports[x];
                var entry = {
                    name: rep.params[0].name,
                    classname: rep.classname,
                    serverPath: rep.params[0].serverReportPath,
                    filename: rep.filename
                };
                data.push(entry);
            }
            setTimeout(() => {
                _this.me.table.items = data;
            }, 100);
        }
        static async show() {
            Windows_1.default.add(new Reports_1(), "Reports");
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Tools/Reports",
            icon: "mdi mdi-chart-box-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Reports, "show", null);
    Reports = Reports_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("jassijs_report/Reports"),
        __metadata("design:paramtypes", [])
    ], Reports);
    exports.Reports = Reports;
    class ReportEntry {
    }
    async function test() {
        var ret = new Reports();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Reports.js.map