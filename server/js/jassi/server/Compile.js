"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compile = void 0;
//import ts = require('typescript');
//import ts = require('typescript');
const ts = require("typescript");
const fs = require("fs");
var rpath = require('path');
//var chokidar = require('chokidar');
var path = "./../public_html";
const formatHost = {
    getCanonicalFileName: path => path,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: () => ts.sys.newLine
};
var events = require('events');
/**
 * compile
 */
class Compile {
    constructor() {
        this.lastCompiledTSFiles = [];
    }
    test(response) {
        const host = ts.sys;
        // Fix after https://github.com/Microsoft/TypeScript/issues/18217
        //host.onUnRecoverableConfigFileDiagnostic = printDiagnostic;
        const parsedCmd = ts.getParsedCommandLineOfConfigFile(path + "/tsconfig.json", undefined, host);
        const { options, fileNames } = parsedCmd;
        var data = this.compile([path + "/jassi/base/Registry.ts"], options);
        /* {
            baseUrl: "./../public_html",
            noEmitOnError: true,
            noImplicitAny: true,
            sourceMap:true,
            lib: ["lib.es2015.d.ts"],
            target: ts.ScriptTarget.ESNext,
            module: ts.ModuleKind.CommonJS
          });*/
        response.send(data);
    }
    compile(fileNames, options) {
        var ret = [];
        let program = ts.createProgram(fileNames, options);
        let emitResult = program.emit();
        let allDiagnostics = ts
            .getPreEmitDiagnostics(program)
            .concat(emitResult.diagnostics);
        allDiagnostics.forEach(diagnostic => {
            if (diagnostic.file) {
                let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
                let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
                ret.push(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
                // console.log(
                // `${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`
                //);
            }
            else {
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
    runWatcher() {
        const configPath = ts.findConfigFile(path + "/", /*searchPath*/ //"./",
        ts.sys.fileExists, "tsconfig.json");
        if (!configPath) {
            throw new Error("Could not find a valid 'tsconfig.json'.");
        }
        const createProgram = ts.createSemanticDiagnosticsBuilderProgram;
        const host = ts.createWatchCompilerHost(configPath, {}, ts.sys, createProgram, this.reportDiagnostic.bind(this), this.reportWatchStatusChanged.bind(this));
        const origCreateProgram = host.createProgram;
        host.createProgram = (rootNames, options, host, oldProgram) => {
            console.log("** We're about to create the program! **");
            return origCreateProgram(rootNames, options, host, oldProgram);
        };
        const origPostProgramCreate = host.afterProgramCreate;
        var test = host.trace;
        //onWatchStatusChange
        //readFile
        //trace
        host.trace = function (s) {
            s = s;
        };
        host.afterProgramCreate = program => {
            console.log("** We finished making the program! **");
            origPostProgramCreate(program);
        };
        // `createWatchProgram` creates an initial program, watches files, and updates
        // the program over time.
        ts.createWatchProgram(host);
    }
    reportDiagnostic(diagnostic) {
        console.error("Error", diagnostic.code, ":", ts.flattenDiagnosticMessageText(diagnostic.messageText, formatHost.getNewLine()));
    }
    checkNewCompiledFiles(response) {
        var ret = { date: 0, files: [] };
        ret.files = this.lastCompiledTSFiles;
        this.lastCompiledTSFiles = [];
        response.send(JSON.stringify(ret));
        //start the watcher to compile the client code
        var _this = this;
        if (Compile.clientWatcherIsRunning === false) {
            Compile.clientWatcherIsRunning = true;
            this.runWatcher();
            var clientTsHasChanged = function (files, text) {
                for (let f = 0; f < files.length; f++) {
                    _this.lastCompiledTSFiles.push(files[f].replace(".ts", ".js").replace("\\", "/"));
                }
                console.log("client changed" + files + " " + text);
            };
            Compile.eventEmitter.addListener("compiled", clientTsHasChanged);
        }
    }
    reportWatchStatusChanged(diagnostic) {
        let s = ts.formatDiagnostic(diagnostic, formatHost);
        if (diagnostic.code === 6194) {
            Compile.eventEmitter.emit('compiled', Compile.lastModifiedTSFiles, s);
            Compile.lastModifiedTSFiles = [];
            //console.info(Compile.lastModifiedTSFiles);
        }
        console.info(s);
    }
    transpile(fileName) {
        let spath = fileName.split("/");
        if (spath.length < 2 && spath[1] !== "remote") {
            throw "fileName must startswith remote";
        }
        var path = "../client";
        var data = fs.readFileSync(path + "/" + fileName, { encoding: 'utf-8' });
        var module = fileName.replace(".ts", "");
        const host = ts.sys;
        const parsedCmd = ts.getParsedCommandLineOfConfigFile("./tsconfig.json", undefined, host);
        const { options } = parsedCmd;
        var outPath = "js/client";
        var fdir = outPath + "/" + fileName;
        fdir = fdir.substring(0, fdir.lastIndexOf("/"));
        fs.mkdirSync(fdir, { recursive: true });
        var prefix = "";
        for (let x = 0; x < fileName.split("/").length; x++) {
            prefix = "../" + prefix;
        }
        var content = ts.transpileModule(data, {
            compilerOptions: options,
            fileName: prefix + fileName
        });
        var pathname = rpath.dirname(fileName);
        if (!fs.existsSync(pathname)) {
            fs.mkdirSync(pathname, { recursive: true });
        }
        fs.copyFileSync("../client/" + fileName, fileName);
        fs.writeFileSync(outPath + "/" + fileName.replace(".ts", ".js"), content.outputText);
        fs.writeFileSync(outPath + "/" + fileName.replace(".ts", ".js.map"), content.sourceMapText);
    }
}
exports.Compile = Compile;
Compile.lastModifiedTSFiles = [];
Compile.clientWatcherIsRunning = false;
Compile.eventEmitter = new events.EventEmitter();
//# sourceMappingURL=Compile.js.map