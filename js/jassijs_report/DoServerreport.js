"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoServerreport = void 0;
const pdfmakejassi_1 = require("./remote/pdfmakejassi");
var path = require('path');
var pdfMakePrinter = require('pdfmake/src/printer');
class DoServerreport {
    createPdfBinary(pdfDoc, callback) {
        var fontDescriptors = {
            Roboto: {
                normal: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-MediumItalic.ttf')
            }
        };
        var printer = new pdfMakePrinter(fontDescriptors);
        var doc = printer.createPdfKitDocument(pdfDoc);
        var chunks = [];
        var result;
        doc.on('data', function (chunk) {
            chunks.push(chunk);
        });
        doc.on('end', function () {
            result = Buffer.concat(chunks);
            callback(result.toString('base64'));
        });
        doc.end();
    }
    async getDesign(path, parameter) {
        var fill = (await Promise.resolve().then(() => require(path))).fill;
        var content = await fill(parameter);
        return content;
    }
    async getBase64(file, parameter) {
        var data = await this.getDesign(file, parameter);
        data = (0, pdfmakejassi_1.createReportDefinition)(data.reportdesign, data.data, data.parameter);
        var ret = await new Promise((resolve) => {
            this.createPdfBinary(data, resolve);
        });
        return ret;
    }
}
exports.DoServerreport = DoServerreport;
//# sourceMappingURL=DoServerreport.js.map