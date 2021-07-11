import jassijs, { $Class } from "jassijs/remote/Jassi";
import {Panel} from "jassijs/ui/Panel";
import {Table} from "jassijs/ui/Table";
import {HTMLPanel} from "jassijs/ui/HTMLPanel";
import {Repeater} from "jassijs/ui/Repeater";
import {Button} from "jassijs/ui/Button";
import {BoxPanel} from "jassijs/ui/BoxPanel";
import {Select} from "jassijs/ui/Select";
import { classes } from "jassijs/remote/Classes";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import { router } from "jassijs/base/Router";
import { ErrorPanel } from "jassijs/ui/ErrorPanel";

class Me {
    IDText? : ErrorPanel;
    boxpanel1? : BoxPanel;
    IDUpdate? : Button;
    IDClear ?: Button;
    IDTable?:Table;
    IDTest?:Button;
}
@$ActionProvider("jassijs.base.ActionNode")
@$Class("jassijs.ui.ComponentSpy")
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
        router.navigate("#do=jassijs.ui.ComponentSpy");
    }
    layout() {
        var me:Me = this.me = {};

        me.IDText = new  ErrorPanel();//HTMLPanel();
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
            me.IDText.addError({error:ob.data});//.stack.replaceAll("\n", "<br>");
        });
    }
    update() {
        var data = [];
        for (var k in jassijs.componentSpy.ids) {
            data.push(jassijs.componentSpy.ids[k]);
        }
        this.me.IDTable.items = data;
    }
    clear() {
        jassijs.componentSpy.ids = {};
        jassijs.componentSpy.labelids = {};
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
export function test() {
    var sp=new ComponentSpy();
    sp.update();
    sp.height=100;
    return sp;
}
jassijs.componentSpy = new ComponentSpy();
