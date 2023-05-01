"use strict";
/*import * as ts from "typescript";
import fs = require('fs');

var rpath = require('path')
async function compile(modul, options: ts.CompilerOptions) {
    var fileNames=[];
    //fs.readdir()
    var ret = [];
    let program = ts.createProgram(fileNames, options);
    let emitResult = program.emit();

    let allDiagnostics = ts
      .getPreEmitDiagnostics(program)
      .concat(emitResult.diagnostics);

    allDiagnostics.forEach(diagnostic => {
      if (diagnostic.file) {
        let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
          diagnostic.start!
        );
        let message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          "\n"
        );
        ret.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        // console.log(
        // `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
        //);
      } else {
        ret.push(`${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`);
        //        console.log(
        //        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")}`
        //    );
      }
    });

    let exitCode = emitResult.emitSkipped ? 1 : 0;
    ret.push(`Process exiting with code '${exitCode}'.`);
    //console.log(`Process exiting with code '${exitCode}'.`);
    //process.exit(exitCode);
    return ret;
  }
async function transpile(fileName: string,inServerdirectory:boolean=undefined) {
    let spath = fileName.split("/");
    if (!inServerdirectory&&spath.length < 2 && spath[1] !== "remote") {
      //throw new JassiError("fileName must startswith remote");
    }
    var path = ".";
    var data = fs.readFileSync(path + "/" + fileName, { encoding: 'utf-8' });

    var module = fileName.replace(".ts", "");
    const host: ts.ParseConfigFileHost = ts.sys as any;

    const parsedCmd = ts.getParsedCommandLineOfConfigFile("./client/tsconfig.json", undefined, host);
    const { options } = parsedCmd;
    options.outFile="./test.js";
    options.noResolve= true;

    compile(["jassijs/remote/Config.ts","jassijs/remote/Classes.ts","jassijs/server/CompileTemplate1.js", "jassijs/registry.js","jassijs/server/CompileTemplate2.js"],options)
    return;
    var outPath = "js";
    var fdir = outPath + "/" + fileName;
    fdir = fdir.substring(0, fdir.lastIndexOf("/"));
    fs.mkdirSync(fdir, { recursive: true });

    var prefix = "";
    for (let x = 0; x < fileName.split("/").length; x++) {
      prefix = "jassijs/remote/Config";
    }

    var content = ts.transpileModule(data, {
      compilerOptions: options,
      fileName: prefix + fileName,
      moduleName:"jassijs/remote/Config"
    });
   
    var pathname = rpath.dirname(fileName);
  
  
}

transpile("jassijs/remote/Config.ts");*/
Object.defineProperty(exports, "__esModule", { value: true });
const JassiServer_1 = require("./jassijs/server/JassiServer");
(0, JassiServer_1.default)();
//# sourceMappingURL=main.js.map