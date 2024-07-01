

class Modules{
    modules:{[modul:string]:string};
    server:Modules;
    constructor(){
        if(!window.document){
            var fs=require("fs");
            var all= JSON.parse(fs.readFileSync('./client/jassijs.json', 'utf-8'));
            Object.assign(this,all);
        }
    }
}

var modules=new Modules();
export {modules}