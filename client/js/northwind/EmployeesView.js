var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Calendar", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/remote/Jassi", "jassijs/ui/Property", "northwind/remote/Employees", "jassijs/ui/DBObjectView"], function (require, exports, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_1, Calendar_1, Textbox_1, Button_1, Jassi_1, Property_1, Employees_1, DBObjectView_1) {
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
            me.lastName = new Textbox_1.Textbox();
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
            me.photoPath = new Textbox_1.Textbox();
            me.id = new Textbox_1.Textbox();
            me.reportsTo = new HTMLPanel_1.HTMLPanel();
            me.objectchooser1 = new ObjectChooser_1.ObjectChooser();
            me.button1.text = "button";
            me.main.width = 900;
            me.main.height = "900";
            me.main.isAbsolute = true;
            me.main.add(me.firstName);
            me.main.add(me.lastName);
            me.main.add(me.title);
            me.main.add(me.titleOfCouttesy);
            me.main.add(me.address);
            me.main.add(me.postalCode);
            me.main.add(me.city);
            me.main.add(me.region);
            me.main.add(me.state);
            me.main.add(me.birthDate);
            me.main.add(me.hiredate);
            me.main.add(me.homephone);
            me.main.add(me.notes);
            me.main.add(me.image1);
            me.main.add(me.photoPath);
            me.main.add(me.id);
            me.main.add(me.reportsTo);
            me.main.add(me.objectchooser1);
            me.titleOfCouttesy.x = 525;
            me.titleOfCouttesy.y = 5;
            me.titleOfCouttesy.label = "Title of C.";
            me.titleOfCouttesy.width = 85;
            me.titleOfCouttesy.bind(me.databinder, "TitleOfCourtesy");
            me.firstName.x = 80;
            me.firstName.y = 5;
            me.firstName.label = "First name";
            me.firstName.bind(me.databinder, "FirstName");
            me.lastName.x = 250;
            me.lastName.y = 5;
            me.lastName.label = "Last Name";
            me.lastName.bind(me.databinder, "LastName");
            me.title.x = 420;
            me.title.y = 5;
            me.title.bind(me.databinder, "Title");
            me.title.label = "Title";
            me.title.width = 90;
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
            me.image1.x = 630;
            me.image1.y = 20;
            me.image1.src = "";
            me.image1.css({
                background_color: "black",
                border_style: "solid"
            });
            me.image1.width = 125;
            me.image1.bind(me.databinder, "PhotoPath");
            me.photoPath.x = 5;
            me.photoPath.y = 240;
            me.photoPath.bind(me.databinder, "PhotoPath");
            me.photoPath.label = "Photo Path";
            me.photoPath.width = 460;
            me.id.x = 5;
            me.id.y = 5;
            me.id.width = 60;
            me.id.label = "Id";
            me.id.bind(me.databinder, "id");
            me.id.converter = new NumberConverter_1.NumberConverter();
            me.reportsTo.x = 7;
            me.reportsTo.y = 298;
            me.reportsTo.label = "Reports To";
            me.reportsTo.bind(me.databinder, "ReportsTo");
            me.reportsTo.template = "{{FirstName}} {{LastName}}";
            me.reportsTo.width = 160;
            me.objectchooser1.x = 170;
            me.objectchooser1.y = 310;
            me.objectchooser1.width = 25;
            me.objectchooser1.height = 25;
            me.objectchooser1.bind(me.databinder, "ReportsTo");
            me.objectchooser1.items = "northwind.Employees";
        }
    };
    __decorate([
        Property_1.$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", Employees_1.Employees)
    ], EmployeesView.prototype, "value", void 0);
    EmployeesView = __decorate([
        DBObjectView_1.$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        Jassi_1.$Class("northwind.EmployeesView"),
        __metadata("design:paramtypes", [])
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret["value"] = em;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=EmployeesView.js.map