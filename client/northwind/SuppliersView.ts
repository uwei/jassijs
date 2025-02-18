import { HTMLComponent } from "jassijs/ui/Component";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Suppliers } from "northwind/remote/Suppliers";
import { DBObjectView,$DBObjectView, DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";

@$DBObjectView({ classname: "northwind.Suppliers",actionname: "Northwind/Suppliers",icon: "mdi mdi-office-building-outline" })
@$Class("northwind.SuppliersView")
export class SuppliersView extends DBObjectView<Suppliers> {
    get title() {
        return this.value===undefined? "SuppliersView":"SuppliersView "+this.value.id;
    }
    render() {
        return jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(Textbox,{ bind: this.states.value.bind.id,converter: new NumberConverter(),label: "Id" }),
                jc(Textbox,{ bind: this.states.value.bind.CompanyName,label: "Company Name" }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.ContactName,label: "Contact Name" }),
                jc(Textbox,{ label: "Contact Title",bind: this.states.value.bind.ContactTitle }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.Address,label: "Address",width: 330 }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.PostalCode,label: "Postal Code" }),
                jc(Textbox,{ bind: this.states.value.bind.City,label: "City" }),
                jc("br",{}),
                jc(Textbox,{ bind: this.states.value.bind.Region,label: "Region" }),
                jc(Textbox,{ bind: this.states.value.bind.Country,label: "Country" }),
                jc("br",{}),
                jc(Textbox,{ label: "Phone",bind: this.states.value.bind.Phone }),
                jc(Textbox,{ label: "Fax",bind: this.states.value.bind.Fax }),
                jc("br",{}),
                jc(Textbox,{ label: "Homepage",bind: this.states.value.bind.HomePage,width: 330 })
            ]
        });
    }
   
}
export async function test() {
    var sup=<Suppliers>await Suppliers.findOne();
        var ret = new SuppliersView({
            value: sup
    });
        return ret;
}
