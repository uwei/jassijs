import { ts } from 'jassijs/server/NativeAdapter';
export declare abstract class Indexer {
    abstract fileExists(name: any): any;
    abstract readFile(name: any): any;
    abstract getFileTime(name: any): any;
    abstract createDirectory(name: any): any;
    abstract writeFile(name: string, content: string): any;
    abstract dirFiles(modul: string, path: string, extensions: string[], ignore: string[]): Promise<string[]>;
    updateModul(root: any, modul: string, isserver: boolean): Promise<void>;
    convertArgument(arg: any): any;
    collectAnnotations(node: ts.Node, outDecorations: any, depth?: number): void;
}
