import registry, { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

import windows from "jassijs/base/Windows";
import { classes, JassiError } from "jassijs/remote/Classes";
import { ServerReport } from "jassijs_report/remote/ServerReport";
import { PDFViewer } from "jassijs_report/PDFViewer";
import { PDFReport } from "jassijs_report/PDFReport";

export class ReportProperties {

    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    name: string;
    icon?: string;
    serverReportPath?: string;


}
export function $Report(properties: ReportProperties): Function {
    return function (pclass) {
        registry.register("$Report", pclass, properties);
    }
}
@$Class("jassijs_report.remote.Report")
export class Report extends RemoteObject {
    parameter: any;

    //this is a sample remote function
    public async fill() {
            var clname = classes.getClassName(this);
            var meta = registry.getData("$Report", clname);
            if (meta?.length > 0 && meta[0].params.length > 0) {
                var path = meta[0].params[0].serverReportPath;
                if (path) {
                    var ret=await ServerReport.fillReport(path,this.parameter);
                    return ret;
                }
                //return await this.call(this, this.fill, context);
            }
            throw new JassiError("Clintreports must implememt fill");
    }
    public async open() {
        var rep = new PDFReport();
        var des = await this.fill();
        rep.value = des.reportdesign;
        rep.data = des.data;
        rep.parameter = des.parameter;
        rep.fill();
        var viewer = new PDFViewer();
        viewer.value = await rep.getBase64();
        windows.add(viewer, "Report");
    }
}
export async function test() {
    //    console.log(await new Report().sayHello("Kurt"));
}
