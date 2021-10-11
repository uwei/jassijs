define(["require", "exports", "jassijs/ui/FileExplorer", "jassijs/base/Windows", "jassijs/ui/Panel", "jassijs/base/Router", "jassijs/remote/Settings"], function (require, exports, FileExplorer_1, Windows_1, Panel_1, Router_1, Settings_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //var h=new RemoteObject().test();
    async function start() {
        //  jassijs.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        var body = new Panel_1.Panel({ id: "body" });
        body.max();
        Windows_1.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        Router_1.router.navigate(window.location.hash);
        //Ace should be default because long image blob breaks line   
        if (Settings_1.Settings.gets(Settings_1.Settings.keys.Development_DefaultEditor) === undefined) {
            Settings_1.Settings.save(Settings_1.Settings.keys.Development_DefaultEditor, "ace", "browser");
        }
    }
    start().then();
});
//# sourceMappingURL=StartReporteditor.js.map