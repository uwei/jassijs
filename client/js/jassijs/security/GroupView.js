var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/remote/security/Group", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Panel_1, Group_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.GroupView = void 0;
    let GroupView = class GroupView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { converter: new NumberConverter_1.NumberConverter(), bind: this.state.value.bind.id, label: "Id" }),
                    (0, Component_1.jc)(Textbox_1.Textbox, { bind: this.state.value.bind.name, label: "Name" })
                ]
            });
        }
    };
    GroupView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "jassijs.security.Group", icon: "mdi mdi-account-group", actionname: "Administration/Security/Groups" }),
        (0, Registry_1.$Class)("jassijs/security/GroupView")
    ], GroupView);
    exports.GroupView = GroupView;
    async function test() {
        var gr = await Group_1.Group.findOne();
        var ret = new GroupView({ value: gr });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=GroupView.js.map