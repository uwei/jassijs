import { $Class } from "jassijs/remote/Jassi";
import { Runlater } from "jassijs/util/Runlater";
import { SimpleReportDesigner } from "jassijs_report/designer/SimpleReportDesigner";
import { AcePanelSimple } from "jassijs_editor/AcePanelSimple";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { Panel, PanelCreateProperties } from "jassijs/ui/Panel";
import { ReportDesigner } from "jassijs_report/designer/ReportDesigner";
import windows from "jassijs/base/Windows";
import { DockingContainer } from "jassijs/ui/DockingContainer";
import { CodePanel } from "jassijs_editor/CodePanel";
import { VariablePanel } from "jassijs/ui/VariablePanel";
import { $Property } from "jassijs/ui/Property";
class SimpleCodeEditor extends Panel {
    _main: DockingContainer;
    _codeView: Panel;
    _codeToolbar: Panel;
    _codePanel: CodePanel;
    _file: string;
    variables: VariablePanel;
    _design: Panel;
    editMode: boolean;
    __evalToCursorReached: boolean;
    private _line: number;
    constructor(codePanel: CodePanel) {
        super();
        this.maximize();
        this._main = new DockingContainer();
        this._codeView = new Panel();
        this._codeToolbar = new Panel();
        //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        this._codePanel = codePanel;
        this._file = "";
        this.variables = new VariablePanel();
        this._design = new Panel();
        this._init();
        this.editMode = true;
    }
    private _initCodePanel() {
        this._codePanel.width = "100%";
        this._codePanel.mode = "typescript";
        this._codePanel.height = "calc(100% - 31px)";
    }
    private _init() {
        var _this = this;
        this._initCodePanel();
        this._codeView["horizontal"] = true;
        this._codeView.add(this._codePanel);
        this._main.width = "calc(100% - 1px)";
        this._main.height = "99%";
        this._main.onresize = function () {
            setTimeout(function () {
                _this._codePanel.resize();
            }, 1000);
        };
        super.add(this._main);
        this._installView();
        //this.variables.createTable();
    }
    _installView() {
        this._main.add(this._codeView, "Code..", "code");
        this._main.add(this.variables, "Variables", "variables");
        this._main.add(this._design, "Design", "design");
        //this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}'
    }
    private async _save(code) {
    }
    /**
    * save the code to server
    */
    save() {
        var code = this._codePanel.value;
        var _this = this;
        this._save(code);
    }
    /**
     * goto to the declariation on cursor
     */
    async gotoDeclaration() {
    }
    /**
     * search text in classes at the given text
     * @param {string} text - the text to search
     * @returns {jassijs_editor.CodeEditor} - the editor instance
     */
    static async search(text) {
        return undefined;
    }
    /**
     * extract lines from code
     * @param {string} code - the code
     * @returns {[string]} - all lines
     */
    _codeToLines(code) {
        var lines = code.split("\n");
        for (var x = 0; x < lines.length; x++) {
            while (lines[x].startsWith("/") || lines[x].startsWith(" ")
                || lines[x].startsWith("*") || lines[x].startsWith("\t")) {
                lines[x] = lines[x].substring(1);
            }
        }
        return lines;
    }
    /**
     * add variables to variabelpanel
     * @param Object<string,object> variables ["name"]=value
     */
    addVariables(variables) {
        this.variables.addAll(variables);
    }
    /**
     * execute the current code
     * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
     *                              if false at the end of the layout() function or at the end of the code
     */
    async evalCode(toCursor = undefined) {
    }
    /**
     * switch view
     * @member {string} view - "design" or "code"
     */
    set viewmode(view) {
        this._main.show(view);
    }
    /**
    * get all known instances for type
    * @param {type} type - the type we are interested
    * @returns {[string]}
    */
    getVariablesForType(type) {
        return this.variables.getVariablesForType(type);
    }
    /**
     * gets the name of the variabel that holds the object
     * @param {object} ob - the
     */
    getVariableFromObject(ob) {
        return this.variables.getVariableFromObject(ob);
    }
    /**
     * gets the name object of the given variabel
     * @param {string} ob - the name of the variable
     */
    getObjectFromVariable(varname) {
        return this.variables.getObjectFromVariable(varname);
    }
    /**
      * renames a variable in design
      * @param {string} oldName
      * @param {string} newName
      */
    renameVariable(oldName, newName) {
        this.variables.renameVariable(oldName, newName);
        if (this._design !== undefined && this._design["_componentExplorer"] !== undefined)
            this._design["_componentExplorer"].update();
    }
    /**
     * @member {string} - the code
     */
    set value(value) {
        this._codePanel.file = this._file;
        this._codePanel.value = value;
    }
    get value() {
        return this._codePanel.value;
    }
    setCursorPorition(position: number) {
        this.cursorPosition = this._codePanel.numberToPosition(position);
    }
    /**
    * @param {object} position - the current cursor position {row= ,column=}
    */
    set cursorPosition(cursor: {
        row: number;
        column: number;
    }) {
        this._codePanel.cursorPosition = cursor;
    }
    get cursorPosition() {
        return this._codePanel.cursorPosition;
    }
    /**
     * @member {string} - title of the component
     */
    get title() {
        var s = this.file.split("/");
        return s[s.length - 1];
    }
    /**
    * @member {string} - the url to edit
    */
    set file(value: string) {
        this._file = value;
        this.openFile(value);
    }
    @$Property({ isUrlTag: true, id: true })
    get file(): string {
        return this._file;
    }
    /**
    * goes to the line number
    * @param {object} value - the line number
    */
    set line(value: number) {
        this._line = Number(value);
        this.cursorPosition = { row: this._line, column: 1 };
        var _this = this;
        setTimeout(function () {
            _this.cursorPosition = { row: _this._line, column: 1 };
        }, 300);
        /*setTimeout(function() {
            _this.cursorPosition = { row: value, column: 0 };
        }, 1000);//start takes one second....*/
    }
    @$Property({ isUrlTag: true })
    get line(): number {
        return this.cursorPosition.row;
    }
    /**
     * open the file
     */
    async openFile(_file) {
    }
    destroy() {
        this._codeView.destroy();
        this._codeToolbar.destroy();
        this._codePanel.destroy();
        this.variables.destroy();
        this._design.destroy();
        //this._main.destroy();
        super.destroy();
    }
    /**
    * undo action
    */
    undo() {
        this._codePanel.undo();
    }
}
@$Class("jassi_report.SimpleReportEditor")
export class SimpleReportEditor extends Panel {
    codeEditor: SimpleCodeEditor;
    acePanel: AcePanelSimple;
    reportPanel: ReportDesign;
    reportDesigner: ReportDesigner;
    value:string;
    constructor(properties?: PanelCreateProperties) {
        super(properties);
        var _this = this;
        this.acePanel = new AcePanelSimple();
        this.codeEditor = new SimpleCodeEditor(this.acePanel);
        this.add(this.codeEditor);
        this.codeEditor.width = "100%";
        this.codeEditor.height = "100%";
        this.reportPanel = new ReportDesign();
        this.reportDesigner = new SimpleReportDesigner();
        var compileTask: Runlater = undefined;
        this.codeEditor.variables.addVariable("this", this.reportPanel);
        this.codeEditor.evalCode = async function () {
            if (compileTask === undefined) {
                compileTask = new Runlater(() => {
                    _this.codeEditor.variables.clear();
                    var code = _this.acePanel.value;
                    var func = new Function("", "return " + code.substring(code.indexOf("=") + 1));
                    var ob = func();
                    _this.reportDesign = ob;
                }, 800);
            }
            else
                compileTask.runlater();
        };
        this.acePanel.onchange((obj, editor) => {
            if (!_this.reportDesigner.propertyIsChanging)
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

    editor.value = "aHallo Herr {{nachname}}";
    windows.add(editor, "Testtt");
    //return editor;
}
