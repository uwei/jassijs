import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
import "jassijs/ext/jquerylib";
import { Component } from "jassijs/ui/Component";

var queueResolve = [];


/*export function doAfterLogin(resolve, prot: RemoteProtocol) {
    queue.push([resolve, prot]);
}*/
var isrunning = false;
var y = 0;
async function check(dialog: HTMLIFrameElement, win: Window) {
    //console.log("check"+(y++));

    var test: string = (win.document && win.document.body) ? win.document.body.innerHTML : "";
    if (test.indexOf("{}") !== -1) {
        //dialog.dialog("destroy");
        document.body.removeChild(dialog);
        isrunning = false;

        for (var x = 0; x < queueResolve.length; x++) {
            var res = queueResolve[x];
            res();
        }
        queueResolve = [];

        navigator.serviceWorker.controller.postMessage({
            type: 'LOGGED_IN'
        });//, [channel.port2]);
    } else if (test.indexOf('{"error"') !== -1) {
        //dialog.dialog("destroy");
        alert("Login failed");
        dialog.src = "./login.html";

        //document.body.removeChild(dialog);
        setTimeout(() => {
            check(dialog, win);
        }, 400);

    } else {
        //  if (!dialog.isClosed) {
        setTimeout(() => {
            check(dialog, win);
        }, 200);
        // }
    }
}
export async function login() {
    var pwait=new Promise((resolve=>{
        queueResolve.push(resolve);
    }))
    
    if(!isrunning){
        isrunning = true;
        setTimeout(() => {
            if (!fr.contentWindow) {
                alert("no content window for login");
            }
            check(fr, fr["contentWindow"]);
        }, 100);
        var fr: HTMLIFrameElement = <any>Component.createHTMLElement('<iframe  src="./login.html" name="navigation"></iframe>');
        document.body.appendChild(fr);
        fr.style.position = "absolute";
        fr.style.left = (window.innerWidth / 2 - fr.offsetWidth / 2) + "px";
        fr.style.top = (window.innerHeight / 2 - fr.offsetHeight / 2) + "px";
        fr.style.zIndex = "100";
        fr.contentWindow.focus();
        setTimeout(() => {
            (<HTMLElement>fr.contentWindow.document.querySelector("#loginButton"))?.focus();
        }, 200);
    
    }
 

    return pwait;
}

export function test() {
    //  login();

}