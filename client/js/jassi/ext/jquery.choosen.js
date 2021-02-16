define("jassi/ext/jquery.choosen", ["jassi/remote/Jassi", "jquery.choosen"], function () {
    var path = require('jassi/modul').default.require.paths["jquery.choosen"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/chosen.css");
    return {
        default: ""
    };
});
//# sourceMappingURL=jquery.choosen.js.map