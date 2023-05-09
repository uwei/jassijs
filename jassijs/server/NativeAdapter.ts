import fs = require('fs');
import myfs=fs.promises;
import ts = require("typescript");

import JSZip = require("jszip");
import { JassiError } from 'jassijs/remote/Classes';
import Filesystem from './Filesystem';
import { Reloader } from './Reloader';
import { Compile } from './Compile';


export{ts};
class Stats{
    mtimeMs:number;
    isDirectory:()=>true;

}
class FS{
    async readdir(folder:string):Promise<string[]>{
        return [""];
    };
    async readFile(file:string,format:string):Promise<string>{
        return "";
    };
    async stat(file:string):Promise<Stats>{
        return new Stats();
    };
   
    createWriteStream(...any):any{
        throw new JassiError("Not supported");
    }
    async mkdir(file:string,option:{recursive?:boolean}){

    };
    async writeFile(file:string,data:string){

    };
    async rename(oldPath:string,newPath:string){

    }
    async unlink(file:string){
        
    }
    async copyFile(src:string,dest:string){
        throw new JassiError("Not supported");
    }
    watch(...any){
        throw new JassiError("Not supported");
    };
 
    async rmdir(dirName,options:{ recursive?: boolean }){

    }
}
//var myfs=new FS();
export {myfs};
export async function exists(filename:string):Promise<boolean>{
    return fs.existsSync(filename);
}
var zipid=0;
async function writeZip(zip: JSZip, outfile: string) {
    return new Promise((ready) => {

        var out =  fs.createWriteStream(outfile);
        zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true }).
            pipe(out).on('finish', () => {
                ready(undefined);
            }).on('error', (err) => {
                ready(err);
            });

    });
}
export async function dozip(directoryname: string, serverdir: boolean = undefined): Promise<string> {
    var root = new Filesystem().path;
    if (serverdir) {
        root = ".";
    }
    if(! fs.existsSync("./tmp")){
         fs.mkdirSync("./tmp");
    }

    let filename = directoryname.split("/")[directoryname.split("/").length - 1] + zipid++;
    await this.zipFolder(root + "/" + directoryname, "./tmp/" + filename + ".zip");
    var data =  fs.readFileSync("./tmp/" + filename + ".zip"); //,'binary');
    fs.unlinkSync("./tmp/" + filename + ".zip");
    //let buff = new Buffer(data);
    let ret = data.toString('base64');
    return ret;
}

async function zipFolder(folder: string, outfile: string, parent: JSZip = undefined) {

    var isRoot = parent === undefined;
    if (parent === undefined)
        parent = new JSZip();
    var _this = this;
    //var parent:FileNode[]=_this._getDirectory(file,results);
    var list: string[] =  fs.readdirSync(folder);

    for (var x = 0; x < list.length; x++) {
        var filename = list[x];
        var file = folder + "/" + filename;
        var stat =  fs.statSync(file);
        if (stat && stat.isDirectory()) {
            var newFolder = parent.folder(filename);
             await _this.zipFolder(file, outfile, newFolder);
        } else {
            var data =  fs.readFileSync(file, "binary");
            parent.file(filename, data, { binary: true });
        }
    }
    if (isRoot) {
        var d = await this.writeZip(parent, outfile);
        return d;
    }
    return parent;
}

export async function reloadJSAll(filenames: string[], afterUnload: () => {}) {
    return new Reloader().reloadJSAll(filenames,afterUnload);
}

