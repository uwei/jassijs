import { $Class } from "jassijs/remote/Jassi";
import registry from "jassijs/remote/Registry";

import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { Setting } from "jassijs/remote/security/Setting";
import { Test } from "jassijs/base/Tests";


declare global {
    export interface KnownSettings {

    }
}
const proxyhandler = {
    get: function (target, prop, receiver) {
        return prop;
    }
};

@$Class("jassijs.remote.Settings")
export class Settings extends RemoteObject {
    public static keys: KnownSettings = new Proxy({}, proxyhandler);//the Proxy allwas give the key back
    private static browserSettings = undefined;
    private static userSettings = undefined;
    private static allusersSettings = undefined;
    /**
    * loads the settings
    */
    static async load(context: Context = undefined) {

        if (!context?.isServer) {
            //browser
            let entr = window.localStorage.getItem("jassijs.settings");
            if (entr) {
                Settings.browserSettings = JSON.parse(entr);
            } else
                Settings.browserSettings = {};
            var all = await this.call(this.load, context);
            if (all.user) {
                Settings.userSettings = JSON.parse(all.user.data);
            } else
                Settings.userSettings = {};
            if (all.allusers) {
                Settings.allusersSettings = JSON.parse(all.allusers.data);
            } else
                Settings.allusersSettings = {};

        } else {
            //@ts-ignore
            var man = await (await import("jassijs/server/DBManager")).DBManager.get();
            var id = context.request.user.user;
            return {
                user: await man.findOne(context, Setting, { "id": 1 }),
                allusers: await man.findOne(context, Setting, { "id": 0 }),
            }
        }
    }
    static getAll(scope: "browser" | "user" | "allusers") {
        var ret = {};
        if (scope === "browser") {
            Object.assign(ret, Settings.browserSettings);
        }
        if (scope === "user") {
            Object.assign(ret, Settings.userSettings);
        }
        if (scope === "allusers") {
            Object.assign(ret, Settings.allusersSettings);
        }
        return ret;
    }
    static gets<T>(Settings_key: T): T {
        if (Settings.browserSettings && Settings.browserSettings[Settings_key])
            return Settings.browserSettings[Settings_key];
        if (Settings.userSettings && Settings.userSettings[Settings_key])
            return Settings.userSettings[Settings_key];
        if (Settings.allusersSettings && Settings.allusersSettings[Settings_key])
            return Settings.allusersSettings[Settings_key];
        return undefined;
    }
    static async remove(Settings_key: string, scope: "browser" | "user" | "allusers", context: Context = undefined) {
        if (scope === "browser") {
            delete Settings.browserSettings[Settings_key];
            window.localStorage.setItem("jassijs.settings", JSON.stringify(Settings.browserSettings));
        }
        if (scope === "user" || scope === "allusers") {
            if (!context?.isServer) {
                if (scope == "user" && Settings.userSettings)
                    delete Settings.userSettings[Settings_key];
                if (scope == "allusers" && Settings.allusersSettings)
                    delete Settings.allusersSettings[Settings_key];
                this.call(this.remove, Settings_key, scope, context);

            } else {
                //@ts-ignore
                var man = await (await import("jassijs/server/DBManager")).DBManager.get();
                var id = context.request.user.user;
                //first load
                let entr = await man.findOne(context, Setting, { "id": (scope === "user" ? id : 0) });

                if (entr !== undefined) {
                    var data = JSON.parse(entr.data);
                    delete data[Settings_key];
                    entr.data = JSON.stringify(data);
                    await man.save(context, entr);
                }
            }
        }
    }

    static async save<T>(Settings_key: T, value: T, scope: "browser" | "user" | "allusers") {
        let ob = {};
        //@ts-ignore
        ob[Settings_key] = value;
        return await this.saveAll(ob, scope);
    }
    static async saveAll(namevaluepair: { [key: string]: any }, scope: "browser" | "user" | "allusers", removeOtherKeys = false, context: Context = undefined) {
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
                Settings.browserSettings = {};
            Object.assign(Settings.browserSettings, namevaluepair);
        }
        if (scope === "user" || scope === "allusers") {
            if (!context?.isServer) {
                var props = {};
                Object.assign(props, namevaluepair);

                if (scope == "user" && Settings.userSettings) {
                    if (removeOtherKeys)
                        Settings.userSettings = {};
                    Object.assign(Settings.userSettings, namevaluepair);
                }
                if (scope == "allusers" && Settings.allusersSettings) {
                    if (removeOtherKeys)
                        Settings.allusersSettings = {};
                    Object.assign(Settings.allusersSettings, namevaluepair);
                }
                return await this.call(this.saveAll, props, scope, removeOtherKeys, context);
            } else {
                //@ts-ignore
                var man = await (await import("jassijs/server/DBManager")).DBManager.get();
                var id = context.request.user.user;
                //first load
                let entr = await man.findOne(context, Setting, { "id": (scope === "user" ? id : 0) });
                var data = namevaluepair;
                if (removeOtherKeys !== true) {
                    if (entr !== undefined) {
                        data = JSON.parse(entr.data);
                        Object.assign(data, namevaluepair);
                    }
                }
                var newsetting = new Setting();
                newsetting.id = (scope === "user" ? id : 0);
                newsetting.data = JSON.stringify(data);
                return await man.save(context, newsetting);
                //return man.find(context, this, { "id": "admin" });
            }
        }
    }
}
var settings = new Settings();
export { settings };
export function $SettingsDescriptor(): Function {
    return function (pclass) {
        registry.register("$SettingsDescriptor", pclass);
    }
}


export async function autostart() {
    await Settings.load();
}

export async function test(t: Test) {
    try {
        await Settings.remove("antestsetting", "user");
        await Settings.remove("antestsetting", "browser");
        await Settings.remove("antestsetting", "allusers");
          t.expectEqual(Settings.gets("antestsetting") === undefined);
        await Settings.load();
        t.expectEqual(Settings.gets("antestsetting") === undefined);

        await Settings.save("antestsetting", "1", "allusers");
        t.expectEqual(<string>Settings.gets("antestsetting") === "1");
        await Settings.load();
        t.expectEqual(<string>Settings.gets("antestsetting") === "1");

        await Settings.save("antestsetting", "2", "user");
        t.expectEqual(<string>Settings.gets("antestsetting") === "2");
        await Settings.load();
        t.expectEqual(<string>Settings.gets("antestsetting") === "2");

        await Settings.save("antestsetting", "3", "browser");
        t.expectEqual(<string>Settings.gets("antestsetting") === "3");
        await Settings.load();
        t.expectEqual(<string>Settings.gets("antestsetting") === "3");
    } catch (ex) {
      

        throw ex;
    } finally {
        await Settings.remove("antestsetting", "user");
        await Settings.remove("antestsetting", "browser");
        await Settings.remove("antestsetting", "allusers");
    }

}