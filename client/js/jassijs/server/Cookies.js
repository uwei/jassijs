define(["require", "exports", "jassijs/server/ext/js-cookie"], function (require, exports, js_cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cookies = void 0;
    class C {
        set(name, value, params = undefined) {
        }
        get(name) {
        }
        remove(name, params = undefined) {
        }
        getJSON() {
            return "";
        } // removed!
    }
    var Cookies = js_cookie_1.default;
    exports.Cookies = Cookies;
});
//# sourceMappingURL=Cookies.js.map