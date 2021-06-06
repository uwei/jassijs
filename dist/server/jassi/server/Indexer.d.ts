import ts = require("typescript");
export declare abstract class Indexer {
    abstract fileExists(name: any): any;
    abstract readFile(name: any): any;
    abstract getFileTime(name: any): any;
    abstract createDirectory(name: any): any;
    abstract writeFile(name: string, content: string): any;
    updateModul(root: any, modul: string, isserver: boolean): Promise<void>;
    convertArgument(arg: any): any;
    collectAnnotations(node: ts.Node, outDecorations: any, depth?: number): void;
}
