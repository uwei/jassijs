declare module "demo/DelTest" {
    export function test(): any;
}
<<<<<<< HEAD
declare module "demo/Dialog1" {
    import { HTMLComponent } from "jassijs/ui/Component";
    import { Component, SimpleComponentProperties } from "jassijs/ui/Component";
    type Refs = {
        sdf?: HTMLComponent;
    };
    interface DialogProperties extends SimpleComponentProperties {
        sampleProp?: string;
    }
    export class Dialog1 extends Component<DialogProperties> {
        refs: Refs;
        constructor(props?: DialogProperties);
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/Dialog2" {
    export function test(): any;
=======
declare module "demo/Dialog2" {
    import { Button } from "jassijs/ui/Button";
    import { Table } from "jassijs/ui/Table";
    import { Textbox } from "jassijs/ui/Textbox";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        boxpanel?: Panel;
        button?: Button;
        button2?: Button;
        textbox?: Textbox;
        table?: Table;
    };
    export class Dialog2 extends Panel {
        me: Me;
        data: string;
        constructor(data: any);
        layout(me: Me): void;
    }
    export function test(): unknown;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
}
declare module "demo/Dialog7" {
    import { Panel } from "jassijs/ui/Panel";
    export class Dialog7 extends Panel {
        constructor();
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/Dialog8" {
    import { Panel } from "jassijs/ui/Panel";
    export class Dialog7 extends Panel {
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/ExistsIfTest" {
    import { Component } from "jassijs/ui/Component";
    export class PlaceholderComponentNotExists extends Component {
        inactiveNode: React.ReactNode;
        constructor(properties: any);
        render(): any;
    }
    export function test(): unknown;
}
<<<<<<< HEAD
declare module "demo/ExistsIfTest2" {
    export function test(): any;
=======
declare module "demo/Dialog6" {
    import { Panel } from "jassijs/ui/Panel";
    type Me = {};
    export class Dialog6 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
}
declare module "demo/Dialog7" {
    import { Panel } from "jassijs/ui/Panel";
    export class Dialog7 extends Panel {
        constructor();
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/Dialog8" {
    import { Panel } from "jassijs/ui/Panel";
    export class Dialog7 extends Panel {
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/Dialog9" {
    import { Panel } from "jassijs/ui/Panel";
    type Me = {};
    export class Dialog9 extends Panel {
        me: Me;
        constructor();
        render(): any;
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/ExistsIfTest" {
    import { Component } from "jassijs/ui/Component";
    export class PlaceholderComponentNotExists extends Component {
        inactiveNode: React.ReactNode;
        constructor(properties: any);
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/ExistsIfTest2" {
    export function test(): any;
}
declare module "demo/hallo" {
    import { States } from "jassijs/ui/State";
    export interface MyCompProp {
        mycolor?: string;
        mytext?: string;
    }
    export function MyComp(props: MyCompProp, states?: States<MyCompProp>): any;
    export function test(): any;
}
declare module "demo/hallo2" {
    export function test(): any;
}
declare module "demo/hallo3" {
    import { Component, ComponentProperties } from "jassijs/ui/Component";
    import { State } from "jassijs/ui/State";
    interface Prop extends ComponentProperties {
        mytext?: string;
        mycolor?: State | any;
    }
    class MyComp extends Component<Prop> {
        makeGreen(): void;
        constructor(p: Prop);
        render(): any;
    }
    export function test(): MyComp;
}
declare module "demo/hallo4" {
    import { Component, ComponentProperties } from "jassijs/ui/Component";
    interface Prop extends ComponentProperties {
        mytext?: string;
        mycolor?: string;
    }
    class MyComp extends Component<Prop> {
        constructor(p: Prop);
        render(): any;
    }
    export function test(): MyComp;
}
declare module "demo/hallo5" {
    import { Component, ComponentProperties } from "jassijs/ui/Component";
    interface MProp extends ComponentProperties {
        color?: string;
    }
    type Refs = {};
    class MyComp<Prop> extends Component<MProp> {
        refs: Refs;
        constructor(p: MProp);
        render(): any;
    }
    export function test(): MyComp<unknown>;
}
declare module "demo/hallo6" {
    export function test(): any;
}
declare module "demo/LargeReport" {
    export function test(): {
        reportdesign: {
            content: {};
        };
    };
}
declare module "demo/MemoryTest" {
    export class MemoryTest {
        MemoryTest(): any;
    }
}
declare module "demo/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
declare module "demo/Report1" {
    export function test(): {
        reportdesign: {
            background: {};
            header: {};
            footer: {};
            content: {};
        };
    };
}
declare module "demo/ReportInvoice" {
    export class ReportInvoice {
        reportdesign: {
            footer: {};
            content: {};
        };
        parameter: any;
        value: any;
        constructor();
        get title(): string;
    }
    export function test(): unknown;
}
declare module "demo/ReportInvoice2" {
    export class ReportInvoice {
        reportdesign: {
            content: {};
        };
        parameter: any;
        value: any;
        constructor();
        get title(): string;
    }
    export function test(): unknown;
}
declare module "demo/ReportStyle" {
    export function test(): unknown;
}
declare module "demo/StyleDialog" {
    import { Style } from "jassijs/ui/Style";
    import { Button } from "jassijs/ui/Button";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        button1?: Button;
        button2?: Button;
        style1?: Style;
        style2?: Style;
        style3?: Style;
    };
    export class StyleDialog extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/TableContextmenu" {
    export function test(): unknown;
}
declare module "demo/TestComponent" {
    import { Panel } from "jassijs/ui/Panel";
    export class TestComponent extends Panel {
        me: any;
        constructor();
        setdata(): any;
        get title(): string;
        layout(me: any): void;
    }
    export function test(): unknown;
}
declare module "demo/TestComputedState" {
    export function test(): any;
}
declare module "demo/Testcontextmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export class Testcontextmenu extends Panel {
        me: {};
        constructor();
        layout(me: any): void;
    }
    export function test(): unknown;
}
declare module "demo/TestContextmenu2" {
    export function test(): unknown;
}
declare module "demo/Testdatatable" {
    export function test(): unknown;
}
declare module "demo/Testdatatable1" {
    export function test(): unknown;
}
declare module "demo/Testdatatable2" {
    export function test(): unknown;
}
declare module "demo/Testdatatable3" {
    export function test(): unknown;
}
declare module "demo/TestImage" {
    export function test(): unknown;
}
declare module "demo/TestJSX" {
    export function test(): any;
}
declare module "demo/TestList" {
    export function test(): unknown;
}
declare module "demo/Testmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export class Testmenu extends Panel {
        me: {};
        constructor();
        layout(me: any): void;
    }
}
declare module "demo/TestProTable" {
    export function test(): unknown;
}
declare module "demo/TestStatebinder" {
    import { Component, ComponentProperties } from "jassijs/ui/Component";
    import { StateDatabinder } from "jassijs/ui/StateBinder";
    interface Invoice {
        title?: string;
        customer?: Customer;
        positions?: Position[];
    }
    interface Customer {
        name: string;
        id: number;
    }
    interface Position {
        id?: number;
        text?: string;
    }
    interface Props2 extends ComponentProperties {
        invoice?: Invoice;
        invoices?: Invoice[];
        currentPosition?: Position;
    }
    class TestStatebinder extends Component<Props2> {
        stateBinder: StateDatabinder;
        constructor(props: Props2);
        render(): any;
    }
    export function test(): TestStatebinder;
}
declare module "demo/Testtable" {
    export function test(): unknown;
}
declare module "demo/TestTree" {
    import { Panel } from "jassijs/ui/Panel";
    export class TestTree extends Panel {
        constructor();
        layout(): void;
    }
    export function test(): unknown;
}
declare module "demo/TestUpload" {
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Upload } from "jassijs/ui/Upload";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        upload1?: Upload;
        htmlpanel1?: HTMLPanel;
    };
    export class TestUpload extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/TreeContextmenu" {
    export function test(): unknown;
}
declare module "demo/TreeTable" {
    import { Panel } from "jassijs/ui/Panel";
    import { Table } from "jassijs/ui/Table";
    class Me {
        tab: Table;
    }
    export class TreeTable extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
        layoutalt(me: Me): void;
    }
    export function test(): unknown;
}
declare var a: number;
