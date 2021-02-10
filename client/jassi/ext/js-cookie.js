requirejs.config({
    paths: {
  //      'jquery.choosen':'lib/chosen/chosen.jquery',
          'js-cookie':'//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
    }
});

define("jassi/ext/js-cookie",['js-cookie'],function(cookie){
            return {
                
                default:cookie
            }
    });
