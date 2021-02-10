import fs = require('fs');

var fpath = require('path');
import { Compile } from 'jassi/server/Compile';
import { DBManager } from 'jassi/server/DBManager';
import { Indexer } from 'jassi/server/Indexer';
import { FileNode } from 'remote/jassi/base/FileNode';
import JSZip = require("jszip");
let resolve = require('path').resolve;

var ignore = ["phpMyAdmin", "lib", "tmp", "_node_modules"]
export default class Filesystem {
    static allModules:{[name:string]:any[]}={};
    public static path = "./../client";
    _pathForFile(fileName: string) {
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
    public loadFile(fileName) {
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
    public dirFiles(dir: string, extensions: string[], ignore: string[] = []): string[] {
        var results = [];
        var list = fs.readdirSync(dir);
        var _this = this;
        list.forEach(function (file: string) {
            for (var x = 0; x < ignore.length; x++) {
                if (file === ignore[x])
                    return;
            }
            file = dir + '/' + file;

            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                /* Recurse into a subdirectory */
                results = results.concat(_this.dirFiles(file, extensions));
            } else {
                /* Is a file */
                for (var x = 0; x < extensions.length; x++) {
                    if (file.toLowerCase().endsWith(extensions[x]) && results.indexOf(file) === -1) {
                        results.push(file);
                    }
                }
            }
        });
        return results;
    }
    /*public updateRegistry() {
        var jsFiles: string[] = this.dirFiles(Filesystem.path, [".ts"], ["node_modules"])
        //create empty if needed
        if (!fs.existsSync(Filesystem.path + "/registry.json")) {
            fs.writeFileSync(Filesystem.path + "//registry.json", "{}");
        }
        var index = JSON.parse(fs.readFileSync(Filesystem.path + "//registry.json"));
        //remove deleted files
        for (var key in index) {
            if (!fs.existsSync(Filesystem.path + "/" + key)) {
                delete index[key];
            }
        }
       
        for (let x = 0; x < jsFiles.length; x++) {
            var jsFile = jsFiles[x];
            var fileName = jsFile.substring(Filesystem.path.length + 1);
            if(fileName===undefined||fileName.startsWith("tmp/"))
                continue;
               // findex(Filesystem.path + "/" + jsFile);

            var entry = index[fileName];
            if (entry === undefined) {
                entry = {};
                entry.date = undefined;
                index[fileName] = entry;
            }
            var stats = fs.statSync(Filesystem.path + "/" + jsFile);
            if (stats.mtime.getTime() !== entry.date) {
                entry.lines = [];
                var text = fs.readFileSync(Filesystem.path + "/" + jsFile).toString();
                var lines = text.split("jassi.register(");
                for (var y = 1; y < lines.length; y++) {
                    var line: string = lines[y];
                    var pos1 = line.indexOf(")");
                    var pos2 = line.indexOf("\n") - 1;
                    if (pos2 >= 0 && pos2 < pos1)
                        pos1 = pos2;
                    line = line.substring(0, pos1);
                    var fields: string[] = line.split(",");
                    for (var z = 0; z < fields.length; z++) {
                        fields[z] = fields[z].trim();
                        if (fields[z].startsWith('"') && fields[z].endsWith('"')) {
                            fields[z] = fields[z].substring(1, fields[z].length - 1);
                        }
                    }
                    entry.lines.push(fields);
                }
                entry.date = stats.mtime.getTime();
            }
        }
        fs.writeFileSync(Filesystem.path + "/registry.json", JSON.stringify(index, undefined, "\t"));
    }*/
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
    public async zipFolder(folder: string, outfile: string, parent: JSZip = undefined) {

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
     * @param filename - the name of the new file 
     * @param content - then content
     */
    public createFolder(filename: string): string {
        var newpath = this._pathForFile(filename);
        if (fs.existsSync(newpath))
            return filename + " allready exists";
        try {
            fs.mkdirSync(Filesystem.path + "/" + newpath, { recursive: true })
        } catch (ex) {
            return ex.message;
        }
    }
    /**
     * create a file
     * @param filename - the name of the new file 
     * @param content - then content
     */
    public createFile(filename: string, content: string): string {
        var newpath = this._pathForFile(filename);
        if (fs.existsSync(newpath))
            return filename + " allready exists";
        try {
            fs.writeFileSync(Filesystem.path + "/" + newpath, content)
        } catch (ex) {
            return ex.message;
        }
    }
    /**
     * renames a file or directory
     * @param oldfile - old filename
     * @param newfile - new filename
     */
    public rename(oldfile: string, newfile: string): string {
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
              if(fs.lstatSync(path).isDirectory())
                  fs.rmdirSync(path,  { recursive: true });
              else
                fs.unlinkSync(path);
        } catch (ex) {
            return ex.message;
        }
        return "";
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
    public async saveFiles(fileNames: string[], contents: string[],rollbackonerror:boolean=true) :Promise<string>{
        var ret:string="";
        var rollbackcontents:string[]=[];
        for (var x = 0; x < fileNames.length; x++) {
            let fileName = fileNames[x];
            var path = require('path').dirname(this._pathForFile(fileName));
            try {

                //var fdir = fpath.dirname(path + "/" + fileName).split(fpath.sep).pop();
                fs.mkdirSync(path, { recursive: true });
            } catch (err) {

            }
            if(fs.existsSync(this._pathForFile(fileName))){
                rollbackcontents.push(fs.readFileSync(this._pathForFile(fileName),{ encoding: 'utf-8' }));
            }else{
                rollbackcontents.push(undefined);//this file would be killed at revert
            }
            if(contents[x]===undefined)
                fs.unlinkSync(this._pathForFile(fileName));//remove file on revert
            else{
                fs.writeFileSync(this._pathForFile(fileName), contents[x]);
                //transpile remoteCode for Server
                if (fileName.toLowerCase().startsWith("remote/") && fileName.toLowerCase().endsWith(".ts")) {
                    new Compile().transpileRemote(fileName);
                }
            }
        }
        new Indexer().updateRegistry();
        var remotecodeincluded=false;
        for (var f = 0; f < fileNames.length; f++) {
            var fileName = fileNames[f];
            if(contents[f]===undefined)
                continue;
            if (fileName.toLowerCase().startsWith("remote/") && fileName.toLowerCase().endsWith(".ts")) {
                //reload Modules
                var remotecodeincluded=true;
                var test = require.resolve("remote/jassi/base/Classes");
                test = test.substring(0, test.length - "jassi/base/Classes.js".length);
                var jfiles=[];
                for (var jfile in require.cache) {

                    if (jfile.startsWith(test)) {
                        //save Modules
                        var p = "remote/"+jfile.substring(test.length).replaceAll("\\","/");
                        p = p.substring(0,p.length - 3);
                        if(Filesystem.allModules[p]===undefined){
                            Filesystem.allModules[p]=[];
                        }
                        var mod = await import(p);
                        if(Filesystem.allModules[p].indexOf(mod)===-1)
                            Filesystem.allModules[p].push(mod);
                        
                        jfiles.push(jfile);
                    }
                }
                for(let k=0;k<jfiles.length;k++){
                    let jfile=jfiles[k];
                    delete require.cache[jfile];
                }

                //                var ffile=require.resolve(fileName.replace(".ts",""));
                //              if(require.cache[ffile]!==undefined)
                //                delete require.cache[ffile];
                //reload DB+Extensions
/*                var vdat = registry.getJSONData("$DBObject");
                var vext = registry.getJSONData("$Extension");
                vdat = vdat.concat(vext);
                var found = false;
                for (var v = 0; v < vdat.length; v++) {
                    var val = vdat[v];
                    if (val.filename === fileName) {
                        found = true;
                    }
                };
                if (found) {*/
                    var man = await DBManager.destroyConnection();
               // }
            }
            
        };
        for (var key in Filesystem.allModules) {//load and migrate modules
            var all=Filesystem.allModules[key];
            var mod = await import(key);
            for(var a=0;a<all.length;a++){
                for(key in mod){
                    all[a][key]=mod[key];
                }
            }
        }
        if(remotecodeincluded&&rollbackonerror){//verify DB-Schema
            try{
                await DBManager.get();
            }catch(err){
                var restore=await this.saveFiles(fileNames,rollbackcontents,false);
                console.error(err.stack);
                return err+"DB corrupt changes are reverted "+restore;
            }
        }
        return ret;
    }
    public async saveFile(fileName: string, content) {
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
        new Indexer().updateRegistry();
        //TODO $this->updateRegistry();
    }
}

export function staticfiles(req, res, next) {

    // console.log(req.path);
    let sfile = Filesystem.path + "/" + req.path;
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