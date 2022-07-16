import { ContextMenu } from "jassijs/ui/ContextMenu";
import { Table } from "jassijs/ui/Table";
import registry, { $Class } from "jassijs/remote/Registry";
import { Panel } from "jassijs/ui/Panel";
import { router } from "jassijs/base/Router";
import { classes } from "jassijs/remote/Classes";
import { Report } from "jassijs_report/Report";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
type Me = {
    table?: Table; 
    contextmenu?: ContextMenu;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs_report/Reports")
export class Reports extends Panel {
    me: Me;
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.table = new Table();
        me.contextmenu = new ContextMenu();
        this.config({
            children: [
                me.table.config({
                    width: "100%",
                    //height: "100%",
                    showSearchbox: true,
                    contextMenu: me.contextmenu
                    
                }),
                me.contextmenu.config({})
            ],
        });
        this.setData();
        me.contextmenu.getActions = async function (obs) {
            var ret = [];
            ret.push({
                name: "View", call: async function (data) {
                    var clname = data[0].classname;
                    var Cl = await classes.loadClass(clname);
                    var report: Report = new Cl();
                    report.view();
                    //await (<Report> new Cl()).open();
                }
            });
            ret.push({
                name: "Reportdesign", call: function (data) {
                    var file = data[0].filename;
                    router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                }
            });
            if (obs[0].serverPath) {
                ret.push({
                    name: "Reportdesign (Server)", call: function (data) {
                        var file = "$serverside/" + data[0].serverPath + ".ts";
                        router.navigate("#do=jassijs_editor.CodeEditor&file=" + file.replaceAll("|", "/"));
                    }
                });
            }
            return ret;
        };
    }
    async setData() {
        var data = [];
        var _this=this;
        var reports = await registry.getJSONData("$Report");
        for (var x = 0; x < reports.length; x++) {
            var rep = reports[x];
            var entry: ReportEntry = {
                name: rep.params[0].name,
                classname: rep.classname,
                serverPath: rep.params[0].serverReportPath,
                filename: rep.filename
            };
            data.push(entry);
        }
        setTimeout(()=>{
            _this.me.table.items=data;
        },100);
    }
    @$Action({
        name: "Tools/Reports",
        icon: "mdi mdi-chart-box-outline",
    })
    static async show() {
        windows.add(new Reports(), "Reports");
    }
}
class ReportEntry {
    classname: string;
    name: string;
    serverPath?: string;
    filename: string;
}
export async function test() {
    var ret = new Reports();
    return ret;
}
