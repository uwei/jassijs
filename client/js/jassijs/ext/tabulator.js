var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("tabulator-tables", ["require", "exports", "tabulatorlib", "jassijs/modul"], function (require, exports, tabulator, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tabulator = void 0;
    modul_1 = __importDefault(modul_1);
    var Tabulator = tabulator;
    exports.Tabulator = Tabulator;
    var path = modul_1.default.require.paths["tabulatorlib"];
    jassijs.myRequire(path.replace("/js/", "/css/") + ".css");
});
//# sourceMappingURL=tabulator.js.map