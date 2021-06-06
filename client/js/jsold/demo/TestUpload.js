var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Upload", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ext/papaparse"], function (require, exports, HTMLPanel_1, Upload_1, jassijs_1, Panel_1, papaparse_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestUpload = void 0;
    let TestUpload = class TestUpload extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.upload1 = new Upload_1.Upload();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            this.add(me.upload1);
            this.add(me.htmlpanel1);
            me.upload1.multiple = true;
            me.upload1.onuploaded(function (data) {
                for (var key in data) {
                    me.htmlpanel1.value = data[key];
                }
            });
            me.htmlpanel1.value = "";
            me.htmlpanel1.label = "Content:";
            me.htmlpanel1.css({
                font_size: "x-small"
            });
        }
    };
    TestUpload = __decorate([
        jassijs_1.$Class("demo/TestUpload"),
        __metadata("design:paramtypes", [])
    ], TestUpload);
    exports.TestUpload = TestUpload;
    async function test() {
        var ret = new TestUpload();
        var data = papaparse_1.Papa;
        debugger;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=TestUpload.js.map
//# sourceMappingURL=TestUpload.js.map