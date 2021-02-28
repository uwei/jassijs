import { NumberConverter } from "jassi/ui/converters/NumberConverter";
import { Image } from "jassi/ui/Image";
import { Textarea } from "jassi/ui/Textarea";
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
    region?: Textbox;
    state?: Textbox;
    hiredate?: Calendar;
    homephone?: Textbox;
    notes?: Textarea;
    image1?: Image;
    textbox2?: Textbox;
    id?: Textbox;
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
        me.region = new Textbox();
        me.state = new Textbox();
        me.hiredate = new Calendar();
        me.homephone = new Textbox();
        me.notes = new Textarea();
        me.image1 = new Image();
        me.textbox2 = new Textbox();
        me.id = new Textbox();
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
        me.main.add(me.id);
        me.titleOfCouttesy.x = 525;
        me.titleOfCouttesy.y = 5;
        me.titleOfCouttesy.label = "Title of C.";
        me.titleOfCouttesy.width = 85;
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
        this.width = 778;
        this.height = 828;
        me.image1.x = 630;
        me.image1.y = 20;
        me.image1.src = "";
        me.image1.css({
            background_color: "black",
            border_style: "solid"
        });
        me.image1.width = 125;
        me.image1.bind(me.databinder, "PhotoPath");
        me.textbox2.x = 5;
        me.textbox2.y = 240;
        me.textbox2.bind(me.databinder, "PhotoPath");
        me.textbox2.label = "Photo Path";
        me.textbox2.width = 610;
        me.id.x = 5;
        me.id.y = 5;
        me.id.width = 60;
        me.id.label = "Id";
        me.id.bind(me.databinder, "id");
        me.id.converter = new NumberConverter();
    }
}
export async function test() {
    var em = (await Employees.find())[0];
    var ret = new EmployeesView;
    ret["value"] = <Employees>await Employees.findOne();
    return ret;
}
