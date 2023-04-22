declare module "demo/DelTest" {
    export function test(): Promise<void>;
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
    import { BoxPanel } from "jassijs/ui/BoxPanel";
    import { Button } from "jassijs/ui/Button";
    import { Panel } from "jassijs/ui/Panel";
    type Me = {
        boxpanel?: BoxPanel;
        button?: Button;
        button2?: Button;
    };
    export class Dialog2 extends Panel {
        me: Me;
        constructor();
        layout(me: Me): void;
    }
    export function test(): Promise<Dialog2>;
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
    export function test(): Promise<EmptyDialog>;
}
declare module "demo/LargeReport" {
    export function test(): {
        reportdesign: {
            content: {
                text: string;
                pageBreak: string;
            }[];
        };
    };
}
declare module "demo/MemoryTest" {
    export class MemoryTest {
        MemoryTest(): Promise<void>;
    }
}
declare module "demo/MyTest" {
    import { Panel } from "jassijs/ui/Panel";
    export function test(): Panel;
}
declare module "demo/Report1" {
    export function test(): {
        reportdesign: {
            content: any[];
        };
    };
}
declare module "demo/ReportInvoice" {
    export class ReportInvoice {
        reportdesign: {
            footer: {}[];
            content: (string | {
                columns: {}[];
                table?: undefined;
                foreach?: undefined;
                do?: undefined;
            } | {
                table: {
                    body: (string[] | {
                        foreach: string;
                        do: string[];
                    })[];
                };
                columns?: undefined;
                foreach?: undefined;
                do?: undefined;
            } | {
                columns?: undefined;
                table?: undefined;
                foreach?: undefined;
                do?: undefined;
            } | {
                foreach: string;
                do: {
                    columns: {
                        text: string;
                    }[];
                };
                columns?: undefined;
                table?: undefined;
            })[];
        };
        parameter: any;
        value: any;
        constructor();
        get title(): string;
    }
    export function test(): Promise<ReportInvoice>;
}
declare module "demo/ReportInvoice2" {
    export class ReportInvoice {
        reportdesign: {
            content: (string | {
                columns: (string | {
                    fontSize: number;
                    text: string;
                    table?: undefined;
                    layout?: undefined;
                } | {
                    table: {
                        widths: (string | number)[];
                        body: (string | {
                            text: string;
                            format: string;
                        })[][];
                    };
                    layout: string;
                    fontSize?: undefined;
                    text?: undefined;
                })[][];
                datatable?: undefined;
                foreach?: undefined;
            } | {
                datatable: {
                    header: string[];
                    dataforeach: string;
                    body: (string | {
                        bold: boolean;
                        text: string;
                        format: string;
                    })[];
                };
                columns?: undefined;
                foreach?: undefined;
            } | {
                foreach: string;
                columns: string[];
                datatable?: undefined;
            })[];
        };
        parameter: any;
        value: any;
        constructor();
        get title(): string;
    }
    export function test(): Promise<ReportInvoice>;
}
declare module "demo/ReportStyle" {
    export function test(): Promise<{
        reportdesign: {
            defaultStyle: {
                italics: boolean;
            };
            styles: {
                header: {
                    bold: boolean;
                    fontSize: number;
                };
                underline: {
                    decoration: string;
                };
            };
            content: ({
                style: string;
                text: string;
                columns?: undefined;
                table?: undefined;
            } | {
                columns: ({
                    width: number;
                    stack: string[];
                    style?: undefined;
                } | {
                    width: number;
                    style: string;
                    stack: (string | {
                        fontSize: number;
                        text: string;
                    })[];
                })[];
                style?: undefined;
                text?: undefined;
                table?: undefined;
            } | {
                table: {
                    body: string[][];
                };
                style?: undefined;
                text?: undefined;
                columns?: undefined;
            })[];
        };
    }>;
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
    export function test(): Promise<StyleDialog>;
}
declare module "demo/TableContextmenu" {
    import { Table } from "jassijs/ui/Table";
    export function test(): Promise<Table>;
}
declare module "demo/TestComponent" {
    import { Panel } from "jassijs/ui/Panel";
    export class TestComponent extends Panel {
        me: any;
        constructor();
        setdata(): Promise<void>;
        get title(): string;
        layout(me: any): void;
    }
    export function test(): Promise<TestComponent>;
}
declare module "demo/TestImage" {
    export function test(): Promise<any>;
}
declare module "demo/TestList" {
    export function test(): Promise<any>;
}
declare module "demo/TestProTable" {
    import { Table } from "jassijs/ui/Table";
    export function test(): Promise<Table>;
}
declare module "demo/TestTree" {
    import { Panel } from "jassijs/ui/Panel";
    export class TestTree extends Panel {
        constructor();
        layout(): void;
    }
    export function test(): Promise<Panel>;
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
    export function test(): Promise<TestUpload>;
}
declare module "demo/Testcontextmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export class Testcontextmenu extends Panel {
        me: {};
        constructor();
        layout(me: any): void;
    }
    export function test(): Promise<Testcontextmenu>;
}
declare module "demo/Testdatatable" {
    export function test(): Promise<any>;
}
declare module "demo/Testdatatable1" {
    export function test(): Promise<any>;
}
declare module "demo/Testdatatable2" {
    export function test(): Promise<any>;
}
declare module "demo/Testdatatable3" {
    export function test(): Promise<any>;
}
declare module "demo/Testmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export class Testmenu extends Panel {
        me: {};
        constructor();
        layout(me: any): void;
    }
}
declare module "demo/Testtable" {
    export function test(): Promise<any>;
}
declare module "demo/TreeContextmenu" {
    import { Panel } from "jassijs/ui/Panel";
    export function test(): Promise<Panel>;
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
    export function test(): Promise<TreeTable>;
}
declare var a: number;
declare module "demo/modul" {
    const _default: {
        require: {};
    };
    export default _default;
}
