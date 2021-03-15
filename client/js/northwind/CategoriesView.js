var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Textarea", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Categories", "jassi/ui/DBObjectView"], function (require, exports, Textarea_1, Textbox_1, Jassi_1, Property_1, Categories_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        layout(me) {
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.main.add(me.Id);
            me.main.isAbsolute = true;
            me.main.add(me.description);
            me.main.add(me.name);
            this.width = 626;
            this.height = 178;
            me.Id.x = 5;
            me.Id.y = 5;
            me.Id.label = "Id";
            me.Id.bind(me.databinder, "id");
            me.Id.width = 65;
            me.name.x = 85;
            me.name.y = 5;
            me.name.bind(me.databinder, "CategoryName");
            me.name.label = "Name";
            me.name.width = 180;
            me.description.x = 5;
            me.description.y = 60;
            me.description.height = 35;
            me.description.width = 260;
            me.description.bind(me.databinder, "Description");
            me.description.label = "Description";
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Categories_1.Categories)
    ], CategoriesView.prototype, "value", void 0);
    CategoriesView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        Jassi_1.$Class("northwind.CategoriesView"),
        __metadata("design:paramtypes", [])
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView;
        ret["value"] = await Categories_1.Categories.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CategoriesView.js.map