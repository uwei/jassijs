requirejs.config({
    paths: {
        'jquery.w2ui':'../../lib/w2ui-1.5.rc1',
//        'jquery.w2ui':"//w2ui.com/src/w2ui-1.5.rc1.min"
    },
   shim: {
        "jquery.w2ui": ["jquery"],
    }

});

define("jassi/ext/jquery.w2ui",["remote/jassi/base/Jassi",'jquery.w2ui'],function(require){
    jassi.myRequire("lib/w2ui-1.5.rc1.css");

            return {
                default:w2ui
            }
    });
