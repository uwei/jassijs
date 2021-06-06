import {Panel} from "jassijs/ui/Panel";
import jassijs from "jassijs/jassi";
import {Menu} from "jassijs/ui/Menu";
import {MenuItem} from "jassijs/ui/MenuItem";
import {Button} from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Jassi";
@$Class("demo.Testmenu")
export  class Testmenu extends Panel {
	me={};
	constructor() {
		super();
		this.layout(this.me);
	}
	
	layout(me) {
		me.menu1 = new Menu();
		me.menuitem1 = new MenuItem();
		me.menuitem2 = new MenuItem();
		me.menuitem3 = new MenuItem();
		me.menuitem4 = new MenuItem();
		me.menuitem5 = new MenuItem();
		me.button1 = new Button();
		me.menuitem6 = new MenuItem();
		me.menuitem7 = new MenuItem();
		me.menu1.width = 205;
		me.menu1.height = 185;
		this.add(me.menu1);
		me.save = new MenuItem();
		me.save.text = "save";
		me.save.icon = "mdi mdi-content-save";
		me.save.height = 40;

		me.del = new MenuItem();
		me.del.text = "delete";
		me.del.icon = "mdi mdi-delete";
		me.del.onclick(function () {
			window.setTimeout(function () {
				$(me.menu1.dom).menu("expand", null, true);
			}, 2000);
			//$(me.menu1.dom).menu();
			//	$(me.menu1.dom).menu("destroy");
			//$(me.menu1.dom).menu();
		});
		me.car = new MenuItem();
		me.car.text = "car sdf sdf aaa";
		me.car.icon = "mdi mdi-car";
		me.menu1.add(me.save);
		me.menu1.add(me.menuitem5);
		me.menu1.add(me.del);
		me.menu1.x = 10;
		me.menu1.y = 5;

		me.save.items.add(me.car);
		me.save.items.add(me.menuitem4);
		me.save.items.add(me.menuitem6);
		this.width = 872;
		this.height = 320;
		this.isAbsolute = true;
		this.add(me.button1);

		me.car.items.add(me.menuitem1);
		me.car.items.add(me.menuitem2);
		me.car.items.add(me.menuitem3);
		me.menuitem1.text = "ooopp";
		me.menuitem2.text = "menu";
		me.menuitem3.text = "menu";
		me.menuitem4.text = "menus";
		me.menuitem5.text = "ret";
		me.menuitem5.icon = "mdi mdi-car";

		me.button1.text = "button";
		me.button1.x = 398;
		me.button1.y = 26;

		me.button1.height = 25;
		me.menuitem6.text = "menu";
		me.menuitem5.items.add(me.menuitem7);
		me.menuitem7.text = "menupppp";
	}

}

