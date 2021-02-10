//polyfill for old ios
var def = [];
if (window.IntersectionObserver === undefined) {
    def = ['//cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js'];
}
define("jassi/ext/intersection-observer", def, function () {
    return {};
});
//# sourceMappingURL=intersection-observer.js.map