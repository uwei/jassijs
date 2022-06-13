var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Textbox", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Customer", "jassijs/ui/DBObjectView"], function (require, exports, Textbox_1, Jassi_1, Property_1, Customer_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.CustomerView = void 0;
    let CustomerView = class CustomerView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
        }
        layout(me) {
            me.id = new Textbox_1.Textbox();
            me.companyname = new Textbox_1.Textbox();
            me.contacttitle = new Textbox_1.Textbox();
            me.contactname = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalcode = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.textbox2 = new Textbox_1.Textbox();
            me.phone = new Textbox_1.Textbox();
            me.fax = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: 560,
                height: "300",
                children: [
                    me.id.config({
                        x: 10,
                        y: 5,
                        bind: [me.databinder, "id"],
                        width: 65,
                        label: "id"
                    }),
                    me.companyname.config({
                        x: 195,
                        y: 45,
                        bind: [me.databinder, "CompanyName"],
                        label: "Company Name",
                        width: 155
                    }),
                    me.contacttitle.config({
                        x: 10,
                        y: 45,
                        label: "Contact Title",
                        bind: [me.databinder, "ContactTitle"]
                    }),
                    me.contactname.config({
                        x: 90,
                        y: 5,
                        label: "Contact Name",
                        bind: [me.databinder, "ContactName"],
                        width: 260
                    }),
                    me.address.config({
                        x: 10,
                        y: 90,
                        bind: [me.databinder, "Address"],
                        label: "Address",
                        width: 340
                    }),
                    me.postalcode.config({
                        x: 10,
                        y: 140,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.textbox1.config({
                        x: 100,
                        y: 140,
                        label: "City",
                        width: 250,
                        bind: [me.databinder, "City"]
                    }),
                    me.region.config({
                        x: 10,
                        y: 185,
                        bind: [me.databinder, "Region"],
                        label: "Region"
                    }),
                    me.textbox2.config({
                        x: 195,
                        y: 185,
                        label: "Country",
                        bind: [me.databinder, "Country"]
                    }),
                    me.phone.config({
                        x: 10,
                        y: 230,
                        label: "Phone",
                        bind: [me.databinder, "Phone"]
                    }),
                    me.fax.config({
                        x: 195,
                        y: 230,
                        label: "Fax",
                        bind: [me.databinder, "Fax"]
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Customer_1.Customer !== "undefined" && Customer_1.Customer) === "function" ? _a : Object)
    ], CustomerView.prototype, "value", void 0);
    CustomerView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({
            classname: "northwind.Customer",
            actionname: "Northwind/Customers",
            icon: "mdi mdi-nature-people"
        }),
        (0, Jassi_1.$Class)("northwind/CustomerView"),
        __metadata("design:paramtypes", [])
    ], CustomerView);
    exports.CustomerView = CustomerView;
    async function test() {
        var ret = new CustomerView;
        ret["value"] = await Customer_1.Customer.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ3VzdG9tZXJWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vbm9ydGh3aW5kL0N1c3RvbWVyVmlldy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztJQXdCQSxJQUFhLFlBQVksR0FBekIsTUFBYSxZQUFhLFNBQVEsMkJBQVk7UUFJMUM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLDhDQUE4QztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0QsSUFBSSxLQUFLO1lBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDdkYsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLEVBQUUsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUN0QixFQUFFLENBQUMsV0FBVyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQy9CLEVBQUUsQ0FBQyxZQUFZLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDaEMsRUFBRSxDQUFDLFdBQVcsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUMvQixFQUFFLENBQUMsT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzFCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFPLEVB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QUMsTUFBTSxDQUFDO3dCQUNaLENBQUMsRUFBRSxFQUFFO3dCQUNMLENBQUMsRUFBRSxHQUFHO3dCQUNOLEtBQUssRUFBRSxPQUFPO3dCQUNkLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDO3FCQUNqQyxDQUFDO29CQUNGLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO3dCQUNWLENBQUMsRUFBRSxHQUFHO3dCQUNOLENBQUMsRUFBRSxHQUFHO3dCQUNOLEtBQUssRUFBRSxLQUFLO3dCQUNaLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsS0FBSyxDQUFDO3FCQUMvQixDQUFDO2lCQUNMO2FBQ0osQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUNKLENBQUE7SUFyR0c7UUFEQyxJQUFBLG9CQUFTLEVBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLDJDQUEyQyxFQUFFLENBQUM7c0RBQ3RGLG1CQUFRLG9CQUFSLG1CQUFROytDQUFDO0lBSFAsWUFBWTtRQU54QixJQUFBLDRCQUFhLEVBQUM7WUFDWCxTQUFTLEVBQUUsb0JBQW9CO1lBQy9CLFVBQVUsRUFBRSxxQkFBcUI7WUFDakMsSUFBSSxFQUFFLHVCQUF1QjtTQUNoQyxDQUFDO1FBQ0QsSUFBQSxjQUFNLEVBQUMsd0JBQXdCLENBQUM7O09BQ3BCLFlBQVksQ0F3R3hCO0lBeEdZLG9DQUFZO0lBeUdsQixLQUFLLFVBQVUsSUFBSTtRQUN0QixJQUFJLEdBQUcsR0FBRyxJQUFJLFlBQVksQ0FBQztRQUMzQixHQUFHLENBQUMsT0FBTyxDQUFDLEdBQWEsTUFBTSxtQkFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2xELE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUpELG9CQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGV4dGJveCB9IGZyb20gXCJqYXNzaWpzL3VpL1RleHRib3hcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgJFByb3BlcnR5IH0gZnJvbSBcImphc3NpanMvdWkvUHJvcGVydHlcIjtcbmltcG9ydCB7IEN1c3RvbWVyIH0gZnJvbSBcIm5vcnRod2luZC9yZW1vdGUvQ3VzdG9tZXJcIjtcbmltcG9ydCB7IERCT2JqZWN0VmlldywgJERCT2JqZWN0VmlldywgREJPYmplY3RWaWV3TWUgfSBmcm9tIFwiamFzc2lqcy91aS9EQk9iamVjdFZpZXdcIjtcbnR5cGUgTWUgPSB7XG4gICAgaWQ/OiBUZXh0Ym94O1xuICAgIGNvbXBhbnluYW1lPzogVGV4dGJveDtcbiAgICBjb250YWN0dGl0bGU/OiBUZXh0Ym94O1xuICAgIGNvbnRhY3RuYW1lPzogVGV4dGJveDtcbiAgICBhZGRyZXNzPzogVGV4dGJveDtcbiAgICBwb3N0YWxjb2RlPzogVGV4dGJveDtcbiAgICB0ZXh0Ym94MT86IFRleHRib3g7XG4gICAgcmVnaW9uPzogVGV4dGJveDtcbiAgICB0ZXh0Ym94Mj86IFRleHRib3g7XG4gICAgcGhvbmU/OiBUZXh0Ym94O1xuICAgIGZheD86IFRleHRib3g7XG59ICYgREJPYmplY3RWaWV3TWU7XG5AJERCT2JqZWN0Vmlldyh7XG4gICAgY2xhc3NuYW1lOiBcIm5vcnRod2luZC5DdXN0b21lclwiLFxuICAgIGFjdGlvbm5hbWU6IFwiTm9ydGh3aW5kL0N1c3RvbWVyc1wiLFxuICAgIGljb246IFwibWRpIG1kaS1uYXR1cmUtcGVvcGxlXCJcbn0pXG5AJENsYXNzKFwibm9ydGh3aW5kL0N1c3RvbWVyVmlld1wiKVxuZXhwb3J0IGNsYXNzIEN1c3RvbWVyVmlldyBleHRlbmRzIERCT2JqZWN0VmlldyB7XG4gICAgbWU6IE1lO1xuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXG4gICAgdmFsdWU6IEN1c3RvbWVyO1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvL3RoaXMubWUgPSB7fTsgdGhpcyBpcyBjYWxsZWQgaW4gb2JqZWN0ZGlhbG9nXG4gICAgICAgIHRoaXMubGF5b3V0KHRoaXMubWUpO1xuICAgIH1cbiAgICBnZXQgdGl0bGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyBcIkN1c3RvbWVyVmlld1wiIDogXCJDdXN0b21lclZpZXcgXCIgKyB0aGlzLnZhbHVlLmlkO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLmlkID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuY29tcGFueW5hbWUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5jb250YWN0dGl0bGUgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5jb250YWN0bmFtZSA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLmFkZHJlc3MgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5wb3N0YWxjb2RlID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUudGV4dGJveDEgPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS5yZWdpb24gPSBuZXcgVGV4dGJveCgpO1xuICAgICAgICBtZS50ZXh0Ym94MiA9IG5ldyBUZXh0Ym94KCk7XG4gICAgICAgIG1lLnBob25lID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgbWUuZmF4ID0gbmV3IFRleHRib3goKTtcbiAgICAgICAgdGhpcy5tZS5tYWluLmNvbmZpZyh7XG4gICAgICAgICAgICBpc0Fic29sdXRlOiB0cnVlLFxuICAgICAgICAgICAgd2lkdGg6IDU2MCxcbiAgICAgICAgICAgIGhlaWdodDogXCIzMDBcIixcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAgICAgICAgbWUuaWQuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcImlkXCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNjUsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcImlkXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb21wYW55bmFtZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxOTUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDQ1LFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDb21wYW55TmFtZVwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ29tcGFueSBOYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxNTVcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5jb250YWN0dGl0bGUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDQ1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb250YWN0IFRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIkNvbnRhY3RUaXRsZVwiXVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG1lLmNvbnRhY3RuYW1lLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDkwLFxuICAgICAgICAgICAgICAgICAgICB5OiA1LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJDb250YWN0IE5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQ29udGFjdE5hbWVcIl0sXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiAyNjBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5hZGRyZXNzLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiA5MCxcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiQWRkcmVzc1wiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQWRkcmVzc1wiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMzQwXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucG9zdGFsY29kZS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMCxcbiAgICAgICAgICAgICAgICAgICAgeTogMTQwLFxuICAgICAgICAgICAgICAgICAgICBsYWJlbDogXCJQb3N0YWwgQ29kZVwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJQb3N0YWxDb2RlXCJdLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogOTBcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS50ZXh0Ym94MS5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxMDAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE0MCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ2l0eVwiLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMjUwLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDaXR5XCJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucmVnaW9uLmNvbmZpZyh7XG4gICAgICAgICAgICAgICAgICAgIHg6IDEwLFxuICAgICAgICAgICAgICAgICAgICB5OiAxODUsXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIlJlZ2lvblwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUmVnaW9uXCJcbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS50ZXh0Ym94Mi5jb25maWcoe1xuICAgICAgICAgICAgICAgICAgICB4OiAxOTUsXG4gICAgICAgICAgICAgICAgICAgIHk6IDE4NSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiQ291bnRyeVwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJDb3VudHJ5XCJdXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgbWUucGhvbmUuY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTAsXG4gICAgICAgICAgICAgICAgICAgIHk6IDIzMCxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUGhvbmVcIixcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiUGhvbmVcIl1cbiAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICBtZS5mYXguY29uZmlnKHtcbiAgICAgICAgICAgICAgICAgICAgeDogMTk1LFxuICAgICAgICAgICAgICAgICAgICB5OiAyMzAsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkZheFwiLFxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJGYXhcIl1cbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgXVxuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcbiAgICB2YXIgcmV0ID0gbmV3IEN1c3RvbWVyVmlldztcbiAgICByZXRbXCJ2YWx1ZVwiXSA9IDxDdXN0b21lcj5hd2FpdCBDdXN0b21lci5maW5kT25lKCk7XG4gICAgcmV0dXJuIHJldDtcbn1cbiJdfQ==