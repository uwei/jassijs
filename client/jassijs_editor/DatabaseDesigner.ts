import { BoxPanel } from "jassijs/ui/BoxPanel";
import { Button } from "jassijs/ui/Button";
import { Select } from "jassijs/ui/Select";
import { Table } from "jassijs/ui/Table";
import { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";

import { OptionDialog } from "jassijs/ui/OptionDialog";
import { router } from "jassijs/base/Router";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
import { DatabaseClass, DatabaseField, DatabaseSchema } from "jassijs_editor/util/DatabaseSchema";
import { StateDatabinder } from "jassijs/ui/StateBinder";
type Me = {
    table?: Table;
    select?: Select;
    databinder?: StateDatabinder;
    newclass?: Button;
    boxpanel1?: BoxPanel;
    save?: Button;
    boxpanel2?: BoxPanel;
    newfield?: Button;
    removefield?: Button;
    boxpanel3?: BoxPanel;
};

@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs_editor/DatabaseDesigner")
export class DatabaseDesigner extends Panel {
    me: Me;
    currentSchema: DatabaseSchema;
    currentClass: DatabaseClass;
    allTypes = { values: [""] };
    posibleRelations = { values: [""] };
    constructor(readShema = true) {
        super();
        this.me = {};
        this.layout(this.me, readShema);
    }
    @$Action({
        name: "Administration/Database Designer",
        icon: "mdi mdi-database-edit",
    })
    static async showDialog() {
        router.navigate("#do=jassijs_editor/DatabaseDesigner");
    }

    layout(me: Me, readShema = true) {
        me.newclass = new Button();
        me.boxpanel1 = new BoxPanel();
        me.save = new Button();
        me.boxpanel2 = new BoxPanel({horizontal :false});
        me.newfield = new Button();
        me.removefield = new Button();
        me.boxpanel3 = new BoxPanel();
        me.boxpanel1.horizontal = true;
        var _this = this;
        var xxx = 0;
        var params = { values: ["hall", "du"] };
        me.table = new Table(
            {
                options: {
                    autoColumns: false,
                    columns: [
                        //@ts-ignore
                        { title: "name", field: "name", editor: "input", editable: true },
                        //@ts-ignore
                        { title: "type", field: "type", editor: "select", editorParams: this.allTypes },
                        //@ts-ignore
                        { title: "nullable", field: "nullable", editor: "tickCross", editorParams: { tristate: false } },

                        {
                            //@ts-ignore
                            title: "relationinfo", field: "relationinfo", editor: "select",
                            editorParams: this.posibleRelations,
                            cellEditing: function (cell) {
                                _this.updatePossibleRelations(cell);
                            }
                        }
                    ]
                }
            });
        me.select = new Select();
        me.databinder = new Databinder();
        this.add(me.databinder);
        me.table.width = 565;
        me.table.height = "300";
        me.table.onchange(function (event?: JQueryEventObject, data?: any/*Tabulator.RowComponent*/) {
        });
        me.select.display = "name";
        me.select.selectComponent = me.databinder;
        me.select.onchange(function (event) {
            _this.update();
        });
        me.select.width = 210;
        if (readShema) {
            this.readSchema();
        }
        this.width = 719;
        this.height = 386;
        this.add(me.boxpanel1);
        this.add(me.boxpanel2);
        me.newclass.text = "Create DBClass";
        me.newclass.onclick(function (event) {
            _this.addClass();
        });
        me.newclass.icon = "mdi mdi-note-plus-outline";
        me.newclass.tooltip = "new DBClass";
        me.newclass.width = "150";
        me.boxpanel1.add(me.select);
        me.boxpanel1.width = 365;
        me.boxpanel1.height = 25;
        me.boxpanel1.add(me.newclass);
        me.boxpanel1.add(me.save);
        me.save.text = "Save all Classes";
        me.save.onclick(function (event) {
            _this.saveAll().then((s) => {
                if (s !== "") {
                    alert(s);
                }
            })
        });
        me.save.width = 150;
        me.save.icon = "mdi mdi-content-save";
        me.save.width = 180;
        me.boxpanel2.height = 115;
        me.boxpanel2.horizontal = true;
        me.boxpanel2.width = 55;
        me.newfield.text = "Create Field";
        me.newfield.icon = "mdi mdi-playlist-plus";
        me.newfield.onclick(function (event) {
            _this.addField();
        });
        me.newfield.width = "120";
        me.newfield.height = 25;
        me.newfield.style = {
            textAlign: "left"
        };
        me.boxpanel2.add(me.table);
        me.boxpanel2.add(me.boxpanel3);
        me.removefield.text = "Remove Field";
        me.removefield.icon = "mdi mdi-playlist-minus";
        me.removefield.width = "120";
        me.removefield.style = {
            textAlign: "left"
        };
        me.removefield.onclick(function (event) {
            var field = me.table.value;
            if (field) {
                var pos = _this.currentClass.fields.indexOf(field);
                _this.currentClass.fields.splice(pos, 1);
                me.table.items = _this.currentClass.fields;
                me.table.value = undefined;
            }
        });
        me.boxpanel3.add(me.newfield);
        me.boxpanel3.add(me.removefield);
    }

    async saveAll(showChanges = undefined): Promise<string> {
        try {
            var text = await this.currentSchema.updateSchema(true);
            if (text !== "") {
                if (showChanges === false || (await OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
                    await this.currentSchema.updateSchema(false);
                    //@ts-ignore
                    windows.findComponent("Files")?.refresh();
                }
            }
            else {
                return "no changes detected";
            }
        }
        catch (err) {

            return err.message + "\r\n" + err.stack;
        }
        return "";
    }

    addField(typename: string = undefined, name: string = undefined, nullable: boolean = undefined, relation: string = undefined) {
        var field = new DatabaseField();
        //@ts-ignore
        field.parent = this.currentClass;
        if (name)
            field.name = name;
        if (nullable)
            field.nullable = nullable;
        if (typename)
            field.type = typename;
        if (relation)
            field.relation = relation;
        this.currentClass.fields.push(field);
        this.me.table.items = this.currentClass.fields;
    }

    async addClass(classname: string = undefined) {
        var sub = this.currentClass.name.substring(0, this.currentClass.name.lastIndexOf("."));
        var res;
        if (classname) {
            res = {
                button: "OK",
                text: classname
            }
        } else
            res = await OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
        if (res.button === "OK") {
            this.currentClass = new DatabaseClass();
            this.currentClass.name = res.text;
            this.currentClass.parent = this.currentSchema;
            var f = new DatabaseField();
            f.name = "id";
            f.type = "int";
            f.relation = "PrimaryColumn";
            this.currentClass.fields = [f];
            this.currentSchema.databaseClasses.push(this.currentClass);
            this.me.select.items = this.currentSchema.databaseClasses;
            this.me.select.value = this.currentClass;
            this.update();
        }
    }

    updatePossibleRelations(cell: any /*Tabulator.CellComponent*/) {
        var _this = this;
        var tp: DatabaseField = <DatabaseField>cell.getData();
        this.posibleRelations.values = tp.getPossibleRelations();
    }
    updateTypes() {
        var _this = this;
        this.allTypes.values = [];
        DatabaseSchema.basicdatatypes.forEach((e) => {
            _this.allTypes.values.push(e);
        });
        this.currentSchema.databaseClasses.forEach((cl) => {
            _this.allTypes.values.push(cl.name);
            _this.allTypes.values.push(cl.name + "[]");
        });
    }
    update() {
        this.currentClass = this.me.select.value;
        this.me.table.items = this.currentClass.fields;
        this.updateTypes();
    }
    async readSchema() {
        this.currentSchema = new DatabaseSchema();
        await this.currentSchema.loadSchemaFromCode();
        this.me.select.items = this.currentSchema.databaseClasses;
        this.me.select.value = this.currentSchema.databaseClasses[0];
        this.update();
    }
}

export async function test() {
    var ret = new DatabaseDesigner();

    return ret;
}
