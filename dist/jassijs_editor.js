var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("jassijs_editor/AcePanel", ["require", "exports", "jassijs_editor/ext/acelib", "jassijs_editor/util/Typescript", "jassijs/remote/Jassi", "jassijs/remote/Registry", "jassijs_editor/CodePanel", "jassijs_editor/Debugger"], function (require, exports, acelib_1, Typescript_1, Jassi_1, Registry_1, CodePanel_1) {
    "use strict";
    var AcePanel_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.AcePanel = void 0;
    /**
    * wrapper for the Ace-Code editor with Typesccript-Code-Completion an other features
    * @class jassijs.ui.CodePanel
    */
    let AcePanel = AcePanel_1 = class AcePanel extends CodePanel_1.CodePanel {
        constructor() {
            super();
            var _this = this;
            var test = $('<div class="CodePanel" style="height: 500px; width: 500px"></div>')[0];
            super.init(test);
            $(this.domWrapper).css("display", "");
            this._editor = acelib_1.default.edit(this._id);
            this.file = "";
            this.checkErrorTask = new Runlater(function () {
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
                        $(AcePanel_1._tooltipdiv).html(text);
                        $(AcePanel_1._tooltipdiv).css({ "background-color": "#f7f4a5", display: "block", position: "absolute", 'top': event.y, 'left': event.x }).fadeIn('fast');
                    }
                });
            }
        }
        /**
         * show tooltip
         */
        _manageTooltip(event) {
            if (AcePanel_1._tooltipdiv === undefined) {
                AcePanel_1._tooltipdiv = $('<div id="tt">hallo</div>')[0];
                document.body.append(AcePanel_1._tooltipdiv);
            }
            if (event !== undefined)
                $(AcePanel_1._tooltipdiv).css({ display: "none", position: "absolute", 'top': event.y, 'left': event.x });
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
                        if (iserror) {
                            $(_this.dom).find(".ace_gutter").css("background", "#ffbdb9");
                        }
                        else {
                            $(_this.dom).find(".ace_gutter").css("background", "");
                        }
                    });
                });
            });
        }
        /**
         * initialize the Ace language Tools (only once)
         */
        _installLangTools() {
            var aceLangTools = acelib_1.default.require("ace/ext/language_tools");
            if (aceLangTools.jassi === undefined) {
                aceLangTools.jassi = {
                    constructor: {},
                    getDocTooltip: function (item) {
                        return item.codePanel.getDocTooltip(item);
                        // if (item.jassi !== undefined && item.jassijs.getDocTooltip !== undefined)
                        //     return item.jassijs.getDocTooltip(item);
                    },
                    getCompletions: function (editor, session, pos, prefix, callback) {
                        return editor.jassijs.getCompletions(editor, session, pos, prefix, callback);
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
            var _id = Registry_1.default.nextID();
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
                        doc = doc + "<b>" + ret.tags[x].name + " </b> " + (ret.tags[x].text === undefined ? "" : ret.tags[x].text.replaceAll("<", "&#60;").replaceAll(">", "&#62;") + "<br>");
                    }
                }
                doc = doc;
                var html = "<div style='font-size:12px'>" + doc + "<div>"; //this._getDescForMember(item.parent, item.name);
                //window.setTimeout(()=>{
                $("#" + _id)[0].outerHTML = html;
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
            this._editor.on("focus", handler);
        }
        /**
         * component lost focus
         * @param {function} handler
         */
        onblur(handler) {
            this._editor.on("blur", handler);
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
                this._editor.getSession().setUndoManager(new acelib_1.default.UndoManager());
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
        Jassi_1.$Class("jassijs.ui.AcePanel"),
        __metadata("design:paramtypes", [])
    ], AcePanel);
    exports.AcePanel = AcePanel;
    class Runlater {
        constructor(func, timeout) {
            this.isRunning = false;
            this.func = func;
            this.timeout = timeout;
        }
        _checkRun() {
            var _this = this;
            if (Date.now() > this.timeout + this.lastRun) {
                this.isRunning = false;
                this.func();
            }
            else {
                setTimeout(function () {
                    _this._checkRun();
                }, this.timeout);
            }
        }
        runlater() {
            var _this = this;
            this.lastRun = Date.now();
            if (this.isRunning) {
                return;
            }
            else {
                this.isRunning = true;
                setTimeout(function () {
                    _this._checkRun();
                }, this.timeout);
            }
        }
    }
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
define("jassijs_editor/ChromeDebugger", ["require", "exports", "jassijs/remote/Jassi", "jassijs_editor/Debugger", "jassijs/ui/OptionDialog", "jassijs_editor/util/TSSourceMap", "jassijs/util/Reloader", "jassijs/remote/Server", "jassijs/base/Windows"], function (require, exports, Jassi_2, Debugger_1, OptionDialog_1, TSSourceMap_1, Reloader_1, Server_1, Windows_1) {
    "use strict";
    var ChromeDebugger_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChromeDebugger = void 0;
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
            $.notify.addStyle('downloadlink', {
                html: "<div><a href='https://uwei.github.io/jassijs/jassichrome/jassijsext.zip'><span data-notify-text/></a></div>",
                classes: {
                    base: {
                        "color": "white",
                        "background-color": "lightblue"
                    }
                }
            });
            $.notify("Jassi Debugger Chrome extension not installed. Click here to download.", { position: "right bottom", style: 'downloadlink', autoHideDelay: 7000, });
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
                if (Jassi_2.default.debugger !== undefined)
                    Jassi_2.default.debugger.destroy();
                Jassi_2.default.debugger = this;
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
            var wurl = window.location.href.split("/app.html")[0];
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
                    Jassi_2.default.registry.reload();
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
            var editor = Jassi_2.default.windows.findComponent("jassijs_editor.CodeEditor-" + file);
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
        Jassi_2.$Class("jassijs_editor.ChromeDebugger"),
        __metadata("design:paramtypes", [])
    ], ChromeDebugger);
    exports.ChromeDebugger = ChromeDebugger;
    //if connected then this instance is registred to jassijs.debugger;
    new ChromeDebugger();
    window.postMessage({ toJassiExtension: true, name: "connect" }, "*");
});
define("jassijs_editor/CodeEditor", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/VariablePanel", "jassijs/ui/DockingContainer", "jassijs/ui/ErrorPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Classes", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs/base/Tests", "jassijs_editor/AcePanel", "jassijs_editor/util/Typescript", "jassijs_editor/MonacoPanel", "jassijs/remote/Settings"], function (require, exports, Jassi_3, Panel_1, VariablePanel_1, DockingContainer_1, ErrorPanel_1, Button_1, Registry_2, Server_2, Reloader_2, Classes_1, Component_1, Property_1, Tests_1, AcePanel_2, Typescript_2, MonacoPanel_1, Settings_1) {
    "use strict";
    var CodeEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CodeEditor = void 0;
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
        Jassi_3.$Class("jassijs_editor.CodeEditorSettingsDescriptor")
    ], CodeEditorSettingsDescriptor);
    /**
     * Panel for editing sources
     * @class jassijs_editor.CodeEditor
     */
    let CodeEditor = CodeEditor_1 = class CodeEditor extends Panel_1.Panel {
        constructor() {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_1.Panel();
            this._codeToolbar = new Panel_1.Panel();
            //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let mobil = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            let sett = Settings_1.Settings.gets(Settings_1.Settings.keys.Development_DefaultEditor);
            if (sett === "ace" || (mobil && (sett === "aceOnBrowser" || sett === undefined))) {
                this._codePanel = new AcePanel_2.AcePanel();
            }
            else {
                this._codePanel = new MonacoPanel_1.MonacoPanel();
                // this._codePanel = new AcePanel(); 
            }
            this._errors = new ErrorPanel_1.ErrorPanel();
            this._file = "";
            this._variables = new VariablePanel_1.VariablePanel();
            this._design = new Panel_1.Panel();
            this._init();
            this.editMode = true;
        }
        _initCodePanel() {
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            this._codePanel.height = "calc(100% - 31px)";
            let _this = this;
            this._codePanel.onBreakpointChanged(function (line, column, enable, type) {
                Jassi_3.default.debugger.breakpointChanged(_this._file, line, column, enable, type);
            });
        }
        _init() {
            var _this = this;
            this._initCodePanel();
            /*  this._codePanel.getDocTooltip = function (item) {
                  return _this.getDocTooltip(item);
              }*/
            this._codeToolbar["horizontal"] = true;
            this._codeToolbar.height = "30";
            this._codeView["horizontal"] = true;
            this._codeView.add(this._codeToolbar);
            this._codeView.add(this._codePanel);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            var lasttop = this._main.dom.offsetTop;
            var lasttop2 = 0;
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
                /*     if(_this._main.dom.offsetTop!==lasttop){//resize to height
                        lasttop=_this._main.dom.offsetTop;
                        var i="calc(100% - "+(lasttop+1)+"px)";
                        _this._main.height=i;
                    }*/
                //TODO _this._designView.resize();
            };
            var save = new Button_1.Button();
            save.tooltip = "Save(Ctrl+S)";
            save.icon = "mdi mdi-content-save mdi-18px";
            save.onclick(function () {
                _this.save();
            });
            this._codeToolbar.add(save);
            var run = new Button_1.Button();
            run.icon = "mdi mdi-car-hatchback mdi-18px";
            run.tooltip = "Run(F4)";
            run.onclick(function () {
                _this.evalCode();
            });
            this._codeToolbar.add(run);
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
            Jassi_3.default["$CodeEditor"] = CodeEditor_1;
            $(goto.dom).attr("ondrop", "event.preventDefault();jassijs.$CodeEditor.search(event.dataTransfer.getData('text'));");
            $(goto.dom).attr("ondragover", "event.preventDefault();");
            this._codeToolbar.add(goto);
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
            this._variables.createTable();
            //   this._codePanel.setCompleter(this);
            setTimeout(() => {
                //_this.editorProvider="ace";
            }, 100);
        }
        _installView() {
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this._variables, "Variables", "variables");
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
            await new Server_2.Server().saveFile(this._file, code);
            var f = this._file.replace(".ts", "");
            if (code.indexOf("@$") > -1) {
                await Registry_2.default.reload();
            }
            Reloader_2.Reloader.instance.reloadJS(f);
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
            $(this._codePanel.dom).keydown(function (evt) {
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
            this._variables.addAll(variables);
        }
        async _evalCodeOnLoad(data) {
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            var breakpoints = _this._codePanel.getBreakpoints();
            var filename = _this._file.replace(".ts", "$temp.ts");
            await Jassi_3.default.debugger.removeBreakpointsForFile(filename);
            for (var line in breakpoints) {
                if (breakpoints[line]) {
                    var row = lines[line].length;
                    await Jassi_3.default.debugger.breakpointChanged(filename, line, row, true, "debugpoint");
                }
            }
            var islocaldb = Classes_1.classes.getClass("jassijs_localserver.DBManager");
            if (islocaldb && code.indexOf("@$DBObject(") > -1) {
                islocaldb.destroyConnection();
            }
            if (data.test !== undefined) {
                var ret = await data.test(new Tests_1.Test());
                // Promise.resolve(ret).then(async function(ret) {
                if (ret !== undefined) {
                    if (ret.layout !== undefined)
                        _this.variables.addVariable("this", ret);
                    else {
                        //get variablename from return
                        var sfunc = data.test.toString();
                        var pos = sfunc.lastIndexOf("return ");
                        var pose = sfunc.indexOf(";", pos);
                        var retvar = sfunc.substring(pos + 7, pose).trim();
                        _this.variables.addVariable(retvar, ret);
                    }
                    _this.variables.addVariable("me", ret.me);
                    _this.variables.updateCache();
                    if (ret instanceof Component_1.Component && ret["reporttype"] === undefined) {
                        require(["jassijs_editor/ComponentDesigner"], function () {
                            var ComponentDesigner = Classes_1.classes.getClass("jassijs_editor.ComponentDesigner");
                            if (!((_this._design) instanceof ComponentDesigner)) {
                                _this._design = new ComponentDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                            }
                            _this._design["designedComponent"] = ret;
                        });
                    }
                    else if (ret["reporttype"] !== undefined) {
                        require(["jassijs_report/designer/ReportDesigner"], function () {
                            var ReportDesigner = Classes_1.classes.getClass("jassijs_report.designer.ReportDesigner");
                            if (!((_this._design) instanceof ReportDesigner)) {
                                _this._design = new ReportDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                            }
                            _this._design["designedComponent"] = ret;
                            /*   require(["jassijs_report/ReportDesign"], function() {
                                   var rd = classes.getClass("jassijs_report.ReportDesign");
                                   let rep = rd["fromJSON"](ret);
                                   
                                   _this._design["designedComponent"] = rep;
                               });*/
                        });
                    }
                }
                //  });
            }
        }
        async saveTempFile(file, code) {
            //@ts-ignore 
            var tss = await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); });
            var settings = Typescript_2.Typescript.compilerSettings;
            settings["inlineSourceMap"] = true;
            settings["inlineSources"] = true;
            var files = await tss.default.transpile(file + ".ts", code);
            var codets = -1;
            var codemap = -1;
            var codejs = -1;
            for (var x = 0; x < files.fileNames.length; x++) {
                if (files.fileNames[x].endsWith(".ts")) {
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
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
            this.__evalToCursorReached = false;
            this._variables.clear();
            //this._variables.add("this",this);
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            window["test"] = undefined;
            code = "";
            for (var x = 0; x < lines.length; x++) {
                code = code + lines[x] + "\n";
            }
            code = code;
            var _this = this;
            var tmp = new Date().getTime();
            var jsfile = _this._file.replace(".ts", "") + "$temp";
            //await new Server().saveFile("tmp/" + _this._file, code);
            //only local - no TS File in Debugger
            await this.saveTempFile(jsfile, code);
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
            require(["js/" + jsfile + ".js"], onload, /*error*/ function (err) {
                //console.log("reload");
                window.setTimeout(function () {
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
            return this._variables.getVariablesForType(type);
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            return this._variables.getVariableFromObject(ob);
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            return this._variables.getObjectFromVariable(varname);
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
            this._variables.renameVariable(oldName, newName);
            if (this._design !== undefined && this._design["_componentExplorer"] !== undefined)
                this._design["_componentExplorer"].update();
        }
        /**
         * @member { jassijs_editor.VariablePanel} - the variable
         */
        set variables(value) {
            this._variables = value;
        }
        get variables() {
            return this._variables;
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
            var s = this.file.split("/");
            return s[s.length - 1];
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
            this._variables.destroy();
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
        Jassi_3.$Class("jassijs_editor.CodeEditor"),
        __metadata("design:paramtypes", [])
    ], CodeEditor);
    exports.CodeEditor = CodeEditor;
    async function test() {
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = 300;
        editor.width = "100%";
        //await editor.openFile(url);
        editor.value = `import { Button } from "jassijs/ui/Button";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    button1?: Button;
};
@$Class("demo.EmptyDialog")
export class EmptyDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button1 = new Button();
        this.add(me.button1);
    }
}
export async function test() {
    var ret = new EmptyDialog();
    return ret;
}
`;
        editor.evalCode();
        return editor;
    }
    exports.test = test;
    ;
});
define("jassijs_editor/CodeEditorInvisibleComponents", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/remote/Registry", "jassijs/ui/InvisibleComponent", "jassijs/ui/Button", "jassijs/remote/Classes", "jassijs/ui/Image"], function (require, exports, Jassi_4, Panel_2, Registry_3, InvisibleComponent_1, Button_2, Classes_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeEditorInvisibleComponents = void 0;
    let CodeEditorInvisibleComponents = class CodeEditorInvisibleComponents extends Panel_2.Panel {
        constructor(codeeditor) {
            super();
            super.init($('<span class="Panel" style="border:1px solid #ccc;"/>')[0]);
            /**
           * @member {jassijs_editor.CodeEditor} - the parent CodeEditor
           * */
            this.codeeditor = codeeditor;
            this.layout();
        }
        layout() {
            this.update();
        }
        async update() {
            var _this = this;
            while (_this._components.length > 0) {
                _this.remove(_this._components[0]);
            }
            var elements = _this.codeeditor.getVariablesForType(InvisibleComponent_1.InvisibleComponent);
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
                var regdata = await Registry_3.default.getJSONData("$UIComponent");
                regdata.forEach(function (val) {
                    if (val.classname === cn) {
                        img.icon = val.params[0].icon;
                    }
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
            $("#jassitemp")[0].removeChild(helper.domWrapper);
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
        Jassi_4.$Class("jassijs_editor.CodeEditorInvisibleComponents"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditorInvisibleComponents);
    exports.CodeEditorInvisibleComponents = CodeEditorInvisibleComponents;
});
define("jassijs_editor/CodePanel", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs_editor/util/Typescript", "jassijs/base/Router"], function (require, exports, Jassi_5, Panel_3, Typescript_3, Router_1) {
    "use strict";
    var CodePanel_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodePanel = void 0;
    let CodePanel = CodePanel_2 = class CodePanel extends Panel_3.Panel {
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
            return CodePanel_2.numberToPosition(this.file, pos, this.value);
            /*var ret = typescript.getLineAndCharacterOfPosition(this.file, pos);
            return {
                row: ret.line,
                column: ret.character
            };*/
        }
        static numberToPosition(file, pos, code) {
            if (code !== undefined)
                Typescript_3.default.setCode(file, code);
            var ret = Typescript_3.default.getLineAndCharacterOfPosition(file, pos);
            return {
                row: ret.line,
                column: ret.character
            };
        }
        positionToNumber(pos) {
            Typescript_3.default.setCode(this.file, this.value);
            var ret = Typescript_3.default.getPositionOfLineAndCharacter(this.file, {
                line: pos.row,
                character: pos.column
            });
            return ret;
        }
        static async getAutoimport(lpos, file, code) {
            //var lpos = this.positionToNumber(this.cursorPosition);
            //@ts-ignore
            var change = await Typescript_3.default.getCodeFixesAtPosition(file, code, lpos, lpos, [2304]);
            if (change === undefined)
                return;
            for (let x = 0; x < change.length; x++) {
                if (change[x].changes[0].textChanges[0].newText === "const ") {
                    change.splice(x, 1);
                }
            }
            if (change.length > 0) {
                var entr = change[0].changes[0].textChanges[0];
                let insertPos = CodePanel_2.numberToPosition(file, entr.span.start, code);
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
            if (!Typescript_3.default.isInited(this.file)) {
                $.notify("please try later ... loading in progress", "info", { position: "bottom right" });
                return;
            }
            Typescript_3.default.getDefinitionAtPosition(this.file, pos).then((def) => {
                var _a;
                if (def !== undefined && def.length > 0) {
                    var entr = def[0];
                    var file = (_a = entr.fileName) === null || _a === void 0 ? void 0 : _a.replace("file:///", "");
                    var p = entr.textSpan.start;
                    var newPos = CodePanel_2.numberToPosition(file, p, undefined);
                    var line = newPos.row;
                    Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
                }
            });
        }
    };
    CodePanel = CodePanel_2 = __decorate([
        Jassi_5.$Class("jassijs_editor.CodePanel")
    ], CodePanel);
    exports.CodePanel = CodePanel;
});
define("jassijs_editor/ComponentDesigner", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/util/Resizer", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/ui/Repeater", "jassijs/ui/Button", "jassijs_editor/util/DragAndDropper", "jassijs/remote/Classes", "jassijs/ui/Databinder"], function (require, exports, Jassi_6, Panel_4, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, Resizer_1, CodeEditorInvisibleComponents_1, Repeater_1, Button_3, DragAndDropper_1, Classes_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ComponentDesigner = void 0;
    let ComponentDesigner = class ComponentDesigner extends Panel_4.Panel {
        constructor() {
            super();
            this._codeEditor = undefined;
            this._initDesign();
            this.editMode = true;
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this._variables = this._codeEditor._variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(value);
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
            var save = new Button_3.Button();
            save.tooltip = "Save(Ctrl+S)";
            save.icon = "mdi mdi-content-save mdi-18px";
            save.onclick(function () {
                _this.save();
            });
            this._designToolbar.add(save);
            var run = new Button_3.Button();
            run.icon = "mdi mdi-car-hatchback mdi-18px";
            run.tooltip = "Run(F4)";
            run.onclick(function () {
                _this.evalCode();
            });
            this._designToolbar.add(run);
            var undo = new Button_3.Button();
            undo.icon = "mdi mdi-undo mdi-18px";
            undo.tooltip = "Undo (Strg+Z)";
            undo.onclick(function () {
                _this.undo();
            });
            this._designToolbar.add(undo);
            /*  var test=new Button();
             test.icon="mdi mdi-bug mdi-18px";
             test.tooltip="Test";
             test.onclick(function(){
                         //var kk=_this._codeView.layout;
             });
             this._designToolbar.add(test);*/
            var edit = new Button_3.Button();
            edit.icon = "mdi mdi-run mdi-18px";
            edit.tooltip = "Test Dialog";
            edit.onclick(function () {
                _this.editDialog(!_this.editMode);
                edit.toggle(!_this.editMode);
            });
            this._designToolbar.add(edit);
            var lasso = new Button_3.Button();
            lasso.icon = "mdi mdi-lasso mdi-18px";
            lasso.tooltip = "Select rubberband";
            lasso.onclick(function () {
                var val = lasso.toggle();
                _this._resizer.setLassoMode(val);
                _this._draganddropper.enableDraggable(!val);
                //_this._draganddropper.activateDragging(!val);
            });
            this._designToolbar.add(lasso);
            var remove = new Button_3.Button();
            remove.icon = "mdi mdi-delete-forever-outline mdi-18px";
            remove.tooltip = "Delete selected Control (ENTF)";
            remove.onclick(function () {
                _this.removeComponent();
            });
            this._designToolbar.add(remove);
            this.add(this._designToolbar);
            $(this._designPlaceholder.domWrapper).css("position", "relative");
            this.add(this._designPlaceholder);
        }
        /**
       * manage shortcuts
       */
        registerKeys() {
            var _this = this;
            $(this._codeEditor._design.dom).attr("tabindex", "1");
            $(this._codeEditor._design.dom).keydown(function (evt) {
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
                if (evt.keyCode === 90 || evt.ctrlKey) { //Ctrl+Z
                    _this.undo();
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 46) { //Del
                    _this.removeComponent();
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
            this._invisibleComponents.update().then(function () {
                /* var h=_this._invisibleComponents.dom.offsetHeight;
                 h=h+6+31;
                 _this._designPlaceholder.height="calc(100% - "+h+"px)";*/
            });
        }
        _initComponentExplorer() {
            var _this = this;
            this._componentExplorer.onclick(function (data) {
                var ob = data.data;
                _this._propertyEditor.value = ob;
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
        removeComponent() {
            var todel = this._propertyEditor.value;
            var varname = this._codeEditor.getVariableFromObject(todel);
            if (varname !== "this") {
                if (todel.domWrapper._parent !== undefined) {
                    todel.domWrapper._parent.remove(todel);
                }
                this._propertyEditor.removeVariableInCode(varname);
                this._propertyEditor.removeVariableInDesign(varname);
                this._updateInvisibleComponents();
            }
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
        /**
         * dialog edit mode
         * @param {boolean} enable - if true allow resizing and drag and drop
         */
        editDialog(enable) {
            var _this = this;
            this.editMode = enable;
            var component = this._designPlaceholder._components[0];
            //switch designmode
            var comps = $(component.dom).find(".jcomponent");
            comps.addClass("jdesignmode");
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
            this._variables.updateCache(); //variables can be added with Repeater.setDesignMode
            if (this._resizer !== undefined) {
                this._resizer.uninstall();
                console.log("uninstall");
            }
            if (this._draganddropper !== undefined) {
                this._draganddropper.uninstall();
            }
            if (enable === true) {
                var _this = this;
                var allcomponents = this._variables.getEditableComponents(component);
                if (this._propertyEditor.codeEditor === undefined) {
                    var ret = [];
                    this.getComponentIDsInDesign(component, ret);
                    allcomponents = ret.join(",");
                }
                else
                    allcomponents = this._variables.getEditableComponents(component);
                //this._installTinyEditor();
                this._draganddropper = new DragAndDropper_1.DragAndDropper();
                this._resizer = new Resizer_1.Resizer();
                this._resizer.draganddropper = this._draganddropper;
                console.log("onselect");
                this._resizer.onelementselected = function (elementIDs, e) {
                    var ret = [];
                    for (var x = 0; x < elementIDs.length; x++) {
                        var ob = $("#" + elementIDs[x])[0]._this;
                        if (ob["editorselectthis"])
                            ob = ob["editorselectthis"];
                        ret.push(ob);
                    }
                    if (ret.length > 0) {
                        _this._propertyEditor.value = ret[0];
                    }
                };
                this._resizer.onpropertychanged = function (comp, prop, value) {
                    console.log("prop change " + comp._id);
                    if (_this._propertyEditor.value !== comp)
                        _this._propertyEditor.value = comp;
                    _this._propertyEditor.setPropertyInCode(prop, value + "", true);
                    _this._propertyEditor.value = _this._propertyEditor.value;
                };
                this._resizer.install(component, allcomponents);
                allcomponents = this._variables.getEditableComponents(component, true);
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
            else {
            }
            /*  $(".hoho2").selectable({});
              $(".hoho2").selectable("disable");*/
            /*  $(".HTMLPanel").selectable({});
              $(".HTMLPanel").selectable("disable");
              $(".HTMLPanel").draggable({});
              $(".HTMLPanel").draggable("disable");*/
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
                _this._propertyEditor.removePropertyInCode("add", compName, oldName);
                var before;
                if (beforeComponent !== undefined && beforeComponent.type !== "atEnd") { //designdummy atEnd
                    var on = _this._codeEditor.getVariableFromObject(beforeComponent);
                    var par = _this._codeEditor.getVariableFromObject(beforeComponent._parent);
                    before = { variablename: par, property: "add", value: on };
                }
                _this._propertyEditor.setPropertyInCode("add", compName, false, newName, before);
            }
            /* if(newParent._components.length>1){//correct dummy
                 var dummy=	newParent._components[newParent._components.length-2];
                 if(dummy.designDummyFor!==undefined){
                     //var tmp=newParent._components[newParent._components.length-1];
                     newParent.remove(dummy);//._components[newParent._components.length-1]=newParent._components[newParent._components.length-2];
                     newParent.add(dummy);//._components[newParent._components.length-1]=tmp;
                 }
             }*/
            _this._variables.updateCache();
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
        createComponent(type, component, top, left, newParent, beforeComponent) {
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
                    var vardatabinder = _this._propertyEditor.getNextVariableNameForType("jassijs.ui.Databinder");
                    _this._propertyEditor.setPropertyInCode("createRepeatingComponent", "function(me:Me){\n\t\n}", true, repeatername);
                    repeater.createRepeatingComponent(function (me) {
                        if (this._designMode !== true)
                            return;
                        //_this._variables.addVariable(vardatabinder,databinder);
                        _this._variables.updateCache();
                    });
                    /*var db=new jassijs.ui.Databinder();
                    if(repeater.value!==undefined&&repeater.value.length>0)
                        db.value=repeater.value[0];
                    _this._variables.add(vardatabinder,db);
                    _this._variables.updateCache();*/
                }
            }
            var varvalue = new (Classes_3.classes.getClass(type));
            if (this._propertyEditor.codeEditor !== undefined) {
                var varname = _this._propertyEditor.addVariableInCode(type, scope);
                if (varname.startsWith("me.")) {
                    var me = _this._codeEditor.getObjectFromVariable("me");
                    me[varname.substring(3)] = varvalue;
                }
                else if (varname.startsWith("this.")) {
                    var th = _this._codeEditor.getObjectFromVariable("this");
                    th[varname.substring(5)] = varvalue;
                }
                else
                    _this._variables.addVariable(varname, varvalue);
                var newName = _this._codeEditor.getVariableFromObject(newParent);
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
            _this._variables.updateCache();
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
                varvalue.extensionCalled({ componentDesignerComponentCreated: {
                        newParent: newParent
                    } });
            }
            //include the new element
            _this.editDialog(true);
            _this._propertyEditor.value = varvalue;
            _this._componentExplorer.update();
            //var test=_this._invisibleComponents;
            _this._updateInvisibleComponents();
            return varvalue;
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
        /**
         * @member {jassijs.ui.Component} - the designed component
         */
        set designedComponent(component) {
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
            this.editDialog(true);
            this._componentExplorer.value = component;
            $(this.dom).focus();
            this._updateInvisibleComponents();
            //var parser=new jassijs.ui.PropertyEditor.Parser();
            //parser.parse(_this.value);
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
        Jassi_6.$Class("jassijs_editor.ComponentDesigner"),
        __metadata("design:paramtypes", [])
    ], ComponentDesigner);
    exports.ComponentDesigner = ComponentDesigner;
    async function test() {
        return new ComponentDesigner();
    }
    exports.test = test;
    ;
});
define("jassijs_editor/ComponentExplorer", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Tree", "jassijs/ui/ComponentDescriptor", "jassijs/ui/ContextMenu", "jassijs_editor/CodeEditor", "jassijs/ui/PropertyEditor", "jassijs/remote/Classes"], function (require, exports, Jassi_7, Panel_5, Tree_1, ComponentDescriptor_1, ContextMenu_1, CodeEditor_2, PropertyEditor_2, Classes_4) {
    "use strict";
    var _a, _b;
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
            this.tree.items = value;
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
            if (item === this.value)
                return item._components;
            var comps = ComponentDescriptor_1.ComponentDescriptor.describe(item.constructor).resolveEditableComponents(item);
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
        onclick(handler) {
            this.tree.addEvent("click", handler);
        }
        destroy() {
            this._value = undefined;
            super.destroy();
        }
    };
    ComponentExplorer = __decorate([
        Jassi_7.$Class("jassijs_editor.ComponentExplorer"),
        __metadata("design:paramtypes", [typeof (_a = typeof CodeEditor_2.CodeEditor !== "undefined" && CodeEditor_2.CodeEditor) === "function" ? _a : Object, typeof (_b = typeof PropertyEditor_2.PropertyEditor !== "undefined" && PropertyEditor_2.PropertyEditor) === "function" ? _b : Object])
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
define("jassijs_editor/ComponentPalette", ["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Image", "jassijs/remote/Registry", "jassijs/remote/Classes"], function (require, exports, Jassi_8, Panel_6, Image_1, Registry_4, Classes_5) {
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
            Registry_4.default.getJSONData(this._service).then((jdata) => {
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
            });
            /*registry.loadAllFilesForService(this._service).then(function(){
                registry.getData(_this._service).forEach(function(mdata){
                    var data:UIComponentProperties=mdata.params[0];
                    var img=new Image();
                    var name=data.fullPath.split("/");
                    var sname=name[name.length-1];
                    img.tooltip=sname;
                    img.src=data.icon===undefined?"res/unknowncomponent.png":data.icon;
                    img.height=24;
                    img.width=24;
                    img["createFromType"]=classes.getClassName(mdata.oclass);
                    img["createFromParam"]=data.initialize;
                    _this._makeDraggable(img);
                    _this.add(img);
                });
           });*/
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
                        img.height = 24;
                        img.width = 24;
                        img.x = component.x;
                        img.y = component.y;
                        helper._position = img;
                        component._helper = helper;
                        if (component.createFromParam !== undefined) {
                            $.extend(helper, component.createFromParam);
                        }
                        $("#jassitemp")[0].removeChild(helper.domWrapper);
                        $("#jassitemp")[0].removeChild(helper._position.domWrapper);
                    }
                    return helper._position.dom; //$(helper.dom);
                }
            });
        }
        destroy() {
            for (var x = 0; x < this._components.length; x++) {
                var comp = this._components[x];
                $(comp.dom).draggable("destroy");
                if (comp["_helper"] !== undefined)
                    comp["_helper"].destroy();
            }
            super.destroy();
        }
    };
    ComponentPalette = __decorate([
        Jassi_8.$Class("jassijs_editor.ComponentPalette"),
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
define("jassijs_editor/Debugger", ["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_9) {
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
            var editor = $("#" + id)[0]._this;
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
            Jassi_9.default.d[codeEditor._id] = undefined;
            //        	jassijs.ui.VariablePanel.get(this._id).__db=undefined;
            var hassome = undefined;
            this.debugpoints = debugpoints;
            for (var point in debugpoints) {
                if (debugpoints[point] === true) {
                    //lines[point]="if(jassijs.ui.VariablePanel.get("+this._id+").__db===undefined){ jassijs.ui.VariablePanel.get("+this._id+").__db=true;debugger;}"+lines[point];
                    lines[point] = "if(jassijs.d(" + codeEditor._id + ")) debugger;" + lines[point];
                    /*if(hassome===undefined){
                        hassome=true;
                        lines[0]="var _variables_=$('#"+this._id+"')[0]._this;"+lines[0];
                    }*/
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
            var svars = "{var debug_editor=$('#'+" + codeEditor._id + ")[0]._this;var _variables_={} ;try{if(this!==jassi)_variables_['this']=this;}catch(ex){};";
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
        Jassi_9.$Class("jassijs_editor.Debugger"),
        __metadata("design:paramtypes", [])
    ], Debugger);
    exports.Debugger = Debugger;
    if (Jassi_9.default.debugger === undefined)
        Jassi_9.default.debugger = new Debugger();
    require(["jassijs_editor/ChromeDebugger"]);
});
define("jassijs_editor/MonacoPanel", ["require", "exports", "jassijs/remote/Jassi", "jassijs/base/Router", "jassijs_editor/util/Typescript", "jassijs_editor/CodePanel", "jassijs/remote/Settings", "jassijs_editor/Debugger", "jassijs_editor/ext/monaco"], function (require, exports, Jassi_10, Router_2, Typescript_4, CodePanel_3, Settings_2) {
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
            var p = Typescript_4.default.getPositionOfLineAndCharacter(file, {
                line: pos.lineNumber, character: pos.column
            });
            setTimeout(() => {
                CodePanel_3.CodePanel.getAutoimport(p, file, code).then((data) => {
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
                Router_2.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
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
                var pos = Typescript_4.default.getPositionOfLineAndCharacter(file, { line: position.lineNumber, character: position.column });
                var all = await Typescript_4.default.getCompletion(file, pos, undefined, { includeExternalModuleExports: true });
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
    let MonacoPanel = class MonacoPanel extends CodePanel_3.CodePanel {
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
            let theme = Settings_2.Settings.gets(Settings_2.Settings.keys.Development_MoanacoEditorTheme);
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
            this.file = "a/Dialog.ts";
            this.value = "var a=window.document;";
        }
    };
    MonacoPanel = __decorate([
        Jassi_10.$Class("jassijs_editor.MonacoPanel"),
        __metadata("design:paramtypes", [])
    ], MonacoPanel);
    exports.MonacoPanel = MonacoPanel;
    async function test() {
        //await Settings.save(Settings.keys.Development_MoanacoEditorTheme, "vs-dark", "user")
        var dlg = new MonacoPanel();
        //  var code = await new Server().loadFile("a/Dialog.ts");
        dlg.loadsample();
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
define("jassijs_editor/StartEditor", ["require", "exports", "jassijs/ui/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/base/Router", "jassijs/ui/SearchExplorer", "jassijs/ui/DBObjectExplorer", "jassijs/ui/ActionNodeMenu"], function (require, exports, FileExplorer_1, Windows_2, Panel_7, Button_4, Router_3, SearchExplorer_1, DBObjectExplorer_1, ActionNodeMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        var body = new Panel_7.Panel({ id: "body" });
        body.max();
        Windows_2.default.addLeft(new DBObjectExplorer_1.DBObjectExplorer(), "DBObjects");
        Windows_2.default.addLeft(new SearchExplorer_1.SearchExplorer(), "Search");
        Windows_2.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        var bt = new Button_4.Button();
        Windows_2.default._desktop.add(bt);
        bt.icon = "mdi mdi-refresh";
        var am = new ActionNodeMenu_1.ActionNodeMenu();
        bt.onclick(() => {
            Windows_2.default._desktop.remove(am);
            am = new ActionNodeMenu_1.ActionNodeMenu();
            Windows_2.default._desktop.add(am);
        });
        Windows_2.default._desktop.add(am);
        Router_3.router.navigate(window.location.hash);
    }
    start().then();
});
define("jassijs_editor/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassijs_editor.css": "jassijs_editor.css" },
        "types": {
            "node_modules/monaco.d.ts": "https://cdn.jsdelivr.net/npm/monaco-editor@0.22.3/monaco.d.ts",
        },
        "require": {
            paths: {
                'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
                'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools',
                monacoLib: "jassijs_editor/ext/monacoLib",
                vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs"
            },
            shim: {
                'ace/ext/language_tools': ['ace/ace'],
            }
        }
    };
});
//this file is autogenerated don't modify
define("jassijs_editor/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_editor/AcePanel.ts": {
                "date": 1623100103030,
                "jassijs.ui.AcePanel": {}
            },
            "jassijs_editor/ChromeDebugger.ts": {
                "date": 1622998653413,
                "jassijs_editor.ChromeDebugger": {}
            },
            "jassijs_editor/CodeEditor.ts": {
                "date": 1623100158447,
                "jassijs_editor.CodeEditorSettingsDescriptor": {
                    "$SettingsDescriptor": []
                },
                "jassijs_editor.CodeEditor": {}
            },
            "jassijs_editor/CodeEditorInvisibleComponents.ts": {
                "date": 1622998616949,
                "jassijs_editor.CodeEditorInvisibleComponents": {}
            },
            "jassijs_editor/CodePanel.ts": {
                "date": 1623097926572,
                "jassijs_editor.CodePanel": {}
            },
            "jassijs_editor/ComponentDesigner.ts": {
                "date": 1623098090050,
                "jassijs_editor.ComponentDesigner": {}
            },
            "jassijs_editor/ComponentExplorer.ts": {
                "date": 1623100288249,
                "jassijs_editor.ComponentExplorer": {}
            },
            "jassijs_editor/ComponentPalette.ts": {
                "date": 1623099899741,
                "jassijs_editor.ComponentPalette": {}
            },
            "jassijs_editor/Debugger.ts": {
                "date": 1622998616949,
                "jassijs_editor.Debugger": {}
            },
            "jassijs_editor/modul.ts": {
                "date": 1622998616843
            },
            "jassijs_editor/MonacoPanel.ts": {
                "date": 1623100121857,
                "jassijs_editor.MonacoPanel": {}
            },
            "jassijs_editor/StartEditor.ts": {
                "date": 1623098599960
            },
            "jassijs_editor/util/DragAndDropper.ts": {
                "date": 1622998616949,
                "jassijs_editor.util.DragAndDropper": {}
            },
            "jassijs_editor/util/Parser.ts": {
                "date": 1623098989289,
                "jassijs_editor.base.Parser": {}
            },
            "jassijs_editor/util/Resizer.ts": {
                "date": 1622998616949,
                "jassijs_editor.util.Resizer": {}
            },
            "jassijs_editor/util/TSSourceMap.ts": {
                "date": 1622998616949,
                "jassijs_editor.util.TSSourceMap": {}
            },
            "jassijs_editor/util/Typescript.ts": {
                "date": 1623782321611,
                "jassijs_editor.util.Typescript": {}
            }
        }
    };
});
/*
requirejs.config({
    paths: {
        'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
        'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools'
    },
    shim: {
        'ace/ext/language_tools': ['ace/ace'],
    }
});*/
define("jassijs_editor/ext/acelib", ["require", 'ace/ace',
    'ace/ext/language_tools'], function (require, ac) {
    //  var tsmode= require("ace/mode/typescript");
    /*  var WorkerClient = require("ace/worker/worker_client").WorkerClient;
      var createWorker = function (session) {
          var worker = new WorkerClient(["ace"], "jassijs/ext/ace_tsmode", "WorkerModule");
          worker.attachToDocument(session.getDocument());

          worker.on("lint", function (results) {
              session.setAnnotations(results.data);
          });

          worker.on("terminate", function () {
              session.clearAnnotations();
          });

          return worker;
      };*/
    return {
        default: ac,
    };
});
//require.config({ paths: { vs: '//cdn.jsdelivr.net/npm/monaco-editor@0.20.0/dev/vs' } });
//require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs' } });
//require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.21.2/min/vs' } });
//let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
/*require.config({ paths: {
    monacoLib:"jassijs_editor/ext/monacoLib",
    vs: monacopath+"/vs"
 }
});
*/
define("jassijs_editor/ext/monacoLib", ["require"], function (require, editor) {
    window["module"] = {};
    window["module"].exports = {};
    return {};
});
define("jassijs_editor/ext/monaco", ["jassijs_editor/ext/monacoLib", "require", 'vs/editor/editor.main', "vs/language/typescript/tsWorker" /*,"monacoLib_editorWorkerServiceImpl","monacoLib_editorSimpleWorker","tsWorker"*/], function (mlib, require, monaco, tsWorker /*,editorWorkerServiceImpl,editorSimpleWorker,tsWorker*/) {
    //let monacopath="https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev";
    let monacopath = require("jassijs_editor/modul").default.require.paths.vs.replace("/vs", "");
    //get Typescript instance
    window.ts = window["module"].exports;
    delete window["module"];
    var platform_1 = require("vs/base/common/platform");
    platform_1.globals.MonacoEnvironment = {};
    function myfunc() {
        var worker = require(['vs/language/typescript/tsWorker'], function (tsWorker) {
            tsWorker.TypeScriptWorker.prototype.getCompletionsAtPosition = async function (fileName, position, properties) {
                return await this._languageService.getCompletionsAtPosition(fileName, position, properties);
            };
        });
    }
    platform_1.globals.MonacoEnvironment.getWorker = function (workerId, label) {
        var js = "/*editorWorkerService*/self.MonacoEnvironment={baseUrl: '" + monacopath + "/'};importScripts('" + monacopath + "/vs/base/worker/workerMain.js');/*editorWorkerService*/" + myfunc.toString() + ";myfunc();";
        const blob = new Blob([js], { type: 'application/javascript' });
        var workerUrl = URL.createObjectURL(blob);
        return new Worker(workerUrl, { name: label });
    };
    return {};
});
/*
 //hack to get languageService
    /*var orgLS=ts.createLanguageService;
    
    var funcResolve=undefined;
    var waiter=new Promise((resolve)=>{
        funcResolve=resolve;
    });
    ts.createLanguageService=function(host, documentRegistry, syntaxOnlyOrLanguageServiceMode){
            let ret=orgLS(host, documentRegistry, syntaxOnlyOrLanguageServiceMode);
            funcResolve(ret);
            return ret;
    }
    var ret = {
        getLanguageService:async function(){
            return await waiter;
        }
    }
    //hack monaco allways create a worker which not run as serviceWorker - so we can share the languageservice
    var EditorWorkerHost = require("vs/editor/common/services/editorWorkerServiceImpl").EditorWorkerHost;
    var EditorSimpleWorker = require("vs/editor/common/services/editorSimpleWorker").EditorSimpleWorker;
    var EditorWorkerClient = require("vs/editor/common/services/editorWorkerServiceImpl").EditorWorkerClient;
    class SynchronousWorkerClient {
        constructor(instance) {
            this._instance = instance;
            this._proxyObj = Promise.resolve(this._instance);
        }
        dispose() {
            this._instance.dispose();
        }
        getProxyObject() {
            return this._proxyObj;
        }
    }
    EditorWorkerClient.prototype._getOrCreateWorker = function() {
        if (!this._worker)
            this._worker = new SynchronousWorkerClient(new EditorSimpleWorker(new EditorWorkerHost(this), null));
        return this._worker;

    }*/ 
define("jassijs_editor/util/DragAndDropper", ["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_11) {
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
            if (this.draggableComponents !== undefined) {
                if (!enable)
                    this.draggableComponents.draggable('disable');
                else
                    this.draggableComponents.draggable('enable');
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
                var left = parseInt($(ui.helper).css('left'));
                var top = parseInt($(ui.helper).css('top'));
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
            // this.draggableComponents = $(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
            this.draggableComponents = $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable");
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
            $(this.parentPanel.dom).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('disable');
            $(this.allIDs).find(".jcomponent").not(".jdesigncontainer").not(".designerNoDraggable").draggable('enable');
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
                this.draggableComponents.draggable('destroy');
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
        Jassi_11.$Class("jassijs_editor.util.DragAndDropper"),
        __metadata("design:paramtypes", [])
    ], DragAndDropper);
    exports.DragAndDropper = DragAndDropper;
});
define("jassijs_editor/util/Parser", ["require", "exports", "jassijs/remote/Jassi", "jassijs_editor/util/Typescript"], function (require, exports, Jassi_12, Typescript_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Parser = exports.ParsedClass = void 0;
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
            this.data = {};
            /** {[string]} - all code lines*/
        }
        getModifiedCode() {
            const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
            const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
            const result = printer.printNode(ts.EmitHint.Unspecified, this.sourceFile, resultFile);
            return result;
        }
        /**
         * add a property
         * @param {string} variable - name of the variable
         * @param {string} property - name of the property
         * @param {string} value  - code - the value
         * @param node - the node of the statement
         */
        add(variable, property, value, node) {
            if (value === undefined || value === null)
                return;
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
                    node: node
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
        addImportIfNeeded(name, file) {
            if (this.imports[name] === undefined) {
                var imp = ts.createNamedImports([ts.createImportSpecifier(undefined, ts.createIdentifier(name))]);
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
                        _this.typeMe[name] = { node: tnode, value: stype };
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
            else if (arg.kind === ts.SyntaxKind.ArrowFunction) {
                return arg.getText();
            }
            throw "Error type not found";
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
                if (this.collectProperties) {
                    for (let x = 0; x < this.collectProperties.length; x++) {
                        var col = this.collectProperties[x];
                        if (col.classname === parsedClass.name && parsedClass.members[col.methodname]) {
                            var nd = parsedClass.members[col.methodname].node;
                            this.parseProperties(nd);
                        }
                    }
                }
            }
        }
        parseProperties(node) {
            if (ts.isVariableDeclaration(node)) {
                var name = node.name.getText();
                var value = node.initializer.getText();
                this.add(name, "_new_", value, node.parent.parent);
            }
            if ((ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.EqualsToken) ||
                ts.isCallExpression(node)) {
                var node1;
                var node2;
                var left;
                var value;
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
                    left = node1.getText(); // this.code.substring(node1.pos, node1.end).trim();
                    var params = [];
                    node.arguments.forEach((arg) => { params.push(arg.getText()); });
                    value = params.join(", "); //this.code.substring(node2.pos, node2.end).trim();//
                }
                var lastpos = left.lastIndexOf(".");
                var variable = left;
                var prop = "";
                if (lastpos !== -1) {
                    variable = left.substring(0, lastpos);
                    prop = left.substring(lastpos + 1);
                }
                this.add(variable, prop, value, node.parent);
            }
            node.getChildren().forEach(c => this.parseProperties(c));
        }
        visitNode(node) {
            var _this = this;
            if (node.kind === ts.SyntaxKind.ImportDeclaration) {
                var nd = node;
                var file = nd.moduleSpecifier.text;
                if (nd.importClause && nd.importClause.namedBindings) {
                    var names = nd.importClause.namedBindings.elements;
                    for (var e = 0; e < names.length; e++) {
                        this.imports[names[e].name.escapedText] = file;
                    }
                }
            }
            if (node.kind == ts.SyntaxKind.TypeAliasDeclaration && node["name"].text === "Me") {
                this.parseTypeMeNode(node);
            }
            else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
                this.parseClass(node);
            }
            else if (node && node.kind === ts.SyntaxKind.FunctionDeclaration) { //functions out of class
                this.functions[node["name"].text] = node;
                if (this.collectProperties) {
                    for (let x = 0; x < this.collectProperties.length; x++) {
                        var col = this.collectProperties[x];
                        if (col.classname === undefined && node["name"].text === col.methodname)
                            this.parseProperties(node);
                    }
                }
            }
            else
                node.getChildren().forEach(c => this.visitNode(c));
            //TODO remove this block
            if (node.kind === ts.SyntaxKind.FunctionDeclaration && node["name"].text === "test") {
                this.add(node["name"].text, "", "", undefined);
            }
        }
        /**
        * parse the code
        * @param {string} code - the code
        * @param {string} onlyfunction - only the code in the function is parsed, e.g. "layout()"
        */
        parse(code, collectProperties = undefined) {
            this.data = {};
            this.code = code;
            this.collectProperties = collectProperties;
            this.sourceFile = ts.createSourceFile('dummy.ts', code, ts.ScriptTarget.ES5, true);
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
            if (this.data[variablename] !== undefined && this.data[variablename][property] !== undefined) {
                var prop = undefined;
                if (onlyValue !== undefined) {
                    for (var x = 0; x < this.data[variablename][property].length; x++) {
                        if (this.data[variablename][property][x].value === onlyValue) {
                            prop = this.data[variablename][property][x];
                        }
                    }
                }
                else
                    prop = this.data[variablename][property][0];
                if (prop == undefined)
                    return;
                this.removeNode(prop.node);
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
        removeVariableInCode(varname) {
            var prop = this.data[varname];
            var allprops = [];
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
            for (var x = 0; x < allprops.length; x++) {
                this.removeNode(allprops[x].node);
            }
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
                    }
                }
            }
        }
        getNodeFromScope(classscope, variablescope = undefined) {
            var _a, _b, _c;
            var scope;
            if (variablescope) {
                scope = (_a = this.data[variablescope.variablename][variablescope.methodname][0]) === null || _a === void 0 ? void 0 : _a.node;
                scope = scope.expression.arguments[0];
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
        getNextVariableNameForType(type) {
            var varname = type.split(".")[type.split(".").length - 1].toLowerCase();
            for (var counter = 1; counter < 1000; counter++) {
                if (this.data.me === undefined || this.data.me[varname + counter] === undefined)
                    break;
            }
            return varname + counter;
        }
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
            var scope = this.getNodeFromScope(classscope, variablescope);
            var newExpression = undefined;
            var statements = scope["body"].statements;
            if (property === "new") { //me.panel1=new Panel({});
                let prop = this.data[variableName]["_new_"][0]; //.substring(3)];
                var constr = prop.value;
                value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                replace = true;
                var left = prop.node.getText();
                left = left.substring(0, left.indexOf("=") - 1);
                property = "_new_";
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(left), ts.createIdentifier(value)));
                /*	}else{//var hh=new Panel({})
                        let prop = this.data[variableName][0];
                        var constr = prop[0].value;
                        value = constr.substring(0, constr.indexOf("(") + 1) + value + constr.substring(constr.lastIndexOf(")"));
                        replace = true;
                        isFunction=true;
                        newExpression=ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier("me."+property), ts.createIdentifier(value)));
                    }*/
            }
            else if (isFunction) {
                newExpression = ts.createExpressionStatement(ts.createCall(ts.createIdentifier(variableName + "." + property), undefined, [ts.createIdentifier(value)]));
            }
            else
                newExpression = ts.createExpressionStatement(ts.createAssignment(ts.createIdentifier(variableName + "." + property), ts.createIdentifier(value)));
            if (replace !== false && this.data[variableName] !== undefined && this.data[variableName][property] !== undefined) { //edit existing
                let node = this.data[variableName][property][0].node;
                var pos = node.parent["statements"].indexOf(node);
                node.parent["statements"][pos] = newExpression;
                //if (pos >= 0)
                //  node.parent["statements"].splice(pos, 1);
            }
            else { //insert new
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
                        if (pos > 0 && statements[statements.length - 1].getText().startsWith("return "))
                            pos--;
                        statements.splice(pos, 0, newExpression);
                    }
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
        addVariableInCode(fulltype, classscope, variablescope = undefined) {
            let type = fulltype.split(".")[fulltype.split(".").length - 1];
            var varname = this.getNextVariableNameForType(type);
            //var if(scopename)
            var prefix = "me.";
            var node = this.getNodeFromScope(classscope, variablescope);
            var statements = node["body"].statements;
            if (node === undefined)
                throw Error("no scope to insert a variable could be found");
            for (var x = 0; x < statements.length; x++) {
                if (!statements[x].getText().includes("new ") && !statements[x].getText().includes("var "))
                    break;
            }
            var ass = ts.createAssignment(ts.createIdentifier(prefix + varname), ts.createIdentifier("new " + type + "()"));
            statements.splice(x, 0, ts.createStatement(ass));
            this.addTypeMe(varname, type);
            return "me." + varname;
        }
    };
    Parser = __decorate([
        Jassi_12.$Class("jassijs_editor.base.Parser"),
        __metadata("design:paramtypes", [])
    ], Parser);
    exports.Parser = Parser;
    async function test() {
        var code = Typescript_5.default.getCode("jassijs_editor/util/Parser.ts");
        var parser = new Parser();
        parser.parse(code, undefined);
        /*  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
          const resultFile = ts.createSourceFile("dummy.ts", "", ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
          const result = printer.printNode(ts.EmitHint.Unspecified, parser.sourceFile, resultFile);
          console.log(result);*/
    }
    exports.test = test;
});
define("jassijs_editor/util/Resizer", ["require", "exports", "jassijs/remote/Jassi"], function (require, exports, Jassi_13) {
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
            let elementID = $(this).attr('id');
            var _this = event === null || event === void 0 ? void 0 : event.data;
            if (_this.onelementselected !== undefined) {
                //select with click
                //delegate only the top window - this is the first event????
                if (_this.topElement === undefined) {
                    if ($("#" + elementID).hasClass("designerNoSelectable")) {
                        return;
                    }
                    _this.topElement = elementID;
                    setTimeout(function () {
                        $(".jselected").removeClass("jselected");
                        $("#" + _this.topElement).addClass("jselected");
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
            console.log("fire " + param[0]._id);
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
            var els = $(this.parentPanel.dom).find(this.elements);
            for (var i = 0; i < els.length; i++) {
                var element = els[i];
                if ($(element).hasClass("designerNoResizable")) {
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
                //window.status = topLeftX +"--"+topLeftY+"--"+bottomRightX+"--"+bottomRightY+"--"+x+"--"+y+"--"+isMouseDown;
                //change the cursor style when it is on the border or even at a distance of 8 pixels around the border
                if (x >= bottomRightX - borderSize && x <= bottomRightX + borderSize) {
                    /*  if(y >= bottomRightY-borderSize && y <= bottomRightY+borderSize){
                              this.isCursorOnBorder = true;
                              this.cursorType = "se-resize";
                      }*/
                    if (y > topLeftY - borderSize && y < bottomRightY + borderSize) {
                        this.isCursorOnBorder = true;
                        this.cursorType = "e-resize";
                    }
                }
                else if (x > topLeftX - borderSize && x < bottomRightX + borderSize) {
                    if (y >= bottomRightY - borderSize && y <= bottomRightY + borderSize) {
                        this.isCursorOnBorder = true;
                        this.cursorType = "s-resize";
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
                            $(".jselected").removeClass("jselected");
                            setTimeout(function () {
                                _this.onelementselected(_this.lastSelected, event);
                                _this.lastSelected = undefined;
                            }, 50);
                        }
                        lastTime = new Date().getTime();
                        var a = 9;
                        if (ui.selected._this && $(ui.selected).hasClass("jcomponent") && !$(ui.selected).hasClass("designerNoSelectable")) {
                            var ids = _this.elements + ",";
                            if (ids.indexOf("#" + ui.selected._this._id + ",") > -1) {
                                _this.lastSelected.push(ui.selected._this._id);
                                $("#" + ui.selected._this._id).addClass("jselected");
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
            if (!$(parentPanel.dom).hasClass("designerNoResizable")) {
                $(parentPanel.domWrapper).resizable({
                    resize: function (evt) {
                        var h = evt.target.offsetHeight;
                        var w = evt.target.offsetWidth;
                        if (_this.onpropertychanged !== undefined) {
                            evt.target._this.width = w;
                            evt.target._this.height = h;
                            console.log("cha" + evt.target._this._id);
                            _this.onpropertychanged(evt.target._this, "width", w);
                            _this.onpropertychanged(evt.target._this, "height", h);
                            $(evt.target._this.domWrapper).css("width", w + "px");
                            $(evt.target._this.domWrapper).css("height", h + "px");
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
        Jassi_13.$Class("jassijs_editor.util.Resizer"),
        __metadata("design:paramtypes", [])
    ], Resizer);
    exports.Resizer = Resizer;
});
define("jassijs_editor/util/TSSourceMap", ["require", "exports", "jassijs/ext/sourcemap", "jassijs/jassi", "jassijs/remote/Server", "jassijs/remote/Jassi"], function (require, exports, sourcemap_1, jassi_1, Server_3, Jassi_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TSSourceMap = void 0;
    //var sourceMap=window["sourceMap"];
    let TSSourceMap = class TSSourceMap {
        async getLineFromTS(tsfile, line, column) {
            var jscode;
            var mapcode = "";
            var filenumber = 0;
            var jsfilename;
            if (Server_3.Server.filesInMap && Server_3.Server.filesInMap[tsfile]) {
                var mod = Server_3.Server.filesInMap[tsfile].modul;
                jsfilename = jassi_1.default.modules[mod];
                mapcode = await $.ajax({ url: jsfilename + ".map", dataType: "text" });
                filenumber = Server_3.Server.filesInMap[tsfile].id;
            }
            else {
                jsfilename = "js/" + tsfile.replace(".ts", ".js");
                jscode = await $.ajax({ url: jsfilename, dataType: "text" });
                var pos = jscode.indexOf("//" + "# sourceMappingURL=");
                if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                    var b64 = jscode.substring(pos + 50);
                    mapcode = ts["base64decode"](undefined, b64);
                    //mapcode = decodeURIComponent(escape((b64)));
                }
                else {
                    mapcode = await $.ajax({ url: "js/" + tsfile.replace(".ts", ".js.map"), dataType: "text" });
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
            var jscode = await $.ajax({ url: jsfile, dataType: "text" });
            var mapcode = "";
            var pos = jscode.indexOf("//" + "# sourceMappingURL=");
            if (jscode.indexOf("//" + "# sourceMappingURL=data:application") > -1) {
                var b64 = jscode.substring(pos + 50);
                mapcode = atob(b64);
            }
            else {
                mapcode = await $.ajax({ url: jsfile.replace(".js", ".js.map"), dataType: "text" });
            }
            var ret = new Promise((resolve, reject) => {
                sourcemap_1.default.SourceMapConsumer.initialize({
                    "lib/mappings.wasm": "https://unpkg.com/source-map@0.7.3/lib/mappings.wasm"
                });
                var rawSourceMap = JSON.parse(mapcode);
                sourcemap_1.default.SourceMapConsumer.with(rawSourceMap, null, consumer => {
                    var test = consumer.sources;
                    var l = consumer.originalPositionFor({
                        bias: sourcemap_1.default.SourceMapConsumer.GREATEST_LOWER_BOUND,
                        line: line,
                        column: column
                    });
                    return l;
                }).then(function (whatever) {
                    resolve(whatever.line);
                });
            });
            return ret;
            //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js",function(data){
        }
    };
    TSSourceMap = __decorate([
        Jassi_14.$Class("jassijs_editor.util.TSSourceMap")
    ], TSSourceMap);
    exports.TSSourceMap = TSSourceMap;
});
define("jassijs_editor/util/Typescript", ["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Server", "jassijs_editor/ext/monaco", "jassijs/ext/requestidlecallback"], function (require, exports, Jassi_15, Server_4) {
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
            //@ts-ignore
            //await import("jassijs/ext/typescript");
            var ret = { fileNames: [fileName], contents: [content] };
            /*  var opt = {
                //  compilerOptions: {
                      baseUrl: "./",
                      target: ts.ScriptTarget.ES2017,
                      module: ts.ModuleKind.AMD,
                      sourceMap: true
               //   }
              };*/
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
            ret.fileNames.push("js/" + fileName.substring(0, fileName.length - 3) + ".js");
            ret.contents.push(comp.outputText);
            ret.fileNames.push("js/" + fileName.substring(0, fileName.length - 3) + ".js.map");
            ret.contents.push(comp.sourceMapText);
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
                //@ts-ignore
                "moduleResolution": monaco.languages.typescript.ModuleResolutionKind.node,
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
            for (var mod in Jassi_15.default.modules) {
                var config = (await new Promise((resolve_3, reject_3) => { require([mod + "/modul"], resolve_3, reject_3); })).default;
                if (config.types) {
                    for (var key in config.types) {
                        var file = config.types[key];
                        nodeFiles[key] = new Server_4.Server().loadFile(file);
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
            if (Typescript_6._isInited !== undefined)
                return;
            Typescript_6._isInited = false;
            Typescript_6.initMonaco();
            //@ts-ignore
            //  import("jassijs/ext/typescript").then(async function(ts1) {
            Typescript_6.ts = ts;
            var _this = this;
            var f = (await new Server_4.Server().dir(true)).resolveChilds();
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
                        nodeFiles[fname] = new Server_4.Server().loadFile(fname);
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
            if (!this.initInIdle)
                monaco.editor.createModel("var a=1;", "typescript", monaco.Uri.from({ path: "/__mydummy.ts", scheme: 'file' }));
            this.tsWorker = await (await monaco.languages.typescript.getTypeScriptWorker())();
            Typescript_6._isInited = true;
            return true;
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
            for (var x = 0; x < mods.length; x++) {
                var url = "file:///" + mods[x].uri.path;
                if (url.indexOf("node_modules/") > 0)
                    continue;
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
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
    };
    Typescript = Typescript_6 = __decorate([
        Jassi_15.$Class("jassijs_editor.util.Typescript"),
        __metadata("design:paramtypes", [])
    ], Typescript);
    exports.Typescript = Typescript;
    //@ts-ignore
    var typescript = new Typescript();
    exports.default = typescript;
});
//# sourceMappingURL=jassijs_editor.js.map