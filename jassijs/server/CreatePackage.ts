import * as ts from "typescript";
import fs = require('fs');
import { exists, myfs } from "./NativeAdapter";

var rpath = require('path')
async function dirFiles(dirname: string, skip: string[], ret: string[]) {
    var files = await myfs.readdir(dirname);
    for (var x = 0; x < files.length; x++) {
        var fname = dirname + "/" + files[x];
        var stat = await myfs.stat(fname);
        if (skip.indexOf(dirname) === -1) {
            if (stat.isDirectory()) {

                await dirFiles(fname, skip, ret);
            } else {
                if (fname.endsWith(".js") || fname.endsWith(".ts"))
                    ret.push(fname)
            }
        }
    }
}
async function readRegistry(file: string, isServer: boolean): Promise<any> {
    var text = await myfs.readFile(file, "utf-8");
    if (!isServer) {
        text = text.substring(text.indexOf("default:") + 8);
        text = text.substring(0, text.lastIndexOf("}") - 1);
        text = text.substring(0, text.lastIndexOf("}") - 1);
    } else {
        text = text.substring(text.indexOf("default=") + 8);
    }
    var index = JSON.parse(text);
    return index;
}
async function createRegistry(modul: string, isServer: boolean, exclude: string, includeClientRegistry: string = undefined): Promise<string> {
    var index = await readRegistry("./" + (isServer ? "" : "client/") + modul + "/registry.js", isServer);
    var newIndex = {};
    for (var key in index) {
        if (!key.startsWith(exclude))
            newIndex[key] = index[key];
    }
    if (includeClientRegistry !== undefined) {
        var indexc = await readRegistry("./client/" + modul + "/registry.js", false);
        for (var key in indexc) {
            if (key.startsWith(includeClientRegistry))
                newIndex[key] = index[key];
        }
    }

    var text = JSON.stringify(newIndex, undefined, "\t");
    text = "//this file is autogenerated don't modify\n" +
        'define("' + modul + '/registry",["require"], function(require) {\n' +
        ' return {\n' +
        '  default: ' + text + "\n" +
        ' }\n' +
        '});';
    if (!await exists("./tmp/" + modul))
        await myfs.mkdir("./tmp/" + modul, { recursive: true });
    var ret = "./tmp/" + modul + "/registry.js";
    await myfs.writeFile(ret, text);
    return ret;
}
export async function compilePackage(modul, isServer: boolean = false) {

    const host: ts.ParseConfigFileHost = ts.sys as any;
    // Fix after https://github.com/Microsoft/TypeScript/issues/18217
    //host.onUnRecoverableConfigFileDiagnostic = printDiagnostic;
    const parsedCmd = ts.getParsedCommandLineOfConfigFile("./client/tsconfig.json", undefined, host);
    //const { options } = parsedCmd;

    var options = <any>{

        baseUrl: "./",
        target: 4,
        module: 2,
        outDir: "js",
        allowJs: true,
        sourceMap: true,
        declaration: true,
        moduleResolution: 2,
        lib: ["es6"],
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        outFile: "./dist/" + modul + (isServer ? "-server" : "") + ".js",
        noResolve: true,


    };

    var fileNames = [];
    if (isServer === false) {
        await dirFiles("./client/" + modul, ["./client/" + modul + "/server", "./client/" + modul + "/registry.js"], fileNames);
        var tempIndexFile = await createRegistry(modul, isServer, modul + "/server");
        fileNames.push(tempIndexFile);
        let program = ts.createProgram(fileNames, options);
        let emitResult = program.emit();
        await myfs.unlink(tempIndexFile);
        var outFile="./dist/" + modul + (isServer ? "-server" : "") + ".js";
        var text=await myfs.readFile(outFile,"utf-8");
        text=text.replaceAll('define("client/','define(       "');
        await myfs.writeFile(outFile,text);
    } else {
        await dirFiles("./" + modul, ["./" + modul + "/server", "./" + modul + "/registry.js"], fileNames);
        await dirFiles("./client/" + modul + "/server", [], fileNames);
        var tempIndexFile = await createRegistry(modul, isServer, modul + "/server", modul + "/server");
        fileNames.push(tempIndexFile);

        let program = ts.createProgram(fileNames, options);
        let emitResult = program.emit();
    }

    //fs.readdir()

}