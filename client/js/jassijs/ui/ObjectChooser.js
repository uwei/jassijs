var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/ui/Table", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/ui/Component", "jassijs/remote/Classes", "jassijs/ext/jquerylib"], function (require, exports, Registry_1, Table_1, Panel_1, Button_1, Textbox_1, Property_1, Component_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.ObjectChooser = void 0;
    /*
    https://blog.openshift.com/using-filezilla-and-sftp-on-windows-with-openshift/
    */
    class Me {
    }
    let ObjectChooser = class ObjectChooser extends Button_1.Button {
        constructor(props = {}) {
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
        config(config) {
            super.config(config);
            return this;
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
            this.width = 29;
            this.height = 21;
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
            this.state.value.current = value;
        }
        get value() {
            return this.state.value.current;
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
        onchange(handler) {
            this.addEvent("change", handler);
        }
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
        set bind(databinder) {
            this._databinder = databinder._databinder;
            this._databinder.add(databinder._propertyname, this, "onchange");
            //databinder.checkAutocommit(this);
        }
        destroy() {
            this.state.value.current = undefined;
            this.me.IDPanel.destroy();
            super.destroy();
        }
    };
    __decorate([
        (0, Property_1.$Property)({ default: 450 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogHeight", void 0);
    __decorate([
        (0, Property_1.$Property)({ default: 300 }),
        __metadata("design:type", Number)
    ], ObjectChooser.prototype, "dialogWidth", void 0);
    __decorate([
        (0, Property_1.$Property)({ type: "string", description: "the classname for to choose" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "items", null);
    __decorate([
        (0, Property_1.$Property)({ default: "function(event){\n\t\n}" }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], ObjectChooser.prototype, "onchange", null);
    __decorate([
        (0, Property_1.$Property)(),
        __metadata("design:type", Boolean),
        __metadata("design:paramtypes", [Boolean])
    ], ObjectChooser.prototype, "autocommit", null);
    __decorate([
        (0, Property_1.$Property)({ type: "databinder" }),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser.prototype, "bind", null);
    ObjectChooser = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        (0, Registry_1.$Class)("jassijs.ui.ObjectChooser"),
        __metadata("design:paramtypes", [Object])
    ], ObjectChooser);
    exports.ObjectChooser = ObjectChooser;
    async function test() {
        // kk.o=0;
        var User = (await new Promise((resolve_1, reject_1) => { require(["jassijs/remote/security/User"], resolve_1, reject_1); }).then(__importStar)).User;
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
        /* var Kunde = (await import("de/remote/Kunde")).Kunde;
         var dlg = new ObjectChooser();
         dlg.items = "de.Kunde";
         dlg.value = (await Kunde.find({ id: 1 }))[0];
         //	var kunden=await jassijs.db.load("de.Kunde");
         //	dlg.value=kunden[4];
         //	dlg.me.IDTable.items=kunden;
         return dlg;*/
    }
    exports.test2 = test2;
});
//# sourceMappingURL=ObjectChooser.js.map