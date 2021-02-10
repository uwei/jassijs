define(["require", "exports", "jassi/ui/Panel", "jassi/ui/Textbox"], function (require, exports, Panel_1, Textbox_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var systemFonts = ["Arial", "Helvetica Neue", "Courier New", "Times New Roman", "Comic Sans MS", "Impact"];
    function test() {
        var font = "Bebas Neue";
        //loadFontIfNedded(font);	
        var pan = new Panel_1.Panel();
        var tb = new Textbox_1.Textbox();
        tb.value = "AHallo";
        console.log(tb._id);
        tb.css({
            font_family: font
        });
        pan.add(tb);
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=del.js.map