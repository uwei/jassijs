var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/base/Actions", "jassijs_editor/util/Typescript", "jassijs/ui/Component", "jassijs/ui/BoxPanel", "jassijs/base/Windows", "jassijs/ui/HTMLPanel", "jassijs/base/Errors", "jassijs/ui/ErrorPanel"], function (require, exports, Jassi_1, Actions_1, Typescript_1, Component_1, BoxPanel_1, Windows_1, HTMLPanel_1, Errors_1, ErrorPanel_1) {
    "use strict";
    var TestAction_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tests = exports.Test = exports.TestAction = void 0;
    class MyContainer extends BoxPanel_1.BoxPanel {
        constructor() {
            super(...arguments);
            this.alltests = 0;
            this.failedtests = 0;
            this.finished = false;
        }
        update() {
            if (this.failedtests === 0) {
            }
            this.statustext.css({
                color: (this.failedtests === 0 ? "green" : "red")
            });
            this.statustext.value = (this.finished ? "Finished " : "test... ") + this.alltests + " Tests. " + (this.failedtests) + " Tests failed.";
        }
    }
    let TestAction = TestAction_1 = class TestAction {
        static async testNode(all, container = undefined) {
            var isRoot = false;
            if (container === undefined) {
                container = new MyContainer();
                Windows_1.default.add(container, "Tests");
                container.statustext = new HTMLPanel_1.HTMLPanel();
                container.add(container.statustext);
                isRoot = true;
            }
            Errors_1.Errors.errors.onerror((err) => {
                var newerrorpanel = new ErrorPanel_1.ErrorPanel(false, false, false);
                newerrorpanel.addError(err);
                container.add(newerrorpanel);
            }, container._id);
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
                        try {
                            if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                                console.log("test " + file.fullpath);
                                var func = (await new Promise((resolve_1, reject_1) => { require([file.fullpath.substring(0, file.fullpath.length - 3)], resolve_1, reject_1); })).test;
                                if (typeof func === "function") {
                                    container.alltests++;
                                    container.update();
                                    var ret = await func(new Test());
                                    if (ret instanceof Component_1.Component) {
                                        $(ret.dom).css({ position: "relative" });
                                        ret.width = "100%";
                                        var head = new HTMLPanel_1.HTMLPanel();
                                        head.value = "<b>" + file.fullpath + "</b>";
                                        container.add(head);
                                        container.add(ret);
                                    }
                                }
                            }
                        }
                        catch (err) {
                            var newerrorpanel = new ErrorPanel_1.ErrorPanel(false, false, false);
                            newerrorpanel.addError({
                                error: err
                            });
                            newerrorpanel.css({
                                background_color: "red"
                            });
                            container.add(newerrorpanel);
                            container.failedtests++;
                            container.update();
                        }
                    }
                }
            }
            if (isRoot) {
                container.finished = true;
                container.update();
            }
            Errors_1.Errors.errors.offerror(container._id);
        }
    };
    __decorate([
        Actions_1.$Action({
            name: "Test"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, MyContainer]),
        __metadata("design:returntype", Promise)
    ], TestAction, "testNode", null);
    TestAction = TestAction_1 = __decorate([
        Actions_1.$ActionProvider("jassijs.remote.FileNode"),
        Jassi_1.$Class("jassijs.ui.TestAction")
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
        /**
        * fails if the func does not throw an error
        * @parameter func - the function that should failed
        **/
        async expectErrorAsync(func) {
            var errors = false;
            try {
                var errobj;
                await func().then((e) => {
                }).catch((e) => {
                    errors = true;
                });
            }
            catch (_a) {
                errors = true;
            }
            if (!errors)
                throw new Error("test fails");
        }
    };
    Test = __decorate([
        Jassi_1.$Class("jassijs.base.Test")
    ], Test);
    exports.Test = Test;
    class Tests {
    }
    exports.Tests = Tests;
    //Selftest
    async function test(test) {
        test.expectEqual(1 === 1);
        test.expectError(() => {
            var h;
            h.a = 9;
        });
    }
    exports.test = test;
});
//# sourceMappingURL=Tests.js.map