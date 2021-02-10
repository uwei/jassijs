require.config({
    paths : {
        //create alias to plugins (not needed if plugins are on the baseUrl)
        text: '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text',
    }
});
define(["text!../../../../index.json"], function(registry_json){
    return {
            default:registry_json,
            reloadRegistry:async function(){
                var ret=new Promise(function(resolve){
                    requirejs.undef("text!../../../../index.json");
                    require(["text!../../../../index.json"], function(registry){
                        resolve(registry);  
                    });
                });
                return ret;
            }
        };
});
window["jassiversion"]=new Date().getTime();
/*
define(["text!../../../../index.json?bust="+window.jassiversion], function(registry_json){
    return {
            default:registry_json,
            reloadRegistry:async function(){
                var ret=new Promise(function(resolve){
                    requirejs.undef("text!../../../../index.json?bust="+window["jassiversion"]);
                    require(["text!../../../../index.json?bust="+window["jassiversion"]], function(registry){
                        resolve(registry);  
                    });
                });
                return ret;
            }
        };
});*/