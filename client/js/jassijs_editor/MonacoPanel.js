var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/base/Router", "jassijs_editor/util/Typescript", "jassijs_editor/CodePanel", "jassijs/remote/Settings", "jassijs_editor/Debugger", "jassijs_editor/ext/monaco"], function (require, exports, Jassi_1, Router_1, Typescript_1, CodePanel_1, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MonacoPanel = void 0;
    var inited = false;
    function __init(editor) {
        if (inited)
            return;
        //auto import 
        const cs = editor._commandService;
        var CommandsRegistry = require("vs/platform/commands/common/commands").CommandsRegistry;
        CommandsRegistry.registerCommand("autoimport", (o1, model, pos) => {
            var file = model.uri.path.substring(1);
            var code = model.getValue();
            var p = Typescript_1.default.getPositionOfLineAndCharacter(file, {
                line: pos.lineNumber, character: pos.column
            });
            const oldpos = model["lastEditor"].getPosition();
            setTimeout(() => {
                CodePanel_1.CodePanel.getAutoimport(p, file, code).then((data) => {
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
        });
        //implement go to definition
        const editorService = editor["_codeEditorService"];
        const openEditorBase = editorService.openCodeEditor.bind(editorService);
        editorService.openCodeEditor = async (input, source) => {
            const result = await openEditorBase(input, source);
            if (result === null) {
                var file = input.resource.path.substring(1);
                var line = input.options.selection.startLineNumber;
                Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
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
                var pos = Typescript_1.default.getPositionOfLineAndCharacter(file, { line: position.lineNumber, character: position.column });
                var all = await Typescript_1.default.getCompletion(file, pos, undefined, { includeExternalModuleExports: true });
                var sug = [];
                for (var x = 0; x < all.entries.length; x++) {
                    var it = all.entries[x];
                    if ((it.kindModifiers === "export" || it.kindModifiers === "") && it.hasAction === true) {
                        var item = {
                            label: it.name,
                            kind: it.kind,
                            documentation: "import from " + it.source,
                            insertText: it.name,
                            range: range,
                            command: {
                                arguments: [model, position],
                                id: "autoimport",
                                title: "autoimport"
                            }
                        };
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
    let MonacoPanel = class MonacoPanel extends CodePanel_1.CodePanel {
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
            let theme = Settings_1.Settings.gets(Settings_1.Settings.keys.Development_MoanacoEditorTheme);
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
        getBreakpointDecoration(line) {
            var decs = this._editor.getLineDecorations(line);
            for (var x = 0; x < decs.length; x++) {
                if (decs[x].options.glyphMarginClassName === "jbreackpoint")
                    return decs[x];
            }
            return undefined;
        }
        _mouseDown(e) {
            if (e.target.type === 2) {
                var line = e.target.position.lineNumber;
                var column = this._editor.getModel().getLineContent(line - 1).length;
                var type = "debugpoint";
                var dec = this.getBreakpointDecoration(line);
                if (dec) {
                    this._editor.deltaDecorations([dec.id], []);
                    this.callEvent("breakpointChanged", line - 1, column, false, type);
                }
                else {
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
        getBreakpoints() {
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
        set value(value) {
            var lastcursor = this.cursorPosition;
            var _this = this;
            if (this.file) {
                var ffile = monaco.Uri.from({ path: "/" + this.file, scheme: 'file' });
                var mod = monaco.editor.getModel(ffile);
                if (!mod) {
                    mod = monaco.editor.createModel(value, "typescript", ffile);
                    this._editor.setModel(mod);
                    this._editor.setValue(value);
                }
                else if (mod !== this._editor.getModel()) {
                    delete this._editor.getModel()["lastEditor"];
                    this._editor.setModel(mod);
                    this._editor.setValue(value);
                }
                else {
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
            }
            else
                this._editor.setValue(value);
        }
        get value() {
            return this._editor.getValue();
        }
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor) {
            this._editor.focus();
            try {
                this._editor.revealLine(cursor.row);
                //this._editor.setPosition({ column: cursor.column, lineNumber: cursor.row });
            }
            catch (_a) {
            }
        }
        get cursorPosition() {
            var pos = this._editor.getPosition();
            return {
                row: pos.lineNumber,
                column: pos.column
            };
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
    };
    MonacoPanel = __decorate([
        Jassi_1.$Class("jassijs_editor.MonacoPanel"),
        __metadata("design:paramtypes", [])
    ], MonacoPanel);
    exports.MonacoPanel = MonacoPanel;
    async function test() {
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
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uYWNvUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaWpzX2VkaXRvci9Nb25hY29QYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBWUEsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ25CLFNBQVMsTUFBTSxDQUFDLE1BQTJDO1FBQ3ZELElBQUksTUFBTTtZQUNOLE9BQU87UUFDWCxjQUFjO1FBQ2QsTUFBTSxFQUFFLEdBQUksTUFBYyxDQUFDLGVBQWUsQ0FBQTtRQUMxQyxJQUFJLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO1FBQ3hGLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBK0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUN4RixJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkMsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxHQUFHLG9CQUFVLENBQUMsNkJBQTZCLENBQUMsSUFBSSxFQUFFO2dCQUNuRCxJQUFJLEVBQUUsR0FBRyxDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU07YUFDOUMsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pELFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1oscUJBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFFakQsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO3dCQUVwQixLQUFLLENBQUMsa0JB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaSBmcm9tIFwiamFzc2lqcy9qYXNzaVwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IFwiamFzc2lqc19lZGl0b3IvRGVidWdnZXJcIjtcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IHJvdXRlciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvUm91dGVyXCI7XHJcbmltcG9ydCBcImphc3NpanNfZWRpdG9yL2V4dC9tb25hY29cIjtcclxuaW1wb3J0IHR5cGVzY3JpcHQgZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2VydmVyXCI7XHJcbmltcG9ydCB7IENvZGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db2RlUGFuZWxcIjtcclxuaW1wb3J0IHsgU2V0dGluZ3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2V0dGluZ3NcIjtcclxuXHJcblxyXG52YXIgaW5pdGVkID0gZmFsc2U7XHJcbmZ1bmN0aW9uIF9faW5pdChlZGl0b3I6IG1vbmFjby5lZGl0b3IuSVN0YW5kYWxvbmVDb2RlRWRpdG9yKSB7XHJcbiAgICBpZiAoaW5pdGVkKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIC8vYXV0byBpbXBvcnQgXHJcbiAgICBjb25zdCBjcyA9IChlZGl0b3IgYXMgYW55KS5fY29tbWFuZFNlcnZpY2VcclxuICAgIHZhciBDb21tYW5kc1JlZ2lzdHJ5ID0gcmVxdWlyZShcInZzL3BsYXRmb3JtL2NvbW1hbmRzL2NvbW1vbi9jb21tYW5kc1wiKS5Db21tYW5kc1JlZ2lzdHJ5O1xyXG4gICAgQ29tbWFuZHNSZWdpc3RyeS5yZWdpc3RlckNvbW1hbmQoXCJhdXRvaW1wb3J0XCIsIChvMSwgbW9kZWw6IG1vbmFjby5lZGl0b3IuSVRleHRNb2RlbCwgcG9zKSA9PiB7XHJcbiAgICAgICAgdmFyIGZpbGUgPSBtb2RlbC51cmkucGF0aC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgdmFyIGNvZGUgPSBtb2RlbC5nZXRWYWx1ZSgpO1xyXG4gICAgICAgIHZhciBwID0gdHlwZXNjcmlwdC5nZXRQb3NpdGlvbk9mTGluZUFuZENoYXJhY3RlcihmaWxlLCB7XHJcbiAgICAgICAgICAgIGxpbmU6IHBvcy5saW5lTnVtYmVyLCBjaGFyYWN0ZXI6IHBvcy5jb2x1bW5cclxuICAgICAgICB9KTtcclxuICAgICAgICBjb25zdCBvbGRwb3MgPSBtb2RlbFtcImxhc3RFZGl0b3JcIl0uZ2V0UG9zaXRpb24oKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgQ29kZVBhbmVsLmdldEF1dG9pbXBvcnQocCwgZmlsZSwgY29kZSkudGhlbigoZGF0YSkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwucHVzaEVkaXRPcGVyYXRpb25zKFtdLCBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogbW9uYWNvLlJhbmdlLmZyb21Qb3NpdGlvbnMoeyBjb2x1bW46IGRhdGEucG9zLmNvbHVtbiwgbGluZU51bWJlcjogZGF0YS5wb3Mucm93ICsgMSB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogZGF0YS50ZXh0XHJcbiAgICAgICAgICAgICAgICAgICAgfV0sIChhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIG9sZHBvcy5saW5lTnVtYmVyID0gb2xkcG9zLmxpbmVOdW1iZXIgKyAoZGF0YS50ZXh0LmluZGV4T2YoXCJcXHJcIikgPyAxIDogMCk7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWxbXCJsYXN0RWRpdG9yXCJdLnNldFBvc2l0aW9uKG9sZHBvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfSlcclxuICAgIC8vaW1wbGVtZW50IGdvIHRvIGRlZmluaXRpb25cclxuICAgIGNvbnN0IGVkaXRvclNlcnZpY2UgPSBlZGl0b3JbXCJfY29kZUVkaXRvclNlcnZpY2VcIl07XHJcbiAgICBjb25zdCBvcGVuRWRpdG9yQmFzZSA9IGVkaXRvclNlcnZpY2Uub3BlbkNvZGVFZGl0b3IuYmluZChlZGl0b3JTZXJ2aWNlKTtcclxuICAgIGVkaXRvclNlcnZpY2Uub3BlbkNvZGVFZGl0b3IgPSBhc3luYyAoaW5wdXQsIHNvdXJjZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG9wZW5FZGl0b3JCYXNlKGlucHV0LCBzb3VyY2UpO1xyXG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBpbnB1dC5yZXNvdXJjZS5wYXRoLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgdmFyIGxpbmUgPSBpbnB1dC5vcHRpb25zLnNlbGVjdGlvbi5zdGFydExpbmVOdW1iZXI7XHJcblxyXG4gICAgICAgICAgICByb3V0ZXIubmF2aWdhdGUoXCIjZG89amFzc2lqc19lZGl0b3IuQ29kZUVkaXRvciZmaWxlPVwiICsgZmlsZSArIFwiJmxpbmU9XCIgKyBsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDsgLy8gYWx3YXlzIHJldHVybiB0aGUgYmFzZSByZXN1bHRcclxuICAgIH07XHJcbiAgICAvL2NvbXBsZXRpb24gZm9yIGF1dG9uaW1wb3J0XHJcbiAgICBtb25hY28ubGFuZ3VhZ2VzLnJlZ2lzdGVyQ29tcGxldGlvbkl0ZW1Qcm92aWRlcigndHlwZXNjcmlwdCcsIHtcclxuICAgICAgICBwcm92aWRlQ29tcGxldGlvbkl0ZW1zOiBhc3luYyBmdW5jdGlvbiAobW9kZWwsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0VW50aWxQb3NpdGlvbiA9IG1vZGVsLmdldFZhbHVlSW5SYW5nZSh7IHN0YXJ0TGluZU51bWJlcjogMSwgc3RhcnRDb2x1bW46IDEsIGVuZExpbmVOdW1iZXI6IHBvc2l0aW9uLmxpbmVOdW1iZXIsIGVuZENvbHVtbjogcG9zaXRpb24uY29sdW1uIH0pO1xyXG4gICAgICAgICAgICB2YXIgd29yZCA9IG1vZGVsLmdldFdvcmRVbnRpbFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHJhbmdlID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRMaW5lTnVtYmVyOiBwb3NpdGlvbi5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgZW5kTGluZU51bWJlcjogcG9zaXRpb24ubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uOiB3b3JkLnN0YXJ0Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgZW5kQ29sdW1uOiB3b3JkLmVuZENvbHVtblxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IG1vZGVsLnVyaS5wYXRoLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IHR5cGVzY3JpcHQuZ2V0UG9zaXRpb25PZkxpbmVBbmRDaGFyYWN0ZXIoZmlsZSwgeyBsaW5lOiBwb3NpdGlvbi5saW5lTnVtYmVyLCBjaGFyYWN0ZXI6IHBvc2l0aW9uLmNvbHVtbiB9KTtcclxuICAgICAgICAgICAgdmFyIGFsbCA9IGF3YWl0IHR5cGVzY3JpcHQuZ2V0Q29tcGxldGlvbihmaWxlLCBwb3MsIHVuZGVmaW5lZCwgeyBpbmNsdWRlRXh0ZXJuYWxNb2R1bGVFeHBvcnRzOiB0cnVlIH0pO1xyXG4gICAgICAgICAgICB2YXIgc3VnID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgYWxsLmVudHJpZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdCA9IGFsbC5lbnRyaWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgaWYgKChpdC5raW5kTW9kaWZpZXJzID09PSBcImV4cG9ydFwiIHx8IGl0LmtpbmRNb2RpZmllcnMgPT09IFwiXCIpICYmIGl0Lmhhc0FjdGlvbiA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtOiBtb25hY28ubGFuZ3VhZ2VzLkNvbXBsZXRpb25JdGVtID0ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDogaXQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAga2luZDogPG1vbmFjby5sYW5ndWFnZXMuQ29tcGxldGlvbkl0ZW1LaW5kPml0LmtpbmQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50YXRpb246IFwiaW1wb3J0IGZyb20gXCIgKyBpdC5zb3VyY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluc2VydFRleHQ6IGl0Lm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiByYW5nZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWFuZDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzOiBbbW9kZWwsIHBvc2l0aW9uXSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBcImF1dG9pbXBvcnRcIixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcImF1dG9pbXBvcnRcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHN1Zy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdWdnZXN0aW9uczogc3VnXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpbml0ZWQgPSB0cnVlO1xyXG59XHJcblxyXG4vKipcclxuKiB3cmFwcGVyIGZvciB0aGUgQWNlLUNvZGUgZWRpdG9yIHdpdGggVHlwZXNjcmlwdC1Db2RlLUNvbXBsZXRpb24gYW4gb3RoZXIgZmVhdHVyZXNcclxuKiBAY2xhc3MgamFzc2lqcy51aS5Db2RlUGFuZWxcclxuKi9cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLk1vbmFjb1BhbmVsXCIpXHJcbmV4cG9ydCBjbGFzcyBNb25hY29QYW5lbCBleHRlbmRzIENvZGVQYW5lbCB7XHJcbiAgICBwcml2YXRlIF9tb2RlOiBzdHJpbmc7XHJcbiAgICBwcml2YXRlIF9lZGl0b3I6IG1vbmFjby5lZGl0b3IuSVN0YW5kYWxvbmVDb2RlRWRpdG9yO1xyXG4gICAgcHJpdmF0ZSBfaXNJbml0ZWQ6IGJvb2xlYW47XHJcbiAgICAvLyAgIHByaXZhdGUgX2xhc3RDdXJzb3JQb3NpdGlvbjtcclxuICAgIGZpbGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgc3RhdGljIF90b29sdGlwZGl2O1xyXG4gICAgcHJpdmF0ZSBfbGFzdFRvb2x0aXBSZWZyZXNoO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIC8vIHN1cGVyLmluaXQoJCgnPGRpdiBzdHlsZT1cIndpZHRoOiA4MDBweDsgaGVpZ2h0OiA2MDBweDsgYm9yZGVyOiAxcHggc29saWQgZ3JleVwiPjwvZGl2PicpWzBdKTtcclxuICAgICAgICB2YXIgdGVzdCA9ICQoJzxkaXYgY2xhc3M9XCJNb25hY29QYW5lbFwiIHN0eWxlPVwiaGVpZ2h0OiAxMDBweDsgd2lkdGg6IDEwMHB4XCI+PC9kaXY+JylbMF07XHJcblxyXG4gICAgICAgIHN1cGVyLmluaXQodGVzdCk7XHJcblxyXG4gICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5jc3MoXCJvdmVyZmxvd1wiLCBcImhpZGRlblwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tV3JhcHBlcikuY3NzKFwiZGlzcGxheVwiLCBcIlwiKTtcclxuXHJcbiAgICAgICAgLyogX3RoaXMuX2VkaXRvci5vbihcImd1dHRlcm1vdXNlZG93blwiLCBmdW5jdGlvbihlKSB7XHJcbiBcclxuICAgICAgICAgICAgIHZhciByb3cgPSBlLmdldERvY3VtZW50UG9zaXRpb24oKS5yb3c7XHJcbiAgICAgICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBlLmVkaXRvci5zZXNzaW9uLmdldEJyZWFrcG9pbnRzKHJvdywgMCk7XHJcbiAgICAgICAgICAgICB2YXIgdHlwZSA9IFwiZGVidWdwb2ludFwiO1xyXG4gICAgICAgICAgICAgaWYgKGUuZG9tRXZlbnQuY3RybEtleSlcclxuICAgICAgICAgICAgICAgICB0eXBlID0gXCJjaGVja3BvaW50XCI7XHJcbiAgICAgICAgICAgICB2YXIgY29sdW1uID0gX3RoaXMuX2VkaXRvci5zZXNzaW9uLmdldExpbmUocm93KS5sZW5ndGg7XHJcbiAgICAgICAgICAgICBpZiAodHlwZW9mIGJyZWFrcG9pbnRzW3Jvd10gPT09IHR5cGVvZiB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICBlLmVkaXRvci5zZXNzaW9uLnNldEJyZWFrcG9pbnQocm93KTtcclxuICAgICAgICAgICAgICAgICBfdGhpcy5jYWxsRXZlbnQoXCJicmVha3BvaW50Q2hhbmdlZFwiLCByb3csIGNvbHVtbiwgdHJ1ZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgIGUuZWRpdG9yLnNlc3Npb24uY2xlYXJCcmVha3BvaW50KHJvdywgZmFsc2UsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgICAgICAgICAgX3RoaXMuY2FsbEV2ZW50KFwiYnJlYWtwb2ludENoYW5nZWRcIiwgcm93LCBjb2x1bW4sIGZhbHNlLCB0eXBlKTtcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfSk7Ki9cclxuICAgICAgICBsZXQgdGhlbWUgPSBTZXR0aW5ncy5nZXRzKFNldHRpbmdzLmtleXMuRGV2ZWxvcG1lbnRfTW9hbmFjb0VkaXRvclRoZW1lKTtcclxuICAgICAgICB0aGlzLl9lZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZSh0aGlzLmRvbSwge1xyXG4gICAgICAgICAgICAvL3ZhbHVlOiAgbW9uYWNvLmVkaXRvci5nZXRNb2RlbHMoKVswXSwgLy9bJ2NsYXNzIEF7YjpCO307XFxuY2xhc3MgQnthOkE7fTtcXG5mdW5jdGlvbiB4KCkgeycsICdcXHRjb25zb2xlLmxvZyhcIkhlbGxvIHdvcmxkIVwiKTsnLCAnfSddLmpvaW4oJ1xcbicpLFxyXG4gICAgICAgICAgICBsYW5ndWFnZTogJ3R5cGVzY3JpcHQnLFxyXG4gICAgICAgICAgICB0aGVtZTogKHRoZW1lID8gdGhlbWUgOiBcInZzLWxpZ2h0XCIpLFxyXG4gICAgICAgICAgICBnbHlwaE1hcmdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICBhdXRvbWF0aWNMYXlvdXQ6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgX19pbml0KHRoaXMuX2VkaXRvcik7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9yLm9uTW91c2VEb3duKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9tb3VzZURvd24oZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy90aGlzLl9lZGl0b3Iuc2V0TW9kZWwobW9uYWNvLmVkaXRvci5nZXRNb2RlbHMoKSBbMV0pO1xyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0QnJlYWtwb2ludERlY29yYXRpb24obGluZTogbnVtYmVyKTogbW9uYWNvLmVkaXRvci5JTW9kZWxEZWNvcmF0aW9uIHtcclxuICAgICAgICB2YXIgZGVjcyA9IHRoaXMuX2VkaXRvci5nZXRMaW5lRGVjb3JhdGlvbnMobGluZSk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBkZWNzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChkZWNzW3hdLm9wdGlvbnMuZ2x5cGhNYXJnaW5DbGFzc05hbWUgPT09IFwiamJyZWFja3BvaW50XCIpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVjc1t4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX21vdXNlRG93bihlKSB7XHJcbiAgICAgICAgaWYgKGUudGFyZ2V0LnR5cGUgPT09IDIpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmUgPSBlLnRhcmdldC5wb3NpdGlvbi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvbnRlbnQobGluZSAtIDEpLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIHR5cGUgPSBcImRlYnVncG9pbnRcIjtcclxuICAgICAgICAgICAgdmFyIGRlYyA9IHRoaXMuZ2V0QnJlYWtwb2ludERlY29yYXRpb24obGluZSk7XHJcbiAgICAgICAgICAgIGlmIChkZWMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5kZWx0YURlY29yYXRpb25zKFtkZWMuaWRdLCBbXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImJyZWFrcG9pbnRDaGFuZ2VkXCIsIGxpbmUgLSAxLCBjb2x1bW4sIGZhbHNlLCB0eXBlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiYnJlYWtwb2ludENoYW5nZWRcIiwgbGluZSAtIDEsIGNvbHVtbiwgdHJ1ZSwgdHlwZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGVjb3JhdGlvbnMgPSB0aGlzLl9lZGl0b3IuZGVsdGFEZWNvcmF0aW9ucyhbXSwgW1xyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IG5ldyBtb25hY28uUmFuZ2UobGluZSwgMSwgbGluZSwgMSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzV2hvbGVMaW5lOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lOiAnamJyZWFja3BvaW50Y2xhc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ2x5cGhNYXJnaW5DbGFzc05hbWU6ICdqYnJlYWNrcG9pbnQnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdldHMgYSBsaXN0IG9mIGFsbCBsaW5lcyB3aXRoIGJyZWFrcG9pbnRcclxuICAgICAqIEByZXR1cm5zIHtPYmplY3QuPG51bWJlciwgYm9vbGVhbj59XHJcbiAgICAgKi9cclxuICAgIGdldEJyZWFrcG9pbnRzKCk6IHsgW2xpbmU6IG51bWJlcl06IGJvb2xlYW4gfSB7XHJcbiAgICAgICAgdmFyIHJldCA9IHt9O1xyXG4gICAgICAgIHZhciBkZWNzID0gdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvdW50KCk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPD0gdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvdW50KCk7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRCcmVha3BvaW50RGVjb3JhdGlvbih4KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0W3ggLSAxXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJldDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYnJlYWtwb2ludCBjaGFuZ2VkXHJcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIC0gZnVuY3Rpb24obGluZSxlbmFibGVkLHR5cGUpXHJcbiAgICAgKi9cclxuICAgIG9uQnJlYWtwb2ludENoYW5nZWQoaGFuZGxlcikge1xyXG4gICAgICAgIHRoaXMuYWRkRXZlbnQoXCJicmVha3BvaW50Q2hhbmdlZFwiLCBoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY29tcG9uZW50IGdldCBmb2N1c1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvbmZvY3VzKGhhbmRsZXIpIHtcclxuICAgICAgICAvLyAgIHRoaXMuX2VkaXRvci5vbihcImZvY3VzXCIsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBjb21wb25lbnQgbG9zdCBmb2N1c1xyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlclxyXG4gICAgICovXHJcbiAgICBvbmJsdXIoaGFuZGxlcikge1xyXG4gICAgICAgIC8vIHRoaXMuX2VkaXRvci5vbihcImJsdXJcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIEBwYXJhbSAtIHRoZSBjb2RldGV4dFxyXG4gICAgICovXHJcbiAgICBzZXQgdmFsdWUodmFsdWU6IHN0cmluZykgeyAvL3RoZSBDb2RlXHJcbiAgICAgICAgdmFyIGxhc3RjdXJzb3IgPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgaWYgKHRoaXMuZmlsZSkge1xyXG4gICAgICAgICAgICB2YXIgZmZpbGUgPSBtb25hY28uVXJpLmZyb20oeyBwYXRoOiBcIi9cIiArIHRoaXMuZmlsZSwgc2NoZW1lOiAnZmlsZScgfSk7XHJcbiAgICAgICAgICAgIHZhciBtb2QgPSBtb25hY28uZWRpdG9yLmdldE1vZGVsKGZmaWxlKTtcclxuICAgICAgICAgICAgaWYgKCFtb2QpIHtcclxuICAgICAgICAgICAgICAgIG1vZCA9IG1vbmFjby5lZGl0b3IuY3JlYXRlTW9kZWwodmFsdWUsIFwidHlwZXNjcmlwdFwiLCBmZmlsZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0b3Iuc2V0TW9kZWwobW9kKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kICE9PSB0aGlzLl9lZGl0b3IuZ2V0TW9kZWwoKSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpW1wibGFzdEVkaXRvclwiXTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRNb2RlbChtb2QpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZ1bGxSYW5nZSA9IHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpLmdldEZ1bGxNb2RlbFJhbmdlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQXBwbHkgdGhlIHRleHQgb3ZlciB0aGUgcmFuZ2VcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5leGVjdXRlRWRpdHMobnVsbCwgW3tcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB2YWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICByYW5nZTogZnVsbFJhbmdlXHJcbiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICB9XSk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8qIGFsdGVybmF0aXZlXHJcbiAgICAgICAgICAgICAgICB0aGlzLl9lZGl0b3IuZ2V0TW9kZWwoKS5wdXNoRWRpdE9wZXJhdGlvbnMoW10sIFt7XHJcbiAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpLmdldEZ1bGxNb2RlbFJhbmdlKCksLy8gbW9uYWNvLlJhbmdlLmZyb21Qb3NpdGlvbnMoeyBjb2x1bW46IGRhdGEucG9zLmNvbHVtbiwgbGluZU51bWJlcjogZGF0YS5wb3Mucm93IH0pLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB9XSwgKGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgICAgICAgICAgICAgfSk7Ki9cclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5wdXNoVW5kb1N0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5fZWRpdG9yLmdldE1vZGVsKCkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpW1wibGFzdEVkaXRvclwiXSA9IF90aGlzLl9lZGl0b3I7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlXHJcblxyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldCB2YWx1ZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9lZGl0b3IuZ2V0VmFsdWUoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uIHtyb3c9ICxjb2x1bW49fVxyXG4gICAgICovXHJcbiAgICBzZXQgY3Vyc29yUG9zaXRpb24oY3Vyc29yOiB7IHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciB9KSB7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9yLmZvY3VzKCk7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgdGhpcy5fZWRpdG9yLnJldmVhbExpbmUoY3Vyc29yLnJvdyk7XHJcbiAgICAgICAgICAgIC8vdGhpcy5fZWRpdG9yLnNldFBvc2l0aW9uKHsgY29sdW1uOiBjdXJzb3IuY29sdW1uLCBsaW5lTnVtYmVyOiBjdXJzb3Iucm93IH0pO1xyXG4gICAgICAgIH0gY2F0Y2gge1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBnZXQgY3Vyc29yUG9zaXRpb24oKTogeyByb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSB7XHJcbiAgICAgICAgdmFyIHBvcyA9IHRoaXMuX2VkaXRvci5nZXRQb3NpdGlvbigpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJvdzogcG9zLmxpbmVOdW1iZXIsXHJcbiAgICAgICAgICAgIGNvbHVtbjogcG9zLmNvbHVtblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIC8vdGhpcy5fZWRpdG9yLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpW1wibGFzdEVkaXRvclwiXTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogdW5kbyBhY3Rpb25cclxuICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpLnVuZG8oKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVzaXplIHRoZSBlZGl0b3JcclxuICAgICAqICovXHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgIHRoaXMuX2VkaXRvci5yZXNpemUoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIGVkaXRvciBlLmcuIFwiYWNlL21vZGUvamF2YXNjcmlwdFwiXHJcbiAgICovXHJcbiAgICBzZXQgbW9kZShtb2RlKSB7XHJcbiAgICAgICAgLy8gIGFsZXJ0KG1vZGUpO1xyXG4gICAgICAgIHRoaXMuX21vZGUgPSBtb2RlO1xyXG4gICAgICAgIC8vICB0aGlzLl9lZGl0b3IuZ2V0U2Vzc2lvbigpLnNldE1vZGUoXCJhY2UvbW9kZS9cIiArIG1vZGUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IG1vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGU7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2Fkc2FtcGxlKCkge1xyXG5cclxuICAgICAgICB0aGlzLmZpbGUgPSBcImEvRGlhbG9nLnRzXCI7XHJcbiAgICAgICAgdGhpcy52YWx1ZSA9IFwidmFyIGE9d2luZG93LmRvY3VtZW50O1wiO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIC8vYXdhaXQgU2V0dGluZ3Muc2F2ZShTZXR0aW5ncy5rZXlzLkRldmVsb3BtZW50X01vYW5hY29FZGl0b3JUaGVtZSwgXCJ2cy1kYXJrXCIsIFwidXNlclwiKVxyXG4gICAgdmFyIGRsZyA9IG5ldyBNb25hY29QYW5lbCgpO1xyXG4gICAgLy8gIHZhciBjb2RlID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKFwiYS9EaWFsb2cudHNcIik7XHJcbiAgICBhd2FpdCBkbGcubG9hZHNhbXBsZSgpO1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZGxnLndpZHRoID0gXCI4MDBcIjtcclxuICAgICAgICBkbGcuaGVpZ2h0ID0gXCIxMDBcIjtcclxuXHJcbiAgICB9LCAyMDApO1xyXG4gICAgLy9AdHMtaWdub3JlXHJcbiAgICAvLyAgIGRsZy5fZWRpdG9yLmxheW91dCgpO1xyXG5cclxuICAgIC8vICAgIGRsZy52YWx1ZSA9IFwidmFyIGg7XFxyXFxudmFyIGs7XFxyXFxudmFyIGs7XFxyXFxudmFyIGs7XFxyXFxuY29uc29sZS5kZWJ1ZygnZGRkJyk7XCI7XHJcbiAgICAvLyAgZGxnLm1vZGUgPSBcImphdmFzY3JpcHRcIjtcclxuICAgIC8vZGxnLl9lZGl0b3IucmVuZGVyZXIuc2V0U2hvd0d1dHRlcihmYWxzZSk7XHRcdFxyXG4gICAgLy9kbGcuX2VkaXRvci5nZXRTZXNzaW9uKCkuYWRkR3V0dGVyRGVjb3JhdGlvbigxLFwiZXJyb3JfbGluZVwiKTtcclxuICAgIC8vICBkbGcuX2VkaXRvci5nZXRTZXNzaW9uKCkuc2V0QnJlYWtwb2ludCgxKTtcclxuICAgIC8vIGRsZy5fZWRpdG9yLmdldFNlc3Npb24oKS5zZXRCcmVha3BvaW50KDIpO1xyXG5cclxuICAgIHJldHVybiBkbGc7XHJcbn1cclxuXHJcbiJdfQ==