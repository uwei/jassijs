
define("jassijs/ext/jquery.choosen",["jassijs/remote/Jassi","jquery.choosen"],function(){
    var path=require('jassijs/modul').default.require.paths["jquery.choosen"]; 
    path=path.substring(0,path.lastIndexOf("/"));      
    jassijs.myRequire(path+"/chosen.css");
            return {
                
                default:""
            }
    });
