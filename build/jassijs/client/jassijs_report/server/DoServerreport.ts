
import { config } from "jassijs/remote/Config";
import { Server } from "jassijs/remote/Server";
import { createReportDefinition } from "jassijs_report/remote/pdfmakejassi";

export class DoServerreport {

    async getDesign(path: string, parameter) {
        var fill = (await import(path)).fill;
        var content = await fill(parameter);
        return content;
    }
    async download(url, dest) {
      
    }

    async getBase64(file: string, parameter) {
        var data = await this.getDesign(file, parameter);
        return await this.getBase64FromData(data);
    }
    async getBase64FromData(data) {
        var PDFReport = <any>await new Promise((resolve) => {
            config.clientrequire(["jassijs_report/PDFReport"], (rep) => {
                resolve(rep.PDFReport);
            });
        });
        var rep=new PDFReport();
        rep.data=data.data;
        rep.value=data.reportdesign;
        rep.parameter=data.parameter;
        await rep.fill();
        return await rep.getBase64();
    }
}

