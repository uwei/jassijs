var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ext/js-cookie"], function (require, exports, js_cookie_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Cookies = void 0;
    js_cookie_1 = __importDefault(js_cookie_1);
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
    var Cookies = js_cookie_1.default.default;
    exports.Cookies = Cookies;
});
//# sourceMappingURL=Cookies.js.map