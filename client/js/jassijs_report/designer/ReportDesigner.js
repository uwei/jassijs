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
            var Parser = Classes_1.classes.getClass("jassijs_editor.base.Parser");
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
        Jassi_1.$Class("jassijs_report.designer.ReportDesigner"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0RGVzaWduZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaWpzX3JlcG9ydC9kZXNpZ25lci9SZXBvcnREZXNpZ25lci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBa0JBLElBQWEsY0FBYyxHQUEzQixNQUFhLGNBQWUsU0FBUSxxQ0FBaUI7UUFTakQ7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQVJaLHVCQUFrQixHQUFHLEtBQUssQ0FBQztZQUMzQixjQUFTLEdBQWMsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFJL0IsaUJBQVksR0FBbUIsU0FBUyxDQUFDO1lBQ2pELGVBQVUsR0FBVyw0NEZBQTQ0RixDQUFDO1lBSTk1RixJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsbUNBQW1DLENBQUM7UUFFL0QsQ0FBQztRQUNELElBQUksVUFBVSxDQUFDLEtBQUs7WUFDaEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7WUFDNUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLCtCQUFjLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSwrQkFBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDcEUsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxtQ0FBZ0IsRUFBRSxDQUFDO1lBQ2hELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLHFDQUFpQixDQUFD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eyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvSmFzc2lcIjtcclxuXHJcbmltcG9ydCB7IFByb3BlcnR5RWRpdG9yIH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlFZGl0b3JcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50RXhwbG9yZXIgfSBmcm9tIFwiamFzc2lqc19lZGl0b3IvQ29tcG9uZW50RXhwbG9yZXJcIjtcclxuaW1wb3J0IHsgQ29tcG9uZW50UGFsZXR0ZSB9IGZyb20gXCJqYXNzaWpzX2VkaXRvci9Db21wb25lbnRQYWxldHRlXCI7XHJcbmltcG9ydCB7IENvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvZGVFZGl0b3JJbnZpc2libGVDb21wb25lbnRzXCI7XHJcbmltcG9ydCB7IENvbXBvbmVudERlc2lnbmVyIH0gZnJvbSBcImphc3NpanNfZWRpdG9yL0NvbXBvbmVudERlc2lnbmVyXCI7XHJcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvQ2xhc3Nlc1wiO1xyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiamFzc2lqcy91aS9Db21wb25lbnRcIjtcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSBcImphc3NpanMvdWkvQ29udGFpbmVyXCI7XHJcbmltcG9ydCB7IFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcclxuaW1wb3J0IHsgUERGUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlJlcG9ydFwiO1xyXG5pbXBvcnQgeyBQREZWaWV3ZXIgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUERGVmlld2VyXCI7XHJcbmltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuaW1wb3J0IHsgVG9vbHMgfSBmcm9tIFwiamFzc2lqcy91dGlsL1Rvb2xzXCI7XHJcblxyXG5cclxuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0LmRlc2lnbmVyLlJlcG9ydERlc2lnbmVyXCIpXHJcbmV4cG9ydCBjbGFzcyBSZXBvcnREZXNpZ25lciBleHRlbmRzIENvbXBvbmVudERlc2lnbmVyIHtcclxuXHJcbiAgICBwcm9wZXJ0eUlzQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgIHBkZnZpZXdlcjogUERGVmlld2VyID0gbmV3IFBERlZpZXdlcigpO1xyXG4gICAgYWxsQ29tcG9uZW50czogeyBbbmFtZTogc3RyaW5nXTogQ29tcG9uZW50IH07XHJcbiAgICBuZXh0Q29tcG9uZW50dmFyaWFibGU6IHsgW3R5cDogc3RyaW5nXTogbnVtYmVyIH07XHJcbiAgICBjb21wb25lbnR2aWV3ZXI7XHJcbiAgICBwcml2YXRlIF9jb2RlQ2hhbmdlcjogUHJvcGVydHlFZGl0b3IgPSB1bmRlZmluZWQ7XHJcbiAgICBtYWluTGF5b3V0OiBzdHJpbmcgPSAne1wic2V0dGluZ3NcIjp7XCJoYXNIZWFkZXJzXCI6dHJ1ZSxcImNvbnN0cmFpbkRyYWdUb0NvbnRhaW5lclwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJzZWxlY3Rpb25FbmFibGVkXCI6ZmFsc2UsXCJwb3BvdXRXaG9sZVN0YWNrXCI6ZmFsc2UsXCJibG9ja2VkUG9wb3V0c1Rocm93RXJyb3JcIjp0cnVlLFwiY2xvc2VQb3BvdXRzT25VbmxvYWRcIjp0cnVlLFwic2hvd1BvcG91dEljb25cIjpmYWxzZSxcInNob3dNYXhpbWlzZUljb25cIjp0cnVlLFwic2hvd0Nsb3NlSWNvblwiOnRydWUsXCJyZXNwb25zaXZlTW9kZVwiOlwib25sb2FkXCJ9LFwiZGltZW5zaW9uc1wiOntcImJvcmRlcldpZHRoXCI6NSxcIm1pbkl0ZW1IZWlnaHRcIjoxMCxcIm1pbkl0ZW1XaWR0aFwiOjEwLFwiaGVhZGVySGVpZ2h0XCI6MjAsXCJkcmFnUHJveHlXaWR0aFwiOjMwMCxcImRyYWdQcm94eUhlaWdodFwiOjIwMH0sXCJsYWJlbHNcIjp7XCJjbG9zZVwiOlwiY2xvc2VcIixcIm1heGltaXNlXCI6XCJtYXhpbWlzZVwiLFwibWluaW1pc2VcIjpcIm1pbmltaXNlXCIsXCJwb3BvdXRcIjpcIm9wZW4gaW4gbmV3IHdpbmRvd1wiLFwicG9waW5cIjpcInBvcCBpblwiLFwidGFiRHJvcGRvd25cIjpcImFkZGl0aW9uYWwgdGFic1wifSxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwiY29sdW1uXCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImNvbnRlbnRcIjpbe1widHlwZVwiOlwicm93XCIsXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImhlaWdodFwiOjgxLjA0Mjk0MDY2MjU4OTg4LFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwid2lkdGhcIjo4MC41NzQ5MTI4OTE5ODYwNixcImhlaWdodFwiOjcxLjIzNTAzNDY1NjU4NDc2LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiQ29kZS4uXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvZGVcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvZGUuLlwiLFwibmFtZVwiOlwiY29kZVwifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfSx7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImRlc2lnblwiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiRGVzaWduXCIsXCJuYW1lXCI6XCJkZXNpZ25cIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfSx7XCJ0eXBlXCI6XCJjb2x1bW5cIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwid2lkdGhcIjoxOS40MjUwODcxMDgwMTM5NCxcImNvbnRlbnRcIjpbe1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6MTkuODQ0MzU3OTc2NjUzNjk3LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiUGFsZXR0ZVwiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCIsXCJjb21wb25lbnRTdGF0ZVwiOntcInRpdGxlXCI6XCJQYWxldHRlXCIsXCJuYW1lXCI6XCJjb21wb25lbnRQYWxldHRlXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwiaGVpZ2h0XCI6ODAuMTU1NjQyMDIzMzQ2MyxcImNvbnRlbnRcIjpbe1widGl0bGVcIjpcIlByb3BlcnRpZXNcIixcInR5cGVcIjpcImNvbXBvbmVudFwiLFwiY29tcG9uZW50TmFtZVwiOlwicHJvcGVydGllc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiUHJvcGVydGllc1wiLFwibmFtZVwiOlwicHJvcGVydGllc1wifSxcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlfV19XX1dfSx7XCJ0eXBlXCI6XCJyb3dcIixcImlzQ2xvc2FibGVcIjp0cnVlLFwicmVvcmRlckVuYWJsZWRcIjp0cnVlLFwidGl0bGVcIjpcIlwiLFwiaGVpZ2h0XCI6MTguOTU3MDU5MzM3NDEwMTIyLFwiY29udGVudFwiOlt7XCJ0eXBlXCI6XCJzdGFja1wiLFwiaGVhZGVyXCI6e30sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZSxcInRpdGxlXCI6XCJcIixcImFjdGl2ZUl0ZW1JbmRleFwiOjAsXCJoZWlnaHRcIjoxOC45NTcwNTkzMzc0MTAxMjIsXCJ3aWR0aFwiOjc3LjcwMDM0ODQzMjA1NTc1LFwiY29udGVudFwiOlt7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcInZhcmlhYmxlc1wiLFwiY29tcG9uZW50U3RhdGVcIjp7XCJ0aXRsZVwiOlwiVmFyaWFibGVzXCIsXCJuYW1lXCI6XCJ2YXJpYWJsZXNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX0se1widGl0bGVcIjpcIkVycm9yc1wiLFwidHlwZVwiOlwiY29tcG9uZW50XCIsXCJjb21wb25lbnROYW1lXCI6XCJlcnJvcnNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkVycm9yc1wiLFwibmFtZVwiOlwiZXJyb3JzXCJ9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWV9XX0se1widHlwZVwiOlwic3RhY2tcIixcImhlYWRlclwiOnt9LFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJhY3RpdmVJdGVtSW5kZXhcIjowLFwid2lkdGhcIjoyMi4yOTk2NTE1Njc5NDQyNTYsXCJjb250ZW50XCI6W3tcInRpdGxlXCI6XCJDb21wb25lbnRzXCIsXCJ0eXBlXCI6XCJjb21wb25lbnRcIixcImNvbXBvbmVudE5hbWVcIjpcImNvbXBvbmVudHNcIixcImNvbXBvbmVudFN0YXRlXCI6e1widGl0bGVcIjpcIkNvbXBvbmVudHNcIixcIm5hbWVcIjpcImNvbXBvbmVudHNcIn0sXCJpc0Nsb3NhYmxlXCI6dHJ1ZSxcInJlb3JkZXJFbmFibGVkXCI6dHJ1ZX1dfV19XX1dLFwiaXNDbG9zYWJsZVwiOnRydWUsXCJyZW9yZGVyRW5hYmxlZFwiOnRydWUsXCJ0aXRsZVwiOlwiXCIsXCJvcGVuUG9wb3V0c1wiOltdLFwibWF4aW1pc2VkSXRlbUlkXCI6bnVsbH0nO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLnRvb2x0aXAgPSBcInBkZiBwcmV2aWV3XCI7XHJcbiAgICAgICAgdGhpcy5lZGl0QnV0dG9uLmljb24gPSBcIm1kaSBtZGktMThweCBtZGktZmlsZS1wZGYtb3V0bGluZVwiO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG4gICAgc2V0IGNvZGVFZGl0b3IodmFsdWUpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IgPSB2YWx1ZTtcclxuICAgICAgICB0aGlzLnZhcmlhYmxlcyA9IHRoaXMuX2NvZGVFZGl0b3IudmFyaWFibGVzO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yID0gbmV3IFByb3BlcnR5RWRpdG9yKHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcclxuICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlciA9IG5ldyBQcm9wZXJ0eUVkaXRvcih0aGlzLl9jb2RlRWRpdG9yLCB1bmRlZmluZWQpO1xyXG4gICAgICAgIHRoaXMuX2Vycm9ycyA9IHRoaXMuX2NvZGVFZGl0b3IuX2Vycm9ycztcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRQYWxldHRlID0gbmV3IENvbXBvbmVudFBhbGV0dGUoKTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3JlciA9IG5ldyBDb21wb25lbnRFeHBsb3Jlcih2YWx1ZSwgdGhpcy5fcHJvcGVydHlFZGl0b3IpO1xyXG4gICAgICAgIHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMgPSBuZXcgQ29kZUVkaXRvckludmlzaWJsZUNvbXBvbmVudHModmFsdWUpO1xyXG4gICAgICAgIHRoaXMuYWRkKHRoaXMuX2ludmlzaWJsZUNvbXBvbmVudHMpO1xyXG4gICAgICAgIHRoaXMuX2luaXRDb21wb25lbnRFeHBsb3JlcigpO1xyXG4gICAgICAgIHRoaXMuX2luc3RhbGxWaWV3KCk7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fY29kZVBhbmVsLm9uYmx1cihmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgIF90aGlzLl9wcm9wZXJ0eUVkaXRvci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5yZWFkUHJvcGVydHlWYWx1ZUZyb21EZXNpZ24gPSB0cnVlO1xyXG5cclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5hZGRFdmVudChcInByb3BlcnR5Q2hhbmdlZFwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIF90aGlzLnByb3BlcnR5Q2hhbmdlZCgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLmFkZEV2ZW50KFwiY29kZUNoYW5nZWRcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBfdGhpcy5wcm9wZXJ0eUNoYW5nZWQoKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICAkKHRoaXMuX19kb20pLmFkZENsYXNzKFwiUmVwb3J0RGVzaWduZXJcIik7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwib3ZlcmZsb3dcIiwgXCJzY3JvbGxcIik7XHJcbiAgICAgICAgJCh0aGlzLmRvbSkuY3NzKFwid2lkdGhcIiwgXCJcIik7XHJcblxyXG4gICAgfVxyXG4gICAgY29ubmVjdFBhcnNlcihwYXJzZXIpIHtcclxuICAgICAgICB0aGlzLl9wcm9wZXJ0eUVkaXRvci5wYXJzZXIgPSBwYXJzZXI7XHJcbiAgICAgICAgdmFyIFBhcnNlciA9IGNsYXNzZXMuZ2V0Q2xhc3MoXCJqYXNzaWpzX2VkaXRvci5iYXNlLlBhcnNlclwiKTtcclxuICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIgPSBuZXcgUGFyc2VyKCk7XHJcbiAgICB9XHJcbiAgICBlZGl0RGlhbG9nKGVuYWJsZSkge1xyXG4gICAgICAgIGlmIChlbmFibGUgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmVkaXREaWFsb2coZW5hYmxlKTsgXHJcblxyXG4gICAgICAgICAgICB2YXIgcmVwID0gbmV3IFBERlJlcG9ydCgpO1xyXG4gICAgICAgICAgICAvL3JlcC5jb250ZW50PXRoaXMuZGVzaWduZWRDb21wb25lbnRbXCJkZXNpZ25dO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRhdGE7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBkYXRhID0gKDxSZXBvcnREZXNpZ24+dGhpcy5fY29kZUNoYW5nZXIudmFsdWUpLnRvSlNPTigpO1xyXG4gICAgICAgICAgICAgICAgcmVwLnZhbHVlID0gZGF0YTsvL1Rvb2xzLmNvcHlPYmplY3QoZGF0YSk7Ly8gZGVzaWduZWRDb21wb25lbnRbXCJkZXNpZ25cIl07XHJcbiAgICAgICAgICAgICAgICByZXAuZmlsbCgpO1xyXG4gICAgICAgICAgICAgICAgcmVwLmdldEJhc2U2NCgpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBkZnZpZXdlci5yZXBvcnQgPSByZXA7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9tYWtlIGEgY29weSBiZWNhdXNlIHRoZSBkYXRhIHdvdWxkIGJlIG1vZGlmaWVkIFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGRmdmlld2VyLnZhbHVlID0gZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xyXG4gICAgICAgICAgICAgICAgLy92aWV3ZXIudmFsdWUgPSBhd2FpdCByZXAuZ2V0QmFzZTY0KCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4vLyAgICAgICAgICAgIHRoaXMubGFzdFZpZXcgPSB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXTtcclxuICAvLyAgICAgICAgICBpZiAodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHMubGVuZ3RoID4gMClcclxuICAgICAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLnJlbW92ZSh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5hZGQodGhpcy5wZGZ2aWV3ZXIpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLnJlbW92ZSh0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5fY29tcG9uZW50c1swXSwgZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5hZGQodGhpcy5jb21wb25lbnR2aWV3ZXIpO1xyXG4gICAgICAgICAgICBzdXBlci5lZGl0RGlhbG9nKGVuYWJsZSk7XHJcbiAgICAgICAgfSBcclxuICAgIH1cclxuICAgXHJcbiAgICBwcm9wZXJ0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wZXJ0eUlzQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIuc291cmNlRmlsZSA9PT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICB0aGlzLl9jb2RlQ2hhbmdlci51cGRhdGVQYXJzZXIoKTtcclxuICAgICAgICAvL0B0cy1pZ25vcmVcclxuICAgICAgICBsZXQgam9iID0gdGhpcy5kZXNpZ25lZENvbXBvbmVudC50b0pTT04oKTtcclxuICAgICAgICBkZWxldGUgam9iLnBhcmFtZXRlcjtcclxuICAgICAgICBkZWxldGUgam9iLmRhdGE7XHJcbiAgICAgICAgbGV0IG9iID0gVG9vbHMub2JqZWN0VG9Kc29uKGpvYiwgdW5kZWZpbmVkLCBmYWxzZSwgODApO1xyXG4gICAgICAgIGlmICh0aGlzLl9jb2RlQ2hhbmdlci5wYXJzZXIudmFyaWFibGVzW1wicmVwb3J0ZGVzaWduXCJdKSB7XHJcbiAgICAgICAgICAgIHZhciBzID0gdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLmNvZGUuc3Vic3RyaW5nKDAsIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci52YXJpYWJsZXNbXCJyZXBvcnRkZXNpZ25cIl0ucG9zKSArXHJcbiAgICAgICAgICAgICAgICBcIiByZXBvcnRkZXNpZ24gPSBcIiArIG9iICsgdGhpcy5fY29kZUNoYW5nZXIucGFyc2VyLmNvZGUuc3Vic3RyaW5nKHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlci52YXJpYWJsZXNbXCJyZXBvcnRkZXNpZ25cIl0uZW5kKTtcclxuICAgICAgICAgICAgdGhpcy5jb2RlRWRpdG9yLnZhbHVlID0gcztcclxuICAgICAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIudXBkYXRlUGFyc2VyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcclxuICAgICAgICAgICBcclxuICAgICAgICAgICAgLy90aGlzLmNhbGxFdmVudChcImNvZGVDaGFuZ2VkXCIsIHt9KTtcclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIuc2V0UHJvcGVydHlJbkNvZGUoXCJyZXBvcnRkZXNpZ25cIiwgb2IpO1xyXG4gICAgICAgIHRoaXMucHJvcGVydHlJc0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBjcmVhdGVDb21wb25lbnQodHlwZSwgY29tcG9uZW50LCB0b3AsIGxlZnQsIG5ld1BhcmVudCwgYmVmb3JlQ29tcG9uZW50KSB7XHJcbiAgICAgICAgLy90aGlzLnZhcmlhYmxlcy51cGRhdGVDYWNoZSgpO1xyXG4gICAgICAgIC8vdGhpcy5fY29tcG9uZW50RXhwbG9yZXIudXBkYXRlKCk7XHJcbiAgICAgICAgdmFyIHJldCA9IHN1cGVyLmNyZWF0ZUNvbXBvbmVudCh0eXBlLCBjb21wb25lbnQsIHRvcCwgbGVmdCwgbmV3UGFyZW50LCBiZWZvcmVDb21wb25lbnQpO1xyXG4gICAgICAgIC8vdGhpcy5hZGRWYXJpYWJsZXMocmV0LHRydWUpO1xyXG5cclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci51cGRhdGUoKTtcclxuICAgICAgICB0aGlzLnByb3BlcnR5Q2hhbmdlZCgpO1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZUludmlzaWJsZUNvbXBvbmVudHMoKTtcclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG4gICAgLy9jcmVhdGVWYXJpYWJsZSh0eXBlLCBzY29wZSwgdmFydmFsdWUpIHtcclxuICAgIGNyZWF0ZVZhcmlhYmxlKHR5cGUsIHNjb3BlLCBjb21wb25lbnQ6IENvbXBvbmVudCk6IHN0cmluZyB7XHJcbiAgICAgICAgdmFyIG5hbWUgPSBjb21wb25lbnRbXCJyZXBvcnR0eXBlXCJdO1xyXG4gICAgICAgIGlmICh0aGlzLm5leHRDb21wb25lbnR2YXJpYWJsZVtuYW1lXSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlW25hbWVdID0gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5uZXh0Q29tcG9uZW50dmFyaWFibGVbbmFtZV0rKztcclxuICAgICAgICB2YXIgc25hbWUgPSBjb21wb25lbnRbXCJuYW1lXCJdO1xyXG4gICAgICAgIGlmIChzbmFtZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHNuYW1lID0gbmFtZSArIHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb21wb25lbnRbXCJfX3Byb3RvX19cIl0sIFwibmFtZVwiKSkgey8vd3JpdGUgYmFjayB0aGUgbmFtZVxyXG4gICAgICAgICAgICAgICAgY29tcG9uZW50W1wibmFtZVwiXSA9IHNuYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NvZGVFZGl0b3IudmFyaWFibGVzLmFkZFZhcmlhYmxlKHNuYW1lLCBjb21wb25lbnQsIGZhbHNlKTtcclxuICAgICAgICB0aGlzLmFsbENvbXBvbmVudHNbbmFtZSArIHRoaXMubmV4dENvbXBvbmVudHZhcmlhYmxlW25hbWVdXSA9IGNvbXBvbmVudDtcclxuICAgICAgICBpZiAoY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl0pIHtcclxuICAgICAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCBjb21wb25lbnRbXCJfY29tcG9uZW50c1wiXS5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jcmVhdGVWYXJpYWJsZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgY29tcG9uZW50W1wiX2NvbXBvbmVudHNcIl1beF0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBzbmFtZTtcclxuXHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAgKiBAbWVtYmVyIHtqYXNzaWpzLnVpLkNvbXBvbmVudH0gLSB0aGUgZGVzaWduZWQgY29tcG9uZW50XHJcbiAgICAgICovXHJcbiAgICBzZXQgZGVzaWduZWRDb21wb25lbnQoY29tcG9uZW50OiBSZXBvcnREZXNpZ24pIHtcclxuICAgICAgICB0aGlzLmNvbXBvbmVudHZpZXdlcj1jb21wb25lbnQ7XHJcbiAgICAgICAgaWYodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHMubGVuZ3RoPjAmJnRoaXMuX2Rlc2lnblBsYWNlaG9sZGVyLl9jb21wb25lbnRzWzBdPT09dGhpcy5wZGZ2aWV3ZXIpe1xyXG4gICAgICAgICAgICB0aGlzLl9kZXNpZ25QbGFjZWhvbGRlci5yZW1vdmUodGhpcy5fZGVzaWduUGxhY2Vob2xkZXIuX2NvbXBvbmVudHNbMF0sIGZhbHNlKTsvL3Nob3VsZCBub3QgYmUgZGVzdHJveWVkXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vY3JlYXRlIF9jaGlsZHJlblxyXG4gICAgICAgIFJlcG9ydERlc2lnbi5mcm9tSlNPTihjb21wb25lbnRbXCJkZXNpZ25cIl0sIGNvbXBvbmVudCk7XHJcbiAgICAgICAgLy9wb3B1bGF0ZSBWYXJpYWJsZXNcclxuICAgICAgICB0aGlzLmFsbENvbXBvbmVudHMgPSB7fTtcclxuICAgICAgICB0aGlzLm5leHRDb21wb25lbnR2YXJpYWJsZSA9IHt9O1xyXG4gICAgICAgIHRoaXMuYWxsQ29tcG9uZW50c1tcInRoaXNcIl0gPSBjb21wb25lbnQ7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci52YXJpYWJsZXMuYWRkVmFyaWFibGUoXCJ0aGlzXCIsIGNvbXBvbmVudCk7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVWYXJpYWJsZSh1bmRlZmluZWQsIHVuZGVmaW5lZCwgPENvbnRhaW5lcj5jb21wb25lbnQpO1xyXG4gICAgICAgIHRoaXMuX3Byb3BlcnR5RWRpdG9yLnZhbHVlID0gY29tcG9uZW50O1xyXG4gICAgICAgIHRoaXMuX2NvZGVDaGFuZ2VyLnBhcnNlciA9IHRoaXMuX3Byb3BlcnR5RWRpdG9yLnBhcnNlcjtcclxuICAgICAgICAgLy9AdHMuaWdub3JlXHJcbiAgICAgICAgdGhpcy5fY29kZUNoYW5nZXIudmFsdWUgPSBjb21wb25lbnQ7XHJcbiAgICAgICAgc3VwZXIuZGVzaWduZWRDb21wb25lbnQgPSBjb21wb25lbnQ7XHJcbiAgICAgICBcclxuICAgICAgIFxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgICAqIHVuZG8gYWN0aW9uXHJcbiAgICAgICAqL1xyXG4gICAgdW5kbygpIHtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHRoaXMuX2NvZGVFZGl0b3IuX21haW4ubGF5b3V0KTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLnVuZG8oKTtcclxuICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLmV2YWxDb2RlKCk7XHJcbiAgICB9XHJcbiAgICBnZXQgZGVzaWduZWRDb21wb25lbnQoKTogUmVwb3J0RGVzaWduIHtcclxuICAgICAgICByZXR1cm4gPFJlcG9ydERlc2lnbj5zdXBlci5kZXNpZ25lZENvbXBvbmVudDtcclxuICAgIH1cclxuICAgIC8vICAgIFx0X3RoaXMudmFyaWFibGVzLmFkZFZhcmlhYmxlKFwidGhpc1wiLCByZXApO1xyXG4gICAgZ2V0IGNvZGVFZGl0b3IoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvZGVFZGl0b3I7XHJcbiAgICB9XHJcbiAgICBfaW5zdGFsbFZpZXcoKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZSA9IG5ldyBDb21wb25lbnRQYWxldHRlKCk7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50UGFsZXR0ZS5zZXJ2aWNlID0gXCIkUmVwb3J0Q29tcG9uZW50XCI7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5hZGQodGhpcy5fcHJvcGVydHlFZGl0b3IsIFwiUHJvcGVydGllc1wiLCBcInByb3BlcnRpZXNcIik7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5hZGQodGhpcy5fY29tcG9uZW50RXhwbG9yZXIsIFwiQ29tcG9uZW50c1wiLCBcImNvbXBvbmVudHNcIik7XHJcbiAgICAgICAgdGhpcy5fY29kZUVkaXRvci5fbWFpbi5hZGQodGhpcy5fY29tcG9uZW50UGFsZXR0ZSwgXCJQYWxldHRlXCIsIFwiY29tcG9uZW50UGFsZXR0ZVwiKTtcclxuICAgICAgICBpZiAodGhpcy5tYWluTGF5b3V0KVxyXG4gICAgICAgICAgICB0aGlzLl9jb2RlRWRpdG9yLl9tYWluLmxheW91dCA9IHRoaXMubWFpbkxheW91dDtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIC8vXHR0aGlzLl9jb2RlQ2hhbmdlci5kZXN0cm95KCk7XHJcbiAgICAgICAgdGhpcy5wZGZ2aWV3ZXIuZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgX2luaXRDb21wb25lbnRFeHBsb3JlcigpIHtcclxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudEV4cGxvcmVyLm9uY2xpY2soZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgdmFyIG9iID0gZGF0YS5kYXRhO1xyXG4gICAgICAgICAgICBfdGhpcy5fcHJvcGVydHlFZGl0b3IudmFsdWUgPSBvYjtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLl9jb21wb25lbnRFeHBsb3Jlci5nZXRDb21wb25lbnROYW1lID0gZnVuY3Rpb24gKGl0ZW0pIHtcclxuICAgICAgICAgICAgdmFyIHZhcm5hbWUgPSBfdGhpcy5fY29kZUVkaXRvci5nZXRWYXJpYWJsZUZyb21PYmplY3QoaXRlbSk7XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lID09PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YXJuYW1lLnN0YXJ0c1dpdGgoXCJ0aGlzLlwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YXJuYW1lLnN1YnN0cmluZyg1KTtcclxuICAgICAgICAgICAgcmV0dXJuIHZhcm5hbWU7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QyKCkge1xyXG4gICAgdmFyIHJlcCA9IG5ldyBQREZSZXBvcnQoKTtcclxuICAgIHZhciBkZWYgPSB7XHJcblxyXG4gICAgICAgIGNvbnRlbnQ6IHtcclxuICAgICAgICAgICAgc3RhY2s6IFt7XHJcbiAgICAgICAgICAgICAgICBjb2x1bW5zOiBbXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFjazogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnJHtpbnZvaWNlLmN1c3RvbWVyLmZpcnN0bmFtZX0gJHtpbnZvaWNlLmN1c3RvbWVyLmxhc3RuYW1lfScgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogJyR7aW52b2ljZS5jdXN0b21lci5zdHJlZXR9JyB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0ZXh0OiAnJHtpbnZvaWNlLmN1c3RvbWVyLnBsYWNlfScgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YWNrOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6ICdJbnZvaWNlJywgZm9udFNpemU6IDE4IH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiIFwiIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHRleHQ6IFwiRGF0ZTogJHtpbnZvaWNlLmRhdGV9XCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCJOdW1iZXI6ICR7aW52b2ljZS5udW1iZXJ9XCIsIGJvbGQ6IHRydWUgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCIgXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGV4dDogXCIgXCIgfSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgXVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgIGludm9pY2U6IHtcclxuICAgICAgICAgICAgICAgIG51bWJlcjogMTAwMCxcclxuICAgICAgICAgICAgICAgIGRhdGU6IFwiMjAuMDcuMjAxOFwiLFxyXG4gICAgICAgICAgICAgICAgY3VzdG9tZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICBmaXJzdG5hbWU6IFwiSGVucnlcIixcclxuICAgICAgICAgICAgICAgICAgICBsYXN0bmFtZTogXCJLbGF1c1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHN0cmVldDogXCJIYXVwdHN0ci4gMTU3XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2U6IFwiY2hlbW5pdHpcIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIC8vXHRkZWYuY29udGVudD1yZXBsYWNlVGVtcGxhdGVzKGRlZi5jb250ZW50LGRlZi5kYXRhKTtcclxuICAgIHJlcC52YWx1ZSA9IGRlZjtcclxuICAgIHZhciB2aWV3ZXIgPSBuZXcgUERGVmlld2VyKCk7XHJcbiAgICB2aWV3ZXIudmFsdWUgPSBhd2FpdCByZXAuZ2V0QmFzZTY0KCk7XHJcbiAgICB2aWV3ZXIuaGVpZ2h0ID0gXCIyMDBcIjtcclxuICAgIHJldHVybiB2aWV3ZXI7XHJcblxyXG59O1xyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICB2YXIgQ29kZUVkaXRvciA9IChhd2FpdCBpbXBvcnQoXCJqYXNzaWpzX2VkaXRvci9Db2RlRWRpdG9yXCIpKS5Db2RlRWRpdG9yO1xyXG4gICAgdmFyIGVkaXRvciA9IG5ldyBDb2RlRWRpdG9yKCk7XHJcbiAgICAvL3ZhciB1cmwgPSBcImphc3NpanNfZWRpdG9yL0FjZVBhbmVsLnRzXCI7XHJcbiAgICBlZGl0b3IuaGVpZ2h0ID0gMzAwO1xyXG4gICAgZWRpdG9yLndpZHRoID0gXCIxMDAlXCI7XHJcbiAgICAvL2F3YWl0IGVkaXRvci5vcGVuRmlsZSh1cmwpO1xyXG4gICAgZWRpdG9yLnZhbHVlID0gYGltcG9ydCB7IFJlcG9ydERlc2lnbiB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9SZXBvcnREZXNpZ25cIjtcclxuXHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFNhbXBsZVJlcG9ydCBleHRlbmRzIFJlcG9ydERlc2lnbiB7XHJcbiAgICBtZSA9IHt9O1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLmxheW91dCh0aGlzLm1lKTtcclxuICAgIH1cclxuICAgIGFzeW5jIHNldGRhdGEoKSB7XHJcbiAgICB9XHJcbiAgICBsYXlvdXQobWUpIHtcclxuICAgICAgICB0aGlzLmRlc2lnbiA9IHsgXCJjb250ZW50XCI6IHsgXCJzdGFja1wiOiBbeyBcInRleHRcIjogXCJIYWxsb1wiIH0sIHsgXCJ0ZXh0XCI6IFwib2tcIiB9LCB7IFwiY29sdW1uc1wiOiBbeyBcInRleHRcIjogXCJ0ZXh0XCIgfSwgeyBcInRleHRcIjogXCJ0ZXh0XCIgfV0gfV0gfSB9O1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgdmFyIGRsZyA9IG5ldyBTYW1wbGVSZXBvcnQoKTtcclxuICAgIHJldHVybiBkbGc7XHJcbn1cclxuXHJcbmA7XHJcbiAgICBlZGl0b3IuZXZhbENvZGUoKTtcclxuICAgIHJldHVybiBlZGl0b3I7XHJcblxyXG59OyJdfQ==