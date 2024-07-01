"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
//@ts-ignore
const js_cookie_1 = require("jassijs/ext/js-cookie");
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
//# sourceMappingURL=Cookies.js.map