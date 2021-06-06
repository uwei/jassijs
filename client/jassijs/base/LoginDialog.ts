import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
import "jassijs/ext/jquerylib";
var queue = [];
export function doAfterLogin(resolve, prot: RemoteProtocol) {
    queue.push([resolve, prot]);
}
var isrunning = false;
var y=0;
async function check(dialog, win: Window) {
    //console.log("check"+(y++));

    var test: string = (win.document && win.document.body) ? win.document.body.innerHTML : "";
    if (test.indexOf("{}") !== -1) {
        dialog.dialog("destroy");
        document.body.removeChild(dialog[0]);
        isrunning = false;

        for (var x = 0; x < queue.length; x++) {
            var data = queue[x];
            data[0](await data[1].call());
        }
        queue = [];
        navigator.serviceWorker.controller.postMessage({
            type: 'LOGGED_IN'
        });//, [channel.port2]);
    } else {
        if (!dialog.isClosed) {
            setTimeout(() => {
                check(dialog, win);
            }, 100);
        }
    }
}
export async function login() {
    if (isrunning)
        return;
    queue = [];
    isrunning = true;
    return new Promise((resolve) => {
       

       setTimeout(() => {
            if (!fr[0]["contentWindow"]) {
                alert("no content window for login");
            }
            check(fr, fr[0]["contentWindow"]);
        }, 100);
        var fr ;
       
            fr = $(`<iframe  src="/login.html" name="navigation"></iframe>`);
            document.body.appendChild(fr[0]);
            fr.dialog({
                beforeClose: () => {
                    //@ts-ignore
                    fr.isClosed = true;
                }
            });
            fr[0].contentWindow.focus();
            setTimeout(()=>{
                $(fr).contents().find("#loginButton").focus(); 
            },200);
        
        //ts-ignore
       
//fr[0].contentWindow.document.body.focus();
        /* var sform = `
         
         <form    action="javascript:alert(9);" method="post" class="" >
             <input type="text" name="username" ><br>
             <input type="password" name="password" ><br>
              <button  class="LoginButton" type="button">Login</button>
         </form>
         
         `;
         var form = $(sform);
         form.submit("submit", function (e) {
            // e.preventDefault();
         });
         form.find(":button").on("click", () => {
             //@ts-ignore
             form.submit();
             $.post({
                 url:"user/login",
                 data:"user=admin&password=jsi"
             })
             form.dialog("destroy");
         })
        
         document.body.appendChild(form[0]);
         var ret=form.dialog({
             modal:true
         });
         return ret;
     });*/

    })
}

export function test() {
    login();
}