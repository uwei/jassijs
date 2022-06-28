import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { PDFViewer } from "jassijs_report/PDFViewer";
import { Report } from "jassijs_report/Report";
import { PropertyEditor } from "jassijs/ui/PropertyEditor";
import { ClientReport, ClientReportParameter } from "jassijs_report/test/ClientReport";
import { PropertyEditorService } from "jassijs/base/PropertyEditorService";
import { ComponentDescriptor } from "jassijs/ui/ComponentDescriptor";
import { classes } from "jassijs/remote/Classes";
import { ServerReport } from "jassijs_report/test/ServerReport";


type Me = {
    boxpanel?: BoxPanel;
    pdfviewer?: PDFViewer;
    propertyeditor?: PropertyEditor;
};
@$Class("jassijs_report/ReportViewer")
export class ReportViewer extends Panel {
    me: Me;
    param;
    _value: Report;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    set value(val: Report) {
        this._value = val;
        var test = ComponentDescriptor.describe(val.constructor);
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
        val.getBase64().then((data) => {
            this.me.pdfviewer.value = data;
        });
        //ClientReportParameter();
    }
    layout(me: Me) {
        var _this = this;
        me.boxpanel = new BoxPanel();
        me.pdfviewer = new PDFViewer();
        me.propertyeditor = new PropertyEditor();
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
}
export async function test() {
    var ret = new ReportViewer();
    ret.value = new ServerReport();
    return ret;
}

