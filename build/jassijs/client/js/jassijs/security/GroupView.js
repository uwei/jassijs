var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/security/Group", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Registry_1, Property_1, Group_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.GroupView = void 0;
    let GroupView = class GroupView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "GroupView" : "GroupView " + this.value.id;
        }
        layout(me) {
            me.textbox = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            this.me.main.height = "100";
            this.me.main.add(me.textbox);
            this.me.main.isAbsolute = true;
            this.me.main.add(me.textbox2);
            me.textbox.x = 5;
            me.textbox.y = 10;
            me.textbox.width = 45;
            me.textbox.autocommit = false;
            me.textbox.converter = new NumberConverter_1.NumberConverter();
            me.textbox.bind = [this.me.databinder, "id"];
            me.textbox.label = "ID";
            me.textbox2.x = 65;
            me.textbox2.y = 10;
            me.textbox2.bind = [this.me.databinder, "name"];
            me.textbox2.label = "Name";
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Group_1.Group)
    ], GroupView.prototype, "value", void 0);
    GroupView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "jassijs.security.Group", icon: "mdi mdi-account-group", actionname: "Administration/Security/Groups" }),
        (0, Registry_1.$Class)("jassijs/security/GroupView"),
        __metadata("design:paramtypes", [])
    ], GroupView);
    exports.GroupView = GroupView;
    async function test() {
        var ret = new GroupView;
        ret["value"] = await Group_1.Group.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=GroupView.js.map