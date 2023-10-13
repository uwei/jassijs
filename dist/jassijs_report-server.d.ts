declare module "jassijs_report/remote/pdfmakejassi" {
    global {
        interface String {
            replaceTemplate: any;
        }
    }
    /**
     * groups and sort the entries
     * @param {any[]} entries - the entries to group
     * @param {string[]} groupfields - the fields where the entries are grouped
     */
    export function doGroup(entries: any, groupfields: string[]): {
        entries: {};
        name: any;
    };
    /**
     * create an pdfmake-definition from an jassijs-report-definition, fills data and parameter in the report
     * @param {string} definition - the jassijs-report definition
     * @param {any} [data] - the data which are filled in the report (optional)
     * @param {any} [parameter] - the parameter which are filled in the report (otional)
     */
    export function createReportDefinition(definition: any, data: any, parameter: any): any;
    export function test(): void;
}
declare module "jassijs_report/remote/ServerReport" {
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    export class ServerReport extends RemoteObject {
        static cacheLastParameter: {};
        static getDesign(path: string, parameter: any, context?: Context): unknown;
        static getBase64(path: string, parameter: any, context?: Context): unknown;
        static getBase64FromFile(file: string, context?: Context): unknown;
    }
    export function test(): unknown;
}
declare module "jassijs_report/server/DoServerreport" {
    export class DoServerreport {
        getDesign(path: string, parameter: any): unknown;
        download(url: any, dest: any): any;
        getBase64(file: string, parameter: any): unknown;
        getBase64FromData(data: any): unknown;
    }
}
declare module "jassijs_report/server/TestServerreport" {
    export function fill(parameter: any): unknown;
    export function test(): unknown;
}
declare module "jassijs_report/modul" {
    const _default: {
        css: {
            "jassijs_report.css": string;
        };
        require: {
            paths: {
                'pdfjs-dist/build/pdf': string;
                'pdfjs-dist/build/pdf.worker': string;
                vfs_fonts: string;
                pdfMakelib: string;
            };
            shim: {
                'pdfjs-dist/build/pdf': {};
                vfs_fonts: {};
            };
        };
    };
    export default _default;
}
