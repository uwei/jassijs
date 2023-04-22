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
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
}
declare module "northwind/CategoriesView" {
    import { Table } from "jassijs/ui/Table";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { Textarea } from "jassijs/ui/Textarea";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Panel } from "jassijs/ui/Panel";
    import { Categories } from "northwind/remote/Categories";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        boxpanel1?: BoxPanel;
        Id?: Textbox;
        name?: Textbox;
        description?: Textarea;
        panel1?: Panel;
        table1?: Table;
    } & DBObjectViewMe;
    export class CategoriesView extends DBObjectView {
        me: Me;
        value: Categories;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<CategoriesView>;
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
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
    export function test2(): Promise<void>;
}
declare module "northwind/remote/Shippers" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class Shippers extends DBObject {
        id: number;
        constructor();
        CompanyName: string;
        Phone: string;
    }
    export function test(): Promise<void>;
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
    export function test(): Promise<void>;
}
declare module "northwind/CustomerOrders" {
    import { Table } from "jassijs/ui/Table";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Databinder } from "jassijs/ui/Databinder";
    import { ObjectChooser } from "jassijs/ui/ObjectChooser";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        IDChooseCustomer?: ObjectChooser;
        databinderCustomer?: Databinder;
        htmlpanel?: HTMLPanel;
        boxpanel?: BoxPanel;
        boxpanel2?: BoxPanel;
        htmlpanel2?: HTMLPanel;
        IDOrders?: Table;
        databinderOrder?: Databinder;
        table?: Table;
    };
    export class CustomerOrders extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
        static showDialog(): void;
        customerChanged(): Promise<void>;
        setData(): Promise<void>;
    }
    export function test(): Promise<CustomerOrders>;
}
declare module "northwind/CustomerPhoneList" {
    import { Table } from "jassijs/ui/Table";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        table?: Table;
    };
    export class CustomerPhoneList extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
        setData(): Promise<void>;
        static showDialog(): void;
    }
    export function test(): Promise<CustomerPhoneList>;
}
declare module "northwind/CustomerView" {
    import { Textbox } from "jassijs/ui/Textbox";
    import { Customer } from "northwind/remote/Customer";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        id?: Textbox;
        companyname?: Textbox;
        contacttitle?: Textbox;
        contactname?: Textbox;
        address?: Textbox;
        postalcode?: Textbox;
        textbox1?: Textbox;
        region?: Textbox;
        textbox2?: Textbox;
        phone?: Textbox;
        fax?: Textbox;
    } & DBObjectViewMe;
    export class CustomerView extends DBObjectView {
        me: Me;
        value: Customer;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<CustomerView>;
}
declare module "northwind/DetailTest" {
    import { OrderDetails } from "northwind/remote/OrderDetails";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    import { Textbox } from "jassijs/ui/Textbox";
    type Me = {
        textbox1?: Textbox;
    } & DBObjectViewMe;
    export class DetailTest extends DBObjectView {
        me: Me;
        value: OrderDetails;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<DetailTest>;
}
declare module "northwind/EmployeesView" {
    import { ObjectChooser } from "jassijs/ui/ObjectChooser";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Image } from "jassijs/ui/Image";
    import { Textarea } from "jassijs/ui/Textarea";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Employees } from "northwind/remote/Employees";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        firstName?: Textbox;
        lastName?: Textbox;
        title?: Textbox;
        titleOfCouttesy?: Textbox;
        address?: Textbox;
        postalCode?: Textbox;
        city?: Textbox;
        region?: Textbox;
        state?: Textbox;
        birthDate?: Textbox;
        hiredate?: Textbox;
        homephone?: Textbox;
        notes?: Textarea;
        image1?: Image;
        photoPath?: Textbox;
        id?: Textbox;
        reportsTo?: HTMLPanel;
        objectchooser1?: ObjectChooser;
    } & DBObjectViewMe;
    export class EmployeesView extends DBObjectView {
        me: Me;
        value: Employees;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<EmployeesView>;
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
        static dummy(): Promise<void>;
        static showDialog(): Promise<void>;
        startImport(): Promise<void>;
        layout(me: Me): void;
    }
    export function test(): Promise<ImportData>;
}
declare module "northwind/OrdersView" {
    import { Style } from "jassijs/ui/Style";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { Repeater } from "jassijs/ui/Repeater";
    import { ObjectChooser } from "jassijs/ui/ObjectChooser";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Panel } from "jassijs/ui/Panel";
    import { Orders } from "northwind/remote/Orders";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        boxpanel1?: BoxPanel;
        panel1?: Panel;
        shipName?: Textbox;
        shipAddress?: Textbox;
        shipPostalCode?: Textbox;
        shipCity?: Textbox;
        shipCountry?: Textbox;
        shipRegion?: Textbox;
        panel2?: Panel;
        id?: Textbox;
        freight?: Textbox;
        panel3?: Panel;
        customername?: HTMLPanel;
        choosecustomer?: ObjectChooser;
        shipVia?: HTMLPanel;
        shipviaChooser?: ObjectChooser;
        employeename?: HTMLPanel;
        chooseEmployee?: ObjectChooser;
        orderDate?: Textbox;
        requiredDate?: Textbox;
        shippedDate?: Textbox;
        boxpanel2?: BoxPanel;
        htmlpanel1?: HTMLPanel;
        htmlpanel2?: HTMLPanel;
        repeater1?: Repeater;
        detailsQuantity?: Textbox;
        detailsProduct?: HTMLPanel;
        objectchooser1?: ObjectChooser;
        style1?: Style;
    } & DBObjectViewMe;
    export class OrdersView extends DBObjectView {
        me: Me;
        value: Orders;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<OrdersView>;
}
declare module "northwind/ProductList" {
    import { Checkbox } from "jassijs/ui/Checkbox";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Repeater } from "jassijs/ui/Repeater";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Databinder } from "jassijs/ui/Databinder";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        databinder?: Databinder;
        repeater?: Repeater;
        textbox?: Textbox;
        htmlpanel?: HTMLPanel;
        checkbox?: Checkbox;
        htmlpanel3?: HTMLPanel;
        boxpanel?: BoxPanel;
        panel?: Panel;
        boxpanel2?: BoxPanel;
        htmlpanel2?: HTMLPanel;
        textbox2?: Textbox;
        htmlpanel22?: HTMLPanel;
        textbox22?: Textbox;
    };
    export class ProductList extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
        static showDialog(): void;
        setData(): Promise<void>;
    }
    export function test(): Promise<ProductList>;
}
declare module "northwind/ProductView" {
    import { Style } from "jassijs/ui/Style";
    import { ObjectChooser } from "jassijs/ui/ObjectChooser";
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Checkbox } from "jassijs/ui/Checkbox";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Products } from "northwind/remote/Products";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        id?: Textbox;
        productName?: Textbox;
        quantityPerUnit?: Textbox;
        unitPrice?: Textbox;
        unitsInStock?: Textbox;
        unitsOnOrder?: Textbox;
        reorderLevel?: Textbox;
        discontinued?: Checkbox;
        category?: HTMLPanel;
        categoryChooser?: ObjectChooser;
        supplier?: HTMLPanel;
        supplierchooser?: ObjectChooser;
        styleNumber?: Style;
    } & DBObjectViewMe;
    export class ProductView extends DBObjectView {
        me: Me;
        value: Products;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<ProductView>;
}
declare module "northwind/ShippersView" {
    import { Textbox } from "jassijs/ui/Textbox";
    import { Shippers } from "northwind/remote/Shippers";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        id?: Textbox;
        phone?: Textbox;
        companyName?: Textbox;
    } & DBObjectViewMe;
    export class ShippersView extends DBObjectView {
        me: Me;
        value: Shippers;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<ShippersView>;
}
declare module "northwind/SuppliersView" {
    import { Textbox } from "jassijs/ui/Textbox";
    import { Suppliers } from "northwind/remote/Suppliers";
    import { DBObjectView, DBObjectViewMe } from "jassijs/ui/DBObjectView";
    type Me = {
        id?: Textbox;
        homepage?: Textbox;
        fax?: Textbox;
        phone?: Textbox;
        Country?: Textbox;
        region?: Textbox;
        city?: Textbox;
        postalCode?: Textbox;
        address?: Textbox;
        contactTitle?: Textbox;
        contactName?: Textbox;
        companyName?: Textbox;
    } & DBObjectViewMe;
    export class SuppliersView extends DBObjectView {
        me: Me;
        value: Suppliers;
        constructor();
        get title(): string;
        layout(me: Me): void;
    }
    export function test(): Promise<SuppliersView>;
}
declare module "northwind/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
declare module "northwind/reports/CustomerLabels" {
    import { Report } from "jassijs_report/Report";
    export class CustomerLabels extends Report {
        country?: string;
        fill(): Promise<{
            reportdesign: {
                content: {
                    table: {
                        dontBreakRows: boolean;
                        widths: string[];
                        body: any[];
                    };
                    layout: string;
                }[];
            };
        }>;
        static dummy(): Promise<void>;
    }
    export function test(): Promise<{
        reportdesign: {
            content: {
                table: {
                    dontBreakRows: boolean;
                    widths: string[];
                    body: any[];
                };
                layout: string;
            }[];
        };
    }>;
}
