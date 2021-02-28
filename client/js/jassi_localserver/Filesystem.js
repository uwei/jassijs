define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class Filesystem {
        static async getDB() {
            if (Filesystem.db)
                return Filesystem.db;
            var req = window.indexedDB.open("jassi", 1);
            req.onupgradeneeded = function (event) {
                var db = event.target["result"];
                var objectStore = db.createObjectStore("files", { keyPath: "id" });
            };
            Filesystem.db = await new Promise((resolve) => {
                req.onsuccess = (ev) => { resolve(ev.target["result"]); };
            });
            return Filesystem.db;
        }
        async saveFiles(fileNames, contents) {
            var db = await Filesystem.getDB();
            let transaction = db.transaction('files', 'readwrite');
            for (let x = 0; x < fileNames.length; x++) {
                let fname = fileNames[x];
                let data = contents[x];
                const store = transaction.objectStore('files');
                var el = {
                    id: fname,
                    value: data
                };
                store.put(el);
            }
            await new Promise((resolve) => { transaction.oncomplete = resolve; });
        }
        async loadFile(fileName) {
            var db = await Filesystem.getDB();
            let transaction = db.transaction('files', 'readonly');
            const store = transaction.objectStore('files');
            var ret = await store.get(fileName);
            var r = await new Promise((resolve) => {
                ret.onsuccess = ev => { resolve(ret.result); };
                ret.onerror = ev => { resolve(undefined); };
            });
            return (r ? r.value : undefined);
        }
    }
    exports.default = Filesystem;
    async function test() {
        await new Filesystem().saveFiles(["hallo.js"], ["alert(2)"]);
        var test = await new Filesystem().loadFile("hallo1.js");
    }
    exports.test = test;
});
//# sourceMappingURL=Filesystem.js.map