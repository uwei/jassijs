define(["require", "exports", "jassijs/ui/Table", "jassijs/ui/Component", "jassijs/ui/Textbox", "jassijs/ui/StateBinder", "jassijs/ui/Button", "jassijs/ui/Select"], function (require, exports, Table_1, Component_1, Textbox_1, StateBinder_1, Button_1, Select_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var j = {};
    var invoices = [
        {
            title: "R1",
            customer: {
                id: 1,
                name: "Meier"
            },
            positions: [{ id: 1, text: "P1" }, { id: 2, text: "P2" }]
        },
        {
            title: "R2",
            customer: {
                id: 2,
                name: "Lehmann"
            },
            positions: [{ id: 3, text: "P3" }, { id: 4, text: "P4" }]
        },
        {
            title: "R3",
            customer: {
                id: 3,
                name: "Schulze"
            },
            positions: [{ id: 6, text: "P6" }, { id: 6, text: "P6" }]
        },
    ];
    var inv = {
        invoice: invoices[1],
        invoices: invoices
    };
    class TestStatebinder extends Component_1.Component {
        constructor(props) {
            super(props);
        }
        render() {
            this.stateBinder = new StateBinder_1.StateDatabinder();
            return (0, Component_1.jc)("div", {
                children: [
                    (0, Component_1.jc)(Select_1.Select, {
                        bind: this.state.invoice.bind,
                        items: this.props.invoices,
                        placeholder: "Hallo",
                        display: "title",
                        width: 200
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.state.invoice.bind.customer.name
                    }),
                    (0, Component_1.jc)(Button_1.Button, {
                        text: "Save",
                        onclick: () => {
                            console.log(JSON.stringify(inv));
                            debugger;
                            var h = this.state.invoice.bind.$fromForm();
                            console.log(JSON.stringify(inv));
                        }
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Table_1.Table, {
                        autocommit: true,
                        bindItems: this.state.invoice.bind.positions,
                        bind: this.state.currentPosition.bind
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.state.currentPosition.bind.text
                    }),
                ]
            });
        }
    }
    function test() {
        var ret = new TestStatebinder(inv);
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
    exports.test = test;
});
//# sourceMappingURL=TestStatebinder.js.map