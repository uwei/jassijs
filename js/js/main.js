"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Compile_1 = require("jassijs/server/Compile");
const JassiServer_1 = require("./jassijs/server/JassiServer");
//import { compilePackage } from "./jassijs/server/CreatePackage";
//compilePackage("jassijs",false);
new Compile_1.Compile().transpile("jassijs/server/Indexer.tx", true);
(0, JassiServer_1.default)();
//# sourceMappingURL=main.js.map