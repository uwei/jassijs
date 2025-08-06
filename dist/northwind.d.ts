declare module "northwind/CategoriesView" {
    import { Categories } from "northwind/remote/Categories";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class CategoriesView extends DBObjectView<Categories> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
declare module "northwind/CustomerOrders" {
    import { Customer } from "northwind/remote/Customer";
    import { Orders } from "northwind/remote/Orders";
    import { DBObjectView, DBObjectViewProperties } from "jassijs/ui/DBObjectView";
    export interface CustomerOrdersProperties extends DBObjectViewProperties<Customer> {
        orders?: Orders[];
        order?: Orders;
    }
    export class CustomerOrders extends DBObjectView<Customer, CustomerOrdersProperties> {
        constructor(props?: CustomerOrdersProperties);
        render(): any;
        static showDialog(): void;
        customerChanged(): any;
        set value(value: Customer);
        initData(): any;
    }
    export function test(): unknown;
}
declare module "northwind/CustomerPhoneList" {
    import { Table } from "jassijs/ui/Table";
    import { Component, ComponentProperties } from "jassijs/ui/Component";
    type Me = {
        table?: Table;
    };
    export class CustomerPhoneList extends Component<ComponentProperties> {
        refs: Me;
        constructor(props?: {});
        render(): any;
        setData(): any;
        static showDialog(): void;
    }
    export function test(): unknown;
}
declare module "northwind/CustomerView" {
    import { Customer } from "northwind/remote/Customer";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class CustomerView extends DBObjectView<Customer> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
declare module "northwind/EmployeesView" {
    import { Employees } from "northwind/remote/Employees";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class EmployeesView extends DBObjectView<Employees> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
declare module "northwind/ImportData" {
    import { Button } from "jassijs/ui/Button";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        htmlpanel1?: HTMLPanel;
        IDImport?: Button;
        htmlpanel2?: HTMLPanel;
        IDProtokoll?: HTMLPanel;
    };
    export class ImportData extends Panel {
        me: Me;
        constructor();
        static dummy(): any;
        static showDialog(): any;
        startImport(): any;
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "northwind/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
declare module "northwind/OrdersView" {
    import { Textbox } from "jassijs/ui/Textbox";
    import { Orders } from "northwind/remote/Orders";
    import { DBObjectView, DBObjectViewProperties } from "jassijs/ui/DBObjectView";
    import { OrderDetails } from "northwind/remote/OrderDetails";
    type Me = {
        shipName?: Textbox;
        shipAddress?: Textbox;
        shipPostalCode?: Textbox;
        shipCity?: Textbox;
        shipCountry?: Textbox;
        shipRegion?: Textbox;
    };
    interface OrdersViewProperties extends DBObjectViewProperties<Orders> {
        activeDetail?: OrderDetails;
    }
    export class OrdersView extends DBObjectView<Orders, OrdersViewProperties> {
        refs: Me;
        render(): any;
        get title(): string;
    }
    export function test(): unknown;
}
declare module "northwind/ProductList" {
    import { Panel, PanelProperties } from "jassijs/ui/Panel";
    import { Products } from "northwind/remote/Products";
    interface ProductListProperties extends PanelProperties {
        values?: Products[];
    }
    export class ProductList extends Panel<ProductListProperties> {
        constructor(props?: ProductListProperties);
        render(): any;
        static showDialog(): void;
        setData(): any;
    }
    export function test(): unknown;
}
declare module "northwind/ProductView" {
    import { Products } from "northwind/remote/Products";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class ProductView extends DBObjectView<Products> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
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
declare module "northwind/remote/MyTest" {
    export function test(): any;
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
    import { Context } from "jassijs/remote/RemoteObject";
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
        static findAllWithDetails(context: Context): Promise<Orders[]>;
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
declare module "northwind/reports/CustomerLabels" {
    import { Report } from "jassijs_report/Report";
    export class CustomerLabels extends Report {
        country?: string;
        fill(): unknown;
        static dummy(): any;
    }
    export function test(): unknown;
}
declare module "northwind/ShippersView" {
    import { Shippers } from "northwind/remote/Shippers";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class ShippersView extends DBObjectView<Shippers> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
declare module "northwind/SuppliersView" {
    import { Suppliers } from "northwind/remote/Suppliers";
    import { DBObjectView } from "jassijs/ui/DBObjectView";
    export class SuppliersView extends DBObjectView<Suppliers> {
        get title(): string;
        render(): any;
    }
    export function test(): unknown;
}
