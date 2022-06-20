define(["require", "exports", "jassijs/ui/Tree", "jassijs/ui/Textarea", "jassijs/ui/Table", "jassijs/ui/Style", "jassijs/ui/Repeater", "jassijs/ui/Image", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/ui/Checkbox", "jassijs/ui/BoxPanel", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/ui/Panel"], function (require, exports, Tree_1, Textarea_1, Table_1, Style_1, Repeater_1, Image_1, HTMLPanel_1, Databinder_1, Checkbox_1, BoxPanel_1, Textbox_1, Button_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function test() {
        var ret = new Panel_1.Panel();
        var button = new Button_1.Button();
        var textbox = new Textbox_1.Textbox();
        var boxpanel = new BoxPanel_1.BoxPanel();
        var checkbox = new Checkbox_1.Checkbox();
        var databinder = new Databinder_1.Databinder();
        var htmlpanel = new HTMLPanel_1.HTMLPanel();
        var image = new Image_1.Image();
        var repeater = new Repeater_1.Repeater();
        var style = new Style_1.Style();
        var table = new Table_1.Table();
        var textarea = new Textarea_1.Textarea();
        var tree = new Tree_1.Tree();
        ret.add(button);
        ret.add(textbox);
        ret.add(boxpanel);
        ret.add(image);
        ret.add(repeater);
        ret.add(style);
        ret.add(table);
        ret.add(textarea);
        ret.add(tree);
        button.text = "button";
        boxpanel.add(checkbox);
        boxpanel.add(databinder);
        boxpanel.add(htmlpanel);
        htmlpanel.value = "ddd";
        image.src = "";
        return ret;
    }
    exports.test = test;
    document.body.append(test().dom);
});
//# sourceMappingURL=MyTest.js.map