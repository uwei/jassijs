var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "jassi/base/Errors", "remote/jassi/base/Jassi", "jassi/ui/Button", "jassi_editor/util/TSSourceMap", "jassi/base/Router"], function (require, exports, Panel_1, Errors_1, Jassi_1, Button_1, TSSourceMap_1, Router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ErrorPanel = void 0;
    let ErrorPanel = class ErrorPanel extends Panel_1.Panel {
        /**
     * shows errors
     * @class jassi.ui.ErrorPanel
     */
        constructor() {
            super();
            this.layout();
        }
        layout() {
            var _this = this;
            this.IDClear = new Button_1.Button();
            this.IDClear.tooltip = "Clear log";
            this.IDClear.icon = "mdi mdi-delete";
            this.IDClear.onclick(function () {
                _this.clear();
                Jassi_1.default.errors.items = [];
            });
            this.IDClear.width = 35;
            this.IDSearch = new Button_1.Button();
            this.IDSearch.tooltip = "search errors";
            this.IDSearch.icon = "mdi mdi-file-search-outline";
            this.IDSearch.onclick(function () {
                _this.search();
            });
            this.IDToolbar = new Panel_1.Panel();
            this.IDToolbar.width = "99%";
            this.IDToolbar.add(this.IDClear);
            this.IDToolbar.add(this.IDSearch);
            this.IDToolbar.height = 20;
            super.add(this.IDToolbar);
            var value = $('<span><font  size="2"><span class="errorpanel"></span></font></span>')[0];
            this.dom.appendChild(value);
            this._container = $(this.dom).find(".errorpanel")[0];
            this.registerError();
            //old Errors
            for (var x = 0; x < Jassi_1.default.errors.items.length; x++) {
                this.addError(Jassi_1.default.errors.items[x]);
            }
            if (window["jassi_debug"] === undefined)
                window["jassi_debug"] = { variables: [] };
        }
        /**
         * search Errors in code
         **/
        async search() {
            var typescript = (await new Promise((resolve_1, reject_1) => { require(["jassi_editor/util/Typescript"], resolve_1, reject_1); })).default;
            await typescript.initService();
            var all = await typescript.getDiagnosticsForAll();
            if (all.length === 0)
                $.notify("no Errors found", "info", { position: "right" });
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
                            '<a href="#" onclick="jassi.ErrorPanel.prototype.onsrclink(this);">' +
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
                            '<a href="#" onclick="jassi.ErrorPanel.prototype.onsrclink(this);">' +
                            url + '</a>' + (line.endsWith(")") ? ")" : "") + '</div>';
                    }
                }
            }
            var value = $('<span>' + msg + '</span>');
            $(this._container).prepend(value);
            //  this.dom.appendChild(value);
        }
        async _convertURL(url) {
            //eliminate ?
            var lpos = url.indexOf("?");
            if (lpos > 0)
                url = url.substring(0, lpos) + url.substring(url.indexOf(":", lpos));
            var href = window.location.href;
            href = href.substring(0, window.location.href.lastIndexOf("/"));
            url = url.replace("$temp", "");
            url = url.replace(href + "/", "");
            if (url.endsWith(")"))
                url = url.substring(0, url.length - 1);
            var wurl = window.location.href.split("/app.html")[0];
            url = url.replace(wurl, "");
            if (!url.startsWith("/"))
                url = "/" + url;
            if (url.startsWith("/js") && url.indexOf(".js") > -1) {
                var aurl = url.substring(1).split(":");
                var newline = await new TSSourceMap_1.TSSourceMap().getLineFromJS(aurl[0], Number(aurl[1]), Number(aurl[2]));
                url = aurl[0].substring(3).replace(".js", ".ts") + ":" + newline + ":" + aurl[2];
                if (url.startsWith("tmp/"))
                    url = url.substring(4);
            }
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
            Jassi_1.default.errors.onerror(function (err) {
                _this.addError(err);
            }, this._id);
        }
        unregisterError() {
            Jassi_1.default.errors.offerror(this._id);
        }
        destroy() {
            this.unregisterError();
            super.destroy();
            //this._container
        }
    };
    ErrorPanel = __decorate([
        Jassi_1.$Class("jassi.ui.ErrorPanel"),
        __metadata("design:paramtypes", [])
    ], ErrorPanel);
    exports.ErrorPanel = ErrorPanel;
    function test() {
        var ret = new ErrorPanel();
        return ret;
    }
    exports.test = test;
    ;
    ErrorPanel.prototype["onsrclink"] = function (param) {
        var data = param.text.split(":");
        if (data[1] === "")
            return;
        Router_1.router.navigate("#do=jassi_editor.CodeEditor&file=" + data[0] + "&line=" + data[1]);
        // jassi_editor.CodeEditor.open(param.text);
    };
    Jassi_1.default.ErrorPanel = ErrorPanel;
});
//# sourceMappingURL=ErrorPanel.js.map