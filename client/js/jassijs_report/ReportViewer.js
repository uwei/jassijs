var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_report/PDFViewer", "jassijs/ui/PropertyEditor", "jassijs/ui/ComponentDescriptor", "jassijs_report/test/ServerReport"], function (require, exports, BoxPanel_1, Registry_1, Panel_1, PDFViewer_1, PropertyEditor_1, ComponentDescriptor_1, ServerReport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ReportViewer = void 0;
    let ReportViewer = class ReportViewer extends Panel_1.Panel {
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
            me.boxpanel = new BoxPanel_1.BoxPanel();
            me.pdfviewer = new PDFViewer_1.PDFViewer();
            me.propertyeditor = new PropertyEditor_1.PropertyEditor();
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
    ReportViewer = __decorate([
        (0, Registry_1.$Class)("jassijs_report/ReportViewer"),
        __metadata("design:paramtypes", [])
    ], ReportViewer);
    exports.ReportViewer = ReportViewer;
    async function test() {
        var ret = new ReportViewer();
        ret.value = new ServerReport_1.ServerReport();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ReportViewer.js.map