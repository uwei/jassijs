import { Calendar } from "jassi/ui/Calendar";
import { Textbox } from "jassi/ui/Textbox";
import { Button } from "jassi/ui/Button";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { $Property } from "jassi/ui/Property";
import { Employees } from "northwind/remote/Employees";
import { Databinder } from "jassi/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassi/ui/DBObjectView";
import { DBObjectDialog } from "jassi/ui/DBObjectDialog";
type Me = {
    button1?: Button;
    titleOfCouttesy?: Textbox;
    firstName?: Textbox;
    textbox1?: Textbox;
    title?: Textbox;
    address?: Textbox;
    postalCode?: Textbox;
    city?: Textbox;
    birthDate?: Calendar;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" })
@$Class("northwind.EmployeesView")
export class EmployeesView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassi.ui.PropertyEditors.DBObjectEditor" })
    value: Employees;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
    }
    layout(me: Me) {
        me.button1 = new Button();
        me.titleOfCouttesy = new Textbox();
        me.firstName = new Textbox();
        me.textbox1 = new Textbox();
        me.title = new Textbox();
        me.address = new Textbox();
        me.postalCode = new Textbox();
        me.city = new Textbox();
        me.birthDate = new Calendar();
        me.button1.text = "button";
        me.main.width = "800";
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
        me.address.width = 275;
        me.postalCode.x = 5;
        me.postalCode.y = 95;
        me.postalCode.label = "Postal Code";
        me.postalCode.bind(me.databinder, "PostalCode");
        me.postalCode.width = 90;
        me.city.x = 110;
        me.city.y = 95;
        me.city.bind(me.databinder, "City");
        me.city.label = "City";
        me.city.width = 170;
        me.birthDate.x = 10;
        me.birthDate.y = 145;
        me.birthDate.width = 190;
        me.birthDate.bind(me.databinder, "BirthDate");
        me.birthDate.label = "Birth Date";
    }
}
export async function test() {
    var em=(await Employees.find())[0];
    var ret = new EmployeesView;
    ret["value"] = <Employees>await Employees.findOne();
    return ret;
}
