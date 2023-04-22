import "jassijs/remote/Classes";
export declare class ServerserviceProperties {
    name: string;
    getInstance: (() => Promise<any>);
}
declare var runningServerservices: {};
export declare function beforeServiceLoad(func: (name: string, props: ServerserviceProperties) => void): void;
declare global {
    interface Serverservice {
    }
}
declare var serverservices: Serverservice;
export declare function $Serverservice(properties: ServerserviceProperties): Function;
declare var doNotReloadModule: boolean;
export { serverservices, doNotReloadModule, runningServerservices };
