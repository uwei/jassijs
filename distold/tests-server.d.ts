declare module "tests/remote/T" {
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    export class T extends RemoteObject {
        sayHello(name: string, context?: Context): unknown;
    }
    export function test(): any;
    export function test2(): any;
}
declare module "tests/remote/TestBigData" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class TestBigData extends DBObject {
        id: number;
        constructor();
        name: string;
        name2: string;
        number1: number;
        number2: number;
    }
}
declare module "tests/remote/TestCustomer" {
    import { TestOrder } from "tests/remote/TestOrder";
    import { DBObject } from "jassijs/remote/DBObject";
    export class TestCustomer extends DBObject {
        id: number;
        constructor();
        name: string;
        orders: TestOrder[];
    }
    export function test(): any;
}
declare module "tests/remote/TestOrder" {
    import { TestOrderDetails } from "tests/remote/TestOrderDetails";
    import { TestCustomer } from "tests/remote/TestCustomer";
    import { DBObject } from "jassijs/remote/DBObject";
    export class TestOrder extends DBObject {
        id: number;
        constructor();
        customer: TestCustomer;
        details: TestOrderDetails[];
    }
    export function test(): any;
}
declare module "tests/remote/TestOrderDetails" {
    import { TestOrder } from "tests/remote/TestOrder";
    import { DBObject } from "jassijs/remote/DBObject";
    export class TestOrderDetails extends DBObject {
        id: number;
        constructor();
        Order: TestOrder;
    }
    export function test(): any;
}
declare module "tests/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
