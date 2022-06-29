import registry, { $Class } from "jassijs/remote/Registry";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
//@ts-ignore
import pdfMake from "jassijs_report/ext/pdfmake";

import windows from "jassijs/base/Windows";
import { classes, JassiError } from "jassijs/remote/Classes";
import { ServerReport } from "jassijs_report/remote/ServerReport";
import { PDFReport } from "jassijs_report/PDFReport";
import { $ActionProvider, $Actions, ActionProperties } from "jassijs/base/Actions";
//import { ReportViewer } from "jassijs_report/ReportViewer";

export class ReportProperties {

    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    name: string;
    icon?: string;
    serverReportPath?: string;
    actionname?: string;


}
export function $Report(properties: ReportProperties): Function {
    return function (pclass) {
        registry.register("$Report", pclass, properties);
    }
}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs_report.remote.Report")
export class Report extends RemoteObject {


    //this is a sample remote function
    public async fill() {
        var clname = classes.getClassName(this);
        var meta = registry.getData("$Report", clname);
        if (meta?.length > 0 && meta[0].params.length > 0) {
            var path = meta[0].params[0].serverReportPath;
            if (path) {
                var par = this.getParameter();
                var ret = await ServerReport.getDesign(path, par);
                return ret;
            }
            //return await this.call(this, this.fill, context);
        }
        throw new JassiError("Clintreports must implememt fill");
    }
    getParameter() {
        var reportFields = Object.keys(new Report());
        var thisFields = Object.keys(this);
        var ret = {};
        thisFields.forEach((f) => {
            if (reportFields.indexOf(f) === -1) {
                ret[f] = this[f];
                if (typeof ret[f] === "function")
                    ret[f].bind(ret);
            }
        });
        return ret;
    }

    public async getBase64() {
        var clname = classes.getClassName(this);
        var meta = registry.getData("$Report", clname);
        if (meta?.length > 0 && meta[0].params.length > 0) {
            var path = meta[0].params[0].serverReportPath;
            if (path) {
                var par = this.getParameter();
                return await ServerReport.getBase64(path, par);

            }
            //return await this.call(this, this.fill, context);
        }
        var rep = new PDFReport();
        var des = await this.fill();
        rep.value = des.reportdesign;
        rep.data = des.data;
        rep.parameter = des.parameter;
        rep.fill();
        return await rep.getBase64();

    }
    getName() {
        var clname = classes.getClassName(this);
        var meta = registry.getData("$Report", clname);
        var ret = "Report";
        if (meta?.length > 0 && meta[0].params.length > 0) {
            ret = meta[0].params[0].name;
            ret = ret.split("/")[ret.split("/").length - 1];
        }
        return ret;
    }
    private _base64ToArrayBuffer(base64) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }
    public async open() {
        var b64=await this. getBase64();
        var rep=pdfMake.createPdf({content:[]});
        var _this=this;
        rep.getBuffer=async ()=>{
            return _this._base64ToArrayBuffer(b64);
        }
        rep.open();
        //alert("TODO");
    }

    public async view() {
        var ReportViewer = (await import("jassijs_report/ReportViewer")).ReportViewer;
        var ret = new ReportViewer();
        ret.value = this;
        windows.add(ret, this.getName());
    }
    private static createFunction(classname: string): any {
        return async function () {

            var Rep = <any>await classes.loadClass(classname);
            new Rep().view();
        }
    }
    /**
    * create Action for all DBObjectView with actionname is defined
    */
    @$Actions()
    private static async createActions(): Promise<ActionProperties[]> {
        var ret: ActionProperties[] = [];
        var data = await registry.getJSONData("$Report");
        for (var x = 0; x < data.length; x++) {
            var param: ReportProperties = data[x].params[0];
            if (param.actionname) {
                ret.push({
                    name: param.actionname,
                    icon: param.icon,
                    run: this.createFunction(data[x].classname)
                })
            }
        }
        return ret;
    }
}
export async function test() {
    //    console.log(await new Report().sayHello("Kurt"));
}
