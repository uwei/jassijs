var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/converters/NumberConverter", "jassi/ui/Textbox", "remote/jassi/base/Jassi", "jassi/ui/Property", "remote/jassi/security/User", "jassi/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Jassi_1, Property_1, User_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.UserView = void 0;
    let UserView = class UserView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "User" : "User " + this.value.email;
        }
        layout(me) {
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            this.add(me.textbox1);
            this.add(me.textbox2);
            me.textbox1.bind(me.databinder, "id");
            me.textbox1.width = 40;
            me.textbox1.converter = new NumberConverter_1.NumberConverter();
            me.textbox2.bind(me.databinder, "email");
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            $.notify("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", User_1.User)
    ], UserView.prototype, "value", void 0);
    UserView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "jassi.security.User" }),
        Jassi_1.$Class("jassi/UserView"),
        __metadata("design:paramtypes", [])
    ], UserView);
    exports.UserView = UserView;
    async function test() {
        var ret = new UserView();
        ret["value"] = await User_1.User.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=UserView.js.map