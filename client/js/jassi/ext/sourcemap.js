requirejs.config({
    paths: {
        'source.map': "https://unpkg.com/source-map@0.7.3/dist/source-map"
    }
});
//dummy for sourcemap 
define("fs", [], function () {
    return undefined;
});
define("path", [], function () {
    return undefined;
});
define("jassi/ext/sourcemap", ["source.map", "exports"], function (sm, exp) {
    exp = 1;
    // requirejs.undef("fs");
    // requirejs.undef("path");
    return {
        default: sm
    };
});
//# sourceMappingURL=sourcemap.js.map