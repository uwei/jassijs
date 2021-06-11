import { TestOrderDetails } from "tests/remote/TestOrderDetails";
import { TestCustomer } from "tests/remote/TestCustomer";
import { TestOrder } from "tests/remote/TestOrder";
import { Test } from "jassijs/base/Tests";
import { Database } from "jassijs/remote/Database";
import { DBObject } from "jassijs/remote/DBObject";
import { classes } from "jassijs/remote/Classes";


export async function clearDB(test:Test){
    var obs=await TestOrderDetails.find();
    for(var x=0;x<obs.length;x++){
        await obs[x].remove();
    }
    obs=await TestOrder.find();
    for(var x=0;x<obs.length;x++){
        await obs[x].remove();
    }
    obs=await TestCustomer.find();
    for(var x=0;x<obs.length;x++){
        await obs[x].remove();
    }
}

export async function insertSample(test:Test){
    var c1=new TestCustomer();
    c1.id=1;
    c1.name="Max";
    await c1.save();
    var c2=new TestCustomer();
    c2.id=2;
    c2.name="Meier";
    await c2.save();
    var c3=new TestCustomer();
    c3.id=3;
    c3.name="Schulze";
    await c3.save();

    var d1=new TestOrderDetails();
    d1.id=1;
    await d1.save();
    var d2=new TestOrderDetails();
    d2.id=2;
    await d2.save();
    var d3=new TestOrderDetails();
    d3.id=3;
    await d3.save();
    var d4=new TestOrderDetails();
    d4.id=4;
    await d4.save();
    var o=new TestOrder();
    o.customer=c1;
    o.id=1;
    o.details=[d1,d2];
    await o.save();

    var o2=new TestOrder();
    o2.id=2;
    o2.customer=c1;
    o2.details=[d3,d4];
    await o2.save();

    var o3=new TestOrder();
    o3.id=3;
    o3.customer=c2;
    await o3.save();

    test.expectEqual((await TestCustomer.find()).length===3);
    test.expectEqual((await TestOrder.find()).length===3);
    test.expectEqual((await TestOrderDetails.find()).length===4);
}
async function testRelations(test:Test){
    DBObject.clearCache("tests.TestCustomer");
    DBObject.clearCache("tests.TestOrder");
    DBObject.clearCache("tests.TestOrderDetails");
    var a=<TestOrder>await TestOrder.findOne(1);
    
    test.expectEqual(a.customer===undefined&&a.details===undefined);
    var b=<TestOrder>await TestOrder.findOne({id:1,relations:["customer"]});
    test.expectEqual(a===b);
    test.expectEqual(a.customer!==undefined&&a.details===undefined);
    b=<TestOrder>await TestOrder.findOne({id:1,relations:["*"]});
    test.expectEqual(a.customer!==undefined&&a.details!==undefined);
}

export async function test(test:Test){
    DBObject.clearCache("tests.TestCustomer");
    DBObject.clearCache("tests.TestOrder");
    DBObject.clearCache("tests.TestOrderDetails");
    await clearDB(test);
    try{
        await insertSample(test);
        await testRelations(test);
    }finally{
        await clearDB(test);
    }
}