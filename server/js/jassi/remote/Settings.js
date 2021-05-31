"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var Settings_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.autostart = exports.$SettingDescriptor = exports.settings = exports.Settings = void 0;
const Jassi_1 = require("jassi/remote/Jassi");
const Registry_1 = require("jassi/remote/Registry");
const RemoteObject_1 = require("jassi/remote/RemoteObject");
const Setting_1 = require("jassi/remote/security/Setting");
const proxyhandler = {
    get: function (target, prop, receiver) {
        return prop;
    }
};
let Settings = Settings_1 = class Settings extends RemoteObject_1.RemoteObject {
    /**
    * loads the settings
    */
    static async load(context = undefined) {
        if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
            //browser
            let entr = window.localStorage.getItem("jassijs.settings");
            if (entr) {
                Settings_1.browserSettings = JSON.parse(entr);
            }
            else
                Settings_1.browserSettings = {};
            var all = await this.call(this.load, context);
            if (all.user) {
                Settings_1.userSettings = JSON.parse(all.user.data);
            }
            else
                Settings_1.userSettings = {};
            if (all.allusers) {
                Settings_1.allusersSettings = JSON.parse(all.allusers.data);
            }
            else
                Settings_1.allusersSettings = {};
        }
        else {
            //@ts-ignore
            var man = await (await Promise.resolve().then(() => require("jassi/server/DBManager"))).DBManager.get();
            var id = context.request.user.user;
            return {
                user: await man.findOne(context, Setting_1.Setting, { "id": 1 }),
                allusers: await man.findOne(context, Setting_1.Setting, { "id": 0 }),
            };
        }
    }
    static gets(name) {
        if (Settings_1.browserSettings && Settings_1.browserSettings[name])
            return Settings_1.browserSettings[name];
        if (Settings_1.userSettings && Settings_1.userSettings[name])
            return Settings_1.userSettings[name];
        if (Settings_1.allusersSettings && Settings_1.allusersSettings[name])
            return Settings_1.allusersSettings[name];
        return undefined;
    }
    static async remove(key, scope, context = undefined) {
        if (scope === "browser") {
            delete Settings_1.browserSettings[key];
            window.localStorage.setItem("jassijs.settings", JSON.stringify(Settings_1.browserSettings));
        }
        if (scope === "user" || scope === "allusers") {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.remove, key, scope, context);
            }
            else {
                //@ts-ignore
                var man = await (await Promise.resolve().then(() => require("jassi/server/DBManager"))).DBManager.get();
                var id = context.request.user.user;
                //first load
                let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                if (entr !== undefined) {
                    var data = JSON.parse(entr.data);
                    delete data[key];
                    entr.data = JSON.stringify(data);
                    await man.save(context, entr);
                }
            }
        }
    }
    static async save(name, value, scope) {
        let ob = {};
        //@ts-ignore
        ob[name] = value;
        return await this.saveAll(ob, scope);
    }
    static async saveAll(namevaluepair, scope, removeOtherKeys = false, context = undefined) {
        if (scope === "browser") {
            let entr = window.localStorage.getItem("jassijs.settings");
            var data = namevaluepair;
            if (entr) {
                data = JSON.parse(entr);
                Object.assign(data, namevaluepair);
            }
            window.localStorage.setItem("jassijs.settings", JSON.stringify(data));
        }
        if (scope === "user" || scope === "allusers") {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.saveAll, namevaluepair, scope, removeOtherKeys, context);
            }
            else {
                //@ts-ignore
                var man = await (await Promise.resolve().then(() => require("jassi/server/DBManager"))).DBManager.get();
                var id = context.request.user.user;
                //first load
                let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                var data = namevaluepair;
                if (removeOtherKeys !== true) {
                    if (entr !== undefined) {
                        data = JSON.parse(entr.data);
                        Object.assign(data, namevaluepair);
                    }
                }
                var newsetting = new Setting_1.Setting();
                newsetting.id = (scope === "user" ? id : 0);
                newsetting.data = JSON.stringify(data);
                return await man.save(context, newsetting);
                //return man.find(context, this, { "id": "admin" });
            }
        }
    }
};
Settings.keys = new Proxy({}, proxyhandler); //the Proxy allwas give the key back
Settings.browserSettings = undefined;
Settings.userSettings = undefined;
Settings.allusersSettings = undefined;
Settings = Settings_1 = __decorate([
    Jassi_1.$Class("jassi.remote.Settings")
], Settings);
exports.Settings = Settings;
var settings = new Settings();
exports.settings = settings;
function $SettingDescriptor() {
    return function (pclass) {
        Registry_1.default.register("$SettingProvider", pclass);
    };
}
exports.$SettingDescriptor = $SettingDescriptor;
/*@$Class("MySettings")
class MySettings {
    @$Property({ name: "Development/Default Editor", chooseFrom: ["ace", "monaco"] })
    Development_DefaultEditor: string;
}
*/
async function autostart() {
    await Settings.load();
}
exports.autostart = autostart;
async function test() {
    //
    //console.log(await Settings.save(Settings.keys.Development_DefaultEditor, "ace1", "browser"));
    console.log(await Settings.save(Settings.keys.Development_DefaultEditor, "ace", "user"));
    //  console.log(await Settings.save(Settings.keys.Development_DefaultEditor, "ace3", "allusers"));
    await Settings.load();
    // await Settings.remove(Settings.keys.Development_DefaultEditor, "browser");
    console.log(Settings.gets(Settings.keys.Development_DefaultEditor));
    await Settings.load();
    console.log(Settings.gets(Settings.keys.Development_DefaultEditor));
    //console.log(await settings.gets(settings.keys.Development_DefaultEditor));
}
exports.test = test;
//# sourceMappingURL=Settings.js.map