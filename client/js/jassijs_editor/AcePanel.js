var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "ace/ace", "jassijs_editor/util/Typescript", "jassijs/remote/Registry", "jassijs_editor/CodePanel", "jassijs/util/Runlater", "jassijs/ui/Component", "ace/ext/language_tools", "jassijs_editor/Debugger"], function (require, exports, ace, Typescript_1, Registry_1, CodePanel_1, Runlater_1, Component_1) {
    "use strict";
    var AcePanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.AcePanel = void 0;
    /// <amd-dependency path="ace/ace" name="ace"/>
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    let AcePanel = AcePanel_1 = class AcePanel extends CodePanel_1.CodePanel {
        constructor() {
            super();
        }
        render() {
            return React.createElement("div", { className: "CodePanel", style: { height: "500px", width: "500px" } });
        }
        componentDidMount() {
            var _this = this;
            this.domWrapper.style.display = "";
            this._editor = ace.edit(this._id);
            this.file = "";
            this.checkErrorTask = new Runlater_1.Runlater(function () {
                _this._checkCode();
            }, 900);
            this._editor.setOptions({
                enableBasicAutocompletion: true,
                //   maxLines:Infinity,
                useSoftTabs: false,
                autoScrollEditorIntoView: false
                //      enableMultiselect: false,
                //    enableLinking: true
            });
            // this._editor.setAutoScrollEditorIntoView(false);
            this._editor.session.setOption("useWorker", false);
            this._editor.$blockScrolling = Infinity;
            this._editor.jassi = this;
            this._installLangTools();
            var include = /[a-z.]/i;
            this._addEvents();
            this._addCommands();
        }
        _addEvents() {
            var _this = this;
            this._editor.on('change', (obj, editor) => {
                switch (obj.action) {
                    case 'insert':
                        let lines = obj.lines;
                        let char = lines[0];
                        if ((lines.length === 1) && (char.length === 1) && char === ".") {
                            setTimeout(() => {
                                this._editor.commands.byName.startAutocomplete.exec(this._editor);
                            }, 50);
                        }
                        if (lines.length == 1 && lines[0].length > 1 && lines[0].indexOf(" ") < 0) {
                            //no check after .
                            var idx = _this.positionToNumber(obj.start);
                            var test = _this.value[idx - 1];
                            if (test !== ".") {
                                setTimeout(() => {
                                    _this._doRequiredImports(obj.end, lines);
                                }, 500);
                            }
                        }
                        break;
                }
                _this.checkErrorTask.runlater();
                var lineHeight = this._editor.renderer.lineHeight;
                var editorDiv = document.getElementById(_this._id);
                editorDiv.style.height = lineHeight * _this._editor.getSession().getDocument().getLength() + " px";
                _this._editor.resize();
            });
            _this._editor.on("guttermousedown", function (e) {
                var row = e.getDocumentPosition().row;
                var breakpoints = e.editor.session.getBreakpoints(row, 0);
                var type = "debugpoint";
                if (e.domEvent.ctrlKey)
                    type = "checkpoint";
                var column = _this._editor.session.getLine(row).length;
                if (typeof breakpoints[row] === typeof undefined) {
                    e.editor.session.setBreakpoint(row);
                    _this.callEvent("breakpointChanged", row, column, true, type);
                }
                else {
                    e.editor.session.clearBreakpoint(row, false, undefined);
                    _this.callEvent("breakpointChanged", row, column, false, type);
                }
            });
            this._editor.on("mousemove", function (e) {
                _this._manageTooltip(e);
            });
        }
        autocomplete() {
            this._editor.commands.byName.startAutocomplete.exec(this._editor);
        }
        /**
         * add commands to Ace Editor
         **/
        _addCommands() {
            var _this = this;
            this._editor.commands.addCommand({
                name: "formatDocument",
                bindKey: { win: "Shift-Alt-f", mac: "Shift-Alt-f" },
                exec: function (editor) {
                    Typescript_1.mytypescript.formatDocument(_this.file, _this.value).then((val) => {
                        _this.value = val;
                    });
                }
            });
            this._editor.commands.addCommand({
                name: "goToDeclaration",
                bindKey: { win: "Ctrl-F12", mac: "Ctrl-F12" },
                exec: function (editor) {
                    _this.gotoDeclaration();
                }
            });
        }
        _tooltiprefresh(event) {
            if (this._lastTooltipRefresh === undefined)
                return;
            if (this._lastTooltipRefresh + 400 < Date.now()) {
                var pos = event.getDocumentPosition();
                if (pos.row === 0 || pos.column == 0)
                    return;
                let lpos = this.positionToNumber({
                    column: pos.column + 1,
                    row: pos.row + 1
                }) - 1;
                if (!Typescript_1.mytypescript.isInited(this.file))
                    return;
                var p;
                Typescript_1.mytypescript.getQuickInfoAtPosition(this.file, lpos, this.value).then((p) => {
                    if (p !== undefined) {
                        var text = "<div style='font-size:12px'>";
                        for (let x = 0; x < p.displayParts.length; x++) {
                            text = text + p.displayParts[x].text;
                        }
                        if (p.documentation !== undefined) {
                            for (let x = 0; x < p.documentation.length; x++) {
                                text = text + "<br>" + p.documentation[x].text;
                            }
                        }
                        text = text + "<br>" + (p.documentation === undefined ? "" : p.documentation) + "<div>";
                        AcePanel_1._tooltipdiv.innerHTML = text;
                        AcePanel_1._tooltipdiv.style["background-color"] = "#f7f4a5";
                        AcePanel_1._tooltipdiv.style.display = "block";
                        AcePanel_1._tooltipdiv.style.position = "absolute";
                        AcePanel_1._tooltipdiv.style.top = event.y + "px";
                        AcePanel_1._tooltipdiv.style.left = event.x + "px";
                    }
                });
            }
        }
        /**
         * show tooltip
         */
        _manageTooltip(event) {
            if (AcePanel_1._tooltipdiv === undefined) {
                AcePanel_1._tooltipdiv = Component_1.Component.createHTMLElement('<div id="tt">hallo</div>');
                document.body.append(AcePanel_1._tooltipdiv);
            }
            if (event !== undefined) {
                AcePanel_1._tooltipdiv.style.display = "none";
                AcePanel_1._tooltipdiv.style.position = "absolute";
                AcePanel_1._tooltipdiv.style.top = event.y + "px";
                AcePanel_1._tooltipdiv.style.left = event.x + "px";
            }
            this._lastTooltipRefresh = Date.now();
            event = event;
            window.setTimeout(this._tooltiprefresh.bind(this), 400, event);
        }
        insert(pos, text) {
            this._editor.session.insert(pos, text);
        }
        /**
         * check if imports are neded and do so
         **/
        _doRequiredImports(pos, name) {
            if (!Typescript_1.mytypescript.isInited(this.file))
                return;
            if (this.value.indexOf("import " + name + " ") === -1 && this.value.indexOf("import {" + name + "} ") === -1) {
                let lpos = this.positionToNumber({
                    column: pos.column + 1,
                    row: pos.row + 1
                }) - 1;
                CodePanel_1.CodePanel.getAutoimport(lpos, this.file, this.value).then((data) => {
                    if (data !== undefined) {
                        this._editor.session.insert(data.pos, data.text);
                        Typescript_1.mytypescript.setCode(this.file, this.value);
                    }
                });
            }
        }
        /**
         * check for errors or warnings
         */
        _checkCode() {
            if (this.file !== undefined && !this.file.toLowerCase().endsWith(".ts"))
                return;
            var _this = this;
            Typescript_1.mytypescript.waitForInited.then(() => {
                if (_this._editor !== undefined && _this._editor.getSession() !== undefined) {
                    _this._editor.getSession().setAnnotations([{
                            row: 1,
                            column: 1,
                            text: "typescript initialization still in progress...",
                            type: "information" // also warning and information
                        }]);
                }
                Typescript_1.mytypescript.setCode(_this.file, _this.value).then((tt) => {
                    if (_this.file === undefined)
                        return;
                    Typescript_1.mytypescript.getDiagnostics(_this.file, _this.value).then((diag) => {
                        var annotaions = [];
                        var iserror = false;
                        for (var x = 0; x < diag.semantic.length; x++) {
                            // if (diag.semantic[x].file === undefined)
                            //   continue;
                            // if (diag.semantic[x].file === undefined||diag.semantic[x].file.fileName === ("file:///" + _this.file) {
                            var err = _this.numberToPosition(diag.semantic[x].start);
                            annotaions.push({
                                row: err.row - 1,
                                column: err.column - 1,
                                text: diag.semantic[x].messageText["messageText"] === undefined ? diag.semantic[x].messageText : diag.semantic[x].messageText["messageText"],
                                type: "error" // also warning and information
                            });
                            iserror = true;
                            //  }
                        }
                        for (var y = 0; y < diag.suggestion.length; y++) {
                            //if (diag.suggestion[y].file === undefined)
                            //    continue;
                            //   if (diag.suggestion[y].file === undefined||diag.suggestion[y].file.fileName === _this.file) {
                            var err = _this.numberToPosition(diag.suggestion[y].start);
                            annotaions.push({
                                row: err.row - 1,
                                column: err.column - 1,
                                text: diag.suggestion[y].messageText,
                                type: "warning" // also warning and information
                            });
                            //  }
                        }
                        for (var x = 0; x < diag.syntactic.length; x++) {
                            //  if (diag.syntactic[x].file === undefined)
                            //    continue;
                            // if (iag.syntactic[x].file === undefined||diag.syntactic[x].file.fileName === _this.file) {
                            var err = _this.numberToPosition(diag.syntactic[x].start);
                            annotaions.push({
                                row: err.row - 1,
                                column: err.column - 1,
                                text: diag.syntactic[x].messageText["messageText"] === undefined ? diag.syntactic[x].messageText : diag.syntactic[x].messageText["messageText"],
                                type: "error" // also warning and information
                            });
                            iserror = true;
                            //}
                        }
                        _this._editor.getSession().setAnnotations(annotaions);
                        if (_this.dom) {
                            if (iserror) {
                                _this.dom.querySelector(".ace_gutter").style.background = "#ffbdb9";
                            }
                            else {
                                _this.dom.querySelector(".ace_gutter").style.background = "";
                            }
                        }
                    });
                });
            });
        }
        /**
         * text changes
         * @param {function} handler
         */
        onchange(handler) {
            this._editor.on('change', handler);
        }
        /**
         * initialize the Ace language Tools (only once)
         */
        _installLangTools() {
            var aceLangTools = ace.require("ace/ext/language_tools");
            var _this = this;
            if (aceLangTools.jassi === undefined) {
                aceLangTools.jassi = {
                    constructor: {},
                    getDocTooltip: function (item) {
                        return item.codePanel.getDocTooltip(item);
                        // if (item.jassi !== undefined && item.jassijs.getDocTooltip !== undefined)
                        //     return item.jassijs.getDocTooltip(item);
                    },
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        return _this.getCompletions(editor, session, pos, prefix, callback);
                    }
                };
            }
            aceLangTools.setCompleters([aceLangTools.jassi, aceLangTools.keyWordCompleter]);
        }
        /**
        * get the completion entrys for the Ace-Code-Editor
        * @param editor - the editor instance
        * @param session - the editor session
        * @param pos - the current code position
        * @param prefix - the word before the code position
        * @param callback - the function to transfer the completions
        */
        getCompletions(editor, session, pos, prefix, callback) {
            /*   var ret = [];
               var entry = { caption: caption, name: sname, value: sname, score: 10, meta: "object", parent: ob };
               ret.push(entry);
               callback(null, ret);*/
            var ret = [];
            var _this = this;
            var p = _this.positionToNumber({
                column: pos.column + 1,
                row: pos.row + 1
            });
            var code = this.value;
            if (Typescript_1.mytypescript.isInited(this.file) !== true) {
                let entry = { caption: "please try later ... loading in progress", name: "loading", value: "empty", score: 10, meta: "object", parent: "otto", codePanel: _this };
                ret.push(entry);
                return;
            }
            if (_this.file.endsWith(".js"))
                return;
            Typescript_1.mytypescript.getCompletion(_this.file, p, code, { includeExternalModuleExports: true }).then((data) => {
                if (data !== undefined) {
                    for (let e = 0; e < data.entries.length; e++) {
                        let entr = data.entries[e];
                        var icon = "variableicon";
                        if (entr.kind === "method" || entr.kind === "function")
                            icon = "functionicon";
                        if (entr.kind === "property" || entr.kind === "getter" || entr.kind === "setter")
                            icon = "membericon";
                        if (entr.name.startsWith("$") && entr.kind === "function") {
                            icon = "annotationicon";
                        }
                        if (entr.kind === "class")
                            icon = "classicon";
                        var entry = {
                            caption: entr.name, name: entr.name, value: entr.name,
                            score: 10, meta: entr.kind, codePanel: _this, pos: p, file: _this.file, className: icon, icon: "method"
                        };
                        ret.push(entry);
                    }
                }
                else {
                    let entry = { caption: "empty", name: "empty", value: "empty", score: 10, meta: "object", parent: "otto", codePanel: _this };
                    ret.push(entry);
                }
                callback(null, ret);
            });
        }
        /**
        * get the documentation for a member for the Ace-Code-Editor
        * @param {object} item - the member to describe
        */
        getDocTooltip(item) {
            if (item.file === undefined)
                return "";
            var _id = "j" + (0, Component_1.nextID)();
            item.docHTML = "<span id='" + _id + "'> please try later ... loading in progress<span>";
            Typescript_1.mytypescript.getCompletionEntryDetails(item.file, item.pos, item.name, {}, undefined, {}).then((ret) => {
                if (ret === undefined)
                    return;
                var doc = "<b>";
                if (ret.displayParts !== undefined) {
                    for (var x = 0; x < ret.displayParts.length; x++) {
                        doc = doc + ret.displayParts[x].text; //+ret.tags[x].text;
                    }
                }
                //doc = "<div style='width:50px;word-wrap: break-word'>"+doc + "</div></b><br>";
                doc = "<div style='word-wrap: break-word'>" + doc + "</div></b><br>";
                if (ret.documentation !== undefined) {
                    for (var x = 0; x < ret.documentation.length; x++) {
                        doc = doc + ret.documentation[x].text + "<br>"; //+ret.tags[x].text;
                    }
                }
                doc = doc;
                if (ret.tags !== undefined) {
                    for (var x = 0; x < ret.tags.length; x++) {
                        var text = ret.tags[x].text;
                        if (Array.isArray(text)) {
                            var t = "";
                            text.forEach((e) => t += e.text);
                            text = t;
                        }
                        doc = doc + "<b>" + ret.tags[x].name + " </b> " + (text === undefined ? "" : text.replaceAll("<", "&#60;").replaceAll(">", "&#62;") + "<br>");
                    }
                }
                doc = doc;
                var html = "<div style='font-size:12px'>" + doc + "<div>"; //this._getDescForMember(item.parent, item.name);
                //window.setTimeout(()=>{
                document.getElementById(_id).outerHTML = html;
                // },10);
            });
        }
        /**
         * gets a list of all lines with breakpoint
         * @returns {Object.<number, boolean>}
         */
        getBreakpoints() {
            var ret = {};
            var breakpoints = this._editor.session.getBreakpoints(0, 0);
            for (var x = 0; x < breakpoints.length; x++) {
                if (breakpoints[x] !== undefined) {
                    ret[x] = true;
                }
                //	debugger;
            }
            return ret;
        }
        /**
         * component get focus
         * @param {function} handler
         */
        onfocus(handler) {
            return this._editor.on("focus", handler);
        }
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler) {
            return this._editor.on("blur", handler);
        }
        /**
         * @param - the codetext
         */
        set value(value) {
            var lastcursor = this.cursorPosition;
            this._editor.setValue(value);
            this._editor.clearSelection();
            //force ctrl+z not shows an empty document
            if (this._isInited === undefined) {
                this._isInited = true;
                this._editor.getSession().setUndoManager(new ace.UndoManager());
            }
            if (lastcursor !== undefined) {
                //this.cursorPosition = lastcursor;
            }
            var _this = this;
            //asynchron
            window.setTimeout(() => {
                this._checkCode();
            }, 10);
        }
        get value() {
            return this._editor.getValue();
        }
        /**
         * @param {object} position - the current cursor position {row= ,column=}
         */
        set cursorPosition(cursor) {
            this._editor.focus();
            this._editor.gotoLine(cursor.row, cursor.column, true);
            var r = cursor.row;
            if (r > 5)
                r = r - 5;
            var _this = this;
            //_this._editor.renderer.scrollToRow(r);
            // _this._editor.renderer.scrollCursorIntoView({ row: cursor.row, column: cursor.column  }, 0.5);
        }
        get cursorPosition() {
            var ret = this._editor.getCursorPosition();
            ret.row++;
            ret.column++;
            return ret;
        }
        /**
         * returns a single line
         * @param {number} line - the line number
         */
        getLine(line) {
            return this._editor.getSession().getLine(line);
        }
        /**
         * @member {string} - the language of the editor e.g. "ace/mode/javascript"
         */
        set mode(mode) {
            //  alert(mode);
            this._mode = mode;
            this._editor.getSession().setMode("ace/mode/" + mode);
        }
        get mode() {
            return this._mode;
        }
        destroy() {
            this._editor.destroy();
            super.destroy();
        }
        /**
        * undo action
        */
        undo() {
            this._editor.undo();
        }
        /**
         * resize the editor
         * */
        resize() {
            this._editor.resize();
        }
    };
    AcePanel = AcePanel_1 = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.AcePanel"),
        __metadata("design:paramtypes", [])
    ], AcePanel);
    exports.AcePanel = AcePanel;
    async function test() {
        var dlg = new AcePanel();
        dlg.value = "var h;\r\nvar k;\r\nvar k;\r\nvar k;\r\nconsole.debug('ddd');";
        dlg.mode = "typescript";
        dlg.height = 100;
        //dlg._editor.renderer.setShowGutter(false);		
        //dlg._editor.getSession().addGutterDecoration(1,"error_line");
        //  dlg._editor.getSession().setBreakpoint(1);
        // dlg._editor.getSession().setBreakpoint(2);
        var h = dlg.getBreakpoints();
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=AcePanel.js.map