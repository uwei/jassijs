define(["require", "exports", "jassijs/ext/jquerylib"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.login = exports.doAfterLogin = void 0;
    var queue = [];
    function doAfterLogin(resolve, prot) {
        queue.push([resolve, prot]);
    }
    exports.doAfterLogin = doAfterLogin;
    var isrunning = false;
    var y = 0;
    async function check(dialog, win) {
        //console.log("check"+(y++));
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
            navigator.serviceWorker.controller.postMessage({
                type: 'LOGGED_IN'
            }); //, [channel.port2]);
        }
        else {
            if (!dialog.isClosed) {
                setTimeout(() => {
                    check(dialog, win);
                }, 100);
            }
        }
    }
    async function login() {
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
            var fr;
            fr = $(`<iframe  src="/login.html" name="navigation"></iframe>`);
            document.body.appendChild(fr[0]);
            fr.dialog({
                beforeClose: () => {
                    //@ts-ignore
                    fr.isClosed = true;
                }
            });
            fr[0].contentWindow.focus();
            setTimeout(() => {
                $(fr).contents().find("#loginButton").focus();
            }, 200);
        });
    }
    exports.login = login;
    function test() {
        //login();
    }
    exports.test = test;
});
//# sourceMappingURL=LoginDialog.js.map