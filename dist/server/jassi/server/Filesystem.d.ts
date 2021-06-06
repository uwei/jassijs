import { FileNode } from 'jassi/remote/FileNode';
export default class Filesystem {
    static allModules: {
        [name: string]: any[];
    };
    static path: string;
    _pathForFile(fileName: string): string;
    dir(curdir?: string, appendDate?: boolean, parentPath?: string, parent?: FileNode): FileNode;
    loadFile(fileName: any): string;
    loadFiles(fileNames: string[]): {};
    dirFiles(dir: string, extensions: string[], ignore?: string[]): Promise<string[]>;
    private writeZip;
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
    * deletes a file or directory
    * @param file - old filename
    */
    remove(file: string): Promise<string>;
    /**
     * create modul in ./jassi.json
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
    saveFile(fileName: string, content: any): Promise<void>;
}
export declare function syncRemoteFiles(): void;
export declare function staticfiles(req: any, res: any, next: any): void;
export declare function staticsecurefiles(req: any, res: any, next: any): void;
