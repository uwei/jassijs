define(["require", "exports", "jassijs/remote/Config"], function (require, exports, Config_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DoServerreport = void 0;
    class DoServerreport {
        async getDesign(path, parameter) {
            var fill = (await new Promise((resolve_1, reject_1) => { require([path], resolve_1, reject_1); })).fill;
            var content = await fill(parameter);
            return content;
        }
        async download(url, dest) {
        }
        async getBase64(file, parameter) {
            var data = await this.getDesign(file, parameter);
            return await this.getBase64FromData(data);
        }
        async getBase64FromData(data) {
            var PDFReport = await new Promise((resolve) => {
                Config_1.config.clientrequire(["jassijs_report/PDFReport"], (rep) => {
                    resolve(rep.PDFReport);
                });
            });
            var rep = new PDFReport();
            rep.data = data.data;
            rep.value = data.reportdesign;
            rep.parameter = data.parameter;
            await rep.fill();
            return await rep.getBase64();
        }
    }
    exports.DoServerreport = DoServerreport;
});
//# sourceMappingURL=DoServerreport.js.map