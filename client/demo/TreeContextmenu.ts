import {Tree} from "jassi/ui/Tree";
import {ContextMenu} from "jassi/ui/ContextMenu";
import {MenuItem} from "jassi/ui/MenuItem";
import {Panel} from "jassi/ui/Panel";
import  {Button} from "jassi/ui/Button";

class Me { 
    tree?:Tree;
    panel?: Panel;
	button?:Button
}
export async function test() {
    var s:any = { name: "Sansa", id: 1 };
    var p = { name: "Peter", id: 2 };
    var u = { name: "Uwe", id: 3, childs: [p, s] };
    var t = { name: "Tom", id: 5 };
    var c = { name: "Christoph", id: 4, childs: [u, t] };
	var me:Me=new Me();
	me.tree=new Tree({
	      checkbox: true,
	      selectMode: 2,
	      
	});
	me.panel=new Panel();
	me.button=new Button();
	me.panel["me"]=me;
	me.panel.add(me.tree);
	me.panel.add(me.button);
    s.childs = [c];
    me.tree.propDisplay = "name";
    me.tree.propChilds = "childs";
    me.tree.propIcon = function (data) {
        if (data.name === "Uwe")
            return "mdi mdi-car";
    };

    me.tree.width = "100%";
    me.tree.height=175;
  /*  me.tree.onclick(function (data) {
        console.log("select " + data.item.name);
    });*/
    var contextmenu=new ContextMenu();
    me.tree.contextMenu=contextmenu;
    var menu=new MenuItem();
    menu.text="static menu";
    menu.onclick(function(ob){
    	alert(contextmenu.value[0].name+"clicked");
    });
    contextmenu.menu.add(menu);
    contextmenu.getActions=async function(obs){
    	return [{name:"custom Action",call:function(data){
    		alert(data[0].name)
    	}}]
    }
    me.tree.items= [c, u];
    me.tree.expandAll();
    me.tree.onclick(function(event?:JQueryEventObject, data?:Fancytree.EventData){
    	
    	//alert(event.selection[0].name);
    });
   
    me.button.text="Test";
	me.button.onclick(()=>{
		 var h=me.tree.selection;
	})
    return me.panel;
}
