var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs_editor/ComponentDesigner", "jassijs/remote/Classes", "jassijs_report/PDFReport", "jassijs_report/PDFViewer", "jassijs_report/ReportDesign", "jassijs/util/Tools"], function (require, exports, Jassi_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, ComponentDesigner_1, Classes_1, PDFReport_1, PDFViewer_1, ReportDesign_1, Tools_1) {
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
            $(this.__dom).addClass("ReportDesigner");
            $(this.dom).css("overflow", "scroll");
            $(this.dom).css("width", "");
        }
        connectParser(parser) {
            this._propertyEditor.parser = parser;
            var Parser = Classes_1.classes.getClass("jassijs_editor.util.Parser");
            this._codeChanger.parser = new Parser();
        }
        editDialog(enable) {
            if (enable === false) {
                super.editDialog(enable);
                var rep = new PDFReport_1.PDFReport();
                //rep.content=this.designedComponent["design];
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
            else
                this._codeChanger.setPropertyInCode("reportdesign", ob);
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
            this._componentExplorer.onclick(function (data) {
                var ob = data.data;
                _this._propertyEditor.value = ob;
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
        (0, Jassi_1.$Class)("jassijs_report.designer.ReportDesigner"),
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

import { $Class } from "jassijs/remote/Jassi";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBa0JBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSxxQ0FBaUI7UUFTakQ7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQVJaLHVCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMzQixjQUFTLEdBQWMsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFJL0IsaUJBQVksR0FBbUIsU0FBUyxDQUFDO1lBQ2pELGVBQVUsR0FBVyw0NEZBQTQ0RixDQUFDO1lBSTk1RixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsbUNBQW1DLENBQUM7UUFFL0QsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQUs7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLCtCQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFD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aWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5cclxuaW1wb3J0IHsgUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRFeHBsb3JlciB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRFeHBsb3JlclwiO1xyXG5pbXBvcnQgeyBDb21wb25lbnRQYWxldHRlIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudFBhbGV0dGVcIjtcclxuaW1wb3J0IHsgQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHMgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHNcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RGVzaWduZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RGVzaWduZXJcIjtcclxuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJqYXNzaWpzL3VpL0NvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBDb250YWluZXIgfSBmcm9tIFwiamFzc2lqcy91aS9Db250YWluZXJcIjtcclxuaW1wb3J0IHsgUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5pbXBvcnQgeyBQREZSZXBvcnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUERGUmVwb3J0XCI7XHJcbmltcG9ydCB7IFBERlZpZXdlciB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9QREZWaWV3ZXJcIjtcclxuaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5pbXBvcnQgeyBUb29scyB9IGZyb20gXCJqYXNzaWpzL3V0aWwvVG9vbHNcIjtcclxuXHJcblxyXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQuZGVzaWduZXIuUmVwb3J0RGVzaWduZXJcIilcclxuZXhwb3J0IGNsYXNzIFJlcG9ydERlc2lnbmVyIGV4dGVuZHMgQ29tcG9uZW50RGVzaWduZXIge1xyXG5cclxuICAgIHByb3BlcnR5SXNDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgcGRmdmlld2VyOiBQREZWaWV3ZXIgPSBuZXcgUERGVmlld2VyKCk7XHJcbiAgICBhbGxDb21wb25lbnRzOiB7IFtuYW1lOiBzdHJpbmddOiBDb21wb25lbnQgfTtcclxuICAgIG5leHRDb21wb25lbnR2YXJpYWJsZTogeyBbdHlwOiBzdHJpbmddOiBudW1iZXIgfTtcclxuICAgIGNvbXBvbmVudHZpZXdlcjtcclxuICAgIHByaXZhdGUgX2NvZGVDaGFuZ2VyOiBQcm9wZXJ0eUVkaXRvciA9IHVuZGVmaW5lZDtcclxuICAgIG1haW5MYXlvdXQ6IHN0cmluZyA9ICd7XCJzZXR0aW5nc1wiOntcImhhc0hlYWRlcnNcIjp0cnVlLFwiY29uc3RyYWluRHJhZ1RvQ29udGFpbmVyXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInNlbGVjdGlvbkVuYWJsZWRcIjpmYWxzZSxcInBvcG91dFdob2xlU3RhY2tcIjpmYWxzZSxcImJsb2NrZWRQb3BvdXRzVGhyb3dFcnJvclwiOnRydWUsXCJjbG9zZVBvcG91dHNPblVubG9hZFwiOnRydWUsXCJzaG93UG9wb3V0SWNvblwiOmZhbHNlLFwic2hvd01heGltaXNlSWNvblwiOnRydWUsXCJzaG93Q2xvc2VJY29uXCI6dHJ1ZSxcInJlc3BvbnNpdmVNb2RlXCI6XCJvbmxvYWRcIn0sXCJkaW1lbnNpb25zXCI6e1wiYm9yZGVyV2lkdGhcIjo1LFwibWluSXRlbUhlaWdodFwiOjEwLFwibWluSXRlbVdpZHRoXCI6MTAsXCJoZWFkZXJIZWlnaHRcIjoyMCxcImRyYWdQcm94eVdpZHRoXCI6MzAwLFwiZHJhZ1Byb3h5SGVpZ2h0XCI6MjAwfSxcImxhYmVsc1wiOntcImNsb3NlXCI6XCJjbG9zZVwiLFwibWF4aW1pc2VcIjpcIm1heGltaXNlXCIsXCJtaW5pbWlzZVwiOlwibWluaW1pc2VcIixcInBvcG91dFwiOlwib3BlbiBpbiBuZXcgd2luZG93XCIsXCJwb3BpblwiOlwicG9wIGluXCIsXCJ0YWJEcm9wZG93blwiOlwiYWRkaXRpb25hbCB0YWJzXCJ9LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6ODEuMDQyOTQwNjYyNTg5ODgsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJ3aWR0aFwiOjgwLjU3NDkxMjg5MTk4NjA2LFwiaGVpZ2h0XCI6NzEuMjM1MDM0NjU2NTg0NzYsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb2RlLi5cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29kZVwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJuYW1lXCI6XCJjb2RlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9LHtcInRpdGxlXCI6XCJEZXNpZ25cIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiZGVzaWduXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJEZXNpZ25cIixcIm5hbWVcIjpcImRlc2lnblwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19LHtcInR5cGVcIjpcImNvbHVtblwiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJ3aWR0aFwiOjE5LjQyNTA4NzEwODAxMzk0LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjoxOS44NDQzNTc5NzY2NTM2OTcsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJQYWxldHRlXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvbXBvbmVudFBhbGV0dGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIlBhbGV0dGVcIixcIm5hbWVcIjpcImNvbXBvbmVudFBhbGV0dGVcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjo4MC4xNTU2NDIwMjMzNDYzLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiUHJvcGVydGllc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJwcm9wZXJ0aWVzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJQcm9wZXJ0aWVzXCIsXCJuYW1lXCI6XCJwcm9wZXJ0aWVzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX1dfV19LHtcInR5cGVcIjpcInJvd1wiLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJoZWlnaHRcIjoxOC45NTcwNTkzMzc0MTAxMjIsXCJjb250ZW50XCI6W3tcInR5cGVcIjpcInN0YWNrXCIsXCJoZWFkZXJcIjp7fSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiYWN0aXZlSXRlbUluZGV4XCI6MCxcImhlaWdodFwiOjE4Ljk1NzA1OTMzNzQxMDEyMixcIndpZHRoXCI6NzcuNzAwMzQ4NDMyMDU1NzUsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJWYXJpYWJsZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwidmFyaWFibGVzXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJWYXJpYWJsZXNcIixcIm5hbWVcIjpcInZhcmlhYmxlc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRXJyb3JzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImVycm9yc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRXJyb3JzXCIsXCJuYW1lXCI6XCJlcnJvcnNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJ3aWR0aFwiOjIyLjI5OTY1MTU2Nzk0NDI1NixcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIkNvbXBvbmVudHNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwiY29tcG9uZW50c1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiQ29tcG9uZW50c1wiLFwibmFtZVwiOlwiY29tcG9uZW50c1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfV0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcIm9wZW5Qb3BvdXRzXCI6W10sXCJtYXhpbWlzZWRJdGVtSWRcIjpudWxsfSc7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG5cclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24udG9vbHRpcCA9IFwicGRmIHByZXZpZXdcIjtcclxuICAgICAgICB0aGlzLmVkaXRCdXR0b24uaWNvbiA9IFwibWRpIG1kaS0xOHB4IG1kaS1maWxlLXBkZi1vdXRsaW5lXCI7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcbiAgICBzZXQgY29kZUVkaXRvcih2YWx1ZSkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvciA9IHZhbHVlO1xyXG4gICAgICAgIHRoaXMudmFyaWFibGVzID0gdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXM7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IgPSBuZXcgUHJvcGVydHlFZGl0b3IodW5kZWZpbmVkLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyID0gbmV3IFByb3BlcnR5RWRpdG9yKHRoaXMuX2NvZGVFZGl0b3IsIHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5fZXJyb3JzID0gdGhpcy5fY29kZUVkaXRvci5fZXJyb3JzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFBhbGV0dGUgPSBuZXcgQ29tcG9uZW50UGFsZXR0ZSgpO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyID0gbmV3IENvbXBvbmVudEV4cGxvcmVyKHZhbHVlLCB0aGlzLl9wcm9wZXJ0eUVkaXRvcik7XHJcbiAgICAgICAgdGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyA9IG5ldyBDb2RlRWRpdG9ySW52aXNpYmxlQ29tcG9uZW50cyh2YWx1ZSk7XHJcbiAgICAgICAgdGhpcy5hZGQodGhpcy5faW52aXNpYmxlQ29tcG9uZW50cyk7XHJcbiAgICAgICAgdGhpcy5faW5pdENvbXBvbmVudEV4cGxvcmVyKCk7XHJcbiAgICAgICAgdGhpcy5faW5zdGFsbFZpZXcoKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9jb2RlUGFuZWwub25ibHVyKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX3Byb3BlcnR5RWRpdG9yLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnJlYWRQcm9wZXJ0eVZhbHVlRnJvbURlc2lnbiA9IHRydWU7XHJcblxyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZEV2ZW50KFwicHJvcGVydHlDaGFuZ2VkXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgX3RoaXMucHJvcGVydHlDaGFuZ2VkKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IuYWRkRXZlbnQoXCJjb2RlQ2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnByb3BlcnR5Q2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICQodGhpcy5fX2RvbSkuYWRkQ2xhc3MoXCJSZXBvcnREZXNpZ25lclwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJvdmVyZmxvd1wiLCBcInNjcm9sbFwiKTtcclxuICAgICAgICAkKHRoaXMuZG9tKS5jc3MoXCJ3aWR0aFwiLCBcIlwiKTtcclxuXHJcbiAgICB9XHJcbiAgICBjb25uZWN0UGFyc2VyKHBhcnNlcikge1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnBhcnNlciA9IHBhcnNlcjtcclxuICAgICAgICB2YXIgUGFyc2VyID0gY2xhc3Nlcy5nZXRDbGFzcyhcImphc3NpanNfZWRpdG9yLnV0aWwuUGFyc2VyXCIpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlciA9IG5ldyBQYXJzZXIoKTtcclxuICAgIH1cclxuICAgIGVkaXREaWFsb2coZW5hYmxlKSB7XHJcbiAgICAgICAgaWYgKGVuYWJsZSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgc3VwZXIuZWRpdERpYWxvZyhlbmFibGUpOyBcclxuXHJcbiAgICAgICAgICAgIHZhciByZXAgPSBuZXcgUERGUmVwb3J0KCk7XHJcbiAgICAgICAgICAgIC8vcmVwLmNvbnRlbnQ9dGhpcy5kZXNpZ25lZENvbXBvbmVudFtcImRlc2lnbl07XHJcblxyXG4gICAgICAgICAgICB2YXIgZGF0YTtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIGRhdGEgPSAoPFJlcG9ydERlc2lnbj50aGlzLl9jb2RlQ2hhbmdlci52YWx1ZSkudG9KU09OKCk7XHJcbiAgICAgICAgICAgICAgICByZXAudmFsdWUgPSBkYXRhOy8vVG9vbHMuY29weU9iamVjdChkYXRhKTsvLyBkZXNpZ25lZENvbXBvbmVudFtcImRlc2lnblwiXTtcclxuICAgICAgICAgICAgICAgIHJlcC5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICByZXAuZ2V0QmFzZTY0KCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGRmdmlld2VyLnJlcG9ydCA9IHJlcDtcclxuICAgICAgICAgICAgICAgICAgICAvL21ha2UgYSBjb3B5IGJlY2F1c2UgdGhlIGRhdGEgd291bGQgYmUgbW9kaWZpZWQgXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wZGZ2aWV3ZXIudmFsdWUgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XHJcbiAgICAgICAgICAgICAgICAvL3ZpZXdlci52YWx1ZSA9IGF3YWl0IHJlcC5nZXRCYXNlNjQoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbi8vICAgICAgICAgICAgdGhpcy5sYXN0VmlldyA9IHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdO1xyXG4gIC8vICAgICAgICAgIGlmICh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50cy5sZW5ndGggPiAwKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIucmVtb3ZlKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLmFkZCh0aGlzLnBkZnZpZXdlcik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIucmVtb3ZlKHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLmFkZCh0aGlzLmNvbXBvbmVudHZpZXdlcik7XHJcbiAgICAgICAgICAgIHN1cGVyLmVkaXREaWFsb2coZW5hYmxlKTtcclxuICAgICAgICB9IFxyXG4gICAgfVxyXG4gICBcclxuICAgIHByb3BlcnR5Q2hhbmdlZCgpIHtcclxuICAgICAgICB0aGlzLnByb3BlcnR5SXNDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci5zb3VyY2VGaWxlID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnVwZGF0ZVBhcnNlcigpO1xyXG4gICAgICAgIC8vQHRzLWlnbm9yZVxyXG4gICAgICAgIGxldCBqb2IgPSB0aGlzLmRlc2lnbmVkQ29tcG9uZW50LnRvSlNPTigpO1xyXG4gICAgICAgIGRlbGV0ZSBqb2IucGFyYW1ldGVyO1xyXG4gICAgICAgIGRlbGV0ZSBqb2IuZGF0YTtcclxuICAgICAgICBsZXQgb2IgPSBUb29scy5vYmplY3RUb0pzb24oam9iLCB1bmRlZmluZWQsIGZhbHNlLCA4MCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci52YXJpYWJsZXNbXCJyZXBvcnRkZXNpZ25cIl0pIHtcclxuICAgICAgICAgICAgdmFyIHMgPSB0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIuY29kZS5zdWJzdHJpbmcoMCwgdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLnZhcmlhYmxlc1tcInJlcG9ydGRlc2lnblwiXS5wb3MpICtcclxuICAgICAgICAgICAgICAgIFwiIHJlcG9ydGRlc2lnbiA9IFwiICsgb2IgKyB0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIuY29kZS5zdWJzdHJpbmcodGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLnZhcmlhYmxlc1tcInJlcG9ydGRlc2lnblwiXS5lbmQpO1xyXG4gICAgICAgICAgICB0aGlzLmNvZGVFZGl0b3IudmFsdWUgPSBzO1xyXG4gICAgICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xyXG4gICAgICAgICAgIFxyXG4gICAgICAgICAgICAvL3RoaXMuY2FsbEV2ZW50KFwiY29kZUNoYW5nZWRcIiwge30pO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci5zZXRQcm9wZXJ0eUluQ29kZShcInJlcG9ydGRlc2lnblwiLCBvYik7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIGNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpIHtcclxuICAgICAgICAvL3RoaXMudmFyaWFibGVzLnVwZGF0ZUNhY2hlKCk7XHJcbiAgICAgICAgLy90aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICB2YXIgcmV0ID0gc3VwZXIuY3JlYXRlQ29tcG9uZW50KHR5cGUsIGNvbXBvbmVudCwgdG9wLCBsZWZ0LCBuZXdQYXJlbnQsIGJlZm9yZUNvbXBvbmVudCk7XHJcbiAgICAgICAgLy90aGlzLmFkZFZhcmlhYmxlcyhyZXQsdHJ1ZSk7XHJcblxyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLnVwZGF0ZSgpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlDaGFuZ2VkKCk7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlSW52aXNpYmxlQ29tcG9uZW50cygpO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcbiAgICB9XHJcbiAgICAvL2NyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCB2YXJ2YWx1ZSkge1xyXG4gICAgY3JlYXRlVmFyaWFibGUodHlwZSwgc2NvcGUsIGNvbXBvbmVudDogQ29tcG9uZW50KTogc3RyaW5nIHtcclxuICAgICAgICB2YXIgbmFtZSA9IGNvbXBvbmVudFtcInJlcG9ydHR5cGVcIl07XHJcbiAgICAgICAgaWYgKHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlW25hbWVdID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV0gPSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm5leHRDb21wb25lbnR2YXJpYWJsZVtuYW1lXSsrO1xyXG4gICAgICAgIHZhciBzbmFtZSA9IGNvbXBvbmVudFtcIm5hbWVcIl07XHJcbiAgICAgICAgaWYgKHNuYW1lID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgc25hbWUgPSBuYW1lICsgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV07XHJcbiAgICAgICAgICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGNvbXBvbmVudFtcIl9fcHJvdG9fX1wiXSwgXCJuYW1lXCIpKSB7Ly93cml0ZSBiYWNrIHRoZSBuYW1lXHJcbiAgICAgICAgICAgICAgICBjb21wb25lbnRbXCJuYW1lXCJdID0gc25hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXMuYWRkVmFyaWFibGUoc25hbWUsIGNvbXBvbmVudCwgZmFsc2UpO1xyXG4gICAgICAgIHRoaXMuYWxsQ29tcG9uZW50c1tuYW1lICsgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV1dID0gY29tcG9uZW50O1xyXG4gICAgICAgIGlmIChjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXSkge1xyXG4gICAgICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGNvbXBvbmVudFtcIl9jb21wb25lbnRzXCJdLmxlbmd0aDsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVZhcmlhYmxlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXVt4XSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHNuYW1lO1xyXG5cclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICAqIEBtZW1iZXIge2phc3NpanMudWkuQ29tcG9uZW50fSAtIHRoZSBkZXNpZ25lZCBjb21wb25lbnRcclxuICAgICAgKi9cclxuICAgIHNldCBkZXNpZ25lZENvbXBvbmVudChjb21wb25lbnQ6IFJlcG9ydERlc2lnbikge1xyXG4gICAgICAgIHRoaXMuY29tcG9uZW50dmlld2VyPWNvbXBvbmVudDtcclxuICAgICAgICBpZih0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50cy5sZW5ndGg+MCYmdGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF09PT10aGlzLnBkZnZpZXdlcil7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLnJlbW92ZSh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSwgZmFsc2UpOy8vc2hvdWxkIG5vdCBiZSBkZXN0cm95ZWRcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9jcmVhdGUgX2NoaWxkcmVuXHJcbiAgICAgICAgUmVwb3J0RGVzaWduLmZyb21KU09OKGNvbXBvbmVudFtcImRlc2lnblwiXSwgY29tcG9uZW50KTtcclxuICAgICAgICAvL3BvcHVsYXRlIFZhcmlhYmxlc1xyXG4gICAgICAgIHRoaXMuYWxsQ29tcG9uZW50cyA9IHt9O1xyXG4gICAgICAgIHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlID0ge307XHJcbiAgICAgICAgdGhpcy5hbGxDb21wb25lbnRzW1widGhpc1wiXSA9IGNvbXBvbmVudDtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLnZhcmlhYmxlcy5hZGRWYXJpYWJsZShcInRoaXNcIiwgY29tcG9uZW50KTtcclxuICAgICAgICB0aGlzLmNyZWF0ZVZhcmlhYmxlKHVuZGVmaW5lZCwgdW5kZWZpbmVkLCA8Q29udGFpbmVyPmNvbXBvbmVudCk7XHJcbiAgICAgICAgdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyID0gdGhpcy5fcHJvcGVydHlFZGl0b3IucGFyc2VyO1xyXG4gICAgICAgICAvL0B0cy5pZ25vcmVcclxuICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci52YWx1ZSA9IGNvbXBvbmVudDtcclxuICAgICAgICBzdXBlci5kZXNpZ25lZENvbXBvbmVudCA9IGNvbXBvbmVudDtcclxuICAgICAgIFxyXG4gICAgICAgXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgICogdW5kbyBhY3Rpb25cclxuICAgICAgICovXHJcbiAgICB1bmRvKCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5fY29kZUVkaXRvci5fbWFpbi5sYXlvdXQpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IudW5kbygpO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuZXZhbENvZGUoKTtcclxuICAgIH1cclxuICAgIGdldCBkZXNpZ25lZENvbXBvbmVudCgpOiBSZXBvcnREZXNpZ24ge1xyXG4gICAgICAgIHJldHVybiA8UmVwb3J0RGVzaWduPnN1cGVyLmRlc2lnbmVkQ29tcG9uZW50O1xyXG4gICAgfVxyXG4gICAgLy8gICAgXHRfdGhpcy52YXJpYWJsZXMuYWRkVmFyaWFibGUoXCJ0aGlzXCIsIHJlcCk7XHJcbiAgICBnZXQgY29kZUVkaXRvcigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29kZUVkaXRvcjtcclxuICAgIH1cclxuICAgIF9pbnN0YWxsVmlldygpIHtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlID0gbmV3IENvbXBvbmVudFBhbGV0dGUoKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlLnNlcnZpY2UgPSBcIiRSZXBvcnRDb21wb25lbnRcIjtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9wcm9wZXJ0eUVkaXRvciwgXCJQcm9wZXJ0aWVzXCIsIFwicHJvcGVydGllc1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRFeHBsb3JlciwgXCJDb21wb25lbnRzXCIsIFwiY29tcG9uZW50c1wiKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmFkZCh0aGlzLl9jb21wb25lbnRQYWxldHRlLCBcIlBhbGV0dGVcIiwgXCJjb21wb25lbnRQYWxldHRlXCIpO1xyXG4gICAgICAgIGlmICh0aGlzLm1haW5MYXlvdXQpXHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVFZGl0b3IuX21haW4ubGF5b3V0ID0gdGhpcy5tYWluTGF5b3V0O1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgLy9cdHRoaXMuX2NvZGVDaGFuZ2VyLmRlc3Ryb3koKTtcclxuICAgICAgICB0aGlzLnBkZnZpZXdlci5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICBfaW5pdENvbXBvbmVudEV4cGxvcmVyKCkge1xyXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50RXhwbG9yZXIub25jbGljayhmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICB2YXIgb2IgPSBkYXRhLmRhdGE7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci52YWx1ZSA9IG9iO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLmdldENvbXBvbmVudE5hbWUgPSBmdW5jdGlvbiAoaXRlbSkge1xyXG4gICAgICAgICAgICB2YXIgdmFybmFtZSA9IF90aGlzLl9jb2RlRWRpdG9yLmdldFZhcmlhYmxlRnJvbU9iamVjdChpdGVtKTtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUgPT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhcm5hbWUuc3RhcnRzV2l0aChcInRoaXMuXCIpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWUuc3Vic3RyaW5nKDUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdmFybmFtZTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdDIoKSB7XHJcbiAgICB2YXIgcmVwID0gbmV3IFBERlJlcG9ydCgpO1xyXG4gICAgdmFyIGRlZiA9IHtcclxuXHJcbiAgICAgICAgY29udGVudDoge1xyXG4gICAgICAgICAgICBzdGFjazogW3tcclxuICAgICAgICAgICAgICAgIGNvbHVtbnM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcke2ludm9pY2UuY3VzdG9tZXIuZmlyc3RuYW1lfSAke2ludm9pY2UuY3VzdG9tZXIubGFzdG5hbWV9JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnJHtpbnZvaWNlLmN1c3RvbWVyLnN0cmVldH0nIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICcke2ludm9pY2UuY3VzdG9tZXIucGxhY2V9JyB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6IFtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJ0ludm9pY2UnLCBmb250U2l6ZTogMTggfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCIgXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJEYXRlOiAke2ludm9pY2UuZGF0ZX1cIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIk51bWJlcjogJHtpbnZvaWNlLm51bWJlcn1cIiwgYm9sZDogdHJ1ZSB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIiBcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiBcIiBcIiB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgaW52b2ljZToge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyOiAxMDAwLFxyXG4gICAgICAgICAgICAgICAgZGF0ZTogXCIyMC4wNy4yMDE4XCIsXHJcbiAgICAgICAgICAgICAgICBjdXN0b21lcjoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpcnN0bmFtZTogXCJIZW5yeVwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RuYW1lOiBcIktsYXVzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc3RyZWV0OiBcIkhhdXB0c3RyLiAxNTdcIixcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZTogXCJjaGVtbml0elwiXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgLy9cdGRlZi5jb250ZW50PXJlcGxhY2VUZW1wbGF0ZXMoZGVmLmNvbnRlbnQsZGVmLmRhdGEpO1xyXG4gICAgcmVwLnZhbHVlID0gZGVmO1xyXG4gICAgdmFyIHZpZXdlciA9IG5ldyBQREZWaWV3ZXIoKTtcclxuICAgIHZpZXdlci52YWx1ZSA9IGF3YWl0IHJlcC5nZXRCYXNlNjQoKTtcclxuICAgIHZpZXdlci5oZWlnaHQgPSBcIjIwMFwiO1xyXG4gICAgcmV0dXJuIHZpZXdlcjtcclxuXHJcbn07XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIHZhciBDb2RlRWRpdG9yID0gKGF3YWl0IGltcG9ydChcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JcIikpLkNvZGVFZGl0b3I7XHJcbiAgICB2YXIgZWRpdG9yID0gbmV3IENvZGVFZGl0b3IoKTtcclxuICAgIC8vdmFyIHVybCA9IFwiamFzc2lqc19lZGl0b3IvQWNlUGFuZWwudHNcIjtcclxuICAgIGVkaXRvci5oZWlnaHQgPSAzMDA7XHJcbiAgICBlZGl0b3Iud2lkdGggPSBcIjEwMCVcIjtcclxuICAgIC8vYXdhaXQgZWRpdG9yLm9wZW5GaWxlKHVybCk7XHJcbiAgICBlZGl0b3IudmFsdWUgPSBgaW1wb3J0IHsgUmVwb3J0RGVzaWduIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydERlc2lnblwiO1xyXG5cclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgU2FtcGxlUmVwb3J0IGV4dGVuZHMgUmVwb3J0RGVzaWduIHtcclxuICAgIG1lID0ge307XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xyXG4gICAgfVxyXG4gICAgYXN5bmMgc2V0ZGF0YSgpIHtcclxuICAgIH1cclxuICAgIGxheW91dChtZSkge1xyXG4gICAgICAgIHRoaXMuZGVzaWduID0geyBcImNvbnRlbnRcIjogeyBcInN0YWNrXCI6IFt7IFwidGV4dFwiOiBcIkhhbGxvXCIgfSwgeyBcInRleHRcIjogXCJva1wiIH0sIHsgXCJjb2x1bW5zXCI6IFt7IFwidGV4dFwiOiBcInRleHRcIiB9LCB7IFwidGV4dFwiOiBcInRleHRcIiB9XSB9XSB9IH07XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgZGxnID0gbmV3IFNhbXBsZVJlcG9ydCgpO1xyXG4gICAgcmV0dXJuIGRsZztcclxufVxyXG5cclxuYDtcclxuICAgIGVkaXRvci5ldmFsQ29kZSgpO1xyXG4gICAgcmV0dXJuIGVkaXRvcjtcclxuXHJcbn07Il19