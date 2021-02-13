var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Property", "jassi/remote/security/Group", "jassi/ui/DBObjectView"], function (require, exports, Jassi_1, Property_1, Group_1, DBObjectView_1) {
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
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Group_1.Group)
    ], GroupView.prototype, "value", void 0);
    GroupView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "{{dbfullclassname}}" }),
        Jassi_1.$Class("jassi/security/GroupView"),
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