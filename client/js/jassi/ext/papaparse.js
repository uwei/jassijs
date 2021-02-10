requirejs.config({
    paths: {
        'papaparse': '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.3/papaparse.min',
    },
});
define("jassi/ext/papaparse", ["papaparse"], function (papa) {
    // jassi.myRequire("//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css");
    return {
        Papa: papa
    };
});
//# sourceMappingURL=papaparse.js.map