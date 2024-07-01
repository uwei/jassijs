/**
 * compile
 */
export declare class Compile {
    static lastModifiedTSFiles: string[];
    lastCompiledTSFiles: string[];
    constructor();
    serverConfig(): ts.CompilerOptions;
    getDirectoryname(ppath: any): any;
    dirFiles(dirname: string, skip: string[], ret: any, replaceClientFileName?: boolean): Promise<void>;
    readRegistry(file: string, isServer: boolean): Promise<any>;
    createRegistry(modul: string, isServer: boolean, exclude: string, includeClientRegistry: string, files: any): Promise<void>;
    readModuleCode(modul: any, isServer: any): Promise<{
        [file: string]: string;
    }>;
    transpileModul(modul: any, isServer: any): Promise<void>;
    transpileServercode(fileName: string, inServerdirectory?: boolean): Promise<void>;
}
