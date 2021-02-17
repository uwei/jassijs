var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2VEZXNpZ25lci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpL3VpL0RhdGFiYXNlRGVzaWduZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQXFCQSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFHWixJQUFhLGdCQUFnQixHQUE3QixNQUFhLGdCQUFpQixTQUFRLGFBQUs7UUFNdkM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUhaLGFBQVEsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDNUIscUJBQWdCLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1lBR2hDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVTtZQUNuQixlQUFNLENBQUMsUUFBUSxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDckQsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLElBQUksR0FBRyxJQUFJLGVBQU0sRUFBRSxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxTQUFTLEdBQUcsSUFBSSxtQkFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25DLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDL0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLElBQUksTUFBTSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDeEMsRUFBRSxDQUFDLEtBQUssR0FBRyxJQUFJLGFBQUssQ0FBQztnQkFDakIsV0FBVyxFQUFFLEtBQUs7Z0JBQ2xCLE9BQU8sRUFBRTtvQkFDTCxZQUFZO29CQUNaLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRTtvQkFDakUsWUFBWTtvQkFDWixFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO29CQUMvRSxZQUFZO29CQUNaLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxFQUFFO29CQUMzRixZQUFZO29CQUNaO3dCQUNJLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUUsUUFBUTt3QkFDOUQsWUFBWSxFQUFFLElBQUksQ0FBQyxnQkFBZ0I7d0JBQ25DLFdBQVcsRUFBRSxVQUFVLElBQUk7NEJBQ3ZCLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDeEMsQ0FBQztxQkFDSjtpQkFDSjthQUNKLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxlQUFNLEVBQUUsQ0FBQztZQUN6QixFQUFFLENBQUMsVUFBVSxHQUFHLElBQUksdUJBQVUsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztZQUNyQixFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7WUFDeEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUF5QixFQUFFLElBQTZCO1lBQ3BGLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxNQUFNLENBQUMsZUFBZSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDMUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxLQUFLO2dCQUM5QixLQUFLLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDbkIsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsR0FBRyxDQUFDO1lBQ2xCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGdCQUFnQixDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSztnQkFDL0IsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsMkJBQTJCLENBQUM7WUFDL0MsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDNUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QixFQUFFLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7WUFDbEMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLO2dCQUMzQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEIsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDcEIsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsc0JBQXNCLENBQUM7WUFDdEMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1lBQ3BCLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQztZQUMxQixFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDL0IsRUFBRSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ3hCLEVBQUUsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQztZQUNsQyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyx1QkFBdUIsQ0FBQztZQUMzQyxFQUFFLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUs7Z0JBQy9CLElBQUksS0FBSyxHQUFHLElBQUksOEJBQWEsRUFBRSxDQUFDO2dCQUNoQyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxZQUFZLENBQUM7Z0JBQ2xDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDL0MsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDMUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzNCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxDQUFDO1FBQ0QsS0FBSyxDQUFDLE9BQU87WUFDVCxJQUFJO2dCQUNBLElBQUksSUFBSSxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtvQkFDYixJQUFJLENBQUMsTUFBTSwyQkFBWSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxLQUFLLEtBQUssRUFBRTt3QkFDbkksSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7cUJBQzFDO2lCQUNKO3FCQUNJO29CQUNELEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO2lCQUNoQzthQUNKO1lBQ0QsT0FBTyxHQUFHLEVBQUU7Z0JBQ1IsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUN0QjtRQUNMLENBQUM7UUFDRCxLQUFLLENBQUMsUUFBUTtZQUNWLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDdkYsSUFBSSxHQUFHLEdBQUcsTUFBTSwyQkFBWSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQztZQUN2RyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO2dCQUNyQixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksOEJBQWEsRUFBRSxDQUFDO2dCQUN4QyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO2dCQUNsQyxJQUFJLENBQUMsR0FBRyxJQUFJLDhCQUFhLEVBQUUsQ0FBQztnQkFDNUIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDLFFBQVEsR0FBRyxlQUFlLENBQUM7Z0JBQzdCLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQzNELElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQztnQkFDMUQsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7Z0JBQ3pDLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNqQjtRQUNMLENBQUM7UUFDRCx1QkFBdUIsQ0FBQyxJQUE2QjtZQUNqRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxFQUFFLEdBQWlDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUN0RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO1FBQzdELENBQUM7UUFDRCxXQUFXO1lBQ1AsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUMxQiwrQkFBYyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQzlDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQy9DLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELE1BQU07WUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUN6QyxJQUFJLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7WUFDL0MsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxLQUFLLENBQUMsVUFBVTtZQUNaLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSwrQkFBYyxFQUFFLENBQUM7WUFDMUMsTUFBTSxJQUFJLENBQUMsYUFBYSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDOUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDO1lBQzFELElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDbEIsQ0FBQztLQUNKLENBQUE7SUFoSkc7UUFKQyxpQkFBTyxDQUFDO1lBQ0wsSUFBSSxFQUFFLGtDQUFrQztZQUN4QyxJQUFJLEVBQUUsdUJBQXVCO1NBQ2hDLENBQUM7Ozs7NENBR0Q7SUFqQlEsZ0JBQWdCO1FBRjVCLHlCQUFlLENBQUMsdUJBQXVCLENBQUM7UUFDeEMsY0FBTSxDQUFDLDJCQUEyQixDQUFDOztPQUN2QixnQkFBZ0IsQ0ErSjVCO0lBL0pZLDRDQUFnQjtJQWdLdEIsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDO1FBQ2pDLE9BQU8sR0FBRyxDQUFDO0lBQ2YsQ0FBQztJQUhELG9CQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQm94UGFuZWwgfSBmcm9tIFwiamFzc2kvdWkvQm94UGFuZWxcIjtcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaS91aS9CdXR0b25cIjtcbmltcG9ydCB7IERhdGFiaW5kZXIgfSBmcm9tIFwiamFzc2kvdWkvRGF0YWJpbmRlclwiO1xuaW1wb3J0IHsgU2VsZWN0IH0gZnJvbSBcImphc3NpL3VpL1NlbGVjdFwiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiamFzc2kvdWkvVGFibGVcIjtcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaS9yZW1vdGUvSmFzc2lcIjtcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpL3VpL1BhbmVsXCI7XG5pbXBvcnQgeyBEYXRhYmFzZVNjaGVtYSwgRGF0YWJhc2VDbGFzcywgRGF0YWJhc2VGaWVsZCB9IGZyb20gXCJqYXNzaS9iYXNlL0RhdGFiYXNlU2NoZW1hXCI7XG5pbXBvcnQgeyBPcHRpb25EaWFsb2cgfSBmcm9tIFwiamFzc2kvdWkvT3B0aW9uRGlhbG9nXCI7XG5pbXBvcnQgeyByb3V0ZXIgfSBmcm9tIFwiamFzc2kvYmFzZS9Sb3V0ZXJcIjtcbmltcG9ydCB7ICRBY3Rpb24sICRBY3Rpb25Qcm92aWRlciB9IGZyb20gXCJqYXNzaS9iYXNlL0FjdGlvbnNcIjtcbnR5cGUgTWUgPSB7XG4gICAgdGFibGU/OiBUYWJsZTtcbiAgICBzZWxlY3Q/OiBTZWxlY3Q7XG4gICAgZGF0YWJpbmRlcj86IERhdGFiaW5kZXI7XG4gICAgbmV3Y2xhc3M/OiBCdXR0b247XG4gICAgYm94cGFuZWwxPzogQm94UGFuZWw7XG4gICAgc2F2ZT86IEJ1dHRvbjtcbiAgICBib3hwYW5lbDI/OiBCb3hQYW5lbDtcbiAgICBuZXdmaWVsZD86IEJ1dHRvbjtcbn07XG52YXIgdHR0ID0gMTtcbkAkQWN0aW9uUHJvdmlkZXIoXCJqYXNzaS5iYXNlLkFjdGlvbk5vZGVcIilcbkAkQ2xhc3MoXCJqYXNzaS91aS9EYXRhYmFzZURlc2lnbmVyXCIpXG5leHBvcnQgY2xhc3MgRGF0YWJhc2VEZXNpZ25lciBleHRlbmRzIFBhbmVsIHtcbiAgICBtZTogTWU7XG4gICAgY3VycmVudFNjaGVtYTogRGF0YWJhc2VTY2hlbWE7XG4gICAgY3VycmVudENsYXNzOiBEYXRhYmFzZUNsYXNzO1xuICAgIGFsbFR5cGVzID0geyB2YWx1ZXM6IFtcIlwiXSB9O1xuICAgIHBvc2libGVSZWxhdGlvbnMgPSB7IHZhbHVlczogW1wiXCJdIH07XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMubWUgPSB7fTtcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XG4gICAgfVxuICAgIEAkQWN0aW9uKHtcbiAgICAgICAgbmFtZTogXCJBZG1pbmlzdHJhdGlvbi9EYXRhYmFzZSBEZXNpZ25lclwiLFxuICAgICAgICBpY29uOiBcIm1kaSBtZGktZGF0YWJhc2UtZWRpdFwiLFxuICAgIH0pXG4gICAgc3RhdGljIGFzeW5jIHNob3dEaWFsb2coKSB7XG4gICAgICAgIHJvdXRlci5uYXZpZ2F0ZShcIiNkbz1qYXNzaS91aS9EYXRhYmFzZURlc2lnbmVyXCIpO1xuICAgIH1cbiAgICBsYXlvdXQobWU6IE1lKSB7XG4gICAgICAgIG1lLm5ld2NsYXNzID0gbmV3IEJ1dHRvbigpO1xuICAgICAgICBtZS5ib3hwYW5lbDEgPSBuZXcgQm94UGFuZWwoKTtcbiAgICAgICAgbWUuc2F2ZSA9IG5ldyBCdXR0b24oKTtcbiAgICAgICAgbWUuYm94cGFuZWwyID0gbmV3IEJveFBhbmVsKGZhbHNlKTtcbiAgICAgICAgbWUubmV3ZmllbGQgPSBuZXcgQnV0dG9uKCk7XG4gICAgICAgIG1lLmJveHBhbmVsMS5ob3Jpem9udGFsID0gdHJ1ZTtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHh4eCA9IDA7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7IHZhbHVlczogW1wiaGFsbFwiLCBcImR1XCJdIH07XG4gICAgICAgIG1lLnRhYmxlID0gbmV3IFRhYmxlKHtcbiAgICAgICAgICAgIGF1dG9Db2x1bW5zOiBmYWxzZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IFtcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB7IHRpdGxlOiBcIm5hbWVcIiwgZmllbGQ6IFwibmFtZVwiLCBlZGl0b3I6IFwiaW5wdXRcIiwgZWRpdGFibGU6IHRydWUgfSxcbiAgICAgICAgICAgICAgICAvL0B0cy1pZ25vcmVcbiAgICAgICAgICAgICAgICB7IHRpdGxlOiBcInR5cGVcIiwgZmllbGQ6IFwidHlwZVwiLCBlZGl0b3I6IFwic2VsZWN0XCIsIGVkaXRvclBhcmFtczogdGhpcy5hbGxUeXBlcyB9LFxuICAgICAgICAgICAgICAgIC8vQHRzLWlnbm9yZVxuICAgICAgICAgICAgICAgIHsgdGl0bGU6IFwibnVsbGFibGVcIiwgZmllbGQ6IFwibnVsbGFibGVcIiwgZWRpdG9yOiBcInRpY2tcIiwgZWRpdG9yUGFyYW1zOiB7IHRyaXN0YXRlOiBmYWxzZSB9IH0sXG4gICAgICAgICAgICAgICAgLy9AdHMtaWdub3JlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0aXRsZTogXCJyZWxhdGlvbmluZm9cIiwgZmllbGQ6IFwicmVsYXRpb25pbmZvXCIsIGVkaXRvcjogXCJzZWxlY3RcIixcbiAgICAgICAgICAgICAgICAgICAgZWRpdG9yUGFyYW1zOiB0aGlzLnBvc2libGVSZWxhdGlvbnMsXG4gICAgICAgICAgICAgICAgICAgIGNlbGxFZGl0aW5nOiBmdW5jdGlvbiAoY2VsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudXBkYXRlUG9zc2libGVSZWxhdGlvbnMoY2VsbCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pO1xuICAgICAgICBtZS5zZWxlY3QgPSBuZXcgU2VsZWN0KCk7XG4gICAgICAgIG1lLmRhdGFiaW5kZXIgPSBuZXcgRGF0YWJpbmRlcigpO1xuICAgICAgICB0aGlzLmFkZChtZS5kYXRhYmluZGVyKTtcbiAgICAgICAgbWUudGFibGUud2lkdGggPSA1NjU7XG4gICAgICAgIG1lLnRhYmxlLmhlaWdodCA9IFwiMzAwXCI7XG4gICAgICAgIG1lLnRhYmxlLm9uY2hhbmdlKGZ1bmN0aW9uIChldmVudD86IEpRdWVyeUV2ZW50T2JqZWN0LCBkYXRhPzogVGFidWxhdG9yLlJvd0NvbXBvbmVudCkge1xuICAgICAgICB9KTtcbiAgICAgICAgbWUuc2VsZWN0LmRpc3BsYXkgPSBcIm5hbWVcIjtcbiAgICAgICAgbWUuc2VsZWN0LnNlbGVjdENvbXBvbmVudCA9IG1lLmRhdGFiaW5kZXI7XG4gICAgICAgIG1lLnNlbGVjdC5vbmNoYW5nZShmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWUuc2VsZWN0LndpZHRoID0gMjEwO1xuICAgICAgICB0aGlzLnJlYWRTY2hlbWEoKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IDcxOTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAzODY7XG4gICAgICAgIHRoaXMuYWRkKG1lLmJveHBhbmVsMSk7XG4gICAgICAgIHRoaXMuYWRkKG1lLmJveHBhbmVsMik7XG4gICAgICAgIG1lLm5ld2NsYXNzLnRleHQgPSBcIkNyZWF0ZSBEQkNsYXNzXCI7XG4gICAgICAgIG1lLm5ld2NsYXNzLm9uY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5uZXdDbGFzcygpO1xuICAgICAgICB9KTtcbiAgICAgICAgbWUubmV3Y2xhc3MuaWNvbiA9IFwibWRpIG1kaS1ub3RlLXBsdXMtb3V0bGluZVwiO1xuICAgICAgICBtZS5uZXdjbGFzcy50b29sdGlwID0gXCJuZXcgREJDbGFzc1wiO1xuICAgICAgICBtZS5uZXdjbGFzcy53aWR0aCA9IFwiMTUwXCI7XG4gICAgICAgIG1lLmJveHBhbmVsMS5hZGQobWUuc2VsZWN0KTtcbiAgICAgICAgbWUuYm94cGFuZWwxLndpZHRoID0gMzY1O1xuICAgICAgICBtZS5ib3hwYW5lbDEuYWRkKG1lLm5ld2NsYXNzKTtcbiAgICAgICAgbWUuYm94cGFuZWwxLmFkZChtZS5zYXZlKTtcbiAgICAgICAgbWUuc2F2ZS50ZXh0ID0gXCJTYXZlIGFsbCBDbGFzc2VzXCI7XG4gICAgICAgIG1lLnNhdmUub25jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIF90aGlzLnNhdmVBbGwoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIG1lLnNhdmUud2lkdGggPSAxNTA7XG4gICAgICAgIG1lLnNhdmUuaWNvbiA9IFwibWRpIG1kaS1jb250ZW50LXNhdmVcIjtcbiAgICAgICAgbWUuc2F2ZS53aWR0aCA9IDE4MDtcbiAgICAgICAgbWUuYm94cGFuZWwyLmhlaWdodCA9IDExNTtcbiAgICAgICAgbWUuYm94cGFuZWwyLmhvcml6b250YWwgPSB0cnVlO1xuICAgICAgICBtZS5ib3hwYW5lbDIud2lkdGggPSA1MDtcbiAgICAgICAgbWUubmV3ZmllbGQudGV4dCA9IFwiQ3JlYXRlIEZpZWxkXCI7XG4gICAgICAgIG1lLm5ld2ZpZWxkLmljb24gPSBcIm1kaSBtZGktcGxheWxpc3QtcGx1c1wiO1xuICAgICAgICBtZS5uZXdmaWVsZC5vbmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgdmFyIGZpZWxkID0gbmV3IERhdGFiYXNlRmllbGQoKTtcbiAgICAgICAgICAgIGZpZWxkLnBhcmVudCA9IF90aGlzLmN1cnJlbnRDbGFzcztcbiAgICAgICAgICAgIF90aGlzLmN1cnJlbnRDbGFzcy5maWVsZHMucHVzaChmaWVsZCk7XG4gICAgICAgICAgICBtZS50YWJsZS5pdGVtcyA9IF90aGlzLmN1cnJlbnRDbGFzcy5maWVsZHM7XG4gICAgICAgIH0pO1xuICAgICAgICBtZS5uZXdmaWVsZC53aWR0aCA9IFwiMTQwXCI7XG4gICAgICAgIG1lLmJveHBhbmVsMi5hZGQobWUudGFibGUpO1xuICAgICAgICBtZS5ib3hwYW5lbDIuYWRkKG1lLm5ld2ZpZWxkKTtcbiAgICB9XG4gICAgYXN5bmMgc2F2ZUFsbCgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gYXdhaXQgdGhpcy5jdXJyZW50U2NoZW1hLnVwZGF0ZVNjaGVtYSh0cnVlKTtcbiAgICAgICAgICAgIGlmICh0ZXh0ICE9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgaWYgKChhd2FpdCBPcHRpb25EaWFsb2cuc2hvdyhcIkRvIHlvdSB3b24ndCB0aGlzIGNoYW5nZXM/PGJyLz5cIiArIHRleHQucmVwbGFjZUFsbChcIlxcblwiLCBcIjxici8+XCIpLCBbXCJZZXNcIiwgXCJDYW5jZWxcIl0pKS5idXR0b24gPT09IFwiWWVzXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U2NoZW1hLnVwZGF0ZVNjaGVtYShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJubyBjaGFuZ2VzIGRldGVjdGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGFsZXJ0KGVyci5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc3luYyBuZXdDbGFzcygpIHtcbiAgICAgICAgdmFyIHN1YiA9IHRoaXMuY3VycmVudENsYXNzLm5hbWUuc3Vic3RyaW5nKDAsIHRoaXMuY3VycmVudENsYXNzLm5hbWUubGFzdEluZGV4T2YoXCIuXCIpKTtcbiAgICAgICAgdmFyIHJlcyA9IGF3YWl0IE9wdGlvbkRpYWxvZy5zaG93KFwiRW50ZXIgY2xhc3NuYW1lXCIsIFtcIk9LXCIsIFwiQ2FuY2VsXCJdLCB1bmRlZmluZWQsIHRydWUsIHN1YiArIFwiLk15T2JcIik7XG4gICAgICAgIGlmIChyZXMuYnV0dG9uID09PSBcIk9LXCIpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENsYXNzID0gbmV3IERhdGFiYXNlQ2xhc3MoKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENsYXNzLm5hbWUgPSByZXMudGV4dDtcbiAgICAgICAgICAgIHZhciBmID0gbmV3IERhdGFiYXNlRmllbGQoKTtcbiAgICAgICAgICAgIGYubmFtZSA9IFwiaWRcIjtcbiAgICAgICAgICAgIGYudHlwZSA9IFwiaW50XCI7XG4gICAgICAgICAgICBmLnJlbGF0aW9uID0gXCJQcmltYXJ5Q29sdW1uXCI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRDbGFzcy5maWVsZHMgPSBbZl07XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTY2hlbWEuZGF0YWJhc2VDbGFzc2VzLnB1c2godGhpcy5jdXJyZW50Q2xhc3MpO1xuICAgICAgICAgICAgdGhpcy5tZS5zZWxlY3QuaXRlbXMgPSB0aGlzLmN1cnJlbnRTY2hlbWEuZGF0YWJhc2VDbGFzc2VzO1xuICAgICAgICAgICAgdGhpcy5tZS5zZWxlY3QudmFsdWUgPSB0aGlzLmN1cnJlbnRDbGFzcztcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdXBkYXRlUG9zc2libGVSZWxhdGlvbnMoY2VsbDogVGFidWxhdG9yLkNlbGxDb21wb25lbnQpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdmFyIHRwOiBEYXRhYmFzZUZpZWxkID0gPERhdGFiYXNlRmllbGQ+Y2VsbC5nZXREYXRhKCk7XG4gICAgICAgIHRoaXMucG9zaWJsZVJlbGF0aW9ucy52YWx1ZXMgPSB0cC5nZXRQb3NzaWJsZVJlbGF0aW9ucygpO1xuICAgIH1cbiAgICB1cGRhdGVUeXBlcygpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5hbGxUeXBlcy52YWx1ZXMgPSBbXTtcbiAgICAgICAgRGF0YWJhc2VTY2hlbWEuYmFzaWNkYXRhdHlwZXMuZm9yRWFjaCgoZSkgPT4ge1xuICAgICAgICAgICAgX3RoaXMuYWxsVHlwZXMudmFsdWVzLnB1c2goZSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmN1cnJlbnRTY2hlbWEuZGF0YWJhc2VDbGFzc2VzLmZvckVhY2goKGNsKSA9PiB7XG4gICAgICAgICAgICBfdGhpcy5hbGxUeXBlcy52YWx1ZXMucHVzaChjbC5uYW1lKTtcbiAgICAgICAgICAgIF90aGlzLmFsbFR5cGVzLnZhbHVlcy5wdXNoKGNsLm5hbWUgKyBcIltdXCIpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdXBkYXRlKCkge1xuICAgICAgICB0aGlzLmN1cnJlbnRDbGFzcyA9IHRoaXMubWUuc2VsZWN0LnZhbHVlO1xuICAgICAgICB0aGlzLm1lLnRhYmxlLml0ZW1zID0gdGhpcy5jdXJyZW50Q2xhc3MuZmllbGRzO1xuICAgICAgICB0aGlzLnVwZGF0ZVR5cGVzKCk7XG4gICAgfVxuICAgIGFzeW5jIHJlYWRTY2hlbWEoKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNjaGVtYSA9IG5ldyBEYXRhYmFzZVNjaGVtYSgpO1xuICAgICAgICBhd2FpdCB0aGlzLmN1cnJlbnRTY2hlbWEubG9hZFNjaGVtYUZyb21Db2RlKCk7XG4gICAgICAgIHRoaXMubWUuc2VsZWN0Lml0ZW1zID0gdGhpcy5jdXJyZW50U2NoZW1hLmRhdGFiYXNlQ2xhc3NlcztcbiAgICAgICAgdGhpcy5tZS5zZWxlY3QudmFsdWUgPSB0aGlzLmN1cnJlbnRTY2hlbWEuZGF0YWJhc2VDbGFzc2VzWzBdO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH1cbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICAgIHZhciByZXQgPSBuZXcgRGF0YWJhc2VEZXNpZ25lcigpO1xuICAgIHJldHVybiByZXQ7XG59XG4iXX0=