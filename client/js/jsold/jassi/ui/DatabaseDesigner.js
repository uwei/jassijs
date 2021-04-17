var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/ui/BoxPanel", "jassi/ui/Button", "jassi/ui/Databinder", "jassi/ui/Select", "jassi/ui/Table", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/base/DatabaseSchema", "jassi/ui/OptionDialog", "jassi/base/Router", "jassi/base/Actions"], function (require, exports, BoxPanel_1, Button_1, Databinder_1, Select_1, Table_1, Jassi_1, Panel_1, DatabaseSchema_1, OptionDialog_1, Router_1, Actions_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseDesigner = void 0;
    var ttt = 1;
    let DatabaseDesigner = class DatabaseDesigner extends Panel_1.Panel {
        constructor() {
            super();
            this.allTypes = { values: [""] };
            this.posibleRelations = { values: [""] };
            this.me = {};
            this.layout(this.me);
        }
        static async showDialog() {
            Router_1.router.navigate("#do=jassi/ui/DatabaseDesigner");
        }
        layout(me) {
            me.newclass = new Button_1.Button();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.save = new Button_1.Button();
            me.boxpanel2 = new BoxPanel_1.BoxPanel(false);
            me.newfield = new Button_1.Button();
            me.boxpanel1.horizontal = true;
            var _this = this;
            var xxx = 0;
            var params = { values: ["hall", "du"] };
            me.table = new Table_1.Table({
                autoColumns: false,
                columns: [
                    //@ts-ignore
                    { title: "name", field: "name", editor: "input", editable: true },
                    //@ts-ignore
                    { title: "type", field: "type", editor: "select", editorParams: this.allTypes },
                    //@ts-ignore
                    { title: "nullable", field: "nullable", editor: "tick", editorParams: { tristate: false } },
                    //@ts-ignore
                    {
                        title: "relationinfo", field: "relationinfo", editor: "select",
                        editorParams: this.posibleRelations,
                        cellEditing: function (cell) {
                            _this.updatePossibleRelations(cell);
                        }
                    }
                ]
            });
            me.select = new Select_1.Select();
            me.databinder = new Databinder_1.Databinder();
            this.add(me.databinder);
            me.table.width = 565;
            me.table.height = "300";
            me.table.onchange(function (event, data) {
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
                var field = new DatabaseSchema_1.DatabaseField();
                //@ts-ignore
                field.parent = _this.currentClass;
                _this.currentClass.fields.push(field);
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
                    if ((await OptionDialog_1.OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
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
            var res = await OptionDialog_1.OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
            if (res.button === "OK") {
                this.currentClass = new DatabaseSchema_1.DatabaseClass();
                this.currentClass.name = res.text;
                this.currentClass.parent = this.currentSchema;
                var f = new DatabaseSchema_1.DatabaseField();
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
        updatePossibleRelations(cell) {
            var _this = this;
            var tp = cell.getData();
            this.posibleRelations.values = tp.getPossibleRelations();
        }
        updateTypes() {
            var _this = this;
            this.allTypes.values = [];
            DatabaseSchema_1.DatabaseSchema.basicdatatypes.forEach((e) => {
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
            this.currentSchema = new DatabaseSchema_1.DatabaseSchema();
            await this.currentSchema.loadSchemaFromCode();
            this.me.select.items = this.currentSchema.databaseClasses;
            this.me.select.value = this.currentSchema.databaseClasses[0];
            this.update();
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Administration/Database Designer",
            icon: "mdi mdi-database-edit",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DatabaseDesigner, "showDialog", null);
    DatabaseDesigner = __decorate([
        Actions_1.$ActionProvider("jassi.base.ActionNode"),
        Jassi_1.$Class("jassi/ui/DatabaseDesigner"),
        __metadata("design:paramtypes", [])
    ], DatabaseDesigner);
    exports.DatabaseDesigner = DatabaseDesigner;
    async function test() {
        var ret = new DatabaseDesigner();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=DatabaseDesigner.js.map
//# sourceMappingURL=DatabaseDesigner.js.map