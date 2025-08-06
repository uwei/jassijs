


require([], function(a,j) {
require.undef("testmodul/m4");

require.undef("testmodul/m2");

define("testmodul/m4",["require"], function(require) {
    return {
     hallo: 15,
     func:()=>9
    }
});

define("testmodul/m2",["require"], function(require,...args) {
    return {
     hallo: 2,
     func:async ()=>{
      debugger;
       await new Promise((res)=>setTimeout(res,1000));
       console.log("doit2");
    //   var kk=args[0];
        var h=require("./m4");
       return h.hallo;
     }
    }
});

require(["testmodul/m2"], function(a,j) {
debugger;

  console.log(a.func()); // 9
});
debugger;
});