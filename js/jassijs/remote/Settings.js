"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Settings_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.test = exports.autostart = exports.$SettingsDescriptor = exports.settings = exports.Settings = void 0;
const Registry_1 = require("jassijs/remote/Registry");
const Registry_2 = require("jassijs/remote/Registry");
const RemoteObject_1 = require("jassijs/remote/RemoteObject");
const Setting_1 = require("jassijs/remote/security/Setting");
const Server_1 = require("./Server");
const Serverservice_1 = require("jassijs/remote/Serverservice");
const Validator_1 = require("jassijs/remote/Validator");
const DBObject_1 = require("./DBObject");
const proxyhandler = {
    get: function (target, prop, receiver) {
        return prop;
    }
};
async function tt() {
    return 5;
}
var h = new Proxy({ hallo: tt() }, {
    get: (target, prop) => target[prop]
});
let Settings = Settings_1 = class Settings extends DBObject_1.DBObject {
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
            var all = (await Server_1.Server.isOnline() === false) ? undefined : await RemoteObject_1.RemoteObject.docall(this, this.load, ...arguments);
            if (all === null || all === void 0 ? void 0 : all.user) {
                Settings_1.userSettings = JSON.parse(all.user.data);
            }
            else
                Settings_1.userSettings = {};
            if (all === null || all === void 0 ? void 0 : all.allusers) {
                Settings_1.allusersSettings = JSON.parse(all.allusers.data);
            }
            else
                Settings_1.allusersSettings = {};
        }
        else {
            //@ts-ignore
            var man = await (Serverservice_1.serverservices.db);
            var user = await man.findOne(context, Setting_1.Setting, { "id": 1 });
            return {
                user: user,
                allusers: await man.findOne(context, Setting_1.Setting, { "id": 0 }),
            };
        }
    }
    static getAll(scope) {
        var ret = {};
        if (scope === "browser") {
            Object.assign(ret, Settings_1.browserSettings);
        }
        if (scope === "user") {
            Object.assign(ret, Settings_1.userSettings);
        }
        if (scope === "allusers") {
            Object.assign(ret, Settings_1.allusersSettings);
        }
        return ret;
    }
    gets(Settings_key) {
        if (Settings_1.browserSettings && Settings_1.browserSettings[Settings_key])
            return Settings_1.browserSettings[Settings_key];
        if (Settings_1.userSettings && Settings_1.userSettings[Settings_key])
            return Settings_1.userSettings[Settings_key];
        if (Settings_1.allusersSettings && Settings_1.allusersSettings[Settings_key])
            return Settings_1.allusersSettings[Settings_key];
        return undefined;
    }
    static async remove(Settings_key, scope, context = undefined) {
        if (scope === "browser") {
            delete Settings_1.browserSettings[Settings_key];
            window.localStorage.setItem("jassijs.settings", JSON.stringify(Settings_1.browserSettings));
        }
        if (scope === "user" || scope === "allusers") {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                if (scope == "user" && Settings_1.userSettings)
                    delete Settings_1.userSettings[Settings_key];
                if (scope == "allusers" && Settings_1.allusersSettings)
                    delete Settings_1.allusersSettings[Settings_key];
                RemoteObject_1.RemoteObject.docall(this, this.remove, Settings_key, scope, context);
            }
            else {
                //@ts-ignore
                var man = await Serverservice_1.serverservices.db;
                var id = context.request.user.user;
                //first load
                let entr = await man.findOne(context, Setting_1.Setting, { "id": (scope === "user" ? id : 0) });
                if (entr !== undefined) {
                    var data = JSON.parse(entr.data);
                    delete data[Settings_key];
                    entr.data = JSON.stringify(data);
                    await man.save(context, entr);
                }
            }
        }
    }
    static async save(Settings_key, value, scope, context = undefined) {
        let ob = {};
        //@ts-ignore
        ob[Settings_key] = value;
        return await this.saveAll(ob, scope, undefined, context);
    }
    static async saveAll(namevaluepair, scope, removeOtherKeys = false, context = undefined) {
        if (scope === "browser") {
            let entr = window.localStorage.getItem("jassijs.settings");
            var data = namevaluepair;
            if (entr) {
                data = JSON.parse(entr);
                Object.assign(data, namevaluepair);
            }
            if (removeOtherKeys)
                data = namevaluepair;
            window.localStorage.setItem("jassijs.settings", JSON.stringify(data));
            if (removeOtherKeys)
                Settings_1.browserSettings = {};
            Object.assign(Settings_1.browserSettings, namevaluepair);
        }
        if (scope === "user" || scope === "allusers") {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                var props = {};
                Object.assign(props, namevaluepair);
                if (scope == "user" && Settings_1.userSettings) {
                    if (removeOtherKeys)
                        Settings_1.userSettings = {};
                    Object.assign(Settings_1.userSettings, namevaluepair);
                }
                if (scope == "allusers" && Settings_1.allusersSettings) {
                    if (removeOtherKeys)
                        Settings_1.allusersSettings = {};
                    Object.assign(Settings_1.allusersSettings, namevaluepair);
                }
                return await RemoteObject_1.RemoteObject.docall(this, this.saveAll, props, scope, removeOtherKeys, context);
            }
            else {
                //@ts-ignore
                var man = await Serverservice_1.serverservices.db;
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
__decorate([
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __param(1, (0, Validator_1.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Settings, "remove", null);
__decorate([
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(0, (0, Validator_1.ValidateIsString)()),
    __param(2, (0, Validator_1.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object, typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object, String, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Settings, "save", null);
__decorate([
    (0, Validator_1.ValidateFunctionParameter)(),
    __param(1, (0, Validator_1.ValidateIsIn)({ in: ["browser", "user", "allusers"] })),
    __param(2, (0, Validator_1.ValidateIsBoolean)({ optional: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, RemoteObject_1.Context]),
    __metadata("design:returntype", Promise)
], Settings, "saveAll", null);
Settings = Settings_1 = __decorate([
    (0, Registry_1.$Class)("jassijs.remote.Settings")
], Settings);
exports.Settings = Settings;
var settings = new Settings();
exports.settings = settings;
function $SettingsDescriptor() {
    return function (pclass) {
        Registry_2.default.register("$SettingsDescriptor", pclass);
    };
}
exports.$SettingsDescriptor = $SettingsDescriptor;
async function autostart() {
    await Settings.load();
}
exports.autostart = autostart;
async function test(t) {
    try {
        await Settings.load();
        var settings = new Settings();
        await Settings.remove("antestsetting", "user");
        await Settings.remove("antestsetting", "browser");
        await Settings.remove("antestsetting", "allusers");
        t.expectEqual(settings.gets("antestsetting") === undefined);
        await Settings.load();
        t.expectEqual(settings.gets("antestsetting") === undefined);
        await Settings.save("antestsetting", "1", "allusers");
        t.expectEqual(settings.gets("antestsetting") === "1");
        await Settings.load();
        t.expectEqual(settings.gets("antestsetting") === "1");
        await Settings.save("antestsetting", "2", "user");
        t.expectEqual(settings.gets("antestsetting") === "2");
        await Settings.load();
        t.expectEqual(settings.gets("antestsetting") === "2");
        await Settings.save("antestsetting", "3", "browser");
        t.expectEqual(settings.gets("antestsetting") === "3");
        await Settings.load();
        t.expectEqual(settings.gets("antestsetting") === "3");
    }
    catch (ex) {
        throw ex;
    }
    finally {
        await Settings.remove("antestsetting", "user");
        await Settings.remove("antestsetting", "browser");
        await Settings.remove("antestsetting", "allusers");
    }
}
exports.test = test;
async function load() {
    return Settings.load();
}
exports.load = load;
//# sourceMappingURL=Settings.js.map