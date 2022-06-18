import {Style} from "jassijs/ui/Style";
import {Button} from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import {Panel} from "jassijs/ui/Panel";

type Me = {
	button1?:Button, 
	button2?:Button,
	style1?:Style,
	style2?:Style,
	style3?:Style
}

@$Class("demo/StyleDialog")
export class StyleDialog extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
    	me.button1=new Button();
    	me.button2=new Button();
    	me.style1=new Style();
    	me.style2=new Style();
    	me.style3=new Style();
    	this.add(me.button1);
    	this.add(me.button2);
    	this.add(me.style1);
    	this.add(me.style2);
    	this.add(me.style3);
    	me.button1.text="button";
    	
    	
    	me.button2.text="button";
	}
}

export async function test(){
	var ret=new StyleDialog();
	return ret;
}