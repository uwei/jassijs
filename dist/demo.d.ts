declare module "demo/DelTest" {
    export function test(): any;
}
declare module "demo/Dialog" {
    import { Button } from "jassijs/ui/Button";
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        boxpanel1?: BoxPanel;
        button1?: Button;
        button2?: Button;
    };
    export class Dialog extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): Dialog;
}
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
    export function test(): any;
}
declare module "demo/Dialog3" {
    import { Checkbox } from "jassijs/ui/Checkbox";
    import { Panel } from "jassijs/ui/Panel";
    import { HTMLComponent } from "jassijs/ui/Component";
    type Me = {
        p1?: HTMLComponent;
        p2?: HTMLComponent;
        p3?: HTMLComponent;
        p4?: HTMLComponent;
        p5?: HTMLComponent;
        checkbox2?: Checkbox;
    };
    export class Dialog3 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/Dialog4" {
    import { Button } from "jassijs/ui/Button";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        button?: Button;
        panel?: Panel;
        button2?: Button;
    };
    export class Dialog4 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/Dialog5" {
    import { HTMLComponent, TextComponent } from "jassijs/ui/Component";
    import { Checkbox } from "jassijs/ui/Checkbox";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        div?: HTMLComponent;
        checkbox?: Checkbox;
        text?: TextComponent;
        text2?: TextComponent;
        br?: HTMLComponent;
        text3?: TextComponent;
        htmlcomponent?: HTMLComponent;
        text4?: TextComponent;
        htmlcomponent2?: HTMLComponent;
        htmlcomponent3?: HTMLComponent;
        text5?: TextComponent;
        htmlcomponent4?: HTMLComponent;
    };
    export class Dialog5 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/Dialog6" {
    import { Panel } from "jassijs/ui/Panel";
    type Me = {};
    export class Dialog6 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
}
declare module "demo/Dialog7" {
    import { Panel } from "jassijs/ui/Panel";
    import { Button } from "jassijs/ui/Button";
    type Me = {
        button1?: Button;
    };
    export class Dialog7 extends Panel {
        me: Me;
        constructor();
        render(): any;
    }
    export function test(): unknown;
}
declare module "demo/EmptyDialog" {
    import { HTMLPanel } from "jassijs/ui/HTMLPanel";
    import { Button } from "jassijs/ui/Button";
    import { Repeater } from "jassijs/ui/Repeater";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        repeater1?: Repeater;
        button1?: Button;
        htmlpanel1?: HTMLPanel;
        htmlpanel2?: HTMLPanel;
        button2?: Button;
        htmlpanel3?: HTMLPanel;
    };
    export class EmptyDialog extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): unknown;
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
    import { Component } from "jassijs/ui/Component";
    import { State } from "jassijs/ui/State";
    interface Prop {
        mytext?: string;
        mycolor?: State | any;
    }
    class MyComp extends Component<Prop> {
        mycolor: State<string>;
        mytext: State<string>;
        makeGreen(): void;
        constructor(p: Prop);
        render(): any;
    }
    export function test(): MyComp;
}
declare module "demo/hallo4" {
    import { Component } from "jassijs/ui/Component";
    interface Prop {
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
    import { Button } from "jassijs/ui/Button";
    import { State } from "jassijs/ui/State";
    interface Me {
        button?: Button;
        colorState?: State<string>;
    }
    interface Prop extends ComponentProperties {
        color: any;
    }
    class MyComp extends Component<Prop> {
        me: Me;
        constructor(p: Prop);
        render(): any;
    }
    export function test(): MyComp;
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
declare module "demo/MyTest" {
    export function test(): any;
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
declare module "demo/Testcontextmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export class Testcontextmenu extends Panel {
        me: {};
        constructor();
        layout(me: any): void;
    }
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
