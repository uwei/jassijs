import {Panel} from "jassijs/ui/Panel";
import {ContextMenu} from "jassijs/ui/ContextMenu";
import {MenuItem} from "jassijs/ui/MenuItem";
import {Button} from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";


@$Class("demo.Testcontextmenu")
export  class Testcontextmenu extends Panel{
        me={
			
		}
        constructor(){
            super();
            this.layout(this.me);
         }
       
        layout(me){
        	var contextmenu1=new ContextMenu();
        	var car=new MenuItem();
        	var button1=new Button();
        	var menuitem1=new MenuItem();
        	var menuitem2=new MenuItem();
        	var menuitem3=new MenuItem();
        	var menuitem4=new MenuItem();
        	var menuitem5=new MenuItem();
        	car.text="car sdf sdf aaa";
        	car.icon="mdi mdi-car";
            contextmenu1.menu.add(car);
            contextmenu1.menu.add(menuitem1);
            contextmenu1.menu.add(menuitem4);
	      	this.width=872;
        	this.height=320;
        	this.isAbsolute=true;
        	button1.text="Test2";
        	this.add(button1);
        	this.add(contextmenu1);

  
	        button1.text="button4";
	        button1.x=1;
			button1.contextMenu=contextmenu1;
			button1.y=20;
			button1.height=40;
			menuitem1.text="menu";
			menuitem1.items.add(menuitem2);
			menuitem2.text="menu";
			menuitem2.items.add(menuitem3);
			menuitem3.text="menu";
			menuitem4.text="menu";
			menuitem5.text="menu";
			menuitem4.items.add(menuitem5);
        }
       
	}
    export async function test(){
       // kk.o=0;
    	var dlg=new Testcontextmenu();
		return dlg;
	}

