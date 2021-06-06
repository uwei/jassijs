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
            var oclass = vdata[0].constructor;
            var ret = [];
            /*men.text = actions[x].name;
                    men.icon = actions[x].icon;
                    men.onclick(function (evt) {
                        ac.run([node]);
                    });*/
            var sclass = Classes_1.classes.getClassName(oclass);
            var allclasses = (await Registry_1.default.getJSONData("$ActionProvider")).filter(entr => entr.params[0] === sclass);
            await Registry_1.default.loadAllFilesForEntries(allclasses);
            let data = Registry_1.default.getData("$ActionProvider");
            for (let x = 0; x < allclasses.length; x++) {
                var entr = allclasses[x];
                var mem = Registry_1.default.getMemberData("$Action")[entr.classname];
                for (let name in mem) {
                    let ac = mem[name][0][0];
                    if (ac.isEnabled !== undefined && ((await ac.isEnabled(vdata)) === false))
                        continue;
                    ret.push({
                        name: ac.name,
                        icon: ac.icon,
                        call: ac.run ? ac.run : Classes_1.classes.getClass(entr.classname)[name]
                    });
                }
                mem = Registry_1.default.getMemberData("$Actions")[entr.classname];
                for (let name in mem) {
                    let acs = await Classes_1.classes.getClass(entr.classname)[name]();
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
            return ret;
        }
    };
    Actions = __decorate([
        Jassi_1.$Class("jassijs.base.Actions")
    ], Actions);
    exports.Actions = Actions;
    async function test() {
    }
    exports.test = test;
});
//# sourceMappingURL=Actions.js.map