declare module "northwind/remote/Categories" {
    import { Products } from "northwind/remote/Products";
    import { DBObject } from "jassijs/remote/DBObject";
    export class Categories extends DBObject {
        id: number;
        constructor();
        CategoryName: string;
        Description: string;
        Picture: string;
        Products: Products;
    }
    export function test(): any;
}
declare module "northwind/remote/Customer" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class Customer extends DBObject {
        id: string;
        CompanyName: string;
        ContactName: string;
        ContactTitle: string;
        Address: string;
        City: string;
        Region: string;
        PostalCode: string;
        Country: string;
        Phone: string;
        Fax: string;
        constructor();
    }
    export function test(): any;
}
declare module "northwind/remote/Employees" {
    import { DBObject } from "jassijs/remote/DBObject";
    import { Context } from "jassijs/remote/RemoteObject";
    export class Employees extends DBObject {
        id: number;
        constructor();
        LastName: string;
        FirstName: string;
        Title: string;
        TitleOfCourtesy: string;
        Address: string;
        City: string;
        Region: string;
        PostalCode: string;
        Country: string;
        HomePhone: string;
        Extension: string;
        Photo: string;
        Notes: string;
        PhotoPath: string;
        ReportsTo: Employees;
        BirthDate: Date;
        HireDate: Date;
        static find(options?: any, context?: Context): Promise<Employees[]>;
    }
    export function test(): any;
    export function test2(): any;
}
declare module "northwind/remote/OrderDetails" {
    import { Products } from "northwind/remote/Products";
    import { Orders } from "northwind/remote/Orders";
    import { DBObject } from "jassijs/remote/DBObject";
    export class OrderDetails extends DBObject {
        id: number;
        constructor();
        Order: Orders;
        Product: Products;
        UnitPrice: number;
        Quantity: number;
        Discount: number;
    }
    export function test(): any;
}
declare module "northwind/remote/Orders" {
    import { OrderDetails } from "northwind/remote/OrderDetails";
    import { Employees } from "northwind/remote/Employees";
    import { Customer } from "northwind/remote/Customer";
    import { DBObject } from "jassijs/remote/DBObject";
    import { Shippers } from "northwind/remote/Shippers";
    export class Orders extends DBObject {
        id: number;
        constructor();
        Customer: Customer;
        Employee: Employees;
        OrderDate: Date;
        RequiredDate: Date;
        ShippedDate: Date;
        ShipVia: Shippers;
        Freight: number;
        ShipName: string;
        ShipAddress: string;
        ShipCity: string;
        ShipRegion: string;
        ShipPostalCode: string;
        ShipCountry: string;
        Details: OrderDetails[];
    }
    export function test(): any;
}
declare module "northwind/remote/Products" {
    import { Categories } from "northwind/remote/Categories";
    import { Suppliers } from "northwind/remote/Suppliers";
    import { DBObject } from "jassijs/remote/DBObject";
    export class Products extends DBObject {
        id: number;
        constructor();
        ProductName: string;
        Supplier: Suppliers;
        Category: Categories;
        QuantityPerUnit: string;
        UnitPrice: number;
        UnitsInStock: number;
        UnitsOnOrder: number;
        ReorderLevel: number;
        Discontinued: boolean;
    }
    export function test(): any;
}
declare module "northwind/remote/Shippers" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class Shippers extends DBObject {
        id: number;
        constructor();
        CompanyName: string;
        Phone: string;
    }
    export function test(): any;
}
declare module "northwind/remote/Suppliers" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class Suppliers extends DBObject {
        id: number;
        constructor();
        CompanyName: string;
        ContactName: string;
        ContactTitle: string;
        Address: string;
        City: string;
        Region: string;
        PostalCode: string;
        Country: string;
        Phone: string;
        Fax: string;
        HomePage: string;
    }
    export function test(): any;
}
declare module "northwind/SampleServerReport" {
    export class SampleServerReport {
        content: any;
        layout(me: any): void;
        run(data: any, param: any): any;
    }
}
declare module "northwind/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
