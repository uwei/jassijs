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
define(["require", "exports", "jassijs/ui/Table", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/Textbox", "jassijs_localserver/Filesystem"], function (require, exports, Table_1, jassijs_1, Panel_1, Textbox_1, Filesystem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DK = void 0;
    var g = Filesystem_1.default;
    debugger;
    let DK = class DK extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.table1 = new Table_1.Table();
            this.width = 459;
            this.height = 264;
            this.isAbsolute = true;
            this.add(me.textbox1);
            this.add(me.table1);
            me.textbox1.x = 97;
            me.textbox1.y = 26;
            me.textbox1.width = 245;
            me.table1.x = 325;
            me.table1.y = 100;
            me.table1.width = 125;
            /*	me.table1.setProperties(			{
                      "reorderColumns": false,
                      "multiSelect": true,
                      "show": {
                            "toolbar": true
                      }
                });*/
        }
    };
    DK = __decorate([
        jassijs_1.$Class("demo.DK"),
        __metadata("design:paramtypes", [])
    ], DK);
    exports.DK = DK;
    async function test() {
        var dlg = new DK();
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=DK.js.map
//# sourceMappingURL=DK.js.map