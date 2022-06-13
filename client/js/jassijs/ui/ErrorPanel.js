var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/base/Errors", "jassijs/remote/Jassi", "jassijs/ui/Button", "jassijs/base/Router", "jassijs/base/Actions"], function (require, exports, Panel_1, Errors_1, Jassi_1, Button_1, Router_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.ErrorPanel = void 0;
    let ErrorPanel = class ErrorPanel extends Panel_1.Panel {
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
            Router_1.router.navigate("#do=jassijs.ui.ErrorPanel");
        }
        layout() {
            var _this = this;
            if (this.withControls) {
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
            }
            var value = $('<div><font  size="2"><div class="errorpanel"></div></font></div>')[0];
            this.dom.appendChild(value);
            this._container = $(this.dom).find(".errorpanel")[0];
            if (this.withNewErrors)
                this.registerError();
            if (this.withLastErrors) {
                //old Errors
                for (var x = 0; x < Jassi_1.default.errors.items.length; x++) {
                    this.addError(Jassi_1.default.errors.items[x]);
                }
            }
            if (window["jassijs_debug"] === undefined)
                window["jassijs_debug"] = { variables: [] };
        }
        /**
         * search Errors in code
         **/
        async search() {
            var typescript = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); })).default;
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
            var value = $('<span>' + msg + '</span>');
            $(this._container).prepend(value);
            //  this.dom.appendChild(value);
        }
        async _convertURL(url) {
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
                for (var mod in Jassi_1.default.modules) {
                    if (Jassi_1.default.modules[mod] === u)
                        ismodul = true;
                }
                if (u.indexOf("/js/") > -1 || ismodul) {
                    try {
                        var TSSourceMap = (await new Promise((resolve_2, reject_2) => { require(["jassijs_editor/util/TSSourceMap"], resolve_2, reject_2); })).TSSourceMap;
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
    __decorate([
        (0, Actions_1.$Action)({
            name: "Administration/Errors",
            icon: "mdi mdi-emoticon-confused-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], ErrorPanel, "showDialog", null);
    ErrorPanel = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Jassi_1.$Class)("jassijs.ui.ErrorPanel"),
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
        Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + data[0] + "&line=" + data[1]);
        // jassijs_editor.CodeEditor.open(param.text);
    };
    Jassi_1.default.ErrorPanel = ErrorPanel;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRXJyb3JQYW5lbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvRXJyb3JQYW5lbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBV0EsSUFBYSxVQUFVLEdBQXZCLE1BQWEsVUFBVyxTQUFRLGFBQUs7UUFRakM7OztPQUdEO1FBQ0MsWUFBWSxZQUFZLEdBQUcsSUFBSSxFQUFFLGNBQWMsR0FBRyxJQUFJLEVBQUUsYUFBYSxHQUFHLElBQUk7WUFDeEUsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztZQUNqQyxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztZQUNyQyxJQUFJLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztZQUNuQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsQ0FBQztRQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUNuQixlQUFNLENBQUMsUUFBUSxDQUFDLDJCQUEyQixDQUFDLENBQUM7UUFDakQsQ0FBQztRQUNELE1BQU07WUFDRixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO2dCQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksZUFBTSxFQUFFLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLFdBQVcsQ0FBQztnQkFDbkMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEdBQUcsZ0JBQWdCLENBQUM7Z0JBQ3JDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO29CQUNqQixLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2QsZUFBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO2dCQUM5QixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxF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O1lBQ1gsZUFBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLENBQUM7UUFDRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1lBQ3ZCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNoQixpQkFBaUI7UUFDckIsQ0FBQztLQVFKLENBQUE7SUF2Tkc7UUFKQyxJQUFBLGlCQUFPLEVBQUM7WUFDTCxJQUFJLEVBQUUsdUJBQXVCO1lBQzdCLElBQUksRUFBRSxtQ0FBbUM7U0FDNUMsQ0FBQzs7OztzQ0FHRDtJQXpCUSxVQUFVO1FBRnRCLElBQUEseUJBQWUsRUFBQyx5QkFBeUIsQ0FBQztRQUMxQyxJQUFBLGNBQU0sRUFBQyx1QkFBdUIsQ0FBQzs7T0FDbkIsVUFBVSxDQThPdEI7SUE5T1ksZ0NBQVU7SUErT3ZCLFNBQWdCLEtBQUs7UUFDakIsSUFBSSxHQUFHLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUMzQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFIRCxzQkFHQztJQUFBLENBQUM7SUFJRixVQUFVLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLFVBQVUsS0FBSztRQUMvQyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNqQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQ2QsT0FBTztRQUNYLGVBQU0sQ0FBQyxRQUFRLENBQUMscUNBQXFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0Riw4Q0FBOEM7SUFDbEQsQ0FBQyxDQUFBO0lBQ0QsZUFBTyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBFcnJvcnMgfSBmcm9tIFwiamFzc2lqcy9iYXNlL0Vycm9yc1wiO1xyXG5pbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcblxyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgcm91dGVyIH0gZnJvbSBcImphc3NpanMvYmFzZS9Sb3V0ZXJcIjtcclxuaW1wb3J0IHsgJEFjdGlvbiwgJEFjdGlvblByb3ZpZGVyIH0gZnJvbSBcImphc3NpanMvYmFzZS9BY3Rpb25zXCI7XHJcbkAkQWN0aW9uUHJvdmlkZXIoXCJqYXNzaWpzLmJhc2UuQWN0aW9uTm9kZVwiKVxyXG5AJENsYXNzKFwiamFzc2lqcy51aS5FcnJvclBhbmVsXCIpXHJcbmV4cG9ydCBjbGFzcyBFcnJvclBhbmVsIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgSURDbGVhcjogQnV0dG9uO1xyXG4gICAgX2NvbnRhaW5lcjtcclxuICAgIElEVG9vbGJhcjogUGFuZWw7XHJcbiAgICBJRFNlYXJjaDogQnV0dG9uO1xyXG4gICAgd2l0aENvbnRyb2xzOiBib29sZWFuO1xyXG4gICAgd2l0aExhc3RFcnJvcnM6IGJvb2xlYW47XHJcbiAgICB3aXRoTmV3RXJyb3JzOiBib29sZWFuO1xyXG4gICAgLyoqXHJcbiAqIHNob3dzIGVycm9ycyBcclxuICogQGNsYXNzIGphc3NpanMudWkuRXJyb3JQYW5lbFxyXG4gKi9cclxuICAgIGNvbnN0cnVjdG9yKHdpdGhDb250cm9scyA9IHRydWUsIHdpdGhMYXN0RXJyb3JzID0gdHJ1ZSwgd2l0aE5ld0Vycm9ycyA9IHRydWUpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMud2l0aENvbnRyb2xzID0gd2l0aENvbnRyb2xzO1xyXG4gICAgICAgIHRoaXMud2l0aExhc3RFcnJvcnMgPSB3aXRoTGFzdEVycm9ycztcclxuICAgICAgICB0aGlzLndpdGhOZXdFcnJvcnMgPSB3aXRoTmV3RXJyb3JzO1xyXG4gICAgICAgIHRoaXMubGF5b3V0KCk7XHJcbiAgICB9XHJcbiAgICBAJEFjdGlvbih7XHJcbiAgICAgICAgbmFtZTogXCJBZG1pbmlzdHJhdGlvbi9FcnJvcnNcIixcclxuICAgICAgICBpY29uOiBcIm1kaSBtZGktZW1vdGljb24tY29uZnVzZWQtb3V0bGluZVwiLFxyXG4gICAgfSlcclxuICAgIHN0YXRpYyBhc3luYyBzaG93RGlhbG9nKCkge1xyXG4gICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcIiNkbz1qYXNzaWpzLnVpLkVycm9yUGFuZWxcIik7XHJcbiAgICB9XHJcbiAgICBsYXlvdXQoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy53aXRoQ29udHJvbHMpIHtcclxuICAgICAgICAgICAgdGhpcy5JRENsZWFyID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB0aGlzLklEQ2xlYXIudG9vbHRpcCA9IFwiQ2xlYXIgbG9nXCI7XHJcbiAgICAgICAgICAgIHRoaXMuSURDbGVhci5pY29uID0gXCJtZGkgbWRpLWRlbGV0ZVwiO1xyXG4gICAgICAgICAgICB0aGlzLklEQ2xlYXIub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5jbGVhcigpO1xyXG4gICAgICAgICAgICAgICAgamFzc2lqcy5lcnJvcnMuaXRlbXMgPSBbXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuSURDbGVhci53aWR0aCA9IDM1O1xyXG4gICAgICAgICAgICB0aGlzLklEU2VhcmNoID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB0aGlzLklEU2VhcmNoLnRvb2x0aXAgPSBcInNlYXJjaCBlcnJvcnNcIjtcclxuICAgICAgICAgICAgdGhpcy5JRFNlYXJjaC5pY29uID0gXCJtZGkgbWRpLWZpbGUtc2VhcmNoLW91dGxpbmVcIjtcclxuICAgICAgICAgICAgdGhpcy5JRFNlYXJjaC5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNlYXJjaCgpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuSURUb29sYmFyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuSURUb29sYmFyLndpZHRoID0gXCI5OSVcIjtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuSURUb29sYmFyLmFkZCh0aGlzLklEQ2xlYXIpO1xyXG4gICAgICAgICAgICB0aGlzLklEVG9vbGJhci5hZGQodGhpcy5JRFNlYXJjaCk7XHJcbiAgICAgICAgICAgIHRoaXMuSURUb29sYmFyLmhlaWdodCA9IDIwO1xyXG4gICAgICAgICAgICBzdXBlci5hZGQodGhpcy5JRFRvb2xiYXIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFsdWUgPSAkKCc8ZGl2Pjxmb250ICBzaXplPVwiMlwiPjxkaXYgY2xhc3M9XCJlcnJvcnBhbmVsXCI+PC9kaXY+PC9mb250PjwvZGl2PicpWzBdO1xyXG4gICAgICAgIHRoaXMuZG9tLmFwcGVuZENoaWxkKHZhbHVlKTtcclxuICAgICAgICB0aGlzLl9jb250YWluZXIgPSAkKHRoaXMuZG9tKS5maW5kKFwiLmVycm9ycGFuZWxcIilbMF07XHJcbiAgICAgICAgaWYgKHRoaXMud2l0aE5ld0Vycm9ycylcclxuICAgICAgICAgICAgdGhpcy5yZWdpc3RlckVycm9yKCk7XHJcbiAgICAgICAgaWYgKHRoaXMud2l0aExhc3RFcnJvcnMpIHtcclxuICAgICAgICAgICAgLy9vbGQgRXJyb3JzXHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgamFzc2lqcy5lcnJvcnMuaXRlbXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRXJyb3IoamFzc2lqcy5lcnJvcnMuaXRlbXNbeF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh3aW5kb3dbXCJqYXNzaWpzX2RlYnVnXCJdID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHdpbmRvd1tcImphc3NpanNfZGVidWdcIl0gPSB7IHZhcmlhYmxlczogW10gfTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHNlYXJjaCBFcnJvcnMgaW4gY29kZVxyXG4gICAgICoqL1xyXG4gICAgYXN5bmMgc2VhcmNoKCkge1xyXG4gICAgICAgIHZhciB0eXBlc2NyaXB0ID0gKGF3YWl0IGltcG9ydChcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiKSkuZGVmYXVsdDtcclxuICAgICAgICBhd2FpdCB0eXBlc2NyaXB0LmluaXRTZXJ2aWNlKCk7XHJcbiAgICAgICAgdmFyIGFsbCA9IGF3YWl0IHR5cGVzY3JpcHQuZ2V0RGlhZ25vc3RpY3NGb3JBbGwoKTtcclxuICAgICAgICBpZiAoYWxsLmxlbmd0aCA9PT0gMClcclxuICAgICAgICAgICAgJC5ub3RpZnkoXCJubyBFcnJvcnMgZm91bmRcIiwgXCJpbmZvXCIsIHsgcG9zaXRpb246IFwicmlnaHRcIiB9KTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFsbC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgZGlhZyA9IGFsbFt4XTtcclxuICAgICAgICAgICAgdmFyIHMgPSBkaWFnLmZpbGUuZmlsZU5hbWU7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSB0eXBlc2NyaXB0LmdldExpbmVBbmRDaGFyYWN0ZXJPZlBvc2l0aW9uKGRpYWcuZmlsZS5maWxlTmFtZSwgZGlhZy5zdGFydCk7XHJcbiAgICAgICAgICAgIHZhciBocmVmID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbjtcclxuICAgICAgICAgICAgdmFyIGVyciA9IHtcclxuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBkaWFnLmZpbGUuZmlsZU5hbWUsXHJcbiAgICAgICAgICAgICAgICBsaW5lbm86IHBvcy5saW5lLFxyXG4gICAgICAgICAgICAgICAgY29sbm86IHBvcy5jaGFyYWN0ZXIsXHJcbiAgICAgICAgICAgICAgICBlcnJvcjoge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBtZXNzYWdlOiBkaWFnLm1lc3NhZ2VUZXh0LFxyXG4gICAgICAgICAgICAgICAgICAgIHN0YWNrOiBcIlwiLy9ocmVmICsgXCIvXCIgKyBkaWFnLmZpbGUuZmlsZU5hbWUgKyBcIjpcIiArIHBvcy5saW5lICsgXCI6XCIgKyBwb3MuY2hhcmFjdGVyXHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRXJyb3JzLmVycm9ycy5hZGRFcnJvcihlcnIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGFkZHMgYSBuZXcgZXJyb3JcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvciAtIHRoZSBlcnJvclxyXG4gICAgICovXHJcbiAgICBhc3luYyBhZGRFcnJvcihlcnJvcikge1xyXG4gICAgICAgIHZhciBtc2cgPSBcIlwiO1xyXG4gICAgICAgIGlmIChlcnJvci5pbmZvTXNnICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgbXNnID0gZXJyb3IuaW5mb01zZyArIFwiPGJyPlwiO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBzc3RhY2sgPSBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgbSA9IGVycm9yLmVycm9yPy5tZXNzYWdlO1xyXG4gICAgICAgICAgICBpZiAoIW0pXHJcbiAgICAgICAgICAgICAgICBtID0gXCJcIjtcclxuICAgICAgICAgICAgaWYgKG0ubWVzc2FnZVRleHQpXHJcbiAgICAgICAgICAgICAgICBtID0gbS5tZXNzYWdlVGV4dDtcclxuICAgICAgICAgICAgaWYgKGVycm9yLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBzc3RhY2sgPSBtLnJlcGxhY2VBbGwoXCI6XCIsIFwiXCIpICsgXCIoXCIgKyBlcnJvci5maWxlbmFtZSArIFwiOlwiICsgZXJyb3IubGluZW5vICsgXCI6XCIgKyBlcnJvci5jb2xubyArIFwiKVxcblwiO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yLmVycm9yLnN0YWNrICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgc3N0YWNrID0gc3N0YWNrICsgZXJyb3IuZXJyb3Iuc3RhY2s7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yLnJlYXNvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICBzc3RhY2sgPSBlcnJvci5yZWFzb24ubWVzc2FnZSArIFwiOjo6XFxuXCI7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IucmVhc29uLnN0YWNrICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgc3N0YWNrID0gc3N0YWNrICsgZXJyb3IucmVhc29uLnN0YWNrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzdGFjayA9IHNzdGFjay5zcGxpdCgnXFxuJyk7XHJcbiAgICAgICAgICAgIG1zZyA9IFwiXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3RhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBsaW5lID0gc3RhY2tbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAobGluZS5pbmRleE9mKFwiLnRzOlwiKSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cgKyAnPGRpdj4nICsgbGluZS5zdWJzdHJpbmcoMCwgbGluZS5sYXN0SW5kZXhPZihcIihcIikpICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgb25jbGljaz1cImphc3NpanMuRXJyb3JQYW5lbC5wcm90b3R5cGUub25zcmNsaW5rKHRoaXMpO1wiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lLnN1YnN0cihsaW5lLmxhc3RJbmRleE9mKFwiKFwiKSArIDEsIGxpbmUubGVuZ3RoIC0gMSkgKyAnPC9hPiknICsgXCJcIiArICc8L2Rpdj4nO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpbmUuc3BsaXQoXCI6XCIpLmxlbmd0aCA8IDQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlOy8vZWRnZSBhbmQgY2hyb21lIGluc2VydCBtZXNzYWdlIGluIHN0YWNrLT5pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaHR0cCA9IGxpbmUuaW5kZXhPZihcImh0dHBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVybDogc3RyaW5nID0gYXdhaXQgdGhpcy5fY29udmVydFVSTChsaW5lLnN1YnN0cmluZyhwb3NodHRwLCBsaW5lLmxlbmd0aCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmUgPSBsaW5lLnJlcGxhY2UoXCJcXG5cIiwgXCJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlkZW50ID0gKGkgPT09IDAgPyBcIjBcIiA6IFwiMjBcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gbXNnICsgJzxkaXYgc3R5bGU9XCJ0ZXh0LWluZGVudDonICsgaWRlbnQgKyAncHg7XCI+JyArIGxpbmUuc3Vic3RyaW5nKDAsIHBvc2h0dHApICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxhIGhyZWY9XCIjXCIgb25jbGljaz1cImphc3NpanMuRXJyb3JQYW5lbC5wcm90b3R5cGUub25zcmNsaW5rKHRoaXMpO1wiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmwgKyAnPC9hPicgKyAobGluZS5lbmRzV2l0aChcIilcIikgPyBcIilcIiA6IFwiXCIpICsgJzwvZGl2Pic7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgdmFsdWUgPSAkKCc8c3Bhbj4nICsgbXNnICsgJzwvc3Bhbj4nKTtcclxuICAgICAgICAkKHRoaXMuX2NvbnRhaW5lcikucHJlcGVuZCh2YWx1ZSk7XHJcbiAgICAgICAgLy8gIHRoaXMuZG9tLmFwcGVuZENoaWxkKHZhbHVlKTtcclxuICAgIH1cclxuICAgIGFzeW5jIF9jb252ZXJ0VVJMKHVybDogc3RyaW5nKSB7XHJcbiAgICAgICAgLy9lbGltaW5hdGUgP1xyXG4gICAgICAgIC8qdmFyIGxwb3MgPSB1cmwuaW5kZXhPZihcIj9cIik7XHJcbiAgICAgICAgaWYgKGxwb3MgPiAwKVxyXG4gICAgICAgICAgICB1cmwgPSB1cmwuc3Vic3RyaW5nKDAsIGxwb3MpICsgdXJsLnN1YnN0cmluZyh1cmwuaW5kZXhPZihcIjpcIiwgbHBvcykpO1xyXG4gICAgICAgIHZhciBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XHJcblxyXG4gICAgICAgIGhyZWYgPSBocmVmLnN1YnN0cmluZygwLCB3aW5kb3cubG9jYXRpb24uaHJlZi5sYXN0SW5kZXhPZihcIi9cIikpO1xyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKFwiJHRlbXBcIiwgXCJcIik7XHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoaHJlZiArIFwiL1wiLCBcIlwiKTtcclxuICAgICAgICBcclxuICAgICAgICAvL3ZhciB3dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIvYXBwLmh0bWxcIilbMF07XHJcbiAgICAgICAgLy91cmwgPSB1cmwucmVwbGFjZSh3dXJsLCBcIlwiKTsqL1xyXG4gICAgICAgIHZhciB3dXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIvYXBwLmh0bWxcIilbMF07XHJcbiAgICAgICAgaWYgKHVybC5lbmRzV2l0aChcIilcIikpXHJcbiAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIDEpO1xyXG4gICAgICAgIHZhciB3dXJsID0gdXJsLnN1YnN0cmluZygwLCB1cmwuaW5kZXhPZihcIiNcIikpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGF1cmwgPSB1cmwuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgIGlmIChhdXJsLmxlbmd0aCA+PSAzKSB7XHJcbiAgICAgICAgICAgIHZhciBsaW5lID0gYXVybFthdXJsLmxlbmd0aCAtIDJdO1xyXG4gICAgICAgICAgICB2YXIgY29sID0gYXVybFthdXJsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICB2YXIgdSA9IHVybC5zdWJzdHJpbmcoMCwgdXJsLmxlbmd0aCAtIDIgLSBsaW5lLmxlbmd0aCAtIGNvbC5sZW5ndGgpO1xyXG4gICAgICAgICAgICBpZiAobGluZSA9PT0gXCJcIiB8fCBjb2wgPT09IFwiXCIgfHwgdSA9PT0gXCJcIilcclxuICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgICAgIHZhciBpc21vZHVsID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIG1vZCBpbiBqYXNzaWpzLm1vZHVsZXMpIHtcclxuICAgICAgICAgICAgICAgIGlmIChqYXNzaWpzLm1vZHVsZXNbbW9kXSA9PT0gdSlcclxuICAgICAgICAgICAgICAgICAgICBpc21vZHVsID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodS5pbmRleE9mKFwiL2pzL1wiKSA+IC0xIHx8IGlzbW9kdWwpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFRTU291cmNlTWFwID0gKGF3YWl0IGltcG9ydChcImphc3NpanNfZWRpdG9yL3V0aWwvVFNTb3VyY2VNYXBcIikpLlRTU291cmNlTWFwO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hcD1uZXcgVFNTb3VyY2VNYXAoKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gYXdhaXQgbWFwLmdldExpbmVGcm9tSlModSwgTnVtYmVyKGxpbmUpLCBOdW1iZXIoY29sKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBvcykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcG9zLnNvdXJjZS5yZXBsYWNlKFwiLi4vY2xpZW50L1wiLCBcIlwiKS5yZXBsYWNlQWxsKFwiLi4vXCIsIFwiXCIpLnJlcGxhY2UoXCIkdGVtcFwiLCBcIlwiKSArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIjpcIiArIHBvcy5saW5lICsgXCI6XCIgKyBwb3MuY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1cmw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qIGlmICghdXJsLnN0YXJ0c1dpdGgoXCIvXCIpKVxyXG4gICAgICAgICAgICAgdXJsID0gXCIvXCIgKyB1cmw7XHJcbiAgICAgICAgIGlmICh1cmwuc3RhcnRzV2l0aChcIi9qc1wiKSAmJiB1cmwuaW5kZXhPZihcIi5qc1wiKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICB2YXIgYXVybCA9IHVybC5zdWJzdHJpbmcoMSkuc3BsaXQoXCI6XCIpO1xyXG4gICAgICAgICAgICAgdmFyIG5ld2xpbmUgPSBhd2FpdCBuZXcgVFNTb3VyY2VNYXAoKS5nZXRMaW5lRnJvbUpTKGF1cmxbMF0sIE51bWJlcihhdXJsWzFdKSwgTnVtYmVyKGF1cmxbMl0pKTtcclxuICAgICAgICAgICAgIHVybCA9IGF1cmxbMF0uc3Vic3RyaW5nKDMpLnJlcGxhY2UoXCIuanNcIiwgXCIudHNcIikgKyBcIjpcIiArIG5ld2xpbmUgKyBcIjpcIiArIGF1cmxbMl07XHJcbiAgICAgICAgICAgICBpZiAodXJsLnN0YXJ0c1dpdGgoXCJ0bXAvXCIpKVxyXG4gICAgICAgICAgICAgICAgIHVybCA9IHVybC5zdWJzdHJpbmcoNCk7XHJcbiAgICAgICAgIH0qL1xyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGRlbGV0ZXMgYWxsIGVycm9yc1xyXG4gICAgICovXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5fY29udGFpbmVyLmZpcnN0Q2hpbGQpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuX2NvbnRhaW5lci5maXJzdENoaWxkKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZWdpc3RlckVycm9yKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgamFzc2lqcy5lcnJvcnMub25lcnJvcihmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmFkZEVycm9yKGVycik7XHJcblxyXG4gICAgICAgIH0sIHRoaXMuX2lkKTtcclxuICAgIH1cclxuICAgIHVucmVnaXN0ZXJFcnJvcigpIHtcclxuICAgICAgICBqYXNzaWpzLmVycm9ycy5vZmZlcnJvcih0aGlzLl9pZCk7XHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMudW5yZWdpc3RlckVycm9yKCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIC8vdGhpcy5fY29udGFpbmVyXHJcbiAgICB9XHJcblxyXG4gICAgLyogIHNldCB2YWx1ZSh2YWx1ZSl7IC8vdGhlIENvZGVcclxuICAgICAgICAgIC8vdGhpcy50YWJsZS52YWx1ZT12YWx1ZTtcclxuICAgICAgfVxyXG4gICAgICBnZXQgdmFsdWUoKXtcclxuICAgICAgICAgIC8vcmV0dXJuIHRoaXMudGFibGUudmFsdWU7XHJcbiAgICAgIH0qL1xyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0MigpIHtcclxuICAgIHZhciByZXQgPSBuZXcgRXJyb3JQYW5lbCgpO1xyXG4gICAgcmV0dXJuIHJldDtcclxufTtcclxuXHJcblxyXG5cclxuRXJyb3JQYW5lbC5wcm90b3R5cGVbXCJvbnNyY2xpbmtcIl0gPSBmdW5jdGlvbiAocGFyYW0pIHtcclxuICAgIHZhciBkYXRhID0gcGFyYW0udGV4dC5zcGxpdChcIjpcIik7XHJcbiAgICBpZiAoZGF0YVsxXSA9PT0gXCJcIilcclxuICAgICAgICByZXR1cm47XHJcbiAgICByb3V0ZXIubmF2aWdhdGUoXCIjZG89amFzc2lqc19lZGl0b3IuQ29kZUVkaXRvciZmaWxlPVwiICsgZGF0YVswXSArIFwiJmxpbmU9XCIgKyBkYXRhWzFdKTtcclxuICAgIC8vIGphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3Iub3BlbihwYXJhbS50ZXh0KTtcclxufVxyXG5qYXNzaWpzLkVycm9yUGFuZWwgPSBFcnJvclBhbmVsO1xyXG4iXX0=