var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define("tests/DBTests", ["require", "exports", "tests/remote/TestOrderDetails", "tests/remote/TestCustomer", "tests/remote/TestOrder", "jassijs/remote/DBObject", "jassijs/remote/security/User", "jassijs/remote/security/Group", "jassijs/remote/security/ParentRight", "jassijs/remote/RemoteProtocol"], function (require, exports, TestOrderDetails_1, TestCustomer_1, TestOrder_1, DBObject_1, User_1, Group_1, ParentRight_1, RemoteProtocol_1) {
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
define("tests/FileActionsTests", ["require", "exports", "jassijs/ui/FileExplorer", "jassijs/remote/FileNode", "jassijs/remote/Server"], function (require, exports, FileExplorer_1, FileNode_1, Server_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(t) {
        var tests = new FileNode_1.FileNode("tests");
        tests.files = [];
        try {
            var code = `export function testfunc(){return 2;}`;
            await FileExplorer_1.FileActions.newFile([tests], "TestFile.ts", code, false);
            var testcode = await new Server_1.Server().loadFile("tests/TestFile.ts");
            t.expectEqual(testcode === code);
            await new Server_1.Server().saveFile("tests/TestFile.ts", code);
            //@ts-ignore
            var imp = (await new Promise((resolve_1, reject_1) => { require(["tests/TestFile"], resolve_1, reject_1); })).testfunc;
            t.expectEqual(imp() === 2);
            var file = new FileNode_1.FileNode("tests/TestFile.ts");
            await FileExplorer_1.FileActions.dodelete([file], false);
            await FileExplorer_1.FileActions.newFolder([tests], "testfolder");
            var tf = new FileNode_1.FileNode("tests/testfolder");
            tf.parent = tests;
            tf.files = [];
            await FileExplorer_1.FileActions.rename([tf], "testfolder2");
            var tf2 = new FileNode_1.FileNode("tests/testfolder2");
            tf2.files = [];
            await FileExplorer_1.FileActions.download([tf2]);
            await FileExplorer_1.FileActions.dodelete([tf2], false);
        }
        catch (err) {
            throw err;
        }
        finally {
            try {
                new Server_1.Server().delete("tests/TestFile.ts");
            }
            catch (_a) {
            }
            try {
                new Server_1.Server().delete("tests/testfolder");
            }
            catch (_b) {
            }
            try {
                new Server_1.Server().delete("tests/testfolder2");
            }
            catch (_c) {
            }
        }
    }
    exports.test = test;
});
define("tests/RemoteModulTests", ["require", "exports", "jassijs/remote/FileNode", "jassijs/remote/Server", "jassijs/remote/Classes", "jassijs/remote/Registry", "jassijs/ui/DatabaseDesigner", "jassijs/remote/DBObject", "jassijs/remote/DatabaseTools"], function (require, exports, FileNode_2, Server_2, Classes_1, Registry_1, DatabaseDesigner_1, DBObject_2, DatabaseTools_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function test(teste) {
        try {
            await new Server_2.Server().createModule("testrmodul");
            await new Server_2.Server().createFolder("testrmodul/remote");
            await new Server_2.Server().saveFile("testrmodul/remote/TestRModul.ts", `import { $Class } from "jassijs/remote/Jassi";
import { Context, RemoteObject } from "jassijs/remote/RemoteObject";

@$Class("testrmodul.remote.TestRModul")
export class TestRModul extends RemoteObject{
    //this is a sample remote function
    public async sayHello(name: string,context: Context = undefined) {
        if (!context?.isServer) {
            return await this.call(this, this.sayHello, name,context);
        } else {
            return "Hello "+name;  //this would be execute on server  
        }
    }
}`);
            //create new DB Object
            var ret = new DatabaseDesigner_1.DatabaseDesigner(false);
            await ret.readSchema();
            await ret.addClass("testrmodul.TestRCustomer");
            await ret.addField("string", "name");
            var sr = await ret.saveAll(false);
            teste.expectEqual(sr === "");
            ret.destroy();
            await Registry_1.default.reload();
            var ro = await new (await Classes_1.classes.loadClass("testrmodul.remote.TestRModul"))().sayHello("you");
            teste.expectEqual(ro === "Hello you");
            var TestRCustomer = await Classes_1.classes.loadClass("testrmodul.TestRCustomer");
            DBObject_2.DBObject.clearCache("testrmodul.TestRCustomer");
            var cust = new TestRCustomer();
            cust.id = 52;
            cust.name = "Hallo";
            await cust.save();
            var tcust = await TestRCustomer.findOne();
            //@ts-ignore
            teste.expectEqual((tcust === null || tcust === void 0 ? void 0 : tcust.name) === "Hallo");
            await tcust.remove();
        }
        catch (err) {
            throw err;
        }
        finally {
            var root = new FileNode_2.FileNode("");
            root.files = [];
            await new Server_2.Server().delete("testrmodul");
            await new Server_2.Server().removeServerModul("testrmodul");
            try {
                var hh = await DatabaseTools_1.DatabaseTools.dropTables(["testrmodul_testrcustomer"]);
            }
            catch (err) {
            }
        }
    }
    exports.test = test;
});
define("tests/modul", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {};
});
//this file is autogenerated don't modify
define("tests/registry", ["require"], function (require) {
    return {
        default: {
            "tests/DBTests.ts": {
                "date": 1624296651725
            },
            "tests/FileActionsTests.ts": {
                "date": 1624296373069
            },
            "tests/remote/T.ts": {
                "date": 1625333609235,
                "tests.remote.T": {}
            },
            "tests/remote/TestCustomer.ts": {
                "date": 1623488386702,
                "tests.TestCustomer": {
                    "$ParentRights": [
                        [
                            {
                                "name": "TestCustomers",
                                "sqlToCheck": "me.id>=:i1 and me.id<=:i2",
                                "description": {
                                    "text": "TestCustomer",
                                    "i1": "from",
                                    "i2": "to"
                                }
                            }
                        ]
                    ],
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "name": {
                            "Column": [
                                {
                                    "nullable": true
                                }
                            ]
                        },
                        "orders": {
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "tests/remote/TestOrder.ts": {
                "date": 1623488474823,
                "tests.TestOrder": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "customer": {
                            "$CheckParentRight": [],
                            "ManyToOne": [
                                "function"
                            ]
                        },
                        "details": {
                            "OneToMany": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "tests/remote/TestOrderDetails.ts": {
                "date": 1623488500029,
                "tests.TestOrderDetails": {
                    "$DBObject": [],
                    "@members": {
                        "id": {
                            "PrimaryColumn": []
                        },
                        "Order": {
                            "$CheckParentRight": [],
                            "ManyToOne": [
                                "function",
                                "function"
                            ]
                        }
                    }
                }
            },
            "tests/remote/TestServerfile.ts": {
                "date": 1624999036922
            },
            "tests/RemoteModulTests.ts": {
                "date": 1625513478377
            },
            "tests/TestReport.ts": {
                "date": 1623864072454
            }
        }
    };
});
define("tests/remote/T", ["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/RemoteObject", "jassijs/remote/Server"], function (require, exports, Jassi_1, RemoteObject_1, Server_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test2 = exports.test = exports.T = void 0;
    let T = class T extends RemoteObject_1.RemoteObject {
        //this is a sample remote function
        async sayHello(name, context = undefined) {
            if (!(context === null || context === void 0 ? void 0 : context.isServer)) {
                return await this.call(this, this.sayHello, name, context);
            }
            else {
                var H = await new Promise((resolve_2, reject_2) => { require(["Hallo"], resolve_2, reject_2); });
                return "Hello " + name + H.test(); //this would be execute on server  
            }
        }
    };
    T = __decorate([
        (0, Jassi_1.$Class)("tests.remote.T")
    ], T);
    exports.T = T;
    async function test() {
        await new Server_3.Server().saveFile("Hallo.ts", "export class Hallo{};export function test(){return 2 };", true);
        console.log(await new T().sayHello("Kurt"));
    }
    exports.test = test;
    async function test2() {
    }
    exports.test2 = test2;
});
define("tests/remote/TestCustomer", ["require", "exports", "tests/remote/TestOrder", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights"], function (require, exports, TestOrder_2, DBObject_3, Jassi_2, DatabaseSchema_1, Rights_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestCustomer = void 0;
    let TestCustomer = class TestCustomer extends DBObject_3.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_1.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], TestCustomer.prototype, "id", void 0);
    __decorate([
        (0, DatabaseSchema_1.Column)({ nullable: true }),
        __metadata("design:type", String)
    ], TestCustomer.prototype, "name", void 0);
    __decorate([
        (0, DatabaseSchema_1.OneToMany)(type => TestOrder_2.TestOrder, order => order.customer),
        __metadata("design:type", Array)
    ], TestCustomer.prototype, "orders", void 0);
    TestCustomer = __decorate([
        (0, Rights_1.$ParentRights)([{ name: "TestCustomers", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
                description: {
                    text: "TestCustomer",
                    i1: "from",
                    i2: "to"
                } }]),
        (0, DBObject_3.$DBObject)(),
        (0, Jassi_2.$Class)("tests.TestCustomer"),
        __metadata("design:paramtypes", [])
    ], TestCustomer);
    exports.TestCustomer = TestCustomer;
    async function test() {
    }
    exports.test = test;
    ;
});
define("tests/remote/TestOrder", ["require", "exports", "tests/remote/TestOrderDetails", "tests/remote/TestCustomer", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights"], function (require, exports, TestOrderDetails_2, TestCustomer_2, DBObject_4, Jassi_3, DatabaseSchema_2, Rights_2) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestOrder = void 0;
    let TestOrder = class TestOrder extends DBObject_4.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_2.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], TestOrder.prototype, "id", void 0);
    __decorate([
        (0, Rights_2.$CheckParentRight)(),
        (0, DatabaseSchema_2.ManyToOne)(type => TestCustomer_2.TestCustomer),
        __metadata("design:type", typeof (_a = typeof TestCustomer_2.TestCustomer !== "undefined" && TestCustomer_2.TestCustomer) === "function" ? _a : Object)
    ], TestOrder.prototype, "customer", void 0);
    __decorate([
        (0, DatabaseSchema_2.OneToMany)(type => TestOrderDetails_2.TestOrderDetails, e => e.Order),
        __metadata("design:type", Array)
    ], TestOrder.prototype, "details", void 0);
    TestOrder = __decorate([
        (0, DBObject_4.$DBObject)(),
        (0, Jassi_3.$Class)("tests.TestOrder"),
        __metadata("design:paramtypes", [])
    ], TestOrder);
    exports.TestOrder = TestOrder;
    async function test() {
    }
    exports.test = test;
    ;
});
define("tests/remote/TestOrderDetails", ["require", "exports", "tests/remote/TestOrder", "jassijs/remote/DBObject", "jassijs/remote/Jassi", "jassijs/util/DatabaseSchema", "jassijs/remote/security/Rights"], function (require, exports, TestOrder_3, DBObject_5, Jassi_4, DatabaseSchema_3, Rights_3) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.TestOrderDetails = void 0;
    let TestOrderDetails = class TestOrderDetails extends DBObject_5.DBObject {
        constructor() {
            super();
        }
    };
    __decorate([
        (0, DatabaseSchema_3.PrimaryColumn)(),
        __metadata("design:type", Number)
    ], TestOrderDetails.prototype, "id", void 0);
    __decorate([
        (0, Rights_3.$CheckParentRight)(),
        (0, DatabaseSchema_3.ManyToOne)(type => TestOrder_3.TestOrder, e => e.details),
        __metadata("design:type", typeof (_a = typeof TestOrder_3.TestOrder !== "undefined" && TestOrder_3.TestOrder) === "function" ? _a : Object)
    ], TestOrderDetails.prototype, "Order", void 0);
    TestOrderDetails = __decorate([
        (0, DBObject_5.$DBObject)(),
        (0, Jassi_4.$Class)("tests.TestOrderDetails"),
        __metadata("design:paramtypes", [])
    ], TestOrderDetails);
    exports.TestOrderDetails = TestOrderDetails;
    async function test() {
    }
    exports.test = test;
    ;
});
//# sourceMappingURL=tests.js.map