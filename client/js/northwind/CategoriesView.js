var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Table", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/Property", "northwind/remote/Categories", "jassijs/ui/DBObjectView", "jassijs/ui/Component"], function (require, exports, NumberConverter_1, Table_1, Textarea_1, Textbox_1, Registry_1, Panel_1, Property_1, Categories_1, DBObjectView_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CategoriesView = void 0;
    let CategoriesView = class CategoriesView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "CategoriesView" : "CategoriesView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Id",
                        bind: this.states.value.bind.id,
                        width: 40,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Name",
                        bind: this.states.value.bind.CategoryName,
                        width: 235,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textarea_1.Textarea, {
                        label: "Description",
                        bind: this.states.value.bind.Description,
                        width: 280,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    (0, Component_1.jc)(Table_1.Table, {
                        height: "100%",
                        bindItems: this.states.value.bind.Products,
                        width: "100%"
                    }),
                ]
            });
        }
    };
    CategoriesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Categories", actionname: "Northwind/Categories", icon: "mdi mdi-cube" }),
        (0, Registry_1.$Class)("northwind.CategoriesView")
        //@$Property({name:"value",componentType:"northwind.Categories", type: "DBObject", isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
        ,
        (0, Property_1.$Property)({ name: "aa", type: "string" }),
        (0, Property_1.$Property)({ name: "ab", type: "string" })
    ], CategoriesView);
    exports.CategoriesView = CategoriesView;
    async function test() {
        var ret = new CategoriesView();
        var data = await Categories_1.Categories.findOne({ relations: ["*"] });
        ret.config({ value: data });
        //    ret["value"] = 
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=CategoriesView.js.map