import jassijs, { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { CodePanel } from "jassijs_editor/CodePanel";
import { VariablePanel } from "jassijs/ui/VariablePanel";
import { DockingContainer } from "jassijs/ui/DockingContainer";
import { ErrorPanel } from "jassijs/ui/ErrorPanel";
import { Button } from "jassijs/ui/Button";
import registry from "jassijs/remote/Registry";
import { Server } from "jassijs/remote/Server";
import { Reloader } from "jassijs/util/Reloader";
import { classes } from "jassijs/remote/Classes";
import { Component } from "jassijs/ui/Component";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { $Property } from "jassijs/ui/Property";

import { AcePanel } from "jassijs_editor/AcePanel";
import { Typescript } from "jassijs_editor/util/Typescript";
import { MonacoPanel } from "jassijs_editor/MonacoPanel";
import { $SettingsDescriptor, Settings } from "jassijs/remote/Settings";
import { Test } from "jassijs/remote/Test";

declare global {
    export interface KnownSettings {
        Development_DefaultEditor: "ace" | "monaco"|"aceOnBrowser";
        Development_MoanacoEditorTheme:"vs-dark"|"vs-light"|"hc-black";
    }
}
@$SettingsDescriptor()
@$Class("jassijs_editor.CodeEditorSettingsDescriptor")
class CodeEditorSettingsDescriptor {
    @$Property({ chooseFrom: ["ace", "monaco","aceOnBrowser"],default:"aceOnBrowser",chooseFromStrict:true })
    Development_DefaultEditor: string;
    @$Property({ chooseFrom: ["vs-dark","vs-light","hc-black"],default:"vs-light",chooseFromStrict:true })
    Development_MoanacoEditorTheme:string;
}


/**
 * Panel for editing sources
 * @class jassijs_editor.CodeEditor
 */
@$Class("jassijs_editor.CodeEditor")
export class CodeEditor extends Panel {
    _main: DockingContainer;
    _codeView: Panel;
    _codeToolbar: Panel;
    _codePanel: CodePanel;
    _errors: ErrorPanel;
    _file: string;
    _variables: VariablePanel;
    _design: Panel;
    editMode: boolean;
    __evalToCursorReached: boolean;
   
   
    private _line: number;
    constructor() {
        super();
        this.maximize();
        this._main = new DockingContainer();
        this._codeView = new Panel();
        this._codeToolbar = new Panel();
        //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        let mobil = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        let sett=Settings.gets(Settings.keys.Development_DefaultEditor);
        if (sett==="ace"||(mobil&&(sett==="aceOnBrowser"||sett===undefined))){
            this._codePanel = new AcePanel();
        } else {
            this._codePanel = new MonacoPanel();
            // this._codePanel = new AcePanel(); 

        }
        this._errors = new ErrorPanel();
        this._file = "";
        this._variables = new VariablePanel();
        this._design = new Panel();
        this._init();
		
        this.editMode = true;
    }
    private _initCodePanel() {
        this._codePanel.width = "100%";
        this._codePanel.mode = "typescript";
        this._codePanel.height = "calc(100% - 31px)";
        let _this=this;
		this._codePanel.onBreakpointChanged(function (line, column, enable, type) {
            jassijs.debugger.breakpointChanged(_this._file, line, column, enable, type);
        });
    }

    private _init() {
        var _this = this;
        this._initCodePanel();

        /*  this._codePanel.getDocTooltip = function (item) {
              return _this.getDocTooltip(item);
          }*/
        this._codeToolbar["horizontal"] = true;
        this._codeToolbar.height = "30";
        this._codeView["horizontal"] = true;
        this._codeView.add(this._codeToolbar);
        this._codeView.add(this._codePanel);
        this._main.width = "calc(100% - 1px)";
        this._main.height = "99%";
        var lasttop = (<HTMLElement>this._main.dom).offsetTop;
        var lasttop2 = 0;
        this._main.onresize = function () {
            setTimeout(function () {
                _this._codePanel.resize();

            }, 1000);
            /*     if(_this._main.dom.offsetTop!==lasttop){//resize to height
                    lasttop=_this._main.dom.offsetTop;
                    var i="calc(100% - "+(lasttop+1)+"px)";
                    _this._main.height=i;
                }*/
            //TODO _this._designView.resize();
        }
        var save = new Button();
        save.tooltip = "Save(Ctrl+S)";
        save.icon = "mdi mdi-content-save mdi-18px";
        save.onclick(function () {
            _this.save();
        });
        this._codeToolbar.add(save);

        var run = new Button();
        run.icon = "mdi mdi-car-hatchback mdi-18px";
        run.tooltip = "Run(F4)";
        run.onclick(function () {
            _this.evalCode();
        });
        this._codeToolbar.add(run);

        var undo = new Button();
        undo.icon = "mdi mdi-undo mdi-18px";
        undo.tooltip = "Undo (Strg+Z)";
        undo.onclick(function () {
            _this._codePanel.undo();
        });
        this._codeToolbar.add(undo);

        var goto = new Button();
        goto.icon = "mdi mdi-ray-start-arrow mdi-18px";
        goto.tooltip = "Goto";
        goto.onclick(function () {
            _this.gotoDeclaration();
        });
        jassijs["$CodeEditor"] = CodeEditor;
        $(goto.dom).attr("ondrop", "event.preventDefault();jassijs.$CodeEditor.search(event.dataTransfer.getData('text'));");
        $(goto.dom).attr("ondragover", "event.preventDefault();");
        this._codeToolbar.add(goto);

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
       
        this._variables.createTable();
        //   this._codePanel.setCompleter(this);
        setTimeout(()=>{
            //_this.editorProvider="ace";
        },100);
    }

    _installView() {
        this._main.add(this._codeView, "Code..", "code");
        this._main.add(this._variables, "Variables", "variables");
        this._main.add(this._design, "Design", "design");
        this._main.add(this._errors, "Errors", "errors");
        this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}'

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


    private async _save(code) {
        await new Server().saveFile(this._file, code);


        var f = this._file.replace(".ts", "");
        if (code.indexOf("@$") > -1) {
            await registry.reload();
        }
        Reloader.instance.reloadJS(f);


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
            if (evt.keyCode === 115 && evt.shiftKey) {//F4
                // var thiss=this._this._id;
                // var editor = ace.edit(this._this._id);
                _this.evalCode(true);
                evt.preventDefault();
                return false;
            } else if (evt.keyCode === 115) {//F4
                _this.evalCode(false);
                evt.preventDefault();
                return false;
            }
            if (evt.keyCode === 116) {//F5
                evt.preventDefault();
                return false;
            }

            if ((String.fromCharCode(evt.which).toLowerCase() === 's' && evt.ctrlKey)/* && (evt.which == 19)*/) {//Str+s
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
        this._variables.addAll(variables);
    }
    private async _evalCodeOnLoad(data) {

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

        var islocaldb = classes.getClass("jassijs_localserver.DBManager");
        if (islocaldb && code.indexOf("@$DBObject(") > -1) {

            (<any>islocaldb).destroyConnection();
        }
        if (data.test !== undefined) {
            var ret = await data.test(new Test());
            // Promise.resolve(ret).then(async function(ret) {
            if (ret !== undefined) {

                if (ret.layout !== undefined)
                    _this.variables.addVariable("this", ret);
                else {
                    //get variablename from return
                    var sfunc: string = data.test.toString();
                    var pos = sfunc.lastIndexOf("return ");
                    var pose = sfunc.indexOf(";", pos);
                    var retvar = sfunc.substring(pos + 7, pose).trim();
                    _this.variables.addVariable(retvar, ret);
                }
                _this.variables.addVariable("me", ret.me);

                _this.variables.updateCache();
                if (ret instanceof Component && ret["reporttype"] === undefined) {
                    require(["jassijs_editor/ComponentDesigner"], function () {
                        var ComponentDesigner = classes.getClass("jassijs_editor.ComponentDesigner");
                        if (!((_this._design) instanceof ComponentDesigner)) {
                            _this._design = new ComponentDesigner();
                            _this._main.add(_this._design, "Design", "design");
                            _this._design["codeEditor"] = _this;
                        }
                        _this._design["designedComponent"] = ret;
                    });
                } else if (ret["reportdesign"] !== undefined) {
                    require(["jassijs_report/designer/ReportDesigner","jassijs_report/ReportDesign"], function () {
                        var ReportDesigner = classes.getClass("jassijs_report.designer.ReportDesigner");
                        var ReportDesign = classes.getClass("jassijs_report.ReportDesign");
                        if (!((_this._design) instanceof ReportDesigner)) {
                            _this._design = new ReportDesigner();
                            _this._main.add(_this._design, "Design", "design");
                            _this._design["codeEditor"] = _this;
                        }
                        var rep=new ReportDesign();
                        rep.design=Object.assign({},ret.reportdesign) ;
                        rep.design.data=ret.value;
                        rep.design.parameter=ret.parameter;
                        _this._design["designedComponent"] = rep;

                        /*   require(["jassijs_report/ReportDesign"], function() {
                               var rd = classes.getClass("jassijs_report.ReportDesign");
                               let rep = rd["fromJSON"](ret);
                               
                               _this._design["designedComponent"] = rep;
                           });*/
                    });
                }/*else if (ret["reporttype"] !== undefined) {
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
    private async saveTempFile(file: string, code: string) {


        //@ts-ignore 
        var tss = await import("jassijs_editor/util/Typescript");
        var settings = Typescript.compilerSettings;
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
        this._variables.clear();
        //this._variables.add("this",this);

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

        try { requirejs.undef("js/" + jsfile + ".js"); } catch (ex) { };
        var onload = function (data) {

            _this._evalCodeOnLoad(data).catch((err) => {
                throw err;
            });

        }
        //await new Promise(resolve => setTimeout(resolve, 1000));
        //if this is the first save for the tmpfile then it fails - I dont know why, give it a second try
        require(["js/" + jsfile + ".js"], onload,/*error*/function (err) {
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
        return this._variables.getVariablesForType(type);
    }
    /**
     * gets the name of the variabel that holds the object
     * @param {object} ob - the
     */
    getVariableFromObject(ob) {
        return this._variables.getVariableFromObject(ob);
    }

    /**
     * gets the name object of the given variabel
     * @param {string} ob - the name of the variable
     */
    getObjectFromVariable(varname) {
        return this._variables.getObjectFromVariable(varname);
    }

    /**
      * renames a variable in design
      * @param {string} oldName
      * @param {string} newName
      */
    renameVariable(oldName, newName) {
        this._variables.renameVariable(oldName, newName);
        if (this._design !== undefined && this._design["_componentExplorer"] !== undefined)
            this._design["_componentExplorer"].update();
    }


    /**
     * @member { jassijs_editor.VariablePanel} - the variable
     */
    set variables(value) {
        this._variables = value;
    }
    get variables() {
        return this._variables;
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
    setCursorPorition(position: number) {
        this.cursorPosition = this._codePanel.numberToPosition(position);
    }
    /**
    * @param {object} position - the current cursor position {row= ,column=}
    */
    set cursorPosition(cursor: { row: number, column: number }) {
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
    set file(value: string) { //the Code
        this._file = value;
        this.openFile(value);
    }
    @$Property({ isUrlTag: true, id: true })
    get file(): string {
        return this._file;
    }
    /**
    * goes to the line number 
    * @param {object} value - the line number 
    */
    set line(value: number) {
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
    @$Property({ isUrlTag: true })
    get line(): number {
        return this.cursorPosition.row;
    }
    /**
     * open the file
     */
    async openFile(_file) {
        this._file = _file;
        var content = await new Server().loadFile(this._file);
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
        this._variables.destroy();
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

}

export async function test() {
    var editor = new CodeEditor();
    //var url = "jassijs_editor/AcePanel.ts";
    editor.height = 300;
    editor.width="100%";
    //await editor.openFile(url);
    editor.value=`import { Button } from "jassijs/ui/Button";
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

};
