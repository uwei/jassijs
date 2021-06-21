import { TestOrderDetails } from "tests/remote/TestOrderDetails";
import { TestCustomer } from "tests/remote/TestCustomer";
import { TestOrder } from "tests/remote/TestOrder";
import { Test } from "jassijs/remote/Test";
import { Database } from "jassijs/remote/Database";
import { DBObject } from "jassijs/remote/DBObject";
import { classes } from "jassijs/remote/Classes";
import { User } from "jassijs/remote/security/User";
import { Group } from "jassijs/remote/security/Group";
import { ParentRight } from "jassijs/remote/security/ParentRight";
import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";


export async function clearDB(test: Test) {
     await RemoteProtocol.simulateUser();
    var obs = await TestOrderDetails.find();
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
    obs = await TestOrder.find();
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
    obs = await TestCustomer.find();
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
    obs = await User.find({ email: "testuser@dbtests" });
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
    obs = await Group.find({ id: -85485425 });
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
    obs = await ParentRight.find({ classname: "tests.TestCustomer" });
    for (var x = 0; x < obs.length; x++) {
        await obs[x].remove();
    }
   
}

export async function insertSample(test: Test) {
    var c1 = new TestCustomer();
    c1.id = 1;
    c1.name = "Max";
    await c1.save();
    var c2 = new TestCustomer();
    c2.id = 2;
    c2.name = "Meier";
    await c2.save();
    var c3 = new TestCustomer();
    c3.id = 3;
    c3.name = "Schulze";
    await c3.save();

    var d1 = new TestOrderDetails();
    d1.id = 1;
    await d1.save();
    var d2 = new TestOrderDetails();
    d2.id = 2;
    await d2.save();
    var d3 = new TestOrderDetails();
    d3.id = 3;
    await d3.save();
    var d4 = new TestOrderDetails();
    d4.id = 4;
    await d4.save();
    var o = new TestOrder();
    o.customer = c1;
    o.id = 1;
    o.details = [d1, d2];
    await o.save();

    var o2 = new TestOrder();
    o2.id = 2;
    o2.customer = c1;
    o2.details = [d3];
    await o2.save();

    var o3 = new TestOrder();
    o3.id = 3;
    o3.customer = c2;
    o2.details = [d4];
    await o3.save();

    test.expectEqual((await TestCustomer.find()).length === 3);
    test.expectEqual((await TestOrder.find()).length === 3);
    test.expectEqual((await TestOrderDetails.find()).length === 4);
}
async function testRelations(test: Test) {
    DBObject.clearCache("tests.TestCustomer");
    DBObject.clearCache("tests.TestOrder");
    DBObject.clearCache("tests.TestOrderDetails");
    var o = new TestOrder();
    o.id = 1;
    await test.expectErrorAsync(async () => { await o.save() });
    var a = <TestOrder>await TestOrder.findOne(1);

    o = new TestOrder();
    o.id = 1;
    await test.expectErrorAsync(async () => { await o.save() });

    test.expectEqual(a.customer === undefined && a.details === undefined);
    var b = <TestOrder>await TestOrder.findOne({ id: 1, relations: ["customer"] });
    test.expectEqual(a === b);
    b.removeFromCache();
    b = <TestOrder>await TestOrder.findOne({ id: 1, relations: ["customer"] });
    test.expectEqual(a !== b);
    test.expectEqual(a.customer !== undefined && a.details === undefined);
    b = <TestOrder>await TestOrder.findOne({ id: 1, relations: ["*"] });
    test.expectEqual(b.customer !== undefined && b.details !== undefined);
    test.expectEqual(b.details[0].Order === undefined);
    b = <TestOrder>await TestOrder.findOne({ id: 1, relations: ["details.Order"] });
    test.expectEqual(b.customer !== undefined && b.details !== undefined);
    test.expectEqual(b.details[0].Order !== undefined);


}
async function testParentRights(test: Test) {
    var user = new User();
    user.email = "testuser@dbtests";
    user.password = "hallo";
    await user.save();
    console.log(user.id);
    
    var group = new Group();
    group.id = -85485425;
    group.name = "Group"
    await group.save();
    var t2 = await Group.findOne(-85485425);
    user.groups = [group];
    await user.save();

    var sec = new ParentRight();
    sec.classname = "tests.TestCustomer";
    sec.name = "TestCustomers";
    sec.i1 = 1;
    sec.i2 = 1;
    sec.groups = [group];
    await sec.save();
    DBObject.clearCache("tests.TestCustomer");
    DBObject.clearCache("tests.TestOrder");
    DBObject.clearCache("tests.TestOrderDetails");
    console.log("simulate User "+user.id);
    var allus=await User.find({relations:["groups"]});
    var allg=await Group.find();
    var allr=await ParentRight.find();


     await RemoteProtocol.simulateUser(user.email, user.password);
    
   

    var kunden = await TestCustomer.find();
    test.expectEqual(kunden.length === 1);
    
    var orders=await TestOrder.find();
    test.expectEqual(orders.length === 2);
   
    var ordersd=await TestOrderDetails.find();
    test.expectEqual(ordersd.length === 3);
     await RemoteProtocol.simulateUser();
 

}
export async function test(test: Test) {
    DBObject.clearCache("tests.TestCustomer");
    DBObject.clearCache("tests.TestOrder");
    DBObject.clearCache("tests.TestOrderDetails");
    await clearDB(test);
    try {
        await insertSample(test);
        await testRelations(test);
        await testParentRights(test);
    } catch (err) {
        throw err;
    } finally {
        await clearDB(test);
    }
}