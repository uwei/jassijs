var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/Select", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/security/User", "jassijs/ui/DBObjectView", "jassijs/ui/Notify", "jassijs/remote/security/Group", "jassijs/ui/Component"], function (require, exports, Select_1, Checkbox_1, NumberConverter_1, Textbox_1, Registry_1, Panel_1, User_1, DBObjectView_1, Notify_1, Group_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.UserView = void 0;
    let UserView = class UserView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "User" : "User " + this.value.email;
        }
        render() {
            Group_1.Group.find().then((data) => {
                this.state.items.current = data;
            });
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { converter: new NumberConverter_1.NumberConverter(), bind: this.state.value.bind.id, label: "Id" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.email, label: "E-Mail" }),
                    (0, Component_1.jc)(Checkbox_1.Checkbox, { bind: this.state.value.bind.isAdmin, label: "IsAdmin" }),
                    (0, Component_1.jc)("br", {}),
                    (0, Component_1.jc)(Select_1.Select, {
                        bind: this.state.value.bind.groups, width: 200,
                        multiple: true,
                        items: this.state.items, label: "Groups", display: "name"
                    })
                ]
            });
        }
        createObject() {
            super.createObject();
            this.value.password = Math.random().toString(36).slice(-8); //random password
            (0, Notify_1.notify)("random password set: " + this.value.password, "info", { position: "right" });
            console.log("random password set: " + this.value.password);
        }
    };
    UserView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "jassijs.security.User", actionname: "Administration/Security/Users", icon: "mdi mdi-account-key-outline", queryname: "findWithRelations" }),
        (0, Registry_1.$Class)("jassijs/security/UserView")
    ], UserView);
    exports.UserView = UserView;
    async function test() {
        var u = (await User_1.User.findWithRelations())[0];
        var ret = new UserView({
            value: u
        });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=UserView.js.map