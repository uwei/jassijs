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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define("jassijs_report/designer/ReportDesigner", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs/remote/Classes", "jassijs_report/PDFReport", "jassijs_report/PDFViewer", "jassijs_report/ReportDesign", "jassijs/util/Tools", "jassijs_report/remote/ServerReport", "jassijs_editor/HtmlDesigner", "jassijs_report/RText", "jassijs_report/RTextGroup"], function (require, exports, Registry_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, Classes_1, PDFReport_1, PDFViewer_1, ReportDesign_1, Tools_1, ServerReport_1, HtmlDesigner_1, RText_1, RTextGroup_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportDesigner = void 0;
    exports.test2 = test2;
    exports.test = test;
    let ReportDesigner = class ReportDesigner extends HtmlDesigner_1.HtmlDesigner {
        constructor() {
            super();
            this.propertyIsChanging = false;
            this.pdfviewer = new PDFViewer_1.PDFViewer();
            this._codeChanger = undefined;
            this.mainLayout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            this._designPlaceholder.dom.style.whiteSpace = "pre";
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this.variables = this._codeEditor.variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(undefined, undefined);
            this._codeChanger = new PropertyEditor_1.PropertyEditor(this._codeEditor, undefined);
            this._errors = this._codeEditor._errors;
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentExplorer = new ComponentExplorer_1.ComponentExplorer(value, this._propertyEditor);
            this._invisibleComponents = new CodeEditorInvisibleComponents_1.CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._codeEditor._codePanel.onblur(function (evt) {
                _this._propertyEditor.updateParser();
            });
            this._propertyEditor.readPropertyValueFromDesign = true;
            this._propertyEditor.addEvent("propertyChanged", function () {
                _this.propertyChanged();
            });
            this._propertyEditor.addEvent("codeChanged", function () {
                _this.propertyChanged();
            });
            this.__dom.classList.add("ReportDesigner");
            this.dom.style.overflow = "scroll";
            this.dom.style.width = "";
            this.registerKeys();
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
        }
        createTextComponent(text, par, before) {
            var comp2 = new RText_1.RText();
            comp2.value = text;
            return this.createComponent("jassijs_report.RText", comp2, undefined, undefined, par, before);
        }
        wrapTextNodeIfNeeded(found) {
            var parent = found.parentNode;
            /* if (parent.childNodes.length !== 1) {
                 //no wrap
                 var textComp = (<any>found)._this;
                 var newSpan = new RTextGroup();
                 var span = this.createComponent(classes.getClassName(newSpan), newSpan, undefined, undefined, textComp._parent, textComp);
                 this.moveComponent(textComp, undefined, undefined, textComp._parent, span, undefined);
                 (<Container>span).add(textComp);
                 parent = span.__dom;
             }*/
            return parent;
        }
        connectParser(parser) {
            this._propertyEditor.parser = parser;
            var Parser = Classes_1.classes.getClass("jassijs_editor.util.Parser");
            this._codeChanger.parser = new Parser();
        }
        editDialog(enable) {
            var _a, _b;
            if (enable === false) {
                super.editDialog(enable);
                var _this = this;
                var rep = new PDFReport_1.PDFReport();
                //rep.content=this.designedComponent["design];
                if ((_b = (_a = this._codeEditor) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.startsWith("$serverside/")) {
                    this._codeEditor.evalServerside().then((data) => {
                        if (!data)
                            return;
                        ServerReport_1.ServerReport.getBase64FromFile(this.codeEditor._file).then((base64) => {
                            this.pdfviewer.report = rep;
                            _this.pdfviewer.value = base64;
                        });
                    });
                }
                else {
                    var data;
                    try {
                        data = this._codeChanger.value.toJSON();
                        rep.value = data; //Tools.copyObject(data);// designedComponent["design"];
                        rep.fill();
                        rep.getBase64().then((data) => {
                            this.pdfviewer.report = rep;
                            //make a copy because the data would be modified 
                            this.pdfviewer.value = data;
                        });
                    }
                    catch (err) {
                        console.error(err);
                        //viewer.value = await rep.getBase64();
                    }
                }
                //            this.lastView = this._designPlaceholder._components[0];
                //          if (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.pdfviewer);
            }
            else {
                this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.componentviewer);
                super.editDialog(enable);
            }
        }
        propertyChanged() {
            this.propertyIsChanging = true;
            if (this._codeChanger.parser.sourceFile === undefined)
                this._codeChanger.updateParser();
            //@ts-ignore
            let job = this.designedComponent.toJSON();
            delete job.parameter;
            delete job.data;
            let ob = Tools_1.Tools.objectToJson(job, undefined, false, 80);
            if (this._codeChanger.parser.variables["reportdesign"]) {
                var s = this._codeChanger.parser.code.substring(0, this._codeChanger.parser.variables["reportdesign"].pos) +
                    " reportdesign = " + ob + this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
                this.codeEditor.value = s;
                this._codeChanger.updateParser();
                this._codeChanger.callEvent("codeChanged", {});
                //this.callEvent("codeChanged", {});
            }
            else {
                if (this._codeChanger.parser.data["reportdesign"] && this._codeChanger.parser.data["reportdesign"][""].length > 0) {
                    this._codeChanger.setPropertyInCode("", ob, true, "reportdesign");
                }
                else
                    this._codeChanger.setPropertyInCode("reportdesign", ob);
            }
            this.propertyIsChanging = false;
        }
        createComponent(type, component, top, left, newParent, beforeComponent) {
            //this.variables.updateCache();
            //this._componentExplorer.update();
            var ret = super.createComponent(type, component, top, left, newParent, beforeComponent);
            //this.addVariables(ret,true);
            this._componentExplorer.update();
            this.propertyChanged();
            this._updateInvisibleComponents();
            return ret;
        }
        //createVariable(type, scope, varvalue) {
        createVariable(type, scope, component) {
            var name = component["reporttype"];
            if (this.nextComponentvariable[name] === undefined) {
                this.nextComponentvariable[name] = 0;
            }
            this.nextComponentvariable[name]++;
            var sname = component["name"];
            if (sname === undefined) {
                sname = name + this.nextComponentvariable[name];
                if (Object.getOwnPropertyDescriptor(component["__proto__"], "name")) { //write back the name
                    component["name"] = sname;
                }
            }
            this._codeEditor.variables.addVariable(sname, component, false);
            this.allComponents[name + this.nextComponentvariable[name]] = component;
            if (component["_components"]) {
                for (let x = 0; x < component["_components"].length; x++) {
                    this.createVariable(undefined, undefined, component["_components"][x]);
                }
            }
            return sname;
        }
        async paste() {
            var text = await navigator.clipboard.readText();
            var all = JSON.parse(text);
            var target = this._propertyEditor.value;
            var before = undefined;
            if (target._components === undefined) {
                before = target;
                target = target._parent;
            }
            else
                before = target._components[target._components.length - 1]; //design dummy
            var comp = ReportDesign_1.ReportDesign.fromJSON(all);
            for (var x = 0; x < comp._components.length; x++) {
                target.addBefore(comp._components[x], before); //design dummy
            }
            this.propertyChanged();
            this.editDialog(true);
            this._componentExplorer.update();
            /*  var comp:RComponent=ReportDesign.fromJSON(all[x])
             for(var x=0;x<all.length;x++){
                
                 parent.add(all[x]);
             }*/
        }
        async copy() {
            var text = "";
            var components = this._propertyEditor.value;
            if (!Array.isArray(components)) {
                components = [components];
            }
            var scomponents = [];
            for (var x = 0; x < components.length; x++) {
                var component = components[x];
                scomponents.push(component.toJSON());
                //  scomponents.add(component);
            }
            text = JSON.stringify(scomponents);
            console.log(text);
            await navigator.clipboard.writeText(text);
            return text;
        }
        async cutComponent() {
            var text = await this.copy();
            if (await navigator.clipboard.readText() !== text) {
                alert("could not copy to Clipboard.");
                return;
            }
            var components = this._propertyEditor.value;
            if (!Array.isArray(components)) {
                components = [components];
            }
            var scomponents = [];
            for (var x = 0; x < components.length; x++) {
                var component = components[x];
                component._parent.remove(component);
                //  scomponents.add(component);
            }
            this.propertyChanged();
        }
        /**
          * @member {jassijs.ui.Component} - the designed component
          */
        set designedComponent(component) {
            this.componentviewer = component;
            if (this._designPlaceholder._components.length > 0 && this._designPlaceholder._components[0] === this.pdfviewer) {
                this._designPlaceholder.remove(this._designPlaceholder._components[0], false); //should not be destroyed
            }
            //create _children
            ReportDesign_1.ReportDesign.fromJSON(component["design"], component);
            //populate Variables
            this.allComponents = {};
            this.nextComponentvariable = {};
            this.allComponents["this"] = component;
            this._codeEditor.variables.addVariable("this", component);
            this.createVariable(undefined, undefined, component);
            this._propertyEditor.value = component;
            this._codeChanger.parser = this._propertyEditor.parser;
            //@ts.ignore
            this._codeChanger.value = component;
            super.designedComponent = component;
            this._codeChanger.updateParser();
        }
        /**
           * undo action
           */
        undo() {
            //console.log(this._codeEditor._main.layout);
            this._codeEditor.undo();
            this._codeEditor.evalCode();
        }
        get designedComponent() {
            return super.designedComponent;
        }
        //    	_this.variables.addVariable("this", rep);
        get codeEditor() {
            return this._codeEditor;
        }
        _installView() {
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentPalette.service = "$ReportComponent";
            this._codeEditor._main.add(this._propertyEditor, "Properties", "properties");
            this._codeEditor._main.add(this._componentExplorer, "Components", "components");
            this._codeEditor._main.add(this._componentPalette, "Palette", "componentPalette");
            if (this.mainLayout)
                this._codeEditor._main.layout = this.mainLayout;
        }
        destroy() {
            //	this._codeChanger.destroy();
            this.pdfviewer.destroy();
            super.destroy();
        }
        _initComponentExplorer() {
            var _this = this;
            this._componentExplorer.onselect(function (data) {
                setTimeout(() => {
                    var sel = _this._componentExplorer.tree.selection;
                    if (sel.length === 1)
                        sel = sel[0];
                    _this._propertyEditor.value = sel;
                }, 10);
            });
            this._componentExplorer.getComponentName = function (item) {
                var varname = _this._codeEditor.getVariableFromObject(item);
                if (varname === undefined)
                    return;
                if (varname.startsWith("this."))
                    return varname.substring(5);
                return varname;
            };
        }
        insertLineBreak(sel) {
            var offSet = sel.anchorOffset;
            var node = sel.anchorNode;
            if (sel.anchorNode.compareDocumentPosition(sel.focusNode) === Node.DOCUMENT_POSITION_PRECEDING) {
                node = sel.focusNode;
                offSet = sel.focusOffset;
            }
            var old = node.textContent;
            var v1 = old.substring(0, offSet) + "\n" + old.substring(offSet);
            this.changeText(node, v1);
            this._propertyEditor.callEvent("propertyChanged", undefined);
        }
        setStyle(style, value = undefined) {
            var ret = super.setStyle(style, value);
            //Wrap to TextGRoup
            if (ret.length > 0) {
                var par = ret[0]._parent;
                for (var x = 1; x < ret.length; x++) {
                    if (ret[x]._parent !== par)
                        par = undefined;
                }
                if ((par === null || par === void 0 ? void 0 : par.reporttype) !== "textgroup") {
                    var tg = new RTextGroup_1.RTextGroup();
                    tg = this.createComponent(Classes_1.classes.getClassName(tg), tg, undefined, undefined, par, ret[0]);
                    ret.forEach((comp) => tg.add(comp));
                    this._propertyEditor.callEvent("propertyChanged", undefined);
                }
            }
            return ret;
        }
        applyStyle(comp, stylename, value = undefined) {
            var rcomp = comp;
            if (stylename === "bold") {
                rcomp.bold = !rcomp.bold;
            }
            this._propertyEditor.callEvent("propertyChanged", undefined);
        }
    };
    exports.ReportDesigner = ReportDesigner;
    exports.ReportDesigner = ReportDesigner = __decorate([
        (0, Registry_1.$Class)("jassijs_report.designer.ReportDesigner"),
        __metadata("design:paramtypes", [])
    ], ReportDesigner);
    async function test2() {
        var rep = new PDFReport_1.PDFReport();
        var def = {
            content: {
                stack: [{
                        columns: [
                            {
                                stack: [
                                    { text: '${invoice.customer.firstname} ${invoice.customer.lastname}' },
                                    { text: '${invoice.customer.street}' },
                                    { text: '${invoice.customer.place}' }
                                ]
                            },
                            {
                                stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    { text: " " },
                                    { text: "Date: ${invoice.date}" },
                                    { text: "Number: ${invoice.number}", bold: true },
                                    { text: " " },
                                    { text: " " },
                                ]
                            }
                        ]
                    }
                ]
            },
            data: {
                invoice: {
                    number: 1000,
                    date: "20.07.2018",
                    customer: {
                        firstname: "Henry",
                        lastname: "Klaus",
                        street: "Hauptstr. 157",
                        place: "chemnitz"
                    }
                }
            }
        };
        //	def.content=replaceTemplates(def.content,def.data);
        rep.value = def;
        var viewer = new PDFViewer_1.PDFViewer();
        viewer.value = await rep.getBase64();
        viewer.height = "200";
        return viewer;
    }
    ;
    async function test() {
        var CodeEditor = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/CodeEditor"], resolve_1, reject_1); }).then(__importStar)).CodeEditor;
        var editor = new CodeEditor();
        //var url = "jassijs_editor/AcePanel.ts";
        editor.height = 300;
        editor.width = "100%";
        //await editor.openFile(url);
        editor.value = `import { ReportDesign } from "jassijs_report/ReportDesign";

import { $Class } from "jassijs/remote/Registry";
import { $Property } from "jassijs/ui/Property";

export class SampleReport extends ReportDesign {
    me = {};
    constructor() {
        super();
        this.layout(this.me);
    }
    async setdata() {
    }
    layout(me) {
        this.design = { "content": { "stack": [{ "text": "Hallo" }, { "text": "ok" }, { "columns": [{ "text": "text" }, { "text": "text" }] }] } };
    }
}
export async function test() {
    var dlg = new SampleReport();
    return dlg;
}

`;
        editor.evalCode();
        return editor;
    }
    ;
});
define("jassijs_report/designer/SimpleReportDesigner", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/designer/ReportDesigner", "jassijs/util/Tools"], function (require, exports, Registry_2, ReportDesigner_1, Tools_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleReportDesigner = void 0;
    exports.test = test;
    let SimpleReportDesigner = class SimpleReportDesigner extends ReportDesigner_1.ReportDesigner {
        constructor(layout) {
            super();
            this.codePrefix = "var ttt=";
            if (layout)
                this.mainLayout = layout;
            else
                this.mainLayout = JSON.stringify({
                    "settings": { "hasHeaders": true, "constrainDragToContainer": true, "reorderEnabled": true, "selectionEnabled": false, "popoutWholeStack": false, "blockedPopoutsThrowError": true, "closePopoutsOnUnload": true, "showPopoutIcon": false, "showMaximiseIcon": true, "showCloseIcon": true, "responsiveMode": "onload" }, "dimensions": { "borderWidth": 5, "minItemHeight": 10, "minItemWidth": 10, "headerHeight": 20, "dragProxyWidth": 300, "dragProxyHeight": 200 }, "labels": { "close": "close", "maximise": "maximise", "minimise": "minimise", "popout": "open in new window", "popin": "pop in", "tabDropdown": "additional tabs" }, "content": [{
                            "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "content": [{
                                    "type": "row", "isClosable": true, "reorderEnabled": true, "title": "", "height": 81.04294066258988,
                                    "content": [{
                                            "type": "stack", "width": 80.57491289198606, "height": 71.23503465658476, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0,
                                            "content": [
                                                { "title": "Code..", "type": "component", "componentName": "code", "componentState": { "title": "Code..", "name": "code" }, "isClosable": true, "reorderEnabled": true },
                                                { "title": "Design", "type": "component", "componentName": "design", "componentState": { "title": "Design", "name": "design" }, "isClosable": true, "reorderEnabled": true }
                                            ]
                                        },
                                        {
                                            "type": "column", "isClosable": true, "reorderEnabled": true, "title": "", "width": 19.42508710801394,
                                            "content": [
                                                {
                                                    "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                    "content": [{ "title": "Palette", "type": "component", "componentName": "componentPalette", "componentState": { "title": "Palette", "name": "componentPalette" }, "isClosable": true, "reorderEnabled": true }]
                                                },
                                                {
                                                    "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 80.1556420233463,
                                                    "content": [{ "title": "Properties", "type": "component", "componentName": "properties", "componentState": { "title": "Properties", "name": "properties" }, "isClosable": true, "reorderEnabled": true }]
                                                },
                                                {
                                                    "type": "stack", "header": {}, "isClosable": true, "reorderEnabled": true, "title": "", "activeItemIndex": 0, "height": 19.844357976653697,
                                                    "content": [{ "title": "Components", "type": "component", "componentName": "components", "componentState": { "title": "Components", "name": "components" }, "isClosable": true, "reorderEnabled": true }]
                                                }
                                            ]
                                        }]
                                }
                            ]
                        }], "isClosable": true, "reorderEnabled": true, "title": "", "openPopouts": [], "maximisedItemId": null
                });
            this._designToolbar.remove(this.saveButton);
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
            //        this._designToolbar.remove(this.);
            //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true},{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":19.42508710801394,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';        //'{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":1,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":9.78603688012232,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":61.55066380085299,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":28.663299319024677,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        oncodechanged(evt) {
            this.addEvent("codechanged", evt);
        }
        propertyChanged() {
            this.propertyIsChanging = true;
            if (this.designedComponent.toJSON) { //not in pdf view
                let job = this.designedComponent.toJSON();
                delete job.parameter;
                delete job.data;
                let ob = Tools_2.Tools.objectToJson(job, undefined, false, 80);
                this._codeEditor._codePanel.value = this.codePrefix + ob + ";";
                this.callEvent("codechanged", this.codePrefix + ob + ";");
            }
            this.propertyIsChanging = false;
            /*  let job=this.designedComponent.toJSON();
              delete job.parameter;
              delete job.data;
              let ob=Tools.objectToJson(job,undefined,false);
              if(this._codeChanger.parser.variables["reportdesign"]){
                  var s=this._codeChanger.parser.code.substring(0,this._codeChanger.parser.variables["reportdesign"].pos)+
                      " reportdesign = "+ob+this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
                      this.codeEditor.value = s;
                  this._codeChanger.updateParser();
                  this._codeChanger.callEvent("codeChanged", {});
              //this.callEvent("codeChanged", {});
              }else
                  this._codeChanger.setPropertyInCode("reportdesign",ob);*/
        }
    };
    exports.SimpleReportDesigner = SimpleReportDesigner;
    exports.SimpleReportDesigner = SimpleReportDesigner = __decorate([
        (0, Registry_2.$Class)("jassijs_report.designer.SimpleReportDesigner"),
        __metadata("design:paramtypes", [Object])
    ], SimpleReportDesigner);
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {{nachname}}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
    }
});
define("jassijs_report/ext/pdfjs", ["require", "exports", "pdfjs-dist/build/pdf", "pdfjs-dist/build/pdf.worker"], function (require, exports, pdfjs, worker) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="pdfjs-dist/build/pdf" name="pdfjs"/>
    /// <amd-dependency path="pdfjs-dist/build/pdf.worker" name="worker"/>
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
    exports.default = pdfjs;
});
define("jassijs_report/ext/pdfmake", ["require", "exports", "pdfMakelib", "vfs_fonts"], function (require, exports, pdfMakelib, vfs_fonts) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="pdfMakelib" name="pdfMakelib"/>
    /// <amd-dependency path="vfs_fonts" name="vfs_fonts"/>
    exports.default = window["pdfMake"];
});
define("jassijs_report/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassijs_report.css": "jassijs_report.css" },
        "require": {
            paths: {
                'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
                'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
                'vfs_fonts': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/vfs_fonts', // '../../lib/vfs_fonts',
                'pdfMakelib': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.3.0-beta.2/pdfmake' //'../../lib/pdfmake'
            },
            shim: {
                'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
                "vfs_fonts": ["pdfMakelib"]
                //"pdfMake":["vfs_fonts"]
            },
        }
    };
});
//source from https://cdn.jsdelivr.net/npm/@types/pdfmake/interfaces.d.ts
//  changes by jassijs are tagged with /*changed by jassijs*/
define("jassijs_report/pdfMake-interface", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <reference types="node" />
    /// <reference types="pdfkit" />
});
define("jassijs_report/PDFReport", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/ext/pdfmake", "jassijs_report/PDFViewer", "jassijs_report/remote/pdfmakejassi"], function (require, exports, Registry_3, pdfmake_1, PDFViewer_2, pdfmakejassi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PDFReport = void 0;
    exports.test = test;
    pdfmake_1 = __importDefault(pdfmake_1);
    let PDFReport = class PDFReport {
        constructor() {
            // @member {object} - the generated report
            this.report = null;
        }
        layout() {
            //var me = this.me = {};
        }
        fill() {
            var def = (0, pdfmakejassi_1.createReportDefinition)(this.value, this.data, this.parameter);
            registerFonts(this.value);
            this.report = pdfmake_1.default.createPdf(def);
        }
        open() {
            this.report.open();
        }
        download() {
            this.report.download();
        }
        print() {
            this.report.print();
        }
        async getBase64() {
            var _this = this;
            return await this.report.getBase64();
            /*return new Promise(
                function (resolve, reject) {
                    _this.report.getBase64(function (data) {
                        resolve(data);
    
                    });
                });*/
        }
        ;
    };
    exports.PDFReport = PDFReport;
    exports.PDFReport = PDFReport = __decorate([
        (0, Registry_3.$Class)("jassijs_report.PDFReport"),
        __metadata("design:paramtypes", [])
    ], PDFReport);
    //var available = ["Alegreya",    "AlegreyaSans",    "AlegreyaSansSC",    "AlegreyaSC",    "AlmendraSC",    "Amaranth",    "Andada",    "AndadaSC",    "AnonymousPro",    "ArchivoNarrow",    "Arvo",    "Asap",    "AveriaLibre",    "AveriaSansLibre",    "AveriaSerifLibre",    "Cambay",    "Caudex",    "CrimsonText",    "Cuprum",    "Economica",    "Exo2",    "Exo",    "ExpletusSans",    "FiraSans",    "JosefinSans",    "JosefinSlab",    "Karla",    "Lato",    "LobsterTwo",    "Lora",    "Marvel",    "Merriweather",    "MerriweatherSans",    "Nobile",    "NoticiaText",    "Overlock",    "Philosopher",    "PlayfairDisplay",    "PlayfairDisplaySC",    "PT_Serif-Web",    "Puritan",    "Quantico",    "QuattrocentoSans",    "Quicksand",    "Rambla",    "Rosario",    "Sansation",    "Sarabun",    "Scada",    "Share",    "Sitara",    "SourceSansPro",    "TitilliumWeb",    "Volkhov",    "Vollkorn"];
    function registerFonts(data) {
        var fonts = [];
        var base = "https://cdn.jsdelivr.net/gh/xErik/pdfmake-fonts-google@master/lib/ofl"; //abeezee/ABeeZee-Italic.ttf
        JSON.stringify(data, (key, value) => {
            if (key === "font" && value !== "") {
                fonts.push(value);
            }
            return value;
        });
        if (!pdfmake_1.default.fonts) {
            pdfmake_1.default.fonts = {
                Roboto: {
                    normal: 'Roboto-Regular.ttf',
                    bold: 'Roboto-Medium.ttf',
                    italics: 'Roboto-Italic.ttf',
                    bolditalics: 'Roboto-MediumItalic.ttf'
                }
            };
        }
        fonts.forEach((font) => {
            if (font !== "Roboto") {
                pdfmake_1.default.fonts[font] = {};
                pdfmake_1.default.fonts[font].normal = base + "/" + font.toLowerCase() + "/" + font + "-Regular.ttf";
                pdfmake_1.default.fonts[font].bold = base + "/" + font.toLowerCase() + "/" + font + "-Bold.ttf";
                pdfmake_1.default.fonts[font].italics = base + "/" + font.toLowerCase() + "/" + font + "-Italic.ttf";
                pdfmake_1.default.fonts[font].bolditalics = base + "/" + font.toLowerCase() + "/" + font + "-BoldItalic.ttf";
            }
        });
    }
    async function test() {
        var rep = new PDFReport();
        rep.data = {
            invoice: {
                number: 1000,
                date: "20.07.2018",
                customer: {
                    firstname: "Henry",
                    lastname: "Klaus",
                    street: "Hauptstr. 157",
                    place: "chemnitz",
                },
                lines: [
                    { pos: 1, text: "this is the first position, lksjdflgsd er we wer wre er er er re wekfgjslkdfjjdk sgfsdg", price: 10.00, amount: 50, variante: [{ m: 1 }, { m: 2 }] },
                    { pos: 2, text: "this is the next position", price: 20.50, },
                    { pos: 3, text: "this is an other position", price: 19.50 },
                    { pos: 4, text: "this is the last position", price: 50.00 },
                ],
                summary: [
                    { text: "Subtotal", value: 100.00 },
                    { text: "Tax", value: 19.00 },
                    { text: "Subtotal", value: 119.00 },
                ]
            }
        };
        rep.value = {
            content: {
                stack: [{
                        //font: "ExpletusSans",
                        columns: [
                            {
                                stack: [
                                    '${invoice.customer.firstname} ${invoice.customer.lastname}',
                                    '${invoice.customer.street}',
                                    '${invoice.customer.place}'
                                ]
                            },
                            {
                                stack: [
                                    { text: 'Invoice', fontSize: 18 },
                                    " ",
                                    "Date: ${invoice.date}",
                                    { text: "Number: ${invoice.number}", bold: true },
                                    " ",
                                    " ",
                                ]
                            }
                        ]
                    }, {
                        table: {
                            body: [
                                ['Item', 'Price'],
                                {
                                    foreach: "line in invoice.lines",
                                    do: [
                                        '${line.text}', '${line.price}'
                                    ]
                                }
                            ]
                        }
                    },
                    {
                        datatable: {
                            header: [{ text: "Item" }, { text: "Price" }],
                            dataforeach: "line in invoice.lines",
                            //footer:[{ text:"Total"},{ text:""}],
                            body: ['${line.text}', '${line.price}'],
                            groups: [
                                {
                                    field: "line",
                                    header: [],
                                    footer: []
                                }
                            ]
                        }
                    },
                    " ",
                    {
                        foreach: "sum in invoice.summary",
                        columns: [
                            "${sum.text}",
                            "${sum.value}",
                        ]
                    },
                ]
            }
        };
        rep.fill();
        var viewer = new PDFViewer_2.PDFViewer();
        viewer.value = await rep.getBase64();
        viewer.height = 300;
        return viewer;
    }
});
define("jassijs_report/PDFViewer", ["require", "exports", "jassijs/ui/Button", "jassijs_report/ext/pdfjs", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/BoxPanel"], function (require, exports, Button_1, pdfjs_1, Component_1, Registry_4, Panel_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PDFViewer = void 0;
    exports.test = test;
    pdfjs_1 = __importDefault(pdfjs_1);
    class Canavas extends Component_1.Component {
        constructor() {
            super();
        }
        render() {
            return React.createElement("canvas", { type: "pdfviewer" });
        }
    }
    let PDFViewer = class PDFViewer extends Panel_1.Panel {
        constructor() {
            super();
            this.pdfjsLib = pdfjs_1.default;
            this.pdfDoc = null;
            this.pageNum = 1;
            this.pageRendering = false;
            this.pageNumPending = null;
            this.scale = 1;
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            this.style = {
                overflow: "auto"
            };
            me.toolbar = new BoxPanel_1.BoxPanel();
            me.toolbar.dom.style.position = "fixed";
            me.mainpanel = new Panel_1.Panel();
            me.plus = new Button_1.Button();
            me.minus = new Button_1.Button();
            var _this = this;
            me.download = new Button_1.Button();
            this.add(me.toolbar);
            var placeholder = new Panel_1.Panel();
            placeholder.height = 20;
            this.add(placeholder);
            this.add(me.mainpanel);
            me.toolbar.add(me.plus);
            me.toolbar.horizontal = true;
            me.toolbar.add(me.download);
            me.toolbar.add(me.minus);
            me.plus.text = "+";
            me.plus.onclick(function (event) {
                _this.scale = _this.scale * 1.25;
                _this.updatePages();
                //_this.renderPage(_this._page);
            });
            me.plus.width = 20;
            me.plus.height = 20;
            me.minus.text = "-";
            me.minus.onclick(function (event) {
                _this.scale = _this.scale / 1.25;
                _this.updatePages();
            });
            me.download.icon = "mdi mdi-folder-open-outline";
            // me.download.text = "download";
            me.download.onclick(function (event) {
                _this.report.open();
            });
            // me.download.width = 75;
        }
        renderPages(num) {
            // The workerSrc property shall be specified.
            this.pageRendering = true;
            // Using promise to fetch the page
            var _this = this;
            this.pdfDoc.getPage(num).then(function (page) {
                var quality = 5;
                var viewport = page.getViewport({ scale: _this.scale * quality });
                var can = _this.canavasPanels[page._pageIndex].dom;
                can.height = viewport.height;
                can.width = viewport.width;
                can.style.width = Math.round(viewport.width / quality) + ".px";
                // Render PDF page into canvas context
                var renderContext = {
                    canvasContext: can.getContext('2d'),
                    viewport: viewport
                };
                var renderTask = page.render(renderContext);
                // Wait for rendering to finish
                /*  renderTask.promise.then(function () {
                      _this.pageRendering = false;
                      if (_this.pageNumPending !== null) {
                          // New page rendering is pending
                          _this.renderPage(_this.pageNumPending);
                          _this.pageNumPending = null;
                      }
                  });*/
            });
        }
        updatePages() {
            for (var x = 0; x < this.me.mainpanel._components.length; x++) {
                this.renderPages(x + 1);
            }
        }
        /**
         * @member {data} - the caption of the button
         */
        set value(value) {
            this._data = value;
            var pdfData = atob(this._data);
            var loadingTask = this.pdfjsLib.getDocument({ data: pdfData });
            var _this = this;
            loadingTask.promise.then(function (pdf) {
                _this.pdfDoc = pdf;
                //_this.queueRenderPage(_this._page);
                _this.me.mainpanel.removeAll();
                _this.canavasPanels = []; //:Canavas[];
                for (var x = 0; x < pdf.numPages; x++) {
                    var cp = new Canavas();
                    _this.me.mainpanel.add(cp);
                    _this.canavasPanels.push(cp);
                    // _this.renderPages(x + 1);
                }
                _this.updatePages();
            }, function (e) {
                var g = e;
            });
        }
        get value() {
            return this._data;
        }
    };
    exports.PDFViewer = PDFViewer;
    exports.PDFViewer = PDFViewer = __decorate([
        (0, Registry_4.$Class)("jassijs_report.PDFViewer"),
        __metadata("design:paramtypes", [])
    ], PDFViewer);
    async function test() {
        var ret = new PDFViewer();
        //testdocument
        var data = 'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
            'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
            'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
            'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
            'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
            'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
            'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
            'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
            'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
            'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
            'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
            'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
            'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G';
        ret.value = data;
        //    ret.height=160;
        return ret;
    }
});
define("jassijs_report/RColumns", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_5, ReportDesign_2, RComponent_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RColumns = void 0;
    //Limitations: columnGap not implemented defaultStyle: {columnGap: 20}
    let RColumns = class RColumns extends RComponent_1.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "columns";
            this.domWrapper.classList.add('BoxPanel');
            this.domWrapper.classList.remove('Panel');
            this.dom.classList.add("designerNoResizable");
            this.dom.style.display = "table";
            this.dom.style["min-width"] = "50px";
            // this.width="300px"
        }
        /**
       * adds a component to the container before an other component
       * @param {jassijs.ui.Component} component - the component to add
       * @param {jassijs.ui.Component} before - the component before then component to add
       */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter=true;
            }
            super.addBefore(component, before);
            component.domWrapper.style.display = "table-cell";
            component.dom.classList.remove("designerNoResizable");
            component.dom.classList.add("designerNoResizableY");
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            super.add(component);
            component.domWrapper.style.display = "table-cell";
            component.dom.classList.remove("designerNoResizable");
            component.dom.classList.add("designerNoResizableY");
        }
        toJSON() {
            var ret = super.toJSON();
            ret.columns = [];
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                ret.columns.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            for (let x = 0; x < ob.columns.length; x++) {
                ret.add(ReportDesign_2.ReportDesign.fromJSON(ob.columns[x]));
            }
            delete ob.columns;
            super.fromJSON(ob);
            return ret;
        }
    };
    exports.RColumns = RColumns;
    exports.RColumns = RColumns = __decorate([
        (0, RComponent_1.$ReportComponent)({ fullPath: "report/Columns", icon: "mdi mdi-view-parallel-outline", editableChildComponents: ["this"] }),
        (0, Registry_5.$Class)("jassijs_report.RColumns")
        //@$Property({ hideBaseClassProperties: true })
        ,
        __metadata("design:paramtypes", [Object])
    ], RColumns);
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RComponent", ["require", "exports", "jassijs/ui/Component", "jassijs/remote/Registry", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property"], function (require, exports, Component_2, Registry_6, Registry_7, Panel_2, Property_1) {
    "use strict";
    var RComponent_2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RComponent = exports.ReportComponentProperties = void 0;
    exports.$ReportComponent = $ReportComponent;
    Registry_6 = __importDefault(Registry_6);
    //Limitations Styles1 -> not implemented	style as array e.g. style: ['quote', 'small']  
    jassijs.includeCSSFile("jassijs_report.css");
    class ReportComponentProperties extends Component_2.UIComponentProperties {
    }
    exports.ReportComponentProperties = ReportComponentProperties;
    function $ReportComponent(properties) {
        return function (pclass) {
            Registry_6.default.register("$ReportComponent", pclass, properties);
        };
    }
    let RComponent = RComponent_2 = class RComponent extends Panel_2.Panel {
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "nothing";
        }
        onstylechanged(func) {
            this.addEvent("stylechanged", func);
        }
        set counter(value) {
            this._counter = value;
            if (value === undefined)
                this.domWrapper.removeAttribute("value");
            else
                this.domWrapper.setAttribute("value", value.toString());
        }
        get counter() {
            return this._counter;
        }
        set listType(value) {
            this._listType = value;
            if (value === undefined)
                this.domWrapper.style["list-style-type"] = "";
            else
                this.domWrapper.style["list-style-type"] = value;
        }
        get listType() {
            return this._listType;
        }
        get fillColor() {
            return this._fillColor;
        }
        set fillColor(value) {
            this._fillColor = value;
            this.dom.style["background-color"] = value;
        }
        get colSpan() {
            return this._colSpan;
        }
        set colSpan(value) {
            var _a, _b, _c, _d;
            this.domWrapper.setAttribute("colspan", value === undefined ? "" : value.toString());
            this._colSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get rowSpan() {
            return this._rowSpan;
        }
        set rowSpan(value) {
            var _a, _b, _c, _d;
            this.domWrapper.setAttribute("rowspan", value === undefined ? "" : value.toString());
            this._rowSpan = value;
            if ((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._parent) === null || _b === void 0 ? void 0 : _b.updateLayout)
                (_d = (_c = this._parent) === null || _c === void 0 ? void 0 : _c._parent) === null || _d === void 0 ? void 0 : _d.updateLayout(true);
        }
        get border() {
            return this._border;
        }
        set border(value) {
            this._border = value;
            if (value === undefined)
                value = [false, false, false, false];
            this.domWrapper.style["border-left-style"] = value[0] ? "solid" : "none";
            this.domWrapper.style["border-top-style"] = value[1] ? "solid" : "none";
            this.domWrapper.style["border-right-style"] = value[2] ? "solid" : "none";
            this.domWrapper.style["border-bottom-style"] = value[3] ? "solid" : "none";
        }
        get width() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                return this._parent.getChildWidth(this);
            else
                return this._width;
        }
        set width(value) {
            var _a;
            if (value && Number.parseInt(value).toString() === value) {
                value = Number.parseInt(value);
            }
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) !== undefined)
                this._parent.setChildWidth(this, value);
            else {
                this._width = value;
                super.width = value;
            }
        }
        get height() {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                return this._parent.getChildHeight(this);
            else
                return this._height;
        }
        set height(value) {
            var _a;
            if (((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) !== undefined)
                this._parent.setChildHeight(this, value);
            else {
                this._height = value;
                console.log(value);
                super.height = value;
            }
        }
        get bold() {
            return this._bold;
        }
        set bold(value) {
            this._bold = value;
            this.dom.style["font-weight"] = value ? "bold" : "normal";
            this.callEvent("stylechanged", "font-weight", value);
        }
        get italics() {
            return this._italics;
        }
        set italics(value) {
            this._italics = value;
            this.dom.style["font-style"] = value ? "italic" : "normal";
            this.callEvent("stylechanged", "font-style", value);
        }
        get font() {
            return this._font;
        }
        set font(value) {
            this._font = value;
            //copy from CSSProperties
            var api = 'https://fonts.googleapis.com/css?family=';
            var sfont = value.replaceAll(" ", "+");
            if (!document.getElementById("-->" + api + sfont)) { //"-->https://fonts.googleapis.com/css?family=Aclonica">
                jassijs.myRequire(api + sfont);
            }
            if (value === undefined)
                this.dom.style["font_family"] = "";
            else
                this.dom.style["font_family"] = value;
            this.callEvent("stylechanged", "font", value);
        }
        get fontSize() {
            return this._fontSize;
        }
        set fontSize(value) {
            this._fontSize = value;
            if (value === undefined)
                this.dom.style["font-size"] = "";
            else
                this.dom.style["font-size"] = value + "px";
            this.callEvent("stylechanged", "fontSize", value);
        }
        get background() {
            return this._background;
        }
        set background(value) {
            this._background = value;
            this.dom.style["background-color"] = value;
            this.callEvent("stylechanged", "background", value);
        }
        get color() {
            return this._color;
        }
        set color(value) {
            this._color = value;
            this.dom.style.color = value;
            this.callEvent("stylechanged", "color", value);
        }
        get alignment() {
            return this._alignment;
        }
        set alignment(value) {
            this._alignment = value;
            this.dom.style["text-align"] = value;
            this.callEvent("stylechanged", "alignment", value);
        }
        get decoration() {
            return this._decoration;
        }
        set decoration(value) {
            this._decoration = value;
            var val = "none";
            if (value === "underline")
                val = "underline";
            if (value === "lineThrough")
                val = "line-through";
            if (value === "overline")
                val = "overline";
            this.dom.style["text-decoration"] = val;
            this.callEvent("stylechanged", "decoration", value);
        }
        get decorationColor() {
            return this._decorationColor;
        }
        set decorationColor(value) {
            this._decorationColor = value;
            this.dom.style["textDecorationColor"] = value;
            this.callEvent("stylechanged", "textDecorationColor", value);
        }
        get decorationStyle() {
            return this._decorationStyle;
        }
        set decorationStyle(value) {
            this._decorationStyle = value;
            var val = "solid";
            if (value === "dashed")
                val = "dashed";
            if (value === "dotted")
                val = "dotted";
            if (value === "double")
                val = "double";
            if (value === "wavy")
                val = "wavy";
            this.dom.style["textDecorationStyle"] = val;
            this.callEvent("stylechanged", "decorationStyle", value);
        }
        static findReport(parent) {
            if (parent === undefined)
                return undefined;
            if ((parent === null || parent === void 0 ? void 0 : parent.reporttype) === "report")
                return parent;
            else
                return RComponent_2.findReport(parent._parent);
        }
        get style() {
            return this._style;
        }
        //@ts-ignore
        set style(value) {
            var old = this._style;
            this._style = value;
            var report = RComponent_2.findReport(this);
            if (report) {
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === old) {
                        this.dom.classList.remove(comp.styleid);
                    }
                });
                report.styleContainer._components.forEach((comp) => {
                    if (comp.name === value) {
                        this.dom.classList.add(comp.styleid);
                    }
                });
            }
            //  super.width = value;
        }
        get lineHeight() {
            return this._lineHeight;
        }
        set lineHeight(value) {
            this._lineHeight = value;
            this.dom.style["line-height"] = value;
            this.callEvent("stylechanged", "lineHeight", value);
            //  super.width = value;
        }
        get margin() {
            return this._margin;
        }
        set margin(value) {
            if (value === undefined) {
                this._margin = value;
                this.dom.style["margin"] = "";
            }
            else {
                if (Number.isInteger(value)) {
                    //@ts-ignore
                    value = [value, value, value, value];
                }
                if (value.length === 2) {
                    value = [value[0], value[1], value[0], value[1]];
                }
                this._margin = value;
                this.dom.style["margin"] = value[1] + "px " + value[2] + "px " + value[3] + "px " + value[0] + "px ";
            }
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.foreach) {
                ret.foreach = ob.foreach;
                delete ob.foreach;
            }
            if (ob.colSpan) {
                ret.colSpan = ob.colSpan;
                delete ob.colSpan;
            }
            if (ob.rowSpan) {
                ret.rowSpan = ob.rowSpan;
                delete ob.rowSpan;
            }
            if (ob.height) {
                ret.height = ob.height;
                delete ob.height;
            }
            if (ob.width) {
                ret.width = ob.width;
                delete ob.width;
            }
            if (ob.bold) {
                ret.bold = ob.bold;
                delete ob.bold;
            }
            if (ob.italics) {
                ret.italics = ob.italics;
                delete ob.italics;
            }
            if (ob.color) {
                ret.color = ob.color;
                delete ob.color;
            }
            if (ob.decoration) {
                ret.decoration = ob.decoration;
                delete ob.decoration;
            }
            if (ob.decorationStyle) {
                ret.decorationStyle = ob.decorationStyle;
                delete ob.decorationStyle;
            }
            if (ob.decorationColor) {
                ret.decorationColor = ob.decorationColor;
                delete ob.decorationColor;
            }
            if (ob.fontSize) {
                ret.fontSize = ob.fontSize;
                delete ob.fontSize;
            }
            if (ob.font) {
                ret.font = ob.font;
                delete ob.font;
            }
            if (ob.lineHeight) {
                ret.lineHeight = ob.lineHeight;
                delete ob.lineHeight;
            }
            if (ob.alignment) {
                ret.alignment = ob.alignment;
                delete ob.alignment;
            }
            if (ob.background) {
                ret.background = ob.background;
                delete ob.background;
            }
            if (ob.style) {
                ret.style = ob.style;
                delete ob.style;
            }
            if (ob.fillColor) {
                ret.fillColor = ob.fillColor;
                delete ob.fillColor;
            }
            if (ob.border) {
                ret.border = ob.border;
                delete ob.border;
            }
            if (ob.counter) {
                ret.counter = ob.counter;
                delete ob.counter;
            }
            if (ob.listType) {
                ret.listType = ob.listType;
                delete ob.listType;
            }
            if (ob.margin) {
                ret.margin = ob.margin;
                delete ob.margin;
            }
            if (ob.width) {
                ret.width = ob.width;
                delete ob.width;
            }
            ret.otherProperties = ob;
            return ret;
        }
        toJSON() {
            var _a, _b;
            var ret = {};
            if (this.colSpan !== undefined)
                ret.colSpan = this.colSpan;
            if (this.rowSpan !== undefined)
                ret.rowSpan = this.rowSpan;
            if (this.foreach !== undefined)
                ret.foreach = this.foreach;
            if (this.width !== undefined && !((_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth))
                ret.width = this.width;
            if (this.height !== undefined && !((_b = this._parent) === null || _b === void 0 ? void 0 : _b.setChildHeight))
                ret.height = this.height;
            if (this.bold !== undefined)
                ret.bold = this.bold;
            if (this.italics !== undefined)
                ret.italics = this.italics;
            if (this.color !== undefined)
                ret.color = this.color;
            if (this.decoration !== undefined)
                ret.decoration = this.decoration;
            if (this.decorationStyle !== undefined)
                ret.decorationStyle = this.decorationStyle;
            if (this.decorationColor !== undefined)
                ret.decorationColor = this.decorationColor;
            if (this.font !== undefined)
                ret.font = this.font;
            if (this.fontSize !== undefined)
                ret.fontSize = this.fontSize;
            if (this.lineHeight !== undefined)
                ret.lineHeight = this.lineHeight;
            if (this.alignment !== undefined)
                ret.alignment = this.alignment;
            if (this.background !== undefined)
                ret.background = this.background;
            if (this.style !== undefined)
                ret.style = this.style;
            if (this.fillColor !== undefined)
                ret.fillColor = this.fillColor;
            if (this.border !== undefined)
                ret.border = this.border;
            if (this.counter)
                ret.counter = this.counter;
            if (this.listType)
                ret.listType = this.listType;
            if (this.margin)
                ret.margin = this.margin;
            if (this.width && (this === null || this === void 0 ? void 0 : this._parent.reporttype) === "column")
                ret.width = this.width;
            Object.assign(ret, this["otherProperties"]);
            return ret;
        }
    };
    exports.RComponent = RComponent;
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", String)
    ], RComponent.prototype, "foreach", void 0);
    __decorate([
        (0, Property_1.$Property)({
            default: undefined,
            isVisible: (component) => {
                var _a;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ol";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "counter", null);
    __decorate([
        (0, Property_1.$Property)({
            name: "listType",
            default: undefined,
            isVisible: (component) => {
                var _a, _b;
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "ul" || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "ol";
            },
            chooseFrom: function (it) {
                if (it._parent.reporttype === "ol")
                    return ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"];
                else
                    return ["square", "circle", "none"];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "listType", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "color", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "fillColor", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "colSpan", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.reporttype) === "tablerow";
            }
        }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "rowSpan", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "boolean[]",
            default: [false, false, false, false],
            isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns";
            },
            description: "border of the tablecell: left, top, right, bottom"
        }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "border", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "width", null);
    __decorate([
        (0, Property_1.$Property)({
            type: "string", isVisible: (component) => {
                var _a, _b;
                //only in table and column width is posible
                return ((_a = component._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight) || ((_b = component._parent) === null || _b === void 0 ? void 0 : _b.reporttype) === "columns" || component.reporttype === "image";
            }
        }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], RComponent.prototype, "height", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "bold", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], RComponent.prototype, "italics", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["Alegreya", "AlegreyaSans", "AlegreyaSansSC", "AlegreyaSC", "AlmendraSC", "Amaranth", "Andada", "AndadaSC", "AnonymousPro", "ArchivoNarrow", "Arvo", "Asap", "AveriaLibre", "AveriaSansLibre", "AveriaSerifLibre", "Cambay", "Caudex", "CrimsonText", "Cuprum", "Economica", "Exo2", "Exo", "ExpletusSans", "FiraSans", "JosefinSans", "JosefinSlab", "Karla", "Lato", "LobsterTwo", "Lora", "Marvel", "Merriweather", "MerriweatherSans", "Nobile", "NoticiaText", "Overlock", "Philosopher", "PlayfairDisplay", "PlayfairDisplaySC", "PT_Serif-Web", "Puritan", "Quantico", "QuattrocentoSans", "Quicksand", "Rambla", "Rosario", "Sansation", "Sarabun", "Scada", "Share", "Sitara", "SourceSansPro", "TitilliumWeb", "Volkhov", "Vollkorn"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "font", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "fontSize", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "background", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "color", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["left", "center", "right"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "alignment", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["underline", "lineThrough", "overline"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decoration", null);
    __decorate([
        (0, Property_1.$Property)({ type: "color" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationColor", null);
    __decorate([
        (0, Property_1.$Property)({ chooseFrom: ["dashed", "dotted", "double", "wavy"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "decorationStyle", null);
    __decorate([
        (0, Property_1.$Property)()
        //@ts-ignore
        ,
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RComponent.prototype, "style", null);
    __decorate([
        (0, Property_1.$Property)({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RComponent.prototype, "lineHeight", null);
    __decorate([
        (0, Property_1.$Property)({ type: "number[]", description: "margin left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RComponent.prototype, "margin", null);
    exports.RComponent = RComponent = RComponent_2 = __decorate([
        (0, Registry_7.$Class)("jassijs_report.RComponent"),
        (0, Property_1.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], RComponent);
});
define("jassijs_report/RDatatable", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/remote/Classes", "jassijs_report/RGroupTablerow", "jassijs_report/RTable"], function (require, exports, Registry_8, RComponent_3, RTablerow_1, Property_2, Classes_2, RGroupTablerow_1, RTable_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RDatatable = void 0;
    exports.test = test;
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RDatatable = class RDatatable extends RTable_1.RTable {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = { isdatatable: true }) {
            super(properties);
            this.reporttype = "datatable";
            this.headerPanel = new RTablerow_1.RTablerow();
            this.groupHeaderPanel = [];
            this.bodyPanel = new RTablerow_1.RTablerow();
            this.groupFooterPanel = [];
            this.groupExpression = [];
            this.footerPanel = new RTablerow_1.RTablerow();
            var _this;
            this.footerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tablefooter</text></svg>" + '")';
            this.headerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Tableheader</text></svg>" + '")';
            this.removeAll(); //from Table Constructor
            this.add(this.headerPanel);
            this.add(this.bodyPanel);
            this.add(this.footerPanel);
            this.headerPanel.parent = this;
            this.footerPanel.parent = this;
            this.bodyPanel.parent = this;
        }
        addEmptyCellsIfNeeded(row) {
            var count = row._components.length;
            this.fillTableRow(this.headerPanel, count);
            this.fillTableRow(this.bodyPanel, count);
            this.fillTableRow(this.footerPanel, count);
        }
        set groupCount(value) {
            var _a;
            if (value < 0 || value > 5) {
                throw new Classes_2.JassiError("groupCount must be a value between 0 and 5");
            }
            if (this.groupHeaderPanel.length === value)
                return;
            //remove unused
            while (this.groupHeaderPanel.length > value) {
                this.remove(this.groupHeaderPanel[this.groupHeaderPanel.length - 1], true);
                this.groupHeaderPanel.splice(this.groupHeaderPanel.length - 1, 1);
            }
            while (this.groupFooterPanel.length > value) {
                this.remove(this.groupFooterPanel[this.groupFooterPanel.length - 1], true);
                this.groupFooterPanel.splice(this.groupFooterPanel.length - 1, 1);
            }
            while (this.groupExpression.length > value) {
                this.groupExpression.splice(this.groupExpression.length - 1, 1);
            }
            //add new
            while (this.groupHeaderPanel.length < value) {
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupHeaderPanel.length + 1;
                tr.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Header</text></svg>" + '")';
                this.addBefore(tr, this.bodyPanel);
                this.groupHeaderPanel.push(tr);
            }
            while (this.groupFooterPanel.length < value) {
                let tr = new RGroupTablerow_1.RGroupTablerow();
                tr.parent = this;
                var id = this.groupFooterPanel.length + 1;
                tr.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Group" + id + "-Footer</text></svg>" + '")';
                var prev = this.footerPanel;
                if (this.groupFooterPanel.length > 0)
                    prev = this.groupFooterPanel[this.groupFooterPanel.length - 1];
                this.addBefore(tr, prev);
                this.groupFooterPanel.push(tr);
            }
            while (this.groupExpression.length < value) {
                this.groupExpression.push("");
            }
            (_a = this._componentDesigner) === null || _a === void 0 ? void 0 : _a.editDialog(this._componentDesigner.editMode);
        }
        get groupCount() {
            return this.groupHeaderPanel.length;
        }
        fromJSON(obj, target = undefined) {
            var ob = obj.datatable;
            var ret = this;
            // this.removeAll();
            //ret.headerPanel.removeAll();
            //ret.bodyPanel.removeAll();
            //ret.footerPanel.removeAll();
            /* this.add(this.backgroundPanel);
             this.add(this.headerPanel);
             this.add(this.content);
             this.add(this.footerPanel);*/
            if (ob.header) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            if (ob.groups) {
                this.groupCount = ob.groups.length; //create Panels
                for (var x = 0; x < ob.groups.length; x++) {
                    this.groupExpression[x] = ob.groups[x].expression;
                    if (ob.groups[x].header) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].header);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupHeaderPanel[x].add(obp); });
                        obb.destroy();
                    }
                    if (ob.groups[x].footer) {
                        let obb = new RGroupTablerow_1.RGroupTablerow().fromJSON(ob.groups[x].footer);
                        obb.parent = ret;
                        let all = [];
                        obb._components.forEach((obp) => all.push(obp));
                        all.forEach((obp) => { ret.groupFooterPanel[x].add(obp); });
                        obb.destroy();
                    }
                }
            }
            delete ob.groups;
            if (ob.body) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.body);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.bodyPanel.add(obp); });
                delete ob.body;
                obb.destroy();
            }
            if (ob.footer) {
                let obb = new RTablerow_1.RTablerow().fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { ret.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob === null || ob === void 0 ? void 0 : ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.heights) {
                ret.heights = ob.heights;
                delete ob.heights;
            }
            ret.dataforeach = ob.dataforeach;
            delete ob.dataforeach;
            delete obj.datatable;
            super.fromJSON(obj, ob);
            return ret;
        }
        toJSON() {
            var ret = super.toJSON(true);
            ret.datatable = ret.table;
            delete ret.table;
            var r = ret.datatable;
            //TODO hack
            r.groups = ret.groups;
            delete ret.groups;
            if (this.groupHeaderPanel.length > 0) {
                r.groups = [];
                for (var x = 0; x < this.groupHeaderPanel.length; x++) {
                    var gheader = undefined;
                    var gfooter = undefined;
                    if (!(this.groupHeaderPanel[x]._components.length === 0 || (this.groupHeaderPanel[x]._designMode && this.groupHeaderPanel[x]._components.length === 1))) {
                        gheader = this.groupHeaderPanel[x].toJSON();
                    }
                    if (!(this.groupFooterPanel[x]._components.length === 0 || (this.groupFooterPanel[x]._designMode && this.groupFooterPanel[x]._components.length === 1))) {
                        gfooter = this.groupFooterPanel[x].toJSON();
                    }
                    r.groups.push({
                        header: gheader,
                        expression: this.groupExpression[x],
                        footer: gfooter
                    });
                }
            }
            if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
                r.header = this.headerPanel.toJSON();
            }
            if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
                r.footer = this.footerPanel.toJSON();
            }
            r.dataforeach = this.dataforeach;
            r.body = this.bodyPanel.toJSON();
            return ret;
        }
    };
    exports.RDatatable = RDatatable;
    __decorate([
        (0, Property_2.$Property)(),
        __metadata("design:type", String)
    ], RDatatable.prototype, "dataforeach", void 0);
    __decorate([
        (0, Property_2.$Property)(),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RDatatable.prototype, "groupCount", null);
    exports.RDatatable = RDatatable = __decorate([
        (0, RComponent_3.$ReportComponent)({ fullPath: "report/Datatable", icon: "mdi mdi-table-cog", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Registry_8.$Class)("jassijs_report.RDatatable"),
        __metadata("design:paramtypes", [Object])
    ], RDatatable);
    async function test() {
    }
});
//this file is autogenerated don't modify
define("jassijs_report/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_report/designer/ReportDesigner.ts": {
                "date": 1699287545054.5315,
                "jassijs_report.designer.ReportDesigner": {}
            },
            "jassijs_report/designer/SimpleReportDesigner.ts": {
                "date": 1655556794000,
                "jassijs_report.designer.SimpleReportDesigner": {}
            },
            "jassijs_report/ext/pdfjs.ts": {
                "date": 1657714200000
            },
            "jassijs_report/ext/pdfmake.ts": {
                "date": 1657714352000
            },
            "jassijs_report/modul.ts": {
                "date": 1655329710000
            },
            "jassijs_report/pdfMake-interface.ts": {
                "date": 1681513962000
            },
            "jassijs_report/PDFReport.ts": {
                "date": 1655556866000,
                "jassijs_report.PDFReport": {}
            },
            "jassijs_report/PDFViewer.ts": {
                "date": 1719589039108.462,
                "jassijs_report.PDFViewer": {}
            },
            "jassijs_report/RColumns.ts": {
                "date": 1721763160019.909,
                "jassijs_report.RColumns": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Columns",
                            "icon": "mdi mdi-view-parallel-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RComponent.ts": {
                "date": 1699203219964.0005,
                "jassijs_report.RComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RDatatable.ts": {
                "date": 1740077551782.498,
                "jassijs_report.RDatatable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Datatable",
                            "icon": "mdi mdi-table-cog",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/remote/pdfmakejassi.ts": {
                "date": 1634336644000
            },
            "jassijs_report/remote/ServerReport.ts": {
                "date": 1684441134000,
                "jassijs_report.remote.ServerReport": {
                    "@members": {
                        "getDesign": {
                            "ValidateFunctionParameter": []
                        },
                        "getBase64": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs_report/Report.ts": {
                "date": 1656501702000,
                "jassijs_report.remote.Report": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "createActions": {
                            "$Actions": []
                        }
                    }
                }
            },
            "jassijs_report/ReportDesign.ts": {
                "date": 1740076933424.2107,
                "jassijs_report.InfoProperties": {
                    "@members": {}
                },
                "jassijs_report.PermissionProperties": {
                    "@members": {}
                },
                "jassijs_report.StyleContainer": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                },
                "jassijs_report.ReportDesign": {
                    "$ReportComponent": [
                        {
                            "fullPath": "undefined",
                            "icon": "undefined",
                            "editableChildComponents": [
                                "this",
                                "this.backgroundPanel",
                                "this.headerPanel",
                                "this.contentPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/ReportDesignGlobal.ts": {
                "date": 1655397714000
            },
            "jassijs_report/Reports.ts": {
                "date": 1657978946000,
                "jassijs_report/Reports": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Tools/Reports",
                                    "icon": "mdi mdi-chart-box-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/ReportViewer.ts": {
                "date": 1681571042000,
                "jassijs_report/ReportViewer": {}
            },
            "jassijs_report/RGroupTablerow.ts": {
                "date": 1699111120748.0674,
                "jassijs_report.RTablerow": {
                    "@members": {}
                }
            },
            "jassijs_report/RImage.ts": {
                "date": 1719588998709.0293,
                "jassijs_report.RImage": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Image",
                            "icon": "mdi mdi-image-frame"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RImageEditor.ts": {
                "date": 1739905991130.4978,
                "jassi_report/RImagePropertyEditor": {
                    "$PropertyEditor": [
                        [
                            "rimage"
                        ]
                    ]
                }
            },
            "jassijs_report/ROList.ts": {
                "date": 1721763181480.2773,
                "jassijs_report.ROList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Ordered List",
                            "icon": "mdi mdi-format-list-numbered",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RStack.ts": {
                "date": 1740076986120.5095,
                "jassijs_report.RStack": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Stack",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs_report.RComponent"
                        }
                    ]
                }
            },
            "jassijs_report/RStyle.ts": {
                "date": 1656015340000,
                "jassijs_report.RStyle": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Style",
                            "icon": "mdi mdi-virus-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTable.ts": {
                "date": 1721763274507.0127,
                "jassijs_report.RTable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Table",
                            "icon": "mdi mdi-table-large",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTableLayouts.ts": {
                "date": 1633113320000
            },
            "jassijs_report/RTablerow.ts": {
                "date": 1740077542230.021,
                "jassijs_report.RTablerow": {
                    "$ReportComponent": [
                        {
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RText.ts": {
                "date": 1740076167764.8438,
                "jassijs_report.RText": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Text",
                            "icon": "mdi mdi-format-color-text"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "value",
                            "type": "string",
                            "description": "text"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTextGroup.ts": {
                "date": 1721763243509.179,
                "jassijs_report.RTextGroup": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/TextGroup",
                            "icon": "mdi mdi-text-box-multiple-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RUList.ts": {
                "date": 1721763248473.9978,
                "jassijs_report.RUList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Unordered List",
                            "icon": "mdi mdi-format-list-bulleted",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RUnknown.ts": {
                "date": 1719588242339.4045,
                "jassijs_report.RUnknown": {}
            },
            "jassijs_report/server/DoServerreport.ts": {
                "date": 1684441370000
            },
            "jassijs_report/server/TestServerreport.ts": {
                "date": 1684501452000
            },
            "jassijs_report/SimpleReportEditor.ts": {
                "date": 1697485042309.9119,
                "jassi_report.SimpleReportEditor": {}
            },
            "jassijs_report/StartReporteditor.ts": {
                "date": 1698507857261.209
            },
            "jassijs_report/TemplateReport.ts": {
                "date": 1681570100000,
                "jassijs_report.TemplateReport": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/Report",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/test/ClientReport.ts": {
                "date": 1656501728000,
                "jassijs_report.test.ClientReport": {
                    "$Report": [
                        {
                            "name": "test/Sample Clientreport"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/test/ServerReport.ts": {
                "date": 1684401088000,
                "jassijs_report.test.ServerReport": {
                    "$Report": [
                        {
                            "name": "test/Sample Serverreport",
                            "serverReportPath": "jassijs_report/server/TestServerreport"
                        }
                    ],
                    "@members": {}
                }
            }
        }
    };
});
define("jassijs_report/remote/pdfmakejassi", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.doGroup = doGroup;
    exports.createReportDefinition = createReportDefinition;
    exports.test = test;
    //templating is slow so we chache
    var funccache = {};
    //https://github.com/Mottie/javascript-number-formatter/blob/master/src/format.js
    //license https://github.com/Mottie/javascript-number-formatter/blob/master/LICENSE
    const maskRegex = /[0-9\-+#]/;
    const notMaskRegex = /[^\d\-+#]/g;
    function getIndex(mask) {
        return mask.search(maskRegex);
    }
    function processMask(mask = "#.##") {
        const maskObj = {};
        const len = mask.length;
        const start = getIndex(mask);
        maskObj.prefix = start > 0 ? mask.substring(0, start) : "";
        // Reverse string: not an ideal method if there are surrogate pairs
        const end = getIndex(mask.split("").reverse().join(""));
        const offset = len - end;
        const substr = mask.substring(offset, offset + 1);
        // Add 1 to offset if mask has a trailing decimal/comma
        const indx = offset + ((substr === "." || (substr === ",")) ? 1 : 0);
        maskObj.suffix = end > 0 ? mask.substring(indx, len) : "";
        maskObj.mask = mask.substring(start, indx);
        maskObj.maskHasNegativeSign = maskObj.mask.charAt(0) === "-";
        maskObj.maskHasPositiveSign = maskObj.mask.charAt(0) === "+";
        // Search for group separator & decimal; anything not digit,
        // not +/- sign, and not #
        let result = maskObj.mask.match(notMaskRegex);
        // Treat the right most symbol as decimal
        maskObj.decimal = (result && result[result.length - 1]) || ".";
        // Treat the left most symbol as group separator
        maskObj.separator = (result && result[1] && result[0]) || ",";
        // Split the decimal for the format string if any
        result = maskObj.mask.split(maskObj.decimal);
        maskObj.integer = result[0];
        maskObj.fraction = result[1];
        return maskObj;
    }
    function processValue(value, maskObj, options) {
        let isNegative = false;
        const valObj = {
            value
        };
        if (value < 0) {
            isNegative = true;
            // Process only abs(), and turn on flag.
            valObj.value = -valObj.value;
        }
        valObj.sign = isNegative ? "-" : "";
        // Fix the decimal first, toFixed will auto fill trailing zero.
        valObj.value = Number(valObj.value).toFixed(maskObj.fraction && maskObj.fraction.length);
        // Convert number to string to trim off *all* trailing decimal zero(es)
        valObj.value = Number(valObj.value).toString();
        // Fill back any trailing zero according to format
        // look for last zero in format
        const posTrailZero = maskObj.fraction && maskObj.fraction.lastIndexOf("0");
        let [valInteger = "0", valFraction = ""] = valObj.value.split(".");
        if (!valFraction || (valFraction && valFraction.length <= posTrailZero)) {
            valFraction = posTrailZero < 0
                ? ""
                : (Number("0." + valFraction).toFixed(posTrailZero + 1)).replace("0.", "");
        }
        valObj.integer = valInteger;
        valObj.fraction = valFraction;
        addSeparators(valObj, maskObj);
        // Remove negative sign if result is zero
        if (valObj.result === "0" || valObj.result === "") {
            // Remove negative sign if result is zero
            isNegative = false;
            valObj.sign = "";
        }
        if (!isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "+";
        }
        else if (isNegative && maskObj.maskHasPositiveSign) {
            valObj.sign = "-";
        }
        else if (isNegative) {
            valObj.sign = options && options.enforceMaskSign && !maskObj.maskHasNegativeSign
                ? ""
                : "-";
        }
        return valObj;
    }
    function addSeparators(valObj, maskObj) {
        valObj.result = "";
        // Look for separator
        const szSep = maskObj.integer.split(maskObj.separator);
        // Join back without separator for counting the pos of any leading 0
        const maskInteger = szSep.join("");
        const posLeadZero = maskInteger && maskInteger.indexOf("0");
        if (posLeadZero > -1) {
            while (valObj.integer.length < (maskInteger.length - posLeadZero)) {
                valObj.integer = "0" + valObj.integer;
            }
        }
        else if (Number(valObj.integer) === 0) {
            valObj.integer = "";
        }
        // Process the first group separator from decimal (.) only, the rest ignore.
        // get the length of the last slice of split result.
        const posSeparator = (szSep[1] && szSep[szSep.length - 1].length);
        if (posSeparator) {
            const len = valObj.integer.length;
            const offset = len % posSeparator;
            for (let indx = 0; indx < len; indx++) {
                valObj.result += valObj.integer.charAt(indx);
                // -posSeparator so that won't trail separator on full length
                if (!((indx - offset + 1) % posSeparator) && indx < len - posSeparator) {
                    valObj.result += maskObj.separator;
                }
            }
        }
        else {
            valObj.result = valObj.integer;
        }
        valObj.result += (maskObj.fraction && valObj.fraction)
            ? maskObj.decimal + valObj.fraction
            : "";
        return valObj;
    }
    function _format(mask, value, options = {}) {
        if (!mask || isNaN(Number(value))) {
            // Invalid inputs
            return value;
        }
        const maskObj = processMask(mask);
        const valObj = processValue(value, maskObj, options);
        return maskObj.prefix + valObj.sign + valObj.result + maskObj.suffix;
    }
    ;
    ///////////////////////////////////END https://github.com/Mottie/javascript-number-formatter/blob/master/src/format.js
    //add 0 before
    function v(str, num) {
        str = str.toString();
        while (str.length < num) {
            str = "0" + str;
        }
        return str;
    }
    //simple dateformat perhaps we should use moments
    //now we do something basics
    function formatDate(format, date) {
        return format.
            replace("DD", v(date.getDate(), 2)).
            replace("D", date.getDate().toString()).
            replace("MM", v(date.getMonth(), 2)).
            replace("YYYY", date.getFullYear().toString()).
            replace("YY", (date.getFullYear() % 100).toString()).
            replace("A", date.getHours() > 12 ? "PM" : "AM").
            replace("hh", v(date.getHours(), 2)).
            replace("h", (date.getHours() % 12).toString()).
            replace("mm", v(date.getMinutes(), 2)).
            replace("ss", v(date.getSeconds(), 2));
    }
    //clone the obj depp
    function clone(obj) {
        if (obj === null || typeof (obj) !== 'object' || 'isActiveClone' in obj)
            return obj;
        if (obj instanceof Date || typeof obj === "object")
            var temp = new obj.constructor(); //or new Date(obj);
        else
            var temp = obj.constructor();
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                obj['isActiveClone'] = null;
                temp[key] = clone(obj[key]);
                delete obj['isActiveClone'];
            }
        }
        return temp;
    }
    //replace the params in the string
    //@param {boolean} returnValues - if true the templatevalues would be returned not the replaces string
    //@ts-ignore
    String.prototype.replaceTemplate = function (params, returnValues) {
        const names = Object.keys(params);
        const vals = Object.values(params);
        addGroupFuncions(names, vals);
        for (let x = 0; x < vals.length; x++) {
            if (typeof vals[x] === "function") {
                vals[x] = vals[x].bind(params);
            }
        }
        let stag = "";
        if (returnValues) {
            names.push("tag");
            stag = "tag";
            vals.push(function tag(strings, values) {
                return values;
            });
        }
        var func = funccache[names.join(",") + this];
        if (func === undefined) { //create functions is slow so cache
            func = new Function(...names, `return ${stag}\`${this}\`;`);
            funccache[names.join(",") + this] = func;
        }
        return func(...vals);
    };
    //get the member of the data
    function getVar(data, member) {
        var ergebnis = member.toString().match(/\$\{(\w||\.)*\}/g);
        if (!ergebnis)
            member = "${" + member + "}";
        var ob = member.replaceTemplate(data, true);
        return ob;
    }
    //replace {{currentPage}} {{pageWidth}} {{pageHeight}} {{pageCount}} in header,footer, background
    function replacePageInformation(def) {
        if (def.background && typeof def.background !== "function") {
            let d = JSON.stringify(def.background);
            def.background = function (currentPage, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
        if (def.header && typeof def.header !== "function") {
            let d = JSON.stringify(def.header);
            def.header = function (currentPage, pageCount) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                return JSON.parse(sret);
            };
        }
        if (def.footer && typeof def.footer !== "function") {
            let d = JSON.stringify(def.footer);
            def.footer = function (currentPage, pageCount, pageSize) {
                let sret = d.replaceAll("{{currentPage}}", currentPage);
                sret = sret.replaceAll("{{pageCount}}", pageCount);
                sret = sret.replaceAll("{{pageWidth}}", pageSize.width);
                sret = sret.replaceAll("{{pageHeight}}", pageSize.height);
                return JSON.parse(sret);
            };
        }
    }
    //sort the group with groupfields
    function groupSort(group, name, groupfields, groupid = 0) {
        var ret = { entries: [], name: name };
        if (groupid > 0)
            ret["groupfield"] = groupfields[groupid - 1];
        if (Array.isArray(group)) {
            group.forEach((neu) => ret.entries.push(neu));
        }
        else {
            for (var key in group) {
                var neu = group[key];
                ret.entries.push(groupSort(neu, key, groupfields, groupid + 1));
            }
            ret.entries = ret.entries.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
        }
        return ret;
    }
    /**
     * groups and sort the entries
     * @param {any[]} entries - the entries to group
     * @param {string[]} groupfields - the fields where the entries are grouped
     */
    function doGroup(entries, groupfields) {
        var ret = {};
        for (var e = 0; e < entries.length; e++) {
            var entry = entries[e];
            let parent = ret;
            for (var x = 0; x < groupfields.length; x++) {
                var groupname = entry[groupfields[x]];
                if (x < groupfields.length - 1) { //undergroups does exists
                    if (!parent[groupname])
                        parent[groupname] = {};
                }
                else { //last group contaons the data
                    if (!parent[groupname])
                        parent[groupname] = [];
                    parent[groupname].push(entry);
                }
                parent = parent[groupname];
            }
        }
        //sort
        var sorted = groupSort(ret, "main", groupfields);
        return sorted;
    }
    //replace the datatable {datable:...} to table:{}
    function replaceDatatable(def, data) {
        var header = def.datatable.header;
        var footer = def.datatable.footer;
        var dataexpr = def.datatable.dataforeach;
        var groups = def.datatable.groups;
        var body = def.datatable.body;
        var groupexpr = [];
        def.table = clone(def.datatable);
        def.table.body = [];
        delete def.table.header;
        delete def.table.footer;
        delete def.table.dataforeach;
        delete def.table.groups;
        if (header)
            def.table.body.push(header);
        if (groups === undefined || groups.length === 0) {
            def.table.body.push({
                foreach: dataexpr,
                do: body
            });
        }
        else {
            var parent = {};
            var toadd = {
                foreach: "group1 in datatablegroups.entries",
                do: parent
            };
            def.table.body.push(toadd);
            for (var x = 0; x < groups.length; x++) {
                groupexpr.push(groups[x].expression);
                if (x < groups.length - 1) {
                    parent.foreach = "group" + (x + 2).toString() + " in group" + (x + 1).toString() + ".entries";
                }
                else {
                    parent.foreach = dataexpr.split(" ")[0] + " in group" + (x + 1).toString() + ".entries";
                }
                if (groups[x].header && groups[x].header.length > 0) {
                    parent.dofirst = groups[x].header;
                }
                if (groups[x].footer && groups[x].footer.length > 0) {
                    parent.dolast = groups[x].footer;
                }
                if (x < groups.length - 1) {
                    parent.do = {};
                    parent = parent.do;
                }
                else {
                    parent.do = body;
                }
            }
            var arr = getArrayFromForEach(def.datatable.dataforeach, data);
            data.datatablegroups = doGroup(arr, groupexpr);
        }
        delete def.datatable.dataforeach;
        if (footer)
            def.table.body.push(footer);
        //delete data[variable];
        delete def.datatable.header;
        delete def.datatable.footer;
        delete def.datatable.foreach;
        delete def.datatable.groups;
        delete def.datatable.body;
        for (var key in def.datatable) {
            def.table[key] = def.datatable[key];
        }
        delete def.datatable;
    }
    //get the array for the foreach statement in the data
    function getArrayFromForEach(foreach, data) {
        var sarr = foreach.split(" in ")[1];
        var arr;
        if (sarr === undefined) {
            arr = data === null || data === void 0 ? void 0 : data.items; //we get the main array
        }
        else {
            arr = getVar(data, sarr);
        }
        return arr;
    }
    //replace templates e.g. ${name} with the data
    function replaceTemplates(def, data, param = undefined) {
        if (def === undefined)
            return;
        if (def.datatable !== undefined) {
            replaceDatatable(def, data);
        }
        if (def.format) {
            var val = def.text.replaceTemplate(data, true);
            if (val === undefined)
                return "";
            else if (typeof val == 'number') {
                def.text = _format(def.format, val, {});
            }
            else if (val.getMonth) {
                def.text = formatDate(def.format, val);
            }
            delete def.format;
        }
        if (def.foreach !== undefined) {
            //resolve foreach
            //	{ foreach: "line in invoice.lines", do: ['{{line.text}}', '{{line.price}}', 'OK?']	
            if ((param === null || param === void 0 ? void 0 : param.parentArray) === undefined) {
                throw "foreach is not surounded by an Array";
            }
            var variable = def.foreach.split(" in ")[0];
            var arr = getArrayFromForEach(def.foreach, data);
            if ((param === null || param === void 0 ? void 0 : param.parentArrayPos) === undefined) {
                param.parentArrayPos = param === null || param === void 0 ? void 0 : param.parentArray.indexOf(def);
                param === null || param === void 0 ? void 0 : param.parentArray.splice(param.parentArrayPos, 1);
            }
            for (let x = 0; x < arr.length; x++) {
                data[variable] = arr[x];
                delete def.foreach;
                var copy;
                if (def.dofirst && x === 0) { //render only forfirst
                    copy = clone(def.dofirst);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
                if (def.do)
                    copy = clone(def.do);
                else
                    copy = clone(def);
                copy = replaceTemplates(copy, data, param);
                if (copy !== undefined)
                    param.parentArray.splice(param.parentArrayPos++, 0, copy);
                if (def.dolast && x === arr.length - 1) { //render only forlast
                    copy = clone(def.dolast);
                    copy = replaceTemplates(copy, data, param);
                    if (copy !== undefined)
                        param.parentArray.splice(param.parentArrayPos++, 0, copy);
                }
            }
            delete data[variable];
            return undefined;
        }
        else if (Array.isArray(def)) {
            for (var a = 0; a < def.length; a++) {
                if (def[a].foreach !== undefined) {
                    replaceTemplates(def[a], data, { parentArray: def });
                    a--;
                }
                else
                    def[a] = replaceTemplates(def[a], data, { parentArray: def });
            }
            return def;
        }
        else if (typeof def === "string") {
            var ergebnis = def.toString().match(/\$\{/g);
            if (ergebnis !== null) {
                def = def.replaceTemplate(data);
                //	for (var e = 0; e < ergebnis.length; e++) {
                //		def = replace(def, data, ergebnis[e].substring(2, ergebnis[e].length - 2));
                //	}
            }
            return def;
        }
        else { //object	
            for (var key in def) {
                def[key] = replaceTemplates(def[key], data);
            }
            delete def.editTogether; //RText is only used for editing report
        }
        return def;
    }
    /**
     * create an pdfmake-definition from an jassijs-report-definition, fills data and parameter in the report
     * @param {string} definition - the jassijs-report definition
     * @param {any} [data] - the data which are filled in the report (optional)
     * @param {any} [parameter] - the parameter which are filled in the report (otional)
     */
    function createReportDefinition(definition, data, parameter) {
        definition = clone(definition); //this would be modified
        if (data !== undefined)
            data = clone(data); //this would be modified
        if (data === undefined && definition.data !== undefined) {
            data = definition.data;
        }
        //parameter could be in data
        if (data !== undefined && data.parameter !== undefined && parameter !== undefined) {
            throw new Error("parameter would override data.parameter");
        }
        if (Array.isArray(data)) {
            data = { items: data }; //so we can do data.parameter
        }
        if (parameter !== undefined) {
            data.parameter = parameter;
        }
        //parameter could be in definition
        if (data !== undefined && data.parameter !== undefined && definition.parameter !== undefined) {
            throw new Error("definition.parameter would override data.parameter");
        }
        if (definition.parameter !== undefined) {
            data.parameter = definition.parameter;
        }
        definition.content = replaceTemplates(definition.content, data);
        if (definition.background)
            definition.background = replaceTemplates(definition.background, data);
        if (definition.header)
            definition.header = replaceTemplates(definition.header, data);
        if (definition.footer)
            definition.footer = replaceTemplates(definition.footer, data);
        replacePageInformation(definition);
        delete definition.data;
        return definition;
        // delete definition.parameter;
    }
    //add aggregate functions for grouping
    function addGroupFuncions(names, values) {
        names.push("sum");
        values.push(sum);
        names.push("count");
        values.push(count);
        names.push("max");
        values.push(max);
        names.push("min");
        values.push(min);
        names.push("avg");
        values.push(avg);
    }
    function aggr(group, field, data) {
        var ret = 0;
        if (!Array.isArray(group) && group.entries === undefined)
            throw new Error("sum is valid only in arrays and groups");
        var sfield = field;
        if (field.indexOf("${") === -1) {
            sfield = "${" + sfield + "}";
        }
        if (Array.isArray(group)) {
            for (var x = 0; x < group.length; x++) {
                var ob = group[x];
                if (ob.entries !== undefined)
                    aggr(ob.entries, field, data);
                else {
                    var val = sfield.replaceTemplate(ob, true);
                    data.func(data, val === undefined ? 0 : Number.parseFloat(val));
                }
            }
        }
        else {
            aggr(group.entries, field, data); //group
        }
        return data;
    }
    //sum the field in the group
    function sum(group, field) {
        return aggr(group, field, {
            ret: 0,
            func: (data, num) => {
                data.ret = data.ret + num;
            }
        }).ret;
    }
    //count the field in the group
    function count(group, field) {
        return aggr(group, field, {
            ret: 0,
            func: (data, num) => {
                data.ret = data.ret + 1;
            }
        }).ret;
    }
    //get the maximum of the field in the group
    function max(group, field) {
        return aggr(group, field, {
            ret: Number.MIN_VALUE,
            func: (data, num) => {
                if (num > data.ret)
                    data.ret = num;
            }
        }).ret;
    }
    //get the minimum of the field in the group
    function min(group, field) {
        return aggr(group, field, {
            ret: Number.MAX_VALUE,
            func: (data, num) => {
                if (num < data.ret)
                    data.ret = num;
            }
        }).ret;
    }
    //get the minimum of the field in the group
    function avg(group, field) {
        var ret = aggr(group, field, {
            ret: 0,
            count: 0,
            func: (data, num) => {
                data.ret = data.ret + num;
                data.count++;
            }
        });
        return ret.ret / ret.count;
    }
    function test() {
        var ff = _format("####,##", 50.22, {});
        var hh = formatDate("DD.MM.YYYY hh:mm:ss", new Date());
        var hh = formatDate("YY-MM-DD h:mm:ss A", new Date());
        var sampleData = [
            { id: 1, customer: "Fred", city: "Frankfurt", age: 51 },
            { id: 8, customer: "Alma", city: "Dresden", age: 70 },
            { id: 3, customer: "Heinz", city: "Frankfurt", age: 33 },
            { id: 2, customer: "Fred", city: "Frankfurt", age: 88 },
            { id: 6, customer: "Max", city: "Dresden", age: 3 },
            { id: 4, customer: "Heinz", city: "Frankfurt", age: 64 },
            { id: 5, customer: "Max", city: "Dresden", age: 54 },
            { id: 7, customer: "Alma", city: "Dresden", age: 33 },
            { id: 9, customer: "Otto", city: "Berlin", age: 21 }
        ];
        var h = {
            all: doGroup(sampleData, ["city", "customer"]),
            k: 5,
            ho() {
                return this.k + 1;
            }
        };
        //@ts-ignore
        var s = "${Math.round(avg(all,'age'),2)}".replaceTemplate(h, true);
        s = "${k}".replaceTemplate(h, true);
        s = "${ho()}".replaceTemplate(h, true);
    }
});
define("jassijs_report/remote/ServerReport", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/remote/Server", "jassijs/remote/Validator"], function (require, exports, Registry_9, RemoteObject_1, Server_1, Validator_1) {
    "use strict";
    var ServerReport_2;
    var _a, _b;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerReport = void 0;
    exports.test = test;
    let ServerReport = ServerReport_2 = class ServerReport extends RemoteObject_1.RemoteObject {
        static async getDesign(path, parameter, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await ServerReport_2.call(this.getDesign, path, parameter, context);
            }
            else {
                //@ts-ignore
                var DoServerreport = (await new Promise((resolve_2, reject_2) => { require(["jassijs_report/server/DoServerreport"], resolve_2, reject_2); }).then(__importStar)).DoServerreport;
                ServerReport_2.cacheLastParameter[path] = parameter;
                return await new DoServerreport().getDesign(path, parameter);
            }
        }
        static async getBase64(path, parameter, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await ServerReport_2.call(this.getBase64, path, parameter, context);
            }
            else {
                //@ts-ignore
                var DoServerreport = (await new Promise((resolve_3, reject_3) => { require(["jassijs_report/server/DoServerreport"], resolve_3, reject_3); }).then(__importStar)).DoServerreport;
                if (parameter == "useLastCachedParameter")
                    parameter = ServerReport_2.cacheLastParameter[path];
                return await new DoServerreport().getBase64(path, parameter);
            }
        }
        static async getBase64FromFile(file, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await ServerReport_2.call(this.getBase64FromFile, file, context);
            }
            else {
                var res = await new Server_1.Server().testServersideFile(file.substring(0, file.length - 3), context);
                //@ts-ignore 
                var DoServerreport = (await new Promise((resolve_4, reject_4) => { require(["jassijs_report/server/DoServerreport"], resolve_4, reject_4); }).then(__importStar)).DoServerreport;
                return await new DoServerreport().getBase64FromData(res);
            }
        }
    };
    exports.ServerReport = ServerReport;
    ServerReport.cacheLastParameter = {};
    __decorate([
        (0, Validator_1.ValidateFunctionParameter)(),
        __param(0, (0, Validator_1.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, typeof (_a = typeof RemoteObject_1.Context !== "undefined" && RemoteObject_1.Context) === "function" ? _a : Object]),
        __metadata("design:returntype", Promise)
    ], ServerReport, "getDesign", null);
    __decorate([
        (0, Validator_1.ValidateFunctionParameter)(),
        __param(0, (0, Validator_1.ValidateIsString)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, typeof (_b = typeof RemoteObject_1.Context !== "undefined" && RemoteObject_1.Context) === "function" ? _b : Object]),
        __metadata("design:returntype", Promise)
    ], ServerReport, "getBase64", null);
    exports.ServerReport = ServerReport = ServerReport_2 = __decorate([
        (0, Registry_9.$Class)("jassijs_report.remote.ServerReport")
    ], ServerReport);
    async function test() {
        var ret = await ServerReport.getBase64("jassijs_report/server/TestServerreport", { sort: "name" });
        return ret;
        //    console.log(await new ServerReport().sayHello("Kurt"));
    }
});
define("jassijs_report/Report", ["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs_report/ext/pdfmake", "jassijs/base/Windows", "jassijs/remote/Classes", "jassijs_report/remote/ServerReport", "jassijs_report/PDFReport", "jassijs/base/Actions"], function (require, exports, Registry_10, RemoteObject_2, pdfmake_2, Windows_1, Classes_3, ServerReport_3, PDFReport_2, Actions_1) {
    "use strict";
    var Report_1;
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Report = exports.ReportProperties = void 0;
    exports.$Report = $Report;
    exports.test = test;
    Registry_10 = __importStar(Registry_10);
    pdfmake_2 = __importDefault(pdfmake_2);
    Windows_1 = __importDefault(Windows_1);
    //import { ReportViewer } from "jassijs_report/ReportViewer";
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_10.default.register("$Report", pclass, properties);
        };
    }
    let Report = Report_1 = class Report extends RemoteObject_2.RemoteObject {
        //this is a sample remote function
        async fill() {
            var clname = Classes_3.classes.getClassName(this);
            var meta = Registry_10.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var par = this.getParameter();
                    var ret = await ServerReport_3.ServerReport.getDesign(path, par);
                    return ret;
                }
                //return await this.call(this, this.fill, context);
            }
            throw new Classes_3.JassiError("Clintreports must implememt fill");
        }
        getParameter() {
            var reportFields = Object.keys(new Report_1());
            var thisFields = Object.keys(this);
            var ret = {};
            thisFields.forEach((f) => {
                if (reportFields.indexOf(f) === -1) {
                    ret[f] = this[f];
                    if (typeof ret[f] === "function")
                        ret[f].bind(ret);
                }
            });
            return ret;
        }
        async getBase64() {
            var clname = Classes_3.classes.getClassName(this);
            var meta = Registry_10.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var par = this.getParameter();
                    return await ServerReport_3.ServerReport.getBase64(path, par);
                }
                //return await this.call(this, this.fill, context);
            }
            var rep = new PDFReport_2.PDFReport();
            var des = await this.fill();
            rep.value = des.reportdesign;
            rep.data = des.data;
            rep.parameter = des.parameter;
            rep.fill();
            return await rep.getBase64();
        }
        getName() {
            var clname = Classes_3.classes.getClassName(this);
            var meta = Registry_10.default.getData("$Report", clname);
            var ret = "Report";
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                ret = meta[0].params[0].name;
                ret = ret.split("/")[ret.split("/").length - 1];
            }
            return ret;
        }
        _base64ToArrayBuffer(base64) {
            var binary_string = window.atob(base64);
            var len = binary_string.length;
            var bytes = new Uint8Array(len);
            for (var i = 0; i < len; i++) {
                bytes[i] = binary_string.charCodeAt(i);
            }
            return bytes.buffer;
        }
        async open() {
            var b64 = await this.getBase64();
            var rep = pdfmake_2.default.createPdf({ content: [] });
            var _this = this;
            rep.getBuffer = async () => {
                return _this._base64ToArrayBuffer(b64);
            };
            rep.open();
            //alert("TODO");
        }
        async view() {
            var ReportViewer = (await new Promise((resolve_5, reject_5) => { require(["jassijs_report/ReportViewer"], resolve_5, reject_5); }).then(__importStar)).ReportViewer;
            var ret = new ReportViewer();
            ret.value = this;
            Windows_1.default.add(ret, this.getName());
        }
        static createFunction(classname) {
            return async function () {
                var Rep = await Classes_3.classes.loadClass(classname);
                new Rep().view();
            };
        }
        /**
        * create Action for all DBObjectView with actionname is defined
        */
        static async createActions() {
            var ret = [];
            var data = await Registry_10.default.getJSONData("$Report");
            for (var x = 0; x < data.length; x++) {
                var param = data[x].params[0];
                if (param.actionname) {
                    ret.push({
                        name: param.actionname,
                        icon: param.icon,
                        run: this.createFunction(data[x].classname)
                    });
                }
            }
            return ret;
        }
    };
    exports.Report = Report;
    __decorate([
        (0, Actions_1.$Actions)(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", typeof (_a = typeof Promise !== "undefined" && Promise) === "function" ? _a : Object)
    ], Report, "createActions", null);
    exports.Report = Report = Report_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_10.$Class)("jassijs_report.remote.Report")
    ], Report);
    async function test() {
        //    console.log(await new Report().sayHello("Kurt"));
    }
});
define("jassijs_report/ReportDesign", ["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs_report/RStack", "jassijs_report/RText", "jassijs_report/RColumns", "jassijs_report/RUnknown", "jassijs/ui/Panel", "jassijs_report/RComponent", "jassijs_report/RDatatable", "jassijs/ui/Property", "jassijs_report/RStyle", "jassijs_report/RTextGroup", "jassijs_report/RTable", "jassijs_report/RUList", "jassijs_report/ROList", "jassijs_report/RImage"], function (require, exports, BoxPanel_2, Registry_11, RStack_1, RText_2, RColumns_1, RUnknown_1, Panel_3, RComponent_4, RDatatable_1, Property_3, RStyle_1, RTextGroup_2, RTable_2, RUList_1, ROList_1, RImage_1) {
    "use strict";
    var ReportDesign_3;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportDesign = void 0;
    exports.test = test;
    let InfoProperties = class InfoProperties {
    };
    __decorate([
        (0, Property_3.$Property)({ description: "the title of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "title", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "the name of the author" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "author", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "the subject of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "subject", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "keywords associated with the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "keywords", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "the creator of the document (default is ‘pdfmake’)" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "creator", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "the producer of the document" }),
        __metadata("design:type", String)
    ], InfoProperties.prototype, "producer", void 0);
    InfoProperties = __decorate([
        (0, Registry_11.$Class)("jassijs_report.InfoProperties")
    ], InfoProperties);
    let PermissionProperties = class PermissionProperties {
        constructor() {
            this.modifying = true;
            this.copying = true;
            this.annotating = true;
            this.fillingForms = true;
            this.contentAccessibility = true;
            this.documentAssembly = true;
        }
    };
    __decorate([
        (0, Property_3.$Property)({ chooseFrom: ["lowResolution", "highResolution"], description: 'whether printing is allowed. Specify "lowResolution" to allow degraded printing, or "highResolution" to allow printing with high resolution' }),
        __metadata("design:type", String)
    ], PermissionProperties.prototype, "printing", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether modifying the file is allowed. Specify true to allow modifying document content" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "modifying", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether copying text or graphics is allowed. Specify true to allow copying" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "copying", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether annotating, form filling is allowed. Specify true to allow annotating and form filling" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "annotating", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether form filling and signing is allowed. Specify true to allow filling in form fields and signing" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "fillingForms", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether copying text for accessibility is allowed. Specify true to allow copying for accessibility" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "contentAccessibility", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "whether assembling document is allowed. Specify true to allow document assembly" }),
        __metadata("design:type", Boolean)
    ], PermissionProperties.prototype, "documentAssembly", void 0);
    PermissionProperties = __decorate([
        (0, Registry_11.$Class)("jassijs_report.PermissionProperties")
    ], PermissionProperties);
    let StyleContainer = class StyleContainer extends Panel_3.Panel {
        constructor(props) {
            super(props);
            this.dom.classList.remove("Panel");
            this.dom.classList.remove("jinlinecomponent");
            this.domWrapper.classList.remove("jcomponent");
            this.domWrapper.classList.remove("jcontainer");
            this.dom.hidden = true;
        }
    };
    StyleContainer = __decorate([
        (0, Registry_11.$Class)("jassijs_report.StyleContainer"),
        (0, Property_3.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], StyleContainer);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let ReportDesign = ReportDesign_3 = class ReportDesign extends BoxPanel_2.BoxPanel {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.styleContainer = new StyleContainer(undefined);
            this.defaultStyle = new RStyle_1.RStyle();
            this.reporttype = "report";
            this.backgroundPanel = new RStack_1.RStack();
            this.headerPanel = new RStack_1.RStack();
            this.contentPanel = new RStack_1.RStack();
            this.footerPanel = new RStack_1.RStack();
            this._pageSize = undefined;
            this.pageSized = {
                '4A0': [4767.87, 6740.79],
                '2A0': [3370.39, 4767.87],
                A0: [2383.94, 3370.39],
                A1: [1683.78, 2383.94],
                A2: [1190.55, 1683.78],
                A3: [841.89, 1190.55],
                A4: [595.28, 841.89],
                A5: [419.53, 595.28],
                A6: [297.64, 419.53],
                A7: [209.76, 297.64],
                A8: [147.40, 209.76],
                A9: [104.88, 147.40],
                A10: [73.70, 104.88],
                B0: [2834.65, 4008.19],
                B1: [2004.09, 2834.65],
                B2: [1417.32, 2004.09],
                B3: [1000.63, 1417.32],
                B4: [708.66, 1000.63],
                B5: [498.90, 708.66],
                B6: [354.33, 498.90],
                B7: [249.45, 354.33],
                B8: [175.75, 249.45],
                B9: [124.72, 175.75],
                B10: [87.87, 124.72],
                C0: [2599.37, 3676.54],
                C1: [1836.85, 2599.37],
                C2: [1298.27, 1836.85],
                C3: [918.43, 1298.27],
                C4: [649.13, 918.43],
                C5: [459.21, 649.13],
                C6: [323.15, 459.21],
                C7: [229.61, 323.15],
                C8: [161.57, 229.61],
                C9: [113.39, 161.57],
                C10: [79.37, 113.39],
                RA0: [2437.80, 3458.27],
                RA1: [1729.13, 2437.80],
                RA2: [1218.90, 1729.13],
                RA3: [864.57, 1218.90],
                RA4: [609.45, 864.57],
                SRA0: [2551.18, 3628.35],
                SRA1: [1814.17, 2551.18],
                SRA2: [1275.59, 1814.17],
                SRA3: [907.09, 1275.59],
                SRA4: [637.80, 907.09],
                EXECUTIVE: [521.86, 756.00],
                FOLIO: [612.00, 936.00],
                LEGAL: [612.00, 1008.00],
                LETTER: [612.00, 792.00],
                TABLOID: [792.00, 1224.00]
            };
            this.backgroundPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Background</text></svg>" + '")';
            this.footerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Footer</text></svg>" + '")';
            this.headerPanel.dom.style["background-image"] = 'url("' + "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' version='1.1' height='50px' width='120px'><text x='0' y='15' fill='black' opacity='0.18' font-size='20'>Header</text></svg>" + '")';
            //select the Report if the user click the Panel
            this.backgroundPanel["_editorselectthis"] = this;
            this.headerPanel["_editorselectthis"] = this;
            //this.contentPanel["_editorselectthis"]=this;     
            this.footerPanel["_editorselectthis"] = this;
            this.add(this.backgroundPanel);
            this.add(this.headerPanel);
            this.add(this.contentPanel);
            this.add(this.footerPanel);
            this.add(this.styleContainer);
            //this.pageSize = "A4";
            //this.pageMargins = [40, 40, 40, 40];
        }
        update(design) {
            this.design = design;
            ReportDesign_3.fromJSON(this.design, this);
        }
        get pageMargins() {
            return this._pageMargins;
        }
        set pageMargins(value) {
            this._pageMargins = value;
            if (value === undefined)
                value = [40, 40, 40, 40];
            this.updateWidth();
            this.contentPanel.dom.style["margin-left"] = value[1] + "px";
            this.contentPanel.dom.style["margin-right"] = value[3] + "px";
        }
        get pageSize() {
            return this._pageSize;
        }
        set pageSize(value) {
            this._pageSize = value;
            this.updateWidth();
        }
        get pageOrientation() {
            return this._pageOrientation;
        }
        set pageOrientation(value) {
            this._pageOrientation = value;
            this.updateWidth();
        }
        updateWidth() {
            var ps = this.pageSize === undefined ? "A4" : this.pageSize;
            var po = this.pageOrientation === 'landscape' ? 1 : 0;
            var pm = this.pageMargins == undefined ? [40, 40, 40, 40] : this.pageMargins;
            this.width = this.pageSized[ps][po]; //-pm[0]-pm[2];
        }
        static collectForEach(component, allforeach) {
            if (component.foreach)
                allforeach.unshift(component.foreach);
            if (component["dataforeach"])
                allforeach.unshift(component["dataforeach"]);
            if (component.reporttype === "report")
                return component;
            return ReportDesign_3.collectForEach(component._parent, allforeach);
        }
        static getVariable(path, data) {
            var mems = path.split(".");
            var curdata = data;
            for (var x = 0; x < mems.length; x++) {
                curdata = curdata[mems[x]];
                if (curdata === undefined)
                    return undefined;
            }
            return curdata;
        }
        static addVariablenames(path, data, names) {
            for (var key in data) {
                var val = data[key];
                if (Array.isArray(val)) {
                }
                else if (typeof (val) === "object") {
                    ReportDesign_3.addVariablenames(path + (path === "" ? "" : ".") + key, val, names);
                }
                else {
                    names.push("${" + path + (path === "" ? "" : ".") + key + "}");
                }
            }
        }
        //get all possible variabelnames
        static getVariables(component) {
            var allforeach = [];
            var report = ReportDesign_3.collectForEach(component, allforeach);
            var data = {};
            Object.assign(data, report.otherProperties.data);
            for (var x = 0; x < allforeach.length; x++) {
                var fe = allforeach[x].split(" in ");
                if (fe.length !== 2)
                    continue;
                var test = ReportDesign_3.getVariable(fe[1], data);
                if (test && test.length > 0)
                    data[fe[0]] = test[0];
            }
            Object.assign(data, report.otherProperties.data);
            var ret = [];
            ReportDesign_3.addVariablenames("", data, ret);
            return ret;
        }
        static fromJSON(ob, target = undefined) {
            var ret = undefined;
            if (ob.content !== undefined) {
                ret = target;
                if (ret === undefined)
                    ret = new ReportDesign_3();
                ret.create(ob);
            }
            else if (typeof ob === 'string' || ob instanceof String) {
                ret = new RText_2.RText();
                ret.value = ob;
            }
            else if (ob.text !== undefined && (ob.editTogether || !Array.isArray(ob.text))) {
                ret = new RText_2.RText().fromJSON(ob);
            }
            else if (ob.text !== undefined && Array.isArray(ob.text)) {
                ret = new RTextGroup_2.RTextGroup().fromJSON(ob);
            }
            else if (ob.stack !== undefined || Array.isArray(ob)) {
                ret = new RStack_1.RStack().fromJSON(ob);
            }
            else if (ob.columns !== undefined) {
                ret = new RColumns_1.RColumns().fromJSON(ob);
            }
            else if (ob.datatable !== undefined) {
                ret = new RDatatable_1.RDatatable().fromJSON(ob);
            }
            else if (ob.table !== undefined) {
                ret = new RTable_2.RTable().fromJSON(ob);
            }
            else if (ob.ul !== undefined) {
                ret = new RUList_1.RUList().fromJSON(ob);
            }
            else if (ob.ol !== undefined) {
                ret = new ROList_1.ROList().fromJSON(ob);
            }
            else if (ob.image !== undefined) {
                ret = new RImage_1.RImage().fromJSON(ob);
            }
            else {
                ret = new RUnknown_1.RUnknown().fromJSON(ob);
            }
            return ret;
        }
        create(ob) {
            var _this = this;
            // this.removeAll();
            this.defaultStyle = new RStyle_1.RStyle();
            this._pageSize = undefined;
            this._pageOrientation = undefined;
            this._pageMargins = undefined;
            this.compress = undefined;
            this.userPassword = undefined;
            this.ownerPassword = undefined;
            this.info = undefined;
            this.permissions = undefined;
            this.backgroundPanel.removeAll();
            this.headerPanel.removeAll();
            this.contentPanel.removeAll();
            this.footerPanel.removeAll();
            if (ob.defaultStyle) {
                this.defaultStyle = new RStyle_1.RStyle().fromJSON(ob.defaultStyle);
                this.defaultStyle.name = "defaultStyle";
                this.dom.classList.add(this.defaultStyle.styleid);
                delete ob.defaultStyle;
            }
            if (ob.styles) {
                for (var st in ob.styles) {
                    var rs = new RStyle_1.RStyle().fromJSON(ob.styles[st]);
                    rs.name = st;
                    this.styleContainer.add(rs);
                    rs.update();
                }
                delete ob.styles;
            }
            if (ob.background) {
                let obb = ReportDesign_3.fromJSON(ob.background);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.backgroundPanel.add(obp); });
                delete ob.background;
                obb.destroy();
            }
            if (ob.header) {
                let obb = ReportDesign_3.fromJSON(ob.header);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.headerPanel.add(obp); });
                delete ob.header;
                obb.destroy();
            }
            let obb = ReportDesign_3.fromJSON(ob.content);
            let all = [];
            obb._components.forEach((obp) => all.push(obp));
            all.forEach((obp) => { _this.contentPanel.add(obp); });
            delete ob.content;
            obb.destroy();
            if (ob.footer) {
                let obb = ReportDesign_3.fromJSON(ob.footer);
                let all = [];
                obb._components.forEach((obp) => all.push(obp));
                all.forEach((obp) => { _this.footerPanel.add(obp); });
                delete ob.footer;
                obb.destroy();
            }
            if (ob.pageOrientation) {
                this.pageOrientation = ob.pageOrientation;
                delete ob.pageOrientation;
            }
            if (ob.pageMargins) {
                this.pageMargins = ob.pageMargins;
                delete ob.pageMargins;
            }
            if (ob.pageSize) {
                this.pageSize = ob.pageSize;
                delete ob.pageSize;
            }
            if (ob.info) {
                this.info = ob.info;
                delete ob.info;
            }
            if (ob.compress) {
                this.compress = ob.compress;
                delete ob.compress;
            }
            if (ob.userPassword) {
                this.userPassword = ob.userPassword;
                delete ob.userPassword;
            }
            if (ob.ownerPassword) {
                this.ownerPassword = ob.ownerPassword;
                delete ob.ownerPassword;
            }
            if (ob.permissions) {
                this.permissions = ob.permissions;
                delete ob.permissions;
            }
            if (ob.images) {
                this.images = ob.images;
                delete ob.images;
            }
            //delete ob.data;//should not be to json
            this.otherProperties = ob;
            ReportDesign_3.linkStyles(this);
        }
        static linkStyles(parent) {
            for (var x = 0; x < parent._components.length; x++) {
                var comp = parent._components[x];
                if (comp["style"]) {
                    comp["style"] = comp["style"];
                }
                if (comp["_components"]) {
                    ReportDesign_3.linkStyles(comp);
                }
            }
        }
        toJSON() {
            var r = {};
            if (JSON.stringify(this.defaultStyle) !== "{}") {
                r.defaultStyle = this.defaultStyle.toJSON();
            }
            if (this.styleContainer._components.length > 0) {
                r.styles = {};
                for (var x = 0; x < this.styleContainer._components.length; x++) {
                    r.styles[this.styleContainer._components[x]["name"]] = this.styleContainer._components[x].toJSON();
                }
                //var _this = this;
                if (!(this.backgroundPanel._components.length === 0 || (this.backgroundPanel._designMode && this.backgroundPanel._components.length === 1))) {
                    r.background = this.backgroundPanel.toJSON();
                }
                if (!(this.headerPanel._components.length === 0 || (this.headerPanel._designMode && this.headerPanel._components.length === 1))) {
                    r.header = this.headerPanel.toJSON();
                }
                if (!(this.footerPanel._components.length === 0 || (this.footerPanel._designMode && this.footerPanel._components.length === 1))) {
                    r.footer = this.footerPanel.toJSON();
                }
                r.content = this.contentPanel.toJSON();
                if (this.pageOrientation) {
                    r.pageOrientation = this.pageOrientation;
                }
                if (this.pageMargins)
                    r.pageMargins = this.pageMargins;
                if (this.pageSize)
                    r.pageSize = this.pageSize;
                if (this.info)
                    r.info = this.info;
                if (this.compress)
                    r.compress = this.compress;
                if (this.userPassword)
                    r.userPassword = this.userPassword;
                if (this.ownerPassword)
                    r.ownerPassword = this.ownerPassword;
                if (this.permissions)
                    r.permissions = this.permissions;
                if (this.images) {
                    r.images = this.images;
                }
                Object.assign(r, this["otherProperties"]);
                //delete r.data;
                return r;
            }
        }
    };
    exports.ReportDesign = ReportDesign;
    __decorate([
        (0, Property_3.$Property)(),
        __metadata("design:type", Boolean)
    ], ReportDesign.prototype, "compress", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "To enable encryption set user password in userPassword (string value). The PDF file will be encrypted when a user password is provided, and users will be prompted to enter the password to decrypt the file when opening it." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "userPassword", void 0);
    __decorate([
        (0, Property_3.$Property)({ description: "To set access privileges for the PDF file, you need to provide an owner password in ownerPassword (string value) and object permissions with permissions. By default, all operations are disallowed. You need to explicitly allow certain operations." }),
        __metadata("design:type", String)
    ], ReportDesign.prototype, "ownerPassword", void 0);
    __decorate([
        (0, Property_3.$Property)({ type: "json", componentType: "jassijs_report.InfoProperties" }),
        __metadata("design:type", InfoProperties)
    ], ReportDesign.prototype, "info", void 0);
    __decorate([
        (0, Property_3.$Property)({ type: "json", componentType: "jassijs_report.PermissionProperties" }),
        __metadata("design:type", PermissionProperties)
    ], ReportDesign.prototype, "permissions", void 0);
    __decorate([
        (0, Property_3.$Property)({ type: "number[]", default: [40, 40, 40, 40], description: "margin of the page: left, top, right, bottom" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ReportDesign.prototype, "pageMargins", null);
    __decorate([
        (0, Property_3.$Property)({ description: "the size of the page", default: "A4", chooseFrom: ['4A0', '2A0', 'A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'RA0', 'RA1', 'RA2', 'RA3', 'RA4', 'SRA0', 'SRA1', 'SRA2', 'SRA3', 'SRA4', 'EXECUTIVE', 'FOLIO', 'LEGAL', 'LETTER', 'TABLOID'] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageSize", null);
    __decorate([
        (0, Property_3.$Property)({ chooseFrom: ['landscape', 'portrait'], default: "portrait", description: "the orientation of the page landscape or portrait" }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ReportDesign.prototype, "pageOrientation", null);
    exports.ReportDesign = ReportDesign = ReportDesign_3 = __decorate([
        (0, RComponent_4.$ReportComponent)({ fullPath: undefined, icon: undefined, editableChildComponents: ["this", "this.backgroundPanel", "this.headerPanel", "this.contentPanel", "this.footerPanel"] }),
        (0, Registry_11.$Class)("jassijs_report.ReportDesign"),
        (0, Property_3.$Property)({ hideBaseClassProperties: true }),
        __metadata("design:paramtypes", [Object])
    ], ReportDesign);
    //jassijs.myRequire(modul.css["jassijs_report.css"]);
    async function test() {
    }
});
define("jassijs_report/Reports", ["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Classes", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, ContextMenu_1, Table_1, Registry_12, Panel_4, Router_1, Classes_4, Actions_2, Windows_2) {
    "use strict";
    var Reports_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Reports = void 0;
    exports.test = test;
    Registry_12 = __importStar(Registry_12);
    Windows_2 = __importDefault(Windows_2);
    let Reports = Reports_1 = class Reports extends Panel_4.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.table = new Table_1.Table();
            me.contextmenu = new ContextMenu_1.ContextMenu();
            this.config({
                children: [
                    me.table.config({
                        width: "100%",
                        //height: "100%",
                        showSearchbox: true,
                        contextMenu: me.contextmenu
                    }),
                    me.contextmenu.config({})
                ],
            });
            this.setData();
            me.contextmenu.getActions = async function (obs) {
                var ret = [];
                ret.push({
                    name: "View", call: async function (data) {
                        var clname = data[0].classname;
                        var Cl = await Classes_4.classes.loadClass(clname);
                        var report = new Cl();
                        report.view();
                        //await (<Report> new Cl()).open();
                    }
                });
                ret.push({
                    name: "Reportdesign", call: function (data) {
                        var file = data[0].filename;
                        Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                    }
                });
                if (obs[0].serverPath) {
                    ret.push({
                        name: "Reportdesign (Server)", call: function (data) {
                            var file = "$serverside/" + data[0].serverPath + ".ts";
                            Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                        }
                    });
                }
                return ret;
            };
        }
        async setData() {
            var data = [];
            var _this = this;
            var reports = await Registry_12.default.getJSONData("$Report");
            for (var x = 0; x < reports.length; x++) {
                var rep = reports[x];
                var entry = {
                    name: rep.params[0].name,
                    classname: rep.classname,
                    serverPath: rep.params[0].serverReportPath,
                    filename: rep.filename
                };
                data.push(entry);
            }
            setTimeout(() => {
                _this.me.table.items = data;
            }, 100);
        }
        static async show() {
            Windows_2.default.add(new Reports_1(), "Reports");
        }
    };
    exports.Reports = Reports;
    __decorate([
        (0, Actions_2.$Action)({
            name: "Tools/Reports",
            icon: "mdi mdi-chart-box-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], Reports, "show", null);
    exports.Reports = Reports = Reports_1 = __decorate([
        (0, Actions_2.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_12.$Class)("jassijs_report/Reports"),
        __metadata("design:paramtypes", [])
    ], Reports);
    class ReportEntry {
    }
    async function test() {
        var ret = new Reports();
        return ret;
    }
});
define("jassijs_report/ReportViewer", ["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_report/PDFViewer", "jassijs/ui/PropertyEditor", "jassijs/ui/ComponentDescriptor", "jassijs_report/test/ServerReport"], function (require, exports, BoxPanel_3, Registry_13, Panel_5, PDFViewer_3, PropertyEditor_2, ComponentDescriptor_1, ServerReport_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReportViewer = void 0;
    exports.test = test;
    let ReportViewer = class ReportViewer extends Panel_5.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        set value(val) {
            this._value = val;
            var test = ComponentDescriptor_1.ComponentDescriptor.describe(val.constructor);
            this.me.propertyeditor.value = val;
            /*  for (var x = 0; x < test.fields.length; x++) {
                  var field = test.fields[x];
                  if (field.name === "parameter") {
                      var paramtype = field.componentType;
                      var Cl = classes.getClass(paramtype);
                      this.param = new Cl();
                      this.me.propertyeditor.value = this.param;
      
                  }
              }*/
            this.me.pdfviewer.report = val;
            val.getBase64().then((data) => {
                this.me.pdfviewer.value = data;
            });
            //ClientReportParameter();
        }
        layout(me) {
            var _this = this;
            me.boxpanel = new BoxPanel_3.BoxPanel();
            me.pdfviewer = new PDFViewer_3.PDFViewer();
            me.propertyeditor = new PropertyEditor_2.PropertyEditor();
            this.config({
                children: [
                    me.boxpanel.config({
                        horizontal: true,
                        children: [
                            me.pdfviewer.config({}),
                            me.propertyeditor.config({})
                        ],
                        spliter: [80, 20]
                    })
                ]
            });
            me.propertyeditor.onpropertyChanged(() => {
                var param = me.propertyeditor.value;
                //_this._value.parameter = param;
                _this._value.getBase64().then((data) => {
                    _this.me.pdfviewer.value = data;
                });
            });
        }
    };
    exports.ReportViewer = ReportViewer;
    exports.ReportViewer = ReportViewer = __decorate([
        (0, Registry_13.$Class)("jassijs_report/ReportViewer"),
        __metadata("design:paramtypes", [])
    ], ReportViewer);
    async function test() {
        var ret = new ReportViewer();
        ret.value = new ServerReport_4.ServerReport();
        return ret;
    }
});
define("jassijs_report/RGroupTablerow", ["require", "exports", "jassijs_report/RTablerow", "jassijs/remote/Registry", "jassijs/ui/Property"], function (require, exports, RTablerow_2, Registry_14, Property_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RGroupTablerow = void 0;
    //@$ReportComponent({ editableChildComponents: ["this"] })
    let RGroupTablerow = class RGroupTablerow extends RTablerow_2.RTablerow {
        get expression() {
            var _a, _b, _c;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return undefined;
            return (_c = this.parent) === null || _c === void 0 ? void 0 : _c.groupExpression[pos];
        }
        set expression(value) {
            var _a, _b;
            var pos = (_a = this.parent) === null || _a === void 0 ? void 0 : _a.groupFooterPanel.indexOf(this);
            if (pos === -1)
                pos = (_b = this.parent) === null || _b === void 0 ? void 0 : _b.groupHeaderPanel.indexOf(this);
            if (pos === -1)
                return;
            this.parent.groupExpression[pos] = value;
        }
        get _editorselectthis() {
            return this;
        }
    };
    exports.RGroupTablerow = RGroupTablerow;
    __decorate([
        (0, Property_4.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RGroupTablerow.prototype, "expression", null);
    exports.RGroupTablerow = RGroupTablerow = __decorate([
        (0, Registry_14.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
    ], RGroupTablerow);
});
define("jassijs_report/RImage", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs_report/RComponent"], function (require, exports, Registry_15, Property_5, RComponent_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RImage = void 0;
    //mdi-format-list-numbered
    let RImage = class RImage extends RComponent_5.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "image";
            this._image = "";
            this.domWrapper.classList.remove("jcontainer");
            delete this._components;
        }
        render() {
            return React.createElement("img", { className: "RImage" });
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            //do nothing
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            //do nothing
        }
        set image(value) {
            this._image = value;
            if (value === undefined)
                this.dom.setAttribute("src", "");
            else {
                //later we have a parent
                var report = RComponent_5.RComponent.findReport(this);
                var _this = this;
                if (report === undefined) {
                    if (_this["nextTry"] === undefined) { //deny recurse
                        setTimeout(() => {
                            _this["nextTry"] = true;
                            _this.image = value;
                        }, 200);
                    }
                    else {
                        delete _this["nextTry"];
                    }
                }
                else {
                    var im = report.images;
                    if (im !== undefined && im[value] !== undefined) {
                        this.dom.setAttribute("src", im[value]);
                    }
                    else {
                        this.dom.setAttribute("src", value);
                    }
                }
            }
        }
        get image() {
            return this._image;
        }
        set fit(value) {
            this._fit = value;
            if (value === undefined) {
                this.__dom.style["object-fit"] = "";
                this.width = this.width;
                this.height = this.height;
            }
            else {
                this.__dom.style["object-fit"] = "contain";
                this.__dom.style.width = value[0].toString();
                this.__dom.style.height = value[1].toString();
            }
        }
        get fit() {
            return this._fit;
        }
        set opacity(value) {
            this._opacity = value;
            if (value === undefined) {
                this.__dom.style.opacity = "";
            }
            else {
                this.__dom.style.opacity = value.toString();
            }
        }
        get opacity() {
            return this._opacity;
        }
        toJSON() {
            var ret = super.toJSON();
            if (this.fit) {
                ret.fit = this.fit;
            }
            if (this.opacity) {
                ret.opacity = this.opacity;
            }
            //if (this.image)
            ret.image = this.image;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            if (ob.fit) {
                ret.fit = ob.fit;
                delete ob.fit;
            }
            if (ob.opacity) {
                ret.opacity = ob.opacity;
                delete ob.opacity;
            }
            //if (ob.image)
            ret.image = ob.image;
            delete ob.image;
            super.fromJSON(ob);
            return ret;
        }
    };
    exports.RImage = RImage;
    __decorate([
        (0, Property_5.$Property)({
            type: "rimage",
            chooseFrom: (data) => {
                debugger;
                return [];
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RImage.prototype, "image", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number[]", decription: "fit in rectangle width, height e.g. 10,20" }),
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], RImage.prototype, "fit", null);
    __decorate([
        (0, Property_5.$Property)({ type: "number" }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], RImage.prototype, "opacity", null);
    exports.RImage = RImage = __decorate([
        (0, RComponent_5.$ReportComponent)({ fullPath: "report/Image", icon: "mdi mdi-image-frame" }),
        (0, Registry_15.$Class)("jassijs_report.RImage")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RImage);
});
define("jassijs_report/RImageEditor", ["require", "exports", "jassijs/ui/Upload", "jassijs/ui/Textbox", "jassijs/ui/Image", "jassijs/ui/Button", "jassijs/ui/Repeater", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/PropertyEditors/Editor", "jassijs_report/RComponent", "jassijs/ext/jquerylib"], function (require, exports, Upload_1, Textbox_1, Image_1, Button_2, Repeater_1, Registry_16, Panel_6, Editor_1, RComponent_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RImageChooser = exports.RImageEditor = void 0;
    exports.test = test;
    let RImageEditor = class RImageEditor extends Editor_1.Editor {
        /**
         * Checkbox Editor for boolean values
         * used by PropertyEditor
         * @class jassijs.ui.PropertyEditors.BooleanEditor
         */
        constructor(property, propertyEditor) {
            super(property, propertyEditor);
            /** @member - the renedering component **/
            this.component = new Panel_6.Panel( /*{useSpan:true}*/);
            this._button = new Button_2.Button();
            this._textbox = new Textbox_1.Textbox();
            this._textbox.width = "calc(100% - 34px)";
            this.component.height = 24;
            this._button.icon = "mdi mdi-glasses";
            this.component.add(this._textbox);
            this.component.add(this._button);
            var _this = this;
            this._textbox.onchange(function (param) {
                _this._onchange(param);
            });
            this._button.onclick(() => {
                _this.showDialog();
            });
        }
        /**
         * @member {object} ob - the object which is edited
         */
        set ob(ob) {
            super.ob = ob;
            //databinder,"prop"
            var value = this.propertyEditor.getPropertyValue(this.property);
            if (value === null || value === void 0 ? void 0 : value.startsWith('"'))
                value = value.substring(1);
            if (value === null || value === void 0 ? void 0 : value.endsWith('"')) {
                value = value.substring(0, value.length - 1);
            }
            this._textbox.value = value;
        }
        get ob() {
            return this._ob;
        }
        /**
       * get the renderer for the PropertyEditor
       * @returns - the UI-component for the editor
       */
        getComponent() {
            return this.component;
        }
        /**
        * intern the value changes
        * @param {type} param
        */
        _onchange(param = undefined) {
            var val = this._textbox.value;
            if (this.property) {
                this.propertyEditor.setPropertyInCode(this.property.name, '"' + val + '"');
                this.propertyEditor.setPropertyInDesign(this.property.name, val);
            }
            super.callEvent("edit", param);
        }
        async showDialog(onlytest = undefined) {
            var _this = this;
            if (!this.dialog) {
                this.dialog = new RImageChooser();
                var image = this.ob;
                var report = RComponent_6.RComponent.findReport(image);
                if (report === null || report === void 0 ? void 0 : report.images)
                    this.dialog.items = report.images;
                $(this.dialog.__dom).dialog({ height: "400", width: "400",
                    close: () => {
                        if (report)
                            report.images = _this.dialog.items;
                        _this._onchange();
                    } });
                this.dialog.onpictureselected((val) => {
                    _this._textbox.value = val;
                    if (report)
                        report.images = _this.dialog.items;
                    _this._onchange();
                    $(this.dialog.__dom).dialog("close");
                });
            }
            else {
                $(this.dialog.__dom).dialog("open");
            }
        }
    };
    exports.RImageEditor = RImageEditor;
    exports.RImageEditor = RImageEditor = __decorate([
        (0, Editor_1.$PropertyEditor)(["rimage"]),
        (0, Registry_16.$Class)("jassi_report/RImagePropertyEditor"),
        __metadata("design:paramtypes", [Object, Object])
    ], RImageEditor);
    class RImageChooser extends Panel_6.Panel {
        constructor() {
            super();
            this._items = [];
            this.me = {};
            this.layout(this.me);
        }
        set items(val) {
            this._items.splice(0, this._items.length);
            for (var key in val) {
                this._items.push({ name: key, data: val[key] });
            }
            this.me.repeater1.value = this._items;
        }
        get items() {
            var ret = {};
            for (var x = 0; x < this._items.length; x++) {
                ret[this._items[x].name] = this._items[x].data;
            }
            return ret;
        }
        onpictureselected(func) {
            this.addEvent("pictureselected", func);
        }
        layout(me) {
            var _this = this;
            me.repeater1 = new Repeater_1.Repeater();
            me.databinder1 = new Databinder();
            me.databinder1.value = this;
            me.repeater1.value = this._items;
            me.upload1 = new Upload_1.Upload();
            me.upload1.onuploaded((data) => {
                for (var key in data) {
                    _this._items.push({ name: key.split(".")[0], data: data[key] });
                }
                _this.items = _this.items;
            });
            me.upload1.readAs = "DataUrl";
            this.add(me.upload1);
            this.add(me.repeater1);
            me.repeater1.createRepeatingComponent(function (me) {
                me.panel1 = new Panel_6.Panel();
                me.image1 = new Image_1.Image();
                me.itile = new Textbox_1.Textbox();
                me.remove = new Button_2.Button();
                me.repeater1.design.add(me.panel1);
                me.panel1.add(me.itile);
                me.panel1.add(me.remove);
                me.panel1.add(me.image1);
                me.image1.height = "75";
                me.remove.text = "";
                me.remove.icon = "mdi mdi-delete-forever-outline";
                me.itile.bind = [me.repeater1.design.databinder, "name"];
                me.itile.onchange(function (event) {
                    var ob = me.itile._databinder.value;
                    ob.name = me.itile.value;
                    _this.items = _this.items;
                });
                me.image1.bind = [me.repeater1.design.databinder, "data"];
                me.remove.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    let pos = _this._items.indexOf(ob);
                    _this._items.splice(pos, 1);
                    _this.items = _this.items;
                });
                me.image1.onclick(function (event) {
                    var ob = me.itile._databinder.value;
                    _this.value = ob.name;
                    _this.callEvent("pictureselected", ob.name);
                });
            });
        }
    }
    exports.RImageChooser = RImageChooser;
    async function test() {
        var ret = new RImageChooser();
        return ret;
    }
});
define("jassijs_report/ROList", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_17, Component_3, Property_6, ReportDesign_4, RComponent_7) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ROList = void 0;
    //Limitations not implemented: separator,markerColor, counter is counting also the next elements
    let ROList = class ROList extends RComponent_7.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ol";
        }
        render() {
            return React.createElement("ol", { className: "ROList" });
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                this.dom.style["list-style-type"] = "";
            else
                this.dom.style["list-style-type"] = value;
        }
        get type() {
            return this._type;
        }
        set reversed(value) {
            this._reversed = value;
            if (this._reversed)
                this.__dom.setAttribute("reversed", "");
            else
                this.__dom.removeAttribute("reversed");
        }
        get reversed() {
            return this._reversed;
        }
        set start(value) {
            this._start = value;
            this.__dom.setAttribute("start", value.toString());
        }
        get start() {
            return this._start;
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_3.Component.replaceWrapper(component, document.createElement("li"));
            if (component._counter)
                component.counter = component._counter;
            if (component.listType !== undefined)
                component.listType = component._listType;
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_3.Component.replaceWrapper(component, document.createElement("li"));
            if (component.listType !== undefined)
                component.listType = component._listType;
            if (component._counter)
                component.counter = component._counter;
            super.add(component);
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ol = [];
            if (this.reversed)
                ret.reversed = true;
            if (this.start)
                ret.start = this.start;
            if (this.type)
                ret.type = this.type;
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                ret.ol.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ol;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_4.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ol;
            if (ob.reversed)
                ret.reversed = ob.reversed;
            delete ob.reversed;
            if (ob.start)
                ret.start = ob.start;
            delete ob.start;
            if (ob.type)
                ret.type = ob.type;
            delete ob.type;
            super.fromJSON(ob);
            return ret;
        }
    };
    exports.ROList = ROList;
    __decorate([
        (0, Property_6.$Property)({ chooseFrom: ["lower-alpha", "upper-alpha", "lower-roman", "upper-roman", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ROList.prototype, "type", null);
    __decorate([
        (0, Property_6.$Property)({ default: false }),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ROList.prototype, "reversed", null);
    __decorate([
        (0, Property_6.$Property)({ default: 1 }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], ROList.prototype, "start", null);
    exports.ROList = ROList = __decorate([
        (0, RComponent_7.$ReportComponent)({ fullPath: "report/Ordered List", icon: "mdi mdi-format-list-numbered", editableChildComponents: ["this"] }),
        (0, Registry_17.$Class)("jassijs_report.ROList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], ROList);
});
define("jassijs_report/RStack", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_18, Property_7, ReportDesign_5, RComponent_8) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStack = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStack = class RStack extends RComponent_8.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "stack";
            this.dom.style["flex-direction"] = "column";
            this.dom.classList.add("designerNoResizable");
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            super.add(component);
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._designMode = action.componentDesignerSetDesignMode.enable;
            }
            super.extensionCalled(action);
            return undefined;
        }
        toJSON() {
            var ret = super.toJSON();
            ret.stack = [];
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                ret.stack.push(this._components[x].toJSON());
            }
            var test = 0;
            for (var key in ret) {
                test++;
            }
            if (test === 1)
                ret = ret.stack; //short version
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob;
            if (ob.stack)
                arr = ob.stack;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_5.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.stack;
            if (!Array.isArray(ob))
                super.fromJSON(ob);
            return ret;
        }
    };
    exports.RStack = RStack;
    exports.RStack = RStack = __decorate([
        (0, RComponent_8.$ReportComponent)({ fullPath: "report/Stack", icon: "mdi mdi-view-sequential-outline", editableChildComponents: ["this"] }),
        (0, Registry_18.$Class)("jassijs_report.RStack")
        //@$Property({name:"horizontal",hide:true})
        ,
        (0, Property_7.$Property)({ name: "children", type: "jassijs_report.RComponent" }),
        __metadata("design:paramtypes", [Object])
    ], RStack);
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RStyle", ["require", "exports", "jassijs_report/RComponent", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/Classes"], function (require, exports, RComponent_9, Registry_19, Property_8, Classes_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RStyle = void 0;
    exports.test = test;
    //@$UIComponent({editableChildComponents:["this"]})
    let RStyle = class RStyle extends RComponent_9.RComponent {
        set name(value) {
            var old = this._name;
            this._name = value;
            if (this.activeComponentDesigner) {
                if (old) { //remove old
                    var all = this.activeComponentDesigner.variables.value;
                    for (let x = 0; x < all.length; x++) {
                        if (all[x].name === old) {
                            all.splice(x, 1);
                            this.activeComponentDesigner.variables.value = all;
                            break;
                        }
                    }
                    this.activeComponentDesigner.variables.addVariable(value, this, true);
                    this.activeComponentDesigner.resize();
                }
            }
        }
        addToParent(suggestedparent) {
            if (suggestedparent === undefined)
                throw new Classes_5.JassiError("suggestedparent is undefined");
            if (suggestedparent.reporttype === "report") {
                suggestedparent.styleContainer.add(this);
                return;
            }
            this.addToParent(suggestedparent._parent);
        }
        get name() {
            return this._name;
        }
        constructor(properties = undefined) {
            super(properties);
            this.$isInivisibleComponent = true; //invisible component in designer
            this.reporttype = "style";
            var _this = this;
            this.onstylechanged((param1, param2) => {
                _this.update();
            });
        }
        toJSON() {
            var ret = super.toJSON();
            return ret;
        }
        update() {
            var style = document.getElementById(this.styleid);
            if (!document.getElementById(this.styleid)) {
                style = RComponent_9.RComponent.createHTMLElement('<style id=' + this.styleid + '></style>');
                document.head.appendChild(style);
            }
            var prop = {};
            var sstyle = "\t." + this.styleid + "{\n";
            sstyle += this.dom.style.cssText;
            sstyle = sstyle + "\t}\n";
            style.innerHTML = sstyle;
        }
        fromJSON(ob) {
            var ret = this;
            super.fromJSON(ob);
            //delete ob.stack;
            return ret;
        }
        //this.dom.style.cssText
        get styleid() {
            return "jassistyle" + this._id;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this.activeComponentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                return this._setDesignMode(action.componentDesignerSetDesignMode.enable);
            }
            super.extensionCalled(action);
        }
    };
    exports.RStyle = RStyle;
    __decorate([
        (0, Property_8.$Property)(),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RStyle.prototype, "name", null);
    exports.RStyle = RStyle = __decorate([
        (0, RComponent_9.$ReportComponent)({ fullPath: "report/Style", icon: "mdi mdi-virus-outline", editableChildComponents: ["this"] }),
        (0, Registry_19.$Class)("jassijs_report.RStyle")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RStyle);
    function test() {
        var n = new RStyle();
        var hh = Object.getOwnPropertyDescriptor(n, "name");
    }
});
define("jassijs_report/RTable", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/RText", "jassijs/util/Tools", "jassijs_report/RComponent", "jassijs_report/RTablerow", "jassijs/ui/Property", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Button", "jassijs/util/Runlater", "jassijs_report/RTableLayouts"], function (require, exports, Registry_20, RText_3, Tools_3, RComponent_10, RTablerow_3, Property_9, ContextMenu_2, MenuItem_1, Button_3, Runlater_1, RTableLayouts_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTable = void 0;
    exports.test = test;
    var allLayouts = Object.keys(RTableLayouts_1.tableLayouts);
    //@$UIComponent({editableChildComponents:["this"]})
    //@$Property({name:"horizontal",hide:true})
    let RTable = class RTable extends RComponent_10.RComponent {
        /**
    *
    * @param {object} properties - properties to init
    * @param {string} [properties.id] -  connect to existing id (not reqired)
    * @param {boolean} [properties.useSpan] -  use span not div
    *
    */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "table";
            // bodyPanel: RTablerow[] = [new RTablerow()];
            this.insertEmptyCells = true;
            this.widths = [];
            this.heights = [];
            //super.init("<table  style='border-spacing:0px;min-width:50px;table-layout: fixed'></table>");
            this.updater = new Runlater_1.Runlater(() => {
                _this.updateLayout(false);
            }, 100);
            let tr = new RTablerow_3.RTablerow();
            tr.parent = this;
            this.add(tr);
            this.dom.classList.add("designerNoResizable");
            this.initContextMenu(properties === null || properties === void 0 ? void 0 : properties.isdatatable);
            var _this = this;
            this.initKeys();
        }
        render() {
            return React.createElement("table", { style: { border_spacing: "0px", min_width: "50px", table_layout: "fixed" } });
        }
        componentDidMount() {
        }
        initKeys() {
            var _this = this;
            this.on("keydown", (evt) => {
                var _a, _b, _c;
                if (evt.key === "Tab") { //Tabelle erweitern?
                    if (((_b = (_a = evt.target) === null || _a === void 0 ? void 0 : _a._this) === null || _b === void 0 ? void 0 : _b.reporttype) === "text" && this.reporttype === "table") {
                        var rt = (_c = evt.target) === null || _c === void 0 ? void 0 : _c._this;
                        if (rt._parent._components.indexOf(rt) === rt._parent._components.length - 2) { //last row
                            if (rt._parent.parent._components.indexOf(rt._parent) + 1 === rt._parent.parent._components.length) { //lastline
                                var row = new RTablerow_3.RTablerow();
                                row.parent = this;
                                _this.add(row);
                                var cell = new RText_3.RText();
                                row.add(cell);
                                _this._componentDesigner.editDialog(true);
                                _this.addEmptyCellsIfNeeded(_this._components[0]);
                                _this._componentDesigner.editDialog(true);
                                evt.preventDefault();
                                setTimeout(() => {
                                    cell.dom.focus();
                                }, 100);
                            }
                        }
                    }
                }
            });
        }
        getInfoFromEvent(evt) {
            var ret = {};
            ret.cell = this.contextMenu.target.parentNode._this;
            ret.tableRow = ret.cell.parent;
            ret.column = ret.tableRow._components.indexOf(ret.cell);
            ret.row = this._components.indexOf(ret.tableRow);
            return ret;
        }
        async initContextMenu(isDatatable) {
            var _this = this;
            this.contextMenu = new ContextMenu_2.ContextMenu();
            this.contextMenu._isNotEditableInDesigner = true;
            this.contextMenu.menu.dom.style["font-family"] = "Roboto";
            this.contextMenu.menu.dom.style["font-size"] = "12px";
            this.contextMenu.menu._setDesignMode = (nothing) => { }; //should net be editable in designer
            if (isDatatable !== true) {
                var insertRowBefore = new MenuItem_1.MenuItem();
                //@ts-ignore
                insertRowBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                insertRowBefore.items._setDesignMode = (nothing) => { };
                insertRowBefore.text = "insert row before";
                insertRowBefore.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    var newRow = new RTablerow_3.RTablerow();
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.splice(info.row, 0, "auto");
                    newRow.parent = _this;
                    _this.addBefore(newRow, _this._components[info.row]);
                    newRow.add(new RText_3.RText());
                    //@ts-ignore
                    newRow._setDesignMode(true);
                    _this.fillTableRow(newRow, info.tableRow._components.length);
                    _this._componentDesigner.editDialog(true);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(insertRowBefore);
                var insertRowAfter = new MenuItem_1.MenuItem();
                //@ts-ignore
                insertRowAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                insertRowAfter.items._setDesignMode = (nothing) => { };
                insertRowAfter.text = "insert row after";
                insertRowAfter.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    var newRow = new RTablerow_3.RTablerow();
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.splice(info.row + 1, 0, "auto");
                    newRow.parent = _this;
                    if (_this._components.length === info.row + 1)
                        _this.add(newRow);
                    else
                        _this.addBefore(newRow, _this._components[info.row + 1]);
                    newRow.add(new RText_3.RText());
                    //@ts-ignore
                    newRow._setDesignMode(true);
                    _this.fillTableRow(newRow, info.tableRow._components.length);
                    _this._componentDesigner.editDialog(true);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(insertRowAfter);
            }
            var insertColumnBefore = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnBefore._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnBefore.items._setDesignMode = (nothing) => { };
            insertColumnBefore.text = "insert column before";
            insertColumnBefore.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_3.RText();
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.splice(info.column, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    if (_this._components[x]._components.length > 1)
                        _this._components[x].addBefore(new RText_3.RText(), _this._components[x]._components[info.column]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnBefore);
            var insertColumnAfter = new MenuItem_1.MenuItem();
            //@ts-ignore
            insertColumnAfter._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            insertColumnAfter.items._setDesignMode = (nothing) => { };
            insertColumnAfter.text = "insert column after";
            insertColumnAfter.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                var newCell = new RText_3.RText();
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.splice(info.column + 1, 0, "auto");
                _this.insertEmptyCells = false;
                for (var x = 0; x < _this._components.length; x++) {
                    if (_this._components[x]._components.length > 1)
                        _this._components[x].addBefore(new RText_3.RText(), _this._components[x]._components[info.column + 1]);
                }
                _this.insertEmptyCells = true;
                _this._componentDesigner.editDialog(true);
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(insertColumnAfter);
            var removeColumn = new MenuItem_1.MenuItem();
            //@ts-ignore
            removeColumn._setDesignMode = (nothing) => { }; //should net be editable in designer
            //@ts-ignore
            removeColumn.items._setDesignMode = (nothing) => { };
            removeColumn.text = "delete column";
            removeColumn.onclick((evt) => {
                var info = _this.getInfoFromEvent(evt);
                if (_this.widths && _this.widths.length > 0)
                    _this.widths.slice(info.column, 0);
                for (var x = 0; x < _this._components.length; x++) {
                    var tr = _this._components[x];
                    if (tr._components.length > 1)
                        tr.remove(tr._components[info.column], true);
                }
                _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
            });
            this.contextMenu.menu.add(removeColumn);
            if (isDatatable !== true) {
                var removeRow = new MenuItem_1.MenuItem();
                //@ts-ignore
                removeRow._setDesignMode = (nothing) => { }; //should net be editable in designer
                //@ts-ignore
                removeRow.items._setDesignMode = (nothing) => { };
                removeRow.text = "delete row";
                removeRow.onclick((evt) => {
                    var info = _this.getInfoFromEvent(evt);
                    if (_this.heights && Array.isArray(_this.heights))
                        _this.heights.slice(info.row, 0);
                    _this.remove(_this._components[info.row]);
                    _this._componentDesigner._propertyEditor.callEvent("propertyChanged", {});
                });
                this.contextMenu.menu.add(removeRow);
            }
            var copyMenu = new Button_3.Button();
            copyMenu.dom.style["font-family"] = "Roboto";
            copyMenu.dom.style["font-size"] = "12px";
            copyMenu.text = "copy";
            copyMenu.width = "100%";
            copyMenu.dom.classList.remove("jinlinecomponent");
            let func = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.writeText(edi.selection.getContent());
                _this.contextMenu.close();
            };
            copyMenu.onclick(func);
            this.contextMenu.menu.add(copyMenu);
            var pasteMenu = new Button_3.Button();
            pasteMenu.dom.style["font-family"] = "Roboto";
            pasteMenu.dom.style["font-size"] = "12px";
            pasteMenu.text = "paste";
            pasteMenu.width = "100%";
            pasteMenu.dom.classList.remove("jinlinecomponent");
            let func2 = function (evt) {
                var info = _this.getInfoFromEvent(evt);
                //@ts-ignore
                var edi = tinymce.editors[info.cell._id];
                navigator.clipboard.readText().then((data) => {
                    edi.selection.setContent(data);
                });
            };
            pasteMenu.onclick(func2);
            this.contextMenu.menu.add(pasteMenu);
        }
        add(component) {
            super.add(component);
            this.updateLayout(true);
        }
        updateLayout(doitlater = false) {
            if (doitlater) {
                this.updater.runlater();
                return;
            }
            this.doTableLayout();
        }
        correctHideAfterSpan() {
            //rowspan
            var span;
            var hiddenCells = {};
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var cell = row._components[c];
                    if (cell["colSpan"]) {
                        span = Number.parseInt(cell["colSpan"]);
                        for (var x = c + 1; x < c + span; x++) {
                            hiddenCells[r + ":" + x] = true;
                        }
                    }
                    if (cell["rowSpan"]) {
                        span = Number.parseInt(cell["rowSpan"]);
                        for (var x = r + 1; x < r + span; x++) {
                            hiddenCells[x + ":" + c] = true;
                        }
                    }
                    if (hiddenCells[r + ":" + c] === true) {
                        cell.domWrapper.classList.add("invisibleAfterSpan");
                    }
                    else {
                        cell.domWrapper.classList.remove("invisibleAfterSpan");
                    }
                }
            }
        }
        doTableLayout() {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
            this.correctHideAfterSpan();
            var tab = this.toJSON();
            if (tab.table === undefined)
                tab.table = tab.datatable;
            if (tab.table.widths === undefined)
                tab.table.widths = [];
            while (this._components[0]._components.length > tab.table.widths.length) {
                tab.table.widths.push("auto"); //designer dummy
            }
            if (tab.table.heights === undefined)
                tab.table.heights = [];
            while (this._components.length - 1 > tab.table.widths.length) {
                tab.table.widths.push("auto"); //designer dummy
            }
            for (var r = 0; r < this._components.length; r++) {
                var row = this._components[r];
                for (var c = 0; c < row._components.length; c++) {
                    var cssid = ["RColumn"];
                    var css = {};
                    var cell = row._components[c];
                    if (this.heights) {
                        var val;
                        if (Number.isInteger(this.heights)) {
                            val = this.heights;
                        }
                        else if (typeof (this.heights) === "function") {
                            //@ts-ignore
                            val = this.heights(r);
                        }
                        else
                            val = this.heights[r];
                        row._components[c].dom.style.height = Number.isInteger(val) ? val + "px" : val;
                    }
                    var v = null;
                    if ((_a = this.layout) === null || _a === void 0 ? void 0 : _a.fillColor) {
                        v = (_b = this.layout) === null || _b === void 0 ? void 0 : _b.fillColor(r, tab, c);
                    }
                    if (v === null)
                        v = "initial";
                    css.ContainerProperties = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_c = this.layout) === null || _c === void 0 ? void 0 : _c.hLineWidth) {
                        v = (_d = this.layout) === null || _d === void 0 ? void 0 : _d.hLineWidth(r, tab, c);
                    }
                    css.border_top_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_e = this.layout) === null || _e === void 0 ? void 0 : _e.hLineWidth) {
                        v = (_f = this.layout) === null || _f === void 0 ? void 0 : _f.hLineWidth(r + 1, tab, c);
                    }
                    css.border_bottom_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_g = this.layout) === null || _g === void 0 ? void 0 : _g.vLineWidth) {
                        v = (_h = this.layout) === null || _h === void 0 ? void 0 : _h.vLineWidth(c, tab, r);
                    }
                    css.border_left_width = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_j = this.layout) === null || _j === void 0 ? void 0 : _j.vLineWidth) {
                        v = (_k = this.layout) === null || _k === void 0 ? void 0 : _k.vLineWidth(c + 1, tab, r);
                    }
                    css.border_right_width = v + "px";
                    cssid.push(v);
                    v = "black";
                    css.border_top_style = (this.layout === "noBorders" || ((_l = this.layout) === null || _l === void 0 ? void 0 : _l.defaultBorder) === false) ? "none" : "solid";
                    css.border_bottom_style = (this.layout === "noBorders" || ((_m = this.layout) === null || _m === void 0 ? void 0 : _m.defaultBorder) === false) ? "none" : "solid";
                    css.border_left_style = (this.layout === "noBorders" || ((_o = this.layout) === null || _o === void 0 ? void 0 : _o.defaultBorder) === false) ? "none" : "solid";
                    css.border_right_style = (this.layout === "noBorders" || ((_p = this.layout) === null || _p === void 0 ? void 0 : _p.defaultBorder) === false) ? "none" : "solid";
                    cssid.push(css.border_top_style);
                    cssid.push(css.border_bottom_style);
                    cssid.push(css.border_left_style);
                    cssid.push(css.border_right_style);
                    if ((_q = this.layout) === null || _q === void 0 ? void 0 : _q.hLineColor) {
                        v = (_r = this.layout) === null || _r === void 0 ? void 0 : _r.hLineColor(r, tab, c);
                    }
                    css.border_top_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_s = this.layout) === null || _s === void 0 ? void 0 : _s.hLineColor) {
                        v = (_t = this.layout) === null || _t === void 0 ? void 0 : _t.hLineColor(r + 1, tab, c);
                    }
                    css.border_bottom_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_u = this.layout) === null || _u === void 0 ? void 0 : _u.vLineColor) {
                        v = (_v = this.layout) === null || _v === void 0 ? void 0 : _v.vLineColor(c, tab, r);
                    }
                    css.border_left_color = v;
                    cssid.push(v.replace("#", ""));
                    v = "black";
                    if ((_w = this.layout) === null || _w === void 0 ? void 0 : _w.vLineColor) {
                        v = (_x = this.layout) === null || _x === void 0 ? void 0 : _x.vLineColor(c + 1, tab, r);
                    }
                    css.border_right_color = v;
                    cssid.push(v.replace("#", ""));
                    v = 1;
                    if ((_y = this.layout) === null || _y === void 0 ? void 0 : _y.paddingLeft) {
                        v = (_z = this.layout) === null || _z === void 0 ? void 0 : _z.paddingLeft(c + 1, tab, r);
                    }
                    css.padding_left = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_0 = this.layout) === null || _0 === void 0 ? void 0 : _0.paddingRight) {
                        v = (_1 = this.layout) === null || _1 === void 0 ? void 0 : _1.paddingRight(c + 1, tab, r);
                    }
                    css.padding_right = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_2 = this.layout) === null || _2 === void 0 ? void 0 : _2.paddingTop) {
                        v = (_3 = this.layout) === null || _3 === void 0 ? void 0 : _3.paddingTop(r + 1, tab, c);
                    }
                    css.padding_top = v + "px";
                    cssid.push(v);
                    v = 1;
                    if ((_4 = this.layout) === null || _4 === void 0 ? void 0 : _4.paddingBottom) {
                        v = (_5 = this.layout) === null || _5 === void 0 ? void 0 : _5.paddingBottom(r + 1, tab, c);
                    }
                    css.padding_bottom = v + "px";
                    cssid.push(v);
                    var scssid = cssid.join("-");
                    var found = false;
                    cell.domWrapper.classList.forEach((cl) => {
                        if (cl.startsWith("RColumn")) {
                            if (cl === scssid)
                                found = true;
                            else
                                cell.domWrapper.classList.remove(cl);
                        }
                    });
                    if (!found) {
                        cell.domWrapper.classList.add(scssid);
                    }
                    if (document.getElementById(scssid) === null) {
                        var sc = {};
                        sc["." + scssid] = css;
                        jassijs.includeCSS(scssid, sc);
                    }
                }
            }
        }
        _setDesignMode(enable) {
            this._designMode = enable;
            //do nothing - no add button
        }
        /*	get design():any{
                return this.toJSON();
            };
            set design(value:any){
                ReportDesign.fromJSON(value,this);
            }*/
        fillTableRow(row, count) {
            if (!row._designMode || count - row._components.length < 1)
                return;
            for (var x = row._components.length; x < count; x++) {
                var rr = new RText_3.RText();
                row.addBefore(rr, row._components[row._components.length - 1]); //after addbutton
            }
        }
        addEmptyCellsIfNeeded(row) {
            if (this.insertEmptyCells === false)
                return;
            var count = row._components.length;
            var _this = this;
            this._components.forEach((tr) => {
                _this.fillTableRow(tr, count);
            });
        }
        /**
       * sets the height of a table cell
       * @param component - the table cell
       * @param height - the new height
       **/
        setChildHeight(component, height) {
            if (Number.isInteger(this.heights)) {
                this.heights = height;
                var test = Number(height);
                for (var x = 0; x < tr._components.length; x++) {
                    tr._components[x].dom.style.height = isNaN(test) ? height : (test + "px");
                }
                return;
            }
            if (typeof (this.heights) === "function") {
                this.heights = [];
            }
            var found = -1;
            var tr = component._parent;
            var max = tr._components.length - 1;
            var test = Number(height);
            for (var x = 0; x < tr._components.length; x++) {
                tr._components[x].dom.style.height = isNaN(test) ? height : (test + "px");
            }
            for (var t = this.heights.length; t < max; t++) {
                this.heights.push("auto");
            }
            this.heights[this._components.indexOf(tr)] = isNaN(test) ? height : test;
        }
        /**
        * gets the width of a table cell
        * @param component - the table cell
        **/
        getChildHeight(component) {
            var pos = this._components.indexOf(component._parent);
            if (Number.isInteger(this.heights)) {
                return this.heights;
            }
            else if (typeof (this.heights) === "function") {
                //@ts-ignore
                return this.heights(pos);
            }
            else { //Array
                if (pos === -1)
                    return undefined;
                return this.heights[pos];
            }
            //this._parent.setChildWidth(component,value);
        }
        /**
        * sets the width of a table cell
        * @param component - the table cell
        * @param width - the new width
        **/
        setChildWidth(component, width) {
            var max = 0;
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                for (var i = 0; i < this._components[x]._components.length; i++) {
                    if (i > max)
                        max = i;
                    var row = this._components[x]._components[i];
                    if (row === component)
                        found = i;
                }
            }
            for (var t = this.widths.length; t < max; t++) {
                this.widths.push("auto");
            }
            if (found !== -1) {
                this.widths[found] = Number(width);
                if (isNaN(this.widths[found]))
                    this.widths[found] = width;
                this._components[0]._components[found].domWrapper.setAttribute("width", width);
            }
            //this._parent.setChildWidth(component,value);
        }
        /**
         * gets the width of a table cell
         * @param component - the table cell
         **/
        getChildWidth(component) {
            var found = -1;
            for (var x = 0; x < this._components.length; x++) {
                if (this._components[x]._components) {
                    for (var i = 0; i < this._components[x]._components.length; i++) {
                        var row = this._components[x]._components[i];
                        if (row === component)
                            found = i;
                    }
                }
            }
            if (found !== -1)
                return this.widths[found];
            //this._parent.setChildWidth(component,value);
        }
        create(ob) {
        }
        set layoutName(value) {
            var _a;
            var old = this.layoutName;
            if (value === "custom" && old === undefined && this.layout !== undefined)
                return; //if user has changed the layout then do not modify
            this.layout = (_a = RTableLayouts_1.tableLayouts[value]) === null || _a === void 0 ? void 0 : _a.layout;
            this.updateLayout(true);
        }
        get layoutName() {
            var ret = this.findTableLayout(this.layout);
            if (ret === undefined)
                ret = this.layout === undefined ? "" : "custom";
            return ret;
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
            }
            super.extensionCalled(action);
        }
        findTableLayout(func) {
            var sfind = Tools_3.Tools.objectToJson(func, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
            for (var key in RTableLayouts_1.tableLayouts) {
                var test = Tools_3.Tools.objectToJson(RTableLayouts_1.tableLayouts[key].layout, undefined, false).replaceAll(" ", "").replaceAll("\t", "").replaceAll("\r", "").replaceAll("\n", "");
                if (sfind === test)
                    return key;
            }
            return undefined;
        }
        fromJSON(obj, callingFromTable = undefined) {
            var _a;
            var ob = obj.table;
            var ret = this;
            if (ob)
                ret.removeAll();
            if (callingFromTable)
                ob = callingFromTable;
            if (ob === null || ob === void 0 ? void 0 : ob.body) {
                for (var x = 0; x < ob.body.length; x++) {
                    let obb = new RTablerow_3.RTablerow().fromJSON(ob.body[x]);
                    obb.parent = this;
                    ret.add(obb);
                    /*   let all = [];
                       obb._components.forEach((obp) => all.push(obp));
                       all.forEach((obp) => { obb.add(obp) });
                       obb.destroy();*/
                }
                delete ob.body;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.headerRows) {
                ret.headerRows = ob.headerRows;
                delete ob.headerRows;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.widths) {
                ret.widths = ob.widths;
                delete ob.widths;
            }
            if (ob === null || ob === void 0 ? void 0 : ob.heights) {
                ret.heights = ob.heights;
                delete ob.heights;
            }
            if (obj.layout) {
                if (typeof (obj.layout) === "string") {
                    if (((_a = RTableLayouts_1.tableLayouts[obj.layout]) === null || _a === void 0 ? void 0 : _a.isSystem) === true) {
                        ret.layout = RTableLayouts_1.tableLayouts[obj.layout].layout;
                    }
                }
                else
                    ret.layout = obj.layout;
                delete obj.layout;
            }
            var tr = this._components[0];
            for (var x = 0; x < tr._components.length; x++) {
                tr._components[x].domWrapper.setAttribute("width", this.widths[x]);
            }
            if (this.heights) {
                for (var r = 0; r < this._components.length; r++) {
                    var row = this._components[r];
                    for (var c = 0; c < row._components.length; c++) {
                        var val;
                        if (Number.isInteger(this.heights)) {
                            val = this.heights;
                        }
                        else if (typeof (this.heights) === "function") {
                            //@ts-ignore
                            val = this.heights(r);
                        }
                        else
                            val = this.heights[r];
                        row._components[c].dom.style.height = Number.isInteger(val) ? val + "px" : val;
                    }
                }
            }
            super.fromJSON(ob);
            this.updateLayout(false);
            return ret;
        }
        toJSON(datatable = undefined) {
            var _a;
            var r = {};
            var ret = super.toJSON();
            ret.table = r;
            if (this.layout) {
                var test = this.findTableLayout(this.layout);
                if ((_a = RTableLayouts_1.tableLayouts[test]) === null || _a === void 0 ? void 0 : _a.isSystem)
                    ret.layout = test;
                else
                    ret.layout = this.layout;
            }
            if (this.headerRows) {
                r.headerRows = this.headerRows;
            }
            if (this.widths && this.widths.length > 0) {
                r.widths = this.widths;
                var len = this._components[0]._components.length;
                for (var t = r.widths.length; t < len; t++) {
                    r.widths.push("auto");
                }
                //remove width
                while (r.widths.length > len) {
                    r.widths.pop();
                }
            }
            //TODO height=50 -> gilt für alle und height=function() not supported
            if (Number.isInteger(this.heights) || typeof (this.heights) === "function") {
                r.heights = this.heights;
            }
            else if (this.heights && this.heights.length > 0) {
                r.heights = this.heights;
                var len = this._components.length;
                for (var t = r.heights.length; t < len; t++) {
                    r.heights.push("auto");
                }
                //remove heights
                while (r.heights.length > len) {
                    r.heights.pop();
                }
            }
            if (datatable === true) {
            }
            else {
                r.body = [];
                for (var x = 0; x < this._components.length; x++) {
                    r.body.push(this._components[x].toJSON());
                }
            }
            return ret;
        }
    };
    exports.RTable = RTable;
    __decorate([
        (0, Property_9.$Property)(),
        __metadata("design:type", Number)
    ], RTable.prototype, "headerRows", void 0);
    __decorate([
        (0, Property_9.$Property)({ chooseFrom: allLayouts, chooseFromStrict: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RTable.prototype, "layoutName", null);
    exports.RTable = RTable = __decorate([
        (0, RComponent_10.$ReportComponent)({ fullPath: "report/Table", icon: "mdi mdi-table-large", editableChildComponents: ["this", "this.headerPanel", "this.bodyPanel", "this.footerPanel"] }),
        (0, Registry_20.$Class)("jassijs_report.RTable"),
        __metadata("design:paramtypes", [Object])
    ], RTable);
    async function test() {
    }
});
define("jassijs_report/RTableLayouts", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.tableLayouts = void 0;
    var tableLayouts = {
        zebra: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
                }
            }
        },
        noBorders: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        headerLineOnly: {
            isSystem: false, //is missing in this version of pdfmake
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 1 ? 2 : 0); //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        lightHorizontalLines: {
            isSystem: true,
            layout: {
                hLineWidth: function (i, node) {
                    if (i === 1)
                        return 2;
                    if (i === 0 || i === node.table.body.length)
                        return 0;
                    return 1; //(i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return 0; //(i === 0 || i === node.table.widths.length) ? 4 : 1;
                }
            }
        },
        frameWithLines: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'gray';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'black' : 'gray';
                }
            }
        },
        frame: {
            isSystem: false,
            layout: {
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 2 : 0;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 2 : 0;
                }
            }
        },
        custom: {
            isSystem: false,
            layout: {
                fillColor: function (rowIndex, node, columnIndex) {
                    return null;
                },
                hLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 4 : 1;
                },
                vLineWidth: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 4 : 1;
                },
                hLineColor: function (i, node) {
                    return (i === 0 || i === node.table.body.length) ? 'black' : 'red';
                },
                vLineColor: function (i, node) {
                    return (i === 0 || i === node.table.widths.length) ? 'blue' : 'green';
                },
                paddingLeft: function (i, node) { return 1; },
                paddingRight: function (i, node) { return 1; },
                paddingTop: function (i, node) { return 1; },
                paddingBottom: function (i, node) { return 1; }
            }
        }
    };
    exports.tableLayouts = tableLayouts;
});
define("jassijs_report/RTablerow", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs_report/ReportDesign", "jassijs_report/RComponent", "jassijs_report/RText"], function (require, exports, Registry_21, Component_4, ReportDesign_6, RComponent_11, RText_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTablerow = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTablerow = class RTablerow extends RComponent_11.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = {}) {
            super(properties);
            this.reporttype = "tablerow";
            this.dom.classList.add("designerNoResizable");
        }
        render() {
            return React.createElement("tr", { className: "RTablerow" });
        }
        extensionCalled(action) {
            if (action.componentDesignerSetDesignMode) {
                //    this._componentDesigner = action.componentDesignerSetDesignMode.componentDesigner;
                this._designMode = action.componentDesignerSetDesignMode.enable;
            }
            super.extensionCalled(action);
        }
        oncomponentAdded(callback) {
            this.addEvent("componentAdded", callback);
        }
        get _editorselectthis() {
            return this._parent;
        }
        setChildWidth(component, value) {
            var _a;
            (_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildWidth(component, value);
        }
        getChildWidth(component) {
            var _a;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.getChildWidth(component);
        }
        setChildHeight(component, value) {
            var _a;
            (_a = this._parent) === null || _a === void 0 ? void 0 : _a.setChildHeight(component, value);
        }
        getChildHeight(component) {
            var _a;
            return (_a = this._parent) === null || _a === void 0 ? void 0 : _a.getChildHeight(component);
        }
        wrapComponent(component) {
            var _a;
            var _this = this;
            if (((_a = component.domWrapper) === null || _a === void 0 ? void 0 : _a.tagName) === "TD")
                return; //allready wrapped
            Component_4.Component.replaceWrapper(component, document.createElement("td"));
            var border = component["border"];
            if (border !== undefined) {
                component.domWrapper.style["border-left-style"] = border[0] ? "solid" : "none";
                component.domWrapper.style["border-top-style"] = border[1] ? "solid" : "none";
                component.domWrapper.style["border-right-style"] = border[2] ? "solid" : "none";
                component.domWrapper.style["border-bottom-style"] = border[3] ? "solid" : "none";
            }
            if (component.colSpan)
                component.domWrapper.setAttribute("colspan", component.colSpan.toString());
            if (component.rowSpan)
                component.domWrapper.setAttribute("rowspan", component.rowSpan.toString());
            component.domWrapper.style["word-break"] = "break-all";
            component.domWrapper.style["display"] = "";
            if (component.reporttype === "text") {
                var rt = component;
                rt.customToolbarButtons["Table"] = {
                    title: "<span class='mdi mdi-grid'><span>",
                    action: () => {
                        var test = rt;
                        rt._parent.parent.contextMenu.target = component.dom.children[0];
                        rt._parent.parent.contextMenu.show();
                    }
                };
            }
            component.dom.classList.remove("designerNoResizable");
            component.dom.classList.add("designerNoResizableY");
        }
        /**
        * adds a component to the container
        * @param {jassijs.ui.Component} component - the component to add
        */
        add(component) {
            var _a, _b;
            if (component.addToParent)
                return component.addToParent(this);
            if (this.forEachDummy)
                return;
            this.wrapComponent(component);
            component.parent = this;
            super.add(component);
            this.callEvent("componentAdded", component, this);
            if (this._parent)
                this._parent.addEmptyCellsIfNeeded(this);
            /*if (component.designDummyFor) {
                component.domWrapper.setAttribute("colspan", "100");
               // if ($(this.dom).width() < 140) {
                //    component.width = 140 - $(this.dom).width();
                 if (this.dom.clientWidth < 140) {
                    component.width = 140 - this.dom.clientWidth;
                }
            }*/
            if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout)
                (_b = this.parent) === null || _b === void 0 ? void 0 : _b.updateLayout(true);
            /*  var test=component.height;
              if(test)
                  component.height=test;*/
        }
        /**
      * adds a component to the container before an other component
      * @param {jassijs.ui.Component} component - the component to add
      * @param {jassijs.ui.Component} before - the component before then component to add
      */
        addBefore(component, before) {
            var _a, _b;
            if (component.addToParent)
                return component.addToParent(this);
            if (this.forEachDummy)
                return;
            this.wrapComponent(component);
            component.parent = this;
            if (component["reporttype"] === "text") {
                //(<RText>component).newlineafter = true;
            }
            super.addBefore(component, before);
            this.callEvent("componentAdded", component, this);
            if ((_a = this.parent) === null || _a === void 0 ? void 0 : _a.updateLayout)
                (_b = this.parent) === null || _b === void 0 ? void 0 : _b.updateLayout(true);
        }
        fromJSON(columns) {
            var ret = this;
            if (columns["foreach"]) {
                var dummy = new RText_4.RText();
                dummy.value = "foreach";
                dummy.colSpan = 200;
                this.add(dummy);
                ret.forEachDummy = columns;
                return ret;
            }
            for (let x = 0; x < columns.length; x++) {
                ret.add(ReportDesign_6.ReportDesign.fromJSON(columns[x]));
            }
            return ret;
        }
        toJSON() {
            var columns = [];
            if (this.forEachDummy)
                return this.forEachDummy;
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                columns.push(this._components[x].toJSON());
            }
            //Object.assign(ret, this["otherProperties"]);
            return columns;
        }
    };
    exports.RTablerow = RTablerow;
    exports.RTablerow = RTablerow = __decorate([
        (0, RComponent_11.$ReportComponent)({ editableChildComponents: ["this"] }),
        (0, Registry_21.$Class)("jassijs_report.RTablerow")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTablerow);
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RText", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/RComponent", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs/ui/CSSProperties", "jassijs/util/Tools", "jassijs/ui/Component"], function (require, exports, Registry_22, RComponent_12, Property_10, ReportDesign_7, CSSProperties_1, Tools_4, Component_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RText = void 0;
    exports.test = test;
    /*
    Object.assign(TextComponent.prototype, {
        toJSON() {
             debugger;
            return this.text;
        }
    });
    */
    class InlineStyling {
    }
    //calc the default Formats
    let allFormats = (() => {
        var ret = [];
        const format = new Intl.NumberFormat();
        var decimal = format.format(1.1).substring(1, 2);
        var group = format.format(1234).substring(1, 2);
        /*	const parts = format.formatToParts(1234.6);
                var decimal = ".";
            var group=",";
            parts.forEach(p => {
                if (p.type === "decimal")
                    decimal = p.value;
                if (p.type === "group")
                    group = p.value;
            });*/
        ret.push("#" + group + "##0" + decimal + "00");
        ret.push("#" + group + "##0" + decimal + "00 €");
        ret.push("#" + group + "##0" + decimal + "00 $");
        ret.push("$#,###.00");
        ret.push("0");
        ret.push("0" + decimal + "00");
        ret.push("MM/DD/YYYY");
        ret.push("DD.MM.YYYY");
        ret.push("DD/MM/YYYY hh:mm:ss");
        ret.push("DD.MM.YYYY hh:mm:ss");
        ret.push("hh:mm:ss");
        ret.push("h:mm:ss A");
        return ret;
    })();
    let RText = class RText extends RComponent_12.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "text";
            this.toolbar = ['bold italic underline forecolor backcolor fontsizeselect'];
            this.customToolbarButtons = {};
            this.text = document.createTextNode("");
            this.dom.appendChild(this.text);
            //@ts-ignore
            this.text._this = this;
            // super.init('<div class="RText mce-content-body jdisableaddcomponents" tabindex="0" ><div  class="HTMLPanelContent"></div></div>');//tabindex for key-event
            //        super.init('<div class="RText jdisableaddcomponents" tabindex="0" ></div>');//tabindex for key-event
            this.domWrapper.classList.remove("jcontainer");
            this.__dom.style["text-overflow"] = "ellipsis";
            this.__dom.style["overflow"] = "hidden";
            this.dom.classList.add("designerNoResizable");
            delete this._components;
            (0, CSSProperties_1.loadFontIfNedded)("Roboto");
            var el = this.dom.children[0];
            this._designMode = false;
            this.dom.style["display"] = "block";
        }
        render() {
            return React.createElement(Component_5.HTMLComponent, {
                tag: "div",
                className: "RText jdisableaddcomponents",
                tabIndex: 0
            });
        }
        get value() {
            /* var el = this.dom.children[0];
             if (el === undefined)
                 return "";
             var ret = el.innerHTML;
             */
            return this.text.textContent;
        }
        set value(code) {
            this.text.textContent = code;
            /*  var el: any = this.dom.children[0];
              if (el === undefined) {
                  el = document.createTextNode(code);
                  this.dom.appendChild(el);
              } else
                  el.innerHTML=code;*/
        }
        set format(value) {
            this._format = value;
        }
        get format() {
            return this._format;
        }
        fromJSON(ob) {
            var ret = this;
            /*  if (ob.editTogether) {
                  delete ob.editTogether;
                  ret.convertToHTML(ob.text);
              } else*/
            ret.value = ob.text.replaceAll("\n", "<br/>");
            delete ob.text;
            if (ob.format) {
                this.format = ob.format;
                delete ob.format;
            }
            super.fromJSON(ob);
            // ret.otherProperties = ob;
            return this;
        }
        convertFromHTMLNode(node, list, style) {
            for (var x = 0; x < node.childNodes.length; x++) {
                var child = node.childNodes[x];
                if (child.nodeName === "#text") {
                    var rt = {};
                    if (style.bold)
                        rt.bold = true;
                    if (style.background)
                        rt.background = style.background;
                    if (style.color)
                        rt.color = style.color;
                    if (style.fontsize)
                        rt.fontSize = style.fontsize;
                    if (style.font)
                        rt.font = style.font;
                    if (style.underline)
                        rt.decoration = "underline";
                    if (style.italics)
                        rt.italics = style.italics;
                    rt.text = child["data"];
                    list.push(rt);
                }
                else if (child.nodeName === "STRONG") {
                    style.bold = true;
                    this.convertFromHTMLNode(child, list, style);
                    delete style.bold;
                }
                else if (child.nodeName === "EM") {
                    style.italics = true;
                    this.convertFromHTMLNode(child, list, style);
                    delete style.italics;
                }
                if (child.nodeName === "SPAN" && child["style"].color !== "") {
                    style.color = this.fullColorHex(child["style"].color);
                    this.convertFromHTMLNode(child, list, style);
                    delete style.color;
                }
                else if (child.nodeName === "SPAN" && child["style"]["background-color"] !== "") {
                    style.background = this.fullColorHex(child["style"]["background-color"]);
                    this.convertFromHTMLNode(child, list, style);
                    delete style.background;
                }
                else if (child.nodeName === "SPAN" && child["style"]["font-size"] !== "") {
                    style.fontsize = Number(child["style"]["font-size"].replace("px", ""));
                    this.convertFromHTMLNode(child, list, style);
                    delete style.fontsize;
                }
                else if (child.nodeName === "SPAN" && child["style"]["text-decoration"] !== "") {
                    style.underline = (child["style"]["text-decoration"] === "underline");
                    this.convertFromHTMLNode(child, list, style);
                    delete style.underline;
                }
            }
        }
        rgbToHex(rgb) {
            var hex = Number(rgb).toString(16);
            if (hex.length < 2) {
                hex = "0" + hex;
            }
            return hex;
        }
        ;
        //rgb(1,2,3)
        fullColorHex(text) {
            var c = text.split("(")[1].split(")")[0].split(",");
            var red = this.rgbToHex(c[0]);
            var green = this.rgbToHex(c[1]);
            var blue = this.rgbToHex(c[2]);
            return "#" + red + green + blue;
        }
        ;
        convertToHTML(obs) {
            var html = "";
            for (var x = 0; x < obs.length; x++) {
                var ob = obs[x];
                var anz = 0;
                var tagcount = 0;
                if (ob.bold) {
                    html += "<strong>";
                }
                if (ob.italics) {
                    html += "<em>";
                }
                if (ob.background || ob.color || ob.decoration === "underline" || ob.fontSize) {
                    if (ob.color) {
                        html += "<span style='color:" + ob.color + "'>";
                        tagcount++;
                    }
                    if (ob.background) {
                        html += "<span style='background-color:" + ob.background + "'>";
                        tagcount++;
                    }
                    if (ob.decoration) {
                        html += "<span style='text-decoration:" + ob.decoration + "'>";
                        tagcount++;
                    }
                    if (ob.fontSize) {
                        html += "<span style='font-size:" + ob.fontSize + "pt'>";
                        tagcount++;
                    }
                }
                html += ob.text.replaceAll("\n", "<br/>");
                for (var t = 0; t < tagcount; t++) {
                    html += "</span>";
                }
                if (ob.italics) {
                    html += "</em>";
                }
                if (ob.bold) {
                    html += "</strong>";
                }
            }
            this.value = html;
        }
        convertFromHTML(ret) {
            var sval = decodeURI(this.value);
            sval = sval.replaceAll("<br>", "\n");
            ret.text = sval; //.replaceAll("<br>","\\n");
            var node = Component_5.Component.createHTMLElement("<span>" + ret.text + "</span>");
            if (node.innerText !== node.innerHTML) { //htmltext
                var style = new InlineStyling();
                var list = [];
                this.convertFromHTMLNode(node, list, style);
                if (list.length > 1) {
                    ret.editTogether = true;
                    ret.text = list;
                }
                else { //only one text found so we transfer the html 
                    ret = list[0];
                    ret.text = node.innerText;
                    this.fromJSON(Tools_4.Tools.copyObject(ret));
                }
            }
            return ret;
        }
        toJSON() {
            var ret = super.toJSON();
            ret = this.convertFromHTML(ret);
            if (this.format) {
                ret.format = this.format;
            }
            var test = 0;
            for (var key in ret) {
                test++;
            }
            if (test === 1)
                ret = ret.text; //short version
            return ret;
        }
    };
    exports.RText = RText;
    __decorate([
        (0, Property_10.$Property)({
            chooseFrom: function (component) {
                return ReportDesign_7.ReportDesign.getVariables(component);
            }
        }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "value", null);
    __decorate([
        (0, Property_10.$Property)({ type: "string", chooseFrom: allFormats }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RText.prototype, "format", null);
    exports.RText = RText = __decorate([
        (0, RComponent_12.$ReportComponent)({ fullPath: "report/Text", icon: "mdi mdi-format-color-text" }),
        (0, Registry_22.$Class)("jassijs_report.RText")
        //@$Property({hideBaseClassProperties:true})
        ,
        (0, Property_10.$Property)({ name: "value", type: "string", description: "text" }),
        __metadata("design:paramtypes", [Object])
    ], RText);
    function test() {
        var t = new RText();
        t.value = "a<em>b<strong>cd</strong>e</em><span style='color: rgb(241, 196, 15);' data-mce-style='color: #f1c40f;'>fg<span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>h</span></span><span style='background-color: rgb(186, 55, 42);' data-mce-style='background-color: #ba372a;'>ij<span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>k</span></span><span style='font-size: 14pt;' data-mce-style='font-size: 14pt;'>l<span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>m</span></span><span style='text-decoration: underline;' data-mce-style='text-decoration: underline;'>no</span>";
        var obb = t.toJSON();
        //var test = RText.fromJSON(obb);
    }
});
define("jassijs_report/RTextGroup", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/ReportDesign", "jassijs_report/RComponent", "jassijs/remote/Classes"], function (require, exports, Registry_23, ReportDesign_8, RComponent_13, Classes_6) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RTextGroup = void 0;
    //@$UIComponent({editableChildComponents:["this"]})
    let RTextGroup = class RTextGroup extends RComponent_13.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = { useSpan: true }) {
            super(properties);
            this.reporttype = "textgroup";
        }
        /**
          * adds a component to the container before an other component
          * @param {jassijs.ui.Component} component - the component to add
          * @param {jassijs.ui.Component} before - the component before then component to add
          */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup")
                throw new Classes_6.JassiError("only text oder textgroup could be added to TextGroup");
            super.addBefore(component, before);
            component.domWrapper.style["display"] = "inline-block";
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            if (component.reporttype !== "text" && component.reporttype !== "textgroup")
                throw new Classes_6.JassiError("only text oder textgroup could be added to TextGroup");
            super.add(component);
            component.domWrapper.style.display = "inline-block";
        }
        toJSON() {
            var ret = super.toJSON();
            ret.text = [];
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                ret.text.push(this._components[x].toJSON());
            }
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.text;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_8.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.text;
            return ret;
        }
    };
    exports.RTextGroup = RTextGroup;
    exports.RTextGroup = RTextGroup = __decorate([
        (0, RComponent_13.$ReportComponent)({ fullPath: "report/TextGroup", icon: "mdi mdi-text-box-multiple-outline", editableChildComponents: ["this"] }),
        (0, Registry_23.$Class)("jassijs_report.RTextGroup")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RTextGroup);
});
//    jassijs.register("reportcomponent","jassijs_report.Stack","report/Stack","res/boxpanel.ico");
define("jassijs_report/RUList", ["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Component", "jassijs/ui/Property", "jassijs_report/ReportDesign", "jassijs_report/RComponent"], function (require, exports, Registry_24, Component_6, Property_11, ReportDesign_9, RComponent_14) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUList = void 0;
    //mdi-format-list-numbered
    let RUList = class RUList extends RComponent_14.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "ul";
        }
        render() {
            return React.createElement("ul", { className: "RUList" });
        }
        /**
         * adds a component to the container before an other component
         * @param {jassijs.ui.Component} component - the component to add
         * @param {jassijs.ui.Component} before - the component before then component to add
         */
        addBefore(component, before) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_6.Component.replaceWrapper(component, document.createElement("li"));
            if (component._listType !== undefined)
                component.listType = component._listType;
            super.addBefore(component, before);
        }
        /**
      * adds a component to the container
      * @param {jassijs.ui.Component} component - the component to add
      */
        add(component) {
            if (component.addToParent)
                return component.addToParent(this);
            Component_6.Component.replaceWrapper(component, document.createElement("li"));
            if (component.listType !== undefined)
                component.listType = component._listType;
            super.add(component);
        }
        set type(value) {
            this._type = value;
            if (value === undefined)
                this.dom.style["list-style-type"] = "";
            else
                this.dom.style["list-style-type"] = value;
        }
        get type() {
            return this._type;
        }
        toJSON() {
            var ret = super.toJSON();
            ret.ul = [];
            for (let x = 0; x < this._components.length; x++) {
                //@ts-ignore
                ret.ul.push(this._components[x].toJSON());
            }
            if (this.type)
                ret.type = this.type;
            return ret;
        }
        fromJSON(ob) {
            var ret = this;
            var arr = ob.ul;
            for (let x = 0; x < arr.length; x++) {
                ret.add(ReportDesign_9.ReportDesign.fromJSON(arr[x]));
            }
            delete ob.ul;
            if (ob.type)
                ret.type = ob.type;
            delete ob.type;
            super.fromJSON(ob);
            return ret;
        }
    };
    exports.RUList = RUList;
    __decorate([
        (0, Property_11.$Property)({ chooseFrom: ["square", "circle", "none"] }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], RUList.prototype, "type", null);
    exports.RUList = RUList = __decorate([
        (0, RComponent_14.$ReportComponent)({ fullPath: "report/Unordered List", icon: "mdi mdi-format-list-bulleted", editableChildComponents: ["this"] }),
        (0, Registry_24.$Class)("jassijs_report.RUList")
        //@$Property({name:"horizontal",hide:true})
        ,
        __metadata("design:paramtypes", [Object])
    ], RUList);
});
define("jassijs_report/RUnknown", ["require", "exports", "jassijs/remote/Registry", "jassijs_report/RComponent"], function (require, exports, Registry_25, RComponent_15) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RUnknown = void 0;
    //@$ReportComponent({fullPath:"report/Text",icon:"res/textbox.ico",initialize:{value:"text"}})
    let RUnknown = class RUnknown extends RComponent_15.RComponent {
        /**
        *
        * @param {object} properties - properties to init
        * @param {string} [properties.id] -  connect to existing id (not reqired)
        * @param {boolean} [properties.useSpan] -  use span not div
        *
        */
        constructor(properties = undefined) {
            super(properties);
            this.reporttype = "unkown";
        }
        componentDidMount() {
            this.horizonzal = false;
        }
        render() {
            return React.createElement("span", { className: "InvisibleComponent" /*, style= "Menu" */ });
        }
        fromJSON(ob) {
            var ret = this;
            super.fromJSON(ob);
            // Object.assign(ret,this.otherProperties);
            return ret;
        }
        toJSON() {
            var ret = super.toJSON();
            Object.assign(ret, this.otherProperties);
            return ret;
        }
    };
    exports.RUnknown = RUnknown;
    exports.RUnknown = RUnknown = __decorate([
        (0, Registry_25.$Class)("jassijs_report.RUnknown"),
        __metadata("design:paramtypes", [Object])
    ], RUnknown);
});
define("jassijs_report/SimpleReportEditor", ["require", "exports", "jassijs/remote/Registry", "jassijs/util/Runlater", "jassijs_report/designer/SimpleReportDesigner", "jassijs_editor/AcePanelSimple", "jassijs_report/ReportDesign", "jassijs/ui/Panel", "jassijs/base/Windows", "jassijs/ui/DockingContainer", "jassijs/ui/VariablePanel", "jassijs/ui/Property"], function (require, exports, Registry_26, Runlater_2, SimpleReportDesigner_1, AcePanelSimple_1, ReportDesign_10, Panel_7, Windows_3, DockingContainer_1, VariablePanel_1, Property_12) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleReportEditor = void 0;
    exports.test = test;
    Windows_3 = __importDefault(Windows_3);
    class SimpleCodeEditor extends Panel_7.Panel {
        constructor(codePanel) {
            super();
            this.maximize();
            this._main = new DockingContainer_1.DockingContainer();
            this._codeView = new Panel_7.Panel();
            this._codeToolbar = new Panel_7.Panel();
            //if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this._codePanel = codePanel;
            this._file = "";
            this.variables = new VariablePanel_1.VariablePanel();
            this._design = new Panel_7.Panel();
            this._init();
            this.editMode = true;
        }
        _initCodePanel() {
            this._codePanel.width = "100%";
            this._codePanel.mode = "typescript";
            this._codePanel.height = "calc(100% - 31px)";
        }
        _init() {
            var _this = this;
            this._initCodePanel();
            this._codeView["horizontal"] = true;
            this._codeView.add(this._codePanel);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
            this._main.onresize = function () {
                setTimeout(function () {
                    _this._codePanel.resize();
                }, 1000);
            };
            super.add(this._main);
            this._installView();
            //this.variables.createTable();
        }
        _installView() {
            this._main.add(this._codeView, "Code..", "code");
            this._main.add(this.variables, "Variables", "variables");
            this._main.add(this._design, "Design", "design");
            //this._main.layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":100,"content":[{"type":"stack","width":33.333333333333336,"height":80.34682080924856,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":19.653179190751445,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"width":50,"content":[{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":50,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}'
        }
        async _save(code) {
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
        }
        /**
         * search text in classes at the given text
         * @param {string} text - the text to search
         * @returns {jassijs_editor.CodeEditor} - the editor instance
         */
        static async search(text) {
            return undefined;
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
        /**
         * add variables to variabelpanel
         * @param Object<string,object> variables ["name"]=value
         */
        addVariables(variables) {
            this.variables.addAll(variables);
        }
        /**
         * execute the current code
         * @param {boolean} toCursor -  if true the variables were inspected on cursor position,
         *                              if false at the end of the layout() function or at the end of the code
         */
        async evalCode(toCursor = undefined) {
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
        }
        destroy() {
            this._codeView.destroy();
            this._codeToolbar.destroy();
            this._codePanel.destroy();
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
    }
    __decorate([
        (0, Property_12.$Property)({ isUrlTag: true, id: true }),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], SimpleCodeEditor.prototype, "file", null);
    __decorate([
        (0, Property_12.$Property)({ isUrlTag: true }),
        __metadata("design:type", Number),
        __metadata("design:paramtypes", [Number])
    ], SimpleCodeEditor.prototype, "line", null);
    let SimpleReportEditor = class SimpleReportEditor extends Panel_7.Panel {
        //value:string;
        constructor(properties) {
            super(properties);
            var _this = this;
            this.acePanel = new AcePanelSimple_1.AcePanelSimple();
            this.codeEditor = new SimpleCodeEditor(this.acePanel);
            this.add(this.codeEditor);
            this.codeEditor.width = "100%";
            this.codeEditor.height = "100%";
            this.reportPanel = new ReportDesign_10.ReportDesign();
            var layout = undefined;
            if ((properties === null || properties === void 0 ? void 0 : properties.view) === "horizontal") {
                layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","width":40.28745644599303,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":40.28745644599303,"content":[{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":66.88311688311688,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            }
            else if ((properties === null || properties === void 0 ? void 0 : properties.view) === "vertical") {
                layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":80.57491289198606,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":50,"content":[{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","width":80.57491289198606,"height":50,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true}]}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":66.88311688311688,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            }
            else if ((properties === null || properties === void 0 ? void 0 : properties.view) === "withoutcode") {
                layout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload","tabOverlapAllowance":0,"reorderOnTabMenuClick":true,"tabControlOffset":10},"dimensions":{"borderWidth":5,"borderGrabWidth":15,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":100,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":100,"width":80.57491289198606,"content":[{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":66.88311688311688,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":16.558441558441558,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            }
            else {
                layout = properties === null || properties === void 0 ? void 0 : properties.view;
            }
            this.reportDesigner = new SimpleReportDesigner_1.SimpleReportDesigner(layout);
            if (properties === null || properties === void 0 ? void 0 : properties.oncodechange) //@ts-ignore
                this.reportDesigner.oncodechanged(properties === null || properties === void 0 ? void 0 : properties.oncodechange);
            var compileTask = undefined;
            this.codeEditor.variables.addVariable("this", this.reportPanel);
            this.codeEditor.evalCode = async function () {
                if (compileTask === undefined) {
                    compileTask = new Runlater_2.Runlater(() => {
                        _this.codeEditor.variables.clear();
                        var code = _this.acePanel.value;
                        var func = new Function("", "return " + code.substring(code.indexOf("=") + 1));
                        var ob = func();
                        _this.reportDesign = ob;
                    }, 800);
                }
                else
                    compileTask.runlater();
            };
            this.acePanel.onchange((obj, editor) => {
                if (!_this.reportDesigner.propertyIsChanging)
                    _this.codeEditor.evalCode();
            });
            //designer["codeEditor"]._main.add(designer, "Design", "design");
            this.reportPanel.design = { content: [] };
            this.codeEditor._design = this.reportDesigner;
            this.codeEditor._main.add(this.codeEditor._design, "Design", "design");
            this.reportDesigner.codeEditor = this.codeEditor;
            this.reportDesigner.designedComponent = this.reportPanel;
            if (properties === null || properties === void 0 ? void 0 : properties.startUpWithPdfView) {
                this.reportDesigner.editDialog(false);
            }
        }
        get reportDesign() {
            var _a;
            return (_a = this.reportPanel) === null || _a === void 0 ? void 0 : _a.design;
        }
        set reportDesign(design) {
            this.reportPanel = new ReportDesign_10.ReportDesign();
            this.reportPanel.design = design;
            this.reportDesigner.designedComponent = this.reportPanel;
            this.reportDesigner.propertyChanged(); //get Code back
        }
        /**
       * @member {string} - the code
       */
        set value(value) {
            this.acePanel.value = value;
            //@ts-ignore
            this.codeEditor.evalCode();
        }
        get value() {
            return this.acePanel.value;
        }
    };
    exports.SimpleReportEditor = SimpleReportEditor;
    exports.SimpleReportEditor = SimpleReportEditor = __decorate([
        (0, Registry_26.$Class)("jassi_report.SimpleReportEditor"),
        __metadata("design:paramtypes", [Object])
    ], SimpleReportEditor);
    function test() {
        var reportdesign = {
            content: [
                {
                    text: "Hallo Herr {nachname}"
                },
                {
                    text: "ok"
                },
                {
                    columns: [
                        {
                            text: "text"
                        },
                        {
                            text: "text"
                        }
                    ]
                }
            ],
            data: {
                nachname: "Meier"
            }
        };
        var editor = new SimpleReportEditor({
            startUpWithPdfView: false,
            view: "horizontal",
            oncodechange: (text) => {
                console.log("code changed" + text);
            }
        });
        //  editor.reportDesign = reportdesign;
        editor.width = "100%";
        editor.height = "100%";
        editor.value = JSON.stringify(reportdesign);
        setTimeout(() => {
            Windows_3.default.add(editor, "Testtt");
        }, 10);
        //return editor;
    }
});
define("jassijs_report/StartReporteditor", ["require", "exports", "jassijs_editor/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Settings", "jassijs/base/CurrentSettings"], function (require, exports, FileExplorer_1, Windows_4, Panel_8, Router_2, Settings_1, CurrentSettings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = test;
    Windows_4 = __importDefault(Windows_4);
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        //  var body = new Panel({ id: "body" });
        //body.max();
        var site = new Panel_8.Panel();
        Windows_4.default._desktop.add(site);
        site.dom.innerHTML = '<h1>\n<a id="user-content-jassijs-reporteditor" class="anchor" href="#jassijs-reporteditor" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Jassijs-Reporteditor</h1>\n<p>Jassijs Reporteditor is a visual tool for designing <a href="http://pdfmake.org/" rel="nofollow">pdfmake</a> reports. The reports can be rendered with pdfmake to pdf either directly in the browser or server-side with nodes.\nThe report designer can be executed directly via <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/web</a>. The report designer can also be integrated into your own websites. An example of this is <a href="https://uwei.github.io/jassijs-reporteditor/simple" rel="nofollow">here</a>.</p>\n<h2>\n<a id="user-content-runtime" class="anchor" href="#runtime" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Runtime</h2>\n<p>The Jassijs report designer extends the syntax of pdfmake by filling data e.g. with the help of data tables. In order for the report to be filled at runtime, a conversion of the report design is necessary. Here is an <a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport.html" rel="nofollow">example</a> or [with amd] (<a href="https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html" rel="nofollow">https://uwei.github.io/jassijs-reporteditor/simple/usereport-amd.html</a>):</p>\n<div class="highlight highlight-text-html-basic"><pre><span class="pl-kos">&lt;</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/pdfmake.min.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.2/vfs_fonts.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span> <span class="pl-c1">src</span>=\'<span class="pl-s">http://localhost/jassijs/dist/pdfmakejassi.js</span>\'<span class="pl-kos">&gt;</span><span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">head</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span>\n  <span class="pl-kos">&lt;</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-kos">{</span>\n\t\t\t<span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n\t\t\t\t<span class="pl-s">\'Hallo ${name}\'</span><span class="pl-kos">,</span>\n\t\t\t\t<span class="pl-s">\'${parameter.date}\'</span>\n\t\t\t<span class="pl-kos">]</span>\n\t\t<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-c">//fill data  </span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">data</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">name</span>:<span class="pl-s">\'Max\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-k">var</span> <span class="pl-s1">parameter</span><span class="pl-c1">=</span><span class="pl-kos">{</span><span class="pl-c1">date</span>:<span class="pl-s">\'2021-10-15\'</span><span class="pl-kos">}</span><span class="pl-kos">;</span>\n\t\t<span class="pl-s1">docDefinition</span><span class="pl-c1">=</span><span class="pl-s1">pdfmakejassi</span><span class="pl-kos">.</span><span class="pl-en">createReportDefinition</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">,</span><span class="pl-s1">data</span><span class="pl-kos">,</span><span class="pl-s1">parameter</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\n\t\t<span class="pl-s1">pdfMake</span><span class="pl-kos">.</span><span class="pl-en">createPdf</span><span class="pl-kos">(</span><span class="pl-s1">docDefinition</span><span class="pl-kos">)</span><span class="pl-kos">.</span><span class="pl-en">download</span><span class="pl-kos">(</span><span class="pl-kos">)</span><span class="pl-kos">;</span>\n\t<span class="pl-kos">&lt;/</span><span class="pl-ent">script</span><span class="pl-kos">&gt;</span>\n<span class="pl-kos">&lt;/</span><span class="pl-ent">body</span><span class="pl-kos">&gt;</span></pre></div>\n<h2>\n<a id="user-content-quick-start" class="anchor" href="#quick-start" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Quick Start:</h2>\n<p>The Jassijs Reportitor can be started directly in the <a href="https://uwei.github.io/jassijs-reporteditor/web" rel="nofollow">browser</a>. Please note that the reports stored there are not permanently stored and are lost when the browser cache is cleared.</p>\n<p>The existing reports are displayed on the right side. Double-click to open the report in Code view as javascript.\n<a href="https://camo.githubusercontent.com/9172b27b26433c0e87d06fd0419e757842ac89adb89e2bfb17be8de729d6431a/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72312e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/9172b27b26433c0e87d06fd0419e757842ac89adb89e2bfb17be8de729d6431a/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72312e6a7067" alt="jassijs-reporteditor1" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor1.jpg" style="max-width:100%;"></a></p>\n<p>With Run <a href="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" alt="jassijs-reporteditor2" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor2.jpg" style="max-width:100%;"></a> the report opens in the <strong>Design</strong> view.\n<a href="https://camo.githubusercontent.com/d014a6a69fa8a13596a3cf885687c93352c6f26c2e292889eb246b719aeb3c23/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72332e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/d014a6a69fa8a13596a3cf885687c93352c6f26c2e292889eb246b719aeb3c23/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72332e6a7067" alt="jassijs-reporteditor3" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor3.jpg" style="max-width:100%;"></a>\nThere, new report elements can be added from the <strong>Palette</strong> via drag and drop. The <strong>Properties</strong> of the selected report item can be changed in the property editor.</p>\n<p>With <a href="https://camo.githubusercontent.com/8a5bab1108211501516632442bbc08c3d50fc0eb4bf2643eaa39855eb1bb5478/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72342e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/8a5bab1108211501516632442bbc08c3d50fc0eb4bf2643eaa39855eb1bb5478/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72342e6a7067" alt="jassijs-reporteditor4" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor4.jpg" style="max-width:100%;"></a> the created pdf can be viewed.\n<a href="https://camo.githubusercontent.com/58e07784a867b283f4fb6f2770ef2d03b6367ac5fea0943030b0fdd50d7db066/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72352e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/58e07784a867b283f4fb6f2770ef2d03b6367ac5fea0943030b0fdd50d7db066/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72352e6a7067" alt="jassijs-reporteditor5" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor5.jpg" style="max-width:100%;"></a></p>\n<p>In the <strong>Code</strong> view, the report is displayed as Javascript code. With Run <a href="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/485308edc97cc3a97888998e8bc2691ad5f251b58d6f15f7ba70867f8cb4185e/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72322e6a7067" alt="jassijs-reporteditor2" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor2.jpg" style="max-width:100%;"></a> , changes in the code can be loaded back into the <strong>Design</strong> view.\nThere are many examples in the left side panel under Files that explain the report elements. Under pdfmake-Playground you will find examples of pdfmake. A detailed description of the syntax of pdfmake is described at <a href="http://pdfmake.org/" rel="nofollow">http://pdfmake.org/</a>.\nYou can create your own folders and reports (right-click context menu) under <strong>Files</strong>. But remember that the reports are only stored in the browser and are lost when the browser cache is cleared. You can also <strong>Download</strong> the <strong>modified</strong> reports (right-click on a folder in <strong>Files</strong>).</p>\n<h2>\n<a id="user-content-limitations" class="anchor" href="#limitations" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Limitations</h2>\n<p>Not all properties of the report elements that are possible with pdfmake can be set with the visual disigner, but these properties are not lost when editing the report.</p>\n<h2>\n<a id="user-content-syntax-extensions" class="anchor" href="#syntax-extensions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Syntax extensions</h2>\n<p>The following extensions of the pdfmake syntax can be used with the help of link.</p>\n<h3>\n<a id="user-content-templating" class="anchor" href="#templating" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>templating:</h3>\n<p>With the help of javascript template strings, data can be filled into the report. The following example shows this.</p>\n<div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-s1">reportdesign</span> <span class="pl-c1">=</span> <span class="pl-kos">{</span>\n\t<span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n        <span class="pl-s">\'Hallo ${name}\'</span><span class="pl-kos">,</span>\n        <span class="pl-s">\'${address.street}\'</span><span class="pl-kos">,</span>\n        <span class="pl-s">\'${parameter.date}\'</span>\n    <span class="pl-kos">]</span>\n<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\n<span class="pl-k">export</span> <span class="pl-k">function</span> <span class="pl-en">test</span><span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-kos">{</span>\n    <span class="pl-k">return</span> <span class="pl-kos">{</span> \n        reportdesign<span class="pl-kos">,</span>\n        <span class="pl-c1">data</span>:<span class="pl-kos">{</span>\n            <span class="pl-c1">name</span>:<span class="pl-s">\'Klaus\'</span><span class="pl-kos">,</span>\n            <span class="pl-c1">address</span>:<span class="pl-kos">{</span>\n                <span class="pl-c1">street</span>:<span class="pl-s">\'Mainstreet 8\'</span>\n            <span class="pl-kos">}</span>\n        <span class="pl-kos">}</span><span class="pl-kos">,</span>        \n        <span class="pl-c1">parameter</span>:<span class="pl-kos">{</span><span class="pl-c1">date</span>:<span class="pl-s">\'2021-10-10\'</span><span class="pl-kos">}</span>      <span class="pl-c">//parameter</span>\n    <span class="pl-kos">}</span><span class="pl-kos">;</span>\n<span class="pl-kos">}</span></pre></div>\n<p>The <strong>data</strong> of the report are specified in the data field or as a 2nd parameter when filling the report with <strong>pdfmakejassi.createReportDefinition</strong>.\nThis data could be filled line javascript Template-Strings like <strong>${name}</strong>.\nSimilar to data, parameters can also be filled in the report.</p>\n<h3>\n<a id="user-content-edittogether" class="anchor" href="#edittogether" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>edittogether</h3>\n<p>For texts with different formatting, individual text elements must be linked in pdfmake. Text elements that are to be edited together in a text box in the Designer are marked with edittogether. The text can be edited comfortably (thanks TinyMCE).\n<a href="https://camo.githubusercontent.com/a1741345d6b9db8cc6fa359d9ccebcb4940ba745ae8d42ec5c288553e1522dd0/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72362e6a7067" target="_blank" rel="nofollow"><img src="https://camo.githubusercontent.com/a1741345d6b9db8cc6fa359d9ccebcb4940ba745ae8d42ec5c288553e1522dd0/68747470733a2f2f757765692e6769746875622e696f2f6a617373696a732d7265706f7274656469746f722f646f632f6a617373696a732d7265706f7274656469746f72362e6a7067" alt="jassijs-reporteditor6" data-canonical-src="https://uwei.github.io/jassijs-reporteditor/doc/jassijs-reporteditor6.jpg" style="max-width:100%;"></a></p>\n<h3>\n<a id="user-content-foreach" class="anchor" href="#foreach" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>foreach</h3>\n<p>If the report data contain arrays, then this data can be filled into the report with foreach.\nHere is a simple <a href="https://uwei.github.io/jassijs-reporteditor/web/#do=jassijs_editor.CodeEditor&amp;file=demoreports/10-Foreach.ts" rel="nofollow">example</a>.</p>\n<div class="highlight highlight-source-js"><pre><span class="pl-k">var</span> <span class="pl-s1">reportdesign</span> <span class="pl-c1">=</span> <span class="pl-kos">{</span>\n    <span class="pl-c1">content</span>: <span class="pl-kos">[</span>\n        <span class="pl-kos">{</span>\n            <span class="pl-c1">foreach</span>: <span class="pl-s">\'line\'</span><span class="pl-kos">,</span>\n            <span class="pl-c1">text</span>: <span class="pl-s">\'${line.name}\'</span>\n        <span class="pl-kos">}</span><span class="pl-kos"></span>\n<span class="pl-kos">}</span><span class="pl-kos">;</span>\n\n<span class="pl-k">export</span> <span class="pl-k">function</span> <span class="pl-en">test</span><span class="pl-kos">(</span><span class="pl-kos">)</span> <span class="pl-kos">{</span>\n    <span class="pl-k">return</span> <span class="pl-kos">{</span>\n        reportdesign<span class="pl-kos">,</span>\n        <span class="pl-c1">data</span>: <span class="pl-kos">[</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line1\'</span> <span class="pl-kos">}</span><span class="pl-kos">,</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line2\'</span> <span class="pl-kos">}</span><span class="pl-kos">,</span>\n            <span class="pl-kos">{</span> <span class="pl-c1">name</span>: <span class="pl-s">\'line3\'</span> <span class="pl-kos">}</span>\n        <span class="pl-kos">]</span>\n    <span class="pl-kos">}</span><span class="pl-kos">;</span>\n<span class="pl-kos">}</span></pre></div>\n<p>The element that is marked with foreach is repeated for each array element.\nThe array element can be accessed with ${line.name}.\nforeach $line is the short form for foreach $line in data.\nIf not the element itself but another report element is to be repeated,\ncan be used.</p>\n<h3>\n<a id="user-content-datatable" class="anchor" href="#datatable" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>datatable</h3>\n<p>Syntax {\n}\nBeispiel</p>\n<h3>\n<a id="user-content-format" class="anchor" href="#format" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>format</h3>\n<h2>\n<a id="user-content-aggregate-functions" class="anchor" href="#aggregate-functions" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>aggregate Functions</h2>\n';
        site.style = {
            backgroundColor: "white",
            overflow: "scroll"
        };
        site.height = "100%";
        site.width = "100%";
        Windows_4.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        Router_2.router.navigate(window.location.hash);
        //Ace should be default because long image blob breaks line   
        if (CurrentSettings_1.currentsettings.gets(Settings_1.Settings.keys.Development_DefaultEditor) === undefined) {
            Settings_1.Settings.save(Settings_1.Settings.keys.Development_DefaultEditor, "ace", "browser");
        }
    }
    start().then();
    async function convertMD() {
        var md = await $.ajax({
            type: "get",
            url: "https://uwei.github.io/jassijs-reporteditor/README.md"
        });
        md = md.replaceAll('"', "'");
        md = md.substring(0, 999999).replaceAll("\n", "\\n").replaceAll("\t", "\\t");
        //console.log(md);
        var html = await $.ajax({
            url: "https://api.github.com/markdown",
            type: 'post',
            headers: {
                "Accept": "application/vnd.github.v3+json"
            },
            data: '{"text":"' + md + '"}'
        });
    }
    function test() {
        convertMD();
    }
});
define("jassijs_report/TemplateReport", ["require", "exports", "jassijs/base/Actions", "jassijs/remote/Registry", "jassijs/ui/OptionDialog", "jassijs_editor/FileExplorer"], function (require, exports, Actions_3, Registry_27, OptionDialog_1, FileExplorer_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TemplateReport = void 0;
    const code = `reportdesign = {
	content: [
    ]
};`;
    let TemplateReport = class TemplateReport {
        static async newFile(all) {
            var res = await OptionDialog_1.OptionDialog.show("Create new Report:", ["ok", "cancel"], undefined, false, "Report1");
            if (res.button === "ok") {
                FileExplorer_2.FileActions.newFile(all, res.text + ".ts", code, true);
            }
        }
    };
    exports.TemplateReport = TemplateReport;
    TemplateReport.code = code;
    __decorate([
        (0, Actions_3.$Action)({
            name: "New/Report",
            isEnabled: function (all) {
                return all[0].isDirectory();
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array]),
        __metadata("design:returntype", Promise)
    ], TemplateReport, "newFile", null);
    exports.TemplateReport = TemplateReport = __decorate([
        (0, Actions_3.$ActionProvider)("jassijs.remote.FileNode"),
        (0, Registry_27.$Class)("jassijs_report.TemplateReport")
    ], TemplateReport);
});
define("jassijs_report/test/ClientReport", ["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Report_2, Property_13, Registry_28) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ClientReport = void 0;
    exports.test = test;
    var reportdesign = {
        content: [
            {
                datatable: {
                    dataforeach: "person",
                    body: [
                        "${person.name}", "${person.lastname}"
                    ]
                }
            }
        ]
    };
    let ClientReport = class ClientReport extends Report_2.Report {
        async fill() {
            var data = [
                { name: "Aoron", lastname: "Müller" },
                { name: "Heino", lastname: "Brecht" }
            ];
            return {
                reportdesign,
                data
            };
        }
    };
    exports.ClientReport = ClientReport;
    __decorate([
        (0, Property_13.$Property)(),
        __metadata("design:type", String)
    ], ClientReport.prototype, "sort", void 0);
    exports.ClientReport = ClientReport = __decorate([
        (0, Report_2.$Report)({ name: "test/Sample Clientreport" }),
        (0, Registry_28.$Class)("jassijs_report.test.ClientReport")
    ], ClientReport);
    async function test() {
        var cl = new ClientReport();
        await cl.open();
    }
});
define("jassijs_report/test/ServerReport", ["require", "exports", "jassijs_report/Report", "jassijs/ui/Property", "jassijs/remote/Registry"], function (require, exports, Report_3, Property_14, Registry_29) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ServerReport = void 0;
    exports.test = test;
    /*var reportdesign:JassijsReportDefinition = {
        content: [
            {
                datatable: {
                    dataforeach:"person",
                    body: [
                        "${person.name}","${person.lastname}"
                    ]
                }
            }
        ]
    };*/
    let ServerReport = class ServerReport extends Report_3.Report {
    };
    exports.ServerReport = ServerReport;
    __decorate([
        (0, Property_14.$Property)({ chooseFromStrict: true, chooseFrom: ["name", "lastname"] }),
        __metadata("design:type", String)
    ], ServerReport.prototype, "sort", void 0);
    exports.ServerReport = ServerReport = __decorate([
        (0, Report_3.$Report)({ name: "test/Sample Serverreport", serverReportPath: "jassijs_report/server/TestServerreport" }),
        (0, Registry_29.$Class)("jassijs_report.test.ServerReport")
    ], ServerReport);
    async function test() {
        var cl = new ServerReport();
        cl.sort = "lastname";
        await cl.view();
    }
});
//this file is autogenerated don't modify
define("jassijs_report/registry", ["require"], function (require) {
    return {
        default: {
            "jassijs_report/designer/ReportDesigner.ts": {
                "date": 1699287545054.5315,
                "jassijs_report.designer.ReportDesigner": {}
            },
            "jassijs_report/designer/SimpleReportDesigner.ts": {
                "date": 1655556794000,
                "jassijs_report.designer.SimpleReportDesigner": {}
            },
            "jassijs_report/ext/pdfjs.ts": {
                "date": 1657714200000
            },
            "jassijs_report/ext/pdfmake.ts": {
                "date": 1657714352000
            },
            "jassijs_report/modul.ts": {
                "date": 1655329710000
            },
            "jassijs_report/pdfMake-interface.ts": {
                "date": 1681513962000
            },
            "jassijs_report/PDFReport.ts": {
                "date": 1655556866000,
                "jassijs_report.PDFReport": {}
            },
            "jassijs_report/PDFViewer.ts": {
                "date": 1719589039108.462,
                "jassijs_report.PDFViewer": {}
            },
            "jassijs_report/RColumns.ts": {
                "date": 1721763160019.909,
                "jassijs_report.RColumns": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Columns",
                            "icon": "mdi mdi-view-parallel-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RComponent.ts": {
                "date": 1699203219964.0005,
                "jassijs_report.RComponent": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RDatatable.ts": {
                "date": 1740077551782.498,
                "jassijs_report.RDatatable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Datatable",
                            "icon": "mdi mdi-table-cog",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/remote/pdfmakejassi.ts": {
                "date": 1634336644000
            },
            "jassijs_report/remote/ServerReport.ts": {
                "date": 1684441134000,
                "jassijs_report.remote.ServerReport": {
                    "@members": {
                        "getDesign": {
                            "ValidateFunctionParameter": []
                        },
                        "getBase64": {
                            "ValidateFunctionParameter": []
                        }
                    }
                }
            },
            "jassijs_report/Report.ts": {
                "date": 1656501702000,
                "jassijs_report.remote.Report": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "createActions": {
                            "$Actions": []
                        }
                    }
                }
            },
            "jassijs_report/ReportDesign.ts": {
                "date": 1740076933424.2107,
                "jassijs_report.InfoProperties": {
                    "@members": {}
                },
                "jassijs_report.PermissionProperties": {
                    "@members": {}
                },
                "jassijs_report.StyleContainer": {
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ]
                },
                "jassijs_report.ReportDesign": {
                    "$ReportComponent": [
                        {
                            "fullPath": "undefined",
                            "icon": "undefined",
                            "editableChildComponents": [
                                "this",
                                "this.backgroundPanel",
                                "this.headerPanel",
                                "this.contentPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "hideBaseClassProperties": true
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/ReportDesignGlobal.ts": {
                "date": 1655397714000
            },
            "jassijs_report/Reports.ts": {
                "date": 1657978946000,
                "jassijs_report/Reports": {
                    "$ActionProvider": [
                        "jassijs.base.ActionNode"
                    ],
                    "@members": {
                        "show": {
                            "$Action": [
                                {
                                    "name": "Tools/Reports",
                                    "icon": "mdi mdi-chart-box-outline"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/ReportViewer.ts": {
                "date": 1681571042000,
                "jassijs_report/ReportViewer": {}
            },
            "jassijs_report/RGroupTablerow.ts": {
                "date": 1699111120748.0674,
                "jassijs_report.RTablerow": {
                    "@members": {}
                }
            },
            "jassijs_report/RImage.ts": {
                "date": 1719588998709.0293,
                "jassijs_report.RImage": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Image",
                            "icon": "mdi mdi-image-frame"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RImageEditor.ts": {
                "date": 1739905991130.4978,
                "jassi_report/RImagePropertyEditor": {
                    "$PropertyEditor": [
                        [
                            "rimage"
                        ]
                    ]
                }
            },
            "jassijs_report/ROList.ts": {
                "date": 1721763181480.2773,
                "jassijs_report.ROList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Ordered List",
                            "icon": "mdi mdi-format-list-numbered",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RStack.ts": {
                "date": 1740076986120.5095,
                "jassijs_report.RStack": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Stack",
                            "icon": "mdi mdi-view-sequential-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "$Property": [
                        {
                            "name": "children",
                            "type": "jassijs_report.RComponent"
                        }
                    ]
                }
            },
            "jassijs_report/RStyle.ts": {
                "date": 1656015340000,
                "jassijs_report.RStyle": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Style",
                            "icon": "mdi mdi-virus-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTable.ts": {
                "date": 1721763274507.0127,
                "jassijs_report.RTable": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Table",
                            "icon": "mdi mdi-table-large",
                            "editableChildComponents": [
                                "this",
                                "this.headerPanel",
                                "this.bodyPanel",
                                "this.footerPanel"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTableLayouts.ts": {
                "date": 1633113320000
            },
            "jassijs_report/RTablerow.ts": {
                "date": 1740077542230.021,
                "jassijs_report.RTablerow": {
                    "$ReportComponent": [
                        {
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RText.ts": {
                "date": 1740076167764.8438,
                "jassijs_report.RText": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Text",
                            "icon": "mdi mdi-format-color-text"
                        }
                    ],
                    "$Property": [
                        {
                            "name": "value",
                            "type": "string",
                            "description": "text"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RTextGroup.ts": {
                "date": 1721763243509.179,
                "jassijs_report.RTextGroup": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/TextGroup",
                            "icon": "mdi mdi-text-box-multiple-outline",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ]
                }
            },
            "jassijs_report/RUList.ts": {
                "date": 1721763248473.9978,
                "jassijs_report.RUList": {
                    "$ReportComponent": [
                        {
                            "fullPath": "report/Unordered List",
                            "icon": "mdi mdi-format-list-bulleted",
                            "editableChildComponents": [
                                "this"
                            ]
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/RUnknown.ts": {
                "date": 1719588242339.4045,
                "jassijs_report.RUnknown": {}
            },
            "jassijs_report/SimpleReportEditor.ts": {
                "date": 1697485042309.9119,
                "jassi_report.SimpleReportEditor": {}
            },
            "jassijs_report/StartReporteditor.ts": {
                "date": 1698507857261.209
            },
            "jassijs_report/TemplateReport.ts": {
                "date": 1681570100000,
                "jassijs_report.TemplateReport": {
                    "$ActionProvider": [
                        "jassijs.remote.FileNode"
                    ],
                    "@members": {
                        "newFile": {
                            "$Action": [
                                {
                                    "name": "New/Report",
                                    "isEnabled": "function"
                                }
                            ]
                        }
                    }
                }
            },
            "jassijs_report/test/ClientReport.ts": {
                "date": 1656501728000,
                "jassijs_report.test.ClientReport": {
                    "$Report": [
                        {
                            "name": "test/Sample Clientreport"
                        }
                    ],
                    "@members": {}
                }
            },
            "jassijs_report/test/ServerReport.ts": {
                "date": 1684401088000,
                "jassijs_report.test.ServerReport": {
                    "$Report": [
                        {
                            "name": "test/Sample Serverreport",
                            "serverReportPath": "jassijs_report/server/TestServerreport"
                        }
                    ],
                    "@members": {}
                }
            }
        }
    };
});
//# sourceMappingURL=jassijs_report.js.map