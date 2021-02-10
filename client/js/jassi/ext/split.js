requirejs.config({
    paths: {
        'splitlib': '//cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min',
    },
});
define("jassi/ext/split", ["splitlib"], function (split) {
    jassi.myRequire("jassi/ext/split.css");
    return {
        default: split
    };
});
//# sourceMappingURL=split.js.map