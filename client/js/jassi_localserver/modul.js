define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "loadonstart": [
            "typeormbrowser",
            "jassi_localserver/Installserver",
            "js-sql-parser",
            "jassi_localserver/LocalProtocol"
        ],
        "require": {
            paths: {
                "js-sql-parser": "https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
                "typeorm": "jassi_localserver/ext/typeorm",
                "typeormbrowser": "http://localhost/jassijs/dist/typeorm/typeormbrowser",
                "window.SQL": "https://sql.js.org/dist/sql-wasm"
            },
            shim: {}
        }
    };
});
//# sourceMappingURL=modul.js.map