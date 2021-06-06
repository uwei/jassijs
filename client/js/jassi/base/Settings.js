var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Registry", "jassijs/ui/Property", "jassijs/remote/RemoteObject"], function (require, exports, jassijs_1, Registry_1, Property_1, RemoteObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.$SettingDescriptor = exports.settings = exports.Settings = void 0;
    const proxyhandler = {
        get: function (target, prop, receiver) {
            return prop;
        }
    };
    let Settings = class Settings extends RemoteObject_1.RemoteObject {
        constructor() {
            super(...arguments);
            this.keys = new Proxy({}, proxyhandler); //the Proxy allwas give the key back
            this.browserSettings = undefined;
            this.userSettings = undefined;
            this.alluserSettings = undefined;
        }
        /**
        * loads the settings
        */
        static async load(context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this.load, context);
            }
            else {
                //@ts-ignore
                var man = await (await new Promise((resolve_1, reject_1) => { require(["jassijs/server/DBManager"], resolve_1, reject_1); })).DBManager.get();
                return man.find(context, this, { "id": "admin" });
            }
        }
        gets(name) {
            var test = window.localStorage.getItem("jassijs.settings");
            if (!test)
                return undefined;
            else {
                let ob = JSON.parse(test);
                return ob[name];
            }
        }
        async remove(name, scope) {
            var test = window.localStorage.getItem("jassijs.settings");
            var props = {};
            if (!test)
                props = JSON.parse(test);
            delete props[name];
            window.localStorage.setItem("jassijs.settings", JSON.stringify(props));
        }
        static async save(name, value, scope) {
            let ob = {};
            //@ts-ignore
            ob[name] = value;
            return await this.saveAll(ob, scope);
        }
        static async saveAll(namevaluepair, scope, context = undefined) {
            if (scope === "user" || "allusers") {
                if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                    return await this.call(this.saveAll, namevaluepair, scope, context);
                }
                else {
                    //@ts-ignore
                    var man = await (await new Promise((resolve_2, reject_2) => { require(["jassijs/server/DBManager"], resolve_2, reject_2); })).DBManager.get();
                    return man.find(context, this, { "id": "admin" });
                }
            }
            /*  var test = window.localStorage.getItem("jassijs.settings");
              var props = {};
              if (test)
                  props = JSON.parse(test);
              Object.assign(props, namevaluepair);
              window.localStorage.setItem("jassijs.settings", JSON.stringify(props));*/
        }
    };
    Settings = __decorate([
        jassijs_1.$Class("jassijs.remote.Settings")
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
    let MySettings = class MySettings {
    };
    __decorate([
        Property_1.$Property({ name: "Development/Default Editor", chooseFrom: ["ace", "monaco"] }),
        __metadata("design:type", String)
    ], MySettings.prototype, "Development_DefaultEditor", void 0);
    MySettings = __decorate([
        jassijs_1.$Class("MySettings")
    ], MySettings);
    async function test() {
        await Settings.load();
        //await settings.save(settings.keys.Development_DefaultEditor, "ace", "browser");
        //console.log(await settings.gets(settings.keys.Development_DefaultEditor));
    }
    exports.test = test;
});
//# sourceMappingURL=Settings.js.map