



////GEHT NICHT 
////use requirejs(["https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min.js"],function(tinymcelib){
//var path = require('jassi/modul').default.require.paths["tinymcelib"];
//path=path.substring(0,path.lastIndexOf("/"));
//var path="//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min";
var tinyMCEPreInit = {
    suffix: '.min',
    base: "//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2",
    query: ''

};


define("jassi/ext/tinymce", ["tinymcelib"], function (require) {
    return {

        default: tinymce
    }
});