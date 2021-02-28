define("typeorm", ["typeorm/index", "typeorm/platform/PlatformTools", "window.SQL", "reflect-metadata"], function (to, pf, sql) {
    pf.PlatformTools.type = "browser";
    window.SQL = sql;
    return to;
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
define("path", [], () => { return {}; });
define("fs", [], () => { return {}; });
window.Buffer = {
    isBuffer: function (ob) {
        return false;
    }
};
window.global = window;
define("jassi_localserver/ext/typeorm-browser", ["typeorm"], function (sql) {
    //jassi.myRequire("lib/skin-win8/ui.fancytree.min.css");
    //'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
});
//# sourceMappingURL=typeorm-browser.js.map