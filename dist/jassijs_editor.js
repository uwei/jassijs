var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("jassijs_editor/AcePanel", ["require", "exports", "ace/ace", "jassijs_editor/util/Typescript", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs_editor/CodePanel", "jassijs/util/Runlater", "jassijs/ui/Component", "ace/ext/language_tools", "jassijs_editor/Debugger"], function (require, exports, ace, Typescript_1, Registry_1, Registry_2, CodePanel_1, Runlater_1, Component_1) {
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
            var _this = this;
            var test = '<div class="CodePanel" style="height: 500px; width: 500px"></div>';
            super.init(test);
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
            //editor.$blockScrolling = Infinity;
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
                    Typescript_1.default.formatDocument(_this.file, _this.value).then((val) => {
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
                if (!Typescript_1.default.isInited(this.file))
                    return;
                var p;
                Typescript_1.default.getQuickInfoAtPosition(this.file, lpos, this.value).then((p) => {
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
            if (!Typescript_1.default.isInited(this.file))
                return;
            if (this.value.indexOf("import " + name + " ") === -1 && this.value.indexOf("import {" + name + "} ") === -1) {
                let lpos = this.positionToNumber({
                    column: pos.column + 1,
                    row: pos.row + 1
                }) - 1;
                CodePanel_1.CodePanel.getAutoimport(lpos, this.file, this.value).then((data) => {
                    if (data !== undefined) {
                        this._editor.session.insert(data.pos, data.text);
                        Typescript_1.default.setCode(this.file, this.value);
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
            Typescript_1.default.waitForInited.then(() => {
                if (_this._editor !== undefined && _this._editor.getSession() !== undefined) {
                    _this._editor.getSession().setAnnotations([{
                            row: 1,
                            column: 1,
                            text: "typescript initialization still in progress...",
                            type: "information" // also warning and information
                        }]);
                }
                Typescript_1.default.setCode(_this.file, _this.value).then((tt) => {
                    if (_this.file === undefined)
                        return;
                    Typescript_1.default.getDiagnostics(_this.file, _this.value).then((diag) => {
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
            if (Typescript_1.default.isInited(this.file) !== true) {
                let entry = { caption: "please try later ... loading in progress", name: "loading", value: "empty", score: 10, meta: "object", parent: "otto", codePanel: _this };
                ret.push(entry);
                return;
            }
            if (_this.file.endsWith(".js"))
                return;
            Typescript_1.default.getCompletion(_this.file, p, code, { includeExternalModuleExports: true }).then((data) => {
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
            var _id = "j" + Registry_2.default.nextID();
            item.docHTML = "<span id='" + _id + "'> please try later ... loading in progress<span>";
            Typescript_1.default.getCompletionEntryDetails(item.file, item.pos, item.name, {}, undefined, {}).then((ret) => {
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
        Registry_1.$Class("jassijs.ui.AcePanel"),
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
define("jassijs_editor/AcePanelSimple", ["require", "exports", "ace/ace", "jassijs/remote/Registry", "jassijs_editor/CodePanel", "ace/ext/language_tools"], function (require, exports, ace, Registry_3, CodePanel_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.AcePanelSimple = void 0;
    /// <amd-dependency path="ace/ace" name="ace"/>
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    let AcePanelSimple = class AcePanelSimple extends CodePanel_2.CodePanel {
        constructor() {
            super();
            var _this = this;
            var test = '<div class="CodePanel" style="height: 500px; width: 500px"></div>';
            super.init(test);
            this.domWrapper.style.display = "";
            this._editor = ace.edit(this._id);
            this.file = "";
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
            this._addEvents();
            //editor.$blockScrolling = Infinity;
        }
        _addEvents() {
            var _this = this;
            /*     this._editor.on('change', (obj, editor) => {
                     var lineHeight = this._editor.renderer.lineHeight;
                     var editorDiv = document.getElementById(_this._id);
                     editorDiv.style.height = lineHeight * _this._editor.getSession().getDocument().getLength() + " px";
                     _this._editor.resize();
                 });*/
        }
        autocomplete() {
            console.log("not implemented");
        }
        insert(pos, text) {
            this._editor.session.insert(pos, text);
        }
        /**
         * text changes
         * @param {function} handler
         */
        onchange(handler) {
            this._editor.on('change', handler);
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
    AcePanelSimple = __decorate([
        Registry_3.$Class("jassijs.ui.AcePanelSimple"),
        __metadata("design:paramtypes", [])
    ], AcePanelSimple);
    exports.AcePanelSimple = AcePanelSimple;
    async function test() {
        var dlg = new AcePanelSimple();
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
define("jassijs_editor/ChromeDebugger", ["require", "exports", "jassijs/remote/Registry", "jassijs_editor/Debugger", "jassijs/ui/OptionDialog", "jassijs_editor/util/TSSourceMap", "jassijs/util/Reloader", "jassijs/remote/Server", "jassijs/base/Windows", "jassijs/ui/Notify"], function (require, exports, Registry_4, Debugger_1, OptionDialog_1, TSSourceMap_1, Reloader_1, Server_1, Windows_1, Notify_1) {
    "use strict";
    var ChromeDebugger_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ChromeDebugger = void 0;
    var installed = undefined;
    /**
     * debugging in Chrome
     */
    let ChromeDebugger = ChromeDebugger_1 = class ChromeDebugger extends Debugger_1.Debugger {
        constructor() {
            super();
            this.responseList = {};
            this.allBreakPoints = {};
            //listen to code changes
            this.sendChromeMessage({ name: "getCodeChange" });
            window.addEventListener("message", (event) => {
                // console.log("mess"+JSON.stringify(event));
                this.onChromeMessage(event);
            });
        }
        static showHintExtensionNotInstalled() {
            Notify_1.notifyAddStyle('downloadlink', {
                html: "<div><a href='https://uwei.github.io/jassijs/jassichrome/jassijsext.zip'><span data-notify-text/></a></div>",
                classes: {
                    base: {
                        "color": "white",
                        "background-color": "lightblue"
                    }
                }
            });
            Notify_1.notify("Jassi Debugger Chrome extension not installed. Click here to download.", { position: "right bottom", style: 'downloadlink', autoHideDelay: 7000 });
        }
        //on receiving messages from chrome extension
        onChromeMessage(event) {
            var _a;
            var _this = this;
            //console.log("Website received message: " + JSON.stringify(event.data));
            if (((_a = event === null || event === void 0 ? void 0 : event.data) === null || _a === void 0 ? void 0 : _a.event) === "onResourceContentCommitted") {
                _this.saveCode(event.data.url.url, event.data.data);
            }
            if (event.data.fromJassiExtension && event.data.connected) {
                installed = true;
                //clearTimeout(checkExtensionInstalled);
                if (jassijs.debugger !== undefined)
                    jassijs.debugger.destroy();
                jassijs.debugger = this;
            }
            if (event.data.fromJassiExtension && event.data.mid) {
                var test = this.responseList[event.data.mid];
                if (test) {
                    test(event);
                    delete this.responseList[event.data.mid];
                }
            }
        }
        //send message to chrome extension
        sendChromeMessage(msg, response = undefined) {
            msg.toJassiExtension = true;
            msg.mid = ChromeDebugger_1.mid++;
            if (response)
                this.responseList[msg.mid] = response;
            window.postMessage(msg, "*");
        }
        urlToFile(url) {
            var file = url;
            var wurl = window.location.href.split("/index.html")[0];
            file = file.replace(wurl + "/", "");
            file = file.split("?")[0];
            return file;
        }
        async saveCode(url, code) {
            //alert(code);
            var file = this.urlToFile(url);
            var filename = file.replace("$temp", "");
            var _this = this;
            //give the user the option to reload the changes in codeeditor
            var editor = Windows_1.default.findComponent("jassijs_editor.CodeEditor-" + filename);
            if (editor !== undefined) {
                if (editor._codeToReload === undefined) {
                    OptionDialog_1.OptionDialog.show("The source was updated in Chrome. Do you want to load this modification?", ["Yes", "No"], editor, false).then(function (data) {
                        if (data.button === "Yes")
                            editor.value = editor._codeToReload;
                        delete editor._codeToReload;
                    });
                }
                //remove temporary debugpoints
                if (file.indexOf("$temp") > -1) {
                    var reg = new RegExp("{var debug_editor.*debug_editor\\.addVariables\\(_variables_\\)\\;}");
                    var ret = reg.exec(code);
                    while (ret !== null) {
                        code = code.substring(0, ret.index) + code.substring(ret.index + ret[0].length);
                        ret = reg.exec(code);
                    }
                }
                editor._codeToReload = code;
            }
            if (file.indexOf("$temp") > -1) {
                return;
            }
            new Server_1.Server().saveFile(file, code).then(function () {
                Reloader_1.Reloader.instance.reloadJS(file.replace(".ts", ""));
                if (code.indexOf("jassijs.register(") > -1) {
                    jassijs.registry.reload();
                }
            });
        }
        /**
         * remove all breakpoints for the file
         * @param file
         */
        async removeBreakpointsForFile(file) {
            var bps = this.allBreakPoints[file];
            if (bps === undefined)
                return;
            while (bps.length > 0) {
                await this.breakpointChanged(file, Number(bps[0].split(":")[0]), Number(bps[0].split(":")[1]), false);
            }
        }
        /**
         * sets a breakpoint for debugging
         * @param {string} file
         * @param {number} line
         * @param {number} enable - if true then breakpoint is set if false then removed
         * @param {string} type - the type default undefined->stop debugging
         **/
        async breakpointChanged(file, line, column, enable, type = undefined) {
            if (!installed)
                ChromeDebugger_1.showHintExtensionNotInstalled();
            if (this.allBreakPoints[file] === undefined) {
                this.allBreakPoints[file] = [];
            }
            if (enable) {
                this.allBreakPoints[file].push(line + ":" + column);
            }
            else {
                var pos = this.allBreakPoints[file].indexOf(line + ":" + column);
                this.allBreakPoints[file].splice(pos, 1);
            }
            var _this = this;
            var newline = await new TSSourceMap_1.TSSourceMap().getLineFromTS(file, line, column);
            var ret = new Promise(function (resolve) {
                //http://localhost/jassijs/public_html/demo/TreeTable.js?bust=1551539152470
                var sfile = newline.jsfilename; //file.replace(".ts", ".js");
                var root = window.location.origin + window.location.pathname;
                root = root.substring(0, root.lastIndexOf("/"));
                var url = root + "/" + newline.jsfilename; //+"?bust="+window.jassiversion;
                if (newline.jsfilename.indexOf(":") > -1)
                    url = newline.jsfilename; //load module from js-file
                _this.sendChromeMessage({
                    name: "breakpointChanged",
                    url: url,
                    line: newline.line,
                    enable: enable,
                    condition: "1===1",
                    type: type
                }, (data) => {
                    resolve(data);
                });
            });
            return ret;
        }
        /**
        * add debugpoints in code
        * @param {[string]} lines - code
        * @param {Object.<number, boolean>} debugpoints - the debugpoints
        * @param {jassijs_editor.CodeEditor} codeEditor
        */
        addDebugpoints(lines, debugpoints, codeEditor) {
            //added directly
        }
        /**
         * report current variable scope
         * @param {numer} url - url of the script
         * @param {[Object.<string,object>]} variables
         */
        reportVariables(url, variables, type = undefined) {
            return;
            var file = this.urlToFile(url);
            var _this = this;
            var editor = jassijs.windows.findComponent("jassijs_editor.CodeEditor-" + file);
            if (editor !== undefined) {
                editor.addVariables(variables);
            }
        }
        destroy() {
            //	chrome.runtime.sendMessage(extensionId,{name: "disconnect"},undefined);
            this.destroyed = true;
        }
    };
    ChromeDebugger.mid = 0;
    ChromeDebugger = ChromeDebugger_1 = __decorate([
        Registry_4.$Class("jassijs_editor.ChromeDebugger"),
        __metadata("design:paramtypes", [])
    ], ChromeDebugger);
    exports.ChromeDebugger = ChromeDebugger;
    //if connected then this instance is registred to jassijs.debugger;
    new ChromeDebugger();
    window.postMessage({ toJassiExtension: true, name: "connect" }, "*");
    function test() {
        ChromeDebugger.showHintExtensionNotInstalled();
    }
    exports.test = test;
});
define("jassijs_editor/CodeEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_editor/CodePanel", "jassijs/ui/VariablePanel", "jassijs/ui/DockingContainer", "jassijs_editor/ErrorPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Classes", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_editor/AcePanel", "jassijs_editor/util/Typescript", "jassijs_editor/MonacoPanel", "jassijs/remote/Settings", "jassijs/remote/Test", "jassijs/base/CurrentSettings", "jassijs/base/Windows", "jassijs/ui/Notify"], function (require, exports, Registry_5, Panel_1, CodePanel_3, VariablePanel_1, DockingContainer_1, ErrorPanel_1, Button_1, Registry_6, Server_2, Reloader_2, Classes_1, Component_2, Property_1, AcePanel_2, Typescript_2, MonacoPanel_1, Settings_1, Test_1, CurrentSettings_1, Windows_2, Notify_2) {
    "use strict";
    var CodeEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CodeEditor = void 0;
    jassijs.includeCSSFile("jassijs_editor.css");
    let CodeEditorSettingsDescriptor = class CodeEditorSettingsDescriptor {
    };
    __decorate([
        Property_1.$Property({ chooseFrom: ["ace", "monaco", "aceOnBrowser"], default: "aceOnBrowser", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_DefaultEditor", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["vs-dark", "vs-light", "hc-black"], default: "vs-light", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_MoanacoEditorTheme", void 0);
    CodeEditorSettingsDescriptor = __decorate([
        Settings_1.$SettingsDescriptor(),
        Registry_5.$Class("jassijs_editor.CodeEditorSettingsDescriptor")
    ], CodeEditorSettingsDescriptor);
    /**
     * Panel for editing sources
     * @class jassijs_editor.CodeEditor
     */
    let CodeEditor = CodeEditor_1 = class CodeEditor extends Panel_1.Panel {
        constructor(properties = undefined) {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_1.Panel();
            this._codeToolbar = new Panel_1.Panel();
            //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let mobil = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            let sett = CurrentSettings_1.currentsettings.gets(Settings_1.Settings.keys.Development_DefaultEditor);
            if (properties === null || properties === void 0 ? void 0 : properties.codePanel) {
                this._codePanel = properties.codePanel;
            }
            else {
                CodePanel_3.CodePanel.typescript = Typescript_2.default;
                if (sett === "ace" || (mobil && (sett === "aceOnBrowser" || sett === undefined))) {
                    this._codePanel = new AcePanel_2.AcePanel();
                }
                else {
                    this._codePanel = new MonacoPanel_1.MonacoPanel();
                    // this._codePanel = new AcePanel(); 
                }
            }
            this._errors = new ErrorPanel_1.ErrorPanel();
            this._file = "";
            this.variables = new VariablePanel_1.VariablePanel();
            this._design = new Panel_1.Panel();
            this._init(properties === null || properties === void 0 ? void 0 : properties.hideToolbar);
            this.editMode = true;
        }
        _initCodePanel() {
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            this._codePanel.height = "calc(100% - 31px)";
            let _this = this;
            this._codePanel.onBreakpointChanged(function (line, column, enable, type) {
                jassijs.debugger.breakpointChanged(_this._file, line, column, enable, type);
            });
        }
        _init(hideToolbar) {
            var _this = this;
            this._initCodePanel();
            this._codeView["horizontal"] = true;
            if (hideToolbar !== true) {
                this._codeView.add(this._codeToolbar);
                this._codeToolbar["horizontal"] = true;
                this._codeToolbar.height = "30";
                var run = new Button_1.Button();
                run.icon = "mdi mdi-car-hatchback mdi-18px";
                run.tooltip = "Run(F4)";
                run.onclick(function () {
                    _this.evalCode();
                });
                this._codeToolbar.add(run);
                var save = new Button_1.Button();
                save.tooltip = "Save(Ctrl+S)";
                save.icon = "mdi mdi-content-save mdi-18px";
                save.onclick(function () {
                    _this.save();
                });
                this._codeToolbar.add(save);
                var undo = new Button_1.Button();
                undo.icon = "mdi mdi-undo mdi-18px";
                undo.tooltip = "Undo (Strg+Z)";
                undo.onclick(function () {
                    _this._codePanel.undo();
                });
                this._codeToolbar.add(undo);
                var goto = new Button_1.Button();
                goto.icon = "mdi mdi-ray-start-arrow mdi-18px";
                goto.tooltip = "Goto";
                goto.onclick(function () {
                    _this.gotoDeclaration();
                });
                this._codeToolbar.add(goto);
                this.autoCompleteButton = new Button_1.Button();
                this.autoCompleteButton.icon = "mdi mdi-robot-happy-outline mdi-18px";
                this.autoCompleteButton.tooltip = "autocomplete (ctrl space)";
                this.autoCompleteButton.onclick(function () {
                    _this._codePanel.autocomplete();
                });
                this._codeToolbar.add(this.autoCompleteButton);
                jassijs["$CodeEditor"] = CodeEditor_1;
                // $(goto.dom).attr("ondrop", "event.preventDefault();jassijs.$CodeEditor.search(event.dataTransfer.getData('text'));");
                //  $(goto.dom).attr("ondragover", "event.preventDefault();");
            }
            this._codeView.add(this._codePanel);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
            };
            /*var test = new Button();
            test.icon = "mdi mdi-bug mdi-18px";
            test.tooltip = "Test";
            test.onclick(function () {
                var kk = _this._main.layout;
            });
            this._codeToolbar.add(test);*/
            super.add(this._main);
            this._installView();
            this.registerKeys();
            this.variables.createTable();
            //   this._codePanel.setCompleter(this);
            setTimeout(() => {
                //_this.editorProvider="ace";
            }, 100);
        }
        static async addFilesToCompletion(filenames) {
            // await typescript.initService();
        }
        _installView() {
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this.variables, "Variables", "variables");
            this._main.add(this._design, "Design", "design");
            this._main.add(this._errors, "Errors", "errors");
            this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        /*set editorProvider(value: "ace" | "monaco") {
            if (value !== this.editorProvider) {
                //switch to new provider
                let pos = this.cursorPosition;
                let val = this.value;
                let old = this._codePanel;
                
                if (value === "ace") {
                    this._codePanel = new AcePanel();
                } else {
                    this._codePanel = new MonacoPanel();
                }
                this._initCodePanel();
                this._codeView.remove(old);
                this._codeView.add(this._codePanel);
                this.value=val;
                this.cursorPosition=pos;
                old.destroy();
            }
            
        }*/
        async _save(code) {
            var _a;
            await new Server_2.Server().saveFile(this._file, code);
            var f = this._file.replace(".tsx", "").replace(".ts", "");
            if ((_a = this._file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside/")) {
            }
            else {
                if (code.indexOf("@$") > -1) {
                    await Registry_6.default.reload();
                }
                await Reloader_2.Reloader.instance.reloadJS(f);
            }
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
            this._codePanel.gotoDeclaration();
        }
        /**
         * search text in classes at the given text
         * @param {string} text - the text to search
         * @returns {jassijs_editor.CodeEditor} - the editor instance
         */
        static async search(text) {
            //TODO ask typescript service
            /* var found = undefined;
             text = text.replaceAll("\r\n", "\n");
             var content = undefined;
             //Fast search
             for (var file in classes.getCache()) {
                 var fname = file.replaceAll(".", "/");
                 var cl = classes.getCache()[file];
                 var code = cl.toString().replaceAll("\r\n", "\n");
                 if (code.indexOf(text) > -1) {
                     found = fname + ".js";
                     content = code;
                     break;
                 }
             }
             if (found === undefined) {
                 //Deep search (slow)
                 var files = registry.getAllFilesForService("classes");
                 if (files !== undefined) {
                     for (var x = 0; x < files.length; x++) {
                         let code:string = await new Server().loadFile(files[x]);
                         code = code.replaceAll("\r\n", "\n");
                         if (code.indexOf(text) > -1) {
                             found = files[x];
                             content = code;
                         }
                     }
                 }
             }
             if (found !== undefined) {
                 var line = code.substring(0, content.indexOf(text)).split("\n").length + 1;
                 router.navigate("#do=jassijs_editor.CodeEditor&file=" + found + "&line=" + line.toString());
                 //                return await jassijs_editor.CodeEditor.open(found+":"+line.toString()+":0");
             }*/
            return undefined;
        }
        /**
         * manage shortcuts
         */
        registerKeys() {
            var _this = this;
            this._codePanel.dom.addEventListener("keydown", function (evt) {
                if (evt.keyCode === 115 && evt.shiftKey) { //F4
                    // var thiss=this._this._id;
                    // var editor = ace.edit(this._this._id);
                    _this.evalCode(true);
                    evt.preventDefault();
                    return false;
                }
                else if (evt.keyCode === 115) { //F4
                    _this.evalCode(false);
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                    _this.save();
                    evt.preventDefault();
                    return false;
                }
            });
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
        _evalToCursorReached() {
            if (this.__evalToCursorReached !== true)
                this._main.show('code');
            this.__evalToCursorReached = true;
        }
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addVariables(variables) {
            this.variables.addAll(variables);
        }
        async fillVariablesAndSetupParser(url, root, thecomponent, cache, parser, codePositions) {
            var _a, _b, _c, _d, _e, _f;
            var useThis = false;
            var connectedComponents = [thecomponent];
            if (thecomponent.__dom._thisOther)
                thecomponent.__dom._thisOther.forEach(e => connectedComponents.push(e));
            for (var i = 0; i < connectedComponents.length; i++) {
                var component = connectedComponents[i];
                if (cache[component._id] === undefined && component["__stack"] !== undefined && ((_a = component === null || component === void 0 ? void 0 : component.dom) === null || _a === void 0 ? void 0 : _a.classList) && !component.dom.classList.contains("designdummy")) {
                    var lines = (_b = component["__stack"]) === null || _b === void 0 ? void 0 : _b.split("\n");
                    for (var x = 0; x < lines.length; x++) {
                        var sline = lines[x];
                        if (sline.indexOf("$temp.js") > 0) {
                            var spl = sline.split(":");
                            var entr = {};
                            if (cache[component._id] === undefined)
                                cache[component._id] = [];
                            var data = {
                                line: Number(spl[spl.length - 2]),
                                column: Number(spl[spl.length - 1].replace(")", "")),
                                component: component,
                                pos: 0,
                                name: undefined
                            };
                            if (codePositions[data.line + "," + data.column] === undefined) { //we collect first position in the scourecode file
                                codePositions[data.line + "," + data.column] = data;
                            }
                            cache[component._id].push(data);
                        }
                    }
                }
            }
            if (this.file.toLocaleLowerCase().endsWith(".tsx")) {
                for (var x = 0; x < thecomponent.dom.children.length; x++) {
                    var ch = thecomponent.dom.children[x];
                    if (ch._this) {
                        this.fillVariablesAndSetupParser(url, root, ch._this, cache, parser, codePositions);
                    }
                }
            }
            else {
                if (thecomponent["_components"]) {
                    for (var x = 0; x < thecomponent["_components"].length; x++) {
                        this.fillVariablesAndSetupParser(url, root, thecomponent["_components"][x], cache, parser, codePositions);
                    }
                }
            }
            if (thecomponent === root) {
                //fertig
                var hh = 0;
                var TSSourceMap = await Classes_1.classes.loadClass("jassijs_editor.util.TSSourceMap");
                var values = [];
                //@ts-ignore
                Object.values(cache).forEach((e) => {
                    e.forEach(f => values.push(f));
                });
                var tmap = await new TSSourceMap().getLinesFromJS("js/" + url.replace(".tsx", ".js").replace(".ts", ".js"), values);
                for (var x = 0; x < tmap.length; x++) {
                    var val = values[x];
                    val.column = tmap[x].column;
                    val.line = tmap[x].line;
                    val.pos = this._codePanel.positionToNumber({
                        row: val.line,
                        column: val.column
                    });
                }
                //setupClasscope
                var foundscope;
                for (var xx = 0; xx < cache[root._id].length; xx++) {
                    foundscope = parser.getClassScopeFromPosition(this._codePanel.value, cache[root._id][xx].pos);
                    if (foundscope)
                        break;
                }
                var scope = [{ classname: (_c = root === null || root === void 0 ? void 0 : root.constructor) === null || _c === void 0 ? void 0 : _c.name, methodname: "layout" }];
                if (foundscope)
                    scope = [{ classname: (_d = root === null || root === void 0 ? void 0 : root.constructor) === null || _d === void 0 ? void 0 : _d.name, methodname: "layout" }, foundscope];
                if (this.file.toLowerCase().endsWith(".tsx")) {
                    values = Object.values(codePositions);
                    parser.parse(this._codePanel.value, undefined, values);
                    for (var x = 0; x < values.length; x++) {
                        this.variables.addVariable(values[x].name, values[x].component, false);
                    }
                    // this.variables.addVariable(sname, val.component, false);
                }
                else {
                    parser.parse(this._codePanel.value, scope);
                    //if layout is rendered and an other variable is assigned to this, then remove ths variable
                    if (parser.classes[(_e = root === null || root === void 0 ? void 0 : root.constructor) === null || _e === void 0 ? void 0 : _e.name] && parser.classes[(_f = root === null || root === void 0 ? void 0 : root.constructor) === null || _f === void 0 ? void 0 : _f.name].members["layout"]) {
                        useThis = true;
                        this.variables.addVariable("this", root);
                    }
                    for (var key in parser.data) {
                        var com = parser.data[key];
                        var _new_ = com["_new_"];
                        if (_new_) {
                            var pos = _new_[0].node.pos;
                            var end = _new_[0].node.end;
                            for (var x = 0; x < values.length; x++) {
                                var val = values[x];
                                if (val.pos >= pos && val.pos <= end) {
                                    val.name = key;
                                }
                            }
                        }
                    }
                    var ignoreVar = [];
                    for (var x = 0; x < values.length; x++) {
                        var val = values[x];
                        var sname = val.name;
                        var found = false;
                        this.variables.value.forEach((it) => {
                            if (it.name === sname)
                                found = true;
                        });
                        //sometimes does a constructor create other Components so we need the first one
                        if (found)
                            continue;
                        if (sname && this.variables.getObjectFromVariable(sname) === undefined) {
                            if (ignoreVar.indexOf(sname) === -1) {
                                if (useThis && root === val.component)
                                    ignoreVar.push(sname); //do nothing
                                else
                                    this.variables.addVariable(sname, val.component, false);
                            }
                        }
                    }
                }
                this.variables.updateCache();
                this.variables.update();
                // parser.parse(,)
            }
            return parser;
        }
        /**
         * load the right editor for the returned value
         */
        async _processEvalResult(ret, filename) {
            //_this.variables.addVariable("me", ret.me);
            var _this = this;
            _this.variables.updateCache();
            if (ret instanceof Component_2.Component && ret["reporttype"] === undefined) {
                //require(["jassijs_editor/ComponentDesigner", "jassijs_editor/util/Parser"], function () {
                //    var ComponentDesigner = classes.getClass("jassijs_editor.ComponentDesigner");
                //   var Parser = classes.getClass("jassijs_editor.base.Parser");
                var ComponentDesigner;
                if (this.file.toLowerCase().endsWith(".tsx"))
                    ComponentDesigner = await Classes_1.classes.loadClass("jassijs_editor.HtmlDesigner");
                else
                    ComponentDesigner = await Classes_1.classes.loadClass("jassijs_editor.ComponentDesigner");
                var Parser = await Classes_1.classes.loadClass("jassijs_editor.util.Parser");
                var parser = new Parser();
                // await _this.fillVariablesAndSetupParser(filename, ret, ret, {},parser);
                if (!((_this._design) instanceof ComponentDesigner)) {
                    _this._design = new ComponentDesigner();
                    _this._main.add(_this._design, "Design", "design");
                    _this._design["codeEditor"] = _this;
                }
                //@ts-ignore
                _this._design.connectParser(parser);
                var codePositions = {};
                await _this.fillVariablesAndSetupParser(filename, ret, ret, {}, parser, codePositions);
                _this._design.designedComponent = ret;
                _this._design.editDialog(true);
                //});
            }
            else if (ret["reportdesign"] !== undefined) {
                var Parser = await Classes_1.classes.loadClass("jassijs_editor.util.Parser");
                var ReportDesigner = await Classes_1.classes.loadClass("jassijs_report.designer.ReportDesigner");
                var ReportDesign = await Classes_1.classes.loadClass("jassijs_report.ReportDesign");
                if (!((_this._design) instanceof ReportDesigner)) {
                    _this._design = new ReportDesigner();
                    _this._main.add(_this._design, "Design", "design");
                    _this._design["codeEditor"] = _this;
                    parser = new Parser();
                    parser.classScope = undefined; // [{ classname: _this._design?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }];
                    //@ts-ignore
                    _this._design.connectParser(parser);
                }
                var rep = new ReportDesign();
                rep.design = Object.assign({}, ret.reportdesign);
                if (ret.value && rep.design.data === undefined)
                    rep.design.data = ret.value;
                else if (ret.data && rep.design.data === undefined)
                    rep.design.data = ret.data;
                if (ret.parameter && rep.design.parameter === undefined)
                    rep.design.parameter = ret.parameter;
                _this._design["designedComponent"] = rep;
                /*   require(["jassijs_report/ReportDesign"], function() {
                       var rd = classes.getClass("jassijs_report.ReportDesign");
                       let rep = rd["fromJSON"](ret);
                       
                       _this._design["designedComponent"] = rep;
                   });*/
            } /*else if (ret["reporttype"] !== undefined) {
                        require(["jassijs_report/designer/ReportDesigner"], function () {
                            var ReportDesigner = classes.getClass("jassijs_report.designer.ReportDesigner");
                            if (!((_this._design) instanceof ReportDesigner)) {
                                _this._design = new ReportDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                            }
                            _this._design["designedComponent"] = ret;
    
                 
                        });
                    }*/
        }
        async _evalCodeOnLoad(data) {
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            var breakpoints = _this._codePanel.getBreakpoints();
            var filename = "";
            if (_this._file.endsWith(".tsx"))
                filename = _this._file.replace(".tsx", "$temp.tsx");
            else
                filename = _this._file.replace(".ts", "$temp.ts");
            await jassijs.debugger.removeBreakpointsForFile(filename);
            for (var line in breakpoints) {
                if (breakpoints[line]) {
                    var row = lines[line].length;
                    await jassijs.debugger.breakpointChanged(filename, line, row, true, "debugpoint");
                }
            }
            var islocaldb = Classes_1.classes.getClass("jassijs_localserver.DBManager");
            if (islocaldb && code.indexOf("@$DBObject(") > -1) {
                islocaldb.destroyConnection();
            }
            //@ts-ignore
            if (data.test !== undefined || window.reportdesign) {
                //capure created Components
                function hook(name, component, react) {
                    var _a, _b;
                    if (name === "create") {
                        var ex = new Error();
                        if (((_a = ex === null || ex === void 0 ? void 0 : ex.stack) === null || _a === void 0 ? void 0 : _a.indexOf("$temp.js")) != -1) {
                            if (react === "React.createElement") {
                                if ((component === null || component === void 0 ? void 0 : component.props) === undefined)
                                    component.props = {};
                                component.props["__stack"] = ex.stack;
                            }
                            else {
                                //
                                if ((_b = component === null || component === void 0 ? void 0 : component.props) === null || _b === void 0 ? void 0 : _b["__stack"]) {
                                    component["__stack"] = component.props["__stack"];
                                    delete component.props["__stack"];
                                }
                                else
                                    component["__stack"] = ex.stack;
                            }
                        }
                    }
                }
                try {
                    Component_2.Component.onComponentCreated(hook);
                    var ret;
                    if (data.test) {
                        ret = await data.test(new Test_1.Test());
                    }
                    else {
                        //@ts-ignore
                        if (window.reportdesign) {
                            ret = {
                                //@ts-ignore
                                reportdesign: window.reportdesign
                            };
                        }
                        else {
                            Component_2.Component.offComponentCreated(hook);
                            return;
                        }
                    }
                    // Promise.resolve(ret).then(async function(ret) {
                    if (ret !== undefined) {
                        await this._processEvalResult(ret, filename);
                        // Component.offComponentCreated(hook);
                    }
                    //  });
                }
                finally {
                    Component_2.Component.offComponentCreated(hook);
                }
            }
        }
        async saveTempFile(file, code) {
            //@ts-ignore 
            var tss = await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); });
            //@ts-ignore 
            var settings = Object.assign({}, Typescript_2.Typescript.compilerSettings);
            settings["inlineSourceMap"] = true;
            settings["inlineSources"] = true;
            var files;
            if (this.file.endsWith(".tsx"))
                files = await tss.default.transpile(file + ".tsx", code, settings);
            else
                files = await tss.default.transpile(file + ".ts", code, settings);
            var codets = -1;
            var codemap = -1;
            var codejs = -1;
            for (var x = 0; x < files.fileNames.length; x++) {
                if (files.fileNames[x].endsWith(".ts") || files.fileNames[x].endsWith(".tsx")) {
                    codets = x;
                }
                if (files.fileNames[x].endsWith(".js.map")) {
                    codemap = x;
                }
                if (files.fileNames[x].endsWith(".js")) {
                    codejs = x;
                }
            }
            /*  var all = JSON.parse(files.contents[codemap]);
              all["sourcesContent"] = [files.contents[codets]];
              files.contents[codemap] = JSON.stringify(all);
              var b64 = btoa(unescape(encodeURIComponent(files.contents[codemap])));
              var pos = files.contents[codejs].indexOf("//" + "# sourceMappingURL=");
              files.contents[codejs] = files.contents[codejs].substring(0, pos);
              files.contents[codejs] = files.contents[codejs] + "//" + "# sourceMappingURL=data:application/json;charset=utf8;base64," + b64;
              */
            const channel = new MessageChannel();
            var ret = new Promise((res, rej) => {
                channel.port1.onmessage = (evt) => {
                    channel.port1.close();
                    res(evt);
                };
            });
            let abspath = location.origin + location.pathname;
            abspath = abspath.substring(0, abspath.lastIndexOf("/") + 1);
            navigator.serviceWorker.controller.postMessage({
                type: 'SAVE_FILE',
                filename: abspath + files.fileNames[codejs],
                code: files.contents[codejs]
            }, [channel.port2]);
            var test = await ret;
        }
        async evalServerside() {
            var code = this._codePanel.value;
            var testcode = await new Server_2.Server().loadFile(this.file);
            var hasModified = testcode !== code;
            if (hasModified) {
                Notify_2.notify("please save code before test", "error");
                return undefined;
            }
            var res = await new Server_2.Server().testServersideFile(this._file.substring(0, this._file.length - 3));
            return res;
        }
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
            var _a;
            this.__evalToCursorReached = false;
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            if ((_a = this.file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside/")) {
                var res = await this.evalServerside();
                await this._processEvalResult(res, undefined);
                return;
            }
            window["test"] = undefined;
            code = "";
            for (var x = 0; x < lines.length; x++) {
                code = code + lines[x] + "\n";
            }
            code = code;
            var _this = this;
            var tmp = new Date().getTime();
            var jsfile = _this._file.replace(".tsx", "").replace(".ts", "") + "$temp";
            //await new Server().saveFile("tmp/" + _this._file, code);
            //only local - no TS File in Debugger
            await this.saveTempFile(jsfile, code);
            //@ts-ignore
            window.reportdesign = undefined;
            try {
                requirejs.undef("js/" + jsfile + ".js");
            }
            catch (ex) { }
            ;
            var onload = function (data) {
                _this._evalCodeOnLoad(data).catch((err) => {
                    throw err;
                });
            };
            //await new Promise(resolve => setTimeout(resolve, 1000));
            //if this is the first save for the tmpfile then it fails - I dont know why, give it a second try
            //@ts-ignore
            require(["js/" + jsfile + ".js"], onload, /*error*/ function (err) {
                //console.log("reload");
                window.setTimeout(function () {
                    //@ts-ignore
                    require(["js/" + jsfile + ".js"], onload, function (err) {
                        throw err;
                    });
                }, 20);
            });
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
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        removeVariableInDesign(varname) {
            return this.variables.removeVariable(varname);
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
        setCursorPorition(position) {
            this.cursorPosition = this._codePanel.numberToPosition(position);
        }
        /**
        * @param {object} position - the current cursor position {row= ,column=}
        */
        set cursorPosition(cursor) {
            this._codePanel.cursorPosition = cursor;
        }
        get cursorPosition() {
            return this._codePanel.cursorPosition;
        }
        /**
         * @member {string} - title of the component
         */
        get title() {
            var _a;
            var s = this.file.split("/");
            s = s[s.length - 1];
            if ((_a = this.file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside"))
                s = s + "(s)";
            return s;
        }
        /**
        * @member {string} - the url to edit
        */
        set file(value) {
            this._file = value;
            this.openFile(value);
        }
        get file() {
            return this._file;
        }
        /**
        * goes to the line number
        * @param {object} value - the line number
        */
        set line(value) {
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
        get line() {
            return this.cursorPosition.row;
        }
        /**
         * open the file
         */
        async openFile(_file) {
            this._file = _file;
            var content = await new Server_2.Server().loadFile(this._file);
            this._codePanel.file = _file;
            this._codePanel.value = content;
            this._codePanel.width = "100%";
            //  this._codePanel.height="100%";
            this._main.update();
            if (this._line)
                this.line = this._line;
        }
        destroy() {
            this._codeView.destroy();
            this._codeToolbar.destroy();
            this._codePanel.destroy();
            this._errors.destroy();
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
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], CodeEditor.prototype, "file", null);
    __decorate([
        Property_1.$Property({ isUrlTag: true }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], CodeEditor.prototype, "line", null);
    CodeEditor = CodeEditor_1 = __decorate([
        Registry_5.$Class("jassijs_editor.CodeEditor"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditor);
    exports.CodeEditor = CodeEditor;
    async function test() {
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = "100%";
        editor.width = "100%";
        //await editor.openFile(url);
        editor.file = "$serverside/jassijs_report/TestServerreport.ts"; //"tests/TestDialog.ts";
        setTimeout(() => {
            editor.evalCode();
        }, 500);
        Windows_2.default.add(editor, editor.title);
        // debugger;
        // var k=await new Server().testServersideFile("$serverside/jassijs_report/TestServerreport");
    }
    exports.test = test;
    ;
});
//jassijs.myRequire(modul.css["jassijs_editor.css"]);
define("jassijs_editor/CodeEditorInvisibleComponents", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/Button", "jassijs/remote/Classes", "jassijs/ui/Image"], function (require, exports, Registry_7, Panel_2, Registry_8, Button_2, Classes_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditorInvisibleComponents = void 0;
    //import {CodeEditor} from "jassijs_editor/CodeEditor";//could be removed
    let CodeEditorInvisibleComponents = class CodeEditorInvisibleComponents extends Panel_2.Panel {
        constructor(codeeditor) {
            super();
            super.init('<span class="Panel" style="border:1px solid #ccc;"/>');
            /**
           * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
           * */
            this.codeeditor = codeeditor;
            this.layout();
        }
        layout() {
            this.update();
        }
        update() {
            var _this = this;
            while (_this._components.length > 0) {
                _this.remove(_this._components[0]);
            }
            var elements = _this.codeeditor.getVariablesForType("$isInivisibleComponent"); //InvisibleComponent);
            for (var x = 0; x < elements.length; x++) {
                var img = new Button_2.Button();
                var name = elements[x];
                img.tooltip = name;
                //                    img.height=24;
                //  img.width=24;
                img.text = name.startsWith("me.") ? name.substring(3) : name;
                var ob = _this.codeeditor.getObjectFromVariable(name);
                img.dom["ob"] = ob;
                img.onclick(function (evt) {
                    _this.codeeditor._design._propertyEditor.value = evt.currentTarget.ob;
                    var ac = evt.currentTarget.ob.extensionCalled;
                    if (ac !== undefined) {
                        evt.currentTarget.ob.extensionCalled({ componentDesignerInvisibleComponentClicked: { codeEditor: _this.codeeditor, designButton: img } });
                    }
                });
                var cn = Classes_2.classes.getClassName(ob);
                //search icon
                Registry_8.default.getJSONData("$UIComponent").then((regdata) => {
                    regdata.forEach(function (val) {
                        if (val.classname === cn) {
                            img.icon = val.params[0].icon;
                        }
                    });
                });
                _this.add(img);
            }
            /* if(entries===undefined)
                  return;
              for(var key in entries){
                  var entry=entries[key].data;
                  var img=new jassijs.ui.Image();
                  var name=entry[1].split("/");
                  name=name[name.length-1];
                  img.tooltip=name;
                  img.src=entry[2];
                  img.height=24;
                  img.width=24;
                  img.createFromType=entry[0];
                  _this._makeDraggable(img);
                  _this.add(img);
              }*/
        }
        /**
         * install the draggable
         * @param {jassijs.ui.Component} component
         */
        _makeDraggable(component) {
            var helper = new (Classes_2.classes.getClass(component.createFromType))();
            document.getElementById("jassitemp").removeChild(helper.domWrapper);
            $(component.dom).draggable({
                cancel: "false", revert: "invalid",
                appendTo: "body",
                helper: function (event) {
                    return $(helper.dom);
                }
                /*   drag:function(event,ui){
                       var mouse=event.target._this.dom.style.cursor;
                       if(mouse==="e-resize"||mouse==="s-resize"||mouse==="se-resize")
                           return false;
                       else
                           return true;
                   }*/
            });
        }
        destroy() {
            super.destroy();
        }
    };
    CodeEditorInvisibleComponents = __decorate([
        Registry_7.$Class("jassijs_editor.CodeEditorInvisibleComponents"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditorInvisibleComponents);
    exports.CodeEditorInvisibleComponents = CodeEditorInvisibleComponents;
});
define("jassijs_editor/CodePanel", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/ui/Notify"], function (require, exports, Registry_9, Panel_3, Router_1, Notify_3) {
    "use strict";
    var CodePanel_4;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodePanel = void 0;
    let CodePanel = CodePanel_4 = class CodePanel extends Panel_3.Panel {
        resize() {
        }
        undo() {
        }
        /**
         * breakpoint changed
         * @param {function} handler - function(line,enabled,type)
         */
        onBreakpointChanged(handler) {
            this.addEvent("breakpointChanged", handler);
        }
        /**
        * gets a list of all lines with breakpoint
        * @returns {Object.<number, boolean>}
        */
        getBreakpoints() {
            return undefined;
        }
        numberToPosition(pos) {
            return CodePanel_4.numberToPosition(this.file, pos, this.value);
            /*var ret = typescript.getLineAndCharacterOfPosition(this.file, pos);
            return {
                row: ret.line,
                column: ret.character
            };*/
        }
        static numberToPosition(file, pos, code) {
            if (code !== undefined)
                CodePanel_4.typescript.setCode(file, code);
            var ret = CodePanel_4.typescript.getLineAndCharacterOfPosition(file, pos);
            return {
                row: ret.line,
                column: ret.character
            };
        }
        positionToNumber(pos) {
            CodePanel_4.typescript.setCode(this.file, this.value);
            var ret = CodePanel_4.typescript.getPositionOfLineAndCharacter(this.file, {
                line: pos.row,
                character: pos.column
            });
            return ret;
        }
        static async getAutoimport(lpos, file, code) {
            //var lpos = this.positionToNumber(this.cursorPosition);
            //@ts-ignore
            var change = await CodePanel_4.typescript.getCodeFixesAtPosition(file, code, lpos, lpos, [2304]);
            if (change === undefined)
                return;
            for (let x = 0; x < change.length; x++) {
                if (change[x].changes[0].textChanges[0].newText === "const ") {
                    change.splice(x, 1);
                }
            }
            if (change.length > 0) {
                var entr = change[0].changes[0].textChanges[0];
                let insertPos = CodePanel_4.numberToPosition(file, entr.span.start, code);
                insertPos.row = insertPos.row - 1;
                //Bug duplicate insert {Kunde,Kunde}
                if (entr.newText.indexOf(",") > -1) {
                    var thisline = code.substring(1 + code.lastIndexOf("{", entr.span.start), code.indexOf("}", entr.span.start));
                    thisline = "*" + thisline.replaceAll(" ", "*").replaceAll("}", "*").replaceAll(",", "*") + "*";
                    var cl = entr.newText.split(",")[0];
                    if (thisline.indexOf("*" + cl + "*") > 0) {
                        return;
                    }
                }
                //relative to absolute
                var words = entr.newText.split("\"");
                var oldPath = words[1];
                var path = file.split("/");
                path.splice(-1, 1); //remove last
                if (oldPath !== undefined && oldPath.startsWith(".")) { //convert relative to absolute
                    if (oldPath.startsWith("./"))
                        oldPath = oldPath.substring(2);
                    while (oldPath.startsWith("../")) {
                        oldPath = oldPath.substring(3);
                        path.splice(-1, 1);
                    }
                    var newPath = "";
                    for (let x = 0; x < path.length; x++) {
                        newPath = newPath + path[x] + "/";
                    }
                    newPath = newPath + oldPath;
                    return {
                        text: words[0] + "\"" + newPath + "\"" + words[2],
                        pos: insertPos
                    };
                    //  this.insert(this.positionToNumber(insertPos), words[0] + "\"" + newPath + "\"" + words[2]);
                }
                else {
                    return {
                        text: entr.newText,
                        pos: insertPos
                    };
                    //this.insert(this.positionToNumber(insertPos), entr.newText);
                }
                // typescript.setCode(this.file, this.value);
            }
            return undefined;
        }
        /**
             * goes to the declaration under cursor
             */
        gotoDeclaration() {
            var pos = this.positionToNumber(this.cursorPosition);
            var test = this.numberToPosition(pos);
            if (!CodePanel_4.typescript.isInited(this.file)) {
                Notify_3.notify("please try later ... loading in progress", "info", { position: "bottom right" });
                return;
            }
            CodePanel_4.typescript.getDefinitionAtPosition(this.file, pos).then((def) => {
                var _a;
                if (def !== undefined && def.length > 0) {
                    var entr = def[0];
                    var file = (_a = entr.fileName) === null || _a === void 0 ? void 0 : _a.replace("file:///", "");
                    var p = entr.textSpan.start;
                    var newPos = CodePanel_4.numberToPosition(file, p, undefined);
                    var line = newPos.row;
                    Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
                }
            });
        }
    };
    CodePanel = CodePanel_4 = __decorate([
        Registry_9.$Class("jassijs_editor.CodePanel")
    ], CodePanel);
    exports.CodePanel = CodePanel;
});
define("jassijs_editor/ComponentDesigner", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/util/Resizer", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/ui/Repeater", "jassijs/ui/Button", "jassijs_editor/util/DragAndDropper", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes", "jassijs/ui/BoxPanel", "jassijs/ui/Databinder"], function (require, exports, Registry_10, Panel_4, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, Resizer_1, CodeEditorInvisibleComponents_1, Repeater_1, Button_3, DragAndDropper_1, ComponentDescriptor_1, Classes_3, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentDesigner = void 0;
    //import { Parser } from "./util/Parser";
    class ClipboardData {
        constructor() {
            this.varNamesToCopy = [];
            this.children = {};
            this.properties = {};
            this.types = {};
            this.allChilds = [];
        }
    }
    let ComponentDesigner = class ComponentDesigner extends Panel_4.Panel {
        constructor() {
            super();
            this._codeEditor = undefined;
            this._initDesign();
            this.editMode = true;
        }
        connectParser(parser) {
            this._propertyEditor.parser = parser;
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this.variables = this._codeEditor.variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(value, undefined);
            //   this._propertyEditor=new PropertyEditor(undefined);
            this._errors = this._codeEditor._errors;
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentPalette.service = "$UIComponent";
            this._componentExplorer = new ComponentExplorer_1.ComponentExplorer(value, this._propertyEditor);
            this._invisibleComponents = new CodeEditorInvisibleComponents_1.CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._codeEditor._codePanel.onblur(function (evt) {
                _this._propertyEditor.updateParser();
            });
            this.registerKeys();
        }
        get codeEditor() {
            return this._codeEditor;
        }
        _initDesign() {
            var _this = this;
            this._designToolbar = new Panel_4.Panel();
            this._designPlaceholder = new Panel_4.Panel();
            this.editButton = new Button_3.Button();
            this.editButton.icon = "mdi mdi-run mdi-18px";
            this.editButton.tooltip = "Test Dialog";
            this.editButton.onclick(function () {
                _this.editDialog(!_this.editMode);
            });
            this._designToolbar.add(this.editButton);
            this.saveButton = new Button_3.Button();
            this.saveButton.tooltip = "Save(Ctrl+S)";
            this.saveButton.icon = "mdi mdi-content-save mdi-18px";
            this.saveButton.onclick(function () {
                _this.save();
            });
            this._designToolbar.add(this.saveButton);
            /*  this.runButton = new Button();
              this.runButton.icon = "mdi mdi-car-hatchback mdi-18px";
              this.runButton.tooltip = "Run(F4)";
              this.runButton.onclick(function () {
                  _this.evalCode();
              });
              this._designToolbar.add(this.runButton);*/
            this.undoButton = new Button_3.Button();
            this.undoButton.icon = "mdi mdi-undo mdi-18px";
            this.undoButton.tooltip = "Undo (Strg+Z)";
            this.undoButton.onclick(function () {
                _this.undo();
            });
            this._designToolbar.add(this.undoButton);
            /*  var test=new Button();
             test.icon="mdi mdi-bug mdi-18px";
             test.tooltip="Test";
             test.onclick(function(){
                         //var kk=_this._codeView.layout;
             });
             this._designToolbar.add(test);*/
            this.lassoButton = new Button_3.Button();
            this.lassoButton.icon = "mdi mdi-lasso mdi-18px";
            this.lassoButton.tooltip = "Select rubberband";
            this.lassoButton.onclick(function () {
                var val = _this.lassoButton.toggle();
                _this._resizer.setLassoMode(val);
                _this._draganddropper.enableDraggable(!val);
                //_this._draganddropper.activateDragging(!val);
            });
            this._designToolbar.add(this.lassoButton);
            this.cutButton = new Button_3.Button();
            this.cutButton.icon = "mdi mdi-content-cut mdi-18px";
            this.cutButton.tooltip = "Cut selected Controls (Ctrl+Shift+X)";
            this.cutButton.onclick(function () {
                _this.cutComponent();
            });
            this._designToolbar.add(this.cutButton);
            this.copyButton = new Button_3.Button();
            this.copyButton.icon = "mdi mdi-content-copy mdi-18px";
            this.copyButton.tooltip = "Copy (Ctrl+Shift+C)";
            this.copyButton.onclick(function () {
                _this.copy();
            });
            this._designToolbar.add(this.copyButton);
            this.pasteButton = new Button_3.Button();
            this.pasteButton.icon = "mdi mdi-content-paste mdi-18px";
            this.pasteButton.tooltip = "Paste (Ctrl+Shift+V)";
            this.pasteButton.onclick(function () {
                _this.paste();
            });
            this._designToolbar.add(this.pasteButton);
            var box = new BoxPanel_1.BoxPanel();
            box.horizontal = true;
            this.inlineEditorPanel = new Panel_4.Panel();
            this.inlineEditorPanel._id = "i" + this.inlineEditorPanel._id;
            this.inlineEditorPanel.dom.setAttribute("id", this.inlineEditorPanel._id);
            this.inlineEditorPanel.dom.style.display = "inline";
            this.inlineEditorPanel.domWrapper.style.display = "inline";
            this.inlineEditorPanel.dom.classList.add("InlineEditorPanel");
            //   box.height=40;
            box.add(this._designToolbar);
            box.add(this.inlineEditorPanel);
            this.add(box);
            this._designPlaceholder.domWrapper.style.position = "relative";
            this.dummyHolder = document.createElement("span");
            this.__dom.append(this.dummyHolder);
            this.add(this._designPlaceholder);
        }
        /**
       * manage shortcuts
       */
        registerKeys() {
            var _this = this;
            this._codeEditor._design.dom.tabindex = "1";
            this._codeEditor._design.dom.addEventListener("keydown", function (evt) {
                if (evt.keyCode === 115 && evt.shiftKey) { //F4
                    // var thiss=this._this._id;
                    // var editor = ace.edit(this._this._id);
                    _this.evalCode(true);
                    evt.preventDefault();
                    return false;
                }
                else if (evt.keyCode === 115) { //F4
                    _this.evalCode(false);
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 90 && evt.ctrlKey) { //Ctrl+Z
                    _this.undo();
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 46 || (evt.keyCode === 88 && evt.ctrlKey && evt.shiftKey)) { //Del or Ctrl X)
                    _this.cutComponent();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) { //Ctrl+C
                    _this.copy();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) { //Ctrl+V
                    _this.paste();
                    evt.preventDefault();
                    return false;
                }
                if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                    _this.save();
                    event.preventDefault();
                    return false;
                }
            });
        }
        resize() {
            this._updateInvisibleComponents();
        }
        _installView() {
            this._codeEditor._main.add(this._propertyEditor, "Properties", "properties");
            this._codeEditor._main.add(this._componentExplorer, "Components", "components");
            this._codeEditor._main.add(this._componentPalette, "Palette", "componentPalette");
            this._codeEditor._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        _updateInvisibleComponents() {
            var _this = this;
            this._invisibleComponents.update();
        }
        _initComponentExplorer() {
            var _this = this;
            this._componentExplorer.onselect(function (data) {
                // console.log(_this._componentExplorer.selection);
                //  var ob = data.data;
                setTimeout(() => {
                    var sel = _this._componentExplorer.tree.selection;
                    if (sel.length === 1)
                        sel = sel[0];
                    _this._propertyEditor.value = sel;
                }, 10);
            });
            this._componentExplorer.getComponentName = function (item) {
                var varname = _this._codeEditor.getVariableFromObject(item);
                if (varname === undefined)
                    return;
                if (varname.startsWith("this."))
                    return varname.substring(5);
                return varname;
            };
        }
        /**
         * removes the selected component
         */
        async cutComponent() {
            var _a;
            var text = await this.copy();
            if (await navigator.clipboard.readText() !== text) {
                alert("could not copy to Clipboard.");
                return;
            }
            var clip = JSON.parse(text); //to Clipboard
            var all = [];
            for (var x = 0; x < clip.allChilds.length; x++) {
                var varname = clip.allChilds[x]; //this._codeEditor.getVariableFromObject(todel);
                var todel = this._codeEditor.getObjectFromVariable(varname);
                if (varname !== "this") {
                    if (((_a = todel === null || todel === void 0 ? void 0 : todel.domWrapper) === null || _a === void 0 ? void 0 : _a._parent) !== undefined) {
                        todel.domWrapper._parent.remove(todel);
                    }
                    all.push(varname);
                    this._propertyEditor.removeVariableInDesign(varname);
                }
            }
            this._propertyEditor.removeVariablesInCode(all);
            this._updateInvisibleComponents();
            this._componentExplorer.update();
        }
        copyProperties(clip, component) {
            var _a;
            var varname = this._codeEditor.getVariableFromObject(component);
            var parserdata = this._propertyEditor.parser.data[varname];
            clip.allChilds.push(varname);
            clip.types[varname] = Classes_3.classes.getClassName(component);
            if (!clip.properties[varname]) {
                clip.properties[varname] = {};
            }
            var editorfields = {};
            (_a = ComponentDescriptor_1.ComponentDescriptor.describe(component.constructor)) === null || _a === void 0 ? void 0 : _a.fields.forEach((f) => { editorfields[f.name] = f; });
            for (var key in parserdata) {
                if (editorfields[key] || key === "_new_" || key === "add") {
                    if (!clip.properties[varname][key]) {
                        clip.properties[varname][key] = [];
                    }
                    for (var i = 0; i < parserdata[key].length; i++) {
                        //only add fields in Propertydescriptor
                        clip.properties[varname][key].push(parserdata[key][i].value);
                    }
                }
            }
            if (component["_components"]) {
                for (var x = 0; x < component["_components"].length; x++) {
                    var childname = this._codeEditor.getVariableFromObject(component["_components"][x]);
                    if (childname) {
                        if (clip.children[varname] === undefined) {
                            clip.children[varname] = [];
                        }
                        clip.children[varname].push(childname);
                        this.copyProperties(clip, component["_components"][x]);
                    }
                }
            }
        }
        async copy() {
            var components = this._propertyEditor.value;
            if (!Array.isArray(components)) {
                components = [components];
            }
            var clip = new ClipboardData();
            clip.varNamesToCopy = [];
            for (var x = 0; x < components.length; x++) {
                var component = components[x];
                var varname = this._codeEditor.getVariableFromObject(component);
                clip.varNamesToCopy.push(varname);
                this.copyProperties(clip, component);
            }
            var text = JSON.stringify(clip);
            await navigator.clipboard.writeText(text);
            return text;
        }
        async pasteComponent(clip, target, before, varname, variablelistold, variablelistnew) {
            var _this = this;
            var created;
            if (clip.properties[varname] !== undefined && clip.properties[varname]["_new_"] !== undefined) {
                var vartype = clip.properties[varname]["_new_"][0];
                if (variablelistold.indexOf(varname) > -1)
                    return;
                vartype = vartype.split("(")[0].split("new ")[1];
                var targetname = _this._codeEditor.getVariableFromObject(target);
                var newcomp = { createFromType: clip.types[varname] };
                await Classes_3.classes.loadClass(clip.types[varname]);
                var svarname = varname.split(".")[varname.split(".").length - 1];
                created = _this.createComponent(clip.types[varname], newcomp, undefined, undefined, target, before, false, svarname);
                variablelistold.push(varname);
                var newvarname = _this._codeEditor.getVariableFromObject(created);
                variablelistnew.push(newvarname);
                //correct designdummy
                for (var t = 0; t < target._components.length; t++) {
                    var ch = target._components[t];
                    if (ch["type"] === "atEnd") {
                        target.remove(ch);
                        // target.add(ch);
                        break;
                    }
                }
            }
            else {
                //component is already created outside the code
                created = _this._codeEditor.getObjectFromVariable(varname);
            }
            if (clip.children[varname] !== undefined) {
                for (var k = 0; k < clip.children[varname].length; k++) {
                    await _this.pasteComponent(clip, created, undefined, clip.children[varname][k], variablelistold, variablelistnew);
                }
            }
            return created;
        }
        async paste() {
            var text = await navigator.clipboard.readText();
            var created;
            var clip = JSON.parse(text);
            var _this = this;
            var variablelistold = [];
            var variablelistnew = [];
            //create Components
            for (var x = 0; x < clip.varNamesToCopy.length; x++) {
                var varname = clip.varNamesToCopy[x];
                var target = _this._propertyEditor.value;
                if (target._components !== undefined)
                    await _this.pasteComponent(clip, target, undefined, varname, variablelistold, variablelistnew);
                else {
                    // if(x===0)
                    //    before=target;
                    await _this.pasteComponent(clip, target._parent, target, varname, variablelistold, variablelistnew);
                }
                //set properties
            }
            //in the new Text the variables are renamed
            var textnew = text;
            for (var x = 0; x < variablelistnew.length; x++) {
                var oldName = variablelistold[x];
                var newName = variablelistnew[x];
                if (oldName !== newName) {
                    var reg = new RegExp("\\W" + oldName + "\\W");
                    var found = true;
                    while (found == true) {
                        found = false;
                        textnew = textnew.replace(reg, function replacer(match, offset, string) {
                            // p1 is nondigits, p2 digits, and p3 non-alphanumerics
                            found = true;
                            return match.substring(0, 1) + newName + match.substring(match.length - 1, match.length);
                        });
                    }
                }
            }
            clip = JSON.parse(textnew);
            //set properties
            for (var x = 0; x < variablelistnew.length; x++) {
                var variablename = variablelistnew[x];
                for (var key in clip.properties[variablename]) {
                    if (key !== "_new_" && key !== "config" && key != "add") {
                        var propdata = clip.properties[variablename][key];
                        for (var v = 0; v < propdata.length; v++) {
                            var svalue = propdata[v];
                            var component = _this._codeEditor.getObjectFromVariable(variablename);
                            var argnames = [];
                            var args = [];
                            var allvars = _this.codeEditor.variables.value;
                            //introduce variables replace me.textbox1->me_textbox1
                            for (var vv = 0; vv < allvars.length; vv++) {
                                var newvarname = allvars[vv].name.replaceAll(".", "_");
                                svalue = svalue.replaceAll(allvars[vv].name, newvarname);
                                if (newvarname !== "this") {
                                    argnames.push(newvarname);
                                    args.push(allvars[vv].value);
                                }
                            }
                            try {
                                //set value in Designer
                                var realvalue = new Function(...argnames, "return (" + svalue + ");").bind(_this._codeEditor.getObjectFromVariable("this"))(...args);
                                if (typeof (component[key]) === "function") {
                                    component[key](realvalue);
                                }
                                else {
                                    component[key] = realvalue;
                                }
                            }
                            catch (_a) {
                            }
                            //_this._propertyEditor.setPropertyInDesign(key,value);
                            _this._propertyEditor.setPropertyInCode(key, propdata[v], propdata.length > 0, variablename, undefined, undefined, false);
                        }
                    }
                }
            }
            _this._propertyEditor.value = created;
            _this._propertyEditor.codeEditor.value = _this._propertyEditor.parser.getModifiedCode();
            _this._propertyEditor.updateParser();
            _this._propertyEditor.callEvent("codeChanged", {});
            //include the new element
            _this.editDialog(true);
            _this._componentExplorer.update();
            _this._updateInvisibleComponents();
        }
        /**
        * execute the current code
        * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
        *                              if false at the end of the layout() function or at the end of the code
        */
        evalCode(toCursor = undefined) {
            this._codeEditor.evalCode(toCursor);
        }
        /**
        * save the code to server
        */
        save() {
            this._codeEditor.save();
        }
        /**
         * undo action
         */
        undo() {
            this._codeEditor.undo();
        }
        getComponentIDsInDesign(component, collect) {
            collect.push("#" + component._id);
            var childs = component["_components"];
            if (childs !== undefined) {
                for (let x = 0; x < childs.length; x++) {
                    this.getComponentIDsInDesign(childs[x], collect);
                }
            }
        }
        createDragAndDropper() {
            return new DragAndDropper_1.DragAndDropper();
        }
        /**
         * dialog edit mode
         * @param {boolean} enable - if true allow resizing and drag and drop
         */
        editDialog(enable) {
            var _this = this;
            this.editMode = enable;
            this.editButton.toggle(!this.editMode);
            this.undoButton.hidden = !enable;
            this.lassoButton.hidden = !enable;
            this.cutButton.hidden = !enable;
            this.copyButton.hidden = !enable;
            this.pasteButton.hidden = !enable;
            var component = this._designPlaceholder._components[0];
            //switch designmode
            var comps = component.dom.querySelectorAll(".jcomponent");
            comps.forEach((c) => c.classList.add("jdesignmode"));
            for (var c = 0; c < comps.length; c++) {
                if (comps[c]._this["extensionCalled"] !== undefined) {
                    comps[c]._this["extensionCalled"]({
                        componentDesignerSetDesignMode: { enable, componentDesigner: this }
                    });
                    //comps[c]._this["setDesignMode"](enable,this);
                }
            }
            if (component["extensionCalled"] !== undefined) {
                component["extensionCalled"]({
                    componentDesignerSetDesignMode: { enable, componentDesigner: this }
                });
            }
            //if(component["setDesignMode"]!==undefined){
            //        component["setDesignMode"](enable,this);
            //    }
            this.variables.updateCache(); //variables can be added with Repeater.setDesignMode
            if (this._resizer !== undefined) {
                this._resizer.uninstall();
            }
            if (this._draganddropper !== undefined) {
                this._draganddropper.uninstall();
            }
            if (enable === true) {
                var _this = this;
                var allcomponents = this.variables.getEditableComponents(component);
                if (this._propertyEditor.codeEditor === undefined) {
                    var ret = [];
                    this.getComponentIDsInDesign(component, ret);
                    allcomponents = ret.join(",");
                }
                else
                    allcomponents = this.variables.getEditableComponents(component);
                //this._installTinyEditor();
                this._draganddropper = this.createDragAndDropper();
                this._resizer = new Resizer_1.Resizer();
                this._resizer.draganddropper = this._draganddropper;
                this._resizer.onelementselected = function (elementIDs, e) {
                    var ret = [];
                    for (var x = 0; x < elementIDs.length; x++) {
                        var ob = document.getElementById(elementIDs[x])._this;
                        if (ob["editorselectthis"])
                            ob = ob["editorselectthis"];
                        ret.push(ob);
                    }
                    if (ret.length === 1)
                        _this._propertyEditor.value = ret[0];
                    else if (ret.length > 0) {
                        _this._propertyEditor.value = ret;
                    }
                };
                this._resizer.onpropertychanged = function (comp, prop, value) {
                    if (_this._propertyEditor.value !== comp)
                        _this._propertyEditor.value = comp;
                    _this._propertyEditor.setPropertyInCode(prop, value + "", true);
                    _this._propertyEditor.value = _this._propertyEditor.value;
                };
                this._resizer.install(component, allcomponents);
                allcomponents = this.variables.getEditableComponents(component, true);
                if (this._draganddropper) {
                    this._draganddropper.install(component, allcomponents);
                    this._draganddropper.onpropertychanged = function (component, top, left, oldParent, newParent, beforeComponent) {
                        _this.moveComponent(component, top, left, oldParent, newParent, beforeComponent);
                    };
                    this._draganddropper.onpropertyadded = function (type, component, top, left, newParent, beforeComponent) {
                        _this.createComponent(type, component, top, left, newParent, beforeComponent);
                    };
                    this._draganddropper.isDragEnabled = function (event, ui) {
                        if (_this._resizer === undefined)
                            return false;
                        return _this._resizer.componentUnderCursor !== undefined;
                    };
                }
            }
            else {
            }
            this._componentExplorer.update();
        }
        /**
         * move a component
         * @param {jassijs.ui.Component} component - the component to move
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component move to
         * @param {jassijs.ui.Component} beforeComponent - insert the component before beforeComponent
         **/
        moveComponent(component, top, left, oldParent, newParent, beforeComponent) {
            var _this = this;
            /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor!==undefined){
                beforeComponent=undefined;
            }*/
            var oldName = _this._codeEditor.getVariableFromObject(oldParent);
            var newName = _this._codeEditor.getVariableFromObject(newParent);
            var compName = _this._codeEditor.getVariableFromObject(component);
            if (top !== undefined) {
                _this._propertyEditor.setPropertyInCode("x", top + "", true);
            }
            else {
                _this._propertyEditor.removePropertyInCode("x");
            }
            if (left !== undefined) {
                _this._propertyEditor.setPropertyInCode("y", left + "", true);
            }
            else {
                _this._propertyEditor.removePropertyInCode("y");
            }
            if (oldParent !== newParent || beforeComponent !== undefined || top === undefined) { //top=undefined ->on relative position at the end call the block
                //get Position
                var oldVal = _this._propertyEditor.removePropertyInCode("add", compName, oldName, false);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //designdummy atEnd
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", /*compName*/ oldVal, false, newName, before);
            }
            /* if(newParent._components.length>1){//correct dummy
                 var dummy=	newParent._components[newParent._components.length-2];
                 if(dummy.designDummyFor!==undefined){
                     //var tmp=newParent._components[newParent._components.length-1];
                     newParent.remove(dummy);//._components[newParent._components.length-1]=newParent._components[newParent._components.length-2];
                     newParent.add(dummy);//._components[newParent._components.length-1]=tmp;
                 }
             }*/
            _this.variables.updateCache();
            _this._propertyEditor.value = _this._propertyEditor.value;
            _this._componentExplorer.value = _this._componentExplorer.value;
        }
        /**
         * create a new component
         * @param {string} type - the type of the new component
         * @param {jassijs.ui.Component} component - the component themself
         * @param {number} top - the top absolute position
         * @param {number} left - the left absolute position
         * @param {jassijs.ui.Container} newParent - the new parent container where the component is placed
         * @param {jassijs.ui.Component} beforeComponent - insert the new component before beforeComponent
         **/
        createComponent(type, component, top, left, newParent, beforeComponent, doUpdate = true, suggestedName = undefined) {
            var _this = this;
            /*if(beforeComponent!==undefined&&beforeComponent.designDummyFor&&beforeComponent.type==="atEnd"){
                beforeComponent=undefined;
            }*/
            var file = type.replaceAll(".", "/");
            var stype = file.split("/")[file.split("/").length - 1];
            _this._propertyEditor.addImportIfNeeded(stype, file);
            var repeater = _this._hasRepeatingContainer(newParent);
            var scope = undefined;
            if (repeater !== undefined) {
                var repeatername = _this._codeEditor.getVariableFromObject(repeater);
                var test = _this._propertyEditor.parser.getPropertyValue(repeatername, "createRepeatingComponent");
                scope = { variablename: repeatername, methodname: "createRepeatingComponent" };
                if (test === undefined) {
                    var sfunc = "function(me:Me){\n\t" + repeatername + ".design.config({});\n}";
                    var vardatabinder = _this._propertyEditor.getNextVariableNameForType("jassijs.ui.Databinder");
                    if (!_this._propertyEditor.parser.getPropertyValue(repeatername, "config")) {
                        sfunc = "function(me:Me){\n\t\n}";
                    }
                    _this._propertyEditor.setPropertyInCode("createRepeatingComponent", sfunc, true, repeatername);
                    _this._propertyEditor.updateParser();
                    repeater.createRepeatingComponent(function (me) {
                        if (this._designMode !== true)
                            return;
                        //_this.variables.addVariable(vardatabinder,databinder);
                        _this.variables.updateCache();
                    });
                    /*var db=new jassijs.ui.Databinder();
                    if(repeater.value!==undefined&&repeater.value.length>0)
                        db.value=repeater.value[0];
                    _this.variables.add(vardatabinder,db);
                    _this.variables.updateCache();*/
                }
            }
            var varvalue;
            if (Classes_3.classes.getClassName(component) === type)
                varvalue = component;
            else
                varvalue = new (Classes_3.classes.getClass(type));
            var varname = _this.createVariable(type, scope, varvalue, suggestedName);
            if (this._propertyEditor.codeEditor !== undefined) {
                var newName = _this._codeEditor.getVariableFromObject(newParent);
                console.log("newName" + newName);
                console.log(newParent);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //Designdummy atEnd
                    //if(beforeComponent.type==="beforeComponent")
                    //   beforeComponent=beforeComponent.designDummyFor;
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", varname, false, newName, before, scope);
            }
            if (beforeComponent !== undefined) {
                newParent.addBefore(varvalue, beforeComponent);
            }
            else {
                newParent.add(varvalue);
            }
            /* if(newParent._components.length>1){//correct dummy
                 if(newParent._designDummy){
                     //var tmp=newParent._components[newParent._components.length-1];
                     newParent.dom.removeChild(newParent._designDummy.domWrapper)
                     newParent.dom.append(newParent._designDummy.domWrapper)
                 }
             }*/
            _this.variables.updateCache();
            //set initial properties for the new component
            if (component.createFromParam !== undefined) {
                for (var key in component.createFromParam) {
                    var val = component.createFromParam[key];
                    if (typeof val === 'string')
                        val = '"' + val + '"';
                    _this._propertyEditor.setPropertyInCode(key, val, true, varname);
                }
                $.extend(varvalue, component.createFromParam);
            }
            if (top !== undefined) {
                _this._propertyEditor.setPropertyInCode("x", top + "", true, varname);
                varvalue.x = top;
            }
            if (left !== undefined) {
                _this._propertyEditor.setPropertyInCode("y", left + "", true, varname);
                varvalue.y = left;
            }
            //notify componentdescriptor 
            var ac = varvalue.extensionCalled;
            if (ac !== undefined) {
                varvalue.extensionCalled({
                    componentDesignerComponentCreated: {
                        newParent: newParent
                    }
                });
            }
            if (doUpdate) {
                _this._propertyEditor.value = varvalue;
                //include the new element
                _this.editDialog(true);
                _this._componentExplorer.update();
                _this._updateInvisibleComponents();
            }
            return varvalue;
        }
        createVariable(type, scope, varvalue, suggestedName = undefined) {
            if (this._propertyEditor.codeEditor === undefined)
                return;
            var varname = this._propertyEditor.addVariableInCode(type, scope, suggestedName);
            /* if (varname.startsWith("me.") && this._codeEditor.getObjectFromVariable("me") !== undefined) {
                 var me = this._codeEditor.getObjectFromVariable("me");
                 me[varname.substring(3)] = varvalue;
             } else if (varname.startsWith("this.")) {
                 var th = this._codeEditor.getObjectFromVariable("this");
                 th[varname.substring(5)] = varvalue;
             } else*/
            this.variables.addVariable(varname, varvalue);
            return varname;
        }
        /**
         * is there a parent that acts a repeating container?
         **/
        _hasRepeatingContainer(component) {
            if (component === undefined)
                return undefined;
            if (this._codeEditor.getVariableFromObject(component) === undefined)
                return undefined;
            if (component instanceof Repeater_1.Repeater) {
                return component;
            }
            return this._hasRepeatingContainer(component._parent);
        }
        fillVariables(root, component, cache) {
            var _a;
            if (cache[component._id] === undefined && component["__stack"] !== undefined) {
                var lines = (_a = component["__stack"]) === null || _a === void 0 ? void 0 : _a.split("\n");
                for (var x = 0; x < lines.length; x++) {
                    var sline = lines[x];
                    if (sline.indexOf("$temp.js") > 0) {
                        var spl = sline.split(":");
                        var entr = {};
                        cache[component._id] = {
                            line: Number(spl[spl.length - 2]),
                            column: Number(spl[spl.length - 1].replace(")", ""))
                        };
                        break;
                    }
                }
                if (component["_components"]) {
                    for (var x = 0; x < component["_components"].length; x++) {
                        this.fillVariables(root, component["_components"][x], cache);
                    }
                }
                if (component === root) {
                    //fertig
                    var hh = 0;
                }
            }
        }
        createPreDummy() {
            var _this = this;
            var dummy;
            //  if (ComponentDesigner.beforeDummy === undefined) {
            dummy = document.createElement("span");
            dummy.contentEditable = "false";
            dummy.draggable = true;
            dummy.classList.add("_dummy_");
            dummy.onclick = (ev) => console.log(ev);
            dummy.ondrop = (ev) => {
                ev.preventDefault();
                var data = ev.dataTransfer.getData("text");
                if (data.indexOf('"createFromType":') > -1) {
                    var toCreate = JSON.parse(data);
                    var cl = Classes_3.classes.getClass(toCreate.createFromType);
                    var newComponent = new cl();
                    var beforeComponent = ev.target.nd._this;
                    var newParent = beforeComponent._parent;
                    _this.createComponent(toCreate.createFromType, newComponent, undefined, undefined, newParent, beforeComponent); // beforeComponent);
                    _this.updateDummies();
                }
            };
            dummy.ondragover = (ev) => ev.preventDefault();
            dummy.ondragstart = ev => {
                ev.dataTransfer.setDragImage(event.target.nd, 20, 20);
                ev.dataTransfer.setData("text", "Hallo");
            };
            dummy.style.zIndex = "10000";
            dummy.style.backgroundColor = "rgba(245,234,39,0.6)";
            dummy.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            dummy.style.fontSize = "7px";
            dummy.style.position = "absolute";
            dummy.onmouseenter = (e) => {
                e.target.nd._sicbgc_ = e.target.nd.style.backgroundColor;
                e.target.nd.style.backgroundColor = "rgba(245,234,39,0.2)";
            };
            dummy.onmouseleave = (e) => e.target.nd.style.backgroundColor = e.target.nd._sicbgc_;
            //   ComponentDesigner.beforeDummy = dummy;
            // }
            // dummy = ComponentDesigner.beforeDummy.cloneNode(true);
            return dummy;
        }
        createPostDummy() {
            var _this = this;
            var dummy;
            //  if (ComponentDesigner.beforeDummy === undefined) {
            dummy = document.createElement("span");
            dummy.contentEditable = "false";
            dummy.draggable = true;
            dummy.classList.add("_dummy_");
            dummy.classList.add("ui-droppable");
            //dummy.onclick = (ev) => console.log(ev);
            dummy.ondrop = (ev) => {
                ev.preventDefault();
                var data = ev.dataTransfer.getData("text");
                if (data.indexOf('"createFromType":') > -1) {
                    var toCreate = JSON.parse(data);
                    var cl = Classes_3.classes.getClass(toCreate.createFromType);
                    var newComponent = new cl();
                    var newParent = ev.target.nd._this;
                    _this.createComponent(toCreate.createFromType, newComponent, undefined, undefined, newParent, undefined); // beforeComponent);
                    _this.updateDummies();
                }
            };
            dummy.ondragover = (ev) => {
                ev.preventDefault();
                //  ev.dataTransfer.dropEffect = "move";
            }; /*
            dummy.ondragstart = ev => {
                ev.dataTransfer.setDragImage((<any>event.target).nd, 20, 20);
                ev.dataTransfer.setData("text", "Hallo");
            }*/
            dummy.style.zIndex = "10000";
            dummy.style.backgroundColor = "rgba(56, 146, 232, 0.2)";
            dummy.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
            dummy.style.fontSize = "30px";
            dummy.style.position = "absolute";
            dummy.onmouseenter = (e) => {
                e.target.nd._sicbgc_ = e.target.nd.style.backgroundColor;
                e.target.nd.style.backgroundColor = "rgba(56, 146, 232, 0.2)";
            };
            dummy.onmouseleave = (e) => e.target.nd.style.backgroundColor = e.target.nd._sicbgc_;
            //   ComponentDesigner.beforeDummy = dummy;
            // }
            // dummy = ComponentDesigner.beforeDummy.cloneNode(true);
            return dummy;
        }
        insertDummies(node, root, arr, rootRect) {
            var _a;
            if (node._dummyholder === true)
                return;
            if (root === undefined)
                root = node;
            //only elements with varaiables can have dummies
            var varname = this._codeEditor.getVariableFromObject(node._this);
            var comp = node._this;
            if (!varname && node._thisOther) {
                for (var x = 0; x < node._thisOther.length; x++) {
                    varname = this._codeEditor.getVariableFromObject(node._thisOther[x]);
                    if (varname) {
                        comp = node._thisOther[x];
                        break;
                    }
                }
            }
            if (!varname) {
                if (node.contentEditable !== "false")
                    node.contentEditable = "false";
                return;
            }
            var hasChildren = false;
            var desc = ComponentDescriptor_1.ComponentDescriptor.describe(comp.constructor);
            var fnew = desc.findField("children");
            if (fnew) {
                hasChildren = true;
            }
            if (node.getClientRects === undefined)
                return;
            var rect = node.getClientRects()[0];
            if (rect === undefined)
                return;
            rect = {
                left: rect.left - rootRect.left + window.scrollX,
                top: rect.top - rootRect.top + window.scrollY,
                right: rect.right - rootRect.left + window.scrollX,
                bottom: rect.bottom - rootRect.top + window.scrollY
            };
            if ((_a = node) === null || _a === void 0 ? void 0 : _a.nd)
                return;
            var preDummy = node._preDummy_;
            if (!node._preDummy_) {
                preDummy = this.createPreDummy();
                preDummy.nd = node;
                preDummy.title = node.outerHTML;
                node._preDummy_ = preDummy;
                arr.push(preDummy);
            }
            var newTop = rect.top;
            var newLeft = rect.left;
            node.myTop = rect.top;
            node.myLeft = rect.left;
            if (node.parentNode._preDummy_) {
                const rp = {
                    top: node.parentNode.myTop,
                    left: node.parentNode.myLeft,
                };
                if (rect.top > rp.top - 5 && rect.top < rp.top + 5 && rect.left > rp.left - 5 && rect.left < rp.left + 5) {
                    newLeft = parseInt(node.parentNode._preDummy_.style.left.replace("px", "")) + 8;
                }
            }
            preDummy.style.top = newTop + "px";
            preDummy.style.left = newLeft + "px";
            if (hasChildren) {
                var postDummy = node._postDummy_;
                if (!node._postDummy_) {
                    postDummy = this.createPostDummy();
                    postDummy.nd = node;
                    postDummy.title = node.outerHTML;
                    node._postDummy_ = postDummy;
                    arr.push(postDummy);
                }
                var newBottom = rect.bottom;
                var newRight = rect.right;
                node.myBottom = rect.bottom;
                node.myRight = rect.right;
                if (node.parentNode._postDummy_) {
                    const rp = {
                        bottom: node.parentNode.newBottom,
                        right: node.parentNode.newRight,
                    };
                    if (rect.bottom > rp.bottom - 5 && rect.bottom < rp.bottom + 5 && rect.right > rp.right - 5 && rect.right < rp.right + 5) {
                        newRight = parseInt(node.parentNode._postDummy_.style.left.replace("px", "")) - 8;
                    }
                }
                postDummy.style.top = (newBottom - 8) + "px";
                postDummy.style.left = (newRight - 8) + "px";
            }
            for (var x = 0; x < node.childNodes.length; x++) {
                if (node._this !== node.childNodes[x]._this) //Wrapper
                    this.insertDummies(node.childNodes[x], root, arr, rootRect);
            }
        }
        /**
         * @member {jassijs.ui.Component} - the designed component
         */
        set designedComponent(component) {
            this.fillVariables(component, component, {});
            var com = component;
            if (com["isAbsolute"] !== true && com.width === "0" && com.height === "0") {
                component.width = "calc(100% - 1px)";
                component.height = "calc(100% - 1px)";
            }
            if (this._codeEditor.__evalToCursorReached !== true) {
                this._codeEditor._main.show("design");
            }
            if (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], true);
            this._designPlaceholder.add(component);
            // 
            this._propertyEditor.updateParser();
            this.editDialog(this.editMode === undefined ? true : this.editMode);
            this._componentExplorer.value = component;
            this.dom.focus();
            this._updateInvisibleComponents();
            while (this.inlineEditorPanel.dom.firstChild) {
                this.inlineEditorPanel.dom.firstChild.remove();
            }
            this.updateDummies();
            //var parser=new jassijs.ui.PropertyEditor.Parser();
            //parser.parse(_this.value);
        }
        updateDummies() {
            var arr = [];
            var component = this.designedComponent; //this._componentExplorer.value;
            if (this._lastComponent !== component) { //delete dummies if the designedComponent has changed
                //if((<any>this.dom).dummyholder)
                //  (<any>this.dom).dummyholder.innerHTML="";
                this.dummyHolder.innerHTML = ""; //delete all
                this._lastComponent = component;
            }
            /* if ((<any>this.dom).dummyholder === undefined) {
                 (<any>this.dom).dummyholder = document.createElement("span");
                 (<any>this.dom).dummyholder._dummyholder = true;
                 this.dom.prepend((<any>component.dom).dummyholder);
             }*/
            this.insertDummies(component.dom, this.dummyHolder, arr, this.dom.getClientRects()[0]);
            this.dummyHolder.append(...arr);
            component.dom.contentEditable = "true";
            this._designPlaceholder.domWrapper.contentEditable = "false";
            this._designPlaceholder.dom.contentEditable = "false";
        }
        get designedComponent() {
            return this._designPlaceholder._components[0];
        }
        destroy() {
            var _a, _b, _c, _d;
            if (this._resizer !== undefined) {
                this._resizer.uninstall();
            }
            if (this._draganddropper !== undefined) {
                this._draganddropper.isDragEnabled = undefined;
                this._draganddropper.uninstall();
            }
            (_a = this._propertyEditor) === null || _a === void 0 ? void 0 : _a.destroy();
            (_b = this._componentPalette) === null || _b === void 0 ? void 0 : _b.destroy();
            (_c = this._componentExplorer) === null || _c === void 0 ? void 0 : _c.destroy();
            (_d = this._invisibleComponents) === null || _d === void 0 ? void 0 : _d.destroy();
            super.destroy();
        }
    };
    ComponentDesigner = __decorate([
        Registry_10.$Class("jassijs_editor.ComponentDesigner"),
        __metadata("design:paramtypes", [])
    ], ComponentDesigner);
    exports.ComponentDesigner = ComponentDesigner;
    async function test() {
        return new ComponentDesigner();
    }
    exports.test = test;
    ;
});
define("jassijs_editor/ComponentExplorer", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/ui/ComponentDescriptor", "jassijs/ui/ContextMenu", "jassijs/ui/PropertyEditor", "jassijs/remote/Classes"], function (require, exports, Registry_11, Panel_5, Tree_1, ComponentDescriptor_2, ContextMenu_1, PropertyEditor_2, Classes_4) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentExplorer = void 0;
    let ComponentExplorer = class ComponentExplorer extends Panel_5.Panel {
        /**
        * edit object properties
        */
        constructor(codeEditor, propertyEditor) {
            super();
            /** @member {jassijs_editor.CodeEditor} - the parent CodeEditor */
            this.codeEditor = codeEditor;
            this.tree = new Tree_1.Tree();
            this.tree.height = "100%";
            this.contextMenu = new ContextMenu_1.ContextMenu();
            this.add(this.contextMenu);
            this.layout();
            this.propertyEditor = propertyEditor;
        }
        /**
         * @member {jassijs.ui.Component}  - the rendered object
         */
        set value(value) {
            this._value = value;
            this.tree.items = (value === undefined ? [] : value);
            this.tree.expandAll();
        }
        get value() {
            return this._value;
        }
        /**
         * get the displayname of the item
         * must be override
         * @param {object} item
         */
        getComponentName(item) {
            return item;
        }
        /**
         * get the child components
         * must be override
         * @param {object} item
         */
        getComponentChilds(item) {
            var _a;
            if (this.codeEditor === undefined)
                return this.getComponentChildsOld(item);
            if (item === undefined)
                return [];
            var ret = [];
            if ((_a = item.dom) === null || _a === void 0 ? void 0 : _a.childNodes) {
                for (var x = 0; x < item.dom.childNodes.length; x++) {
                    var nd = item.dom.childNodes[x];
                    var varname = this.codeEditor.getVariableFromObject(nd._this);
                    if (varname)
                        ret.push(nd._this);
                }
            }
            return ret;
        }
        getComponentChildsOld(item) {
            if (item === undefined)
                return [];
            if (item === this.value && item._components) {
                var all = [];
                item._components.forEach((e) => {
                    if (!e["designDummyFor"])
                        all.push(e);
                });
                return all;
            }
            var comps = ComponentDescriptor_2.ComponentDescriptor.describe(item.constructor).resolveEditableComponents(item);
            var ret = [];
            for (var name in comps) {
                var comp = comps[name];
                if (comp === undefined)
                    continue;
                var complist = comp._components;
                if (name !== "this" && this.getComponentName(comp) !== undefined) {
                    if (ret.indexOf(comp) === -1)
                        ret.push(comp);
                }
                if (complist !== undefined) {
                    for (var y = 0; y < complist.length; y++) {
                        if (this.getComponentName(complist[y]) !== undefined) {
                            if (ret.indexOf(complist[y]) === -1)
                                ret.push(complist[y]);
                        }
                    }
                }
            }
            return ret;
        }
        layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            this.tree.propChilds = function (item) {
                return _this.getComponentChilds(item);
            };
            this.tree.propDisplay = function (item) {
                return _this.getComponentName(item);
            };
            this.contextMenu.getActions = async function (data) {
                var ret = [];
                var parent = data[0]._parent;
                if (parent !== undefined && parent._components !== undefined) {
                    var hasDummy = (parent._components[parent._components.length - 1]["designDummyFor"] !== undefined ? 1 : 0);
                    if ((parent._components.length > 1 + hasDummy) && parent._components.indexOf(data[0]) !== 0) {
                        var ac = {
                            call: function () {
                                _this.propertyEditor.swapComponents(parent._components[parent._components.indexOf(data[0]) + -1], data[0]);
                                _this.tree.items = _this.tree.items;
                                _this.tree.value = data[0];
                            },
                            name: "move up"
                        };
                        ret.push(ac);
                    }
                    if (parent._components.length > 1 + hasDummy &&
                        parent._components.indexOf(data[0]) + hasDummy + 1 < parent._components.length) {
                        var ac = {
                            call: function () {
                                _this.propertyEditor.swapComponents(data[0], parent._components[parent._components.indexOf(data[0]) + 1]);
                                _this.tree.items = _this.tree.items;
                                _this.tree.value = data[0];
                            },
                            name: "move down"
                        };
                        ret.push(ac);
                    }
                }
                return ret;
            };
            this.tree.contextMenu = this.contextMenu;
            this.add(this.tree);
        }
        update() {
            this.value = this.value;
        }
        onselect(handler) {
            this.tree.onselect(handler);
        }
        onclick(handler) {
            this.tree.addEvent("click", handler);
        }
        destroy() {
            this._value = undefined;
            super.destroy();
        }
    };
    ComponentExplorer = __decorate([
        Registry_11.$Class("jassijs_editor.ComponentExplorer"),
        __metadata("design:paramtypes", [Object, typeof (_a = typeof PropertyEditor_2.PropertyEditor !== "undefined" && PropertyEditor_2.PropertyEditor) === "function" ? _a : Object])
    ], ComponentExplorer);
    exports.ComponentExplorer = ComponentExplorer;
    async function test() {
        var dlg = new ComponentExplorer(undefined, undefined);
        dlg.getComponentName = function (item) {
            return Classes_4.classes.getClassName(item);
        };
        dlg.value = dlg;
        return dlg;
    }
    exports.test = test;
});
define("jassijs_editor/ComponentPalette", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Image", "jassijs/remote/Registry", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Registry_12, Panel_6, Image_1, Registry_13, Classes_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentPalette = void 0;
    let ComponentPalette = class ComponentPalette extends Panel_6.Panel {
        constructor() {
            super();
            this.layout();
        }
        layout() {
        }
        /**
         * @member {string} - the service where the palette-items are registred
         **/
        set service(value) {
            var _this = this;
            this._service = value;
            while (this._components.length > 0) {
                this.remove(this._components[0]);
            }
            Registry_13.default.getJSONData(this._service).then((jdata) => {
                for (var x = 0; x < jdata.length; x++) {
                    var mdata = jdata[x];
                    var data = mdata.params[0];
                    if (data.fullPath === undefined || data.fullPath === "undefined")
                        continue;
                    var img = new Image_1.Image();
                    var name = data.fullPath.split("/");
                    var sname = name[name.length - 1];
                    img.tooltip = sname;
                    img.src = data.icon === undefined ? "mdi mdi-chart-tree mdi-18px" : data.icon + (data.icon.startsWith("mdi") ? " mdi-18px" : "");
                    //img.height = 24;
                    //img.width = 24;
                    img["createFromType"] = mdata.classname;
                    img["createFromParam"] = data.initialize;
                    _this._makeDraggable(img);
                    _this.add(img);
                }
                /*   for (var x = 0; x < jdata.length; x++) {
                       var mdata = jdata[x];
                       var data: UIComponentProperties = mdata.params[0];
                       if (data.fullPath === undefined || data.fullPath === "undefined")
                           continue;
                       var img = new Image();
                       var name = data.fullPath.split("/");
                       var sname = name[name.length - 1];
                       img.tooltip = sname;
                       img.dom.style.color = "blue";
                       img.src = data.icon === undefined ? "mdi mdi-chart-tree mdi-18px" : data.icon + (data.icon.startsWith("mdi") ? " mdi-18px" : "");
                       //img.height = 24;
                       //img.width = 24;
                       img["createFromType"] = mdata.classname;
                       img["createFromParam"] = data.initialize;
                       _this._makeDraggable2(img);
                       _this.add(img);
                   }*/
            });
            Registry_13.default.loadAllFilesForService(this._service).then(function () {
                Registry_13.default.getData(_this._service).forEach(function (mdata) {
                    var data = mdata.params[0];
                    var img = new Image_1.Image();
                    var name = data.fullPath.split("/");
                    var sname = name[name.length - 1];
                    img.tooltip = sname;
                    img.src = data.icon === undefined ? "res/unknowncomponent.png" : data.icon;
                    img.height = 24;
                    img.width = 24;
                    img["createFromType"] = Classes_5.classes.getClassName(mdata.oclass);
                    img["createFromParam"] = data.initialize;
                    _this._makeDraggable(img);
                    _this.add(img);
                });
            });
        }
        get service() {
            return this._service;
        }
        /**
         * install the draggable
         * @param {jassijs.ui.Image} component
         */
        _makeDraggable(component) {
            var helper = undefined;
            $(component.dom).draggable({
                cancel: "false", revert: "invalid",
                appendTo: "body",
                helper: function (event) {
                    if (helper === undefined) {
                        var cl = Classes_5.classes.getClass(component.createFromType);
                        if (cl === undefined) {
                            Classes_5.classes.loadClass(component.createFromType); //for later
                            cl = Panel_6.Panel;
                        }
                        helper = new cl();
                        var img = new Image_1.Image();
                        img.src = component.src;
                        img.height = "24";
                        img.width = "24";
                        img.x = component.x;
                        img.y = component.y;
                        helper._position = img;
                        component._helper = helper;
                        if (component.createFromParam !== undefined) {
                            $.extend(helper, component.createFromParam);
                        }
                        document.getElementById("jassitemp").removeChild(helper.domWrapper);
                        document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
                    }
                    return helper._position.dom;
                }
            });
        }
        _makeDraggable2(component) {
            var helper = undefined;
            var cl = Classes_5.classes.getClass(component.createFromType);
            if (cl === undefined) {
                Classes_5.classes.loadClass(component.createFromType); //for later
                cl = Panel_6.Panel;
            }
            /*   var img = new Image();
               (<any>img).native=true;
               img.src = component.src;
               img.dom.style.color = "blue";
               img.height = "24";
               img.width = "24";
               img.x = component.x;
               img.y = component.y;*/
            component.dom.draggable = true;
            component.dom.ondragstart = ev => {
                /*    helper = new cl();
                    var img = new Image();
                    img.src = component.src;
                    img.height = "24";
                    img.width = "24";
                    img.x = component.x;
                    img.y = component.y;
                    helper._position = img;
                    component._helper = helper;
                    if (component.createFromParam !== undefined) {
                        $.extend(helper, component.createFromParam);
                    }*/
                //  ev.dataTransfer.setDragImage(img.dom, 20, 20);
                ev.dataTransfer.setData("text", JSON.stringify({
                    createFromType: component["createFromType"],
                    createFromParam: component["createFromParam"]
                }));
                //document.getElementById("jassitemp").removeChild(helper.domWrapper);
                //document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
            };
            //helper._position = img;
            //component._helper = helper;
            // if (component.createFromParam !== undefined) {
            //   $.extend(helper, component.createFromParam);
            //  }
            /* $(component.dom).draggable({
                 cancel: "false", revert: "invalid",
     
                 appendTo: "body",
                 helper: function (event) {
                     if (helper === undefined) {
                         var cl = classes.getClass(component.createFromType);
                         if (cl === undefined) {
                             classes.loadClass(component.createFromType);//for later
                             cl = Panel;
                         }
                         helper = new cl();
                         var img = new Image();
                         img.src = component.src;
                         img.height = "24";
                         img.width = "24";
                         img.x = component.x;
                         img.y = component.y;
                         helper._position = img;
                         component._helper = helper;
                         if (component.createFromParam !== undefined) {
                             $.extend(helper, component.createFromParam);
                         }
                         document.getElementById("jassitemp").removeChild(helper.domWrapper);
                         document.getElementById("jassitemp").removeChild(helper._position.domWrapper);
                     }
                     return helper._position.dom;
                 }
             });*/
        }
        destroy() {
            for (var x = 0; x < this._components.length; x++) {
                var comp = this._components[x];
                if (comp.native !== true) {
                    $(comp.dom).draggable({});
                    $(comp.dom).draggable("destroy");
                    if (comp["_helper"] !== undefined)
                        comp["_helper"].destroy();
                }
            }
            super.destroy();
        }
    };
    ComponentPalette = __decorate([
        Registry_12.$Class("jassijs_editor.ComponentPalette"),
        __metadata("design:paramtypes", [])
    ], ComponentPalette);
    exports.ComponentPalette = ComponentPalette;
    function test() {
        var comp = new ComponentPalette();
        comp.service = "$UIComponent";
        return comp;
    }
    exports.test = test;
});
define("jassijs_editor/ComponentSpy", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Table", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/remote/Classes", "jassijs/base/Actions", "jassijs/base/Router", "jassijs_editor/ErrorPanel", "jassijs/ui/Component"], function (require, exports, Registry_14, Panel_7, Table_1, Button_4, BoxPanel_2, Classes_6, Actions_1, Router_2, ErrorPanel_2, Component_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentSpy = void 0;
    class Me {
    }
    let ComponentSpy = class ComponentSpy extends Panel_7.Panel {
        constructor() {
            super();
            this.hook = undefined;
            var _this = this;
            this.hook = Component_3.Component.onComponentCreated((name, comp) => {
                if (name === "create") {
                    _this.watch(comp);
                }
                if (name === "precreate" || name === "destroy") {
                    _this.unwatch(comp);
                }
            });
            this.ids = {};
            this.labelids = {};
            this.layout();
        }
        static async dummy() {
        }
        static async showDialog() {
            Router_2.router.navigate("#do=jassijs.ui.ComponentSpy");
        }
        layout() {
            var me = this.me = {};
            me.IDText = new ErrorPanel_2.ErrorPanel(); //HTMLPanel();
            this.css = { overflow: "scroll" };
            var _this = this;
            me.boxpanel1 = new BoxPanel_2.BoxPanel();
            me.IDUpdate = new Button_4.Button();
            me.IDClear = new Button_4.Button();
            me.IDTable = new Table_1.Table();
            this.add(me.boxpanel1);
            this.add(me.IDTable);
            this.add(me.IDText);
            me.boxpanel1.add(me.IDUpdate);
            me.boxpanel1.add(me.IDClear);
            me.boxpanel1.horizontal = false;
            me.IDClear.text = "clear";
            me.IDUpdate.text = "update";
            me.IDUpdate.onclick(function (event) {
                _this.update();
            });
            me.IDClear.onclick(function (event) {
                _this.clear();
            });
            me.IDText.height = 100;
            me.IDUpdate.text = "Update";
            me.IDTable.width = "100%";
            me.IDTable.height = "400";
            me.IDTable.onchange(function (ob) {
                me.IDText.addError({ error: ob.data }); //.stack.replaceAll("\n", "<br>");
            });
        }
        update() {
            var data = [];
            for (var k in jassijs.componentSpy.ids) {
                data.push(jassijs.componentSpy.ids[k]);
            }
            this.me.IDTable.items = data;
        }
        clear() {
            jassijs.componentSpy.ids = {};
            jassijs.componentSpy.labelids = {};
            this.update();
        }
        watch(component) {
            var ob = {
                type: Classes_6.classes.getClassName(component),
                id: component._id,
                labelid: component.domWrapper === undefined ? 0 : component.domWrapper._id,
                stack: new Error().stack
            };
            this.ids[ob.id] = ob;
            this.labelids[ob.labelid] = ob;
        }
        stack(id) {
            var test = this.ids[id];
            if (test === undefined)
                test = this.labelids[id];
            if (test !== undefined)
                return test.stack;
            else
                return "empty";
        }
        unwatch(component) {
            var ob = this.ids[component._id];
            if (ob !== undefined) {
                delete this.ids[ob.id];
                delete this.labelids[ob.labelid];
            }
        }
        list() {
            var test = ["jj", "kkk"];
            return test;
        }
        destroy() {
            super.destroy();
            Component_3.Component.offComponentCreated(this.hook);
            this.hook = undefined;
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Administration",
            icon: "mdi mdi-account-cog-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ComponentSpy, "dummy", null);
    __decorate([
        Actions_1.$Action({
            name: "Administration/Spy Components",
            icon: "mdi mdi-police-badge",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ComponentSpy, "showDialog", null);
    ComponentSpy = __decorate([
        Actions_1.$ActionProvider("jassijs.base.ActionNode"),
        Registry_14.$Class("jassijs_editor.ui.ComponentSpy"),
        __metadata("design:paramtypes", [])
    ], ComponentSpy);
    exports.ComponentSpy = ComponentSpy;
    function test() {
        var sp = new ComponentSpy();
        sp.update();
        sp.height = 100;
        return sp;
    }
    exports.test = test;
    jassijs.componentSpy = new ComponentSpy();
});
define("jassijs_editor/DatabaseDesigner", ["require", "exports", "jassijs/ui/BoxPanel", "jassijs/ui/Button", "jassijs/ui/Databinder", "jassijs/ui/Select", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/OptionDialog", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/base/Windows", "jassijs_editor/util/DatabaseSchema"], function (require, exports, BoxPanel_3, Button_5, Databinder_1, Select_1, Table_2, Registry_15, Panel_8, OptionDialog_2, Router_3, Actions_2, Windows_3, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseDesigner = void 0;
    let DatabaseDesigner = class DatabaseDesigner extends Panel_8.Panel {
        constructor(readShema = true) {
            super();
            this.allTypes = { values: [""] };
            this.posibleRelations = { values: [""] };
            this.me = {};
            this.layout(this.me, readShema);
        }
        static async showDialog() {
            Router_3.router.navigate("#do=jassijs_editor/DatabaseDesigner");
        }
        layout(me, readShema = true) {
            me.newclass = new Button_5.Button();
            me.boxpanel1 = new BoxPanel_3.BoxPanel();
            me.save = new Button_5.Button();
            me.boxpanel2 = new BoxPanel_3.BoxPanel(false);
            me.newfield = new Button_5.Button();
            me.removefield = new Button_5.Button();
            me.boxpanel3 = new BoxPanel_3.BoxPanel();
            me.boxpanel1.horizontal = true;
            var _this = this;
            var xxx = 0;
            var params = { values: ["hall", "du"] };
            me.table = new Table_2.Table({
                autoColumns: false,
                columns: [
                    //@ts-ignore
                    { title: "name", field: "name", editor: "input", editable: true },
                    //@ts-ignore
                    { title: "type", field: "type", editor: "select", editorParams: this.allTypes },
                    //@ts-ignore
                    { title: "nullable", field: "nullable", editor: "tickCross", editorParams: { tristate: false } },
                    {
                        //@ts-ignore
                        title: "relationinfo", field: "relationinfo", editor: "select",
                        editorParams: this.posibleRelations,
                        cellEditing: function (cell) {
                            _this.updatePossibleRelations(cell);
                        }
                    }
                ]
            });
            me.select = new Select_1.Select();
            me.databinder = new Databinder_1.Databinder();
            this.add(me.databinder);
            me.table.width = 565;
            me.table.height = "300";
            me.table.onchange(function (event, data /*Tabulator.RowComponent*/) {
            });
            me.select.display = "name";
            me.select.selectComponent = me.databinder;
            me.select.onchange(function (event) {
                _this.update();
            });
            me.select.width = 210;
            if (readShema) {
                this.readSchema();
            }
            this.width = 719;
            this.height = 386;
            this.add(me.boxpanel1);
            this.add(me.boxpanel2);
            me.newclass.text = "Create DBClass";
            me.newclass.onclick(function (event) {
                _this.addClass();
            });
            me.newclass.icon = "mdi mdi-note-plus-outline";
            me.newclass.tooltip = "new DBClass";
            me.newclass.width = "150";
            me.boxpanel1.add(me.select);
            me.boxpanel1.width = 365;
            me.boxpanel1.height = 25;
            me.boxpanel1.add(me.newclass);
            me.boxpanel1.add(me.save);
            me.save.text = "Save all Classes";
            me.save.onclick(function (event) {
                _this.saveAll().then((s) => {
                    if (s !== "") {
                        alert(s);
                    }
                });
            });
            me.save.width = 150;
            me.save.icon = "mdi mdi-content-save";
            me.save.width = 180;
            me.boxpanel2.height = 115;
            me.boxpanel2.horizontal = true;
            me.boxpanel2.width = 55;
            me.newfield.text = "Create Field";
            me.newfield.icon = "mdi mdi-playlist-plus";
            me.newfield.onclick(function (event) {
                _this.addField();
            });
            me.newfield.width = "120";
            me.newfield.height = 25;
            me.newfield.css = {
                text_align: "left"
            };
            me.boxpanel2.add(me.table);
            me.boxpanel2.add(me.boxpanel3);
            me.removefield.text = "Remove Field";
            me.removefield.icon = "mdi mdi-playlist-minus";
            me.removefield.width = "120";
            me.removefield.css = {
                text_align: "left"
            };
            me.removefield.onclick(function (event) {
                var field = me.table.value;
                if (field) {
                    var pos = _this.currentClass.fields.indexOf(field);
                    _this.currentClass.fields.splice(pos, 1);
                    me.table.items = _this.currentClass.fields;
                    me.table.value = undefined;
                }
            });
            me.boxpanel3.add(me.newfield);
            me.boxpanel3.add(me.removefield);
        }
        async saveAll(showChanges = undefined) {
            var _a;
            try {
                var text = await this.currentSchema.updateSchema(true);
                if (text !== "") {
                    if (showChanges === false || (await OptionDialog_2.OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
                        await this.currentSchema.updateSchema(false);
                        //@ts-ignore
                        (_a = Windows_3.default.findComponent("Files")) === null || _a === void 0 ? void 0 : _a.refresh();
                    }
                }
                else {
                    return "no changes detected";
                }
            }
            catch (err) {
                return err.message + "\r\n" + err.stack;
            }
            return "";
        }
        addField(typename = undefined, name = undefined, nullable = undefined, relation = undefined) {
            var field = new DatabaseSchema_1.DatabaseField();
            //@ts-ignore
            field.parent = this.currentClass;
            if (name)
                field.name = name;
            if (nullable)
                field.nullable = nullable;
            if (typename)
                field.type = typename;
            if (relation)
                field.relation = relation;
            this.currentClass.fields.push(field);
            this.me.table.items = this.currentClass.fields;
        }
        async addClass(classname = undefined) {
            var sub = this.currentClass.name.substring(0, this.currentClass.name.lastIndexOf("."));
            var res;
            if (classname) {
                res = {
                    button: "OK",
                    text: classname
                };
            }
            else
                res = await OptionDialog_2.OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
            if (res.button === "OK") {
                this.currentClass = new DatabaseSchema_1.DatabaseClass();
                this.currentClass.name = res.text;
                this.currentClass.parent = this.currentSchema;
                var f = new DatabaseSchema_1.DatabaseField();
                f.name = "id";
                f.type = "int";
                f.relation = "PrimaryColumn";
                this.currentClass.fields = [f];
                this.currentSchema.databaseClasses.push(this.currentClass);
                this.me.select.items = this.currentSchema.databaseClasses;
                this.me.select.value = this.currentClass;
                this.update();
            }
        }
        updatePossibleRelations(cell /*Tabulator.CellComponent*/) {
            var _this = this;
            var tp = cell.getData();
            this.posibleRelations.values = tp.getPossibleRelations();
        }
        updateTypes() {
            var _this = this;
            this.allTypes.values = [];
            DatabaseSchema_1.DatabaseSchema.basicdatatypes.forEach((e) => {
                _this.allTypes.values.push(e);
            });
            this.currentSchema.databaseClasses.forEach((cl) => {
                _this.allTypes.values.push(cl.name);
                _this.allTypes.values.push(cl.name + "[]");
            });
        }
        update() {
            this.currentClass = this.me.select.value;
            this.me.table.items = this.currentClass.fields;
            this.updateTypes();
        }
        async readSchema() {
            this.currentSchema = new DatabaseSchema_1.DatabaseSchema();
            await this.currentSchema.loadSchemaFromCode();
            this.me.select.items = this.currentSchema.databaseClasses;
            this.me.select.value = this.currentSchema.databaseClasses[0];
            this.update();
        }
    };
    __decorate([
        Actions_2.$Action({
            name: "Administration/Database Designer",
            icon: "mdi mdi-database-edit",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DatabaseDesigner, "showDialog", null);
    DatabaseDesigner = __decorate([
        Actions_2.$ActionProvider("jassijs.base.ActionNode"),
        Registry_15.$Class("jassijs_editor/DatabaseDesigner"),
        __metadata("design:paramtypes", [Object])
    ], DatabaseDesigner);
    exports.DatabaseDesigner = DatabaseDesigner;
    async function test() {
        var ret = new DatabaseDesigner();
        return ret;
    }
    exports.test = test;
});
define("jassijs_editor/Debugger", ["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_16) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Debugger = void 0;
    //https://developer.chrome.com/extensions/messaging
    let Debugger = class Debugger {
        /**
         * routing of url
         * @class jassijs.base.Debugger
         */
        constructor() {
        }
        /**
         * @param {string} file - the file to save
         * @param {string} code - the code to Transform
         * @param [number] debuglines - lines which updates the variables
         * @param {Object.<int,string>}  debuglinesConditions - is the breakpoint in line conitionally [line]->condition
         **/
        async debugCode(file, code, debuglines, debuglinesConditions, evalToCursorPosition) {
        }
        /**
         * remove all breakpoints for the file
         * @param file
         */
        async removeBreakpointsForFile(file) {
        }
        /**
        * extract all variables in code
        * @param {string} code - the code to inspect
        */
        _extractVariables(code) {
            var pos = 0;
            var ret = [];
            while (pos !== -1) {
                pos = code.indexOf("var" + " ", pos);
                if (pos !== -1) {
                    var p1 = code.indexOf(" ", pos + 4);
                    var p2 = code.indexOf(";", pos + 4);
                    var p3 = code.indexOf("=", pos + 4);
                    var p = Math.min(p1 === -1 ? 999999999 : p1, p2 === -1 ? 999999999 : p2, p3 === -1 ? 999999999 : p3);
                    var variabel = code.substring(pos + 4, p);
                    var patt = new RegExp("\\W");
                    if (!patt.test(variabel))
                        ret.push(variabel);
                    pos = pos + 1;
                }
            }
            return ret;
        }
        /**
         * sets a breakpoint for debugging
         * @param {string} file
         * @param {number} line
         * @param {number} enable - if true then breakpoint is set if false then removed
         * @param {string} type - the type default undefined->stop debugging
         **/
        breakpointChanged(file, line, column, enable, type) {
            if (navigator.userAgent.indexOf("Chrome") > -1) {
                (new Promise((resolve_2, reject_2) => { require(["jassijs_editor/ChromeDebugger"], resolve_2, reject_2); })).then((deb) => {
                    deb.ChromeDebugger.showHintExtensionNotInstalled();
                });
            }
            //	console.log("break on"+file);
        }
        /**
         * report current variable scope
         * @param {numer} id - id of the variablepanel
         * @param {[Object.<string,object>]} variables
         */
        reportVariables(id, variables) {
            var editor = document.getElementById(id)._this;
            alert(editor);
            editor["addVariables"](variables);
        }
        /**
        * add debugpoints in code
        * @param {[string]} lines - code
        * @param {Object.<number, boolean>} debugpoints - the debugpoints
        * @param {jassijs_editor.CodeEditor} codeEditor
        */
        addDebugpoints(lines, debugpoints, codeEditor) {
            jassijs.d[codeEditor._id] = undefined;
            //        	jassijs.ui.VariablePanel.get(this._id).__db=undefined;
            var hassome = undefined;
            this.debugpoints = debugpoints;
            for (var point in debugpoints) {
                if (debugpoints[point] === true) {
                    //lines[point]="if(jassijs.ui.VariablePanel.get("+this._id+").__db===undefined){ jassijs.ui.VariablePanel.get("+this._id+").__db=true;debugger;}"+lines[point];
                    lines[point] = "if(jassijs.d(" + codeEditor._id + ")) debugger;" + lines[point];
                }
            }
        }
        /**
         *
         * @param {string} code - full source code
         * @param {jassijs_editor.CodeEditor} codeEditor
         * @returns {string}
         */
        getCodeForBreakpoint(code, codeEditor) {
            /*	var reg = /([\w]*)[\(][^\)]*[\)]/g;
                var test=reg.exec(code);
                test=reg.exec();
                alert(test);*/
            var vars = this._extractVariables(code);
            var reg = /[A-Z,a-z,0-9,\_]*[/w]*[\(][A-Z,a-z,0-9,\_,\,]*\)\{/g;
            var test = reg.exec(code);
            while (test) {
                if (!test[0].startsWith("while") && !test[0].startsWith("if")) {
                    var params = test[0].substring(test[0].indexOf("(") + 1, test[0].indexOf(")"));
                    if (params.length > 0) {
                        var ps = params.split(",");
                        for (var p = 0; p < ps.length; p++) {
                            if (vars.indexOf(ps[p]) === -1)
                                vars.push(ps[p]);
                        }
                    }
                }
                test = reg.exec(code);
            }
            var svars = "{var debug_editor=document.getElementById(" + codeEditor._id + ")._this;var _variables_={} ;try{if(this!==jassi)_variables_['this']=this;}catch(ex){};";
            //svars=svars+"try{_variables_.addParameters(arguments);}catch(ex){};";
            for (var x = 0; x < vars.length; x++) {
                //        alert(vars[x]);
                svars = svars + "try{_variables_['" + vars[x] + "']=" + vars[x] + ";}catch(ex){};";
            }
            svars = svars + "debug_editor.addVariables(_variables_);}";
            return svars;
        }
        destroy() {
            this.destroyed = true;
        }
    };
    Debugger = __decorate([
        Registry_16.$Class("jassijs_editor.Debugger"),
        __metadata("design:paramtypes", [])
    ], Debugger);
    exports.Debugger = Debugger;
    if (jassijs.debugger === undefined)
        jassijs.debugger = new Debugger();
    //@ts-ignore
    require(["jassijs_editor/ChromeDebugger"]);
});
define("jassijs_editor/ErrorPanel", ["require", "exports", "jassijs/ui/Panel", "jassijs/base/Errors", "jassijs/remote/Registry", "jassijs/ui/Button", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/ui/Notify", "jassijs/ui/Component", "jassijs/remote/Config"], function (require, exports, Panel_9, Errors_1, Registry_17, Button_6, Router_4, Actions_3, Notify_4, Component_4, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.ErrorPanel = void 0;
    let ErrorPanel = class ErrorPanel extends Panel_9.Panel {
        /**
     * shows errors
     * @class jassijs.ui.ErrorPanel
     */
        constructor(withControls = true, withLastErrors = true, withNewErrors = true) {
            super();
            this.withControls = withControls;
            this.withLastErrors = withLastErrors;
            this.withNewErrors = withNewErrors;
            this.layout();
        }
        static async showDialog() {
            Router_4.router.navigate("#do=jassijs.ui.ErrorPanel");
        }
        layout() {
            var _this = this;
            if (this.withControls) {
                this.IDClear = new Button_6.Button();
                this.IDClear.tooltip = "Clear log";
                this.IDClear.icon = "mdi mdi-delete";
                this.IDClear.onclick(function () {
                    _this.clear();
                    Errors_1.errors.items = [];
                });
                this.IDClear.width = 35;
                this.IDSearch = new Button_6.Button();
                this.IDSearch.tooltip = "search errors";
                this.IDSearch.icon = "mdi mdi-file-search-outline";
                this.IDSearch.onclick(function () {
                    _this.search();
                });
                this.IDToolbar = new Panel_9.Panel();
                this.IDToolbar.width = "99%";
                this.IDToolbar.add(this.IDClear);
                this.IDToolbar.add(this.IDSearch);
                this.IDToolbar.height = 20;
                super.add(this.IDToolbar);
            }
            var value = Component_4.Component.createHTMLElement('<div><font  size="2"><div class="errorpanel"></div></font></div>');
            this.dom.appendChild(value);
            this._container = this.dom.querySelector(".errorpanel");
            if (this.withNewErrors)
                this.registerError();
            if (this.withLastErrors) {
                //old Errors
                for (var x = 0; x < Errors_1.errors.items.length; x++) {
                    this.addError(Errors_1.errors.items[x]);
                }
            }
            if (window["jassijs_debug"] === undefined)
                window["jassijs_debug"] = { variables: [] };
        }
        /**
         * search Errors in code
         **/
        async search() {
            var typescript = (await new Promise((resolve_3, reject_3) => { require(["jassijs_editor/util/Typescript"], resolve_3, reject_3); })).default;
            await typescript.initService();
            var all = await typescript.getDiagnosticsForAll();
            if (all.length === 0)
                Notify_4.notify("no Errors found", "info", { position: "right" });
            for (var x = 0; x < all.length; x++) {
                var diag = all[x];
                var s = diag.file.fileName;
                var pos = typescript.getLineAndCharacterOfPosition(diag.file.fileName, diag.start);
                var href = window.location.origin;
                var err = {
                    filename: diag.file.fileName,
                    lineno: pos.line,
                    colno: pos.character,
                    error: {
                        message: diag.messageText,
                        stack: "" //href + "/" + diag.file.fileName + ":" + pos.line + ":" + pos.character
                    }
                };
                Errors_1.Errors.errors.addError(err);
            }
        }
        /**
         * adds a new error
         * @param {object} error - the error
         */
        async addError(error) {
            var _a;
            var msg = "";
            if (error.infoMsg !== undefined) {
                msg = error.infoMsg + "<br>";
            }
            else {
                var sstack = "";
                var m = (_a = error.error) === null || _a === void 0 ? void 0 : _a.message;
                if (!m)
                    m = "";
                if (m.messageText)
                    m = m.messageText;
                if (error.error) {
                    sstack = m.replaceAll(":", "") + "(" + error.filename + ":" + error.lineno + ":" + error.colno + ")\n";
                    if (error.error.stack !== undefined)
                        sstack = sstack + error.error.stack;
                }
                if (error.reason !== undefined) {
                    sstack = error.reason.message + ":::\n";
                    if (error.reason.stack !== undefined)
                        sstack = sstack + error.reason.stack;
                }
                var stack = sstack.split('\n');
                msg = "";
                for (var i = 0; i < stack.length; i++) {
                    var line = stack[i];
                    if (line.indexOf(".ts:") > 0) {
                        msg = msg + '<div>' + line.substring(0, line.lastIndexOf("(")) +
                            '<a href="#" onclick="jassijs.ErrorPanel.prototype.onsrclink(this);">' +
                            line.substr(line.lastIndexOf("(") + 1, line.length - 1) + '</a>)' + "" + '</div>';
                    }
                    else {
                        if (line.split(":").length < 4)
                            continue; //edge and chrome insert message in stack->ignore
                        var poshttp = line.indexOf("http");
                        var url = await this._convertURL(line.substring(poshttp, line.length));
                        line = line.replace("\n", "");
                        var ident = (i === 0 ? "0" : "20");
                        msg = msg + '<div style="text-indent:' + ident + 'px;">' + line.substring(0, poshttp) +
                            '<a href="#" onclick="jassijs.ErrorPanel.prototype.onsrclink(this);">' +
                            url + '</a>' + (line.endsWith(")") ? ")" : "") + '</div>';
                    }
                }
            }
            var value = Component_4.Component.createHTMLElement('<span>' + msg + '</span>');
            this._container.prepend(value);
            //  this.dom.appendChild(value);
        }
        async _convertURL(url) {
            var wurl = window.location.href.split("/index.html")[0];
            if (url.endsWith(")"))
                url = url.substring(0, url.length - 1);
            var wurl = url.substring(0, url.indexOf("#"));
            var aurl = url.split(":");
            if (aurl.length >= 3) {
                var line = aurl[aurl.length - 2];
                var col = aurl[aurl.length - 1];
                var u = url.substring(0, url.length - 2 - line.length - col.length);
                if (line === "" || col === "" || u === "")
                    return url;
                var ismodul = false;
                for (var mod in Config_1.config.modules) {
                    if (Config_1.config.modules[mod] === u)
                        ismodul = true;
                }
                if (u.indexOf("/js/") > -1 || ismodul) {
                    try {
                        //@ts-ignore
                        var TSSourceMap = (await new Promise((resolve_4, reject_4) => { require(["jassijs_editor/util/TSSourceMap"], resolve_4, reject_4); })).TSSourceMap;
                        var map = new TSSourceMap();
                        var pos = await map.getLineFromJS(u, Number(line), Number(col));
                        if (pos) {
                            return pos.source.replace("../client/", "").replaceAll("../", "").replace("$temp", "") +
                                ":" + pos.line + ":" + pos.column;
                        }
                    }
                    catch (err) {
                        return url;
                    }
                }
            }
            /* if (!url.startsWith("/"))
                 url = "/" + url;
             if (url.startsWith("/js") && url.indexOf(".js") > -1) {
                 var aurl = url.substring(1).split(":");
                 var newline = await new TSSourceMap().getLineFromJS(aurl[0], Number(aurl[1]), Number(aurl[2]));
                 url = aurl[0].substring(3).replace(".js", ".ts") + ":" + newline + ":" + aurl[2];
                 if (url.startsWith("tmp/"))
                     url = url.substring(4);
             }*/
            return url;
        }
        /**
         * deletes all errors
         */
        clear() {
            while (this._container.firstChild) {
                this._container.removeChild(this._container.firstChild);
            }
        }
        registerError() {
            var _this = this;
            Errors_1.errors.onerror(function (err) {
                _this.addError(err);
            }, this._id);
        }
        unregisterError() {
            Errors_1.errors.offerror(this._id);
        }
        destroy() {
            this.unregisterError();
            super.destroy();
            //this._container
        }
    };
    __decorate([
        Actions_3.$Action({
            name: "Administration/Errors",
            icon: "mdi mdi-emoticon-confused-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ErrorPanel, "showDialog", null);
    ErrorPanel = __decorate([
        Actions_3.$ActionProvider("jassijs.base.ActionNode"),
        Registry_17.$Class("jassijs_editor.ui.ErrorPanel"),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], ErrorPanel);
    exports.ErrorPanel = ErrorPanel;
    function test2() {
        var ret = new ErrorPanel();
        return ret;
    }
    exports.test2 = test2;
    ;
    ErrorPanel.prototype["onsrclink"] = function (param) {
        var data = param.text.split(":");
        if (data[1] === "")
            return;
        Router_4.router.navigate("#do=jassijs_editor.CodeEditor&file=" + data[0] + "&line=" + data[1]);
        // jassijs_editor.CodeEditor.open(param.text);
    };
    jassijs.ErrorPanel = ErrorPanel;
});
define("jassijs_editor/ext/monaco", ["require", "exports", "vs/editor/editor.main", "vs/language/typescript/tsWorker", "jassijs_editor/modul"], function (require, exports, _monaco, tsWorker, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="vs/editor/editor.main" name="_monaco"/>
    /// <amd-dependency path="vs/language/typescript/tsWorker" name="tsWorker"/>
    //hack to make autocompletion for autoimports from other modules
    //let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
    let monacopath = modul_1.default.require.paths.vs.replace("/vs", "");
    var platform_1 = require("vs/base/common/platform");
    platform_1.globals.MonacoEnvironment = {};
    function myfunc() {
        if (require.getConfig().baseUrl === "") {
            setTimeout(() => { myfunc(); }, 10);
        }
        else {
            require(['vs/language/typescript/tsWorker'], function (tsWorker) {
                tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {
                    return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
                };
            });
        }
        //   }
    }
    platform_1.globals.MonacoEnvironment.getWorker = function (workerId, label) {
        const myPath = 'vs/base/worker/defaultWorkerFactory.js';
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/vs/base/worker/workerMain.js"
        let scriptPath = monacopath + "/vs/base/worker/workerMain.js"; // require.toUrl('./' + workerId);
        //"https://cdn.jsdelivr.net/npm/monaco-editor@0.26.1/dev/"
        const workerBaseUrl = require.toUrl(myPath).slice(0, -myPath.length); // explicitly using require.toUrl(), see https://github.com/microsoft/vscode/issues/107440#issuecomment-698982321
        let js = `/*${label}*/self.MonacoEnvironment={baseUrl: '${workerBaseUrl}'};const ttPolicy = self.trustedTypes?.createPolicy('defaultWorkerFactory', { createScriptURL: value => value });importScripts(ttPolicy?.createScriptURL('${scriptPath}') ?? '${scriptPath}');/*${label}*/;`;
        if (label === "typescript")
            js += myfunc.toString() + ";myfunc();";
        const blob = new Blob([js], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);
        //var workerUrl=URL.createObjectURL(blob);
        return new Worker(workerUrl, { name: label });
    };
});
define("jassijs_editor/FileExplorer", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Tree", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/remote/Server", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/ui/OptionDialog", "jassijs/ui/ContextMenu", "jassijs/base/Windows", "jassijs/remote/Config"], function (require, exports, Registry_18, Tree_2, Panel_10, Textbox_1, Server_3, Router_5, Actions_4, OptionDialog_3, ContextMenu_2, Windows_4, Config_2) {
    "use strict";
    var FileActions_1, FileExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.FileExplorer = exports.FileActions = void 0;
    //drag from Desktop https://www.html5rocks.com/de/tutorials/file/dndfiles/
    let FileActions = FileActions_1 = class FileActions {
        static async newFile(all, fileName = undefined, code = "", open = false) {
            var _a, _b, _c, _d;
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            if (fileName === undefined) {
                var res = await OptionDialog_3.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, ".ts");
                if (res.button === "ok" && res.text !== all[0].name) {
                    fileName = res.text;
                }
                else
                    return;
            }
            //console.log("create " + fileName);
            var key = (_b = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree) === null || _b === void 0 ? void 0 : _b.getKeyFromItem(all[0]);
            var newfile = path + (path === "" ? "" : "/") + fileName;
            var ret = await new Server_3.Server().createFile(newfile, code);
            var newkey = path + (path === "" ? "" : "|") + fileName;
            if (ret !== "") {
                alert(ret);
                return;
            }
            try {
                await ((_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.refresh());
                await ((_d = FileExplorer.instance) === null || _d === void 0 ? void 0 : _d.tree.activateKey(newkey));
                if (open)
                    Router_5.router.navigate("#do=jassijs_editor.CodeEditor&file=" + newkey.replaceAll("|", "/"));
            }
            catch (err) {
                debugger;
            }
        }
        static async download(all) {
            var path = all[0].fullpath;
            var byteCharacters = atob(await new Server_3.Server().zip(path));
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            // If you want to use the image in your DOM:
            var blob = new Blob([byteArray], { type: "application/zip" });
            var url = URL.createObjectURL(blob);
            var link = document.createElement('a');
            document.body.appendChild(link);
            link.href = url;
            link.click();
            link.remove();
        }
        static async newFolder(all, filename = undefined) {
            var _a, _b, _c;
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            var res;
            if (filename) {
                res = { button: "ok", text: filename };
            }
            else
                res = await OptionDialog_3.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
            if (res.button === "ok" && res.text !== all[0].name) {
                // console.log("create Folder" + res.text);
                var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0]);
                var newfile = path + (path === "" ? "" : "/") + res.text;
                var ret = await new Server_3.Server().createFolder(newfile);
                var newkey = path + (path === "" ? "" : "|") + res.text;
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(newkey);
            }
        }
        static async newModule(all) {
            if (all.length === 0 || !all[0].isDirectory())
                return;
            var path = all[0].fullpath;
            var res = await OptionDialog_3.OptionDialog.show("Enter file name:", ["ok", "cancel"], undefined, true, "");
            if (res.button === "ok" && res.text !== all[0].name) {
                var smodule = res.text.toLocaleLowerCase();
                if (Config_2.config.modules[smodule]) {
                    alert("modul allready exists");
                    return;
                }
                var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
                var ret = await new Server_3.Server().createModule(smodule);
                var newkey = path + (path === "" ? "" : "|") + smodule;
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                else {
                    Config_2.config.modules[smodule] = smodule;
                }
                await FileExplorer.instance.refresh();
                FileExplorer.instance.tree.activateKey(newkey);
            }
        }
        static async dodelete(all, withwarning = true) {
            var _a, _b, _c;
            var s = "";
            all.forEach((node) => {
                s = s + "" + node.fullpath + "<br/>";
            });
            var res;
            if (withwarning) {
                res = await OptionDialog_3.OptionDialog.show("Delete this?<br/>" + s, ["ok", "cancel"], undefined, true);
            }
            if (!withwarning || (res.button === "ok" && res.text !== all[0].name)) {
                var ret = await new Server_3.Server().delete(all[0].fullpath);
                if (ret !== "") {
                    alert(ret);
                    return;
                }
                var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0].parent);
                await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(key);
            }
        }
        static async reloadFilesystem(enableLocalFS) {
            await new Promise((resolve) => {
                Config_2.config.serverrequire(["jassijs/server/NativeAdapter", "jassijs/server/LocalFS", "jassijs/server/FS"], (native, localFS, FS) => {
                    if (enableLocalFS) {
                        native.myfs = new localFS.LocalFS();
                        native.exists = localFS.exists;
                    }
                    else {
                        native.myfs = new FS.FS();
                        native.exists = FS.exists;
                    }
                    resolve(undefined);
                });
            });
        }
        static async mapLocalFolder(all, foldername = undefined) {
            await new Promise((resolve) => {
                Config_2.config.serverrequire(["jassijs/server/LocalFS"], (localFS) => {
                    localFS.createHandle().then((res) => {
                        resolve(undefined);
                    });
                });
            });
            Config_2.config.isLocalFolderMapped = true;
            await FileActions_1.reloadFilesystem(true);
            await FileActions_1.refresh(all);
        }
        static async closeLocalFolder(all, foldername = undefined) {
            await new Promise((resolve) => {
                Config_2.config.serverrequire(["jassijs/server/LocalFS"], (localFS) => {
                    localFS.deleteHandle().then((res) => {
                        resolve(undefined);
                    });
                });
            });
            Config_2.config.isLocalFolderMapped = true;
            await FileActions_1.reloadFilesystem(false);
            await FileActions_1.refresh(all);
        }
        static async rename(all, foldername = undefined) {
            var _a, _b, _c;
            if (all.length !== 1)
                alert("only one file could be renamed");
            else {
                var res;
                if (foldername) {
                    res = { button: "ok", text: foldername };
                }
                else
                    res = await OptionDialog_3.OptionDialog.show("Enter new name:", ["ok", "cancel"], undefined, true, all[0].name);
                if (res.button === "ok" && res.text !== all[0].name) {
                    //console.log("rename " + all[0].name + " to " + res.text);
                    var key = (_a = FileExplorer.instance) === null || _a === void 0 ? void 0 : _a.tree.getKeyFromItem(all[0]);
                    var path = all[0].parent !== undefined ? all[0].parent.fullpath : "";
                    var newfile = path + (path === "" ? "" : "/") + res.text;
                    var ret = await new Server_3.Server().rename(all[0].fullpath, newfile);
                    var newkey = key === null || key === void 0 ? void 0 : key.replace(all[0].name, res.text);
                    if (ret !== "") {
                        alert(ret);
                        return;
                    }
                    if (!all[0].isDirectory()) {
                        let tss = (await new Promise((resolve_5, reject_5) => { require(["jassijs_editor/util/" + "Typescript"], resolve_5, reject_5); })).default; //modul jassijs could not comp
                        await (tss === null || tss === void 0 ? void 0 : tss.renameFile(all[0].fullpath, newfile));
                    }
                    await ((_b = FileExplorer.instance) === null || _b === void 0 ? void 0 : _b.refresh());
                    (_c = FileExplorer.instance) === null || _c === void 0 ? void 0 : _c.tree.activateKey(newkey);
                }
            }
        }
        static async refresh(all) {
            var key = FileExplorer.instance.tree.getKeyFromItem(all[0]);
            await FileExplorer.instance.refresh();
            FileExplorer.instance.tree.activateKey(key);
        }
        static async open(all) {
            var node = all[0];
            if (node.isDirectory())
                return;
            Router_5.router.navigate("#do=jassijs_editor.CodeEditor&file=" + node.fullpath);
        }
    };
    __decorate([
        Actions_4.$Action({
            name: "New/File",
            icon: "mdi mdi-file",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String, String, Boolean]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFile", null);
    __decorate([
        Actions_4.$Action({
            name: "Download",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "download", null);
    __decorate([
        Actions_4.$Action({
            name: "New/Folder",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, String]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newFolder", null);
    __decorate([
        Actions_4.$Action({
            name: "New/Module",
            isEnabled: function (all) {
                return all[0].name === "client" && all[0].fullpath === "";
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "newModule", null);
    __decorate([
        Actions_4.$Action({ name: "Delete" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "dodelete", null);
    __decorate([
        Actions_4.$Action({ name: "Map local folder", isEnabled: (entr) => entr[0].name === "client" && Config_2.config.serverrequire !== undefined }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "mapLocalFolder", null);
    __decorate([
        Actions_4.$Action({ name: "Close local folder", isEnabled: (entr) => entr[0].name === "client" && Config_2.config.isLocalFolderMapped }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "closeLocalFolder", null);
    __decorate([
        Actions_4.$Action({ name: "Rename" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Object]),
        __metadata("design:returntype", Promise)
    ], FileActions, "rename", null);
    __decorate([
        Actions_4.$Action({ name: "Refresh" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "refresh", null);
    __decorate([
        Actions_4.$Action({
            name: "Open", isEnabled: function (all) {
                return !all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], FileActions, "open", null);
    FileActions = FileActions_1 = __decorate([
        Actions_4.$ActionProvider("jassijs.remote.FileNode"),
        Registry_18.$Class("jassijs_editor.ui.FileActions")
    ], FileActions);
    exports.FileActions = FileActions;
    let FileExplorer = FileExplorer_1 = class FileExplorer extends Panel_10.Panel {
        constructor() {
            super();
            FileExplorer_1.instance = this;
            //this.maximize();
            this.dom.style.width = "calc(100% - 8px)";
            this.dom.style.height = "calc(100% - 25px)"; //why 25????
            this.tree = new Tree_2.Tree();
            this.search = new Textbox_1.Textbox();
            this.layout();
            this.tree.propStyle = node => { return this.getStyle(node); };
        }
        static async show() {
            if (Windows_4.default.contains("Files"))
                var window = Windows_4.default.show("Files");
            else
                Windows_4.default.addLeft(new FileExplorer_1(), "Files");
        }
        getStyle(node) {
            var _a, _b;
            var ret = undefined;
            if (((_a = node.flag) === null || _a === void 0 ? void 0 : _a.indexOf("fromMap")) > -1) {
                ret = {
                    color: "green"
                };
            }
            if (((_b = node.flag) === null || _b === void 0 ? void 0 : _b.indexOf("module")) > -1) {
                ret = {
                    color: "blue"
                };
            }
            return ret;
        }
        async refresh() {
            var _a;
            let root = (await new Server_3.Server().dir());
            root.fullpath = "";
            root.name = "client";
            //flag modules
            for (let x = 0; x < root.files.length; x++) {
                if (Config_2.config.modules[root.files[x].name] !== undefined) {
                    root.files[x].flag = (((_a = root.files[x].flag) === null || _a === void 0 ? void 0 : _a.length) > 0) ? "module" : root.files[x].flag + " module";
                }
            }
            var keys = this.tree.getExpandedKeys();
            this.tree.items = [root];
            if (keys.indexOf("client") === -1)
                keys.push("client");
            await this.tree.expandKeys(keys);
        }
        async layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "files";
            let context = new ContextMenu_2.ContextMenu();
            this.tree.contextMenu = context;
            context.includeClassActions = true;
            this.refresh();
            this.add(this.tree);
            // this._files.files;
            this.tree.onclick(function (evt) {
                if (evt.data !== undefined) {
                    FileActions.open([evt.data]);
                }
            });
            //@ts-ignore
            this.dom.style.flow = "visible";
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    _this.tree.filter(_this.search.value);
                    if (evt.code === "Enter") {
                        //_this.tree.
                    }
                }, 100);
            });
        }
    };
    FileExplorer.instance = undefined;
    __decorate([
        Actions_4.$Action({
            name: "Windows/Development/Files",
            icon: "mdi mdi-file-tree",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], FileExplorer, "show", null);
    FileExplorer = FileExplorer_1 = __decorate([
        Actions_4.$ActionProvider("jassijs.base.ActionNode"),
        Registry_18.$Class("jassijs.ui.FileExplorer"),
        __metadata("design:paramtypes", [])
    ], FileExplorer);
    exports.FileExplorer = FileExplorer;
    function test() {
        var exp = new FileExplorer();
        exp.height = 100;
        return exp;
    }
    exports.test = test;
});
define("jassijs_editor/HtmlDesigner", ["require", "exports", "jassijs_editor/ComponentDesigner", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/remote/Classes"], function (require, exports, ComponentDesigner_1, Registry_19, Component_5, Classes_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.HtmlDesigner = void 0;
    let HtmlDesigner = class HtmlDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            var _this = this;
            this._designPlaceholder.dom.addEventListener("keydown", (ev => _this.keydown(ev)));
            this._designPlaceholder.dom.contentEditable = "true";
            this._designPlaceholder.dom.addEventListener("drop", (ev) => _this.ondrop(ev));
        }
        getParentList(node, list) {
            list.push(node);
            if (node !== document)
                this.getParentList(node.parentNode, list);
        }
        ondrop(ev) {
            var _this = this;
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            var range;
            if (document.caretRangeFromPoint) {
                // edge, chrome, android
                range = document.caretRangeFromPoint(ev.clientX, ev.clientY);
            }
            else {
                // firefox
                var pos = [ev.rangeParent, ev.rangeOffset];
                range = document.createRange();
                range.setStart(...pos);
                range.setEnd(...pos);
            }
            var selection = document.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            if (data.indexOf('"createFromType":') > -1) {
                var toCreate = JSON.parse(data);
                var cl = Classes_7.classes.getClass(toCreate.createFromType);
                var newComponent = new cl();
                _this.insertComponent(newComponent, selection);
                _this.updateDummies();
            }
        }
        /*set designedComponent(component) {
            alert(8);
            super.designedComponent=component;
            
        }*/
        registerKeys() {
            return;
            var _this = this;
            this._codeEditor._design.dom.tabindex = "1";
            this._codeEditor._design.dom.addEventListener("keydown", function (evt) {
                if (evt.keyCode === 115 && evt.shiftKey) { //F4
                    // var thiss=this._this._id;
                    // var editor = ace.edit(this._this._id);
                    _this.evalCode(true);
                    evt.preventDefault();
                    return false;
                }
                else if (evt.keyCode === 115) { //F4
                    _this.evalCode(false);
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 90 && evt.ctrlKey) { //Ctrl+Z
                    _this.undo();
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 46 || (evt.keyCode === 88 && evt.ctrlKey && evt.shiftKey)) { //Del or Ctrl X)
                    _this.cutComponent();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 67 && evt.ctrlKey && evt.shiftKey) { //Ctrl+C
                    _this.copy();
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 86 && evt.ctrlKey && evt.shiftKey) { //Ctrl+V
                    _this.paste();
                    evt.preventDefault();
                    return false;
                }
                if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                    _this.save();
                    event.preventDefault();
                    return false;
                }
            });
        }
        deleteNodeBetween(node1, node2) {
            var list1 = [];
            var list2 = [];
            this.getParentList(node1, list1);
            this.getParentList(node2, list2);
            var pos = 0;
            var test = list1[pos];
            while (list2.indexOf(list1[pos]) === -1) {
                pos++;
            }
            var par1 = list1[pos - 1];
            var par2 = list2[list2.indexOf(list1[pos]) - 1];
            var todel = par1.nextSibling;
            while (todel !== par2) {
                var del = todel;
                todel = todel.nextSibling;
                del.remove();
            }
        }
        editDialog(enable) {
            super.editDialog(enable);
        }
        createDragAndDropper() {
            return undefined;
        }
        removeNode(from, frompos, to, topos) {
            if (from === to) {
                var neu = to.textContent;
                this.changeText(to, neu.substring(0, frompos) + "" + neu.substring(topos));
            }
            else {
                this.deleteNodeBetween(from, to);
                this.changeText(from, from.textContent.substring(0, frompos));
                this.changeText(to, to.textContent.substring(topos));
            }
            var range = document.createRange();
            var selection = getSelection();
            range.setStart(from, frompos);
            selection.removeAllRanges();
            selection.addRange(range);
            ;
        }
        changeText(node, text) {
            var varname = this._propertyEditor.getVariableFromObject(node._this);
            this._propertyEditor.setPropertyInCode("text", '"' + text + '"', true, varname);
            if (text === "&nbsp;")
                node.innerHTML = text;
            else
                node.textContent = text;
            return node;
        }
        insertComponent(component, sel = document.getSelection(), suggestedvarname = undefined) {
            var anchorNode = sel.anchorNode;
            var old = anchorNode.textContent;
            var node = anchorNode;
            var v1 = old.substring(0, sel.anchorOffset);
            var v2 = old.substring(sel.focusOffset);
            this.changeText(node, v2);
            var comp = node._this;
            var br = this.createComponent(Classes_7.classes.getClassName(component), component, undefined, undefined, comp._parent, comp, true, suggestedvarname);
            if (v1 === "")
                v1 = "&nbsp;";
            var nd = document.createTextNode(v1);
            var comp2 = new Component_5.TextComponent();
            comp2.init(nd, { noWrapper: true });
            var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, comp._parent, br, true, "text");
            this.changeText(text2.dom, v1);
            this.updateDummies();
        }
        keydown(e) {
            var sel = document.getSelection();
            var position = sel.anchorNode.compareDocumentPosition(sel.focusNode);
            var anchorNode = sel.anchorNode;
            var anchorOffset = sel.anchorOffset;
            var focusNode = sel.focusNode;
            var focusOffset = sel.focusOffset;
            // selection has wrong direction
            if (!position && sel.anchorOffset > sel.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
                anchorOffset = sel.focusOffset;
                anchorNode = sel.focusNode;
                focusNode = sel.anchorNode;
                focusOffset = sel.anchorOffset;
            }
            if (e.keyCode === 13) {
                e.preventDefault();
                var enter = Component_5.createComponent(React.createElement("br"));
                this.insertComponent(enter, sel, "br");
                //var enter = node.parentNode.insertBefore(document.createElement("br"), node);
                // var textnode = enter.parentNode.insertBefore(document.createTextNode(v1), enter);
                return;
            }
            if (e.code === "Delete") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "right", "character");
                    var newsel = document.getSelection();
                    this.removeNode(anchorNode, anchorOffset, newsel.focusNode, newsel.focusOffset);
                }
                else {
                    this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
                }
                return;
            }
            if (e.code === "Backspace") {
                e.preventDefault();
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                    sel.modify("extend", "left", "character");
                    var newsel = document.getSelection();
                    this.removeNode(newsel.focusNode, newsel.focusOffset, anchorNode, anchorOffset);
                }
                else {
                    this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
                }
                return;
            }
            if (e.key.length === 1) {
                var end = focusOffset;
                if (anchorNode !== focusNode) {
                    end = anchorNode.textContent.length;
                }
                if (anchorNode === focusNode && anchorOffset === focusOffset) { //no selection
                }
                else {
                    this.removeNode(anchorNode, anchorOffset, focusNode, focusOffset);
                }
                var neu = anchorNode.textContent.substring(0, anchorOffset) + e.key + anchorNode.textContent.substring(end);
                if (anchorNode.nodeType !== anchorNode.TEXT_NODE) { //there is no Textnode here we create one
                    var before = undefined;
                    if (anchorNode.childNodes.length > 0) {
                        before = anchorNode.childNodes[0]._this;
                    }
                    var comp2 = new Component_5.TextComponent();
                    var newone = document.createTextNode(e.key);
                    var par = anchorNode._this;
                    comp2.init(newone, { noWrapper: true });
                    var text2 = this.createComponent("jassijs.ui.TextComponent", comp2, undefined, undefined, par, before, true, "text");
                    anchorOffset = 0;
                    anchorNode = newone;
                    neu = e.key;
                }
                this.changeText(anchorNode, neu);
                e.preventDefault();
                var range = document.createRange();
                range.setStart(anchorNode, anchorOffset + 1);
                sel.removeAllRanges();
                sel.addRange(range);
            }
            this.updateDummies();
        }
    };
    HtmlDesigner = __decorate([
        Registry_19.$Class("jassijs_editor.HtmlDesigner"),
        __metadata("design:paramtypes", [])
    ], HtmlDesigner);
    exports.HtmlDesigner = HtmlDesigner;
    function test() {
        var dom = React.createElement("div", {
            contenteditable: "true"
        }, "Hallo", "Du");
        var ret = Component_5.createComponent(dom);
        //ret.dom.addEventListener("keydown", keydown);
        //windows.add(ret, "Hallo");
        return ret;
    }
    exports.test = test;
});
define("jassijs_editor/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassijs_editor.css": "jassijs_editor.css" },
        "types": {
            "node_modules/csstype.d.ts": "https://cdn.jsdelivr.net/gh/frenic/csstype@master/index.d.ts",
            // "node_modules/@types/csstype/index.d.ts":"https://cdn.jsdelivr.net/gh/frenic/csstype@master/index.d.ts",
            "node_modules/@types/react/canary.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/canary.d.ts",
            "node_modules/@types/react/experimental.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/experimental.d.ts",
            "node_modules/@types/react/global.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/global.d.ts",
            "node_modules/@types/react/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/index.d.ts",
            "node_modules/@types/react/jsx-runtime.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/jsx-runtime.d.ts",
            "node_modules/@types/react/jsx-dev-runtime.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/jsx-dev-runtime.d.ts",
            "node_modules/monaco.d.ts": "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/monaco.d.ts",
            "node_modules/typescript/typescriptServices.d.ts": "https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-3.7/lib/typescriptServices.d.ts"
        },
        "require": {
            paths: {
                'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
                'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools',
                monacoLib: "jassijs_editor/ext/monacoLib",
                vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/dev/vs"
            },
            shim: {
                'ace/ext/language_tools': ['ace/ace'],
            }
        }
    };
});
define("jassijs_editor/MonacoPanel", ["require", "exports", "jassijs/remote/Registry", "jassijs/base/Router", "jassijs_editor/util/Typescript", "jassijs_editor/CodePanel", "jassijs/remote/Settings", "jassijs/base/CurrentSettings", "jassijs_editor/Debugger", "jassijs_editor/ext/monaco"], function (require, exports, Registry_20, Router_6, Typescript_3, CodePanel_5, Settings_2, CurrentSettings_2) {
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
            var p = Typescript_3.default.getPositionOfLineAndCharacter(file, {
                line: pos.lineNumber, character: pos.column
            });
            const oldpos = model["lastEditor"].getPosition();
            setTimeout(() => {
                CodePanel_5.CodePanel.getAutoimport(p, file, code).then((data) => {
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
        //TODO FIX deprecrated in new Version s. monaco.editor.registerEditorOpener
        const editorService = editor["_codeEditorService"];
        const openEditorBase = editorService.openCodeEditor.bind(editorService);
        editorService.openCodeEditor = async (input, source) => {
            const result = await openEditorBase(input, source);
            if (result === null) {
                var file = input.resource.path.substring(1);
                var line = input.options.selection.startLineNumber;
                Router_6.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
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
                var pos = Typescript_3.default.getPositionOfLineAndCharacter(file, { line: position.lineNumber, character: position.column });
                var all = await Typescript_3.default.getCompletion(file, pos, undefined, { includeExternalModuleExports: true });
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
    let MonacoPanel = class MonacoPanel extends CodePanel_5.CodePanel {
        constructor() {
            super();
            var _this = this;
            var test = '<div class="MonacoPanel" style="height: 100px; width: 100px"></div>';
            super.init(test);
            this.domWrapper.style.overflow = "hidden";
            this.domWrapper.style.display = "";
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
            let theme = CurrentSettings_2.currentsettings.gets(Settings_2.Settings.keys.Development_MoanacoEditorTheme);
            this._editor = monaco.editor.create(this.dom, {
                //value:  monaco.editor.getModels()[0], //['class A{b:B;};\nclass B{a:A;};\nfunction x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
                language: 'typescript',
                theme: (theme ? theme : "vs-light"),
                glyphMargin: true,
                fontSize: 12,
                automaticLayout: true,
                //@ts-ignore
                inlineSuggest: {}
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
        autocomplete() {
            this._editor.trigger("äläöl", 'editor.action.triggerSuggest', "{}");
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
            return undefined;
            //   this._editor.on("focus", handler);
        }
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler) {
            return undefined;
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
                    var stype = "typescript";
                    if (this.file.toLocaleLowerCase().endsWith(".css"))
                        stype = "css";
                    if (this.file.toLocaleLowerCase().endsWith(".json"))
                        stype = "json";
                    if (this.file.toLocaleLowerCase().endsWith(".html"))
                        stype = "html";
                    if (this.file.toLocaleLowerCase().endsWith(".jpg"))
                        stype = "jpg";
                    mod = monaco.editor.createModel(value, stype, ffile);
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
                this._editor.setPosition({ column: cursor.column, lineNumber: cursor.row });
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
        Registry_20.$Class("jassijs_editor.MonacoPanel"),
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
//this file is autogenerated don't modify
define("jassijs_editor/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_editor/AcePanel.ts": {
                "date": 1684357702000,
                "jassijs.ui.AcePanel": {}
            },
            "jassijs_editor/AcePanelSimple.ts": {
                "date": 1657651672000,
                "jassijs.ui.AcePanelSimple": {}
            },
            "jassijs_editor/ChromeDebugger.ts": {
                "date": 1681488352000,
                "jassijs_editor.ChromeDebugger": {}
            },
            "jassijs_editor/CodeEditor.ts": {
                "date": 1696697256483.297,
                "jassijs_editor.CodeEditorSettingsDescriptor": {
                    "$SettingsDescriptor": [],
                    "@members": {}
                },
                "jassijs_editor.CodeEditor": {
                    "@members": {}
                }
            },
            "jassijs_editor/CodeEditorInvisibleComponents.ts": {
                "date": 1681558934000,
                "jassijs_editor.CodeEditorInvisibleComponents": {}
            },
            "jassijs_editor/CodePanel.ts": {
                "date": 1655661690000,
                "jassijs_editor.CodePanel": {}
            },
            "jassijs_editor/ComponentDesigner.ts": {
                "date": 1697051410384.2578,
                "jassijs_editor.ComponentDesigner": {}
            },
            "jassijs_editor/ComponentExplorer.ts": {
                "date": 1696696982919.5652,
                "jassijs_editor.ComponentExplorer": {}
            },
            "jassijs_editor/ComponentPalette.ts": {
                "date": 1697051376777.724,
                "jassijs_editor.ComponentPalette": {}
            },
            "jassijs_editor/ComponentSpy.ts": {
                "date": 1681570602000,
                "jassijs_editor.ui.ComponentSpy": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Administration",
                                    "icon": "mdi mdi-account-cog-outline"
                                }
                            ]
                        },
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Spy Components",
                                    "icon": "mdi mdi-police-badge"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/DatabaseDesigner.ts": {
                "date": 1684176866000,
                "jassijs_editor/DatabaseDesigner": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Database Designer",
                                    "icon": "mdi mdi-database-edit"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/Debugger.ts": {
                "date": 1656019586000,
                "jassijs_editor.Debugger": {}
            },
            "jassijs_editor/ErrorPanel.ts": {
                "date": 1682794808000,
                "jassijs_editor.ui.ErrorPanel": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Errors",
                                    "icon": "mdi mdi-emoticon-confused-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/ext/monaco.ts": {
                "date": 1681572586000
            },
            "jassijs_editor/FileExplorer.ts": {
                "date": 1683575950000,
                "jassijs_editor.ui.FileActions": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/File",
                                    "icon": "mdi mdi-file",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "download": {
                            "$Action": [
                                {
                                    "name": "Download",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newFolder": {
                            "$Action": [
                                {
                                    "name": "New/Folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newModule": {
                            "$Action": [
                                {
                                    "name": "New/Module",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "dodelete": {
                            "$Action": [
                                {
                                    "name": "Delete"
                                }
                            ]
                        },
                        "mapLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Map local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "closeLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Close local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "rename": {
                            "$Action": [
                                {
                                    "name": "Rename"
                                }
                            ]
                        },
                        "refresh": {
                            "$Action": [
                                {
                                    "name": "Refresh"
                                }
                            ]
                        },
                        "open": {
                            "$Action": [
                                {
                                    "name": "Open",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.FileExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Files",
                                    "icon": "mdi mdi-file-tree"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/HtmlDesigner.ts": {
                "date": 1697052572549.2588,
                "jassijs_editor.HtmlDesigner": {}
            },
            "jassijs_editor/modul.ts": {
                "date": 1695399690345.8984
            },
            "jassijs_editor/MonacoPanel.ts": {
                "date": 1684357486000,
                "jassijs_editor.MonacoPanel": {}
            },
            "jassijs_editor/SearchExplorer.ts": {
                "date": 1681590246000,
                "jassijs_editor.ui.SearchExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Search",
                                    "icon": "mdi mdi-folder-search-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/StartEditor.ts": {
                "date": 1681571256000
            },
            "jassijs_editor/template/TemplateDBDialog.ts": {
                "date": 1681570392000,
                "jassijs_editor.template.TemplateDBDialogProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBDialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateDBObject.ts": {
                "date": 1681570394000,
                "jassijs_editor.template.TemplateDBObjectProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateEmptyDialog.ts": {
                "date": 1681579996000,
                "jassijs_editor.template.TemplateEmptyDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/Dialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateRemoteObject.ts": {
                "date": 1681570100000,
                "jassijs_editor.template.TemplateRemoteObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/RemoteObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/DatabaseSchema.ts": {
                "date": 1681569388000,
                "jassijs_editor.util.DatabaseSchema": {}
            },
            "jassijs_editor/util/DragAndDropper.ts": {
                "date": 1657925428000,
                "jassijs_editor.util.DragAndDropper": {}
            },
            "jassijs_editor/util/Parser.ts": {
                "date": 1697052536534.7373,
                "jassijs_editor.util.Parser": {}
            },
            "jassijs_editor/util/Resizer.ts": {
                "date": 1656018240000,
                "jassijs_editor.util.Resizer": {}
            },
            "jassijs_editor/util/Tests.ts": {
                "date": 1684358014000,
                "jassijs_editor.ui.TestAction": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "testNode": {
                            "$Action": [
                                {
                                    "name": "Run Tests"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/TSSourceMap.ts": {
                "date": 1682794840000,
                "jassijs_editor.util.TSSourceMap": {}
            },
            "jassijs_editor/util/Typescript.ts": {
                "date": 1695586918212.458,
                "jassijs_editor.util.Typescript": {}
            }
        }
    };
});
define("jassijs_editor/SearchExplorer", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Tree", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Registry_21, Tree_3, Panel_11, Textbox_2, Router_7, Actions_5, Windows_5) {
    "use strict";
    var SearchExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SearchExplorer = void 0;
    let SearchExplorer = SearchExplorer_1 = class SearchExplorer extends Panel_11.Panel {
        constructor() {
            super();
            //@member - maximal hits which are found 
            this.maximalFounds = 100;
            //this.maximize();
            this.dom.style.width = "calc(100% - 8px)";
            this.dom.style.height = "calc(100% - 25px)"; //why 25????
            this.tree = new Tree_3.Tree();
            this.search = new Textbox_2.Textbox();
            this.layout();
        }
        static async show() {
            if (Windows_5.default.contains("Search"))
                var window = Windows_5.default.show("Search");
            else
                Windows_5.default.addLeft(new SearchExplorer_1(), "Search");
        }
        async doSearch() {
            var typescript = (await new Promise((resolve_6, reject_6) => { require(["jassijs_editor/util/Typescript"], resolve_6, reject_6); })).default;
            var all = [];
            var files = []; // [{name:"Hallo",lines:[{ name:"Treffer1",pos:1},{name:"treffer2" ,pos:2}]}];
            var toFind = this.search.value.toLocaleLowerCase();
            var count = 0;
            var filenames = typescript.getFiles();
            for (var f = 0; f < filenames.length; f++) {
                var file = filenames[f];
                if (file.indexOf("node_modules") > -1) //no search in node modules
                    continue;
                var code = typescript.getCode(file);
                if (code) {
                    var text = code.toLowerCase();
                    var pos = text.indexOf(toFind);
                    var foundedFile = { name: file, lines: [] };
                    while (pos !== -1) {
                        count++;
                        if (count > this.maximalFounds) {
                            break;
                        }
                        var startline = text.lastIndexOf("\n", pos);
                        var endline = text.indexOf("\n", pos);
                        var line = text.substring(startline, endline);
                        foundedFile.lines.push({ name: line, pos: pos, file: file });
                        pos = text.indexOf(toFind, pos + 1);
                    }
                    if (foundedFile.lines.length > 0)
                        files.push(foundedFile);
                    if (count > this.maximalFounds) {
                        break;
                    }
                }
            }
            this.tree.items = files;
            this.tree.expandAll();
        }
        async layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "lines";
            this.tree.onclick(function (evt) {
                if (evt.data !== undefined && evt.data.file !== undefined) {
                    var pos = evt.data.pos;
                    var file = evt.data.file;
                    new Promise((resolve_7, reject_7) => { require(["jassijs_editor/util/Typescript"], resolve_7, reject_7); }).then(Typescript => {
                        var text = Typescript.default.getCode(file);
                        var line = text.substring(0, pos).split("\n").length;
                        Router_7.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
                    });
                }
            });
            this.dom.style["flow"] = "visible";
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    //	if(evt.code==="Enter"){
                    _this.doSearch();
                    //	}
                }, 100);
            });
            this.search.height = 15;
        }
    };
    __decorate([
        Actions_5.$Action({
            name: "Windows/Development/Search",
            icon: "mdi mdi-folder-search-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SearchExplorer, "show", null);
    SearchExplorer = SearchExplorer_1 = __decorate([
        Actions_5.$ActionProvider("jassijs.base.ActionNode"),
        Registry_21.$Class("jassijs_editor.ui.SearchExplorer"),
        __metadata("design:paramtypes", [])
    ], SearchExplorer);
    exports.SearchExplorer = SearchExplorer;
    function test() {
        return new SearchExplorer();
    }
    exports.test = test;
});
define("jassijs_editor/StartEditor", ["require", "exports", "jassijs_editor/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/base/Router", "jassijs_editor/SearchExplorer", "jassijs/ui/DBObjectExplorer", "jassijs/ui/ActionNodeMenu"], function (require, exports, FileExplorer_2, Windows_6, Panel_12, Button_7, Router_8, SearchExplorer_2, DBObjectExplorer_1, ActionNodeMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        var body = new Panel_12.Panel({ id: "body" });
        body.max();
        Windows_6.default.addLeft(new DBObjectExplorer_1.DBObjectExplorer(), "DBObjects");
        Windows_6.default.addLeft(new SearchExplorer_2.SearchExplorer(), "Search");
        Windows_6.default.addLeft(new FileExplorer_2.FileExplorer(), "Files");
        var bt = new Button_7.Button();
        Windows_6.default._desktop.add(bt);
        bt.icon = "mdi mdi-refresh";
        var am = new ActionNodeMenu_1.ActionNodeMenu();
        bt.onclick(() => {
            Windows_6.default._desktop.remove(am);
            am = new ActionNodeMenu_1.ActionNodeMenu();
            Windows_6.default._desktop.add(am);
        });
        Windows_6.default._desktop.add(am);
        Router_8.router.navigate(window.location.hash);
    }
    start().then();
});
define("jassijs_editor/template/TemplateDBDialog", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/base/Actions", "jassijs/remote/DBObject", "jassijs/ui/OptionDialog", "jassijs/remote/Classes", "jassijs_editor/FileExplorer"], function (require, exports, Registry_22, Property_2, Actions_6, DBObject_1, OptionDialog_4, Classes_8, FileExplorer_3) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateDBDialog = exports.TemplateDBDialogProperties = void 0;
    const code = `import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { {{dbclassname}} } from "{{dbfilename}}";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView,  $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";

type Me = {
}&DBObjectViewMe

@$DBObjectView({classname:"{{fulldbclassname}}"})
@$Class("{{fullclassname}}")
export class {{dialogname}} extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    declare value: {{dbclassname}};
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "{{dialogname}}" : "{{dialogname}} " + this.value.id;
    }
    layout(me: Me) {
    }
}

export async function test(){
	var ret=new {{dialogname}}();
	
	ret["value"]=<{{dbclassname}}>await {{dbclassname}}.findOne();
	return ret;
}`;
    let TemplateDBDialogProperties = class TemplateDBDialogProperties {
    };
    __decorate([
        Property_2.$Property({ decription: "name of the dialog" }),
        __metadata("design:type", String)
    ], TemplateDBDialogProperties.prototype, "dialogname", void 0);
    __decorate([
        Property_2.$Property({ type: "classselector", service: "$DBObject" }),
        __metadata("design:type", typeof (_a = typeof DBObject_1.DBObject !== "undefined" && DBObject_1.DBObject) === "function" ? _a : Object)
    ], TemplateDBDialogProperties.prototype, "dbobject", void 0);
    TemplateDBDialogProperties = __decorate([
        Registry_22.$Class("jassijs_editor.template.TemplateDBDialogProperties")
    ], TemplateDBDialogProperties);
    exports.TemplateDBDialogProperties = TemplateDBDialogProperties;
    let TemplateDBDialog = class TemplateDBDialog {
        static async newFile(all) {
            var props = new TemplateDBDialogProperties();
            var res = await OptionDialog_4.OptionDialog.askProperties("Create new DBDialog:", props, ["ok", "cancel"], undefined, false);
            if (res.button === "ok") {
                var scode = code.replaceAll("{{dialogname}}", props.dialogname);
                var fulldbclassname = Classes_8.classes.getClassName(props.dbobject);
                var shortdbclassname = fulldbclassname.split(".")[fulldbclassname.split(".").length - 1];
                var dbfilename = (await Registry_22.default.getJSONData("$Class", fulldbclassname))[0].filename;
                dbfilename = dbfilename.substring(0, dbfilename.length - 3);
                scode = scode.replaceAll("{{fullclassname}}", (all[0].fullpath + "/" + props.dialogname).replaceAll("/", "."));
                scode = scode.replaceAll("{{dbclassname}}", shortdbclassname);
                scode = scode.replaceAll("{{fulldbclassname}}", fulldbclassname);
                scode = scode.replaceAll("{{dbfilename}}", dbfilename);
                FileExplorer_3.FileActions.newFile(all, props.dialogname + ".ts", scode, true);
            }
        }
    };
    TemplateDBDialog.code = code;
    __decorate([
        Actions_6.$Action({
            name: "New/DBDialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateDBDialog, "newFile", null);
    TemplateDBDialog = __decorate([
        Actions_6.$ActionProvider("jassijs.remote.FileNode"),
        Registry_22.$Class("jassijs.template.TemplateDBDialog")
    ], TemplateDBDialog);
    exports.TemplateDBDialog = TemplateDBDialog;
});
define("jassijs_editor/template/TemplateDBObject", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/base/Actions", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Registry_23, Property_3, Actions_7, OptionDialog_5, FileExplorer_4) {
    "use strict";
    var TemplateDBObject_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateDBObject = exports.TemplateDBObjectProperties = void 0;
    var code = `import {DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany,JoinColumn,JoinTable } from "jassijs/util/DatabaseSchema";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";


@$DBObject()
@$Class("{{fullclassname}}")

export class {{classname}} extends DBObject {

    {{PrimaryAnnotator}}
    declare id: number;
  
    constructor() {
        super();
    }
}


export async function test() {
};`;
    let TemplateDBObjectProperties = class TemplateDBObjectProperties {
    };
    __decorate([
        Property_3.$Property({ decription: "name of the db class" }),
        __metadata("design:type", String)
    ], TemplateDBObjectProperties.prototype, "name", void 0);
    __decorate([
        Property_3.$Property({ default: "true", description: "the primary column alue will be automatically generated with an auto-increment value" }),
        __metadata("design:type", String)
    ], TemplateDBObjectProperties.prototype, "autogeneratedid", void 0);
    TemplateDBObjectProperties = __decorate([
        Registry_23.$Class("jassijs_editor.template.TemplateDBObjectProperties")
    ], TemplateDBObjectProperties);
    exports.TemplateDBObjectProperties = TemplateDBObjectProperties;
    let TemplateDBObject = TemplateDBObject_1 = class TemplateDBObject {
        static async newFile(all) {
            var props = new TemplateDBObjectProperties();
            var res = await OptionDialog_5.OptionDialog.askProperties("Create Database Class:", props, ["ok", "cancel"], undefined, false);
            if (res.button === "ok") {
                var scode = TemplateDBObject_1.code.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + props.name);
                scode = scode.replaceAll("{{classname}}", props.name);
                var anno = "@PrimaryColumn()";
                if (props.autogeneratedid)
                    anno = "@PrimaryGeneratedColumn()";
                scode = scode.replaceAll("{{PrimaryAnnotator}}", anno);
                FileExplorer_4.FileActions.newFile(all, props.name + ".ts", scode, true);
            }
        }
    };
    TemplateDBObject.code = code;
    __decorate([
        Actions_7.$Action({
            name: "New/DBObject",
            isEnabled: function (all) {
                return all[0].isDirectory() && all[0].fullpath.indexOf("/remote/") !== -1;
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateDBObject, "newFile", null);
    TemplateDBObject = TemplateDBObject_1 = __decorate([
        Actions_7.$ActionProvider("jassijs.remote.FileNode"),
        Registry_23.$Class("jassijs.template.TemplateDBObject")
    ], TemplateDBObject);
    exports.TemplateDBObject = TemplateDBObject;
});
define("jassijs_editor/template/TemplateEmptyDialog", ["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Actions_8, Registry_24, OptionDialog_6, FileExplorer_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateEmptyDialog = void 0;
    const code = `import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";

type Me = {
}

@$Class("{{fullclassname}}")
export class {{dialogname}} extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        this.config({});
	}
}

export async function test(){
	var ret=new {{dialogname}}();
	return ret;
}`;
    let TemplateEmptyDialog = class TemplateEmptyDialog {
        static async newFile(all) {
            var res = await OptionDialog_6.OptionDialog.show("Enter dialog name:", ["ok", "cancel"], undefined, true, "Dialog");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{dialogname}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", all[0].fullpath + "/" + res.text);
                FileExplorer_5.FileActions.newFile(all, res.text + ".ts", scode, true);
            }
        }
    };
    TemplateEmptyDialog.code = code;
    __decorate([
        Actions_8.$Action({
            name: "New/Dialog",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateEmptyDialog, "newFile", null);
    TemplateEmptyDialog = __decorate([
        Actions_8.$ActionProvider("jassijs.remote.FileNode"),
        Registry_24.$Class("jassijs_editor.template.TemplateEmptyDialog")
    ], TemplateEmptyDialog);
    exports.TemplateEmptyDialog = TemplateEmptyDialog;
});
define("jassijs_editor/template/TemplateRemoteObject", ["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Actions_9, Registry_25, OptionDialog_7, FileExplorer_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateRemoteObject = void 0;
    const code = `import { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("{{fullclassname}}")
export class {{name}} extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            return "Hello "+name;  //this would be execute on server  
        }
    }
}
export async function test(){
    console.log(await new {{name}}().sayHello("Kurt"));
}
`;
    let TemplateRemoteObject = class TemplateRemoteObject {
        static async newFile(all) {
            var res = await OptionDialog_7.OptionDialog.show("Enter RemoteObject name:", ["ok", "cancel"], undefined, true, "MyRemoteObject");
            if (res.button === "ok" && res.text !== all[0].name) {
                var scode = code.replaceAll("{{name}}", res.text);
                scode = scode.replaceAll("{{fullclassname}}", (all[0].fullpath + "/" + res.text).replaceAll("/", "."));
                FileExplorer_6.FileActions.newFile(all, res.text + ".ts", scode, true);
            }
        }
    };
    TemplateRemoteObject.code = code;
    __decorate([
        Actions_9.$Action({
            name: "New/RemoteObject",
            isEnabled: function (all) {
                return all[0].isDirectory() && all[0].fullpath.split("/").length > 1 && all[0].fullpath.split("/")[1] === "remote";
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateRemoteObject, "newFile", null);
    TemplateRemoteObject = __decorate([
        Actions_9.$ActionProvider("jassijs.remote.FileNode"),
        Registry_25.$Class("jassijs_editor.template.TemplateRemoteObject")
    ], TemplateRemoteObject);
    exports.TemplateRemoteObject = TemplateRemoteObject;
});
define("jassijs_editor/util/DatabaseSchema", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs_editor/util/Typescript", "jassijs_editor/util/Parser", "jassijs_editor/template/TemplateDBObject", "jassijs/util/Tools", "jassijs/remote/Server", "jassijs/base/Windows", "jassijs/ui/OptionDialog", "jquery.choosen"], function (require, exports, Registry_26, Registry_27, Typescript_4, Parser_1, TemplateDBObject_2, Tools_1, Server_4, Windows_7, OptionDialog_8) {
    "use strict";
    var DatabaseSchema_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test3 = exports.DatabaseSchema = exports.DatabaseClass = exports.DatabaseField = void 0;
    class DatabaseField {
        get nullable() {
            var _a;
            return (_a = this.properties) === null || _a === void 0 ? void 0 : _a.nullable;
        }
        set nullable(value) {
            if (value === undefined) {
                if (this.properties)
                    delete this.properties.nullable;
                return;
            }
            if (DatabaseSchema.basicdatatypes.indexOf(this.type) === -1 || this.relation) {
                if (value === undefined)
                    return;
                throw "This field could not be nullable";
            }
            if (this.properties === undefined)
                this.properties = {};
            this.properties.nullable = value;
        }
        getReverseField() {
            if (this.inverseSide && this.inverseSide !== "") {
                if (this.inverseSide.indexOf(".") === -1)
                    return undefined;
                var sp = this.inverseSide.split(".");
                var clname = this.type.replace("[]", "");
                var cl = this.parent.parent.getClass(clname);
                if (!cl)
                    return undefined;
                return cl.getField(sp[1]);
            }
            return undefined;
        }
        /**
         * looks possible relations in the type class
         **/
        getPossibleRelations() {
            if (this.name === "id")
                return ["PrimaryColumn", "PrimaryGeneratedColumn"];
            if (!this.type || DatabaseSchema.basicdatatypes.indexOf(this.type) >= 0)
                return [];
            var values = [];
            if (this.type.endsWith("[]")) {
                values = ["", "OneToMany", "ManyToMany"];
            }
            else
                values = ["", "OneToOne", "ManyToOne"];
            var cl = this.type.replace("[]", "");
            var parentcl = this.parent.name;
            var relclass = this.parent.parent.getClass(cl);
            for (var x = 0; x < relclass.fields.length; x++) {
                var relfield = relclass.fields[x];
                if (this.type.endsWith("[]")) {
                    if (relfield.type === parentcl) {
                        //OneToMany
                        values.push("e." + relfield.name);
                    }
                    if (relfield.type === (parentcl + "[]")) {
                        //ManyToMany
                        values.push("e." + relfield.name);
                        values.push("e." + relfield.name + "(join)");
                    }
                }
                else {
                    if (relfield.type === parentcl) {
                        //OneToOne
                        values.push("e." + relfield.name);
                        values.push("e." + relfield.name + "(join)");
                    }
                    if (relfield.type === (parentcl + "[]")) {
                        //ManyToOne
                        values.push("e." + relfield.name);
                    }
                }
            }
            return values;
        }
        get relationinfo() {
            if (this.relation === "OneToOne" || this.relation === "ManyToMany" || this.relation === "ManyToOne" || this.relation === "OneToMany") {
                if (this.inverseSide) {
                    return this.inverseSide + (this.join ? "(join)" : "");
                }
                else {
                    return this.relation;
                }
            }
            else if (this.relation === "PrimaryColumn" || this.relation === "PrimaryGeneratedColumn")
                return this.relation;
            else
                return undefined;
        }
        set relationinfo(value) {
            var _a;
            if (value === "")
                value = undefined;
            if (value === undefined) {
                this.relation = undefined;
                //  return;
            }
            if (value === "PrimaryColumn" || value === "PrimaryGeneratedColumn") {
                if (this.name === "id")
                    this.relation = value;
                return;
            }
            if (value === undefined || value === "OneToOne" || value === "ManyToMany" || value === "ManyToOne" || value === "OneToMany") {
                var old = this.getReverseField();
                if (old !== undefined)
                    old.inverseSide = undefined; //delete the relation on the reverse side
                this.relation = value;
                this.inverseSide = undefined;
            }
            else {
                var oval = value;
                if (oval.endsWith("(join)")) {
                    oval = oval.replace("(join)", "");
                    this.join = true;
                }
                else
                    this.join = false;
                this.inverseSide = oval;
                var rfield = this.getReverseField();
                if (rfield === undefined) {
                    this.inverseSide = undefined;
                    throw Error("relation not found");
                }
                //set the relation on the reverse side
                if (!((_a = rfield.inverseSide) === null || _a === void 0 ? void 0 : _a.endsWith("." + this.name)))
                    rfield.inverseSide = "e." + this.name;
                if (this.type.endsWith("[]")) {
                    if (rfield.type.endsWith("[]")) {
                        this.relation = "ManyToMany";
                        //sets the join in the other
                        rfield.join = !this.join;
                    }
                    else {
                        this.relation = "OneToMany";
                    }
                }
                else {
                    if (rfield.type.endsWith("[]")) {
                        this.relation = "ManyToOne";
                    }
                    else {
                        this.relation = "OneToOne";
                        //sets the join in the other
                        rfield.join = !this.join;
                    }
                }
            }
        }
    }
    exports.DatabaseField = DatabaseField;
    class DatabaseClass {
        constructor() {
            this.fields = [];
        }
        getField(name) {
            for (var x = 0; x < this.fields.length; x++) {
                var cl = this.fields[x];
                if (cl.name === name)
                    return cl;
            }
            ;
            return undefined;
        }
    }
    exports.DatabaseClass = DatabaseClass;
    var classnode = undefined;
    let DatabaseSchema = DatabaseSchema_2 = class DatabaseSchema {
        constructor() {
            this.databaseClasses = [];
        }
        getClass(name) {
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var cl = this.databaseClasses[x];
                if (cl.name === name)
                    return cl;
            }
            ;
            return undefined;
        }
        //type => ARZeile
        getFulltype(type, parsedClass) {
            var pos = type.lastIndexOf(">");
            if (pos > -1)
                type = type.substring(pos + 1).trim();
            var file = parsedClass.parent.imports[type];
            if (type === parsedClass.name)
                return parsedClass;
            var ret = this.definedImports[type + "|" + file];
            if (!ret) {
                throw Error("Import not found " + parsedClass.fullClassname + " : " + type);
            }
            return ret;
        }
        createDBClass(cl) {
            var scode = TemplateDBObject_2.TemplateDBObject.code.replaceAll("{{fullclassname}}", cl.name);
            var file = cl.name.replaceAll(".", "/") + ".ts";
            file = file.substring(0, file.indexOf("/")) + "/remote" + "/" + file.substring(file.indexOf("/") + 1);
            cl.filename = file;
            cl.simpleclassname = cl.name.split(".")[cl.name.split(".").length - 1];
            scode = scode.replaceAll("{{classname}}", cl.simpleclassname);
            scode = scode.replaceAll("{{PrimaryAnnotator}}", "@" + cl.getField("id").relation + "()");
            var parser = new Parser_1.Parser();
            parser.parse(scode);
            for (var key in parser.classes) {
                var pclass = parser.classes[key];
                pclass["filename"] = file;
                if (pclass.decorator["$DBObject"]) {
                    //var dbclass=pclass.decorator["$Class"].param[0];
                    this.parsedClasses[pclass.fullClassname] = pclass;
                    this.definedImports[pclass.name + "|" + file.substring(0, file.length - 3)] = pclass;
                }
            }
        }
        createDBField(field, dbcl) {
            var _a;
            var decs = {};
            if ((field.join || field.inverseSide === undefined || field.inverseSide === "") && field.relation === "OneToOne")
                decs["JoinColumn"] = { name: "JoinColumn", parameter: [] };
            if ((field.join || field.inverseSide === undefined || field.inverseSide === "") && field.join && field.relation === "ManyToMany")
                decs["JoinTable"] = { name: "JoinTable", parameter: [] };
            var realtype = field.type;
            var realprops = field.properties;
            if (field.type === "decimal") {
                realtype = "number";
                if (!realprops)
                    realprops = {};
                realprops.type = "decimal";
            }
            if (field.type === "int")
                realtype = "number";
            var s = realprops ? (_a = Tools_1.Tools.objectToJson(realprops, undefined, false)) === null || _a === void 0 ? void 0 : _a.replaceAll("\n", "") : undefined;
            var p = undefined;
            if (!field.relation || field.relation === "") {
                if (s)
                    p = [s];
                decs["Column"] = { name: "Column", parameter: p };
            }
            else if (field.relation === "PrimaryColumn" || field.relation === "PrimaryGeneratedColumn") {
                if (s)
                    p = [s];
                decs[field.relation] = { name: field.relation, parameter: p };
            }
            else {
                var params = [];
                var tcl = field.type.replace("[]", "");
                realtype = this.getClass(tcl).simpleclassname;
                if (dbcl.name !== tcl)
                    this.parsedClasses[dbcl.name].parent.addImportIfNeeded(realtype, this.getClass(tcl).filename.substring(0, this.getClass(tcl).filename.length - 3));
                let scl = tcl;
                if (scl.indexOf(".") > -1) {
                    scl = scl.substring(scl.lastIndexOf(".") + 1);
                }
                params.push("type => " + scl);
                if (field.inverseSide && field.inverseSide !== "")
                    params.push("e=>" + field.inverseSide);
                if (s)
                    params.push(s);
                decs[field.relation] = { name: field.relation, parameter: params };
            }
            this.parsedClasses[dbcl.name].parent.addOrModifyMember({ name: field.name, type: realtype, decorator: decs }, this.parsedClasses[dbcl.name]);
        }
        async reloadCodeInEditor(file, text) {
            var editor = Windows_7.default.findComponent("jassijs_editor.CodeEditor-" + file);
            if (editor !== undefined) {
                if (editor._codeToReload === undefined) {
                    var data = await OptionDialog_8.OptionDialog.show("The source was updated in Chrome. Do you want to load this modification?", ["Yes", "No"], editor, false);
                    if (data.button === "Yes")
                        editor.value = text;
                    delete editor._codeToReload;
                }
            }
        }
        async updateSchema(onlyPreview = false) {
            var _a;
            ///todo wenn kein basicfieldtype muss eine Beziehung hinterlegt sein throw Error
            var changes = "";
            var org = new DatabaseSchema_2();
            await org.loadSchemaFromCode();
            var modifiedclasses = [];
            //check relations
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var dbcl = this.databaseClasses[x];
                for (var y = 0; y < dbcl.fields.length; y++) {
                    let f = dbcl.fields[y];
                    if (DatabaseSchema_2.basicdatatypes.indexOf(f.type) === -1 && (f.relation === undefined || f.relation === ""))
                        throw Error("Relation must be filled " + dbcl.name + " field " + f.name);
                }
            }
            for (var x = 0; x < this.databaseClasses.length; x++) {
                var dbcl = this.databaseClasses[x];
                if (org.getClass(dbcl.name) === undefined) {
                    changes += "create class " + dbcl.name + "\n";
                    modifiedclasses.push(dbcl);
                    if (!onlyPreview) {
                        this.createDBClass(dbcl);
                    }
                }
                for (var y = 0; y < dbcl.fields.length; y++) {
                    var field = dbcl.fields[y];
                    var forg = (_a = org.getClass(dbcl.name)) === null || _a === void 0 ? void 0 : _a.getField(field.name);
                    if (org.getClass(dbcl.name) === undefined || forg === undefined) {
                        changes += "create field " + dbcl.name + ": " + field.name + "\n";
                        if (modifiedclasses.indexOf(dbcl) === -1)
                            modifiedclasses.push(dbcl);
                        if (!onlyPreview) {
                            this.createDBField(field, dbcl);
                        }
                    }
                    else {
                        var jfield = JSON.stringify(field.properties);
                        var jorg = JSON.stringify(forg.properties);
                        var fieldjoin = field.join;
                        if (fieldjoin === false)
                            fieldjoin = undefined;
                        if (field.type !== forg.type || field.inverseSide !== forg.inverseSide || field.relation !== forg.relation || jfield !== jorg || fieldjoin !== forg.join) {
                            changes += "modify deorator field " + dbcl.name + ": " + field.name + "\n";
                            if (modifiedclasses.indexOf(dbcl) === -1)
                                modifiedclasses.push(dbcl);
                            if (!onlyPreview) {
                                this.createDBField(field, dbcl);
                            }
                        }
                    }
                }
            }
            var files = [];
            var contents = [];
            if (!onlyPreview) {
                for (var x = 0; x < modifiedclasses.length; x++) {
                    var mcl = modifiedclasses[x];
                    var text = this.parsedClasses[mcl.name].parent.getModifiedCode();
                    files.push(mcl.filename);
                    contents.push(text);
                    // console.log(mcl.filename + "\n");
                    //  console.log(text + "\n");
                }
                try {
                    await new Server_4.Server().saveFiles(files, contents);
                    for (var y = 0; y < files.length; y++)
                        await this.reloadCodeInEditor(files[y], contents[y]);
                }
                catch (perr) {
                    alert(perr.message);
                }
            }
            return changes;
        }
        async parseFiles() {
            this.parsedClasses = {};
            this.definedImports = {};
            await Typescript_4.default.waitForInited;
            var data = await Registry_27.default.getJSONData("$DBObject");
            for (let x = 0; x < data.length; x++) {
                var entr = data[x];
                var parser = new Parser_1.Parser();
                var file = entr.filename;
                var code = Typescript_4.default.getCode(file);
                // if (code === undefined)
                //     code = await new Server().loadFile(file);
                if (code !== undefined) {
                    try {
                        parser.parse(code);
                    }
                    catch (err) {
                        console.error("error in parsing " + file);
                        throw err;
                    }
                    for (var key in parser.classes) {
                        var pclass = parser.classes[key];
                        pclass["filename"] = file;
                        if (pclass.decorator["$DBObject"]) {
                            //var dbclass=pclass.decorator["$Class"].param[0];
                            this.parsedClasses[pclass.fullClassname] = pclass;
                            this.definedImports[pclass.name + "|" + file.substring(0, file.length - 3)] = pclass;
                        }
                    }
                }
            }
        }
        async loadSchemaFromCode() {
            await this.parseFiles();
            //await registry.loadAllFilesForService("$DBObject")
            await Registry_27.default.reload();
            var data = Registry_27.default.getJSONData("$DBObject");
            this.databaseClasses = [];
            var _this = this;
            (await data).forEach((entr) => {
                var dbclass = new DatabaseClass();
                dbclass.name = entr.classname;
                dbclass.parent = _this;
                this.databaseClasses.push(dbclass);
                var pclass = this.parsedClasses[entr.classname];
                if (pclass) {
                    dbclass.filename = pclass["filename"];
                    dbclass.simpleclassname = pclass.name;
                    dbclass.name = pclass.fullClassname;
                    for (var fname in pclass.members) {
                        var pfield = pclass.members[fname];
                        if (!pfield.decorator["Column"] && !pfield.decorator["PrimaryColumn"] && !pfield.decorator["PrimaryGeneratedColumn"] && !pfield.decorator["OneToOne"] && !pfield.decorator["ManyToOne"] && !pfield.decorator["OneToMany"] && !pfield.decorator["ManyToMany"])
                            continue;
                        var field = new DatabaseField();
                        field["parent"] = dbclass;
                        field.name = fname;
                        dbclass.fields.push(field);
                        var meta = pfield.decorator;
                        if (meta["PrimaryColumn"]) {
                            field.relation = "PrimaryColumn";
                        }
                        else if (meta["PrimaryGeneratedColumn"]) {
                            field.relation = "PrimaryColumn";
                        }
                        else if (meta["Column"]) {
                            field.relation = undefined;
                            //var mt=mtype[0][0];
                            if (meta["Column"].parameter.length > 0 && meta["Column"].parameter.length > 0) {
                                field.properties = meta["Column"].parsedParameter[0];
                            }
                        }
                        else if (meta["ManyToOne"]) {
                            field.relation = "ManyToOne";
                            if (meta["ManyToOne"].parameter.length > 0) {
                                for (var x = 0; x < meta["ManyToOne"].parameter.length; x++) {
                                    let vd = meta["ManyToOne"].parameter[x];
                                    if (x === 0) {
                                        field.type = this.getFulltype(meta["ManyToOne"].parameter[0], pclass).fullClassname;
                                    }
                                    else {
                                        if (!meta["ManyToOne"].parameter[x].startsWith("{")) {
                                            field.inverseSide = vd.split(">")[1].trim();
                                        }
                                        else {
                                            field.properties = meta["ManyToOne"].parsedParameter[x];
                                        }
                                    }
                                }
                            }
                        }
                        else if (meta["OneToMany"]) {
                            field.relation = "OneToMany";
                            if (meta["OneToMany"].parameter.length > 0) {
                                for (var x = 0; x < meta["OneToMany"].parameter.length; x++) {
                                    let vd = meta["OneToMany"].parameter[x];
                                    if (x === 0) {
                                        field.type = this.getFulltype(meta["OneToMany"].parameter[0], pclass).fullClassname + "[]";
                                    }
                                    else {
                                        if (!meta["OneToMany"].parameter[x].startsWith("{")) {
                                            field.inverseSide = vd.split(">")[1].trim();
                                        }
                                        else {
                                            field.properties = meta["OneToMany"].parsedParameter[x];
                                        }
                                    }
                                }
                            }
                        }
                        else if (meta["ManyToMany"]) {
                            field.relation = "ManyToMany";
                            if (meta["ManyToMany"].parameter.length > 0) {
                                for (var x = 0; x < meta["ManyToMany"].parameter.length; x++) {
                                    let vd = meta["ManyToMany"].parameter[x];
                                    if (x === 0) {
                                        field.type = this.getFulltype(meta["ManyToMany"].parameter[0], pclass).fullClassname + "[]";
                                    }
                                    else {
                                        if (!meta["ManyToMany"].parameter[x].startsWith("{")) {
                                            field.inverseSide = vd.split(">")[1].trim();
                                        }
                                        else {
                                            field.properties = meta["ManyToMany"].parsedParameter[x];
                                        }
                                    }
                                }
                            }
                            if (meta["JoinTable"])
                                field.join = true;
                        }
                        else if (meta["OneToOne"]) {
                            field.relation = "OneToOne";
                            if (meta["OneToOne"].parameter.length > 0) {
                                for (var x = 0; x < meta["OneToOne"].parameter.length; x++) {
                                    let vd = meta["OneToOne"].parameter[x];
                                    if (x === 0) {
                                        field.type = this.getFulltype(meta["OneToOne"].parameter[0], pclass).fullClassname;
                                    }
                                    else {
                                        if (!meta["OneToOne"].parameter[x].startsWith("{")) {
                                            field.inverseSide = vd.split(">")[1].trim();
                                        }
                                        else {
                                            field.properties = meta["OneToOne"].parsedParameter[x];
                                        }
                                    }
                                }
                            }
                            if (meta["JoinColumn"])
                                field.join = true;
                        }
                        if (meta["PrimaryColumn"] || meta["PrimaryGeneratedColumn"] || meta["Column"]) {
                            var tp = pfield.type;
                            if (tp === "string")
                                field.type = "string";
                            else if (tp === "number")
                                field.type = "int";
                            else if (tp === "boolean")
                                field.type = "boolean";
                            else if (tp === "Date")
                                field.type = "Date";
                            else
                                throw new Error("type unknown " + dbclass.name + ":" + field.name);
                            if (field.properties !== undefined && field.properties["type"]) {
                                field.type = field.properties["type"];
                            }
                        }
                    }
                }
            });
        }
    };
    DatabaseSchema.basicdatatypes = ["string", "int", "decimal", "boolean", "Date"];
    DatabaseSchema = DatabaseSchema_2 = __decorate([
        Registry_26.$Class("jassijs_editor.util.DatabaseSchema")
    ], DatabaseSchema);
    exports.DatabaseSchema = DatabaseSchema;
    /*
    @$Class("jassijs.base.DatabaseColumnOptions")
    class ColumnOptions{
    //	@$Property({type:"string",chooseFrom:DatabaseSchema.basicdatatypes,description:"Column type. Must be one of the value from the ColumnTypes class."})
      //  type?: ColumnType;
        @$Property({description:"Indicates if column's value can be set to NULL.", default:false})
        nullable?: boolean;
        @$Property({type:"string",description:"Default database value."})
        default?: any;
        @$Property({description:"Indicates if column is always selected by QueryBuilder and find operations.",default:true})
        @$Property({description:'Column types length. Used only on some column types. For example type = "string" and length = "100" means that ORM will create a column with type varchar(100).'})
        length?: number;
        [name:string]:any;
    }*/
    async function test3() {
        var schema = new DatabaseSchema();
        await schema.loadSchemaFromCode();
        var schema2 = new DatabaseSchema();
        await schema2.loadSchemaFromCode();
        var test = new DatabaseClass();
        test.parent = schema2;
        test.name = "de.NeuerKunde";
        var testf = new DatabaseField();
        testf.name = "id";
        testf.type = "int";
        testf.relation = "PrimaryColumn";
        test.fields.push(testf);
        schema2.databaseClasses.push(test);
        var f = new DatabaseField();
        f.name = "hallo";
        f.type = "string";
        schema2.getClass("de.AR").fields.push(f);
        schema2.getClass("de.AR").getField("nummer").properties = { nullable: false };
        var text = await schema2.updateSchema(true);
        //console.log(result);
        //test.pop();
        //schema.visitNode(sourceFile);
    }
    exports.test3 = test3;
    async function test2() {
        var schema = new DatabaseSchema();
        await schema.loadSchemaFromCode();
        var h = schema.getClass("de.AR").getField("kunde");
        var f = h.getReverseField();
        var kk = f.relationinfo;
        debugger;
        f.relationinfo = kk;
    }
    exports.test2 = test2;
});
define("jassijs_editor/util/DragAndDropper", ["require", "exports", "jassijs/remote/Registry", "jassijs/ext/jquerylib"], function (require, exports, Registry_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DragAndDropper = void 0;
    let DragAndDropper = class DragAndDropper {
        constructor() {
            this.onpropertychanged = undefined;
            this.onpropertyadded = undefined;
            this.lastDropCanceled = false;
            this.allIDs = "";
        }
        ;
        /**
         * could be override to block dragging
         */
        isDragEnabled(event, ui) {
            var mouse = event.target._this.dom.style.cursor;
            if (mouse === "e-resize" || mouse === "s-resize" || mouse === "se-resize")
                return true;
            else
                return false;
        }
        //dragging is active
        isDragging() {
            return this._isDragging;
        }
        /*public activateDragging(enable:boolean) {
            $(this.allIDs).find(".jcontainer").not(".jdesigncontainer").draggable(enable ? "enable" : "disable");
        }*/
        enableDraggable(enable) {
            //  this.onpropertychanged = undefined;
            // this.onpropertyadded = undefined;
            try {
                if (this.draggableComponents !== undefined) {
                    if (!enable)
                        this.draggableComponents.draggable('disable');
                    else
                        this.draggableComponents.draggable('enable');
                }
            }
            catch (_a) {
                console.log("fetched error");
                ;
            }
        }
        _drop(target, event, ui) {
            var _this = this;
            var newComponent = ui.draggable[0]._this;
            var newParent = target._this;
            var beforeComponent = target._this;
            var designDummyAtEnd;
            if ((beforeComponent === null || beforeComponent === void 0 ? void 0 : beforeComponent.type) === "atEnd") {
                designDummyAtEnd = beforeComponent;
                beforeComponent = undefined;
                newParent = newParent.designDummyFor;
            }
            if ((beforeComponent === null || beforeComponent === void 0 ? void 0 : beforeComponent.type) === "beforeComponent") {
                beforeComponent = newParent.designDummyFor;
                newParent = newParent.designDummyFor._parent;
            }
            if (target._this.isAbsolute) {
                var left = parseInt(ui.helper[0].style.left);
                var top = parseInt(ui.helper[0].style.top);
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    var offsetNewParent = $(target._this.dom).offset();
                    left = -offsetNewParent.left + parseInt($(ui.helper).css('left'));
                    top = -offsetNewParent.top + parseInt($(ui.helper).css('top'));
                    //      ui.helper[0]._this.left=left;
                    //    ui.helper[0]._this.y=top;
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(ui.draggable[0]._this.createFromType, newComponent, left, top, newParent, undefined);
                    return;
                }
                var oldParent = ui.draggable[0]._this._parent;
                var pleft = $(newParent.dom).offset().left;
                var ptop = $(newParent.dom).offset().top;
                var oleft = $(oldParent.dom).offset().left;
                var otop = $(oldParent.dom).offset().top;
                left = left + oleft - pleft;
                top = top + otop - ptop;
                //snap to 5
                if (top !== 1) {
                    top = Math.round(top / 5) * 5;
                }
                if (left !== 1) {
                    left = Math.round(left / 5) * 5;
                }
                oldParent.remove(ui.draggable[0]._this);
                $(ui.draggable).css({ 'top': top, 'left': left, position: 'absolute' });
                target._this.add(ui.draggable[0]._this);
                if (_this.onpropertychanged !== undefined) {
                    _this.onpropertychanged(newComponent, left, top, oldParent, newParent, undefined);
                }
            }
            else { //relative layout
                var oldParent = ui.draggable[0]._this._parent;
                if (!$(newParent.domWrapper).hasClass("jcontainer") && newParent._parent) {
                    newParent = newParent._parent;
                }
                $(ui.draggable).css({ 'top': "", 'left': "", "position": "relative" });
                if (ui.draggable[0]._this.createFromType !== undefined) {
                    if (this.onpropertyadded !== undefined)
                        this.onpropertyadded(newComponent.createFromType, ui.draggable[0]._this, undefined, undefined, newParent, beforeComponent);
                }
                else {
                    //newParent.add(ui.draggable[0]._this);
                    if (target._this !== newParent)
                        newParent.addBefore(ui.draggable[0]._this, target._this);
                    else
                        newParent.add(ui.draggable[0]._this);
                    if (_this.onpropertychanged !== undefined) {
                        _this.onpropertychanged(newComponent, undefined, undefined, oldParent, newParent, beforeComponent);
                    }
                }
            }
            if (designDummyAtEnd) { //this Component should stand at last
                var par = designDummyAtEnd._parent;
                par.remove(designDummyAtEnd);
                par.add(designDummyAtEnd);
                par.designDummies.push(designDummyAtEnd); //bug insert dummy again
            }
        }
        /**
        * install the DragAndDropper
        * all child jomponents are draggable
        * all child containers are droppable
        * @param  parentPanel - all childs are effected
        * @param allIDs - ID's of all editable components e.g. #10,#12
        * @returns {unresolved}
        */
        install(parentPanel, allIDs) {
            //$(this.parentPainer");
            var _this = this;
            if (parentPanel !== undefined)
                this.parentPanel = parentPanel;
            if (allIDs !== undefined)
                this.allIDs = allIDs;
            var dcs = [];
            this.allIDs.split(",").forEach((str) => {
                let el = document.getElementById(str.substring(1));
                if (el) {
                    var classes = el.classList;
                    if (classes.contains("jcomponent") && !classes.contains("jdesigncontainer") && !classes.contains("designerNoDraggable"))
                        dcs.push(document.getElementById(str.substring(1)));
                }
            });
            //slow
            // this.draggableComponents = $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
            this.draggableComponents = $(dcs); //.find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
            this.draggableComponents.draggable({
                cancel: "false",
                revert: "invalid",
                drag: function (event, ui) {
                    _this.lastDropCanceled = _this.isDragEnabled(event, ui);
                    setTimeout(function () {
                        _this.lastDropCanceled = false;
                    }, 100);
                    return !_this.lastDropCanceled;
                },
                start: function () {
                    _this._isDragging = true;
                },
                stop: function () {
                    _this._isDragging = false;
                },
                //appendTo: "body"
                helper: "clone",
            });
            //$(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('disable');
            //$(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('enable');
            this.draggableComponents.draggable('disable');
            this.draggableComponents.draggable('enable');
            var _this = this;
            //all jcompoenents are proptargets                                         also jdesignummy     but no jcomponents in absolute Layout  no jcomponens that contains a jdesigndummy  absolutelayout container
            this.droppableComponents = $(this.parentPanel.dom).parent().parent().find(".jdesigndummy,.jcomponent:not(.jabsolutelayout>.jcomponent, :has(.jdesigndummy)),                      .jcontainer>.jabsolutelayout");
            //console.log(this.droppableComponents.length);
            for (var c = 0; c < this.droppableComponents.length; c++) {
                //  console.log(this.droppableComponents[c].id);
            }
            var isDropping = false;
            var dropWnd;
            var dropEvent;
            var dropUI;
            this.droppableComponents.droppable({
                greedy: true,
                hoverClass: "ui-state-highlight",
                tolerance: "pointer",
                drop: function (event, ui) {
                    //function is called for every Window in z-Index - we need the last one
                    if (_this.lastDropCanceled)
                        return;
                    dropWnd = this;
                    dropEvent = event;
                    dropUI = ui;
                    if (!isDropping) {
                        isDropping = true;
                        window.setTimeout(function () {
                            isDropping = false;
                            _this._drop(dropWnd, dropEvent, dropUI);
                        }, 50);
                    }
                }
            });
            //this.droppableComponents.droppable("enable");
            //$(this.allIDs).eq(".jcontainer").not(".jdesigncontainer").droppable("enable");
            //$(this.allIDs).filter(".jcontainer").not(".jdesigncontainer").droppable("enable");
        }
        /**
         * uninstall the DragAndDropper
         */
        uninstall() {
            this.onpropertychanged = undefined;
            this.onpropertyadded = undefined;
            // 	$(this.allIDs).eq(".jcontainer").not(".jdesigncontainer").droppable("disable");  
            //$(this.parentPanel.dom).parent().parent().find(".jcontainer").droppable("destroy");
            // var components=$(this.allIDs);
            if (this.draggableComponents !== undefined) {
                this.draggableComponents.draggable();
                try {
                    this.draggableComponents.draggable('destroy');
                }
                catch (_a) {
                    console.log("unable to destroy draganddrop");
                }
                delete $.ui["ddmanager"].current; //memory leak https://bugs.jqueryui.com/ticket/10667
                this.draggableComponents = undefined;
            }
            if (this.droppableComponents !== undefined) {
                this.droppableComponents.droppable();
                this.droppableComponents.droppable("destroy");
            }
        }
    };
    DragAndDropper = __decorate([
        Registry_28.$Class("jassijs_editor.util.DragAndDropper"),
        __metadata("design:paramtypes", [])
    ], DragAndDropper);
    exports.DragAndDropper = DragAndDropper;
});
define("jassijs_editor/util/Parser", ["require", "exports", "jassijs/remote/Registry", "jassijs_editor/util/Typescript", "jassijs/remote/Test", "jassijs/remote/Classes"], function (require, exports, Registry_29, Typescript_5, Test_2, Classes_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.tests = exports.Parser = exports.ParsedClass = void 0;
    class ParsedDecorator {
        constructor() {
            this.parsedParameter = [];
            this.parameter = [];
        }
    }
    class ParsedMember {
        constructor() {
            this.decorator = {};
        }
    }
    class ParsedClass {
        constructor() {
            this.members = {};
            this.decorator = {};
        }
    }
    exports.ParsedClass = ParsedClass;
    let Parser = class Parser {
        /**
         * parses Code for UI relevant settings
         * @class jassijs_editor.util.Parser
         */
        constructor() {
            this.sourceFile = undefined;
            this.typeMe = {};
            this.classes = {};
            this.imports = {};
            this.functions = {};
            this.variables = {};
            this.data = {};
            /** {[string]} - all code lines*/
        }
        getModifiedCode() {
            const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
            const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, this.jsxVariables ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            var result = printer.printNode(ts.EmitHint.Unspecified, this.sourceFile, resultFile);
            result = this.reformatCode(result);
            return result;
        }
        reformatCode(code) {
            const serviceHost = {
                getScriptFileNames: () => [],
                getScriptVersion: fileName => "1.0",
                getScriptSnapshot: fileName => {
                    return ts.ScriptSnapshot.fromString(code);
                },
                getCurrentDirectory: () => "",
                getCompilationSettings: () => ({}),
                getDefaultLibFileName: options => ts.getDefaultLibFilePath(options),
                fileExists: (a) => false,
                readFile: (a) => code,
                readDirectory: (a) => []
            };
            var file = this.jsxVariables ? "tempdoc.tsx" : "tempdoc.ts";
            const languageService = ts.createLanguageService(serviceHost, ts.createDocumentRegistry());
            const textChanges = languageService.getFormattingEditsForDocument(file, {
                convertTabsToSpaces: true,
                //   insertSpaceAfterCommaDelimiter: true,
                //  insertSpaceAfterKeywordsInControlFlowStatements: true,
                // insertSpaceBeforeAndAfterBinaryOperators: true,
                newLineCharacter: "\n",
                indentStyle: ts.IndentStyle.Smart,
                indentSize: 4,
                tabSize: 4
            });
            let finalText = code;
            var arr = textChanges.sort((a, b) => b.span.start - a.span.start);
            for (var x = 0; x < arr.length; x++) {
                var textChange = arr[x];
                const { span } = textChange;
                finalText = finalText.slice(0, span.start) + textChange.newText
                    + finalText.slice(span.start + span.length);
            }
            return finalText;
        }
        /**
         * add a property
         * @param {string} variable - name of the variable
         * @param {string} property - name of the property
         * @param {string} value  - code - the value
         * @param node - the node of the statement
         */
        add(variable, property, value, node, isFunction = false, trim = true) {
            if (value === undefined || value === null)
                return;
            if (trim)
                value = value.trim();
            property = property.trim();
            if (this.data[variable] === undefined) {
                this.data[variable] = {};
            }
            if (this.data[variable][property] === undefined) {
                this.data[variable][property] = [];
            }
            if (Array.isArray(this.data[variable][property])) {
                this.data[variable][property].push({
                    value: value,
                    node: node,
                    isFunction
                });
            }
        }
        /**
         * read a property value from code
         * @param {string} variable - the name of the variable
         * @param {string} property - the name of the property
         */
        getPropertyValue(variable, property) {
            if (this.data[variable] !== undefined) {
                if (this.data[variable][property] !== undefined) {
                    var ret = this.data[variable][property][0].value;
                    return ret;
                }
            }
            return undefined;
            /* variable="this."+variable;
             if(this.data[variable]!==undefined){
                 if(this.data[variable][property]!==undefined){
                     return this.data[variable][property][0].value;
                 }
             }*/
            //this 
            //   var value=this.propertyEditor.parser.getPropertyValue(this.variablename,this.property.name);
        }
        addTypeMe(name, type) {
            if (!this.typeMeNode)
                return;
            var tp = ts.createTypeReferenceNode(type, []);
            var newnode = ts.createPropertySignature(undefined, name + "?", undefined, tp, undefined);
            this.typeMeNode["members"].push(newnode);
        }
        /**
         * add import {name} from file
         * @param name
         * @param file
         */
        addImportIfNeeded(name, file) {
            if (this.imports[name] === undefined) {
                //@ts-ignore
                var imp = ts.createNamedImports([ts.createImportSpecifier(false, undefined, ts.createIdentifier(name))]);
                const importNode = ts.createImportDeclaration(undefined, undefined, ts.createImportClause(undefined, imp), ts.createLiteral(file));
                this.sourceFile = ts.updateSourceFileNode(this.sourceFile, [importNode, ...this.sourceFile.statements]);
            }
        }
        parseTypeMeNode(node) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.TypeLiteral) {
                if (node["members"])
                    this.typeMeNode = node;
                node["members"].forEach(function (tnode) {
                    if (tnode.name) {
                        var name = tnode.name.text;
                        var stype = tnode.type.typeName.text;
                        _this.typeMe[name] = { node: tnode, value: stype, isFunction: false };
                    }
                    //            this.add("me", name, "typedeclaration:" + stype, undefined, aline, aline);
                });
            }
            node.getChildren().forEach(c => this.parseTypeMeNode(c));
        }
        convertArgument(arg) {
            if (arg === undefined)
                return undefined;
            if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
                var ret = {};
                var props = arg.properties;
                if (props !== undefined) {
                    for (var p = 0; p < props.length; p++) {
                        ret[props[p].name.text] = this.convertArgument(props[p].initializer);
                    }
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.StringLiteral) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.ArrayLiteralExpression) {
                let ret = [];
                for (var p = 0; p < arg.elements.length; p++) {
                    ret.push(this.convertArgument(arg.elements[p]));
                }
                return ret;
            }
            else if (arg.kind === ts.SyntaxKind.Identifier) {
                return arg.text;
            }
            else if (arg.kind === ts.SyntaxKind.TrueKeyword) {
                return true;
            }
            else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
                return false;
            }
            else if (arg.kind === ts.SyntaxKind.NumericLiteral) {
                return Number(arg.text);
            }
            else if (arg.kind === ts.SyntaxKind.ArrowFunction || arg.kind === ts.SyntaxKind.FunctionExpression) {
                return arg.getText();
            }
            throw new Classes_9.JassiError("Error type not found");
        }
        parseDecorator(dec) {
            var ex = dec.expression;
            var ret = new ParsedDecorator();
            if (ex.expression === undefined) {
                ret.name = ex.text;
            }
            else {
                ret.name = ex.expression.escapedText;
                if (ex.expression !== undefined) {
                    for (var a = 0; a < ex.arguments.length; a++) {
                        ret.parsedParameter.push(this.convertArgument(ex.arguments[a]));
                        ret.parameter.push(ex.arguments[a].getText());
                    }
                }
            }
            return ret;
        }
        parseClass(node) {
            if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                var parsedClass = new ParsedClass();
                parsedClass.parent = this;
                parsedClass.name = node.name.getText();
                parsedClass.node = node;
                this.classes[parsedClass.name] = parsedClass;
                if (node.decorators !== undefined) {
                    var dec = {};
                    for (let x = 0; x < node.decorators.length; x++) {
                        var parsedDec = this.parseDecorator(node.decorators[x]);
                        parsedClass.decorator[parsedDec.name] = parsedDec;
                        if (parsedClass.decorator["$Class"] && parsedDec.parameter.length > 0)
                            parsedClass.fullClassname = parsedDec.parameter[0].replaceAll('"', "");
                    }
                }
                for (var x = 0; x < node["members"].length; x++) {
                    var parsedMem = new ParsedMember();
                    var mem = node["members"][x];
                    if (mem.name === undefined)
                        continue; //Constructor
                    parsedMem.name = mem.name.escapedText;
                    parsedMem.node = node["members"][x];
                    parsedMem.type = (mem.type ? mem.type.getFullText().trim() : undefined);
                    parsedClass.members[parsedMem.name] = parsedMem;
                    var params = [];
                    if (mem.decorators) {
                        for (let i = 0; i < mem.decorators.length; i++) {
                            let parsedDec = this.parseDecorator(mem.decorators[i]);
                            parsedMem.decorator[parsedDec.name] = parsedDec;
                        }
                    }
                }
                if (this.classScope) {
                    for (let x = 0; x < this.classScope.length; x++) {
                        var col = this.classScope[x];
                        if (col.classname === parsedClass.name && parsedClass.members[col.methodname]) {
                            var nd = parsedClass.members[col.methodname].node;
                            this.parseProperties(nd);
                        }
                    }
                }
            }
        }
        parseConfig(node) {
            if (node.arguments.length > 0) {
                var left = node.expression.getText();
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                    //@ts-ignore
                    var props = node.arguments[0].properties;
                    if (props !== undefined) {
                        for (var p = 0; p < props.length; p++) {
                            var name = props[p].name.text;
                            // var value = this.convertArgument(props[p].initializer);
                            var code = props[p].initializer ? props[p].initializer.getText() : "";
                            if ((code === null || code === void 0 ? void 0 : code.indexOf(".config")) > -1) {
                                this.parseProperties(props[p].initializer);
                            }
                            this.add(variable, name, code, props[p], false);
                        }
                    }
                }
            }
        }
        parseProperties(node) {
            var _this = this;
            if (ts.isVariableDeclaration(node)) {
                var name = node.name.getText();
                if (node.initializer !== undefined) {
                    var value = node.initializer.getText();
                    this.add(name, "_new_", value, node.parent.parent);
                }
            }
            if ((ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) ||
                ts.isCallExpression(node)) {
                var node1;
                var node2;
                var left;
                var value;
                var isFunction = false;
                if (ts.isBinaryExpression(node)) {
                    node1 = node.left;
                    node2 = node.right;
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    value = node2.getText(); //this.code.substring(node2.pos, node2.end).trim();
                    if (value.startsWith("new "))
                        this.add(left, "_new_", value, node.parent);
                }
                if (ts.isCallExpression(node)) {
                    node1 = node.expression;
                    node2 = node.arguments;
                    isFunction = true;
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    var params = [];
                    node.arguments.forEach((arg) => {
                        var _a, _b, _c;
                        params.push(arg.getText());
                        if (((_c = (_b = (_a = arg) === null || _a === void 0 ? void 0 : _a.expression) === null || _b === void 0 ? void 0 : _b.name) === null || _c === void 0 ? void 0 : _c.getText()) === "config") {
                            _this.parseConfig(arg);
                        }
                        //arg.getText().indexOf(".config(")
                    });
                    if (left.endsWith(".config")) {
                        var lastpos = left.lastIndexOf(".");
                        var variable = left;
                        var prop = "";
                        if (lastpos !== -1) {
                            variable = left.substring(0, lastpos);
                            prop = left.substring(lastpos + 1);
                        }
                        value = params.join(", ");
                        this.add(variable, prop, value, node, isFunction);
                        this.parseConfig(node);
                        return;
                    }
                    if (left.endsWith(".createRepeatingComponent")) {
                        this.visitNode(node.arguments[0]["body"], true);
                        //this.parseProperties(node.arguments[0]["body"]);
                    }
                    value = params.join(", "); //this.code.substring(node2.pos, node2.end).trim();//
                }
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                }
                this.add(variable, prop, value, node.parent, isFunction);
            }
            else
                node.getChildren().forEach(c => _this.visitNode(c, true));
        }
        parseJSX(_this, node) {
            var _a, _b;
            var nd = node;
            var element = nd;
            if (nd.openingElement)
                element = nd.openingElement;
            var jsx = _this.jsxVariables[element.pos - 1];
            if (jsx === undefined)
                jsx = _this.jsxVariables[element.pos];
            if (jsx === undefined)
                jsx = _this.jsxVariables[element.pos + 1];
            if (jsx) {
                jsx.name = this.getNextVariableNameForType(jsx.name);
                _this.jsxVariables[jsx.name] = jsx;
                nd["jname"] = jsx.name;
                _this.add(jsx.name, "_new_", nd.getFullText(this.sourceFile), node);
                for (var x = 0; x < element.attributes.properties.length; x++) {
                    var prop = element.attributes.properties[x];
                    var val = prop["initializer"].text;
                    _this.add(jsx.name, prop.name.text, val, prop);
                }
                if (((_a = node.parent) === null || _a === void 0 ? void 0 : _a.jname) !== undefined) {
                    _this.add((_b = node.parent) === null || _b === void 0 ? void 0 : _b.jname, "add", jsx.name, node);
                }
                //node.getChildren().forEach(c => _this.visitNode(c, consumeProperties));
                //mark textnodes
                var counttrivial = 0;
                if (nd.children) {
                    for (var x = 0; x < nd.children.length; x++) {
                        var ch = nd.children[x];
                        if (ch.kind === ts.SyntaxKind.JsxText) {
                            if (ch.containsOnlyTriviaWhiteSpaces) {
                                counttrivial++;
                            }
                            else {
                                var njsx = _this.jsxVariables[ch.pos - 1];
                                if (njsx === undefined)
                                    njsx = _this.jsxVariables[ch.pos];
                                if (njsx === undefined)
                                    njsx = _this.jsxVariables[ch.pos + 1];
                                if (njsx) {
                                }
                                var varname = this.getNextVariableNameForType("text", "text");
                                var stext = JSON.stringify(ch.text);
                                _this.add(varname, "_new_", stext, ch, false, false);
                                _this.jsxVariables[varname] = ch;
                                _this.add(varname, "text", stext, ch, false, false);
                                //if ((<any>node.parent)?.jname !== undefined) {
                                _this.add(jsx.name, "add", varname, ch);
                                // }
                                var chvar = {
                                    pos: ch.pos,
                                    component: _this.jsxVariables[jsx.name].component._components[x - counttrivial],
                                    name: varname
                                };
                                _this.jsxVariables[varname] = chvar;
                                this.jsxVariables.__orginalarray__.push(chvar);
                            }
                        }
                        else {
                            _this.visitNodeJSX(ch, {}); // consumeProperties)
                        }
                    }
                }
            }
            //        console.log(nd.openingElement.getText(this.sourceFile));
        }
        visitNode(node, consumeProperties = undefined) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.VariableDeclaration) {
                this.variables[node["name"].text] = node;
            }
            if (node.kind === ts.SyntaxKind.ImportDeclaration) {
                var nd = node;
                var file = nd.moduleSpecifier.text;
                if (nd.importClause && nd.importClause.namedBindings) {
                    var names = nd.importClause.namedBindings.elements;
                    for (var e = 0; e < names.length; e++) {
                        this.imports[names[e].name.escapedText] = file;
                    }
                }
                return;
            }
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Me") {
                this.parseTypeMeNode(node);
                return;
            }
            else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                this.parseClass(node);
                return;
            }
            else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                this.functions[node["name"].text] = node;
                if (this.classScope) {
                    for (let x = 0; x < this.classScope.length; x++) {
                        var col = this.classScope[x];
                        if (col.classname === undefined && node["name"].text === col.methodname)
                            consumeProperties = true;
                    }
                }
                else if (this.jsxVariables === undefined)
                    consumeProperties = true;
            }
            if (node.kind === ts.SyntaxKind.JsxElement) {
                _this.parseJSX(_this, node);
                return;
            }
            if (consumeProperties)
                this.parseProperties(node);
            else
                node.getChildren().forEach(c => _this.visitNode(c, consumeProperties));
            //TODO remove this block
            /*  if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                  this.add(node["name"].text, "", "", undefined);
              }*/
        }
        visitNodeJSX(node, consumeProperties = undefined) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.JsxElement || node.kind === ts.SyntaxKind.JsxSelfClosingElement) {
                _this.parseJSX(_this, node);
                return;
            }
            node.getChildren().forEach(c => _this.visitNodeJSX(c, consumeProperties));
            //TODO remove this block
            /*  if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                  this.add(node["name"].text, "", "", undefined);
              }*/
        }
        searchClassnode(node, pos) {
            if (ts.isMethodDeclaration(node)) {
                return {
                    classname: node.parent["name"]["text"],
                    methodname: node.name["text"]
                };
            }
            if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                var funcname = node["name"].text;
                return {
                    classname: undefined,
                    methodname: funcname
                };
            }
            var childs = node.getChildren();
            for (var x = 0; x < childs.length; x++) {
                var c = childs[x];
                if (pos >= c.pos && pos <= c.end) {
                    var test = this.searchClassnode(c, pos);
                    if (test)
                        return test;
                }
            }
            ;
            return undefined;
        }
        getClassScopeFromPosition(code, pos) {
            this.data = {};
            this.code = code;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true, this.jsxVariables ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
            return this.searchClassnode(this.sourceFile, pos);
            //return this.parseold(code,onlyfunction);
        }
        removePos(node) {
            var _this = this;
            node.pos = -1;
            node.end = -1;
            node.forEachChild((ch) => _this.removePos(ch));
        }
        createNode(code) {
            var ret = ts.createSourceFile('dummytemp.ts', code, ts.ScriptTarget.ES5, true, this.jsxVariables ? ts.ScriptKind.TSX : undefined);
            var node = ret.statements[0].expression;
            this.removePos(node);
            return node;
            //return this.parseold(code,onlyfunction);
        }
        initJSXVariables(values) {
            var autovars = {};
            var jsxvars = {};
            for (var x = 0; x < values.length; x++) {
                var v = values[x].component;
                var tag = v.tag === undefined ? v.constructor.name : v.tag;
                if (autovars[tag] === undefined)
                    autovars[tag] = 1;
                values[x].name = this.getNextVariableNameForType(tag); //tag + (autovars[tag]++);
                this.data[values[x].name] = {}; //reserve variable
                jsxvars[values[x].pos] = values[x];
            }
            this.jsxVariables = jsxvars;
            this.jsxVariables.__orginalarray__ = values;
        }
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code, classScope = undefined, jsxVariables = undefined) {
            this.data = {};
            this.code = code;
            if (classScope !== undefined)
                this.classScope = classScope;
            else
                classScope = this.classScope;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true, jsxVariables ? ts.ScriptKind.TSX : undefined);
            if (jsxVariables) {
                this.initJSXVariables(jsxVariables);
                this.visitNodeJSX(this.sourceFile, false);
                return;
            }
            if (this.classScope === undefined)
                this.visitNode(this.sourceFile, true);
            else
                this.visitNode(this.sourceFile);
            //return this.parseold(code,onlyfunction);
        }
        removeNode(node) {
            if (node.parent["statements"]) {
                var pos = node.parent["statements"].indexOf(node);
                if (pos >= 0)
                    node.parent["statements"].splice(pos, 1);
            }
            else if (node.parent.parent["type"] !== undefined) {
                var pos = node.parent.parent["type"]["members"].indexOf(node);
                if (pos >= 0)
                    node.parent.parent["type"]["members"].splice(pos, 1);
            }
            else if (node.parent["members"] !== undefined) {
                var pos = node.parent["members"].indexOf(node);
                if (pos >= 0)
                    node.parent["members"].splice(pos, 1);
            }
            else if (node.parent["properties"] !== undefined) {
                var pos = node.parent["properties"].indexOf(node);
                if (pos >= 0)
                    node.parent["properties"].splice(pos, 1);
            }
            else if (node.parent["elements"] !== undefined) {
                var pos = node.parent["elements"].indexOf(node);
                if (pos >= 0)
                    node.parent["elements"].splice(pos, 1);
            }
            else if (node.parent.kind === ts.SyntaxKind.ExpressionStatement) {
                var pos = node.parent.parent["statements"].indexOf(node.parent);
                if (pos >= 0)
                    node.parent.parent["statements"].splice(pos, 1);
            }
            else
                throw Error(node.getFullText() + "could not be removed");
        }
        /**
         * modify a member
         **/
        addOrModifyMember(member, pclass) {
            //member.node
            //var newmember=ts.createProperty
            var newdec = undefined;
            for (var key in member.decorator) {
                var dec = member.decorator[key];
                if (!newdec)
                    newdec = [];
                //ts.createDecorator()
                //member.decorator[key].name;
                var params = undefined;
                if (dec.parameter) {
                    params = [];
                    for (var i = 0; i < dec.parameter.length; i++) {
                        params.push(ts.createIdentifier(dec.parameter[i]));
                    }
                }
                var call = ts.createCall(ts.createIdentifier(dec.name), undefined, params);
                newdec.push(ts.createDecorator(call));
            }
            //var type=ts.createTy
            var newmember = ts.createProperty(newdec, undefined, member.name, undefined, ts.createTypeReferenceNode(member.type, []), undefined);
            var node = undefined;
            for (var key in pclass.members) {
                if (key === member.name)
                    node = pclass.members[key].node;
            }
            if (node === undefined) {
                pclass.node["members"].push(newmember);
            }
            else {
                var pos = pclass.node["members"].indexOf(node);
                pclass.node["members"][pos] = newmember;
            }
            pclass.members[member.name] = member;
            member.node = newmember;
        }
        /**
        * removes the property from code
        * @param {type} property - the property to remove
        * @param {type} [onlyValue] - remove the property only if the value is found
        * @param {string} [variablename] - thpe name of the variable - default=this.variablename
        */
        removePropertyInCode(property, onlyValue = undefined, variablename = undefined) {
            var _a, _b, _c;
            if (this.data[variablename] !== undefined && this.data[variablename].config !== undefined && property === "add") {
                property = "children";
                var oldparent = this.data[variablename][property][0].node;
                for (var x = 0; x < oldparent.initializer.elements.length; x++) {
                    var valueNode = oldparent.initializer.elements[x];
                    if (valueNode.getText() === onlyValue || valueNode.getText().startsWith(onlyValue + ".")) {
                        oldparent.initializer.elements.splice(x, 1);
                        if (oldparent.initializer.elements.length === 0) {
                            this.removeNode(oldparent);
                        }
                        return valueNode;
                    }
                }
            }
            if (this.data[variablename] !== undefined && this.data[variablename][property] !== undefined) {
                var prop = undefined;
                if (onlyValue !== undefined) {
                    for (var x = 0; x < this.data[variablename][property].length; x++) {
                        if (this.data[variablename][property][x].value === onlyValue || this.data[variablename][property][x].value.startsWith(onlyValue + ".")) {
                            prop = this.data[variablename][property][x];
                        }
                    }
                }
                else
                    prop = this.data[variablename][property][0];
                if (prop == undefined)
                    return;
                this.removeNode(prop.node);
                if (((_b = (_a = prop.node["expression"]) === null || _a === void 0 ? void 0 : _a.arguments) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    return (_c = prop.node["expression"]) === null || _c === void 0 ? void 0 : _c.arguments[0];
                }
                return prop.node;
                /*var oldvalue = this.lines[prop.linestart - 1];
                for (let x = prop.linestart;x <= prop.lineend;x++) {
                    this.lines[x - 1] = undefined;
                    if (x > 1 && this.lines[x - 2].endsWith(","))//type Me={ bt2?:Button,
                        this.lines[x - 2] = this.lines[x - 2].substring(0, this.lines[x - 2].length);
                }*/
                //var text = this.parser.linesToString();
                //this.codeEditor.value = text;
                //this.updateParser();
            }
        }
        /**
         * removes the variable from code
         * @param {string} varname - the variable to remove
         */
        removeVariablesInCode(varnames) {
            var _a, _b, _c, _d;
            var allprops = [];
            //collect allNodes to delete
            for (var vv = 0; vv < varnames.length; vv++) {
                var varname = varnames[vv];
                var prop = this.data[varname];
                if (varname.startsWith("me.") && this.typeMe[varname.substring(3)] !== undefined)
                    allprops.push(this.typeMe[varname.substring(3)]);
                //remove properties
                for (var key in prop) {
                    let props = prop[key];
                    props.forEach((p) => {
                        allprops.push(p);
                    });
                }
                if (varname.startsWith("me.")) {
                    let props = this.data.me[varname.substring(3)];
                    props === null || props === void 0 ? void 0 : props.forEach((p) => {
                        allprops.push(p);
                    });
                }
            }
            //remove nodes
            for (var x = 0; x < allprops.length; x++) {
                this.removeNode(allprops[x].node);
            }
            for (var vv = 0; vv < varnames.length; vv++) {
                var varname = varnames[vv];
                //remove lines where used as parameter
                for (var propkey in this.data) {
                    var prop = this.data[propkey];
                    for (var key in prop) {
                        var props = prop[key];
                        for (var x = 0; x < props.length; x++) {
                            let p = props[x];
                            var params = p.value.split(",");
                            for (var i = 0; i < params.length; i++) {
                                if (params[i] === varname || params[i] === "this." + varname) {
                                    this.removeNode(p.node);
                                }
                            }
                            //in children:[]
                            //@ts-ignore
                            var inconfig = (_c = (_b = (_a = prop[key][0]) === null || _a === void 0 ? void 0 : _a.node) === null || _b === void 0 ? void 0 : _b.initializer) === null || _c === void 0 ? void 0 : _c.elements;
                            if (inconfig) {
                                for (var x = 0; x < inconfig.length; x++) {
                                    if (inconfig[x].getText() === varname || inconfig[x].getText().startsWith(varname)) {
                                        this.removeNode(inconfig[x]);
                                    }
                                }
                                if (inconfig.length === 0) {
                                    this.removeNode((_d = prop[key][0]) === null || _d === void 0 ? void 0 : _d.node);
                                }
                            }
                        }
                    }
                }
            }
        }
        getNodeFromScope(classscope, variablescope = undefined) {
            var _a, _b, _c;
            var scope;
            if (classscope === undefined) {
                return this.sourceFile;
            }
            if (variablescope) {
                scope = (_a = this.data[variablescope.variablename][variablescope.methodname][0]) === null || _a === void 0 ? void 0 : _a.node;
                if (scope.expression)
                    scope = scope.expression.arguments[0];
                else
                    scope = scope.initializer;
            }
            else {
                for (var i = 0; i < classscope.length; i++) {
                    var sc = classscope[i];
                    if (sc.classname) {
                        scope = (_c = (_b = this.classes[sc.classname]) === null || _b === void 0 ? void 0 : _b.members[sc.methodname]) === null || _c === void 0 ? void 0 : _c.node;
                        if (scope)
                            break;
                    }
                    else { //exported function
                        scope = this.functions[sc.methodname];
                    }
                }
            }
            return scope;
        }
        /**
         * gets the next variablename
         * */
        getNextVariableNameForType(type, suggestedName = undefined) {
            var varname = suggestedName;
            if (varname === undefined)
                varname = type.split(".")[type.split(".").length - 1].toLowerCase();
            for (var counter = 1; counter < 1000; counter++) {
                if (this.data[varname + (counter === 1 ? "" : counter)] === undefined && (this.data.me === undefined || this.data.me[varname + (counter === 1 ? "" : counter)] === undefined))
                    break;
            }
            return varname + (counter === 1 ? "" : counter);
        }
        /**
         * change objectliteral to mutliline if needed
         */
        switchToMutlilineIfNeeded(node, newProperty, newValue) {
            var oldValue = node.getText();
            if (node["multiLine"] !== true) {
                var len = 0;
                for (var x = 0; x < node.parent["arguments"][0].properties.length; x++) {
                    var prop = node.parent["arguments"][0].properties[x];
                    len += (prop.initializer.escapedText ? prop.initializer.escapedText.length : prop.initializer.getText().length);
                    len += prop.name.escapedText.length + 5;
                }
                console.log(len);
                if (oldValue.indexOf("\n") > -1 || (len > 60) || newValue.indexOf("\n") > -1) {
                    //order also old elements
                    for (var x = 0; x < node.parent["arguments"][0].properties.length; x++) {
                        var prop = node.parent["arguments"][0].properties[x];
                        prop.pos = -1;
                        prop.len = -1;
                    }
                    node.parent["arguments"][0] = ts.createObjectLiteral(node.parent["arguments"][0].properties, true);
                }
            }
        }
        setPropertyInConfig(variableName, property, value, isFunction = false, replace = undefined, before = undefined, scope) {
            var svalue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var config = this.data[variableName]["config"][0].node;
            config = config.arguments[0];
            var newExpression = ts.createPropertyAssignment(property, svalue);
            if (property === "add" && replace === false) {
                property = "children";
                svalue = typeof value === "string" ? ts.createIdentifier(value + ".config({})") : value;
                if (this.data[variableName]["children"] == undefined) { //
                    newExpression = ts.createPropertyAssignment(property, ts.createArrayLiteral([svalue], true));
                    config.properties.push(newExpression);
                }
                else {
                    if (before === undefined) {
                        //@ts-ignore
                        this.data[variableName]["children"][0].node.initializer.elements.push(svalue);
                    }
                    else {
                        //@ts-ignore
                        var array = this.data[variableName]["children"][0].node.initializer.elements;
                        for (var x = 0; x < array.length; x++) {
                            if (array[x].getText() === before.value || array[x].getText().startsWith(before.value + ".")) {
                                array.splice(x, 0, svalue);
                                return;
                            }
                        }
                        throw new Error("Node " + before.value + " not found.");
                    }
                }
            }
            else { //comp.add(a) --> comp.config({children:[a]})
                if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                    let node = this.data[variableName][property][0].node;
                    this.data[variableName][property];
                    var pos = config.properties.indexOf(node);
                    config.properties[pos] = newExpression;
                    this.data[variableName][property][0].value = value;
                    this.data[variableName][property][0].node = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
                else {
                    config.properties.push(newExpression);
                    if (this.data[variableName][property] === undefined)
                        this.data[variableName][property] = [{ isFunction, value, node: newExpression }];
                    this.data[variableName][property][0].node = newExpression;
                    this.switchToMutlilineIfNeeded(config, property, value);
                }
            }
            console.log("todo correct spaces");
            this.parse(this.getModifiedCode());
            //if (pos >= 0)
            //  node.parent["statements"].splice(pos, 1);
        }
        /*  movePropertValueInCode(variableName: string, property: string, value: string, newVariableName: string, beforeValue: any) {
              if (this.data[variableName]["config"] !== undefined) {
                  if (property === "add")
                      property = "children";
                  var oldparent:any=this.data[variableName][property][0].node;
                  for (var x = 0; x < oldparent.initializer.elements.length; x++) {
                      var valueNode=oldparent.initializer.elements[x];
                      if (valueNode.getText() === value ||valueNode.getText().startsWith(value + ".")) {
                          oldparent.initializer.elements.splice(x,1);
                      }
                  }
              }
          }*/
        /**
        * modify the property in code
        * @param variablename - the name of the variable
        * @param  property - the property
        * @param value - the new value
        * @param classscope  - the property would be insert in this block
        * @param isFunction  - true if the property is a function
        * @param [replace]  - if true the old value is deleted
        * @param [before] - the new property is placed before this property
        * @param [variablescope] - if this scope is defined - the new property would be insert in this variable
        */
        setPropertyInCode(variableName, property, value, classscope, isFunction = false, replace = undefined, before = undefined, variablescope = undefined) {
            if (this.jsxVariables)
                return this.setPropertyInJSX(variableName, property, value, classscope, isFunction, replace, before, variablescope);
            if (this.data[variableName] === undefined)
                this.data[variableName] = {};
            if (classscope === undefined)
                classscope = this.classScope;
            var scope = this.getNodeFromScope(classscope, variablescope);
            var newExpression = undefined;
            if (this.data[variableName]["config"] !== undefined && property !== "new") {
                this.setPropertyInConfig(variableName, property, value, isFunction, replace, before, scope);
                return;
            }
            var newValue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var statements = scope["body"] ? scope["body"].statements : scope["statements"];
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
            }
            else if (isFunction) {
                newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), undefined, [newValue]));
            }
            else
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), newValue));
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["statements"].indexOf(node);
                node.parent["statements"][pos] = newExpression;
                newExpression.parent = node.parent;
                //if (pos >= 0)
                //  node.parent["statements"].splice(pos, 1);
            }
            else { //insert new
                debugger;
                if (before) {
                    if (before.value === undefined)
                        throw "not implemented";
                    let node = undefined;
                    for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                        if (this.data[before.variablename][before.property][o].value === before.value) {
                            node = this.data[before.variablename][before.property][o].node;
                            break;
                        }
                    }
                    if (!node)
                        throw Error("Property not found " + before.variablename + "." + before.property + " value " + before.value);
                    var pos = node.parent["statements"].indexOf(node);
                    if (pos >= 0)
                        node.parent["statements"].splice(pos, 0, newExpression);
                }
                else {
                    var lastprop = undefined;
                    for (let prop in this.data[variableName]) {
                        if (prop === "_new_") {
                            //should be in the same scope of declaration (important for repeater)
                            statements = this.data[variableName][prop][0].node.parent["statements"];
                            continue;
                        }
                        var testnode = this.data[variableName][prop][this.data[variableName][prop].length - 1].node;
                        if (testnode.parent === scope["body"])
                            lastprop = testnode;
                    }
                    if (lastprop) {
                        var pos = lastprop.parent["statements"].indexOf(lastprop);
                        if (pos >= 0)
                            lastprop.parent["statements"].splice(pos + 1, 0, newExpression);
                    }
                    else {
                        var pos = statements.length;
                        try {
                            if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                                pos--;
                        }
                        catch (_a) {
                        }
                        statements.splice(pos, 0, newExpression);
                    }
                }
            }
        }
        setPropertyInJSX(variableName, property, value, classscope, isFunction = false, replace = undefined, before = undefined, variablescope = undefined) {
            //if (this.data[variableName] === undefined)
            //    this.data[variableName] = {};
            var newValue = typeof value === "string" ? ts.createIdentifier(value) : value;
            var newExpression = newExpression = ts.createJsxAttribute(ts.createIdentifier(property), newValue);
            ;
            if (property === "new") { //me.panel1=new Panel({});
                /*       let prop = this.data[variableName]["_new_"][0];//.substring(3)];
                       var constr = prop.value;
                       value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                       replace = true;
                       var left = prop.node.getText();
                       left = left.substring(0, left.indexOf("=") - 1);
                       property = "_new_";
                       newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), newValue));
                   */
            }
            else if (isFunction) {
                //   newExpression = ts.createExpressionStatement(ts.createCall(
                //     ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), undefined, [newValue]));
            } /*else
                newExpression = ts.createExpressionStatement(ts.createAssignment(
                    ts.createIdentifier(property === "" ? variableName : (variableName + "." + property)), newValue));
            */
            if (property === "add") {
                var prop = this.data[value]["_new_"][0];
                var classname = prop.className;
                if (classname === "HTMLComponent")
                    classname = prop.tag;
                var node;
                if (classname === "text") {
                    node = ts.createJsxText("", false);
                    this.add(value, "text", "", node);
                }
                else {
                    node = this.createNode("<" + classname + "></" + classname + ">");
                    if (classname === "br")
                        node = this.createNode("<" + classname + "/>");
                }
                var parent = this.data[variableName]["_new_"][0].node;
                node.parent = parent;
                prop.node = node;
                prop.value = value;
                if (before) {
                    let found = undefined;
                    let ofound = -1;
                    console.log("var " + before.variablename);
                    console.log(this.data);
                    for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                        if (this.data[before.variablename][before.property][o].value === before.value) {
                            found = this.data[before.variablename][before.property][o].node;
                            ofound = o;
                            break;
                        }
                    }
                    var pos = parent["children"].indexOf(found);
                    parent["children"].splice(pos, 0, node);
                    parent["children"].splice(pos + 1, 0, ts.createJsxText("\n", true));
                    this.data[variableName]["add"].splice(ofound, 0, {
                        node: node,
                        value: value,
                        isFunction: false
                    });
                    //this.data[variableName]["add"][0].node;
                }
                else {
                    parent["children"].push(node);
                    parent["children"].push(ts.createJsxText("\n", true));
                    this.add(variableName, "add", value, node);
                }
                return;
            }
            if (this.data[variableName]["_new_"][0].node.kind === ts.SyntaxKind.JsxText) {
                if (property === "text") {
                    var svalue = value;
                    var old = this.data[variableName][property][0].node.text;
                    svalue = JSON.parse(`{"a":` + svalue + "}").a;
                    if (svalue.length === svalue.trim().length) {
                        svalue = old.substring(0, old.length - old.trimStart().length) + svalue + old.substring(old.length - (old.length - old.trimEnd().length));
                    }
                    //correct spaces linebrak are lost in html editing
                    this.data[variableName][property][0].value = JSON.stringify(svalue);
                    this.data[variableName][property][0].node.text = svalue;
                }
                return;
            }
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["properties"].indexOf(node);
                //node.initializer.text=newValue;
                node.parent["properties"][pos] = newExpression;
                newExpression.parent = node.parent;
                this.data[variableName][property][0].node = newExpression;
                this.data[variableName][property][0].value = value;
                //var pos = node.parent["properties"].indexOf(node);
                //node.parent["properties"][pos] = newValue;
                //if (pos >= 0)
                //  node.parent["statements"].splice(pos, 1);
            }
            else { //insert new
                if (before) {
                    /*  if (before.value === undefined)
                          throw "not implemented";
                      let node = undefined;
                      for (var o = 0; o < this.data[before.variablename][before.property].length; o++) {
                          if (this.data[before.variablename][before.property][o].value === before.value) {
                              node = this.data[before.variablename][before.property][o].node;
                              break;
                          }
                      }
                      if (!node)
                          throw Error("Property not found " + before.variablename + "." + before.property + " value " + before.value);
                      var pos = node.parent["statements"].indexOf(node);
                      if (pos >= 0)
                          node.parent["statements"].splice(pos, 0, newExpression);*/
                }
                else {
                    var parent = this.data[variableName]["_new_"][0].node.openingElement.attributes;
                    this.data[variableName][property] = [{ node: newExpression, isFunction, value }];
                    parent["properties"].push(newExpression);
                    newExpression.parent = parent["properties"];
                    /* for (let prop in this.data[variableName]) {
                        if (prop === "_new_") {
                            //should be in the same scope of declaration (important for repeater)
                            statements = this.data[variableName][prop][0].node.parent["statements"];
                            continue;
                        }
                        var testnode: ts.Node = this.data[variableName][prop][this.data[variableName][prop].length - 1].node;
                        if (testnode.parent === scope["body"])
                            lastprop = testnode;
                    }
                    if (lastprop) {
                        var pos = lastprop.parent["statements"].indexOf(lastprop);
                        if (pos >= 0)
                            lastprop.parent["statements"].splice(pos + 1, 0, newExpression);
                    } else {
                        var pos = statements.length;
                        try {
                            if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                                pos--;
                        } catch {
            
                        }
                        statements.splice(pos, 0, newExpression);
                    }*/
                }
            }
        }
        /**
         * swaps two statements indendified by  functionparameter in a variable.property(parameter1) with variable.property(parameter2)
         **/
        swapPropertyWithParameter(variable, property, parameter1, parameter2) {
            var first = undefined;
            var second = undefined;
            var parent = this.data[variable][property];
            if (this.data[variable]["config"] && property === "add") {
                var children = this.data[variable]["children"][0].node.initializer.elements;
                var ifirst;
                var isecond;
                for (var x = 0; x < children.length; x++) {
                    var text = children[x].getText();
                    if (text === parameter1 || text.startsWith(parameter1 + ".config")) {
                        ifirst = x;
                    }
                    if (text === parameter2 || text.startsWith(parameter2 + ".config")) {
                        isecond = x;
                    }
                }
                var temp = children[ifirst];
                children[ifirst] = children[isecond];
                children[isecond] = temp;
                return;
            }
            for (var x = 0; x < parent.length; x++) {
                if (parent[x].value.split(",")[0].trim() === parameter1)
                    first = parent[x].node;
                if (parent[x].value.split(",")[0].trim() === parameter2)
                    second = parent[x].node;
            }
            if (!first)
                throw Error("Parameter not found " + parameter1);
            if (!second)
                throw Error("Parameter not found " + parameter2);
            var ifirst = first.parent["statements"].indexOf(first);
            var isecond = second.parent["statements"].indexOf(second);
            first.parent["statements"][ifirst] = second;
            first.parent["statements"][isecond] = first;
        }
        /**
        * adds an Property
        * @param type - name of the type o create
        * @param classscope - the scope (methodname) where the variable should be insert Class.layout
        * @param variablescope - the scope where the variable should be insert e.g. hallo.onclick
        * @returns  the name of the object
        */
        addVariableInCode(fulltype, classscope, variablescope = undefined, suggestedName = undefined) {
            var _a;
            if (classscope === undefined)
                classscope = this.classScope;
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            type = type === "TextComponent" ? "text" : type;
            var varname = this.getNextVariableNameForType(type, suggestedName);
            if (this.jsxVariables) {
                this.data[varname] = {
                    "_new_": [{ className: type, tag: suggestedName }]
                };
                // this.addTypeMe(varname, type);
                return varname;
            }
            else {
                var useMe = false;
                if (this.data["me"] !== undefined)
                    useMe = true;
                //var if(scopename)
                var node = this.getNodeFromScope(classscope, variablescope);
                //@ts-ignore
                if (((_a = node === null || node === void 0 ? void 0 : node.parameters) === null || _a === void 0 ? void 0 : _a.length) > 0 && node.parameters[0].name.text == "me") {
                    useMe = true;
                }
                var prefix = useMe ? "me." : "var ";
                if (node === undefined)
                    throw Error("no scope to insert a variable could be found");
                var statements = node["body"] ? node["body"].statements : node["statements"];
                for (var x = 0; x < statements.length; x++) {
                    if (!statements[x].getText().split("\n")[0].includes("new ") && !statements[x].getText().split("\n")[0].includes("var "))
                        break;
                }
                var ass = ts.createAssignment(ts.createIdentifier(prefix + varname), ts.createIdentifier("new " + type + "()"));
                statements.splice(x, 0, ts.createStatement(ass));
                if (useMe)
                    this.addTypeMe(varname, type);
            }
            return (useMe ? "me." : "") + varname;
        }
    };
    Parser = __decorate([
        Registry_29.$Class("jassijs_editor.util.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function tests(t) {
        function clean(s) {
            return s.replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
        }
        await Typescript_5.default.waitForInited;
        var parser = new Parser();
        parser.parse("var j;j.config({children:[a,b,c]})");
        parser.swapPropertyWithParameter("j", "add", "c", "a");
        t.expectEqual(clean(parser.getModifiedCode()) === 'var j;j.config({ children: [c, b, a] });');
        parser.parse("var j;j.add(a);j.add(b);j.add(c);");
        parser.swapPropertyWithParameter("j", "add", "c", "a");
        t.expectEqual(clean(parser.getModifiedCode()) === 'var j;j.add(c);j.add(b);j.add(a);');
        parser.parse("class A{}");
        t.expectEqual(parser.classes.A !== undefined);
        parser.parse("var a=8;");
        t.expectEqual(parser.data.a !== undefined);
        parser.parse("b=8;");
        t.expectEqual(parser.data.b !== undefined);
        parser.parse("b=8", [{ classname: undefined, methodname: "test" }]);
        t.expectEqual(parser.data.b === undefined);
        var scope = [{ classname: undefined, methodname: "test" }];
        parser.parse("function test(){b=8;}", scope);
        t.expectEqual(parser.data.b !== undefined);
        parser.addVariableInCode("MyClass", scope);
        parser.setPropertyInCode("myclass", "a", "9", scope);
        t.expectEqual(clean(parser.getModifiedCode()) === "function test() { var myclass = new MyClass(); b = 8; myclass.a = 9; }");
        parser = new Parser();
        parser.parse("");
        parser.addVariableInCode("MyClass", undefined);
        parser.setPropertyInCode("myclass", "a", "9", undefined);
        t.expectEqual(clean(parser.getModifiedCode()) === "var myclass = new MyClass();myclass.a = 9;");
    }
    exports.tests = tests;
    async function test() {
        tests(new Test_2.Test());
        await Typescript_5.default.waitForInited;
        var code = Typescript_5.default.getCode("demo/hallo.tsx");
        var parser = new Parser();
        parser.parse(code, undefined, true);
        debugger;
        // code = "function test(){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1,j:ppp.config({pp:9})})     }); }";
        // code = "function(test){ var hallo={};var h2={};var ppp={};hallo.p=9;hallo.config({a:1,b:2, k:h2.config({c:1},j(){j2.udo=9})     }); }";
        // code = "function test(){var ppp;var aaa=new Button();ppp.config({a:[9,6],  children:[ll.config({}),aaa.config({u:1,o:2,children:[kk.config({})]})]});}";
        //parser.parse(code, undefined);
        //code="reportdesign={k:9};";
        // parser.parse(code,[{ classname: "Dialog2", methodname: "layout" }]);// [{ classname: "TestDialogBinder", methodname: "layout" }]);
        //    parser.setPropertyInCode("me.table","new",'new Table({\n      paginationSize: 1\n})',undefined);
        //  console.log(parser.getModifiedCode());
        // parser.removeVariablesInCode(["me.repeater"]);
        //parser.addVariableInCode("Component", [{ classname: "Dialog", methodname: "layout" }]);
        //parser.setPropertyInCode("component", "x", "1", [{ classname: "Dialog", methodname: "layout" }]);
        // var node = parser.removePropertyInCode("add", "me.textbox1", "me.panel1");
        // parser.setPropertyInCode("this","add",node,[{classname:"Dialog",methodname:"layout"}],true,false);
        //var node = parser.removePropertyInCode("add", "kk", "aaa");
        //var node=parser.removePropertyInCode("add", "ll", "ppp");
        //parser.setPropertyInCode("aaa","add",node,[{classname:undefined, methodname:"test"}],true,false,undefined,undefined);
        //console.log(node.getText());
        //    parser.setPropertyInCode("ppp","add","cc",[{classname:undefined, methodname:"test"}],true,false,{variablename:"ppp",property:"add",value:"ll"});
        //  parser.setPropertyInCode("aaa","add","cc",[{classname:undefined, methodname:"test"}],true,false,{variablename:"aaa",property:"add",value:"kk"});
        // debugger;
        /*  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
          const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
          const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
          console.log(result);*/
    }
    exports.test = test;
});
define("jassijs_editor/util/Resizer", ["require", "exports", "jassijs/remote/Registry", "jassijs/ext/jquerylib"], function (require, exports, Registry_30) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Resizer = void 0;
    let Resizer = class Resizer {
        constructor() {
            this.cursorType = "";
            this.isCursorOnBorder = false;
            this.isMouseDown = false;
            this.resizedElement = "";
            this.elements = undefined;
            this.onelementselected = undefined;
            this.onpropertychanged = undefined;
            this.parentPanel = undefined;
            this.lastSelected = undefined;
            this.componentUnderCursor = undefined;
            this.lassoMode = false;
            this.draganddropper = undefined;
        }
        mouseDown(event) {
            event.data._resizeComponent(event);
            let elementID = this.getAttribute('id');
            var _this = event === null || event === void 0 ? void 0 : event.data;
            if (_this.onelementselected !== undefined) {
                //select with click
                //delegate only the top window - this is the first event????
                if (_this.topElement === undefined) {
                    if (document.getElementById(elementID).classList.contains("designerNoSelectable")) {
                        return;
                    }
                    _this.topElement = elementID;
                    setTimeout(function () {
                        _this.parentPanel.dom.querySelectorAll(".jselected").forEach((c) => { c.classList.remove("jselected"); });
                        //                   $(".jselected").removeClass("jselected");
                        document.getElementById(_this.topElement).classList.add("jselected");
                        _this.lastSelected = [_this.topElement];
                        if (!_this.onelementselected)
                            console.log("onselected undefined");
                        _this.onelementselected(_this.lastSelected, event);
                        _this.topElement = undefined;
                    }, 50);
                }
                var lastTime = new Date().getTime();
                //select with lasso
            }
            if (_this.resizedElement === "" || _this.resizedElement === undefined) { //if also parentcontainer will be fired->ignore
                _this.resizedElement = elementID.toString();
                _this.isMouseDown = true;
            }
        }
        mouseMove(event) {
            event.data._resizeComponent(event);
        }
        ;
        mouseUp(event) {
            if (event.data !== undefined) {
                var _this = event === null || event === void 0 ? void 0 : event.data;
                _this.isMouseDown = false;
                _this.isCursorOnBorder = false;
                _this.cursorType = "default";
                if (_this.resizedElement !== "" && _this.resizedElement !== undefined) {
                    document.getElementById(_this.resizedElement).style.cursor = _this.cursorType;
                    _this.resizedElement = "";
                }
            }
        }
        //not every event should be fired - only the last with delay
        firePropertyChange(...param) {
            var _this = this;
            if (this.propertyChangetimer) {
                clearTimeout(this.propertyChangetimer);
            }
            this.propertyChangetimer = setTimeout(() => {
                if (_this.onpropertychanged !== undefined) {
                    //@ts-ignore
                    _this.onpropertychanged(...param);
                }
            }, 200);
        }
        /**
        * resize the component
        * this is an onmousemove event called from _changeCursor()
        * @param {type} event
        */
        _resizeComponent(e) {
            //window.status = event1.type;
            //check drag is activated or not
            if (this.isMouseDown) {
                // console.debug("drag");
                var curevent = e;
                //coordiantes of the event position
                var x = curevent.clientX;
                var y = curevent.clientY;
                //var element = document.getElementById(this.resizedElement);
                var element = this.componentUnderCursor;
                if (element === undefined) {
                    var cursor = this.cursorType.substring(0, this.cursorType.indexOf('-'));
                    this._changeCursor(e);
                    return;
                }
                if (this.lastSelected && this.lastSelected.length > 0 && this.lastSelected[0] !== element.id)
                    return;
                //top left positions of the div element
                var topLeftX = $(element._this.dom).offset().left; //element.offsetLeft;
                var topLeftY = $(element._this.dom).offset().top; //element.offsetTop;
                //width and height of the element
                var width = element.offsetWidth;
                var height = element.offsetHeight;
                //get the cursor sytle [e,w,n,s,ne,nw,se,sw]
                var cursor = this.cursorType.substring(0, this.cursorType.indexOf('-'));
                var _this = this;
                if (cursor.indexOf('e') !== -1) {
                    var w = Math.max(x - topLeftX, 8);
                    w = Math.round(w / 5) * 5;
                    element._this.width = w;
                    this.firePropertyChange(element._this, "width", w);
                    /*if (this.onpropertychanged !== undefined) {
                            this.onpropertychanged(element._this, "width", w);
                    }*/
                    //	element.style.width = Math.max(x - topLeftX,8)+'px';
                }
                if (cursor.indexOf('s') !== -1) {
                    var h = Math.max(y - topLeftY, 8);
                    h = Math.round(h / 5) * 5;
                    element._this.height = h; //+'px';
                    this.firePropertyChange(element._this, "height", h);
                    /*if (this.onpropertychanged !== undefined) {
                            this.onpropertychanged(element._this, "height", h);
                    }*/
                }
            }
            else {
                //  document.getElementById(elementID).style.cursor = cursorType;
                this._changeCursor(e);
            }
        }
        /**
        * changes the cursor
        * @param {type} e
        */
        _changeCursor(e) {
            var borderSize = 4;
            this.cursorType = "default";
            //slow
            //var els = $(this.parentPanel.dom).find(this.elements);
            var dcs = [];
            this.elements.split(",").forEach((str) => {
                let el = document.getElementById(str.substring(1));
                if (el) {
                    var classes = el.classList;
                    if (!classes.contains("designerNoResizable"))
                        dcs.push(document.getElementById(str.substring(1)));
                }
            });
            var els = $(dcs);
            for (var i = 0; i < els.length; i++) {
                var element = els[i];
                if (element === null)
                    continue;
                var noresizex = element.classList.contains("designerNoResizableX");
                var noresizey = element.classList.contains("designerNoResizableY");
                if (element.classList.contains("designerNoResizable")) {
                    continue;
                }
                //code start for changing the cursor
                //var element2 = document.getElementById(elementID);
                var topLeftX = $(element).offset().left; //element.offsetLeft;
                var topLeftY = $(element).offset().top; //element.offsetTop;
                var bottomRightX = topLeftX + element.offsetWidth;
                var bottomRightY = topLeftY + element.offsetHeight;
                var curevent = e;
                var x = curevent.clientX;
                var y = curevent.clientY;
                // console.log(noresizex+":"+noresizey);
                //window.status = topLeftX +"--"+topLeftY+"--"+bottomRightX+"--"+bottomRightY+"--"+x+"--"+y+"--"+isMouseDown;
                //change the cursor style when it is on the border or even at a distance of 8 pixels around the border
                if (x >= bottomRightX - borderSize && x <= bottomRightX + borderSize) {
                    /*  if(y >= bottomRightY-borderSize && y <= bottomRightY+borderSize){
                              this.isCursorOnBorder = true;
                              this.cursorType = "se-resize";
                      }*/
                    if ((y > topLeftY - borderSize && y < bottomRightY + borderSize)) {
                        if (!noresizex) {
                            this.isCursorOnBorder = true;
                            this.cursorType = "e-resize";
                        }
                    }
                }
                else if ((x > topLeftX - borderSize && x < bottomRightX + borderSize)) {
                    if (!noresizey && (y >= bottomRightY - borderSize && y <= bottomRightY + borderSize)) {
                        if (!noresizey) {
                            this.isCursorOnBorder = true;
                            this.cursorType = "s-resize";
                        }
                    }
                }
                if (this.cursorType === "e-resize" || this.cursorType === "s-resize") {
                    var test = $(element).closest(".jcomponent");
                    var isDragging = false;
                    if (this.draganddropper !== undefined) {
                        element == undefined;
                        isDragging = this.draganddropper.isDragging();
                    }
                    if (!this.lassoMode && !isDragging) {
                        this.componentUnderCursor = test[0];
                        element.style.cursor = this.cursorType;
                    }
                    else {
                        this.cursorType = "default";
                        this.componentUnderCursor = undefined;
                        element.style.cursor = this.cursorType;
                    }
                    return;
                }
                this.componentUnderCursor = undefined;
                element.style.cursor = this.cursorType;
            }
        }
        /**
         * enable or disable the lasso
         * with lasso some components can be selected with dragging
         */
        setLassoMode(enable) {
            this.lassoMode = enable;
            this.lastSelected = [];
            this.resizedElement = "";
            this.cursorType = "";
            this.isCursorOnBorder = false;
            this.isMouseDown = false;
            var lastTime = new Date().getTime();
            var _this = this;
            if (enable === true) {
                $(this.parentPanel.dom).selectable({
                    selected: function (event, ui) {
                        if (new Date().getTime() - lastTime > 500) { //new selection
                            _this.lastSelected = [];
                            _this.parentPanel.dom.querySelectorAll(".jselected").forEach((c) => { c.classList.remove("jselected"); });
                            //                 
                            //$(".jselected").removeClass("jselected");
                            setTimeout(function () {
                                _this.onelementselected(_this.lastSelected, event);
                                _this.lastSelected = undefined;
                            }, 50);
                        }
                        lastTime = new Date().getTime();
                        var a = 9;
                        if (ui.selected._this && ui.selected.classList.contains("jcomponent") &&
                            !ui.selected.classList.contains("designerNoSelectable")) {
                            var ids = _this.elements + ",";
                            if (ids.indexOf("#" + ui.selected._this._id + ",") > -1) {
                                _this.lastSelected.push(ui.selected._this._id);
                                document.getElementById(ui.selected._this._id).classList.add("jselected");
                            }
                        }
                    }
                });
            }
            else {
                $(this.parentPanel.dom).selectable("destroy");
            }
        }
        /**
         * install the resizer
         * @param parentPanel - the parent component
         * @param elements - the search pattern for the components to resize e.q. ".jresizeable"
         */
        install(parentPanel, elements) {
            var _this = this;
            if (!parentPanel.dom.classList.contains("designerNoResizable")) {
                $(parentPanel.domWrapper).resizable({
                    resize: function (evt) {
                        var h = evt.target.offsetHeight;
                        var w = evt.target.offsetWidth;
                        if (_this.onpropertychanged !== undefined) {
                            evt.target._this.width = w;
                            evt.target._this.height = h;
                            _this.onpropertychanged(evt.target._this, "width", w);
                            _this.onpropertychanged(evt.target._this, "height", h);
                            evt.target._this.domWrapper.style.width = w + "px";
                            evt.target._this.domWrapper.style.height = h + "px";
                        }
                    }
                });
            }
            if (parentPanel !== undefined)
                this.parentPanel = parentPanel;
            if (elements !== undefined)
                this.elements = elements;
            $(this.parentPanel.dom).on("mousedown", this, this.mouseDown);
            this.mousedownElements = $(this.parentPanel.dom).find(this.elements);
            for (let x = 0; x < this.mousedownElements.length; x++) {
                this.mousedownElements[x] = this.mousedownElements[x].parentNode;
            }
            this.mousedownElements.on("mousedown", this, this.mouseDown);
            $(this.parentPanel.dom).on("mousemove", this, this.mouseMove);
            $(this.parentPanel.dom).on("mouseup", this, this.mouseUp);
            //this.setLassoMode(true);
            //this.setLassoMode(false);
        }
        /**
         * uninstall the resizer
         */
        uninstall() {
            this.onelementselected = undefined;
            this.onpropertychanged = undefined;
            if (this.parentPanel !== undefined) {
                $(this.parentPanel.dom).off("mousedown", this.mouseDown);
                if (this.mousedownElements !== undefined)
                    this.mousedownElements.off("mousedown", this.mouseDown);
                this.mousedownElements = undefined;
                $(this.parentPanel.dom).off("mousemove", this.mouseMove);
                $(this.parentPanel.dom).on("mouseup", this.mouseUp);
            }
            this.resizedElement = "";
            this.elements = undefined;
            this.parentPanel = undefined;
            this.lastSelected = undefined;
            this.componentUnderCursor = undefined;
            this.draganddropper = undefined;
            /*  this.mouseDown.bound=undefined;
              this.mouseMove.bound=undefined;
              this.mouseUp.bound=undefined;*/
        }
    };
    Resizer = __decorate([
        Registry_30.$Class("jassijs_editor.util.Resizer"),
        __metadata("design:paramtypes", [])
    ], Resizer);
    exports.Resizer = Resizer;
});
define("jassijs_editor/util/Tests", ["require", "exports", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/ui/Component", "jassijs/ui/BoxPanel", "jassijs/base/Windows", "jassijs/ui/HTMLPanel", "jassijs/base/Errors", "jassijs_editor/ErrorPanel", "jassijs/remote/Test"], function (require, exports, Registry_31, Actions_10, Component_6, BoxPanel_4, Windows_8, HTMLPanel_1, Errors_2, ErrorPanel_3, Test_3) {
    "use strict";
    var TestAction_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tests = exports.TestAction = void 0;
    class MyContainer extends BoxPanel_4.BoxPanel {
        constructor() {
            super(...arguments);
            this.alltests = 0;
            this.failedtests = 0;
            this.finished = false;
        }
        update() {
            if (this.failedtests === 0) {
            }
            this.statustext.css = {
                color: (this.failedtests === 0 ? "green" : "red")
            };
            this.statustext.value = (this.finished ? "Finished " : "test running... ") + this.alltests + " Tests. " + (this.failedtests) + " Tests failed.";
        }
    }
    let TestAction = TestAction_1 = class TestAction {
        static async testNode(all, container = undefined) {
            var _a;
            var isRoot = false;
            if (container === undefined) {
                container = new MyContainer();
                Windows_8.default.add(container, "Tests");
                container.statustext = new HTMLPanel_1.HTMLPanel();
                container.add(container.statustext);
                isRoot = true;
                Errors_2.Errors.errors.onerror((err) => {
                    try {
                        if (container.dom) { //sometimes off register was not called
                            var newerrorpanel = new ErrorPanel_3.ErrorPanel(false, false, false);
                            newerrorpanel.addError(err);
                            container.add(newerrorpanel);
                        }
                    }
                    catch (_a) {
                    }
                }, container._id);
            }
            for (var x = 0; x < all.length; x++) {
                var file = all[x];
                if (file.isDirectory()) {
                    await TestAction_1.testNode(file.files, container);
                }
                else {
                    var typescript = (await new Promise((resolve_8, reject_8) => { require(["jassijs_editor/util/Typescript"], resolve_8, reject_8); })).default;
                    await typescript.initService();
                    var text = typescript.getCode(file.fullpath);
                    if (text !== undefined) {
                        text = text.toLowerCase();
                        try {
                            if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                                console.log("test " + file.fullpath);
                                var func = (_a = (await new Promise((resolve_9, reject_9) => { require([file.fullpath.substring(0, file.fullpath.length - 3)], resolve_9, reject_9); }))) === null || _a === void 0 ? void 0 : _a.test;
                                if (typeof func === "function") {
                                    container.alltests++;
                                    container.update();
                                    var ret = await func(new Test_3.Test());
                                    if (ret instanceof Component_6.Component) {
                                        ret.dom.style.position = "relative";
                                        ret.width = "100%";
                                        var head = new HTMLPanel_1.HTMLPanel();
                                        head.value = "<b>" + file.fullpath + "</b>";
                                        container.add(head);
                                        container.add(ret);
                                    }
                                }
                            }
                        }
                        catch (err) {
                            if (container.dom) {
                                try {
                                    var newerrorpanel = new ErrorPanel_3.ErrorPanel(false, false, false);
                                    newerrorpanel.addError({
                                        error: err
                                    });
                                    newerrorpanel.css = {
                                        background_color: "red"
                                    };
                                    container.add(newerrorpanel);
                                    container.failedtests++;
                                    container.update();
                                }
                                catch (_b) {
                                }
                            }
                        }
                    }
                }
            }
            if (isRoot) {
                container.finished = true;
                container.update();
                Errors_2.Errors.errors.offerror(container._id);
                console.log("off error");
            }
        }
    };
    __decorate([
        Actions_10.$Action({
            name: "Run Tests"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, MyContainer]),
        __metadata("design:returntype", Promise)
    ], TestAction, "testNode", null);
    TestAction = TestAction_1 = __decorate([
        Actions_10.$ActionProvider("jassijs.remote.FileNode"),
        Registry_31.$Class("jassijs_editor.ui.TestAction")
    ], TestAction);
    exports.TestAction = TestAction;
    class Tests {
    }
    exports.Tests = Tests;
    //Selftest
    async function test(tst) {
        tst.expectEqual(1 === 1);
        tst.expectError(() => {
            var h;
            h.a = 9;
        });
    }
    exports.test = test;
});
define("jassijs_editor/util/TSSourceMap", ["require", "exports", "jassijs/ext/sourcemap", "jassijs/remote/Server", "jassijs/remote/Registry", "jassijs/remote/Config"], function (require, exports, sourcemap_1, Server_5, Registry_32, Config_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TSSourceMap = void 0;
    //var sourceMap=window["sourceMap"];
    let TSSourceMap = class TSSourceMap {
        async getCode(file) {
            return $.ajax({ url: file, dataType: "text" });
            // await new Server().loadFile(file);
        }
        async getLineFromTS(tsfile, line, column) {
            var jscode;
            var mapcode = "";
            var filenumber = 0;
            var jsfilename;
            if (Server_5.Server.filesInMap && Server_5.Server.filesInMap[tsfile]) {
                var mod = Server_5.Server.filesInMap[tsfile].modul;
                jsfilename = Config_3.config.modules[mod];
                var mapname = jsfilename.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
                mapcode = await this.getCode(mapname); //await $.ajax({ url: jsfilename+".map", dataType: "text" });
                filenumber = Server_5.Server.filesInMap[tsfile].id;
            }
            else {
                //replace last .ts to .js
                jsfilename = "js/" + tsfile.split("").reverse().join("").replace("st.", "sj.").split("").reverse().join("").split("?")[0];
                jscode = await this.getCode(jsfilename); // await $.ajax({ url: jsfilename, dataType: "text" });
                var pos = jscode.indexOf("//" + "# sourceMappingURL=");
                if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                    var b64 = jscode.substring(pos + 50);
                    mapcode = ts["base64decode"](undefined, b64);
                    //mapcode = decodeURIComponent(escape((b64)));
                }
                else {
                    //mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
                    //replace last .js to .js.map
                    var mapfile = tsfile.split("").reverse().join("").replace("st.", "pam.sj.").split("").reverse().join("").split("?")[0];
                    mapcode = await this.getCode("js/" + mapfile);
                }
            }
            var ret = new Promise((resolve, reject) => {
                var isinline = false;
                sourcemap_1.default.SourceMapConsumer.initialize({
                    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
                });
                var rawSourceMap = JSON.parse(mapcode);
                sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                    var test = consumer.sources;
                    var l = consumer.generatedPositionFor({
                        source: rawSourceMap.sources[filenumber],
                        line: line,
                        column: column
                    });
                    l.jsfilename = jsfilename;
                    return l;
                }).then(function (whatever) {
                    resolve(whatever);
                });
            });
            return ret;
        }
        async getLineFromJS(jsfile, line, column) {
            var data = await this.getLinesFromJS(jsfile, [{ line, column }]);
            return ((data === undefined || data.length === 0) ? undefined : data[0]);
        }
        async getLinesFromJS(jsfile, data) {
            var jscode = await this.getCode(jsfile.split("?")[0]); // await $.ajax({ url: jsfile, dataType: "text" });
            var mapcode = "";
            var pos = jscode.indexOf("//" + "# sourceMappingURL=");
            if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                var b64 = jscode.substring(pos + 50);
                mapcode = atob(b64);
            }
            else if (pos) {
                //TODO parse the correct map
                var mapfile = jsfile.split("").reverse().join("").replace("sj.", "pam.sj.").split("").reverse().join("").split("?")[0];
                mapcode = await new Server_5.Server().loadFile(mapfile);
            }
            else
                return undefined;
            sourcemap_1.default.SourceMapConsumer.initialize({
                "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
            });
            var rawSourceMap = JSON.parse(mapcode);
            var ret = [];
            for (var x = 0; x < data.length; x++) {
                var one = await new Promise((resolve, reject) => {
                    //for(var x=0;x<data.length;x++){
                    sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                        var test = consumer.sources;
                        var l = consumer.originalPositionFor({
                            bias: sourcemap_1.default.SourceMapConsumer.GREATEST_LOWER_BOUND,
                            line: data[x].line,
                            column: data[x].column
                        });
                        return l;
                    }).then(function (whatever) {
                        resolve(whatever);
                    });
                });
                ret.push(one);
            }
            return await ret;
            //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js",function(data){
        }
    };
    TSSourceMap = __decorate([
        Registry_32.$Class("jassijs_editor.util.TSSourceMap")
    ], TSSourceMap);
    exports.TSSourceMap = TSSourceMap;
});
define("jassijs_editor/util/Typescript", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/remote/Config", "jassijs_editor/ext/monaco"], function (require, exports, Registry_33, Server_6, Config_4) {
    "use strict";
    var Typescript_6;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Typescript = void 0;
    let Typescript = Typescript_6 = class Typescript {
        constructor() {
            this.initInIdle = true;
            if (Typescript_6._isInited === undefined)
                this.waitForInited = this.initService();
        }
        isInited(file) {
            return Typescript_6._isInited === true;
        }
        /**
         * transpile the ts-file an returns all reflected files
         * @param fileName
         * @param content
         */
        async transpile(fileName, content, compilerSettings = undefined) {
            var ret = { fileNames: [fileName], contents: [content] };
            if (fileName.toLocaleLowerCase().endsWith(".js")) { //js Code would be not transpiled
                ret.fileNames.push("js/" + fileName);
                ret.contents.push(content);
            }
            else {
                var prefix = "";
                for (let x = 0; x < fileName.split("/").length; x++) {
                    prefix = "../" + prefix;
                }
                var opt = {
                    compilerOptions: compilerSettings ? compilerSettings : Typescript_6.compilerSettings,
                    fileName: prefix + fileName,
                };
                //@ts-ignore
                var comp = ts.transpileModule(content, opt);
                var extlen = 3;
                if (fileName.toLowerCase().endsWith(".tsx"))
                    extlen = 4;
                ret.fileNames.push("js/" + fileName.substring(0, fileName.length - extlen) + ".js");
                ret.contents.push(comp.outputText);
                ret.fileNames.push("js/" + fileName.substring(0, fileName.length - extlen) + ".js.map");
                ret.contents.push(comp.sourceMapText);
            }
            return ret;
        }
        static initMonaco() {
            /* monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                 "baseUrl": "./",
                 rootDir: "./",
             })*/
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                "target": monaco.languages.typescript.ScriptTarget.Latest,
                "baseUrl": "./",
                "module": monaco.languages.typescript.ModuleKind.AMD,
                "moduleResolution": monaco.languages.typescript.ModuleResolutionKind.Classic,
                "jsx": monaco.languages.typescript.JsxEmit.React,
                typeRoots: ["./node_modules/@types"],
                rootDir: "./",
                "sourceMap": true,
                "outDir": "./js",
                emitDecoratorMetadata: true,
                allowNonTsExtensions: true,
                allowJs: true,
                experimentalDecorators: true,
            });
        }
        //load  d.ts from modulpackage
        async includeModulTypes() {
            var nodeFiles = {};
            for (var mod in Config_4.config.modules) {
                var config1 = (await new Promise((resolve_10, reject_10) => { require([mod + "/modul"], resolve_10, reject_10); })).default;
                if (config1.types) {
                    for (var key in config1.types) {
                        var file = config1.types[key];
                        nodeFiles[key] = new Server_6.Server().loadFile(file);
                    }
                }
            }
            return nodeFiles;
        }
        /**
         * initialize the services tooks any seconds
         * functions which uses the languageservice are blocked until ready
         */
        async initService() {
            try {
                if (Typescript_6._isInited !== undefined)
                    return;
                Typescript_6._isInited = false;
                Typescript_6.initMonaco();
                //@ts-ignore
                //  import("jassijs/ext/typescript").then(async function(ts1) {
                Typescript_6.ts = ts;
                var _this = this;
                var f = (await new Server_6.Server().dir(true)).resolveChilds();
                var nodeFiles = await this.includeModulTypes();
                //Load all files to in cache
                //node_modules with ajax - so we kann cache 
                var myfiles = [];
                for (let x in f) {
                    let fname = f[x].fullpath;
                    let fdat = f[x].date;
                    //include js in jassijs/ext
                    if (fname.startsWith("node_modules"))
                        continue;
                    if (fname.toLowerCase().endsWith(".ts") || fname.toLowerCase().endsWith(".js") || fname.toLowerCase().endsWith(".json")) {
                        if (fname.toLocaleLowerCase().endsWith(".js")) {
                            monaco.languages.typescript.typescriptDefaults.addExtraLib("export default const test=1;", "file:///" + fname);
                        }
                        if (fdat === undefined) {
                            nodeFiles[fname] = new Server_6.Server().loadFile(fname);
                        }
                        else {
                            nodeFiles[fname] = $.ajax({
                                url: fname,
                                beforeSend: function (request) {
                                    request.setRequestHeader("X-Custom-FromCache", fdat);
                                },
                                dataType: "text"
                            });
                        }
                        //}
                    }
                }
                //load TS sources
                //wait for each nodefiles
                var code = {};
                for (let key in nodeFiles) {
                    code[key] = await nodeFiles[key];
                }
                for (let key in nodeFiles) {
                    //monaco
                    //@ts-ignore
                    //	
                    var type = "typescript";
                    if (key.toLocaleLowerCase().endsWith(".ts")) {
                        //
                        if (this.initInIdle) {
                            var ffile = monaco.Uri.from({ path: "/" + key, scheme: 'file' });
                            //console.log(key);
                            if (!monaco.editor.getModel(ffile))
                                monaco.editor.createModel(code[key], "typescript", ffile);
                            //});
                        }
                        else {
                            monaco.languages.typescript.typescriptDefaults.addExtraLib(code[key], "file:///" + key);
                        }
                    }
                    if (key.toLocaleLowerCase().endsWith(".json"))
                        type = "json";
                }
                //initialize monaco
                //if (!this.initInIdle)
                monaco.editor.createModel("var a=1;", "typescript", monaco.Uri.from({ path: "/__mydummy.ts", scheme: 'file' }));
                this.tsWorker = await (await monaco.languages.typescript.getTypeScriptWorker())();
                Typescript_6._isInited = true;
                return true;
            }
            catch (err) {
                debugger;
                throw err;
            }
        }
        /**
         * unused
         */
        async getDefinitionAtPosition(file, position) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            return await this.tsWorker.getDefinitionAtPosition("file:///" + file, position);
        }
        /**
         * unused
         */
        async getSignatureHelpItems(file, position) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            //@ts-ignore
            return await this.tsWorker.getSignatureHelpItems("file:///" + file, position, undefined);
        }
        async includefileIfNeeded(file) {
        }
        async renameFile(oldfile, newfile) {
            var ffile = monaco.Uri.from({ path: "/" + oldfile, scheme: 'file' });
            var oldmodell = monaco.editor.getModel(ffile);
            oldmodell === null || oldmodell === void 0 ? void 0 : oldmodell.dispose();
            var text = await $.ajax({
                url: newfile,
                beforeSend: function (request) {
                    request.setRequestHeader("X-Custom-FromCache", newfile);
                },
                dataType: "text"
            });
            await this.setCode(newfile, text);
            var snap = Typescript_6.languageServiceHost.getScriptSnapshot(newfile);
        }
        /**
         * @returns all code filenames
         */
        getFiles() {
            var ret = [];
            var mods = monaco.editor.getModels();
            for (var x = 0; x < mods.length; x++) {
                var f = mods[x].uri.path.substring(1);
                ret.push(f);
            }
            return ret;
        }
        /**
         * get the code for a file
         * @params file - the filename e.g. jassijs/base/Parser.ts
         */
        getCode(file) {
            var ffile = monaco.Uri.from({ path: "/" + file, scheme: 'file' });
            var mod = monaco.editor.getModel(ffile);
            if (mod)
                return mod.getValue();
            else
                return undefined;
        }
        /**
         * put file in cache
         * @param file - the ts file
         * @param text - the text of the ts file
         */
        setCode(file, text) {
            var ffile = monaco.Uri.from({ path: "/" + file, scheme: 'file' });
            var mod = monaco.editor.getModel(ffile);
            if (!mod) {
                mod = monaco.editor.createModel(text, "typescript", ffile);
            }
            var waiter = new Promise(function (resolve) {
                var disp = mod.onDidChangeContent((evt) => {
                    if (evt.changes[0].text === text) {
                        disp.dispose();
                        resolve(mod);
                    }
                });
            });
            mod.setValue(text);
            return waiter;
        }
        /**
         * get info for a completionentry
         * @param file - the ts file
         * @param position - the position in string
         * @param item -the item we are interested
         * @param formatOptions -unused
         * @param source -unused
         * @param preferences - unused
         */
        async getCompletionEntryDetails(file, position, item, formatOptions = {}, source = undefined, preferences = {}) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            const info = await this.tsWorker.getCompletionEntryDetails("file:///" + file, position, item);
            return info;
        }
        /**
         * get all completions at a  position
         * @param file -the ts file
         * @param position -the position in string
         * @param text - the text of the file is saved to cache
         */
        async getCompletion(file, position, text = undefined, options) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                var p = this.setCode(file, text);
                await p;
                // Typescript.languageServiceHost.getScriptSnapshot(file);
            }
            //@ts-ignore
            const info = await this.tsWorker.getCompletionsAtPosition("file:///" + file, position, options);
            //            { includeExternalModuleExports: true });
            return info;
        }
        async getQuickInfoAtPosition(file, position, text) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                await this.setCode(file, text);
            }
            return await this.tsWorker.getQuickInfoAtPosition("file:///" + file, position);
        }
        async getCodeFixesAtPosition(file, text = undefined, start, end, errorCodes) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                await this.setCode(file, text);
            }
            return await this.tsWorker.getCodeFixesAtPosition("file:///" + file, start, end, errorCodes, {});
        }
        async formatDocument(filePath, text = undefined) {
            await this.waitForInited;
            await this.setCode(filePath, text);
            var textChanges = await this.tsWorker.getFormattingEditsForDocument("file:///" + filePath, {
                convertTabsToSpaces: true,
                insertSpaceAfterCommaDelimiter: true,
                insertSpaceAfterKeywordsInControlFlowStatements: true,
                insertSpaceBeforeAndAfterBinaryOperators: true,
                newLineCharacter: "\n",
                indentStyle: ts.IndentStyle.Smart,
                indentSize: 4,
                tabSize: 4
            });
            let finalText = text;
            textChanges = textChanges.sort((a, b) => b.span.start - a.span.start);
            for (var i = 0; i < textChanges.length; i++) {
                var textChange = textChanges[i];
                const { span } = textChange;
                finalText = finalText.slice(0, span.start) + textChange.newText
                    + finalText.slice(span.start + span.length);
            }
            return finalText;
        }
        async getDiagnosticsForAll() {
            var mods = monaco.editor.getModels();
            var ret = [];
            var countErrors = 0;
            for (var x = 0; x < mods.length; x++) {
                var url = "file:///" + mods[x].uri.path;
                if (url.indexOf("node_modules/") > 0)
                    continue;
                try {
                    var sug = await this.tsWorker.getSemanticDiagnostics(url);
                    for (var s = 0; s < sug.length; s++) {
                        //@ts-ignore
                        sug[s]["file"] = {
                            fileName: mods[x].uri.path.substring(1)
                        };
                        ret.push(sug[s]);
                    }
                    sug = await this.tsWorker.getSyntacticDiagnostics(url);
                    for (var s = 0; s < sug.length; s++) {
                        //@ts-ignore
                        sug[s]["file"] = {
                            fileName: mods[x].uri.path.substring(1)
                        };
                        ret.push(sug[s]);
                    }
                }
                catch (ex) {
                    if (!ex.message.indexOf("file:////lib.dom.d.ts") && ex.message.indexOf(" file:////lib.es5.d.ts"))
                        console.log("Error: " + url + ex.message);
                }
            }
            console.log("ready");
            return ret;
            /* var prog=Typescript.languageService.getProgram();
             let all=Typescript.ts.getPreEmitDiagnostics(prog);
             let all2=prog.emit().diagnostics;
             let ret=[];
             all.forEach((diag)=>{
                 if(diag.file!==undefined&&!diag.file.fileName.startsWith("node_modules"))
                     ret.push(diag);
             });
             return ret;*/
        }
        getLineAndCharacterOfPosition(fileName, pos) {
            var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getPositionAt(pos);
            return {
                line: p.lineNumber,
                character: p.column
            };
        }
        getPositionOfLineAndCharacter(fileName, pos) {
            var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getOffsetAt({
                column: pos.character,
                lineNumber: pos.line
            });
            return p;
        }
        async getDiagnostics(file, text = undefined) {
            await this.waitForInited;
            if (Typescript_6._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                this.setCode(file, text);
            }
            return {
                semantic: await this.tsWorker.getSemanticDiagnostics("file:///" + file),
                suggestion: await this.tsWorker.getSuggestionDiagnostics("file:///" + file),
                syntactic: await this.tsWorker.getSyntacticDiagnostics("file:///" + file)
                //      declaration:Typescript.languageService.getDeclarationDiagnostics(file)
            };
        }
    };
    /**
    * resolved if the service is inited
    */
    Typescript._isInited = undefined;
    Typescript.compilerSettings = {
        baseUrl: "./",
        target: "ES2017",
        module: "AMD",
        sourceMap: true,
        outDir: "./js",
        allowJs: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
        jsx: monaco.languages.typescript.JsxEmit.React,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        typeRoots: ["./node_modules/@types"]
    };
    Typescript = Typescript_6 = __decorate([
        Registry_33.$Class("jassijs_editor.util.Typescript"),
        __metadata("design:paramtypes", [])
    ], Typescript);
    exports.Typescript = Typescript;
    //@ts-ignore
    var typescript = new Typescript();
    Typescript.instance = typescript;
    exports.default = typescript;
});
//this file is autogenerated don't modify
define("jassijs_editor/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_editor/AcePanel.ts": {
                "date": 1684357702000,
                "jassijs.ui.AcePanel": {}
            },
            "jassijs_editor/AcePanelSimple.ts": {
                "date": 1657651672000,
                "jassijs.ui.AcePanelSimple": {}
            },
            "jassijs_editor/ChromeDebugger.ts": {
                "date": 1681488352000,
                "jassijs_editor.ChromeDebugger": {}
            },
            "jassijs_editor/CodeEditor.ts": {
                "date": 1696697256483.297,
                "jassijs_editor.CodeEditorSettingsDescriptor": {
                    "$SettingsDescriptor": [],
                    "@members": {}
                },
                "jassijs_editor.CodeEditor": {
                    "@members": {}
                }
            },
            "jassijs_editor/CodeEditorInvisibleComponents.ts": {
                "date": 1681558934000,
                "jassijs_editor.CodeEditorInvisibleComponents": {}
            },
            "jassijs_editor/CodePanel.ts": {
                "date": 1655661690000,
                "jassijs_editor.CodePanel": {}
            },
            "jassijs_editor/ComponentDesigner.ts": {
                "date": 1697051410384.2578,
                "jassijs_editor.ComponentDesigner": {}
            },
            "jassijs_editor/ComponentExplorer.ts": {
                "date": 1696696982919.5652,
                "jassijs_editor.ComponentExplorer": {}
            },
            "jassijs_editor/ComponentPalette.ts": {
                "date": 1697051376777.724,
                "jassijs_editor.ComponentPalette": {}
            },
            "jassijs_editor/ComponentSpy.ts": {
                "date": 1681570602000,
                "jassijs_editor.ui.ComponentSpy": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "dummy": {
                            "$Action": [
                                {
                                    "name": "Administration",
                                    "icon": "mdi mdi-account-cog-outline"
                                }
                            ]
                        },
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Spy Components",
                                    "icon": "mdi mdi-police-badge"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/DatabaseDesigner.ts": {
                "date": 1684176866000,
                "jassijs_editor/DatabaseDesigner": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Database Designer",
                                    "icon": "mdi mdi-database-edit"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/Debugger.ts": {
                "date": 1656019586000,
                "jassijs_editor.Debugger": {}
            },
            "jassijs_editor/ErrorPanel.ts": {
                "date": 1682794808000,
                "jassijs_editor.ui.ErrorPanel": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "showDialog": {
                            "$Action": [
                                {
                                    "name": "Administration/Errors",
                                    "icon": "mdi mdi-emoticon-confused-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/ext/monaco.ts": {
                "date": 1681572586000
            },
            "jassijs_editor/FileExplorer.ts": {
                "date": 1683575950000,
                "jassijs_editor.ui.FileActions": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/File",
                                    "icon": "mdi mdi-file",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "download": {
                            "$Action": [
                                {
                                    "name": "Download",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newFolder": {
                            "$Action": [
                                {
                                    "name": "New/Folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "newModule": {
                            "$Action": [
                                {
                                    "name": "New/Module",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "dodelete": {
                            "$Action": [
                                {
                                    "name": "Delete"
                                }
                            ]
                        },
                        "mapLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Map local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "closeLocalFolder": {
                            "$Action": [
                                {
                                    "name": "Close local folder",
                                    "isEnabled": "function"
                                }
                            ]
                        },
                        "rename": {
                            "$Action": [
                                {
                                    "name": "Rename"
                                }
                            ]
                        },
                        "refresh": {
                            "$Action": [
                                {
                                    "name": "Refresh"
                                }
                            ]
                        },
                        "open": {
                            "$Action": [
                                {
                                    "name": "Open",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                },
                "jassijs.ui.FileExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Files",
                                    "icon": "mdi mdi-file-tree"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/HtmlDesigner.ts": {
                "date": 1697052572549.2588,
                "jassijs_editor.HtmlDesigner": {}
            },
            "jassijs_editor/modul.ts": {
                "date": 1695399690345.8984
            },
            "jassijs_editor/MonacoPanel.ts": {
                "date": 1684357486000,
                "jassijs_editor.MonacoPanel": {}
            },
            "jassijs_editor/SearchExplorer.ts": {
                "date": 1681590246000,
                "jassijs_editor.ui.SearchExplorer": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Windows/Development/Search",
                                    "icon": "mdi mdi-folder-search-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/StartEditor.ts": {
                "date": 1681571256000
            },
            "jassijs_editor/template/TemplateDBDialog.ts": {
                "date": 1681570392000,
                "jassijs_editor.template.TemplateDBDialogProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBDialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateDBObject.ts": {
                "date": 1681570394000,
                "jassijs_editor.template.TemplateDBObjectProperties": {
                    "@members": {}
                },
                "jassijs.template.TemplateDBObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/DBObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateEmptyDialog.ts": {
                "date": 1681579996000,
                "jassijs_editor.template.TemplateEmptyDialog": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/Dialog",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/template/TemplateRemoteObject.ts": {
                "date": 1681570100000,
                "jassijs_editor.template.TemplateRemoteObject": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/RemoteObject",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/DatabaseSchema.ts": {
                "date": 1681569388000,
                "jassijs_editor.util.DatabaseSchema": {}
            },
            "jassijs_editor/util/DragAndDropper.ts": {
                "date": 1657925428000,
                "jassijs_editor.util.DragAndDropper": {}
            },
            "jassijs_editor/util/Parser.ts": {
                "date": 1697052536534.7373,
                "jassijs_editor.util.Parser": {}
            },
            "jassijs_editor/util/Resizer.ts": {
                "date": 1656018240000,
                "jassijs_editor.util.Resizer": {}
            },
            "jassijs_editor/util/Tests.ts": {
                "date": 1684358014000,
                "jassijs_editor.ui.TestAction": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "testNode": {
                            "$Action": [
                                {
                                    "name": "Run Tests"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_editor/util/TSSourceMap.ts": {
                "date": 1682794840000,
                "jassijs_editor.util.TSSourceMap": {}
            },
            "jassijs_editor/util/Typescript.ts": {
                "date": 1695586918212.458,
                "jassijs_editor.util.Typescript": {}
            }
        }
    };
});
//# sourceMappingURL=jassijs_editor.js.map