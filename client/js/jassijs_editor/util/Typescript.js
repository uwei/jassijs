var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Server", "jassijs/remote/Config", "jassijs_editor/ext/monaco2", "jassijs_editor/ext/monaco"], function (require, exports, Registry_1, Server_1, Config_1) {
    "use strict";
    var Typescript_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Typescript = void 0;
    let Typescript = Typescript_1 = class Typescript {
        isInited(file) {
            return Typescript_1._isInited === true;
        }
        /**
         * transpile the ts-file an returns all reflected files
         * @param fileName
         * @param content
         */
        async transpile(fileName, content, compilerSettings = undefined) {
            var ret = { fileNames: [fileName], contents: [content] };
            if (fileName.toLocaleLowerCase().endsWith(".js")) { //js Code would be not transpiled
                ret.fileNames.push("js/" + fileName);
                ret.contents.push(content);
            }
            else {
                var prefix = "";
                for (let x = 0; x < fileName.split("/").length; x++) {
                    prefix = "../" + prefix;
                }
                var opt = {
                    compilerOptions: compilerSettings ? compilerSettings : Typescript_1.compilerSettings,
                    fileName: prefix + fileName,
                };
                //@ts-ignore
                var comp = ts.transpileModule(content, opt);
                var extlen = 3;
                if (fileName.toLowerCase().endsWith(".tsx"))
                    extlen = 4;
                ret.fileNames.push("js/" + fileName.substring(0, fileName.length - extlen) + ".js");
                ret.contents.push(comp.outputText);
                ret.fileNames.push("js/" + fileName.substring(0, fileName.length - extlen) + ".js.map");
                ret.contents.push(comp.sourceMapText);
            }
            return ret;
        }
        constructor() {
            this.initInIdle = true;
            if (Typescript_1._isInited === undefined)
                this.waitForInited = this.initService();
        }
        static initMonaco() {
            /* monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                 "baseUrl": "./",
                 rootDir: "./",
             })*/
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                "target": monaco.languages.typescript.ScriptTarget.Latest,
                "baseUrl": "./",
                "module": monaco.languages.typescript.ModuleKind.AMD,
                "moduleResolution": monaco.languages.typescript.ModuleResolutionKind.Classic,
                "jsx": monaco.languages.typescript.JsxEmit.React,
                typeRoots: ["./node_modules/@types"],
                rootDir: "./",
                "sourceMap": true,
                "outDir": "./js",
                emitDecoratorMetadata: true,
                allowNonTsExtensions: true,
                allowJs: true,
                experimentalDecorators: true,
            });
        }
        //load  d.ts from modulpackage
        async includeModulTypes() {
            var nodeFiles = {};
            for (var mod in Config_1.config.modules) {
                var config1 = (await new Promise((resolve_1, reject_1) => { require([mod + "/modul"], resolve_1, reject_1); })).default;
                if (config1.types) {
                    for (var key in config1.types) {
                        var file = config1.types[key];
                        nodeFiles[key] = new Server_1.Server().loadFile(file);
                    }
                }
            }
            return nodeFiles;
        }
        /**
         * initialize the services tooks any seconds
         * functions which uses the languageservice are blocked until ready
         */
        async initService() {
            try {
                if (Typescript_1._isInited !== undefined)
                    return;
                Typescript_1._isInited = false;
                Typescript_1.initMonaco();
                //@ts-ignore
                //  import("jassijs/ext/typescript").then(async function(ts1) {
                Typescript_1.ts = ts;
                var _this = this;
                var f = (await new Server_1.Server().dir(true)).resolveChilds();
                var nodeFiles = await this.includeModulTypes();
                //Load all files to in cache
                //node_modules with ajax - so we kann cache 
                var myfiles = [];
                for (let x in f) {
                    let fname = f[x].fullpath;
                    let fdat = f[x].date;
                    //include js in jassijs/ext
                    if (fname.startsWith("node_modules"))
                        continue;
                    if (fname.toLowerCase().endsWith(".ts") || fname.toLowerCase().endsWith(".tsx") || fname.toLowerCase().endsWith(".js") || fname.toLowerCase().endsWith(".json")) {
                        if (fname.toLocaleLowerCase().endsWith(".js")) {
                            try {
                                monaco.languages.typescript.typescriptDefaults.addExtraLib("export default const test=1;", "file:///" + fname);
                            }
                            catch (_a) {
                                console.log("Error loading file " + fname);
                            }
                        }
                        if (fdat === undefined) {
                            nodeFiles[fname] = new Server_1.Server().loadFile(fname);
                        }
                        else {
                            nodeFiles[fname] = $.ajax({
                                url: fname,
                                beforeSend: function (request) {
                                    request.setRequestHeader("X-Custom-FromCache", fdat);
                                },
                                dataType: "text"
                            });
                        }
                        //}
                    }
                }
                //load TS sources
                //wait for each nodefiles
                var code = {};
                for (let key in nodeFiles) {
                    code[key] = await nodeFiles[key];
                }
                for (let key in nodeFiles) {
                    //monaco
                    //@ts-ignore
                    //	
                    var type = "typescript";
                    if (key.toLocaleLowerCase().endsWith(".ts") || key.toLocaleLowerCase().endsWith(".tsx")) {
                        //
                        if (this.initInIdle) {
                            var ffile = monaco.Uri.from({ path: "/" + key, scheme: 'file' });
                            //console.log(key);
                            if (!monaco.editor.getModel(ffile))
                                monaco.editor.createModel(code[key], "typescript", ffile);
                            //});
                        }
                        else {
                            monaco.languages.typescript.typescriptDefaults.addExtraLib(code[key], "file:///" + key);
                        }
                    }
                    if (key.toLocaleLowerCase().endsWith(".json"))
                        type = "json";
                }
                //initialize monaco
                //if (!this.initInIdle)
                monaco.editor.createModel("var a=1;", "typescript", monaco.Uri.from({ path: "/__mydummy.ts", scheme: 'file' }));
                this.tsWorker = await (await monaco.languages.typescript.getTypeScriptWorker())();
                Typescript_1._isInited = true;
                return true;
            }
            catch (err) {
                debugger;
                throw err;
            }
        }
        /**
         * unused
         */
        async getDefinitionAtPosition(file, position) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            return await this.tsWorker.getDefinitionAtPosition("file:///" + file, position);
        }
        /**
         * unused
         */
        async getSignatureHelpItems(file, position) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            //@ts-ignore
            return await this.tsWorker.getSignatureHelpItems("file:///" + file, position, undefined);
        }
        async includefileIfNeeded(file) {
        }
        async renameFile(oldfile, newfile) {
            var ffile = monaco.Uri.from({ path: "/" + oldfile, scheme: 'file' });
            var oldmodell = monaco.editor.getModel(ffile);
            oldmodell === null || oldmodell === void 0 ? void 0 : oldmodell.dispose();
            var text = await $.ajax({
                url: newfile,
                beforeSend: function (request) {
                    request.setRequestHeader("X-Custom-FromCache", newfile);
                },
                dataType: "text"
            });
            await this.setCode(newfile, text);
            var snap = Typescript_1.languageServiceHost.getScriptSnapshot(newfile);
        }
        /**
         * @returns all code filenames
         */
        getFiles() {
            var ret = [];
            var mods = monaco.editor.getModels();
            for (var x = 0; x < mods.length; x++) {
                var f = mods[x].uri.path.substring(1);
                ret.push(f);
            }
            return ret;
        }
        /**
         * get the code for a file
         * @params file - the filename e.g. jassijs/base/Parser.ts
         */
        getCode(file) {
            var ffile = monaco.Uri.from({ path: "/" + file, scheme: 'file' });
            var mod = monaco.editor.getModel(ffile);
            if (mod)
                return mod.getValue();
            else
                return undefined;
        }
        /**
         * put file in cache
         * @param file - the ts file
         * @param text - the text of the ts file
         */
        setCode(file, text) {
            var ffile = monaco.Uri.from({ path: "/" + file, scheme: 'file' });
            var mod = monaco.editor.getModel(ffile);
            if (!mod) {
                mod = monaco.editor.createModel(text, "typescript", ffile);
            }
            var waiter = new Promise(function (resolve) {
                var disp = mod.onDidChangeContent((evt) => {
                    if (evt.changes[0].text === text) {
                        disp.dispose();
                        resolve(mod);
                    }
                });
            });
            mod.setValue(text);
            return waiter;
        }
        /**
         * get info for a completionentry
         * @param file - the ts file
         * @param position - the position in string
         * @param item -the item we are interested
         * @param formatOptions -unused
         * @param source -unused
         * @param preferences - unused
         */
        async getCompletionEntryDetails(file, position, item, formatOptions = {}, source = undefined, preferences = {}) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            const info = await this.tsWorker.getCompletionEntryDetails("file:///" + file, position, item);
            return info;
        }
        /**
         * get all completions at a  position
         * @param file -the ts file
         * @param position -the position in string
         * @param text - the text of the file is saved to cache
         */
        async getCompletion(file, position, text = undefined, options) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                var p = this.setCode(file, text);
                await p;
                // Typescript.languageServiceHost.getScriptSnapshot(file);
            }
            //@ts-ignore
            const info = await this.tsWorker.getCompletionsAtPosition("file:///" + file, position, options);
            //            { includeExternalModuleExports: true });
            return info;
        }
        async getQuickInfoAtPosition(file, position, text) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                await this.setCode(file, text);
            }
            return await this.tsWorker.getQuickInfoAtPosition("file:///" + file, position);
        }
        async getCodeFixesAtPosition(file, text = undefined, start, end, errorCodes) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                await this.setCode(file, text);
            }
            return await this.tsWorker.getCodeFixesAtPosition("file:///" + file, start, end, errorCodes, {});
        }
        async formatDocument(filePath, text = undefined) {
            await this.waitForInited;
            await this.setCode(filePath, text);
            var textChanges = await this.tsWorker.getFormattingEditsForDocument("file:///" + filePath, {
                convertTabsToSpaces: true,
                insertSpaceAfterCommaDelimiter: true,
                insertSpaceAfterKeywordsInControlFlowStatements: true,
                insertSpaceBeforeAndAfterBinaryOperators: true,
                newLineCharacter: "\n",
                indentStyle: ts.IndentStyle.Smart,
                indentSize: 4,
                tabSize: 4
            });
            let finalText = text;
            textChanges = textChanges.sort((a, b) => b.span.start - a.span.start);
            for (var i = 0; i < textChanges.length; i++) {
                var textChange = textChanges[i];
                const { span } = textChange;
                finalText = finalText.slice(0, span.start) + textChange.newText
                    + finalText.slice(span.start + span.length);
            }
            return finalText;
        }
        async getDiagnosticsForAll() {
            var mods = monaco.editor.getModels();
            var ret = [];
            var countErrors = 0;
            for (var x = 0; x < mods.length; x++) {
                var url = "file:///" + mods[x].uri.path;
                if (url.indexOf("node_modules/") > 0)
                    continue;
                try {
                    var sug = await this.tsWorker.getSemanticDiagnostics(url);
                    for (var s = 0; s < sug.length; s++) {
                        //@ts-ignore
                        sug[s]["file"] = {
                            fileName: mods[x].uri.path.substring(1)
                        };
                        ret.push(sug[s]);
                    }
                    sug = await this.tsWorker.getSyntacticDiagnostics(url);
                    for (var s = 0; s < sug.length; s++) {
                        //@ts-ignore
                        sug[s]["file"] = {
                            fileName: mods[x].uri.path.substring(1)
                        };
                        ret.push(sug[s]);
                    }
                }
                catch (ex) {
                    if (!ex.message.indexOf("file:////lib.dom.d.ts") && ex.message.indexOf(" file:////lib.es5.d.ts"))
                        console.log("Error: " + url + ex.message);
                }
            }
            console.log("ready");
            return ret;
            /* var prog=Typescript.languageService.getProgram();
             let all=Typescript.ts.getPreEmitDiagnostics(prog);
             let all2=prog.emit().diagnostics;
             let ret=[];
             all.forEach((diag)=>{
                 if(diag.file!==undefined&&!diag.file.fileName.startsWith("node_modules"))
                     ret.push(diag);
             });
             return ret;*/
        }
        getLineAndCharacterOfPosition(fileName, pos) {
            var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getPositionAt(pos);
            return {
                line: p.lineNumber,
                character: p.column
            };
        }
        getPositionOfLineAndCharacter(fileName, pos) {
            var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getOffsetAt({
                column: pos.character,
                lineNumber: pos.line
            });
            return p;
        }
        async getDiagnostics(file, text = undefined) {
            await this.waitForInited;
            if (Typescript_1._isInited !== true) {
                throw Error("check isInited before call ");
            }
            if (text !== undefined) {
                this.setCode(file, text);
            }
            return {
                semantic: await this.tsWorker.getSemanticDiagnostics("file:///" + file),
                suggestion: await this.tsWorker.getSuggestionDiagnostics("file:///" + file),
                syntactic: await this.tsWorker.getSyntacticDiagnostics("file:///" + file)
                //      declaration:Typescript.languageService.getDeclarationDiagnostics(file)
            };
        }
    };
    /**
    * resolved if the service is inited
    */
    Typescript._isInited = undefined;
    Typescript.compilerSettings = {
        baseUrl: "./",
        target: "ES2017",
        module: "AMD",
        sourceMap: true,
        outDir: "./js",
        allowJs: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.Classic,
        jsx: monaco.languages.typescript.JsxEmit.React,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        typeRoots: ["./node_modules/@types"]
    };
    Typescript = Typescript_1 = __decorate([
        (0, Registry_1.$Class)("jassijs_editor.util.Typescript"),
        __metadata("design:paramtypes", [])
    ], Typescript);
    exports.Typescript = Typescript;
    //@ts-ignore
    var typescript = new Typescript();
    Typescript.instance = typescript;
    exports.default = typescript;
});
//# sourceMappingURL=Typescript.js.map