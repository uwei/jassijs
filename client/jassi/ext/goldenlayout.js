requirejs.config({
    paths: {
        'goldenlayout': '//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout',
         //'jquery.fancytree': '//cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.32.0/jquery.fancytree-all-deps.min',
        //"jquery-ui/ui/widgets/menu":"a",
        //'jquery.ui.contextmenu': 'lib/jquery.ui-contextmenu',
        // 'jquery.contextMenu': 'lib/jquery.contextMenu',
        // 'jquery.ui.position': 'lib/jquery.ui.position',
    },
   shim: {
    'goldenlayout': ["jquery"]
        //"jquery.ui.contextmenu": ["jquery.ui"]
       // "jquery.contextMenu": ["jquery.ui",'jquery.ui.position'],jquery.ui-contextmenu
    }

});
define("jassi/ext/goldenlayout",['goldenlayout',"remote/jassi/base/Jassi"],function(GoldenLayout){
    //jassi.myRequire("lib/goldenlayout-base.css");
    //jassi.myRequire("lib/goldenlayout-light-theme.css");        
    jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css");
    jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-light-theme.css");
    return {
                default:GoldenLayout
            }
    });
