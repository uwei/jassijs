define("typeorm", ["typeorm/index"], function (tp) {
    return tp;
});
define("sha.js", [], () => { return {}; });
define("dotenv", [], () => { return {}; });
define("chalk", [], () => { return {}; });
define("cli-highlight", [], () => { return {}; });
define("events", [], () => { return {}; });
define("stream", [], () => { return {}; });
define("mkdirp", [], () => { return {}; });
define("glob", [], () => { return {}; });
define("app-root-path", [], () => { return {}; });
define("debug", [], () => { return {}; });
define("js-yaml", [], () => { return {}; });
define("xml2js", [], () => { return {}; });
window.Buffer = {
    isBuffer: function (ob) {
        return false;
    }
};
window.global = window;
define("jassi_localserver/ext/typeormbrowser", ["window.SQL", "typeorm-browser"], function (sql, tp) {
    var pt = require("typeorm/platform/PlatformTools");
    pt.PlatFormTools.type = "browser";
    window.SQL = sql;
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
});
//# sourceMappingURL=typeormbrowser.js.map