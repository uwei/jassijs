


import {FileExplorer} from "jassijs/ui/FileExplorer";
import windows from "jassijs/base/Windows";
import {Panel} from "jassijs/ui/Panel";
import {Button} from "jassijs/ui/Button";
import { router } from "jassijs/base/Router";
import {SearchExplorer} from "jassijs/ui/SearchExplorer";
import { DBObjectExplorer } from "jassijs/ui/DBObjectExplorer";
import { ActionNodeMenu } from "jassijs/ui/ActionNodeMenu";





//var h=new RemoteObject().test();

async function start() {
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
    router.navigate(window.location.hash);


}
start().then();



