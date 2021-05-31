define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class Settings {
        static $includeSettings(file) {
            var ret = new Settings();
            ret["name"] = file;
            return ret;
        }
    }
    class Testsettings {
    }
    Testsettings.get = Settings.$includeSettings("a.Testsetting");
    function test() {
        console.log(Testsettings.name);
    }
    exports.test = test;
});
//# sourceMappingURL=Testsetting.js.map