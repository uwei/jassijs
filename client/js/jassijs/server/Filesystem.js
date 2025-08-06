var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
define(["require", "exports", "./RegistryIndexer", "jassijs/remote/Registry", "../remote/Serverservice", "./NativeAdapter", "jassijs/remote/Config", "./Compile"], function (require, exports, RegistryIndexer_1, Registry_1, Serverservice_1, NativeAdapter_1, Config_1, Compile_1) {
    "use strict";
    var Filesystem_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    Registry_1 = __importStar(Registry_1);
    var ignore = ["phpMyAdmin", "lib", "tmp", "_node_modules"];
    let Filesystem = Filesystem_1 = class Filesystem {
        constructor() {
            this.path = "./client";
        }
        _pathForFile(fileName, fromServerdirectory = undefined) {
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
        async dir(curdir = "", appendDate = false, parentPath = this.path, parent = undefined) {
            try {
                var _this = this;
                var modules = Config_1.config.server.modules;
                if (parent === undefined) {
                    parent = { name: "", files: [] };
                }
                //var parent:FileNode[]=_this._getDirectory(file,results);
                var list = await NativeAdapter_1.myfs.readdir(parentPath + (curdir === "" ? "" : ("/" + curdir)));
                for (var xx = 0; xx < list.length; xx++) {
                    var filename = list[xx];
                    var file = curdir + (curdir === "" ? "" : '/') + filename;
                    if (file !== "js" && file !== "tmp") { //compiled js
                        try {
                            var stat = await NativeAdapter_1.myfs.stat(parentPath + "/" + file);
                            if (stat && stat.isDirectory()) {
                                var newDir = { name: filename, files: [] };
                                parent.files.push(newDir);
                                /* Recurse into a subdirectory */
                                if (ignore.indexOf(file) === -1)
                                    await _this.dir(file, appendDate, parentPath, newDir);
                            }
                            else {
                                let dat = "";
                                let toAdd = { name: filename };
                                if (appendDate === true)
                                    toAdd.date = (await NativeAdapter_1.myfs.stat(parentPath + "/" + file)).mtimeMs.toString();
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
                        catch (err) {
                            debugger;
                            console.warn("could not dir " + file);
                        }
                    }
                }
                ;
                //add files in node modules
                if (parent.name === "" && parentPath === "./client") {
                    for (var key in modules) {
                        if (await (0, NativeAdapter_1.exists)("./node_modules/" + key + "/client")) {
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
            }
            catch (err) {
                throw err;
            }
        }
        async loadFile(fileName) {
            var fromServerdirectory = fileName.startsWith("$serverside/");
            let file = this._pathForFile(fileName, fromServerdirectory);
            return await NativeAdapter_1.myfs.readFile(file, 'utf-8');
        }
        async loadFiles(fileNames) {
            var ret = {};
            for (var x = 0; x < fileNames.length; x++) {
                ret[fileNames[x]] = await NativeAdapter_1.myfs.readFile(this._pathForFile(fileNames[x]), 'utf-8');
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
        async dirFiles(dir, extensions, ignore = []) {
            var results = [];
            if (!await (0, NativeAdapter_1.exists)(dir))
                return results;
            var list = await NativeAdapter_1.myfs.readdir(dir);
            var _this = this;
            for (let l = 0; l < list.length; l++) {
                let file = list[l];
                if (ignore.indexOf(file) !== -1)
                    continue;
                file = dir + '/' + file;
                var stat = await NativeAdapter_1.myfs.stat(file);
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
        async zip(directoryname, serverdir = undefined) {
            return await (0, NativeAdapter_1.dozip)(directoryname, serverdir);
        }
        //Reset ORM config
        /**
         * create a folder
         * @param foldername - the name of the new file
         */
        async createFolder(foldername) {
            var newpath = this._pathForFile(foldername);
            if (await (0, NativeAdapter_1.exists)(newpath))
                return foldername + " allready await exists";
            try {
                await NativeAdapter_1.myfs.mkdir(newpath, { recursive: true });
            }
            catch (ex) {
                return ex.message;
            }
            return "";
        }
        /**
         * create a module
         * @param modulname - the name of the module
      
         */
        async createModule(modulename) {
            var newpath = this._pathForFile(modulename);
            try {
                //create folder
                if (!await (0, NativeAdapter_1.exists)(newpath))
                    await NativeAdapter_1.myfs.mkdir(newpath, { recursive: true });
                //create remotefolder
                //if (!await exists(newpath + "/remote"))
                //    await myfs.mkdir(newpath + "/remote", { recursive: true });
                if (!await (0, NativeAdapter_1.exists)(newpath + "/modul.ts")) {
                    await this.saveFiles([modulename + "/modul.ts", "js/" + modulename + "/modul.js"], [
                        "export default {}",
                        'define(["require", "exports"], function (require, exports) {Object.defineProperty(exports, "__esModule", { value: true });exports.default = {};});'
                    ]);
                }
                if (!await (0, NativeAdapter_1.exists)(newpath + "/registry.js")) {
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
                if (!Config_1.config.modules[modulename])
                    Config_1.config.jsonData.modules[modulename] = modulename;
                await Config_1.config.saveJSON();
                //this.createRemoteModulIfNeeded(modulename);
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
            var parent = this.getDirectoryname(newpath);
            if (await (0, NativeAdapter_1.exists)(newpath))
                return filename + " allready await exists";
            try {
                if (!await (0, NativeAdapter_1.exists)(parent))
                    await NativeAdapter_1.myfs.mkdir(parent, { recursive: true });
                await NativeAdapter_1.myfs.writeFile(newpath, content);
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
            var oldpath = this._pathForFile(oldfile);
            var newpath = this._pathForFile(newfile);
            if (!await (0, NativeAdapter_1.exists)(oldpath))
                return oldfile + " not await exists";
            if (await (0, NativeAdapter_1.exists)(newpath))
                return newfile + " already await exists";
            try {
                /*  if(fs.lstatSync(oldpath).isDirectory()
                     await myfs.rmdir((oldpath, newpath);
                  else*/
                await NativeAdapter_1.myfs.rename(oldpath, newpath);
            }
            catch (ex) {
                return ex.message;
            }
            await new RegistryIndexer_1.ServerIndexer().updateRegistry();
            return "";
        }
        /**
        * deletes a server module
        * @param modul - to delete
        */
        async removeServerModul(modul) {
            delete Config_1.config.jsonData.server.modules[modul];
            await Config_1.config.saveJSON();
            if (await (0, NativeAdapter_1.exists)(modul)) {
                await NativeAdapter_1.myfs.rmdir(modul, { recursive: true });
            }
            return "";
        }
        /**
        * deletes a file or directory
        * @param file - old filename
        */
        async remove(file) {
            var path = this._pathForFile(file);
            if (!await (0, NativeAdapter_1.exists)(path))
                return file + " not await exists";
            try {
                if ((await NativeAdapter_1.myfs.stat(path)).isDirectory()) {
                    //update client jassijs.json if removing client module 
                    if (Config_1.config.modules[file]) {
                        delete Config_1.config.jsonData.modules[file];
                        await Config_1.config.saveJSON();
                    }
                    await NativeAdapter_1.myfs.rmdir(path, { recursive: true });
                }
                else
                    await NativeAdapter_1.myfs.unlink(path);
            }
            catch (ex) {
                return ex.message;
            }
            await new RegistryIndexer_1.ServerIndexer().updateRegistry();
            return "";
        }
        /**
         * create modul in ./jassijs.json
         * @param modul
         */
        async createRemoteModulIfNeeded(modul) {
            if (!Config_1.config.jsonData.server.modules[modul]) {
                Config_1.config.jsonData.server.modules[modul] = modul;
                await Config_1.config.saveJSON();
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
        async saveFiles(fileNames, contents, rollbackonerror = true) {
            var ret = "";
            var rollbackcontents = [];
            var modules = Config_1.config.server.modules;
            var remoteFiles = [];
            for (var x = 0; x < fileNames.length; x++) {
                let fileName = fileNames[x];
                var fromServerdirectory = fileName.startsWith("$serverside/");
                var path = this.getDirectoryname(this._pathForFile(fileName, fromServerdirectory)); // require('path').dirname(this._pathForFile(fileName,fromServerdirectory));
                //check if file is node_module
                for (var key in modules) {
                    if (((path + "/").startsWith("./client/" + key + "/")) && await (0, NativeAdapter_1.exists)("./node_modules/" + key)) {
                        return "packages in node_modules could not be saved";
                    }
                }
                try {
                    await NativeAdapter_1.myfs.mkdir(path, { recursive: true });
                }
                catch (err) {
                }
                if (await (0, NativeAdapter_1.exists)(this._pathForFile(fileName, fromServerdirectory))) {
                    rollbackcontents.push(await NativeAdapter_1.myfs.readFile(this._pathForFile(fileName, fromServerdirectory), 'utf-8'));
                }
                else {
                    rollbackcontents.push(undefined); //this file would be killed at revert
                }
                if (contents[x] === undefined)
                    await NativeAdapter_1.myfs.unlink(this._pathForFile(fileName, fromServerdirectory)); //remove file on revert
                else {
                    await NativeAdapter_1.myfs.writeFile(this._pathForFile(fileName, fromServerdirectory), contents[x]);
                    //transpile remoteCode for Server
                    let spath = fileName.split("/");
                    if ((fromServerdirectory || (spath.length > 1 && spath[1].toLowerCase() === "remote")) && fileName.toLowerCase().endsWith(".ts")) {
                        var fneu = fileName.replace("$serverside/", "");
                        let rpath = this.getDirectoryname("./" + fneu);
                        try {
                            await NativeAdapter_1.myfs.mkdir(rpath, { recursive: true });
                        }
                        catch (err) {
                        }
                        await NativeAdapter_1.myfs.writeFile("./" + fneu, contents[x]);
                        if (spath.length > 1 && spath[0] !== "$serverside")
                            await this.createRemoteModulIfNeeded(spath[0]);
                        await new Compile_1.Compile().transpileServercode(fneu, fromServerdirectory);
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
                var fromServerdirectory = fileName.startsWith("$serverside/");
                if (fromServerdirectory || (spath.length > 1 && spath[1].toLowerCase() === "remote") && fileName.toLowerCase().endsWith(".ts")) {
                    var remotecodeincluded = true;
                    remoteFiles.push(fileName.substring(0, fileName.length - 3));
                    // }
                }
            }
            ;
            try {
                if (remotecodeincluded) {
                    await (0, NativeAdapter_1.reloadJSAll)(remoteFiles, async () => {
                        if (Serverservice_1.runningServerservices["db"]) {
                            (await Serverservice_1.serverservices.db).renewConnection();
                        }
                    });
                }
            }
            catch (err) {
                var restore = await this.saveFiles(fileNames, rollbackcontents, false);
                console.error(err.stack);
                return err + "DB corrupt changes are reverted " + restore;
            }
            if (remotecodeincluded) {
                await Registry_1.default.reload();
            }
            if (remotecodeincluded && rollbackonerror) { //verify DB-Schema
                try {
                    await Serverservice_1.serverservices.db;
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
                var fdir = this.getDirectoryname(this._pathForFile(fileName));
                // var fdir = path.substring(0,path.lastIndexOf("/"));//fpath.dirname(path).split(fpath.sep).pop();
                await NativeAdapter_1.myfs.mkdir(fdir, { recursive: true });
            }
            catch (err) {
            }
            await NativeAdapter_1.myfs.writeFile(this.path + "/" + fileName, content);
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
    };
    Filesystem.allModules = {};
    Filesystem = Filesystem_1 = __decorate([
        (0, Serverservice_1.$Serverservice)({ name: "filesystem", getInstance: async () => { return new Filesystem_1(); } }),
        (0, Registry_1.$Class)("jassijs.server.Filesystem")
    ], Filesystem);
    exports.default = Filesystem;
});
//# sourceMappingURL=Filesystem.js.map