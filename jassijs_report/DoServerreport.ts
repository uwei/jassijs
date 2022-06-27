import { Server } from "jassijs/remote/Server";
import { createReportDefinition } from "./remote/pdfmakejassi";
import { fill } from "./TestServerreport";
var path = require('path');
var pdfMakePrinter = require('pdfmake/src/printer');
export class DoServerreport{
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
    async getDesign(path:string,parameter){
        var fill=(await import(path)).fill;
        var content=await fill(parameter);
        return content; 
    }
    async getBase64LastTestResult(){
        var data=Server.lastTestServersideFileResult;
        data=createReportDefinition(data.reportdesign,data.data,data.parameter);
        
        var ret=await new Promise((resolve)=>{
            this.createPdfBinary(data,resolve);
        });
        return ret;
    }
    async getBase64(file:string,parameter){
        var data=await this.getDesign(file,parameter);
        data=createReportDefinition(data.reportdesign,data.data,data.parameter);
        
        var ret=await new Promise((resolve)=>{
            this.createPdfBinary(data,resolve);
        });
        return ret;
    }
}