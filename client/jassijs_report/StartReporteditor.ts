


import { FileExplorer } from "jassijs/ui/FileExplorer";
import windows from "jassijs/base/Windows";
import { Panel } from "jassijs/ui/Panel";
import { Button } from "jassijs/ui/Button";
import { router } from "jassijs/base/Router";
import { SearchExplorer } from "jassijs/ui/SearchExplorer";
import { DBObjectExplorer } from "jassijs/ui/DBObjectExplorer";
import { ActionNodeMenu } from "jassijs/ui/ActionNodeMenu";
import { Settings } from "jassijs/remote/Settings";





//var h=new RemoteObject().test();

async function start() {
    //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
    var body = new Panel({ id: "body" });
    body.max();
    windows.addLeft(new FileExplorer(), "Files");
    router.navigate(window.location.hash);
    //Ace should be default because long image blob breaks line   
    if (Settings.gets(Settings.keys.Development_DefaultEditor) === undefined) {
        Settings.save(Settings.keys.Development_DefaultEditor, "ace", "browser");
    }

}
start().then();



