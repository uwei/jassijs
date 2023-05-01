define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.modules = void 0;
    class Modules {
        constructor() {
            if (!window.document) {
                var fs = require("fs");
                var all = JSON.parse(fs.readFileSync('./client/jassijs.json', 'utf-8'));
                Object.assign(this, all);
            }
        }
    }
    var modules = new Modules();
    exports.modules = modules;
});
//# sourceMappingURL=Modules.js.map