export declare class Config {
    isLocalFolderMapped: boolean;
    isServer: boolean;
    modules: {
        [modul: string]: string;
    };
    server: {
        modules: {
            [modul: string]: string;
        };
    };
    jsonData: any;
    clientrequire: any;
    serverrequire: any;
    constructor();
    init(configtext: string): void;
    reload(): Promise<void>;
    saveJSON(): Promise<void>;
}
declare var config: Config;
export { config };
