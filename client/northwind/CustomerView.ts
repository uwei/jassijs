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
}
export async function test() {
    var ret = new CustomerView;
    ret["value"] = <Customer>await Customer.findOne();
    return ret;
}
