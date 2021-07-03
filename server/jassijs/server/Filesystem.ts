import fs = require('fs');

var fpath = require('path');
import { Compile } from 'jassijs/server/Compile';
import { DBManager } from 'jassijs/server/DBManager';
import { FileNode } from 'jassijs/remote/FileNode';
import JSZip = require("jszip");
import { ServerIndexer } from './RegistryIndexer';
import registry from 'jassijs/remote/Registry';
import { JassiError } from 'jassijs/remote/Classes';
let resolve = require('path').resolve;
const passport = require("passport");

var ignore = ["phpMyAdmin", "lib", "tmp", "_node_modules"]
export default class Filesystem {
    static allModules: { [name: string]: any[] } = {};
    public static path = "./../client";
    _pathForFile(fileName: string,fromServerdirectory:boolean=undefined) {
        var path = Filesystem.path + "/" + fileName;
        if(fromServerdirectory)
        path = "./" + fileName;
        return path;
    }
    /*   _getDirectory(file:string,main:FileNode[]):FileNode[]{
           var paths:string[]=file.split("/");
           var parent=main;
           for(let p=0;p<paths.length-1;p++){
               for(let x=0;x<parent.length;x++){
                   if(parent[x].name===paths[p]){
                       parent=parent[x].files;
                       continue;
                   }
               }
           }
           return parent;
       }*/
    dir(curdir = "", appendDate = false, parentPath = Filesystem.path, parent: FileNode = undefined): FileNode {
        var _this = this;
        if (parent === undefined) {
            parent = { name: "", files: [] };
        }
        //var parent:FileNode[]=_this._getDirectory(file,results);

        var list: string[] = fs.readdirSync(parentPath + "/" + curdir);

        list.forEach(function (filename) {
            var file = curdir + (curdir === "" ? "" : '/') + filename;
            if (file !== "js" && file !== "tmp") {//compiled js

                var stat = fs.statSync(parentPath + "/" + file);
                if (stat && stat.isDirectory()) {
                    var newDir = { name: filename, files: [] };
                    parent.files.push(newDir)
                    /* Recurse into a subdirectory */
                    if (ignore.indexOf(file) === -1)
                        _this.dir(file, appendDate, parentPath, newDir);
                } else {
                    let dat = "";//fs.statSync(file).mtime.getTime().toString();
                    let toAdd: FileNode = { name: filename };
                    if (appendDate === true)
                        toAdd.date = fs.statSync(parentPath + "/" + file).mtime.getTime().toString();
                    // if (file.toLowerCase().endsWith(".ts"))
                    parent.files.push(toAdd);
                    /* if (file.toLowerCase().endsWith(".js")) {
                         if (!fs.existsSync(file.replace(".js", ".ts"))) {
                             parent.files.push(toAdd);
                         }
                     }
                     if (file.toLowerCase().endsWith(".json"))
                         parent.files.push(toAdd);*/
                }
            }
        });
        return parent;
    }
    public loadFile(fileName:string,fromServerdirectory:boolean=undefined) {
        let file=this._pathForFile(fileName);
        if(fromServerdirectory)
            file="./"+fileName;
        return fs.readFileSync(this._pathForFile(fileName), { encoding: 'utf-8' });

    }
    public loadFiles(fileNames: string[]) {
        var ret = {};

        for (var x = 0; x < fileNames.length; x++) {

            ret[fileNames[x]] = fs.readFileSync(this._pathForFile(fileNames[x]), { encoding: 'utf-8' });
            /* fs.readFileSync(path+"/"+fileName, {encoding: 'utf-8'}, function(err,data){
                if (!err) {
                    response.send( data);
              //    response.writeHead(200, {'Content-Type': 'text/html'});
                //  response.write(data);
                }else{
                  return response.send(err);
                }
              });*/
        }
        return ret;
        //  return ret;
    }
    public async dirFiles(dir: string, extensions: string[], ignore: string[] = []): Promise<string[]> {
        var results = [];
        if(!fs.existsSync(dir))
            return results;
        var list = fs.readdirSync(dir);
        var _this = this;
        for (let l = 0; l < list.length; l++) {
            let file = list[l];
            for (var x = 0; x < ignore.length; x++) {
                if (file === ignore[x])
                    return;
            }
            file = dir + '/' + file;

            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                var arr = await _this.dirFiles(file, extensions);
                results = results.concat(arr);
            } else {
                /* Is a file */
                for (var x = 0; x < extensions.length; x++) {
                    if (file.toLowerCase().endsWith(extensions[x]) && results.indexOf(file) === -1) {
                        results.push(file);
                    }
                }
            }
        };
        return results;
    }

    private async writeZip(zip: JSZip, outfile: string) {
        return new Promise((ready) => {

            var out = fs.createWriteStream(outfile);
            zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).
                pipe(out).on('finish', () => {
                    ready(undefined);
                }).on('error', (err) => {
                    ready(err);
                });

        });
    }
    static zipid=0;
    public async zip(directoryname: string, serverdir: boolean = undefined): Promise<string> {
        var root = Filesystem.path;
        if (serverdir) {
            root = ".";
        }
        let filename=directoryname.split("/")[directoryname.split("/").length-1]+Filesystem.zipid++;
        await this.zipFolder(root + "/" + directoryname, "/tmp/" + filename + ".zip");
        
        var data = fs.readFileSync("/tmp/" + filename + ".zip");//,'binary');
        fs.unlinkSync("/tmp/" + filename + ".zip");
        //let buff = new Buffer(data);
        let ret = data.toString('base64');
        return ret;
    }
    private async zipFolder(folder: string, outfile: string, parent: JSZip = undefined) {

        var isRoot = parent === undefined;
        if (parent === undefined)
            parent = new JSZip();
        var _this = this;
        //var parent:FileNode[]=_this._getDirectory(file,results);
        var list: string[] = fs.readdirSync(folder);

        for (var x = 0; x < list.length; x++) {
            var filename = list[x];
            var file = folder + "/" + filename;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                var newFolder = parent.folder(filename);
                await _this.zipFolder(file, outfile, newFolder);
            } else {
                var data = fs.readFileSync(file, "binary");
                parent.file(filename, data, { binary: true });
            }
        }
        if (isRoot) {
            var d = await this.writeZip(parent, outfile);
            return d;
        }
        return parent;
    }


    //Reset ORM config

    /**
     * create a folder
     * @param foldername - the name of the new file 
     */
    public async createFolder(foldername: string): Promise<string> {
        var newpath = this._pathForFile(foldername);
        if (fs.existsSync(newpath))
            return foldername + " allready exists";
        try {
            fs.mkdirSync(Filesystem.path + "/" + newpath, { recursive: true })
        } catch (ex) {
            return ex.message;
        }
        return "";
    }
    /**
     * create a module
     * @param modulname - the name of the module
  
     */
    public async createModule(modulename: string): Promise<string> {
        var newpath = this._pathForFile(modulename);
        try {
            //create folder
            if (!fs.existsSync(newpath))
                fs.mkdirSync(newpath, { recursive: true });
            //create remotefolder
            //if (!fs.existsSync(newpath + "/remote"))
            //    fs.mkdirSync(newpath + "/remote", { recursive: true });
            if (!fs.existsSync(newpath + "/modul.ts")) {
                await this.saveFiles([modulename + "/modul.js", "js/" + modulename + "/modul.js"], [
                    "export default {}",
                    'define(["require", "exports"], function (require, exports) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = {};});'
                ]);
            }

            if (!fs.existsSync(newpath + "/registry.js")) {
                await this.saveFiles([modulename + "/registry.js", "js/" + modulename + "/registry.js"], [
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );',
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );',
                ]);
            }
           /* if (!fs.existsSync("./" + modulename))
                fs.mkdirSync("./" + modulename, { recursive: true });
            if (!fs.existsSync("./js/" + modulename))
                fs.mkdirSync("./js/" + modulename, { recursive: true });
            if (!fs.existsSync("./" + modulename + "/remote"))
                fs.mkdirSync("./" + modulename + "/remote", { recursive: true });
            if (!fs.existsSync("./" + modulename + "/registry.js")) {
                fs.writeFileSync("./" + modulename + "/registry.js", 'Object.defineProperty(exports, "__esModule", { value: true });exports.default={}');
                fs.writeFileSync("./js/" + modulename + "/registry.js", 'Object.defineProperty(exports, "__esModule", { value: true });exports.default={}');

            }*/


            //update client jassijs.json
            var json = fs.readFileSync(this._pathForFile("jassijs.json"), 'utf-8');
            var ob = JSON.parse(json);
            if (!ob.modules[modulename])
                ob.modules[modulename] = modulename;
            fs.writeFileSync(this._pathForFile("jassijs.json"), JSON.stringify(ob, undefined, "\t"));

            //this.createRemoteModulIfNeeded(modulename);


        } catch (ex) {
            return ex.message;
        }
        return "";

    }
    /**
     * create a file
     * @param filename - the name of the new file 
     * @param content - then content
     */
    public async createFile(filename: string, content: string): Promise<string> {
        var newpath = this._pathForFile(filename);
        var parent = require('path').dirname(Filesystem.path + "/" + newpath);

        //var fdir = fpath.dirname(path + "/" + fileName).split(fpath.sep).pop();

        if (fs.existsSync(newpath))
            return filename + " allready exists";
        try {
            if (!fs.existsSync(parent))
                fs.mkdirSync(parent, { recursive: true });

            fs.writeFileSync(Filesystem.path + "/" + newpath, content)
        } catch (ex) {
            return ex.message;
        }
        return "";
    }
    /**
     * renames a file or directory
     * @param oldfile - old filename
     * @param newfile - new filename
     */
    public async rename(oldfile: string, newfile: string): Promise<string> {
        var resolve = require('path').resolve
        var oldpath = this._pathForFile(oldfile);
        var newpath = this._pathForFile(newfile);
        if (!fs.existsSync(oldpath))
            return oldfile + " not exists";
        if (fs.existsSync(newpath))
            return newfile + " already exists";
        try {
            /*  if(fs.lstatSync(oldpath).isDirectory()
                  fs.rmdirSync(oldpath, newpath);
              else*/
            fs.renameSync(oldpath, newpath);
        } catch (ex) {
            return ex.message;
        }
        await new ServerIndexer().updateRegistry();
        return "";
    }
    /**
    * deletes a server module
    * @param modul - to delete
    */
     public async removeServerModul(modul: string): Promise<string> {
        var modules = JSON.parse(fs.readFileSync("./jassijs.json", 'utf-8'));
        delete modules.modules[modul];
        fs.writeFileSync("./jassijs.json", JSON.stringify(modules, undefined, "\t"));
        if(fs.existsSync(modul)){
            fs.rmdirSync(modul, { recursive: true });
        }
        return "";
    }
    /**
    * deletes a file or directory 
    * @param file - old filename
    */
    public async remove(file: string): Promise<string> {
        var resolve = require('path').resolve
        var path = this._pathForFile(file);
        if (!fs.existsSync(path))
            return file + " not exists";
        try {
            if (fs.lstatSync(path).isDirectory()) {
                
                //update client jassijs.json if removing client module 
                var json = fs.readFileSync(this._pathForFile("jassijs.json"), 'utf-8');
                var ob = JSON.parse(json);
                if (ob.modules[file]) {
                    delete ob.modules[file];
                    fs.writeFileSync(this._pathForFile("jassijs.json"), JSON.stringify(ob, undefined, "\t"));
                }
                fs.rmdirSync(path, { recursive: true });
            } else
                fs.unlinkSync(path);
        } catch (ex) {
            return ex.message;
        }
        await new ServerIndexer().updateRegistry();
        return "";
    }
    /**
     * create modul in ./jassijs.json
     * @param modul 
     */
    createRemoteModulIfNeeded(modul: string) {

        var modules = JSON.parse(fs.readFileSync("./jassijs.json", 'utf-8'));
        if (!modules.modules[modul]) {
            modules.modules[modul] = modul;
            fs.writeFileSync("./jassijs.json", JSON.stringify(modules, undefined, "\t"));
        }
    }
    /**
     * save files + 
     * transpile remote files and 
     * reload the remote files in server if needed 
     * update db schema
     * the changes would be reverted if there are errors
     * @param fileNames 
     * @param contents 
     * @returns "" or the error
     */
    public async saveFiles(fileNames: string[], contents: string[],fromServerdirectory:boolean=undefined, rollbackonerror: boolean = true): Promise<string> {
        var ret: string = "";
        var rollbackcontents: string[] = [];
        for (var x = 0; x < fileNames.length; x++) {
            let fileName = fileNames[x];
            var path = require('path').dirname(this._pathForFile(fileName,fromServerdirectory));
           
            try {

                //var fdir = fpath.dirname(path + "/" + fileName).split(fpath.sep).pop();
                fs.mkdirSync(path, { recursive: true });
            } catch (err) {

            }
            if (fs.existsSync(this._pathForFile(fileName,fromServerdirectory))) {
                rollbackcontents.push(fs.readFileSync(this._pathForFile(fileName,fromServerdirectory), { encoding: 'utf-8' }));
            } else {
                rollbackcontents.push(undefined);//this file would be killed at revert
            }
            if (contents[x] === undefined)
                fs.unlinkSync(this._pathForFile(fileName,fromServerdirectory));//remove file on revert
            else {
                fs.writeFileSync(this._pathForFile(fileName,fromServerdirectory), contents[x]);
                //transpile remoteCode for Server
                let spath = fileName.split("/");
                if ((fromServerdirectory|| (spath.length > 1 && spath[1].toLowerCase() === "remote")) && fileName.toLowerCase().endsWith(".ts")) {
                    let rpath = require('path').dirname("./" + fileName);
                    try {
                        fs.mkdirSync(rpath, { recursive: true });
                    } catch (err) {
                    }
                    fs.writeFileSync("./" + fileName, contents[x]);
                    if(spath.length>1)
                        this.createRemoteModulIfNeeded(spath[0]);
                    new Compile().transpile(fileName,fromServerdirectory);
                }
            }
        }
        await new ServerIndexer().updateRegistry();
        var remotecodeincluded = false;
        for (var f = 0; f < fileNames.length; f++) {
            var fileName = fileNames[f];
            if (contents[f] === undefined)
                continue;
            var spath = fileName.split("/");
            if (fromServerdirectory||(spath.length > 1 &&  spath[1].toLowerCase() === "remote") && fileName.toLowerCase().endsWith(".ts")) {
                //reload Modules
                var remotecodeincluded = true;
                var root = require.main["path"]+"\\";  //require.resolve("jassijs/remote/Classes");
               // root = root.substring(0, root.length - "jassijs/remote/Classes.js".length);
                var modules = JSON.parse(fs.readFileSync("./jassijs.json", 'utf-8')).modules;
                var jfiles = [];
                for (var modul in modules) {
                    for (var jfile in require.cache) {
                       
                        if(jfile.replaceAll("\\", "/").indexOf("/"+modul+"/remote/")>-1||
                        (fromServerdirectory&&jfile.replaceAll("\\", "/").endsWith("/js/"+fileName.replace(".ts",".js") ))){
                            //save Modules
                            console.log(jfile);
                            var p = jfile.substring(root.length).replaceAll("\\", "/");
                            if(jfile.indexOf("node_modules")>-1){//jassi modules
                                p=jfile.split("node_modules")[1].substring(1).replaceAll("\\", "/");;
                            }
                            p = p.substring(0, p.length - 3);
                            if (Filesystem.allModules[p] === undefined) {
                                Filesystem.allModules[p] = [];
                            }
                           
                            //save all modules
                            var mod = await Promise.resolve().then(() => require.main.require(p));
                            if (Filesystem.allModules[p].indexOf(mod) === -1)
                                Filesystem.allModules[p].push(mod);

                            jfiles.push(jfile);
                            
                        }
                    }
                }
                for (let k = 0; k < jfiles.length; k++) {
                    let jfile = jfiles[k];
                    delete require.cache[jfile];
                }

                var man = await DBManager.destroyConnection();
                // }
            }

        };
        try {
            for (var key in Filesystem.allModules) {//load and migrate modules
                var all = Filesystem.allModules[key];
                var mod = await Promise.resolve().then(() => require.main.require(key));
                for (var a = 0; a < all.length; a++) {
                    for (key in mod) {
                        all[a][key] = mod[key];
                    }
                }
            }
        } catch (err) {
            var restore = await this.saveFiles(fileNames, rollbackcontents,fromServerdirectory, false);
            console.error(err.stack);
            return err + "DB corrupt changes are reverted " + restore;
        }
        if(remotecodeincluded){
            await registry.reload(); 
        }
        if (remotecodeincluded && rollbackonerror) {//verify DB-Schema
            try {
                await DBManager.get();
            } catch (err) {
                var restore = await this.saveFiles(fileNames, rollbackcontents,fromServerdirectory, false);
                console.error(err.stack);
                return err + "DB corrupt changes are reverted " + restore;
            }
        }
        return ret;
    }
    public async saveFile(fileName: string, content:string) {
        try {
            var path = this._pathForFile(fileName);
            var fdir = fpath.dirname(path).split(fpath.sep).pop();
            fs.mkdirSync(fdir, { recursive: true });
        } catch (err) {

        }
        fs.writeFileSync(Filesystem.path + "/" + fileName, content)
        /*
        if(fileName.endsWith(".ts")){
            new Compile().transpile(fileName,function(done){
                var kk=Compile.lastModifiedTSFiles[0]; 
                if(Compile.lastModifiedTSFiles.indexOf(fileName)>-1){
                    var pos=Compile.lastModifiedTSFiles.indexOf(fileName);
                    Compile.lastModifiedTSFiles.splice(pos, 1);
                }
                response.send(done)
                
            });
            return;
             }*/
        await new ServerIndexer().updateRegistry();
        //TODO $this->updateRegistry();
    }
}
function copyFile(f1: string, f2: string) {
    try {
        if (fs.existsSync(f1) && f1.endsWith(".ts") && !fs.statSync(f1).isDirectory()) {
            if (!fs.existsSync(f2) || (fs.statSync(f1).mtimeMs > fs.statSync(f2).mtimeMs)) {
                console.log("sync " + f1 + "->" + f2);
                var dirname = require('path').dirname(f2);
                if (!fs.existsSync(dirname)) {
                    fs.mkdirSync(dirname, { recursive: true });
                }
                fs.copyFileSync(f1, f2);
            }
        }

    } catch (ex) {
        console.error(ex);
        debugger;
    }
}
/**
 *  each remote file on server and client should be the same
*/
async function checkRemoteFiles() {
    var modules = JSON.parse(fs.readFileSync("./jassijs.json", 'utf-8')).modules;
    for (var m in modules) {
        var files = await new Filesystem().dirFiles("./" + m + "/remote", [".ts"]);
        for (let x = 0; x < files.length; x++) {
            var file = files[x];
            var clientfile = file.replace("./", Filesystem.path + "/");
            if (!fs.existsSync(clientfile)) {
                console.error(clientfile + " not exists");
            } else {
                if (fs.statSync(file).mtimeMs !== fs.statSync(clientfile).mtimeMs) {
                    if (fs.statSync(file).mtimeMs > fs.statSync(clientfile).mtimeMs) {
                        console.error(clientfile + " is not up to date " + file + " is newer");
                    } else {
                        console.error(file + " is not up to date " + clientfile + " is newer");
                    }
                }
            }


        }
    }
}
export function syncRemoteFiles() {
    /*await*/checkRemoteFiles();
    //server remote
    fs.watch(Filesystem.path, { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && paths[1] === "remote") {
            setTimeout(() => {
                var f2 = "./" + file;
                var f1 = Filesystem.path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    })
    //client remote
    fs.watch("./", { recursive: true }, (eventType, filename) => {
        if (!filename)
            return;
        var file = filename.replaceAll("\\", "/");
        var paths = file.split("/");
        if (eventType === "change" && paths.length > 1 && paths[1] === "remote") {
            setTimeout(() => {

                var f1 = "./" + file;
                var f2 = Filesystem.path + "/" + file;
                copyFile(f1, f2);
            }, 200);
        }
    })
}
export function staticfiles(req, res, next) {

    // console.log(req.path);
    let sfile = Filesystem.path + "/" + req.path;
    if (sfile.indexOf("Settings.ts") > -1) {//&&!passport.authenticate("jwt", { session: false })){
        next();
        return;
    }
    if (fs.existsSync(sfile)) {
        // let code=fs.readFileSync(Filesystem.path+"/"+req.path);
        let dat = fs.statSync(sfile).mtime.getTime();
        if (req.query.lastcachedate === dat.toString()) {
            res.set('X-Custom-UpToDate', 'true');
            res.send("");
        } else {
            res.sendFile(resolve(sfile), {
                headers: { 'X-Custom-Date': dat.toString() }
            });
        }
    } else {
        next();
    }
    var s = 1;
}
export function staticsecurefiles(req, res, next) {

    // console.log(req.path);
    let sfile = Filesystem.path + "/" + req.path;
    if (sfile.indexOf("Settings.ts") > -1) {//&&!passport.authenticate("jwt", { session: false })){
        if (!req.isAuthenticated()) {
            res.send(401, 'not logged in');
            return;
        }
    }
    if (fs.existsSync(sfile)) {
        // let code=fs.readFileSync(Filesystem.path+"/"+req.path);
        let dat = fs.statSync(sfile).mtime.getTime();
        if (req.query.lastcachedate === dat.toString()) {
            res.set('X-Custom-UpToDate', 'true');
            res.send("");
        } else {
            res.sendFile(resolve(sfile), {
                headers: { 'X-Custom-Date': dat.toString() }
            });
        }
    } else {
        next();
    }
    var s = 1;
}