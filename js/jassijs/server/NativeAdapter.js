"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadJSAll = exports.dozip = exports.exists = exports.myfs = exports.ts = void 0;
const fs = require("fs");
var myfs = fs.promises;
exports.myfs = myfs;
const ts = require("typescript");
exports.ts = ts;
const JSZip = require("jszip");
const Classes_1 = require("jassijs/remote/Classes");
const Filesystem_1 = require("./Filesystem");
const Reloader_1 = require("./Reloader");
class Stats {
}
class FS {
    async readdir(folder) {
        return [""];
    }
    ;
    async readFile(file, format) {
        return "";
    }
    ;
    async stat(file) {
        return new Stats();
    }
    ;
    createWriteStream(...any) {
        throw new Classes_1.JassiError("Not supported");
    }
    async mkdir(file, option) {
    }
    ;
    async writeFile(file, data) {
    }
    ;
    async rename(oldPath, newPath) {
    }
    async unlink(file) {
    }
    async copyFile(src, dest) {
        throw new Classes_1.JassiError("Not supported");
    }
    watch(...any) {
        throw new Classes_1.JassiError("Not supported");
    }
    ;
    async rmdir(dirName, options) {
    }
}
async function exists(filename) {
    return fs.existsSync(filename);
}
exports.exists = exists;
var zipid = 0;
async function writeZip(zip, outfile) {
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
async function dozip(directoryname, serverdir = undefined) {
    var root = new Filesystem_1.default().path;
    if (serverdir) {
        root = ".";
    }
    if (!fs.existsSync("./tmp")) {
        fs.mkdirSync("./tmp");
    }
    let filename = directoryname.split("/")[directoryname.split("/").length - 1] + zipid++;
    await this.zipFolder(root + "/" + directoryname, "./tmp/" + filename + ".zip");
    var data = fs.readFileSync("./tmp/" + filename + ".zip"); //,'binary');
    fs.unlinkSync("./tmp/" + filename + ".zip");
    //let buff = new Buffer(data);
    let ret = data.toString('base64');
    return ret;
}
exports.dozip = dozip;
async function zipFolder(folder, outfile, parent = undefined) {
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
async function reloadJSAll(filenames, afterUnload) {
    return new Reloader_1.Reloader().reloadJSAll(filenames, afterUnload);
}
exports.reloadJSAll = reloadJSAll;
//# sourceMappingURL=NativeAdapter.js.map