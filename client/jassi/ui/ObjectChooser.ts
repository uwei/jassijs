import jassi, { $Class } from "jassi/remote/Jassi";
import { Table } from "jassi/ui/Table";
import { Panel } from "jassi/ui/Panel";
import { Button } from "jassi/ui/Button";
import { Textbox } from "jassi/ui/Textbox";
import { Checkbox } from "jassi/ui/Checkbox";
import { VariablePanel } from "jassi/ui/VariablePanel";
import { Databinder } from "jassi/ui/Databinder";
import { Property, $Property } from "jassi/ui/Property";
import { $UIComponent } from "jassi/ui/Component";
import { DBObject } from "jassi/remote/DBObject";
import { classes } from "jassi/remote/Classes";

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
@$UIComponent({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" })
@$Class("jassi.ui.ObjectChooser")
export class ObjectChooser extends Button {

	@$Property({ default: 450 })
	dialogHeight: number;
	@$Property({ default: 300 })
	dialogWidth: number;
	_items;
	me: Me;
	_value;
	_autocommit: boolean;
	_databinder: Databinder;
	constructor() {
		super();
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
		me.IDOK.width = 55;
		me.IDOK.text = "OK";
		me.IDOK.onclick(function (event) {
			_this.ok();
		});
		me.IDSearch.width = 170;
		me.IDSearch.oninput(function (event) {
		
			me.IDTable.search("all", me.IDSearch.value, true);
		});
		$(me.IDTable.dom).doubletap(function (data) {
			_this.ok();
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
		me.IDTable.height = "calc(100% - 10px)";
		setTimeout(() => { me.IDSearch.focus(); }, 200);
		setTimeout(() => { me.IDSearch.focus(); }, 1000);
		me.IDCancel.onclick(function (event) {
			_this.cancel();
		});
		me.IDCancel.text = "Cancel";
		me.IDPanel.height = "100%";
		me.IDPanel.width = "100%";
	}
	ok() {
		var me = this.me;
		$(me.IDPanel.dom).dialog("destroy");
		this.value = me.IDTable.value;
		this.callEvent("change", event);
	}
	cancel() {
		var me = this.me;
		$(me.IDPanel.dom).dialog("destroy");
	}
	/**
	 * @member {object} value - selection of the component 
	 */
	set value(value) { //the Code
		this._value = value;
	}

	get value() {
		return this._value;
	}
	async loadObjects(classname: string) {
		var cl: any = await classes.loadClass(classname);
		return await cl.find();
	}
	@$Property({ type: "string", description: "the classname for to choose" })
	/**
	 * @member {string} items - the items to select
	 */
	set items(value: any) {
		var _this = this;
		if (value !== undefined && typeof (value) === "string") {
			this.loadObjects(value).then((data) => {
				_this.me.IDTable.items = data;
			});


		} else
			_this.me.IDTable.items = value;
	}

	get items(): any {
		return this._items;
	}




	/**
	* called if value has changed
	* @param {function} handler - the function which is executed
	*/
	@$Property({ default: "function(event){\n\t\n}" })
	onchange(handler) {
		this.addEvent("change", handler);
	}

	/**
	 * @member {bool} autocommit -  if true the databinder will update the value on every change
	 *                              if false the databinder will update the value on databinder.toForm 
	 */
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
	 * @param {jassi.ui.Databinder} databinder - the databinder to bind
	 * @param {string} property - the property to bind
	 */
	@$Property({ type: "databinder" })
	bind(databinder, property) {
		this._databinder = databinder;
		databinder.add(property, this, "onchange");
		//databinder.checkAutocommit(this);
	}
	destroy() {

		this._value = undefined;
		this.me.IDPanel.destroy();
		super.destroy();
	}
}

export async function test() {
	// kk.o=0;
	var Kunde = (await import("de/remote/Kunde")).Kunde
	var dlg = new ObjectChooser();
	dlg.items = "de.Kunde";
	dlg.value = (await Kunde.find({ id: 1 }))[0];
	//	var kunden=await jassi.db.load("de.Kunde");
	//	dlg.value=kunden[4];
	//	dlg.me.IDTable.items=kunden;
	return dlg;
}

