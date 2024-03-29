define(["require", "exports", "jassijs/ui/Component", "jassijs/ext/jquerylib"], function (require, exports, Component_1) {
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
            //dialog.dialog("destroy");
            document.body.removeChild(dialog);
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
        else if (test.indexOf('{"error"') !== -1) {
            //dialog.dialog("destroy");
            alert("Login failed");
            dialog.src = "/login.html";
            //document.body.removeChild(dialog);
            setTimeout(() => {
                check(dialog, win);
            }, 400);
        }
        else {
            //  if (!dialog.isClosed) {
            setTimeout(() => {
                check(dialog, win);
            }, 200);
            // }
        }
    }
    async function login() {
        if (isrunning)
            return;
        queue = [];
        isrunning = true;
        return new Promise((resolve) => {
            setTimeout(() => {
                if (!fr.contentWindow) {
                    alert("no content window for login");
                }
                check(fr, fr["contentWindow"]);
            }, 100);
            var fr = Component_1.Component.createHTMLElement('<iframe  src="/login.html" name="navigation"></iframe>');
            document.body.appendChild(fr);
            fr.style.position = "absolute";
            fr.style.left = (window.innerWidth / 2 - fr.offsetWidth / 2) + "px";
            fr.style.top = (window.innerHeight / 2 - fr.offsetHeight / 2) + "px";
            fr.style.zIndex = "100";
            fr.contentWindow.focus();
            setTimeout(() => {
                var _a;
                (_a = fr.contentWindow.document.querySelector("#loginButton")) === null || _a === void 0 ? void 0 : _a.focus();
            }, 200);
        });
    }
    exports.login = login;
    function test() {
        //  login();
    }
    exports.test = test;
});
//# sourceMappingURL=LoginDialog.js.map