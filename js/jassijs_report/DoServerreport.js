"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoServerreport = void 0;
const fs = require("fs");
var http = require('http');
const Server_1 = require("jassijs/remote/Server");
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
    async download(url, dest) {
        return await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest, { flags: "wx" });
            const request = http.get(url, response => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                }
                else {
                    file.close();
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(`Server responded with ${response.statusCode}: ${response.statusMessage}`);
                }
            });
            request.on("error", err => {
                file.close();
                fs.unlink(dest, () => { }); // Delete temp file
                reject(err.message);
            });
            file.on("finish", () => {
                resolve(undefined);
            });
            file.on("error", err => {
                file.close();
                if (err.code === "EEXIST") {
                    reject("File already exists");
                }
                else {
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(err.message);
                }
            });
        });
    }
    async loadFonds(report) {
        this.download('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg', path.join(__dirname, '..', '..', '/client/cat.jpg'));
    }
    async getBase64LastTestResult() {
        var data = Server_1.Server.lastTestServersideFileResult;
        await this.loadFonds(data.reportdesign);
        data = (0, pdfmakejassi_1.createReportDefinition)(data.reportdesign, data.data, data.parameter);
        var ret = await new Promise((resolve) => {
            this.createPdfBinary(data, resolve);
        });
        return ret;
    }
    async getBase64(file, parameter) {
        var data = await this.getDesign(file, parameter);
        await this.loadFonds(data.reportdesign);
        data = (0, pdfmakejassi_1.createReportDefinition)(data.reportdesign, data.data, data.parameter);
        var ret = await new Promise((resolve) => {
            this.createPdfBinary(data, resolve);
        });
        return ret;
    }
}
exports.DoServerreport = DoServerreport;
//# sourceMappingURL=DoServerreport.js.map