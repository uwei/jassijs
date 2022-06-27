import fs = require('fs');
var https = require('https');
import { Server } from "jassijs/remote/Server";
import { createReportDefinition } from "./remote/pdfmakejassi";
import { fill } from "./TestServerreport";
var path = require('path');
var pdfMakePrinter = require('pdfmake/src/printer');
export class DoServerreport {
    fontDescriptors;
    createPdfBinary(pdfDoc, callback) {


        var printer = new pdfMakePrinter(this.fontDescriptors);

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
    async getDesign(path: string, parameter) {
        var fill = (await import(path)).fill;
        var content = await fill(parameter);
        return content;
    }
    async download(url, dest) {
        return await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest, { flags: "wx" });

            const request = https.get(url, response => {
                if (response.statusCode === 200) {
                    response.pipe(file);
                } else {
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
                } else {
                    fs.unlink(dest, () => { }); // Delete temp file
                    reject(err.message);
                }
            });
        });
    }
    async registerFonts(data) {
        this.fontDescriptors = {/*
            Roboto: {
                normal: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Regular.ttf'),
                bold: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Medium.ttf'),
                italics: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-Italic.ttf'),
                bolditalics: path.join(__dirname, '..', '..', '/jassijs_report/fonts/Roboto-MediumItalic.ttf')
                
            }*/
        };

        //        this.download('http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg',
        //              path.join(__dirname, '..', '..', '/client/cat.jpg'));
        var fonts = ["Roboto"];

        JSON.stringify(data, (key, value) => {
            if (key === "font" && value !== "") {
                fonts.push(value);
            }
            return value;
        });

        /*  if (!fontDescriptors) {
              fontDescriptors = {
                  Roboto: {
                      normal: 'Roboto-Regular.ttf',
                      bold: 'Roboto-Medium.ttf',
                      italics: 'Roboto-Italic.ttf',
                      bolditalics: 'Roboto-MediumItalic.ttf'
                  }
              };
          }*/
        if (!fs.existsSync(path.join(__dirname, '..', '..', '/jassijs_report/fonts'))) {
            fs.mkdirSync(path.join(__dirname, '..', '..', '/jassijs_report/fonts'));
        }
        for (var x = 0; x < fonts.length; x++) {
            var font: string = fonts[x];
            var base = "https://cdn.jsdelivr.net/gh/xErik/pdfmake-fonts-google@master/lib/ofl" + "/" + font.toLowerCase();//abeezee/ABeeZee-Italic.ttf
            if (font == "Roboto")
                base = "https://raw.githubusercontent.com/bpampuch/pdfmake/master/examples/fonts";
            this.fontDescriptors[font] = {};
            var fname = path.join(__dirname, '..', '..', '/jassijs_report/fonts/' + font + '-Regular.ttf')
            this.fontDescriptors[font].normal = fname;
            if (!fs.existsSync(fname)) {
                await this.download(base + "/" + font + "-Regular.ttf", fname);
            }

            var fname = path.join(__dirname, '..', '..', '/jassijs_report/fonts/' + font + '-Bold.ttf')
            this.fontDescriptors[font].normal = fname;
            if (!fs.existsSync(fname)) {
                await this.download(base + "/" + font + (font === "Roboto" ? "-Medium.ttf" : "-Bold.ttf"), fname);
            }

            var fname = path.join(__dirname, '..', '..', '/jassijs_report/fonts/' + font + '-Italic.ttf')
            this.fontDescriptors[font].normal = fname;
            if (!fs.existsSync(fname)) {
                await this.download(base + "/" + font + "-Italic.ttf", fname);
            }

            var fname = path.join(__dirname, '..', '..', '/jassijs_report/fonts/' + font + '-BoldItalic.ttf')
            this.fontDescriptors[font].normal = fname;
            if (!fs.existsSync(fname)) {
                await this.download(base + "/" + font + (font === "Roboto" ? "-MediumItalic.ttf" : "-BoldItalic.ttf"), fname);
            }
        }
    }

    async getBase64LastTestResult() {
        var data = Server.lastTestServersideFileResult;
        await this.registerFonts(data.reportdesign);
        data = createReportDefinition(data.reportdesign, data.data, data.parameter);

        var ret = await new Promise((resolve) => {
            this.createPdfBinary(data, resolve);
        });
        return ret;
    }
    async getBase64(file: string, parameter) {
        var data = await this.getDesign(file, parameter);
        await this.registerFonts(data.reportdesign);
        data = createReportDefinition(data.reportdesign, data.data, data.parameter);
        var ret = await new Promise((resolve) => {
            this.createPdfBinary(data, resolve);
        });
        return ret;
    }
}

