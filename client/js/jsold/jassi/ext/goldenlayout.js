define("jassijs/ext/goldenlayout", ['goldenlayout', "jassijs/remote/Jassi"], function (GoldenLayout) {
    var path = require('jassijs/modul').default.require.paths["goldenlayout"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassijs.myRequire(path + "/css/goldenlayout-base.css");
    jassijs.myRequire(path + "/css/goldenlayout-light-theme.css");
    return {
        default: GoldenLayout
    };
});
//# sourceMappingURL=goldenlayout.js.map
//# sourceMappingURL=goldenlayout.js.map