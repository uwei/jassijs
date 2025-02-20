var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/ui/converters/DateTimeConverter", "jassijs/ui/ObjectChooser", "jassijs/ui/HTMLPanel", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Image", "jassijs/ui/Textarea", "jassijs/ui/Textbox", "jassijs/remote/Registry", "jassijs/ui/Panel", "northwind/remote/Employees", "jassijs/ui/DBObjectView", "jassijs/ui/Component", "jassijs/ui/BoxPanel"], function (require, exports, DateTimeConverter_1, ObjectChooser_1, HTMLPanel_1, NumberConverter_1, Image_1, Textarea_1, Textbox_1, Registry_1, Panel_1, Employees_1, DBObjectView_1, Component_1, BoxPanel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.EmployeesView = void 0;
    let EmployeesView = class EmployeesView extends DBObjectView_1.DBObjectView {
        get title() {
            return this.value === undefined ? "EmployeesView" : "EmployeesView " + this.value.id;
        }
        render() {
            return (0, Component_1.jc)(Panel_1.Panel, {
                children: [
                    (0, Component_1.jc)(DBObjectView_1.DBObjectViewToolbar, { view: this }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Id",
                        bind: this.state.value.bind.id,
                        width: 60,
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "First name",
                        bind: this.state.value.bind.FirstName,
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Last Name",
                        bind: this.state.value.bind.LastName,
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.state.value.bind.Title,
                        label: "Title",
                        width: 90
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        label: "Title of C.",
                        width: 85,
                        bind: this.state.value.bind.TitleOfCourtesy
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(BoxPanel_1.BoxPanel, {
                        horizontal: true,
                        children: [
                            (0, Component_1.jc)(Panel_1.Panel, {
                                children: [
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        label: "Address",
                                        bind: this.state.value.bind.Address,
                                        width: 345
                                    }),
                                    (0, Component_1.jc)("br"),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        label: "Postal Code",
                                        bind: this.state.value.bind.PostalCode,
                                        width: 90
                                    }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        bind: this.state.value.bind.City,
                                        label: "City",
                                        width: 240
                                    }),
                                    (0, Component_1.jc)("br"),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        bind: this.state.value.bind.Region,
                                        label: "Region",
                                        width: 90
                                    }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        bind: this.state.value.bind.Country,
                                        label: "country",
                                        width: 240
                                    }),
                                    (0, Component_1.jc)("br"),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        width: 100,
                                        bind: this.state.value.bind.BirthDate,
                                        label: "Birth Date",
                                        converter: new DateTimeConverter_1.DateTimeConverter()
                                    }),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        bind: this.state.value.bind.HireDate,
                                        label: "Hire Date",
                                        width: 95,
                                        converter: new DateTimeConverter_1.DateTimeConverter()
                                    }),
                                    (0, Component_1.jc)("br"),
                                    (0, Component_1.jc)(Textbox_1.Textbox, {
                                        bind: this.state.value.bind.HomePhone,
                                        label: "Home Phone",
                                        width: 130
                                    })
                                ]
                            }),
                            (0, Component_1.jc)(Textarea_1.Textarea, {
                                width: 240,
                                height: 155,
                                bind: this.state.value.bind.Notes,
                                label: "Notes"
                            }),
                            (0, Component_1.jc)(Image_1.Image, {
                                src: "",
                                style: {
                                    backgroundColor: "black",
                                    borderStyle: "solid"
                                },
                                width: 125, bind: this.state.value.bind.PhotoPath
                            }),
                        ]
                    }),
                    (0, Component_1.jc)(Textbox_1.Textbox, {
                        bind: this.state.value.bind.PhotoPath,
                        label: "Photo Path",
                        width: 460
                    }),
                    (0, Component_1.jc)("br"),
                    (0, Component_1.jc)(Panel_1.Panel, {
                        label: "Reports To",
                        children: [
                            (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, {
                                bind: this.state.value.bind.ReportsTo.FirstName
                            }),
                            " ",
                            (0, Component_1.jc)(HTMLPanel_1.HTMLPanel, {
                                bind: this.state.value.bind.ReportsTo.LastName
                            }),
                            (0, Component_1.jc)(ObjectChooser_1.ObjectChooser, {
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
    };
    EmployeesView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "northwind.Employees", actionname: "Northwind/Employees", icon: "mdi mdi-account-tie" }),
        (0, Registry_1.$Class)("northwind.EmployeesView")
    ], EmployeesView);
    exports.EmployeesView = EmployeesView;
    async function test() {
        var em = (await Employees_1.Employees.find({ id: 4 }))[0];
        var ret = new EmployeesView;
        ret.value = em;
        //var h=await validate(em);
        // ret.me.address
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=EmployeesView.js.map