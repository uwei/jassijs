define(["require", "exports", "tests/remote/TestBigData", "jassijs/remote/Transaction"], function (require, exports, TestBigData_1, Transaction_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    async function test() {
        for (var x = 0; x < 10000; x++) {
            var trans = new Transaction_1.Transaction();
            for (var i = 1; i < 10000; i++) {
                var e = new TestBigData_1.TestBigData();
                e.name = makeid(200);
                e.name2 = makeid(200);
                e.number1 = getRandomInt(99999999);
                e.number2 = getRandomInt(99999999);
                trans.add(e, e.save);
            }
            console.log(x);
            await trans.execute();
        }
    }
    exports.test = test;
});
//# sourceMappingURL=BigDataTest.js.map