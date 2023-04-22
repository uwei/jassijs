import { $Class } from "jassijs/remote/Registry";
import {Tree} from "jassijs/ui/Tree";
import {Panel} from "jassijs/ui/Panel";
import {Textbox} from "jassijs/ui/Textbox";
import {Server} from "jassijs/remote/Server";

import { router } from "jassijs/base/Router";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";

@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs_editor.ui.SearchExplorer")
export class SearchExplorer extends Panel {
    tree: Tree;
    search: Textbox;
    //@member - maximal hits which are found 
    maximalFounds: Number = 100;
    constructor() {
        super();
        //this.maximize();
        this.dom.style.width= "calc(100% - 8px)";
        this.dom.style.height= "calc(100% - 25px)";//why 25????
        this.tree = new Tree();
        this.search = new Textbox();
        this.layout();
    }
      @$Action ({
    	name: "Windows/Development/Search",
       	icon: "mdi mdi-folder-search-outline",
    })
    static async show(){
        if (windows.contains("Search")) 
			var window = windows.show("Search");
		else
         windows.addLeft(new SearchExplorer(), "Search");
    }
    async doSearch() { 
        var typescript=(await import ("jassijs_editor/util/Typescript")).default;
        var all = [];
        var files = [];// [{name:"Hallo",lines:[{ name:"Treffer1",pos:1},{name:"treffer2" ,pos:2}]}];
        var toFind: string =( <string>this.search.value).toLocaleLowerCase();
        var count = 0;
        var filenames=typescript.getFiles();
        for (var f=0;f<filenames.length;f++){
            var file=filenames[f];
            if(file.indexOf("node_modules")>-1)//no search in node modules
                continue;
            var code=typescript.getCode(file);
            if(code){
                var text = code.toLowerCase();
                var pos = text.indexOf(toFind);
                var foundedFile={name:file,lines: [] }
                while (pos !== -1) {
                    count++;
                    if (count > this.maximalFounds) {
                        break;
                    }
                    var startline = text.lastIndexOf("\n", pos);
                    var endline = text.indexOf("\n", pos);
                    var line = text.substring(startline, endline);
                    foundedFile.lines.push({name:line,pos:pos,file:file})
                    pos = text.indexOf(toFind,pos+1);
                }
                if(foundedFile.lines.length>0)
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

        this.tree.onclick(function(evt) {

            if (evt.data !== undefined && evt.data.file !== undefined) {
            	var pos=evt.data.pos;
                var file=evt.data.file;
                import ("jassijs_editor/util/Typescript").then(Typescript=>{
                    var text:string=Typescript.default.getCode(file);
                    var line=text.substring(0,pos).split("\n").length;
                    router.navigate("#do=jassijs_editor.CodeEditor&file=" + file+"&line="+line);
                });

            }
        });
        this.dom.style["flow"]="visible";
        this.search.onkeydown(function(evt) {
            window.setTimeout(() => {
                //	if(evt.code==="Enter"){
                _this.doSearch();
                //	}
            }, 100);
        });
        this.search.height = 15;
    }


}
export function test() {
    return new SearchExplorer();

}


