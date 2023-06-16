


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
           var Server= (await import("jassijs/remote/Server")).Server;
           var text=await new Server().loadFile("jassijs.json");
           this.init(text);
        }
    }
    async saveJSON(){
        var myfs= (await import("jassijs/server/NativeAdapter")).myfs;
        var fname='./client/jassijs.json';
        
        await myfs.writeFile(fname,JSON.stringify(this.jsonData, undefined, "\t"));
        this.init(await myfs.readFile(fname));

    }
}
var config=new Config();
export {config};