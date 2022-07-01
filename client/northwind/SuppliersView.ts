import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Suppliers } from "northwind/remote/Suppliers";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    id?: Textbox;
    homepage?: Textbox;
    fax?: Textbox;
    phone?: Textbox;
    Country?: Textbox;
    region?: Textbox;
    city?: Textbox;
    postalCode?: Textbox;
    address?: Textbox;
    contactTitle?: Textbox;
    contactName?: Textbox;
    companyName?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Suppliers", actionname: "Northwind/Suppliers", icon: "mdi mdi-office-building-outline" })
@$Class("northwind.SuppliersView")
export class SuppliersView extends DBObjectView {
    declare me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    declare value: Suppliers;
    constructor() {
        super();
        //this.me = {}; this is called in objectdialog
        this.layout(this.me);
    }
    get title() {
        return this.value === undefined ? "SuppliersView" : "SuppliersView " + this.value.id;
    }
    layout(me: Me) {
        me.id = new Textbox();
        me.homepage = new Textbox();
        me.fax = new Textbox();
        me.phone = new Textbox();
        me.Country = new Textbox();
        me.region = new Textbox();
        me.city = new Textbox();
        me.postalCode = new Textbox();
        me.address = new Textbox();
        me.contactTitle = new Textbox();
        me.contactName = new Textbox();
        me.companyName = new Textbox();
        this.me.main.config({ isAbsolute: true, width: "800", height: "800", children: [
                me.id.config({
                    x: 10,
                    y: 5,
                    converter: new NumberConverter(),
                    width: 50,
                    bind: [me.databinder, "id"],
                    label: "Id"
                }),
                me.companyName.config({
                    x: 75,
                    y: 5,
                    label: "Company Name",
                    bind: [me.databinder, "CompanyName"],
                    width: 290
                }),
                me.contactName.config({
                    x: 10,
                    y: 50,
                    bind: [me.databinder, "ContactName"],
                    label: "Contact Name"
                }),
                me.contactTitle.config({
                    x: 180,
                    y: 50,
                    bind: [me.databinder, "ContactTitle"],
                    label: "Contact Title",
                    width: 185
                }),
                me.address.config({
                    x: 10,
                    y: 95,
                    bind: [me.databinder, "Address"],
                    label: "Address",
                    width: 355
                }),
                me.postalCode.config({
                    x: 10,
                    y: 140,
                    bind: [me.databinder, "PostalCode"],
                    width: 95,
                    label: "Postal Code"
                }),
                me.city.config({
                    x: 120,
                    y: 140,
                    bind: [me.databinder, "City"],
                    label: "City",
                    width: 245
                }),
                me.region.config({
                    x: 10,
                    y: 185,
                    bind: [me.databinder, "Region"],
                    label: "Region",
                    width: 155
                }),
                me.Country.config({
                    x: 180,
                    y: 185,
                    bind: [me.databinder, "Country"],
                    label: "Country",
                    width: 185
                }),
                me.phone.config({
                    x: 10,
                    y: 230,
                    bind: [me.databinder, "Phone"],
                    label: "Phone",
                    width: 155
                }),
                me.fax.config({
                    x: 180,
                    y: 230,
                    bind: [me.databinder, "Fax"],
                    label: "Fax",
                    width: 185
                }),
                me.homepage.config({
                    x: 10,
                    y: 275,
                    bind: [me.databinder, "HomePage"],
                    label: "Home Page",
                    width: 355
                })
            ] });
    }
}
export async function test() {
    var ret = new SuppliersView;
    ret["value"] = <Suppliers>await Suppliers.findOne();
    return ret;
}
