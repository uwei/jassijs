declare module "demoreports/12-Foreach" {
    export function test(): {
        reportdesign: {
            content: (string | {
                table: {
                    body: {
                        foreach: string;
                        do: {
                            foreach: string;
                            dofirst: (string | {
                                bold: boolean;
                                text: string;
                                colSpan: number;
                            })[];
                            do: {
                                foreach: string;
                                dofirst: (string | {
                                    text: string;
                                    colSpan: number;
                                })[];
                                do: string[];
                                dolast: string[];
                            };
                            dolast: string[];
                        };
                    }[];
                };
            })[];
        };
        data: {
            entries: any[];
            name: any;
        };
    };
}
declare module "demoreports/modul" {
    const _default: {
        types: {
            "jassijs_report/pdfMake-interface.ts": string;
            "jassijs_report/ReportDesignGlobal.ts": string;
        };
    };
    export default _default;
}
