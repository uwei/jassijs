"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JassiServer_1 = require("./jassijs/server/JassiServer");
const PackServerFiles_1 = require("./jassijs/server/PackServerFiles");
if (require("fs").existsSync("./private"))
    (0, PackServerFiles_1.startCodeServer)();
(0, JassiServer_1.default)();
/*new Compile().transpileModul("jassijs", true);
new Compile().transpileModul("jassijs", false);
new Compile().transpileModul("jassijs_editor", false);
new Compile().transpileModul("jassijs_report", true);
new Compile().transpileModul("jassijs_report", false);
new Compile().transpileModul("demoreports", false);
new Compile().transpileModul("northwind", true);
new Compile().transpileModul("northwind", false);
new Compile().transpileModul("tests", false);
new Compile().transpileModul("tests", true);
new Compile().transpileModul("demo", false);
*/
//# sourceMappingURL=main.js.map