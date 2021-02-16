//polyfill for old ios
var def = [];
if (window.IntersectionObserver === undefined) {
    var path = require('jassi/modul').default.require.paths["intersection-observer"];
    def = [path];
}
define("jassi/ext/intersection-observer", def, function () {
    return {};
});
//# sourceMappingURL=intersection-observer.js.map