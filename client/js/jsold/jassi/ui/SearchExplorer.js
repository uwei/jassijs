var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Tree", "jassi/ui/Panel", "jassi/ui/Textbox", "jassi_editor/util/Typescript", "jassi/base/Router"], function (require, exports, Jassi_1, Tree_1, Panel_1, Textbox_1, Typescript_1, Router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SearchExplorer = void 0;
    let SearchExplorer = class SearchExplorer extends Panel_1.Panel {
        constructor() {
            super();
            //@member - maximal hits which are found 
            this.maximalFounds = 100;
            //this.maximize();
            $(this.dom).css("width", "calc(100% - 2px)");
            $(this.dom).css("height", "calc(100% - 2px)");
            this.tree = new Tree_1.Tree();
            this.search = new Textbox_1.Textbox();
            this.layout();
        }
        async doSearch() {
            var Typescript = (await new Promise((resolve_1, reject_1) => { require(["jassi_editor/util/Typescript"], resolve_1, reject_1); })).Typescript;
            var all = [];
            var files = []; // [{name:"Hallo",lines:[{ name:"Treffer1",pos:1},{name:"treffer2" ,pos:2}]}];
            var toFind = this.search.value.toLocaleLowerCase();
            var count = 0;
            var filenames = Typescript_1.default.getFiles();
            for (var f = 0; f < filenames.length; f++) {
                var file = filenames[f];
                var code = Typescript_1.default.getCode(file);
                if (code) {
                    var text = code.toLowerCase();
                    var pos = text.indexOf(toFind);
                    var foundedFile = { name: file, lines: [] };
                    while (pos !== -1) {
                        count++;
                        if (count > this.maximalFounds) {
                            break;
                        }
                        var startline = text.lastIndexOf("\n", pos);
                        var endline = text.indexOf("\n", pos);
                        var line = text.substring(startline, endline);
                        foundedFile.lines.push({ name: line, pos: pos, file: file });
                        pos = text.indexOf(toFind, pos + 1);
                    }
                    if (foundedFile.lines.length > 0)
                        files.push(foundedFile);
                    if (count > this.maximalFounds) {
                        break;
                    }
                }
            }
            this.tree.items = files;
            this.tree.expandAll();
        }
        async layout() {
            var _this = this;
            this.tree.width = "100%";
            this.tree.height = "100%";
            super.add(this.search);
            super.add(this.tree);
            this.tree.propDisplay = "name";
            this.tree.propChilds = "lines";
            this.tree.onclick(function (evt) {
                if (evt.data !== undefined && evt.data.file !== undefined) {
                    var pos = evt.data.pos;
                    var file = evt.data.file;
                    new Promise((resolve_2, reject_2) => { require(["jassi_editor/util/Typescript"], resolve_2, reject_2); }).then(Typescript => {
                        var text = Typescript_1.default.getCode(file);
                        var line = text.substring(0, pos).split("\n").length;
                        Router_1.router.navigate("#do=jassi_editor.CodeEditor&file=" + file + "&line=" + line);
                    });
                }
            });
            $("#" + this._id).css("flow", "visible");
            this.search.onkeydown(function (evt) {
                window.setTimeout(() => {
                    //	if(evt.code==="Enter"){
                    _this.doSearch();
                    //	}
                }, 100);
            });
            this.search.height = 15;
        }
    };
    SearchExplorer = __decorate([
        Jassi_1.$Class("jassi.ui.SearchExplorer"),
        __metadata("design:paramtypes", [])
    ], SearchExplorer);
    exports.SearchExplorer = SearchExplorer;
    function test() {
        return new SearchExplorer();
    }
    exports.test = test;
});
//# sourceMappingURL=SearchExplorer.js.map
//# sourceMappingURL=SearchExplorer.js.map