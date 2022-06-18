
import { Panel } from "jassijs/ui/Panel";
import { Errors } from "jassijs/base/Errors";
import { $Class } from "jassijs/remote/Jassi";
import { Button } from "jassijs/ui/Button";

import { classes } from "jassijs/remote/Classes";
import { router } from "jassijs/base/Router";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs.ui.ErrorPanel")
export class ErrorPanel extends Panel {
    IDClear: Button;
    _container;
    IDToolbar: Panel;
    IDSearch: Button;
    withControls: boolean;
    withLastErrors: boolean;
    withNewErrors: boolean;
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
    @$Action({
        name: "Administration/Errors",
        icon: "mdi mdi-emoticon-confused-outline",
    })
    static async showDialog() {
        router.navigate("#do=jassijs.ui.ErrorPanel");
    }
    layout() {
        var _this = this;
        if (this.withControls) {
            this.IDClear = new Button();
            this.IDClear.tooltip = "Clear log";
            this.IDClear.icon = "mdi mdi-delete";
            this.IDClear.onclick(function () {
                _this.clear();
                jassijs.errors.items = [];
            });
            this.IDClear.width = 35;
            this.IDSearch = new Button();
            this.IDSearch.tooltip = "search errors";
            this.IDSearch.icon = "mdi mdi-file-search-outline";
            this.IDSearch.onclick(function () {
                _this.search();

            });
            this.IDToolbar = new Panel();
            this.IDToolbar.width = "99%";

            this.IDToolbar.add(this.IDClear);
            this.IDToolbar.add(this.IDSearch);
            this.IDToolbar.height = 20;
            super.add(this.IDToolbar);
        }
        var value = $('<div><font  size="2"><div class="errorpanel"></div></font></div>')[0];
        this.dom.appendChild(value);
        this._container = $(this.dom).find(".errorpanel")[0];
        if (this.withNewErrors)
            this.registerError();
        if (this.withLastErrors) {
            //old Errors
            for (var x = 0; x < jassijs.errors.items.length; x++) {
                this.addError(jassijs.errors.items[x]);
            }
        }
        if (window["jassijs_debug"] === undefined)
            window["jassijs_debug"] = { variables: [] };

    }
    /**
     * search Errors in code
     **/
    async search() {
        var typescript = (await import("jassijs_editor/util/Typescript")).default;
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
                    stack: ""//href + "/" + diag.file.fileName + ":" + pos.line + ":" + pos.character

                }


            }
            Errors.errors.addError(err);
        }

    }
    /**
     * adds a new error
     * @param {object} error - the error
     */
    async addError(error) {
        var msg = "";
        if (error.infoMsg !== undefined) {
            msg = error.infoMsg + "<br>";
        } else {
            var sstack = "";
            var m = error.error?.message;
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

                } else {
                    if (line.split(":").length < 4)
                        continue;//edge and chrome insert message in stack->ignore
                    var poshttp = line.indexOf("http");
                    var url: string = await this._convertURL(line.substring(poshttp, line.length));
                    line = line.replace("\n", "");
                    var ident = (i === 0 ? "0" : "20");
                    msg = msg + '<div style="text-indent:' + ident + 'px;">' + line.substring(0, poshttp) +
                        '<a href="#" onclick="jassijs.ErrorPanel.prototype.onsrclink(this);">' +
                        url + '</a>' + (line.endsWith(")") ? ")" : "") + '</div>';

                }
            }

        }
        var value = $('<span>' + msg + '</span>');
        $(this._container).prepend(value);
        //  this.dom.appendChild(value);
    }
    async _convertURL(url: string) {
        //eliminate ?
        /*var lpos = url.indexOf("?");
        if (lpos > 0)
            url = url.substring(0, lpos) + url.substring(url.indexOf(":", lpos));
        var href = window.location.href;

        href = href.substring(0, window.location.href.lastIndexOf("/"));
        url = url.replace("$temp", "");
        url = url.replace(href + "/", "");
        
        //var wurl = window.location.href.split("/app.html")[0];
        //url = url.replace(wurl, "");*/
        var wurl = window.location.href.split("/app.html")[0];
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
            for (var mod in jassijs.modules) {
                if (jassijs.modules[mod] === u)
                    ismodul = true;
            }
            if (u.indexOf("/js/") > -1 || ismodul) {
                try {
                    var TSSourceMap = (await import("jassijs_editor/util/TSSourceMap")).TSSourceMap;
                var map=new TSSourceMap();
                    var pos = await map.getLineFromJS(u, Number(line), Number(col));
                    if (pos) {
                        return pos.source.replace("../client/", "").replaceAll("../", "").replace("$temp", "") +
                            ":" + pos.line + ":" + pos.column;
                    }
                } catch (err) {
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
        jassijs.errors.onerror(function (err) {
            _this.addError(err);

        }, this._id);
    }
    unregisterError() {
        jassijs.errors.offerror(this._id);
    }
    destroy() {
        this.unregisterError();
        super.destroy();
        //this._container
    }

    /*  set value(value){ //the Code
          //this.table.value=value;
      }
      get value(){
          //return this.table.value;
      }*/
}
export function test2() {
    var ret = new ErrorPanel();
    return ret;
};



ErrorPanel.prototype["onsrclink"] = function (param) {
    var data = param.text.split(":");
    if (data[1] === "")
        return;
    router.navigate("#do=jassijs_editor.CodeEditor&file=" + data[0] + "&line=" + data[1]);
    // jassijs_editor.CodeEditor.open(param.text);
}
jassijs.ErrorPanel = ErrorPanel;
