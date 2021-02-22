var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/Image", "jassi/ui/Textarea", "jassi/ui/Calendar", "jassi/ui/Textbox", "jassi/ui/Button", "jassi/remote/Jassi", "jassi/ui/Property", "northwind/remote/Employees", "jassi/ui/DBObjectView"], function (require, exports, Image_1, Textarea_1, Calendar_1, Textbox_1, Button_1, Jassi_1, Property_1, Employees_1, DBObjectView_1) {
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
            me.button1 = new Button_1.Button();
            me.titleOfCouttesy = new Textbox_1.Textbox();
            me.firstName = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.title = new Textbox_1.Textbox();
            me.address = new Textbox_1.Textbox();
            me.postalCode = new Textbox_1.Textbox();
            me.city = new Textbox_1.Textbox();
            me.birthDate = new Calendar_1.Calendar();
            me.region = new Textbox_1.Textbox();
            me.state = new Textbox_1.Textbox();
            me.hiredate = new Calendar_1.Calendar();
            me.homephone = new Textbox_1.Textbox();
            me.notes = new Textarea_1.Textarea();
            me.image1 = new Image_1.Image();
            me.textbox2 = new Textbox_1.Textbox();
            me.button1.text = "button";
            me.main.width = "900";
            me.main.height = "800";
            me.main.isAbsolute = true;
            me.main.add(me.titleOfCouttesy);
            me.main.add(me.firstName);
            me.main.add(me.textbox1);
            me.main.add(me.title);
            me.main.add(me.address);
            me.main.add(me.postalCode);
            me.main.add(me.city);
            me.main.add(me.birthDate);
            me.main.add(me.region);
            me.main.add(me.state);
            me.main.add(me.hiredate);
            me.main.add(me.homephone);
            me.main.add(me.notes);
            me.main.add(me.image1);
            me.main.add(me.textbox2);
            me.titleOfCouttesy.x = 5;
            me.titleOfCouttesy.y = 5;
            me.titleOfCouttesy.label = "Title of C.";
            me.titleOfCouttesy.width = 60;
            me.titleOfCouttesy.bind(me.databinder, "TitleOfCourtesy");
            me.firstName.x = 80;
            me.firstName.y = 5;
            me.firstName.label = "First name";
            me.firstName.bind(me.databinder, "FirstName");
            me.textbox1.x = 250;
            me.textbox1.y = 5;
            me.textbox1.label = "Last Name";
            me.textbox1.bind(me.databinder, "LastName");
            me.title.x = 420;
            me.title.y = 5;
            me.title.bind(me.databinder, "Title");
            me.title.label = "Title";
            me.title.width = 190;
            me.address.x = 5;
            me.address.y = 50;
            me.address.label = "Address";
            me.address.bind(me.databinder, "Address");
            me.address.width = 345;
            me.postalCode.x = 5;
            me.postalCode.y = 95;
            me.postalCode.label = "Postal Code";
            me.postalCode.bind(me.databinder, "PostalCode");
            me.postalCode.width = 90;
            me.city.x = 110;
            me.city.y = 95;
            me.city.bind(me.databinder, "City");
            me.city.label = "City";
            me.city.width = 240;
            me.birthDate.x = 5;
            me.birthDate.y = 190;
            me.birthDate.width = 90;
            me.birthDate.bind(me.databinder, "BirthDate");
            me.birthDate.label = "Birth Date";
            me.region.x = 5;
            me.region.y = 140;
            me.region.bind(me.databinder, "Region");
            me.region.label = "Region";
            me.region.width = 90;
            me.state.x = 110;
            me.state.y = 140;
            me.state.bind(me.databinder, "Country");
            me.state.label = "country";
            me.state.width = 240;
            me.hiredate.x = 110;
            me.hiredate.y = 190;
            me.hiredate.bind(me.databinder, "HireDate");
            me.hiredate.label = "Hire Date";
            me.hiredate.width = 85;
            me.homephone.x = 210;
            me.homephone.y = 190;
            me.homephone.bind(me.databinder, "HomePhone");
            me.homephone.label = "Home Phone";
            me.homephone.width = 140;
            me.notes.x = 375;
            me.notes.y = 50;
            me.notes.width = 240;
            me.notes.height = 155;
            me.notes.bind(me.databinder, "Notes");
            me.notes.label = "Notes";
            this.width = 778;
            this.height = 828;
            me.image1.x = 630;
            me.image1.y = 20;
            me.image1.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=334&q=80";
            me.image1.css({
                background_color: "black",
                border_style: "solid"
            });
            me.image1.width = 125;
            me.textbox2.x = 5;
            me.textbox2.y = 240;
            me.textbox2.bind(me.databinder, "PhotoPath");
            me.textbox2.label = "Photo Path";
            me.textbox2.width = 610;
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Employees_1.Employees)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        Jassi_1.$Class("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find())[0];
        var ret = new EmployeesView;
        ret["value"] = await Employees_1.Employees.findOne();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=EmployeesView.js.map