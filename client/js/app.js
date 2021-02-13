define(["require", "exports", "remote/de/ARZeile", "jassi/ui/FileExplorer", "jassi/base/Windows", "jassi/ui/Panel", "jassi/ui/Button", "jassi/ui/ComponentSpy", "jassi/ui/ErrorPanel", "demo/Testcontextmenu", "jassi/base/Router", "demo/HalloPhillip", "jassi/remote/Classes", "jassi/ui/Select", "jassi/ui/SearchExplorer", "jassi/ui/DBObjectExplorer", "jassi_editor/MonacoPanel", "demo/HalloPhillip", "demo/DialogKunde", "demo/TreeTable"], function (require, exports, ARZeile_1, FileExplorer_1, Windows_1, Panel_1, Button_1, ComponentSpy_1, ErrorPanel_1, Testcontextmenu_1, Router_1, HalloPhillip_1, Classes_1, Select_1, SearchExplorer_1, DBObjectExplorer_1, MonacoPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    //var h=new RemoteObject().test();
    async function test() {
        //  jassi.myRequire("https://unpkg.com/source-map@0.7.3/dist/source-map.js");
        var body = new Panel_1.Panel({ id: "body" });
        body.max();
        Windows_1.default.addLeft(new DBObjectExplorer_1.DBObjectExplorer(), "DBObjects");
        Windows_1.default.addLeft(new SearchExplorer_1.SearchExplorer(), "Search");
        Windows_1.default.addLeft(new FileExplorer_1.FileExplorer(), "Files");
        var bts = new Button_1.Button();
        bts.text = "Spy";
        bts.y = 100;
        bts.onclick(function () {
            require(["jassi/ui/ComponentSpy"], function () {
                Windows_1.default.add(new ComponentSpy_1.ComponentSpy, "ComponentSpy");
            });
        });
        Windows_1.default._desktop.add(bts);
        var btt = new Button_1.Button();
        btt.text = "memorytest";
        btt.y = 150;
        btt.onclick(function () {
            require(["jassi/ui/ComponentSpy"], function () {
                //new MemoryTest().MemoryTest();
                var sel = new Select_1.Select();
                sel.height = 200;
                sel.width = 200;
                Windows_1.default.add(sel, "ComponentSpy");
            });
        });
        Windows_1.default._desktop.add(btt);
        var bt = new Button_1.Button();
        bt.text = "KundenDialog";
        bt.y = 200;
        bt.onclick(async function () {
            var DialogKunde = await Classes_1.classes.loadClass("demo.DialogKunde");
            Windows_1.default.add(new DialogKunde(), "Kunde");
        });
        Windows_1.default._desktop.add(bt);
        var bt5 = new Button_1.Button();
        bt5.text = "Hallo Phillip";
        bt5.y = 250;
        bt5.onclick(function () {
            Windows_1.default.add(new HalloPhillip_1.HalloPhillip(), "Test");
        });
        Windows_1.default._desktop.add(bt5);
        var bt2 = new Button_1.Button();
        bt2.text = "TestContextmenü";
        bt2.y = 300;
        bt2.onclick(function () {
            require(["demo/Testcontextmenu"], function () {
                Windows_1.default.add(new Testcontextmenu_1.Testcontextmenu(), "Textcontextmenu");
            });
        });
        Windows_1.default._desktop.add(bt2);
        var bt3 = new Button_1.Button();
        bt3.text = "TestARZ";
        bt3.y = 350;
        var aar = new ARZeile_1.ARZeile();
        bt3.onclick(function () {
            bt3.text = aar.test();
        });
        Windows_1.default._desktop.add(bt3);
        var bt4 = new Button_1.Button();
        bt4.text = "Error";
        bt4.y = 380;
        bt4.onclick(function () {
            Windows_1.default.add(new ErrorPanel_1.ErrorPanel(), "errors", "errors");
        });
        Windows_1.default._desktop.add(bt4);
        var bt5 = new Button_1.Button();
        bt5.text = "Monaco";
        bt5.y = 410;
        bt5.onclick(function () {
            var mpan = new MonacoPanel_1.MonacoPanel();
            mpan.loadsample();
            Windows_1.default.add(mpan, "Monaco", "Monaco");
            mpan.width = "100%";
            mpan.height = "100%";
        });
        Windows_1.default._desktop.add(bt5);
        Router_1.router.navigate(window.location.hash);
    }
    test().then();
});
//# sourceMappingURL=app.js.map