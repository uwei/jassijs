
import jassi from    "jassi/remote/Jassi";
import  "jassi/remote/Classes";
import  "jassi/remote/Jassi";
//import  "jassi/base/Router";
import  "jassi/base/Extensions";
import "jassi/remote/Registry";
import "jassi/ext/jquerylib";
import "jassi/ext/intersection-observer";
import { Errors } from "jassi/base/Errors";
declare global {
  interface JQueryStatic {
          notify: any;
  }
}
jassi.errors=new Errors();
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
  navigator.serviceWorker.addEventListener("message", (evt) => {
    if(evt.data==="wait for login") {
      import("jassi/base/LoginDialog").then((data)=>{
        data.login();
//          navigator.serviceWorker.controller.postMessage("logindialog closed");
      })
    }
  });
}

//jassi.extensions.init();
export default jassi;


