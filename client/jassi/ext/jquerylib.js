
requirejs.config({
    waitSeconds: 200,
    paths: {
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery',
        //'jquery': 'lib/jquery',
        'jquery.ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui',
        //'jquery.ui': 'lib/jquery-ui', 
        'jquery.ui.touch': '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
        'jquery.doubletap': '//cdnjs.cloudflare.com/ajax/libs/jquery-touch-events/2.0.3/jquery.mobile-events.min',
        'jquery.notify':'//cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min',
    },
   shim: {
        'jquery.ui': ["jquery"],
        'jquery.notify': ["jquery"],
        'jquery.ui.touch':["jquery","jquery.ui"],
        'jquery.doubletap':["jquery"],
        'jassi/jassi': ['jquery','jquery.ui','jquery.ui.touch'],
    },
   // urlArgs : "bust="+window.jassiversion

});
define("jassi/ext/jquerylib",[
 "jquery",
"jquery.ui",
"jquery.ui.touch",
"jquery.doubletap",
"jquery.notify"],function(require){
            $.notify.defaults({ position:"bottom right",className:"info" });
            return {
                
                default:""
            }
    });
