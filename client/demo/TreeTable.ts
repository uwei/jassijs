import {Panel} from "jassi/ui/Panel";

import { $Class } from "jassi/remote/Jassi";
import {Table} from "jassi/ui/Table";

class Person {
    name;
    id;
    childs;
    constructor(name, id, childs=undefined) {
        this.name = name;
        this.id = id;
        this.childs = childs;
    }
    
}
@$Class("demo.TreeTable")
export class TreeTable extends Panel {
    me={
    	//tab:Table
    };
    constructor() {
        super();
        this.layout(this.me);

    }
    layout(me) {

   
        var s = new Person("Sophie", 1);
        var p = new Person("Phillip", 2);
        var u = new Person("Udo", 3, [p, s]);
        var t = new Person("Thomas", 5);
        var c = new Person("Christoph", 4, [u, t]);

        s.childs = [c];
         
         me.tab=new Table({
               dataTreeChildFunction:function(ob){
		    		return ob.childs;
		    	}
		    
		    
         });
         me.tab.items=[c];
         me.tab.height="150";
         me.tab.width="100%";
    	me.tab.items=[c,u];   
       
       this.add(me.tab);
    }
}
export async function test() {
    var tab = new TreeTable();
    //test
    return tab;
}

