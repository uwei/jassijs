var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView", "jassijs/remote/Validator"], function (require, exports, DateTimeConverter_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_1, Textbox_1, Registry_1, Property_1, Employees_1, DBObjectView_1, Validator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; this is called in objectdialog
            this.layout(this.me);
        }
        get title() {
            return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
        }
        layout(me) {
            me.firstName = new Textbox_1.Textbox();
            me.lastName = new Textbox_1.Textbox();
            me.title = new Textbox_1.Textbox();
            me.titleOfCouttesy = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.region = new Textbox_1.Textbox();
            me.state = new Textbox_1.Textbox();
            me.birthDate = new Textbox_1.Textbox();
            me.hiredate = new Textbox_1.Textbox();
            me.homephone = new Textbox_1.Textbox();
            me.notes = new Textarea_1.Textarea();
            me.image1 = new Image_1.Image();
            me.photoPath = new Textbox_1.Textbox();
            me.id = new Textbox_1.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            this.me.main.config({
                children: [
                    me.id.config({
                        x: 5,
                        y: 5,
                        width: 60,
                        label: "Id",
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.firstName.config({
                        x: 80,
                        y: 5,
                        label: "First name",
                        bind: [me.databinder, "FirstName"]
                    }),
                    me.lastName.config({
                        x: 250,
                        y: 5,
                        label: "Last Name",
                        bind: [me.databinder, "LastName"]
                    }),
                    me.title.config({
                        x: 420,
                        y: 5,
                        bind: [me.databinder, "Title"],
                        label: "Title",
                        width: 90
                    }),
                    me.titleOfCouttesy.config({
                        x: 525,
                        y: 5,
                        label: "Title of C.",
                        width: 85,
                        bind: [me.databinder, "TitleOfCourtesy"]
                    }),
                    me.address.config({
                        x: 5,
                        y: 50,
                        label: "Address",
                        bind: [me.databinder, "Address"],
                        width: 345
                    }),
                    me.postalCode.config({
                        x: 5,
                        y: 95,
                        label: "Postal Code",
                        bind: [me.databinder, "PostalCode"],
                        width: 90
                    }),
                    me.city.config({
                        x: 110,
                        y: 95,
                        bind: [me.databinder, "City"],
                        label: "City",
                        width: 240
                    }),
                    me.region.config({
                        x: 5,
                        y: 140,
                        bind: [me.databinder, "Region"],
                        label: "Region",
                        width: 90
                    }),
                    me.state.config({
                        x: 110,
                        y: 140,
                        bind: [me.databinder, "Country"],
                        label: "country",
                        width: 240
                    }),
                    me.birthDate.config({
                        x: 5,
                        y: 190,
                        width: 100,
                        bind: [me.databinder, "BirthDate"],
                        label: "Birth Date",
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.hiredate.config({
                        x: 115,
                        y: 190,
                        bind: [me.databinder, "HireDate"],
                        label: "Hire Date",
                        width: 95,
                        converter: new DateTimeConverter_1.DateTimeConverter()
                    }),
                    me.homephone.config({
                        x: 220,
                        y: 190,
                        bind: [me.databinder, "HomePhone"],
                        label: "Home Phone",
                        width: 130
                    }),
                    me.photoPath.config({
                        x: 5,
                        y: 240,
                        bind: [me.databinder, "PhotoPath"],
                        label: "Photo Path",
                        width: 460
                    }),
                    me.notes.config({
                        x: 375,
                        y: 50,
                        width: 240,
                        height: 155,
                        bind: [me.databinder, "Notes"],
                        label: "Notes"
                    }),
                    me.image1.config({
                        x: 630,
                        y: 20,
                        src: "",
                        css: {
                            background_color: "black",
                            border_style: "solid"
                        },
                        width: 125,
                        bind: [me.databinder, "PhotoPath"]
                    }),
                    me.reportsTo.config({
                        x: 7,
                        y: 298,
                        label: "Reports To",
                        bind: [me.databinder, "ReportsTo"],
                        template: "{{FirstName}} {{LastName}}",
                        width: 160
                    }),
                    me.objectchooser1.config({
                        x: 170,
                        y: 310,
                        width: 25,
                        height: 25,
                        bind: [me.databinder, "ReportsTo"],
                        items: "northwind.Employees"
                    })
                ],
                isAbsolute: true,
                width: "750",
                height: "360"
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Employees_1.Employees)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Registry_1.$Class)("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret["value"] = em;
        var h = await (0, Validator_1.validate)(em);
        // ret.me.address
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=EmployeesView.js.map