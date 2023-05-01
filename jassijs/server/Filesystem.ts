//synchronize-server-client
import { FileNode } from 'jassijs/remote/FileNode';

import { ServerIndexer } from './RegistryIndexer';
import registry, { $Class } from 'jassijs/remote/Registry';
import { $Serverservice, runningServerservices, serverservices } from '../remote/Serverservice';
import { dozip, myfs, exists, reloadJSAll, transpile } from './NativeAdapter';
import { config } from 'jassijs/remote/Config';


var ignore = ["phpMyAdmin", "lib", "tmp", "_node_modules"]
declare global {
    interface Serverservice {
        filesystem: Promise<Filesystem>;
    }
}
@$Serverservice({ name: "filesystem", getInstance: async () => { return new Filesystem() } })
@$Class("jassijs.server.Filesystem")
export default class Filesystem {
    static allModules: { [name: string]: any[] } = {};
    public path = "./client";
    _pathForFile(fileName: string, fromServerdirectory: boolean = undefined) {
        if (fileName.startsWith("/"))
            fileName = fileName.substring(1);
        var path = this.path + "/" + fileName;
        if (fromServerdirectory)
            path = "./" + fileName.replace("$serverside/", "");
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
    async dir(curdir = "", appendDate = false, parentPath = this.path, parent: FileNode = undefined): Promise<FileNode> {
        try {

            var _this = this;
            var modules = config.server.modules;
            if (parent === undefined) {
                parent = { name: "", files: [] };
            }
            //var parent:FileNode[]=_this._getDirectory(file,results);

            var list: string[] = await myfs.readdir(parentPath + (curdir === "" ? "" : ("/" + curdir)));
            for (var xx = 0; xx < list.length; xx++) {
                var filename = list[xx];
                var file = curdir + (curdir === "" ? "" : '/') + filename;
                if (file !== "js" && file !== "tmp") {//compiled js

                    var stat = await myfs.stat(parentPath + "/" + file);
                    if (stat && stat.isDirectory()) {
                        var newDir = { name: filename, files: [] };
                        parent.files.push(newDir)
                        /* Recurse into a subdirectory */
                        if (ignore.indexOf(file) === -1)
                            await _this.dir(file, appendDate, parentPath, newDir);
                    } else {
                        let dat = "";
                        let toAdd: FileNode = { name: filename };
                        if (appendDate === true)
                            toAdd.date = (await myfs.stat(parentPath + "/" + file)).mtimeMs.toString();
                        // if (file.toLowerCase().endsWith(".ts"))
                        parent.files.push(toAdd);
                        /* if (file.toLowerCase().endsWith(".js")) {
                             if (!await exists(file.replace(".js", ".ts"))) {
                                 parent.files.push(toAdd);
                             }
                         }
                         if (file.toLowerCase().endsWith(".json"))
                             parent.files.push(toAdd);*/
                    }
                }
            };
            //add files in node modules
            if (parent.name === "" && parentPath === "./client") {
                for (var key in modules) {
                    if (await exists("./node_modules/" + key + "/client")) {
                        var addFiles = await this.dir("client", appendDate, "./node_modules/" + key);
                        var temp = {};
                        for (var x = 0; x < parent.files.length; x++) {
                            var entr = parent.files[x];
                            temp[entr.name] = entr;
                        }
                        for (var x = 0; x < addFiles.files.length; x++) {
                            if (temp[addFiles.files[x].name] === undefined) {
                                parent.files.push(addFiles.files[x]);
                                //addFiles.files[x].isNode_module=true;
                            }
                        }
                    }
                }
            }
            return parent;
        } catch (err) {
            throw err;
        }
    }
    public async loadFile(fileName: string) {
        var fromServerdirectory = fileName.startsWith("$serverside/");
        let file = this._pathForFile(fileName, fromServerdirectory);
        return await myfs.readFile(file, 'utf-8');

    }
    public async loadFiles(fileNames: string[]) {
        var ret = {};

        for (var x = 0; x < fileNames.length; x++) {

            ret[fileNames[x]] = await myfs.readFile(this._pathForFile(fileNames[x]), 'utf-8');
            /* await myfs.readFile(path+"/"+fileName, {encoding: 'utf-8'}, function(err,data){
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
        if (!await exists(dir))
            return results;
        var list = await myfs.readdir(dir);
        var _this = this;
        for (let l = 0; l < list.length; l++) {
            let file = list[l];
            if (ignore.indexOf(file) !== -1)
                continue;
            file = dir + '/' + file;

            var stat = await myfs.stat(file);
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



    public async zip(directoryname: string, serverdir: boolean = undefined): Promise<string> {
        return await dozip(directoryname, serverdir);
    }
    //Reset ORM config
    /**
     * create a folder
     * @param foldername - the name of the new file 
     */
    public async createFolder(foldername: string): Promise<string> {
        var newpath = this._pathForFile(foldername);
        if (await exists(newpath))
            return foldername + " allready await exists";
        try {
            await myfs.mkdir(newpath, { recursive: true })
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
            if (!await exists(newpath))
                await myfs.mkdir(newpath, { recursive: true });
            //create remotefolder
            //if (!await exists(newpath + "/remote"))
            //    await myfs.mkdir(newpath + "/remote", { recursive: true });
            if (!await exists(newpath + "/modul.ts")) {
                await this.saveFiles([modulename + "/modul.js", "js/" + modulename + "/modul.js"], [
                    "export default {}",
                    'define(["require", "exports"], function (require, exports) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = {};});'
                ]);
            }

            if (!await exists(newpath + "/registry.js")) {
                await this.saveFiles([modulename + "/registry.js", "js/" + modulename + "/registry.js"], [
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );',
                    'define("' + modulename + '/registry",["require"], function(require) {return {  default: {	} } } );',
                ]);
            }
            /* if (!await exists("./" + modulename))
                 await myfs.mkdir("./" + modulename, { recursive: true });
             if (!await exists("./js/" + modulename))
                 await myfs.mkdir("./js/" + modulename, { recursive: true });
             if (!await exists("./" + modulename + "/remote"))
                 await myfs.mkdir("./" + modulename + "/remote", { recursive: true });
             if (!await exists("./" + modulename + "/registry.js")) {
                 await myfs.writeFile("./" + modulename + "/registry.js", 'Object.defineProperty(exports, "__esModule", { value: true });exports.default={}');
                 await myfs.writeFile("./js/" + modulename + "/registry.js", 'Object.defineProperty(exports, "__esModule", { value: true });exports.default={}');
 
             }*/


            //update client jassijs.json
            if (!config.modules[modulename])
                config.jsonData.modules[modulename] = modulename;
            await config.saveJSON();
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
        var parent = this.getDirectoryname(newpath);

        if (await exists(newpath))
            return filename + " allready await exists";
        try {
            if (!await exists(parent))
                await myfs.mkdir(parent, { recursive: true });

            await myfs.writeFile(newpath, content)
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
        var oldpath = this._pathForFile(oldfile);
        var newpath = this._pathForFile(newfile);
        if (!await exists(oldpath))
            return oldfile + " not await exists";
        if (await exists(newpath))
            return newfile + " already await exists";
        try {
            /*  if(fs.lstatSync(oldpath).isDirectory()
                 await myfs.rmdir((oldpath, newpath);
              else*/
            await myfs.rename(oldpath, newpath);
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
        delete config.jsonData.server.modules[modul];
        await config.saveJSON();
        if (await exists(modul)) {
            await myfs.rmdir(modul, { recursive: true });
        }
        return "";
    }
    /**
    * deletes a file or directory 
    * @param file - old filename
    */
    public async remove(file: string): Promise<string> {
        var path = this._pathForFile(file);
        if (!await exists(path))
            return file + " not await exists";
        try {
            if ((await myfs.stat(path)).isDirectory()) {

                //update client jassijs.json if removing client module 
                if (config.modules[file]) {
                    delete config.jsonData.modules[file];
                    await config.saveJSON();
                }
                await myfs.rmdir(path, { recursive: true });
            } else
                await myfs.unlink(path);
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
    async createRemoteModulIfNeeded(modul: string) {
        if (!config.jsonData.server.modules[modul]) {
            config.jsonData.server.modules[modul] = modul;
            await config.saveJSON();
        }
    }
    getDirectoryname(ppath) {
        var path = ppath.replaceAll("\\", "/");
        return path.substring(0, path.lastIndexOf("/"));
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
    public async saveFiles(fileNames: string[], contents: string[], rollbackonerror: boolean = true): Promise<string> {
        var ret: string = "";
        var rollbackcontents: string[] = [];
        var modules = config.server.modules;
        var remoteFiles: string[] = [];
        for (var x = 0; x < fileNames.length; x++) {
            let fileName = fileNames[x];
            var fromServerdirectory = fileName.startsWith("$serverside/");
            var path = this.getDirectoryname(this._pathForFile(fileName, fromServerdirectory));// require('path').dirname(this._pathForFile(fileName,fromServerdirectory));
            //check if file is node_module
            for (var key in modules) {
                if (((path + "/").startsWith("./client/" + key + "/")) && await exists("./node_modules/" + key)) {
                    return "packages in node_modules could not be saved";
                }
            }

            try {

                await myfs.mkdir(path, { recursive: true });
            } catch (err) {

            }
            if (await exists(this._pathForFile(fileName, fromServerdirectory))) {
                rollbackcontents.push(await myfs.readFile(this._pathForFile(fileName, fromServerdirectory), 'utf-8'));
            } else {
                rollbackcontents.push(undefined);//this file would be killed at revert
            }
            if (contents[x] === undefined)
                await myfs.unlink(this._pathForFile(fileName, fromServerdirectory));//remove file on revert
            else {
                await myfs.writeFile(this._pathForFile(fileName, fromServerdirectory), contents[x]);
                //transpile remoteCode for Server
                let spath = fileName.split("/");
                if ((fromServerdirectory || (spath.length > 1 && spath[1].toLowerCase() === "remote")) && fileName.toLowerCase().endsWith(".ts")) {
                    var fneu = fileName.replace("$serverside/", "");
                    let rpath = this.getDirectoryname("./" + fneu);
                    try {
                        await myfs.mkdir(rpath, { recursive: true });
                    } catch (err) {
                    }
                    await myfs.writeFile("./" + fneu, contents[x]);
                    if (spath.length > 1 && spath[0] !== "$serverside")
                        await this.createRemoteModulIfNeeded(spath[0]);
                    transpile(fneu, fromServerdirectory);
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
            var fromServerdirectory = fileName.startsWith("$serverside/");
            
            if (fromServerdirectory || (spath.length > 1 && spath[1].toLowerCase() === "remote") && fileName.toLowerCase().endsWith(".ts")) {
                var remotecodeincluded = true;
                remoteFiles.push(fileName.substring(0, fileName.length - 3));

                // }
            }


        };

        try {
            if (remotecodeincluded) {
                await reloadJSAll(remoteFiles, async () => {
                    if (runningServerservices["db"]) {
                        (await serverservices.db).renewConnection();
                    }
                });
            }
        } catch (err) {
            var restore = await this.saveFiles(fileNames, rollbackcontents, false);
            console.error(err.stack);
            return err + "DB corrupt changes are reverted " + restore;
        }
        if (remotecodeincluded) {
            await registry.reload();
        }
        if (remotecodeincluded && rollbackonerror) {//verify DB-Schema
            try {
                await serverservices.db;
            } catch (err) {
                var restore = await this.saveFiles(fileNames, rollbackcontents, false);
                console.error(err.stack);
                return err + "DB corrupt changes are reverted " + restore;
            }
        }
        return ret;
    }
    public async saveFile(fileName: string, content: string) {
        try {
            var fdir = this.getDirectoryname(this._pathForFile(fileName));
            // var fdir = path.substring(0,path.lastIndexOf("/"));//fpath.dirname(path).split(fpath.sep).pop();
            await myfs.mkdir(fdir, { recursive: true });
        } catch (err) {

        }
        await myfs.writeFile(this.path + "/" + fileName, content)
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
