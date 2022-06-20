define("jassijs/ext/mysettings",["jassijs/remote/Jassi"], function(){
    //jassijs.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
    var path=require('jassijs/modul').default.require.paths["jquery.fancytree"]; 
    path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path+"/skin-win8/ui.fancytree.css");
    return {default:""};
});