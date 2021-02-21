define("jassi/ext/tabulator", ['tabulatorlib'], function (Tabulator) {
    
    var path = require('jassi/modul').default.require.paths["tabulatorlib"];
    jassi.myRequire(path.replace("js", "css") + ".min.css");
    window.Tabulator = Tabulator;
    
});
