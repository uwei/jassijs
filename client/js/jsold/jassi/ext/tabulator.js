define("jassijs/ext/tabulator", ['tabulatorlib'], function (Tabulator) {
    var path = require('jassijs/modul').default.require.paths["tabulatorlib"];
    jassijs.myRequire(path.replace("js", "css") + ".min.css");
    window.Tabulator = Tabulator;
});
//# sourceMappingURL=tabulator.js.map
//# sourceMappingURL=tabulator.js.map