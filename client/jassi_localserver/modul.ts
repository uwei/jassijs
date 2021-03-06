export default {
    "loadbeforestart":["js-sql-parser","typeormbrowser","jassi_localserver/Installserver"],
    "loadonstart":[
        "jassi_localserver/LocalProtocol"
    ],
    "require":{ 
        paths: {
            "jszip":"https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip",
            "js-sql-parser":"https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
            "typeorm":"jassi_localserver/ext/typeorm",
            "typeormbrowser":"https://uwei.github.io/jassijs/dist/typeorm/typeormbrowser",
            "window.SQL":"https://sql.js.org/dist/sql-wasm"
        },
        shim: {
        }
    
    }
}