define(["require", "exports", "remote/jassi/base/Jassi", "jassi/base/Errors", "remote/jassi/base/Classes", "remote/jassi/base/Jassi", "jassi/base/Extensions", "remote/jassi/base/Registry", "jassi/ext/jquerylib", "jassi/ext/intersection-observer"], function (require, exports, Jassi_1, Errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Jassi_1.default.errors = new Errors_1.Errors();
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js');
        navigator.serviceWorker.addEventListener("message", (evt) => {
            if (evt.data === "wait for login") {
                new Promise((resolve_1, reject_1) => { require(["jassi/base/LoginDialog"], resolve_1, reject_1); }).then((data) => {
                    data.login();
                    //          navigator.serviceWorker.controller.postMessage("logindialog closed");
                });
            }
        });
    }
    //jassi.extensions.init();
    exports.default = Jassi_1.default;
});
//# sourceMappingURL=jassi.js.map