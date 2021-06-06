
define("jassijs/ext/spectrum",["jassijs/remote/Jassi","spectrum"],function(){
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path=require('jassijs/modul').default.require.paths["spectrum"]; 
    //path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path+".css");
            return {
                
                default:""
            }
    });
