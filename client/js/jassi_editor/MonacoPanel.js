var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/base/Router", "jassi_editor/util/Typescript", "jassi/remote/Server", "jassi_editor/CodePanel", "jassi_editor/Debugger", "jassi_editor/ext/monaco"], function (require, exports, Jassi_1, Router_1, Typescript_1, Server_1, CodePanel_1) {
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
            setTimeout(() => {
                CodePanel_1.CodePanel.getAutoimport(p, file, code).then((data) => {
                    if (data !== undefined) {
                        model.pushEditOperations([], [{
                                range: monaco.Range.fromPositions({ column: data.pos.column, lineNumber: data.pos.row + 1 }),
                                text: data.text
                            }], () => null);
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
                Router_1.router.navigate("#do=jassi_editor.CodeEditor&file=" + file + "&line=" + line);
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
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassi.ui.CodePanel
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
            this._editor = monaco.editor.create(this.dom, {
                //value:  monaco.editor.getModels()[0], //['class A{b:B;};\nclass B{a:A;};\nfunction x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'typescript',
                theme: "vs-light",
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
            if (this.file) {
                var ffile = monaco.Uri.from({ path: "/" + this.file, scheme: 'file' });
                var mod = monaco.editor.getModel(ffile);
                if (!mod) {
                    mod = monaco.editor.createModel(value, "typescript", ffile);
                    this._editor.setModel(mod);
                    this._editor.setValue(value);
                }
                else if (mod !== this._editor.getModel()) {
                    this._editor.setModel(mod);
                    this._editor.setValue(value);
                }
                else {
                    this._editor.getModel().pushEditOperations([], [{
                            range: this._editor.getModel().getFullModelRange(),
                            text: value
                        }], () => null);
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
            var code = await new Server_1.Server().loadFile("a/Dialog.ts");
            this.file = "a/Dialog.ts";
            this.value = code;
        }
    };
    MonacoPanel = __decorate([
        Jassi_1.$Class("jassi_editor.MonacoPanel"),
        __metadata("design:paramtypes", [])
    ], MonacoPanel);
    exports.MonacoPanel = MonacoPanel;
    async function test() {
        var dlg = new MonacoPanel();
        var code = await new Server_1.Server().loadFile("a/Dialog.ts");
        dlg.file = "a/Dialog.ts";
        dlg.value = code;
        dlg.width = "800";
        dlg.height = "800";
        //@ts-ignore
        dlg._editor.layout();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTW9uYWNvUGFuZWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9qYXNzaV9lZGl0b3IvTW9uYWNvUGFuZWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVdBLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNuQixTQUFTLE1BQU0sQ0FBQyxNQUEyQztRQUN2RCxJQUFJLE1BQU07WUFDTixPQUFPO1FBQ1gsY0FBYztRQUNkLE1BQU0sRUFBRSxHQUFJLE1BQWMsQ0FBQyxlQUFlLENBQUE7UUFDMUMsSUFBSSxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsc0NBQXNDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztRQUN4RixnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQStCLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDeEYsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLElBQUksSUFBSSxHQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxvQkFBVSxDQUFDLDZCQUE2QixDQUFDLElBQUksRUFBRTtnQkFDbkQsSUFBSSxFQUFFLEdBQUcsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNO2FBQzlDLENBQUMsQ0FBQztZQUNILFVBQVUsQ0FBQyxHQUFHLEVBQUU7Z0JBQ1oscUJBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtvQkFDakQsSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO3dCQUNwQixLQUFLLENBQUMsa0JBQWtCLENBQUMsRUFBRSxFQUFFLENBQUM7Z0NBQzFCLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLGFB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SSxDQUFDO1FBQ2pCLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLFlBQVk7UUFDWixHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRXJCLGtGQUFrRjtRQUNsRiw0QkFBNEI7UUFDNUIsOENBQThDO1FBQzlDLCtEQUErRDtRQUMvRCw4Q0FBOEM7UUFDOUMsNkNBQTZDO1FBRTdDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQW5CRCxvQkFtQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2kgZnJvbSBcImphc3NpL2phc3NpXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJqYXNzaS91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IFwiamFzc2lfZWRpdG9yL0RlYnVnZ2VyXCI7XHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcImphc3NpL2Jhc2UvUm91dGVyXCI7XHJcbmltcG9ydCBcImphc3NpX2VkaXRvci9leHQvbW9uYWNvXCI7XHJcbmltcG9ydCB0eXBlc2NyaXB0IGZyb20gXCJqYXNzaV9lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCI7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCJqYXNzaS9yZW1vdGUvU2VydmVyXCI7XHJcbmltcG9ydCB7IENvZGVQYW5lbCB9IGZyb20gXCJqYXNzaV9lZGl0b3IvQ29kZVBhbmVsXCI7XHJcblxyXG5cclxudmFyIGluaXRlZCA9IGZhbHNlO1xyXG5mdW5jdGlvbiBfX2luaXQoZWRpdG9yOiBtb25hY28uZWRpdG9yLklTdGFuZGFsb25lQ29kZUVkaXRvcikge1xyXG4gICAgaWYgKGluaXRlZClcclxuICAgICAgICByZXR1cm47XHJcbiAgICAvL2F1dG8gaW1wb3J0IFxyXG4gICAgY29uc3QgY3MgPSAoZWRpdG9yIGFzIGFueSkuX2NvbW1hbmRTZXJ2aWNlXHJcbiAgICB2YXIgQ29tbWFuZHNSZWdpc3RyeSA9IHJlcXVpcmUoXCJ2cy9wbGF0Zm9ybS9jb21tYW5kcy9jb21tb24vY29tbWFuZHNcIikuQ29tbWFuZHNSZWdpc3RyeTtcclxuICAgIENvbW1hbmRzUmVnaXN0cnkucmVnaXN0ZXJDb21tYW5kKFwiYXV0b2ltcG9ydFwiLCAobzEsIG1vZGVsOiBtb25hY28uZWRpdG9yLklUZXh0TW9kZWwsIHBvcykgPT4ge1xyXG4gICAgICAgIHZhciBmaWxlID0gbW9kZWwudXJpLnBhdGguc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgIHZhciBjb2RlPW1vZGVsLmdldFZhbHVlKCk7XHJcbiAgICAgICAgdmFyIHAgPSB0eXBlc2NyaXB0LmdldFBvc2l0aW9uT2ZMaW5lQW5kQ2hhcmFjdGVyKGZpbGUsIHtcclxuICAgICAgICAgICAgbGluZTogcG9zLmxpbmVOdW1iZXIsIGNoYXJhY3RlcjogcG9zLmNvbHVtblxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICBDb2RlUGFuZWwuZ2V0QXV0b2ltcG9ydChwLCBmaWxlLCBjb2RlKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbW9kZWwucHVzaEVkaXRPcGVyYXRpb25zKFtdLCBbe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogbW9uYWNvLlJhbmdlLmZyb21Qb3NpdGlvbnMoeyBjb2x1bW46IGRhdGEucG9zLmNvbHVtbiwgbGluZU51bWJlcjogZGF0YS5wb3Mucm93KzEgfSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGRhdGEudGV4dFxyXG4gICAgICAgICAgICAgICAgICAgIH1dLCAoKSA9PiBudWxsKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9KVxyXG4gICAgLy9pbXBsZW1lbnQgZ28gdG8gZGVmaW5pdGlvblxyXG4gICAgY29uc3QgZWRpdG9yU2VydmljZSA9IGVkaXRvcltcIl9jb2RlRWRpdG9yU2VydmljZVwiXTtcclxuICAgIGNvbnN0IG9wZW5FZGl0b3JCYXNlID0gZWRpdG9yU2VydmljZS5vcGVuQ29kZUVkaXRvci5iaW5kKGVkaXRvclNlcnZpY2UpO1xyXG4gICAgZWRpdG9yU2VydmljZS5vcGVuQ29kZUVkaXRvciA9IGFzeW5jIChpbnB1dCwgc291cmNlKSA9PiB7XHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgb3BlbkVkaXRvckJhc2UoaW5wdXQsIHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgZmlsZSA9IGlucHV0LnJlc291cmNlLnBhdGguc3Vic3RyaW5nKDEpO1xyXG4gICAgICAgICAgICB2YXIgbGluZSA9IGlucHV0Lm9wdGlvbnMuc2VsZWN0aW9uLnN0YXJ0TGluZU51bWJlcjtcclxuXHJcbiAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcIiNkbz1qYXNzaV9lZGl0b3IuQ29kZUVkaXRvciZmaWxlPVwiICsgZmlsZSArIFwiJmxpbmU9XCIgKyBsaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDsgLy8gYWx3YXlzIHJldHVybiB0aGUgYmFzZSByZXN1bHRcclxuICAgIH07XHJcbiAgICAvL2NvbXBsZXRpb24gZm9yIGF1dG9uaW1wb3J0XHJcbiAgICBtb25hY28ubGFuZ3VhZ2VzLnJlZ2lzdGVyQ29tcGxldGlvbkl0ZW1Qcm92aWRlcigndHlwZXNjcmlwdCcsIHtcclxuICAgICAgICBwcm92aWRlQ29tcGxldGlvbkl0ZW1zOiBhc3luYyBmdW5jdGlvbiAobW9kZWwsIHBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0VW50aWxQb3NpdGlvbiA9IG1vZGVsLmdldFZhbHVlSW5SYW5nZSh7IHN0YXJ0TGluZU51bWJlcjogMSwgc3RhcnRDb2x1bW46IDEsIGVuZExpbmVOdW1iZXI6IHBvc2l0aW9uLmxpbmVOdW1iZXIsIGVuZENvbHVtbjogcG9zaXRpb24uY29sdW1uIH0pO1xyXG4gICAgICAgICAgICB2YXIgd29yZCA9IG1vZGVsLmdldFdvcmRVbnRpbFBvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHJhbmdlID0ge1xyXG4gICAgICAgICAgICAgICAgc3RhcnRMaW5lTnVtYmVyOiBwb3NpdGlvbi5saW5lTnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgZW5kTGluZU51bWJlcjogcG9zaXRpb24ubGluZU51bWJlcixcclxuICAgICAgICAgICAgICAgIHN0YXJ0Q29sdW1uOiB3b3JkLnN0YXJ0Q29sdW1uLFxyXG4gICAgICAgICAgICAgICAgZW5kQ29sdW1uOiB3b3JkLmVuZENvbHVtbiBcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdmFyIGZpbGUgPSBtb2RlbC51cmkucGF0aC5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSB0eXBlc2NyaXB0LmdldFBvc2l0aW9uT2ZMaW5lQW5kQ2hhcmFjdGVyKGZpbGUsIHsgbGluZTogcG9zaXRpb24ubGluZU51bWJlciwgY2hhcmFjdGVyOiBwb3NpdGlvbi5jb2x1bW4gfSk7XHJcbiAgICAgICAgICAgIHZhciBhbGwgPSBhd2FpdCB0eXBlc2NyaXB0LmdldENvbXBsZXRpb24oZmlsZSwgcG9zLCB1bmRlZmluZWQsIHsgaW5jbHVkZUV4dGVybmFsTW9kdWxlRXhwb3J0czogdHJ1ZSB9KTtcclxuICAgICAgICAgICAgdmFyIHN1ZyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5lbnRyaWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXQgPSBhbGwuZW50cmllc1t4XTtcclxuICAgICAgICAgICAgICAgIGlmICgoaXQua2luZE1vZGlmaWVycyA9PT0gXCJleHBvcnRcInx8aXQua2luZE1vZGlmaWVycyA9PT0gXCJcIikgJiYgaXQuaGFzQWN0aW9uID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW06IG1vbmFjby5sYW5ndWFnZXMuQ29tcGxldGlvbkl0ZW0gPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiBpdC5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBraW5kOiA8bW9uYWNvLmxhbmd1YWdlcy5Db21wbGV0aW9uSXRlbUtpbmQ+aXQua2luZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnRhdGlvbjogXCJpbXBvcnQgZnJvbSBcIiArIGl0LnNvdXJjZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaW5zZXJ0VGV4dDogaXQubmFtZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmFuZ2U6IHJhbmdlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tYW5kOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHM6IFttb2RlbCwgcG9zaXRpb25dLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWQ6IFwiYXV0b2ltcG9ydFwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiYXV0b2ltcG9ydFwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgc3VnLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN1Z2dlc3Rpb25zOiBzdWdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuICAgIGluaXRlZCA9IHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4qIHdyYXBwZXIgZm9yIHRoZSBBY2UtQ29kZSBlZGl0b3Igd2l0aCBUeXBlc2NjcmlwdC1Db2RlLUNvbXBsZXRpb24gYW4gb3RoZXIgZmVhdHVyZXNcclxuKiBAY2xhc3MgamFzc2kudWkuQ29kZVBhbmVsXHJcbiovXHJcbkAkQ2xhc3MoXCJqYXNzaV9lZGl0b3IuTW9uYWNvUGFuZWxcIilcclxuZXhwb3J0IGNsYXNzIE1vbmFjb1BhbmVsIGV4dGVuZHMgQ29kZVBhbmVsIHtcclxuICAgIHByaXZhdGUgX21vZGU6IHN0cmluZztcclxuICAgIHByaXZhdGUgX2VkaXRvcjogbW9uYWNvLmVkaXRvci5JU3RhbmRhbG9uZUNvZGVFZGl0b3I7XHJcbiAgICBwcml2YXRlIF9pc0luaXRlZDogYm9vbGVhbjtcclxuICAgIC8vICAgcHJpdmF0ZSBfbGFzdEN1cnNvclBvc2l0aW9uO1xyXG4gICAgZmlsZTogc3RyaW5nO1xyXG4gICAgcHJpdmF0ZSBzdGF0aWMgX3Rvb2x0aXBkaXY7XHJcbiAgICBwcml2YXRlIF9sYXN0VG9vbHRpcFJlZnJlc2g7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgLy8gc3VwZXIuaW5pdCgkKCc8ZGl2IHN0eWxlPVwid2lkdGg6IDgwMHB4OyBoZWlnaHQ6IDYwMHB4OyBib3JkZXI6IDFweCBzb2xpZCBncmV5XCI+PC9kaXY+JylbMF0pO1xyXG4gICAgICAgIHZhciB0ZXN0ID0gJCgnPGRpdiBjbGFzcz1cIk1vbmFjb1BhbmVsXCIgc3R5bGU9XCJoZWlnaHQ6IDEwMHB4OyB3aWR0aDogMTAwcHhcIj48L2Rpdj4nKVswXTtcclxuXHJcbiAgICAgICAgc3VwZXIuaW5pdCh0ZXN0KTtcclxuXHJcbiAgICAgICAgJCh0aGlzLmRvbVdyYXBwZXIpLmNzcyhcIm92ZXJmbG93XCIsIFwiaGlkZGVuXCIpO1xyXG4gICAgICAgICQodGhpcy5kb21XcmFwcGVyKS5jc3MoXCJkaXNwbGF5XCIsIFwiXCIpO1xyXG5cclxuICAgICAgICAvKiBfdGhpcy5fZWRpdG9yLm9uKFwiZ3V0dGVybW91c2Vkb3duXCIsIGZ1bmN0aW9uKGUpIHtcclxuIFxyXG4gICAgICAgICAgICAgdmFyIHJvdyA9IGUuZ2V0RG9jdW1lbnRQb3NpdGlvbigpLnJvdztcclxuICAgICAgICAgICAgIHZhciBicmVha3BvaW50cyA9IGUuZWRpdG9yLnNlc3Npb24uZ2V0QnJlYWtwb2ludHMocm93LCAwKTtcclxuICAgICAgICAgICAgIHZhciB0eXBlID0gXCJkZWJ1Z3BvaW50XCI7XHJcbiAgICAgICAgICAgICBpZiAoZS5kb21FdmVudC5jdHJsS2V5KVxyXG4gICAgICAgICAgICAgICAgIHR5cGUgPSBcImNoZWNrcG9pbnRcIjtcclxuICAgICAgICAgICAgIHZhciBjb2x1bW4gPSBfdGhpcy5fZWRpdG9yLnNlc3Npb24uZ2V0TGluZShyb3cpLmxlbmd0aDtcclxuICAgICAgICAgICAgIGlmICh0eXBlb2YgYnJlYWtwb2ludHNbcm93XSA9PT0gdHlwZW9mIHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgIGUuZWRpdG9yLnNlc3Npb24uc2V0QnJlYWtwb2ludChyb3cpO1xyXG4gICAgICAgICAgICAgICAgIF90aGlzLmNhbGxFdmVudChcImJyZWFrcG9pbnRDaGFuZ2VkXCIsIHJvdywgY29sdW1uLCB0cnVlLCB0eXBlKTtcclxuICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgZS5lZGl0b3Iuc2Vzc2lvbi5jbGVhckJyZWFrcG9pbnQocm93LCBmYWxzZSwgdW5kZWZpbmVkKTtcclxuICAgICAgICAgICAgICAgICBfdGhpcy5jYWxsRXZlbnQoXCJicmVha3BvaW50Q2hhbmdlZFwiLCByb3csIGNvbHVtbiwgZmFsc2UsIHR5cGUpO1xyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9KTsqL1xyXG5cclxuICAgICAgICB0aGlzLl9lZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZSh0aGlzLmRvbSwge1xyXG4gICAgICAgICAgICAvL3ZhbHVlOiAgbW9uYWNvLmVkaXRvci5nZXRNb2RlbHMoKVswXSwgLy9bJ2NsYXNzIEF7YjpCO307XFxuY2xhc3MgQnthOkE7fTtcXG5mdW5jdGlvbiB4KCkgeycsICdcXHRjb25zb2xlLmxvZyhcIkhlbGxvIHdvcmxkIVwiKTsnLCAnfSddLmpvaW4oJ1xcbicpLFxyXG4gICAgICAgICAgICBsYW5ndWFnZTogJ3R5cGVzY3JpcHQnLFxyXG4gICAgICAgICAgICB0aGVtZTogXCJ2cy1saWdodFwiLFxyXG4gICAgICAgICAgICBnbHlwaE1hcmdpbjogdHJ1ZSxcclxuICAgICAgICAgICAgZm9udFNpemU6IDEyLFxyXG4gICAgICAgICAgICBhdXRvbWF0aWNMYXlvdXQ6IHRydWVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgX19pbml0KHRoaXMuX2VkaXRvcik7XHJcbiAgICAgICAgdGhpcy5fZWRpdG9yLm9uTW91c2VEb3duKGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9tb3VzZURvd24oZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgLy90aGlzLl9lZGl0b3Iuc2V0TW9kZWwobW9uYWNvLmVkaXRvci5nZXRNb2RlbHMoKSBbMV0pO1xyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgZ2V0QnJlYWtwb2ludERlY29yYXRpb24obGluZTpudW1iZXIpOm1vbmFjby5lZGl0b3IuSU1vZGVsRGVjb3JhdGlvbntcclxuICAgICAgICB2YXIgZGVjcz10aGlzLl9lZGl0b3IuZ2V0TGluZURlY29yYXRpb25zKGxpbmUpO1xyXG4gICAgICAgIGZvcih2YXIgeD0wO3g8ZGVjcy5sZW5ndGg7eCsrKXtcclxuICAgICAgICAgICAgaWYoZGVjc1t4XS5vcHRpb25zLmdseXBoTWFyZ2luQ2xhc3NOYW1lPT09XCJqYnJlYWNrcG9pbnRcIilcclxuICAgICAgICAgICAgICAgIHJldHVybiBkZWNzW3hdO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfbW91c2VEb3duKGUpIHtcclxuICAgICAgICBpZiAoZS50YXJnZXQudHlwZSA9PT0gMikge1xyXG4gICAgICAgICAgICB2YXIgbGluZT1lLnRhcmdldC5wb3NpdGlvbi5saW5lTnVtYmVyO1xyXG4gICAgICAgICAgICB2YXIgY29sdW1uID0gdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvbnRlbnQobGluZS0xKS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciB0eXBlID0gXCJkZWJ1Z3BvaW50XCI7XHJcbiAgICAgICAgICAgIHZhciBkZWM9dGhpcy5nZXRCcmVha3BvaW50RGVjb3JhdGlvbihsaW5lKTtcclxuICAgICAgICAgICAgaWYoZGVjKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5kZWx0YURlY29yYXRpb25zKFtkZWMuaWRdLFtdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbEV2ZW50KFwiYnJlYWtwb2ludENoYW5nZWRcIiwgbGluZS0xLCBjb2x1bW4sIGZhbHNlLCB0eXBlKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxFdmVudChcImJyZWFrcG9pbnRDaGFuZ2VkXCIsIGxpbmUtMSwgY29sdW1uLCB0cnVlLCB0eXBlKTtcclxuICAgICAgICAgICAgICAgIHZhciBkZWNvcmF0aW9ucyA9IHRoaXMuX2VkaXRvci5kZWx0YURlY29yYXRpb25zKFtdLCBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByYW5nZTogbmV3IG1vbmFjby5SYW5nZShsaW5lLCAxLCBsaW5lLCAxKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNXaG9sZUxpbmU6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU6ICdqYnJlYWNrcG9pbnRjbGFzcycsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbHlwaE1hcmdpbkNsYXNzTmFtZTogJ2picmVhY2twb2ludCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyBhIGxpc3Qgb2YgYWxsIGxpbmVzIHdpdGggYnJlYWtwb2ludFxyXG4gICAgICogQHJldHVybnMge09iamVjdC48bnVtYmVyLCBib29sZWFuPn1cclxuICAgICAqL1xyXG4gICAgZ2V0QnJlYWtwb2ludHMoKTogeyBbbGluZTogbnVtYmVyXTogYm9vbGVhbiB9IHtcclxuICAgICAgICB2YXIgcmV0ID0ge307XHJcbiAgICAgICAgdmFyIGRlY3M9dGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvdW50KCk7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDE7IHggPD0gdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkuZ2V0TGluZUNvdW50KCk7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5nZXRCcmVha3BvaW50RGVjb3JhdGlvbih4KSkge1xyXG4gICAgICAgICAgICAgICAgcmV0W3gtMV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGJyZWFrcG9pbnQgY2hhbmdlZFxyXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIGZ1bmN0aW9uKGxpbmUsZW5hYmxlZCx0eXBlKVxyXG4gICAgICovXHJcbiAgICBvbkJyZWFrcG9pbnRDaGFuZ2VkKGhhbmRsZXIpIHtcclxuICAgICAgICB0aGlzLmFkZEV2ZW50KFwiYnJlYWtwb2ludENoYW5nZWRcIiwgaGFuZGxlcik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGNvbXBvbmVudCBnZXQgZm9jdXNcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb25mb2N1cyhoYW5kbGVyKSB7XHJcbiAgICAgICAgLy8gICB0aGlzLl9lZGl0b3Iub24oXCJmb2N1c1wiLCBoYW5kbGVyKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogY29tcG9uZW50IGxvc3QgZm9jdXNcclxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGhhbmRsZXJcclxuICAgICAqL1xyXG4gICAgb25ibHVyKGhhbmRsZXIpIHtcclxuICAgICAgICAvLyB0aGlzLl9lZGl0b3Iub24oXCJibHVyXCIsIGhhbmRsZXIpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0gLSB0aGUgY29kZXRleHRcclxuICAgICAqL1xyXG4gICAgc2V0IHZhbHVlKHZhbHVlOiBzdHJpbmcpIHsgLy90aGUgQ29kZVxyXG4gICAgICAgIHZhciBsYXN0Y3Vyc29yID0gdGhpcy5jdXJzb3JQb3NpdGlvbjtcclxuICAgICAgICBpZiAodGhpcy5maWxlKSB7XHJcbiAgICAgICAgICAgIHZhciBmZmlsZSA9IG1vbmFjby5VcmkuZnJvbSh7IHBhdGg6IFwiL1wiICsgdGhpcy5maWxlLCBzY2hlbWU6ICdmaWxlJyB9KTtcclxuICAgICAgICAgICAgdmFyIG1vZCA9IG1vbmFjby5lZGl0b3IuZ2V0TW9kZWwoZmZpbGUpO1xyXG4gICAgICAgICAgICBpZiAoIW1vZCkge1xyXG4gICAgICAgICAgICAgICAgbW9kID0gbW9uYWNvLmVkaXRvci5jcmVhdGVNb2RlbCh2YWx1ZSwgXCJ0eXBlc2NyaXB0XCIsIGZmaWxlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRNb2RlbChtb2QpO1xyXG4gICAgICAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobW9kICE9PSB0aGlzLl9lZGl0b3IuZ2V0TW9kZWwoKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fZWRpdG9yLnNldE1vZGVsKG1vZCk7XHJcbiAgICAgICAgICAgICAgICAgdGhpcy5fZWRpdG9yLnNldFZhbHVlKHZhbHVlKTtcclxuICAgICAgICAgICAgfWVsc2V7XHJcblx0ICAgICAgICAgICAgdGhpcy5fZWRpdG9yLmdldE1vZGVsKCkucHVzaEVkaXRPcGVyYXRpb25zKFtdLCBbe1xyXG5cdCAgICAgICAgICAgICAgICAgICAgICAgIHJhbmdlOiB0aGlzLl9lZGl0b3IuZ2V0TW9kZWwoKS5nZXRGdWxsTW9kZWxSYW5nZSgpLC8vIG1vbmFjby5SYW5nZS5mcm9tUG9zaXRpb25zKHsgY29sdW1uOiBkYXRhLnBvcy5jb2x1bW4sIGxpbmVOdW1iZXI6IGRhdGEucG9zLnJvdyB9KSxcclxuXHQgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiB2YWx1ZVxyXG5cdCAgICAgICAgICAgICAgICAgICAgfV0sICgpID0+IG51bGwpO1xyXG5cdCAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuXHJcbiAgICAgICAgICAgIHRoaXMuX2VkaXRvci5zZXRWYWx1ZSh2YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHZhbHVlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2VkaXRvci5nZXRWYWx1ZSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24ge3Jvdz0gLGNvbHVtbj19XHJcbiAgICAgKi9cclxuICAgIHNldCBjdXJzb3JQb3NpdGlvbihjdXJzb3I6IHsgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyIH0pIHtcclxuICAgICAgICB0aGlzLl9lZGl0b3IuZm9jdXMoKTtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB0aGlzLl9lZGl0b3IucmV2ZWFsTGluZShjdXJzb3Iucm93KTtcclxuICAgICAgICAgICAgLy90aGlzLl9lZGl0b3Iuc2V0UG9zaXRpb24oeyBjb2x1bW46IGN1cnNvci5jb2x1bW4sIGxpbmVOdW1iZXI6IGN1cnNvci5yb3cgfSk7XHJcbiAgICAgICAgfSBjYXRjaCB7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGdldCBjdXJzb3JQb3NpdGlvbigpOiB7IHJvdzogbnVtYmVyLCBjb2x1bW46IG51bWJlciB9IHtcclxuICAgICAgICB2YXIgcG9zID0gdGhpcy5fZWRpdG9yLmdldFBvc2l0aW9uKCk7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcm93OiBwb3MubGluZU51bWJlcixcclxuICAgICAgICAgICAgY29sdW1uOiBwb3MuY29sdW1uXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgLy90aGlzLl9lZGl0b3IuZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogdW5kbyBhY3Rpb25cclxuICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2VkaXRvci5nZXRNb2RlbCgpLnVuZG8oKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogcmVzaXplIHRoZSBlZGl0b3JcclxuICAgICAqICovXHJcbiAgICByZXNpemUoKSB7XHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyAgIHRoaXMuX2VkaXRvci5yZXNpemUoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgbGFuZ3VhZ2Ugb2YgdGhlIGVkaXRvciBlLmcuIFwiYWNlL21vZGUvamF2YXNjcmlwdFwiXHJcbiAgICovXHJcbiAgICBzZXQgbW9kZShtb2RlKSB7XHJcbiAgICAgICAgLy8gIGFsZXJ0KG1vZGUpO1xyXG4gICAgICAgIHRoaXMuX21vZGUgPSBtb2RlO1xyXG4gICAgICAgIC8vICB0aGlzLl9lZGl0b3IuZ2V0U2Vzc2lvbigpLnNldE1vZGUoXCJhY2UvbW9kZS9cIiArIG1vZGUpO1xyXG4gICAgfVxyXG4gICAgZ2V0IG1vZGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGU7XHJcbiAgICB9XHJcbiAgICBhc3luYyBsb2Fkc2FtcGxlKCkge1xyXG4gICAgICAgIHZhciBjb2RlID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKFwiYS9EaWFsb2cudHNcIik7XHJcbiAgICAgICAgdGhpcy5maWxlID0gXCJhL0RpYWxvZy50c1wiO1xyXG4gICAgICAgIHRoaXMudmFsdWUgPSBjb2RlO1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuXHJcbiAgICB2YXIgZGxnID0gbmV3IE1vbmFjb1BhbmVsKCk7XHJcbiAgICB2YXIgY29kZSA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5sb2FkRmlsZShcImEvRGlhbG9nLnRzXCIpO1xyXG4gICAgZGxnLmZpbGUgPSBcImEvRGlhbG9nLnRzXCI7XHJcbiAgICBkbGcudmFsdWUgPSBjb2RlO1xyXG4gICAgZGxnLndpZHRoID0gXCI4MDBcIjtcclxuICAgIGRsZy5oZWlnaHQgPSBcIjgwMFwiO1xyXG4gICAgLy9AdHMtaWdub3JlXHJcbiAgICBkbGcuX2VkaXRvci5sYXlvdXQoKTtcclxuICAgIFxyXG4gICAgLy8gICAgZGxnLnZhbHVlID0gXCJ2YXIgaDtcXHJcXG52YXIgaztcXHJcXG52YXIgaztcXHJcXG52YXIgaztcXHJcXG5jb25zb2xlLmRlYnVnKCdkZGQnKTtcIjtcclxuICAgIC8vICBkbGcubW9kZSA9IFwiamF2YXNjcmlwdFwiO1xyXG4gICAgLy9kbGcuX2VkaXRvci5yZW5kZXJlci5zZXRTaG93R3V0dGVyKGZhbHNlKTtcdFx0XHJcbiAgICAvL2RsZy5fZWRpdG9yLmdldFNlc3Npb24oKS5hZGRHdXR0ZXJEZWNvcmF0aW9uKDEsXCJlcnJvcl9saW5lXCIpO1xyXG4gICAgLy8gIGRsZy5fZWRpdG9yLmdldFNlc3Npb24oKS5zZXRCcmVha3BvaW50KDEpO1xyXG4gICAgLy8gZGxnLl9lZGl0b3IuZ2V0U2Vzc2lvbigpLnNldEJyZWFrcG9pbnQoMik7XHJcblxyXG4gICAgcmV0dXJuIGRsZztcclxufVxyXG5cclxuIl19