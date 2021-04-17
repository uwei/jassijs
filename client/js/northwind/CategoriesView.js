var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Table", "jassi/ui/BoxPanel", "jassi/ui/Textarea", "jassi/ui/Textbox", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/Property", "northwind/remote/Categories", "jassi/ui/DBObjectView"], function (require, exports, Table_1, BoxPanel_1, Textarea_1, Textbox_1, Jassi_1, Panel_1, Property_1, Categories_1, DBObjectView_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            // this.me = {}; //this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        layout3(me) {
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.table1 = new Table_1.Table();
            me.textbox1 = new Textbox_1.Textbox();
            this.add(me.boxpanel1);
            this.add(me.table1);
            this.add(me.description);
            this.add(me.textbox1);
            me.Id.label = "Id";
            //   me.Id.bind(me.databinder, "id");
            me.Id.width = 45;
            // me.name.bind(me.databinder, "CategoryName");
            me.name.label = "Name";
            me.name.width = 180;
            me.name.height = 10;
            me.description.height = 70;
            me.description.width = 260;
            // me.description.bind(me.databinder, "Description");
            me.description.label = "Description";
            me.boxpanel1.add(me.Id);
            me.boxpanel1.horizontal = true;
            me.boxpanel1.width = 80;
            me.boxpanel1.add(me.name);
            me.table1.height = 85;
        }
        layout(me) {
            me.Id = new Textbox_1.Textbox();
            me.name = new Textbox_1.Textbox();
            me.description = new Textarea_1.Textarea();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.table1 = new Table_1.Table();
            me.panel1 = new Panel_1.Panel();
            me.main.add(me.boxpanel1);
            me.main.add(me.description);
            me.main.add(me.panel1);
            me.main.add(me.table1);
            me.Id.label = "Id";
            me.Id.bind(me.databinder, "id");
            me.Id.width = 45;
            me.name.bind(me.databinder, "CategoryName");
            me.name.label = "Name";
            me.name.width = 225;
            me.name.height = 10;
            me.description.height = 70;
            me.description.width = 280;
            me.description.bind(me.databinder, "Description");
            me.description.label = "Description";
            me.boxpanel1.add(me.Id);
            me.boxpanel1.horizontal = true;
            me.boxpanel1.width = 80;
            me.boxpanel1.add(me.name);
            me.table1.height = "100%";
            me.table1.bindItems(me.databinder, "Products");
            me.table1.width = "100%";
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
        var ret = new CategoriesView();
        ret["value"] = await Categories_1.Categories.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CategoriesView.js.map