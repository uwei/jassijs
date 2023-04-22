import { Indexer } from "./Indexer";
export declare class ServerIndexer extends Indexer {
    updateRegistry(): Promise<void>;
    dirFiles(modul: string, path: string, extensions: string[], ignore?: string[]): Promise<string[]>;
    writeFile(name: string, content: string): Promise<void>;
    createDirectory(name: string): Promise<void>;
    getFileTime(filename: any): Promise<number>;
    fileExists(filename: any): Promise<boolean>;
    readFile(filename: any): Promise<any>;
}
