var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Select", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "jassijs/remote/security/User", "jassijs/ui/DBObjectView", "jassijs/ui/Notify", "jassijs/remote/security/Group"], function (require, exports, Select_1, Checkbox_1, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Property_1, User_1, DBObjectView_1, Notify_1, Group_1) {
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
            me.IDID = new Textbox_1.Textbox();
            me.IDEmail = new Textbox_1.Textbox();
            me.checkbox = new Checkbox_1.Checkbox();
            me.panel = new Panel_1.Panel();
            me.IDGroups = new Select_1.Select({ multiple: true });
            me.IDID.bind = [me.databinder, "id"];
            me.IDID.width = 40;
            me.IDID.converter = new NumberConverter_1.NumberConverter();
            me.IDID.label = "ID";
            me.IDEmail.bind = [me.databinder, "email"];
            me.IDEmail.label = "E-Mail";
            this.me.main.height = "100";
            me.panel.add(me.IDID);
            this.me.main.add(me.panel);
            this.me.main.add(me.IDGroups);
            me.panel.add(me.IDEmail);
            me.panel.add(me.checkbox);
            me.checkbox.bind = [this.me.databinder, "isAdmin"];
            me.checkbox.width = 15;
            me.checkbox.label = "IsAdmin";
            me.IDGroups.width = "400";
            me.IDGroups.display = "name";
            me.IDGroups.bind = [this.me.databinder, "groups"];
            Group_1.Group.find().then((data) => {
                me.IDGroups.items = data;
            });
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            (0, Notify_1.notify)("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", User_1.User)
    ], UserView.prototype, "value", void 0);
    UserView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline", queryname: "findWithRelations" }),
        (0, Registry_1.$Class)("jassijs/security/UserView"),
        __metadata("design:paramtypes", [])
    ], UserView);
    exports.UserView = UserView;
    async function test() {
        var ret = new UserView();
        ret["value"] = (await User_1.User.findWithRelations())[0];
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=UserView.js.map