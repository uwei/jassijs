define(["require", "exports", "jassijs/ui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.MonacoEditor = void 0;
    class MonacoEditor extends Component_1.Component {
        /* get dom(){
             return this.dom;
         }*/
        constructor() {
            super();
            super.init($('<div style="width: 800px; height: 600px; border: 1px solid grey"></div>')[0]);
        }
    }
    exports.MonacoEditor = MonacoEditor;
    function test() {
        var ed = new MonacoEditor();
        var hh = monaco.languages.typescript.typescriptDefaults;
        //@ts-ignore
        var editor = monaco.editor.create(ed.dom, {
            value: ['class A{b:B;};\nclass B{a:A;};\nfunction x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
            language: 'typescript'
        });
        return ed;
    }
    exports.test = test;
});
//# sourceMappingURL=monaco.js.map