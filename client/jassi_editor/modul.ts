export default {
    "css":{"jassi_editor.css":"jassi_editor.css"},
    "types":{
        "node_modules/monaco.d.ts":"https://cdn.jsdelivr.net/npm/monaco-editor@0.22.3/monaco.d.ts",
    },
    "require":{ 
        paths: {
            'ace': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/',
            'ace/ext/language_tools': '//cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ext-language_tools',
            monacoLib:"jassi_editor/ext/monacoLib",
            vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.21.2/dev/vs"
        },
        shim: {
            'ace/ext/language_tools': ['ace/ace'],
        }
    
    }
}