var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/BoxPanel", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs_report/PDFViewer", "jassijs/ui/PropertyEditor", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Classes", "jassijs_report/test/ServerReport"], function (require, exports, BoxPanel_1, Registry_1, Panel_1, PDFViewer_1, PropertyEditor_1, ComponentDescriptor_1, Classes_1, ServerReport_1) {
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
            for (var x = 0; x < test.fields.length; x++) {
                var field = test.fields[x];
                if (field.name === "parameter") {
                    var paramtype = field.componentType;
                    var Cl = Classes_1.classes.getClass(paramtype);
                    this.param = new Cl();
                    this.me.propertyeditor.value = this.param;
                }
            }
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
                _this._value.parameter = param;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0Vmlld2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUmVwb3J0Vmlld2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFtQkEsSUFBYSxZQUFZLEdBQXpCLE1BQWEsWUFBYSxTQUFRLGFBQUs7UUFJbkM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELElBQUksS0FBSyxDQUFDLEdBQVc7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFFbEIsSUFBSSxJQUFJLEdBQUcseUNBQW1CLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUN6RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQUksS0FBSyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQUU7b0JBQzVCLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7b0JBQ3BDLElBQUksRUFBRSxHQUFHLGlCQUFPLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUNyQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksRUFBRSxFQUFFLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2lCQUU3QzthQUNKO1lBQ0QsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO2dCQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ25DLENBQUMsQ0FBQyxDQUFDO1lBQ0gsMEJBQTBCO1FBQzlCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksbUJBQVEsRUFBRSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFDL0IsRUFBRSxDQUFDLGNBQWMsR0FBRyxJQUFJLCtCQUFjLEVBQUUsQ0FBQztZQUN6QyxJQUFJLENBQUMsTUFBTSxDQUFDO2dCQUNSLFFBQVEsRUFBRTtvQkFDTixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDZixVQUFVLEVBQUUsSUFBSTt3QkFDaEIsUUFBUSxFQUFFOzRCQUNOLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQzs0QkFDdkIsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO3lCQUMvQjt3QkFDRCxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO3FCQUNwQixDQUFDO2lCQUNMO2FBQ0osQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUU7Z0JBQ3JDLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO2dCQUNwQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7Z0JBQy9CLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7b0JBQ25DLEtBQUssQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ3BDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQ0osQ0FBQTtJQXJEWSxZQUFZO1FBRHhCLElBQUEsaUJBQU0sRUFBQyw2QkFBNkIsQ0FBQzs7T0FDekIsWUFBWSxDQXFEeEI7SUFyRFksb0NBQVk7SUFzRGxCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0IsR0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztRQUMvQixPQUFPLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFKRCxvQkFJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJveFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvQm94UGFuZWxcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgUERGVmlld2VyIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlZpZXdlclwiO1xuaW1wb3J0IHsgUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1JlcG9ydFwiO1xuaW1wb3J0IHsgUHJvcGVydHlFZGl0b3IgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eUVkaXRvclwiO1xuaW1wb3J0IHsgQ2xpZW50UmVwb3J0LCBDbGllbnRSZXBvcnRQYXJhbWV0ZXIgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvdGVzdC9DbGllbnRSZXBvcnRcIjtcbmltcG9ydCB7IFByb3BlcnR5RWRpdG9yU2VydmljZSB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvUHJvcGVydHlFZGl0b3JTZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb21wb25lbnREZXNjcmlwdG9yIH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50RGVzY3JpcHRvclwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgeyBTZXJ2ZXJSZXBvcnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvdGVzdC9TZXJ2ZXJSZXBvcnRcIjtcblxuXG50eXBlIE1lID0ge1xuICAgIGJveHBhbmVsPzogQm94UGFuZWw7XG4gICAgcGRmdmlld2VyPzogUERGVmlld2VyO1xuICAgIHByb3BlcnR5ZWRpdG9yPzogUHJvcGVydHlFZGl0b3I7XG59O1xuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0L1JlcG9ydFZpZXdlclwiKVxuZXhwb3J0IGNsYXNzIFJlcG9ydFZpZXdlciBleHRlbmRzIFBhbmVsIHtcbiAgICBtZTogTWU7XG4gICAgcGFyYW07XG4gICAgX3ZhbHVlOiBSZXBvcnQ7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWUgPSB7fTtcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIHNldCB2YWx1ZSh2YWw6IFJlcG9ydCkge1xuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbDtcblxuICAgICAgICB2YXIgdGVzdCA9IENvbXBvbmVudERlc2NyaXB0b3IuZGVzY3JpYmUodmFsLmNvbnN0cnVjdG9yKTtcbiAgICAgICAgZm9yICh2YXIgeCA9IDA7IHggPCB0ZXN0LmZpZWxkcy5sZW5ndGg7IHgrKykge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gdGVzdC5maWVsZHNbeF07XG4gICAgICAgICAgICBpZiAoZmllbGQubmFtZSA9PT0gXCJwYXJhbWV0ZXJcIikge1xuICAgICAgICAgICAgICAgIHZhciBwYXJhbXR5cGUgPSBmaWVsZC5jb21wb25lbnRUeXBlO1xuICAgICAgICAgICAgICAgIHZhciBDbCA9IGNsYXNzZXMuZ2V0Q2xhc3MocGFyYW10eXBlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmFtID0gbmV3IENsKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5tZS5wcm9wZXJ0eWVkaXRvci52YWx1ZSA9IHRoaXMucGFyYW07XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YWwuZ2V0QmFzZTY0KCkudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5tZS5wZGZ2aWV3ZXIudmFsdWUgPSBkYXRhO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9DbGllbnRSZXBvcnRQYXJhbWV0ZXIoKTtcbiAgICB9XG4gICAgbGF5b3V0KG1lOiBNZSkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBtZS5ib3hwYW5lbCA9IG5ldyBCb3hQYW5lbCgpO1xuICAgICAgICBtZS5wZGZ2aWV3ZXIgPSBuZXcgUERGVmlld2VyKCk7XG4gICAgICAgIG1lLnByb3BlcnR5ZWRpdG9yID0gbmV3IFByb3BlcnR5RWRpdG9yKCk7XG4gICAgICAgIHRoaXMuY29uZmlnKHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgbWUuYm94cGFuZWwuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLnBkZnZpZXdlci5jb25maWcoe30pLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWUucHJvcGVydHllZGl0b3IuY29uZmlnKHt9KVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBzcGxpdGVyOiBbODAsIDIwXVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICBtZS5wcm9wZXJ0eWVkaXRvci5vbnByb3BlcnR5Q2hhbmdlZCgoKSA9PiB7XG4gICAgICAgICAgICB2YXIgcGFyYW0gPSBtZS5wcm9wZXJ0eWVkaXRvci52YWx1ZTtcbiAgICAgICAgICAgIF90aGlzLl92YWx1ZS5wYXJhbWV0ZXIgPSBwYXJhbTtcbiAgICAgICAgICAgIF90aGlzLl92YWx1ZS5nZXRCYXNlNjQoKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgICAgX3RoaXMubWUucGRmdmlld2VyLnZhbHVlID0gZGF0YTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IFJlcG9ydFZpZXdlcigpO1xuICAgIHJldC52YWx1ZSA9IG5ldyBTZXJ2ZXJSZXBvcnQoKTtcbiAgICByZXR1cm4gcmV0O1xufVxuXG4iXX0=