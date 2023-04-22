import { FileNode } from 'jassijs/remote/FileNode';
declare global {
    interface Serverservice {
        filesystem: Promise<Filesystem>;
    }
}
export default class Filesystem {
    static allModules: {
        [name: string]: any[];
    };
    path: string;
    _pathForFile(fileName: string, fromServerdirectory?: boolean): string;
    dir(curdir?: string, appendDate?: boolean, parentPath?: string, parent?: FileNode): FileNode;
    loadFile(fileName: string): string;
    loadFiles(fileNames: string[]): {};
    dirFiles(dir: string, extensions: string[], ignore?: string[]): Promise<string[]>;
    private writeZip;
    static zipid: number;
    zip(directoryname: string, serverdir?: boolean): Promise<string>;
    private zipFolder;
    /**
     * create a folder
     * @param foldername - the name of the new file
     */
    createFolder(foldername: string): Promise<string>;
    /**
     * create a module
     * @param modulname - the name of the module
  
     */
    createModule(modulename: string): Promise<string>;
    /**
     * create a file
     * @param filename - the name of the new file
     * @param content - then content
     */
    createFile(filename: string, content: string): Promise<string>;
    /**
     * renames a file or directory
     * @param oldfile - old filename
     * @param newfile - new filename
     */
    rename(oldfile: string, newfile: string): Promise<string>;
    /**
    * deletes a server module
    * @param modul - to delete
    */
    removeServerModul(modul: string): Promise<string>;
    /**
    * deletes a file or directory
    * @param file - old filename
    */
    remove(file: string): Promise<string>;
    /**
     * create modul in ./jassijs.json
     * @param modul
     */
    createRemoteModulIfNeeded(modul: string): void;
    /**
     * save files +
     * transpile remote files and
     * reload the remote files in server if needed
     * update db schema
     * the changes would be reverted if there are errors
     * @param fileNames
     * @param contents
     * @returns "" or the error
     */
    saveFiles(fileNames: string[], contents: string[], rollbackonerror?: boolean): Promise<string>;
    saveFile(fileName: string, content: string): Promise<void>;
}
export declare function syncRemoteFiles(): void;
export declare function staticfiles(req: any, res: any, next: any): void;
export declare function staticsecurefiles(req: any, res: any, next: any): void;
