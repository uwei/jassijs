import "jassijs/ext/jquerylib";
import { $Class } from "jassijs/remote/Registry";
import { Table } from "jassijs/ui/Table";
import { Panel } from "jassijs/ui/Panel";
import { Button, ButtonProperties } from "jassijs/ui/Button";
import { Textbox } from "jassijs/ui/Textbox";
import {  $Property } from "jassijs/ui/Property";
import { $UIComponent } from "jassijs/ui/Component";
import { classes } from "jassijs/remote/Classes";
import { DataComponentProperties } from "jassijs/ui/DataComponent";
import { BoundProperty } from "jassijs/ui/State";
import { StateDatabinder } from "jassijs/ui/StateBinder";
/*
https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
*/
class Me {
    IDTable?: Table;
    IDPanel?: Panel;
    IDCancel?: Button;
    IDSearch?: Textbox;
    IDOK?: Button;
}
export interface ObjectChooserProperties extends ButtonProperties {
    dialogHeight?: number;
    dialogWidth?: number;
    /**
     * @member {object} value - selection of the component
     */
    value?: any;
    /**
     * @member {string} items - the items to select or  the classname to generate the items
     */
    items?: string | any[];
    /**
* called if value has changed
* @param {function} handler - the function which is executed
*/
    onchange?(handler);
    /**
     * @member {bool} autocommit -  if true the databinder will update the value on every change
     *                              if false the databinder will update the value on databinder.toForm
     */
    autocommit?: boolean;
    /**
       * binds a component to a databinder
       * @param [{jassijs.ui.Databinder} databinder - the databinder to bind,
       *         {string} property - the property to bind]
       */
    bind?: any[] | BoundProperty;
}
@$UIComponent({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" })
@$Class("jassijs.ui.ObjectChooser")
export class ObjectChooser<T extends ObjectChooserProperties = ObjectChooserProperties> extends Button<T> implements ObjectChooserProperties, DataComponentProperties {
    @$Property({ default: 450 })
    dialogHeight: number;
    @$Property({ default: 300 })
    dialogWidth: number;
    _items;
    me: Me;
    _autocommit: boolean;
    _databinder: StateDatabinder;
    constructor(props: ObjectChooserProperties = {}) {
        super(props);
        /**
        * @member {number} - the height of the dialog
        */
        this.dialogHeight = 300;
        /**
        * @member {number} - the width of the dialog
        */
        this.dialogWidth = 450;
        this.layout();
    }
    config(config: T): ObjectChooser<T> {
        super.config(config);
        return this;
    }
    get title() {
        return "Select";
    }
    layout() {
        var me: Me = this.me = {};
        var _this = this;
        this.autocommit = true;
        this.text = "";
        this.onclick(function (event) {
            if (_this.value !== undefined) {
                me.IDTable.value = _this.value;
            }
            var dlg = $(me.IDPanel.dom).dialog({
                width: _this.dialogWidth,
                height: _this.dialogHeight,
                modal: true
                /*beforeClose: function(event, ui) {
                   
                } */
            });
            if (me.IDTable.table.getSelectedRows().length > 0)
                me.IDTable.table.scrollToRow(me.IDTable.table.getSelectedRows()[0]);
            _this.callEvent("showDialog", event);
        });
        this.icon = "mdi mdi-glasses";
        this.width = 29;
        this.height = 21;
        me.IDPanel = new Panel();
        me.IDCancel = new Button();
        var _this = this;
        me.IDSearch = new Textbox();
        me.IDOK = new Button();
        me.IDTable = new Table();
        me.IDPanel.add(me.IDSearch);
        me.IDPanel.add(me.IDOK);
        me.IDPanel.add(me.IDCancel);
        me.IDPanel.add(me.IDTable);
        me.IDOK.width = 65;
        me.IDOK.text = "OK";
        me.IDSearch.width = "calc(100% - 132px)";
        me.IDOK.onclick(function (event) {
            _this.ok();
        });
        //me.IDSearch.width = "calc (100% - 300px)";
        me.IDSearch.oninput(function (event) {
            me.IDTable.search("all", me.IDSearch.value, true);
        });
        me.IDTable.dom.addEventListener("dblclick", function (data) {
            setTimeout(() => { _this.ok(); }, 200);
        });
        me.IDSearch.onkeydown(function (event) {
            if (event.keyCode == 13) {
                _this.ok();
                return false;
            }
            if (event.keyCode == 27) {
                _this.cancel();
                return false;
            }
        });
        me.IDSearch.height = 15;
        me.IDTable.width = "100%";
        me.IDTable.height = "calc(100% - 38px)";
        setTimeout(() => { me.IDSearch.focus(); }, 200);
        setTimeout(() => { me.IDSearch.focus(); }, 1000);
        me.IDCancel.onclick(function (event) {
            _this.cancel();
        });
        me.IDCancel.width = 65;
        me.IDCancel.text = "Cancel";
        me.IDPanel.height = "100%";
        me.IDPanel.width = "100%";
    }
    ok() {
        var me = this.me;
        this.value = me.IDTable.value;
        $(me.IDPanel.dom).dialog("destroy");
        this.callEvent("change", event);
    }
    cancel() {
        var me = this.me;
        $(me.IDPanel.dom).dialog("destroy");
    }
    set value(value) {
        this.states.value.current = value;
    }
    get value() {
        return this.states.value.current;
    }
    async loadObjects(classname: string) {
        var cl: any = await classes.loadClass(classname);
        return await cl.find();
    }
    @$Property({ type: "string", description: "the classname for to choose" })
    set items(value: any) {
        var _this = this;
        if (value !== undefined && typeof (value) === "string") {
            this.loadObjects(value).then((data) => {
                _this.me.IDTable.items = data;
            });
        }
        else
            _this.me.IDTable.items = value;
    }
    get items(): any {
        return this._items;
    }
    @$Property({ default: "function(event){\n\t\n}" })
    onchange(handler) {
        this.addEvent("change", handler);
    }
    @$Property()
    get autocommit(): boolean {
        return this._autocommit;
    }
    set autocommit(value: boolean) {
        this._autocommit = value;
        //if (this._databinder !== undefined)
        //	this._databinder.checkAutocommit(this);
    }
    /**
     * binds a component to a databinder
     * @param {jassijs.ui.Databinder} databinder - the databinder to bind
     * @param {string} property - the property to bind
     */
    @$Property({ type: "databinder" })
    set bind(databinder: BoundProperty) {
        
            this._databinder = <any>databinder._databinder;
            this._databinder.add(databinder._propertyname, this, "onchange");
       
        //databinder.checkAutocommit(this);
    }
    destroy() {
        this.states.value.current = undefined;
        this.me.IDPanel.destroy();
        super.destroy();
    }
}
export async function test() {
    // kk.o=0;
    var User = (await import("jassijs/remote/security/User")).User;
    var dlg = new ObjectChooser();
    dlg.items = "jassijs.security.User";
    dlg.value = (await User.findOne());
    //	var kunden=await jassijs.db.load("de.Kunde");
    //	dlg.value=kunden[4];
    //	dlg.me.IDTable.items=kunden;
    return dlg;
}
export async function test2() {
    // kk.o=0;
    /* var Kunde = (await import("de/remote/Kunde")).Kunde;
     var dlg = new ObjectChooser();
     dlg.items = "de.Kunde";
     dlg.value = (await Kunde.find({ id: 1 }))[0];
     //	var kunden=await jassijs.db.load("de.Kunde");
     //	dlg.value=kunden[4];
     //	dlg.me.IDTable.items=kunden;
     return dlg;*/
}
