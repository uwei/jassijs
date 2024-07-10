define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        "css": { "jassijs_editor.css": "jassijs_editor.css" },
        "types": {
            "node_modules/csstype.d.ts": "https://cdn.jsdelivr.net/gh/frenic/csstype@master/index.d.ts",
            // "node_modules/@types/csstype/index.d.ts":"https://cdn.jsdelivr.net/gh/frenic/csstype@master/index.d.ts",
            "node_modules/@types/react/canary.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/canary.d.ts",
            "node_modules/@types/react/experimental.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/experimental.d.ts",
            "node_modules/@types/react/global.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/global.d.ts",
            "node_modules/@types/react/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/index.d.ts",
            "node_modules/@types/react/jsx-runtime.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/jsx-runtime.d.ts",
            "node_modules/@types/react/jsx-dev-runtime.d.ts": "https://cdn.jsdelivr.net/npm/@types/react@18.2.22/jsx-dev-runtime.d.ts",
            "node_modules/monaco.d.ts": "https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/monaco.d.ts",
            "node_modules/@types/typescript.d.ts": "https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-5.4/lib/typescript.d.ts"
        },
        "require": {
            map: {
                "*": {
                    "typescript": "jassijs_editor/ext/typescriptservices",
                }
            },
            paths: {
                'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
                'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools',
                //typescript:"https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-5.4/lib/typescript",
                vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.50.0/dev/vs"
            },
            shim: {
                'ace/ext/language_tools': ['ace/ace'],
            }
        }
    };
});
//# sourceMappingURL=modul.js.map