var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs_editor/Debugger", "jassijs/ui/OptionDialog", "jassijs_editor/util/TSSourceMap", "jassijs/util/Reloader", "jassijs/remote/Server", "jassijs/base/Windows"], function (require, exports, Jassi_1, Debugger_1, OptionDialog_1, TSSourceMap_1, Reloader_1, Server_1, Windows_1) {
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
                if (Jassi_1.default.debugger !== undefined)
                    Jassi_1.default.debugger.destroy();
                Jassi_1.default.debugger = this;
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
                    Jassi_1.default.registry.reload();
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
            var editor = Jassi_1.default.windows.findComponent("jassijs_editor.CodeEditor-" + file);
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
        Jassi_1.$Class("jassijs_editor.ChromeDebugger"),
        __metadata("design:paramtypes", [])
    ], ChromeDebugger);
    exports.ChromeDebugger = ChromeDebugger;
    //if connected then this instance is registred to jassijs.debugger;
    new ChromeDebugger();
    window.postMessage({ toJassiExtension: true, name: "connect" }, "*");
});
//# sourceMappingURL=ChromeDebugger.js.map