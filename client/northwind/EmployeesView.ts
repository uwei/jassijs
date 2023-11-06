import { DateTimeConverter } from "jassijs/ui/converters/DateTimeConverter";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Image } from "jassijs/ui/Image";
import { Textarea } from "jassijs/ui/Textarea";
import { Textbox } from "jassijs/ui/Textbox";
import { Button } from "jassijs/ui/Button";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Employees } from "northwind/remote/Employees";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
import { notify } from "jassijs/ui/Notify";
import { validate } from "jassijs/remote/Validator";
type Me = {
    firstName?: Textbox;
    lastName?: Textbox;
    title?: Textbox;
    titleOfCouttesy?: Textbox;
    address?: Textbox;
    postalCode?: Textbox;
    city?: Textbox;
    region?: Textbox;
    state?: Textbox;
    birthDate?: Textbox;
    hiredate?: Textbox;
    homephone?: Textbox;
    notes?: Textarea;
    image1?: Image;
    photoPath?: Textbox;
    id?: Textbox;
    reportsTo?: HTMLPanel;
    objectchooser1?: ObjectChooser;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" })
@$Class("northwind.EmployeesView")
export class EmployeesView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Employees;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
    }
    layout(me: Me) {
        me.firstName = new Textbox();
        me.lastName = new Textbox();
        me.title = new Textbox();
        me.titleOfCouttesy = new Textbox();
        me.address = new Textbox();
        me.postalCode = new Textbox();
        me.city = new Textbox();
        me.region = new Textbox();
        me.state = new Textbox();
        me.birthDate = new Textbox();
        me.hiredate = new Textbox();
        me.homephone = new Textbox();
        me.notes = new Textarea();
        me.image1 = new Image();
        me.photoPath = new Textbox();
        me.id = new Textbox();
        me.reportsTo = new HTMLPanel();
        me.objectchooser1 = new ObjectChooser();
        this.me.main.config({
            children: [
                me.id.config({
                    x: 5,
                    y: 5,
                    width: 60,
                    label: "Id",
                    bind: [me.databinder, "id"],
                    converter: new NumberConverter()
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
                    converter: new DateTimeConverter()
                }),
                me.hiredate.config({
                    x: 115,
                    y: 190,
                    bind: [me.databinder, "HireDate"],
                    label: "Hire Date",
                    width: 95,
                    converter: new DateTimeConverter()
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
                    style: {
                        backgroundColor: "black",
                        borderStyle: "solid"
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
}
export async function test() {
    var em = (await Employees.find({ id: 4 }))[0];
    var ret = new EmployeesView;
    ret["value"] = em;
    
    var h=await validate(em);
    
   
   // ret.me.address
    return ret;
}
