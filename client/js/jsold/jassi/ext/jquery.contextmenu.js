define("jassijs/ext/jquery.contextmenu", ["jassijs/remote/Jassi", "jquery.contextMenu"], function () {
    var path = require('jassijs/modul').default.require.paths["jquery.contextMenu"];
    path = path.substring(0, path.lastIndexOf("/"));
    jassijs.myRequire(path + "/contextMenu.css");
    return {
        default: ""
    };
});
//# sourceMappingURL=jquery.contextmenu.js.map
//# sourceMappingURL=jquery.contextmenu.js.map