import { Ref } from "jassijs/ui/Component";
import { TextComponent } from "jassijs/ui/Component";
import { HTMLComponent } from "jassijs/ui/Component";
import { DateTimeConverter } from "jassijs/ui/converters/DateTimeConverter";
import { Style } from "jassijs/ui/Style";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Checkbox } from "jassijs/ui/Checkbox";
import { Repeater } from "jassijs/ui/Repeater";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { Orders } from "northwind/remote/Orders";
import { DBObjectView,$DBObjectView,DBObjectViewProperties,DBObjectViewToolbar } from "jassijs/ui/DBObjectView";
import { jc } from "jassijs/ui/Component";
import { OrderDetails } from "northwind/remote/OrderDetails";
import { States,foreach } from "jassijs/ui/State";
import { Repeater2 } from "jassijs/ui/Repeater2";
type Me={
    shipName?: Textbox;
    shipAddress?: Textbox;
    shipPostalCode?: Textbox;
    shipCity?: Textbox;
    shipCountry?: Textbox;
    shipRegion?: Textbox;
};
function ProductDetails(props: {
    product: OrderDetails;
},states: States<{
    product: OrderDetails;
}>) {
    var hh=states.product;
    return jc(Panel,{
        children: [
            jc(Textbox,{ bind: states.product.bind.Quantity,width: 85 }),
            jc(HTMLPanel,{ bind: states.product.bind.Product.ProductName,width: 365 }),
            jc(ObjectChooser,{
                bind: states.product.bind.Product,
                items: "northwind.Products"
            }),
            jc("br"),
        ]
    });
}
interface OrdersViewProperties extends DBObjectViewProperties<Orders> {
    activeDetail?: OrderDetails;
}
@$DBObjectView({ classname: "northwind.Orders",actionname: "Northwind/Orders",icon: "mdi mdi-script-text",queryname: "findAllWithDetails" })
@$Class("northwind.OrdersView")
export class OrdersView extends DBObjectView<Orders,OrdersViewProperties> {
    declare refs: Me;
    render() {
        return jc(Panel,{
            children: [
                jc(DBObjectViewToolbar,{ view: this }),
                jc(BoxPanel,{
                    horizontal: true,
                    children: [
                        jc(Panel,{
                            children: [
                                jc(Textbox,{ label: "Ship Name",bind: this.states.value.bind.ShipName,width: 260,ref: this.refs.shipName }),
                                jc(Textbox,{
                                    label: "Order ID",bind: this.states.value.bind.id,converter: new NumberConverter(),style: {
                                        textAlign: "right",
                                        width: 60
                                    }
                                }),
                                jc("br",{ tag: "br" }),
                                jc(Textbox,{ label: "Ship Address",bind: this.states.value.bind.ShipAddress,width: 260,ref: this.refs.shipAddress }),
                                jc(Textbox,{
                                    label: "Freight",bind: this.states.value.bind.Freight,width: 60,converter: new NumberConverter({ format: "#.##0,00" }),style: {
                                        textAlign: "right"
                                    }
                                }),
                                jc("br",{ tag: "br" }),
                                jc(Textbox,{ label: "Postal Code",bind: this.states.value.bind.ShipPostalCode,width: 60,hidden: false,ref: this.refs.shipPostalCode }),
                                jc(Textbox,{ bind: this.states.value.bind.ShipCity,label: "Ship City",width: 195,value: "shipCity" }),
                                jc("br",{ tag: "br" }),
                                jc(Textbox,{ label: "Ship Region",bind: this.states.value.bind.ShipRegion,width: 150,ref: this.refs.shipRegion }),
                                "",
                                jc(Textbox,{ label: " Ship Country",bind: this.states.value.bind.ShipCountry,width: 105,ref: this.refs.shipCountry })
                            ],
                            width: 485
                        }),
                        jc(Panel,{
                            children: [
                                jc(HTMLPanel,{ bind: this.states.value.bind.Customer.CompanyName,label: "Customer",width: 260 }),
                                jc(ObjectChooser,{
                                    autocommit: false,items: "northwind.Customer",bind: this.states.value.bind.Customer,height: 25,
                                    onchange: (data) => {
                                        var cust=this.states.value.Customer.current;
                                        this.refs.shipName.value=cust.CompanyName;
                                        this.refs.shipAddress.value=cust.Address;
                                        this.refs.shipPostalCode.value=cust.PostalCode;
                                        this.refs.shipCity.value=cust.City;
                                        this.refs.shipCountry.value=cust.Country;
                                        this.refs.shipRegion.value=cust.Region;
                                    }
                                }),
                                jc("br",{}),
                                jc(HTMLPanel,{ bind: this.states.value.bind.ShipVia,template: "{{id}} {{CompanyName}}",width: 260,label: "Ship Via" }),
                                jc(ObjectChooser,{ items: "northwind.Shippers",bind: this.states.value.bind.ShipVia }),
                                jc("br",{}),
                                jc(HTMLPanel,{ bind: this.states.value.bind.Employee,template: "{{id}} {{FirstName}} {{LastName}}",width: 260,label: "Employee",height: 20 }),
                                jc(ObjectChooser,{ items: "northwind.Employees",bind: this.states.value.bind.Employee }),
                                jc("br",{}),
                                jc(Textbox,{ bind: this.states.value.bind.OrderDate,converter: new DateTimeConverter(),label: "Oder Date",width: 95,text: "Oder Date" }),
                                jc(Textbox,{ bind: this.states.value.bind.RequiredDate,converter: new DateTimeConverter(),label: "Required Date",width: 95 }),
                                jc(Textbox,{ bind: this.states.value.bind.ShippedDate,converter: new DateTimeConverter(),label: "Shipped Date",width: 95 })
                            ]
                        })
                    ]
                }),
                jc("br",{}),
                jc("br",{}),
                jc(HTMLPanel,{ value: "Quantity",width: 90 }),
                jc(HTMLPanel,{ value: "Text" }),
                jc("br",{}),
                jc(BoxPanel, {
                     children: foreach(this.states.value.Details, (ob) => jc(ProductDetails, {
                         product: <any>ob
                     }))
                 })
                /*jc(Repeater2,{
                    items: this.states.value.Details,
                    bind: this.states.activeDetail.bind,
                    children: [
                        jc(Panel,{
                            children: [
                                jc(Textbox,{ bind: this.states.activeDetail.bind.Quantity,width: 85 }),
                                jc(Textbox,{ bind: this.states.activeDetail.bind.Product.ProductName }),
                                jc(ObjectChooser,{ bind: this.states.activeDetail.bind.Product,items: "northwind.Products" })
                            ]
                        })
                    ]
                })*/
                // this.states.value?.Details===undefined? jc("br", {}):this.props.value.Details.map((detail) => jc(ProductDetails, {product: detail }))
            ]
        });
    }
    get title() {
        return this.value===undefined? "OrdersView":"OrdersView "+this.value.id;
    }
}
export async function test() {
    var order: Orders=<Orders>await Orders.findOne({id: 10266, relations: ["*"] });
    //  var order=await Orders.find({relations: ["*"] });
        var ret = new OrdersView({
            value: order
    });
    setTimeout(async () => {
            ret.value=order=<Orders>await Orders.findOne({id: 10252, relations: ["*"] });
        //  var order=await Orders.find({relations: ["*"] });
    }, 3000);
                return ret;
}
