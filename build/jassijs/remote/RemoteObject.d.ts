export declare class Context {
    isServer: boolean;
    [key: string]: any;
}
export declare class RemoteObject {
    static call(method: (...ars: any) => any, ...parameter: any[]): Promise<any>;
    call(_this: any, method: (...ars: any) => any, ...parameter: any[]): Promise<any>;
}
