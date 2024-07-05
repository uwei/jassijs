var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Tree", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, Registry_1, Tree_1, Panel_1, Textbox_1, Router_1, Actions_1, Windows_1) {
    "use strict";
    var SearchExplorer_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SearchExplorer = void 0;
    Windows_1 = __importDefault(Windows_1);
    let SearchExplorer = SearchExplorer_1 = class SearchExplorer extends Panel_1.Panel {
        constructor() {
            super();
            //@member - maximal hits which are found 
            this.maximalFounds = 100;
            //this.maximize();
            this.dom.style.width = "calc(100% - 8px)";
            this.dom.style.height = "calc(100% - 25px)"; //why 25????
            this.tree = new Tree_1.Tree();
            this.search = new Textbox_1.Textbox();
            this.layout();
        }
        static async show() {
            if (Windows_1.default.contains("Search"))
                var window = Windows_1.default.show("Search");
            else
                Windows_1.default.addLeft(new SearchExplorer_1(), "Search");
        }
        async doSearch() {
            var typescript = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); }).then(__importStar)).default;
            var all = [];
            var files = []; // [{name:"Hallo",lines:[{ name:"Treffer1",pos:1},{name:"treffer2" ,pos:2}]}];
            var toFind = this.search.value.toLocaleLowerCase();
            var count = 0;
            var filenames = typescript.getFiles();
            for (var f = 0; f < filenames.length; f++) {
                var file = filenames[f];
                if (file.indexOf("node_modules") > -1) //no search in node modules
                    continue;
                var code = typescript.getCode(file);
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
                    new Promise((resolve_2, reject_2) => { require(["jassijs_editor/util/Typescript"], resolve_2, reject_2); }).then(__importStar).then(Typescript => {
                        var text = Typescript.default.getCode(file);
                        var line = text.substring(0, pos).split("\n").length;
                        Router_1.router.navigate("#do=jassijs_editor.CodeEditor&file=" + file + "&line=" + line);
                    });
                }
            });
            this.dom.style["flow"] = "visible";
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
    __decorate([
        (0, Actions_1.$Action)({
            name: "Windows/Development/Search",
            icon: "mdi mdi-folder-search-outline",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SearchExplorer, "show", null);
    SearchExplorer = SearchExplorer_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("jassijs_editor.ui.SearchExplorer"),
        __metadata("design:paramtypes", [])
    ], SearchExplorer);
    exports.SearchExplorer = SearchExplorer;
    function test() {
        return new SearchExplorer();
    }
    exports.test = test;
});
//# sourceMappingURL=SearchExplorer.js.map