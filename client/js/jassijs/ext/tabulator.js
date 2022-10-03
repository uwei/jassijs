define("tabulator-tables", ["require", "exports", "tabulatorlib", "jassijs/modul"], function (require, exports, tabulator, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tabulator = void 0;
    var Tabulator = tabulator;
    exports.Tabulator = Tabulator;
    var path = modul_1.default.require.paths["tabulatorlib"];
    jassijs.myRequire(path.replace("js", "css") + ".min.css");
});
//# sourceMappingURL=tabulator.js.map