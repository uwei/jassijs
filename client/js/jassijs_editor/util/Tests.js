var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Registry", "jassijs/base/Actions", "jassijs/ui/Component", "jassijs/ui/BoxPanel", "jassijs/base/Windows", "jassijs/ui/HTMLPanel", "jassijs/base/Errors", "jassijs_editor/ErrorPanel", "jassijs/remote/Test"], function (require, exports, Registry_1, Actions_1, Component_1, BoxPanel_1, Windows_1, HTMLPanel_1, Errors_1, ErrorPanel_1, Test_1) {
    "use strict";
    var TestAction_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.Tests = exports.TestAction = void 0;
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
            this.statustext.css = {
                color: (this.failedtests === 0 ? "green" : "red")
            };
            this.statustext.value = (this.finished ? "Finished " : "test running... ") + this.alltests + " Tests. " + (this.failedtests) + " Tests failed.";
        }
    }
    let TestAction = TestAction_1 = class TestAction {
        static async testNode(all, container = undefined) {
            var _a;
            var isRoot = false;
            if (container === undefined) {
                container = new MyContainer();
                Windows_1.default.add(container, "Tests");
                container.statustext = new HTMLPanel_1.HTMLPanel();
                container.add(container.statustext);
                isRoot = true;
                Errors_1.Errors.errors.onerror((err) => {
                    try {
                        if (container.dom) { //sometimes off register was not called
                            var newerrorpanel = new ErrorPanel_1.ErrorPanel(false, false, false);
                            newerrorpanel.addError(err);
                            container.add(newerrorpanel);
                        }
                    }
                    catch (_a) {
                    }
                }, container._id);
            }
            for (var x = 0; x < all.length; x++) {
                var file = all[x];
                if (file.isDirectory()) {
                    await TestAction_1.testNode(file.files, container);
                }
                else {
                    var typescript = (await new Promise((resolve_1, reject_1) => { require(["jassijs_editor/util/Typescript"], resolve_1, reject_1); })).default;
                    await typescript.initService();
                    var text = typescript.getCode(file.fullpath);
                    if (text !== undefined) {
                        text = text.toLowerCase();
                        try {
                            if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                                console.log("test " + file.fullpath);
                                var func = (_a = (await new Promise((resolve_2, reject_2) => { require([file.fullpath.substring(0, file.fullpath.length - 3)], resolve_2, reject_2); }))) === null || _a === void 0 ? void 0 : _a.test;
                                if (typeof func === "function") {
                                    container.alltests++;
                                    container.update();
                                    var ret = await func(new Test_1.Test());
                                    if (ret instanceof Component_1.Component) {
                                        ret.dom.style.position = "relative";
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
                            if (container.dom) {
                                try {
                                    var newerrorpanel = new ErrorPanel_1.ErrorPanel(false, false, false);
                                    newerrorpanel.addError({
                                        error: err
                                    });
                                    newerrorpanel.css = {
                                        background_color: "red"
                                    };
                                    container.add(newerrorpanel);
                                    container.failedtests++;
                                    container.update();
                                }
                                catch (_b) {
                                }
                            }
                        }
                    }
                }
            }
            if (isRoot) {
                container.finished = true;
                container.update();
                Errors_1.Errors.errors.offerror(container._id);
                console.log("off error");
            }
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Run Tests"
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Array, MyContainer]),
        __metadata("design:returntype", Promise)
    ], TestAction, "testNode", null);
    TestAction = TestAction_1 = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs_editor.remote.FileNode"),
        (0, Registry_1.$Class)("jassijs_editor.ui.TestAction")
    ], TestAction);
    exports.TestAction = TestAction;
    class Tests {
    }
    exports.Tests = Tests;
    //Selftest
    async function test(tst) {
        tst.expectEqual(1 === 1);
        tst.expectError(() => {
            var h;
            h.a = 9;
        });
    }
    exports.test = test;
});
//# sourceMappingURL=Tests.js.map