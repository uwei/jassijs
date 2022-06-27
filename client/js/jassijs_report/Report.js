var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/RemoteObject", "jassijs/base/Windows", "jassijs/remote/Classes", "jassijs_report/remote/ServerReport", "jassijs_report/PDFViewer", "jassijs_report/PDFReport"], function (require, exports, Registry_1, RemoteObject_1, Windows_1, Classes_1, ServerReport_1, PDFViewer_1, PDFReport_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Report = exports.$Report = exports.ReportProperties = void 0;
    class ReportProperties {
    }
    exports.ReportProperties = ReportProperties;
    function $Report(properties) {
        return function (pclass) {
            Registry_1.default.register("$Report", pclass, properties);
        };
    }
    exports.$Report = $Report;
    let Report = class Report extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async fill() {
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var ret = await ServerReport_1.ServerReport.fillReport(path, this.parameter);
                    return ret;
                }
                //return await this.call(this, this.fill, context);
            }
            throw new Classes_1.JassiError("Clintreports must implememt fill");
        }
        async open() {
            var viewer = new PDFViewer_1.PDFViewer();
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    viewer.value = await ServerReport_1.ServerReport.getBase64(path, this.parameter);
                }
                //return await this.call(this, this.fill, context);
            }
            else {
                var rep = new PDFReport_1.PDFReport();
                var des = await this.fill();
                rep.value = des.reportdesign;
                rep.data = des.data;
                rep.parameter = des.parameter;
                rep.fill();
                viewer.value = await rep.getBase64();
            }
            Windows_1.default.add(viewer, "Report");
        }
    };
    Report = __decorate([
        (0, Registry_1.$Class)("jassijs_report.remote.Report")
    ], Report);
    exports.Report = Report;
    async function test() {
        //    console.log(await new Report().sayHello("Kurt"));
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFTQSxNQUFhLGdCQUFnQjtLQVU1QjtJQVZELDRDQVVDO0lBQ0QsU0FBZ0IsT0FBTyxDQUFDLFVBQTRCO1FBQ2hELE9BQU8sVUFBVSxNQUFNO1lBQ25CLGtCQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUpELDBCQUlDO0lBRUQsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTyxTQUFRLDJCQUFZO1FBR3BDLGtDQUFrQztRQUMzQixLQUFLLENBQUMsSUFBSTtZQUNiLElBQUksTUFBTSxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLElBQUksSUFBSSxHQUFHLGtCQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxJQUFJLElBQUksRUFBRTtvQkFDTixJQUFJLEdBQUcsR0FBRyxNQUFNLDJCQUFZLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzlELE9BQU8sR0FBRyxDQUFDO2lCQUNkO2dCQUNELG1EQUFtRDthQUN0RDtZQUNELE1BQU0sSUFBSSxvQkFBVSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDN0QsQ0FBQztRQUNNLEtBQUssQ0FBQyxJQUFJO1lBQ2IsSUFBSSxNQUFNLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFDN0IsSUFBSSxNQUFNLEdBQUcsaUJBQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDeEMsSUFBSSxJQUFJLEdBQUcsa0JBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQSxJQUFJLGFBQUosSUFBSSx1QkFBSixJQUFJLENBQUUsTUFBTSxJQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQy9DLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUM7Z0JBQzlDLElBQUksSUFBSSxFQUFFO29CQUNOLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSwyQkFBWSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2lCQUVyRTtnQkFDRCxtREFBbUQ7YUFDdEQ7aUJBQU07Z0JBQ0gsSUFBSSxHQUFHLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7Z0JBQzFCLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUM1QixHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7Z0JBQzdCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQztnQkFDcEIsR0FBRyxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO2dCQUM5QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ1gsTUFBTSxDQUFDLEtBQUssR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsQ0FBQzthQUN4QztZQUdELGlCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO0tBQ0osQ0FBQTtJQXpDWSxNQUFNO1FBRGxCLElBQUEsaUJBQU0sRUFBQyw4QkFBOEIsQ0FBQztPQUMxQixNQUFNLENBeUNsQjtJQXpDWSx3QkFBTTtJQTBDWixLQUFLLFVBQVUsSUFBSTtRQUN0Qix1REFBdUQ7SUFDM0QsQ0FBQztJQUZELG9CQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdHJ5LCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5pbXBvcnQgeyBDb250ZXh0LCBSZW1vdGVPYmplY3QgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVtb3RlT2JqZWN0XCI7XHJcblxyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgY2xhc3NlcywgSmFzc2lFcnJvciB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XHJcbmltcG9ydCB7IFNlcnZlclJlcG9ydCB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9yZW1vdGUvU2VydmVyUmVwb3J0XCI7XHJcbmltcG9ydCB7IFBERlZpZXdlciB9IGZyb20gXCJqYXNzaWpzX3JlcG9ydC9QREZWaWV3ZXJcIjtcclxuaW1wb3J0IHsgUERGUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlJlcG9ydFwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIFJlcG9ydFByb3BlcnRpZXMge1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogZnVsbCBwYXRoIHRvIGNsYXNzaWZpeSB0aGUgVUlDb21wb25lbnQgZS5nIGNvbW1vbi9Ub3BDb21wb25lbnQgXHJcbiAgICAgKi9cclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGljb24/OiBzdHJpbmc7XHJcbiAgICBzZXJ2ZXJSZXBvcnRQYXRoPzogc3RyaW5nO1xyXG5cclxuXHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uICRSZXBvcnQocHJvcGVydGllczogUmVwb3J0UHJvcGVydGllcyk6IEZ1bmN0aW9uIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAocGNsYXNzKSB7XHJcbiAgICAgICAgcmVnaXN0cnkucmVnaXN0ZXIoXCIkUmVwb3J0XCIsIHBjbGFzcywgcHJvcGVydGllcyk7XHJcbiAgICB9XHJcbn1cclxuQCRDbGFzcyhcImphc3NpanNfcmVwb3J0LnJlbW90ZS5SZXBvcnRcIilcclxuZXhwb3J0IGNsYXNzIFJlcG9ydCBleHRlbmRzIFJlbW90ZU9iamVjdCB7XHJcbiAgICBwYXJhbWV0ZXI6IGFueTtcclxuXHJcbiAgICAvL3RoaXMgaXMgYSBzYW1wbGUgcmVtb3RlIGZ1bmN0aW9uXHJcbiAgICBwdWJsaWMgYXN5bmMgZmlsbCgpIHtcclxuICAgICAgICB2YXIgY2xuYW1lID0gY2xhc3Nlcy5nZXRDbGFzc05hbWUodGhpcyk7XHJcbiAgICAgICAgdmFyIG1ldGEgPSByZWdpc3RyeS5nZXREYXRhKFwiJFJlcG9ydFwiLCBjbG5hbWUpO1xyXG4gICAgICAgIGlmIChtZXRhPy5sZW5ndGggPiAwICYmIG1ldGFbMF0ucGFyYW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIHBhdGggPSBtZXRhWzBdLnBhcmFtc1swXS5zZXJ2ZXJSZXBvcnRQYXRoO1xyXG4gICAgICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IFNlcnZlclJlcG9ydC5maWxsUmVwb3J0KHBhdGgsIHRoaXMucGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZXR1cm4gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuZmlsbCwgY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRocm93IG5ldyBKYXNzaUVycm9yKFwiQ2xpbnRyZXBvcnRzIG11c3QgaW1wbGVtZW10IGZpbGxcIik7XHJcbiAgICB9XHJcbiAgICBwdWJsaWMgYXN5bmMgb3BlbigpIHtcclxuICAgICAgICB2YXIgdmlld2VyID0gbmV3IFBERlZpZXdlcigpO1xyXG4gICAgICAgIHZhciBjbG5hbWUgPSBjbGFzc2VzLmdldENsYXNzTmFtZSh0aGlzKTtcclxuICAgICAgICB2YXIgbWV0YSA9IHJlZ2lzdHJ5LmdldERhdGEoXCIkUmVwb3J0XCIsIGNsbmFtZSk7XHJcbiAgICAgICAgaWYgKG1ldGE/Lmxlbmd0aCA+IDAgJiYgbWV0YVswXS5wYXJhbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9IG1ldGFbMF0ucGFyYW1zWzBdLnNlcnZlclJlcG9ydFBhdGg7XHJcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB2aWV3ZXIudmFsdWUgPSBhd2FpdCBTZXJ2ZXJSZXBvcnQuZ2V0QmFzZTY0KHBhdGgsIHRoaXMucGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmZpbGwsIGNvbnRleHQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciByZXAgPSBuZXcgUERGUmVwb3J0KCk7XHJcbiAgICAgICAgICAgIHZhciBkZXMgPSBhd2FpdCB0aGlzLmZpbGwoKTtcclxuICAgICAgICAgICAgcmVwLnZhbHVlID0gZGVzLnJlcG9ydGRlc2lnbjtcclxuICAgICAgICAgICAgcmVwLmRhdGEgPSBkZXMuZGF0YTtcclxuICAgICAgICAgICAgcmVwLnBhcmFtZXRlciA9IGRlcy5wYXJhbWV0ZXI7XHJcbiAgICAgICAgICAgIHJlcC5maWxsKCk7XHJcbiAgICAgICAgICAgIHZpZXdlci52YWx1ZSA9IGF3YWl0IHJlcC5nZXRCYXNlNjQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgXHJcbiAgICAgICAgd2luZG93cy5hZGQodmlld2VyLCBcIlJlcG9ydFwiKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIC8vICAgIGNvbnNvbGUubG9nKGF3YWl0IG5ldyBSZXBvcnQoKS5zYXlIZWxsbyhcIkt1cnRcIikpO1xyXG59XHJcbiJdfQ==