import { $Class } from "jassijs/remote/Jassi";
import { $ActionProvider, $Action } from "jassijs/base/Actions";
import { FileNode } from "jassijs/remote/FileNode";
import typescript, { Typescript } from "jassijs_editor/util/Typescript";
import { Component } from "jassijs/ui/Component";
import { Container } from "jassijs/ui/Container";
import { BoxPanel } from "jassijs/ui/BoxPanel";
import windows from "jassijs/base/Windows";
import { HTMLPanel } from "jassijs/ui/HTMLPanel";
import { Errors } from "jassijs/base/Errors";
import { ErrorPanel } from "jassijs/ui/ErrorPanel";
import { Panel } from "jassijs/ui/Panel";



class MyContainer extends BoxPanel {
    statustext: HTMLPanel;
    alltests = 0;
    failedtests = 0;
    finished = false;
    update() {
        if (this.failedtests === 0) {

        }
        this.statustext.css({
            color: (this.failedtests === 0 ? "green" : "red")
        });
        this.statustext.value = (this.finished ? "Finished " : "test... ") + this.alltests + " Tests. " + (this.failedtests) + " Tests failed."
    }
}
@$ActionProvider("jassijs.remote.FileNode")
@$Class("jassijs.ui.TestAction")
export class TestAction {
    @$Action({
        name: "Test"
    })
    static async testNode(all: FileNode[], container: MyContainer = undefined) {

        var isRoot = false;
        if (container === undefined) {
            container = new MyContainer();
            windows.add(container, "Tests");
            container.statustext = new HTMLPanel();

            container.add(container.statustext);
            isRoot = true;
        }
        Errors.errors.onerror((err) => {
            var newerrorpanel = new ErrorPanel(false, false, false);
            newerrorpanel.addError(err);
            container.add(newerrorpanel);

        }, container._id);
        for (var x = 0; x < all.length; x++) {
            var file = all[x];
            if (file.isDirectory()) {
                await TestAction.testNode(file.files, container);

            } else {
                await typescript.initService();
                var text: string = typescript.getCode(file.fullpath);
                if (text !== undefined) {
                    text = text.toLowerCase();
                    try {
                        if (text.indexOf("export function test(") !== -1 || text.indexOf("export async function test(") !== -1) {
                            console.log("test " + file.fullpath);
                            var func = (await import(file.fullpath.substring(0, file.fullpath.length - 3))).test;
                            if (typeof func === "function") {
                                container.alltests++;
                                container.update();
                                var ret = await func(new Test());
                                if (ret instanceof Component) {
                                    $(ret.dom).css({ position: "relative" });
                                    ret.width = "100%";
                                    var head = new HTMLPanel();
                                    head.value = "<b>" + file.fullpath + "</b>";
                                    container.add(head);
                                    container.add(ret);
                                }
                            }
                        }
                    } catch (err) {
                        var newerrorpanel = new ErrorPanel(false, false, false);
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
        Errors.errors.offerror(container._id);
    }

}

@$Class("jassijs.base.Test")
export class Test {

    /**
     * fails if the condition is false
     * @parameter condition 
     **/
    expectEqual(condition: boolean) {
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
                } catch (err) {
                    errobj = err;
                }
                func().then(() => {
                    throw errobj;
                }).catch((err) => {
                    if (err.message === "test fails")
                        throw errobj;
                    var k = 1;//io
                });
                return;
            } else {
                func();
            }
        } catch {
            return;//io
        }
        throw new Error("test fails");
    }
}
export class Tests {

}

//Selftest
export async function test(test: Test) {

    test.expectEqual(1 === 1);
    test.expectError(() => {
        var h;
        h.a = 9;
    });


}