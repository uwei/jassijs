define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ServerImpl = void 0;
    class ServerImpl {
        async getInstance() {
            var db = window.indexedDB.open("jassi", 1);
            db.onupgradeneeded = function (event) {
                var db = event.target.result;
                var objectStore = db.createObjectStore("files", { keyPath: "id" });
            };
            await new Promise((resolve) => {
                db.onsuccess = ev => {
                    resolve();
                };
            });
        }
    }
    exports.ServerImpl = ServerImpl;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=ServerImpl.js.map