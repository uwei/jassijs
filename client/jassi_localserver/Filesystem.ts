

export default class Filesystem {
    private static db: IDBDatabase;
    private static async getDB() {
        if (Filesystem.db)
            return Filesystem.db;
        var req = window.indexedDB.open("jassi", 1);
        req.onupgradeneeded = function (event) {
            var db = event.target["result"];
            var objectStore = db.createObjectStore("files", { keyPath: "id" });
        }
        Filesystem.db = await new Promise((resolve) => {
            req.onsuccess=(ev)=>{resolve(ev.target["result"])};
        })

        return Filesystem.db;
    }
    async saveFiles(fileNames: string[], contents: string[]) {
        var db = await Filesystem.getDB();
        let transaction = db.transaction('files', 'readwrite');
        
        for (let x = 0; x < fileNames.length; x++) {
            let fname = fileNames[x];
            let data = contents[x];
            const store = transaction.objectStore('files');
            var el = {
                id: fname,
                value: data
            }
            store.put(el);
            
        }
        await new Promise((resolve) => { transaction.oncomplete=resolve })
    }
    async loadFile(fileName: string) {
        var db = await Filesystem.getDB();
        let transaction = db.transaction('files', 'readonly');
        
        const store = transaction.objectStore('files');
        
        var ret = await store.get(fileName);
       

        var r:any=await new Promise((resolve) => { 
            ret.onsuccess = ev => { resolve(ret.result) } 
            ret.onerror = ev => { resolve(undefined) } 
        });

        return (r?r.value:undefined);
    }

}

export async function test() {
    await new Filesystem().saveFiles(["hallo.js"], ["alert(2)"]);
    
    var test=await new Filesystem().loadFile("hallo1.js")
    
}