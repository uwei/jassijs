var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "spectrum", "jassijs/modul"], function (require, exports, spectrum, modul_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    modul_1 = __importDefault(modul_1);
    //'spectrum':'//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min'
    var path = modul_1.default.require.paths["spectrum"];
    //path=path.substring(0,path.lastIndexOf("/"));
    jassijs.myRequire(path + ".css");
});
//# sourceMappingURL=spectrum.js.map