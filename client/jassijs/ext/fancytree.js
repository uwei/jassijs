//Hack for jquery.fancytree.dnd
define("jquery-ui/ui/widgets/draggable",function(){
    return jQuery.ui;

});
define("jquery-ui/ui/widgets/droppable",function(){
    return jQuery.ui;

});
//END Hack

define("jassijs/ext/fancytree",["jassijs/remote/Jassi","jquery.fancytree",'jquery.fancytree.filter','jquery.fancytree.multi','jquery.fancytree.dnd'], function(){
    //jassijs.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
    var path=require('jassijs/modul').default.require.paths["jquery.fancytree"]; 
    path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path+"/skin-win8/ui.fancytree.css");
    return {default:""};
});