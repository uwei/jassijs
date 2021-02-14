requirejs.config({
    paths: {
        'jquery.contextMenu': '//rawgit.com/s-yadav/contextMenu.js/master/contextMenu',
    },
    shim: {
    "jquery.contextMenu": ["jquery.ui"]
    }

}); 

define("jassi/ext/jquery.contextmenu",["jassi/remote/Jassi","jquery.contextMenu"], function(require) {
    jassi.myRequire("//rawgit.com/s-yadav/contextMenu.js/master/contextMenu.css");
    return {
        
        default:""
    }
});