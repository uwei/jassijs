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
                    var par = Object.assign({}, this.parameter);
                    var ret = await ServerReport_1.ServerReport.fillReport(path, par);
                    return ret;
                }
                //return await this.call(this, this.fill, context);
            }
            throw new Classes_1.JassiError("Clintreports must implememt fill");
        }
        async getBase64() {
            var clname = Classes_1.classes.getClassName(this);
            var meta = Registry_1.default.getData("$Report", clname);
            if ((meta === null || meta === void 0 ? void 0 : meta.length) > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var par = Object.assign({}, this.parameter);
                    return await ServerReport_1.ServerReport.getBase64(path, par);
                }
                //return await this.call(this, this.fill, context);
            }
            var rep = new PDFReport_1.PDFReport();
            var des = await this.fill();
            rep.value = des.reportdesign;
            rep.data = des.data;
            rep.parameter = des.parameter;
            rep.fill();
            return await rep.getBase64();
        }
        async open() {
            var viewer = new PDFViewer_1.PDFViewer();
            viewer.value = await this.getBase64();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vamFzc2lqc19yZXBvcnQvUmVwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7SUFTQSxNQUFhLGdCQUFnQjtLQVU1QjtJQVZELDRDQVVDO0lBQ0QsU0FBZ0IsT0FBTyxDQUFDLFVBQTRCO1FBQ2hELE9BQU8sVUFBVSxNQUFNO1lBQ25CLGtCQUFRLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFBO0lBQ0wsQ0FBQztJQUpELDBCQUlDO0lBRUQsSUFBYSxNQUFNLEdBQW5CLE1BQWEsTUFBTyxTQUFRLDJCQUFZO1FBR3BDLGtDQUFrQztRQUMzQixLQUFLLENBQUMsSUFBSTtZQUNiLElBQUksTUFBTSxHQUFHLGlCQUFPLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3hDLElBQUksSUFBSSxHQUFHLGtCQUFRLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUMvQyxJQUFJLENBQUEsSUFBSSxhQUFKLElBQUksdUJBQUosSUFBSSxDQUFFLE1BQU0sSUFBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUMvQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDO2dCQUM5QyxJQUFJLElBQUksRUFBRTtvQkFDTixJQUFJLEdBQUcsR0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3pDLElBQUksR0FBRyxHQUFHLE1BQU0sMkJBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO29CQUNuRCxPQUFPLEdBQUcsQ0FBQztpQkFDZDtnQkFDRCxtREFBbUQ7YUFDdEQ7WUFDRCxNQUFNLElBQUksb0JBQVUsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1FBQzdELENBQUM7UUFDTSxLQUFLLENBQUMsU0FBUztZQUNsQixJQUFJLE1BQU0sR0FBRyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN4QyxJQUFJLElBQUksR0FBRyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDL0MsSUFBSSxDQUFBLElBQUksYUFBSixJQUFJLHVCQUFKLElBQUksQ0FBRSxNQUFNLElBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDL0MsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDOUMsSUFBSSxJQUFJLEVBQUU7b0JBQ04sSUFBSSxHQUFHLEdBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUV6QyxPQUFPLE1BQU0sMkJBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO2lCQUVsRDtnQkFDRCxtREFBbUQ7YUFDdEQ7WUFDRCxJQUFJLEdBQUcsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztZQUMxQixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM1QixHQUFHLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUM7WUFDN0IsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO1lBQ3BCLEdBQUcsQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztZQUM5QixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWCxPQUFPLE1BQU0sR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWpDLENBQUM7UUFDTSxLQUFLLENBQUMsSUFBSTtZQUNiLElBQUksTUFBTSxHQUFHLElBQUkscUJBQVMsRUFBRSxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDdEMsaUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2xDLENBQUM7S0FDSixDQUFBO0lBN0NZLE1BQU07UUFEbEIsSUFBQSxpQkFBTSxFQUFDLDhCQUE4QixDQUFDO09BQzFCLE1BQU0sQ0E2Q2xCO0lBN0NZLHdCQUFNO0lBOENaLEtBQUssVUFBVSxJQUFJO1FBQ3RCLHVEQUF1RDtJQUMzRCxDQUFDO0lBRkQsb0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcmVnaXN0cnksIHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcbmltcG9ydCB7IENvbnRleHQsIFJlbW90ZU9iamVjdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZW1vdGVPYmplY3RcIjtcclxuXHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBjbGFzc2VzLCBKYXNzaUVycm9yIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL0NsYXNzZXNcIjtcclxuaW1wb3J0IHsgU2VydmVyUmVwb3J0IH0gZnJvbSBcImphc3NpanNfcmVwb3J0L3JlbW90ZS9TZXJ2ZXJSZXBvcnRcIjtcclxuaW1wb3J0IHsgUERGVmlld2VyIH0gZnJvbSBcImphc3NpanNfcmVwb3J0L1BERlZpZXdlclwiO1xyXG5pbXBvcnQgeyBQREZSZXBvcnQgfSBmcm9tIFwiamFzc2lqc19yZXBvcnQvUERGUmVwb3J0XCI7XHJcblxyXG5leHBvcnQgY2xhc3MgUmVwb3J0UHJvcGVydGllcyB7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBmdWxsIHBhdGggdG8gY2xhc3NpZml5IHRoZSBVSUNvbXBvbmVudCBlLmcgY29tbW9uL1RvcENvbXBvbmVudCBcclxuICAgICAqL1xyXG4gICAgbmFtZTogc3RyaW5nO1xyXG4gICAgaWNvbj86IHN0cmluZztcclxuICAgIHNlcnZlclJlcG9ydFBhdGg/OiBzdHJpbmc7XHJcblxyXG5cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gJFJlcG9ydChwcm9wZXJ0aWVzOiBSZXBvcnRQcm9wZXJ0aWVzKTogRnVuY3Rpb24ge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwY2xhc3MpIHtcclxuICAgICAgICByZWdpc3RyeS5yZWdpc3RlcihcIiRSZXBvcnRcIiwgcGNsYXNzLCBwcm9wZXJ0aWVzKTtcclxuICAgIH1cclxufVxyXG5AJENsYXNzKFwiamFzc2lqc19yZXBvcnQucmVtb3RlLlJlcG9ydFwiKVxyXG5leHBvcnQgY2xhc3MgUmVwb3J0IGV4dGVuZHMgUmVtb3RlT2JqZWN0IHtcclxuICAgIHBhcmFtZXRlcjogYW55O1xyXG5cclxuICAgIC8vdGhpcyBpcyBhIHNhbXBsZSByZW1vdGUgZnVuY3Rpb25cclxuICAgIHB1YmxpYyBhc3luYyBmaWxsKCkge1xyXG4gICAgICAgIHZhciBjbG5hbWUgPSBjbGFzc2VzLmdldENsYXNzTmFtZSh0aGlzKTtcclxuICAgICAgICB2YXIgbWV0YSA9IHJlZ2lzdHJ5LmdldERhdGEoXCIkUmVwb3J0XCIsIGNsbmFtZSk7XHJcbiAgICAgICAgaWYgKG1ldGE/Lmxlbmd0aCA+IDAgJiYgbWV0YVswXS5wYXJhbXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgcGF0aCA9IG1ldGFbMF0ucGFyYW1zWzBdLnNlcnZlclJlcG9ydFBhdGg7XHJcbiAgICAgICAgICAgIGlmIChwYXRoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyPU9iamVjdC5hc3NpZ24oe30sdGhpcy5wYXJhbWV0ZXIpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJldCA9IGF3YWl0IFNlcnZlclJlcG9ydC5maWxsUmVwb3J0KHBhdGgsIHBhcik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vcmV0dXJuIGF3YWl0IHRoaXMuY2FsbCh0aGlzLCB0aGlzLmZpbGwsIGNvbnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aHJvdyBuZXcgSmFzc2lFcnJvcihcIkNsaW50cmVwb3J0cyBtdXN0IGltcGxlbWVtdCBmaWxsXCIpO1xyXG4gICAgfVxyXG4gICAgcHVibGljIGFzeW5jIGdldEJhc2U2NCgpIHtcclxuICAgICAgICB2YXIgY2xuYW1lID0gY2xhc3Nlcy5nZXRDbGFzc05hbWUodGhpcyk7XHJcbiAgICAgICAgdmFyIG1ldGEgPSByZWdpc3RyeS5nZXREYXRhKFwiJFJlcG9ydFwiLCBjbG5hbWUpO1xyXG4gICAgICAgIGlmIChtZXRhPy5sZW5ndGggPiAwICYmIG1ldGFbMF0ucGFyYW1zLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIHBhdGggPSBtZXRhWzBdLnBhcmFtc1swXS5zZXJ2ZXJSZXBvcnRQYXRoO1xyXG4gICAgICAgICAgICBpZiAocGF0aCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcj1PYmplY3QuYXNzaWduKHt9LHRoaXMucGFyYW1ldGVyKTtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGF3YWl0IFNlcnZlclJlcG9ydC5nZXRCYXNlNjQocGF0aCwgcGFyKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9yZXR1cm4gYXdhaXQgdGhpcy5jYWxsKHRoaXMsIHRoaXMuZmlsbCwgY29udGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciByZXAgPSBuZXcgUERGUmVwb3J0KCk7XHJcbiAgICAgICAgdmFyIGRlcyA9IGF3YWl0IHRoaXMuZmlsbCgpO1xyXG4gICAgICAgIHJlcC52YWx1ZSA9IGRlcy5yZXBvcnRkZXNpZ247XHJcbiAgICAgICAgcmVwLmRhdGEgPSBkZXMuZGF0YTtcclxuICAgICAgICByZXAucGFyYW1ldGVyID0gZGVzLnBhcmFtZXRlcjtcclxuICAgICAgICByZXAuZmlsbCgpO1xyXG4gICAgICAgIHJldHVybiBhd2FpdCByZXAuZ2V0QmFzZTY0KCk7XHJcblxyXG4gICAgfVxyXG4gICAgcHVibGljIGFzeW5jIG9wZW4oKSB7XHJcbiAgICAgICAgdmFyIHZpZXdlciA9IG5ldyBQREZWaWV3ZXIoKTtcclxuICAgICAgICB2aWV3ZXIudmFsdWUgPSBhd2FpdCB0aGlzLmdldEJhc2U2NCgpO1xyXG4gICAgICAgIHdpbmRvd3MuYWRkKHZpZXdlciwgXCJSZXBvcnRcIik7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICAvLyAgICBjb25zb2xlLmxvZyhhd2FpdCBuZXcgUmVwb3J0KCkuc2F5SGVsbG8oXCJLdXJ0XCIpKTtcclxufVxyXG4iXX0=