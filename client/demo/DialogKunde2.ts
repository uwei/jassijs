import {Panel} from "jassi/ui/Panel";
import jassi from "jassi/jassi";
import {HTMLPanel} from "jassi/ui/HTMLPanel";
import {Textbox} from "jassi/ui/Textbox";
import {Button} from "jassi/ui/Button";
import {BoxPanel} from "jassi/ui/BoxPanel";
import { $Class } from "jassi/remote/Jassi";

@$Class("demo.DialogKunde2")
export class DialogKunde2 extends Panel {
	me;
	constructor() {
		super();
		this.me = {};
		this.layout(this.me);
	}
	async setdata() {

	}
	layout(me) {
		me.panel1 = new HTMLPanel();
		me.textbox1 = new Textbox();
		me.textbox2 = new Textbox();

		me.button1 = new Button();
		me.button2 = new Button();
		me.textbox3 = new Textbox();
		me.button3 = new Button();
		me.panel2 = new Panel();
		me.panel3 = new Panel();
		me.button4 = new Button();
		me.textbox1 = new Textbox();
		me.button1 = new Button();
		me.boxpanel1 = new BoxPanel();
		me.button2 = new Button();
		me.button3 = new Button();
		me.button4 = new Button();
		me.button5 = new Button();
		me.button6 = new Button();
		this.add(me.textbox2);
		this.add(me.textbox1);
		this.add(me.button3);


		//  this.panel1.htmltext="Hallo";
		this.add(me.textbox1);
		this.add(me.textbox3);
		this.add(me.boxpanel1);
		this.add(me.button1);
		this.add(me.panel2);
		this.add(me.panel3);
		this.add(me.button4);
		this.add(me.button6);
		me.button2.text = "rrrr";
		me.button2.x = 45;
		me.button2.y = 70;
		me.button1.text = "dg1";
		me.button1.label = "sss";
		me.button1.height = "95";
		me.button3.text = "ddd";
		me.textbox3.width = 45;

		me.panel2.height = 235;
		me.panel2.width = 305;
		me.panel2.isAbsolute = false;
		me.panel3.height = 100;
		me.panel3.width = 315;
		me.panel3.isAbsolute = true;
		me.panel3.add(me.button4);
		me.button4.height = 25;
		me.button4.width = 120;
		me.button4.text = "ssss";
		me.button4.x = 155;
		me.button4.y = 65;
		me.textbox1.width = 85;
		me.button1.text = "rr";
		me.button1.onclick(function (event) {
			me.button1.text = "oo";
		});
		me.textbox2.height = 15;
		me.boxpanel1.add(me.button1);
		me.boxpanel1.height = "200";
		me.boxpanel1.horizontal = false;
		me.boxpanel1.width = "300";
		me.boxpanel1.add(me.button2);
		me.boxpanel1.add(me.button3);
		me.boxpanel1.add(me.button5);
		me.button3.text = "asdfasdf";
		me.button3.height = 50;
		me.button2.text = "asdfasdf";
		me.button2.height = "100%";
		me.button2.width = "80";

		me.button5.width = 170;
		me.button5.text = "sdf";
		me.button4.text = "dddd";
		me.button6.text = "3";
		me.button6.width = 55;
	}
}

export function test() {
	// kk.o=0;
	return new DialogKunde2();
}
