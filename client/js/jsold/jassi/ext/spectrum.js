define("jassi/ext/spectrum", ["jassi/remote/Jassi", "spectrum"], function () {
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path = require('jassi/modul').default.require.paths["spectrum"];
    //path=path.substring(0,path.lastIndexOf("/"));
    jassi.myRequire(path + ".css");
    return {
        default: ""
    };
});
//# sourceMappingURL=spectrum.js.map
//# sourceMappingURL=spectrum.js.map