//define("jassijs/ext/tabulator", ['tabulatorlib'], function (Tabulator) {
define("tabulator-tables", ['tabulatorlib'], function (Tabulator) {
    var path = require('jassijs/modul').default.require.paths["tabulatorlib"];
    jassijs.myRequire(path.replace("js", "css") + ".min.css");
    return { Tabulator };
});
//# sourceMappingURL=tabulator.js.map