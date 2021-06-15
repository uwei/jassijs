define(["require", "exports", "tests/remote/TestOrderDetails", "tests/remote/TestCustomer", "tests/remote/TestOrder", "jassijs/remote/DBObject", "jassijs/remote/security/User", "jassijs/remote/security/Group", "jassijs/remote/security/ParentRight", "jassijs/remote/RemoteProtocol"], function (require, exports, TestOrderDetails_1, TestCustomer_1, TestOrder_1, DBObject_1, User_1, Group_1, ParentRight_1, RemoteProtocol_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.insertSample = exports.clearDB = void 0;
    async function clearDB(test) {
        await RemoteProtocol_1.RemoteProtocol.simulateUser();
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
        obs = await User_1.User.find({ email: "testuser@dbtests" });
        for (var x = 0; x < obs.length; x++) {
            await obs[x].remove();
        }
        obs = await Group_1.Group.find({ id: -85485425 });
        for (var x = 0; x < obs.length; x++) {
            await obs[x].remove();
        }
        obs = await ParentRight_1.ParentRight.find({ classname: "tests.TestCustomer" });
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
        o2.details = [d3];
        await o2.save();
        var o3 = new TestOrder_1.TestOrder();
        o3.id = 3;
        o3.customer = c2;
        o2.details = [d4];
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
        var o = new TestOrder_1.TestOrder();
        o.id = 1;
        await test.expectErrorAsync(async () => { await o.save(); });
        var a = await TestOrder_1.TestOrder.findOne(1);
        o = new TestOrder_1.TestOrder();
        o.id = 1;
        await test.expectErrorAsync(async () => { await o.save(); });
        test.expectEqual(a.customer === undefined && a.details === undefined);
        var b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["customer"] });
        test.expectEqual(a === b);
        b.removeFromCache();
        b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["customer"] });
        test.expectEqual(a !== b);
        test.expectEqual(a.customer !== undefined && a.details === undefined);
        b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["*"] });
        test.expectEqual(b.customer !== undefined && b.details !== undefined);
        test.expectEqual(b.details[0].Order === undefined);
        b = await TestOrder_1.TestOrder.findOne({ id: 1, relations: ["details.Order"] });
        test.expectEqual(b.customer !== undefined && b.details !== undefined);
        test.expectEqual(b.details[0].Order !== undefined);
    }
    async function testParentRights(test) {
        var user = new User_1.User();
        user.email = "testuser@dbtests";
        user.password = "hallo";
        await user.save();
        console.log(user.id);
        var group = new Group_1.Group();
        group.id = -85485425;
        group.name = "Group";
        await group.save();
        var t2 = await Group_1.Group.findOne(-85485425);
        user.groups = [group];
        await user.save();
        var sec = new ParentRight_1.ParentRight();
        sec.classname = "tests.TestCustomer";
        sec.name = "TestCustomers";
        sec.i1 = 1;
        sec.i2 = 1;
        sec.groups = [group];
        await sec.save();
        DBObject_1.DBObject.clearCache("tests.TestCustomer");
        DBObject_1.DBObject.clearCache("tests.TestOrder");
        DBObject_1.DBObject.clearCache("tests.TestOrderDetails");
        console.log("simulate User " + user.id);
        var allus = await User_1.User.find({ relations: ["groups"] });
        var allg = await Group_1.Group.find();
        var allr = await ParentRight_1.ParentRight.find();
        await RemoteProtocol_1.RemoteProtocol.simulateUser(user.email, user.password);
        var kunden = await TestCustomer_1.TestCustomer.find();
        test.expectEqual(kunden.length === 1);
        var orders = await TestOrder_1.TestOrder.find();
        test.expectEqual(orders.length === 2);
        var ordersd = await TestOrderDetails_1.TestOrderDetails.find();
        test.expectEqual(ordersd.length === 3);
        await RemoteProtocol_1.RemoteProtocol.simulateUser();
    }
    async function test(test) {
        DBObject_1.DBObject.clearCache("tests.TestCustomer");
        DBObject_1.DBObject.clearCache("tests.TestOrder");
        DBObject_1.DBObject.clearCache("tests.TestOrderDetails");
        await clearDB(test);
        try {
            await insertSample(test);
            await testRelations(test);
            await testParentRights(test);
        }
        catch (err) {
            throw err;
        }
        finally {
            await clearDB(test);
        }
    }
    exports.test = test;
});
//# sourceMappingURL=DBTests.js.map