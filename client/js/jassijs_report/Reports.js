var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Classes", "jassijs/base/Actions", "jassijs/base/Windows", "jassijs_report/ReportViewer"], function (require, exports, ContextMenu_1, Table_1, Registry_1, Panel_1, Router_1, Classes_1, Actions_1, Windows_1, ReportViewer_1) {
    "use strict";
    var Reports_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Reports = void 0;
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
                        height: 80,
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
                    name: "Show", call: async function (data) {
                        var clname = data[0].classname;
                        var Cl = await Classes_1.classes.loadClass(clname);
                        var report = new Cl();
                        var viewer = new ReportViewer_1.ReportViewer();
                        viewer.value = report;
                        Windows_1.default.add(viewer, data[0].name);
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
            this.me.table.items = data;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfcmVwb3J0L1JlcG9ydHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnQkEsSUFBYSxPQUFPLGVBQXBCLE1BQWEsT0FBUSxTQUFRLGFBQUs7UUFFOUI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxXQUFXLEdBQUcsSUFBSSx5QkFBVyxFQUFFLENBQUM7WUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDUixRQUFRLEVBQUU7b0JBQ04sRUFBRSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7d0JBQ1osS0FBSyxFQUFFLE1BQU07d0JBQ2IsTUFBTSxFQUFFLEVBQUU7d0JBQ1YsYUFBYSxFQUFFLElBQUk7d0JBQ25CLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVztxQkFDOUIsQ0FBQztvQkFDRixFQUFFLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7aUJBQzVCO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2YsRUFBRSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsS0FBSyxXQUFXLEdBQUc7Z0JBQzNDLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztnQkFDWixHQUFHLENBQUMsSUFBSSxDQUFDO29CQUNOLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssV0FBVyxJQUFJO3dCQUNwQyxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMs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MEJBQU87SUEyRXBCLE1BQU0sV0FBVztLQUtoQjtJQUNNLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDeEIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSEQsb0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb250ZXh0TWVudSB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRleHRNZW51XCI7XG5pbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJqYXNzaWpzL3VpL1RhYmxlXCI7XG5pbXBvcnQgcmVnaXN0cnksIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiamFzc2lqcy9iYXNlL1JvdXRlclwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgeyBSZXBvcnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0XCI7XG5pbXBvcnQgeyAkQWN0aW9uLCAkQWN0aW9uUHJvdmlkZXIgfSBmcm9tIFwiamFzc2lqcy9iYXNlL0FjdGlvbnNcIjtcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xuaW1wb3J0IHsgUmVwb3J0Vmlld2VyIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydFZpZXdlclwiO1xudHlwZSBNZSA9IHtcbiAgICB0YWJsZT86IFRhYmxlO1xuICAgIGNvbnRleHRtZW51PzogQ29udGV4dE1lbnU7XG59O1xuQCRBY3Rpb25Qcm92aWRlcihcImphc3NpanMuYmFzZS5BY3Rpb25Ob2RlXCIpXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQvUmVwb3J0c1wiKVxuZXhwb3J0IGNsYXNzIFJlcG9ydHMgZXh0ZW5kcyBQYW5lbCB7XG4gICAgbWU6IE1lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lID0ge307XG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLnRhYmxlID0gbmV3IFRhYmxlKCk7XG4gICAgICAgIG1lLmNvbnRleHRtZW51ID0gbmV3IENvbnRleHRNZW51KCk7XG4gICAgICAgIHRoaXMuY29uZmlnKHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgbWUudGFibGUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6IDgwLFxuICAgICAgICAgICAgICAgICAgICBzaG93U2VhcmNoYm94OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBjb250ZXh0TWVudTogbWUuY29udGV4dG1lbnVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb250ZXh0bWVudS5jb25maWcoe30pXG4gICAgICAgICAgICBdLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5zZXREYXRhKCk7XG4gICAgICAgIG1lLmNvbnRleHRtZW51LmdldEFjdGlvbnMgPSBhc3luYyBmdW5jdGlvbiAob2JzKSB7XG4gICAgICAgICAgICB2YXIgcmV0ID0gW107XG4gICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiU2hvd1wiLCBjYWxsOiBhc3luYyBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY2xuYW1lID0gZGF0YVswXS5jbGFzc25hbWU7XG4gICAgICAgICAgICAgICAgICAgIHZhciBDbD1hd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhjbG5hbWUpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwb3J0OlJlcG9ydD1uZXcgQ2woKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpZXdlcj1uZXcgUmVwb3J0Vmlld2VyKCk7XG4gICAgICAgICAgICAgICAgICAgIHZpZXdlci52YWx1ZT1yZXBvcnQ7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvd3MuYWRkKHZpZXdlcixkYXRhWzBdLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAvL2F3YWl0ICg8UmVwb3J0PiBuZXcgQ2woKSkub3BlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0LnB1c2goe1xuICAgICAgICAgICAgICAgIG5hbWU6IFwiUmVwb3J0ZGVzaWduXCIsIGNhbGw6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gZGF0YVswXS5maWxlbmFtZTtcbiAgICAgICAgICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiI2RvPWphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3ImZmlsZT1cIiArIGZpbGUucmVwbGFjZUFsbChcInxcIiwgXCIvXCIpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChvYnNbMF0uc2VydmVyUGF0aCkge1xuICAgICAgICAgICAgICAgIHJldC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogXCJSZXBvcnRkZXNpZ24gKFNlcnZlcilcIiwgY2FsbDogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmaWxlID0gXCIkc2VydmVyc2lkZS9cIiArIGRhdGFbMF0uc2VydmVyUGF0aCArIFwiLnRzXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCIjZG89amFzc2lqc19lZGl0b3IuQ29kZUVkaXRvciZmaWxlPVwiICsgZmlsZS5yZXBsYWNlQWxsKFwifFwiLCBcIi9cIikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9O1xuICAgIH1cbiAgICBhc3luYyBzZXREYXRhKCkge1xuICAgICAgICB2YXIgZGF0YSA9IFtdO1xuICAgICAgICB2YXIgcmVwb3J0cyA9IGF3YWl0IHJlZ2lzdHJ5LmdldEpTT05EYXRhKFwiJFJlcG9ydFwiKTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCByZXBvcnRzLmxlbmd0aDsgeCsrKSB7XG4gICAgICAgICAgICB2YXIgcmVwID0gcmVwb3J0c1t4XTtcbiAgICAgICAgICAgIHZhciBlbnRyeTogUmVwb3J0RW50cnkgPSB7XG4gICAgICAgICAgICAgICAgbmFtZTogcmVwLnBhcmFtc1swXS5uYW1lLFxuICAgICAgICAgICAgICAgIGNsYXNzbmFtZTogcmVwLmNsYXNzbmFtZSxcbiAgICAgICAgICAgICAgICBzZXJ2ZXJQYXRoOiByZXAucGFyYW1zWzBdLnNlcnZlclJlcG9ydFBhdGgsXG4gICAgICAgICAgICAgICAgZmlsZW5hbWU6IHJlcC5maWxlbmFtZVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRhdGEucHVzaChlbnRyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5tZS50YWJsZS5pdGVtcyA9IGRhdGE7XG4gICAgfVxuICAgICBAJEFjdGlvbih7XG4gICAgICAgIG5hbWU6IFwiVG9vbHMvUmVwb3J0c1wiLFxuICAgICAgIGljb246IFwibWRpIG1kaS1jaGFydC1ib3gtb3V0bGluZVwiLFxuICAgIH0pXG4gICAgc3RhdGljIGFzeW5jIHNob3coKXtcbiAgICAgICAgd2luZG93cy5hZGQobmV3IFJlcG9ydHMoKSxcIlJlcG9ydHNcIik7XG4gICAgfVxufVxuY2xhc3MgUmVwb3J0RW50cnkge1xuICAgIGNsYXNzbmFtZTogc3RyaW5nO1xuICAgIG5hbWU6IHN0cmluZztcbiAgICBzZXJ2ZXJQYXRoPzogc3RyaW5nO1xuICAgIGZpbGVuYW1lOiBzdHJpbmc7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IFJlcG9ydHMoKTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19