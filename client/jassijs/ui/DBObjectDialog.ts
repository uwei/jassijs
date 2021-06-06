import { Button } from "jassijs/ui/Button";
import { Table } from "jassijs/ui/Table";
import { $Class } from "jassijs/remote/Jassi";
import { Panel } from "jassijs/ui/Panel";
import registry from "jassijs/remote/Registry";
import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { classes } from "jassijs/remote/Classes";
import { Component } from "jassijs/ui/Component";
import { DBObjectView, DBObjectViewProperties } from "jassijs/ui/DBObjectView";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $ActionProvider, $Actions, ActionProperties } from "jassijs/base/Actions";
import windows from "jassijs/base/Windows";
type Me = {
    splitpanel1?: BoxPanel;
    IDDBView?: Panel;
    table1?: Table;
};
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs.ui.DBObjectDialog")
export class DBObjectDialog extends Panel {
    me: Me;
    private _dbclassname: string;
    view: DBObjectView;
    data: DBObject[];
    constructor() {
        super();
        this.me = {};
        this.layout(this.me);
    }
    layout(me: Me) {
        me.splitpanel1 = new BoxPanel();
        me.IDDBView = new Panel();

        me.table1 = new Table();
        me.table1.height = "calc(100% - 300px)";
        me.table1.width = "calc(100% - 50px)";
        me.splitpanel1.add(me.IDDBView);
        me.splitpanel1.spliter = [70, 30];
        me.splitpanel1.height = "100%";
        me.splitpanel1.horizontal = false;
        //	me.splitpanel1.width=910;
        me.splitpanel1.add(me.table1);
        this.add(me.splitpanel1);
        //    me.table1.height = "150";
    }
    /**
     * set the DBObject-classname to show in this dialog
     **/
    set dbclassname(classname: string) {
        this._dbclassname = classname;
        this.update();
    }
    get dbclassname(): string {
        return this._dbclassname;
    }
    async update() {
        //DBTable
        var cl = await classes.loadClass(this._dbclassname);
        var _this = this;
        //@ts-ignore
        this.data = await cl.find();
        this.me.table1.items = this.data;
        //DBView
        var data = await registry.getJSONData("$DBObjectView");
        for (var x = 0; x < data.length; x++) {
            var param: DBObjectViewProperties = data[x].params[0];
            if (param.classname === this.dbclassname) {
                var cl = await classes.loadClass(data[x].classname);
                this.me.IDDBView.removeAll();
                this.view = new cl();

                this.me.IDDBView.add(this.view);
                //@ts-ignore
                this.view.value = this.data.length > 0 ? this.data[0] : undefined;
                this.view.onrefreshed(() => {
                    _this.me.table1.update();
                });
                this.view.onsaved((obj: DBObject) => {
                    var all = _this.me.table1.items;
                    if (all.indexOf(obj) === -1) {
                        all.push(obj);
                        _this.me.table1.items = _this.me.table1.items;
                        _this.me.table1.value = obj;
                        _this.me.table1.update();
                    }
                    else
                        _this.me.table1.update();
                });
                this.view.ondeleted((obj: DBObject) => {
                    var all = _this.me.table1.items;
                    var pos = all.indexOf(obj);
                    if (pos >= 0)
                        all.splice(pos, 1);
                    _this.me.table1.items = all;
                    //select prev element
                    while (pos !== 0 && pos > all.length - 1) {
                        pos--;
                    }
                    if (pos >= 0) {
                        _this.me.table1.value = all[pos];
                        _this.view.value = all[pos];
                    }
                    _this.me.table1.update();
                });
                this.me.table1.selectComponent = this.view;
            }
        }
    }
    private static createFunction(classname: string):any {
        return function () {
            var ret = new DBObjectDialog();
            ret.dbclassname = classname;
            ret.height = "100%";
            windows.add(ret, classname);
        }
    }
    /**
     * create Action for all DBObjectView with actionname is defined
     */
    @$Actions()
    private static async createAcions(): Promise<ActionProperties[]> {
        var ret: ActionProperties[] = [];
        var data = await registry.getJSONData("$DBObjectView");
        for (var x = 0; x < data.length; x++) {
            var param: DBObjectViewProperties = data[x].params[0];
            if (param.actionname) {
                ret.push({
                    name: param.actionname,
                    icon: param.icon,
                    run: this.createFunction(param.classname)
                })
            }
        }
        return ret;
    }
    static async createFor(classname: string) {
        var ret = new DBObjectDialog();
        ret.height = 400;
        ret.dbclassname = classname;
        /*	setimeout(()=>{
         //	ret.height="100%";
         //	ret.me.splitpanel1.refresh();
         },1000);*/
        return ret;
    }
}
export async function test() {
    //var ret = await DBObjectDialog.createFor("jassijs.security.User");
    var ret = await DBObjectDialog.createFor("northwind.Customer");
    return ret;
}
