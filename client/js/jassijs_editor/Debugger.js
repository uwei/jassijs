var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry"], function (require, exports, Registry_1) {
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
                (new Promise((resolve_1, reject_1) => { require(["jassijs_editor/ChromeDebugger"], resolve_1, reject_1); }).then(__importStar)).then((deb) => {
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
            var editor = document.getElementById(id)._this;
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
            jassijs.d[codeEditor._id] = undefined;
            //        	jassijs.ui.VariablePanel.get(this._id).__db=undefined;
            var hassome = undefined;
            this.debugpoints = debugpoints;
            for (var point in debugpoints) {
                if (debugpoints[point] === true) {
                    //lines[point]="if(jassijs.ui.VariablePanel.get("+this._id+").__db===undefined){ jassijs.ui.VariablePanel.get("+this._id+").__db=true;debugger;}"+lines[point];
                    lines[point] = "if(jassijs.d(" + codeEditor._id + ")) debugger;" + lines[point];
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
            var svars = "{var debug_editor=document.getElementById(" + codeEditor._id + ")._this;var _variables_={} ;try{if(this!==jassi)_variables_['this']=this;}catch(ex){};";
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
        (0, Registry_1.$Class)("jassijs_editor.Debugger"),
        __metadata("design:paramtypes", [])
    ], Debugger);
    exports.Debugger = Debugger;
    if (jassijs.debugger === undefined)
        jassijs.debugger = new Debugger();
    //@ts-ignore
    require(["jassijs_editor/ChromeDebugger"]);
});
//# sourceMappingURL=Debugger.js.map