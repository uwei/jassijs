var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/util/Runlater", "jassijs_report/designer/SimpleReportDesigner", "jassijs_editor/CodeEditor", "jassijs_editor/AcePanelSimple", "jassijs_report/ReportDesign", "jassijs/ui/Panel", "jassijs/base/Windows"], function (require, exports, Jassi_1, Runlater_1, SimpleReportDesigner_1, CodeEditor_1, AcePanelSimple_1, ReportDesign_1, Panel_1, Windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SimpleReportEditor = void 0;
    let SimpleReportEditor = class SimpleReportEditor extends Panel_1.Panel {
        constructor(properties) {
            super(properties);
            var _this = this;
            this.acePanel = new AcePanelSimple_1.AcePanelSimple();
            this.codeEditor = new CodeEditor_1.CodeEditor({ codePanel: this.acePanel, hideToolbar: true });
            this.add(this.codeEditor);
            this.codeEditor.width = "100%";
            this.codeEditor.height = "100%";
            this.reportPanel = new ReportDesign_1.ReportDesign();
            this.reportDesigner = new SimpleReportDesigner_1.SimpleReportDesigner();
            var compileTask = undefined;
            this.codeEditor.variables.addVariable("this", this.reportPanel);
            this.codeEditor.evalCode = async function () {
                if (compileTask === undefined) {
                    compileTask = new Runlater_1.Runlater(() => {
                        var code = this.acePanel.value;
                        var func = new Function("", "return " + code.substring(code.indexOf("=") + 1));
                        var ob = func();
                        _this.reportDesign = ob;
                    }, 800);
                }
                else
                    compileTask.runlater();
            };
            this.acePanel.onchange((obj, editor) => {
                if (!this.reportDesigner.propertyIsChanging)
                    _this.codeEditor.evalCode();
            });
            //designer["codeEditor"]._main.add(designer, "Design", "design");
            this.reportPanel.design = { content: [] };
            this.codeEditor._design = this.reportDesigner;
            this.codeEditor._main.add(this.codeEditor._design, "Design", "design");
            this.reportDesigner.codeEditor = this.codeEditor;
            this.reportDesigner.designedComponent = this.reportPanel;
        }
        get reportDesign() {
            var _a;
            return (_a = this.reportPanel) === null || _a === void 0 ? void 0 : _a.design;
        }
        set reportDesign(design) {
            this.reportPanel = new ReportDesign_1.ReportDesign();
            this.reportPanel.design = design;
            this.reportDesigner.designedComponent = this.reportPanel;
        }
    };
    SimpleReportEditor = __decorate([
        (0, Jassi_1.$Class)("jassi_report.SimpleReportEditor"),
        __metadata("design:paramtypes", [Panel_1.PanelCreateProperties])
    ], SimpleReportEditor);
    exports.SimpleReportEditor = SimpleReportEditor;
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {{nachname}}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
        var editor = new SimpleReportEditor();
        editor.reportDesign = reportdesign;
        editor.width = "100%";
        editor.height = "100%";
        Windows_1.default.add(editor, "Testtt");
        return editor;
    }
    exports.test = test;
});
//# sourceMappingURL=SimpleReportEditor.js.map