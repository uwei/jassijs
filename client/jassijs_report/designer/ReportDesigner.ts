import jassijs, { $Class } from "jassijs/remote/Jassi";

import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { ComponentExplorer } from "jassijs_editor/ComponentExplorer";
import { ComponentPalette } from "jassijs_editor/ComponentPalette";
import { CodeEditorInvisibleComponents } from "jassijs_editor/CodeEditorInvisibleComponents";
import { ComponentDesigner } from "jassijs_editor/ComponentDesigner";
import { classes } from "jassijs/remote/Classes";
import { Component } from "jassijs/ui/Component";
import { Container } from "jassijs/ui/Container";
import { Property } from "jassijs/ui/Property";
import { PDFReport } from "jassijs_report/PDFReport";
import { PDFViewer } from "jassijs_report/PDFViewer";
import { ReportDesign } from "jassijs_report/ReportDesign";
import { Tools } from "jassijs/util/Tools";


@$Class("jassijs_report.designer.ReportDesigner")
export class ReportDesigner extends ComponentDesigner {
    constructor() {
        super();
       
        this.editButton.tooltip = "pdf preview";
        this.editButton.icon = "mdi mdi-18px mdi-file-pdf-outline";

    }
    propertyIsChanging = false;
    pdfviewer: PDFViewer = new PDFViewer();
    allComponents: { [name: string]: Component };
    nextComponentvariable: { [typ: string]: number };
    lastView: Component = undefined;
    private _codeChanger: PropertyEditor = undefined;
    mainLayout: string = '{"settings":{"hasHeaders":true,"constrainDragToContainer":true,"reorderEnabled":true,"selectionEnabled":false,"popoutWholeStack":false,"blockedPopoutsThrowError":true,"closePopoutsOnUnload":true,"showPopoutIcon":false,"showMaximiseIcon":true,"showCloseIcon":true,"responsiveMode":"onload"},"dimensions":{"borderWidth":5,"minItemHeight":10,"minItemWidth":10,"headerHeight":20,"dragProxyWidth":300,"dragProxyHeight":200},"labels":{"close":"close","maximise":"maximise","minimise":"minimise","popout":"open in new window","popin":"pop in","tabDropdown":"additional tabs"},"content":[{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","content":[{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":81.04294066258988,"content":[{"type":"stack","width":80.57491289198606,"height":71.23503465658476,"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"content":[{"title":"Code..","type":"component","componentName":"code","componentState":{"title":"Code..","name":"code"},"isClosable":true,"reorderEnabled":true},{"title":"Design","type":"component","componentName":"design","componentState":{"title":"Design","name":"design"},"isClosable":true,"reorderEnabled":true}]},{"type":"column","isClosable":true,"reorderEnabled":true,"title":"","width":19.42508710801394,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":19.844357976653697,"content":[{"title":"Palette","type":"component","componentName":"componentPalette","componentState":{"title":"Palette","name":"componentPalette"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":80.1556420233463,"content":[{"title":"Properties","type":"component","componentName":"properties","componentState":{"title":"Properties","name":"properties"},"isClosable":true,"reorderEnabled":true}]}]}]},{"type":"row","isClosable":true,"reorderEnabled":true,"title":"","height":18.957059337410122,"content":[{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"height":18.957059337410122,"width":77.70034843205575,"content":[{"title":"Variables","type":"component","componentName":"variables","componentState":{"title":"Variables","name":"variables"},"isClosable":true,"reorderEnabled":true},{"title":"Errors","type":"component","componentName":"errors","componentState":{"title":"Errors","name":"errors"},"isClosable":true,"reorderEnabled":true}]},{"type":"stack","header":{},"isClosable":true,"reorderEnabled":true,"title":"","activeItemIndex":0,"width":22.299651567944256,"content":[{"title":"Components","type":"component","componentName":"components","componentState":{"title":"Components","name":"components"},"isClosable":true,"reorderEnabled":true}]}]}]}],"isClosable":true,"reorderEnabled":true,"title":"","openPopouts":[],"maximisedItemId":null}';
    set codeEditor(value) {
        var _this = this;
        this._codeEditor = value;
        this.variables = this._codeEditor.variables;
        this._propertyEditor = new PropertyEditor(undefined, undefined);
        this._codeChanger = new PropertyEditor(this._codeEditor, undefined);
        this._errors = this._codeEditor._errors;
        this._componentPalette = new ComponentPalette();
        this._componentExplorer = new ComponentExplorer(value, this._propertyEditor);
        this._invisibleComponents = new CodeEditorInvisibleComponents(value);
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
        var Parser = classes.getClass("jassijs_editor.base.Parser");
        this._codeChanger.parser = new Parser();
    }
    editDialog(enable) {

        if (enable === false) {
            super.editDialog(enable);
            var rep = new PDFReport();
            //rep.content=this.designedComponent["design];
            var data;
            try {
                data = (<ReportDesign>this._codeChanger.value).toJSON();
                rep.value = data;//Tools.copyObject(data);// designedComponent["design"];
                rep.fill();
                rep.getBase64().then((data) => {
                    this.pdfviewer.report = rep;
                    //make a copy because the data would be modified 
                    this.pdfviewer.value = data;
                })
            } catch (err) {
                console.error(err);
                //viewer.value = await rep.getBase64();

            }

            this.lastView = this._designPlaceholder._components[0];
            if (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
            this._designPlaceholder.add(this.pdfviewer);
        } else if (this.lastView) {
            if (this._designPlaceholder._components.length > 0)
                this._designPlaceholder.remove(this._designPlaceholder._components[0], false);
            this._designPlaceholder.add(this.lastView);
            this.lastView = undefined;
            super.editDialog(enable);
        } else
            super.editDialog(enable);
    }
    propertyChanged() {
        this.propertyIsChanging = true;
        if (this._codeChanger.parser.sourceFile === undefined)
            this._codeChanger.updateParser();
        //@ts-ignore
        let job = this.designedComponent.toJSON();
        delete job.parameter;
        delete job.data;
        let ob = Tools.objectToJson(job, undefined, false, 80);
        if (this._codeChanger.parser.variables["reportdesign"]) {
            var s = this._codeChanger.parser.code.substring(0, this._codeChanger.parser.variables["reportdesign"].pos) +
                " reportdesign = " + ob + this._codeChanger.parser.code.substring(this._codeChanger.parser.variables["reportdesign"].end);
            this.codeEditor.value = s;
            this._codeChanger.updateParser();
            this._codeChanger.callEvent("codeChanged", {});
            //this.callEvent("codeChanged", {});
        } else
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
    createVariable(type, scope, component: Component): string {
        var name = component["reporttype"];
        if (this.nextComponentvariable[name] === undefined) {
            this.nextComponentvariable[name] = 0;
        }
        this.nextComponentvariable[name]++;
        var sname = component["name"];
        if (sname === undefined) {
            sname = name + this.nextComponentvariable[name];
            if (Object.getOwnPropertyDescriptor(component["__proto__"], "name")) {//write back the name
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
    set designedComponent(component: ReportDesign) {
        //create _children
        ReportDesign.fromJSON(component["design"], component);
        //populate Variables
        this.allComponents = {};
        this.nextComponentvariable = {};
        this.allComponents["this"] = component;
        this._codeEditor.variables.addVariable("this", component);
        this.createVariable(undefined, undefined, <Container>component);
        this._propertyEditor.value = component;
        this._codeChanger.parser = this._propertyEditor.parser;
        super.designedComponent = component;
        //@ts.ignore
        this._codeChanger.value = component;

    }
    /**
       * undo action
       */
    undo() {
        this._codeEditor.undo();
        this._codeEditor.evalCode();
    }
    get designedComponent(): ReportDesign {
        return <ReportDesign>super.designedComponent;
    }
    //    	_this.variables.addVariable("this", rep);
    get codeEditor() {
        return this._codeEditor;
    }
    _installView() {
        this._componentPalette = new ComponentPalette();
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
}

export async function test2() {
    var rep = new PDFReport();
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
    var viewer = new PDFViewer();
    viewer.value = await rep.getBase64();
    viewer.height = "200";
    return viewer;

};

export async function test() {
    var CodeEditor = (await import("jassijs_editor/CodeEditor")).CodeEditor;
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

};