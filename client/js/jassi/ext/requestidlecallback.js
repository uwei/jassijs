//END Hack
requirejs.config({
    paths: {
        //'jquery.fancytree': '//cdnjs.cloudflare.com/ajax/libs/jquery.fancytree/2.35.0/jquery.fancytree-all.min',
        'ric': '//cdn.jsdelivr.net/npm/requestidlecallback@0.3.0/index.min',
    },
    shim: {}
});
define("jassi/ext/requestidlecallback", ["ric"], function () {
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //jassi.myRequire("//cdn.jsdelivr.net/npm/jquery.fancytree@2.35.0/dist/skin-win8/ui.fancytree.css");
    return { default: "" };
});
//# sourceMappingURL=requestidlecallback.js.map