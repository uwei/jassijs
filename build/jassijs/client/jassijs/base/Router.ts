import { $Class } from "jassijs/remote/Registry";

import("jassijs/remote/Classes");
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import {ComponentDescriptor} from "jassijs/ui/ComponentDescriptor";
import windows from "jassijs/base/Windows";

@$Class("jassijs.base.Router")
export class Router
 /**
  * routing of url
  * @class jassijs.base.Database
  */
 {
        constructor(){

        }
        /**
         * registers a database class
         * @param {string} - the name of the class
         * @param {class} - the class
         */
        register(name,data){
            throw "Error not implemented";
        }
        /**
         * resolve the url
         * @param {string} hash - the hash to resolve
         */
        resolve(hash){
            if(hash==="")
                return;
            var tags=hash.substring(1).split("&");
            var params:any={};
            for(var x=0;x<tags.length;x++){
                var kv=tags[x].split("=");
                params[kv[0]]=kv[1];
            }
            if(params.do!==undefined){
                var clname=params.do;
                //load js file
                classes.loadClass(clname).then(function(cl){
                        if(cl===undefined)
                            return;
                        var props=ComponentDescriptor.describe(cl).fields;;

                        var id=undefined;
                            for(var p=0;p<props.length;p++){
                                if(props[p].id){
                                    id=props[p].name;
                                }
                            }

                        var name=params.do;
                        if(params[id])
                            name=name+"-"+params[id];
                        if(windows.contains(name)){
                            var window=windows.show(name);
                            var ob=windows.findComponent(name);
                            if(ob!==undefined){
                                for(var key in params){
                                    if(key!=="do"&&     //no classname
                                       key!==id){       //no id!
                                        ob[key]=params[key];
                                    }
                                }
                            }
                            return window;
                        }else{
                            var ob=new cl();
                            for(var key in params){
                                if(key!=="do"){
                                    ob[key]=params[key];
                                }
                            }
                            windows.add(ob,ob.title,name);
                            if(ob.callEvent!==undefined){
                                windows.onclose(ob,function(param){
                                    ob.callEvent("close",param);
                                });
                            }
                        }
                    });
                /*var urltags=[];
                for(var p=0;p<props.length;p){
                    if(props[p].isUrlTag){
                        urltags.push(props[p]);
                    }
                }*/
                
                
            }
        }
        /**
         * generate a URL from the component
         * @param {jassijs.ui.Component} component - the component to inspect
         */
        getURLFromComponent(component){
            
        }
        /**
         * 
         * @param {string} hash - the hash to navigate
         */
        navigate(hash){
            window.location.hash=hash;
            this.resolve(hash);
        }
     
    }; 
    
    window.addEventListener("popstate",function(evt){
        router.resolve(window.location.hash);
        
    });
let router=new Router();
export {router};