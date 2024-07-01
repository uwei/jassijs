import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
import { FileNode } from "jassijs/remote/FileNode";
export declare class Server extends RemoteObject {
    private static isonline;
    static filesInMap: {
        [name: string]: {
            modul: string;
            id: number;
        };
    };
    constructor();
    private _convertFileNode;
    private fillMapModules;
    fillFilesInMapIfNeeded(): Promise<void>;
    addFilesFromMap(root: FileNode): Promise<void>;
    /**
    * gets alls ts/js-files from server
    * @param {Promise<string>} [async] - returns a Promise for asynchros handling
    * @returns {string[]} - list of files
    */
    dir(withDate?: boolean, context?: Context): Promise<FileNode>;
    zip(directoryname: string, serverdir?: boolean, context?: Context): Promise<string | {
        [id: string]: string;
    }>;
    /**
     * gets the content of a file from server
     * @param {string} fileNamew
     * @returns {string} content of the file
     */
    loadFiles(fileNames: string[], context?: Context): Promise<{
        [id: string]: string;
    }>;
    /**
     * gets the content of a file from server
     * @param {string} fileName
     * @returns {string} content of the file
     */
    loadFile(fileName: string, context?: Context): Promise<string>;
    /**
    * put the content to a file
    * @param [{string}] fileNames - the name of the file
    * @param [{string}] contents
    */
    saveFiles(fileNames: string[], contents: string[], context?: Context): Promise<string>;
    /**
    * put the content to a file
    * @param {string} fileName - the name of the file
    * @param {string} content
    */
    saveFile(fileName: string, content: string, context?: Context): Promise<string>;
    /**
   * deletes a server modul
   **/
    testServersideFile(name: string, context?: Context): Promise<string>;
    /**
   * deletes a server modul
   **/
    removeServerModul(name: string, context?: Context): Promise<string>;
    /**
    * deletes a file or directory
    **/
    delete(name: string, context?: Context): Promise<string>;
    /**
     * renames a file or directory
     **/
    rename(oldname: string, newname: string, context?: Context): Promise<string>;
    /**
    * is the nodes server running
    **/
    static isOnline(context?: Context): Promise<boolean>;
    /**
     * creates a file
     **/
    createFile(filename: string, content: string, context?: Context): Promise<string>;
    /**
    * creates a file
    **/
    createFolder(foldername: string, context?: Context): Promise<string>;
    createModule(modulename: string, context?: Context): Promise<string>;
    static mytest(context?: Context): Promise<any>;
}
