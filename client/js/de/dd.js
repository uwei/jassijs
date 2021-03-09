define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class Test {
        test(id) {
            var test = id;
            for (var x = 1; x < 1000; y++) {
                var ob = Context.get("meintest");
            }
            return ob.hallo;
        }
    }
    async function c() {
        var err = new Error();
        return 1;
    }
    async function b() {
        var p = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(5);
            }, 100);
        });
        return c();
    }
    async function a() {
        return await b();
    }
    async function test() {
        debugger;
        /*var t=new Test();
        var context=new Context();
        var r=context.register("meintest",{hallo:9},async ()=>{
            return t.test(8);
        });
        alert(await r);
        context.destroy();*/
    }
    exports.test = test;
});
//# sourceMappingURL=dd.js.map