"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticfiles = exports.syncRemoteFiles = void 0;
const fs = require("fs");
var fpath = require('path');
const Compile_1 = require("jassi/server/Compile");
const DBManager_1 = require("jassi/server/DBManager");
const JSZip = require("jszip");
const RegistryIndexer_1 = require("./RegistryIndexer");
let resolve = require('path').resolve;
var ignore = ["phpMyAdmin", "lib", "tmp", "_node_modules"];
class Filesystem {
    _pathForFile(fileName) {
        var path = Filesystem.path + "/" + fileName;
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
    dir(curdir = "", appendDate = false, parentPath = Filesystem.path, parent = undefined) {
        var _this = this;
        if (parent === undefined) {
            parent = { name: "", files: [] };
        }
        //var parent:FileNode[]=_this._getDirectory(file,results);
        var list = fs.readdirSync(parentPath + "/" + curdir);
        list.forEach(function (filename) {
            var file = curdir + (curdir === "" ? "" : '/') + filename;
            if (file !== "js" && file !== "tmp") { //compiled js
                var stat = fs.statSync(parentPath + "/" + file);
                if (stat && stat.isDirectory()) {
                    var newDir = { name: filename, files: [] };
                    parent.files.push(newDir);
                    /* Recurse into a subdirectory */
                    if (ignore.indexOf(file) === -1)
                        _this.dir(file, appendDate, parentPath, newDir);
                }
                else {
                    let dat = ""; //fs.statSync(file).mtime.getTime().toString();
                    let toAdd = { name: filename };
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
    loadFile(fileName) {
        return fs.readFileSync(this._pathForFile(fileName), { encoding: 'utf-8' });
    }
    loadFiles(fileNames) {
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
    async dirFiles(dir, extensions, ignore = []) {
        var results = [];
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
            }
            else {
                /* Is a file */
                for (var x = 0; x < extensions.length; x++) {
                    if (file.toLowerCase().endsWith(extensions[x]) && results.indexOf(file) === -1) {
                        results.push(file);
                    }
                }
            }
        }
        ;
        return results;
    }
    async writeZip(zip, outfile) {
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
    async zip(directoryname, serverdir = undefined) {
        var root = Filesystem.path;
        if (serverdir) {
            root = ".";
        }
        await this.zipFolder(root + "/" + directoryname, "/tmp/" + directoryname + ".zip");
        var data = fs.readFileSync("/tmp/" + directoryname + ".zip"); //,'binary');
        fs.unlinkSync("/tmp/" + directoryname + ".zip");
        //let buff = new Buffer(data);
        let ret = data.toString('base64');
        return ret;
    }
    async zipFolder(folder, outfile, parent = undefined) {
        var isRoot = parent === undefined;
        if (parent === undefined)
            parent = new JSZip();
        var _this = this;
        //var parent:FileNode[]=_this._getDirectory(file,results);
        var list = fs.readdirSync(folder);
        for (var x = 0; x < list.length; x++) {
            var filename = list[x];
            var file = folder + "/" + filename;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                var newFolder = parent.folder(filename);
                await _this.zipFolder(file, outfile, newFolder);
            }
            else {
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
     * @param filename - the name of the new file
     * @param content - then content
     */
    async createFolder(filename) {
        var newpath = this._pathForFile(filename);
        if (fs.existsSync(newpath))
            return filename + " allready exists";
        try {
            fs.mkdirSync(Filesystem.path + "/" + newpath, { recursive: true });
        }
        catch (ex) {
            return ex.message;
        }
        return "";
    }
    /**
     * create a file
     * @param filename - the name of the new file
     * @param content - then content
     */
    async createFile(filename, content) {
        var newpath = this._pathForFile(filename);
        var parent = require('path').dirname(Filesystem.path + "/" + newpath);
        //var fdir = fpath.dirname(path + "/" + fileName).split(fpath.sep).pop();
        if (fs.existsSync(newpath))
            return filename + " allready exists";
        try {
            if (!fs.existsSync(parent))
                fs.mkdirSync(parent, { recursive: true });
            fs.writeFileSync(Filesystem.path + "/" + newpath, content);
        }
        catch (ex) {
            return ex.message;
        }
        return "";
    }
    /**
     * renames a file or directory
     * @param oldfile - old filename
     * @param newfile - new filename
     */
    async rename(oldfile, newfile) {
        var resolve = require('path').resolve;
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
        }
        catch (ex) {
            return ex.message;
        }
        await new RegistryIndexer_1.ServerIndexer().updateRegistry();
        return "";
    }
    /**
    * deletes a file or directory
    * @param file - old filename
    */
    async remove(file) {
        var resolve = require('path').resolve;
        var path = this._pathForFile(file);
        if (!fs.existsSync(path))
            return file + " not exists";
        try {
            if (fs.lstatSync(path).isDirectory())
                fs.rmdirSync(path, { recursive: true });
            else
                fs.unlinkSync(path);
        }
        catch (ex) {
            return ex.message;
        }
        await new RegistryIndexer_1.ServerIndexer().updateRegistry();
        return "";
    }
    /**
     * create modul in ./jassi.json
     * @param modul
     */
    createRemoteModulIfNeeded(modul) {
        var modules = JSON.parse(fs.readFileSync("./jassi.json", 'utf-8'));
        if (!modules.modules[modul]) {
            modules.modules[modul] = modul;
            fs.writeFileSync("./jassi.json", JSON.stringify(modules, undefined, "\t"));
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
    async saveFiles(fileNames, contents, rollbackonerror = true) {
        var ret = "";
        var rollbackcontents = [];
        for (var x = 0; x < fileNames.length; x++) {
            let fileName = fileNames[x];
            var path = require('path').dirname(this._pathForFile(fileName));
            try {
                //var fdir = fpath.dirname(path + "/" + fileName).split(fpath.sep).pop();
                fs.mkdirSync(path, { recursive: true });
            }
            catch (err) {
            }
            if (fs.existsSync(this._pathForFile(fileName))) {
                rollbackcontents.push(fs.readFileSync(this._pathForFile(fileName), { encoding: 'utf-8' }));
            }
            else {
                rollbackcontents.push(undefined); //this file would be killed at revert
            }
            if (contents[x] === undefined)
                fs.unlinkSync(this._pathForFile(fileName)); //remove file on revert
            else {
                fs.writeFileSync(this._pathForFile(fileName), contents[x]);
                //transpile remoteCode for Server
                let spath = fileName.split("/");
                if (spath.length > 1 && spath[1].toLowerCase() === "remote" && fileName.toLowerCase().endsWith(".ts")) {
                    this.createRemoteModulIfNeeded(spath[0]);
                    new Compile_1.Compile().transpile(fileName);
                }
            }
        }
        await new RegistryIndexer_1.ServerIndexer().updateRegistry();
        var remotecodeincluded = false;
        for (var f = 0; f < fileNames.length; f++) {
            var fileName = fileNames[f];
            if (contents[f] === undefined)
                continue;
            var spath = fileName.split("/");
            if (spath.length > 1 && spath[1].toLowerCase() === "remote" && fileName.toLowerCase().endsWith(".ts")) {
                //reload Modules
                var remotecodeincluded = true;
                var root = require.resolve("jassi/remote/Classes");
                root = root.substring(0, root.length - "jassi/remote/Classes.js".length);
                var modules = JSON.parse(fs.readFileSync("./jassi.json", 'utf-8')).modules;
                var jfiles = [];
                for (var modul in modules) {
                    for (var jfile in require.cache) {
                        if (jfile.replaceAll("\\", "/").startsWith(root.replaceAll("\\", "/") + modul + "/remote")) {
                            //save Modules
                            var p = jfile.substring(root.length).replaceAll("\\", "/");
                            p = p.substring(0, p.length - 3);
                            if (Filesystem.allModules[p] === undefined) {
                                Filesystem.allModules[p] = [];
                            }
                            var mod = await Promise.resolve().then(() => require(p));
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
                var man = await DBManager_1.DBManager.destroyConnection();
                // }
            }
        }
        ;
        try {
            for (var key in Filesystem.allModules) { //load and migrate modules
                var all = Filesystem.allModules[key];
                var mod = await Promise.resolve().then(() => require(key));
                for (var a = 0; a < all.length; a++) {
                    for (key in mod) {
                        all[a][key] = mod[key];
                    }
                }
            }
        }
        catch (err) {
            var restore = await this.saveFiles(fileNames, rollbackcontents, false);
            console.error(err.stack);
            return err + "DB corrupt changes are reverted " + restore;
        }
        if (remotecodeincluded && rollbackonerror) { //verify DB-Schema
            try {
                await DBManager_1.DBManager.get();
            }
            catch (err) {
                var restore = await this.saveFiles(fileNames, rollbackcontents, false);
                console.error(err.stack);
                return err + "DB corrupt changes are reverted " + restore;
            }
        }
        return ret;
    }
    async saveFile(fileName, content) {
        try {
            var path = this._pathForFile(fileName);
            var fdir = fpath.dirname(path).split(fpath.sep).pop();
            fs.mkdirSync(fdir, { recursive: true });
        }
        catch (err) {
        }
        fs.writeFileSync(Filesystem.path + "/" + fileName, content);
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
        await new RegistryIndexer_1.ServerIndexer().updateRegistry();
        //TODO $this->updateRegistry();
    }
}
exports.default = Filesystem;
Filesystem.allModules = {};
Filesystem.path = "./../client";
function copyFile(f1, f2) {
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
    }
    catch (ex) {
        console.error(ex);
        debugger;
    }
}
/**
 *  each remote file on server and client should be the same
*/
async function checkRemoteFiles() {
    var modules = JSON.parse(fs.readFileSync("./jassi.json", 'utf-8')).modules;
    for (var m in modules) {
        var files = await new Filesystem().dirFiles("./" + m + "/remote", [".ts"]);
        for (let x = 0; x < files.length; x++) {
            var file = files[x];
            var clientfile = file.replace("./", Filesystem.path + "/");
            if (!fs.existsSync(clientfile)) {
                console.error(clientfile + " not exists");
            }
            else {
                if (fs.statSync(file).mtimeMs !== fs.statSync(clientfile).mtimeMs) {
                    if (fs.statSync(file).mtimeMs > fs.statSync(clientfile).mtimeMs) {
                        console.error(clientfile + " is not up to date " + file + " is newer");
                    }
                    else {
                        console.error(file + " is not up to date " + clientfile + " is newer");
                    }
                }
            }
        }
    }
}
function syncRemoteFiles() {
    /*await*/ checkRemoteFiles();
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
    });
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
    });
}
exports.syncRemoteFiles = syncRemoteFiles;
function staticfiles(req, res, next) {
    // console.log(req.path);
    let sfile = Filesystem.path + "/" + req.path;
    if (fs.existsSync(sfile)) {
        // let code=fs.readFileSync(Filesystem.path+"/"+req.path);
        let dat = fs.statSync(sfile).mtime.getTime();
        if (req.query.lastcachedate === dat.toString()) {
            res.set('X-Custom-UpToDate', 'true');
            res.send("");
        }
        else {
            res.sendFile(resolve(sfile), {
                headers: { 'X-Custom-Date': dat.toString() }
            });
        }
    }
    else {
        next();
    }
    var s = 1;
}
exports.staticfiles = staticfiles;
//# sourceMappingURL=Filesystem.js.map