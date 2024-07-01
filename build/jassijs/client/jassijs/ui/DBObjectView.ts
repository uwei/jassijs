import { Button } from "jassijs/ui/Button";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import { $Class } from "jassijs/remote/Registry";
import { Panel, PanelProperties } from "jassijs/ui/Panel";
import { Databinder } from "jassijs/ui/Databinder";
import { $UIComponent, ComponentProperties } from "jassijs/ui/Component";
import registry from "jassijs/remote/Registry";
import { classes } from "jassijs/remote/Classes";
import { DBObject } from "jassijs/remote/DBObject";
import { $Property } from "jassijs/ui/Property";
import { $ActionProvider, ActionProperties } from "jassijs/base/Actions";
import { notify } from "jassijs/ui/Notify";

export type DBObjectViewMe = {
    databinder?: Databinder,
    create?: Button,
    main?: Panel,
    toolbar?: BoxPanel,
    save?: Button,
    remove?: Button,
    refresh?: Button
}
export class DBObjectViewProperties {
    /**
     * full path to classifiy the UIComponent e.g common/TopComponent 
     */
    classname: string;
    actionname?: string;
    icon?: string;
    queryname?:string;
}
export function $DBObjectView(properties: DBObjectViewProperties): Function {
    return function (pclass) {
        registry.register("$DBObjectView", pclass, properties);
    }
}
type Me = DBObjectViewMe;

export interface DBObjectViewConfig extends PanelProperties {
    /**
       * register an event if the object is created
       * @param {function} handler - the function that is called
       */
    oncreated?(handler: (obj: DBObject) => void);
    /**
    * register an event if the object is saved
    * @param {function} handler - the function that is called
    */
    onsaved?(handler: (obj: DBObject) => void);
    /**
     * register an event if the object is refreshed
     * @param {function} handler - the function that is called
     */
    onrefreshed?(handler: (obj: DBObject) => void);
    /**
    * register an event if the object is deleted
    * @param {function} handler - the function that is called
    */
    ondeleted?(handler: (obj: DBObject) => void);
    value:any;
}
//@$UIComponent({ editableChildComponents: ["this", "me.main", "me.toolbar", "me.save", "me.remove", "me.refresh", "me.databinder"] })
@$Class("jassijs/ui/DBObjectView")
export class DBObjectView extends Panel implements Omit<DBObjectViewConfig, "isAbsolute"> {
    me;
    value;
    constructor() {
        super();
        this.me = {};
        this.dom.classList.add("designerNoResizable");//this should not be resized only me.main
        //everytime call super.layout
        DBObjectView.prototype.layout.bind(this)(this.me);
        // this.layout(this.me);
    }
    config(config: DBObjectViewConfig): DBObjectView {
        super.config(config);
        return this;
    }
    protected _setDesignMode(enable) {
        //no Icons to add Components in designer
    }
    /**
     * create a new object
     */
    createObject(): any {
        var clname = registry.getData("$DBObjectView", classes.getClassName(this))[0].params[0].classname;
        var cl = classes.getClass(clname);
        this["value"] = new cl();
        this.callEvent("created", this["value"]);
        return this["value"];
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    oncreated(handler: (obj: DBObject) => void) {
        this.addEvent("created", handler);
    }
    private async doSave(ob) {
        var obj = await ob.save()
        this["value"] = typeof obj === "object" ? obj : ob;
        this.callEvent("saved", ob);

    }

    /**
     * saves the object
     */
    async saveObject() {
        var ob = await this.me.databinder.fromForm();
        if(ob!==undefined){
            await this.doSave(ob);
            notify("saved","info");
        }
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onsaved(handler: (obj: DBObject) => void) {
        this.addEvent("saved", handler);
    }
    /**
     * refresh the object
     */
    refreshObject() {
        this.me.databinder.toForm(this["value"]);
        this.callEvent("refreshed", this["value"]);
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    onrefreshed(handler: (obj: DBObject) => void) {
        this.addEvent("refreshed", handler);
    }
    /**
     * deletes Object
     **/
    deleteObject() {
        var ob: DBObject = <DBObject>this.me.databinder.fromForm();
        if(ob===undefined)
            return;
        ob.remove();

        //set obj to null
        var clname = registry.getData("$DBObjectView", classes.getClassName(this))[0].params[0].classname;
        var cl = classes.getClass(clname);
        this["value"] = new cl();
        this.callEvent("deleted", ob);
    }
    @$Property({ default: "function(obj?/*: DBObject*/){\n\t\n}" })
    ondeleted(handler: (obj: DBObject) => void) {
        this.addEvent("deleted", handler);
    }

    layout(me: Me) {
        var _this = this;
        me.toolbar = new BoxPanel();
        me.save = new Button();
        me.remove = new Button();
        me.refresh = new Button();
        me.create = new Button();
        me.databinder = new Databinder();
        me.main = new Panel();
        me.databinder.definePropertyFor(this, "value");
        this.add(me.toolbar);
        this.add(me.main);
        me.main.width = "100%";
        me.main.height = "100%";
        me.main.style = { position: "relative" };
        me.toolbar.add(me.create);
        me.toolbar.add(me.save);
        me.toolbar.horizontal = true;
        me.toolbar.add(me.refresh);
        me.toolbar.add(me.remove);
        me.save.text = "";
        me.save.tooltip = "save";
        me.save.icon = "mdi mdi-content-save";
        me.save.onclick(function (event) {
            _this.saveObject();
        });
        me.remove.text = "";
        me.remove.icon = "mdi mdi-delete";
        me.remove.onclick(function (event) {
            _this.deleteObject();
        });
        me.remove.tooltip = "remove";
        me.refresh.text = "";
        me.refresh.icon = "mdi mdi-refresh";
        me.refresh.onclick(function (event) {
            _this.refreshObject();
        });
        me.refresh.tooltip = "refresh";
        me.create.text = "";
        me.create.icon = "mdi mdi-tooltip-plus-outline";

        me.create.onclick(function (event) {
            _this.createObject();
            //me.binder.toForm();
        });

        me.create.tooltip = "new";

    }
}

export async function test() {
    var ret = new DBObjectView();
    return ret;
}