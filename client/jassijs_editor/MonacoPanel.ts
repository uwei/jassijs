import jassi from "jassijs/jassi";
import { Component } from "jassijs/ui/Component";
import "jassijs_editor/Debugger";
import { $Class } from "jassijs/remote/Jassi";
import { router } from "jassijs/base/Router";
import "jassijs_editor/ext/monaco";
import typescript from "jassijs_editor/util/Typescript";
import { Server } from "jassijs/remote/Server";
import { CodePanel } from "jassijs_editor/CodePanel";
import { Settings } from "jassijs/remote/Settings";


var inited = false;
function __init(editor: monaco.editor.IStandaloneCodeEditor) {
    if (inited)
        return;
    //auto import 
    const cs = (editor as any)._commandService
    var CommandsRegistry = require("vs/platform/commands/common/commands").CommandsRegistry;
    CommandsRegistry.registerCommand("autoimport", (o1, model: monaco.editor.ITextModel, pos) => {
        var file = model.uri.path.substring(1);
        var code = model.getValue();
        var p = typescript.getPositionOfLineAndCharacter(file, {
            line: pos.lineNumber, character: pos.column
        });
        const oldpos = model["lastEditor"].getPosition();
        setTimeout(() => {
            CodePanel.getAutoimport(p, file, code).then((data) => {

                if (data !== undefined) {

                    model.pushEditOperations([], [{
                        range: monaco.Range.fromPositions({ column: data.pos.column, lineNumber: data.pos.row + 1 }),
                        text: data.text
                    }], (a) => {
                        return null;
                    });
                    oldpos.lineNumber = oldpos.lineNumber + (data.text.indexOf("\r") ? 1 : 0);
                    model["lastEditor"].setPosition(oldpos);
                }
            });

        }, 100);
    })
    //implement go to definition
    const editorService = editor["_codeEditorService"];
    const openEditorBase = editorService.openCodeEditor.bind(editorService);
    editorService.openCodeEditor = async (input, source) => {
        const result = await openEditorBase(input, source);
        if (result === null) {
            var file = input.resource.path.substring(1);
            var line = input.options.selection.startLineNumber;

            router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
        }
        return result; // always return the base result
    };
    //completion for autonimport
    monaco.languages.registerCompletionItemProvider('typescript', {
        provideCompletionItems: async function (model, position) {
            var textUntilPosition = model.getValueInRange({ startLineNumber: 1, startColumn: 1, endLineNumber: position.lineNumber, endColumn: position.column });
            var word = model.getWordUntilPosition(position);
            var range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn
            };
            var file = model.uri.path.substring(1);
            var pos = typescript.getPositionOfLineAndCharacter(file, { line: position.lineNumber, character: position.column });
            var all = await typescript.getCompletion(file, pos, undefined, { includeExternalModuleExports: true });
            var sug = [];
            for (var x = 0; x < all.entries.length; x++) {
                var it = all.entries[x];
                if ((it.kindModifiers === "export" || it.kindModifiers === "") && it.hasAction === true) {
                    var item: monaco.languages.CompletionItem = {
                        label: it.name,
                        kind: <monaco.languages.CompletionItemKind>it.kind,
                        documentation: "import from " + it.source,
                        insertText: it.name,
                        range: range,
                        command: {
                            arguments: [model, position],
                            id: "autoimport",
                            title: "autoimport"
                        }
                    }
                    sug.push(item);
                }
            }
            return {
                suggestions: sug
            };
        }
    });
    inited = true;
}

/**
* wrapper for the Ace-Code editor with Typescript-Code-Completion an other features
* @class jassijs.ui.CodePanel
*/
@$Class("jassijs_editor.MonacoPanel")
export class MonacoPanel extends CodePanel {
    private _mode: string;
    private _editor: monaco.editor.IStandaloneCodeEditor;
    private _isInited: boolean;
    //   private _lastCursorPosition;
    file: string;
    private static _tooltipdiv;
    private _lastTooltipRefresh;
    constructor() {
        super();
        var _this = this;
        // super.init($('<div style="width: 800px; height: 600px; border: 1px solid grey"></div>')[0]);
        var test = $('<div class="MonacoPanel" style="height: 100px; width: 100px"></div>')[0];

        super.init(test);

        $(this.domWrapper).css("overflow", "hidden");
        $(this.domWrapper).css("display", "");

        /* _this._editor.on("guttermousedown", function(e) {
 
             var row = e.getDocumentPosition().row;
             var breakpoints = e.editor.session.getBreakpoints(row, 0);
             var type = "debugpoint";
             if (e.domEvent.ctrlKey)
                 type = "checkpoint";
             var column = _this._editor.session.getLine(row).length;
             if (typeof breakpoints[row] === typeof undefined) {
                 e.editor.session.setBreakpoint(row);
                 _this.callEvent("breakpointChanged", row, column, true, type);
             } else {
                 e.editor.session.clearBreakpoint(row, false, undefined);
                 _this.callEvent("breakpointChanged", row, column, false, type);
             }
         });*/
        let theme = Settings.gets(Settings.keys.Development_MoanacoEditorTheme);
        this._editor = monaco.editor.create(this.dom, {
            //value:  monaco.editor.getModels()[0], //['class A{b:B;};\nclass B{a:A;};\nfunction x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            language: 'typescript',
            theme: (theme ? theme : "vs-light"),
            glyphMargin: true,
            fontSize: 12,
            automaticLayout: true
        });

        __init(this._editor);
        this._editor.onMouseDown(function (e) {
            _this._mouseDown(e);
        });
        //this._editor.setModel(monaco.editor.getModels() [1]);

    }
    private getBreakpointDecoration(line: number): monaco.editor.IModelDecoration {
        var decs = this._editor.getLineDecorations(line);
        for (var x = 0; x < decs.length; x++) {
            if (decs[x].options.glyphMarginClassName === "jbreackpoint")
                return decs[x];
        }
        return undefined;
    }
    private _mouseDown(e) {
        if (e.target.type === 2) {
            var line = e.target.position.lineNumber;
            var column = this._editor.getModel().getLineContent(line - 1).length;
            var type = "debugpoint";
            var dec = this.getBreakpointDecoration(line);
            if (dec) {
                this._editor.deltaDecorations([dec.id], []);
                this.callEvent("breakpointChanged", line - 1, column, false, type);
            } else {
                this.callEvent("breakpointChanged", line - 1, column, true, type);
                var decorations = this._editor.deltaDecorations([], [
                    {
                        range: new monaco.Range(line, 1, line, 1),
                        options: {
                            isWholeLine: true,
                            className: 'jbreackpointclass',
                            glyphMarginClassName: 'jbreackpoint'
                        }
                    }
                ]);
            }
        }
    }

    /**
     * gets a list of all lines with breakpoint
     * @returns {Object.<number, boolean>}
     */
    getBreakpoints(): { [line: number]: boolean } {
        var ret = {};
        var decs = this._editor.getModel().getLineCount();
        for (var x = 1; x <= this._editor.getModel().getLineCount(); x++) {
            if (this.getBreakpointDecoration(x)) {
                ret[x - 1] = true;
            }
        }
        return ret;
    }
    /**
     * breakpoint changed
     * @param {function} handler - function(line,enabled,type)
     */
    onBreakpointChanged(handler) {
        this.addEvent("breakpointChanged", handler);
    }
    /**
     * component get focus
     * @param {function} handler
     */
    onfocus(handler) {
        //   this._editor.on("focus", handler);
    }
    /**
     * component lost focus
     * @param {function} handler
     */
    onblur(handler) {
        // this._editor.on("blur", handler);
    }
    /**
     * @param - the codetext
     */
    set value(value: string) { //the Code
        var lastcursor = this.cursorPosition;
        var _this = this;
        if (this.file) {
            var ffile = monaco.Uri.from({ path: "/" + this.file, scheme: 'file' });
            var mod = monaco.editor.getModel(ffile);
            if (!mod) {
                mod = monaco.editor.createModel(value, "typescript", ffile);
                this._editor.setModel(mod);
                this._editor.setValue(value);
            } else if (mod !== this._editor.getModel()) {
                delete this._editor.getModel()["lastEditor"];
                this._editor.setModel(mod);
                this._editor.setValue(value);
            } else {
                const fullRange = this._editor.getModel().getFullModelRange();

                // Apply the text over the range
                this._editor.executeEdits(null, [{
                    text: value,
                    range: fullRange
                    
                }]);
                
                /* alternative
                this._editor.getModel().pushEditOperations([], [{
                    range: this._editor.getModel().getFullModelRange(),// monaco.Range.fromPositions({ column: data.pos.column, lineNumber: data.pos.row }),
                    text: value
                }], (a) => {
                    return null
                });*/
                this._editor.pushUndoStop();
            }
            if (this._editor.getModel()) {
                this._editor.getModel()["lastEditor"] = _this._editor;

            }
        } else

            this._editor.setValue(value);
    }

    get value(): string {
        return this._editor.getValue();
    }
    /**
     * @param {object} position - the current cursor position {row= ,column=}
     */
    set cursorPosition(cursor: { row: number, column: number }) {
        this._editor.focus();
        try {
            this._editor.revealLine(cursor.row);
            //this._editor.setPosition({ column: cursor.column, lineNumber: cursor.row });
        } catch {

        }
    }
    get cursorPosition(): { row: number, column: number } {
        var pos = this._editor.getPosition();
        return {
            row: pos.lineNumber,
            column: pos.column
        }
    }

    destroy() {
        //this._editor.destroy();
        super.destroy();
        delete this._editor.getModel()["lastEditor"];
    }

    /**
    * undo action
    */
    undo() {
        //@ts-ignore
        this._editor.getModel().undo();
    }
    /**
     * resize the editor
     * */
    resize() {
        //
        //   this._editor.resize();
    }
    /**
   * @member {string} - the language of the editor e.g. "ace/mode/javascript"
   */
    set mode(mode) {
        //  alert(mode);
        this._mode = mode;
        //  this._editor.getSession().setMode("ace/mode/" + mode);
    }
    get mode() {
        return this._mode;
    }
    async loadsample() {

        this.file = "a/Dialog.ts";
        this.value = "var a=window.document;";
    }
}

export async function test() {
    //await Settings.save(Settings.keys.Development_MoanacoEditorTheme, "vs-dark", "user")
    var dlg = new MonacoPanel();
    //  var code = await new Server().loadFile("a/Dialog.ts");
    await dlg.loadsample();
    setTimeout(() => {
        dlg.width = "800";
        dlg.height = "100";

    }, 200);
    //@ts-ignore
    //   dlg._editor.layout();

    //    dlg.value = "var h;\r\nvar k;\r\nvar k;\r\nvar k;\r\nconsole.debug('ddd');";
    //  dlg.mode = "javascript";
    //dlg._editor.renderer.setShowGutter(false);		
    //dlg._editor.getSession().addGutterDecoration(1,"error_line");
    //  dlg._editor.getSession().setBreakpoint(1);
    // dlg._editor.getSession().setBreakpoint(2);

    return dlg;
}

