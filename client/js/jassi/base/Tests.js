var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "remote/jassi/base/Jassi", "jassi/base/Actions", "jassi_editor/util/Typescript", "jassi/ui/Component", "jassi/ui/Container", "jassi/ui/BoxPanel", "jassi/base/Windows", "jassi/ui/HTMLPanel"], function (require, exports, Jassi_1, Actions_1, Typescript_1, Component_1, Container_1, BoxPanel_1, Windows_1, HTMLPanel_1) {
    "use strict";
    var TestAction_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Tests = exports.Test = exports.TestAction = void 0;
    let TestAction = TestAction_1 = class TestAction {
        static async testNode(all, container = undefined) {
            //var isRoot=false;
            if (container === undefined) {
                container = new BoxPanel_1.BoxPanel();
                Windows_1.default.add(container, "Tests");
                //	isRoot=true;
            }
            for (var x = 0; x < all.length; x++) {
                var file = all[x];
                if (file.isDirectory()) {
                    await TestAction_1.testNode(file.files, container);
                }
                else {
                    await Typescript_1.default.initService();
                    var text = Typescript_1.default.getCode(file.fullpath);
                    if (text !== undefined) {
                        text = text.toLowerCase();
                        console.log("test " + file.fullpath);
                        if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                            var func = (await new Promise((resolve_1, reject_1) => { require([file.fullpath.substring(0, file.fullpath.length - 3)], resolve_1, reject_1); })).test;
                            if (typeof func === "function") {
                                var ret = await func(new Test());
                                if (ret instanceof Component_1.Component) {
                                    $(ret.dom).css({ position: "relative" });
                                    ret.width = 400;
                                    var head = new HTMLPanel_1.HTMLPanel();
                                    head.value = "<b>" + file.fullpath + "</b>";
                                    container.add(head);
                                    container.add(ret);
                                }
                            }
                        }
                    }
                }
            }
            // if(isRoot&&container._components.length>0){
            //  }
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Test"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, Container_1.Container]),
        __metadata("design:returntype", Promise)
    ], TestAction, "testNode", null);
    TestAction = TestAction_1 = __decorate([
        Actions_1.$ActionProvider("jassi.base.FileNode"),
        Jassi_1.$Class("jassi.ui.TestAction")
    ], TestAction);
    exports.TestAction = TestAction;
    let Test = class Test {
        /**
         * fails if the condition is false
         * @parameter condition
         **/
        expectEqual(condition) {
            if (!condition)
                throw new Error("Test fails");
        }
        /**
         * fails if the func does not throw an error
         * @parameter func - the function that should failed
         **/
        expectError(func) {
            try {
                if (func.toString().startsWith("async ")) {
                    var errobj;
                    try {
                        throw new Error("test fails");
                    }
                    catch (err) {
                        errobj = err;
                    }
                    func().then(() => {
                        throw errobj;
                    }).catch((err) => {
                        if (err.message === "test fails")
                            throw errobj;
                        var k = 1; //io
                    });
                    return;
                }
                else {
                    func();
                }
            }
            catch (_a) {
                return; //io
            }
            throw new Error("test fails");
        }
    };
    Test = __decorate([
        Jassi_1.$Class("jassi.base.Test")
    ], Test);
    exports.Test = Test;
    class Tests {
    }
    exports.Tests = Tests;
});
//# sourceMappingURL=Tests.js.map