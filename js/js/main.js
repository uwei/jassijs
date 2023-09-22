"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JassiServer_1 = require("./jassijs/server/JassiServer");
const Compile_1 = require("jassijs/server/Compile");
//import { compilePackage } from "./jassijs/server/CreatePackage";
new Compile_1.Compile().transpileModul("jassijs", true);
new Compile_1.Compile().transpileModul("jassijs", false);
new Compile_1.Compile().transpileModul("jassijs_editor", false);
new Compile_1.Compile().transpileModul("jassijs_report", true);
new Compile_1.Compile().transpileModul("jassijs_report", false);
new Compile_1.Compile().transpileModul("demoreports", false);
new Compile_1.Compile().transpileModul("northwind", true);
new Compile_1.Compile().transpileModul("northwind", false);
new Compile_1.Compile().transpileModul("tests", false);
new Compile_1.Compile().transpileModul("tests", true);
(0, JassiServer_1.default)();
//# sourceMappingURL=main.js.map