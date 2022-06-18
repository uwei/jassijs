var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs_report/ReportDesign", "jassijs/ui/DockingContainer", "jassijs/remote/Registry", "jassijs/ui/PropertyEditor", "jassijs_editor/ComponentExplorer", "jassijs_editor/ComponentPalette", "jassijs_editor/CodeEditorInvisibleComponents", "jassijs_editor/ComponentDesigner", "jassijs_report/PDFReport", "jassijs_report/PDFViewer", "jassijs/util/Tools", "jassijs_editor/util/Parser", "jassijs/ui/VariablePanel", "jassijs/ui/Panel"], function (require, exports, ReportDesign_1, DockingContainer_1, Registry_1, PropertyEditor_1, ComponentExplorer_1, ComponentPalette_1, CodeEditorInvisibleComponents_1, ComponentDesigner_1, PDFReport_1, PDFViewer_1, Tools_1, Parser_1, VariablePanel_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SimpleReportDesigner = void 0;
    let SimpleReportDesigner = class SimpleReportDesigner extends ComponentDesigner_1.ComponentDesigner {
        constructor() {
            super();
            this.pdfviewer = new PDFViewer_1.PDFViewer();
            this.lastView = undefined;
            this._codeChanger = undefined;
            this.mainLayout = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
        }
        set codeEditor(value) {
            var _this = this;
            this._codeEditor = value;
            this.variables = this._codeEditor.variables;
            this._propertyEditor = new PropertyEditor_1.PropertyEditor(undefined, new Parser_1.Parser());
            this._codeChanger = new PropertyEditor_1.PropertyEditor(this._codeEditor, new Parser_1.Parser());
            this._errors = this._codeEditor._errors;
            this._componentPalette = new ComponentPalette_1.ComponentPalette();
            this._componentExplorer = new ComponentExplorer_1.ComponentExplorer(value, this._propertyEditor);
            this._invisibleComponents = new CodeEditorInvisibleComponents_1.CodeEditorInvisibleComponents(value);
            this.add(this._invisibleComponents);
            this._initComponentExplorer();
            this._installView();
            this._propertyEditor.readPropertyValueFromDesign = true;
            this._propertyEditor.addEvent("propertyChanged", function () {
                _this.propertyChanged();
            });
            this._propertyEditor.addEvent("codeChanged", function () {
                _this.propertyChanged();
            });
            this.dom.classList.add("ReportDesigner");
            this.dom.style.overflow = "scroll";
            this.dom.style.width = "";
        }
        editDialog(enable) {
            if (enable === false) {
                super.editDialog(enable);
                var rep = new PDFReport_1.PDFReport();
                //rep.content=this.designedComponent["design];
                var data = this._codeChanger.value.toJSON();
                rep.value = data; //Tools.copyObject(data);// designedComponent["design"];
                rep.fill();
                //viewer.value = await rep.getBase64();
                rep.getBase64().then((data) => {
                    this.pdfviewer.report = rep;
                    //make a copy because the data would be modified 
                    this.pdfviewer.value = data;
                });
                this.lastView = this._designPlaceholder._components[0];
                if (this._designPlaceholder._components.length > 0)
                    this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.pdfviewer);
            }
            else if (this.lastView) {
                if (this._designPlaceholder._components.length > 0)
                    this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
                this._designPlaceholder.add(this.lastView);
                this.lastView = undefined;
                super.editDialog(enable);
            }
            else
                super.editDialog(enable);
        }
        propertyChanged() {
            if (this._codeChanger.parser.sourceFile === undefined)
                this._codeChanger.updateParser();
            //@ts-ignore
            let job = this.designedComponent.toJSON();
            delete job.parameter;
            delete job.data;
            let ob = Tools_1.Tools.objectToJson(job, undefined, false);
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
        }
        createComponent(type, component, top, left, newParent, beforeComponent) {
            //this.variables.updateCache();
            //this._componentExplorer.update();
            var ret = super.createComponent(type, component, top, left, newParent, beforeComponent);
            this.addVariables(ret);
            this._componentExplorer.update();
            this.propertyChanged();
            return ret;
        }
        addVariables(component) {
            var name = component["reporttype"];
            if (this.nextComponentvariable[name] === undefined) {
                this.nextComponentvariable[name] = 0;
            }
            this.nextComponentvariable[name]++;
            this._codeEditor.variables.addVariable(name + this.nextComponentvariable[name], component);
            this.allComponents[name + this.nextComponentvariable[name]] = component;
            if (component["_components"]) {
                for (let x = 0; x < component["_components"].length; x++) {
                    this.addVariables(component["_components"][x]);
                }
            }
        }
        /**
          * @member {jassijs.ui.Component} - the designed component
          */
        set designedComponent(component) {
            //create _children
            ReportDesign_1.ReportDesign.fromJSON(component["design"], component);
            //populate Variables
            this.allComponents = {};
            this.nextComponentvariable = {};
            this.allComponents["this"] = component;
            this._codeEditor.variables.addVariable("this", component);
            this.addVariables(component);
            this._propertyEditor.value = component;
            this._codeChanger.parser = this._propertyEditor.parser;
            super.designedComponent = component;
            //@ts.ignore
            this._codeChanger.value = component;
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
            // if(this.mainLayout)
            //   this._codeEditor._main.layout = this.mainLayout;
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
    SimpleReportDesigner = __decorate([
        (0, Registry_1.$Class)("jassijs_report.designer.ReportDesigner"),
        __metadata("design:paramtypes", [])
    ], SimpleReportDesigner);
    exports.SimpleReportDesigner = SimpleReportDesigner;
    class Main extends Panel_1.Panel {
        constructor() {
            super();
            this._main = new DockingContainer_1.DockingContainer();
            this.variables = new VariablePanel_1.VariablePanel();
            this.add(this._main);
            this._main.width = "calc(100% - 1px)";
            this._main.height = "99%";
        }
        getVariablesForType() {
            return [];
        }
        ;
        getVariableFromObject(ob) {
            return this.variables.getVariableFromObject(ob);
        }
        destroy() {
            this._main.destroy();
            super.destroy();
        }
    }
    function test() {
        var rep = new ReportDesign_1.ReportDesign();
        var designer = new SimpleReportDesigner();
        designer["codeEditor"] = new Main();
        designer["codeEditor"]._main.add(designer, "Design", "design");
        rep.design = {
            content: [
                {
                    text: "Hallo Herr ${nachname}"
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
            ]
        };
        designer["designedComponent"] = rep;
        //this.width = 871;
        //this.height = 10;
        designer._installView();
        designer.codeEditor._main.width = "100%";
        designer.codeEditor._main.height = "400";
        // designer["designedComponent"]=rep;
        return designer["codeEditor"];
    }
    exports.test = test;
});
//# sourceMappingURL=SimpleReportDesigner.js.map