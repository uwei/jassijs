import { $Class } from "jassijs/remote/Jassi";
import { Debugger } from "jassijs_editor/Debugger";
import { CodeEditor } from "jassijs_editor/CodeEditor";
import { OptionDialog } from "jassijs/ui/OptionDialog";
import { TSSourceMap } from "jassijs_editor/util/TSSourceMap";
import { Reloader } from "jassijs/util/Reloader";
import { Server } from "jassijs/remote/Server";
import windows from "jassijs/base/Windows";
var installed=undefined;


/**
 * debugging in Chrome
 */
@$Class("jassijs_editor.ChromeDebugger")
export class ChromeDebugger extends Debugger {
    private static mid = 0;
    private responseList = {};
    allBreakPoints: { [file: string]: string[] } = {};
    constructor() {
        super();
        //listen to code changes
        this.sendChromeMessage({ name: "getCodeChange" });
        window.addEventListener("message", (event) => {
            // console.log("mess"+JSON.stringify(event));
            this.onChromeMessage(event);
        });
    }
    public static showHintExtensionNotInstalled(){
            $.notify.addStyle('downloadlink', {
        html: "<div><a href='https://uwei.github.io/jassijs/jassichrome/jassijsext.zip'><span data-notify-text/></a></div>",
        classes: {
            base: {
                "color": "white",
                "background-color": "lightblue"
            }
        }
    });
   
    $.notify("Jassi Debugger Chrome extension not installed. Click here to download.",  { position: "right bottom", style: 'downloadlink',autoHideDelay: 7000, });

    }
    //on receiving messages from chrome extension
    private onChromeMessage(event) {
        var _this = this;
        //console.log("Website received message: " + JSON.stringify(event.data));
        if (event?.data?.event === "onResourceContentCommitted") {
            _this.saveCode(event.data.url.url, event.data.data);
        }
        if (event.data.fromJassiExtension && event.data.connected) {
            installed=true;
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
    private sendChromeMessage(msg, response = undefined) {
        msg.toJassiExtension = true;
        msg.mid = ChromeDebugger.mid++;
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
        var file: string = this.urlToFile(url);
        var filename: string = file.replace("$temp", "");
        var _this = this;
        //give the user the option to reload the changes in codeeditor
        var editor = windows.findComponent("jassijs_editor.CodeEditor-" + filename);
        if (editor !== undefined) {

            if (editor._codeToReload === undefined) {

                OptionDialog.show("The source was updated in Chrome. Do you want to load this modification?", ["Yes", "No"], editor, false).then(function (data) {
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
        new Server().saveFile(file, code).then(function () {
            Reloader.instance.reloadJS(file.replace(".ts", ""));
            if (code.indexOf("jassijs.register(") > -1) {
                jassijs.registry.reload();
            }
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
        if(!installed)
            ChromeDebugger.showHintExtensionNotInstalled();
        if (this.allBreakPoints[file] === undefined) {
            this.allBreakPoints[file] = [];
        }
        if (enable) {
            this.allBreakPoints[file].push(line + ":" + column);
        } else {
            var pos = this.allBreakPoints[file].indexOf(line + ":" + column);
            this.allBreakPoints[file].splice(pos, 1);
        }
        var _this = this;
        var newline = await new TSSourceMap().getLineFromTS(file, line, column);
        var ret = new Promise(function (resolve) {
            //http://localhost/jassijs/public_html/demo/TreeTable.js?bust=1551539152470
            var sfile = newline.jsfilename;//file.replace(".ts", ".js");
            var root = window.location.origin + window.location.pathname;
            root = root.substring(0, root.lastIndexOf("/"));
            var url = root + "/" + newline.jsfilename;//+"?bust="+window.jassiversion;
            if (newline.jsfilename.indexOf(":") > -1)
                url = newline.jsfilename;//load module from js-file
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
        })
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

}


//if connected then this instance is registred to jassijs.debugger;
new ChromeDebugger();
window.postMessage({ toJassiExtension: true, name: "connect" }, "*");
