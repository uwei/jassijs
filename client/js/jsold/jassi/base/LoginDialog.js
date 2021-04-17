define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.login = exports.doAfterLogin = void 0;
    var queue = [];
    function doAfterLogin(resolve, prot) {
        queue.push([resolve, prot]);
    }
    exports.doAfterLogin = doAfterLogin;
    var isrunning = false;
    async function check(dialog, win) {
        var test = (win.document && win.document.body) ? win.document.body.innerHTML : "";
        if (test.indexOf("{}") !== -1) {
            dialog.dialog("destroy");
            document.body.removeChild(dialog[0]);
            isrunning = false;
            for (var x = 0; x < queue.length; x++) {
                var data = queue[x];
                data[0](await data[1].call());
            }
            queue = [];
        }
        else {
            setTimeout(() => {
                check(dialog, win);
            }, 100);
        }
    }
    async function login() {
        if (isrunning)
            return;
        queue = [];
        isrunning = true;
        return new Promise((resolve) => {
            var fr = $(`
    <iframe src="/login.html" name="navigation"></iframe>
 `);
            document.body.appendChild(fr[0]);
            setTimeout(() => {
                if (!fr[0]["contentWindow"]) {
                    alert("no content window for login");
                }
                check(fr, fr[0]["contentWindow"]);
            }, 100);
            fr.dialog();
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
                     data:"user=admin&password=j@ssi"
                 })
                 form.dialog("destroy");
             })
            
             document.body.appendChild(form[0]);
             var ret=form.dialog({
                 modal:true
             });
             return ret;
         });*/
        });
    }
    exports.login = login;
});
//# sourceMappingURL=LoginDialog.js.map
//# sourceMappingURL=LoginDialog.js.map