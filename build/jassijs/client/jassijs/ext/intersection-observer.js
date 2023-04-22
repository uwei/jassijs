//polyfill for old ios

var def=[];
if(window.IntersectionObserver===undefined){
    def=["intersection-observer"];
}
define("jassijs/ext/intersection-observer",def,function(){
   return {
                
            }
    });
