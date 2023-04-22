//navigator.serviceWorker.controller.postMessage({
//         type: 'LOGGED_IN'
//   });//
define(["require", "exports", "jassijs_localserver/LocalProtocol"], function (require, exports, LocalProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    navigator.serviceWorker.controller.postMessage({
        type: 'ACTIVATE_REMOTEPROTCOL'
    });
    // 
    navigator.serviceWorker.addEventListener("message", (evt) => {
        var _a;
        if (((_a = evt.data) === null || _a === void 0 ? void 0 : _a.type) === "REQUEST_REMOTEPROTCOL") {
            new LocalProtocol_1.LocalProtocol().messageReceived(evt);
        }
    });
});
//# sourceMappingURL=TestProt.js.map