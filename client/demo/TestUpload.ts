import {HTMLPanel} from "jassi/ui/HTMLPanel";
import {Upload} from "jassi/ui/Upload";
import { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
//@ts-ignore
import {Papa} from "jassi/ext/papaparse";

type Me = {
	upload1?:Upload,
	htmlpanel1?:HTMLPanel
}

@$Class("demo/TestUpload")
export class TestUpload extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
    	me.upload1=new Upload();
    	me.htmlpanel1=new HTMLPanel();
    	this.add(me.upload1);
    	this.add(me.htmlpanel1);
    	me.upload1.multiple=true;
    	me.upload1.onuploaded(function(data:{[file:string]:string}){
    		for(var key in data){
    			
    			me.htmlpanel1.value=data[key];
    		}
    	});
    	me.htmlpanel1.value="";
    	me.htmlpanel1.label="Content:";
    	me.htmlpanel1.css({
    	      font_size: "x-small"
    	});
	}
}

export async function test(){
	var ret=new TestUpload();
	var data = Papa;
	debugger;
	return ret;
}