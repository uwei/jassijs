var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs_editor/CodePanel", "jassijs/ui/VariablePanel", "jassijs/ui/DockingContainer", "jassijs/ui/ErrorPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Classes", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_editor/AcePanel", "jassijs_editor/util/Typescript", "jassijs_editor/MonacoPanel", "jassijs/remote/Settings", "jassijs/remote/Test"], function (require, exports, Jassi_1, Panel_1, CodePanel_1, VariablePanel_1, DockingContainer_1, ErrorPanel_1, Button_1, Registry_1, Server_1, Reloader_1, Classes_1, Component_1, Property_1, AcePanel_1, Typescript_1, MonacoPanel_1, Settings_1, Test_1) {
    "use strict";
    var CodeEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CodeEditor = void 0;
    let CodeEditorSettingsDescriptor = class CodeEditorSettingsDescriptor {
    };
    __decorate([
        Property_1.$Property({ chooseFrom: ["ace", "monaco", "aceOnBrowser"], default: "aceOnBrowser", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_DefaultEditor", void 0);
    __decorate([
        Property_1.$Property({ chooseFrom: ["vs-dark", "vs-light", "hc-black"], default: "vs-light", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_MoanacoEditorTheme", void 0);
    CodeEditorSettingsDescriptor = __decorate([
        Settings_1.$SettingsDescriptor(),
        Jassi_1.$Class("jassijs_editor.CodeEditorSettingsDescriptor")
    ], CodeEditorSettingsDescriptor);
    /**
     * Panel for editing sources
     * @class jassijs_editor.CodeEditor
     */
    let CodeEditor = CodeEditor_1 = class CodeEditor extends Panel_1.Panel {
        constructor(properties = undefined) {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_1.Panel();
            this._codeToolbar = new Panel_1.Panel();
            //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            let mobil = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
            let sett = Settings_1.Settings.gets(Settings_1.Settings.keys.Development_DefaultEditor);
            if (properties === null || properties === void 0 ? void 0 : properties.codePanel) {
                this._codePanel = properties.codePanel;
            }
            else {
                CodePanel_1.CodePanel.typescript = Typescript_1.default;
                if (sett === "ace" || (mobil && (sett === "aceOnBrowser" || sett === undefined))) {
                    this._codePanel = new AcePanel_1.AcePanel();
                }
                else {
                    this._codePanel = new MonacoPanel_1.MonacoPanel();
                    // this._codePanel = new AcePanel(); 
                }
            }
            this._errors = new ErrorPanel_1.ErrorPanel();
            this._file = "";
            this.variables = new VariablePanel_1.VariablePanel();
            this._design = new Panel_1.Panel();
            this._init(properties === null || properties === void 0 ? void 0 : properties.hideToolbar);
            this.editMode = true;
        }
        _initCodePanel() {
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            this._codePanel.height = "calc(100% - 31px)";
            let _this = this;
            this._codePanel.onBreakpointChanged(function (line, column, enable, type) {
                Jassi_1.default.debugger.breakpointChanged(_this._file, line, column, enable, type);
            });
        }
        _init(hideToolbar) {
            var _this = this;
            this._initCodePanel();
            this._codeView["horizontal"] = true;
            if (hideToolbar !== true) {
                this._codeView.add(this._codeToolbar);
                this._codeToolbar["horizontal"] = true;
                this._codeToolbar.height = "30";
                var save = new Button_1.Button();
                save.tooltip = "Save(Ctrl+S)";
                save.icon = "mdi mdi-content-save mdi-18px";
                save.onclick(function () {
                    _this.save();
                });
                this._codeToolbar.add(save);
                var run = new Button_1.Button();
                run.icon = "mdi mdi-car-hatchback mdi-18px";
                run.tooltip = "Run(F4)";
                run.onclick(function () {
                    _this.evalCode();
                });
                this._codeToolbar.add(run);
                var undo = new Button_1.Button();
                undo.icon = "mdi mdi-undo mdi-18px";
                undo.tooltip = "Undo (Strg+Z)";
                undo.onclick(function () {
                    _this._codePanel.undo();
                });
                this._codeToolbar.add(undo);
                var goto = new Button_1.Button();
                goto.icon = "mdi mdi-ray-start-arrow mdi-18px";
                goto.tooltip = "Goto";
                goto.onclick(function () {
                    _this.gotoDeclaration();
                });
                Jassi_1.default["$CodeEditor"] = CodeEditor_1;
                $(goto.dom).attr("ondrop", "event.preventDefault();jassijs.$CodeEditor.search(event.dataTransfer.getData('text'));");
                $(goto.dom).attr("ondragover", "event.preventDefault();");
                this._codeToolbar.add(goto);
            }
            this._codeView.add(this._codePanel);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
            };
            /*var test = new Button();
            test.icon = "mdi mdi-bug mdi-18px";
            test.tooltip = "Test";
            test.onclick(function () {
                var kk = _this._main.layout;
            });
            this._codeToolbar.add(test);*/
            super.add(this._main);
            this._installView();
            this.registerKeys();
            this.variables.createTable();
            //   this._codePanel.setCompleter(this);
            setTimeout(() => {
                //_this.editorProvider="ace";
            }, 100);
        }
        _installView() {
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this.variables, "Variables", "variables");
            this._main.add(this._design, "Design", "design");
            this._main.add(this._errors, "Errors", "errors");
            this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        /*set editorProvider(value: "ace" | "monaco") {
            if (value !== this.editorProvider) {
                //switch to new provider
                let pos = this.cursorPosition;
                let val = this.value;
                let old = this._codePanel;
                
                if (value === "ace") {
                    this._codePanel = new AcePanel();
                } else {
                    this._codePanel = new MonacoPanel();
                }
                this._initCodePanel();
                this._codeView.remove(old);
                this._codeView.add(this._codePanel);
                this.value=val;
                this.cursorPosition=pos;
                old.destroy();
            }
            
        }*/
        async _save(code) {
            await new Server_1.Server().saveFile(this._file, code);
            var f = this._file.replace(".ts", "");
            if (code.indexOf("@$") > -1) {
                await Registry_1.default.reload();
            }
            Reloader_1.Reloader.instance.reloadJS(f);
        }
        /**
        * save the code to server
        */
        save() {
            var code = this._codePanel.value;
            var _this = this;
            this._save(code);
        }
        /**
         * goto to the declariation on cursor
         */
        async gotoDeclaration() {
            this._codePanel.gotoDeclaration();
        }
        /**
         * search text in classes at the given text
         * @param {string} text - the text to search
         * @returns {jassijs_editor.CodeEditor} - the editor instance
         */
        static async search(text) {
            //TODO ask typescript service
            /* var found = undefined;
             text = text.replaceAll("\r\n", "\n");
             var content = undefined;
             //Fast search
             for (var file in classes.getCache()) {
                 var fname = file.replaceAll(".", "/");
                 var cl = classes.getCache()[file];
                 var code = cl.toString().replaceAll("\r\n", "\n");
                 if (code.indexOf(text) > -1) {
                     found = fname + ".js";
                     content = code;
                     break;
                 }
             }
             if (found === undefined) {
                 //Deep search (slow)
                 var files = registry.getAllFilesForService("classes");
                 if (files !== undefined) {
                     for (var x = 0; x < files.length; x++) {
                         let code:string = await new Server().loadFile(files[x]);
                         code = code.replaceAll("\r\n", "\n");
                         if (code.indexOf(text) > -1) {
                             found = files[x];
                             content = code;
                         }
                     }
                 }
             }
             if (found !== undefined) {
                 var line = code.substring(0, content.indexOf(text)).split("\n").length + 1;
                 router.navigate("#do=jassijs_editor.CodeEditor&file=" + found + "&line=" + line.toString());
                 //                return await jassijs_editor.CodeEditor.open(found+":"+line.toString()+":0");
             }*/
            return undefined;
        }
        /**
         * manage shortcuts
         */
        registerKeys() {
            var _this = this;
            $(this._codePanel.dom).keydown(function (evt) {
                if (evt.keyCode === 115 && evt.shiftKey) { //F4
                    // var thiss=this._this._id;
                    // var editor = ace.edit(this._this._id);
                    _this.evalCode(true);
                    evt.preventDefault();
                    return false;
                }
                else if (evt.keyCode === 115) { //F4
                    _this.evalCode(false);
                    evt.preventDefault();
                    return false;
                }
                if (evt.keyCode === 116) { //F5
                    evt.preventDefault();
                    return false;
                }
                if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey) /* && (evt.which == 19)*/) { //Str+s
                    _this.save();
                    evt.preventDefault();
                    return false;
                }
            });
        }
        /**
         * extract lines from code
         * @param {string} code - the code
         * @returns {[string]} - all lines
         */
        _codeToLines(code) {
            var lines = code.split("\n");
            for (var x = 0; x < lines.length; x++) {
                while (lines[x].startsWith("/") || lines[x].startsWith(" ")
                    || lines[x].startsWith("*") || lines[x].startsWith("\t")) {
                    lines[x] = lines[x].substring(1);
                }
            }
            return lines;
        }
        _evalToCursorReached() {
            if (this.__evalToCursorReached !== true)
                this._main.show('code');
            this.__evalToCursorReached = true;
        }
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addVariables(variables) {
            this.variables.addAll(variables);
        }
        async _evalCodeOnLoad(data) {
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            var breakpoints = _this._codePanel.getBreakpoints();
            var filename = _this._file.replace(".ts", "$temp.ts");
            await Jassi_1.default.debugger.removeBreakpointsForFile(filename);
            for (var line in breakpoints) {
                if (breakpoints[line]) {
                    var row = lines[line].length;
                    await Jassi_1.default.debugger.breakpointChanged(filename, line, row, true, "debugpoint");
                }
            }
            var islocaldb = Classes_1.classes.getClass("jassijs_localserver.DBManager");
            if (islocaldb && code.indexOf("@$DBObject(") > -1) {
                islocaldb.destroyConnection();
            }
            if (data.test !== undefined) {
                var ret = await data.test(new Test_1.Test());
                // Promise.resolve(ret).then(async function(ret) {
                if (ret !== undefined) {
                    if (ret.layout !== undefined)
                        _this.variables.addVariable("this", ret);
                    else {
                        //get variablename from return
                        var sfunc = data.test.toString();
                        var pos = sfunc.lastIndexOf("return ");
                        var pose = sfunc.indexOf(";", pos);
                        var retvar = sfunc.substring(pos + 7, pose).trim();
                        _this.variables.addVariable(retvar, ret);
                    }
                    _this.variables.addVariable("me", ret.me);
                    _this.variables.updateCache();
                    if (ret instanceof Component_1.Component && ret["reporttype"] === undefined) {
                        require(["jassijs_editor/ComponentDesigner", "jassijs_editor/util/Parser"], function () {
                            var ComponentDesigner = Classes_1.classes.getClass("jassijs_editor.ComponentDesigner");
                            var Parser = Classes_1.classes.getClass("jassijs_editor.base.Parser");
                            if (!((_this._design) instanceof ComponentDesigner)) {
                                _this._design = new ComponentDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                                //@ts-ignore
                                _this._design.connectParser(new Parser());
                            }
                            _this._design["designedComponent"] = ret;
                        });
                    }
                    else if (ret["reportdesign"] !== undefined) {
                        require(["jassijs_report/designer/ReportDesigner", "jassijs_report/ReportDesign", "jassijs_editor/util/Parser"], function () {
                            var ReportDesigner = Classes_1.classes.getClass("jassijs_report.designer.ReportDesigner");
                            var ReportDesign = Classes_1.classes.getClass("jassijs_report.ReportDesign");
                            var Parser = Classes_1.classes.getClass("jassijs_editor.base.Parser");
                            if (!((_this._design) instanceof ReportDesigner)) {
                                _this._design = new ReportDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                                //@ts-ignore
                                _this._design.connectParser(new Parser());
                            }
                            var rep = new ReportDesign();
                            rep.design = Object.assign({}, ret.reportdesign);
                            if (ret.value && rep.design.data === undefined)
                                rep.design.data = ret.value;
                            else if (ret.data && rep.design.data === undefined)
                                rep.design.data = ret.data;
                            if (ret.parameter && rep.design.parameter === undefined)
                                rep.design.parameter = ret.parameter;
                            _this._design["designedComponent"] = rep;
                            /*   require(["jassijs_report/ReportDesign"], function() {
                                   var rd = classes.getClass("jassijs_report.ReportDesign");
                                   let rep = rd["fromJSON"](ret);
                                   
                                   _this._design["designedComponent"] = rep;
                               });*/
                        });
                    } /*else if (ret["reporttype"] !== undefined) {
                        require(["jassijs_report/designer/ReportDesigner"], function () {
                            var ReportDesigner = classes.getClass("jassijs_report.designer.ReportDesigner");
                            if (!((_this._design) instanceof ReportDesigner)) {
                                _this._design = new ReportDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                            }
                            _this._design["designedComponent"] = ret;
    
                 
                        });
                    }*/
                }
                //  });
            }
        }
        async saveTempFile(file, code) {
            //@ts-ignore 
            var tss = await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); });
            //@ts-ignore 
            var settings = Typescript_1.Typescript.compilerSettings;
            settings["inlineSourceMap"] = true;
            settings["inlineSources"] = true;
            var files = await tss.default.transpile(file + ".ts", code);
            var codets = -1;
            var codemap = -1;
            var codejs = -1;
            for (var x = 0; x < files.fileNames.length; x++) {
                if (files.fileNames[x].endsWith(".ts")) {
                    codets = x;
                }
                if (files.fileNames[x].endsWith(".js.map")) {
                    codemap = x;
                }
                if (files.fileNames[x].endsWith(".js")) {
                    codejs = x;
                }
            }
            /*  var all = JSON.parse(files.contents[codemap]);
              all["sourcesContent"] = [files.contents[codets]];
              files.contents[codemap] = JSON.stringify(all);
              var b64 = btoa(unescape(encodeURIComponent(files.contents[codemap])));
              var pos = files.contents[codejs].indexOf("//" + "# sourceMappingURL=");
              files.contents[codejs] = files.contents[codejs].substring(0, pos);
              files.contents[codejs] = files.contents[codejs] + "//" + "# sourceMappingURL=data:application/json;charset=utf8;base64," + b64;
              */
            const channel = new MessageChannel();
            var ret = new Promise((res, rej) => {
                channel.port1.onmessage = (evt) => {
                    channel.port1.close();
                    res(evt);
                };
            });
            let abspath = location.origin + location.pathname;
            abspath = abspath.substring(0, abspath.lastIndexOf("/") + 1);
            navigator.serviceWorker.controller.postMessage({
                type: 'SAVE_FILE',
                filename: abspath + files.fileNames[codejs],
                code: files.contents[codejs]
            }, [channel.port2]);
            var test = await ret;
        }
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
            this.__evalToCursorReached = false;
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            window["test"] = undefined;
            code = "";
            for (var x = 0; x < lines.length; x++) {
                code = code + lines[x] + "\n";
            }
            code = code;
            var _this = this;
            var tmp = new Date().getTime();
            var jsfile = _this._file.replace(".ts", "") + "$temp";
            //await new Server().saveFile("tmp/" + _this._file, code);
            //only local - no TS File in Debugger
            await this.saveTempFile(jsfile, code);
            try {
                requirejs.undef("js/" + jsfile + ".js");
            }
            catch (ex) { }
            ;
            var onload = function (data) {
                _this._evalCodeOnLoad(data).catch((err) => {
                    throw err;
                });
            };
            //await new Promise(resolve => setTimeout(resolve, 1000));
            //if this is the first save for the tmpfile then it fails - I dont know why, give it a second try
            require(["js/" + jsfile + ".js"], onload, /*error*/ function (err) {
                //console.log("reload");
                window.setTimeout(function () {
                    require(["js/" + jsfile + ".js"], onload, function (err) {
                        throw err;
                    });
                }, 20);
            });
        }
        /**
         * switch view
         * @member {string} view - "design" or "code"
         */
        set viewmode(view) {
            this._main.show(view);
        }
        /**
        * get all known instances for type
        * @param {type} type - the type we are interested
        * @returns {[string]}
        */
        getVariablesForType(type) {
            return this.variables.getVariablesForType(type);
        }
        /**
         * gets the name of the variabel that holds the object
         * @param {object} ob - the
         */
        getVariableFromObject(ob) {
            return this.variables.getVariableFromObject(ob);
        }
        /**
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        getObjectFromVariable(varname) {
            return this.variables.getObjectFromVariable(varname);
        }
        /**
          * renames a variable in design
          * @param {string} oldName
          * @param {string} newName
          */
        renameVariable(oldName, newName) {
            this.variables.renameVariable(oldName, newName);
            if (this._design !== undefined && this._design["_componentExplorer"] !== undefined)
                this._design["_componentExplorer"].update();
        }
        /**
         * @member {string} - the code
         */
        set value(value) {
            this._codePanel.file = this._file;
            this._codePanel.value = value;
        }
        get value() {
            return this._codePanel.value;
        }
        setCursorPorition(position) {
            this.cursorPosition = this._codePanel.numberToPosition(position);
        }
        /**
        * @param {object} position - the current cursor position {row= ,column=}
        */
        set cursorPosition(cursor) {
            this._codePanel.cursorPosition = cursor;
        }
        get cursorPosition() {
            return this._codePanel.cursorPosition;
        }
        /**
         * @member {string} - title of the component
         */
        get title() {
            var s = this.file.split("/");
            return s[s.length - 1];
        }
        /**
        * @member {string} - the url to edit
        */
        set file(value) {
            this._file = value;
            this.openFile(value);
        }
        get file() {
            return this._file;
        }
        /**
        * goes to the line number
        * @param {object} value - the line number
        */
        set line(value) {
            this._line = Number(value);
            this.cursorPosition = { row: this._line, column: 1 };
            var _this = this;
            setTimeout(function () {
                _this.cursorPosition = { row: _this._line, column: 1 };
            }, 300);
            /*setTimeout(function() {
                _this.cursorPosition = { row: value, column: 0 };
            }, 1000);//start takes one second....*/
        }
        get line() {
            return this.cursorPosition.row;
        }
        /**
         * open the file
         */
        async openFile(_file) {
            this._file = _file;
            var content = await new Server_1.Server().loadFile(this._file);
            this._codePanel.file = _file;
            this._codePanel.value = content;
            this._codePanel.width = "100%";
            //  this._codePanel.height="100%";
            this._main.update();
            if (this._line)
                this.line = this._line;
        }
        destroy() {
            this._codeView.destroy();
            this._codeToolbar.destroy();
            this._codePanel.destroy();
            this._errors.destroy();
            this.variables.destroy();
            this._design.destroy();
            //this._main.destroy();
            super.destroy();
        }
        /**
        * undo action
        */
        undo() {
            this._codePanel.undo();
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], CodeEditor.prototype, "file", null);
    __decorate([
        Property_1.$Property({ isUrlTag: true }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], CodeEditor.prototype, "line", null);
    CodeEditor = CodeEditor_1 = __decorate([
        Jassi_1.$Class("jassijs_editor.CodeEditor"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditor);
    exports.CodeEditor = CodeEditor;
    async function test() {
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = 300;
        editor.width = "100%";
        //await editor.openFile(url);
        editor.value = `import { Button } from "jassijs/ui/Button";
import { Repeater } from "jassijs/ui/Repeater";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
type Me = {
    button1?: Button;
};
@$Class("demo.EmptyDialog")
export class EmptyDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.button1 = new Button();
        this.add(me.button1);
    }
}
export async function test() {
    var ret = new EmptyDialog();
    return ret;
}
`;
        editor.evalCode();
        return editor;
    }
    exports.test = test;
    ;
});
//jassijs.myRequire(modul.css["jassijs_editor.css"]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfZWRpdG9yL0NvZGVFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUE4QkEsSUFBTSw0QkFBNEIsR0FBbEMsTUFBTSw0QkFBNEI7S0FLakMsQ0FBQTtJQUhHO1FBREMsb0JBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7bUZBQzVFO0lBRWxDO1FBREMsb0JBQVMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7d0ZBQ3JFO0lBSnJDLDRCQUE0QjtRQUZqQyw4QkFBbUIsRUFBRTtRQUNyQixjQUFNLENBQUMsNkNBQTZDLENBQUM7T0FDaEQsNEJBQTRCLENBS2pDO0lBR0Q7OztPQUdHO0lBRUgsSUFBYSxVQUFVLGtCQUF2QixNQUFhLFVBQVcsU0FBUSxhQUFLO1FBY2pDLFlBQVksYUFBK0QsU0FBUztZQUNoRixLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksbUNBQWdCLEVBQUUsQ0FBQztZQUNwQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQ2hDLG1HQUFtRztZQUNuRyxJQUFJLEtBQUssR0FBRyxDQUFDLGdFQUFnRSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUN6RyxJQUFJLElB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QTBuQnRCO0lBMW5CWSxnQ0FBVTtJQTRuQmhCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDOUIseUNBQXlDO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLDZCQUE2QjtRQUM3QixNQUFNLENBQUMsS0FBSyxHQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F3QmxCLENBQUM7UUFDRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUM7SUFFbEIsQ0FBQztJQWxDRCxvQkFrQ0M7SUFBQSxDQUFDOztBQUNGLHFEQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7IENvZGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db2RlUGFuZWxcIjtcclxuaW1wb3J0IHsgVmFyaWFibGVQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1ZhcmlhYmxlUGFuZWxcIjtcclxuaW1wb3J0IHsgRG9ja2luZ0NvbnRhaW5lciB9IGZyb20gXCJqYXNzaWpzL3VpL0RvY2tpbmdDb250YWluZXJcIjtcclxuaW1wb3J0IHsgRXJyb3JQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL0Vycm9yUGFuZWxcIjtcclxuaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcbmltcG9ydCByZWdpc3RyeSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcclxuaW1wb3J0IHsgU2VydmVyIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1NlcnZlclwiO1xyXG5pbXBvcnQgeyBSZWxvYWRlciB9IGZyb20gXCJqYXNzaWpzL3V0aWwvUmVsb2FkZXJcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBSZXBvcnREZXNpZ24gfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcblxyXG5pbXBvcnQgeyBBY2VQYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9BY2VQYW5lbFwiO1xyXG5pbXBvcnQgdHlwZXNjcmlwdCwgeyBUeXBlc2NyaXB0IH0gZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBNb25hY29QYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Nb25hY29QYW5lbFwiO1xyXG5pbXBvcnQgeyAkU2V0dGluZ3NEZXNjcmlwdG9yLCBTZXR0aW5ncyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1Rlc3RcIjtcclxuaW1wb3J0IG1vZHVsIGZyb20gXCIuL21vZHVsXCI7XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEtub3duU2V0dGluZ3Mge1xyXG4gICAgICAgIERldmVsb3BtZW50X0RlZmF1bHRFZGl0b3I6IFwiYWNlXCIgfCBcIm1vbmFjb1wiIHwgXCJhY2VPbkJyb3dzZXJcIjtcclxuICAgICAgICBEZXZlbG9wbWVudF9Nb2FuYWNvRWRpdG9yVGhlbWU6IFwidnMtZGFya1wiIHwgXCJ2cy1saWdodFwiIHwgXCJoYy1ibGFja1wiO1xyXG4gICAgfVxyXG59XHJcbkAkU2V0dGluZ3NEZXNjcmlwdG9yKClcclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JTZXR0aW5nc0Rlc2NyaXB0b3JcIilcclxuY2xhc3MgQ29kZUVkaXRvclNldHRpbmdzRGVzY3JpcHRvciB7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1wiYWNlXCIsIFwibW9uYWNvXCIsIFwiYWNlT25Ccm93c2VyXCJdLCBkZWZhdWx0OiBcImFjZU9uQnJvd3NlclwiLCBjaG9vc2VGcm9tU3RyaWN0OiB0cnVlIH0pXHJcbiAgICBEZXZlbG9wbWVudF9EZWZhdWx0RWRpdG9yOiBzdHJpbmc7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1widnMtZGFya1wiLCBcInZzLWxpZ2h0XCIsIFwiaGMtYmxhY2tcIl0sIGRlZmF1bHQ6IFwidnMtbGlnaHRcIiwgY2hvb3NlRnJvbVN0cmljdDogdHJ1ZSB9KVxyXG4gICAgRGV2ZWxvcG1lbnRfTW9hbmFjb0VkaXRvclRoZW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUGFuZWwgZm9yIGVkaXRpbmcgc291cmNlc1xyXG4gKiBAY2xhc3MgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvclxyXG4gKi9cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JcIilcclxuZXhwb3J0IGNsYXNzIENvZGVFZGl0b3IgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBfbWFpbjogRG9ja2luZ0NvbnRhaW5lcjtcclxuICAgIF9jb2RlVmlldzogUGFuZWw7XHJcbiAgICBfY29kZVRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2NvZGVQYW5lbDogQ29kZVBhbmVsO1xyXG4gICAgX2Vycm9yczogRXJyb3JQYW5lbDtcclxuICAgIF9maWxlOiBzdHJpbmc7XHJcbiAgICB2YXJpYWJsZXM6IFZhcmlhYmxlUGFuZWw7XHJcbiAgICBfZGVzaWduOiBQYW5lbDtcclxuICAgIGVkaXRNb2RlOiBib29sZWFuO1xyXG4gICAgX19ldmFsVG9DdXJzb3JSZWFjaGVkOiBib29sZWFuO1xyXG4gXHJcblxyXG4gICAgcHJpdmF0ZSBfbGluZTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogeyBjb2RlUGFuZWw/OiBDb2RlUGFuZWwsIGhpZGVUb29sYmFyPzogYm9vbGVhbiB9ID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1heGltaXplKCk7XHJcbiAgICAgICAgdGhpcy5fbWFpbiA9IG5ldyBEb2NraW5nQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIC8vaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIGxldCBtb2JpbCA9ICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpO1xyXG4gICAgICAgIGxldCBzZXR0ID0gU2V0dGluZ3MuZ2V0cyhTZXR0aW5ncy5rZXlzLkRldmVsb3BtZW50X0RlZmF1bHRFZGl0b3IpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzPy5jb2RlUGFuZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gcHJvcGVydGllcy5jb2RlUGFuZWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgQ29kZVBhbmVsLnR5cGVzY3JpcHQ9dHlwZXNjcmlwdDtcclxuICAgICAgICAgICAgaWYgKHNldHQgPT09IFwiYWNlXCIgfHwgKG1vYmlsICYmIChzZXR0ID09PSBcImFjZU9uQnJvd3NlclwiIHx8IHNldHQgPT09IHVuZGVmaW5lZCkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgQWNlUGFuZWwoKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IE1vbmFjb1BhbmVsKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgQWNlUGFuZWwoKTsgXHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9lcnJvcnMgPSBuZXcgRXJyb3JQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2ZpbGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbmV3IFZhcmlhYmxlUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ24gPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9pbml0KHByb3BlcnRpZXM/LmhpZGVUb29sYmFyKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9pbml0Q29kZVBhbmVsKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5tb2RlID0gXCJ0eXBlc2NyaXB0XCI7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmhlaWdodCA9IFwiY2FsYygxMDAlIC0gMzFweClcIjtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5vbkJyZWFrcG9pbnRDaGFuZ2VkKGZ1bmN0aW9uIChsaW5lLCBjb2x1bW4sIGVuYWJsZSwgdHlwZSkge1xyXG4gICAgICAgICAgICBqYXNzaWpzLmRlYnVnZ2VyLmJyZWFrcG9pbnRDaGFuZ2VkKF90aGlzLl9maWxlLCBsaW5lLCBjb2x1bW4sIGVuYWJsZSwgdHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5pdChoaWRlVG9vbGJhcjogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faW5pdENvZGVQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVWaWV3W1wiaG9yaXpvbnRhbFwiXSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChoaWRlVG9vbGJhciAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVRvb2xiYXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhcltcImhvcml6b250YWxcIl0gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5oZWlnaHQgPSBcIjMwXCI7XHJcbiAgICAgICAgICAgIHZhciBzYXZlID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBzYXZlLnRvb2x0aXAgPSBcIlNhdmUoQ3RybCtTKVwiO1xyXG4gICAgICAgICAgICBzYXZlLmljb24gPSBcIm1kaSBtZGktY29udGVudC1zYXZlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHNhdmUub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQoc2F2ZSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnVuID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBydW4uaWNvbiA9IFwibWRpIG1kaS1jYXItaGF0Y2hiYWNrIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHJ1bi50b29sdGlwID0gXCJSdW4oRjQpXCI7XHJcbiAgICAgICAgICAgIHJ1bi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQocnVuKTtcclxuXHJcbiAgICAgICAgICAgIHZhciB1bmRvID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB1bmRvLmljb24gPSBcIm1kaSBtZGktdW5kbyBtZGktMThweFwiO1xyXG4gICAgICAgICAgICB1bmRvLnRvb2x0aXAgPSBcIlVuZG8gKFN0cmcrWilcIjtcclxuICAgICAgICAgICAgdW5kby5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jb2RlUGFuZWwudW5kbygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHVuZG8pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGdvdG8gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIGdvdG8uaWNvbiA9IFwibWRpIG1kaS1yYXktc3RhcnQtYXJyb3cgbWRpLTE4cHhcIjtcclxuICAgICAgICAgICAgZ290by50b29sdGlwID0gXCJHb3RvXCI7XHJcbiAgICAgICAgICAgIGdvdG8ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nb3RvRGVjbGFyYXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGphc3NpanNbXCIkQ29kZUVkaXRvclwiXSA9IENvZGVFZGl0b3I7XHJcbiAgICAgICAgICAgICQoZ290by5kb20pLmF0dHIoXCJvbmRyb3BcIiwgXCJldmVudC5wcmV2ZW50RGVmYXVsdCgpO2phc3NpanMuJENvZGVFZGl0b3Iuc2VhcmNoKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1wiKTtcclxuICAgICAgICAgICAgJChnb3RvLmRvbSkuYXR0cihcIm9uZHJhZ292ZXJcIiwgXCJldmVudC5wcmV2ZW50RGVmYXVsdCgpO1wiKTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKGdvdG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFpbi53aWR0aCA9IFwiY2FsYygxMDAlIC0gMXB4KVwiO1xyXG4gICAgICAgIHRoaXMuX21haW4uaGVpZ2h0ID0gXCI5OSVcIjtcclxuICAgICAgICB0aGlzLl9tYWluLm9ucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jb2RlUGFuZWwucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyp2YXIgdGVzdCA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0ZXN0Lmljb24gPSBcIm1kaSBtZGktYnVnIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGVzdC50b29sdGlwID0gXCJUZXN0XCI7XHJcbiAgICAgICAgdGVzdC5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGtrID0gX3RoaXMuX21haW4ubGF5b3V0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZCh0ZXN0KTsqL1xyXG5cclxuXHJcbiAgICAgICAgc3VwZXIuYWRkKHRoaXMuX21haW4pO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnN0YWxsVmlldygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJLZXlzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICAgLy8gICB0aGlzLl9jb2RlUGFuZWwuc2V0Q29tcGxldGVyKHRoaXMpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAvL190aGlzLmVkaXRvclByb3ZpZGVyPVwiYWNlXCI7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5zdGFsbFZpZXcoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fY29kZVZpZXcsIFwiQ29kZS4uXCIsIFwiY29kZVwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLnZhcmlhYmxlcywgXCJWYXJpYWJsZXNcIiwgXCJ2YXJpYWJsZXNcIik7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLl9lcnJvcnMsIFwiRXJyb3JzXCIsIFwiZXJyb3JzXCIpO1xyXG4gICAgICAgIHRoaXMuX21haW4ubGF5b3V0ID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJ3aWR0aFwiOjEwMCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6MzMuMzMzMzMzMzMzMzMzMzM2LFwiaGVpZ2h0XCI6ODAuMzQ2ODIwODA5MjQ4NTYsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb2RlLi5cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29kZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJuYW1lXCI6XCJjb2RlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJEZXNpZ25cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZGVzaWduXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJEZXNpZ25cIixcIm5hbWVcIjpcImRlc2lnblwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjoxOS42NTMxNzkxOTA3NTE0NDUsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjUwLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9J1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKnNldCBlZGl0b3JQcm92aWRlcih2YWx1ZTogXCJhY2VcIiB8IFwibW9uYWNvXCIpIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuZWRpdG9yUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgLy9zd2l0Y2ggdG8gbmV3IHByb3ZpZGVyXHJcbiAgICAgICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuX2NvZGVQYW5lbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJhY2VcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IEFjZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgTW9uYWNvUGFuZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pbml0Q29kZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVWaWV3LnJlbW92ZShvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVBhbmVsKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZT12YWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb249cG9zO1xyXG4gICAgICAgICAgICBvbGQuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0qL1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIF9zYXZlKGNvZGUpIHtcclxuICAgICAgICBhd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGUodGhpcy5fZmlsZSwgY29kZSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZiA9IHRoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIlwiKTtcclxuICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiQCRcIikgPiAtMSkge1xyXG4gICAgICAgICAgICBhd2FpdCByZWdpc3RyeS5yZWxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUmVsb2FkZXIuaW5zdGFuY2UucmVsb2FkSlMoZik7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBzYXZlIHRoZSBjb2RlIHRvIHNlcnZlclxyXG4gICAgKi9cclxuICAgIHNhdmUoKSB7XHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9zYXZlKGNvZGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnb3RvIHRvIHRoZSBkZWNsYXJpYXRpb24gb24gY3Vyc29yXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdvdG9EZWNsYXJhdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZ290b0RlY2xhcmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZWFyY2ggdGV4dCBpbiBjbGFzc2VzIGF0IHRoZSBnaXZlbiB0ZXh0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRoZSB0ZXh0IHRvIHNlYXJjaFxyXG4gICAgICogQHJldHVybnMge2phc3NpanNfZWRpdG9yLkNvZGVFZGl0b3J9IC0gdGhlIGVkaXRvciBpbnN0YW5jZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgc2VhcmNoKHRleHQpIHtcclxuICAgICAgICAvL1RPRE8gYXNrIHR5cGVzY3JpcHQgc2VydmljZVxyXG4gICAgICAgIC8qIHZhciBmb3VuZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgdmFyIGNvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgIC8vRmFzdCBzZWFyY2hcclxuICAgICAgICAgZm9yICh2YXIgZmlsZSBpbiBjbGFzc2VzLmdldENhY2hlKCkpIHtcclxuICAgICAgICAgICAgIHZhciBmbmFtZSA9IGZpbGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgICAgICAgdmFyIGNsID0gY2xhc3Nlcy5nZXRDYWNoZSgpW2ZpbGVdO1xyXG4gICAgICAgICAgICAgdmFyIGNvZGUgPSBjbC50b1N0cmluZygpLnJlcGxhY2VBbGwoXCJcXHJcXG5cIiwgXCJcXG5cIik7XHJcbiAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKHRleHQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICBmb3VuZCA9IGZuYW1lICsgXCIuanNcIjtcclxuICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29kZTtcclxuICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgLy9EZWVwIHNlYXJjaCAoc2xvdylcclxuICAgICAgICAgICAgIHZhciBmaWxlcyA9IHJlZ2lzdHJ5LmdldEFsbEZpbGVzRm9yU2VydmljZShcImNsYXNzZXNcIik7XHJcbiAgICAgICAgICAgICBpZiAoZmlsZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgbGV0IGNvZGU6c3RyaW5nID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKGZpbGVzW3hdKTtcclxuICAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZih0ZXh0KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZpbGVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgaWYgKGZvdW5kICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgIHZhciBsaW5lID0gY29kZS5zdWJzdHJpbmcoMCwgY29udGVudC5pbmRleE9mKHRleHQpKS5zcGxpdChcIlxcblwiKS5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiI2RvPWphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3ImZmlsZT1cIiArIGZvdW5kICsgXCImbGluZT1cIiArIGxpbmUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvci5vcGVuKGZvdW5kK1wiOlwiK2xpbmUudG9TdHJpbmcoKStcIjowXCIpO1xyXG4gICAgICAgICB9Ki9cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1hbmFnZSBzaG9ydGN1dHNcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJLZXlzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlUGFuZWwuZG9tKS5rZXlkb3duKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUgJiYgZXZ0LnNoaWZ0S2V5KSB7Ly9GNFxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRoaXNzPXRoaXMuX3RoaXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVkaXRvciA9IGFjZS5lZGl0KHRoaXMuX3RoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IDExNSkgey8vRjRcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE2KSB7Ly9GNVxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoU3RyaW5nLmZyb21DaGFyQ29kZShldnQud2hpY2gpLnRvTG93ZXJDYXNlKCkgPT09ICdzJyAmJiBldnQuY3RybEtleSkvKiAmJiAoZXZ0LndoaWNoID09IDE5KSovKSB7Ly9TdHIrc1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZXh0cmFjdCBsaW5lcyBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIC0gdGhlIGNvZGVcclxuICAgICAqIEByZXR1cm5zIHtbc3RyaW5nXX0gLSBhbGwgbGluZXNcclxuICAgICAqL1xyXG4gICAgX2NvZGVUb0xpbmVzKGNvZGUpIHtcclxuICAgICAgICB2YXIgbGluZXMgPSBjb2RlLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGluZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgd2hpbGUgKGxpbmVzW3hdLnN0YXJ0c1dpdGgoXCIvXCIpIHx8IGxpbmVzW3hdLnN0YXJ0c1dpdGgoXCIgXCIpXHJcbiAgICAgICAgICAgICAgICB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiKlwiKSB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiXFx0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lc1t4XSA9IGxpbmVzW3hdLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9ldmFsVG9DdXJzb3JSZWFjaGVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fZXZhbFRvQ3Vyc29yUmVhY2hlZCAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5fbWFpbi5zaG93KCdjb2RlJyk7XHJcbiAgICAgICAgdGhpcy5fX2V2YWxUb0N1cnNvclJlYWNoZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgdmFyaWFibGVzIHRvIHZhcmlhYmVscGFuZWxcclxuICAgICAqIEBwYXJhbSBPYmplY3Q8c3RyaW5nLG9iamVjdD4gdmFyaWFibGVzIFtcIm5hbWVcIl09dmFsdWVcclxuICAgICAqL1xyXG4gICAgYWRkVmFyaWFibGVzKHZhcmlhYmxlcykge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmFkZEFsbCh2YXJpYWJsZXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhc3luYyBfZXZhbENvZGVPbkxvYWQoZGF0YSkge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmNsZWFyKCk7XHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IF90aGlzLl9jb2RlUGFuZWwuZ2V0QnJlYWtwb2ludHMoKTtcclxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBfdGhpcy5fZmlsZS5yZXBsYWNlKFwiLnRzXCIsIFwiJHRlbXAudHNcIik7XHJcbiAgICAgICAgYXdhaXQgamFzc2lqcy5kZWJ1Z2dlci5yZW1vdmVCcmVha3BvaW50c0ZvckZpbGUoZmlsZW5hbWUpO1xyXG4gICAgICAgIGZvciAodmFyIGxpbmUgaW4gYnJlYWtwb2ludHMpIHtcclxuICAgICAgICAgICAgaWYgKGJyZWFrcG9pbnRzW2xpbmVdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gbGluZXNbbGluZV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgamFzc2lqcy5kZWJ1Z2dlci5icmVha3BvaW50Q2hhbmdlZChmaWxlbmFtZSwgbGluZSwgcm93LCB0cnVlLCBcImRlYnVncG9pbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpc2xvY2FsZGIgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19sb2NhbHNlcnZlci5EQk1hbmFnZXJcIik7XHJcbiAgICAgICAgaWYgKGlzbG9jYWxkYiAmJiBjb2RlLmluZGV4T2YoXCJAJERCT2JqZWN0KFwiKSA+IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5pc2xvY2FsZGIpLmRlc3Ryb3lDb25uZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLnRlc3QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgcmV0ID0gYXdhaXQgZGF0YS50ZXN0KG5ldyBUZXN0KCkpO1xyXG4gICAgICAgICAgICAvLyBQcm9taXNlLnJlc29sdmUocmV0KS50aGVuKGFzeW5jIGZ1bmN0aW9uKHJldCkge1xyXG4gICAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmV0LmxheW91dCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcInRoaXNcIiwgcmV0KTtcclxuICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vZ2V0IHZhcmlhYmxlbmFtZSBmcm9tIHJldHVyblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzZnVuYzogc3RyaW5nID0gZGF0YS50ZXN0LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHNmdW5jLmxhc3RJbmRleE9mKFwicmV0dXJuIFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zZSA9IHNmdW5jLmluZGV4T2YoXCI7XCIsIHBvcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJldHZhciA9IHNmdW5jLnN1YnN0cmluZyhwb3MgKyA3LCBwb3NlKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLmFkZFZhcmlhYmxlKHJldHZhciwgcmV0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcIm1lXCIsIHJldC5tZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgX3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmV0IGluc3RhbmNlb2YgQ29tcG9uZW50ICYmIHJldFtcInJlcG9ydHR5cGVcIl0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVpcmUoW1wiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIixcImphc3NpanNfZWRpdG9yL3V0aWwvUGFyc2VyXCJdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBDb21wb25lbnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhcnNlciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5iYXNlLlBhcnNlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgQ29tcG9uZW50RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduID0gbmV3IENvbXBvbmVudERlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9tYWluLmFkZChfdGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJjb2RlRWRpdG9yXCJdID0gX3RoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24uY29ubmVjdFBhcnNlcihuZXcgUGFyc2VyKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJldFtcInJlcG9ydGRlc2lnblwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZShbXCJqYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lclwiLCBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiLFwiamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXJcIl0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFJlcG9ydERlc2lnbmVyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfcmVwb3J0LmRlc2lnbmVyLlJlcG9ydERlc2lnbmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfcmVwb3J0LlJlcG9ydERlc2lnblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFBhcnNlciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5iYXNlLlBhcnNlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgUmVwb3J0RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduID0gbmV3IFJlcG9ydERlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fbWFpbi5hZGQoX3RoaXMuX2Rlc2lnbiwgXCJEZXNpZ25cIiwgXCJkZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiY29kZUVkaXRvclwiXSA9IF90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24uY29ubmVjdFBhcnNlcihuZXcgUGFyc2VyKCkgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXAgPSBuZXcgUmVwb3J0RGVzaWduKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcC5kZXNpZ24gPSBPYmplY3QuYXNzaWduKHt9LCByZXQucmVwb3J0ZGVzaWduKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYocmV0LnZhbHVlJiZyZXAuZGVzaWduLmRhdGE9PT11bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXAuZGVzaWduLmRhdGEgPSByZXQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXQuZGF0YSYmcmVwLmRlc2lnbi5kYXRhPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcC5kZXNpZ24uZGF0YSA9IHJldC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJldC5wYXJhbWV0ZXImJnJlcC5kZXNpZ24ucGFyYW1ldGVyPT09dW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5wYXJhbWV0ZXIgPSByZXQucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvKiAgIHJlcXVpcmUoW1wiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCJdLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZCA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnREZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgcmVwID0gcmRbXCJmcm9tSlNPTlwiXShyZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pOyovXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9LyplbHNlIGlmIChyZXRbXCJyZXBvcnR0eXBlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlKFtcImphc3NpanNfcmVwb3J0L2Rlc2lnbmVyL1JlcG9ydERlc2lnbmVyXCJdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBSZXBvcnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5kZXNpZ25lci5SZXBvcnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgUmVwb3J0RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduID0gbmV3IFJlcG9ydERlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fbWFpbi5hZGQoX3RoaXMuX2Rlc2lnbiwgXCJEZXNpZ25cIiwgXCJkZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiY29kZUVkaXRvclwiXSA9IF90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJkZXNpZ25lZENvbXBvbmVudFwiXSA9IHJldDtcclxuXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhc3luYyBzYXZlVGVtcEZpbGUoZmlsZTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpIHtcclxuXHJcblxyXG4gICAgICAgIC8vQHRzLWlnbm9yZSBcclxuICAgICAgICB2YXIgdHNzID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqc19lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCIpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZSBcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBUeXBlc2NyaXB0LmNvbXBpbGVyU2V0dGluZ3M7XHJcbiAgICAgICAgc2V0dGluZ3NbXCJpbmxpbmVTb3VyY2VNYXBcIl0gPSB0cnVlO1xyXG4gICAgICAgIHNldHRpbmdzW1wiaW5saW5lU291cmNlc1wiXSA9IHRydWU7XHJcbiAgICAgICAgdmFyIGZpbGVzID0gYXdhaXQgdHNzLmRlZmF1bHQudHJhbnNwaWxlKGZpbGUgKyBcIi50c1wiLCBjb2RlKTtcclxuXHJcbiAgICAgICAgdmFyIGNvZGV0cyA9IC0xO1xyXG4gICAgICAgIHZhciBjb2RlbWFwID0gLTE7XHJcbiAgICAgICAgdmFyIGNvZGVqcyA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZmlsZXMuZmlsZU5hbWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5maWxlTmFtZXNbeF0uZW5kc1dpdGgoXCIudHNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGV0cyA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpbGVzLmZpbGVOYW1lc1t4XS5lbmRzV2l0aChcIi5qcy5tYXBcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGVtYXAgPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5maWxlTmFtZXNbeF0uZW5kc1dpdGgoXCIuanNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGVqcyA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLyogIHZhciBhbGwgPSBKU09OLnBhcnNlKGZpbGVzLmNvbnRlbnRzW2NvZGVtYXBdKTtcclxuICAgICAgICAgIGFsbFtcInNvdXJjZXNDb250ZW50XCJdID0gW2ZpbGVzLmNvbnRlbnRzW2NvZGV0c11dO1xyXG4gICAgICAgICAgZmlsZXMuY29udGVudHNbY29kZW1hcF0gPSBKU09OLnN0cmluZ2lmeShhbGwpO1xyXG4gICAgICAgICAgdmFyIGI2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVzLmNvbnRlbnRzW2NvZGVtYXBdKSkpO1xyXG4gICAgICAgICAgdmFyIHBvcyA9IGZpbGVzLmNvbnRlbnRzW2NvZGVqc10uaW5kZXhPZihcIi8vXCIgKyBcIiMgc291cmNlTWFwcGluZ1VSTD1cIik7XHJcbiAgICAgICAgICBmaWxlcy5jb250ZW50c1tjb2RlanNdID0gZmlsZXMuY29udGVudHNbY29kZWpzXS5zdWJzdHJpbmcoMCwgcG9zKTtcclxuICAgICAgICAgIGZpbGVzLmNvbnRlbnRzW2NvZGVqc10gPSBmaWxlcy5jb250ZW50c1tjb2RlanNdICsgXCIvL1wiICsgXCIjIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmODtiYXNlNjQsXCIgKyBiNjQ7XHJcbiAgICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcclxuXHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWwucG9ydDEuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJlcyhldnQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBhYnNwYXRoID0gbG9jYXRpb24ub3JpZ2luICsgbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgYWJzcGF0aCA9IGFic3BhdGguc3Vic3RyaW5nKDAsIGFic3BhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XHJcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdTQVZFX0ZJTEUnLFxyXG4gICAgICAgICAgICBmaWxlbmFtZTogYWJzcGF0aCArIGZpbGVzLmZpbGVOYW1lc1tjb2RlanNdLFxyXG4gICAgICAgICAgICBjb2RlOiBmaWxlcy5jb250ZW50c1tjb2RlanNdXHJcbiAgICAgICAgfSwgW2NoYW5uZWwucG9ydDJdKTtcclxuICAgICAgICB2YXIgdGVzdCA9IGF3YWl0IHJldDtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZXhlY3V0ZSB0aGUgY3VycmVudCBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IHRvQ3Vyc29yIC0gIGlmIHRydWUgdGhlIHZhcmlhYmxlcyB3ZXJlIGluc3BlY3RlZCBvbiBjdXJzb3IgcG9zaXRpb24sIFxyXG4gICAgICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmYWxzZSBhdCB0aGUgZW5kIG9mIHRoZSBsYXlvdXQoKSBmdW5jdGlvbiBvciBhdCB0aGUgZW5kIG9mIHRoZSBjb2RlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGV2YWxDb2RlKHRvQ3Vyc29yID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5fX2V2YWxUb0N1cnNvclJlYWNoZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5jbGVhcigpO1xyXG5cclxuICAgICAgICB2YXIgY29kZSA9IHRoaXMuX2NvZGVQYW5lbC52YWx1ZTtcclxuICAgICAgICB2YXIgbGluZXMgPSBjb2RlLnNwbGl0KFwiXFxuXCIpO1xyXG5cclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHdpbmRvd1tcInRlc3RcIl0gPSB1bmRlZmluZWQ7XHJcblxyXG4gICAgICAgIGNvZGUgPSBcIlwiO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGluZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgY29kZSA9IGNvZGUgKyBsaW5lc1t4XSArIFwiXFxuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvZGUgPSBjb2RlO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdmFyIHRtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgICAgIHZhciBqc2ZpbGUgPSBfdGhpcy5fZmlsZS5yZXBsYWNlKFwiLnRzXCIsIFwiXCIpICsgXCIkdGVtcFwiO1xyXG4gICAgICAgIC8vYXdhaXQgbmV3IFNlcnZlcigpLnNhdmVGaWxlKFwidG1wL1wiICsgX3RoaXMuX2ZpbGUsIGNvZGUpO1xyXG4gICAgICAgIC8vb25seSBsb2NhbCAtIG5vIFRTIEZpbGUgaW4gRGVidWdnZXJcclxuICAgICAgICBhd2FpdCB0aGlzLnNhdmVUZW1wRmlsZShqc2ZpbGUsIGNvZGUpO1xyXG5cclxuICAgICAgICB0cnkgeyByZXF1aXJlanMudW5kZWYoXCJqcy9cIiArIGpzZmlsZSArIFwiLmpzXCIpOyB9IGNhdGNoIChleCkgeyB9O1xyXG4gICAgICAgIHZhciBvbmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgX3RoaXMuX2V2YWxDb2RlT25Mb2FkKGRhdGEpLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2F3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XHJcbiAgICAgICAgLy9pZiB0aGlzIGlzIHRoZSBmaXJzdCBzYXZlIGZvciB0aGUgdG1wZmlsZSB0aGVuIGl0IGZhaWxzIC0gSSBkb250IGtub3cgd2h5LCBnaXZlIGl0IGEgc2Vjb25kIHRyeVxyXG4gICAgICAgIHJlcXVpcmUoW1wianMvXCIgKyBqc2ZpbGUgKyBcIi5qc1wiXSwgb25sb2FkLC8qZXJyb3IqL2Z1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlbG9hZFwiKTtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgcmVxdWlyZShbXCJqcy9cIiArIGpzZmlsZSArIFwiLmpzXCJdLCBvbmxvYWQsIGZ1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgMjApO1xyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBzd2l0Y2ggdmlld1xyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSB2aWV3IC0gXCJkZXNpZ25cIiBvciBcImNvZGVcIlxyXG4gICAgICovXHJcbiAgICBzZXQgdmlld21vZGUodmlldykge1xyXG4gICAgICAgIHRoaXMuX21haW4uc2hvdyh2aWV3KTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICogZ2V0IGFsbCBrbm93biBpbnN0YW5jZXMgZm9yIHR5cGVcclxuICAgICogQHBhcmFtIHt0eXBlfSB0eXBlIC0gdGhlIHR5cGUgd2UgYXJlIGludGVyZXN0ZWRcclxuICAgICogQHJldHVybnMge1tzdHJpbmddfVxyXG4gICAgKi9cclxuICAgIGdldFZhcmlhYmxlc0ZvclR5cGUodHlwZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlcy5nZXRWYXJpYWJsZXNGb3JUeXBlKHR5cGUpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJlbCB0aGF0IGhvbGRzIHRoZSBvYmplY3RcclxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvYiAtIHRoZVxyXG4gICAgICovXHJcbiAgICBnZXRWYXJpYWJsZUZyb21PYmplY3Qob2IpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2JqZWN0IG9mIHRoZSBnaXZlbiB2YXJpYWJlbFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9iIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAgKi9cclxuICAgIGdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzLmdldE9iamVjdEZyb21WYXJpYWJsZSh2YXJuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAgKiByZW5hbWVzIGEgdmFyaWFibGUgaW4gZGVzaWduXHJcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IG9sZE5hbWVcclxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmV3TmFtZVxyXG4gICAgICAqL1xyXG4gICAgcmVuYW1lVmFyaWFibGUob2xkTmFtZSwgbmV3TmFtZSkge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLnJlbmFtZVZhcmlhYmxlKG9sZE5hbWUsIG5ld05hbWUpO1xyXG4gICAgICAgIGlmICh0aGlzLl9kZXNpZ24gIT09IHVuZGVmaW5lZCAmJiB0aGlzLl9kZXNpZ25bXCJfY29tcG9uZW50RXhwbG9yZXJcIl0gIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduW1wiX2NvbXBvbmVudEV4cGxvcmVyXCJdLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIGNvZGVcclxuICAgICAqL1xyXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmZpbGUgPSB0aGlzLl9maWxlO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC52YWx1ZSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXRDdXJzb3JQb3JpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IHRoaXMuX2NvZGVQYW5lbC5udW1iZXJUb1Bvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24ge3Jvdz0gLGNvbHVtbj19XHJcbiAgICAqL1xyXG4gICAgc2V0IGN1cnNvclBvc2l0aW9uKGN1cnNvcjogeyByb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5jdXJzb3JQb3NpdGlvbiA9IGN1cnNvcjtcclxuICAgIH1cclxuICAgIGdldCBjdXJzb3JQb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZVBhbmVsLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSAtIHRpdGxlIG9mIHRoZSBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgZ2V0IHRpdGxlKCkge1xyXG4gICAgICAgIHZhciBzID0gdGhpcy5maWxlLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICByZXR1cm4gc1tzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgdXJsIHRvIGVkaXRcclxuICAgICovXHJcbiAgICBzZXQgZmlsZSh2YWx1ZTogc3RyaW5nKSB7IC8vdGhlIENvZGVcclxuICAgICAgICB0aGlzLl9maWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vcGVuRmlsZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgaXNVcmxUYWc6IHRydWUsIGlkOiB0cnVlIH0pXHJcbiAgICBnZXQgZmlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWxlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGdvZXMgdG8gdGhlIGxpbmUgbnVtYmVyIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSB0aGUgbGluZSBudW1iZXIgXHJcbiAgICAqL1xyXG4gICAgc2V0IGxpbmUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2xpbmUgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogdGhpcy5fbGluZSwgY29sdW1uOiAxIH07XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogX3RoaXMuX2xpbmUsIGNvbHVtbjogMSB9O1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgLypzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5jdXJzb3JQb3NpdGlvbiA9IHsgcm93OiB2YWx1ZSwgY29sdW1uOiAwIH07XHJcbiAgICAgICAgfSwgMTAwMCk7Ly9zdGFydCB0YWtlcyBvbmUgc2Vjb25kLi4uLiovXHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgaXNVcmxUYWc6IHRydWUgfSlcclxuICAgIGdldCBsaW5lKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyc29yUG9zaXRpb24ucm93O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBvcGVuIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIG9wZW5GaWxlKF9maWxlKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsZSA9IF9maWxlO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKHRoaXMuX2ZpbGUpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5maWxlID0gX2ZpbGU7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLnZhbHVlID0gY29udGVudDtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICAvLyAgdGhpcy5fY29kZVBhbmVsLmhlaWdodD1cIjEwMCVcIjtcclxuICAgICAgICB0aGlzLl9tYWluLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9saW5lKVxyXG4gICAgICAgICAgICB0aGlzLmxpbmUgPSB0aGlzLl9saW5lO1xyXG5cclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2Vycm9ycy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnbi5kZXN0cm95KCk7XHJcbiAgICAgICAgLy90aGlzLl9tYWluLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogdW5kbyBhY3Rpb25cclxuICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC51bmRvKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciBlZGl0b3IgPSBuZXcgQ29kZUVkaXRvcigpO1xyXG4gICAgLy92YXIgdXJsID0gXCJqYXNzaWpzX2VkaXRvci9BY2VQYW5lbC50c1wiO1xyXG4gICAgZWRpdG9yLmhlaWdodCA9IDMwMDtcclxuICAgIGVkaXRvci53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgLy9hd2FpdCBlZGl0b3Iub3BlbkZpbGUodXJsKTtcclxuICAgIGVkaXRvci52YWx1ZSA9IGBpbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcclxuaW1wb3J0IHsgUmVwZWF0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9SZXBlYXRlclwiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG50eXBlIE1lID0ge1xyXG4gICAgYnV0dG9uMT86IEJ1dHRvbjtcclxufTtcclxuQCRDbGFzcyhcImRlbW8uRW1wdHlEaWFsb2dcIilcclxuZXhwb3J0IGNsYXNzIEVtcHR5RGlhbG9nIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgbWU6IE1lO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lID0ge307XHJcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XHJcbiAgICB9XHJcbiAgICBsYXlvdXQobWU6IE1lKSB7XHJcbiAgICAgICAgbWUuYnV0dG9uMSA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmFkZChtZS5idXR0b24xKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciByZXQgPSBuZXcgRW1wdHlEaWFsb2coKTtcclxuICAgIHJldHVybiByZXQ7XHJcbn1cclxuYDtcclxuICAgIGVkaXRvci5ldmFsQ29kZSgpO1xyXG4gICAgcmV0dXJuIGVkaXRvcjtcclxuXHJcbn07XHJcbi8vamFzc2lqcy5teVJlcXVpcmUobW9kdWwuY3NzW1wiamFzc2lqc19lZGl0b3IuY3NzXCJdKTsiXX0=