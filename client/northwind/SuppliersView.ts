import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import { $Property } from "jassijs/ui/Property";
import { Suppliers } from "northwind/remote/Suppliers";
import { Databinder } from "jassijs/ui/Databinder";
import { DBObjectView, $DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
import { DBObjectDialog } from "jassijs/ui/DBObjectDialog";
type Me = {
    id?: Textbox;
    companyName?: Textbox;
    contactName?: Textbox;
    contactTitle?: Textbox;
    address?: Textbox;
    postalCode?: Textbox;
    city?: Textbox;
    region?: Textbox;
    Country?: Textbox;
    phone?: Textbox;
    fax?: Textbox;
    homepage?: Textbox;
} & DBObjectViewMe;
@$DBObjectView({ classname: "northwind.Suppliers",actionname: "Northwind/Suppliers",icon:"mdi mdi-office-building-outline" })
@$Class("northwind.SuppliersView")
export class SuppliersView extends DBObjectView {
    me: Me;
    @$Property({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" })
    value: Suppliers;
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
        me.companyName = new Textbox();
        me.contactName = new Textbox();
        me.contactTitle = new Textbox();
        me.address = new Textbox();
        me.postalCode = new Textbox();
        me.city = new Textbox();
        me.region = new Textbox();
        me.Country = new Textbox();
        me.phone = new Textbox();
        me.fax = new Textbox();
        me.homepage = new Textbox();
        me.main.add(me.id);
        me.main.isAbsolute = true;
        me.main.height = "800";
        me.main.width = 800;
        me.main.add(me.homepage);
        me.main.add(me.fax);
        me.main.add(me.phone);
        me.main.add(me.Country);
        me.main.add(me.region);
        me.main.add(me.city);
        me.main.add(me.postalCode);
        me.main.add(me.address);
        me.main.add(me.contactTitle);
        me.main.add(me.contactName);
        me.main.add(me.companyName);
        me.id.x = 10;
        me.id.y = 5;
        me.id.converter = new NumberConverter();
        me.id.width = 50;
        me.id.bind(me.databinder, "id");
        me.id.label = "Id";
        me.companyName.x = 75;
        me.companyName.y = 5;
        me.companyName.label = "Company Name";
        me.companyName.bind(me.databinder, "CompanyName");
        me.companyName.width = 290;
        me.contactName.x = 10;
        me.contactName.y = 50;
        me.contactName.bind(me.databinder, "ContactName");
        me.contactName.label = "Contact Name";
        me.contactTitle.x = 180;
        me.contactTitle.y = 50;
        me.contactTitle.bind(me.databinder, "ContactTitle");
        me.contactTitle.label = "Contact Title";
        me.contactTitle.width = 185;
        me.address.x = 10;
        me.address.y = 95;
        me.address.bind(me.databinder, "Address");
        me.address.label = "Address";
        me.address.width = 355;
        me.postalCode.x = 10;
        me.postalCode.y = 140;
        me.postalCode.bind(me.databinder, "PostalCode");
        me.postalCode.width = 95;
        me.postalCode.label = "Postal Code";
        me.city.x = 120;
        me.city.y = 140;
        me.city.bind(me.databinder, "City");
        me.city.label = "City";
        me.city.width = 245;
        me.region.x = 10;
        me.region.y = 185;
        me.region.bind(me.databinder, "Region");
        me.region.label = "Region";
        me.region.width = 155;
        me.Country.x = 180;
        me.Country.y = 185;
        me.Country.bind(me.databinder, "Country");
        me.Country.label = "Country";
        me.Country.width = 185;
        me.phone.x = 10;
        me.phone.y = 230;
        me.phone.bind(me.databinder, "Phone");
        me.phone.label = "Phone";
        me.phone.width = 155;
        me.fax.x = 180;
        me.fax.y = 230;
        me.fax.bind(me.databinder, "Fax");
        me.fax.label = "Fax";
        me.fax.width = 185;
        me.homepage.x = 10;
        me.homepage.y = 275;
        me.homepage.bind(me.databinder, "HomePage");
        me.homepage.label = "Home Page";
        me.homepage.width = 355;
    }
}
export async function test() {
    var ret = new SuppliersView;
    ret["value"] = <Suppliers>await Suppliers.findOne();
    return ret;
}
