import jassi, { $Class } from "jassi/remote/Jassi";
import { Debugger } from "jassi_editor/Debugger";
import { CodeEditor } from "jassi_editor/CodeEditor";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { TSSourceMap } from "jassi_editor/util/TSSourceMap";
import { Reloader } from "jassi/util/Reloader";
import { Server } from "jassi/remote/Server";
import windows from "../jassi/base/Windows";


//		var extensionId="nheagplodboonenlmdkdeicbgpdgnclk";//homepc
//var extensionId="acdfaoillomjkcepfbfdbccmipjhgmco";//laptop
var extensionId = "fneicfmgliieackjmcpomdomljidfamb";//laptop neu
/**
 * debugging in Chrome
 */
@$Class("jassi_editor.ChromeDebugger")
export class ChromeDebugger extends Debugger {
    allBreakPoints: { [file: string]: string[] } = {};
    constructor() {
        super();

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
        var file:string = this.urlToFile(url);
        var filename:string=file.replace("$temp","");
        var _this = this;
        //give the user the option to reload the changes in codeeditor
        var editor = windows.findComponent("jassi_editor.CodeEditor-" + filename);
        if (editor !== undefined) {

            if (editor._codeToReload === undefined) {

                OptionDialog.show("The source was updated in Chrome. Do you want to load this modification?", ["Yes", "No"], editor, false).then(function (data) {
                    if (data.button === "Yes")
                        editor.value = editor._codeToReload;
                    delete editor._codeToReload;
                });
            }
            //remove temporary debugpoints
            if (file.indexOf("$temp")>-1) {
                var reg = new RegExp("{var debug_editor.*debug_editor\\.addVariables\\(_variables_\\)\\;}");
                var ret = reg.exec(code);
                while (ret !== null) {
                    code = code.substring(0, ret.index) + code.substring(ret.index + ret[0].length);
                    ret = reg.exec(code);
                }
            }
            editor._codeToReload = code;

        }
         if (file.indexOf("$temp")>-1) {
            return;
        }
        new Server().saveFile(file, code).then(function () {
            new Reloader().reloadJS(file.replace(".ts", ""));
            if (code.indexOf("jassi.register(") > -1) {
                jassi.registry.reload();
            }
        });
    }
    static isExtensionInstalled() {
        if (window["chrome"] === undefined)
            return false;
        try {
            window["chrome"].runtime.sendMessage(extensionId, { name: "connect" }, undefined);

        } catch (ex) {
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
    async removeBreakpointsForFile(file: string) {
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
        } else {
            var pos = this.allBreakPoints[file].indexOf(line + ":" + column);
            this.allBreakPoints[file].splice(pos, 1);
        }
        var newline = await new TSSourceMap().getLineFromTS(file, line, column);
        var ret = new Promise(function (resolve) {
            //http://localhost/jassi/public_html/demo/TreeTable.js?bust=1551539152470
            var sfile = file.replace(".ts", ".js");
            var url = window.location.href.split("/app.html")[0] + "/" + "js/" + sfile;//+"?bust="+window.jassiversion;
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
        })
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

        var editor = jassi.windows.findComponent("jassi_editor.CodeEditor-" + file);
        if (editor !== undefined) {
            editor.addVariables(variables);
        }

    }
    destroy() {
        //	chrome.runtime.sendMessage(extensionId,{name: "disconnect"},undefined);
        this.destroyed = true;
    }
    /*	var port = chrome.runtime.connect("acdfaoillomjkcepfbfdbccmipjhgmco",{name: "knockknock"});
        port.postMessage({joke: "Knock knock"});
	
        port.onMessage.addListener(function(msg) {
        debugger;
            if (msg.question == "Who's there?")
            port.postMessage({answer: "Madame"});
          else if (msg.question == "Madame who?")
            port.postMessage({answer: "Madame... Bovary"});
        });*/
    //	chrome.runtime.sendMessage("acdfaoillomjkcepfbfdbccmipjhgmco",{greeting: "hello"}, function(response) {
    // debugger;
    //  console.log(response.farewell);
    //	});

}

jassi.test = function () {
    alert(jassi.base.ChromeDebugger.isExtensionInstalled());
    var kk = new jassi.base.ChromeDebugger();

}
if (ChromeDebugger.isExtensionInstalled()) {
    if (jassi.debugger !== undefined)
        jassi.debugger.destroy();
    jassi.debugger = new ChromeDebugger();
}
