"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reloadRegistry = void 0;
// @ts-ignore:2307 - only on serverside
const fs = require("fs");
var registry_json = "{}";
if (fs) {
    if (fs.existsSync("./../client" + "/index.json")) {
        registry_json = fs.readFileSync("./../client" + "/index.json").toString();
    }
}
exports.default = registry_json;
function reloadRegistry() {
    fs.readFileSync("./../client" + "/index.json");
    registry_json;
}
exports.reloadRegistry = reloadRegistry;
//# sourceMappingURL=registry.js.map