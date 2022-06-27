var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs_editor/ComponentDesigner", "jassijs/remote/Classes", "jassijs_report/PDFReport", "jassijs_report/PDFViewer", "jassijs_report/ReportDesign", "jassijs/util/Tools", "jassijs_report/remote/ServerReport"], function (require, exports, Registry_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, ComponentDesigner_1, Classes_1, PDFReport_1, PDFViewer_1, ReportDesign_1, Tools_1, ServerReport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.test2 = exports.ReportDesigner = void 0;
    let ReportDesigner = class ReportDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            this.propertyIsChanging = false;
            this.pdfviewer = new PDFViewer_1.PDFViewer();
            this._codeChanger = undefined;
            this.mainLayout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
            this.editButton.tooltip = "pdf preview";
            this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";
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
                        ServerReport_1.ServerReport.getBase64LastTestResult().then((base64) => {
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
    };
    ReportDesigner = __decorate([
        (0, Registry_1.$Class)("jassijs_report.designer.ReportDesigner"),
        __metadata("design:paramtypes", [])
    ], ReportDesigner);
    exports.ReportDesigner = ReportDesigner;
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
    exports.test2 = test2;
    ;
    async function test() {
        var CodeEditor = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/CodeEditor"], resolve_1, reject_1); })).CodeEditor;
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
    exports.test = test;
    ;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBcUJBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSxxQ0FBaUI7UUFTakQ7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQVJaLHVCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMzQixjQUFTLEdBQWMsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFJL0IsaUJBQVksR0FBbUIsU0FBUyxDQUFDO1lBQ2pELGVBQVUsR0FBVyw0NEZBQTQ0RixDQUFDO1lBSTk1RixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsbUNBQW1DLENBQUM7UUFFL0QsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQUs7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLCtCQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFD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dEIsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxLQUFLLEdBQUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FzQmxCLENBQUM7UUFDRSxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbEIsT0FBTyxNQUFNLENBQUM7SUFFbEIsQ0FBQztJQWpDRCxvQkFpQ0M7SUFBQSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcblxyXG5pbXBvcnQgeyBQcm9wZXJ0eUVkaXRvciB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5RWRpdG9yXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudEV4cGxvcmVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudEV4cGxvcmVyXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudFBhbGV0dGUgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50UGFsZXR0ZVwiO1xyXG5pbXBvcnQgeyBDb2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50cyB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50c1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnREZXNpZ25lciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnREZXNpZ25lclwiO1xyXG5pbXBvcnQgeyBjbGFzc2VzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XHJcbmltcG9ydCB7IENvbnRhaW5lciB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbnRhaW5lclwiO1xyXG5pbXBvcnQgeyBQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7IFBERlJlcG9ydCB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9QREZSZXBvcnRcIjtcclxuaW1wb3J0IHsgUERGVmlld2VyIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlZpZXdlclwiO1xyXG5pbXBvcnQgeyBSZXBvcnREZXNpZ24gfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUmVwb3J0RGVzaWduXCI7XHJcbmltcG9ydCB7IFRvb2xzIH0gZnJvbSBcImphc3NpanMvdXRpbC9Ub29sc1wiO1xyXG5pbXBvcnQgeyBSQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JDb21wb25lbnRcIjtcclxuaW1wb3J0IHsgUlN0YWNrIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JTdGFja1wiO1xyXG5pbXBvcnQgeyBTZXJ2ZXJSZXBvcnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvcmVtb3RlL1NlcnZlclJlcG9ydFwiO1xyXG5cclxuXHJcbkAkQ2xhc3MoXCJqYXNzaWpzX3JlcG9ydC5kZXNpZ25lci5SZXBvcnREZXNpZ25lclwiKVxyXG5leHBvcnQgY2xhc3MgUmVwb3J0RGVzaWduZXIgZXh0ZW5kcyBDb21wb25lbnREZXNpZ25lciB7XHJcblxyXG4gICAgcHJvcGVydHlJc0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICBwZGZ2aWV3ZXI6IFBERlZpZXdlciA9IG5ldyBQREZWaWV3ZXIoKTtcclxuICAgIGFsbENvbXBvbmVudHM6IHsgW25hbWU6IHN0cmluZ106IENvbXBvbmVudCB9O1xyXG4gICAgbmV4dENvbXBvbmVudHZhcmlhYmxlOiB7IFt0eXA6IHN0cmluZ106IG51bWJlciB9O1xyXG4gICAgY29tcG9uZW50dmlld2VyO1xyXG4gICAgcHJpdmF0ZSBfY29kZUNoYW5nZXI6IFByb3BlcnR5RWRpdG9yID0gdW5kZWZpbmVkO1xyXG4gICAgbWFpbkxheW91dDogc3RyaW5nID0gJ3tcInNldHRpbmdzXCI6e1wiaGFzSGVhZGVyc1wiOnRydWUsXCJjb25zdHJhaW5EcmFnVG9Db250YWluZXJcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwic2VsZWN0aW9uRW5hYmxlZFwiOmZhbHNlLFwicG9wb3V0V2hvbGVTdGFja1wiOmZhbHNlLFwiYmxvY2tlZFBvcG91dHNUaHJvd0Vycm9yXCI6dHJ1ZSxcImNsb3NlUG9wb3V0c09uVW5sb2FkXCI6dHJ1ZSxcInNob3dQb3BvdXRJY29uXCI6ZmFsc2UsXCJzaG93TWF4aW1pc2VJY29uXCI6dHJ1ZSxcInNob3dDbG9zZUljb25cIjp0cnVlLFwicmVzcG9uc2l2ZU1vZGVcIjpcIm9ubG9hZFwifSxcImRpbWVuc2lvbnNcIjp7XCJib3JkZXJXaWR0aFwiOjUsXCJtaW5JdGVtSGVpZ2h0XCI6MTAsXCJtaW5JdGVtV2lkdGhcIjoxMCxcImhlYWRlckhlaWdodFwiOjIwLFwiZHJhZ1Byb3h5V2lkdGhcIjozMDAsXCJkcmFnUHJveHlIZWlnaHRcIjoyMDB9LFwibGFiZWxzXCI6e1wiY2xvc2VcIjpcImNsb3NlXCIsXCJtYXhpbWlzZVwiOlwibWF4aW1pc2VcIixcIm1pbmltaXNlXCI6XCJtaW5pbWlzZVwiLFwicG9wb3V0XCI6XCJvcGVuIGluIG5ldyB3aW5kb3dcIixcInBvcGluXCI6XCJwb3AgaW5cIixcInRhYkRyb3Bkb3duXCI6XCJhZGRpdGlvbmFsIHRhYnNcIn0sXCJjb250ZW50XCI6W3tcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjo4MS4wNDI5NDA2NjI1ODk4OCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcIndpZHRoXCI6ODAuNTc0OTEyODkxOTg2MDYsXCJoZWlnaHRcIjo3MS4yMzUwMzQ2NTY1ODQ3NixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkNvZGUuLlwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb2RlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb2RlLi5cIixcIm5hbWVcIjpcImNvZGVcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkRlc2lnblwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJkZXNpZ25cIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkRlc2lnblwiLFwibmFtZVwiOlwiZGVzaWduXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcIndpZHRoXCI6MTkuNDI1MDg3MTA4MDEzOTQsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjE5Ljg0NDM1Nzk3NjY1MzY5NyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlBhbGV0dGVcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwibmFtZVwiOlwiY29tcG9uZW50UGFsZXR0ZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjgwLjE1NTY0MjAyMzM0NjMsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJQcm9wZXJ0aWVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInByb3BlcnRpZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcIm5hbWVcIjpcInByb3BlcnRpZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX0se1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjE4Ljk1NzA1OTMzNzQxMDEyMixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwid2lkdGhcIjo3Ny43MDAzNDg0MzIwNTU3NSxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJ2YXJpYWJsZXNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlZhcmlhYmxlc1wiLFwibmFtZVwiOlwidmFyaWFibGVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJFcnJvcnNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZXJyb3JzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJFcnJvcnNcIixcIm5hbWVcIjpcImVycm9yc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcIndpZHRoXCI6MjIuMjk5NjUxNTY3OTQ0MjU2LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29tcG9uZW50c1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJuYW1lXCI6XCJjb21wb25lbnRzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19XSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwib3BlblBvcG91dHNcIjpbXSxcIm1heGltaXNlZEl0ZW1JZFwiOm51bGx9JztcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcblxyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi50b29sdGlwID0gXCJwZGYgcHJldmlld1wiO1xyXG4gICAgICAgIHRoaXMuZWRpdEJ1dHRvbi5pY29uID0gXCJtZGkgbWRpLTE4cHggbWRpLWZpbGUtcGRmLW91dGxpbmVcIjtcclxuXHJcbiAgICB9XHJcbiAgICBzZXQgY29kZUVkaXRvcih2YWx1ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IgPSBuZXcgUHJvcGVydHlFZGl0b3IodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyID0gbmV3IFByb3BlcnR5RWRpdG9yKHRoaXMuX2NvZGVFZGl0b3IsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5fZXJyb3JzID0gdGhpcy5fY29kZUVkaXRvci5fZXJyb3JzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUgPSBuZXcgQ29tcG9uZW50UGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyID0gbmV3IENvbXBvbmVudEV4cGxvcmVyKHZhbHVlLCB0aGlzLl9wcm9wZXJ0eUVkaXRvcik7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyA9IG5ldyBDb2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50cyh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5hZGQodGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyk7XHJcbiAgICAgICAgdGhpcy5faW5pdENvbXBvbmVudEV4cGxvcmVyKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9jb2RlUGFuZWwub25ibHVyKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnJlYWRQcm9wZXJ0eVZhbHVlRnJvbURlc2lnbiA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZEV2ZW50KFwicHJvcGVydHlDaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMucHJvcGVydHlDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IuYWRkRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnByb3BlcnR5Q2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX19kb20uY2xhc3NMaXN0LmFkZChcIlJlcG9ydERlc2lnbmVyXCIpO1xyXG4gICAgICAgIHRoaXMuZG9tLnN0eWxlLm92ZXJmbG93ID0gXCJzY3JvbGxcIjtcclxuICAgICAgICB0aGlzLmRvbS5zdHlsZS53aWR0aCA9IFwiXCI7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlcktleXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25uZWN0UGFyc2VyKHBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnBhcnNlciA9IHBhcnNlcjtcclxuICAgICAgICB2YXIgUGFyc2VyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICAgIH1cclxuICAgIGVkaXREaWFsb2coZW5hYmxlKSB7XHJcbiAgICAgICAgaWYgKGVuYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgc3VwZXIuZWRpdERpYWxvZyhlbmFibGUpO1xyXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgcmVwID0gbmV3IFBERlJlcG9ydCgpO1xyXG4gICAgICAgICAgICAvL3JlcC5jb250ZW50PXRoaXMuZGVzaWduZWRDb21wb25lbnRbXCJkZXNpZ25dO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5fY29kZUVkaXRvcj8uZmlsZT8uc3RhcnRzV2l0aChcIiRzZXJ2ZXJzaWRlL1wiKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuZXZhbFNlcnZlcnNpZGUoKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBTZXJ2ZXJSZXBvcnQuZ2V0QmFzZTY0TGFzdFRlc3RSZXN1bHQoKS50aGVuKChiYXNlNjQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGRmdmlld2VyLnJlcG9ydCA9IHJlcDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBkZnZpZXdlci52YWx1ZSA9IGJhc2U2NFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBkYXRhO1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhID0gKDxSZXBvcnREZXNpZ24+dGhpcy5fY29kZUNoYW5nZXIudmFsdWUpLnRvSlNPTigpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcC52YWx1ZSA9IGRhdGE7Ly9Ub29scy5jb3B5T2JqZWN0KGRhdGEpOy8vIGRlc2lnbmVkQ29tcG9uZW50W1wiZGVzaWduXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlcC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVwLmdldEJhc2U2NCgpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wZGZ2aWV3ZXIucmVwb3J0ID0gcmVwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL21ha2UgYSBjb3B5IGJlY2F1c2UgdGhlIGRhdGEgd291bGQgYmUgbW9kaWZpZWQgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucGRmdmlld2VyLnZhbHVlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vdmlld2VyLnZhbHVlID0gYXdhaXQgcmVwLmdldEJhc2U2NCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gICAgICAgICAgICB0aGlzLmxhc3RWaWV3ID0gdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF07XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgIGlmICh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50cy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5yZW1vdmUodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF0sIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuYWRkKHRoaXMucGRmdmlld2VyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5yZW1vdmUodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF0sIGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuYWRkKHRoaXMuY29tcG9uZW50dmlld2VyKTtcclxuICAgICAgICAgICAgc3VwZXIuZWRpdERpYWxvZyhlbmFibGUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcm9wZXJ0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUlzQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIuc291cmNlRmlsZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBsZXQgam9iID0gdGhpcy5kZXNpZ25lZENvbXBvbmVudC50b0pTT04oKTtcclxuICAgICAgICBkZWxldGUgam9iLnBhcmFtZXRlcjtcclxuICAgICAgICBkZWxldGUgam9iLmRhdGE7XHJcbiAgICAgICAgbGV0IG9iID0gVG9vbHMub2JqZWN0VG9Kc29uKGpvYiwgdW5kZWZpbmVkLCBmYWxzZSwgODApO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIudmFyaWFibGVzW1wicmVwb3J0ZGVzaWduXCJdKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLmNvZGUuc3Vic3RyaW5nKDAsIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci52YXJpYWJsZXNbXCJyZXBvcnRkZXNpZ25cIl0ucG9zKSArXHJcbiAgICAgICAgICAgICAgICBcIiByZXBvcnRkZXNpZ24gPSBcIiArIG9iICsgdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLmNvZGUuc3Vic3RyaW5nKHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci52YXJpYWJsZXNbXCJyZXBvcnRkZXNpZ25cIl0uZW5kKTtcclxuICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gcztcclxuICAgICAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcclxuXHJcbiAgICAgICAgICAgIC8vdGhpcy5jYWxsRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCB7fSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci5kYXRhW1wicmVwb3J0ZGVzaWduXCJdICYmIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci5kYXRhW1wicmVwb3J0ZGVzaWduXCJdW1wiXCJdLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnNldFByb3BlcnR5SW5Db2RlKFwiXCIsIG9iLCB0cnVlLCBcInJlcG9ydGRlc2lnblwiKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJyZXBvcnRkZXNpZ25cIiwgb2IpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAvL3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgLy90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIuY3JlYXRlQ29tcG9uZW50KHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgLy90aGlzLmFkZFZhcmlhYmxlcyhyZXQsdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICAvL2NyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCB2YXJ2YWx1ZSkge1xyXG4gICAgY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIGNvbXBvbmVudDogQ29tcG9uZW50KTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudFtcInJlcG9ydHR5cGVcIl07XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5leHRDb21wb25lbnR2YXJpYWJsZVtuYW1lXSsrO1xyXG4gICAgICAgIHZhciBzbmFtZSA9IGNvbXBvbmVudFtcIm5hbWVcIl07XHJcbiAgICAgICAgaWYgKHNuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc25hbWUgPSBuYW1lICsgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbXBvbmVudFtcIl9fcHJvdG9fX1wiXSwgXCJuYW1lXCIpKSB7Ly93cml0ZSBiYWNrIHRoZSBuYW1lXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbXCJuYW1lXCJdID0gc25hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXMuYWRkVmFyaWFibGUoc25hbWUsIGNvbXBvbmVudCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWxsQ29tcG9uZW50c1tuYW1lICsgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV1dID0gY29tcG9uZW50O1xyXG4gICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVZhcmlhYmxlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNuYW1lO1xyXG5cclxuICAgIH1cclxuICAgIGFzeW5jIHBhc3RlKCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC5yZWFkVGV4dCgpO1xyXG4gICAgICAgIHZhciBhbGw6IGFueVtdID0gSlNPTi5wYXJzZSh0ZXh0KTtcclxuICAgICAgICB2YXIgdGFyZ2V0OiBSU3RhY2sgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICB2YXIgYmVmb3JlID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIGlmICh0YXJnZXQuX2NvbXBvbmVudHMgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICBiZWZvcmUgPSB0YXJnZXQ7XHJcbiAgICAgICAgICAgIHRhcmdldCA9IHRhcmdldC5fcGFyZW50O1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICBiZWZvcmUgPSB0YXJnZXQuX2NvbXBvbmVudHNbdGFyZ2V0Ll9jb21wb25lbnRzLmxlbmd0aCAtIDFdOy8vZGVzaWduIGR1bW15XHJcbiAgICAgICAgdmFyIGNvbXA6IFJTdGFjayA9IFJlcG9ydERlc2lnbi5mcm9tSlNPTihhbGwpO1xyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcC5fY29tcG9uZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB0YXJnZXQuYWRkQmVmb3JlKGNvbXAuX2NvbXBvbmVudHNbeF0sIGJlZm9yZSk7Ly9kZXNpZ24gZHVtbXlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvcGVydHlDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5lZGl0RGlhbG9nKHRydWUpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIC8qICB2YXIgY29tcDpSQ29tcG9uZW50PVJlcG9ydERlc2lnbi5mcm9tSlNPTihhbGxbeF0pXHJcbiAgICAgICAgIGZvcih2YXIgeD0wO3g8YWxsLmxlbmd0aDt4Kyspe1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgIHBhcmVudC5hZGQoYWxsW3hdKTtcclxuICAgICAgICAgfSovXHJcbiAgICB9XHJcbiAgICBhc3luYyBjb3B5KCk6IFByb21pc2U8c3RyaW5nPiB7XHJcblxyXG4gICAgICAgIHZhciB0ZXh0ID0gXCJcIjtcclxuICAgICAgICB2YXIgY29tcG9uZW50cyA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlO1xyXG4gICAgICAgIGlmICghQXJyYXkuaXNBcnJheShjb21wb25lbnRzKSkge1xyXG4gICAgICAgICAgICBjb21wb25lbnRzID0gW2NvbXBvbmVudHNdO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgc2NvbXBvbmVudHMgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCBjb21wb25lbnRzLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgIHZhciBjb21wb25lbnQ6IFJDb21wb25lbnQgPSBjb21wb25lbnRzW3hdO1xyXG4gICAgICAgICAgICBzY29tcG9uZW50cy5wdXNoKGNvbXBvbmVudC50b0pTT04oKSk7XHJcbiAgICAgICAgICAgIC8vICBzY29tcG9uZW50cy5hZGQoY29tcG9uZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRleHQgPSBKU09OLnN0cmluZ2lmeShzY29tcG9uZW50cyk7XHJcbiAgICAgICAgY29uc29sZS5sb2codGV4dCk7XHJcbiAgICAgICAgYXdhaXQgbmF2aWdhdG9yLmNsaXBib2FyZC53cml0ZVRleHQodGV4dCk7XHJcblxyXG4gICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgfVxyXG4gICAgYXN5bmMgY3V0Q29tcG9uZW50KCkge1xyXG4gICAgICAgIHZhciB0ZXh0ID0gYXdhaXQgdGhpcy5jb3B5KCk7XHJcbiAgICAgICAgaWYgKGF3YWl0IG5hdmlnYXRvci5jbGlwYm9hcmQucmVhZFRleHQoKSAhPT0gdGV4dCkge1xyXG4gICAgICAgICAgICBhbGVydChcImNvdWxkIG5vdCBjb3B5IHRvIENsaXBib2FyZC5cIilcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNvbXBvbmVudHMgPSB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZTtcclxuICAgICAgICBpZiAoIUFycmF5LmlzQXJyYXkoY29tcG9uZW50cykpIHtcclxuICAgICAgICAgICAgY29tcG9uZW50cyA9IFtjb21wb25lbnRzXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIHNjb21wb25lbnRzID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIHggPSAwOyB4IDwgY29tcG9uZW50cy5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICB2YXIgY29tcG9uZW50OiBSQ29tcG9uZW50ID0gY29tcG9uZW50c1t4XTtcclxuXHJcbiAgICAgICAgICAgICg8UlN0YWNrPmNvbXBvbmVudC5fcGFyZW50KS5yZW1vdmUoY29tcG9uZW50KTtcclxuICAgICAgICAgICAgLy8gIHNjb21wb25lbnRzLmFkZChjb21wb25lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnByb3BlcnR5Q2hhbmdlZCgpO1xyXG5cclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gLSB0aGUgZGVzaWduZWQgY29tcG9uZW50XHJcbiAgICAgICovXHJcbiAgICBzZXQgZGVzaWduZWRDb21wb25lbnQoY29tcG9uZW50OiBSZXBvcnREZXNpZ24pIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHZpZXdlciA9IGNvbXBvbmVudDtcclxuICAgICAgICBpZiAodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHMubGVuZ3RoID4gMCAmJiB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSA9PT0gdGhpcy5wZGZ2aWV3ZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIucmVtb3ZlKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdLCBmYWxzZSk7Ly9zaG91bGQgbm90IGJlIGRlc3Ryb3llZFxyXG4gICAgICAgIH1cclxuICAgICAgICAvL2NyZWF0ZSBfY2hpbGRyZW5cclxuICAgICAgICBSZXBvcnREZXNpZ24uZnJvbUpTT04oY29tcG9uZW50W1wiZGVzaWduXCJdLCBjb21wb25lbnQpO1xyXG4gICAgICAgIC8vcG9wdWxhdGUgVmFyaWFibGVzXHJcbiAgICAgICAgdGhpcy5hbGxDb21wb25lbnRzID0ge307XHJcbiAgICAgICAgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGUgPSB7fTtcclxuICAgICAgICB0aGlzLmFsbENvbXBvbmVudHNbXCJ0aGlzXCJdID0gY29tcG9uZW50O1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IudmFyaWFibGVzLmFkZFZhcmlhYmxlKFwidGhpc1wiLCBjb21wb25lbnQpO1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVmFyaWFibGUodW5kZWZpbmVkLCB1bmRlZmluZWQsIDxDb250YWluZXI+Y29tcG9uZW50KTtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IGNvbXBvbmVudDtcclxuXHJcbiAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyID0gdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyO1xyXG4gICAgICAgIC8vQHRzLmlnbm9yZVxyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnZhbHVlID0gY29tcG9uZW50O1xyXG4gICAgICAgIHN1cGVyLmRlc2lnbmVkQ29tcG9uZW50ID0gY29tcG9uZW50O1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnVwZGF0ZVBhcnNlcigpO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAgKiB1bmRvIGFjdGlvblxyXG4gICAgICAgKi9cclxuICAgIHVuZG8oKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmxheW91dCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci51bmRvKCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5ldmFsQ29kZSgpO1xyXG4gICAgfVxyXG4gICAgZ2V0IGRlc2lnbmVkQ29tcG9uZW50KCk6IFJlcG9ydERlc2lnbiB7XHJcbiAgICAgICAgcmV0dXJuIDxSZXBvcnREZXNpZ24+c3VwZXIuZGVzaWduZWRDb21wb25lbnQ7XHJcbiAgICB9XHJcbiAgICAvLyAgICBcdF90aGlzLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcInRoaXNcIiwgcmVwKTtcclxuICAgIGdldCBjb2RlRWRpdG9yKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9jb2RlRWRpdG9yO1xyXG4gICAgfVxyXG4gICAgX2luc3RhbGxWaWV3KCkge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUgPSBuZXcgQ29tcG9uZW50UGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUuc2VydmljZSA9IFwiJFJlcG9ydENvbXBvbmVudFwiO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX3Byb3BlcnR5RWRpdG9yLCBcIlByb3BlcnRpZXNcIiwgXCJwcm9wZXJ0aWVzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLCBcIkNvbXBvbmVudHNcIiwgXCJjb21wb25lbnRzXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4uYWRkKHRoaXMuX2NvbXBvbmVudFBhbGV0dGUsIFwiUGFsZXR0ZVwiLCBcImNvbXBvbmVudFBhbGV0dGVcIik7XHJcbiAgICAgICAgaWYgKHRoaXMubWFpbkxheW91dClcclxuICAgICAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5sYXlvdXQgPSB0aGlzLm1haW5MYXlvdXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICAvL1x0dGhpcy5fY29kZUNoYW5nZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHRoaXMucGRmdmlld2VyLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF9pbml0Q29tcG9uZW50RXhwbG9yZXIoKSB7XHJcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIub25zZWxlY3QoZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsID0gX3RoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnRyZWUuc2VsZWN0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbC5sZW5ndGggPT09IDEpXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsID0gc2VsWzBdO1xyXG4gICAgICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gc2VsO1xyXG4gICAgICAgICAgICB9LCAxMCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLmdldENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChpdGVtKTtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWUuc3Vic3RyaW5nKDUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFybmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdDIoKSB7XHJcbiAgICB2YXIgcmVwID0gbmV3IFBERlJlcG9ydCgpO1xyXG4gICAgdmFyIGRlZiA9IHtcclxuXHJcbiAgICAgICAgY29udGVudDoge1xyXG4gICAgICAgICAgICBzdGFjazogW3tcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcke2ludm9pY2UuY3VzdG9tZXIuZmlyc3RuYW1lfSAke2ludm9pY2UuY3VzdG9tZXIubGFzdG5hbWV9JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnJHtpbnZvaWNlLmN1c3RvbWVyLnN0cmVldH0nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcke2ludm9pY2UuY3VzdG9tZXIucGxhY2V9JyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0ludm9pY2UnLCBmb250U2l6ZTogMTggfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCIgXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJEYXRlOiAke2ludm9pY2UuZGF0ZX1cIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIk51bWJlcjogJHtpbnZvaWNlLm51bWJlcn1cIiwgYm9sZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIiBcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIiBcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgaW52b2ljZToge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTogXCIyMC4wNy4yMDE4XCIsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21lcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogXCJIZW5yeVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RuYW1lOiBcIktsYXVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWV0OiBcIkhhdXB0c3RyLiAxNTdcIixcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZTogXCJjaGVtbml0elwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy9cdGRlZi5jb250ZW50PXJlcGxhY2VUZW1wbGF0ZXMoZGVmLmNvbnRlbnQsZGVmLmRhdGEpO1xyXG4gICAgcmVwLnZhbHVlID0gZGVmO1xyXG4gICAgdmFyIHZpZXdlciA9IG5ldyBQREZWaWV3ZXIoKTtcclxuICAgIHZpZXdlci52YWx1ZSA9IGF3YWl0IHJlcC5nZXRCYXNlNjQoKTtcclxuICAgIHZpZXdlci5oZWlnaHQgPSBcIjIwMFwiO1xyXG4gICAgcmV0dXJuIHZpZXdlcjtcclxuXHJcbn07XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciBDb2RlRWRpdG9yID0gKGF3YWl0IGltcG9ydChcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JcIikpLkNvZGVFZGl0b3I7XHJcbiAgICB2YXIgZWRpdG9yID0gbmV3IENvZGVFZGl0b3IoKTtcclxuICAgIC8vdmFyIHVybCA9IFwiamFzc2lqc19lZGl0b3IvQWNlUGFuZWwudHNcIjtcclxuICAgIGVkaXRvci5oZWlnaHQgPSAzMDA7XHJcbiAgICBlZGl0b3Iud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIC8vYXdhaXQgZWRpdG9yLm9wZW5GaWxlKHVybCk7XHJcbiAgICBlZGl0b3IudmFsdWUgPSBgaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5cclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlUmVwb3J0IGV4dGVuZHMgUmVwb3J0RGVzaWduIHtcclxuICAgIG1lID0ge307XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0ZGF0YSgpIHtcclxuICAgIH1cclxuICAgIGxheW91dChtZSkge1xyXG4gICAgICAgIHRoaXMuZGVzaWduID0geyBcImNvbnRlbnRcIjogeyBcInN0YWNrXCI6IFt7IFwidGV4dFwiOiBcIkhhbGxvXCIgfSwgeyBcInRleHRcIjogXCJva1wiIH0sIHsgXCJjb2x1bW5zXCI6IFt7IFwidGV4dFwiOiBcInRleHRcIiB9LCB7IFwidGV4dFwiOiBcInRleHRcIiB9XSB9XSB9IH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgZGxnID0gbmV3IFNhbXBsZVJlcG9ydCgpO1xyXG4gICAgcmV0dXJuIGRsZztcclxufVxyXG5cclxuYDtcclxuICAgIGVkaXRvci5ldmFsQ29kZSgpO1xyXG4gICAgcmV0dXJuIGVkaXRvcjtcclxuXHJcbn07Il19