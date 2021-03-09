import jassi, { $Class } from "jassi/remote/Jassi";
import {Panel} from "jassi/ui/Panel";
import {Table} from "jassi/ui/Table";
import {HTMLPanel} from "jassi/ui/HTMLPanel";
import {Repeater} from "jassi/ui/Repeater";
import {Button} from "jassi/ui/Button";
import {BoxPanel} from "jassi/ui/BoxPanel";
import {Select} from "jassi/ui/Select";
import { classes } from "jassi/remote/Classes";
import { $Action, $ActionProvider } from "jassi/base/Actions";
import { router } from "jassi/base/Router";

class Me {
    IDText? : HTMLPanel;
    boxpanel1? : BoxPanel;
    IDUpdate? : Button;
    IDClear ?: Button;
    IDTable?:Table;
    IDTest?:Button;
}
@$ActionProvider("jassi.base.ActionNode")
@$Class("jassi.ui.ComponentSpy")
export class ComponentSpy extends Panel {
    ids;
    labelids;
    me:Me;
    constructor() {
        super();
        this.ids = {};
        this.labelids = {};
        this.layout();
    }
    @$Action ({
        name: "Administration/Spy Components",
        icon: "mdi mdi-police-badge",
    })
    static async showDialog() {
        router.navigate("#do=jassi.ui.ComponentSpy");
    }
    layout() {
        var me:Me = this.me = {};

        me.IDText = new HTMLPanel();
        var _this = this;
        me.boxpanel1 = new BoxPanel();
        me.IDUpdate = new Button();
        me.IDClear = new Button();
        me.IDTable = new Table();
        me.IDTest = new Button();
        this.add(me.boxpanel1);
        this.add(me.IDTable);
        this.add(me.IDText);
        me.boxpanel1.add(me.IDUpdate);
        me.boxpanel1.add(me.IDClear);
        me.boxpanel1.add(me.IDTest);
        me.boxpanel1.horizontal = false;
        me.IDClear.text = "clear";
        me.IDUpdate.text = "update";
        me.IDUpdate.onclick(function (event) {
            _this.update();
        });
        me.IDClear.onclick(function (event) {
            _this.clear();
        });
        me.IDTest.onclick(function (event) {
            var sel = new Select();
            sel.destroy();
        });
        me.IDUpdate.text = "Update";
        me.IDTable.width = "100%";
        me.IDTable.height = "400";
       
        me.IDTable.onchange(function (ob) {
            me.IDText.value = ob.data.stack.replaceAll("\n", "<br>");
        });
    }
    update() {
        var data = [];
        for (var k in jassi.componentSpy.ids) {
            data.push(jassi.componentSpy.ids[k]);
        }
        this.me.IDTable.items = data;
    }
    clear() {
        jassi.componentSpy.ids = {};
        jassi.componentSpy.labelids = {};
        this.update();
    }

    watch(component) {
    
    		
            var ob = {
                type: classes.getClassName(component),
                id: component._id,
                labelid: component.domWrapper === undefined ? 0 : component.domWrapper._id,
                stack: new Error().stack
            }
            this.ids[ob.id] = ob
            this.labelids[ob.labelid] = ob;
        
    }
    stack(id) {
        var test = this.ids[id];
        if (test === undefined)
            test = this.labelids[id];
        if (test !== undefined)
            return test.stack;
        else
            return "empty";
    }
    unwatch(component) {
        var ob = this.ids[component._id];
        if (ob !== undefined) {
            delete this.ids[ob.id];
            delete this.labelids[ob.labelid];
        }
    }
    list() {
        var test = ["jj", "kkk"];
        return test;
    }
    destroy() {
        super.destroy();
    }
}
jassi.test = function () {
    return new ComponentSpy();
}
jassi.componentSpy = new ComponentSpy();
