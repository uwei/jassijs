define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var jquery_language = 'https://cdn.jsdelivr.net/gh/jquery/jquery-ui@main/ui/i18n/datepicker-' + navigator.language.split("-")[0];
    var tinyurl = "//cdnjs.cloudflare.com/ajax/libs/tinymce/5.9.2";
    exports.default = {
        "css": {
            "jassijs.css": "jassijs.css",
            "materialdesignicons.min.css": "https://cdn.jsdelivr.net/npm/@mdi/font@5.9.55/css/materialdesignicons.min.css",
            "jquery-ui.css": "https:///cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.css",
            "chosen.css": 'https://cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.css',
            "goldenlayout-base.css": "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-base.css",
            "goldenlayout-light-theme.css": "https://cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/css/goldenlayout-light-theme.css",
            "contextMenu.css": 'https://rawgit.com/s-yadav/contextMenu.js/master/contextMenu.css'
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
            "tabulator-tables.ts": "https://cdn.jsdelivr.net/npm/@types/tabulator-tables@5.1.4/index.d.ts"
        },
        "require": {
            "shim": {
                //'tabulator-tables': ['tabulatorext'],
                'goldenlayout': ["jquery"],
                "jquery.choosen": ["jquery"],
                "jquery.contextMenu": ["jquery.ui"],
                'jquery.fancytree': ["jquery", "jquery.ui"],
                'jquery.fancytree.dnd': ["jquery", "jquery.ui"],
                'jquery.ui': ["jquery"],
                'jquery.notify': ["jquery"],
                'jquery.ui.touch': ["jquery", "jquery.ui"],
                //            'jquery.doubletap': ["jquery"],
                //  'jassijs/jassi': ['jquery', 'jquery.ui', /*'jquery.ui.touch'*/],
                "spectrum": ["jquery"]
            },
            "paths": {
                'intersection-observer': '//cdn.jsdelivr.net/npm/intersection-observer@0.7.0/intersection-observer.js',
                'goldenlayout': '//cdnjs.cloudflare.com/ajax/libs/golden-layout/1.5.9/goldenlayout',
                'jquery.choosen': '//cdnjs.cloudflare.com/ajax/libs/chosen/1.8.7/chosen.jquery',
                'jquery.contextMenu': '//rawgit.com/s-yadav/contextMenu.js/master/contextMenu',
                'jquery.fancytree': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/jquery.fancytree.min',
                "jquery.fancytree.ui-deps": '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.ui-deps',
                'jquery.fancytree.filter': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.filter',
                'jquery.fancytree.multi': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.38.2/dist/modules/jquery.fancytree.multi',
                'jquery.fancytree.dnd': '//cdn.jsdelivr.net/npm/jquery.fancytree@2.37.0/dist/modules/jquery.fancytree.dnd',
                'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery',
                'jquery.ui': '//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui',
                'jquery.ui.touch': '//cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min',
                //use dblcklick 'jquery.doubletap': '//cdnjs.cloudflare.com/ajax/libs/jquery-touch-events/2.0.3/jquery.mobile-events.min',
                'jquery.notify': '//cdnjs.cloudflare.com/ajax/libs/notify/0.4.2/notify.min',
                'jquery.language': jquery_language,
                'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                'lodash': '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
                "luxon": "//cdnjs.cloudflare.com/ajax/libs/luxon/3.0.1/luxon.min",
                'papaparse': '//cdnjs.cloudflare.com/ajax/libs/PapaParse/4.6.3/papaparse.min',
                'source.map': "https://unpkg.com/source-map@0.7.3/dist/source-map",
                'spectrum': '//cdnjs.cloudflare.com/ajax/libs/spectrum/1.8.0/spectrum.min',
                'splitlib': '//cdnjs.cloudflare.com/ajax/libs/split.js/1.6.0/split.min',
                //'tabulatorlib': '//unpkg.com/tabulator-tables@5.2.7/dist/js/tabulator',
                'tabulatorlib': '//cdnjs.cloudflare.com/ajax/libs/tabulator/5.4.4/js/tabulator.min',
                'tinymcelib': tinyurl + '/tinymce.min',
                'tabulator-tables': "jassijs/ext/tabulator",
                //"tabulatorext":'jassijs/ext/tabulator',
                // 'tinymcelib': '//cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3/tinymce.min'//also define in tinymce.js
                "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",
                //entpacken tar from npm.org
                "pako": "https://cdnjs.cloudflare.com/ajax/libs/pako/2.1.0/pako.min",
                "untar": "https://cdn.jsdelivr.net/npm/js-untar@2.0.0/build/dist/untar"
            }
        },
        server: {
            "require": {
                "shim": {},
                "paths": {
                    'js-cookie': '//cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min',
                    "reflect-metadata": "https://cdnjs.cloudflare.com/ajax/libs/reflect-metadata/0.1.13/Reflect",
                    //localserver
                    "jszip": "https://cdnjs.cloudflare.com/ajax/libs/jszip/3.5.0/jszip",
                    "js-sql-parser": "https://cdn.jsdelivr.net/npm/js-sql-parser@1.4.1/dist/parser/sqlParser.min",
                    "typeorm": "jassijs/server/ext/typeorm",
                    "typeormbrowser": "https://uwei.github.io/jassijs/dist/typeorm/typeormbrowser",
                    "window.SQL": "https://sql.js.org/dist/sql-wasm",
                    //"jassijs/util/DatabaseSchema": "jassijs/server/DatabaseSchema"
                }
            },
            "loadbeforestart": ["js-sql-parser", "typeormbrowser", "jassijs/server/Installserver"],
        }
        //localserver
    };
    window["tinyMCEPreInit"] = {
        suffix: '.min',
        base: tinyurl,
        //base: "//cdnjs.cloudflare.com/ajax/libs/tinymce/6.0.3",
        query: ''
    };
});
//# sourceMappingURL=modul.js.map