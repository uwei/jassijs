import {Panel} from "jassijs/ui/Panel";
import jassi from "jassijs/jassi";
import {Button} from "jassijs/ui/Button";
import {HTMLPanel} from "jassijs/ui/HTMLPanel";
import { $Class } from "jassijs/remote/Jassi";
import { $UIComponent } from "jassijs/ui/Component";


@$UIComponent({fullPath:"common/TestComponent",editableChildComponents:["this","me.button4"]})
@$Class("demo.TestComponent")
export class TestComponent extends Panel{
        me;
        constructor(){
			super();
			this.me={};
            this.layout(this.me);
         }
         async setdata(){
        }
        get title(){
        	return "TestComponent ";
        }
      
        layout(me){
        	me.button1=new Button();
        	me.htmlpanel1=new HTMLPanel();
        	me.button2=new Button();
        	me.htmlpanel2=new HTMLPanel();
        	me.panel2=new Panel();
        	me.button3=new Button();
        	me.button4=new Button();
        	this.add(me.button2);
        	this.add(me.button1);
        	this.add(me.htmlpanel2);
        	this.add(me.htmlpanel1);
        	this.add(me.panel2);
        	//this.value="rrr";
        	me.button1.text="ende";
        	me.htmlpanel1.value="Test";
        	me.htmlpanel1.width=25;
        	me.button2.text="start";
        	me.htmlpanel2.text="rrrere";
        	me.htmlpanel2.width=85;
        	me.panel2.width="100";
        	me.panel2.height="100";
        	me.panel2.isAbsolute=true;
        	me.panel2.add(me.button4);
        	me.panel2.add(me.button3);
        	me.button4.text="Test";
        	me.button4.x=15;
        	me.button4.y=35;
        	me.button3.height=30;
        	me.button3.width=20;
        	me.button3.x=75;
        	me.button3.y=30;
        }
      
    }
export async function test(){
    	var dlg=new TestComponent();
        return dlg;
    }

