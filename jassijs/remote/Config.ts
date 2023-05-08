


export class Config{
    isLocalFolderMapped:boolean;
    isServer:boolean;
    modules:{[modul:string]:string};
    server:{
        modules:{[modul:string]:string};
    };
    jsonData:any;
    clientrequire:any;
    serverrequire:any;
    constructor(){
        if(!window.document){
            this.isServer=true;
            //@ts-ignore
            var fs=require("fs"); 
            this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
         }
    }
    init(configtext:string){
        this.jsonData= JSON.parse(configtext);
        this.modules=this.jsonData.modules;
        this.server=<any>{
            modules:this.jsonData.server.modules
        }
    }
    async reload(){
        if(!window.document){
            this.isServer=true;
             //@ts-ignore
            var fs=require("fs");
            this.init(fs.readFileSync('./client/jassijs.json', 'utf-8'));
        }else{
           var myfs= (await import("jassijs/server/NativeAdapter")).myfs;
           this.init(await myfs.readFile('./client/jassijs.json','utf-8'));
        }
    }
    async saveJSON(){
        var myfs= (await import("jassijs/server/NativeAdapter")).myfs;
        await myfs.writeFile('./client/jassijs.json',JSON.stringify(this.jsonData, undefined, "\t"));
        this.init(await myfs.readFile('./client/jassijs.json'));

    }
}
var config=new Config();
export {config};