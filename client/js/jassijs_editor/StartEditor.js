var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs_editor/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Button", "jassijs/base/Router", "jassijs_editor/SearchExplorer", "jassijs/ui/DBObjectExplorer", "jassijs/ui/ActionNodeMenu"], function (require, exports, FileExplorer_1, Windows_1, Button_1, Router_1, SearchExplorer_1, DBObjectExplorer_1, ActionNodeMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Windows_1 = __importDefault(Windows_1);
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        //var body = new Panel({ id: "body" });
        //body.max();
        Windows_1.default.addLeft(new DBObjectExplorer_1.DBObjectExplorer(), "DBObjects");
        Windows_1.default.addLeft(new SearchExplorer_1.SearchExplorer(), "Search");
        Windows_1.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        var bt = new Button_1.Button();
        Windows_1.default._desktop.add(bt);
        bt.icon = "mdi mdi-refresh";
        var am = new ActionNodeMenu_1.ActionNodeMenu();
        bt.onclick(() => {
            Windows_1.default._desktop.remove(am);
            am = new ActionNodeMenu_1.ActionNodeMenu();
            Windows_1.default._desktop.add(am);
        });
        Windows_1.default._desktop.add(am);
        Router_1.router.navigate(window.location.hash);
    }
    start().then();
});
//# sourceMappingURL=StartEditor.js.map