var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Debugger = void 0;
    //https://developer.chrome.com/extensions/messaging
    let Debugger = class Debugger {
        /**
         * routing of url
         * @class jassi.base.Debugger
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
                (new Promise((resolve_1, reject_1) => { require(["jassi_editor/ChromeDebugger"], resolve_1, reject_1); })).then((deb) => {
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
        * @param {jassi_editor.CodeEditor} codeEditor
        */
        addDebugpoints(lines, debugpoints, codeEditor) {
            Jassi_1.default.d[codeEditor._id] = undefined;
            //        	jassi.ui.VariablePanel.get(this._id).__db=undefined;
            var hassome = undefined;
            this.debugpoints = debugpoints;
            for (var point in debugpoints) {
                if (debugpoints[point] === true) {
                    //lines[point]="if(jassi.ui.VariablePanel.get("+this._id+").__db===undefined){ jassi.ui.VariablePanel.get("+this._id+").__db=true;debugger;}"+lines[point];
                    lines[point] = "if(jassi.d(" + codeEditor._id + ")) debugger;" + lines[point];
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
         * @param {jassi_editor.CodeEditor} codeEditor
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
        Jassi_1.$Class("jassi_editor.Debugger"),
        __metadata("design:paramtypes", [])
    ], Debugger);
    exports.Debugger = Debugger;
    if (Jassi_1.default.debugger === undefined)
        Jassi_1.default.debugger = new Debugger();
    require(["jassi_editor/ChromeDebugger"]);
});
//# sourceMappingURL=Debugger.js.map