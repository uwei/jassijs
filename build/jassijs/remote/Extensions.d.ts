export declare function $Extension(forclass: any): Function;
declare class ExtensionTarget {
    oclass: any;
    addFunction(name: string, func: (...any: any[]) => any, ifExists: "replace" | "append" | "prepend"): void;
    addMember(name: string): void;
    annotateMember(member: any, type: any, ...annotations: any[]): void;
}
export interface ExtensionProvider {
    initExtensions(extend: ExtensionTarget): any;
}
export declare class Extensions {
    constructor();
    private funcRegister;
    destroy(): void;
    annotate(oclass: any, ...annotations: any[]): void;
    register(extensionclass: new (...args: any[]) => any, forclass: any): void;
    annotateMember(classname: any, member: any, type: any, ...annotations: any[]): void;
}
declare var extensions: Extensions;
export { extensions };
