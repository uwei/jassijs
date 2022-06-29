var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Checkbox", "jassijs/ui/Textbox", "jassijs/ui/Repeater", "jassijs/ui/BoxPanel", "jassijs/ui/HTMLPanel", "jassijs/ui/Databinder", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/base/Actions", "jassijs/base/Windows", "northwind/remote/Products"], function (require, exports, Checkbox_1, Textbox_1, Repeater_1, BoxPanel_1, HTMLPanel_1, Databinder_1, Registry_1, Panel_1, Actions_1, Windows_1, Products_1) {
    "use strict";
    var ProductList_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.ProductList = void 0;
    let ProductList = ProductList_1 = class ProductList extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            var _this = this;
            me.databinder = new Databinder_1.Databinder();
            me.repeater = new Repeater_1.Repeater();
            this.config({
                children: [
                    me.databinder.config({}),
                    me.repeater.config({
                        isAbsolute: false,
                        bind: [me.databinder, "this"],
                        createRepeatingComponent: function (me) {
                            me.textbox = new Textbox_1.Textbox();
                            me.htmlpanel = new HTMLPanel_1.HTMLPanel();
                            me.checkbox = new Checkbox_1.Checkbox();
                            me.htmlpanel3 = new HTMLPanel_1.HTMLPanel();
                            me.boxpanel = new BoxPanel_1.BoxPanel();
                            me.panel = new Panel_1.Panel();
                            me.boxpanel2 = new BoxPanel_1.BoxPanel();
                            me.htmlpanel2 = new HTMLPanel_1.HTMLPanel();
                            me.textbox2 = new Textbox_1.Textbox();
                            me.htmlpanel22 = new HTMLPanel_1.HTMLPanel();
                            me.textbox22 = new Textbox_1.Textbox();
                            me.repeater.design.config({ children: [
                                    me.htmlpanel3.config({ value: " " }),
                                    me.boxpanel.config({
                                        children: [
                                            me.htmlpanel.config({ value: "Product Name:", width: "150" }),
                                            me.textbox.config({
                                                bind: [me.repeater.design.databinder, "ProductName"],
                                                readOnly: true,
                                                width: 290
                                            }),
                                            me.checkbox.config({
                                                bind: [me.repeater.design.databinder, "Discontinued"],
                                                text: "Discontinued"
                                            }),
                                            me.panel.config({})
                                        ],
                                        horizontal: true
                                    }),
                                    me.boxpanel2.config({
                                        children: [
                                            me.htmlpanel2.config({ value: "Quantity Per Unit:", width: "150" }),
                                            me.textbox2.config({
                                                readOnly: true,
                                                width: 175,
                                                bind: [me.repeater.design.databinder, "QuantityPerUnit"]
                                            }),
                                            me.htmlpanel22.config({ value: "&nbsp; &nbsp; &nbsp;Unit Price:", width: 110 }),
                                            me.textbox22.config({
                                                readOnly: true,
                                                width: 100,
                                                bind: [me.repeater.design.databinder, "UnitPrice"],
                                                format: "$ #.##0,00"
                                            })
                                        ],
                                        horizontal: true
                                    })
                                ] });
                        }
                    })
                ]
            });
            this.setData();
        }
        static showDialog() {
            Windows_1.default.add(new ProductList_1(), "ProductList");
        }
        async setData() {
            var all = await Products_1.Products.find({});
            all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.me.databinder.value = all;
            //        this.me.IDChooseCustomer.items = all;
            //      this.me.databinderCustomer.value = all[0];
        }
    };
    __decorate([
        (0, Actions_1.$Action)({ name: "Northwind/Product List", icon: "mdi mdi-reproduction" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], ProductList, "showDialog", null);
    ProductList = ProductList_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("northwind/ProductList"),
        __metadata("design:paramtypes", [])
    ], ProductList);
    exports.ProductList = ProductList;
    async function test() {
        var ret = new ProductList();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvZHVjdExpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9ub3J0aHdpbmQvUHJvZHVjdExpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7SUFnQ0EsSUFBYSxXQUFXLG1CQUF4QixNQUFhLFdBQVksU0FBUSxhQUFLO1FBRWxDO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFDUixJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3pCLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBTTtZQUNULElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztZQUNqQixFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQ2pDLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQztnQkFDUixRQUFRLEVBQUU7b0JBQ04sRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDO29CQUN4QixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDZixVQUFVLEVBQUUsS0FBSzt3QkFDakIsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUM7d0JBQzdCLHdCQUF3QixFQUFFLFVBQVUsRUFBTTs0QkFDdEMsRUFBRSxDQUFDLE9BQU8sR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQzs0QkFDM0IsRUFBRSxDQUFDLFNBQVMsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQzs0QkFDL0IsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUFRLEVBQUUsQ0FBQzs0QkFDN0IsRUFBRSxDQUFDLFVBQVUsR0FBRyxJQUFJLHFCQUFTLEVBQUUsQ0FBQzs0QkFDaEMsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1C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SSxHQUFHLEdBQW1CLE1BQU0sbUJBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEQsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxHQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFBLENBQUEsQ0FBQyxDQUFDLENBQUM7WUFDckUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUUvQiwrQ0FBK0M7WUFDL0Msa0RBQWtEO1FBQ3RELENBQUM7S0FDSixDQUFBO0lBWEc7UUFEQyxJQUFBLGlCQUFPLEVBQUMsRUFBRSxJQUFJLEVBQUUsd0JBQXdCLEVBQUUsSUFBSSxFQUFFLHNCQUFzQixFQUFFLENBQUM7Ozs7dUNBR3pFO0lBM0VRLFdBQVc7UUFGdkIsSUFBQSx5QkFBZSxFQUFDLHlCQUF5QixDQUFDO1FBQzFDLElBQUEsaUJBQU0sRUFBQyx1QkFBdUIsQ0FBQzs7T0FDbkIsV0FBVyxDQW9GdkI7SUFwRlksa0NBQVc7SUFxRmpCLEtBQUssVUFBVSxJQUFJO1FBQ3RCLElBQUksR0FBRyxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDNUIsT0FBTyxHQUFHLENBQUM7SUFDZixDQUFDO0lBSEQsb0JBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGVja2JveCB9IGZyb20gXCJqYXNzaWpzL3VpL0NoZWNrYm94XCI7XG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xuaW1wb3J0IHsgUmVwZWF0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9SZXBlYXRlclwiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiamFzc2lqcy91aS9UYWJsZVwiO1xuaW1wb3J0IHsgQm94UGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9Cb3hQYW5lbFwiO1xuaW1wb3J0IHsgSFRNTFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvSFRNTFBhbmVsXCI7XG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xuaW1wb3J0IHsgT2JqZWN0Q2hvb3NlciB9IGZyb20gXCJqYXNzaWpzL3VpL09iamVjdENob29zZXJcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgQ3VzdG9tZXIgfSBmcm9tIFwibm9ydGh3aW5kL3JlbW90ZS9DdXN0b21lclwiO1xuaW1wb3J0IHsgT3JkZXJzIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvT3JkZXJzXCI7XG5pbXBvcnQgeyAkQWN0aW9uLCAkQWN0aW9uUHJvdmlkZXIgfSBmcm9tIFwiamFzc2lqcy9iYXNlL0FjdGlvbnNcIjtcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xuaW1wb3J0IHsgUHJvZHVjdHMgfSBmcm9tIFwibm9ydGh3aW5kL3JlbW90ZS9Qcm9kdWN0c1wiO1xudHlwZSBNZSA9IHtcbiAgICBkYXRhYmluZGVyPzogRGF0YWJpbmRlcjtcbiAgICByZXBlYXRlcj86IFJlcGVhdGVyO1xuICAgIHRleHRib3g/OiBUZXh0Ym94O1xuICAgIGh0bWxwYW5lbD86IEhUTUxQYW5lbDtcbiAgICBjaGVja2JveD86IENoZWNrYm94O1xuICAgIGh0bWxwYW5lbDM/OiBIVE1MUGFuZWw7XG4gICAgYm94cGFuZWw/OiBCb3hQYW5lbDtcbiAgICBwYW5lbD86IFBhbmVsO1xuICAgIGJveHBhbmVsMj86IEJveFBhbmVsO1xuICAgIGh0bWxwYW5lbDI/OiBIVE1MUGFuZWw7XG4gICAgdGV4dGJveDI/OiBUZXh0Ym94O1xuICAgIGh0bWxwYW5lbDIyPzogSFRNTFBhbmVsO1xuICAgIHRleHRib3gyMj86IFRleHRib3g7XG59O1xuQCRBY3Rpb25Qcm92aWRlcihcImphc3NpanMuYmFzZS5BY3Rpb25Ob2RlXCIpXG5AJENsYXNzKFwibm9ydGh3aW5kL1Byb2R1Y3RMaXN0XCIpXG5leHBvcnQgY2xhc3MgUHJvZHVjdExpc3QgZXh0ZW5kcyBQYW5lbCB7XG4gICAgbWU6IE1lO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLm1lID0ge307XG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIG1lLmRhdGFiaW5kZXIgPSBuZXcgRGF0YWJpbmRlcigpO1xuICAgICAgICBtZS5yZXBlYXRlciA9IG5ldyBSZXBlYXRlcigpO1xuICAgICAgICB0aGlzLmNvbmZpZyh7XG4gICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgIG1lLmRhdGFiaW5kZXIuY29uZmlnKHt9KSxcbiAgICAgICAgICAgICAgICBtZS5yZXBlYXRlci5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICBpc0Fic29sdXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwidGhpc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgY3JlYXRlUmVwZWF0aW5nQ29tcG9uZW50OiBmdW5jdGlvbiAobWU6IE1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS50ZXh0Ym94ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmh0bWxwYW5lbCA9IG5ldyBIVE1MUGFuZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmNoZWNrYm94ID0gbmV3IENoZWNrYm94KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5odG1scGFuZWwzID0gbmV3IEhUTUxQYW5lbCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbWUuYm94cGFuZWwgPSBuZXcgQm94UGFuZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLnBhbmVsID0gbmV3IFBhbmVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5ib3hwYW5lbDIgPSBuZXcgQm94UGFuZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLmh0bWxwYW5lbDIgPSBuZXcgSFRNTFBhbmVsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS50ZXh0Ym94MiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5odG1scGFuZWwyMiA9IG5ldyBIVE1MUGFuZWwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1lLnRleHRib3gyMiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZS5yZXBlYXRlci5kZXNpZ24uY29uZmlnKHsgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUuaHRtbHBhbmVsMy5jb25maWcoeyB2YWx1ZTogXCIgXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmJveHBhbmVsLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGlsZHJlbjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmh0bWxwYW5lbC5jb25maWcoeyB2YWx1ZTogXCJQcm9kdWN0IE5hbWU6XCIsIHdpZHRoOiBcIjE1MFwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLnRleHRib3guY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLnJlcGVhdGVyLmRlc2lnbi5kYXRhYmluZGVyLCBcIlByb2R1Y3ROYW1lXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkT25seTogdHJ1ZSwgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyOTBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5jaGVja2JveC5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUucmVwZWF0ZXIuZGVzaWduLmRhdGFiaW5kZXIsIFwiRGlzY29udGludWVkXCJdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkRpc2NvbnRpbnVlZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWUucGFuZWwuY29uZmlnKHt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmJveHBhbmVsMi5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS5odG1scGFuZWwyLmNvbmZpZyh7IHZhbHVlOiBcIlF1YW50aXR5IFBlciBVbml0OlwiLCB3aWR0aDogXCIxNTBcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS50ZXh0Ym94Mi5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZWFkT25seTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE3NSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLnJlcGVhdGVyLmRlc2lnbi5kYXRhYmluZGVyLCBcIlF1YW50aXR5UGVyVW5pdFwiXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lLmh0bWxwYW5lbDIyLmNvbmZpZyh7IHZhbHVlOiBcIiZuYnNwOyAmbmJzcDsgJm5ic3A7VW5pdCBQcmljZTpcIiwgd2lkdGg6IDExMCB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZS50ZXh0Ym94MjIuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVhZE9ubHk6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5yZXBlYXRlci5kZXNpZ24uZGF0YWJpbmRlciwgXCJVbml0UHJpY2VcIl0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCIkICMuIyMwLDAwXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWw6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIF1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuc2V0RGF0YSgpO1xuICAgIH1cbiAgICBAJEFjdGlvbih7IG5hbWU6IFwiTm9ydGh3aW5kL1Byb2R1Y3QgTGlzdFwiLCBpY29uOiBcIm1kaSBtZGktcmVwcm9kdWN0aW9uXCIgfSlcbiAgICBzdGF0aWMgc2hvd0RpYWxvZygpIHtcbiAgICAgICAgd2luZG93cy5hZGQobmV3IFByb2R1Y3RMaXN0KCksIFwiUHJvZHVjdExpc3RcIik7XG4gICAgfVxuICAgIGFzeW5jIHNldERhdGEoKSB7XG4gICAgICAgIHZhciBhbGw6UHJvZHVjdHNbXSA9PGFueT4gYXdhaXQgUHJvZHVjdHMuZmluZCh7fSk7XG4gICAgICAgIGFsbC5zb3J0KChhLGIpPT57cmV0dXJuIGEuUHJvZHVjdE5hbWUubG9jYWxlQ29tcGFyZShiLlByb2R1Y3ROYW1lKX0pO1xuICAgICAgICB0aGlzLm1lLmRhdGFiaW5kZXIudmFsdWUgPSBhbGw7XG4gICAgICAgIFxuICAgICAgICAvLyAgICAgICAgdGhpcy5tZS5JRENob29zZUN1c3RvbWVyLml0ZW1zID0gYWxsO1xuICAgICAgICAvLyAgICAgIHRoaXMubWUuZGF0YWJpbmRlckN1c3RvbWVyLnZhbHVlID0gYWxsWzBdO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXQgPSBuZXcgUHJvZHVjdExpc3QoKTtcbiAgICByZXR1cm4gcmV0O1xufVxuIl19