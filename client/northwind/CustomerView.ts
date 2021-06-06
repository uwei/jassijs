import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { $Property } from "jassijs/ui/Property";
import { Customer } from "northwind/remote/Customer";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
type Me = {
    id?: Textbox;
    companyname?: Textbox;
    contacttitle?: Textbox;
    contactname?: Textbox;
    address?: Textbox;
    postalcode?: Textbox;
    textbox1?: Textbox;
    region?: Textbox;
    textbox2?: Textbox;
    phone?: Textbox;
    fax?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({
    classname: "northwind.Customer",
    actionname: "Northwind/Customers",
    icon: "mdi mdi-nature-people"
})
@$Class("northwind/CustomerView")
export class CustomerView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Customer;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "CustomerView" : "CustomerView " + this.value.id;
    }
    layout(me: Me) {
        me.id = new Textbox();
        me.companyname = new Textbox();
        me.contacttitle = new Textbox();
        me.contactname = new Textbox();
        me.address = new Textbox();
        me.postalcode = new Textbox();
        me.textbox1 = new Textbox();
        me.region = new Textbox();
        me.textbox2 = new Textbox();
        me.phone = new Textbox();
        me.fax = new Textbox();
        me.main.isAbsolute = true;
        me.main.width = 560;
        me.main.height = "300";
        me.main.add(me.id);
        me.main.add(me.companyname);
        me.main.add(me.contacttitle);
        me.main.add(me.contactname);
        me.main.add(me.address);
        me.main.add(me.postalcode);
        me.main.add(me.textbox1);
        me.main.add(me.region);
        me.main.add(me.textbox2);
        me.main.add(me.phone);
        me.main.add(me.fax);
        me.id.x = 10;
        me.id.y = 5;
        me.id.bind(me.databinder, "id");
        me.id.width = 65;
        me.id.label = "id";
        me.companyname.x = 195;
        me.companyname.y = 45;
        me.companyname.bind(me.databinder, "CompanyName");
        me.companyname.label = "Company Name";
        me.companyname.width = 155;
        me.contacttitle.x = 10;
        me.contacttitle.y = 45;
        me.contacttitle.label = "Contact Title";
        me.contacttitle.bind(me.databinder, "ContactTitle");
        me.contactname.x = 90;
        me.contactname.y = 5;
        me.contactname.label = "Contact Name";
        me.contactname.bind(me.databinder, "ContactName");
        me.contactname.width = 260;
        me.address.x = 10;
        me.address.y = 90;
        me.address.bind(me.databinder, "Address");
        me.address.label = "Address";
        me.address.width = 340;
        me.postalcode.x = 10;
        me.postalcode.y = 140;
        me.postalcode.label = "Postal Code";
        me.postalcode.bind(me.databinder, "PostalCode");
        me.postalcode.width = 90;
        me.textbox1.x = 100;
        me.textbox1.y = 140;
        me.textbox1.label = "City";
        me.textbox1.width = 250;
        me.textbox1.bind(me.databinder, "City");
        me.region.x = 10;
        me.region.y = 185;
        me.region.bind(me.databinder, "Region");
        me.region.label = "Region";
        me.textbox2.x = 195;
        me.textbox2.y = 185;
        me.textbox2.label = "Country";
        me.textbox2.bind(me.databinder, "Country");
        this.width = 940;
        this.height = 377;
        me.phone.x = 10;
        me.phone.y = 230;
        me.phone.label = "Phone";
        me.phone.bind(me.databinder, "Phone");
        me.fax.x = 195;
        me.fax.y = 230;
        me.fax.label = "Fax";
        me.fax.bind(me.databinder, "Fax");
        me.toolbar.height = 20;
    }
}
export async function test() {
    var ret = new CustomerView;
    ret["value"] = <Customer>await Customer.findOne();
    return ret;
}
