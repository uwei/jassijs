var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/HTMLPanel", "jassijs/ui/Button", "jassijs/remote/Registry", "jassijs/ext/tinymce", "jassijs/ui/Component"], function (require, exports, Panel_1, HTMLPanel_1, Button_1, Registry_1, tinymce_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.te = exports.HTMLEditorPanel = void 0;
    tinymce_1 = __importDefault(tinymce_1);
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
            var randclass = "ed" + (0, Component_1.nextID)();
            me.IDHtml.dom.classList.add(randclass);
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
                //  setup:function(ed) {
                //   ed.on('blur', function(e) {
                //    		if($("#"+ed.id)[0]===undefined)
                //  			return;
                //    var html=$("#"+ed.id)[0]._this;
                //  var text= ed.getContent();
                //text='"'+text.substring(31,text.length-7).replaceAll("\"","\\\"")+'"';
                //_this._propertyEditor.setPropertyInCode("text",text,true);
                //$(html.domWrapper).draggable('enable');
                //   }
                // );
                // }
            });
            // editor.setContent("Hallo");
            //tinymce.activeEditor.remove();
            //tinymce.execCommand('mceRemoveControl', true, '');
            // me.IDHtml.height="calc(100% - 50px)";
        }
        set value(val) {
            var el = this.dom.children[0];
            if (el === undefined) {
                var el1 = document.createTextNode(val);
                this.dom.appendChild(el1);
            }
            else
                el.innerHTML = val;
        }
        get value() {
            var el = this.dom.children[0];
            if (el === undefined)
                return "";
            return el.innerHTML;
        }
    };
    HTMLEditorPanel = __decorate([
        (0, Registry_1.$Class)("jassijs.ui.HTMLEditorPanel"),
        __metadata("design:paramtypes", [Object])
    ], HTMLEditorPanel);
    exports.HTMLEditorPanel = HTMLEditorPanel;
    function te() {
        //var dlg=new HTMLEditorPanel();
        // dlg.value="Sample text";
        //	dlg.value=jassijs.db.load("de.Kunde",9);	
        //return dlg;
    }
    exports.te = te;
});
// return CodeEditor.constructor;
//# sourceMappingURL=HTMLEditorPanel.js.map