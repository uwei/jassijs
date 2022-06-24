
import { $Class } from "jassijs/remote/Registry";
import { Server } from "jassijs/remote/Server";
import { FileNode } from "jassijs/remote/FileNode";
//@ts-ignore
import "jassijs_editor/ext/monaco";
import "jassijs/ext/requestidlecallback";
import { Editor } from "jassijs/ui/PropertyEditors/Editor";

@$Class("jassijs_editor.util.Typescript")
export class Typescript {
    waitForInited: Promise<boolean>;
    tsWorker: monaco.languages.typescript.TypeScriptWorker;

    static languageServiceHost: ts.LanguageServiceHost;
    static ts;


    /**
    * resolved if the service is inited
    */
    private static _isInited: boolean = undefined;
    static compilerSettings = {
        baseUrl: "./",
        target: "ES2017",
        module: "AMD",
        sourceMap: true,
        outDir: "./js",
        allowJs: true,
        moduleResolution: "node",
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
    }
    public isInited(file) {

        return Typescript._isInited === true;
    }
    /**
     * transpile the ts-file an returns all reflected files
     * @param fileName 
     * @param content 
     */
    async transpile(fileName: string, content: string, compilerSettings: any = undefined): Promise<{ fileNames: string[]; contents: string[] }> {
        var ret = { fileNames: [fileName], contents: [content] }
        if (fileName.toLocaleLowerCase().endsWith(".js")) {//js Code would be not transpiled
            ret.fileNames.push("js/" + fileName);
            ret.contents.push(content);
        } else {
            var prefix = "";
            for (let x = 0; x < fileName.split("/").length; x++) {
                prefix = "../" + prefix;
            }
            var opt = {
                compilerOptions: compilerSettings ? compilerSettings : Typescript.compilerSettings,
                fileName: prefix + fileName,
            };
            //@ts-ignore
            var comp: any = ts.transpileModule(content, opt);

            ret.fileNames.push("js/" + fileName.substring(0, fileName.length - 3) + ".js");
            ret.contents.push(comp.outputText);
            ret.fileNames.push("js/" + fileName.substring(0, fileName.length - 3) + ".js.map");
            ret.contents.push(comp.sourceMapText);

        }
        return ret;

    }
    private constructor() {

        if (Typescript._isInited === undefined)
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
            //@ts-ignore
            "moduleResolution": monaco.languages.typescript.ModuleResolutionKind.node,

            rootDir: "./",
            "sourceMap": true,
            "outDir": "./js",
            emitDecoratorMetadata: true,
            allowNonTsExtensions: true,
            allowJs: true,
            experimentalDecorators: true,
        });

    }
    initInIdle = true;
    //load  d.ts from modulpackage
    private async includeModulTypes() {
        var nodeFiles = {}
        for (var mod in jassijs.modules) {
            var config = (await import(mod + "/modul")).default;
            if (config.types) {
                for (var key in config.types) {
                    var file = config.types[key];
                    nodeFiles[key] = new Server().loadFile(file);

                }
            }
        }
        return nodeFiles;
    }
    /**
     * initialize the services tooks any seconds
     * functions which uses the languageservice are blocked until ready
     */
    async initService(): Promise<boolean> {
        if (Typescript._isInited !== undefined)
            return;
        Typescript._isInited = false;
        Typescript.initMonaco();
        //@ts-ignore
        //  import("jassijs/ext/typescript").then(async function(ts1) {
        Typescript.ts = ts;

        var _this = this;
        var f: { [path: string]: FileNode } = (await new Server().dir(true)).resolveChilds();

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
            if (fname.toLowerCase().endsWith(".ts") || fname.toLowerCase().endsWith(".js") || fname.toLowerCase().endsWith(".json")) {
                if (fname.toLocaleLowerCase().endsWith(".js")) {
                    monaco.languages.typescript.typescriptDefaults.addExtraLib("export default const test=1;", "file:///" + fname);
                }
                if (fdat === undefined) {
                    nodeFiles[fname] = new Server().loadFile(fname);
                } else {
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

            if (key.toLocaleLowerCase().endsWith(".ts")) {
                //
                if (this.initInIdle) {
                    var ffile = monaco.Uri.from({ path: "/" + key, scheme: 'file' });
                    //console.log(key);
                    if (!monaco.editor.getModel(ffile))
                        monaco.editor.createModel(code[key], "typescript", ffile);
                    //});
                } else {
                    monaco.languages.typescript.typescriptDefaults.addExtraLib(code[key], "file:///" + key);
                }
            }
            if (key.toLocaleLowerCase().endsWith(".json"))
                type = "json";

        }
        //initialize monaco
        if (!this.initInIdle)
            monaco.editor.createModel("var a=1;", "typescript", monaco.Uri.from({ path: "/__mydummy.ts", scheme: 'file' }));
        this.tsWorker = await (await monaco.languages.typescript.getTypeScriptWorker())()
        Typescript._isInited = true;
        return true;
    }
    /**
     * unused
     */
    async getDefinitionAtPosition(file: string, position: number) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
        }
        return await this.tsWorker.getDefinitionAtPosition("file:///" + file, position);

    }
    /**
     * unused
     */
    async getSignatureHelpItems(file: string, position: number) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
        }
        //@ts-ignore
        return await this.tsWorker.getSignatureHelpItems("file:///" + file, position, undefined);

    }
    async includefileIfNeeded(file: string) {

    }
    async renameFile(oldfile: string, newfile: string) {
        var ffile = monaco.Uri.from({ path: "/" + oldfile, scheme: 'file' });
        var oldmodell = monaco.editor.getModel(ffile);
        oldmodell?.dispose();
        var text = await $.ajax({
            url: newfile,
            beforeSend: function (request) {
                request.setRequestHeader("X-Custom-FromCache", newfile);
            },
            dataType: "text"
        });
        await this.setCode(newfile, text);
        var snap = Typescript.languageServiceHost.getScriptSnapshot(newfile);
    }

    /**
     * @returns all code filenames
     */
    getFiles(): string[] {
        var ret: string[] = [];
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
    getCode(file: string): string {
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
    setCode(file: string, text: string) {
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
    async getCompletionEntryDetails(file: string, position: number, item: string, formatOptions = {}, source = undefined, preferences = {}) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
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
    async getCompletion(file: string, position: number, text: string = undefined, options) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
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
    async getQuickInfoAtPosition(file: string, position: number, text: string) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
        }
        if (text !== undefined) {
            await this.setCode(file, text);
        }
        return await this.tsWorker.getQuickInfoAtPosition("file:///" + file, position);
    }
    async getCodeFixesAtPosition(file: string, text: string = undefined, start: number, end: number, errorCodes: []): Promise<any> {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
        }
        if (text !== undefined) {
            await this.setCode(file, text);
        }
        return await this.tsWorker.getCodeFixesAtPosition("file:///" + file, start, end, errorCodes, {});
    }
    async formatDocument(filePath: string, text: string = undefined) {
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
    async getDiagnosticsForAll(): Promise<ts.Diagnostic[]> {
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
                    }
                    ret.push(sug[s]);
                }
                sug = await this.tsWorker.getSyntacticDiagnostics(url);
                for (var s = 0; s < sug.length; s++) {
                    //@ts-ignore
                    sug[s]["file"] = {
                        fileName: mods[x].uri.path.substring(1)
                    }
                    ret.push(sug[s]);
                }
            } catch (ex) {
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
    getLineAndCharacterOfPosition(fileName: string, pos: number): { line, character } {
        var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getPositionAt(pos);
        return {
            line: p.lineNumber,
            character: p.column
        }
    }
    getPositionOfLineAndCharacter(fileName: string, pos: { line, character }): number {
        var p = monaco.editor.getModel(monaco.Uri.from({ path: "/" + fileName, scheme: 'file' })).getOffsetAt({
            column: pos.character,
            lineNumber: pos.line
        })
        return p;
    }
    async getDiagnostics(file: string, text: string = undefined) {
        await this.waitForInited;
        if (Typescript._isInited !== true) {
            throw Error("check isInited before call ")
        }
        if (text !== undefined) {
            this.setCode(file, text);
        }

        return {
            semantic: await this.tsWorker.getSemanticDiagnostics("file:///" + file),
            suggestion: await this.tsWorker.getSuggestionDiagnostics("file:///" + file),
            syntactic: await this.tsWorker.getSyntacticDiagnostics("file:///" + file)
            //      declaration:Typescript.languageService.getDeclarationDiagnostics(file)
        }
    }
}
//@ts-ignore
var typescript: Typescript = new Typescript();
export default typescript;