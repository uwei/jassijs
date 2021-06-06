import "reflect-metadata";
declare class DataEntry {
    oclass: new (...args: any[]) => any;
    params: any[];
}
declare class JSONDataEntry {
    classname: string;
    params: any[];
    filename: string;
}
/**
* Manage all known data registered by jassi.register
* the data is downloaded by /registry.json
* registry.json is updated by the server on code upload
* @class jassi.base.Registry
*/
export declare class Registry {
    private _nextID;
    jsondata: {
        [service: string]: {
            [classname: string]: JSONDataEntry;
        };
    };
    data: {
        [service: string]: {
            [classname: string]: DataEntry;
        };
    };
    dataMembers: {
        [service: string]: {
            [classname: string]: {
                [membername: string]: any[];
            };
        };
    };
    private isLoading;
    _eventHandler: {
        [service: string]: any[];
    };
    constructor();
    getData(service: string, classname?: string): DataEntry[];
    onregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params: any[]) => void): (oclass: new (...args: any[]) => any, ...params: any[]) => void;
    offregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params: any[]) => void): void;
    /**
     * register an anotation
     * Important: this function should only used from an annotation, because the annotation is saved in
     *            index.json and could be read without loading the class
     **/
    register(service: string, oclass: new (...args: any[]) => any, ...params: any[]): void;
    getMemberData(service: string): {
        [classname: string]: {
            [membername: string]: any[];
        };
    };
    /**
     * register an anotation
     * Important: this function should only used from an annotation
     **/
    registerMember(service: string, oclass: any, membername: string, ...params: any[]): void;
    /**
    * with every call a new id is generated - used to create a free id for the dom
    * @returns {number} - the id
    */
    nextID(): string;
    /**
    * Load text with Ajax synchronously: takes path to file and optional MIME type
    * @param {string} filePath - the url
    * @returns {string} content
    */ private loadText;
    /**
     * reload the registry
     */
    reload(): Promise<void>;
    /**
    * loads entries from json string
    * @param {string} json - jsondata
    */
    initJSONData(json: any): void;
    /**
     *
     * @param service - the service for which we want informations
     */
    getJSONData(service: string, classname?: string): Promise<JSONDataEntry[]>;
    getAllFilesForService(service: string, classname?: string): string[];
    loadAllFilesForEntries(entries: JSONDataEntry[]): Promise<void>;
    /**
     * load all files that registered the service
     * @param {string} service - name of the service
     * @param {function} callback - called when loading is finished
     */
    loadAllFilesForService(service: string): Promise<void>;
    /**
     * load all files
     * @param {string} files - the files to load
     */
    loadAllFiles(files: string[]): Promise<unknown>;
}
declare var registry: Registry;
export default registry;
export declare function migrateModul(oldModul: any, newModul: any): void;
