define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jquery_language = 'https://cdn.jsdelivr.net/gh/jquery/jquery-ui@main/ui/i18n/datepicker-' + navigator.language.split("-")[0];
    exports.default = {
        "css": {
            "jassi.css": "jassi.css",
            "materialdesignicons.min.css": "https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css",
            "jquery-ui.css": "https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css"
        },
        "types": {
            "node_modules/jquery/JQuery.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQuery.d.ts",
            "node_modules/jquery/JQueryStatic.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/JQueryStatic.d.ts",
            "node_modules/jquery/legacy.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/legacy.d.ts",
            "node_modules/jquery/misc.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery@3.5.5/misc.d.ts",
            "node_modules/jqueryui/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jqueryui/index.d.ts",
            "node_modules/chosen-js/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/chosen-js/index.d.ts",
            "node_modules/jquery.fancytree/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/jquery.fancytree/index.d.ts",
            "node_modules/requirejs/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/requirejs/index.d.ts",
            "node_modules/sizzle/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/sizzle/index.d.ts",
            "node_modules/tabulator-tables/index.d.ts": "https://cdn.jsdelivr.net/npm/@types/tabulator-tables/index.d.ts",
            "node_modules/typescript/typescriptServices.d.ts": "https://cdn.jsdelivr.net/gh/microsoft/TypeScript@release-3.7/lib/typescriptServices.d.ts"
        },
        "require": {
            "paths": {
                'intersection-observer': '//cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js',
                'goldenlayout': '//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout',
                "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",
                'jquery.choosen': '//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery',
                'jquery.contextMenu': '//rawgit.com/s-yadav/contextMenu.js/master/contextMenu',
                'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
                "jquery.fancytree.ui-deps": '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.ui-deps',
                'jquery.fancytree.filter': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.filter',
                'jquery.fancytree.multi': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.multi',
                'jquery.fancytree.dnd': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.dnd',
                'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery',
                'jquery.ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui',
                'jquery.ui.touch': '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
                'jquery.doubletap': '//cdnjs.cloudflare.com/ajax/libs/jquery-touch-events/2.0.3/jquery.mobile-events.min',
                'jquery.notify': '//cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min',
                'jquery.language': jquery_language,
                'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
                'papaparse': '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.3/papaparse.min',
                'ric': '//cdn.jsdelivr.net/npm/requestidlecallback@0.3.0/index.min',
                'source.map': "https://unpkg.com/source-map@0.7.3/dist/source-map",
                'spectrum': '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min',
                'splitlib': '//cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min',
                'tabulatorlib': '//unpkg.com/tabulator-tables@4.9.3/dist/js/tabulator',
                'tinymcelib': '//cdnjs.cloudflare.com/ajax/libs/tinymce/5.4.2/tinymce.min' //also define in tinymce.js
            },
            "shim": {
                'goldenlayout': ["jquery"],
                "jquery.choosen": ["jquery"],
                "jquery.contextMenu": ["jquery.ui"],
                'jquery.fancytree': ["jquery", "jquery.ui"],
                'jquery.fancytree.dnd': ["jquery", "jquery.ui"],
                'jquery.ui': ["jquery"],
                'jquery.notify': ["jquery"],
                'jquery.ui.touch': ["jquery", "jquery.ui"],
                'jquery.doubletap': ["jquery"],
                'jassi/jassi': ['jquery', 'jquery.ui', 'jquery.ui.touch'],
                "spectrum": ["jquery"]
            }
        }
    };
});
//# sourceMappingURL=modul.js.map