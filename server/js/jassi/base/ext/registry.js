"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadRegistry = void 0;
const fs = require("fs");
var registry_json = fs.readFileSync("./../client" + "/registry.json");
;
exports.default = registry_json;
async function reloadRegistry() {
    fs.readFileSync("./../client" + "/registry.json");
    registry_json;
}
exports.reloadRegistry = reloadRegistry;
//# sourceMappingURL=registry.js.map