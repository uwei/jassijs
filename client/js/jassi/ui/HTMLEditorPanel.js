var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Panel", "jassi/ui/HTMLPanel", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ext/tinymce", "jassi/remote/Registry"], function (require, exports, Panel_1, HTMLPanel_1, Button_1, Jassi_1, tinymce_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HTMLEditorPanel = void 0;
    class Me {
    }
    let HTMLEditorPanel = class HTMLEditorPanel extends Panel_1.Panel {
        constructor(id = undefined) {
            super();
            this.layout();
        }
        async layout() {
            var me = this.me = {};
            me.IDHtml = new HTMLPanel_1.HTMLPanel();
            me.IDChange = new Button_1.Button();
            this.add(me.IDHtml);
            this.add(me.IDChange);
            //me.IDHtml.text="Hallo";
            var randclass = "ed" + Registry_1.default.nextID();
            $(me.IDHtml.dom).addClass(randclass);
            me.IDChange.text = "OK";
            me.IDChange.onclick(function (event) {
            });
            /*	 $(randclass).tinymce({
                 //	script_url : '../js/tinymce/tinymce.min.js',
                         statusbar: false,
                            //toolbar: true,
                            menubar: false
                 });*/
            // tinymce.activeEditor.destroy();
            var editor = await tinymce_1.default.init({
                statusbar: false,
                //toolbar: true,
                menubar: false,
                selector: '.' + randclass,
            });
            // editor.setContent("Hallo");
            //tinymce.activeEditor.remove();
            //tinymce.execCommand('mceRemoveControl', true, '');
            // me.IDHtml.height="calc(100% - 50px)";
        }
        set value(val) {
            var el = this.dom.children[0];
            if (el === undefined) {
                el = document.createTextNode(val);
                this.dom.appendChild(el);
            }
            else
                $(el).html(val);
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            return $(el).html();
        }
    };
    HTMLEditorPanel = __decorate([
        Jassi_1.$Class("jassi.ui.HTMLEditorPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLEditorPanel);
    exports.HTMLEditorPanel = HTMLEditorPanel;
    Jassi_1.default.test = async function () {
        var dlg = new HTMLEditorPanel();
        //	dlg.value=jassi.db.load("de.Kunde",9);	
        return dlg;
    };
});
// return CodeEditor.constructor;
//# sourceMappingURL=HTMLEditorPanel.js.map