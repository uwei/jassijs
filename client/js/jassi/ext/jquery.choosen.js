requirejs.config({
    paths: {
        //      'jquery.choosen':'lib/chosen/chosen.jquery',
        'jquery.choosen': '//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery',
    },
    shim: {
        "jquery.choosen": ["jquery"],
    }
});
define("jassi/ext/jquery.choosen", ["remote/jassi/base/Jassi", "jquery.choosen"], function (require) {
    jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css");
    return {
        default: ""
    };
});
//# sourceMappingURL=jquery.choosen.js.map