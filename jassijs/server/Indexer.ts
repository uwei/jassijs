//synchronize-server-client
import { JassiError } from "jassijs/remote/Classes";
import { config } from "jassijs/remote/Config";
import { serverservices } from "jassijs/remote/Serverservice";
import { ts } from 'jassijs/server/NativeAdapter';



export abstract class Indexer {

    abstract fileExists(name);
    abstract readFile(name);
    abstract getFileTime(name);
    abstract createDirectory(name);
    abstract writeFile(name: string, content: string);
    abstract dirFiles(modul: string, path: string, extensions: string[], ignore: string[]): Promise<string[]>;

    public async updateModul(root, modul: string, isserver: boolean) {
        var path = root + (root === "" ? "" : "/") + modul;
        //create empty if needed
        var text = "{}";
        if (await this.fileExists(path + "/registry.js")) {
            text = await this.readFile(path + "/registry.js");

            if (isserver && config.clientrequire === undefined && config.serverrequire === undefined) {
                text = text.substring(text.indexOf("default=") + 8);//nodes

            } else {
                text = text.substring(text.indexOf("default:") + 8);
                text = text.substring(0, text.lastIndexOf("}") - 1);
                text = text.substring(0, text.lastIndexOf("}") - 1);
            }
        }
        try {
            var index = JSON.parse(text);
        } catch {
            console.log("error read modul " + modul + "- create new");
            index = {};
        }

        //remove deleted files
        for (var key in index) {
            if (!(await this.fileExists(root + (root === "" ? "" : "/") + key))) {
                delete index[key];
            }
        }

        var jsFiles: string[] = await this.dirFiles(modul, path, [".ts",".tsx"], ["node_modules"])
        for (let x = 0; x < jsFiles.length; x++) {
            var jsFile = jsFiles[x];
            
            var fileName = jsFile.substring((root.length + (root === "" ? 0 : 1)));
            if (fileName === undefined)
                continue;
            var entry = index[fileName];
            if (entry === undefined) {
                entry = {};
                entry.date = undefined;
                index[fileName] = entry;
            }
            if (await this.fileExists(root + (root === "" ? "" : "/") + fileName)) {

                var dat = await this.getFileTime(root + (root === "" ? "" : "/") + fileName)
                if (dat !== entry.date) {
                    var text = <string>await this.readFile(root + (root === "" ? "" : "/") + fileName);
                    var isTsx=jsFile.toLowerCase().endsWith(".tsx");
                    var sourceFile = ts.createSourceFile( isTsx?'hallo.tsx':'hallo.ts', text, ts.ScriptTarget.ES5, true,isTsx?4/*ScriptKind.TSX*/:undefined);
                    var outDecorations = [];
                    entry = {};
                    entry.date = undefined;
                    index[fileName] = entry;
                    this.collectAnnotations(sourceFile, entry);
                    // findex(Filesystem.path + "/" + jsFile);
                    entry.date = dat;
                }
            }
        }
        var text = JSON.stringify(index, undefined, "\t");

        if (isserver && config.clientrequire === undefined && config.serverrequire === undefined) {//nodes
            if (text !== "{}") {
                text = '"use strict:"\n' +
                    "//this file is autogenerated don't modify\n" +
                    'Object.defineProperty(exports, "__esModule", { value: true });\n' +
                    'exports.default=' + text;
            }
        } else {
            text = "//this file is autogenerated don't modify\n" +
                'define("' + modul + '/registry",["require"], function(require) {\n' +
                ' return {\n' +
                '  default: ' + text + "\n" +
                ' }\n' +
                '});';
        }
        if (!isserver) {//write client


            var jsdir = "js/" + path;
            var fpath = (await (serverservices.filesystem)).path;
            if (fpath !== undefined)
                jsdir = path.replace(fpath, fpath + "/js");
            if (!(await this.fileExists(jsdir)))
                await this.createDirectory(jsdir);
            await this.writeFile(jsdir + "/registry.js", text);
            await this.writeFile(path + "/registry.js", text);
        } else { //write server
            var modules = config.server.modules;
            for (let smodul in modules) {
                if (modul === smodul) {

                    var jsdir = "js/" + modul;
                    if (!(await this.fileExists(jsdir)))
                        await this.createDirectory(jsdir);
                    await this.writeFile(jsdir + "/registry.js", text);
                    await this.writeFile(modul + "/registry.js", text);
                }
            }
        }


    }

    convertArgument(arg: any) {
        if (arg === undefined)
            return undefined;
        if (arg.kind === ts.SyntaxKind.ObjectLiteralExpression) {
            var ret = {};
            var props = arg.properties;
            if (props !== undefined) {
                for (var p = 0; p < props.length; p++) {
                    ret[props[p].name.text] = this.convertArgument(props[p].initializer);
                }
            }
            return ret;
        } else if (arg.kind === ts.SyntaxKind.StringLiteral) {
            return arg.text;
        } else if (arg.kind === ts.SyntaxKind.ArrayLiteralExpression) {
            let ret = [];
            for (var p = 0; p < arg.elements.length; p++) {
                ret.push(this.convertArgument(arg.elements[p]));
            }
            return ret;
        } else if (arg.kind === ts.SyntaxKind.Identifier) {
            return arg.text;
        } else if (arg.kind === ts.SyntaxKind.TrueKeyword) {
            return true;
        } else if (arg.kind === ts.SyntaxKind.FalseKeyword) {
            return false;
        } else if (arg.kind === ts.SyntaxKind.NumericLiteral) {
            return Number(arg.text);
        } else if (arg.kind === ts.SyntaxKind.ArrowFunction || arg.kind === ts.SyntaxKind.FunctionExpression) {
            return "function";
        }

        throw new JassiError("Error typ not found");
    }
    collectAnnotations(node: ts.Node, outDecorations, depth = 0) {
        //console.log(new Array(depth + 1).join('----'), node.kind, node.pos, node.end);
        if (node.kind === ts.SyntaxKind.ClassDeclaration) {
            if (node["modifiers"] !== undefined) {
                var dec;
                var sclass = undefined;
                for (var m = 0; m < node["modifiers"].length; m++) {
                    var decnode: ts.Decorator = node["modifiers"][m];
                   
                    if (decnode.kind === ts.SyntaxKind.Decorator) {
                        //if (node.decorators !== undefined) {
                        if(dec===undefined)
                            dec = {};
                        
                        //for (let x = 0; x < node.decorators.length; x++) {
                        // var decnode = node.decorators[x];
                        var ex: any = decnode.expression;
                        if (ex.expression === undefined) {
                            dec[ex.text] = [];//Annotation without parameter
                        } else {
                            if (ex.expression.text === "$Class")
                                sclass = this.convertArgument(ex.arguments[0]);
                            else {
                                if (dec[ex.expression.text] === undefined) { 
                                    dec[ex.expression.text] = [];
                                }
                                for (var a = 0; a < ex.arguments.length; a++) {
                                    dec[ex.expression.text].push(this.convertArgument(ex.arguments[a]));
                                }
                            } 
                        }
                    }
                }
                if (sclass !== undefined)
                    outDecorations[sclass] = dec;
                //@members.value.$Property=[{name:string}]
                for (let x = 0; x < node["members"].length; x++) {
                    var member = node["members"][x];
                    var membername = node["members"][x].name?.escapedText;

                    if (member["modifiers"] !== undefined) {

                        for (var m = 0; m < member["modifiers"].length; m++) {
                            var decnode: ts.Decorator = member["modifiers"][m];
                            if (decnode.kind === ts.SyntaxKind.Decorator) {
                                //if (member.decorators !== undefined) {
                                if (!dec["@members"]) 
                                    dec["@members"] = {}
                                var decm = {};
                                dec["@members"][membername] = decm;
                                //for (let x = 0; x < member.decorators.length; x++) {
                                //  var decnode = member.decorators[x];
                                var ex: any = decnode.expression;
                                if (ex.expression === undefined) {
                                    decm[ex.text] = [];//Annotation without parameter
                                } else {
                                    if (ex.expression.text === "$Property") {
                                        //do nothing;
                                    } else {
                                        if (decm[ex.expression.text] === undefined) {
                                            decm[ex.expression.text] = [];
                                        }
                                        for (var a = 0; a < ex.arguments.length; a++) {
                                            decm[ex.expression.text].push(this.convertArgument(ex.arguments[a]));
                                        }
                                    } 
                                }
                            }
                        }
                        if (dec&&dec["@members"]&&dec["@members"][membername]&&Object.keys(dec["@members"][membername]).length === 0) {
                            delete dec["@members"][membername]; 
                        }
                    }

                }
            }
        }
        depth++;
        node.getChildren().forEach(c => this.collectAnnotations(c, outDecorations, depth));
    }
    /*findex(file: string) {
        var text = fs.readFileSync(file).toString();
        var sourceFile = ts.createSourceFile('hallo.ts', text, ts.ScriptTarget.ES5, true);
        var outDecorations = [];
        this.collectAnnotations(sourceFile, outDecorations);
        var h = 9;
    }*/
}
