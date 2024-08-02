import { Checkbox } from "jassijs/ui/Checkbox";
import { Textbox } from "jassijs/ui/Textbox";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { $Class } from "jassijs/remote/Registry";
import { Panel,PanelProperties } from "jassijs/ui/Panel";
import { $Action,$ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
import { Products } from "northwind/remote/Products";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { jc } from "jassijs/ui/Component";
import { States,foreach } from "jassijs/ui/State";
function ProductPanel(props: {
    value: Products;
},states: States<{
    value: Products;
}>) {
    return jc(Panel,{
        children: [
            jc(HTMLPanel,{ value: "Product Name:",width: 125 }),
            jc(Textbox,{ bind: states.value.bind.ProductName }),
            jc(Checkbox,{ text: "Discounted",bind: states.value.bind.Discontinued }),
            jc("br"),
            jc(HTMLPanel,{ value: "Quantity Per Unit:",width: 125 }),
            jc(Textbox,{ bind: states.value.bind.QuantityPerUnit }),
            jc(HTMLPanel,{ value: "Unit Price:" }),
            jc(Textbox,{
                bind: states.value.bind.UnitPrice,converter: new NumberConverter({
                    format: "#.##0,00"
                })
            }),
            jc("br"),
            jc("br"),
        ]
    });
}
interface ProductListProperties extends PanelProperties {
    values?: Products[];
}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("northwind/ProductList")
export class ProductList extends Panel<ProductListProperties> {
    constructor(props?: ProductListProperties) {
        super(props);
        this.setData();
    }
    render() {
        return jc(Panel,{
            children: [
                jc(HTMLPanel,{
                    value: "Productlist",
                    style: {
                        fontSize: "20px",
                        color: "darkblue"
                    }
                }),
                jc("br",{}),
                jc(Panel,{
                    children: foreach(this.states.values,(ob) => jc(ProductPanel,{ value: ob }))
                })
            ]
        });
    }
    @$Action({ name: "Northwind/Product List",icon: "mdi mdi-reproduction" })
    static showDialog() {
        windows.add(new ProductList(),"ProductList");
    }
    async setData() {
        var all: Products[]=<any>await Products.find({});
        all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
            this.states.values.current = all;
    }
}
            export async function test() {
    var all: Products[] = <any>await Products.find({});
    all.sort((a, b) => { return a.ProductName.localeCompare(b.ProductName); });
                //this.states.values.current = [all[0]];
                var ret = new ProductList({values: all });
                return ret;
}
