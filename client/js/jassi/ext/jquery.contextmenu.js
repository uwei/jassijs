define("jassi/ext/jquery.contextmenu", ["jassi/remote/Jassi", "jquery.contextMenu"], function () {
    var path = require('jassi/modul').default.require.paths["jquery.contextMenu"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassi.myRequire(path + "/contextMenu.css");
    return {
        default: ""
    };
});
//# sourceMappingURL=jquery.contextmenu.js.map