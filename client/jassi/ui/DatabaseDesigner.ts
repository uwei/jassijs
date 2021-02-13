
import { BoxPanel } from "jassi/ui/BoxPanel";
import { Button } from "jassi/ui/Button";
import { Databinder } from "jassi/ui/Databinder";
import { Select } from "jassi/ui/Select";
import { Table } from "jassi/ui/Table";
import { $Class } from "jassi/remote/Jassi";
import { Panel } from "jassi/ui/Panel";
import { DatabaseSchema, DatabaseClass, DatabaseField } from "jassi/base/DatabaseSchema";
import { OptionDialog } from "jassi/ui/OptionDialog";
import { PropertyEditor } from "jassi/ui/PropertyEditor";
import { Property } from "jassi/ui/Property";

type Me = {
    table?: Table;
    select?: Select;
    databinder?: Databinder;
    newclass?: Button;
    boxpanel1?: BoxPanel;
    save?: Button;
    boxpanel2?: BoxPanel;
    newfield?: Button;
};
var ttt = 1;
@$Class("jassi/ui/DatabaseDesigner")
export class DatabaseDesigner extends Panel {
    me: Me;
    currentSchema: DatabaseSchema;
    currentClass: DatabaseClass;
    allTypes = { values: [""] };
    posibleRelations = { values: [""] };
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.newclass = new Button();
        me.boxpanel1 = new BoxPanel();
        me.save = new Button();
        me.boxpanel2 = new BoxPanel(false);
        me.newfield = new Button();
        me.boxpanel1.horizontal = true;
        var _this = this;
        var xxx = 0;
        var params = { values: ["hall", "du"] };
        me.table = new Table({
            autoColumns: false,
            columns: [
                //@ts-ignore
                { title: "name", field: "name", editor: "input", editable: true },
                //@ts-ignore
                { title: "type", field: "type", editor: "select", editorParams: this.allTypes },
                //@ts-ignore
                { title: "nullable", field: "nullable", editor: "tick", editorParams: { tristate: false } },
                //@ts-ignore
                { title: "relationinfo", field: "relationinfo", editor: "select",
                    editorParams: this.posibleRelations,
                    cellEditing: function (cell) {
                        _this.updatePossibleRelations(cell);
                    } }
            ]
        });
        me.select = new Select();
        me.databinder = new Databinder();
        this.add(me.databinder);
        me.table.width = 565;
        me.table.height = "300";
        me.table.onchange(function (event?: JQueryEventObject, data?: Tabulator.RowComponent) {
        });
        me.select.display = "name";
        me.select.selectComponent = me.databinder;
        me.select.onchange(function (event) {
            _this.update();
        });
        me.select.width = 210;
        this.readSchema();
        this.width = 719;
        this.height = 386;
        this.add(me.boxpanel1);
        this.add(me.boxpanel2);
        me.newclass.text = "Create DBClass";
        me.newclass.onclick(function (event) {
            _this.newClass();
        });
        me.newclass.icon = "mdi mdi-note-plus-outline";
        me.newclass.tooltip = "new DBClass";
        me.newclass.width = "150";
        me.boxpanel1.add(me.select);
        me.boxpanel1.width = 365;
        me.boxpanel1.add(me.newclass);
        me.boxpanel1.add(me.save);
        me.save.text = "Save all Classes";
        me.save.onclick(function (event) {
            _this.saveAll();
        });
        me.save.width = 150;
        me.save.icon = "mdi mdi-content-save";
        me.save.width = 180;
        me.boxpanel2.height = 115;
        me.boxpanel2.horizontal = true;
        me.boxpanel2.width = 50;
        me.newfield.text = "Create Field";
        me.newfield.icon = "mdi mdi-playlist-plus";
        me.newfield.onclick(function (event) {
            _this.currentClass.fields.push(new DatabaseField());
            me.table.items = _this.currentClass.fields;
        });
        me.newfield.width = "140";
        me.boxpanel2.add(me.table);
        me.boxpanel2.add(me.newfield);
    }
    async saveAll() {
        try {
            var text = await this.currentSchema.updateSchema(true);
            if (text !== "") {
                if ((await OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
                    this.currentSchema.updateSchema(false);
                }
            }
            else {
                alert("no changes detected");
            }
        }
        catch (err) {
            alert(err.message);
        }
    }
    async newClass() {
        var sub = this.currentClass.name.substring(0, this.currentClass.name.lastIndexOf("."));
        var res = await OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
        if (res.button === "OK") {
            this.currentClass = new DatabaseClass();
            this.currentClass.name = res.text;
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
    updatePossibleRelations(cell: Tabulator.CellComponent) {
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
