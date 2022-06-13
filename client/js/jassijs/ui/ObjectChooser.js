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
            this._databinder = databinder[0];
            this._databinder.add(databinder[1], this, "onchange");
            //databinder.checkAutocommit(this);
        }
        destroy() {
            this._value = undefined;
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
        __metadata("design:type", Array),
        __metadata("design:paramtypes", [Array])
    ], ObjectChooser.prototype, "bind", null);
    ObjectChooser = __decorate([
        (0, Component_1.$UIComponent)({ fullPath: "common/ObjectChooser", icon: "mdi mdi-glasses" }),
        (0, Jassi_1.$Class)("jassijs.ui.ObjectChooser"),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0Q2hvb3Nlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpanMvdWkvT2JqZWN0Q2hvb3Nlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0lBY0E7O01BRUU7SUFDRixNQUFNLEVBQUU7S0FPUDtJQWlDRCxJQUFhLGFBQWEsR0FBMUIsTUFBYSxhQUFjLFNBQVEsZUFBTTtRQVd4QztZQUNDLEtBQUssRUFBRSxDQUFDO1lBQ1I7O2NBRUU7WUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLEdBQUcsQ0FBQztZQUN4Qjs7Y0FFRTtZQUNGLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUVmLENBQUM7UUFDQSxNQUFNLENBQUMsTUFBMkI7WUFDNUIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNyQixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDO1FBQ0osSUFBSSxLQUFLO1lBQ1IsT0FBTyxRQUFRLENBQUM7UUFDakIsQ0FBQztRQUVELE1BQU07WUFDTCxJQUFJLEVBQUUsR0FBTyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUMxQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7WUFDZixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSztnQkFDM0IsSUFBSSxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsRUFBRTtvQkFDOUIsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztpQkFDL0I7Z0JBQ0QsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO29C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QUMsc0RBQWEsOEJBQThCLDJCQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDL0QsSUFBSSxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUM5QixHQUFHLENBQUMsS0FBSyxHQUFHLHVCQUF1QixDQUFDO1FBQ3BDLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ25DLGdEQUFnRDtRQUNoRCx1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQVZELG9CQVVDO0lBQ00sS0FBSyxVQUFVLEtBQUs7UUFDMUIsVUFBVTtRQUNWLElBQUksS0FBSyxHQUFHLENBQUMsc0RBQWEsaUJBQWlCLDJCQUFDLENBQUMsQ0FBQyxLQUFLLENBQUE7UUFDbkQsSUFBSSxHQUFHLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztRQUM5QixHQUFHLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUN2QixHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxnREFBZ0Q7UUFDaEQsdUJBQXVCO1FBQ3ZCLCtCQUErQjtRQUMvQixPQUFPLEdBQUcsQ0FBQztJQUNaLENBQUM7SUFWRCxzQkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqYXNzaWpzLCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xuaW1wb3J0IHsgVGFibGUgfSBmcm9tIFwiamFzc2lqcy91aS9UYWJsZVwiO1xuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xuaW1wb3J0IHsgQnV0dG9uLCBCdXR0b25Db25maWcgfSBmcm9tIFwiamFzc2lqcy91aS9CdXR0b25cIjtcbmltcG9ydCB7IFRleHRib3ggfSBmcm9tIFwiamFzc2lqcy91aS9UZXh0Ym94XCI7XG5pbXBvcnQgeyBDaGVja2JveCB9IGZyb20gXCJqYXNzaWpzL3VpL0NoZWNrYm94XCI7XG5pbXBvcnQgeyBWYXJpYWJsZVBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvVmFyaWFibGVQYW5lbFwiO1xuaW1wb3J0IHsgRGF0YWJpbmRlciB9IGZyb20gXCJqYXNzaWpzL3VpL0RhdGFiaW5kZXJcIjtcbmltcG9ydCB7IFByb3BlcnR5LCAkUHJvcGVydHkgfSBmcm9tIFwiamFzc2lqcy91aS9Qcm9wZXJ0eVwiO1xuaW1wb3J0IHsgJFVJQ29tcG9uZW50IH0gZnJvbSBcImphc3NpanMvdWkvQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBEQk9iamVjdCB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9EQk9iamVjdFwiO1xuaW1wb3J0IHsgY2xhc3NlcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9DbGFzc2VzXCI7XG5pbXBvcnQgeyBEYXRhQ29tcG9uZW50Q29uZmlnIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YUNvbXBvbmVudFwiO1xuXG4vKlxuaHR0cHM6Ly9ibG9nLm9wZW5zaGlmdC5jb20vdXNpbmctZmlsZXppbGxhLWFuZC1zZnRwLW9uLXdpbmRvd3Mtd2l0aC1vcGVuc2hpZnQvXG4qL1xuY2xhc3MgTWUge1xuXHRJRFRhYmxlPzogVGFibGU7XG5cdElEUGFuZWw/OiBQYW5lbDtcblx0SURDYW5jZWw/OiBCdXR0b247XG5cdElEU2VhcmNoPzogVGV4dGJveDtcblx0SURPSz86IEJ1dHRvbjtcblxufVxuZXhwb3J0IGludGVyZmFjZSBPYmplY3RDaG9vc2VyQ29uZmlnIGV4dGVuZHMgQnV0dG9uQ29uZmlnIHtcblxuXHRkaWFsb2dIZWlnaHQ/OiBudW1iZXI7XG5cdGRpYWxvZ1dpZHRoPzogbnVtYmVyO1xuXHQvKipcblx0ICogQG1lbWJlciB7b2JqZWN0fSB2YWx1ZSAtIHNlbGVjdGlvbiBvZiB0aGUgY29tcG9uZW50IFxuXHQgKi9cblx0dmFsdWU/OiBhbnk7XG5cdC8qKlxuXHQgKiBAbWVtYmVyIHtzdHJpbmd9IGl0ZW1zIC0gdGhlIGl0ZW1zIHRvIHNlbGVjdCBvciAgdGhlIGNsYXNzbmFtZSB0byBnZW5lcmF0ZSB0aGUgaXRlbXNcblx0ICovXG5cdGl0ZW1zPzogc3RyaW5nIHwgYW55W107XG5cdC8qKlxuKiBjYWxsZWQgaWYgdmFsdWUgaGFzIGNoYW5nZWRcbiogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciAtIHRoZSBmdW5jdGlvbiB3aGljaCBpcyBleGVjdXRlZFxuKi9cblx0b25jaGFuZ2U/KGhhbmRsZXIpO1xuXHQvKipcblx0ICogQG1lbWJlciB7Ym9vbH0gYXV0b2NvbW1pdCAtICBpZiB0cnVlIHRoZSBkYXRhYmluZGVyIHdpbGwgdXBkYXRlIHRoZSB2YWx1ZSBvbiBldmVyeSBjaGFuZ2Vcblx0ICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiBmYWxzZSB0aGUgZGF0YWJpbmRlciB3aWxsIHVwZGF0ZSB0aGUgdmFsdWUgb24gZGF0YWJpbmRlci50b0Zvcm0gXG5cdCAqL1xuXHRhdXRvY29tbWl0PzogYm9vbGVhbjtcblx0LyoqXG5cdCAgICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXG5cdCAgICogQHBhcmFtIFt7amFzc2lqcy51aS5EYXRhYmluZGVyfSBkYXRhYmluZGVyIC0gdGhlIGRhdGFiaW5kZXIgdG8gYmluZCxcblx0ICAgKiAgICAgICAgIHtzdHJpbmd9IHByb3BlcnR5IC0gdGhlIHByb3BlcnR5IHRvIGJpbmRdXG5cdCAgICovXG5cdGJpbmQ/OiBhbnlbXTtcbn1cblxuQCRVSUNvbXBvbmVudCh7IGZ1bGxQYXRoOiBcImNvbW1vbi9PYmplY3RDaG9vc2VyXCIsIGljb246IFwibWRpIG1kaS1nbGFzc2VzXCIgfSlcbkAkQ2xhc3MoXCJqYXNzaWpzLnVpLk9iamVjdENob29zZXJcIilcbmV4cG9ydCBjbGFzcyBPYmplY3RDaG9vc2VyIGV4dGVuZHMgQnV0dG9uIGltcGxlbWVudHMgT2JqZWN0Q2hvb3NlckNvbmZpZywgRGF0YUNvbXBvbmVudENvbmZpZyB7XG5cblx0QCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IDQ1MCB9KVxuXHRkaWFsb2dIZWlnaHQ6IG51bWJlcjtcblx0QCRQcm9wZXJ0eSh7IGRlZmF1bHQ6IDMwMCB9KVxuXHRkaWFsb2dXaWR0aDogbnVtYmVyO1xuXHRfaXRlbXM7XG5cdG1lOiBNZTtcblx0X3ZhbHVlO1xuXHRfYXV0b2NvbW1pdDogYm9vbGVhbjtcblx0X2RhdGFiaW5kZXI6IERhdGFiaW5kZXI7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0LyoqXG5cdFx0KiBAbWVtYmVyIHtudW1iZXJ9IC0gdGhlIGhlaWdodCBvZiB0aGUgZGlhbG9nIFxuXHRcdCovXG5cdFx0dGhpcy5kaWFsb2dIZWlnaHQgPSAzMDA7XG5cdFx0LyoqXG5cdFx0KiBAbWVtYmVyIHtudW1iZXJ9IC0gdGhlIHdpZHRoIG9mIHRoZSBkaWFsb2cgXG5cdFx0Ki9cblx0XHR0aGlzLmRpYWxvZ1dpZHRoID0gNDUwO1xuXHRcdHRoaXMubGF5b3V0KCk7XG5cblx0fVxuIFx0Y29uZmlnKGNvbmZpZzogT2JqZWN0Q2hvb3NlckNvbmZpZyk6IE9iamVjdENob29zZXIge1xuICAgICAgICBzdXBlci5jb25maWcoY29uZmlnKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXHRnZXQgdGl0bGUoKSB7XG5cdFx0cmV0dXJuIFwiU2VsZWN0XCI7XG5cdH1cblxuXHRsYXlvdXQoKSB7XG5cdFx0dmFyIG1lOiBNZSA9IHRoaXMubWUgPSB7fTtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHRoaXMuYXV0b2NvbW1pdCA9IHRydWU7XG5cdFx0dGhpcy50ZXh0ID0gXCJcIjtcblx0XHR0aGlzLm9uY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRpZiAoX3RoaXMudmFsdWUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRtZS5JRFRhYmxlLnZhbHVlID0gX3RoaXMudmFsdWU7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZGxnID0gJChtZS5JRFBhbmVsLmRvbSkuZGlhbG9nKHtcblx0XHRcdFx0d2lkdGg6IF90aGlzLmRpYWxvZ1dpZHRoLFxuXHRcdFx0XHRoZWlnaHQ6IF90aGlzLmRpYWxvZ0hlaWdodCxcblx0XHRcdFx0bW9kYWw6IHRydWVcblx0XHRcdFx0LypiZWZvcmVDbG9zZTogZnVuY3Rpb24oZXZlbnQsIHVpKSB7XG5cdFx0XHRcdCAgIFxuXHRcdFx0XHR9ICovXG5cdFx0XHR9KTtcblx0XHRcdGlmIChtZS5JRFRhYmxlLnRhYmxlLmdldFNlbGVjdGVkUm93cygpLmxlbmd0aCA+IDApXG5cdFx0XHRcdG1lLklEVGFibGUudGFibGUuc2Nyb2xsVG9Sb3cobWUuSURUYWJsZS50YWJsZS5nZXRTZWxlY3RlZFJvd3MoKVswXSk7XG5cdFx0XHRfdGhpcy5jYWxsRXZlbnQoXCJzaG93RGlhbG9nXCIsIGV2ZW50KTtcblx0XHR9KTtcblx0XHR0aGlzLmljb24gPSBcIm1kaSBtZGktZ2xhc3Nlc1wiO1xuXG5cdFx0bWUuSURQYW5lbCA9IG5ldyBQYW5lbCgpO1xuXHRcdG1lLklEQ2FuY2VsID0gbmV3IEJ1dHRvbigpO1xuXG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRtZS5JRFNlYXJjaCA9IG5ldyBUZXh0Ym94KCk7XG5cdFx0bWUuSURPSyA9IG5ldyBCdXR0b24oKTtcblx0XHRtZS5JRFRhYmxlID0gbmV3IFRhYmxlKCk7XG5cdFx0bWUuSURQYW5lbC5hZGQobWUuSURTZWFyY2gpO1xuXHRcdG1lLklEUGFuZWwuYWRkKG1lLklET0spO1xuXHRcdG1lLklEUGFuZWwuYWRkKG1lLklEQ2FuY2VsKTtcblx0XHRtZS5JRFBhbmVsLmFkZChtZS5JRFRhYmxlKTtcblx0XHRtZS5JRE9LLndpZHRoID0gNTU7XG5cdFx0bWUuSURPSy50ZXh0ID0gXCJPS1wiO1xuXHRcdG1lLklET0sub25jbGljayhmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdF90aGlzLm9rKCk7XG5cdFx0fSk7XG5cdFx0bWUuSURTZWFyY2gud2lkdGggPSAxNzA7XG5cdFx0bWUuSURTZWFyY2gub25pbnB1dChmdW5jdGlvbiAoZXZlbnQpIHtcblxuXHRcdFx0bWUuSURUYWJsZS5zZWFyY2goXCJhbGxcIiwgbWUuSURTZWFyY2gudmFsdWUsIHRydWUpO1xuXHRcdH0pO1xuXHRcdCQobWUuSURUYWJsZS5kb20pLmRvdWJsZXRhcChmdW5jdGlvbiAoZGF0YSkge1xuXHRcdFx0X3RoaXMub2soKTtcblx0XHR9KTtcblx0XHRtZS5JRFNlYXJjaC5vbmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG5cblx0XHRcdGlmIChldmVudC5rZXlDb2RlID09IDEzKSB7XG5cdFx0XHRcdF90aGlzLm9rKCk7XG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdGlmIChldmVudC5rZXlDb2RlID09IDI3KSB7XG5cdFx0XHRcdF90aGlzLmNhbmNlbCgpO1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0bWUuSURTZWFyY2guaGVpZ2h0ID0gMTU7XG5cdFx0bWUuSURUYWJsZS53aWR0aCA9IFwiMTAwJVwiO1xuXHRcdG1lLklEVGFibGUuaGVpZ2h0ID0gXCJjYWxjKDEwMCUgLSAxMHB4KVwiO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4geyBtZS5JRFNlYXJjaC5mb2N1cygpOyB9LCAyMDApO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4geyBtZS5JRFNlYXJjaC5mb2N1cygpOyB9LCAxMDAwKTtcblx0XHRtZS5JRENhbmNlbC5vbmNsaWNrKGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0X3RoaXMuY2FuY2VsKCk7XG5cdFx0fSk7XG5cdFx0bWUuSURDYW5jZWwudGV4dCA9IFwiQ2FuY2VsXCI7XG5cdFx0bWUuSURQYW5lbC5oZWlnaHQgPSBcIjEwMCVcIjtcblx0XHRtZS5JRFBhbmVsLndpZHRoID0gXCIxMDAlXCI7XG5cdH1cblx0b2soKSB7XG5cdFx0dmFyIG1lID0gdGhpcy5tZTtcblx0XHQkKG1lLklEUGFuZWwuZG9tKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuXHRcdHRoaXMudmFsdWUgPSBtZS5JRFRhYmxlLnZhbHVlO1xuXHRcdHRoaXMuY2FsbEV2ZW50KFwiY2hhbmdlXCIsIGV2ZW50KTtcblx0fVxuXHRjYW5jZWwoKSB7XG5cdFx0dmFyIG1lID0gdGhpcy5tZTtcblx0XHQkKG1lLklEUGFuZWwuZG9tKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuXHR9XG5cblx0c2V0IHZhbHVlKHZhbHVlKSB7IC8vdGhlIENvZGVcblx0XHR0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXHR9XG5cblx0Z2V0IHZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLl92YWx1ZTtcblx0fVxuXHRhc3luYyBsb2FkT2JqZWN0cyhjbGFzc25hbWU6IHN0cmluZykge1xuXHRcdHZhciBjbDogYW55ID0gYXdhaXQgY2xhc3Nlcy5sb2FkQ2xhc3MoY2xhc3NuYW1lKTtcblx0XHRyZXR1cm4gYXdhaXQgY2wuZmluZCgpO1xuXHR9XG5cdEAkUHJvcGVydHkoeyB0eXBlOiBcInN0cmluZ1wiLCBkZXNjcmlwdGlvbjogXCJ0aGUgY2xhc3NuYW1lIGZvciB0byBjaG9vc2VcIiB9KVxuXG5cdHNldCBpdGVtcyh2YWx1ZTogYW55KSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRpZiAodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgKHZhbHVlKSA9PT0gXCJzdHJpbmdcIikge1xuXHRcdFx0dGhpcy5sb2FkT2JqZWN0cyh2YWx1ZSkudGhlbigoZGF0YSkgPT4ge1xuXHRcdFx0XHRfdGhpcy5tZS5JRFRhYmxlLml0ZW1zID0gZGF0YTtcblx0XHRcdH0pO1xuXG5cblx0XHR9IGVsc2Vcblx0XHRcdF90aGlzLm1lLklEVGFibGUuaXRlbXMgPSB2YWx1ZTtcblx0fVxuXG5cdGdldCBpdGVtcygpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLl9pdGVtcztcblx0fVxuXG5cdEAkUHJvcGVydHkoeyBkZWZhdWx0OiBcImZ1bmN0aW9uKGV2ZW50KXtcXG5cXHRcXG59XCIgfSlcblx0b25jaGFuZ2UoaGFuZGxlcikge1xuXHRcdHRoaXMuYWRkRXZlbnQoXCJjaGFuZ2VcIiwgaGFuZGxlcik7XG5cdH1cblxuXHRAJFByb3BlcnR5KClcblx0Z2V0IGF1dG9jb21taXQoKTogYm9vbGVhbiB7XG5cdFx0cmV0dXJuIHRoaXMuX2F1dG9jb21taXQ7XG5cdH1cblx0c2V0IGF1dG9jb21taXQodmFsdWU6IGJvb2xlYW4pIHtcblx0XHR0aGlzLl9hdXRvY29tbWl0ID0gdmFsdWU7XG5cdFx0Ly9pZiAodGhpcy5fZGF0YWJpbmRlciAhPT0gdW5kZWZpbmVkKVxuXHRcdC8vXHR0aGlzLl9kYXRhYmluZGVyLmNoZWNrQXV0b2NvbW1pdCh0aGlzKTtcblx0fVxuXHQvKipcblx0ICogYmluZHMgYSBjb21wb25lbnQgdG8gYSBkYXRhYmluZGVyXG5cdCAqIEBwYXJhbSB7amFzc2lqcy51aS5EYXRhYmluZGVyfSBkYXRhYmluZGVyIC0gdGhlIGRhdGFiaW5kZXIgdG8gYmluZFxuXHQgKiBAcGFyYW0ge3N0cmluZ30gcHJvcGVydHkgLSB0aGUgcHJvcGVydHkgdG8gYmluZFxuXHQgKi9cblx0QCRQcm9wZXJ0eSh7IHR5cGU6IFwiZGF0YWJpbmRlclwiIH0pXG5cdHNldCBiaW5kKGRhdGFiaW5kZXI6IGFueVtdKSB7XG5cdFx0dGhpcy5fZGF0YWJpbmRlciA9IGRhdGFiaW5kZXJbMF07XG5cdFx0dGhpcy5fZGF0YWJpbmRlci5hZGQoPHN0cmluZz5kYXRhYmluZGVyWzFdLCB0aGlzLCBcIm9uY2hhbmdlXCIpO1xuXHRcdC8vZGF0YWJpbmRlci5jaGVja0F1dG9jb21taXQodGhpcyk7XG5cdH1cblx0ZGVzdHJveSgpIHtcblxuXHRcdHRoaXMuX3ZhbHVlID0gdW5kZWZpbmVkO1xuXHRcdHRoaXMubWUuSURQYW5lbC5kZXN0cm95KCk7XG5cdFx0c3VwZXIuZGVzdHJveSgpO1xuXHR9XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdGVzdCgpIHtcblx0Ly8ga2subz0wO1xuXHR2YXIgVXNlciA9IChhd2FpdCBpbXBvcnQoXCJqYXNzaWpzL3JlbW90ZS9zZWN1cml0eS9Vc2VyXCIpKS5Vc2VyO1xuXHR2YXIgZGxnID0gbmV3IE9iamVjdENob29zZXIoKTtcblx0ZGxnLml0ZW1zID0gXCJqYXNzaWpzLnNlY3VyaXR5LlVzZXJcIjtcblx0ZGxnLnZhbHVlID0gKGF3YWl0IFVzZXIuZmluZE9uZSgpKTtcblx0Ly9cdHZhciBrdW5kZW49YXdhaXQgamFzc2lqcy5kYi5sb2FkKFwiZGUuS3VuZGVcIik7XG5cdC8vXHRkbGcudmFsdWU9a3VuZGVuWzRdO1xuXHQvL1x0ZGxnLm1lLklEVGFibGUuaXRlbXM9a3VuZGVuO1xuXHRyZXR1cm4gZGxnO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRlc3QyKCkge1xuXHQvLyBray5vPTA7XG5cdHZhciBLdW5kZSA9IChhd2FpdCBpbXBvcnQoXCJkZS9yZW1vdGUvS3VuZGVcIikpLkt1bmRlXG5cdHZhciBkbGcgPSBuZXcgT2JqZWN0Q2hvb3NlcigpO1xuXHRkbGcuaXRlbXMgPSBcImRlLkt1bmRlXCI7XG5cdGRsZy52YWx1ZSA9IChhd2FpdCBLdW5kZS5maW5kKHsgaWQ6IDEgfSkpWzBdO1xuXHQvL1x0dmFyIGt1bmRlbj1hd2FpdCBqYXNzaWpzLmRiLmxvYWQoXCJkZS5LdW5kZVwiKTtcblx0Ly9cdGRsZy52YWx1ZT1rdW5kZW5bNF07XG5cdC8vXHRkbGcubWUuSURUYWJsZS5pdGVtcz1rdW5kZW47XG5cdHJldHVybiBkbGc7XG59XG5cbiJdfQ==