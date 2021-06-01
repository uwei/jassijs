var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "jassi/ui/Panel", "jassi/ui/PropertyEditor", "jassi/ui/Button", "jassi/ui/Property", "jassi/remote/Settings", "jassi/remote/Classes", "jassi/ui/ComponentDescriptor", "jassi/remote/Registry"], function (require, exports, Jassi_1, Panel_1, PropertyEditor_1, Button_1, Property_1, Settings_1, Classes_1, ComponentDescriptor_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.SettingsDialog = exports.Testuw = void 0;
    let Testuw = class Testuw {
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", Number)
    ], Testuw.prototype, "myuw", void 0);
    Testuw = __decorate([
        Settings_1.$SettingsDescriptor(),
        Jassi_1.$Class("jassi_editor.Testuw")
    ], Testuw);
    exports.Testuw = Testuw;
    let SettingsDialogCurrentSettings = class SettingsDialogCurrentSettings {
    };
    __decorate([
        Property_1.$Property(),
        __metadata("design:type", String)
    ], SettingsDialogCurrentSettings.prototype, "test", void 0);
    SettingsDialogCurrentSettings = __decorate([
        Jassi_1.$Class("jassi.ui.SettingsDialogCurrentSettings")
    ], SettingsDialogCurrentSettings);
    let SettingsDialog = class SettingsDialog extends Panel_1.Panel {
        constructor() {
            super();
            this.me = {};
            this.layout(this.me);
        }
        layout(me) {
            me.propertyeditor = new PropertyEditor_1.PropertyEditor(undefined);
            me.OK = new Button_1.Button();
            this.add(me.propertyeditor);
            this.add(me.OK);
            me.propertyeditor.width = "400";
            me.OK.text = "OK";
            me.OK.onclick(function (event) {
            });
        }
    };
    SettingsDialog = __decorate([
        Jassi_1.$Class("jassi.ui.SettingsDialog"),
        __metadata("design:paramtypes", [])
    ], SettingsDialog);
    exports.SettingsDialog = SettingsDialog;
    async function test() {
        var ret = new SettingsDialog();
        var cl = await Classes_1.classes.loadClass("jassi_editor.CodeEditorSettingsDescriptor");
        await Registry_1.default.loadAllFilesForService("$SettingsDescriptor");
        var allcl = Registry_1.default.getData("$SettingsDescriptor");
        var all = ComponentDescriptor_1.ComponentDescriptor.describe(cl, true);
        var testob = new cl();
        ret.me.propertyeditor.value = testob;
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=SettingsDialog.js.map