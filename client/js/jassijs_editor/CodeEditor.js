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
                        var sname = values[x].name;
                        var found = false;
                        this.variables.value.forEach((it) => {
                            if (it.name === sname)
                                found = true;
                        });
                        //sometimes does a constructor create other Components so we need the first one
                        if (found)
                            continue;
                        if (sname && this.variables.getObjectFromVariable(sname) === undefined) {
                            this.variables.addVariable(sname, values[x].component, false);
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
            var _a, _b;
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
                        // await _this.fillVariablesAndSetupParser(filename, ret, ret, {},parser);
                        if (!((_this._design) instanceof ComponentDesigner)) {
                            _this._design = new ComponentDesigner();
                            _this._main.add(_this._design, "Design", "design");
                            _this._design["codeEditor"] = _this;
                        }
                        //@ts-ignore
                        _this._design.connectParser(parser);
                        _this._design["designedComponent"] = ret;
                        Component_1.Component.offComponentCreated(hook);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29kZUVkaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2phc3NpanNfZWRpdG9yL0NvZGVFZGl0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnQ0EsSUFBTSw0QkFBNEIsR0FBbEMsTUFBTSw0QkFBNEI7S0FLakMsQ0FBQTtJQUhHO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRSxDQUFDOzttRkFDNUU7SUFFbEM7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLFVBQVUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLENBQUM7O3dGQUNyRTtJQUpyQyw0QkFBNEI7UUFGakMsSUFBQSw4QkFBbUIsR0FBRTtRQUNyQixJQUFBLGNBQU0sRUFBQyw2Q0FBNkMsQ0FBQztPQUNoRCw0QkFBNEIsQ0FLakM7SUFHRDs7O09BR0c7SUFFSCxJQUFhLFVBQVUsa0JBQXZCLE1BQWEsVUFBVyxTQUFRLGFBQUs7UUFjakMsWUFBWSxhQUErRCxTQUFTO1lBQ2hGLEtBQUssRUFBRSxDQUFDO1lBQ1IsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxhQUFLLEVBQUUsQ0FBQztZQUM3QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksYUFBSyxFQUFFLENBQUM7WUFDaEMsbUdBQW1HO1lBQ25HLElBQUksS0FBSyxHQUFHLENBQUMsZ0VBQWdFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FB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LE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN2Qix1QkFBdUI7WUFDdkIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3BCLENBQUM7UUFDRDs7VUFFRTtRQUNGLElBQUk7WUFDQSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLENBQUM7S0FFSixDQUFBO0lBdERHO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUM7OzswQ0FHdkM7SUFpQkQ7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLENBQUM7OzswQ0FHN0I7SUF0c0JRLFVBQVU7UUFEdEIsSUFBQSxjQUFNLEVBQUMsMkJBQTJCLENBQUM7O09BQ3ZCLFVBQVUsQ0F1dUJ0QjtJQXZ1QlksZ0NBQVU7SUF5dUJoQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLE1BQU0sR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1FBQzlCLHlDQUF5QztRQUN6QyxNQUFNLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNwQixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUN0Qiw2QkFBNkI7UUFDN0IsTUFBTSxDQUFDLEtBQUssR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBd0JsQixDQUFDO1FBQ0UsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLE9BQU8sTUFBTSxDQUFDO0lBRWxCLENBQUM7SUFsQ0Qsb0JBa0NDO0lBQUEsQ0FBQzs7QUFDRixxREFBcUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgamFzc2lqcywgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgeyBDb2RlUGFuZWwgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29kZVBhbmVsXCI7XHJcbmltcG9ydCB7IFZhcmlhYmxlUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9WYXJpYWJsZVBhbmVsXCI7XHJcbmltcG9ydCB7IERvY2tpbmdDb250YWluZXIgfSBmcm9tIFwiamFzc2lqcy91aS9Eb2NraW5nQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IEVycm9yUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9FcnJvclBhbmVsXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQgcmVnaXN0cnkgZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7IFNlcnZlciB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9TZXJ2ZXJcIjtcclxuaW1wb3J0IHsgUmVsb2FkZXIgfSBmcm9tIFwiamFzc2lqcy91dGlsL1JlbG9hZGVyXCI7XHJcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5cclxuaW1wb3J0IHsgQWNlUGFuZWwgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQWNlUGFuZWxcIjtcclxuaW1wb3J0IHR5cGVzY3JpcHQsIHsgVHlwZXNjcmlwdCB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIjtcclxuaW1wb3J0IHsgTW9uYWNvUGFuZWwgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvTW9uYWNvUGFuZWxcIjtcclxuaW1wb3J0IHsgJFNldHRpbmdzRGVzY3JpcHRvciwgU2V0dGluZ3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvU2V0dGluZ3NcIjtcclxuaW1wb3J0IHsgVGVzdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9UZXN0XCI7XHJcbmltcG9ydCBtb2R1bCBmcm9tIFwiLi9tb2R1bFwiO1xyXG5cclxuXHJcblxyXG5kZWNsYXJlIGdsb2JhbCB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEtub3duU2V0dGluZ3Mge1xyXG4gICAgICAgIERldmVsb3BtZW50X0RlZmF1bHRFZGl0b3I6IFwiYWNlXCIgfCBcIm1vbmFjb1wiIHwgXCJhY2VPbkJyb3dzZXJcIjtcclxuICAgICAgICBEZXZlbG9wbWVudF9Nb2FuYWNvRWRpdG9yVGhlbWU6IFwidnMtZGFya1wiIHwgXCJ2cy1saWdodFwiIHwgXCJoYy1ibGFja1wiO1xyXG4gICAgfVxyXG59XHJcbkAkU2V0dGluZ3NEZXNjcmlwdG9yKClcclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JTZXR0aW5nc0Rlc2NyaXB0b3JcIilcclxuY2xhc3MgQ29kZUVkaXRvclNldHRpbmdzRGVzY3JpcHRvciB7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1wiYWNlXCIsIFwibW9uYWNvXCIsIFwiYWNlT25Ccm93c2VyXCJdLCBkZWZhdWx0OiBcImFjZU9uQnJvd3NlclwiLCBjaG9vc2VGcm9tU3RyaWN0OiB0cnVlIH0pXHJcbiAgICBEZXZlbG9wbWVudF9EZWZhdWx0RWRpdG9yOiBzdHJpbmc7XHJcbiAgICBAJFByb3BlcnR5KHsgY2hvb3NlRnJvbTogW1widnMtZGFya1wiLCBcInZzLWxpZ2h0XCIsIFwiaGMtYmxhY2tcIl0sIGRlZmF1bHQ6IFwidnMtbGlnaHRcIiwgY2hvb3NlRnJvbVN0cmljdDogdHJ1ZSB9KVxyXG4gICAgRGV2ZWxvcG1lbnRfTW9hbmFjb0VkaXRvclRoZW1lOiBzdHJpbmc7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogUGFuZWwgZm9yIGVkaXRpbmcgc291cmNlc1xyXG4gKiBAY2xhc3MgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvclxyXG4gKi9cclxuQCRDbGFzcyhcImphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3JcIilcclxuZXhwb3J0IGNsYXNzIENvZGVFZGl0b3IgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBfbWFpbjogRG9ja2luZ0NvbnRhaW5lcjtcclxuICAgIF9jb2RlVmlldzogUGFuZWw7XHJcbiAgICBfY29kZVRvb2xiYXI6IFBhbmVsO1xyXG4gICAgX2NvZGVQYW5lbDogQ29kZVBhbmVsO1xyXG4gICAgX2Vycm9yczogRXJyb3JQYW5lbDtcclxuICAgIF9maWxlOiBzdHJpbmc7XHJcbiAgICB2YXJpYWJsZXM6IFZhcmlhYmxlUGFuZWw7XHJcbiAgICBfZGVzaWduOiBQYW5lbDtcclxuICAgIGVkaXRNb2RlOiBib29sZWFuO1xyXG4gICAgX19ldmFsVG9DdXJzb3JSZWFjaGVkOiBib29sZWFuO1xyXG5cclxuXHJcbiAgICBwcml2YXRlIF9saW5lOiBudW1iZXI7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wZXJ0aWVzOiB7IGNvZGVQYW5lbD86IENvZGVQYW5lbCwgaGlkZVRvb2xiYXI/OiBib29sZWFuIH0gPSB1bmRlZmluZWQpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubWF4aW1pemUoKTtcclxuICAgICAgICB0aGlzLl9tYWluID0gbmV3IERvY2tpbmdDb250YWluZXIoKTtcclxuICAgICAgICB0aGlzLl9jb2RlVmlldyA9IG5ldyBQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVUb29sYmFyID0gbmV3IFBhbmVsKCk7XHJcbiAgICAgICAgLy9pZiAoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XHJcbiAgICAgICAgbGV0IG1vYmlsID0gKC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSk7XHJcbiAgICAgICAgbGV0IHNldHQgPSBTZXR0aW5ncy5nZXRzKFNldHRpbmdzLmtleXMuRGV2ZWxvcG1lbnRfRGVmYXVsdEVkaXRvcik7XHJcbiAgICAgICAgaWYgKHByb3BlcnRpZXM/LmNvZGVQYW5lbCkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBwcm9wZXJ0aWVzLmNvZGVQYW5lbDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBDb2RlUGFuZWwudHlwZXNjcmlwdCA9IHR5cGVzY3JpcHQ7XHJcbiAgICAgICAgICAgIGlmIChzZXR0ID09PSBcImFjZVwiIHx8IChtb2JpbCAmJiAoc2V0dCA9PT0gXCJhY2VPbkJyb3dzZXJcIiB8fCBzZXR0ID09PSB1bmRlZmluZWQpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IEFjZVBhbmVsKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IE1vbmFjb1BhbmVsKCk7XHJcbiAgICAgICAgICAgICAgICAvLyB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgQWNlUGFuZWwoKTsgXHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9lcnJvcnMgPSBuZXcgRXJyb3JQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2ZpbGUgPSBcIlwiO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gbmV3IFZhcmlhYmxlUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ24gPSBuZXcgUGFuZWwoKTtcclxuICAgICAgICB0aGlzLl9pbml0KHByb3BlcnRpZXM/LmhpZGVUb29sYmFyKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBwcml2YXRlIF9pbml0Q29kZVBhbmVsKCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC53aWR0aCA9IFwiMTAwJVwiO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5tb2RlID0gXCJ0eXBlc2NyaXB0XCI7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmhlaWdodCA9IFwiY2FsYygxMDAlIC0gMzFweClcIjtcclxuICAgICAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC5vbkJyZWFrcG9pbnRDaGFuZ2VkKGZ1bmN0aW9uIChsaW5lLCBjb2x1bW4sIGVuYWJsZSwgdHlwZSkge1xyXG4gICAgICAgICAgICBqYXNzaWpzLmRlYnVnZ2VyLmJyZWFrcG9pbnRDaGFuZ2VkKF90aGlzLl9maWxlLCBsaW5lLCBjb2x1bW4sIGVuYWJsZSwgdHlwZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfaW5pdChoaWRlVG9vbGJhcjogYm9vbGVhbikge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5faW5pdENvZGVQYW5lbCgpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVWaWV3W1wiaG9yaXpvbnRhbFwiXSA9IHRydWU7XHJcblxyXG4gICAgICAgIGlmIChoaWRlVG9vbGJhciAhPT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVRvb2xiYXIpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhcltcImhvcml6b250YWxcIl0gPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5oZWlnaHQgPSBcIjMwXCI7XHJcblxyXG4gICAgICAgICAgICB2YXIgcnVuID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICBydW4uaWNvbiA9IFwibWRpIG1kaS1jYXItaGF0Y2hiYWNrIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgICAgIHJ1bi50b29sdGlwID0gXCJSdW4oRjQpXCI7XHJcbiAgICAgICAgICAgIHJ1bi5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5hZGQocnVuKTtcclxuXHJcblxyXG4gICAgICAgICAgICB2YXIgc2F2ZSA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICAgICAgc2F2ZS50b29sdGlwID0gXCJTYXZlKEN0cmwrUylcIjtcclxuICAgICAgICAgICAgc2F2ZS5pY29uID0gXCJtZGkgbWRpLWNvbnRlbnQtc2F2ZSBtZGktMThweFwiO1xyXG4gICAgICAgICAgICBzYXZlLm9uY2xpY2soZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHNhdmUpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIHZhciB1bmRvID0gbmV3IEJ1dHRvbigpO1xyXG4gICAgICAgICAgICB1bmRvLmljb24gPSBcIm1kaSBtZGktdW5kbyBtZGktMThweFwiO1xyXG4gICAgICAgICAgICB1bmRvLnRvb2x0aXAgPSBcIlVuZG8gKFN0cmcrWilcIjtcclxuICAgICAgICAgICAgdW5kby5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jb2RlUGFuZWwudW5kbygpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKHVuZG8pO1xyXG5cclxuICAgICAgICAgICAgdmFyIGdvdG8gPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgICAgIGdvdG8uaWNvbiA9IFwibWRpIG1kaS1yYXktc3RhcnQtYXJyb3cgbWRpLTE4cHhcIjtcclxuICAgICAgICAgICAgZ290by50b29sdGlwID0gXCJHb3RvXCI7XHJcbiAgICAgICAgICAgIGdvdG8ub25jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBfdGhpcy5nb3RvRGVjbGFyYXRpb24oKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGphc3NpanNbXCIkQ29kZUVkaXRvclwiXSA9IENvZGVFZGl0b3I7XHJcbiAgICAgICAgICAgICQoZ290by5kb20pLmF0dHIoXCJvbmRyb3BcIiwgXCJldmVudC5wcmV2ZW50RGVmYXVsdCgpO2phc3NpanMuJENvZGVFZGl0b3Iuc2VhcmNoKGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKCd0ZXh0JykpO1wiKTtcclxuICAgICAgICAgICAgJChnb3RvLmRvbSkuYXR0cihcIm9uZHJhZ292ZXJcIiwgXCJldmVudC5wcmV2ZW50RGVmYXVsdCgpO1wiKTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZVRvb2xiYXIuYWRkKGdvdG8pO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVBhbmVsKTtcclxuXHJcbiAgICAgICAgdGhpcy5fbWFpbi53aWR0aCA9IFwiY2FsYygxMDAlIC0gMXB4KVwiO1xyXG4gICAgICAgIHRoaXMuX21haW4uaGVpZ2h0ID0gXCI5OSVcIjtcclxuICAgICAgICB0aGlzLl9tYWluLm9ucmVzaXplID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLl9jb2RlUGFuZWwucmVzaXplKCk7XHJcblxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyp2YXIgdGVzdCA9IG5ldyBCdXR0b24oKTtcclxuICAgICAgICB0ZXN0Lmljb24gPSBcIm1kaSBtZGktYnVnIG1kaS0xOHB4XCI7XHJcbiAgICAgICAgdGVzdC50b29sdGlwID0gXCJUZXN0XCI7XHJcbiAgICAgICAgdGVzdC5vbmNsaWNrKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGtrID0gX3RoaXMuX21haW4ubGF5b3V0O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2NvZGVUb29sYmFyLmFkZCh0ZXN0KTsqL1xyXG5cclxuXHJcbiAgICAgICAgc3VwZXIuYWRkKHRoaXMuX21haW4pO1xyXG5cclxuICAgICAgICB0aGlzLl9pbnN0YWxsVmlldygpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJLZXlzKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmNyZWF0ZVRhYmxlKCk7XHJcbiAgICAgICAgLy8gICB0aGlzLl9jb2RlUGFuZWwuc2V0Q29tcGxldGVyKHRoaXMpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAvL190aGlzLmVkaXRvclByb3ZpZGVyPVwiYWNlXCI7XHJcbiAgICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBfaW5zdGFsbFZpZXcoKSB7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fY29kZVZpZXcsIFwiQ29kZS4uXCIsIFwiY29kZVwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLnZhcmlhYmxlcywgXCJWYXJpYWJsZXNcIiwgXCJ2YXJpYWJsZXNcIik7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5hZGQodGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICB0aGlzLl9tYWluLmFkZCh0aGlzLl9lcnJvcnMsIFwiRXJyb3JzXCIsIFwiZXJyb3JzXCIpO1xyXG4gICAgICAgIHRoaXMuX21haW4ubGF5b3V0ID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJ3aWR0aFwiOjEwMCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6MzMuMzMzMzMzMzMzMzMzMzM2LFwiaGVpZ2h0XCI6ODAuMzQ2ODIwODA5MjQ4NTYsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb2RlLi5cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29kZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJuYW1lXCI6XCJjb2RlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJEZXNpZ25cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZGVzaWduXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJEZXNpZ25cIixcIm5hbWVcIjpcImRlc2lnblwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjoxOS42NTMxNzkxOTA3NTE0NDUsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjUwLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjo1MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9J1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvKnNldCBlZGl0b3JQcm92aWRlcih2YWx1ZTogXCJhY2VcIiB8IFwibW9uYWNvXCIpIHtcclxuICAgICAgICBpZiAodmFsdWUgIT09IHRoaXMuZWRpdG9yUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgLy9zd2l0Y2ggdG8gbmV3IHByb3ZpZGVyXHJcbiAgICAgICAgICAgIGxldCBwb3MgPSB0aGlzLmN1cnNvclBvc2l0aW9uO1xyXG4gICAgICAgICAgICBsZXQgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgbGV0IG9sZCA9IHRoaXMuX2NvZGVQYW5lbDtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gXCJhY2VcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZVBhbmVsID0gbmV3IEFjZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9jb2RlUGFuZWwgPSBuZXcgTW9uYWNvUGFuZWwoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLl9pbml0Q29kZVBhbmVsKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVWaWV3LnJlbW92ZShvbGQpO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlVmlldy5hZGQodGhpcy5fY29kZVBhbmVsKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZT12YWw7XHJcbiAgICAgICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb249cG9zO1xyXG4gICAgICAgICAgICBvbGQuZGVzdHJveSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgIH0qL1xyXG5cclxuXHJcbiAgICBwcml2YXRlIGFzeW5jIF9zYXZlKGNvZGUpIHtcclxuICAgICAgICBhd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGUodGhpcy5fZmlsZSwgY29kZSk7XHJcblxyXG5cclxuICAgICAgICB2YXIgZiA9IHRoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIlwiKTtcclxuICAgICAgICBpZiAoY29kZS5pbmRleE9mKFwiQCRcIikgPiAtMSkge1xyXG4gICAgICAgICAgICBhd2FpdCByZWdpc3RyeS5yZWxvYWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgUmVsb2FkZXIuaW5zdGFuY2UucmVsb2FkSlMoZik7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBzYXZlIHRoZSBjb2RlIHRvIHNlcnZlclxyXG4gICAgKi9cclxuICAgIHNhdmUoKSB7XHJcbiAgICAgICAgdmFyIGNvZGUgPSB0aGlzLl9jb2RlUGFuZWwudmFsdWU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB0aGlzLl9zYXZlKGNvZGUpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnb3RvIHRvIHRoZSBkZWNsYXJpYXRpb24gb24gY3Vyc29yXHJcbiAgICAgKi9cclxuICAgIGFzeW5jIGdvdG9EZWNsYXJhdGlvbigpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZ290b0RlY2xhcmF0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBzZWFyY2ggdGV4dCBpbiBjbGFzc2VzIGF0IHRoZSBnaXZlbiB0ZXh0XHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdGV4dCAtIHRoZSB0ZXh0IHRvIHNlYXJjaFxyXG4gICAgICogQHJldHVybnMge2phc3NpanNfZWRpdG9yLkNvZGVFZGl0b3J9IC0gdGhlIGVkaXRvciBpbnN0YW5jZVxyXG4gICAgICovXHJcbiAgICBzdGF0aWMgYXN5bmMgc2VhcmNoKHRleHQpIHtcclxuICAgICAgICAvL1RPRE8gYXNrIHR5cGVzY3JpcHQgc2VydmljZVxyXG4gICAgICAgIC8qIHZhciBmb3VuZCA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgdGV4dCA9IHRleHQucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgdmFyIGNvbnRlbnQgPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgIC8vRmFzdCBzZWFyY2hcclxuICAgICAgICAgZm9yICh2YXIgZmlsZSBpbiBjbGFzc2VzLmdldENhY2hlKCkpIHtcclxuICAgICAgICAgICAgIHZhciBmbmFtZSA9IGZpbGUucmVwbGFjZUFsbChcIi5cIiwgXCIvXCIpO1xyXG4gICAgICAgICAgICAgdmFyIGNsID0gY2xhc3Nlcy5nZXRDYWNoZSgpW2ZpbGVdO1xyXG4gICAgICAgICAgICAgdmFyIGNvZGUgPSBjbC50b1N0cmluZygpLnJlcGxhY2VBbGwoXCJcXHJcXG5cIiwgXCJcXG5cIik7XHJcbiAgICAgICAgICAgICBpZiAoY29kZS5pbmRleE9mKHRleHQpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICBmb3VuZCA9IGZuYW1lICsgXCIuanNcIjtcclxuICAgICAgICAgICAgICAgICBjb250ZW50ID0gY29kZTtcclxuICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgIH1cclxuICAgICAgICAgfVxyXG4gICAgICAgICBpZiAoZm91bmQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgLy9EZWVwIHNlYXJjaCAoc2xvdylcclxuICAgICAgICAgICAgIHZhciBmaWxlcyA9IHJlZ2lzdHJ5LmdldEFsbEZpbGVzRm9yU2VydmljZShcImNsYXNzZXNcIik7XHJcbiAgICAgICAgICAgICBpZiAoZmlsZXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgZmlsZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgbGV0IGNvZGU6c3RyaW5nID0gYXdhaXQgbmV3IFNlcnZlcigpLmxvYWRGaWxlKGZpbGVzW3hdKTtcclxuICAgICAgICAgICAgICAgICAgICAgY29kZSA9IGNvZGUucmVwbGFjZUFsbChcIlxcclxcblwiLCBcIlxcblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgaWYgKGNvZGUuaW5kZXhPZih0ZXh0KSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IGZpbGVzW3hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudCA9IGNvZGU7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICB9XHJcbiAgICAgICAgIH1cclxuICAgICAgICAgaWYgKGZvdW5kICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgIHZhciBsaW5lID0gY29kZS5zdWJzdHJpbmcoMCwgY29udGVudC5pbmRleE9mKHRleHQpKS5zcGxpdChcIlxcblwiKS5sZW5ndGggKyAxO1xyXG4gICAgICAgICAgICAgcm91dGVyLm5hdmlnYXRlKFwiI2RvPWphc3NpanNfZWRpdG9yLkNvZGVFZGl0b3ImZmlsZT1cIiArIGZvdW5kICsgXCImbGluZT1cIiArIGxpbmUudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICByZXR1cm4gYXdhaXQgamFzc2lqc19lZGl0b3IuQ29kZUVkaXRvci5vcGVuKGZvdW5kK1wiOlwiK2xpbmUudG9TdHJpbmcoKStcIjowXCIpO1xyXG4gICAgICAgICB9Ki9cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIG1hbmFnZSBzaG9ydGN1dHNcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXJLZXlzKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgJCh0aGlzLl9jb2RlUGFuZWwuZG9tKS5rZXlkb3duKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMTUgJiYgZXZ0LnNoaWZ0S2V5KSB7Ly9GNFxyXG4gICAgICAgICAgICAgICAgLy8gdmFyIHRoaXNzPXRoaXMuX3RoaXMuX2lkO1xyXG4gICAgICAgICAgICAgICAgLy8gdmFyIGVkaXRvciA9IGFjZS5lZGl0KHRoaXMuX3RoaXMuX2lkKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0LmtleUNvZGUgPT09IDExNSkgey8vRjRcclxuICAgICAgICAgICAgICAgIF90aGlzLmV2YWxDb2RlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTE2KSB7Ly9GNVxyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICgoU3RyaW5nLmZyb21DaGFyQ29kZShldnQud2hpY2gpLnRvTG93ZXJDYXNlKCkgPT09ICdzJyAmJiBldnQuY3RybEtleSkvKiAmJiAoZXZ0LndoaWNoID09IDE5KSovKSB7Ly9TdHIrc1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogZXh0cmFjdCBsaW5lcyBmcm9tIGNvZGVcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBjb2RlIC0gdGhlIGNvZGVcclxuICAgICAqIEByZXR1cm5zIHtbc3RyaW5nXX0gLSBhbGwgbGluZXNcclxuICAgICAqL1xyXG4gICAgX2NvZGVUb0xpbmVzKGNvZGUpIHtcclxuICAgICAgICB2YXIgbGluZXMgPSBjb2RlLnNwbGl0KFwiXFxuXCIpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGluZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgd2hpbGUgKGxpbmVzW3hdLnN0YXJ0c1dpdGgoXCIvXCIpIHx8IGxpbmVzW3hdLnN0YXJ0c1dpdGgoXCIgXCIpXHJcbiAgICAgICAgICAgICAgICB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiKlwiKSB8fCBsaW5lc1t4XS5zdGFydHNXaXRoKFwiXFx0XCIpKSB7XHJcbiAgICAgICAgICAgICAgICBsaW5lc1t4XSA9IGxpbmVzW3hdLnN1YnN0cmluZygxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbGluZXM7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIF9ldmFsVG9DdXJzb3JSZWFjaGVkKCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9fZXZhbFRvQ3Vyc29yUmVhY2hlZCAhPT0gdHJ1ZSlcclxuICAgICAgICAgICAgdGhpcy5fbWFpbi5zaG93KCdjb2RlJyk7XHJcbiAgICAgICAgdGhpcy5fX2V2YWxUb0N1cnNvclJlYWNoZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBhZGQgdmFyaWFibGVzIHRvIHZhcmlhYmVscGFuZWxcclxuICAgICAqIEBwYXJhbSBPYmplY3Q8c3RyaW5nLG9iamVjdD4gdmFyaWFibGVzIFtcIm5hbWVcIl09dmFsdWVcclxuICAgICAqL1xyXG4gICAgYWRkVmFyaWFibGVzKHZhcmlhYmxlcykge1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmFkZEFsbCh2YXJpYWJsZXMpO1xyXG4gICAgfVxyXG4gICAgcHJpdmF0ZSBhc3luYyBmaWxsVmFyaWFibGVzQW5kU2V0dXBQYXJzZXIodXJsOiBzdHJpbmcsIHJvb3Q6IENvbXBvbmVudCwgY29tcG9uZW50OiBDb21wb25lbnQsIGNhY2hlOiB7IFtjb21wb25lbnRpZDogc3RyaW5nXTogeyBjb21wb25lbnQ6IENvbXBvbmVudCwgbGluZTogbnVtYmVyLCBjb2x1bW46IG51bWJlciwgcG9zOiBudW1iZXIsIG5hbWU6IHN0cmluZyB9IH0sIHBhcnNlcikge1xyXG5cclxuICAgICAgICBpZiAoY2FjaGVbY29tcG9uZW50Ll9pZF0gPT09IHVuZGVmaW5lZCAmJiBjb21wb25lbnRbXCJfX3N0YWNrXCJdICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdmFyIGxpbmVzID0gY29tcG9uZW50W1wiX19zdGFja1wiXT8uc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgbGluZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBzbGluZTogc3RyaW5nID0gbGluZXNbeF07XHJcbiAgICAgICAgICAgICAgICBpZiAoc2xpbmUuaW5kZXhPZihcIiR0ZW1wLmpzXCIpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzcGwgPSBzbGluZS5zcGxpdChcIjpcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGVudHIgPSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBjYWNoZVtjb21wb25lbnQuX2lkXSA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGluZTogTnVtYmVyKHNwbFtzcGwubGVuZ3RoIC0gMl0pLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IE51bWJlcihzcGxbc3BsLmxlbmd0aCAtIDFdLnJlcGxhY2UoXCIpXCIsIFwiXCIpKSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50OiBjb21wb25lbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvczogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogdW5kZWZpbmVkXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmlsbFZhcmlhYmxlc0FuZFNldHVwUGFyc2VyKHVybCwgcm9vdCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0sIGNhY2hlLCBwYXJzZXIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjb21wb25lbnQgPT09IHJvb3QpIHtcclxuICAgICAgICAgICAgICAgIC8vZmVydGlnXHJcbiAgICAgICAgICAgICAgICB2YXIgaGggPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIFRTU291cmNlTWFwID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlRTU291cmNlTWFwXCIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlcyA9IE9iamVjdC52YWx1ZXMoY2FjaGUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRtYXAgPSBhd2FpdCBuZXcgVFNTb3VyY2VNYXAoKS5nZXRMaW5lc0Zyb21KUyhcImpzL1wiICsgdXJsLnJlcGxhY2UoXCIudHNcIiwgXCIuanNcIiksIHZhbHVlcylcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgdG1hcC5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1t4XS5jb2x1bW4gPSB0bWFwW3hdLmNvbHVtbjtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbeF0ubGluZSA9IHRtYXBbeF0ubGluZTtcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbeF0ucG9zID0gdGhpcy5fY29kZVBhbmVsLnBvc2l0aW9uVG9OdW1iZXIoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByb3c6IHZhbHVlc1t4XS5saW5lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2x1bW46IHZhbHVlc1t4XS5jb2x1bW5cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vc2V0dXBDbGFzc2NvcGVcclxuICAgICAgICAgICAgICAgIHZhciBmb3VuZHNjb3BlID0gcGFyc2VyLmdldENsYXNzU2NvcGVGcm9tUG9zaXRpb24odGhpcy5fY29kZVBhbmVsLnZhbHVlLCBjYWNoZVtyb290Ll9pZF0ucG9zKTtcclxuICAgICAgICAgICAgICAgIHZhciBzY29wZSA9IFt7IGNsYXNzbmFtZTogcm9vdD8uY29uc3RydWN0b3I/Lm5hbWUsIG1ldGhvZG5hbWU6IFwibGF5b3V0XCIgfV07XHJcbiAgICAgICAgICAgICAgICBpZiAoZm91bmRzY29wZSlcclxuICAgICAgICAgICAgICAgICAgICBzY29wZSA9IFtmb3VuZHNjb3BlXTtcclxuICAgICAgICAgICAgICAgIHBhcnNlci5wYXJzZSh0aGlzLl9jb2RlUGFuZWwudmFsdWUsIHNjb3BlKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBwYXJzZXIuZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjb20gPSBwYXJzZXIuZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBfbmV3XyA9IGNvbVtcIl9uZXdfXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfbmV3Xykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9zID0gX25ld19bMF0ubm9kZS5wb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbmQgPSBfbmV3X1swXS5ub2RlLmVuZDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZXNbeF0ucG9zID49IHBvcyAmJiB2YWx1ZXNbeF0ucG9zIDw9IGVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1t4XS5uYW1lID0ga2V5O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB2YWx1ZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgc25hbWUgPSB2YWx1ZXNbeF0ubmFtZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZvdW5kID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMudmFsdWUuZm9yRWFjaCgoaXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGl0Lm5hbWUgPT09IHNuYW1lKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vc29tZXRpbWVzIGRvZXMgYSBjb25zdHJ1Y3RvciBjcmVhdGUgb3RoZXIgQ29tcG9uZW50cyBzbyB3ZSBuZWVkIHRoZSBmaXJzdCBvbmVcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZm91bmQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChzbmFtZSAmJiB0aGlzLnZhcmlhYmxlcy5nZXRPYmplY3RGcm9tVmFyaWFibGUoc25hbWUpID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoc25hbWUsIHZhbHVlc1t4XS5jb21wb25lbnQsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhcmlhYmxlcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIC8vIHBhcnNlci5wYXJzZSgsKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwYXJzZXI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIHByaXZhdGUgYXN5bmMgX2V2YWxDb2RlT25Mb2FkKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcy5jbGVhcigpO1xyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgICAgIHZhciBsaW5lcyA9IGNvZGUuc3BsaXQoXCJcXG5cIik7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgYnJlYWtwb2ludHMgPSBfdGhpcy5fY29kZVBhbmVsLmdldEJyZWFrcG9pbnRzKCk7XHJcbiAgICAgICAgdmFyIGZpbGVuYW1lID0gX3RoaXMuX2ZpbGUucmVwbGFjZShcIi50c1wiLCBcIiR0ZW1wLnRzXCIpO1xyXG4gICAgICAgIGF3YWl0IGphc3NpanMuZGVidWdnZXIucmVtb3ZlQnJlYWtwb2ludHNGb3JGaWxlKGZpbGVuYW1lKTtcclxuICAgICAgICBmb3IgKHZhciBsaW5lIGluIGJyZWFrcG9pbnRzKSB7XHJcbiAgICAgICAgICAgIGlmIChicmVha3BvaW50c1tsaW5lXSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvdyA9IGxpbmVzW2xpbmVdLmxlbmd0aDtcclxuICAgICAgICAgICAgICAgIGF3YWl0IGphc3NpanMuZGVidWdnZXIuYnJlYWtwb2ludENoYW5nZWQoZmlsZW5hbWUsIGxpbmUsIHJvdywgdHJ1ZSwgXCJkZWJ1Z3BvaW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgaXNsb2NhbGRiID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfbG9jYWxzZXJ2ZXIuREJNYW5hZ2VyXCIpO1xyXG4gICAgICAgIGlmIChpc2xvY2FsZGIgJiYgY29kZS5pbmRleE9mKFwiQCREQk9iamVjdChcIikgPiAtMSkge1xyXG5cclxuICAgICAgICAgICAgKDxhbnk+aXNsb2NhbGRiKS5kZXN0cm95Q29ubmVjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZGF0YS50ZXN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9jYXB1cmUgY3JlYXRlZCBDb21wb25lbnRzXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGhvb2sobmFtZSwgY29tcG9uZW50OiBDb21wb25lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiZ2V0c3RhY2tcIik7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChleD8uc3RhY2s/LmluZGV4T2YoXCIkdGVtcC5qc1wiKSAhPSAtMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50W1wiX19zdGFja1wiXSA9IGV4LnN0YWNrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIENvbXBvbmVudC5vbkNvbXBvbmVudENyZWF0ZWQoaG9vayk7XHJcbiAgICAgICAgICAgIHZhciByZXQgPSBhd2FpdCBkYXRhLnRlc3QobmV3IFRlc3QoKSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gUHJvbWlzZS5yZXNvbHZlKHJldCkudGhlbihhc3luYyBmdW5jdGlvbihyZXQpIHtcclxuICAgICAgICAgICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHJldC5sYXlvdXQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICBfdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoXCJ0aGlzXCIsIHJldCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9fdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoXCJtZVwiLCByZXQubWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIF90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJldCBpbnN0YW5jZW9mIENvbXBvbmVudCAmJiByZXRbXCJyZXBvcnR0eXBlXCJdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAvL3JlcXVpcmUoW1wiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIiwgXCJqYXNzaWpzX2VkaXRvci91dGlsL1BhcnNlclwiXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgIHZhciBDb21wb25lbnREZXNpZ25lciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyAgIHZhciBQYXJzZXIgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19lZGl0b3IuYmFzZS5QYXJzZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIENvbXBvbmVudERlc2lnbmVyID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci5Db21wb25lbnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgUGFyc2VyID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX2VkaXRvci51dGlsLlBhcnNlclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IFBhcnNlcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGF3YWl0IF90aGlzLmZpbGxWYXJpYWJsZXNBbmRTZXR1cFBhcnNlcihmaWxlbmFtZSwgcmV0LCByZXQsIHt9LHBhcnNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgQ29tcG9uZW50RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24gPSBuZXcgQ29tcG9uZW50RGVzaWduZXIoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9tYWluLmFkZChfdGhpcy5fZGVzaWduLCBcIkRlc2lnblwiLCBcImRlc2lnblwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbi5jb25uZWN0UGFyc2VyKHBhcnNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImRlc2lnbmVkQ29tcG9uZW50XCJdID0gcmV0O1xyXG4gICAgICAgICAgICAgICAgICAgIENvbXBvbmVudC5vZmZDb21wb25lbnRDcmVhdGVkKGhvb2spO1xyXG4gICAgICAgICAgICAgICAgICAgIGF3YWl0IF90aGlzLmZpbGxWYXJpYWJsZXNBbmRTZXR1cFBhcnNlcihmaWxlbmFtZSwgcmV0LCByZXQsIHt9LCBwYXJzZXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJlZGl0RGlhbG9nXCJdKHRydWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJldFtcInJlcG9ydGRlc2lnblwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFBhcnNlciA9IGF3YWl0IGNsYXNzZXMubG9hZENsYXNzKFwiamFzc2lqc19lZGl0b3IudXRpbC5QYXJzZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIFJlcG9ydERlc2lnbmVyID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5kZXNpZ25lci5SZXBvcnREZXNpZ25lclwiKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnREZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoKF90aGlzLl9kZXNpZ24pIGluc3RhbmNlb2YgUmVwb3J0RGVzaWduZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24gPSBuZXcgUmVwb3J0RGVzaWduZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiY29kZUVkaXRvclwiXSA9IF90aGlzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnNlci5jbGFzc1Njb3BlID0gW3sgY2xhc3NuYW1lOiBfdGhpcy5fZGVzaWduPy5jb25zdHJ1Y3Rvcj8ubmFtZSwgbWV0aG9kbmFtZTogXCJsYXlvdXRcIiB9LCB7IGNsYXNzbmFtZTogdW5kZWZpbmVkLCBtZXRob2RuYW1lOiBcInRlc3RcIiB9XTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ24uY29ubmVjdFBhcnNlcihwYXJzZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlcCA9IG5ldyBSZXBvcnREZXNpZ24oKTtcclxuICAgICAgICAgICAgICAgICAgICByZXAuZGVzaWduID0gT2JqZWN0LmFzc2lnbih7fSwgcmV0LnJlcG9ydGRlc2lnbik7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldC52YWx1ZSAmJiByZXAuZGVzaWduLmRhdGEgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5kYXRhID0gcmV0LnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHJldC5kYXRhICYmIHJlcC5kZXNpZ24uZGF0YSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXAuZGVzaWduLmRhdGEgPSByZXQuZGF0YTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJldC5wYXJhbWV0ZXIgJiYgcmVwLmRlc2lnbi5wYXJhbWV0ZXIgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVwLmRlc2lnbi5wYXJhbWV0ZXIgPSByZXQucGFyYW1ldGVyO1xyXG4gICAgICAgICAgICAgICAgICAgIF90aGlzLl9kZXNpZ25bXCJkZXNpZ25lZENvbXBvbmVudFwiXSA9IHJlcDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLyogICByZXF1aXJlKFtcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiXSwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZCA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5SZXBvcnREZXNpZ25cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCByZXAgPSByZFtcImZyb21KU09OXCJdKHJldCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgfSk7Ki9cclxuXHJcblxyXG4gICAgICAgICAgICAgICAgfS8qZWxzZSBpZiAocmV0W1wicmVwb3J0dHlwZVwiXSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWlyZShbXCJqYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lclwiXSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgUmVwb3J0RGVzaWduZXIgPSBjbGFzc2VzLmdldENsYXNzKFwiamFzc2lqc19yZXBvcnQuZGVzaWduZXIuUmVwb3J0RGVzaWduZXJcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghKChfdGhpcy5fZGVzaWduKSBpbnN0YW5jZW9mIFJlcG9ydERlc2lnbmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbiA9IG5ldyBSZXBvcnREZXNpZ25lcigpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX21haW4uYWRkKF90aGlzLl9kZXNpZ24sIFwiRGVzaWduXCIsIFwiZGVzaWduXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuX2Rlc2lnbltcImNvZGVFZGl0b3JcIl0gPSBfdGhpcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5fZGVzaWduW1wiZGVzaWduZWRDb21wb25lbnRcIl0gPSByZXQ7XHJcblxyXG4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9Ki9cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBDb21wb25lbnQub2ZmQ29tcG9uZW50Q3JlYXRlZChob29rKTtcclxuICAgICAgICAgICAgLy8gIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbiAgICBwcml2YXRlIGFzeW5jIHNhdmVUZW1wRmlsZShmaWxlOiBzdHJpbmcsIGNvZGU6IHN0cmluZykge1xyXG5cclxuXHJcbiAgICAgICAgLy9AdHMtaWdub3JlIFxyXG4gICAgICAgIHZhciB0c3MgPSBhd2FpdCBpbXBvcnQoXCJqYXNzaWpzX2VkaXRvci91dGlsL1R5cGVzY3JpcHRcIik7XHJcbiAgICAgICAgLy9AdHMtaWdub3JlIFxyXG4gICAgICAgIHZhciBzZXR0aW5ncyA9IFR5cGVzY3JpcHQuY29tcGlsZXJTZXR0aW5ncztcclxuICAgICAgICBzZXR0aW5nc1tcImlubGluZVNvdXJjZU1hcFwiXSA9IHRydWU7XHJcbiAgICAgICAgc2V0dGluZ3NbXCJpbmxpbmVTb3VyY2VzXCJdID0gdHJ1ZTtcclxuICAgICAgICB2YXIgZmlsZXMgPSBhd2FpdCB0c3MuZGVmYXVsdC50cmFuc3BpbGUoZmlsZSArIFwiLnRzXCIsIGNvZGUpO1xyXG5cclxuICAgICAgICB2YXIgY29kZXRzID0gLTE7XHJcbiAgICAgICAgdmFyIGNvZGVtYXAgPSAtMTtcclxuICAgICAgICB2YXIgY29kZWpzID0gLTE7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBmaWxlcy5maWxlTmFtZXMubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgaWYgKGZpbGVzLmZpbGVOYW1lc1t4XS5lbmRzV2l0aChcIi50c1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29kZXRzID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZmlsZXMuZmlsZU5hbWVzW3hdLmVuZHNXaXRoKFwiLmpzLm1hcFwiKSkge1xyXG4gICAgICAgICAgICAgICAgY29kZW1hcCA9IHg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGZpbGVzLmZpbGVOYW1lc1t4XS5lbmRzV2l0aChcIi5qc1wiKSkge1xyXG4gICAgICAgICAgICAgICAgY29kZWpzID0geDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvKiAgdmFyIGFsbCA9IEpTT04ucGFyc2UoZmlsZXMuY29udGVudHNbY29kZW1hcF0pO1xyXG4gICAgICAgICAgYWxsW1wic291cmNlc0NvbnRlbnRcIl0gPSBbZmlsZXMuY29udGVudHNbY29kZXRzXV07XHJcbiAgICAgICAgICBmaWxlcy5jb250ZW50c1tjb2RlbWFwXSA9IEpTT04uc3RyaW5naWZ5KGFsbCk7XHJcbiAgICAgICAgICB2YXIgYjY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoZmlsZXMuY29udGVudHNbY29kZW1hcF0pKSk7XHJcbiAgICAgICAgICB2YXIgcG9zID0gZmlsZXMuY29udGVudHNbY29kZWpzXS5pbmRleE9mKFwiLy9cIiArIFwiIyBzb3VyY2VNYXBwaW5nVVJMPVwiKTtcclxuICAgICAgICAgIGZpbGVzLmNvbnRlbnRzW2NvZGVqc10gPSBmaWxlcy5jb250ZW50c1tjb2RlanNdLnN1YnN0cmluZygwLCBwb3MpO1xyXG4gICAgICAgICAgZmlsZXMuY29udGVudHNbY29kZWpzXSA9IGZpbGVzLmNvbnRlbnRzW2NvZGVqc10gKyBcIi8vXCIgKyBcIiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGY4O2Jhc2U2NCxcIiArIGI2NDtcclxuICAgICAgICAgICovXHJcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xyXG5cclxuICAgICAgICB2YXIgcmV0ID0gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XHJcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gKGV2dCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2hhbm5lbC5wb3J0MS5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgcmVzKGV2dCk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGFic3BhdGggPSBsb2NhdGlvbi5vcmlnaW4gKyBsb2NhdGlvbi5wYXRobmFtZTtcclxuICAgICAgICBhYnNwYXRoID0gYWJzcGF0aC5zdWJzdHJpbmcoMCwgYWJzcGF0aC5sYXN0SW5kZXhPZihcIi9cIikgKyAxKTtcclxuICAgICAgICBuYXZpZ2F0b3Iuc2VydmljZVdvcmtlci5jb250cm9sbGVyLnBvc3RNZXNzYWdlKHtcclxuICAgICAgICAgICAgdHlwZTogJ1NBVkVfRklMRScsXHJcbiAgICAgICAgICAgIGZpbGVuYW1lOiBhYnNwYXRoICsgZmlsZXMuZmlsZU5hbWVzW2NvZGVqc10sXHJcbiAgICAgICAgICAgIGNvZGU6IGZpbGVzLmNvbnRlbnRzW2NvZGVqc11cclxuICAgICAgICB9LCBbY2hhbm5lbC5wb3J0Ml0pO1xyXG4gICAgICAgIHZhciB0ZXN0ID0gYXdhaXQgcmV0O1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBleGVjdXRlIHRoZSBjdXJyZW50IGNvZGVcclxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gdG9DdXJzb3IgLSAgaWYgdHJ1ZSB0aGUgdmFyaWFibGVzIHdlcmUgaW5zcGVjdGVkIG9uIGN1cnNvciBwb3NpdGlvbiwgXHJcbiAgICAgKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIGZhbHNlIGF0IHRoZSBlbmQgb2YgdGhlIGxheW91dCgpIGZ1bmN0aW9uIG9yIGF0IHRoZSBlbmQgb2YgdGhlIGNvZGVcclxuICAgICAqL1xyXG4gICAgYXN5bmMgZXZhbENvZGUodG9DdXJzb3IgPSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLl9fZXZhbFRvQ3Vyc29yUmVhY2hlZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmNsZWFyKCk7XHJcblxyXG4gICAgICAgIHZhciBjb2RlID0gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgICAgIHZhciBsaW5lcyA9IGNvZGUuc3BsaXQoXCJcXG5cIik7XHJcblxyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgd2luZG93W1widGVzdFwiXSA9IHVuZGVmaW5lZDtcclxuXHJcbiAgICAgICAgY29kZSA9IFwiXCI7XHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBsaW5lcy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICBjb2RlID0gY29kZSArIGxpbmVzW3hdICsgXCJcXG5cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29kZSA9IGNvZGU7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuICAgICAgICB2YXIgdG1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICAgICAgdmFyIGpzZmlsZSA9IF90aGlzLl9maWxlLnJlcGxhY2UoXCIudHNcIiwgXCJcIikgKyBcIiR0ZW1wXCI7XHJcbiAgICAgICAgLy9hd2FpdCBuZXcgU2VydmVyKCkuc2F2ZUZpbGUoXCJ0bXAvXCIgKyBfdGhpcy5fZmlsZSwgY29kZSk7XHJcbiAgICAgICAgLy9vbmx5IGxvY2FsIC0gbm8gVFMgRmlsZSBpbiBEZWJ1Z2dlclxyXG4gICAgICAgIGF3YWl0IHRoaXMuc2F2ZVRlbXBGaWxlKGpzZmlsZSwgY29kZSk7XHJcblxyXG4gICAgICAgIHRyeSB7IHJlcXVpcmVqcy51bmRlZihcImpzL1wiICsganNmaWxlICsgXCIuanNcIik7IH0gY2F0Y2ggKGV4KSB7IH07XHJcbiAgICAgICAgdmFyIG9ubG9hZCA9IGZ1bmN0aW9uIChkYXRhKSB7XHJcblxyXG4gICAgICAgICAgICBfdGhpcy5fZXZhbENvZGVPbkxvYWQoZGF0YSkuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDEwMDApKTtcclxuICAgICAgICAvL2lmIHRoaXMgaXMgdGhlIGZpcnN0IHNhdmUgZm9yIHRoZSB0bXBmaWxlIHRoZW4gaXQgZmFpbHMgLSBJIGRvbnQga25vdyB3aHksIGdpdmUgaXQgYSBzZWNvbmQgdHJ5XHJcbiAgICAgICAgcmVxdWlyZShbXCJqcy9cIiArIGpzZmlsZSArIFwiLmpzXCJdLCBvbmxvYWQsLyplcnJvciovZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwicmVsb2FkXCIpO1xyXG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICByZXF1aXJlKFtcImpzL1wiICsganNmaWxlICsgXCIuanNcIl0sIG9ubG9hZCwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9LCAyMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHN3aXRjaCB2aWV3XHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IHZpZXcgLSBcImRlc2lnblwiIG9yIFwiY29kZVwiXHJcbiAgICAgKi9cclxuICAgIHNldCB2aWV3bW9kZSh2aWV3KSB7XHJcbiAgICAgICAgdGhpcy5fbWFpbi5zaG93KHZpZXcpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBnZXQgYWxsIGtub3duIGluc3RhbmNlcyBmb3IgdHlwZVxyXG4gICAgKiBAcGFyYW0ge3R5cGV9IHR5cGUgLSB0aGUgdHlwZSB3ZSBhcmUgaW50ZXJlc3RlZFxyXG4gICAgKiBAcmV0dXJucyB7W3N0cmluZ119XHJcbiAgICAqL1xyXG4gICAgZ2V0VmFyaWFibGVzRm9yVHlwZSh0eXBlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMudmFyaWFibGVzLmdldFZhcmlhYmxlc0ZvclR5cGUodHlwZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldHMgdGhlIG5hbWUgb2YgdGhlIHZhcmlhYmVsIHRoYXQgaG9sZHMgdGhlIG9iamVjdFxyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9iIC0gdGhlXHJcbiAgICAgKi9cclxuICAgIGdldFZhcmlhYmxlRnJvbU9iamVjdChvYikge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnZhcmlhYmxlcy5nZXRWYXJpYWJsZUZyb21PYmplY3Qob2IpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICogZ2V0cyB0aGUgbmFtZSBvYmplY3Qgb2YgdGhlIGdpdmVuIHZhcmlhYmVsXHJcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2IgLSB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGVcclxuICAgICAqL1xyXG4gICAgZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMuZ2V0T2JqZWN0RnJvbVZhcmlhYmxlKHZhcm5hbWUpO1xyXG4gICAgfVxyXG5cclxuICAgIC8qKlxyXG4gICAgICAqIHJlbmFtZXMgYSB2YXJpYWJsZSBpbiBkZXNpZ25cclxuICAgICAgKiBAcGFyYW0ge3N0cmluZ30gb2xkTmFtZVxyXG4gICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuZXdOYW1lXHJcbiAgICAgICovXHJcbiAgICByZW5hbWVWYXJpYWJsZShvbGROYW1lLCBuZXdOYW1lKSB7XHJcbiAgICAgICAgdGhpcy52YXJpYWJsZXMucmVuYW1lVmFyaWFibGUob2xkTmFtZSwgbmV3TmFtZSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2Rlc2lnbiAhPT0gdW5kZWZpbmVkICYmIHRoaXMuX2Rlc2lnbltcIl9jb21wb25lbnRFeHBsb3JlclwiXSAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25bXCJfY29tcG9uZW50RXhwbG9yZXJcIl0udXBkYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSBuYW1lIG9iamVjdCBvZiB0aGUgZ2l2ZW4gdmFyaWFiZWxcclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBvYiAtIHRoZSBuYW1lIG9mIHRoZSB2YXJpYWJsZVxyXG4gICAgICovXHJcbiAgICByZW1vdmVWYXJpYWJsZUluRGVzaWduKHZhcm5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YXJpYWJsZXMucmVtb3ZlVmFyaWFibGUodmFybmFtZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIGNvZGVcclxuICAgICAqL1xyXG4gICAgc2V0IHZhbHVlKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmZpbGUgPSB0aGlzLl9maWxlO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC52YWx1ZSA9IHZhbHVlO1xyXG5cclxuICAgIH1cclxuICAgIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZVBhbmVsLnZhbHVlO1xyXG4gICAgfVxyXG4gICAgc2V0Q3Vyc29yUG9yaXRpb24ocG9zaXRpb246IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3Vyc29yUG9zaXRpb24gPSB0aGlzLl9jb2RlUGFuZWwubnVtYmVyVG9Qb3NpdGlvbihwb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHBvc2l0aW9uIC0gdGhlIGN1cnJlbnQgY3Vyc29yIHBvc2l0aW9uIHtyb3c9ICxjb2x1bW49fVxyXG4gICAgKi9cclxuICAgIHNldCBjdXJzb3JQb3NpdGlvbihjdXJzb3I6IHsgcm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyIH0pIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuY3Vyc29yUG9zaXRpb24gPSBjdXJzb3I7XHJcbiAgICB9XHJcbiAgICBnZXQgY3Vyc29yUG9zaXRpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvZGVQYW5lbC5jdXJzb3JQb3NpdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvKipcclxuICAgICAqIEBtZW1iZXIge3N0cmluZ30gLSB0aXRsZSBvZiB0aGUgY29tcG9uZW50XHJcbiAgICAgKi9cclxuICAgIGdldCB0aXRsZSgpIHtcclxuICAgICAgICB2YXIgcyA9IHRoaXMuZmlsZS5zcGxpdChcIi9cIik7XHJcbiAgICAgICAgcmV0dXJuIHNbcy5sZW5ndGggLSAxXTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBAbWVtYmVyIHtzdHJpbmd9IC0gdGhlIHVybCB0byBlZGl0XHJcbiAgICAqL1xyXG4gICAgc2V0IGZpbGUodmFsdWU6IHN0cmluZykgeyAvL3RoZSBDb2RlXHJcbiAgICAgICAgdGhpcy5fZmlsZSA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMub3BlbkZpbGUodmFsdWUpO1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlLCBpZDogdHJ1ZSB9KVxyXG4gICAgZ2V0IGZpbGUoKTogc3RyaW5nIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fZmlsZTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBnb2VzIHRvIHRoZSBsaW5lIG51bWJlciBcclxuICAgICogQHBhcmFtIHtvYmplY3R9IHZhbHVlIC0gdGhlIGxpbmUgbnVtYmVyIFxyXG4gICAgKi9cclxuICAgIHNldCBsaW5lKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLl9saW5lID0gTnVtYmVyKHZhbHVlKTtcclxuICAgICAgICB0aGlzLmN1cnNvclBvc2l0aW9uID0geyByb3c6IHRoaXMuX2xpbmUsIGNvbHVtbjogMSB9O1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmN1cnNvclBvc2l0aW9uID0geyByb3c6IF90aGlzLl9saW5lLCBjb2x1bW46IDEgfTtcclxuICAgICAgICB9LCAzMDApO1xyXG4gICAgICAgIC8qc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgX3RoaXMuY3Vyc29yUG9zaXRpb24gPSB7IHJvdzogdmFsdWUsIGNvbHVtbjogMCB9O1xyXG4gICAgICAgIH0sIDEwMDApOy8vc3RhcnQgdGFrZXMgb25lIHNlY29uZC4uLi4qL1xyXG4gICAgfVxyXG4gICAgQCRQcm9wZXJ0eSh7IGlzVXJsVGFnOiB0cnVlIH0pXHJcbiAgICBnZXQgbGluZSgpOiBudW1iZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnNvclBvc2l0aW9uLnJvdztcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogb3BlbiB0aGUgZmlsZVxyXG4gICAgICovXHJcbiAgICBhc3luYyBvcGVuRmlsZShfZmlsZSkge1xyXG4gICAgICAgIHRoaXMuX2ZpbGUgPSBfZmlsZTtcclxuICAgICAgICB2YXIgY29udGVudCA9IGF3YWl0IG5ldyBTZXJ2ZXIoKS5sb2FkRmlsZSh0aGlzLl9maWxlKTtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwuZmlsZSA9IF9maWxlO1xyXG4gICAgICAgIHRoaXMuX2NvZGVQYW5lbC52YWx1ZSA9IGNvbnRlbnQ7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAgICAgLy8gIHRoaXMuX2NvZGVQYW5lbC5oZWlnaHQ9XCIxMDAlXCI7XHJcbiAgICAgICAgdGhpcy5fbWFpbi51cGRhdGUoKTtcclxuICAgICAgICBpZiAodGhpcy5fbGluZSlcclxuICAgICAgICAgICAgdGhpcy5saW5lID0gdGhpcy5fbGluZTtcclxuXHJcbiAgICB9XHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuX2NvZGVWaWV3LmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9jb2RlVG9vbGJhci5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5fY29kZVBhbmVsLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9lcnJvcnMuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLl9kZXNpZ24uZGVzdHJveSgpO1xyXG4gICAgICAgIC8vdGhpcy5fbWFpbi5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAqL1xyXG4gICAgdW5kbygpIHtcclxuICAgICAgICB0aGlzLl9jb2RlUGFuZWwudW5kbygpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgZWRpdG9yID0gbmV3IENvZGVFZGl0b3IoKTtcclxuICAgIC8vdmFyIHVybCA9IFwiamFzc2lqc19lZGl0b3IvQWNlUGFuZWwudHNcIjtcclxuICAgIGVkaXRvci5oZWlnaHQgPSAzMDA7XHJcbiAgICBlZGl0b3Iud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIC8vYXdhaXQgZWRpdG9yLm9wZW5GaWxlKHVybCk7XHJcbiAgICBlZGl0b3IudmFsdWUgPSBgaW1wb3J0IHsgQnV0dG9uIH0gZnJvbSBcImphc3NpanMvdWkvQnV0dG9uXCI7XHJcbmltcG9ydCB7IFJlcGVhdGVyIH0gZnJvbSBcImphc3NpanMvdWkvUmVwZWF0ZXJcIjtcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxudHlwZSBNZSA9IHtcclxuICAgIGJ1dHRvbjE/OiBCdXR0b247XHJcbn07XHJcbkAkQ2xhc3MoXCJkZW1vLkVtcHR5RGlhbG9nXCIpXHJcbmV4cG9ydCBjbGFzcyBFbXB0eURpYWxvZyBleHRlbmRzIFBhbmVsIHtcclxuICAgIG1lOiBNZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5tZSA9IHt9O1xyXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xyXG4gICAgfVxyXG4gICAgbGF5b3V0KG1lOiBNZSkge1xyXG4gICAgICAgIG1lLmJ1dHRvbjEgPSBuZXcgQnV0dG9uKCk7XHJcbiAgICAgICAgdGhpcy5hZGQobWUuYnV0dG9uMSk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgcmV0ID0gbmV3IEVtcHR5RGlhbG9nKCk7XHJcbiAgICByZXR1cm4gcmV0O1xyXG59XHJcbmA7XHJcbiAgICBlZGl0b3IuZXZhbENvZGUoKTtcclxuICAgIHJldHVybiBlZGl0b3I7XHJcblxyXG59O1xyXG4vL2phc3NpanMubXlSZXF1aXJlKG1vZHVsLmNzc1tcImphc3NpanNfZWRpdG9yLmNzc1wiXSk7Il19