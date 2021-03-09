


import {FileExplorer} from "jassi/ui/FileExplorer";
import windows from "jassi/base/Windows";
import {Panel} from "jassi/ui/Panel";
import {Button} from "jassi/ui/Button";
import { router } from "jassi/base/Router";
import {SearchExplorer} from "jassi/ui/SearchExplorer";
import { DBObjectExplorer } from "jassi/ui/DBObjectExplorer";
import { ActionNodeMenu } from "jassi/ui/ActionNodeMenu";





//var h=new RemoteObject().test();

async function test() {
  //  jassi.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
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
    router.navigate(window.location.hash);


}
test().then();



