export default {
    "css":{"jassijs_editor.css":"jassijs_editor.css"},
    "types":{
        "node_modules/monaco.d.ts":"https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/monaco.d.ts",
        "node_modules/typescript/typescriptServices.d.ts": "https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-3.7/lib/typescriptServices.d.ts"
    },
    "require":{ 
        paths: {
            'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
            'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools',
            monacoLib:"jassijs_editor/ext/monacoLib",
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/dev/vs"
        },
        shim: {
            'ace/ext/language_tools': ['ace/ace'],
        }
    
    }
}