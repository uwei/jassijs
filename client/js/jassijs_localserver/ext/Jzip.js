define(["require", "exports", "jszip"], function (require, exports, JSZip) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="jszip" name="JSZip"/>
    JSZip.support.nodebuffer = undefined; //we hacked window.Buffer
    exports.default = JSZip;
});
//# sourceMappingURL=Jzip.js.map