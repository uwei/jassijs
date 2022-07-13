define(["require", "exports", "pdfjs-dist/build/pdf", "pdfjs-dist/build/pdf.worker"], function (require, exports, pdfjs, worker) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /// <amd-dependency path="pdfjs-dist/build/pdf" name="pdfjs"/>
    /// <amd-dependency path="pdfjs-dist/build/pdf.worker" name="worker"/>
    pdfjs.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js';
    exports.default = pdfjs;
});
//# sourceMappingURL=pdfjs.js.map