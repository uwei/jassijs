define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "require": {
            "paths": {
                "ace": "//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/",
                "ace/ext/language_tools": "//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools"
            },
            "shim": {
                "ace/ext/language_tools": [
                    "ace/ace"
                ]
            }
        }
    };
});
//# sourceMappingURL=modul.js.map