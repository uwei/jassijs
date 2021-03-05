define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassi_report.css": "jassi_report.css" },
        "require": {
            paths: {
                'pdfjs-dist/build/pdf': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.min',
                'pdfjs-dist/build/pdf.worker': '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min',
                'vfs_fonts': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/vfs_fonts',
                'pdfMake': '//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.70/pdfmake' //'../../lib/pdfmake'
            },
            shim: {
                'pdfjs-dist/build/pdf': ['pdfjs-dist/build/pdf.worker'],
                "vfs_fonts": ["pdfMake"]
            },
        }
    };
});
//# sourceMappingURL=modul.js.map