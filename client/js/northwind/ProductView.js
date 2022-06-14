var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Style", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/Checkbox", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Products", "jassijs/ui/DBObjectView"], function (require, exports, Style_1, ObjectChooser_1, HTMLPanel_1, Checkbox_1, NumberConverter_1, Textbox_1, Jassi_1, Property_1, Products_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductView = void 0;
    let ProductView = class ProductView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "ProductView" : "ProductView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.styleNumber = new Style_1.Style();
            me.supplierchooser = new ObjectChooser_1.ObjectChooser();
            me.supplier = new HTMLPanel_1.HTMLPanel();
            me.categoryChooser = new ObjectChooser_1.ObjectChooser();
            me.category = new HTMLPanel_1.HTMLPanel();
            me.discontinued = new Checkbox_1.Checkbox();
            me.reorderLevel = new Textbox_1.Textbox();
            me.unitsOnOrder = new Textbox_1.Textbox();
            me.unitsInStock = new Textbox_1.Textbox();
            me.unitPrice = new Textbox_1.Textbox();
            me.quantityPerUnit = new Textbox_1.Textbox();
            me.productName = new Textbox_1.Textbox();
            this.me.main.config({ isAbsolute: true, width: "678", height: "170", children: [
                    me.id.config({
                        x: 10,
                        y: 10,
                        bind: [me.databinder, "id"],
                        label: "Id",
                        width: 65,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.styleNumber.config({
                        css: {
                            text_align: "right"
                        }
                    }),
                    me.supplierchooser.config({
                        x: 460,
                        y: 125,
                        bind: [me.databinder, "Supplier"],
                        items: "northwind.Suppliers"
                    }),
                    me.supplier.config({
                        x: 225,
                        y: 110,
                        bind: [me.databinder, "Supplier"],
                        value: "New Orleans Cajun Delights",
                        template: "{{CompanyName}}",
                        label: "Supplier",
                        width: 230
                    }),
                    me.categoryChooser.config({
                        x: 185,
                        y: 125,
                        items: "northwind.Categories",
                        bind: [me.databinder, "Category"],
                        width: 30
                    }),
                    me.category.config({
                        x: 10,
                        y: 110,
                        template: "{{CategoryName}}",
                        value: "Condiments",
                        bind: [me.databinder, "Category"],
                        width: 170,
                        label: "Category"
                    }),
                    me.discontinued.config({
                        x: 415,
                        y: 10,
                        width: 70,
                        bind: [me.databinder, "Discontinued"],
                        label: "Discontinued"
                    }),
                    me.reorderLevel.config({
                        x: 415,
                        y: 60,
                        bind: [me.databinder, "ReorderLevel"],
                        width: 70,
                        label: "Reorder Level",
                        converter: new NumberConverter_1.NumberConverter(),
                        styles: [me.styleNumber]
                    }),
                    me.unitsOnOrder.config({
                        x: 325,
                        y: 60,
                        bind: [me.databinder, "UnitsOnOrder"],
                        label: "Units on Order",
                        width: 75,
                        converter: new NumberConverter_1.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.unitsInStock.config({
                        x: 240,
                        y: 60,
                        bind: [me.databinder, "UnitsInStock"],
                        label: "Units in Stock",
                        width: 70,
                        converter: new NumberConverter_1.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.unitPrice.config({
                        x: 160,
                        y: 60,
                        bind: [me.databinder, "UnitPrice"],
                        label: "Unit Price",
                        width: 65,
                        converter: new NumberConverter_1.NumberConverter(),
                        format: "#.##0,00",
                        styles: [me.styleNumber]
                    }),
                    me.quantityPerUnit.config({
                        x: 10,
                        y: 60,
                        bind: [me.databinder, "QuantityPerUnit"],
                        width: 135,
                        label: "Quantity per Unit"
                    }),
                    me.productName.config({
                        x: 90,
                        y: 10,
                        bind: [me.databinder, "ProductName"],
                        label: "Product Name",
                        width: 310
                    })
                ] });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Products_1.Products !== "undefined" && Products_1.Products) === "function" ? _a : Object)
    ], ProductView.prototype, "value", void 0);
    ProductView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Products", actionname: "Northwind/Products", icon: "mdi mdi-reproduction" }),
        (0, Jassi_1.$Class)("northwind.ProductView"),
        __metadata("design:paramtypes", [])
    ], ProductView);
    exports.ProductView = ProductView;
    async function test() {
        var ret = new ProductView;
        //var h=await Products.find({relations:["Category"]});
        ret["value"] = await Products_1.Products.findOne({ relations: ["*"] });
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZHVjdFZpZXcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub3J0aHdpbmQvUHJvZHVjdFZpZXcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUErQkEsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBWSxTQUFRLDJCQUFZO1FBSXpDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUiw4Q0FBOEM7WUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELElBQUksS0FBSztZQUNMLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1FBQ3JGLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDdEIsRUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLGFBQUssRUFBRSxDQUFDO1lBQzdCLEVBQUUsQ0FBQyxlQUFlLEdBQUcsSUFBSSw2QkFBYSxFQUFFLENBQUM7WUFDekMsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQztZQUM5QixFQUFFLENBQUMsZUFBZSxHQUFHLElBQUksNkJBQWEsRUFBRSxDQUFDO1lBQ3pDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBUyxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLFlBQVksR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQztZQUNqQyxFQUFFLENBQUMsWUFBWSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQ2hDLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLFlBQVksR0FBRyxJQUFJLGlCQUFPLEVBQUUs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ZixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdHlsZSB9IGZyb20gXCJqYXNzaWpzL3VpL1N0eWxlXCI7XG5pbXBvcnQgeyBPYmplY3RDaG9vc2VyIH0gZnJvbSBcImphc3NpanMvdWkvT2JqZWN0Q2hvb3NlclwiO1xuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XG5pbXBvcnQgeyBDaGVja2JveCB9IGZyb20gXCJqYXNzaWpzL3VpL0NoZWNrYm94XCI7XG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9jb252ZXJ0ZXJzL051bWJlckNvbnZlcnRlclwiO1xuaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IFByb2R1Y3RzIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvUHJvZHVjdHNcIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2lqcy91aS9EYXRhYmluZGVyXCI7XG5pbXBvcnQgeyBEQk9iamVjdFZpZXcsICREQk9iamVjdFZpZXcsIERCT2JqZWN0Vmlld01lIH0gZnJvbSBcImphc3NpanMvdWkvREJPYmplY3RWaWV3XCI7XG5pbXBvcnQgeyBEQk9iamVjdERpYWxvZyB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0RGlhbG9nXCI7XG50eXBlIE1lID0ge1xuICAgIGlkPzogVGV4dGJveDtcbiAgICBwcm9kdWN0TmFtZT86IFRleHRib3g7XG4gICAgcXVhbnRpdHlQZXJVbml0PzogVGV4dGJveDtcbiAgICB1bml0UHJpY2U/OiBUZXh0Ym94O1xuICAgIHVuaXRzSW5TdG9jaz86IFRleHRib3g7XG4gICAgdW5pdHNPbk9yZGVyPzogVGV4dGJveDtcbiAgICByZW9yZGVyTGV2ZWw/OiBUZXh0Ym94O1xuICAgIGRpc2NvbnRpbnVlZD86IENoZWNrYm94O1xuICAgIGNhdGVnb3J5PzogSFRNTFBhbmVsO1xuICAgIGNhdGVnb3J5Q2hvb3Nlcj86IE9iamVjdENob29zZXI7XG4gICAgc3VwcGxpZXI/OiBIVE1MUGFuZWw7XG4gICAgc3VwcGxpZXJjaG9vc2VyPzogT2JqZWN0Q2hvb3NlcjtcbiAgICBzdHlsZU51bWJlcj86IFN0eWxlO1xuICAgXG59ICYgREJPYmplY3RWaWV3TWU7XG5AJERCT2JqZWN0Vmlldyh7IGNsYXNzbmFtZTogXCJub3J0aHdpbmQuUHJvZHVjdHNcIiwgYWN0aW9ubmFtZTogXCJOb3J0aHdpbmQvUHJvZHVjdHNcIiwgaWNvbjogXCJtZGkgbWRpLXJlcHJvZHVjdGlvblwiIH0pXG5AJENsYXNzKFwibm9ydGh3aW5kLlByb2R1Y3RWaWV3XCIpXG5leHBvcnQgY2xhc3MgUHJvZHVjdFZpZXcgZXh0ZW5kcyBEQk9iamVjdFZpZXcge1xuICAgIGRlY2xhcmUgbWU6IE1lO1xuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXG4gICAgZGVjbGFyZSB2YWx1ZTogUHJvZHVjdHM7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vdGhpcy5tZSA9IHt9OyB0aGlzIGlzIGNhbGxlZCBpbiBvYmplY3RkaWFsb2dcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIGdldCB0aXRsZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IFwiUHJvZHVjdFZpZXdcIiA6IFwiUHJvZHVjdFZpZXcgXCIgKyB0aGlzLnZhbHVlLmlkO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLmlkID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuc3R5bGVOdW1iZXIgPSBuZXcgU3R5bGUoKTtcbiAgICAgICAgbWUuc3VwcGxpZXJjaG9vc2VyID0gbmV3IE9iamVjdENob29zZXIoKTtcbiAgICAgICAgbWUuc3VwcGxpZXIgPSBuZXcgSFRNTFBhbmVsKCk7XG4gICAgICAgIG1lLmNhdGVnb3J5Q2hvb3NlciA9IG5ldyBPYmplY3RDaG9vc2VyKCk7XG4gICAgICAgIG1lLmNhdGVnb3J5ID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgICAgICBtZS5kaXNjb250aW51ZWQgPSBuZXcgQ2hlY2tib3goKTtcbiAgICAgICAgbWUucmVvcmRlckxldmVsID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUudW5pdHNPbk9yZGVyID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUudW5pdHNJblN0b2NrID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUudW5pdFByaWNlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUucXVhbnRpdHlQZXJVbml0ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUucHJvZHVjdE5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICB0aGlzLm1lLm1haW4uY29uZmlnKHsgaXNBYnNvbHV0ZTogdHJ1ZSwgd2lkdGg6IFwiNjc4XCIsIGhlaWdodDogXCIxNzBcIiwgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICBtZS5pZC5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcImlkXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJJZFwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlcjogbmV3IE51bWJlckNvbnZlcnRlcigpXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUuc3R5bGVOdW1iZXIuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgY3NzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0X2FsaWduOiBcInJpZ2h0XCJcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnN1cHBsaWVyY2hvb3Nlci5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiA0NjAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDEyNSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiU3VwcGxpZXJcIl0sXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBcIm5vcnRod2luZC5TdXBwbGllcnNcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnN1cHBsaWVyLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDIyNSxcbiAgICAgICAgICAgICAgICAgICAgeTogMTEwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJTdXBwbGllclwiXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IFwiTmV3IE9ybGVhbnMgQ2FqdW4gRGVsaWdodHNcIixcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGU6IFwie3tDb21wYW55TmFtZX19XCIsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlN1cHBsaWVyXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyMzBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jYXRlZ29yeUNob29zZXIuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTg1LFxuICAgICAgICAgICAgICAgICAgICB5OiAxMjUsXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOiBcIm5vcnRod2luZC5DYXRlZ29yaWVzXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkNhdGVnb3J5XCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jYXRlZ29yeS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTEwLFxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogXCJ7e0NhdGVnb3J5TmFtZX19XCIsXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBcIkNvbmRpbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ2F0ZWdvcnlcIl0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNzAsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkNhdGVnb3J5XCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5kaXNjb250aW51ZWQuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogNDE1LFxuICAgICAgICAgICAgICAgICAgICB5OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJEaXNjb250aW51ZWRcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkRpc2NvbnRpbnVlZFwiXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucmVvcmRlckxldmVsLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDQxNSxcbiAgICAgICAgICAgICAgICAgICAgeTogNjAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlb3JkZXJMZXZlbFwiXSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJSZW9yZGVyIExldmVsXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlcjogbmV3IE51bWJlckNvbnZlcnRlcigpLFxuICAgICAgICAgICAgICAgICAgICBzdHlsZXM6IFttZS5zdHlsZU51bWJlcl1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS51bml0c09uT3JkZXIuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMzI1LFxuICAgICAgICAgICAgICAgICAgICB5OiA2MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiVW5pdHNPbk9yZGVyXCJdLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJVbml0cyBvbiBPcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNzUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnZlcnRlcjogbmV3IE51bWJlckNvbnZlcnRlcigpLFxuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiIy4jIzAsMDBcIixcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzOiBbbWUuc3R5bGVOdW1iZXJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUudW5pdHNJblN0b2NrLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDI0MCxcbiAgICAgICAgICAgICAgICAgICAgeTogNjAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlVuaXRzSW5TdG9ja1wiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiVW5pdHMgaW4gU3RvY2tcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDcwLFxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZXI6IG5ldyBOdW1iZXJDb252ZXJ0ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIiMuIyMwLDAwXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogW21lLnN0eWxlTnVtYmVyXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnVuaXRQcmljZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxNjAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDYwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJVbml0UHJpY2VcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlVuaXQgUHJpY2VcIixcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDY1LFxuICAgICAgICAgICAgICAgICAgICBjb252ZXJ0ZXI6IG5ldyBOdW1iZXJDb252ZXJ0ZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIiMuIyMwLDAwXCIsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogW21lLnN0eWxlTnVtYmVyXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnF1YW50aXR5UGVyVW5pdC5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgeTogNjAsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlF1YW50aXR5UGVyVW5pdFwiXSxcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDEzNSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUXVhbnRpdHkgcGVyIFVuaXRcIlxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLnByb2R1Y3ROYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDkwLFxuICAgICAgICAgICAgICAgICAgICB5OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiUHJvZHVjdE5hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlByb2R1Y3QgTmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzEwXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF0gfSk7XG4gICAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QoKSB7XG4gICAgdmFyIHJldCA9IG5ldyBQcm9kdWN0VmlldztcbiAgICAvL3ZhciBoPWF3YWl0IFByb2R1Y3RzLmZpbmQoe3JlbGF0aW9uczpbXCJDYXRlZ29yeVwiXX0pO1xuICAgIHJldFtcInZhbHVlXCJdID0gPFByb2R1Y3RzPmF3YWl0IFByb2R1Y3RzLmZpbmRPbmUoeyByZWxhdGlvbnM6IFtcIipcIl0gfSk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==