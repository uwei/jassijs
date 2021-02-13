import jassi from "jassi/remote/Jassi";
import registry from "jassi/remote/Registry";

export class Extensions
 /**
  * extend an existing class
  * @class jassi.base.Extension
  */
 {
     items:any;
        constructor(){
            this.items={};
        }
        /**
         * extend the class
         * @param {class} type - extend the type - add functions
         */
        extend(classname,classdef){
            var exts:any=this.items[classname];
            if(exts!==undefined){
                for(var alias in exts){
                    var cl:any=exts[alias];
                    if(cl.extend){
                        cl.extend(classdef);
                    }
                }
            }
        }
        async forFile(file){
            var items=await registry.getJSONData("extensions");
            return items[file];
        }
        /**
         * init the Extensions
         */
        init(){

            /*
            var config={
                paths:{},
                shim:{},
                map:{'*':{}}
            }

            var items=registry.get("extensions");
            for(var clname in items){
                var file=clname.replaceAll(".","/");
                config.paths[clname]=file;
                config.map["*"][file]=clname;
                
                var files=["jassi/jassi"];
                for(var f=0;f<items[clname].length;f++){
                    files.push("js/"+items[clname][f].file.replace(".ts",".js"));
                }
                config.shim[clname]=files;
            }*/
            //requirejs.config(config);
       
        }
        /**
         * extend an existing class
         * all methods and property where copied 
         * @param {string} - the name of the class to extend
         * @param {class} - the class
         */
        register(name,extClass,alias){
            if(alias===undefined)
                throw "Error Extension "+name+": alias must be implemented";
            if(this.items[name]===undefined)
                this.items[name]={};
            this.items[name][alias]=extClass;
        }
        
     
    }
   
    var extensions=jassi.extensions;
    export default extensions;


