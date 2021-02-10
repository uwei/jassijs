requirejs.config({
    paths: {
          'lodash':'//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
    },
  

});

define("jassi/ext/lodash",["lodash"],function(lodash){
    //jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min.css");
            return {
                
                default:lodash
            }
    });
