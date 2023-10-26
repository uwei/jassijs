var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_editor/CodePanel", "jassijs/ui/VariablePanel", "jassijs/ui/DockingContainer", "jassijs_editor/ErrorPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Classes", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_editor/AcePanel", "jassijs_editor/util/Typescript", "jassijs_editor/MonacoPanel", "jassijs/remote/Settings", "jassijs/remote/Test", "jassijs/base/CurrentSettings", "jassijs/base/Windows", "jassijs/ui/Notify"], function (require, exports, Registry_1, Panel_1, CodePanel_1, VariablePanel_1, DockingContainer_1, ErrorPanel_1, Button_1, Registry_2, Server_1, Reloader_1, Classes_1, Component_1, Property_1, AcePanel_1, Typescript_1, MonacoPanel_1, Settings_1, Test_1, CurrentSettings_1, Windows_1, Notify_1) {
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
            var f = this._file.replace(".tsx", "").replace(".ts", "");
            if ((_a = this._file) === null || _a === void 0 ? void 0 : _a.startsWith("$serverside/")) {
            }
            else {
                if (code.indexOf("@$") > -1) {
                    await Registry_2.default.reload();
                }
                await Reloader_1.Reloader.instance.reloadJS(f);
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
        async fillVariablesAndSetupParser(url, root, thecomponent, cache, parser, codePositions) {
            var _a, _b, _c, _d, _e, _f;
            var useThis = false;
            var connectedComponents = [thecomponent];
            if (thecomponent.__dom._thisOther)
                thecomponent.__dom._thisOther.forEach(e => connectedComponents.push(e));
            for (var i = 0; i < connectedComponents.length; i++) {
                var component = connectedComponents[i];
                if (cache[component._id] === undefined && component["__stack"] !== undefined && (((_a = component === null || component === void 0 ? void 0 : component.dom) === null || _a === void 0 ? void 0 : _a.classList) === undefined || !component.dom.classList.contains("designdummy"))) {
                    var lines = (_b = component["__stack"]) === null || _b === void 0 ? void 0 : _b.split("\n");
                    for (var x = 0; x < lines.length; x++) {
                        var sline = lines[x];
                        if (sline.indexOf("$temp.js") > 0) {
                            var spl = sline.split(":");
                            var entr = {};
                            if (cache[component._id] === undefined)
                                cache[component._id] = [];
                            var data = {
                                line: Number(spl[spl.length - 2]),
                                column: Number(spl[spl.length - 1].replace(")", "")),
                                component: component,
                                pos: 0,
                                name: undefined
                            };
                            if (codePositions[data.line + "," + data.column] === undefined) { //we collect first position in the scourecode file
                                codePositions[data.line + "," + data.column] = data;
                            }
                            cache[component._id].push(data);
                        }
                    }
                }
            }
            if (this.file.toLocaleLowerCase().endsWith(".tsx")) {
                for (var x = 0; x < thecomponent.dom.children.length; x++) {
                    var ch = thecomponent.dom.children[x];
                    if (ch._this) {
                        this.fillVariablesAndSetupParser(url, root, ch._this, cache, parser, codePositions);
                    }
                }
            }
            else {
                if (thecomponent["_components"]) {
                    for (var x = 0; x < thecomponent["_components"].length; x++) {
                        this.fillVariablesAndSetupParser(url, root, thecomponent["_components"][x], cache, parser, codePositions);
                    }
                }
            }
            if (thecomponent === root) {
                //fertig
                var hh = 0;
                var TSSourceMap = await Classes_1.classes.loadClass("jassijs_editor.util.TSSourceMap");
                var values = [];
                //@ts-ignore
                Object.values(cache).forEach((e) => {
                    e.forEach(f => values.push(f));
                });
                var tmap = await new TSSourceMap().getLinesFromJS("js/" + url.replace(".tsx", ".js").replace(".ts", ".js"), values);
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
                var scope = [{ classname: (_c = root === null || root === void 0 ? void 0 : root.constructor) === null || _c === void 0 ? void 0 : _c.name, methodname: "layout" }];
                if (foundscope)
                    scope = [{ classname: (_d = root === null || root === void 0 ? void 0 : root.constructor) === null || _d === void 0 ? void 0 : _d.name, methodname: "layout" }, foundscope];
                if (this.file.toLowerCase().endsWith(".tsx")) {
                    values = Object.values(codePositions);
                    parser.parse(this._codePanel.value, undefined, values);
                    for (var x = 0; x < values.length; x++) {
                        this.variables.addVariable(values[x].name, values[x].component, false);
                    }
                    // this.variables.addVariable(sname, val.component, false);
                }
                else {
                    parser.parse(this._codePanel.value, scope);
                    //if layout is rendered and an other variable is assigned to this, then remove ths variable
                    if (parser.classes[(_e = root === null || root === void 0 ? void 0 : root.constructor) === null || _e === void 0 ? void 0 : _e.name] && parser.classes[(_f = root === null || root === void 0 ? void 0 : root.constructor) === null || _f === void 0 ? void 0 : _f.name].members["layout"]) {
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
                }
                this.variables.updateCache();
                this.variables.update();
                // parser.parse(,)
            }
            return parser;
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
                var ComponentDesigner;
                // if (this.file.toLowerCase().endsWith(".tsx"))
                ComponentDesigner = await Classes_1.classes.loadClass("jassijs_editor.HtmlDesigner");
                // else
                //   ComponentDesigner = await classes.loadClass("jassijs_editor.ComponentDesigner");
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
                var codePositions = {};
                await _this.fillVariablesAndSetupParser(filename, ret, ret, {}, parser, codePositions);
                _this._design.designedComponent = ret;
                _this._design.editDialog(true);
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
            var filename = "";
            if (_this._file.endsWith(".tsx"))
                filename = _this._file.replace(".tsx", "$temp.tsx");
            else
                filename = _this._file.replace(".ts", "$temp.ts");
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
            //@ts-ignore
            if (data.test !== undefined || window.reportdesign) {
                //capure created Components
                function hook(name, component, react) {
                    var _a, _b;
                    if (name === "create") {
                        var ex = new Error();
                        if (((_a = ex === null || ex === void 0 ? void 0 : ex.stack) === null || _a === void 0 ? void 0 : _a.indexOf("$temp.js")) != -1) {
                            if (react === "React.createElement") {
                                if ((component === null || component === void 0 ? void 0 : component.props) === undefined)
                                    component.props = {};
                                component.props["__stack"] = ex.stack;
                            }
                            else {
                                //
                                if ((_b = component === null || component === void 0 ? void 0 : component.props) === null || _b === void 0 ? void 0 : _b["__stack"]) {
                                    component["__stack"] = component.props["__stack"];
                                    delete component.props["__stack"];
                                }
                                else
                                    component["__stack"] = ex.stack;
                            }
                        }
                    }
                }
                try {
                    Component_1.Component.onComponentCreated(hook);
                    var ret;
                    if (data.test) {
                        ret = await data.test(new Test_1.Test());
                    }
                    else {
                        //@ts-ignore
                        if (window.reportdesign) {
                            ret = {
                                //@ts-ignore
                                reportdesign: window.reportdesign
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
                        // Component.offComponentCreated(hook);
                    }
                    //  });
                }
                finally {
                    Component_1.Component.offComponentCreated(hook);
                }
            }
        }
        async saveTempFile(file, code) {
            //@ts-ignore 
            var tss = await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); });
            //@ts-ignore 
            var settings = Object.assign({}, Typescript_1.Typescript.compilerSettings);
            settings["inlineSourceMap"] = true;
            settings["inlineSources"] = true;
            var files;
            if (this.file.endsWith(".tsx"))
                files = await tss.default.transpile(file + ".tsx", code, settings);
            else
                files = await tss.default.transpile(file + ".ts", code, settings);
            var codets = -1;
            var codemap = -1;
            var codejs = -1;
            for (var x = 0; x < files.fileNames.length; x++) {
                if (files.fileNames[x].endsWith(".ts") || files.fileNames[x].endsWith(".tsx")) {
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
                await this._processEvalResult(res, undefined);
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
            var jsfile = _this._file.replace(".tsx", "").replace(".ts", "") + "$temp";
            //await new Server().saveFile("tmp/" + _this._file, code);
            //only local - no TS File in Debugger
            await this.saveTempFile(jsfile, code);
            //@ts-ignore
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
//# sourceMappingURL=CodeEditor.js.map