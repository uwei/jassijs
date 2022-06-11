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
        (0, Property_1.$Property)({ chooseFrom: ["ace", "monaco", "aceOnBrowser"], default: "aceOnBrowser", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_DefaultEditor", void 0);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["vs-dark", "vs-light", "hc-black"], default: "vs-light", chooseFromStrict: true }),
        __metadata("design:type", String)
    ], CodeEditorSettingsDescriptor.prototype, "Development_MoanacoEditorTheme", void 0);
    CodeEditorSettingsDescriptor = __decorate([
        (0, Settings_1.$SettingsDescriptor)(),
        (0, Jassi_1.$Class)("jassijs_editor.CodeEditorSettingsDescriptor")
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
        async fillVariablesAndSetupParser(url, root, component, cache, parser) {
            var _a, _b;
            if (cache[component._id] === undefined && component["__stack"] !== undefined) {
                var lines = (_a = component["__stack"]) === null || _a === void 0 ? void 0 : _a.split("\n");
                for (var x = 0; x < lines.length; x++) {
                    var sline = lines[x];
                    if (sline.indexOf("$temp.js") > 0) {
                        var spl = sline.split(":");
                        var entr = {};
                        cache[component._id] = {
                            line: Number(spl[spl.length - 2]),
                            column: Number(spl[spl.length - 1].replace(")", "")),
                            component: component,
                            pos: 0,
                            name: undefined
                        };
                        break;
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
                    var values = Object.values(cache);
                    var tmap = await new TSSourceMap().getLinesFromJS("js/" + url.replace(".ts", ".js"), values);
                    for (var x = 0; x < tmap.length; x++) {
                        values[x].column = tmap[x].column;
                        values[x].line = tmap[x].line;
                        values[x].pos = this._codePanel.positionToNumber({
                            row: values[x].line,
                            column: values[x].column
                        });
                    }
                    //setupClasscope
                    var foundscope = parser.getClassScopeFromPosition(this._codePanel.value, cache[root._id].pos);
                    var scope = [{ classname: (_b = root === null || root === void 0 ? void 0 : root.constructor) === null || _b === void 0 ? void 0 : _b.name, methodname: "layout" }];
                    if (foundscope)
                        scope = [foundscope];
                    parser.parse(this._codePanel.value, scope);
                    for (var key in parser.data) {
                        var com = parser.data[key];
                        var _new_ = com["_new_"];
                        if (_new_) {
                            var pos = _new_[0].node.pos;
                            var end = _new_[0].node.end;
                            for (var x = 0; x < values.length; x++) {
                                if (values[x].pos >= pos && values[x].pos <= end) {
                                    values[x].name = key;
                                }
                            }
                        }
                    }
                    for (var x = 0; x < values.length; x++) {
                        if (values[x].name) {
                            this.variables.addVariable(values[x].name, values[x].component, false);
                        }
                    }
                    this.variables.updateCache();
                    this.variables.update();
                    // parser.parse(,)
                }
                return parser;
            }
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
                var ret = await data.test(new Test_1.Test());
                Component_1.Component.offComponentCreated(hook);
                // Promise.resolve(ret).then(async function(ret) {
                if (ret !== undefined) {
                    if (ret.layout !== undefined)
                        _this.variables.addVariable("this", ret);
                    //_this.variables.addVariable("me", ret.me);
                    _this.variables.updateCache();
                    if (ret instanceof Component_1.Component && ret["reporttype"] === undefined) {
                        //require(["jassijs_editor/ComponentDesigner", "jassijs_editor/util/Parser"], function () {
                        //    var ComponentDesigner = classes.getClass("jassijs_editor.ComponentDesigner");
                        //   var Parser = classes.getClass("jassijs_editor.base.Parser");
                        var ComponentDesigner = await Classes_1.classes.loadClass("jassijs_editor.ComponentDesigner");
                        var Parser = await Classes_1.classes.loadClass("jassijs_editor.util.Parser");
                        var parser = new Parser();
                        await _this.fillVariablesAndSetupParser(filename, ret, ret, {}, parser);
                        if (!((_this._design) instanceof ComponentDesigner)) {
                            _this._design = new ComponentDesigner();
                            _this._main.add(_this._design, "Design", "design");
                            _this._design["codeEditor"] = _this;
                        }
                        //@ts-ignore
                        _this._design.connectParser(parser);
                        _this._design["designedComponent"] = ret;
                        //});
                    }
                    else if (ret["reportdesign"] !== undefined) {
                        require(["jassijs_report/designer/ReportDesigner", "jassijs_report/ReportDesign", "jassijs_editor/util/Parser"], function () {
                            var _a, _b;
                            var ReportDesigner = Classes_1.classes.getClass("jassijs_report.designer.ReportDesigner");
                            var ReportDesign = Classes_1.classes.getClass("jassijs_report.ReportDesign");
                            if (!((_this._design) instanceof ReportDesigner)) {
                                var Parser = Classes_1.classes.getClass("jassijs_editor.base.Parser");
                                _this._design = new ReportDesigner();
                                _this._main.add(_this._design, "Design", "design");
                                _this._design["codeEditor"] = _this;
                                var parser = new Parser();
                                parser.classScope = [{ classname: (_b = (_a = _this._design) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name, methodname: "layout" }, { classname: undefined, methodname: "test" }];
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
        (0, Jassi_1.$Class)("jassijs_editor.CodeEditor"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfZWRpdG9yL0NvZGVFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnQ0EsSUFBTSw0QkFBNEIsR0FBbEMsTUFBTSw0QkFBNEI7S0FLakMsQ0FBQTtJQUhHO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDOzttRkFDNUU7SUFFbEM7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUM7O3dGQUNyRTtJQUpyQyw0QkFBNEI7UUFGakMsSUFBQSw4QkFBbUIsR0FBRTtRQUNyQixJQUFBLGNBQU0sRUFBQyw2Q0FBNkMsQ0FBQztPQUNoRCw0QkFBNEIsQ0FLakM7SUFHRDs7O09BR0c7SUFFSCxJQUFhLFVBQVUsa0JBQXZCLE1BQWEsVUFBVyxTQUFRLGFBQUs7UUFjakMsWUFBWSxhQUErRCxTQUFTO1lBQ2hGLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDaEMsbUdBQW1HO1lBQ25HLElBQUksS0FBSyxHQUFHLENBQUMsZ0VBQWdFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ3pHLElBQUksSUFBSSxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLG1CQUFRLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUM7WUFDbEUsSUFBSSxVQUFVLGFBQVYsVUFBVSx1QkFBVixVQUFVLENBQUUsU0FBUyxFQUFFO2dCQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUM7YUFDMUM7aUJBQU07Z0JBQ0gscUJBQVMsQ0FBQyxVQUFVLEdBQUcsb0JBQVUsQ0FBQztnQkFDbEMsSUFBSSxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxLQUFLLGNBQWMsSUFBSSxJQUFJLEtBQUssU0FBUyxDQUFDLENBQUMsRUFBRTtvQkFDOUUsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztpQkFFcEM7cUJBQU07b0JBQ0gsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLHlCQUFXLEVBQUUsQ0FBQztvQkFDcEMscUNBQXFDO2lCQUV4QzthQUVKO1lBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHVCQUFVLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1lBQ3JDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsYUFBVixVQUFVLHVCQUFWLFVBQVUsQ0FBRSxXQUFXLENBQUMsQ0FBQztZQUVwQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUN6QixDQUFDO1FBQ08sY0FBYztZQUNsQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7WUFDL0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLG1CQUFtQixDQUFDO1lBQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSTtnQkFDcEUsZUFBTyxDQUFDLFFBQVEsQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hGLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUVPLEtBQUssQ0FBQyxXQUFvQjtZQUM5QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRXBDLElBQUksV0FBVyxLQUFLLElBQUksRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN0QyxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDdkMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUVoQyxJQUFJLEdBQUcsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO2dCQUN2QixHQUFHLENBQUMsSUFBSSxHQUFHLGdDQUFnQyxDQUFDO2dCQUM1QyxHQUFHLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQztnQkFDeEIsR0FBRyxDQUFDLE9BQU8sQ0FBQztvQkFDUixLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JCLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUczQixJQUFJLElBQUksR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsT0FBTyxHQUFHLGNBQWMsQ0FBQztnQkFDOUIsSUFBSSxDQUFDLElBQUksR0FBRywrQkFBK0IsQ0FBQztnQkFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDVCxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2pCLENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUc1QixJQUFJLElBQUksR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO2dCQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLHVCQUF1QixDQUFDO2dCQUNwQyxJQUFJLENBQUMsT0FBTyxHQUFHLGVBQWUsQ0FBQztnQkFDL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDVCxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QixDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxrQ0FBa0MsQ0FBQztnQkFDL0MsSUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7Z0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUM7b0JBQ1QsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO2dCQUM1QixDQUFDLENBQUMsQ0FBQztnQkFDSCxlQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsWUFBVSxDQUFDO2dCQUNwQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsd0ZBQXdGLENBQUMsQ0FBQztnQkFDckgsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLHlCQUF5QixDQUFDLENBQUM7Z0JBQzFELElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLGtCQUFrQixDQUFDO1lBQ3RDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztZQUMxQixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRztnQkFDbEIsVUFBVSxDQUFDO29CQUNQLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBRTlCLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNiLENBQUMsQ0FBQTtZQUNEOzs7Ozs7MENBTThCO1lBRzlCLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXRCLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUM3Qix3Q0FBd0M7WUFDeEMsVUFBVSxDQUFDLEdBQUcsRUFBRTtnQkFDWiw2QkFBNkI7WUFDakMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ1osQ0FBQztRQUVELFlBQVk7WUFDUixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyx5M0RBQXkzRCxDQUFBO1FBRWo1RCxDQUFDO1FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1dBb0JHO1FBR0ssS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ3BCLE1BQU0sSUFBSSxlQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztZQUc5QyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDdEMsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUN6QixNQUFNLGtCQUFRLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDM0I7WUFDRCxtQkFBUSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFHbEMsQ0FBQztRQUNEOztVQUVFO1FBQ0YsSUFBSTtZQUNBLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXJCLENBQUM7UUFHRDs7V0FFRztRQUNILEtBQUssQ0FBQyxlQUFlO1lBQ2pCLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDdEMsQ0FBQztRQUVEOzs7O1dBSUc7UUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJO1lBQ3BCLDZCQUE2QjtZQUM3Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Z0JBZ0NJO1lBQ0osT0FBTyxTQUFTLENBQUM7UUFDckIsQ0FBQztRQUdEOztXQUVHO1FBQ0gsWUFBWTtZQUNSLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxHQUFHO2dCQUN4QyxJQUFJLEdBQUcsQ0FBQyxPQUFPLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJO29CQUMxQyw0QkFBNEI7b0JBQzVCLHlDQUF5QztvQkFDekMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDckIsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDO29CQUNyQixPQUFPLEtBQUssQ0FBQztpQkFDaEI7cUJBQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxLQUFLLEdBQUcsRUFBRSxFQUFDLElBQUk7b0JBQ2pDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ3RCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztvQkFDckIsT0FBTyxLQUFLLENBQUM7aUJBQ2hCO2dCQUNELElBQUksR0FBRyxDQUFDLE9BQU8sS0FBSyxHQUFHLEVBQUUsRUFBQyxJQUFJO29CQUMxQixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtnQkFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQSx5QkFBeUIsRUFBRSxFQUFDLE9BQU87b0JBQ3hHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDYixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7b0JBQ3JCLE9BQU8sS0FBSyxDQUFDO2lCQUNoQjtZQUVMLENBQUMsQ0FBQyxDQUFDO1FBR1AsQ0FBQztRQUNEOzs7O1dBSUc7UUFDSCxZQUFZLENBQUMsSUFBSTtZQUNiLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLE9BQU8sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQzt1QkFDcEQsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUMxRCxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEM7YUFDSjtZQUNELE9BQU8sS0FBSyxDQUFDO1FBQ2pCLENBQUM7UUFHRCxvQkFBb0I7WUFDaEIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEtBQUssSUFBSTtnQkFDbkMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztRQUN0QyxDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsWUFBWSxDQUFDLFNBQVM7WUFDbEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUNPLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxHQUFXLEVBQUUsSUFBZSxFQUFFLFNBQW9CLEVBQUUsS0FBbUgsRUFBQyxNQUFNOztZQUVwTixJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssU0FBUyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxTQUFTLEVBQUU7Z0JBQzFFLElBQUksS0FBSyxHQUFHLE1BQUEsU0FBUyxDQUFDLFNBQVMsQ0FBQywwQ0FBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO29CQUNuQyxJQUFJLEtBQUssR0FBVyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzdCLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7d0JBQy9CLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7d0JBQzNCLElBQUksSUFBSSxHQUFHLEVBRVYsQ0FBQTt3QkFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHOzRCQUNuQixJQUFJLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDOzRCQUNqQyxNQUFNLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7NEJBQ3BELFNBQVMsRUFBRSxTQUFTOzRCQUNwQixHQUFHLEVBQUUsQ0FBQzs0QkFDTixJQUFJLEVBQUUsU0FBUzt5QkFDbEIsQ0FBQTt3QkFDRCxNQUFNO3FCQUNUO2lCQUNKO2dCQUNELElBQUksU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFO29CQUMxQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDdEQsSUFBSSxDQUFDLDJCQUEyQixDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBQyxNQUFNLENBQUMsQ0FBQztxQkFDMUY7aUJBQ0o7Z0JBQ0QsSUFBSSxTQUFTLEtBQUssSUFBSSxFQUFFO29CQUNwQixRQUFRO29CQUNSLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQztvQkFDWCxJQUFJLFdBQVcsR0FBRyxNQUFNLGlCQUFPLENBQUMsU0FBUyxDQUFDLGlDQUFpQyxDQUFDLENBQUM7b0JBQzdFLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xDLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxXQUFXLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO29CQUM1RixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTt3QkFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO3dCQUNsQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7d0JBQzlCLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQzs0QkFDN0MsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJOzRCQUNuQixNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU07eUJBQzNCLENBQUMsQ0FBQztxQkFDTjtvQkFDRCxnQkFBZ0I7b0JBQ2hCLElBQUksVUFBVSxHQUFDLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUMzRixJQUFJLEtBQUssR0FBQyxDQUFDLEVBQUMsU0FBUyxFQUFFLE1BQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLFdBQVcsMENBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO29CQUN4RSxJQUFHLFVBQVU7d0JBQ1QsS0FBSyxHQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7b0JBQzNDLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksRUFBRTt3QkFDekIsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzt3QkFDM0IsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3dCQUN6QixJQUFJLEtBQUssRUFBRTs0QkFDUCxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQzs0QkFDNUIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7NEJBQzVCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dDQUNwQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFFO29DQUM5QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztpQ0FDeEI7NkJBQ0o7eUJBQ0o7cUJBQ0o7b0JBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7d0JBQ3BDLElBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQzs0QkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQUMsS0FBSyxDQUFDLENBQUM7eUJBQ3pFO3FCQUNKO29CQUdELElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzdCLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7b0JBQ3hCLGtCQUFrQjtpQkFDckI7Z0JBQ0QsT0FBTyxNQUFNLENBQUM7YUFDakI7UUFFTCxDQUFDO1FBQ08sS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJO1lBQzlCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDakMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUNwRCxJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDdEQsTUFBTSxlQUFPLENBQUMsUUFBUSxDQUFDLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzFELEtBQUssSUFBSSxJQUFJLElBQUksV0FBVyxFQUFFO2dCQUMxQixJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRTtvQkFDbkIsSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztvQkFDN0IsTUFBTSxlQUFPLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsQ0FBQztpQkFDckY7YUFDSjtZQUVELElBQUksU0FBUyxHQUFHLGlCQUFPLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLENBQUM7WUFDbEUsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFFekMsU0FBVSxDQUFDLGlCQUFpQixFQUFFLENBQUM7YUFDeEM7WUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO2dCQUN6QiwyQkFBMkI7Z0JBQzNCLFNBQVMsSUFBSSxDQUFDLElBQUksRUFBRSxTQUFvQjs7b0JBQ3BDLElBQUk7d0JBQ0EsTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztxQkFDL0I7b0JBQUMsT0FBTyxFQUFFLEVBQUU7d0JBQ1QsSUFBSSxDQUFBLE1BQUEsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLEtBQUssMENBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFJLENBQUMsQ0FBQzs0QkFDcEMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7cUJBQ3ZDO2dCQUNMLENBQUM7Z0JBQ0YscUJBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDbEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksV0FBSSxFQUFFLENBQUMsQ0FBQztnQkFDdEMscUJBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFFcEMsa0RBQWtEO2dCQUNsRCxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7b0JBRW5CLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxTQUFTO3dCQUN4QixLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7b0JBRTdDLDRDQUE0QztvQkFFNUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxHQUFHLFlBQVkscUJBQVMsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLEtBQUssU0FBUyxFQUFFO3dCQUM3RCwyRkFBMkY7d0JBQzNGLG1GQUFtRjt3QkFDbEYsaUVBQWlFO3dCQUM5RCxJQUFJLGlCQUFpQixHQUFHLE1BQU0saUJBQU8sQ0FBQyxTQUFTLENBQUMsa0NBQWtDLENBQUMsQ0FBQzt3QkFDcEYsSUFBSSxNQUFNLEdBQUcsTUFBTSxpQkFBTyxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO3dCQUNuRSxJQUFJLE1BQU0sR0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDO3dCQUN4QixNQUFNLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3ZFLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLGlCQUFpQixDQUFDLEVBQUU7NEJBQ2pELEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxpQkFBaUIsRUFBRSxDQUFDOzRCQUV4QyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDbkQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7eUJBQ3ZDO3dCQUNELFlBQVk7d0JBQ1osS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7d0JBQ3BDLEtBQUssQ0FBQyxPQUFPLENBQUMsbUJBQW1CLENBQUMsR0FBRyxHQUFHLENBQUM7d0JBQzdDLEtBQUs7cUJBQ1I7eUJBQU0sSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssU0FBUyxFQUFFO3dCQUMxQyxPQUFPLENBQUMsQ0FBQyx3Q0FBd0MsRUFBRSw2QkFBNkIsRUFBRSw0QkFBNEIsQ0FBQyxFQUFFOzs0QkFDN0csSUFBSSxjQUFjLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsd0NBQXdDLENBQUMsQ0FBQzs0QkFDaEYsSUFBSSxZQUFZLEdBQUcsaUJBQU8sQ0FBQyxRQUFRLENBQUMsNkJBQTZCLENBQUMsQ0FBQzs0QkFDbkUsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFlBQVksY0FBYyxDQUFDLEVBQUU7Z0NBQzlDLElBQUksTUFBTSxHQUFHLGlCQUFPLENBQUMsUUFBUSxDQUFDLDRCQUE0QixDQUFDLENBQUM7Z0NBQzVELEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztnQ0FDckMsS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0NBQ25ELEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dDQUNwQyxJQUFJLE1BQU0sR0FBQyxJQUFJLE1BQU0sRUFBRSxDQUFDO2dDQUN4QixNQUFNLENBQUMsVUFBVSxHQUFDLENBQUMsRUFBQyxTQUFTLEVBQUUsTUFBQSxNQUFBLEtBQUssQ0FBQyxPQUFPLDBDQUFFLFdBQVcsMENBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7Z0NBQ3ZJLFlBQVk7Z0NBQ1osS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7NkJBRXZDOzRCQUNELElBQUksR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7NEJBQzdCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDOzRCQUNqRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssU0FBUztnQ0FDMUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztpQ0FDM0IsSUFBSSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFNBQVM7Z0NBQzlDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUM7NEJBRS9CLElBQUksR0FBRyxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsS0FBSyxTQUFTO2dDQUNuRCxHQUFHLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDOzRCQUN6QyxLQUFLLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsR0FBRyxDQUFDOzRCQUV6Qzs7Ozs7b0NBS1E7d0JBQ1osQ0FBQyxDQUFDLENBQUM7cUJBQ04sQ0FBQTs7Ozs7Ozs7Ozs7O3VCQVlFO2lCQUNOO2dCQUNELE9BQU87YUFDVjtRQUVMLENBQUM7UUFDTyxLQUFLLENBQUMsWUFBWSxDQUFDLElBQVksRUFBRSxJQUFZO1lBR2pELGFBQWE7WUFDYixJQUFJLEdBQUcsR0FBRyxzREFBYSxnQ0FBZ0MsMkJBQUMsQ0FBQztZQUN6RCxhQUFhO1lBQ2IsSUFBSSxRQUFRLEdBQUcsdUJBQVUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUMzQyxRQUFRLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbkMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNqQyxJQUFJLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFNUQsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM3QyxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2lCQUNkO2dCQUNELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUU7b0JBQ3hDLE9BQU8sR0FBRyxDQUFDLENBQUM7aUJBQ2Y7Z0JBQ0QsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQztpQkFDZDthQUNKO1lBQ0Q7Ozs7Ozs7Z0JBT0k7WUFDSixNQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1lBRXJDLElBQUksR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFO29CQUM5QixPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO29CQUN0QixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUM7WUFDbEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDN0QsU0FBUyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDO2dCQUMzQyxJQUFJLEVBQUUsV0FBVztnQkFDakIsUUFBUSxFQUFFLE9BQU8sR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztnQkFDM0MsSUFBSSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO2FBQy9CLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQztRQUN6QixDQUFDO1FBQ0Q7Ozs7V0FJRztRQUNILEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxHQUFHLFNBQVM7WUFDL0IsSUFBSSxDQUFDLHFCQUFxQixHQUFHLEtBQUssQ0FBQztZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBRXZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxTQUFTLENBQUM7WUFFM0IsSUFBSSxHQUFHLEVBQUUsQ0FBQztZQUNWLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNuQyxJQUFJLEdBQUcsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7YUFDakM7WUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ1osSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDL0IsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQztZQUN0RCwwREFBMEQ7WUFDMUQscUNBQXFDO1lBQ3JDLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFFdEMsSUFBSTtnQkFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7YUFBRTtZQUFDLE9BQU8sRUFBRSxFQUFFLEdBQUc7WUFBQSxDQUFDO1lBQ2hFLElBQUksTUFBTSxHQUFHLFVBQVUsSUFBSTtnQkFFdkIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtvQkFDdEMsTUFBTSxHQUFHLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFFUCxDQUFDLENBQUE7WUFDRCwwREFBMEQ7WUFDMUQsaUdBQWlHO1lBQ2pHLE9BQU8sQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLEVBQUUsTUFBTSxFQUFDLFNBQVMsQ0FBQSxVQUFVLEdBQUc7Z0JBQzNELHdCQUF3QjtnQkFDeEIsTUFBTSxDQUFDLFVBQVUsQ0FBQztvQkFDZCxPQUFPLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxFQUFFLE1BQU0sRUFBRSxVQUFVLEdBQUc7d0JBQ25ELE1BQU0sR0FBRyxDQUFDO29CQUNkLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNYLENBQUMsQ0FBQyxDQUFDO1FBSVAsQ0FBQztRQUNEOzs7V0FHRztRQUNILElBQUksUUFBUSxDQUFDLElBQUk7WUFDYixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDO1FBRUQ7Ozs7VUFJRTtRQUNGLG1CQUFtQixDQUFDLElBQUk7WUFDcEIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRDs7O1dBR0c7UUFDSCxxQkFBcUIsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNwRCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gscUJBQXFCLENBQUMsT0FBTztZQUN6QixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekQsQ0FBQztRQUVEOzs7O1lBSUk7UUFDSixjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU87WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLFNBQVM7Z0JBQzlFLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNwRCxDQUFDO1FBRUQ7OztXQUdHO1FBQ0gsc0JBQXNCLENBQUMsT0FBTztZQUMxQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRDs7V0FFRztRQUNILElBQUksS0FBSyxDQUFDLEtBQUs7WUFDWCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVsQyxDQUFDO1FBQ0QsSUFBSSxLQUFLO1lBQ0wsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQztRQUNqQyxDQUFDO1FBQ0QsaUJBQWlCLENBQUMsUUFBZ0I7WUFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JFLENBQUM7UUFDRDs7VUFFRTtRQUNGLElBQUksY0FBYyxDQUFDLE1BQXVDO1lBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUM1QyxDQUFDO1FBQ0QsSUFBSSxjQUFjO1lBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQztRQUMxQyxDQUFDO1FBRUQ7O1dBRUc7UUFDSCxJQUFJLEtBQUs7WUFDTCxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDRDs7VUFFRTtRQUNGLElBQUksSUFBSSxDQUFDLEtBQWE7WUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBRUQsSUFBSSxJQUFJO1lBQ0osT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3RCLENBQUM7UUFDRDs7O1VBR0U7UUFDRixJQUFJLElBQUksQ0FBQyxLQUFhO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDckQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLFVBQVUsQ0FBQztnQkFDUCxLQUFLLENBQUMsY0FBYyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDO1lBQzNELENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNSOzttREFFdUM7UUFDM0MsQ0FBQztRQUVELElBQUksSUFBSTtZQUNKLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUM7UUFDbkMsQ0FBQztRQUNEOztXQUVHO1FBQ0gsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ25CLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxlQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUM3QixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7WUFDaEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQy9CLGtDQUFrQztZQUNsQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxDQUFDLEtBQUs7Z0JBQ1YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBRS9CLENBQUM7UUFDRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN6QixJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDdkIsdUJBQXVCO1lBQ3ZCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBQ0Q7O1VBRUU7UUFDRixJQUFJO1lBQ0EsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBRUosQ0FBQTtJQXRERztRQURDLElBQUEsb0JBQVMsRUFBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDOzs7MENBR3ZDO0lBaUJEO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDOzs7MENBRzdCO0lBeHJCUSxVQUFVO1FBRHRCLElBQUEsY0FBTSxFQUFDLDJCQUEyQixDQUFDOztPQUN2QixVQUFVLENBeXRCdEI7SUF6dEJZLGdDQUFVO0lBMnRCaEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztRQUM5Qix5Q0FBeUM7UUFDekMsTUFBTSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDdEIsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztDQXdCbEIsQ0FBQztRQUNFLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixPQUFPLE1BQU0sQ0FBQztJQUVsQixDQUFDO0lBbENELG9CQWtDQztJQUFBLENBQUM7O0FBQ0YscURBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpanMsIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHsgQ29kZVBhbmVsIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVQYW5lbFwiO1xyXG5pbXBvcnQgeyBWYXJpYWJsZVBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvVmFyaWFibGVQYW5lbFwiO1xyXG5pbXBvcnQgeyBEb2NraW5nQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvRG9ja2luZ0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBFcnJvclBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvRXJyb3JQYW5lbFwiO1xyXG5pbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcclxuaW1wb3J0IHJlZ2lzdHJ5IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBTZXJ2ZXIgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2VydmVyXCI7XHJcbmltcG9ydCB7IFJlbG9hZGVyIH0gZnJvbSBcImphc3NpanMvdXRpbC9SZWxvYWRlclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuXHJcbmltcG9ydCB7IEFjZVBhbmVsIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0FjZVBhbmVsXCI7XHJcbmltcG9ydCB0eXBlc2NyaXB0LCB7IFR5cGVzY3JpcHQgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvdXRpbC9UeXBlc2NyaXB0XCI7XHJcbmltcG9ydCB7IE1vbmFjb1BhbmVsIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL01vbmFjb1BhbmVsXCI7XHJcbmltcG9ydCB7ICRTZXR0aW5nc0Rlc2NyaXB0b3IsIFNldHRpbmdzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1NldHRpbmdzXCI7XHJcbmltcG9ydCB7IFRlc3QgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvVGVzdFwiO1xyXG5pbXBvcnQgbW9kdWwgZnJvbSBcIi4vbW9kdWxcIjtcclxuXHJcblxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBLbm93blNldHRpbmdzIHtcclxuICAgICAgICBEZXZlbG9wbWVudF9EZWZhdWx0RWRpdG9yOiBcImFjZVwiIHwgXCJtb25hY29cIiB8IFwiYWNlT25Ccm93c2VyXCI7XHJcbiAgICAgICAgRGV2ZWxvcG1lbnRfTW9hbmFjb0VkaXRvclRoZW1lOiBcInZzLWRhcmtcIiB8IFwidnMtbGlnaHRcIiB8IFwiaGMtYmxhY2tcIjtcclxuICAgIH1cclxufVxyXG5AJFNldHRpbmdzRGVzY3JpcHRvcigpXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yU2V0dGluZ3NEZXNjcmlwdG9yXCIpXHJcbmNsYXNzIENvZGVFZGl0b3JTZXR0aW5nc0Rlc2NyaXB0b3Ige1xyXG4gICAgQCRQcm9wZXJ0eSh7IGNob29zZUZyb206IFtcImFjZVwiLCBcIm1vbmFjb1wiLCBcImFjZU9uQnJvd3NlclwiXSwgZGVmYXVsdDogXCJhY2VPbkJyb3dzZXJcIiwgY2hvb3NlRnJvbVN0cmljdDogdHJ1ZSB9KVxyXG4gICAgRGV2ZWxvcG1lbnRfRGVmYXVsdEVkaXRvcjogc3RyaW5nO1xyXG4gICAgQCRQcm9wZXJ0eSh7IGNob29zZUZyb206IFtcInZzLWRhcmtcIiwgXCJ2cy1saWdodFwiLCBcImhjLWJsYWNrXCJdLCBkZWZhdWx0OiBcInZzLWxpZ2h0XCIsIGNob29zZUZyb21TdHJpY3Q6IHRydWUgfSlcclxuICAgIERldmVsb3BtZW50X01vYW5hY29FZGl0b3JUaGVtZTogc3RyaW5nO1xyXG59XHJcblxyXG5cclxuLyoqXHJcbiAqIFBhbmVsIGZvciBlZGl0aW5nIHNvdXJjZXNcclxuICogQGNsYXNzIGphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JcclxuICovXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yXCIpXHJcbmV4cG9ydCBjbGFzcyBDb2RlRWRpdG9yIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgX21haW46IERvY2tpbmdDb250YWluZXI7XHJcbiAgICBfY29kZVZpZXc6IFBhbmVsO1xyXG4gICAgX2NvZGVUb29sYmFyOiBQYW5lbDtcclxuICAgIF9jb2RlUGFuZWw6IENvZGVQYW5lbDtcclxuICAgIF9lcnJvcnM6IEVycm9yUGFuZWw7XHJcbiAgICBfZmlsZTogc3RyaW5nO1xyXG4gICAgdmFyaWFibGVzOiBWYXJpYWJsZVBhbmVsO1xyXG4gICAgX2Rlc2lnbjogUGFuZWw7XHJcbiAgICBlZGl0TW9kZTogYm9vbGVhbjtcclxuICAgIF9fZXZhbFRvQ3Vyc29yUmVhY2hlZDogYm9vbGVhbjtcclxuXHJcblxyXG4gICAgcHJpdmF0ZSBfbGluZTogbnVtYmVyO1xyXG4gICAgY29uc3RydWN0b3IocHJvcGVydGllczogeyBjb2RlUGFuZWw/OiBDb2RlUGFuZWwsIGhpZGVUb29sYmFyPzogYm9vbGVhbiB9ID0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1heGltaXplKCk7XHJcbiAgICAgICAgdGhpcy5fbWFpbiA9IG5ldyBEb2NraW5nQ29udGFpbmVyKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcgPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhciA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIC8vaWYgKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSkge1xyXG4gICAgICAgIGxldCBtb2JpbCA9ICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpO1xyXG4gICAgICAgIGxldCBzZXR0ID0gU2V0dGluZ3MuZ2V0cyhTZXR0aW5ncy5rZXlzLkRldmVsb3BtZW50X0RlZmF1bHRFZGl0b3IpO1xyXG4gICAgICAgIGlmIChwcm9wZXJ0aWVzPy5jb2RlUGFuZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gcHJvcGVydGllcy5jb2RlUGFuZWw7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgQ29kZVBhbmVsLnR5cGVzY3JpcHQgPSB0eXBlc2NyaXB0O1xyXG4gICAgICAgICAgICBpZiAoc2V0dCA9PT0gXCJhY2VcIiB8fCAobW9iaWwgJiYgKHNldHQgPT09IFwiYWNlT25Ccm93c2VyXCIgfHwgc2V0dCA9PT0gdW5kZWZpbmVkKSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZGVQYW5lbCA9IG5ldyBBY2VQYW5lbCgpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZGVQYW5lbCA9IG5ldyBNb25hY29QYW5lbCgpO1xyXG4gICAgICAgICAgICAgICAgLy8gdGhpcy5fY29kZVBhbmVsID0gbmV3IEFjZVBhbmVsKCk7IFxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fZXJyb3JzID0gbmV3IEVycm9yUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9maWxlID0gXCJcIjtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IG5ldyBWYXJpYWJsZVBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5fZGVzaWduID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgdGhpcy5faW5pdChwcm9wZXJ0aWVzPy5oaWRlVG9vbGJhcik7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBfaW5pdENvZGVQYW5lbCgpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwubW9kZSA9IFwidHlwZXNjcmlwdFwiO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5oZWlnaHQgPSBcImNhbGMoMTAwJSAtIDMxcHgpXCI7XHJcbiAgICAgICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwub25CcmVha3BvaW50Q2hhbmdlZChmdW5jdGlvbiAobGluZSwgY29sdW1uLCBlbmFibGUsIHR5cGUpIHtcclxuICAgICAgICAgICAgamFzc2lqcy5kZWJ1Z2dlci5icmVha3BvaW50Q2hhbmdlZChfdGhpcy5fZmlsZSwgbGluZSwgY29sdW1uLCBlbmFibGUsIHR5cGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2luaXQoaGlkZVRvb2xiYXI6IGJvb2xlYW4pIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2luaXRDb2RlUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9jb2RlVmlld1tcImhvcml6b250YWxcIl0gPSB0cnVlO1xyXG5cclxuICAgICAgICBpZiAoaGlkZVRvb2xiYXIgIT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVZpZXcuYWRkKHRoaXMuX2NvZGVUb29sYmFyKTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXJbXCJob3Jpem9udGFsXCJdID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuaGVpZ2h0ID0gXCIzMFwiO1xyXG5cclxuICAgICAgICAgICAgdmFyIHJ1biA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgICAgcnVuLmljb24gPSBcIm1kaSBtZGktY2FyLWhhdGNoYmFjayBtZGktMThweFwiO1xyXG4gICAgICAgICAgICBydW4udG9vbHRpcCA9IFwiUnVuKEY0KVwiO1xyXG4gICAgICAgICAgICBydW4ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHJ1bik7XHJcblxyXG5cclxuICAgICAgICAgICAgdmFyIHNhdmUgPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIHNhdmUudG9vbHRpcCA9IFwiU2F2ZShDdHJsK1MpXCI7XHJcbiAgICAgICAgICAgIHNhdmUuaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LXNhdmUgbWRpLTE4cHhcIjtcclxuICAgICAgICAgICAgc2F2ZS5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZChzYXZlKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgdW5kbyA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgICAgdW5kby5pY29uID0gXCJtZGkgbWRpLXVuZG8gbWRpLTE4cHhcIjtcclxuICAgICAgICAgICAgdW5kby50b29sdGlwID0gXCJVbmRvIChTdHJnK1opXCI7XHJcbiAgICAgICAgICAgIHVuZG8ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29kZVBhbmVsLnVuZG8oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZCh1bmRvKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBnb3RvID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBnb3RvLmljb24gPSBcIm1kaSBtZGktcmF5LXN0YXJ0LWFycm93IG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIGdvdG8udG9vbHRpcCA9IFwiR290b1wiO1xyXG4gICAgICAgICAgICBnb3RvLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuZ290b0RlY2xhcmF0aW9uKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBqYXNzaWpzW1wiJENvZGVFZGl0b3JcIl0gPSBDb2RlRWRpdG9yO1xyXG4gICAgICAgICAgICAkKGdvdG8uZG9tKS5hdHRyKFwib25kcm9wXCIsIFwiZXZlbnQucHJldmVudERlZmF1bHQoKTtqYXNzaWpzLiRDb2RlRWRpdG9yLnNlYXJjaChldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YSgndGV4dCcpKTtcIik7XHJcbiAgICAgICAgICAgICQoZ290by5kb20pLmF0dHIoXCJvbmRyYWdvdmVyXCIsIFwiZXZlbnQucHJldmVudERlZmF1bHQoKTtcIik7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZChnb3RvKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcuYWRkKHRoaXMuX2NvZGVQYW5lbCk7XHJcblxyXG4gICAgICAgIHRoaXMuX21haW4ud2lkdGggPSBcImNhbGMoMTAwJSAtIDFweClcIjtcclxuICAgICAgICB0aGlzLl9tYWluLmhlaWdodCA9IFwiOTklXCI7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5vbnJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5fY29kZVBhbmVsLnJlc2l6ZSgpO1xyXG5cclxuICAgICAgICAgICAgfSwgMTAwMCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qdmFyIHRlc3QgPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGVzdC5pY29uID0gXCJtZGkgbWRpLWJ1ZyBtZGktMThweFwiO1xyXG4gICAgICAgIHRlc3QudG9vbHRpcCA9IFwiVGVzdFwiO1xyXG4gICAgICAgIHRlc3Qub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBrayA9IF90aGlzLl9tYWluLmxheW91dDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQodGVzdCk7Ki9cclxuXHJcblxyXG4gICAgICAgIHN1cGVyLmFkZCh0aGlzLl9tYWluKTtcclxuXHJcbiAgICAgICAgdGhpcy5faW5zdGFsbFZpZXcoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyS2V5cygpO1xyXG5cclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5jcmVhdGVUYWJsZSgpO1xyXG4gICAgICAgIC8vICAgdGhpcy5fY29kZVBhbmVsLnNldENvbXBsZXRlcih0aGlzKTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgLy9fdGhpcy5lZGl0b3JQcm92aWRlcj1cImFjZVwiO1xyXG4gICAgICAgIH0sIDEwMCk7XHJcbiAgICB9XHJcblxyXG4gICAgX2luc3RhbGxWaWV3KCkge1xyXG4gICAgICAgIHRoaXMuX21haW4uYWRkKHRoaXMuX2NvZGVWaWV3LCBcIkNvZGUuLlwiLCBcImNvZGVcIik7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy52YXJpYWJsZXMsIFwiVmFyaWFibGVzXCIsIFwidmFyaWFibGVzXCIpO1xyXG4gICAgICAgIHRoaXMuX21haW4uYWRkKHRoaXMuX2Rlc2lnbiwgXCJEZXNpZ25cIiwgXCJkZXNpZ25cIik7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fZXJyb3JzLCBcIkVycm9yc1wiLCBcImVycm9yc1wiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmxheW91dCA9ICd7XCJzZXR0aW5nc1wiOntcImhhc0hlYWRlcnNcIjp0cnVlLFwiY29uc3RyYWluRHJhZ1RvQ29udGFpbmVyXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInNlbGVjdGlvbkVuYWJsZWRcIjpmYWxzZSxcInBvcG91dFdob2xlU3RhY2tcIjpmYWxzZSxcImJsb2NrZWRQb3BvdXRzVGhyb3dFcnJvclwiOnRydWUsXCJjbG9zZVBvcG91dHNPblVubG9hZFwiOnRydWUsXCJzaG93UG9wb3V0SWNvblwiOmZhbHNlLFwic2hvd01heGltaXNlSWNvblwiOnRydWUsXCJzaG93Q2xvc2VJY29uXCI6dHJ1ZSxcInJlc3BvbnNpdmVNb2RlXCI6XCJvbmxvYWRcIn0sXCJkaW1lbnNpb25zXCI6e1wiYm9yZGVyV2lkdGhcIjo1LFwibWluSXRlbUhlaWdodFwiOjEwLFwibWluSXRlbVdpZHRoXCI6MTAsXCJoZWFkZXJIZWlnaHRcIjoyMCxcImRyYWdQcm94eVdpZHRoXCI6MzAwLFwiZHJhZ1Byb3h5SGVpZ2h0XCI6MjAwfSxcImxhYmVsc1wiOntcImNsb3NlXCI6XCJjbG9zZVwiLFwibWF4aW1pc2VcIjpcIm1heGltaXNlXCIsXCJtaW5pbWlzZVwiOlwibWluaW1pc2VcIixcInBvcG91dFwiOlwib3BlbiBpbiBuZXcgd2luZG93XCIsXCJwb3BpblwiOlwicG9wIGluXCIsXCJ0YWJEcm9wZG93blwiOlwiYWRkaXRpb25hbCB0YWJzXCJ9LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwid2lkdGhcIjoxMDAsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJ3aWR0aFwiOjMzLjMzMzMzMzMzMzMzMzMzNixcImhlaWdodFwiOjgwLjM0NjgyMDgwOTI0ODU2LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvZGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvZGUuLlwiLFwibmFtZVwiOlwiY29kZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImRlc2lnblwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJuYW1lXCI6XCJkZXNpZ25cIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6MTkuNjUzMTc5MTkwNzUxNDQ1LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjo1MCxcIndpZHRoXCI6NTAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJFcnJvcnNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZXJyb3JzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJFcnJvcnNcIixcIm5hbWVcIjpcImVycm9yc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcIndpZHRoXCI6NTAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJWYXJpYWJsZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwidmFyaWFibGVzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJWYXJpYWJsZXNcIixcIm5hbWVcIjpcInZhcmlhYmxlc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfV0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcIm9wZW5Qb3BvdXRzXCI6W10sXCJtYXhpbWlzZWRJdGVtSWRcIjpudWxsfSdcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLypzZXQgZWRpdG9yUHJvdmlkZXIodmFsdWU6IFwiYWNlXCIgfCBcIm1vbmFjb1wiKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSB0aGlzLmVkaXRvclByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgIC8vc3dpdGNoIHRvIG5ldyBwcm92aWRlclxyXG4gICAgICAgICAgICBsZXQgcG9zID0gdGhpcy5jdXJzb3JQb3NpdGlvbjtcclxuICAgICAgICAgICAgbGV0IHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGxldCBvbGQgPSB0aGlzLl9jb2RlUGFuZWw7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IFwiYWNlXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZGVQYW5lbCA9IG5ldyBBY2VQYW5lbCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IE1vbmFjb1BhbmVsKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5faW5pdENvZGVQYW5lbCgpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5yZW1vdmUob2xkKTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVZpZXcuYWRkKHRoaXMuX2NvZGVQYW5lbCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWU9dmFsO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uPXBvcztcclxuICAgICAgICAgICAgb2xkLmRlc3Ryb3koKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICB9Ki9cclxuXHJcblxyXG4gICAgcHJpdmF0ZSBhc3luYyBfc2F2ZShjb2RlKSB7XHJcbiAgICAgICAgYXdhaXQgbmV3IFNlcnZlcigpLnNhdmVGaWxlKHRoaXMuX2ZpbGUsIGNvZGUpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIGYgPSB0aGlzLl9maWxlLnJlcGxhY2UoXCIudHNcIiwgXCJcIik7XHJcbiAgICAgICAgaWYgKGNvZGUuaW5kZXhPZihcIkAkXCIpID4gLTEpIHtcclxuICAgICAgICAgICAgYXdhaXQgcmVnaXN0cnkucmVsb2FkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFJlbG9hZGVyLmluc3RhbmNlLnJlbG9hZEpTKGYpO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogc2F2ZSB0aGUgY29kZSB0byBzZXJ2ZXJcclxuICAgICovXHJcbiAgICBzYXZlKCkge1xyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fc2F2ZShjb2RlKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ290byB0byB0aGUgZGVjbGFyaWF0aW9uIG9uIGN1cnNvclxyXG4gICAgICovXHJcbiAgICBhc3luYyBnb3RvRGVjbGFyYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmdvdG9EZWNsYXJhdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogc2VhcmNoIHRleHQgaW4gY2xhc3NlcyBhdCB0aGUgZ2l2ZW4gdGV4dFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgLSB0aGUgdGV4dCB0byBzZWFyY2hcclxuICAgICAqIEByZXR1cm5zIHtqYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yfSAtIHRoZSBlZGl0b3IgaW5zdGFuY2VcclxuICAgICAqL1xyXG4gICAgc3RhdGljIGFzeW5jIHNlYXJjaCh0ZXh0KSB7XHJcbiAgICAgICAgLy9UT0RPIGFzayB0eXBlc2NyaXB0IHNlcnZpY2VcclxuICAgICAgICAvKiB2YXIgZm91bmQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgIHRleHQgPSB0ZXh0LnJlcGxhY2VBbGwoXCJcXHJcXG5cIiwgXCJcXG5cIik7XHJcbiAgICAgICAgIHZhciBjb250ZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAvL0Zhc3Qgc2VhcmNoXHJcbiAgICAgICAgIGZvciAodmFyIGZpbGUgaW4gY2xhc3Nlcy5nZXRDYWNoZSgpKSB7XHJcbiAgICAgICAgICAgICB2YXIgZm5hbWUgPSBmaWxlLnJlcGxhY2VBbGwoXCIuXCIsIFwiL1wiKTtcclxuICAgICAgICAgICAgIHZhciBjbCA9IGNsYXNzZXMuZ2V0Q2FjaGUoKVtmaWxlXTtcclxuICAgICAgICAgICAgIHZhciBjb2RlID0gY2wudG9TdHJpbmcoKS5yZXBsYWNlQWxsKFwiXFxyXFxuXCIsIFwiXFxuXCIpO1xyXG4gICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZih0ZXh0KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgZm91bmQgPSBmbmFtZSArIFwiLmpzXCI7XHJcbiAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgaWYgKGZvdW5kID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgIC8vRGVlcCBzZWFyY2ggKHNsb3cpXHJcbiAgICAgICAgICAgICB2YXIgZmlsZXMgPSByZWdpc3RyeS5nZXRBbGxGaWxlc0ZvclNlcnZpY2UoXCJjbGFzc2VzXCIpO1xyXG4gICAgICAgICAgICAgaWYgKGZpbGVzICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGZpbGVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGxldCBjb2RlOnN0cmluZyA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5sb2FkRmlsZShmaWxlc1t4XSk7XHJcbiAgICAgICAgICAgICAgICAgICAgIGNvZGUgPSBjb2RlLnJlcGxhY2VBbGwoXCJcXHJcXG5cIiwgXCJcXG5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmIChjb2RlLmluZGV4T2YodGV4dCkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBmaWxlc1t4XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSBjb2RlO1xyXG4gICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgfVxyXG4gICAgICAgICB9XHJcbiAgICAgICAgIGlmIChmb3VuZCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICB2YXIgbGluZSA9IGNvZGUuc3Vic3RyaW5nKDAsIGNvbnRlbnQuaW5kZXhPZih0ZXh0KSkuc3BsaXQoXCJcXG5cIikubGVuZ3RoICsgMTtcclxuICAgICAgICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcIiNkbz1qYXNzaWpzX2VkaXRvci5Db2RlRWRpdG9yJmZpbGU9XCIgKyBmb3VuZCArIFwiJmxpbmU9XCIgKyBsaW5lLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IGphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3Iub3Blbihmb3VuZCtcIjpcIitsaW5lLnRvU3RyaW5nKCkrXCI6MFwiKTtcclxuICAgICAgICAgfSovXHJcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBtYW5hZ2Ugc2hvcnRjdXRzXHJcbiAgICAgKi9cclxuICAgIHJlZ2lzdGVyS2V5cygpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICQodGhpcy5fY29kZVBhbmVsLmRvbSkua2V5ZG93bihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE1ICYmIGV2dC5zaGlmdEtleSkgey8vRjRcclxuICAgICAgICAgICAgICAgIC8vIHZhciB0aGlzcz10aGlzLl90aGlzLl9pZDtcclxuICAgICAgICAgICAgICAgIC8vIHZhciBlZGl0b3IgPSBhY2UuZWRpdCh0aGlzLl90aGlzLl9pZCk7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZSh0cnVlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUpIHsvL0Y0XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5ldmFsQ29kZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDExNikgey8vRjVcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoKFN0cmluZy5mcm9tQ2hhckNvZGUoZXZ0LndoaWNoKS50b0xvd2VyQ2FzZSgpID09PSAncycgJiYgZXZ0LmN0cmxLZXkpLyogJiYgKGV2dC53aGljaCA9PSAxOSkqLykgey8vU3RyK3NcclxuICAgICAgICAgICAgICAgIF90aGlzLnNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGV4dHJhY3QgbGluZXMgZnJvbSBjb2RlXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gY29kZSAtIHRoZSBjb2RlXHJcbiAgICAgKiBAcmV0dXJucyB7W3N0cmluZ119IC0gYWxsIGxpbmVzXHJcbiAgICAgKi9cclxuICAgIF9jb2RlVG9MaW5lcyhjb2RlKSB7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHdoaWxlIChsaW5lc1t4XS5zdGFydHNXaXRoKFwiL1wiKSB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiIFwiKVxyXG4gICAgICAgICAgICAgICAgfHwgbGluZXNbeF0uc3RhcnRzV2l0aChcIipcIikgfHwgbGluZXNbeF0uc3RhcnRzV2l0aChcIlxcdFwiKSkge1xyXG4gICAgICAgICAgICAgICAgbGluZXNbeF0gPSBsaW5lc1t4XS5zdWJzdHJpbmcoMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGxpbmVzO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBfZXZhbFRvQ3Vyc29yUmVhY2hlZCgpIHtcclxuICAgICAgICBpZiAodGhpcy5fX2V2YWxUb0N1cnNvclJlYWNoZWQgIT09IHRydWUpXHJcbiAgICAgICAgICAgIHRoaXMuX21haW4uc2hvdygnY29kZScpO1xyXG4gICAgICAgIHRoaXMuX19ldmFsVG9DdXJzb3JSZWFjaGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogYWRkIHZhcmlhYmxlcyB0byB2YXJpYWJlbHBhbmVsXHJcbiAgICAgKiBAcGFyYW0gT2JqZWN0PHN0cmluZyxvYmplY3Q+IHZhcmlhYmxlcyBbXCJuYW1lXCJdPXZhbHVlXHJcbiAgICAgKi9cclxuICAgIGFkZFZhcmlhYmxlcyh2YXJpYWJsZXMpIHtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5hZGRBbGwodmFyaWFibGVzKTtcclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKHVybDogc3RyaW5nLCByb290OiBDb21wb25lbnQsIGNvbXBvbmVudDogQ29tcG9uZW50LCBjYWNoZTogeyBbY29tcG9uZW50aWQ6IHN0cmluZ106IHsgY29tcG9uZW50OiBDb21wb25lbnQsIGxpbmU6IG51bWJlciwgY29sdW1uOiBudW1iZXIsIHBvczogbnVtYmVyLCBuYW1lOiBzdHJpbmcgfSB9LHBhcnNlcikge1xyXG5cclxuICAgICAgICBpZiAoY2FjaGVbY29tcG9uZW50Ll9pZF0gPT09IHVuZGVmaW5lZCAmJiBjb21wb25lbnRbXCJfX3N0YWNrXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmVzID0gY29tcG9uZW50W1wiX19zdGFja1wiXT8uc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGluZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzbGluZTogc3RyaW5nID0gbGluZXNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2xpbmUuaW5kZXhPZihcIiR0ZW1wLmpzXCIpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGwgPSBzbGluZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVudHIgPSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtjb21wb25lbnQuX2lkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogTnVtYmVyKHNwbFtzcGwubGVuZ3RoIC0gMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IE51bWJlcihzcGxbc3BsLmxlbmd0aCAtIDFdLnJlcGxhY2UoXCIpXCIsIFwiXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiBjb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvczogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKHVybCwgcm9vdCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0sIGNhY2hlLHBhcnNlcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudCA9PT0gcm9vdCkge1xyXG4gICAgICAgICAgICAgICAgLy9mZXJ0aWdcclxuICAgICAgICAgICAgICAgIHZhciBoaCA9IDA7XHJcbiAgICAgICAgICAgICAgICB2YXIgVFNTb3VyY2VNYXAgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuVFNTb3VyY2VNYXBcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWVzID0gT2JqZWN0LnZhbHVlcyhjYWNoZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdG1hcCA9IGF3YWl0IG5ldyBUU1NvdXJjZU1hcCgpLmdldExpbmVzRnJvbUpTKFwianMvXCIgKyB1cmwucmVwbGFjZShcIi50c1wiLCBcIi5qc1wiKSwgdmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0bWFwLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzW3hdLmNvbHVtbiA9IHRtYXBbeF0uY29sdW1uO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1t4XS5saW5lID0gdG1hcFt4XS5saW5lO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1t4XS5wb3MgPSB0aGlzLl9jb2RlUGFuZWwucG9zaXRpb25Ub051bWJlcih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvdzogdmFsdWVzW3hdLmxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbHVtbjogdmFsdWVzW3hdLmNvbHVtblxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9zZXR1cENsYXNzY29wZVxyXG4gICAgICAgICAgICAgICAgdmFyIGZvdW5kc2NvcGU9cGFyc2VyLmdldENsYXNzU2NvcGVGcm9tUG9zaXRpb24odGhpcy5fY29kZVBhbmVsLnZhbHVlLGNhY2hlW3Jvb3QuX2lkXS5wb3MpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNjb3BlPVt7Y2xhc3NuYW1lOiByb290Py5jb25zdHJ1Y3Rvcj8ubmFtZSwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9XTtcclxuICAgICAgICAgICAgICAgIGlmKGZvdW5kc2NvcGUpXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU9W2ZvdW5kc2NvcGVdO1xyXG4gICAgICAgICAgICAgICAgcGFyc2VyLnBhcnNlKHRoaXMuX2NvZGVQYW5lbC52YWx1ZSwgc2NvcGUpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHBhcnNlci5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbSA9IHBhcnNlci5kYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9uZXdfID0gY29tW1wiX25ld19cIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKF9uZXdfKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBfbmV3X1swXS5ub2RlLnBvcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVuZCA9IF9uZXdfWzBdLm5vZGUuZW5kO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhbHVlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlc1t4XS5wb3MgPj0gcG9zICYmIHZhbHVlc1t4XS5wb3MgPD0gZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzW3hdLm5hbWUgPSBrZXk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHZhbHVlcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHZhbHVlc1t4XS5uYW1lKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUodmFsdWVzW3hdLm5hbWUsIHZhbHVlc1t4XS5jb21wb25lbnQsZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIFxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIHBhcnNlci5wYXJzZSgsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgX2V2YWxDb2RlT25Mb2FkKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5jbGVhcigpO1xyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgICAgIHZhciBsaW5lcyA9IGNvZGUuc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBfdGhpcy5fY29kZVBhbmVsLmdldEJyZWFrcG9pbnRzKCk7XHJcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gX3RoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIiR0ZW1wLnRzXCIpO1xyXG4gICAgICAgIGF3YWl0IGphc3NpanMuZGVidWdnZXIucmVtb3ZlQnJlYWtwb2ludHNGb3JGaWxlKGZpbGVuYW1lKTtcclxuICAgICAgICBmb3IgKHZhciBsaW5lIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChicmVha3BvaW50c1tsaW5lXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IGxpbmVzW2xpbmVdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGphc3NpanMuZGVidWdnZXIuYnJlYWtwb2ludENoYW5nZWQoZmlsZW5hbWUsIGxpbmUsIHJvdywgdHJ1ZSwgXCJkZWJ1Z3BvaW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaXNsb2NhbGRiID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfbG9jYWxzZXJ2ZXIuREJNYW5hZ2VyXCIpO1xyXG4gICAgICAgIGlmIChpc2xvY2FsZGIgJiYgY29kZS5pbmRleE9mKFwiQCREQk9iamVjdChcIikgPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+aXNsb2NhbGRiKS5kZXN0cm95Q29ubmVjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YS50ZXN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9jYXB1cmUgY3JlYXRlZCBDb21wb25lbnRzXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhvb2sobmFtZSwgY29tcG9uZW50OiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0c3RhY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleD8uc3RhY2s/LmluZGV4T2YoXCIkdGVtcC5qc1wiKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W1wiX19zdGFja1wiXSA9IGV4LnN0YWNrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgQ29tcG9uZW50Lm9uQ29tcG9uZW50Q3JlYXRlZChob29rKTtcclxuICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IGRhdGEudGVzdChuZXcgVGVzdCgpKTtcclxuICAgICAgICAgICAgQ29tcG9uZW50Lm9mZkNvbXBvbmVudENyZWF0ZWQoaG9vayk7XHJcblxyXG4gICAgICAgICAgICAvLyBQcm9taXNlLnJlc29sdmUocmV0KS50aGVuKGFzeW5jIGZ1bmN0aW9uKHJldCkge1xyXG4gICAgICAgICAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAocmV0LmxheW91dCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcInRoaXNcIiwgcmV0KTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy9fdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoXCJtZVwiLCByZXQubWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldCBpbnN0YW5jZW9mIENvbXBvbmVudCAmJiByZXRbXCJyZXBvcnR0eXBlXCJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3JlcXVpcmUoW1wiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIiwgXCJqYXNzaWpzX2VkaXRvci91dGlsL1BhcnNlclwiXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHZhciBDb21wb25lbnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgLy8gICB2YXIgUGFyc2VyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfZWRpdG9yLmJhc2UuUGFyc2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgQ29tcG9uZW50RGVzaWduZXIgPSBhd2FpdCBjbGFzc2VzLmxvYWRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvbXBvbmVudERlc2lnbmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGFyc2VyID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBhcnNlcj1uZXcgUGFyc2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGF3YWl0IF90aGlzLmZpbGxWYXJpYWJsZXNBbmRTZXR1cFBhcnNlcihmaWxlbmFtZSwgcmV0LCByZXQsIHt9LHBhcnNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKChfdGhpcy5fZGVzaWduKSBpbnN0YW5jZW9mIENvbXBvbmVudERlc2lnbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbiA9IG5ldyBDb21wb25lbnREZXNpZ25lcigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9tYWluLmFkZChfdGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJjb2RlRWRpdG9yXCJdID0gX3RoaXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24uY29ubmVjdFBhcnNlcihwYXJzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXQ7XHJcbiAgICAgICAgICAgICAgICAgICAgLy99KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmV0W1wicmVwb3J0ZGVzaWduXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1aXJlKFtcImphc3NpanNfcmVwb3J0L2Rlc2lnbmVyL1JlcG9ydERlc2lnbmVyXCIsIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCIsIFwiamFzc2lqc19lZGl0b3IvdXRpbC9QYXJzZXJcIl0sIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIFJlcG9ydERlc2lnbmVyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfcmVwb3J0LmRlc2lnbmVyLlJlcG9ydERlc2lnbmVyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfcmVwb3J0LlJlcG9ydERlc2lnblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgUmVwb3J0RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgUGFyc2VyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfZWRpdG9yLmJhc2UuUGFyc2VyXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbiA9IG5ldyBSZXBvcnREZXNpZ25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwYXJzZXI9bmV3IFBhcnNlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFyc2VyLmNsYXNzU2NvcGU9W3tjbGFzc25hbWU6IF90aGlzLl9kZXNpZ24/LmNvbnN0cnVjdG9yPy5uYW1lLCBtZXRob2RuYW1lOiBcImxheW91dFwiIH0sIHsgY2xhc3NuYW1lOiB1bmRlZmluZWQsIG1ldGhvZG5hbWU6IFwidGVzdFwiIH1dO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduLmNvbm5lY3RQYXJzZXIocGFyc2VyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJlcCA9IG5ldyBSZXBvcnREZXNpZ24oKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwLmRlc2lnbiA9IE9iamVjdC5hc3NpZ24oe30sIHJldC5yZXBvcnRkZXNpZ24pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAocmV0LnZhbHVlICYmIHJlcC5kZXNpZ24uZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5kYXRhID0gcmV0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChyZXQuZGF0YSAmJiByZXAuZGVzaWduLmRhdGEgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcC5kZXNpZ24uZGF0YSA9IHJldC5kYXRhO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJldC5wYXJhbWV0ZXIgJiYgcmVwLmRlc2lnbi5wYXJhbWV0ZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcC5kZXNpZ24ucGFyYW1ldGVyID0gcmV0LnBhcmFtZXRlcjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImRlc2lnbmVkQ29tcG9uZW50XCJdID0gcmVwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLyogICByZXF1aXJlKFtcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmQgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19yZXBvcnQuUmVwb3J0RGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHJlcCA9IHJkW1wiZnJvbUpTT05cIl0ocmV0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImRlc2lnbmVkQ29tcG9uZW50XCJdID0gcmVwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB9KTsqL1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfS8qZWxzZSBpZiAocmV0W1wicmVwb3J0dHlwZVwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZShbXCJqYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lclwiXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduZXIgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19yZXBvcnQuZGVzaWduZXIuUmVwb3J0RGVzaWduZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKChfdGhpcy5fZGVzaWduKSBpbnN0YW5jZW9mIFJlcG9ydERlc2lnbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbiA9IG5ldyBSZXBvcnREZXNpZ25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXQ7XHJcblxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgc2F2ZVRlbXBGaWxlKGZpbGU6IHN0cmluZywgY29kZTogc3RyaW5nKSB7XHJcblxyXG5cclxuICAgICAgICAvL0B0cy1pZ25vcmUgXHJcbiAgICAgICAgdmFyIHRzcyA9IGF3YWl0IGltcG9ydChcImphc3NpanNfZWRpdG9yL3V0aWwvVHlwZXNjcmlwdFwiKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmUgXHJcbiAgICAgICAgdmFyIHNldHRpbmdzID0gVHlwZXNjcmlwdC5jb21waWxlclNldHRpbmdzO1xyXG4gICAgICAgIHNldHRpbmdzW1wiaW5saW5lU291cmNlTWFwXCJdID0gdHJ1ZTtcclxuICAgICAgICBzZXR0aW5nc1tcImlubGluZVNvdXJjZXNcIl0gPSB0cnVlO1xyXG4gICAgICAgIHZhciBmaWxlcyA9IGF3YWl0IHRzcy5kZWZhdWx0LnRyYW5zcGlsZShmaWxlICsgXCIudHNcIiwgY29kZSk7XHJcblxyXG4gICAgICAgIHZhciBjb2RldHMgPSAtMTtcclxuICAgICAgICB2YXIgY29kZW1hcCA9IC0xO1xyXG4gICAgICAgIHZhciBjb2RlanMgPSAtMTtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGZpbGVzLmZpbGVOYW1lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBpZiAoZmlsZXMuZmlsZU5hbWVzW3hdLmVuZHNXaXRoKFwiLnRzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RldHMgPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChmaWxlcy5maWxlTmFtZXNbeF0uZW5kc1dpdGgoXCIuanMubWFwXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlbWFwID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlsZXMuZmlsZU5hbWVzW3hdLmVuZHNXaXRoKFwiLmpzXCIpKSB7XHJcbiAgICAgICAgICAgICAgICBjb2RlanMgPSB4O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qICB2YXIgYWxsID0gSlNPTi5wYXJzZShmaWxlcy5jb250ZW50c1tjb2RlbWFwXSk7XHJcbiAgICAgICAgICBhbGxbXCJzb3VyY2VzQ29udGVudFwiXSA9IFtmaWxlcy5jb250ZW50c1tjb2RldHNdXTtcclxuICAgICAgICAgIGZpbGVzLmNvbnRlbnRzW2NvZGVtYXBdID0gSlNPTi5zdHJpbmdpZnkoYWxsKTtcclxuICAgICAgICAgIHZhciBiNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChmaWxlcy5jb250ZW50c1tjb2RlbWFwXSkpKTtcclxuICAgICAgICAgIHZhciBwb3MgPSBmaWxlcy5jb250ZW50c1tjb2RlanNdLmluZGV4T2YoXCIvL1wiICsgXCIjIHNvdXJjZU1hcHBpbmdVUkw9XCIpO1xyXG4gICAgICAgICAgZmlsZXMuY29udGVudHNbY29kZWpzXSA9IGZpbGVzLmNvbnRlbnRzW2NvZGVqc10uc3Vic3RyaW5nKDAsIHBvcyk7XHJcbiAgICAgICAgICBmaWxlcy5jb250ZW50c1tjb2RlanNdID0gZmlsZXMuY29udGVudHNbY29kZWpzXSArIFwiLy9cIiArIFwiIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zjg7YmFzZTY0LFwiICsgYjY0O1xyXG4gICAgICAgICAgKi9cclxuICAgICAgICBjb25zdCBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XHJcblxyXG4gICAgICAgIHZhciByZXQgPSBuZXcgUHJvbWlzZSgocmVzLCByZWopID0+IHtcclxuICAgICAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSAoZXZ0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjaGFubmVsLnBvcnQxLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICByZXMoZXZ0KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBsZXQgYWJzcGF0aCA9IGxvY2F0aW9uLm9yaWdpbiArIGxvY2F0aW9uLnBhdGhuYW1lO1xyXG4gICAgICAgIGFic3BhdGggPSBhYnNwYXRoLnN1YnN0cmluZygwLCBhYnNwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSArIDEpO1xyXG4gICAgICAgIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLmNvbnRyb2xsZXIucG9zdE1lc3NhZ2Uoe1xyXG4gICAgICAgICAgICB0eXBlOiAnU0FWRV9GSUxFJyxcclxuICAgICAgICAgICAgZmlsZW5hbWU6IGFic3BhdGggKyBmaWxlcy5maWxlTmFtZXNbY29kZWpzXSxcclxuICAgICAgICAgICAgY29kZTogZmlsZXMuY29udGVudHNbY29kZWpzXVxyXG4gICAgICAgIH0sIFtjaGFubmVsLnBvcnQyXSk7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBhd2FpdCByZXQ7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGV4ZWN1dGUgdGhlIGN1cnJlbnQgY29kZVxyXG4gICAgICogQHBhcmFtIHtib29sZWFufSB0b0N1cnNvciAtICBpZiB0cnVlIHRoZSB2YXJpYWJsZXMgd2VyZSBpbnNwZWN0ZWQgb24gY3Vyc29yIHBvc2l0aW9uLCBcclxuICAgICAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgZmFsc2UgYXQgdGhlIGVuZCBvZiB0aGUgbGF5b3V0KCkgZnVuY3Rpb24gb3IgYXQgdGhlIGVuZCBvZiB0aGUgY29kZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBldmFsQ29kZSh0b0N1cnNvciA9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHRoaXMuX19ldmFsVG9DdXJzb3JSZWFjaGVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuY2xlYXIoKTtcclxuXHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIGxpbmVzID0gY29kZS5zcGxpdChcIlxcblwiKTtcclxuXHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB3aW5kb3dbXCJ0ZXN0XCJdID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICBjb2RlID0gXCJcIjtcclxuICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGxpbmVzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIGNvZGUgPSBjb2RlICsgbGluZXNbeF0gKyBcIlxcblwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb2RlID0gY29kZTtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHZhciB0bXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgICAgICB2YXIganNmaWxlID0gX3RoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIlwiKSArIFwiJHRlbXBcIjtcclxuICAgICAgICAvL2F3YWl0IG5ldyBTZXJ2ZXIoKS5zYXZlRmlsZShcInRtcC9cIiArIF90aGlzLl9maWxlLCBjb2RlKTtcclxuICAgICAgICAvL29ubHkgbG9jYWwgLSBubyBUUyBGaWxlIGluIERlYnVnZ2VyXHJcbiAgICAgICAgYXdhaXQgdGhpcy5zYXZlVGVtcEZpbGUoanNmaWxlLCBjb2RlKTtcclxuXHJcbiAgICAgICAgdHJ5IHsgcmVxdWlyZWpzLnVuZGVmKFwianMvXCIgKyBqc2ZpbGUgKyBcIi5qc1wiKTsgfSBjYXRjaCAoZXgpIHsgfTtcclxuICAgICAgICB2YXIgb25sb2FkID0gZnVuY3Rpb24gKGRhdGEpIHtcclxuXHJcbiAgICAgICAgICAgIF90aGlzLl9ldmFsQ29kZU9uTG9hZChkYXRhKS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9hd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHNldFRpbWVvdXQocmVzb2x2ZSwgMTAwMCkpO1xyXG4gICAgICAgIC8vaWYgdGhpcyBpcyB0aGUgZmlyc3Qgc2F2ZSBmb3IgdGhlIHRtcGZpbGUgdGhlbiBpdCBmYWlscyAtIEkgZG9udCBrbm93IHdoeSwgZ2l2ZSBpdCBhIHNlY29uZCB0cnlcclxuICAgICAgICByZXF1aXJlKFtcImpzL1wiICsganNmaWxlICsgXCIuanNcIl0sIG9ubG9hZCwvKmVycm9yKi9mdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJyZWxvYWRcIik7XHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHJlcXVpcmUoW1wianMvXCIgKyBqc2ZpbGUgKyBcIi5qc1wiXSwgb25sb2FkLCBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0sIDIwKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogc3dpdGNoIHZpZXdcclxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gdmlldyAtIFwiZGVzaWduXCIgb3IgXCJjb2RlXCJcclxuICAgICAqL1xyXG4gICAgc2V0IHZpZXdtb2RlKHZpZXcpIHtcclxuICAgICAgICB0aGlzLl9tYWluLnNob3codmlldyk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIGdldCBhbGwga25vd24gaW5zdGFuY2VzIGZvciB0eXBlXHJcbiAgICAqIEBwYXJhbSB7dHlwZX0gdHlwZSAtIHRoZSB0eXBlIHdlIGFyZSBpbnRlcmVzdGVkXHJcbiAgICAqIEByZXR1cm5zIHtbc3RyaW5nXX1cclxuICAgICovXHJcbiAgICBnZXRWYXJpYWJsZXNGb3JUeXBlKHR5cGUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmFtZSBvZiB0aGUgdmFyaWFiZWwgdGhhdCBob2xkcyB0aGUgb2JqZWN0XHJcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGVcclxuICAgICAqL1xyXG4gICAgZ2V0VmFyaWFibGVGcm9tT2JqZWN0KG9iKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzLmdldFZhcmlhYmxlRnJvbU9iamVjdChvYik7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuYW1lIG9iamVjdCBvZiB0aGUgZ2l2ZW4gdmFyaWFiZWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvYiAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICovXHJcbiAgICBnZXRPYmplY3RGcm9tVmFyaWFibGUodmFybmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlcy5nZXRPYmplY3RGcm9tVmFyaWFibGUodmFybmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgICogcmVuYW1lcyBhIHZhcmlhYmxlIGluIGRlc2lnblxyXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvbGROYW1lXHJcbiAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5ld05hbWVcclxuICAgICAgKi9cclxuICAgIHJlbmFtZVZhcmlhYmxlKG9sZE5hbWUsIG5ld05hbWUpIHtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5yZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKTtcclxuICAgICAgICBpZiAodGhpcy5fZGVzaWduICE9PSB1bmRlZmluZWQgJiYgdGhpcy5fZGVzaWduW1wiX2NvbXBvbmVudEV4cGxvcmVyXCJdICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnbltcIl9jb21wb25lbnRFeHBsb3JlclwiXS51cGRhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2JqZWN0IG9mIHRoZSBnaXZlbiB2YXJpYWJlbFxyXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG9iIC0gdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmxlXHJcbiAgICAgKi9cclxuICAgIHJlbW92ZVZhcmlhYmxlSW5EZXNpZ24odmFybmFtZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlcy5yZW1vdmVWYXJpYWJsZSh2YXJuYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgY29kZVxyXG4gICAgICovXHJcbiAgICBzZXQgdmFsdWUodmFsdWUpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZmlsZSA9IHRoaXMuX2ZpbGU7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLnZhbHVlID0gdmFsdWU7XHJcblxyXG4gICAgfVxyXG4gICAgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICB9XHJcbiAgICBzZXRDdXJzb3JQb3JpdGlvbihwb3NpdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJzb3JQb3NpdGlvbiA9IHRoaXMuX2NvZGVQYW5lbC5udW1iZXJUb1Bvc2l0aW9uKHBvc2l0aW9uKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gcG9zaXRpb24gLSB0aGUgY3VycmVudCBjdXJzb3IgcG9zaXRpb24ge3Jvdz0gLGNvbHVtbj19XHJcbiAgICAqL1xyXG4gICAgc2V0IGN1cnNvclBvc2l0aW9uKGN1cnNvcjogeyByb3c6IG51bWJlciwgY29sdW1uOiBudW1iZXIgfSkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5jdXJzb3JQb3NpdGlvbiA9IGN1cnNvcjtcclxuICAgIH1cclxuICAgIGdldCBjdXJzb3JQb3NpdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZVBhbmVsLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQG1lbWJlciB7c3RyaW5nfSAtIHRpdGxlIG9mIHRoZSBjb21wb25lbnRcclxuICAgICAqL1xyXG4gICAgZ2V0IHRpdGxlKCkge1xyXG4gICAgICAgIHZhciBzID0gdGhpcy5maWxlLnNwbGl0KFwiL1wiKTtcclxuICAgICAgICByZXR1cm4gc1tzLmxlbmd0aCAtIDFdO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aGUgdXJsIHRvIGVkaXRcclxuICAgICovXHJcbiAgICBzZXQgZmlsZSh2YWx1ZTogc3RyaW5nKSB7IC8vdGhlIENvZGVcclxuICAgICAgICB0aGlzLl9maWxlID0gdmFsdWU7XHJcbiAgICAgICAgdGhpcy5vcGVuRmlsZSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgaXNVcmxUYWc6IHRydWUsIGlkOiB0cnVlIH0pXHJcbiAgICBnZXQgZmlsZSgpOiBzdHJpbmcge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9maWxlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIGdvZXMgdG8gdGhlIGxpbmUgbnVtYmVyIFxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gdmFsdWUgLSB0aGUgbGluZSBudW1iZXIgXHJcbiAgICAqL1xyXG4gICAgc2V0IGxpbmUodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuX2xpbmUgPSBOdW1iZXIodmFsdWUpO1xyXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogdGhpcy5fbGluZSwgY29sdW1uOiAxIH07XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogX3RoaXMuX2xpbmUsIGNvbHVtbjogMSB9O1xyXG4gICAgICAgIH0sIDMwMCk7XHJcbiAgICAgICAgLypzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5jdXJzb3JQb3NpdGlvbiA9IHsgcm93OiB2YWx1ZSwgY29sdW1uOiAwIH07XHJcbiAgICAgICAgfSwgMTAwMCk7Ly9zdGFydCB0YWtlcyBvbmUgc2Vjb25kLi4uLiovXHJcbiAgICB9XHJcbiAgICBAJFByb3BlcnR5KHsgaXNVcmxUYWc6IHRydWUgfSlcclxuICAgIGdldCBsaW5lKCk6IG51bWJlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3Vyc29yUG9zaXRpb24ucm93O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBvcGVuIHRoZSBmaWxlXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIG9wZW5GaWxlKF9maWxlKSB7XHJcbiAgICAgICAgdGhpcy5fZmlsZSA9IF9maWxlO1xyXG4gICAgICAgIHZhciBjb250ZW50ID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKHRoaXMuX2ZpbGUpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5maWxlID0gX2ZpbGU7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLnZhbHVlID0gY29udGVudDtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwud2lkdGggPSBcIjEwMCVcIjtcclxuICAgICAgICAvLyAgdGhpcy5fY29kZVBhbmVsLmhlaWdodD1cIjEwMCVcIjtcclxuICAgICAgICB0aGlzLl9tYWluLnVwZGF0ZSgpO1xyXG4gICAgICAgIGlmICh0aGlzLl9saW5lKVxyXG4gICAgICAgICAgICB0aGlzLmxpbmUgPSB0aGlzLl9saW5lO1xyXG5cclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVZpZXcuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2Vycm9ycy5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMuX2Rlc2lnbi5kZXN0cm95KCk7XHJcbiAgICAgICAgLy90aGlzLl9tYWluLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogdW5kbyBhY3Rpb25cclxuICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC51bmRvKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciBlZGl0b3IgPSBuZXcgQ29kZUVkaXRvcigpO1xyXG4gICAgLy92YXIgdXJsID0gXCJqYXNzaWpzX2VkaXRvci9BY2VQYW5lbC50c1wiO1xyXG4gICAgZWRpdG9yLmhlaWdodCA9IDMwMDtcclxuICAgIGVkaXRvci53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgLy9hd2FpdCBlZGl0b3Iub3BlbkZpbGUodXJsKTtcclxuICAgIGVkaXRvci52YWx1ZSA9IGBpbXBvcnQgeyBCdXR0b24gfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcclxuaW1wb3J0IHsgUmVwZWF0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9SZXBlYXRlclwiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG50eXBlIE1lID0ge1xyXG4gICAgYnV0dG9uMT86IEJ1dHRvbjtcclxufTtcclxuQCRDbGFzcyhcImRlbW8uRW1wdHlEaWFsb2dcIilcclxuZXhwb3J0IGNsYXNzIEVtcHR5RGlhbG9nIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgbWU6IE1lO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLm1lID0ge307XHJcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XHJcbiAgICB9XHJcbiAgICBsYXlvdXQobWU6IE1lKSB7XHJcbiAgICAgICAgbWUuYnV0dG9uMSA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0aGlzLmFkZChtZS5idXR0b24xKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciByZXQgPSBuZXcgRW1wdHlEaWFsb2coKTtcclxuICAgIHJldHVybiByZXQ7XHJcbn1cclxuYDtcclxuICAgIGVkaXRvci5ldmFsQ29kZSgpO1xyXG4gICAgcmV0dXJuIGVkaXRvcjtcclxuXHJcbn07XHJcbi8vamFzc2lqcy5teVJlcXVpcmUobW9kdWwuY3NzW1wiamFzc2lqc19lZGl0b3IuY3NzXCJdKTsiXX0=