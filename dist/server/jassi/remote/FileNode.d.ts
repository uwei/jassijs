export declare class FileNode {
    name: string;
    fullpath?: string;
    parent?: FileNode;
    files?: FileNode[];
    date?: any;
    flag?: string;
    isDirectory?(): boolean;
    resolveChilds?(all?: {
        [path: string]: FileNode;
    }): {
        [path: string]: FileNode;
    };
}
