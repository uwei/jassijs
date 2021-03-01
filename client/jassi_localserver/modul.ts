export default {
    "loadonstart":[
        "typeormbrowser",
        "jassi_localserver/Installserver",
        "js-sql-parser",
        "jassi_localserver/LocalProtocol"
    ],
    "require":{ 
        paths: {
            
            "js-sql-parser":"https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
            "typeorm":"jassi_localserver/ext/typeorm",
            "typeormbrowser":"https://uwei.github.io/jassijs/dist/typeorm/typeormbrowser",
            "window.SQL":"https://sql.js.org/dist/sql-wasm"
        },
        shim: {
        }
    
    }
}