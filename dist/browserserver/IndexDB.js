"use strict";
browserserverworker.readIndexDB = async (dbName, storeName, key) => {
    key = storeName + "-" + key;
    storeName = "[system]";
    await browserserverworker._openDB(dbName, storeName);
    //const db = await browserserverworker._openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        try {
            const transaction = browserserverworker.myindexdb.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            var k = "dd";
            console.log("read " + dbName + "/" + storeName + "/" + key);
            const request = store.get(key);
            request.onsuccess = () => {
                resolve(request.result);
                //myindexdb.close();
            };
            request.onerror = () => {
                console.log("Error " + dbName + "/" + storeName + "/" + key);
                resolve(undefined);
                //myindexdb.close();
                //reject(request.error)
            };
        }
        catch (err) {
            return undefined;
        }
    });
};
browserserverworker._openDB = async (dbName, storeName) => {
    if (browserserverworker.myindexdb != undefined)
        return;
    browserserverworker.myindexdb = await new Promise((resolve, reject) => {
        // Zuerst prüfen, ob die DB existiert und ob der Store vorhanden ist
        const checkRequest = indexedDB.open(dbName);
        checkRequest.onerror = () => reject(checkRequest.error);
        checkRequest.onsuccess = () => {
            const db = checkRequest.result;
            if (db.objectStoreNames.contains(storeName)) {
                // Store existiert bereits – DB kann direkt verwendet werden
                resolve(db);
            }
            else {
                // Store fehlt – DB muss mit höherer Version neu geöffnet werden
                const newVersion = db.version + 1;
                db.close(); // Alte Verbindung schließen
                const upgradeRequest = indexedDB.open(dbName, newVersion);
                upgradeRequest.onerror = () => reject(upgradeRequest.error);
                upgradeRequest.onupgradeneeded = (event) => {
                    const upgradedDB = event.target.result;
                    if (!upgradedDB.objectStoreNames.contains(storeName)) {
                        upgradedDB.createObjectStore(storeName);
                    }
                };
                upgradeRequest.onsuccess = () => {
                    resolve(upgradeRequest.result);
                };
            }
        };
        checkRequest.onupgradeneeded = (event) => {
            // Falls die DB neu ist, wird dieser Block direkt ausgeführt
            const db = event.target.result;
            if (!db.objectStoreNames.contains(storeName)) {
                db.createObjectStore(storeName);
            }
        };
    });
};
// Async function to write a key-value pair to IndexedDB
browserserverworker.writeIndexDB = async (dbName, storeName, key, value) => {
    key = storeName + "-" + key;
    storeName = "[system]";
    await browserserverworker._openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        const transaction = browserserverworker.myindexdb.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);
        request.onsuccess = () => { resolve(true); };
        request.onerror = () => { reject(request.error); };
    });
};
//@ts-ignore
browserserverworker.keysIndexDB = async (dbName) => {
    let storeName = "[system]";
    await browserserverworker._openDB(dbName, storeName);
    //const db = await browserserverworker._openDB(dbName, storeName);
    return new Promise((resolve, reject) => {
        try {
            const transaction = browserserverworker.myindexdb.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const getKeysRequest = store.getAllKeys();
            getKeysRequest.onsuccess = function () {
                const keys = getKeysRequest.result;
                return keys;
            };
            getKeysRequest.onerror = function () {
                return undefined;
            };
        }
        catch (err) {
            return undefined;
        }
    });
};
//# sourceMappingURL=IndexDB.js.map