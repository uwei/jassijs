import { Component } from "jassijs/ui/Component";
//@ts-ignore
import {getLanguageService} from "jassijs_editor/ext/monaco";
import { Panel } from "jassijs/ui/Panel";
import { Typescript } from "jassijs_editor/util/Typescript";

export class MonacoEditor extends Component{
       /* get dom(){
            return this.dom;
        }*/
        constructor(){ 
            super();    
            super.init($('<div style="width: 800px; height: 600px; border: 1px solid grey"></div>')[0]);
        }
}

export function test(){
	var ed=new MonacoEditor();
	 var hh=monaco.languages.typescript.typescriptDefaults;
	 
	debugger;
	//@ts-ignore
	var editor = monaco.editor.create(ed.dom, {
					value: ['class A{b:B;};\nclass B{a:A;};\nfunction x() {', '\tconsole.log("Hello world!");', '}'].join('\n'),
					language: 'typescript'
				});
			


	return ed;

}