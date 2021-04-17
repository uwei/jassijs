define("jassi/ext/goldenlayout", ['goldenlayout', "jassi/remote/Jassi"], function (GoldenLayout) {
    var path = require('jassi/modul').default.require.paths["goldenlayout"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/css/goldenlayout-base.css");
    jassi.myRequire(path + "/css/goldenlayout-light-theme.css");
    return {
        default: GoldenLayout
    };
});
//# sourceMappingURL=goldenlayout.js.map
//# sourceMappingURL=goldenlayout.js.map