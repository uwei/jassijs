define(["require", "exports", "jassijs/remote/Context"], function (require, exports, Context_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class A {
        async h() {
            return await this.h2();
        }
        async h2() {
            var _a;
            console.log('Aktueller StackContext:' + ((_a = (0, Context_1.getStackContext)()) === null || _a === void 0 ? void 0 : _a.sessionId));
            return "Ok";
        }
    }
    async function test2() {
        return await new A().h();
    }
    async function test() {
        const hallo = await (0, Context_1.useStackContext)({ sessionId: 'abc-124' }, async () => {
            // await new Promise(res => setTimeout(res, 10));
            return test2();
        });
        console.log(hallo);
    }
    exports.test = test;
});
//# sourceMappingURL=Context2.js.map