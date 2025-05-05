import { DateTimeConverter } from "jassijs/ui/converters/DateTimeConverter";
import { ObjectChooser } from "jassijs/ui/ObjectChooser";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { NumberConverter } from "jassijs/ui/converters/NumberConverter";
import { Image } from "jassijs/ui/Image";
import { Textarea } from "jassijs/ui/Textarea";
import { Textbox } from "jassijs/ui/Textbox";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";

import { Employees } from "northwind/remote/Employees";

import { DBObjectView, $DBObjectView,  DBObjectViewToolbar } from "jassijs/ui/DBObjectView";

import { jc } from "jassijs/ui/Component";
import { BoxPanel } from "jassijs/ui/BoxPanel";

@$DBObjectView({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" })
@$Class("northwind.EmployeesView")
export class EmployeesView extends DBObjectView<Employees> {
    get title() {
        return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
    }
    render() {
        return jc(Panel, {
            children: [
                jc(DBObjectViewToolbar, { view: this }),
                jc(Textbox, {
                    label: "Id",
                    bind: this.state.value.bind.id,
                    width: 60,
                    converter: new NumberConverter()
                }),
                jc(Textbox, {
                    label: "First name",
                    bind: this.state.value.bind.FirstName,
                }),
                jc(Textbox, {
                    label: "Last Name",
                    bind: this.state.value.bind.LastName,
                }),
                jc(Textbox, {
                    bind: this.state.value.bind.Title,
                    label: "Title",
                    width: 90
                }),
                jc(Textbox, {
                    label: "Title of C.",
                    width: 85,
                    bind: this.state.value.bind.TitleOfCourtesy
                }),
                jc("br"),
                jc(BoxPanel, {
                    horizontal: true,
                    children: [
                        jc(Panel, {
                            children: [
                                jc(Textbox, {
                                    label: "Address",
                                    bind: this.state.value.bind.Address,
                                    width: 345
                                }),
                                jc("br"),
                                jc(Textbox, {
                                    label: "Postal Code",
                                    bind: this.state.value.bind.PostalCode,
                                    width: 90
                                }),
                                jc(Textbox, {
                                    bind: this.state.value.bind.City,
                                    label: "City",
                                    width: 240
                                }),
                                jc("br"),
                                jc(Textbox, {
                                    bind: this.state.value.bind.Region,
                                    label: "Region",
                                    width: 90
                                }),
                                jc(Textbox, {
                                    bind: this.state.value.bind.Country,
                                    label: "country",
                                    width: 240
                                }),
                                jc("br"),
                                jc(Textbox, {
                                    width: 100,
                                    bind: this.state.value.bind.BirthDate,
                                    label: "Birth Date",
                                    converter: new DateTimeConverter()
                                }),
                                jc(Textbox, {
                                    bind: this.state.value.bind.HireDate,
                                    label: "Hire Date",
                                    width: 95,
                                    converter: new DateTimeConverter()
                                }),
                                jc("br"),
                                jc(Textbox, {
                                    bind: this.state.value.bind.HomePhone,
                                    label: "Home Phone",
                                    width: 130
                                })
                            ]
                        }),
                        jc(Textarea, {
                            width: 240,
                            height: 155,
                            bind: this.state.value.bind.Notes,
                            label: "Notes"
                        }),
                        jc(Image, {
                            src: "",
                            style: {
                                backgroundColor: "black",
                                borderStyle: "solid"
                            }
                            , width: 125, bind: this.state.value.bind.PhotoPath
                        }),
                    ]
                }),
                jc(Textbox, {
                    bind: this.state.value.bind.PhotoPath,
                    label: "Photo Path",
                    width: 460
                }),
                jc("br"),

                jc(Panel, {
                    label: "Reports To",
                    children: [
                        jc(HTMLPanel, {
                            bind: this.state.value.bind.ReportsTo.FirstName
                        }),
                        " ",
                        jc(HTMLPanel, {
                            bind: this.state.value.bind.ReportsTo.LastName
                        }),
                        jc(ObjectChooser, {
                            width: 25,
                            height: 25,
                            bind: this.state.value.bind.ReportsTo,
                            items: "northwind.Employees"
                        })
                    ]
                })
            ]
        });
    }
    /*
     jc(HTMLPanel, {
                        label: "Reports To",
                        bind: this.state.value.bind.ReportsTo,
                        template: "{{FirstName}} {{LastName}}",
                        width: 160
                    }),*/
}
export async function test() {
    var em = (await Employees.find({ id: 4 }))[0];
    var ret = new EmployeesView;
    ret.value = em;


    //var h=await validate(em);
    // ret.me.address
    return ret;
}
