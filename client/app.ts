


import {FileExplorer} from "jassijs/ui/FileExplorer";
import windows from "jassijs/base/Windows";
import {Panel} from "jassijs/ui/Panel";
import {Button} from "jassijs/ui/Button";
import { router } from "jassijs/base/Router";
import {SearchExplorer} from "jassijs/ui/SearchExplorer";
import { DBObjectExplorer } from "jassijs/ui/DBObjectExplorer";
import { ActionNodeMenu } from "jassijs/ui/ActionNodeMenu";
 




//var h=new RemoteObject().test();

async function test() {
  //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
    var body = new Panel({ id: "body" });
    body.max();
    windows.addLeft(new DBObjectExplorer(), "DBObjects");
    windows.addLeft(new SearchExplorer(), "Search");
    windows.addLeft(new FileExplorer(), "Files");
    var bt=new Button();
    windows._desktop.add(bt);
    bt.icon="mdi mdi-refresh";
    var am=new ActionNodeMenu();
    bt.onclick(()=>{
        windows._desktop.remove(am);
        am=new ActionNodeMenu()
        windows._desktop.add(am);
    });
    windows._desktop.add(am);
	
    
 /*   var bts = new Button();
    bts.text = "Spy";
    bts.y = 100;
    bts.onclick(function() {
        require(["jassijs/ui/ComponentSpy"], function() {
            windows.add(new ComponentSpy, "ComponentSpy");
        });
    });
    windows._desktop.add(bts);

    var btt = new Button();
    btt.text = "memorytest";
    btt.y = 150;
    btt.onclick(function() {
        require(["jassijs/ui/ComponentSpy"], function() {
            //new MemoryTest().MemoryTest();
            var sel = new Select();
            sel.height = 200;
            sel.width = 200;
            windows.add(sel, "ComponentSpy");
        });
    });
    windows._desktop.add(btt);

    var bt = new Button();
    bt.text = "KundenDialog";
    bt.y = 200;
    bt.onclick(async function() {
        var DialogKunde = await classes.loadClass("demo.DialogKunde");
        windows.add(new DialogKunde(), "Kunde");
    });
    windows._desktop.add(bt);

   


    var bt2 = new Button();
    bt2.text = "TestContextmenü";
    bt2.y = 300;
    bt2.onclick(function() {
        require(["demo/Testcontextmenu"], function() {
            windows.add(new Testcontextmenu(), "Textcontextmenu");
        });
    });

    windows._desktop.add(bt2);
    var bt3 = new Button();
    bt3.text = "TestARZ";
    bt3.y = 350;
    var aar = new ARZeile();
    bt3.onclick(function() {
        bt3.text = aar.test();
    });

    windows._desktop.add(bt3);
    
    var bt4 = new Button();
	bt4.text = "Error";
    bt4.y = 380;
    bt4.onclick(function() {
        windows.add(new ErrorPanel(), "errors", "errors");
    });
    windows._desktop.add(bt4);
    var bt5 = new Button();
	bt5.text = "Monaco";
    bt5.y = 410;
    bt5.onclick(function() {
    	var mpan=new MonacoPanel();
        mpan.loadsample();

        windows.add(mpan, "Monaco", "Monaco");
        mpan.width="100%";
        mpan.height="100%";
    });
    windows._desktop.add(bt5);*/
    
    
    router.navigate(window.location.hash);


}
test().then();



