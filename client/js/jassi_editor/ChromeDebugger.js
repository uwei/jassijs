var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "remote/jassi/base/Jassi", "jassi_editor/Debugger", "jassi/ui/OptionDialog", "jassi_editor/util/TSSourceMap", "jassi/util/Reloader", "remote/jassi/base/Server", "../jassi/base/Windows"], function (require, exports, Jassi_1, Debugger_1, OptionDialog_1, TSSourceMap_1, Reloader_1, Server_1, Windows_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ChromeDebugger = void 0;
    //		var extensionId="nheagplodboonenlmdkdeicbgpdgnclk";//homepc
    //var extensionId="acdfaoillomjkcepfbfdbccmipjhgmco";//laptop
    var extensionId = "nfbbhnmkfdonfbobklbjinalhgileegp"; //laptop neu
    /**
     * debugging in Chrome
     */
    let ChromeDebugger = class ChromeDebugger extends Debugger_1.Debugger {
        constructor() {
            super();
            this.allBreakPoints = {};
            this.listentoCodeChanges();
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
            var editor = Windows_1.default.findComponent("jassi_editor.CodeEditor-" + filename);
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
                new Reloader_1.Reloader().reloadJS(file.replace(".ts", ""));
                if (code.indexOf("jassi.register(") > -1) {
                    Jassi_1.default.registry.reload();
                }
            });
        }
        static isExtensionInstalled() {
            if (window["chrome"] === undefined)
                return false;
            try {
                window["chrome"].runtime.sendMessage(extensionId, { name: "connect" }, undefined);
            }
            catch (ex) {
                return false;
            }
            return true;
        }
        listentoCodeChanges() {
            var _this = this;
            window["chrome"].runtime.sendMessage(extensionId, { name: "getCodeChange" }, undefined, function (ret) {
                if (_this.destroyed)
                    return;
                _this.saveCode(ret.url.url, ret.data);
                _this.listentoCodeChanges();
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
            var newline = await new TSSourceMap_1.TSSourceMap().getLineFromTS(file, line, column);
            var ret = new Promise(function (resolve) {
                //http://localhost/jassi/public_html/demo/TreeTable.js?bust=1551539152470
                var sfile = file.replace(".ts", ".js");
                var url = window.location.href.split("/app.html")[0] + "/" + "js/" + sfile; //+"?bust="+window.jassiversion;
                window["chrome"].runtime.sendMessage(extensionId, {
                    name: "breakpointChanged",
                    url: url,
                    line: newline,
                    enable: enable,
                    condition: "1===1",
                    type: type
                }, undefined, function (ret) {
                    resolve(ret);
                });
            });
            return ret;
        }
        /**
        * add debugpoints in code
        * @param {[string]} lines - code
        * @param {Object.<number, boolean>} debugpoints - the debugpoints
        * @param {jassi_editor.CodeEditor} codeEditor
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
            var editor = Jassi_1.default.windows.findComponent("jassi_editor.CodeEditor-" + file);
            if (editor !== undefined) {
                editor.addVariables(variables);
            }
        }
        destroy() {
            //	chrome.runtime.sendMessage(extensionId,{name: "disconnect"},undefined);
            this.destroyed = true;
        }
    };
    ChromeDebugger = __decorate([
        Jassi_1.$Class("jassi_editor.ChromeDebugger"),
        __metadata("design:paramtypes", [])
    ], ChromeDebugger);
    exports.ChromeDebugger = ChromeDebugger;
    Jassi_1.default.test = function () {
        alert(Jassi_1.default.base.ChromeDebugger.isExtensionInstalled());
        var kk = new Jassi_1.default.base.ChromeDebugger();
    };
    if (ChromeDebugger.isExtensionInstalled()) {
        if (Jassi_1.default.debugger !== undefined)
            Jassi_1.default.debugger.destroy();
        Jassi_1.default.debugger = new ChromeDebugger();
    }
});
//# sourceMappingURL=ChromeDebugger.js.map