import { Table } from "jassijs/ui/Table";
import { TextComponent } from "jassijs/ui/Component";
import { Component,ComponentProperties,jc } from "jassijs/ui/Component";
import { Textbox } from "jassijs/ui/Textbox";
import { StateDatabinder } from "jassijs/ui/StateBinder";
import { Button } from "jassijs/ui/Button";
import { State } from "jassijs/ui/State";
import { Select } from "jassijs/ui/Select";
type BoundProperty<T={}>={
    $fromForm: () => T;
}&{
    $toForm: () => any;
}&{
        [Property in keyof T]: BoundProperty<T[Property]>;
    };
interface Invoice {
    title?: string;
    customer?: Customer;
    positions?: Position[];
}
interface Customer {
    name: string;
    id: number;
}
interface Position {
    id?: number;
    text?: string;
}
interface Props2 extends ComponentProperties {
    invoice?: Invoice;
    invoices?: Invoice[];
    currentPosition?:Position;
}
var j: Props2={};
var invoices=[
    {
        title: "R1",
        customer: {
            id: 1,
            name: "Meier"
        },
        positions: [{ id: 1,text: "P1" },{ id: 2,text: "P2" }]
    },
    {
        title: "R2",
        customer: {
            id: 2,
            name: "Lehmann"
        },
        positions: [{ id: 3,text: "P3" },{ id: 4,text: "P4" }]
    },
    {
        title: "R3",
        customer: {
            id: 3,
            name: "Schulze"
        },
        positions: [{ id: 6,text: "P6" },{ id: 6,text: "P6" }]
    },
];
var inv: Props2={
    invoice: invoices[1],
    invoices: invoices
};
class TestStatebinder extends Component<Props2> {
    stateBinder: StateDatabinder;
    constructor(props: Props2) {
        super(props);
    }
    render() {
        this.stateBinder=new StateDatabinder();
        return jc("div",{
            children: [
               
                jc(Select,{
                    bind: this.state.invoice.bind, 
                    items: this.props.invoices,
                    placeholder:"Hallo",
                    display:"title",
                    width:200
                }),
                jc("br"),
                jc(Textbox,{
                    bind: this.state.invoice.bind.customer.name
                }),
                jc(Button,{
                    text: "Save",
                    onclick: () => {
                        console.log(JSON.stringify(inv));
                        debugger;
                        var h=this.state.invoice.bind.$fromForm();
                        console.log(JSON.stringify(inv));
                    }
                }),
                jc("br"),
                jc(Table,{
                    autocommit: true,
                    bindItems: this.state.invoice.bind.positions,
                    bind:this.state.currentPosition.bind
                }),
                jc("br"),
                 jc(Textbox,{
                    bind: this.state.currentPosition.bind.text
                }),
            ]
        });
    }
}
export function test() {
    var ret=new TestStatebinder(inv);
    /* var jk = ret.states.ar.bind._databinder;
     var p = ret.states.ar.bind._propertyname;
 
     var jk2 = ret.states.ar.bind.customer._databinder;
     var p2 = ret.states.ar.bind.customer._propertyname;
     var jk3 = ret.states.ar.bind.customer.name._databinder;
     var p3 = ret.states.ar.bind.customer.name._propertyname;
     debugger;*/
    //ret.stateBinder.value = inv;
    return ret;
}

