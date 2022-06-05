var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Select", "jassijs/remote/Jassi", "jassijs/ui/Panel", "jassijs/ui/PropertyEditor", "jassijs/ui/Button", "jassijs/remote/Settings", "jassijs/ui/ComponentDescriptor", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/base/Windows"], function (require, exports, HTMLPanel_1, Select_1, Jassi_1, Panel_1, PropertyEditor_1, Button_1, Settings_1, ComponentDescriptor_1, Registry_1, Actions_1, Windows_1) {
    "use strict";
    var SettingsDialog_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SettingsDialog = void 0;
    let SettingsObject = class SettingsObject {
        static customComponentDescriptor() {
            var allcl = Registry_1.default.getData("$SettingsDescriptor");
            var ret = new ComponentDescriptor_1.ComponentDescriptor();
            ret.fields = [];
            for (var x = 0; x < allcl.length; x++) {
                var cl = allcl[x].oclass;
                var all = ComponentDescriptor_1.ComponentDescriptor.describe(cl, true);
                all.fields.forEach((f) => {
                    ret.fields.push(f);
                });
            }
            return ret;
        }
    };
    SettingsObject = __decorate([
        (0, Jassi_1.$Class)("jassijs.ui.SettingsObject")
    ], SettingsObject);
    let SettingsDialog = SettingsDialog_1 = class SettingsDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        static async show() {
            Windows_1.default.add(new SettingsDialog_1(), "Settings");
        }
        async update() {
            await Settings_1.Settings.load();
            await Registry_1.default.loadAllFilesForService("$SettingsDescriptor");
            var testob = new SettingsObject();
            var scope = "browser";
            if (this.me.Scope.value === "current user") {
                Object.assign(testob, Settings_1.Settings.getAll("user"));
            }
            else if (this.me.Scope.value === "all users") {
                Object.assign(testob, Settings_1.Settings.getAll("allusers"));
            }
            else {
                Object.assign(testob, Settings_1.Settings.getAll("browser"));
            }
            this.me.propertyeditor.value = testob;
        }
        async save() {
            var ob = this.me.propertyeditor.value;
            var scope = "browser";
            if (this.me.Scope.value === "current user") {
                await Settings_1.Settings.saveAll(ob, "user", true);
            }
            else if (this.me.Scope.value === "all users") {
                await Settings_1.Settings.saveAll(ob, "allusers", true);
            }
            else {
                await Settings_1.Settings.saveAll(ob, "browser", true);
            }
        }
        layout(me) {
            var _this = this;
            me.propertyeditor = new PropertyEditor_1.PropertyEditor();
            me.Save = new Button_1.Button();
            me.Scope = new Select_1.Select();
            me.htmlpanel1 = new HTMLPanel_1.HTMLPanel();
            me.Scope.items = ["this browser", "current user", "all users"];
            me.Scope.value = "current user";
            this.add(me.htmlpanel1);
            this.add(me.Scope);
            this.add(me.propertyeditor);
            this.add(me.Save);
            me.propertyeditor.width = "400";
            me.propertyeditor.height = 145;
            me.Save.text = "Save";
            me.Save.onclick(function (event) {
                _this.save();
            });
            me.Save.icon = "mdi mdi-content-save-outline";
            me.Scope.width = "150";
            me.Scope.onchange(function (event) {
                _this.update();
            });
            this.update();
            me.htmlpanel1.value = "Settings for  ";
            me.htmlpanel1.width = "80";
            me.htmlpanel1.css = {
                font_size: "small",
                font_weight: "bold"
            };
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Settings",
            icon: "mdi mdi-settings-helper",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], SettingsDialog, "show", null);
    SettingsDialog = SettingsDialog_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Jassi_1.$Class)("jassijs.ui.SettingsDialog"),
        __metadata("design:paramtypes", [])
    ], SettingsDialog);
    exports.SettingsDialog = SettingsDialog;
    async function test() {
        var ret = new SettingsDialog();
        // var allcl=registry.getData("$SettingsDescriptor");
        //var all=ComponentDescriptor.describe(cl,true);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=SettingsDialog.js.map