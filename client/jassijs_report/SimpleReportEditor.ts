import { $Class } from "jassijs/remote/Jassi";
import { Runlater } from "jassijs/util/Runlater";
import { SimpleReportDesigner } from "jassijs_report/designer/SimpleReportDesigner";
import { CodeEditor } from "jassijs_editor/CodeEditor";
import { AcePanelSimple } from "jassijs_editor/AcePanelSimple";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { AcePanel } from "jassijs_editor/AcePanel";
import { Panel, PanelCreateProperties } from "jassijs/ui/Panel";
import { ReportDesigner } from "jassijs_report/designer/ReportDesigner";
import windows from "jassijs/base/Windows";

@$Class("jassi_report.SimpleReportEditor")
export class SimpleReportEditor extends Panel {
    codeEditor: CodeEditor;
    acePanel: AcePanelSimple;
    reportPanel: ReportDesign;
    reportDesigner: ReportDesigner;
    constructor(properties?:PanelCreateProperties) {
        super(properties);
        var _this = this;
        this.acePanel = new AcePanelSimple();
        this.codeEditor = new CodeEditor({ codePanel: this.acePanel, hideToolbar: true });
        this.add(this.codeEditor);
        this.codeEditor.width = "100%";
        this.codeEditor.height = "100%";
        this.reportPanel = new ReportDesign();
        this.reportDesigner = new SimpleReportDesigner();
        var compileTask: Runlater = undefined;
        this.codeEditor.variables.addVariable("this", this.reportPanel);
        this.codeEditor.evalCode = async function () {//refresh only if 800ms nothing is typed
            if (compileTask === undefined) {
                compileTask = new Runlater(() => {
                    var code = this.acePanel.value;
                    var func = new Function("", "return " + code.substring(code.indexOf("=") + 1));
                    var ob = func();
                    _this.reportDesign = ob;

                }, 800);
            } else
                compileTask.runlater();
        }
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
        return this.reportPanel?.design;
    }
    set reportDesign(design) {
        this.reportPanel = new ReportDesign();
        this.reportPanel.design = design;
        this.reportDesigner.designedComponent = this.reportPanel;
    }
}
export function test() {
    var reportdesign={
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
    var editor=new SimpleReportEditor();
    editor.reportDesign=reportdesign;
     editor.width = "100%";
    editor.height = "100%";
    windows.add(editor, "Testtt");
    return editor;
}