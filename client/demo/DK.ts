import {Table} from "jassi/ui/Table";

import jassi, { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import {Button} from "jassi/ui/Button";
import {Textbox} from "jassi/ui/Textbox";
import Filessystem from "jassi_localserver/Filesystem";

var g=Filessystem;
debugger;
type Me={
	textbox1?:Textbox,
	table1?:Table
}

@$Class("demo.DK")
export class DK extends Panel{
        me:Me={};
        constructor(){
            super();
            this.layout(this.me);
         }
        
        layout(me:Me){
        me.textbox1=new Textbox();
        me.table1=new Table();
			this.width=459;
			this.height=264;
			this.isAbsolute=true;
			this.add(me.textbox1);
			this.add(me.table1);
			me.textbox1.x=97;
			me.textbox1.y=26;
			me.textbox1.width=245;
			me.table1.x=325;
			me.table1.y=100;
		
			me.table1.width=125;
		
		/*	me.table1.setProperties(			{
			      "reorderColumns": false,
			      "multiSelect": true,
			      "show": {
			            "toolbar": true
			      }
			});*/
    }
       
}



export async function test(){
    	var dlg=new DK();
    	
        return dlg;
}

