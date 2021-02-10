requirejs.config({
    paths: {
          'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min',
    },
   shim: {
        "spectrum": ["jquery"],
    }

});

define("jassi/ext/spectrum",["remote/jassi/base/Jassi","spectrum"],function(require){
    jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css");
            return {
                
                default:""
            }
    });
