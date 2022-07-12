/// <amd-dependency path="tinymcelib" name="tinymce"/>
declare var tinymce;




////GEHT NICHT 
////use requirejs(["https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min.js"],function(tinymcelib){
//var path = require('jassijs/modul').default.require.paths["tinymcelib"];
//path=path.substring(0,path.lastIndexOf("/"));
//var path="//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min";

const tinymceBind = window["tinymce"].DOM.bind;
window["tinymce"].DOM.bind = (target, name, func, scope) => {
    // TODO This is only necessary until https://github.com/tinymce/tinymce/issues/4355 is fixed
    if (name === 'mouseup' && func.toString().includes('throttle()')) {
        return func;
    } else {
        return tinymceBind(target, name, func, scope);
    }
};
export default tinymce;

