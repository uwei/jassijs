var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/remote/Jassi", "jassijs/remote/Classes"], function (require, exports, Registry_1, Jassi_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Actions = exports.$ActionProvider = exports.$Action = exports.$Actions = exports.ActionProperties = void 0;
    class ActionProperties {
    }
    exports.ActionProperties = ActionProperties;
    /**
     * usage
     * @$Actions()
     * static test():ActionProperties[]{
     * }
     */
    function $Actions() {
        return function (target, propertyKey, descriptor) {
            Registry_1.default.registerMember("$Actions", target, propertyKey);
        };
    }
    exports.$Actions = $Actions;
    function $Action(property) {
        return function (target, propertyKey, descriptor) {
            Registry_1.default.registerMember("$Action", target, propertyKey, property);
        };
    }
    exports.$Action = $Action;
    function $ActionProvider(longclassname) {
        return function (pclass) {
            Registry_1.default.register("$ActionProvider", pclass);
        };
    }
    exports.$ActionProvider = $ActionProvider;
    let Actions = class Actions {
        static async getActionsFor(vdata) {
            var _a, _b, _c, _d;
            //var oclass = vdata[0].constructor;
            var ret = [];
            /*men.text = actions[x].name;
                    men.icon = actions[x].icon;
                    men.onclick(function (evt) {
                        ac.run([node]);
                    });*/
            var sclass = Classes_1.classes.getClassName(vdata[0]);
            var allclasses = (await Registry_1.default.getJSONData("$ActionProvider")).filter(entr => entr.params[0] === sclass);
            //await registry.loadAllFilesForEntries(allclasses);
            //let data = registry.getData("$ActionProvider");
            for (let x = 0; x < allclasses.length; x++) {
                var entr = allclasses[x];
                var mem = Registry_1.default.getJSONMemberData("$Action")[entr.classname];
                for (let name in mem) {
                    let ac = mem[name][0][0];
                    if (ac.isEnabled !== undefined || ac.run !== undefined) { //we musst load the class
                        await Classes_1.classes.loadClass(entr.classname);
                        ac = Registry_1.default.getMemberData("$Action")[entr.classname][name][0][0];
                    }
                    if (ac.isEnabled !== undefined) {
                        if ((await ac.isEnabled(vdata)) === false)
                            continue;
                    }
                    let sclassname = entr.classname;
                    let sname = name;
                    ret.push({
                        name: ac.name,
                        icon: ac.icon,
                        call: ac.run ? ac.run : async (...param) => {
                            (await Classes_1.classes.loadClass(sclassname))[sname](...param);
                        }
                    });
                }
                mem = Registry_1.default.getJSONMemberData("$Actions")[entr.classname];
                for (let name in mem) {
                    let acs = await (await Classes_1.classes.loadClass(entr.classname))[name]();
                    for (let x = 0; x < acs.length; x++) {
                        let ac = acs[x];
                        if (ac.isEnabled !== undefined && ((await ac.isEnabled(vdata)) === false))
                            continue;
                        ret.push({
                            name: ac.name,
                            icon: ac.icon,
                            call: ac.run
                        });
                    }
                }
            }
            if ((_b = (_a = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _a === void 0 ? void 0 : _a.Server) === null || _b === void 0 ? void 0 : _b.filterActions) {
                var test = (_d = (_c = jassijs === null || jassijs === void 0 ? void 0 : jassijs.options) === null || _c === void 0 ? void 0 : _c.Server) === null || _d === void 0 ? void 0 : _d.filterActions[sclass];
                var filterd = [];
                if (test) {
                    for (var x = 0; x < ret.length; x++) {
                        if (test.indexOf(ret[x].name) !== -1) {
                            filterd.push(ret[x]);
                        }
                    }
                    ret = filterd;
                }
            }
            return ret;
        }
    };
    Actions = __decorate([
        (0, Jassi_1.$Class)("jassijs.base.Actions")
    ], Actions);
    exports.Actions = Actions;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=Actions.js.map