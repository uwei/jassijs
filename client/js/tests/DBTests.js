define(["require", "exports", "tests/remote/TestOrderDetails", "tests/remote/TestCustomer", "tests/remote/TestOrder", "jassijs/remote/DBObject"], function (require, exports, TestOrderDetails_1, TestCustomer_1, TestOrder_1, DBObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.insertSample = exports.clearDB = void 0;
    async function clearDB(test) {
        var obs = await TestOrderDetails_1.TestOrderDetails.find();
        for (var x = 0; x < obs.length; x++) {
            await obs[x].remove();
        }
        obs = await TestOrder_1.TestOrder.find();
        for (var x = 0; x < obs.length; x++) {
            await obs[x].remove();
        }
        obs = await TestCustomer_1.TestCustomer.find();
        for (var x = 0; x < obs.length; x++) {
            await obs[x].remove();
        }
    }
    exports.clearDB = clearDB;
    async function insertSample(test) {
        var c1 = new TestCustomer_1.TestCustomer();
        c1.id = 1;
        c1.name = "Max";
        await c1.save();
        var c2 = new TestCustomer_1.TestCustomer();
        c2.id = 2;
        c2.name = "Meier";
        await c2.save();
        var c3 = new TestCustomer_1.TestCustomer();
        c3.id = 3;
        c3.name = "Schulze";
        await c3.save();
        var d1 = new TestOrderDetails_1.TestOrderDetails();
        d1.id = 1;
        await d1.save();
        var d2 = new TestOrderDetails_1.TestOrderDetails();
        d2.id = 2;
        await d2.save();
        var d3 = new TestOrderDetails_1.TestOrderDetails();
        d3.id = 3;
        await d3.save();
        var d4 = new TestOrderDetails_1.TestOrderDetails();
        d4.id = 4;
        await d4.save();
        var o = new TestOrder_1.TestOrder();
        o.customer = c1;
        o.id = 1;
        o.details = [d1, d2];
        await o.save();
        var o2 = new TestOrder_1.TestOrder();
        o2.id = 2;
        o2.customer = c1;
        o2.details = [d3, d4];
        await o2.save();
        var o3 = new TestOrder_1.TestOrder();
        o3.id = 3;
        o3.customer = c2;
        await o3.save();
        test.expectEqual((await TestCustomer_1.TestCustomer.find()).length === 3);
        test.expectEqual((await TestOrder_1.TestOrder.find()).length === 3);
        test.expectEqual((await TestOrderDetails_1.TestOrderDetails.find()).length === 4);
    }
    exports.insertSample = insertSample;
    async function testRelations(test) {
        DBObject_1.DBObject.clearCache("tests.TestCustomer");
        DBObject_1.DBObject.clearCache("tests.TestOrder");
        DBObject_1.DBObject.clearCache("tests.TestOrderDetails");
        var a = await TestOrder_1.TestOrder.findOne(1);
        test.expectEqual(a.customer === undefined && a.details === undefined);
        var b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["customer"] });
        test.expectEqual(a === b);
        test.expectEqual(a.customer !== undefined && a.details === undefined);
        b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["*"] });
        test.expectEqual(a.customer !== undefined && a.details !== undefined);
    }
    async function test(test) {
        DBObject_1.DBObject.clearCache("tests.TestCustomer");
        DBObject_1.DBObject.clearCache("tests.TestOrder");
        DBObject_1.DBObject.clearCache("tests.TestOrderDetails");
        await clearDB(test);
        try {
            await insertSample(test);
            await testRelations(test);
        }
        finally {
            await clearDB(test);
        }
    }
    exports.test = test;
});
//# sourceMappingURL=DBTests.js.map