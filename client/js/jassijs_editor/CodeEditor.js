var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_editor/CodePanel", "jassijs/ui/VariablePanel", "jassijs/ui/DockingContainer", "jassijs/ui/ErrorPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Classes", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_editor/AcePanel", "jassijs_editor/util/Typescript", "jassijs_editor/MonacoPanel", "jassijs/remote/Settings", "jassijs/remote/Test", "jassijs/base/CurrentSettings", "jassijs/base/Windows", "jassijs/ui/Notify"], function (require, exports, Registry_1, Panel_1, CodePanel_1, VariablePanel_1, DockingContainer_1, ErrorPanel_1, Button_1, Registry_2, Server_1, Reloader_1, Classes_1, Component_1, Property_1, AcePanel_1, Typescript_1, MonacoPanel_1, Settings_1, Test_1, CurrentSettings_1, Windows_1, Notify_1) {
    "use strict";
    var CodeEditor_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CodeEditor = void 0;
    jassijs.includeCSSFile("jassijs_editor.css");
    let CodeEditorSettingsDescriptor = class CodeEditorSettingsDescriptor {
    };
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["ace", "monaco", "aceOnBrowser"], default: "aceOnBrowser", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_DefaultEditor", void 0);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["vs-dark", "vs-light", "hc-black"], default: "vs-light", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_MoanacoEditorTheme", void 0);
    CodeEditorSettingsDescriptor = __decorate([
        (0, Settings_1.$SettingsDescriptor)(),
        (0, Registry_1.$Class)("jassijs_editor.CodeEditorSettingsDescriptor")
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
            let sett = CurrentSettings_1.currentsettings.gets(Settings_1.Settings.keys.Development_DefaultEditor);
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
                jassijs.debugger.breakpointChanged(_this._file, line, column, enable, type);
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
                var run = new Button_1.Button();
                run.icon = "mdi mdi-car-hatchback mdi-18px";
                run.tooltip = "Run(F4)";
                run.onclick(function () {
                    _this.evalCode();
                });
                this._codeToolbar.add(run);
                var save = new Button_1.Button();
                save.tooltip = "Save(Ctrl+S)";
                save.icon = "mdi mdi-content-save mdi-18px";
                save.onclick(function () {
                    _this.save();
                });
                this._codeToolbar.add(save);
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
                this._codeToolbar.add(goto);
                this.autoCompleteButton = new Button_1.Button();
                this.autoCompleteButton.icon = "mdi mdi-robot-happy-outline mdi-18px";
                this.autoCompleteButton.tooltip = "autocomplete (ctrl space)";
                this.autoCompleteButton.onclick(function () {
                    _this._codePanel.autocomplete();
                });
                this._codeToolbar.add(this.autoCompleteButton);
                jassijs["$CodeEditor"] = CodeEditor_1;
                // $(goto.dom).attr("ondrop", "event.preventDefault();jassijs.$CodeEditor.search(event.dataTransfer.getData('text'));");
                //  $(goto.dom).attr("ondragover", "event.preventDefault();");
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
        static async addFilesToCompletion(filenames) {
            // await typescript.initService();
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
            var _a;
            await new Server_1.Server().saveFile(this._file, code);
            var f = this._file.replace(".ts", "");
            if ((_a = this._file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside/")) {
            }
            else {
                if (code.indexOf("@$") > -1) {
                    await Registry_2.default.reload();
                }
                Reloader_1.Reloader.instance.reloadJS(f);
            }
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
            this._codePanel.dom.addEventListener("keydown", function (evt) {
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
        async fillVariablesAndSetupParser(url, root, component, cache, parser) {
            var _a, _b, _c, _d, _e;
            var useThis = false;
            if (cache[component._id] === undefined && component["__stack"] !== undefined) {
                var lines = (_a = component["__stack"]) === null || _a === void 0 ? void 0 : _a.split("\n");
                for (var x = 0; x < lines.length; x++) {
                    var sline = lines[x];
                    if (sline.indexOf("$temp.js") > 0) {
                        var spl = sline.split(":");
                        var entr = {};
                        if (cache[component._id] === undefined)
                            cache[component._id] = [];
                        cache[component._id].push({
                            line: Number(spl[spl.length - 2]),
                            column: Number(spl[spl.length - 1].replace(")", "")),
                            component: component,
                            pos: 0,
                            name: undefined
                        });
                    }
                }
                if (component["_components"]) {
                    for (var x = 0; x < component["_components"].length; x++) {
                        this.fillVariablesAndSetupParser(url, root, component["_components"][x], cache, parser);
                    }
                }
                if (component === root) {
                    //fertig
                    var hh = 0;
                    var TSSourceMap = await Classes_1.classes.loadClass("jassijs_editor.util.TSSourceMap");
                    var values = [];
                    Object.values(cache).forEach((e) => {
                        e.forEach(f => values.push(f));
                    });
                    var tmap = await new TSSourceMap().getLinesFromJS("js/" + url.replace(".ts", ".js"), values);
                    for (var x = 0; x < tmap.length; x++) {
                        var val = values[x];
                        val.column = tmap[x].column;
                        val.line = tmap[x].line;
                        val.pos = this._codePanel.positionToNumber({
                            row: val.line,
                            column: val.column
                        });
                    }
                    //setupClasscope
                    var foundscope;
                    for (var xx = 0; xx < cache[root._id].length; xx++) {
                        foundscope = parser.getClassScopeFromPosition(this._codePanel.value, cache[root._id][xx].pos);
                        if (foundscope)
                            break;
                    }
                    var scope = [{ classname: (_b = root === null || root === void 0 ? void 0 : root.constructor) === null || _b === void 0 ? void 0 : _b.name, methodname: "layout" }];
                    if (foundscope)
                        scope = [{ classname: (_c = root === null || root === void 0 ? void 0 : root.constructor) === null || _c === void 0 ? void 0 : _c.name, methodname: "layout" }, foundscope];
                    parser.parse(this._codePanel.value, scope);
                    //if layout is rendered and an other variable is assigned to this, then remove ths variable
                    if (parser.classes[(_d = root === null || root === void 0 ? void 0 : root.constructor) === null || _d === void 0 ? void 0 : _d.name] && parser.classes[(_e = root === null || root === void 0 ? void 0 : root.constructor) === null || _e === void 0 ? void 0 : _e.name].members["layout"]) {
                        useThis = true;
                        this.variables.addVariable("this", root);
                    }
                    for (var key in parser.data) {
                        var com = parser.data[key];
                        var _new_ = com["_new_"];
                        if (_new_) {
                            var pos = _new_[0].node.pos;
                            var end = _new_[0].node.end;
                            for (var x = 0; x < values.length; x++) {
                                var val = values[x];
                                if (val.pos >= pos && val.pos <= end) {
                                    val.name = key;
                                }
                            }
                        }
                    }
                    var ignoreVar = [];
                    for (var x = 0; x < values.length; x++) {
                        var val = values[x];
                        var sname = val.name;
                        var found = false;
                        this.variables.value.forEach((it) => {
                            if (it.name === sname)
                                found = true;
                        });
                        //sometimes does a constructor create other Components so we need the first one
                        if (found)
                            continue;
                        if (sname && this.variables.getObjectFromVariable(sname) === undefined) {
                            if (ignoreVar.indexOf(sname) === -1) {
                                if (useThis && root === val.component)
                                    ignoreVar.push(sname); //do nothing
                                else
                                    this.variables.addVariable(sname, val.component, false);
                            }
                        }
                    }
                    this.variables.updateCache();
                    this.variables.update();
                    // parser.parse(,)
                }
                return parser;
            }
        }
        /**
         * load the right editor for the returned value
         */
        async _processEvalResult(ret, filename) {
            //_this.variables.addVariable("me", ret.me);
            var _this = this;
            _this.variables.updateCache();
            if (ret instanceof Component_1.Component && ret["reporttype"] === undefined) {
                //require(["jassijs_editor/ComponentDesigner", "jassijs_editor/util/Parser"], function () {
                //    var ComponentDesigner = classes.getClass("jassijs_editor.ComponentDesigner");
                //   var Parser = classes.getClass("jassijs_editor.base.Parser");
                var ComponentDesigner = await Classes_1.classes.loadClass("jassijs_editor.ComponentDesigner");
                var Parser = await Classes_1.classes.loadClass("jassijs_editor.util.Parser");
                var parser = new Parser();
                // await _this.fillVariablesAndSetupParser(filename, ret, ret, {},parser);
                if (!((_this._design) instanceof ComponentDesigner)) {
                    _this._design = new ComponentDesigner();
                    _this._main.add(_this._design, "Design", "design");
                    _this._design["codeEditor"] = _this;
                }
                //@ts-ignore
                _this._design.connectParser(parser);
                _this._design["designedComponent"] = ret;
                await _this.fillVariablesAndSetupParser(filename, ret, ret, {}, parser);
                _this._design["editDialog"](true);
                //});
            }
            else if (ret["reportdesign"] !== undefined) {
                var Parser = await Classes_1.classes.loadClass("jassijs_editor.util.Parser");
                var ReportDesigner = await Classes_1.classes.loadClass("jassijs_report.designer.ReportDesigner");
                var ReportDesign = await Classes_1.classes.loadClass("jassijs_report.ReportDesign");
                if (!((_this._design) instanceof ReportDesigner)) {
                    _this._design = new ReportDesigner();
                    _this._main.add(_this._design, "Design", "design");
                    _this._design["codeEditor"] = _this;
                    parser = new Parser();
                    parser.classScope = undefined; // [{ classname: _this._design?.constructor?.name, methodname: "layout" }, { classname: undefined, methodname: "test" }];
                    //@ts-ignore
                    _this._design.connectParser(parser);
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
        async _evalCodeOnLoad(data) {
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            var breakpoints = _this._codePanel.getBreakpoints();
            var filename = _this._file.replace(".ts", "$temp.ts");
            await jassijs.debugger.removeBreakpointsForFile(filename);
            for (var line in breakpoints) {
                if (breakpoints[line]) {
                    var row = lines[line].length;
                    await jassijs.debugger.breakpointChanged(filename, line, row, true, "debugpoint");
                }
            }
            var islocaldb = Classes_1.classes.getClass("jassijs_localserver.DBManager");
            if (islocaldb && code.indexOf("@$DBObject(") > -1) {
                islocaldb.destroyConnection();
            }
            if (data.test !== undefined || window.reportdesign) {
                //capure created Components
                function hook(name, component) {
                    var _a;
                    try {
                        throw new Error("getstack");
                    }
                    catch (ex) {
                        if (((_a = ex === null || ex === void 0 ? void 0 : ex.stack) === null || _a === void 0 ? void 0 : _a.indexOf("$temp.js")) != -1)
                            component["__stack"] = ex.stack;
                    }
                }
                Component_1.Component.onComponentCreated(hook);
                var ret;
                if (data.test) {
                    ret = await data.test(new Test_1.Test());
                }
                else {
                    if (window.reportdesign) {
                        ret = {
                            reportdesign: reportdesign
                        };
                    }
                    else {
                        Component_1.Component.offComponentCreated(hook);
                        return;
                    }
                }
                // Promise.resolve(ret).then(async function(ret) {
                if (ret !== undefined) {
                    await this._processEvalResult(ret, filename);
                    Component_1.Component.offComponentCreated(hook);
                }
                Component_1.Component.offComponentCreated(hook);
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
        async evalServerside() {
            var code = this._codePanel.value;
            var testcode = await new Server_1.Server().loadFile(this.file);
            var hasModified = testcode !== code;
            if (hasModified) {
                (0, Notify_1.notify)("please save code before test", "error");
                return undefined;
            }
            var res = await new Server_1.Server().testServersideFile(this._file.substring(0, this._file.length - 3));
            return res;
        }
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
            var _a;
            this.__evalToCursorReached = false;
            this.variables.clear();
            var code = this._codePanel.value;
            var lines = code.split("\n");
            var _this = this;
            if ((_a = this.file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside/")) {
                var res = await this.evalServerside();
                await this._processEvalResult(res);
                return;
            }
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
            window.reportdesign = undefined;
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
            //@ts-ignore
            require(["js/" + jsfile + ".js"], onload, /*error*/ function (err) {
                //console.log("reload");
                window.setTimeout(function () {
                    //@ts-ignore
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
         * gets the name object of the given variabel
         * @param {string} ob - the name of the variable
         */
        removeVariableInDesign(varname) {
            return this.variables.removeVariable(varname);
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
            var _a;
            var s = this.file.split("/");
            s = s[s.length - 1];
            if ((_a = this.file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside"))
                s = s + "(s)";
            return s;
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
        (0, Property_1.$Property)({ isUrlTag: true, id: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], CodeEditor.prototype, "file", null);
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], CodeEditor.prototype, "line", null);
    CodeEditor = CodeEditor_1 = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.CodeEditor"),
        __metadata("design:paramtypes", [Object])
    ], CodeEditor);
    exports.CodeEditor = CodeEditor;
    async function test() {
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = "100%";
        editor.width = "100%";
        //await editor.openFile(url);
        editor.file = "$serverside/jassijs_report/TestServerreport.ts"; //"tests/TestDialog.ts";
        setTimeout(() => {
            editor.evalCode();
        }, 500);
        Windows_1.default.add(editor, editor.title);
        // debugger;
        // var k=await new Server().testServersideFile("$serverside/jassijs_report/TestServerreport");
    }
    exports.test = test;
    ;
});
//jassijs.myRequire(modul.css["jassijs_editor.css"]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfZWRpdG9yL0NvZGVFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUF3QkEsT0FBTyxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0lBVTdDLElBQU0sNEJBQTRCLEdBQWxDLE1BQU0sNEJBQTRCO0tBS2pDLENBQUE7SUFIRztRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsY0FBYyxDQUFDLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxJQUFJLEVBQUUsQ0FBQzs7bUZBQzVFO0lBRWxDO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDOzt3RkFDckU7SUFKckMsNEJBQTRCO1FBRmpDLElBQUEsOEJBQW1CLEdBQUU7UUFDckIsSUFBQSxpQkFBTSxFQUFDLDZDQUE2QyxDQUFDO09BQ2hELDRCQUE0QixDQUtqQztJQUdEOzs7T0FHRztJQUVILElBQWEsVUFBVSxrQkFBdkIsTUFBYSxVQUFXLFNBQVEsYUFBSztRQWNqQyxZQUFZLGFBQStELFNBQVM7WUFDaEYsS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLG1DQUFnQixFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUNoQyxtR0FBbUc7WUFDbkcsSUFBSSxLQUFLLEdBQUcsQ0FBQyxn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QUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzs7MENBRzdCO0lBN3hCUSxVQUFVO1FBRHRCLElBQUEsaUJBQU0sRUFBQywyQkFBMkIsQ0FBQzs7T0FDdkIsVUFBVSxDQTh6QnRCO0lBOXpCWSxnQ0FBVTtJQWcwQmhCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7UUFDOUIseUNBQXlDO1FBQ3pDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLDZCQUE2QjtRQUM3QixNQUFNLENBQUMsSUFBSSxHQUFHLGdEQUFnRCxDQUFDLENBQUEsd0JBQXdCO1FBQ3ZGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDWixNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFdEIsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1IsaUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsQyxZQUFZO1FBQ1osOEZBQThGO0lBQ2xHLENBQUM7SUFkRCxvQkFjQztJQUFBLENBQUM7O0FBQ0YscURBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgQ29kZVBhbmVsIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVQYW5lbFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZVBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvVmFyaWFibGVQYW5lbFwiO1xyXG5pbXBvcnQgeyBEb2NraW5nQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvRG9ja2luZ0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBFcnJvclBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvRXJyb3JQYW5lbFwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcclxuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2VydmVyXCI7XHJcbmltcG9ydCB7IFJlbG9hZGVyIH0gZnJvbSBcImphc3NpanMvdXRpbC9SZWxvYWRlclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcblxyXG5pbXBvcnQgeyBBY2VQYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9BY2VQYW5lbFwiO1xyXG5pbXBvcnQgdHlwZXNjcmlwdCwgeyBUeXBlc2NyaXB0IH0gZnJvbSBcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBNb25hY29QYW5lbCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Nb25hY29QYW5lbFwiO1xyXG5pbXBvcnQgeyAkU2V0dGluZ3NEZXNjcmlwdG9yLCBTZXR0aW5ncyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9TZXR0aW5nc1wiO1xyXG5pbXBvcnQgeyBUZXN0IH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1Rlc3RcIjtcclxuaW1wb3J0IG1vZHVsIGZyb20gXCIuL21vZHVsXCI7XHJcbmltcG9ydCB7IGN1cnJlbnRzZXR0aW5ncyB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQ3VycmVudFNldHRpbmdzXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBub3RpZnkgfSBmcm9tIFwiamFzc2lqcy91aS9Ob3RpZnlcIjtcclxuXHJcbmphc3NpanMuaW5jbHVkZUNTU0ZpbGUoXCJqYXNzaWpzX2VkaXRvci5jc3NcIik7XHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEtub3duU2V0dGluZ3Mge1xyXG4gICAgICAgIERldmVsb3BtZW50X0RlZmF1bHRFZGl0b3I6IFwiYWNlXCIgfCBcIm1vbmFjb1wiIHwgXCJhY2VPbkJyb3dzZXJcIjtcclxuICAgICAgICBEZXZlbG9wbWVudF9Nb2FuYWNvRWRpdG9yVGhlbWU6IFwidnMtZGFya1wiIHwgXCJ2cy1saWdodFwiIHwgXCJoYy1ibGFja1wiO1xyXG4gICAgfVxyXG59XHJcbkAkU2V0dGluZ3NEZXNjcmlwdG9yKClcclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JTZXR0aW5nc0Rlc2NyaXB0b3JcIilcclxuY2xhc3MgQ29kZUVkaXRvclNldHRpbmdzRGVzY3JpcHRvciB7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1wiYWNlXCIsIFwibW9uYWNvXCIsIFwiYWNlT25Ccm93c2VyXCJdLCBkZWZhdWx0OiBcImFjZU9uQnJvd3NlclwiLCBjaG9vc2VGcm9tU3RyaWN0OiB0cnVlIH0pXHJcbiAgICBEZXZlbG9wbWVudF9EZWZhdWx0RWRpdG9yOiBzdHJpbmc7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1widnMtZGFya1wiLCBcInZzLWxpZ2h0XCIsIFwiaGMtYmxhY2tcIl0sIGRlZmF1bHQ6IFwidnMtbGlnaHRcIiwgY2hvb3NlRnJvbVN0cmljdDogdHJ1ZSB9KVxyXG4gICAgRGV2ZWxvcG1lbnRfTW9hbmFjb0VkaXRvclRoZW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUGFuZWwgZm9yIGVkaXRpbmcgc291cmNlc1xyXG4gKiBAY2xhc3MgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvclxyXG4gKi9cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JcIilcclxuZXhwb3J0IGNsYXNzIENvZGVFZGl0b3IgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBfbWFpbjogRG9ja2luZ0NvbnRhaW5lcjtcclxuICAgIF9jb2RlVmlldzogUGFuZWw7XHJcbiAgICBfY29kZVRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2NvZGVQYW5lbDogQ29kZVBhbmVsO1xyXG4gICAgX2Vycm9yczogRXJyb3JQYW5lbDtcclxuICAgIF9maWxlOiBzdHJpbmc7XHJcbiAgICB2YXJpYWJsZXM6IFZhcmlhYmxlUGFuZWw7XHJcbiAgICBfZGVzaWduOiBQYW5lbDtcclxuICAgIGVkaXRNb2RlOiBib29sZWFuO1xyXG4gICAgX19ldmFsVG9DdXJzb3JSZWFjaGVkOiBib29sZWFuO1xyXG4gICAgYXV0b0NvbXBsZXRlQnV0dG9uOiBCdXR0b247XHJcblxyXG4gICAgcHJpdmF0ZSBfbGluZTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogeyBjb2RlUGFuZWw/OiBDb2RlUGFuZWwsIGhpZGVUb29sYmFyPzogYm9vbGVhbiB9ID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1heGltaXplKCk7XHJcbiAgICAgICAgdGhpcy5fbWFpbiA9IG5ldyBEb2NraW5nQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIC8vaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIGxldCBtb2JpbCA9ICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpO1xyXG4gICAgICAgIGxldCBzZXR0ID0gY3VycmVudHNldHRpbmdzLmdldHMoU2V0dGluZ3Mua2V5cy5EZXZlbG9wbWVudF9EZWZhdWx0RWRpdG9yKTtcclxuICAgICAgICBpZiAocHJvcGVydGllcz8uY29kZVBhbmVsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVQYW5lbCA9IHByb3BlcnRpZXMuY29kZVBhbmVsO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIENvZGVQYW5lbC50eXBlc2NyaXB0ID0gdHlwZXNjcmlwdDtcclxuICAgICAgICAgICAgaWYgKHNldHQgPT09IFwiYWNlXCIgfHwgKG1vYmlsICYmIChzZXR0ID09PSBcImFjZU9uQnJvd3NlclwiIHx8IHNldHQgPT09IHVuZGVmaW5lZCkpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgQWNlUGFuZWwoKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgTW9uYWNvUGFuZWwoKTtcclxuICAgICAgICAgICAgICAgIC8vIHRoaXMuX2NvZGVQYW5lbCA9IG5ldyBBY2VQYW5lbCgpOyBcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2Vycm9ycyA9IG5ldyBFcnJvclBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5fZmlsZSA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMgPSBuZXcgVmFyaWFibGVQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnbiA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2luaXQocHJvcGVydGllcz8uaGlkZVRvb2xiYXIpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgX2luaXRDb2RlUGFuZWwoKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLm1vZGUgPSBcInR5cGVzY3JpcHRcIjtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSAzMXB4KVwiO1xyXG4gICAgICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLm9uQnJlYWtwb2ludENoYW5nZWQoZnVuY3Rpb24gKGxpbmUsIGNvbHVtbiwgZW5hYmxlLCB0eXBlKSB7XHJcbiAgICAgICAgICAgIGphc3NpanMuZGVidWdnZXIuYnJlYWtwb2ludENoYW5nZWQoX3RoaXMuX2ZpbGUsIGxpbmUsIGNvbHVtbiwgZW5hYmxlLCB0eXBlKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9pbml0KGhpZGVUb29sYmFyOiBib29sZWFuKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9pbml0Q29kZVBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXdbXCJob3Jpem9udGFsXCJdID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgaWYgKGhpZGVUb29sYmFyICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVWaWV3LmFkZCh0aGlzLl9jb2RlVG9vbGJhcik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyW1wiaG9yaXpvbnRhbFwiXSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmhlaWdodCA9IFwiMzBcIjtcclxuXHJcbiAgICAgICAgICAgIHZhciBydW4gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHJ1bi5pY29uID0gXCJtZGkgbWRpLWNhci1oYXRjaGJhY2sgbWRpLTE4cHhcIjtcclxuICAgICAgICAgICAgcnVuLnRvb2x0aXAgPSBcIlJ1bihGNClcIjtcclxuICAgICAgICAgICAgcnVuLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZXZhbENvZGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZChydW4pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciBzYXZlID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBzYXZlLnRvb2x0aXAgPSBcIlNhdmUoQ3RybCtTKVwiO1xyXG4gICAgICAgICAgICBzYXZlLmljb24gPSBcIm1kaSBtZGktY29udGVudC1zYXZlIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHNhdmUub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5zYXZlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQoc2F2ZSk7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHVuZG8gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHVuZG8uaWNvbiA9IFwibWRpIG1kaS11bmRvIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHVuZG8udG9vbHRpcCA9IFwiVW5kbyAoU3RyZytaKVwiO1xyXG4gICAgICAgICAgICB1bmRvLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2NvZGVQYW5lbC51bmRvKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQodW5kbyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ290byA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgICAgZ290by5pY29uID0gXCJtZGkgbWRpLXJheS1zdGFydC1hcnJvdyBtZGktMThweFwiO1xyXG4gICAgICAgICAgICBnb3RvLnRvb2x0aXAgPSBcIkdvdG9cIjtcclxuICAgICAgICAgICAgZ290by5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmdvdG9EZWNsYXJhdGlvbigpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKGdvdG8pO1xyXG4gICAgICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZUJ1dHRvbiA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgICAgdGhpcy5hdXRvQ29tcGxldGVCdXR0b24uaWNvbiA9IFwibWRpIG1kaS1yb2JvdC1oYXBweS1vdXRsaW5lIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0b0NvbXBsZXRlQnV0dG9uLnRvb2x0aXAgPSBcImF1dG9jb21wbGV0ZSAoY3RybCBzcGFjZSlcIjtcclxuICAgICAgICAgICAgdGhpcy5hdXRvQ29tcGxldGVCdXR0b24ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29kZVBhbmVsLmF1dG9jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHRoaXMuYXV0b0NvbXBsZXRlQnV0dG9uKTtcclxuICAgICAgICAgICAgamFzc2lqc1tcIiRDb2RlRWRpdG9yXCJdID0gQ29kZUVkaXRvcjtcclxuICAgICAgICAgICAgLy8gJChnb3RvLmRvbSkuYXR0cihcIm9uZHJvcFwiLCBcImV2ZW50LnByZXZlbnREZWZhdWx0KCk7amFzc2lqcy4kQ29kZUVkaXRvci5zZWFyY2goZXZlbnQuZGF0YVRyYW5zZmVyLmdldERhdGEoJ3RleHQnKSk7XCIpO1xyXG4gICAgICAgICAgICAvLyAgJChnb3RvLmRvbSkuYXR0cihcIm9uZHJhZ292ZXJcIiwgXCJldmVudC5wcmV2ZW50RGVmYXVsdCgpO1wiKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvZGVWaWV3LmFkZCh0aGlzLl9jb2RlUGFuZWwpO1xyXG5cclxuICAgICAgICB0aGlzLl9tYWluLndpZHRoID0gXCJjYWxjKDEwMCUgLSAxcHgpXCI7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5oZWlnaHQgPSBcIjk5JVwiO1xyXG4gICAgICAgIHRoaXMuX21haW4ub25yZXNpemUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2NvZGVQYW5lbC5yZXNpemUoKTtcclxuXHJcbiAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvKnZhciB0ZXN0ID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgIHRlc3QuaWNvbiA9IFwibWRpIG1kaS1idWcgbWRpLTE4cHhcIjtcclxuICAgICAgICB0ZXN0LnRvb2x0aXAgPSBcIlRlc3RcIjtcclxuICAgICAgICB0ZXN0Lm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2YXIga2sgPSBfdGhpcy5fbWFpbi5sYXlvdXQ7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHRlc3QpOyovXHJcblxyXG5cclxuICAgICAgICBzdXBlci5hZGQodGhpcy5fbWFpbik7XHJcblxyXG4gICAgICAgIHRoaXMuX2luc3RhbGxWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcktleXMoKTtcclxuXHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuY3JlYXRlVGFibGUoKTtcclxuICAgICAgICAvLyAgIHRoaXMuX2NvZGVQYW5lbC5zZXRDb21wbGV0ZXIodGhpcyk7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vX3RoaXMuZWRpdG9yUHJvdmlkZXI9XCJhY2VcIjtcclxuICAgICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG4gICAgc3RhdGljIGFzeW5jIGFkZEZpbGVzVG9Db21wbGV0aW9uKGZpbGVuYW1lczogc3RyaW5nW10pIHtcclxuICAgICAgICAvLyBhd2FpdCB0eXBlc2NyaXB0LmluaXRTZXJ2aWNlKCk7XHJcblxyXG5cclxuICAgIH1cclxuXHJcbiAgICBfaW5zdGFsbFZpZXcoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fY29kZVZpZXcsIFwiQ29kZS4uXCIsIFwiY29kZVwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLnZhcmlhYmxlcywgXCJWYXJpYWJsZXNcIiwgXCJ2YXJpYWJsZXNcIik7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLl9lcnJvcnMsIFwiRXJyb3JzXCIsIFwiZXJyb3JzXCIpO1xyXG4gICAgICAgIHRoaXMuX21haW4ubGF5b3V0ID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJ3aWR0aFwiOjEwMCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6MzMuMzMzMzMzMzMzMzMzMzM2LFwiaGVpZ2h0XCI6ODAuMzQ2ODIwODA5MjQ4NTYsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb2RlLi5cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29kZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJuYW1lXCI6XCJjb2RlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJEZXNpZ25cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZGVzaWduXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJEZXNpZ25cIixcIm5hbWVcIjpcImRlc2lnblwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjoxOS42NTMxNzkxOTA3NTE0NDUsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjUwLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9J1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKnNldCBlZGl0b3JQcm92aWRlcih2YWx1ZTogXCJhY2VcIiB8IFwibW9uYWNvXCIpIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuZWRpdG9yUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgLy9zd2l0Y2ggdG8gbmV3IHByb3ZpZGVyXHJcbiAgICAgICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuX2NvZGVQYW5lbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJhY2VcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IEFjZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgTW9uYWNvUGFuZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pbml0Q29kZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVWaWV3LnJlbW92ZShvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVBhbmVsKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZT12YWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb249cG9zO1xyXG4gICAgICAgICAgICBvbGQuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0qL1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIF9zYXZlKGNvZGUpIHtcclxuICAgICAgICBhd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGUodGhpcy5fZmlsZSwgY29kZSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZiA9IHRoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIlwiKTtcclxuICAgICAgICBpZiAodGhpcy5fZmlsZT8uc3RhcnRzV2l0aChcIiRzZXJ2ZXJzaWRlL1wiKSkge1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiQCRcIikgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgcmVnaXN0cnkucmVsb2FkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgUmVsb2FkZXIuaW5zdGFuY2UucmVsb2FkSlMoZik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBzYXZlIHRoZSBjb2RlIHRvIHNlcnZlclxyXG4gICAgKi9cclxuICAgIHNhdmUoKSB7XHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9zYXZlKGNvZGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnb3RvIHRvIHRoZSBkZWNsYXJpYXRpb24gb24gY3Vyc29yXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdvdG9EZWNsYXJhdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZ290b0RlY2xhcmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZWFyY2ggdGV4dCBpbiBjbGFzc2VzIGF0IHRoZSBnaXZlbiB0ZXh0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRoZSB0ZXh0IHRvIHNlYXJjaFxyXG4gICAgICogQHJldHVybnMge2phc3NpanNfZWRpdG9yLkNvZGVFZGl0b3J9IC0gdGhlIGVkaXRvciBpbnN0YW5jZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgc2VhcmNoKHRleHQpIHtcclxuICAgICAgICAvL1RPRE8gYXNrIHR5cGVzY3JpcHQgc2VydmljZVxyXG4gICAgICAgIC8qIHZhciBmb3VuZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgdmFyIGNvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgIC8vRmFzdCBzZWFyY2hcclxuICAgICAgICAgZm9yICh2YXIgZmlsZSBpbiBjbGFzc2VzLmdldENhY2hlKCkpIHtcclxuICAgICAgICAgICAgIHZhciBmbmFtZSA9IGZpbGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgICAgICAgdmFyIGNsID0gY2xhc3Nlcy5nZXRDYWNoZSgpW2ZpbGVdO1xyXG4gICAgICAgICAgICAgdmFyIGNvZGUgPSBjbC50b1N0cmluZygpLnJlcGxhY2VBbGwoXCJcXHJcXG5cIiwgXCJcXG5cIik7XHJcbiAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKHRleHQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICBmb3VuZCA9IGZuYW1lICsgXCIuanNcIjtcclxuICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29kZTtcclxuICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgLy9EZWVwIHNlYXJjaCAoc2xvdylcclxuICAgICAgICAgICAgIHZhciBmaWxlcyA9IHJlZ2lzdHJ5LmdldEFsbEZpbGVzRm9yU2VydmljZShcImNsYXNzZXNcIik7XHJcbiAgICAgICAgICAgICBpZiAoZmlsZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgbGV0IGNvZGU6c3RyaW5nID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKGZpbGVzW3hdKTtcclxuICAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZih0ZXh0KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZpbGVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgaWYgKGZvdW5kICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgIHZhciBsaW5lID0gY29kZS5zdWJzdHJpbmcoMCwgY29udGVudC5pbmRleE9mKHRleHQpKS5zcGxpdChcIlxcblwiKS5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiI2RvPWphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3ImZmlsZT1cIiArIGZvdW5kICsgXCImbGluZT1cIiArIGxpbmUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvci5vcGVuKGZvdW5kK1wiOlwiK2xpbmUudG9TdHJpbmcoKStcIjowXCIpO1xyXG4gICAgICAgICB9Ki9cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1hbmFnZSBzaG9ydGN1dHNcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJLZXlzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmRvbS5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLCBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE1ICYmIGV2dC5zaGlmdEtleSkgey8vRjRcclxuICAgICAgICAgICAgICAgIC8vIHZhciB0aGlzcz10aGlzLl90aGlzLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vIHZhciBlZGl0b3IgPSBhY2UuZWRpdCh0aGlzLl90aGlzLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUpIHsvL0Y0XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDExNikgey8vRjVcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKFN0cmluZy5mcm9tQ2hhckNvZGUoZXZ0LndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAncycgJiYgZXZ0LmN0cmxLZXkpLyogJiYgKGV2dC53aGljaCA9PSAxOSkqLykgey8vU3RyK3NcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGV4dHJhY3QgbGluZXMgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIHRoZSBjb2RlXHJcbiAgICAgKiBAcmV0dXJucyB7W3N0cmluZ119IC0gYWxsIGxpbmVzXHJcbiAgICAgKi9cclxuICAgIF9jb2RlVG9MaW5lcyhjb2RlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChsaW5lc1t4XS5zdGFydHNXaXRoKFwiL1wiKSB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiIFwiKVxyXG4gICAgICAgICAgICAgICAgfHwgbGluZXNbeF0uc3RhcnRzV2l0aChcIipcIikgfHwgbGluZXNbeF0uc3RhcnRzV2l0aChcIlxcdFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGluZXNbeF0gPSBsaW5lc1t4XS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBfZXZhbFRvQ3Vyc29yUmVhY2hlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fX2V2YWxUb0N1cnNvclJlYWNoZWQgIT09IHRydWUpXHJcbiAgICAgICAgICAgIHRoaXMuX21haW4uc2hvdygnY29kZScpO1xyXG4gICAgICAgIHRoaXMuX19ldmFsVG9DdXJzb3JSZWFjaGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIHZhcmlhYmxlcyB0byB2YXJpYWJlbHBhbmVsXHJcbiAgICAgKiBAcGFyYW0gT2JqZWN0PHN0cmluZyxvYmplY3Q+IHZhcmlhYmxlcyBbXCJuYW1lXCJdPXZhbHVlXHJcbiAgICAgKi9cclxuICAgIGFkZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5hZGRBbGwodmFyaWFibGVzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKHVybDogc3RyaW5nLCByb290OiBDb21wb25lbnQsIGNvbXBvbmVudDogQ29tcG9uZW50LCBjYWNoZTogeyBbY29tcG9uZW50aWQ6IHN0cmluZ106IFt7IGNvbXBvbmVudDogQ29tcG9uZW50LCBsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyLCBwb3M6IG51bWJlciwgbmFtZTogc3RyaW5nIH1dIH0sIHBhcnNlcikge1xyXG5cclxuICAgICAgICB2YXIgdXNlVGhpcyA9IGZhbHNlO1xyXG4gICAgICAgIGlmIChjYWNoZVtjb21wb25lbnQuX2lkXSA9PT0gdW5kZWZpbmVkICYmIGNvbXBvbmVudFtcIl9fc3RhY2tcIl0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2YXIgbGluZXMgPSBjb21wb25lbnRbXCJfX3N0YWNrXCJdPy5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNsaW5lOiBzdHJpbmcgPSBsaW5lc1t4XTtcclxuICAgICAgICAgICAgICAgIGlmIChzbGluZS5pbmRleE9mKFwiJHRlbXAuanNcIikgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNwbCA9IHNsaW5lLnNwbGl0KFwiOlwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZW50ciA9IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChjYWNoZVtjb21wb25lbnQuX2lkXSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYWNoZVtjb21wb25lbnQuX2lkXSA9IDxhbnk+W107XHJcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbY29tcG9uZW50Ll9pZF0ucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpbmU6IE51bWJlcihzcGxbc3BsLmxlbmd0aCAtIDJdKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiBOdW1iZXIoc3BsW3NwbC5sZW5ndGggLSAxXS5yZXBsYWNlKFwiKVwiLCBcIlwiKSksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudDogY29tcG9uZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3M6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHVuZGVmaW5lZFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKHVybCwgcm9vdCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0sIGNhY2hlLCBwYXJzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT09IHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIC8vZmVydGlnXHJcbiAgICAgICAgICAgICAgICB2YXIgaGggPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIFRTU291cmNlTWFwID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlRTU291cmNlTWFwXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIE9iamVjdC52YWx1ZXMoY2FjaGUpLmZvckVhY2goKGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBlLmZvckVhY2goZiA9PiB2YWx1ZXMucHVzaChmKSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdG1hcCA9IGF3YWl0IG5ldyBUU1NvdXJjZU1hcCgpLmdldExpbmVzRnJvbUpTKFwianMvXCIgKyB1cmwucmVwbGFjZShcIi50c1wiLCBcIi5qc1wiKSwgdmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0bWFwLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbCA9IHZhbHVlc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICB2YWwuY29sdW1uID0gdG1hcFt4XS5jb2x1bW47XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsLmxpbmUgPSB0bWFwW3hdLmxpbmU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsLnBvcyA9IHRoaXMuX2NvZGVQYW5lbC5wb3NpdGlvblRvTnVtYmVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcm93OiB2YWwubGluZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uOiB2YWwuY29sdW1uXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9zZXR1cENsYXNzY29wZVxyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kc2NvcGU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4eCA9IDA7IHh4IDwgY2FjaGVbcm9vdC5faWRdLmxlbmd0aDsgeHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kc2NvcGUgPSBwYXJzZXIuZ2V0Q2xhc3NTY29wZUZyb21Qb3NpdGlvbih0aGlzLl9jb2RlUGFuZWwudmFsdWUsIGNhY2hlW3Jvb3QuX2lkXVt4eF0ucG9zKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmRzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgc2NvcGUgPSBbeyBjbGFzc25hbWU6IHJvb3Q/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH1dO1xyXG4gICAgICAgICAgICAgICAgaWYgKGZvdW5kc2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGUgPSBbeyBjbGFzc25hbWU6IHJvb3Q/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH0sIGZvdW5kc2NvcGVdO1xyXG5cclxuICAgICAgICAgICAgICAgIHBhcnNlci5wYXJzZSh0aGlzLl9jb2RlUGFuZWwudmFsdWUsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIC8vaWYgbGF5b3V0IGlzIHJlbmRlcmVkIGFuZCBhbiBvdGhlciB2YXJpYWJsZSBpcyBhc3NpZ25lZCB0byB0aGlzLCB0aGVuIHJlbW92ZSB0aHMgdmFyaWFibGVcclxuICAgICAgICAgICAgICAgIGlmIChwYXJzZXIuY2xhc3Nlc1tyb290Py5jb25zdHJ1Y3Rvcj8ubmFtZV0gJiYgcGFyc2VyLmNsYXNzZXNbcm9vdD8uY29uc3RydWN0b3I/Lm5hbWVdLm1lbWJlcnNbXCJsYXlvdXRcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICB1c2VUaGlzID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcInRoaXNcIiwgcm9vdCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcGFyc2VyLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgY29tID0gcGFyc2VyLmRhdGFba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgX25ld18gPSBjb21bXCJfbmV3X1wiXTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoX25ld18pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IF9uZXdfWzBdLm5vZGUucG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZW5kID0gX25ld19bMF0ubm9kZS5lbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdmFsdWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsID0gdmFsdWVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbC5wb3MgPj0gcG9zICYmIHZhbC5wb3MgPD0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsLm5hbWUgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgaWdub3JlVmFyID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhbHVlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWwgPSB2YWx1ZXNbeF07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNuYW1lID0gdmFsLm5hbWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBmb3VuZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVzLnZhbHVlLmZvckVhY2goKGl0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpdC5uYW1lID09PSBzbmFtZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAvL3NvbWV0aW1lcyBkb2VzIGEgY29uc3RydWN0b3IgY3JlYXRlIG90aGVyIENvbXBvbmVudHMgc28gd2UgbmVlZCB0aGUgZmlyc3Qgb25lXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGZvdW5kKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNuYW1lICYmIHRoaXMudmFyaWFibGVzLmdldE9iamVjdEZyb21WYXJpYWJsZShzbmFtZSkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWdub3JlVmFyLmluZGV4T2Yoc25hbWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHVzZVRoaXMgJiYgcm9vdCA9PT0gdmFsLmNvbXBvbmVudClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZ25vcmVWYXIucHVzaChzbmFtZSk7Ly9kbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoc25hbWUsIHZhbC5jb21wb25lbnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIHBhcnNlci5wYXJzZSgsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogbG9hZCB0aGUgcmlnaHQgZWRpdG9yIGZvciB0aGUgcmV0dXJuZWQgdmFsdWVcclxuICAgICAqL1xyXG4gICAgcHJpdmF0ZSBhc3luYyBfcHJvY2Vzc0V2YWxSZXN1bHQocmV0LCBmaWxlbmFtZSkge1xyXG4gICAgICAgIC8vX3RoaXMudmFyaWFibGVzLmFkZFZhcmlhYmxlKFwibWVcIiwgcmV0Lm1lKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgIGlmIChyZXQgaW5zdGFuY2VvZiBDb21wb25lbnQgJiYgcmV0W1wicmVwb3J0dHlwZVwiXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIC8vcmVxdWlyZShbXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lclwiLCBcImphc3NpanNfZWRpdG9yL3V0aWwvUGFyc2VyXCJdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIC8vICAgIHZhciBDb21wb25lbnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgLy8gICB2YXIgUGFyc2VyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfZWRpdG9yLmJhc2UuUGFyc2VyXCIpO1xyXG4gICAgICAgICAgICB2YXIgQ29tcG9uZW50RGVzaWduZXIgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvbXBvbmVudERlc2lnbmVyXCIpO1xyXG4gICAgICAgICAgICB2YXIgUGFyc2VyID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclwiKTtcclxuICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICAgICAgICAgICAgLy8gYXdhaXQgX3RoaXMuZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKGZpbGVuYW1lLCByZXQsIHJldCwge30scGFyc2VyKTtcclxuICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgQ29tcG9uZW50RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduID0gbmV3IENvbXBvbmVudERlc2lnbmVyKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbi5jb25uZWN0UGFyc2VyKHBhcnNlcik7XHJcbiAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJkZXNpZ25lZENvbXBvbmVudFwiXSA9IHJldDtcclxuXHJcbiAgICAgICAgICAgIGF3YWl0IF90aGlzLmZpbGxWYXJpYWJsZXNBbmRTZXR1cFBhcnNlcihmaWxlbmFtZSwgcmV0LCByZXQsIHt9LCBwYXJzZXIpO1xyXG4gICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZWRpdERpYWxvZ1wiXSh0cnVlKTtcclxuICAgICAgICAgICAgLy99KTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJldFtcInJlcG9ydGRlc2lnblwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHZhciBQYXJzZXIgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXCIpO1xyXG4gICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduZXIgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanNfcmVwb3J0LmRlc2lnbmVyLlJlcG9ydERlc2lnbmVyXCIpO1xyXG4gICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnREZXNpZ25cIik7XHJcbiAgICAgICAgICAgIGlmICghKChfdGhpcy5fZGVzaWduKSBpbnN0YW5jZW9mIFJlcG9ydERlc2lnbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbiA9IG5ldyBSZXBvcnREZXNpZ25lcigpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgICAgIHBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICAgICAgICAgICAgICAgIHBhcnNlci5jbGFzc1Njb3BlID0gdW5kZWZpbmVkOy8vIFt7IGNsYXNzbmFtZTogX3RoaXMuX2Rlc2lnbj8uY29uc3RydWN0b3I/Lm5hbWUsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfSwgeyBjbGFzc25hbWU6IHVuZGVmaW5lZCwgbWV0aG9kbmFtZTogXCJ0ZXN0XCIgfV07XHJcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24uY29ubmVjdFBhcnNlcihwYXJzZXIpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmVwID0gbmV3IFJlcG9ydERlc2lnbigpO1xyXG4gICAgICAgICAgICByZXAuZGVzaWduID0gT2JqZWN0LmFzc2lnbih7fSwgcmV0LnJlcG9ydGRlc2lnbik7XHJcbiAgICAgICAgICAgIGlmIChyZXQudmFsdWUgJiYgcmVwLmRlc2lnbi5kYXRhID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXAuZGVzaWduLmRhdGEgPSByZXQudmFsdWU7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHJldC5kYXRhICYmIHJlcC5kZXNpZ24uZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5kYXRhID0gcmV0LmRhdGE7XHJcblxyXG4gICAgICAgICAgICBpZiAocmV0LnBhcmFtZXRlciAmJiByZXAuZGVzaWduLnBhcmFtZXRlciA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5wYXJhbWV0ZXIgPSByZXQucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXA7XHJcblxyXG4gICAgICAgICAgICAvKiAgIHJlcXVpcmUoW1wiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCJdLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgIHZhciByZCA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnREZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICBsZXQgcmVwID0gcmRbXCJmcm9tSlNPTlwiXShyZXQpO1xyXG4gICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXA7XHJcbiAgICAgICAgICAgICAgIH0pOyovXHJcblxyXG5cclxuICAgICAgICB9LyplbHNlIGlmIChyZXRbXCJyZXBvcnR0eXBlXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlKFtcImphc3NpanNfcmVwb3J0L2Rlc2lnbmVyL1JlcG9ydERlc2lnbmVyXCJdLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBSZXBvcnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5kZXNpZ25lci5SZXBvcnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgUmVwb3J0RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduID0gbmV3IFJlcG9ydERlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fbWFpbi5hZGQoX3RoaXMuX2Rlc2lnbiwgXCJEZXNpZ25cIiwgXCJkZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiY29kZUVkaXRvclwiXSA9IF90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJkZXNpZ25lZENvbXBvbmVudFwiXSA9IHJldDtcclxuXHJcbiAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0qL1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhc3luYyBfZXZhbENvZGVPbkxvYWQoZGF0YSkge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmNsZWFyKCk7XHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciBicmVha3BvaW50cyA9IF90aGlzLl9jb2RlUGFuZWwuZ2V0QnJlYWtwb2ludHMoKTtcclxuICAgICAgICB2YXIgZmlsZW5hbWUgPSBfdGhpcy5fZmlsZS5yZXBsYWNlKFwiLnRzXCIsIFwiJHRlbXAudHNcIik7XHJcbiAgICAgICAgYXdhaXQgamFzc2lqcy5kZWJ1Z2dlci5yZW1vdmVCcmVha3BvaW50c0ZvckZpbGUoZmlsZW5hbWUpO1xyXG4gICAgICAgIGZvciAodmFyIGxpbmUgaW4gYnJlYWtwb2ludHMpIHtcclxuICAgICAgICAgICAgaWYgKGJyZWFrcG9pbnRzW2xpbmVdKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm93ID0gbGluZXNbbGluZV0ubGVuZ3RoO1xyXG4gICAgICAgICAgICAgICAgYXdhaXQgamFzc2lqcy5kZWJ1Z2dlci5icmVha3BvaW50Q2hhbmdlZChmaWxlbmFtZSwgbGluZSwgcm93LCB0cnVlLCBcImRlYnVncG9pbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBpc2xvY2FsZGIgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19sb2NhbHNlcnZlci5EQk1hbmFnZXJcIik7XHJcbiAgICAgICAgaWYgKGlzbG9jYWxkYiAmJiBjb2RlLmluZGV4T2YoXCJAJERCT2JqZWN0KFwiKSA+IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAoPGFueT5pc2xvY2FsZGIpLmRlc3Ryb3lDb25uZWN0aW9uKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChkYXRhLnRlc3QgIT09IHVuZGVmaW5lZCB8fCB3aW5kb3cucmVwb3J0ZGVzaWduKSB7XHJcbiAgICAgICAgICAgIC8vY2FwdXJlIGNyZWF0ZWQgQ29tcG9uZW50c1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBob29rKG5hbWUsIGNvbXBvbmVudDogQ29tcG9uZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImdldHN0YWNrXCIpO1xyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXgpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZXg/LnN0YWNrPy5pbmRleE9mKFwiJHRlbXAuanNcIikgIT0gLTEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFtcIl9fc3RhY2tcIl0gPSBleC5zdGFjaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDb21wb25lbnQub25Db21wb25lbnRDcmVhdGVkKGhvb2spO1xyXG4gICAgICAgICAgICB2YXIgcmV0O1xyXG4gICAgICAgICAgICBpZiAoZGF0YS50ZXN0KSB7XHJcbiAgICAgICAgICAgICAgICByZXQgPSBhd2FpdCBkYXRhLnRlc3QobmV3IFRlc3QoKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAod2luZG93LnJlcG9ydGRlc2lnbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldCA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwb3J0ZGVzaWduOiByZXBvcnRkZXNpZ25cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5vZmZDb21wb25lbnRDcmVhdGVkKGhvb2spO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUHJvbWlzZS5yZXNvbHZlKHJldCkudGhlbihhc3luYyBmdW5jdGlvbihyZXQpIHtcclxuICAgICAgICAgICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgYXdhaXQgdGhpcy5fcHJvY2Vzc0V2YWxSZXN1bHQocmV0LCBmaWxlbmFtZSk7XHJcbiAgICAgICAgICAgICAgICBDb21wb25lbnQub2ZmQ29tcG9uZW50Q3JlYXRlZChob29rKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgQ29tcG9uZW50Lm9mZkNvbXBvbmVudENyZWF0ZWQoaG9vayk7XHJcbiAgICAgICAgICAgIC8vICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhc3luYyBzYXZlVGVtcEZpbGUoZmlsZTogc3RyaW5nLCBjb2RlOiBzdHJpbmcpIHtcclxuXHJcblxyXG4gICAgICAgIC8vQHRzLWlnbm9yZSBcclxuICAgICAgICB2YXIgdHNzID0gYXdhaXQgaW1wb3J0KFwiamFzc2lqc19lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCIpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZSBcclxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBUeXBlc2NyaXB0LmNvbXBpbGVyU2V0dGluZ3M7XHJcbiAgICAgICAgc2V0dGluZ3NbXCJpbmxpbmVTb3VyY2VNYXBcIl0gPSB0cnVlO1xyXG4gICAgICAgIHNldHRpbmdzW1wiaW5saW5lU291cmNlc1wiXSA9IHRydWU7XHJcbiAgICAgICAgdmFyIGZpbGVzID0gYXdhaXQgdHNzLmRlZmF1bHQudHJhbnNwaWxlKGZpbGUgKyBcIi50c1wiLCBjb2RlKTtcclxuXHJcbiAgICAgICAgdmFyIGNvZGV0cyA9IC0xO1xyXG4gICAgICAgIHZhciBjb2RlbWFwID0gLTE7XHJcbiAgICAgICAgdmFyIGNvZGVqcyA9IC0xO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZmlsZXMuZmlsZU5hbWVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5maWxlTmFtZXNbeF0uZW5kc1dpdGgoXCIudHNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGV0cyA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpbGVzLmZpbGVOYW1lc1t4XS5lbmRzV2l0aChcIi5qcy5tYXBcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGVtYXAgPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5maWxlTmFtZXNbeF0uZW5kc1dpdGgoXCIuanNcIikpIHtcclxuICAgICAgICAgICAgICAgIGNvZGVqcyA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLyogIHZhciBhbGwgPSBKU09OLnBhcnNlKGZpbGVzLmNvbnRlbnRzW2NvZGVtYXBdKTtcclxuICAgICAgICAgIGFsbFtcInNvdXJjZXNDb250ZW50XCJdID0gW2ZpbGVzLmNvbnRlbnRzW2NvZGV0c11dO1xyXG4gICAgICAgICAgZmlsZXMuY29udGVudHNbY29kZW1hcF0gPSBKU09OLnN0cmluZ2lmeShhbGwpO1xyXG4gICAgICAgICAgdmFyIGI2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KGZpbGVzLmNvbnRlbnRzW2NvZGVtYXBdKSkpO1xyXG4gICAgICAgICAgdmFyIHBvcyA9IGZpbGVzLmNvbnRlbnRzW2NvZGVqc10uaW5kZXhPZihcIi8vXCIgKyBcIiMgc291cmNlTWFwcGluZ1VSTD1cIik7XHJcbiAgICAgICAgICBmaWxlcy5jb250ZW50c1tjb2RlanNdID0gZmlsZXMuY29udGVudHNbY29kZWpzXS5zdWJzdHJpbmcoMCwgcG9zKTtcclxuICAgICAgICAgIGZpbGVzLmNvbnRlbnRzW2NvZGVqc10gPSBmaWxlcy5jb250ZW50c1tjb2RlanNdICsgXCIvL1wiICsgXCIjIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmODtiYXNlNjQsXCIgKyBiNjQ7XHJcbiAgICAgICAgICAqL1xyXG4gICAgICAgIGNvbnN0IGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcclxuXHJcbiAgICAgICAgdmFyIHJldCA9IG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xyXG4gICAgICAgICAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IChldnQpID0+IHtcclxuICAgICAgICAgICAgICAgIGNoYW5uZWwucG9ydDEuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIHJlcyhldnQpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGxldCBhYnNwYXRoID0gbG9jYXRpb24ub3JpZ2luICsgbG9jYXRpb24ucGF0aG5hbWU7XHJcbiAgICAgICAgYWJzcGF0aCA9IGFic3BhdGguc3Vic3RyaW5nKDAsIGFic3BhdGgubGFzdEluZGV4T2YoXCIvXCIpICsgMSk7XHJcbiAgICAgICAgbmF2aWdhdG9yLnNlcnZpY2VXb3JrZXIuY29udHJvbGxlci5wb3N0TWVzc2FnZSh7XHJcbiAgICAgICAgICAgIHR5cGU6ICdTQVZFX0ZJTEUnLFxyXG4gICAgICAgICAgICBmaWxlbmFtZTogYWJzcGF0aCArIGZpbGVzLmZpbGVOYW1lc1tjb2RlanNdLFxyXG4gICAgICAgICAgICBjb2RlOiBmaWxlcy5jb250ZW50c1tjb2RlanNdXHJcbiAgICAgICAgfSwgW2NoYW5uZWwucG9ydDJdKTtcclxuICAgICAgICB2YXIgdGVzdCA9IGF3YWl0IHJldDtcclxuICAgIH1cclxuICAgIGFzeW5jIGV2YWxTZXJ2ZXJzaWRlKCkge1xyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgICAgIHZhciB0ZXN0Y29kZSA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5sb2FkRmlsZSh0aGlzLmZpbGUpO1xyXG4gICAgICAgIHZhciBoYXNNb2RpZmllZCA9IHRlc3Rjb2RlICE9PSBjb2RlO1xyXG4gICAgICAgIGlmIChoYXNNb2RpZmllZCkge1xyXG4gICAgICAgICAgICBub3RpZnkoXCJwbGVhc2Ugc2F2ZSBjb2RlIGJlZm9yZSB0ZXN0XCIsIFwiZXJyb3JcIik7XHJcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXMgPSBhd2FpdCBuZXcgU2VydmVyKCkudGVzdFNlcnZlcnNpZGVGaWxlKHRoaXMuX2ZpbGUuc3Vic3RyaW5nKDAsIHRoaXMuX2ZpbGUubGVuZ3RoIC0gMykpO1xyXG4gICAgICAgIHJldHVybiByZXM7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGV4ZWN1dGUgdGhlIGN1cnJlbnQgY29kZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0b0N1cnNvciAtICBpZiB0cnVlIHRoZSB2YXJpYWJsZXMgd2VyZSBpbnNwZWN0ZWQgb24gY3Vyc29yIHBvc2l0aW9uLCBcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmFsc2UgYXQgdGhlIGVuZCBvZiB0aGUgbGF5b3V0KCkgZnVuY3Rpb24gb3IgYXQgdGhlIGVuZCBvZiB0aGUgY29kZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBldmFsQ29kZSh0b0N1cnNvciA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX19ldmFsVG9DdXJzb3JSZWFjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBpZiAodGhpcy5maWxlPy5zdGFydHNXaXRoKFwiJHNlcnZlcnNpZGUvXCIpKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmVzID0gYXdhaXQgdGhpcy5ldmFsU2VydmVyc2lkZSgpO1xyXG4gICAgICAgICAgICBhd2FpdCB0aGlzLl9wcm9jZXNzRXZhbFJlc3VsdChyZXMpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgd2luZG93W1widGVzdFwiXSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29kZSA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBjb2RlID0gY29kZSArIGxpbmVzW3hdICsgXCJcXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSA9IGNvZGU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdG1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIGpzZmlsZSA9IF90aGlzLl9maWxlLnJlcGxhY2UoXCIudHNcIiwgXCJcIikgKyBcIiR0ZW1wXCI7XHJcbiAgICAgICAgLy9hd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGUoXCJ0bXAvXCIgKyBfdGhpcy5fZmlsZSwgY29kZSk7XHJcbiAgICAgICAgLy9vbmx5IGxvY2FsIC0gbm8gVFMgRmlsZSBpbiBEZWJ1Z2dlclxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZVRlbXBGaWxlKGpzZmlsZSwgY29kZSk7XHJcbiAgICAgICAgd2luZG93LnJlcG9ydGRlc2lnbiA9IHVuZGVmaW5lZDtcclxuICAgICAgICB0cnkgeyByZXF1aXJlanMudW5kZWYoXCJqcy9cIiArIGpzZmlsZSArIFwiLmpzXCIpOyB9IGNhdGNoIChleCkgeyB9O1xyXG4gICAgICAgIHZhciBvbmxvYWQgPSBmdW5jdGlvbiAoZGF0YSkge1xyXG5cclxuICAgICAgICAgICAgX3RoaXMuX2V2YWxDb2RlT25Mb2FkKGRhdGEpLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2F3YWl0IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDAwKSk7XHJcbiAgICAgICAgLy9pZiB0aGlzIGlzIHRoZSBmaXJzdCBzYXZlIGZvciB0aGUgdG1wZmlsZSB0aGVuIGl0IGZhaWxzIC0gSSBkb250IGtub3cgd2h5LCBnaXZlIGl0IGEgc2Vjb25kIHRyeVxyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIHJlcXVpcmUoW1wianMvXCIgKyBqc2ZpbGUgKyBcIi5qc1wiXSwgb25sb2FkLC8qZXJyb3IqL2Z1bmN0aW9uIChlcnIpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcInJlbG9hZFwiKTtcclxuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICByZXF1aXJlKFtcImpzL1wiICsganNmaWxlICsgXCIuanNcIl0sIG9ubG9hZCwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAyMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHN3aXRjaCB2aWV3XHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHZpZXcgLSBcImRlc2lnblwiIG9yIFwiY29kZVwiXHJcbiAgICAgKi9cclxuICAgIHNldCB2aWV3bW9kZSh2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5zaG93KHZpZXcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBnZXQgYWxsIGtub3duIGluc3RhbmNlcyBmb3IgdHlwZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IHR5cGUgLSB0aGUgdHlwZSB3ZSBhcmUgaW50ZXJlc3RlZFxyXG4gICAgKiBAcmV0dXJucyB7W3N0cmluZ119XHJcbiAgICAqL1xyXG4gICAgZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclR5cGUodHlwZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmVsIHRoYXQgaG9sZHMgdGhlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iIC0gdGhlXHJcbiAgICAgKi9cclxuICAgIGdldFZhcmlhYmxlRnJvbU9iamVjdChvYikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlcy5nZXRWYXJpYWJsZUZyb21PYmplY3Qob2IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmFtZSBvYmplY3Qgb2YgdGhlIGdpdmVuIHZhcmlhYmVsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2IgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqL1xyXG4gICAgZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cclxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkTmFtZVxyXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdOYW1lXHJcbiAgICAgICovXHJcbiAgICByZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKSB7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMucmVuYW1lVmFyaWFibGUob2xkTmFtZSwgbmV3TmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2Rlc2lnbltcIl9jb21wb25lbnRFeHBsb3JlclwiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25bXCJfY29tcG9uZW50RXhwbG9yZXJcIl0udXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuYW1lIG9iamVjdCBvZiB0aGUgZ2l2ZW4gdmFyaWFiZWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvYiAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVWYXJpYWJsZUluRGVzaWduKHZhcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMucmVtb3ZlVmFyaWFibGUodmFybmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIGNvZGVcclxuICAgICAqL1xyXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmZpbGUgPSB0aGlzLl9maWxlO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIH1cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0Q3Vyc29yUG9yaXRpb24ocG9zaXRpb246IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSB0aGlzLl9jb2RlUGFuZWwubnVtYmVyVG9Qb3NpdGlvbihwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uIHtyb3c9ICxjb2x1bW49fVxyXG4gICAgKi9cclxuICAgIHNldCBjdXJzb3JQb3NpdGlvbihjdXJzb3I6IHsgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyIH0pIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuY3Vyc29yUG9zaXRpb24gPSBjdXJzb3I7XHJcbiAgICB9XHJcbiAgICBnZXQgY3Vyc29yUG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvZGVQYW5lbC5jdXJzb3JQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aXRsZSBvZiB0aGUgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIGdldCB0aXRsZSgpIHtcclxuICAgICAgICB2YXIgczogYW55ID0gdGhpcy5maWxlLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICBzID0gc1tzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIGlmICh0aGlzLmZpbGU/LnN0YXJ0c1dpdGgoXCIkc2VydmVyc2lkZVwiKSlcclxuICAgICAgICAgICAgcyA9IHMgKyBcIihzKVwiO1xyXG4gICAgICAgIHJldHVybiBzO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgdXJsIHRvIGVkaXRcclxuICAgICovXHJcbiAgICBzZXQgZmlsZSh2YWx1ZTogc3RyaW5nKSB7IC8vdGhlIENvZGVcclxuICAgICAgICB0aGlzLl9maWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vcGVuRmlsZSh2YWx1ZSk7XHJcblxyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlLCBpZDogdHJ1ZSB9KVxyXG4gICAgZ2V0IGZpbGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlsZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBnb2VzIHRvIHRoZSBsaW5lIG51bWJlciBcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gdGhlIGxpbmUgbnVtYmVyIFxyXG4gICAgKi9cclxuICAgIHNldCBsaW5lKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9saW5lID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0geyByb3c6IHRoaXMuX2xpbmUsIGNvbHVtbjogMSB9O1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmN1cnNvclBvc2l0aW9uID0geyByb3c6IF90aGlzLl9saW5lLCBjb2x1bW46IDEgfTtcclxuICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIC8qc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3RoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogdmFsdWUsIGNvbHVtbjogMCB9O1xyXG4gICAgICAgIH0sIDEwMDApOy8vc3RhcnQgdGFrZXMgb25lIHNlY29uZC4uLi4qL1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlIH0pXHJcbiAgICBnZXQgbGluZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnNvclBvc2l0aW9uLnJvdztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogb3BlbiB0aGUgZmlsZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBvcGVuRmlsZShfZmlsZSkge1xyXG4gICAgICAgIHRoaXMuX2ZpbGUgPSBfZmlsZTtcclxuICAgICAgICB2YXIgY29udGVudCA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5sb2FkRmlsZSh0aGlzLl9maWxlKTtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZmlsZSA9IF9maWxlO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC52YWx1ZSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgLy8gIHRoaXMuX2NvZGVQYW5lbC5oZWlnaHQ9XCIxMDAlXCI7XHJcbiAgICAgICAgdGhpcy5fbWFpbi51cGRhdGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbGluZSlcclxuICAgICAgICAgICAgdGhpcy5saW5lID0gdGhpcy5fbGluZTtcclxuXHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVWaWV3LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9lcnJvcnMuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ24uZGVzdHJveSgpO1xyXG4gICAgICAgIC8vdGhpcy5fbWFpbi5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAqL1xyXG4gICAgdW5kbygpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwudW5kbygpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgZWRpdG9yID0gbmV3IENvZGVFZGl0b3IoKTtcclxuICAgIC8vdmFyIHVybCA9IFwiamFzc2lqc19lZGl0b3IvQWNlUGFuZWwudHNcIjtcclxuICAgIGVkaXRvci5oZWlnaHQgPSBcIjEwMCVcIjtcclxuICAgIGVkaXRvci53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgLy9hd2FpdCBlZGl0b3Iub3BlbkZpbGUodXJsKTtcclxuICAgIGVkaXRvci5maWxlID0gXCIkc2VydmVyc2lkZS9qYXNzaWpzX3JlcG9ydC9UZXN0U2VydmVycmVwb3J0LnRzXCI7Ly9cInRlc3RzL1Rlc3REaWFsb2cudHNcIjtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGVkaXRvci5ldmFsQ29kZSgpO1xyXG5cclxuICAgIH0sIDUwMCk7XHJcbiAgICB3aW5kb3dzLmFkZChlZGl0b3IsIGVkaXRvci50aXRsZSk7XHJcbiAgICAvLyBkZWJ1Z2dlcjtcclxuICAgIC8vIHZhciBrPWF3YWl0IG5ldyBTZXJ2ZXIoKS50ZXN0U2VydmVyc2lkZUZpbGUoXCIkc2VydmVyc2lkZS9qYXNzaWpzX3JlcG9ydC9UZXN0U2VydmVycmVwb3J0XCIpO1xyXG59O1xyXG4vL2phc3NpanMubXlSZXF1aXJlKG1vZHVsLmNzc1tcImphc3NpanNfZWRpdG9yLmNzc1wiXSk7Il19