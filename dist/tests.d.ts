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
declare module "tests/BigDataTest" {
    export function test2(): Promise<void>;
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
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
}
declare module "tests/remote/TestOrderDetails" {
    import { TestOrder } from "tests/remote/TestOrder";
    import { DBObject } from "jassijs/remote/DBObject";
    export class TestOrderDetails extends DBObject {
        id: number;
        constructor();
        Order: TestOrder;
    }
    export function test(): Promise<void>;
}
declare module "tests/DBTests" {
    import { Test } from "jassijs/remote/Test";
    export function clearDB(test: Test): Promise<void>;
    export function insertSample(test: Test): Promise<void>;
    export function test(test: Test): Promise<void>;
}
declare module "tests/FileActionsTests" {
    import { Test } from "jassijs/remote/Test";
    export function test(t: Test): Promise<void>;
}
declare module "tests/RemoteModulTests" {
    import { Test } from "jassijs/remote/Test";
    export function test(teste: Test): Promise<void>;
}
declare module "tests/ServerTests" {
    import { Test } from "jassijs/remote/Test";
    export function test(tests: Test): Promise<void>;
}
declare module "tests/TestDialog" {
    import { Button } from "jassijs/ui/Button";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        button?: Button;
    };
    export class TestDialog extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): Promise<TestDialog>;
}
declare module "tests/modul" {
    const _default: {};
    export default _default;
}
declare module "tests/remote/T" {
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    export class T extends RemoteObject {
        sayHello(name: string, context?: Context): Promise<any>;
    }
    export function test(): Promise<void>;
    export function test2(): Promise<void>;
}
