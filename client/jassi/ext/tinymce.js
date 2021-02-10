



////GEHT NICHT 
////use requirejs(["https://cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min.js"],function(tinymcelib){
			
    var tinyMCEPreInit = {
        suffix: '.min',
        base: '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2',
        query: ''

    };

requirejs.config({
    paths: {
//        'tinymce':'lib/tinymce/tinymce.min',
//        'tinymce':'//cdnjs.cloudflare.com/ajax/libs/tinymce/5.0.14/tinymce.min'
        'tinymcelib':'//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min'
        
    }
});

define("jassi/ext/tinymce",["tinymcelib"], function(require) {
    return {
        
        default:tinymce
    }
});