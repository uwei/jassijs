var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "jassijs/ui/BoxPanel", "jassijs/ui/Button", "jassijs/ui/Select", "jassijs/ui/Table", "jassijs/remote/Registry", "jassijs/ui/Panel", "jassijs/ui/OptionDialog", "jassijs/base/Router", "jassijs/base/Actions", "jassijs/base/Windows", "jassijs_editor/util/DatabaseSchema"], function (require, exports, BoxPanel_1, Button_1, Select_1, Table_1, Registry_1, Panel_1, OptionDialog_1, Router_1, Actions_1, Windows_1, DatabaseSchema_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.DatabaseDesigner = void 0;
    Windows_1 = __importDefault(Windows_1);
    let DatabaseDesigner = class DatabaseDesigner extends Panel_1.Panel {
        constructor(readShema = true) {
            super();
            this.allTypes = { values: [""] };
            this.posibleRelations = { values: [""] };
            this.me = {};
            this.layout(this.me, readShema);
        }
        static async showDialog() {
            Router_1.router.navigate("#do=jassijs_editor/DatabaseDesigner");
        }
        layout(me, readShema = true) {
            me.newclass = new Button_1.Button();
            me.boxpanel1 = new BoxPanel_1.BoxPanel();
            me.save = new Button_1.Button();
            me.boxpanel2 = new BoxPanel_1.BoxPanel({ horizontal: false });
            me.newfield = new Button_1.Button();
            me.removefield = new Button_1.Button();
            me.boxpanel3 = new BoxPanel_1.BoxPanel();
            me.boxpanel1.horizontal = true;
            var _this = this;
            var xxx = 0;
            var params = { values: ["hall", "du"] };
            me.table = new Table_1.Table({
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
            me.select = new Select_1.Select();
            me.databinder = new Databinder();
            this.add(me.databinder);
            me.table.width = 565;
            me.table.height = "300";
            me.table.onchange(function (event, data /*Tabulator.RowComponent*/) {
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
                });
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
        async saveAll(showChanges = undefined) {
            var _a;
            try {
                var text = await this.currentSchema.updateSchema(true);
                if (text !== "") {
                    if (showChanges === false || (await OptionDialog_1.OptionDialog.show("Do you won't this changes?<br/>" + text.replaceAll("\n", "<br/>"), ["Yes", "Cancel"])).button === "Yes") {
                        await this.currentSchema.updateSchema(false);
                        //@ts-ignore
                        (_a = Windows_1.default.findComponent("Files")) === null || _a === void 0 ? void 0 : _a.refresh();
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
        addField(typename = undefined, name = undefined, nullable = undefined, relation = undefined) {
            var field = new DatabaseSchema_1.DatabaseField();
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
        async addClass(classname = undefined) {
            var sub = this.currentClass.name.substring(0, this.currentClass.name.lastIndexOf("."));
            var res;
            if (classname) {
                res = {
                    button: "OK",
                    text: classname
                };
            }
            else
                res = await OptionDialog_1.OptionDialog.show("Enter classname", ["OK", "Cancel"], undefined, true, sub + ".MyOb");
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
        updatePossibleRelations(cell /*Tabulator.CellComponent*/) {
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
        (0, Actions_1.$Action)({
            name: "Administration/Database Designer",
            icon: "mdi mdi-database-edit",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], DatabaseDesigner, "showDialog", null);
    DatabaseDesigner = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("jassijs_editor/DatabaseDesigner"),
        __metadata("design:paramtypes", [Object])
    ], DatabaseDesigner);
    exports.DatabaseDesigner = DatabaseDesigner;
    async function test() {
        var ret = new DatabaseDesigner();
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=DatabaseDesigner.js.map