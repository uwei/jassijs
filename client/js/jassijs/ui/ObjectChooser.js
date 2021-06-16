var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/ui/Table", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/remote/Classes"], function (require, exports, Jassi_1, Table_1, Panel_1, Button_1, Textbox_1, Property_1, Component_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.ObjectChooser = void 0;
    /*
    https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
    */
    class Me {
    }
    let ObjectChooser = class ObjectChooser extends Button_1.Button {
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
            var me = this.me = {};
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
            me.IDPanel = new Panel_1.Panel();
            me.IDCancel = new Button_1.Button();
            var _this = this;
            me.IDSearch = new Textbox_1.Textbox();
            me.IDOK = new Button_1.Button();
            me.IDTable = new Table_1.Table();
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
        set value(value) {
            this._value = value;
        }
        get value() {
            return this._value;
        }
        async loadObjects(classname) {
            var cl = await Classes_1.classes.loadClass(classname);
            return await cl.find();
        }
        set items(value) {
            var _this = this;
            if (value !== undefined && typeof (value) === "string") {
                this.loadObjects(value).then((data) => {
                    _this.me.IDTable.items = data;
                });
            }
            else
                _this.me.IDTable.items = value;
        }
        get items() {
            return this._items;
        }
        /**
        * called if value has changed
        * @param {function} handler - the function which is executed
        */
        onchange(handler) {
            this.addEvent("change", handler);
        }
        /**
         * @member {bool} autocommit -  if true the databinder will update the value on every change
         *                              if false the databinder will update the value on databinder.toForm
         */
        get autocommit() {
            return this._autocommit;
        }
        set autocommit(value) {
            this._autocommit = value;
            //if (this._databinder !== undefined)
            //	this._databinder.checkAutocommit(this);
        }
        /**
         * binds a component to a databinder
         * @param {jassijs.ui.Databinder} databinder - the databinder to bind
         * @param {string} property - the property to bind
         */
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
    };
    __decorate([
        Property_1.$Property({ default: 450 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogHeight", void 0);
    __decorate([
        Property_1.$Property({ default: 300 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogWidth", void 0);
    __decorate([
        Property_1.$Property({ type: "string", description: "the classname for to choose" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "items", null);
    __decorate([
        Property_1.$Property({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "onchange", null);
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ObjectChooser.prototype, "autocommit", null);
    __decorate([
        Property_1.$Property({ type: "databinder" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "bind", null);
    ObjectChooser = __decorate([
        Component_1.$UIComponent({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        Jassi_1.$Class("jassijs.ui.ObjectChooser"),
        __metadata("design:paramtypes", [])
    ], ObjectChooser);
    exports.ObjectChooser = ObjectChooser;
    async function test() {
        // kk.o=0;
        var User = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/security/User"], resolve_1, reject_1); })).User;
        var dlg = new ObjectChooser();
        dlg.items = "jassijs.security.User";
        dlg.value = (await User.findOne());
        //	var kunden=await jassijs.db.load("de.Kunde");
        //	dlg.value=kunden[4];
        //	dlg.me.IDTable.items=kunden;
        return dlg;
    }
    exports.test = test;
    async function test2() {
        // kk.o=0;
        var Kunde = (await new Promise((resolve_2, reject_2) => { require(["de/remote/Kunde"], resolve_2, reject_2); })).Kunde;
        var dlg = new ObjectChooser();
        dlg.items = "de.Kunde";
        dlg.value = (await Kunde.find({ id: 1 }))[0];
        //	var kunden=await jassijs.db.load("de.Kunde");
        //	dlg.value=kunden[4];
        //	dlg.me.IDTable.items=kunden;
        return dlg;
    }
    exports.test2 = test2;
});
//# sourceMappingURL=ObjectChooser.js.map