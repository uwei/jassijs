var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Windows", "jassijs/ui/Button"], function (require, exports, Textbox_1, Registry_1, Panel_1, Windows_1, Button_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Dialog2 = void 0;
    let Dialog2 = class Dialog2 extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.textbox = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            me.button1 = new Button_1.Button();
            this.config({
                children: [
                    me.textbox.config({}),
                    me.textbox2.config({ value: "fff" }),
                    me.textbox3.config({}),
                    me.button1.config({})
                ]
            });
        }
    };
    Dialog2 = __decorate([
        (0, Registry_1.$Class)("de/Dialog2"),
        __metadata("design:paramtypes", [])
    ], Dialog2);
    exports.Dialog2 = Dialog2;
    var editableDiv = document.getElementById('editableDiv');
    function handlepaste(e) {
        var types, pastedData, savedContent;
        debugger;
        // Browsers that support the 'text/html' type in the Clipboard API (Chrome, Firefox 22+)
        if (e && e.clipboardData && e.clipboardData.types && e.clipboardData.getData) {
            // Check for 'text/html' in types list. See abligh's answer below for deatils on
            // why the DOMStringList bit is needed
            types = e.clipboardData.types;
            if (((types instanceof DOMStringList) && types.contains("text/html")) ||
                (types.indexOf && types.indexOf('text/html') !== -1)) {
                // Extract data and pass it to callback
                pastedData = e.clipboardData.getData('text/html');
                processPaste(editableDiv, pastedData);
                // Stop the data from actually being pasted
                e.stopPropagation();
                e.preventDefault();
                return false;
            }
        }
        // Everything else: Move existing element contents to a DocumentFragment for safekeeping
        savedContent = document.createDocumentFragment();
        while (editableDiv.childNodes.length > 0) {
            savedContent.appendChild(editableDiv.childNodes[0]);
        }
        // Then wait for browser to paste content into it and cleanup
        waitForPastedData(editableDiv, savedContent);
        return true;
    }
    function waitForPastedData(elem, savedContent) {
        // If data has been processes by browser, process it
        if (elem.childNodes && elem.childNodes.length > 0) {
            // Retrieve pasted content via innerHTML
            // (Alternatively loop through elem.childNodes or elem.getElementsByTagName here)
            var pastedData = elem.innerHTML;
            // Restore saved content
            elem.innerHTML = "";
            elem.appendChild(savedContent);
            // Call callback
            processPaste(elem, pastedData);
        }
        // Else wait 20ms and try again
        else {
            setTimeout(function () {
                waitForPastedData(elem, savedContent);
            }, 20);
        }
    }
    function processPaste(elem, pastedData) {
        // Do whatever with gathered data;
        alert(pastedData);
        elem.focus();
    }
    async function test() {
        var ret = new Dialog2();
        ret.dom.contentEditable = "true";
        /*ret.dom.onpaste = (ev) => {
            ev.preventDefault();
            console.log(ev);
        };*/
        for (var x = 0; x < ret._components.length; x++) {
            var ent = ret._components[x];
            var text = document.createTextNode("hallo");
            ent.domWrapper.parentNode.insertBefore(text, ent.domWrapper);
            ent.domWrapper.contentEditable = "false";
        }
        ;
        $(ret.dom).bind('cut', function (e) { e.preventDefault(); console.log(e); });
        Windows_1.default.add(ret, "toll");
        // Modern browsers. Note: 3rd argument is required for Firefox <= 6
        if (ret.dom.addEventListener) {
            ret.dom.addEventListener('paste', handlepaste, false);
        }
        //return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=Dialog2.js.map