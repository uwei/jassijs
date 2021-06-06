export declare function $Extension(forclass: any): Function;
export interface ExtensionProvider {
    initExtensions(): any;
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
