
import { Panel } from "jassi/ui/Panel";
import { Errors } from "jassi/base/Errors";
import jassi, { $Class } from "remote/jassi/base/Jassi";
import { Button } from "jassi/ui/Button";
import { TSSourceMap } from "jassi/util/TSSourceMap";
import { classes } from "remote/jassi/base/Classes";
import { router } from "jassi/base/Router";

@$Class("jassi.ui.ErrorPanel")
export class ErrorPanel extends Panel {
    IDClear: Button;
    _container;
    IDToolbar: Panel;
    IDSearch: Button;
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
        this.IDClear = new Button();
        this.IDClear.tooltip = "Clear log";
        this.IDClear.icon = "mdi mdi-delete";
        this.IDClear.onclick(function() {
            _this.clear();
            jassi.errors.items = [];
        });
        this.IDClear.width = 35;
        this.IDSearch = new Button();
        this.IDSearch.tooltip = "search errors";
        this.IDSearch.icon = "mdi mdi-file-search-outline";
        this.IDSearch.onclick(function() {
            _this.search();

        });
        this.IDToolbar = new Panel();
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
        for (var x = 0;x < jassi.errors.items.length;x++) {
            this.addError(jassi.errors.items[x]);
        }
        if (window["jassi_debug"] === undefined)
            window["jassi_debug"] = { variables: [] };

    }
    /**
     * search Errors in code
     **/
    async search() {
        var typescript = (await import("jassi/util/Typescript")).default;
        await typescript.initService();
        var all = typescript.getDiagnosticsForAll();
        for (var x = 0;x < all.length;x++) {
            var diag = all[x];
            var s = diag.file.fileName;
            var pos = typescript.getLineAndCharacterOfPosition(diag.file.fileName, diag.start);
            var href = window.location.origin;
            var err = {
                errorMsg: diag.messageText,
                errorObj: {
                    stack: href + "/" + diag.file.fileName + ":" + pos.line + ":" + pos.character
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
            var sstack="";
            if(error.error){
                sstack = error.error.message.replaceAll(":", "") + "(" + error.filename + ":" + error.lineno+  ":" + error.colno + ")\n";
                if (error.error.stack !== undefined)
                    sstack = sstack+error.error.stack;
            }
            if(error.reason!==undefined){
                sstack = error.reason.message+":::\n";
                if (error.reason.stack !== undefined)
                    sstack = sstack+error.reason.stack;
            }
            var stack = sstack.split('\n');
            msg = "";
            for (var i = 0;i < stack.length;i++) {
                var line = stack[i];
                if (line.split(":").length < 4)
                    continue;//edge and chrome insert message in stack->ignore
                var poshttp = line.indexOf("http");
                var url: string = await this._convertURL(line.substring(poshttp, line.length));
                line = line.replace("\n", "");
                var ident=(i===0?"0":"20");
                msg = msg + '<div style="text-indent:'+ident+'px;">' + line.substring(0, poshttp) +
                    '<a href="#" onclick="jassi.ErrorPanel.prototype.onsrclink(this);">' +
                    url + '</a>' + (line.endsWith(")") ? ")" : "") + '</div>';
            }

        }
        var value = $('<span>' + msg + '</span>');
        $(this._container).prepend(value);
        //  this.dom.appendChild(value);
    }
    async _convertURL(url: string) {
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
            var newline = await new TSSourceMap().getLineFromJS(aurl[0], Number(aurl[1]), Number(aurl[2]));
            url = aurl[0].substring(3).replace(".js", ".ts") + ":" + newline + ":" + aurl[2];
            if(url.startsWith("tmp/"))
                url=url.substring(4);
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
        jassi.errors.onerror(function(err) {
            _this.addError(err);

        }, this._id);
    }
    unregisterError() {
        jassi.errors.offerror(this._id);
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
export function test() {
    var ret = new ErrorPanel();
    return ret;
};



ErrorPanel.prototype["onsrclink"] = function(param) {
    var data = param.text.split(":");
    if(data[1]==="")
        return;
    router.navigate("#do=jassi.ui.CodeEditor&file=" + data[0] + "&line=" + data[1]);
    // jassi.ui.CodeEditor.open(param.text);
}
jassi.ErrorPanel = ErrorPanel;
