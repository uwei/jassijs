//INAKTIV
import { Panel } from "jassijs/ui/Panel";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
//@ts-ignore
import tinymce from "jassijs/ext/tinymce"
import registry from "jassijs/remote/Registry";
import { nextID } from "jassijs/ui/Component";

class Me {
	IDHtml?: HTMLPanel;
	IDChange?: Button;
}
@$Class("jassijs.ui.HTMLEditorPanel")
export class HTMLEditorPanel extends Panel {
	me: Me;
	constructor(id = undefined) {//id connect to existing(not reqired)
		super();
		this.layout();
	}

	async layout() {
		var me: Me = this.me = {};
		me.IDHtml = new HTMLPanel();

		me.IDChange = new Button();
		this.add(me.IDHtml);
		this.add(me.IDChange);
		//me.IDHtml.text="Hallo";
		var randclass = "ed" + nextID();
		me.IDHtml.dom.classList.add(randclass);
		me.IDChange.text = "OK";
		me.IDChange.onclick(function (event) {

		});
		/*	 $(randclass).tinymce({
			 //	script_url : '../js/tinymce/tinymce.min.js',
					 statusbar: false,
						//toolbar: true,
						menubar: false
			 });*/
		// tinymce.activeEditor.destroy();

		var editor = await tinymce.init({
			statusbar: false,
			//toolbar: true,
			menubar: false,
			selector: '.' + randclass,
			//  setup:function(ed) {
			//   ed.on('blur', function(e) {
			//    		if($("#"+ed.id)[0]===undefined)
			//  			return;
			//    var html=$("#"+ed.id)[0]._this;
			//  var text= ed.getContent();
			//text='"'+text.substring(31,text.length-7).replaceAll("\"","\\\"")+'"';
			//_this._propertyEditor.setPropertyInCode("text",text,true);
			//$(html.domWrapper).draggable('enable');
			//   }
			// );
			// }
		});
		// editor.setContent("Hallo");
		//tinymce.activeEditor.remove();
		//tinymce.execCommand('mceRemoveControl', true, '');
		// me.IDHtml.height="calc(100% - 50px)";
	}

	set value(val) { //the Code
		var el: Element = this.dom.children[0];
		if (el === undefined) {
			var el1 = document.createTextNode(val);
			this.dom.appendChild(el1);
		} else
			el.innerHTML=val;

	}
	get value() {
		var el = this.dom.children[0];
		if (el === undefined)
			return "";
		return el.innerHTML;
	}
}
export function te() {
	//var dlg=new HTMLEditorPanel();
	// dlg.value="Sample text";
	//	dlg.value=jassijs.db.load("de.Kunde",9);	


	//return dlg;
}
   // return CodeEditor.constructor;
