//@ts-ignore

import "jassijs/remote/Classes";
import { classes } from "jassijs/remote/Classes";
import registry from "jassijs/remote/Registry";

export class ServerserviceProperties {
    name: string;
    getInstance:(()=>Promise<any>) 
}
var runningServerservices = {};
var beforeServiceLoadHandler=[];
export function beforeServiceLoad(func:(name:string,props:ServerserviceProperties)=>void){
    beforeServiceLoadHandler.push(func);
}
declare global{ 
    interface Serverservice{

    }
}
async function  resolve(target, prop, receiver){
    var khsdf=runningServerservices;
    if (target[prop]) { 
        return  await target[prop]; 
    } else {
        var all = await registry.getJSONData("$Serverservice");
        for (var x = 0; x < all.length; x++) { 
            var serv = all[x];
            var name = serv.params[0].name;
            if (name === prop) { 
                var classname = serv.classname;
                var cl = await registry.getJSONData("$Class", classname);
                //@ts-ignore
                if (require.main) {//nodes load project class from module
                    /*for (var jfile in require.cache) {
                        if(jfile.replaceAll("\\","/").endsWith(serv.filename.substring(0,serv.filename.length-2)+"js")){
                            delete require.cache[jfile];
                        }
                    }*/
                    //@ts-ignore
                    var h=require.main.require(classname.replaceAll(".", "/"));
                   // await Promise.resolve().then(() => require.main.require(classname.replaceAll(".", "/")));
                } else {
                    await classes.loadClass(classname); //await import(classname.replaceAll(".", "/"));
                } 
                var props:ServerserviceProperties=registry.getData("$Serverservice",classname)[0].params[0];
                for(var x=0;x<beforeServiceLoadHandler.length;x++){
                    await beforeServiceLoadHandler[x](<string>prop,props);
                }
                var instance= props.getInstance();
               
                target[prop]=instance;
                return instance;
                   
            }
            
        }
    }
    throw new Error("serverservice not found:" + <string>prop);

}
var serverservices: Serverservice = <any>new Proxy(runningServerservices, {
    get(target, prop, receiver) {
        return  resolve(target,prop,receiver);
       // return new Promise(async (resolve, reject) => {
       //     
      //      reject("serverservice not found:" + <string>prop);
      //  });
    }
});  

export function $Serverservice(properties: ServerserviceProperties): Function {
    return function (pclass) {
        registry.register("$Serverservice", pclass, properties);
    }
}
 

var doNotReloadModule=true;
export { serverservices,doNotReloadModule,runningServerservices};


