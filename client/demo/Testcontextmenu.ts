import {Panel} from "jassijs/ui/Panel";
import {ContextMenu} from "jassijs/ui/ContextMenu";
import {MenuItem} from "jassijs/ui/MenuItem";
import {Button} from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";

@$Class("demo.Testcontextmenu")
export  class Testcontextmenu extends Panel{
        me={}
        constructor(){
            super();
            this.layout(this.me);
         }
       
        layout(me){
        	me.contextmenu1=new ContextMenu();
        	me.car=new MenuItem();
        	me.button1=new Button();
        	me.menuitem1=new MenuItem();
        	me.menuitem2=new MenuItem();
        	me.menuitem3=new MenuItem();
        	me.menuitem4=new MenuItem();
        	me.menuitem5=new MenuItem();
        	me.car.text="car sdf sdf aaa";
        	me.car.icon="mdi mdi-car";
            me.contextmenu1.menu.add(me.car);
            me.contextmenu1.menu.add(me.menuitem1);
            me.contextmenu1.menu.add(me.menuitem4);
	      	this.width=872;
        	this.height=320;
        	this.isAbsolute=true;
        	me.button1.text="Test2";
        	this.add(me.button1);
        	this.add(me.contextmenu1);

  
	        me.button1.text="button4";
	        me.button1.x=1;
			me.button1.contextMenu=me.contextmenu1;
			me.button1.y=20;
			me.button1.height=40;
			me.menuitem1.text="menu";
			me.menuitem1.items.add(me.menuitem2);
			me.menuitem2.text="menu";
			me.menuitem2.items.add(me.menuitem3);
			me.menuitem3.text="menu";
			me.menuitem4.text="menu";
			me.menuitem5.text="menu";
			me.menuitem4.items.add(me.menuitem5);
        }
       
	}
    export async function test(){
       // kk.o=0;
    	var dlg=new Testcontextmenu();
		return dlg;
	}

