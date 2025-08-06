declare module "jassijs/remote/Classes" {
    export class JassiError extends Error {
        constructor(msg: string);
    }
    /**
    * manage all registered classes ->jassijs.register("classes")
    * @class jassijs.base.Classes
    */
    export class Classes {
        private _cache;
        private funcRegister;
        constructor();
        destroy(): void;
        /**
         * load the a class
         * @param classname - the class to load
         */
        loadClass(classname: string): unknown;
        /**
        * get the class of the given classname
        * @param {string} - the classname
        * @returns {class} - the class
        */
        getClass(classname: string): new (...args: any[]) => any;
        /**
        * get the name of the given class
        * @param {class} _class - the class (prototype)
        * @returns {string} name of the class
        */
        getClassName(_class: any): string;
        register(data: new (...args: any[]) => any, name: string): void;
    }
    let classes: Classes;
    export { classes };
    export function test(t: any): any;
}
declare module "jassijs/remote/ClientError" {
    export class ClientError extends Error {
        constructor(msg: string);
    }
}
declare module "jassijs/remote/Config" {
    export class Config {
        name: string;
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
        init(configtext: string, name?: any): void;
        reload(): any;
        saveJSON(): any;
    }
    var config: Config;
    export { config };
}
<<<<<<< HEAD
declare module "jassijs/remote/Context" {
    export function useStackContextTest<T = any, R = any>(context: T, fn: (...args: any[]) => R, ...args: any[]): R;
    export function useStackContext<T = any, R = any>(context: T, fn: (...args: any[]) => R | Promise<R>, ...args: any[]): Promise<R>;
    export function useStackContextOrg<T = any, R = any>(context: T, fn: (...args: any[]) => R, ...args: any[]): R;
    export function getStackContext<T = any>(): T | undefined;
    export function getZoneContext(): any;
    export function useZoneContext<T = any, R = any>(context: T, fn: (...args: any[]) => R | Promise<R>, ...args: any[]): Promise<R>;
}
declare module "jassijs/remote/Context2" {
    export function test(): any;
}
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/remote/Database" {
    export class TypeDef {
        fields: {
            [fieldname: string]: {
                [decorater: string]: any[];
            };
        };
        getRelation(fieldname: any): {
            type: string;
            oclass: any;
        };
    }
    export class Database {
        private constructor();
        typeDef: Map<object, TypeDef>;
        decoratorCalls: Map<object, any[]>;
        private removeOld;
        _setMetadata(constructor: any, field: string, decoratername: string, fieldprops: any[], decoraterprops: any[], delegate: any): void;
        fillDecorators(): void;
        getMetadata(sclass: any): TypeDef;
    }
    var db: Database;
    export { db };
}
declare module "jassijs/remote/DatabaseTools" {
<<<<<<< HEAD
    import { Context } from "jassijs/remote/RemoteObject";
    export class DatabaseTools {
=======
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    export class DatabaseTools extends RemoteObject {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        static runSQL(sql: string, parameter?: any[], context?: Context): unknown;
        static dropTables(tables: string[]): Promise<string>;
    }
    export function test(): any;
}
declare module "jassijs/remote/DBArray" {
    export class DBArray
    /**
    * Array for jassijs.base.DBObject's
    * can be saved to db
    * @class jassijs.base.DBArray
    */
     extends Array {
        constructor(...args: {});
        private _parentObject;
        private _parentObjectMember;
        /**
         * adds an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to add
         */
        add(ob: any): void;
        /**
         * for compatibility
         */
        resolve(): unknown;
        /**
         * remove an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to remove
         */
        remove(ob: any): void;
    }
}
declare module "jassijs/remote/DBObject" {
<<<<<<< HEAD
    import { Context } from "jassijs/remote/RemoteObject";
=======
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    import { EntityOptions } from "jassijs/util/DatabaseSchema";
    import { ValidationError } from "jassijs/remote/Validator";
    export function $DBObject(options?: EntityOptions): Function;
    export class MyFindManyOptions {
        relations?: string[];
        [sampleproperty: string]: any;
        /**
         *
         * where e.g. id>5
         */
        where?: string;
        /**
         * e.g. where:"id>:param" ,whereParams:{param:5}
         */
        whereParams?: any;
        /**
       * Offset (paginated) where from entities should be taken.
       */
        skip?: number;
        /**
         * Limit (paginated) - max number of entities should be taken.
         */
        take?: number;
        /**
        * Order, in which entities should be ordered.
        */
        order?: {
            [field: string]: "ASC" | "DESC" | 1 | -1;
        };
    }
    /**
    * base class for all database entfities
    * all objects which use the jassijs.db must implement this
    * @class DBObject
    */
<<<<<<< HEAD
    export class DBObject {
=======
    export class DBObject extends RemoteObject {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        id: number | string;
        private static cache;
        private static _init;
        private static _initFunc;
<<<<<<< HEAD
=======
        constructor();
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        isAutoId(): boolean;
        static getFromCache(classname: string, id: number | string): DBObject;
        validate(options?: any, throwError?: boolean): Promise<ValidationError[]>;
        private static addToCache;
        static clearCache(classname: string): void;
        removeFromCache(): void;
        static _createObject(ob: any): DBObject;
        /**
         * replace all childs objects with {id:}
         */
        private _replaceObjectWithId;
        /**
        * save the object to jassijs.db
        */
        save(context?: Context): unknown;
        _createObjectInDB(context?: Context): unknown;
        static findOne(options?: any, context?: Context): Promise<DBObject>;
        static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
        /**
        * reload the object from jassijs.db
        */
        remove(context?: Context): unknown;
        _getObjectProperty(dummy: any): void;
        _setObjectProperty(dummy: any, dumm1: any): void;
    }
    export function test(): any;
}
declare module "jassijs/remote/DBObjectQuery" {
    import { DBObject } from "jassijs/remote/DBObject";
    export class DBObjectQueryProperties {
        name: string;
        description?: string;
    }
    export function $DBObjectQuery(property: DBObjectQueryProperties): Function;
    export class DBObjectQuery {
        classname: string;
        name: string;
        description: string;
        _function: any;
        execute(): Promise<DBObject>;
        static getQueries(classname: string): Promise<DBObjectQuery[]>;
    }
    export function test(): any;
}
declare module "jassijs/remote/Extensions" {
    export function $Extension(forclass: any): Function;
    class ExtensionTarget {
        oclass: any;
        addFunction(name: string, func: (...any: {}) => any, ifExists: "replace" | "append" | "prepend"): void;
        addMember(name: string): void;
        annotateMember(member: any, type: any, ...annotations: {}): void;
    }
    export interface ExtensionProvider {
        initExtensions(extend: ExtensionTarget): any;
    }
    export class Extensions {
        constructor();
        private funcRegister;
        destroy(): void;
        annotate(oclass: any, ...annotations: {}): void;
        register(extensionclass: new (...args: any[]) => any, forclass: any): void;
        annotateMember(classname: any, member: any, type: any, ...annotations: {}): void;
    }
    var extensions: Extensions;
    export { extensions };
}
declare module "jassijs/remote/FileNode" {
    export class FileNode {
        name: string;
        fullpath?: string;
        parent?: FileNode;
        files?: FileNode[];
        date?: any;
        flag?: string;
        constructor(fullpath?: string);
        isDirectory?(): boolean;
        resolveChilds?(all?: {
            [path: string]: FileNode;
        }): {
            [path: string]: FileNode;
        };
    }
}
declare module "jassijs/remote/hallo" {
    export class OO {
        hallo: string;
        static test(): void;
    }
}
declare module "jassijs/remote/Jassi" {
    global {
        export interface ExtensionAction {
            componentDesignerSetDesignMode?: {
                enable: boolean;
                componentDesigner: any;
            };
            componentDesignerComponentCreated?: {
                newParent: any;
            };
            componentDesignerInvisibleComponentClicked?: {
                codeEditor: any;
                designButton: any;
            };
        }
    }
    global {
        interface String {
            replaceAll: any;
        }
    }
    /**
    * main class for jassi
    * @class Jassi
    */
    export class Jassi {
        [key: string]: any;
        base: {
            [k: string]: any;
        };
        options: any;
        isServer: boolean;
        cssFiles: {
            [key: string]: string;
        };
        constructor();
        includeCSSFile(modulkey: string): void;
        /**
         * include a global stylesheet
         * @id - the given id - important for update
         * @data - the css data to insert
         **/
        includeCSS(id: string, data: {
            [cssselector: string]: any;
        }): void;
        /**
        * include a js or a css file
        * @param {string|string[]} href - url(s) of the js or css file(s)
        * @param {function} [param] - would be added with? to the url
        */
        myRequire(href: any, event?: any, param?: any): void;
    }
    global {
        class JassiStatic extends Jassi {
        }
    }
}
declare var jassijs: JassiStatic;
declare module "jassijs/remote/Modules" {
    class Modules {
        modules: {
            [modul: string]: string;
        };
        server: Modules;
        constructor();
    }
    var modules: Modules;
    export { modules };
}
<<<<<<< HEAD
declare class Npm {
    files: {};
    static textExt: {};
    registry: string;
    installedModules: any;
    installingModules: any;
    requestedVersions: any;
    constructor(packagejson: any);
    install(): any;
    installModul(modul: any, version?: string): any;
    uninstallModul(modul: any): any;
    _loadPackageJson(): any;
    _savePackageJson(obj: any): void;
    compareVersions(a: any, b: any): 0 | 1 | -1;
    resolveVersion(availableVersions: any, range: any): any;
    mergeVersionRanges(name: any): unknown;
    _isInstalledVersionCompatible(name: any, versionRange: any): boolean;
    _installPackage(name: any, version: any): unknown;
    _deleteFolder(pathPrefix: any): void;
    unpacktgz(url: any, pathto: any): any;
}
declare var TarReader: {
    new (): {
        buffer: any;
        fileInfo: any[];
        untar(buffer: any): {};
        readFile(file: any): any;
        readArrayBuffer(arrayBuffer: any): {};
        _readFileInfo(): void;
        getFileInfo(): {};
        _readString(str_offset: any, size: any): any;
        _readFileName(header_offset: any): any;
        _readFileType(header_offset: any): any;
        _readFileSize(header_offset: any): any;
        _readFileBlob(file_offset: any, size: any, mimetype: any): any;
        _readFileBinary(file_offset: any, size: any): any;
        _readTextFile(file_offset: any, size: any): any;
        getTextFile(file_name: any): any;
        getFileBlob(file_name: any, mimetype: any): any;
        getFileBinary(file_name: any): any;
    };
};
declare function testNPM(): any;
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/remote/ObjectTransaction" {
    import { Context } from "jassijs/remote/RemoteObject";
    import { TransactionItem } from "jassijs/remote/Transaction";
    export class ObjectTransaction {
        statements: TransactionItem[];
        saveresolve: any[];
        private functionsFinally;
        transactionResolved(context: Context): void;
        addFunctionFinally(functionToAdd: () => any): void;
        checkFinally(): void;
        finally(): any;
    }
}
<<<<<<< HEAD
declare function patchHTTP(ob: any): void;
declare module "jassijs/remote/Registry" {
    import "reflect-metadata";
    export function $Class(longclassname: string, target?: any): Function;
=======
declare module "jassijs/remote/Registry" {
    import "reflect-metadata";
    export function $Class(longclassname: string): Function;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    export function $register(servicename: string, ...params: {}): Function;
    class DataEntry {
        oclass: new (...args: any[]) => any;
        params: any[];
    }
    class JSONDataEntry {
        classname: string;
        params: any[];
        filename: string;
    }
    /**
    * Manage all known data registered by jassijs.register
    * the data is downloaded by /registry.json
    * registry.json is updated by the server on code upload
    * @class jassijs.base.Registry
    */
    export class Registry {
<<<<<<< HEAD
=======
        private _nextID;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
        jsondataMembers: {
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
        onregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params: {}) => void): (oclass: new (...args: any[]) => any, ...params: {}) => void;
        offregister(service: string, callback: (oclass: new (...args: any[]) => any, ...params: {}) => void): void;
        /**
         * register an anotation
         * Important: this function should only used from an annotation, because the annotation is saved in
         *            index.json and could be read without loading the class
         **/
<<<<<<< HEAD
        register(service: string, aclass: new (...args: any[]) => any, ...params: {}): void;
=======
        register(service: string, oclass: new (...args: any[]) => any, ...params: {}): void;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        getMemberData(service: string): {
            [classname: string]: {
                [membername: string]: any[];
            };
        };
        getJSONMemberData(service: string): {
            [classname: string]: {
                [membername: string]: any[];
            };
        };
        /**
         * register an anotation
         * Important: this function should only used from an annotation
         **/
<<<<<<< HEAD
        registerMember(service: string, aclass: any, membername: string, ...params: {}): void;
=======
        registerMember(service: string, oclass: any, membername: string, ...params: {}): void;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        /**
        * with every call a new id is generated - used to create a free id for the dom
        * @returns {number} - the id
        */
<<<<<<< HEAD
=======
        nextID(): any;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        /**
        * Load text with Ajax synchronously: takes path to file and optional MIME type
        * @param {string} filePath - the url
        * @returns {string} content
        */ private loadText;
        /**
         * reload the registry
         */
        reload(): any;
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
        loadAllFilesForEntries(entries: JSONDataEntry[]): any;
        /**
         * load all files that registered the service
         * @param {string} service - name of the service
         * @param {function} callback - called when loading is finished
         */
        loadAllFilesForService(service: string): any;
        /**
         * load all files
         * @param {string} files - the files to load
         */
        loadAllFiles(files: string[]): unknown;
    }
    var registry: Registry;
    export default registry;
    export function migrateModul(oldModul: any, newModul: any): void;
}
declare module "jassijs/remote/RemoteObject" {
    export class Context {
        isServer: boolean;
        [key: string]: any;
    }
<<<<<<< HEAD
    export function useContext<R = any>(context: Context, fn: (...args: any[]) => R, ...args: any[]): R;
    export function getContext(): Context;
    export function UseServer(): Function;
    export function DefaultParameterValue(value: any): Function;
    export function _fillDefaultParameter(_this: any, method: any, parameter: any, withContext?: any): Context;
    export class RemoteObject {
        static docall(_this: any, method: (...ars: any) => any, ...parameter: {}): unknown;
        static docallWithReplaceThis(replaceThis: any, _this: any, method: (...ars: any) => any, ...parameter: {}): unknown;
    }
    export function test(): any;
=======
    export class RemoteObject {
        static call(method: (...ars: any) => any, ...parameter: {}): unknown;
        call(_this: any, method: (...ars: any) => any, ...parameter: {}): unknown;
    }
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
}
declare module "jassijs/remote/RemoteProtocol" {
    export class RemoteProtocol {
        static counter: number;
        classname: string;
        _this: any;
        parameter: any[];
        method: string;
        /**
         * converts object to jsonstring
         * if class is registerd in classes then the class is used
         * if id is used then recursive childs are possible
         * @param obj
         */
        stringify(obj: any): any;
        static simulateUser(user?: string, password?: string): any;
        exec(config: any, object: any): unknown;
        /**
       * call the server
       */
<<<<<<< HEAD
        call(): any;
=======
        call(): unknown;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        /**
         * converts jsonstring to an object
         */
        parse(text: string): unknown;
        test(): any;
    }
}
<<<<<<< HEAD
declare module "jassijs/remote/RemoteTest" {
    import { Context } from "jassijs/remote/RemoteObject";
    export class RemoteTest {
        createFolder(foldername: string, context?: Context): Promise<string>;
        createFolder2(foldername: string): Promise<string>;
        static mytest(context?: Context): unknown;
        static mytest2(): unknown;
    }
    export function test(): any;
}
declare const textExt: {};
declare var servedLocalUrls: {};
declare function handleLocalServerEvent(event: any): unknown;
declare function require(path: any): void;
declare function patchNodeFunction(): void;
declare var modulesshims: {
    buffer: string;
    bufferGlobal: string;
    path: string;
    process: string;
    assert: string;
    constants: string;
    "create-hash": string;
    "create-hmac": string;
    crypto: string;
    domain: string;
    events: string;
    http: string;
    https: string;
    inhertis: string;
    os: string;
    punycode: string;
    querystring: string;
    randombytes: string;
    stream: string;
    _stream_duplex: string;
    _stream_passthrough: string;
    _stream_readable: string;
    _stream_transform: string;
    _stream_writable: string;
    string_decoder: string;
    sys: string;
    timers: string;
    tty: string;
    url: string;
    util: string;
    vm: string;
    zlib: string;
};
declare var isinited: boolean;
declare var globalfs: any;
declare function patchFS(fs: any): void;
declare function getDirectory(path: any): any;
declare function fileModule(file: string): any;
declare function fileCode(file: string): any;
declare function resolve(relativePath: string, parentPath?: string): string;
declare var testimport: {};
/**
 * like node require import a modul or js file
 * @param relativePath - the module or js-File to import
 * @param parentPath - the jsFile which ask the import
 * @param nocache - true if the import should be cached
 * @returns
 */
declare function jrequire(relativePath: string, parentPath?: string, nocache?: boolean): any;
declare var servercode: any;
declare var servermodules: any;
declare function openDB(dbName: any, storeName: any): any;
declare function writeIndexDB(dbName: any, storeName: any, key: any, value: any): unknown;
declare function readIndexDB(dbName: any, storeName: any, key: any): unknown;
declare function runLocalServerIfNeeded(): any;
declare function test(): any;
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/remote/security/Group" {
    import { DBObject } from "jassijs/remote/DBObject";
    import { ParentRight } from "jassijs/remote/security/ParentRight";
    import { User } from "jassijs/remote/security/User";
    import { Right } from "jassijs/remote/security/Right";
    export class Group extends DBObject {
        id: number;
        name: string;
        parentRights: ParentRight[];
        rights: Right[];
        users: User[];
    }
}
declare module "jassijs/remote/security/ParentRight" {
    import { DBObject } from "jassijs/remote/DBObject";
    import { Group } from "jassijs/remote/security/Group";
    export class ParentRight extends DBObject {
        id: number;
        name: string;
        classname: string;
        i1: number;
        i2: number;
        s1: string;
        s2: string;
        groups: Group[];
    }
}
declare module "jassijs/remote/security/Right" {
    import { DBObject } from "jassijs/remote/DBObject";
    import { Group } from "jassijs/remote/security/Group";
    export class Right extends DBObject {
        id: number;
        name: string;
        groups: Group[];
    }
}
declare module "jassijs/remote/security/Rights" {
<<<<<<< HEAD
    import { Context } from "jassijs/remote/RemoteObject";
=======
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    export class RightProperties {
        name: string;
        description?: string;
    }
    export class ParentRightProperties {
        name: string;
        description?: {
            text: string;
            [parametername: string]: string;
        };
        sqlToCheck: string;
    }
    export function $Rights(rights: RightProperties[]): Function;
    export function $ParentRights(rights: [ParentRightProperties]): Function;
    export function $CheckParentRight(): Function;
<<<<<<< HEAD
    export class Rights {
=======
    export class Rights extends RemoteObject {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        private _isAdmin;
        isAdmin(context?: Context): Promise<boolean>;
    }
    var rights: Rights;
    export default rights;
}
declare module "jassijs/remote/security/Setting" {
    import { DBObject, MyFindManyOptions } from "jassijs/remote/DBObject";
    import { Context } from "jassijs/remote/RemoteObject";
    export class Setting extends DBObject {
        id: number;
        constructor();
        data: string;
        save(context?: Context): any;
<<<<<<< HEAD
        static findOne(options?: any): Promise<DBObject>;
        static find(options?: MyFindManyOptions): Promise<DBObject[]>;
=======
        static findOne(options?: any, context?: Context): Promise<DBObject>;
        static find(options?: MyFindManyOptions, context?: Context): Promise<DBObject[]>;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        /**
        * reload the object from jassijs.db
        */
        remove(context?: Context): any;
    }
    export function test(): any;
}
declare module "jassijs/remote/security/User" {
    import { DBObject } from "jassijs/remote/DBObject";
    import { Group } from "jassijs/remote/security/Group";
    import { Context } from "jassijs/remote/RemoteObject";
    export class User extends DBObject {
        id: number;
        email: string;
        password: string;
        groups: Group[];
        isAdmin: boolean;
        static findWithRelations(): unknown;
        /**
       * reload the object from jassijs.db
       */
        hallo(context?: Context): unknown;
        save(context?: Context): unknown;
    }
    export function test(): any;
    export function test2(): any;
}
declare module "jassijs/remote/Server" {
<<<<<<< HEAD
    import { Context } from "jassijs/remote/RemoteObject";
    import { FileNode } from "jassijs/remote/FileNode";
    export class Server {
=======
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    import { FileNode } from "jassijs/remote/FileNode";
    export class Server extends RemoteObject {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
        fillFilesInMapIfNeeded(): any;
        addFilesFromMap(root: FileNode): any;
        /**
        * gets alls ts/js-files from server
        * @param {Promise<string>} [async] - returns a Promise for asynchros handling
        * @returns {string[]} - list of files
        */
        dir(withDate?: boolean, context?: Context): Promise<FileNode>;
<<<<<<< HEAD
        zip(directoryname: string, serverdir?: boolean): unknown;
=======
        zip(directoryname: string, serverdir?: boolean, context?: Context): unknown;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        /**
         * gets the content of a file from server
         * @param {string} fileNamew
         * @returns {string} content of the file
         */
<<<<<<< HEAD
        loadFiles(fileNames: string[]): Promise<{
=======
        loadFiles(fileNames: string[], context?: Context): Promise<{
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
<<<<<<< HEAD
        saveFile(fileName: string, content: string): Promise<string>;
=======
        saveFile(fileName: string, content: string, context?: Context): Promise<string>;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
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
<<<<<<< HEAD
        * creates a folder
=======
        * creates a file
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        **/
        createFolder(foldername: string, context?: Context): Promise<string>;
        createModule(modulename: string, context?: Context): Promise<string>;
        static mytest(context?: Context): unknown;
    }
}
declare module "jassijs/remote/Serverservice" {
    import "jassijs/remote/Classes";
    export class ServerserviceProperties {
        name: string;
        getInstance: (() => Promise<any>);
    }
    var runningServerservices: {};
    export function beforeServiceLoad(func: (name: string, props: ServerserviceProperties) => void): void;
    global {
        interface Serverservice {
        }
    }
    var serverservices: Serverservice;
    export function $Serverservice(properties: ServerserviceProperties): Function;
    var doNotReloadModule: boolean;
    export { serverservices, doNotReloadModule, runningServerservices };
}
declare module "jassijs/remote/Settings" {
<<<<<<< HEAD
    import { Context } from "jassijs/remote/RemoteObject";
    import { Test } from "./Test";
    import { DBObject } from "./DBObject";
=======
    import { Context, RemoteObject } from "jassijs/remote/RemoteObject";
    import { Test } from "./Test";
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    global {
        export interface KnownSettings {
        }
    }
<<<<<<< HEAD
    export class Settings extends DBObject {
=======
    export class Settings extends RemoteObject {
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        static keys: KnownSettings;
        private static browserSettings;
        private static userSettings;
        private static allusersSettings;
        /**
        * loads the settings
        */
        static load(context?: Context): unknown;
        static getAll(scope: "browser" | "user" | "allusers"): {};
        gets<T>(Settings_key: T): T;
        static remove(Settings_key: string, scope: "browser" | "user" | "allusers", context?: Context): any;
<<<<<<< HEAD
        static save<T>(Settings_key: T, value: T, scope: "browser" | "user" | "allusers", context?: Context): unknown;
=======
        static save<T>(Settings_key: T, value: T, scope: "browser" | "user" | "allusers"): unknown;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        static saveAll(namevaluepair: {
            [key: string]: any;
        }, scope: "browser" | "user" | "allusers", removeOtherKeys?: boolean, context?: Context): unknown;
    }
    var settings: Settings;
    export { settings };
    export function $SettingsDescriptor(): Function;
    export function autostart(): any;
    export function test(t: Test): any;
    export function load(): unknown;
}
<<<<<<< HEAD
declare module "jassijs/remote/StackContext" {
    export function useStackContext<T = any, R = any>(context: T, fn: (...args: any[]) => R, ...args: any[]): R;
    export function getStackContext<T = any>(): T | undefined;
    export function test(): any;
}
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/remote/Test" {
    export class Test {
        /**
         * fails if the condition is false
         * @parameter condition
         **/
        expectEqual(condition: boolean): void;
        /**
         * fails if the func does not throw an error
         * @parameter func - the function that should failed
         **/
        expectError(func: any): void;
        /**
        * fails if the func does not throw an error
        * @parameter func - the function that should failed
        **/
        expectErrorAsync(func: any): any;
    }
}
<<<<<<< HEAD
declare var exports: any;
declare function testPDF(): any;
declare function testpdfMake(): any;
declare function testWebpack(): any;
declare function testExpress2(): any;
declare function testLocalServer(): any;
declare function testJSSQL(): any;
declare function testDB(): any;
declare function startServer(): any;
declare module "jassijs/remote/Transaction" {
    import { Context } from "jassijs/remote/RemoteObject";
    import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
    import { Test } from "jassijs/remote/Test";
    export class GenericTransactionItem {
        transaction: GenericTransaction;
        userData: any;
        promise: Promise<any>;
        resolve: any;
        reject: any;
    }
    export class TransactionItem extends GenericTransactionItem {
        obj: any;
        method: (...args: {}) => any;
        params: any[];
        remoteProtocol: RemoteProtocol;
    }
    export class TransactionContext extends Context {
        transaction?: GenericTransaction;
        transactionItem?: GenericTransactionItem;
    }
    class GenericTransaction {
        protected finalizer: {
            [key: string]: (any: any) => any;
        };
        protected allPromises: Promise<any>[];
        protected filledTransactions: GenericTransactionItem[];
        protected finalized: number;
        transactions: GenericTransactionItem[];
        protected registerdTransactions: {
            [name: string]: GenericTransactionItem[];
        };
        private resolveFinalizer;
        registerAction<T>(name: string, userdata: T, finalize: (alluserdata: T[]) => Promise<any[]>, config: TransactionContext): Promise<any>;
        tryFinalize(): void;
        protected finalize(): any;
        protected wait(): unknown;
    }
    export class Transaction extends GenericTransaction {
        addProtocol(prot: RemoteProtocol, config: TransactionContext): Promise<any>;
        private sendRequest;
        execute(context?: TransactionContext): Promise<any[]>;
        add(obj: any, method: (...args: {}) => any, ...params: {}): void;
    }
    export class TransactionTest {
        hi(num: number): number;
    }
    export function test(t: Test): any;
=======
declare module "jassijs/remote/Transaction" {
    import { RemoteObject } from "jassijs/remote/RemoteObject";
    import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
    export class TransactionItem {
        transaction: Transaction;
        obj: any;
        method: (...args: {}) => any;
        params: any[];
        promise: Promise<any>;
        result: any;
        remoteProtocol: RemoteProtocol;
        resolve: any;
    }
    export class Transaction extends RemoteObject {
        private statements;
        private ready;
        private context;
        execute(): Promise<any[]>;
        wait(transactionItem: TransactionItem, prot: RemoteProtocol): Promise<any>;
        private sendRequest;
        private doServerStatement;
        add(obj: any, method: (...args: {}) => any, ...params: {}): void;
    }
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
}
declare module "jassijs/remote/Validator" {
    import "reflect-metadata";
    import { Test } from "jassijs/remote/Test";
    export class ValidationOptions {
        message?: string;
    }
    export function registerValidation(name: string, options: ValidationOptions, func: (target: any, propertyName: string, value: any, options: any) => string): (target: any, propertyKey: string, parameterIndex: number) => void;
    export class ValidationError {
        value: object;
        target: object;
        property: string;
        message: string;
        constructor(value: any, target: any, property: string, message: string);
    }
    class ValidateOptions {
        /**
         * e.g. {ValidateInt:{optional:false}} delegates optional:false to all ValidateInt rules
         * e.g. {ALL:{optional:false}} delegates optional:false to all Validators rules}
         */
        delegateOptions?: {
            [ValidatorClassName: string]: any;
        };
    }
    export function validate(obj: any, options?: ValidateOptions, raiseError?: boolean): ValidationError[];
    export class ValidationIsArrayOptions extends ValidationOptions {
        optional?: boolean;
        type?: (type?: any) => any;
        alternativeJsonProperties?: string[];
    }
    export function ValidateIsArray(options?: ValidationIsArrayOptions): Function;
    export class ValidationIsBooleanOptions extends ValidationOptions {
        optional?: boolean;
        type?: any;
    }
    export function ValidateIsBoolean(options?: ValidationIsBooleanOptions): Function;
    export class ValidationIsDateOptions extends ValidationOptions {
        optional?: boolean;
    }
    export function ValidateIsDate(options?: ValidationIsDateOptions): Function;
    export function ValidateFunctionParameter(): Function;
    export class ValidationIsInOptions extends ValidationOptions {
        optional?: boolean;
        in: any[];
    }
    export function ValidateIsIn(options?: ValidationIsInOptions): Function;
    export class ValidationIsInstanceOfOptions extends ValidationOptions {
        optional?: boolean;
        type: (type?: any) => any;
        /**
         * ["id"] means an object {id:9} is also a valid type
         */
        alternativeJsonProperties?: string[];
    }
    export function ValidateIsInstanceOf(options?: ValidationIsInstanceOfOptions): Function;
    export class ValidationIsIntOptions extends ValidationOptions {
        optional?: boolean;
    }
    export function ValidateIsInt(options?: ValidationIsIntOptions): Function;
    export class ValidationMaxOptions extends ValidationOptions {
        max: number;
    }
    export function ValidateMax(options: ValidationMaxOptions): Function;
    export class ValidationMinOptions extends ValidationOptions {
        min: number;
    }
    export function ValidateMin(options: ValidationMinOptions): Function;
    export class ValidationIsNumberOptions extends ValidationOptions {
        optional?: boolean;
    }
    export function ValidateIsNumber(options?: ValidationIsNumberOptions): Function;
    export class ValidationIsStringOptions extends ValidationOptions {
        optional?: boolean;
    }
    export function ValidateIsString(options?: ValidationIsIntOptions): Function;
    export function test(test: Test): any;
}
declare module "jassijs/UserModel" {
    export class UserModel {
        static secret: string;
    }
}
declare module "jassijs/util/DatabaseSchema" {
    import { Entity, EntityOptions, PrimaryGeneratedColumn, JoinColumn, JoinTable, Column, PrimaryColumn, OneToOne, OneToMany, ManyToOne, ManyToMany } from "typeorm";
    export { Entity };
    export { PrimaryGeneratedColumn };
    export { JoinColumn };
    export { JoinTable };
    export { Column };
    export { PrimaryColumn };
    export { OneToOne };
    export { OneToMany };
    export { ManyToOne };
    export { ManyToMany };
    export { EntityOptions };
}
declare module "jassijs/server/Compile" {
    /**
     * compile
     */
    export class Compile {
        static lastModifiedTSFiles: string[];
        lastCompiledTSFiles: string[];
        constructor();
        serverConfig(): ts.CompilerOptions;
        getDirectoryname(ppath: any): any;
        dirFiles(dirname: string, skip: string[], ret: any, replaceClientFileName?: boolean): any;
        readRegistry(file: string, isServer: boolean): Promise<any>;
        createRegistry(modul: string, isServer: boolean, exclude: string, includeClientRegistry: string, files: any): any;
        readModuleCode(modul: any, isServer: any): unknown;
        transpileModul(modul: any, isServer: any): any;
        transpileServercode(fileName: string, inServerdirectory?: boolean): any;
    }
}
declare module "jassijs/server/DatabaseSchema" {
    import { EntityOptions } from "typeorm";
    export function Entity(...param: {}): Function;
    export function PrimaryGeneratedColumn(...param: {}): Function;
    export function JoinColumn(...param: {}): Function;
    export function JoinTable(...param: {}): Function;
    export function Column(...param: {}): Function;
    export function PrimaryColumn(...param: {}): Function;
    export function OneToOne(...param: {}): Function;
    export function OneToMany(...param: {}): Function;
    export function ManyToOne(...param: {}): Function;
    export function ManyToMany(...param: {}): Function;
    export { EntityOptions };
}
declare module "jassijs/server/DBManager" {
    import { ConnectionOptions, SaveOptions, FindConditions, FindOneOptions, ObjectType, ObjectID, FindManyOptions, EntitySchema } from "typeorm";
    import { DBObject } from "jassijs/remote/DBObject";
    import { User } from "jassijs/remote/security/User";
    import { Context } from "jassijs/remote/RemoteObject";
    export interface MyFindManyOptions<Entity = any> extends FindManyOptions {
        whereParams?: any;
        onlyColumns?: string[];
        order: {
            [field: string]: "ASC" | "DESC";
        };
    }
    global {
        export interface Serverservice {
            db: Promise<DBManager>;
        }
    }
    export class DBManager {
        waitForConnection: Promise<DBManager>;
        static getConOpts(): Promise<ConnectionOptions>;
        private static _get;
        private open;
        private mySync;
        private static clearMetadata;
        renewConnection(): any;
        destroyConnection(waitForCompleteOpen?: boolean): any;
        private static clearArray;
        private constructor();
        connection(): any;
        runSQL(context: Context, sql: string, parameters?: any[]): unknown;
        remove<Entity>(context: Context, entity: Entity): any;
        private addSaveTransaction;
        /**
       * insert a new object
       * @param obj - the object to insert
       */
        insert(context: Context, obj: DBObject): unknown;
        /**
        * Saves all given entities in the database.
        * If entities do not exist in the database then inserts, otherwise updates.
        */
        save<Entity>(context: Context, entities: Entity[], options?: SaveOptions): Promise<Entity[]>;
        /**
         * Saves all given entities in the database.
         * If entities do not exist in the database then inserts, otherwise updates.
         */
        save<Entity>(context: Context, entity: Entity, options?: SaveOptions): Promise<Entity>;
        private _checkParentRightsForSave;
        findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, id?: string | number | Date | ObjectID, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
        /**
         * Finds first entity that matches given find options.
         */
        findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
        /**
        * Finds first entity that matches given conditions.
        */
        findOne<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>, options?: FindOneOptions<Entity>): Promise<Entity | undefined>;
        /**
       * Finds entities that match given options.
       */
        find<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, options?: MyFindManyOptions<Entity>): Promise<Entity[]>;
        /**
         * Finds entities that match given conditions.
         */
        find<Entity>(context: Context, entityClass: ObjectType<Entity> | EntitySchema<Entity>, conditions?: FindConditions<Entity>): Promise<Entity[]>;
        private resolveWildcharInRelations;
        createUser(context: Context, username: string, password: string): Promise<User>;
<<<<<<< HEAD
        nologin(context: Context, user: string, password: any): unknown;
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
        login(context: Context, user: string, password: any): unknown;
        checkParentRight(context: Context, entityClass: any, ids: any[]): Promise<boolean>;
    }
}
declare module "jassijs/server/DBManagerExt" {
    export function extendDBManager(): void;
}
declare module "jassijs/server/DoRemoteProtocol" {
    import { Context } from "jassijs/remote/RemoteObject";
    export function remoteProtocol(request: any, response: any): void;
    export function _execute(protext: string, request: any, context: Context): Promise<string>;
}
declare module "client/jassijs/server/ext/EmpyDeclaration" {
    export {};
}
/// <amd-dependency name="JSZip" path="jszip" />
declare module "client/jassijs/server/ext/jszip" {
    var JSZip: any;
    export default JSZip;
}
declare module "jassijs/server/Filesystem" {
    import { FileNode } from "jassijs/remote/FileNode";
    global {
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
        dir(curdir?: string, appendDate?: boolean, parentPath?: string, parent?: FileNode): Promise<FileNode>;
        loadFile(fileName: string): unknown;
        loadFiles(fileNames: string[]): unknown;
        dirFiles(dir: string, extensions: string[], ignore?: string[]): Promise<string[]>;
        zip(directoryname: string, serverdir?: boolean): Promise<string>;
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
        createRemoteModulIfNeeded(modul: string): any;
        getDirectoryname(ppath: any): any;
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
        saveFile(fileName: string, content: string): any;
    }
}
declare module "jassijs/server/FS" {
    import { Test } from "jassijs/remote/Test";
    class Stats {
        mtimeMs: number;
        isDirectory: () => boolean;
    }
    export class FS {
        private static db;
        private static getDB;
        constructor();
        static _readdir(db: IDBDatabase, folder: string, withSubfolders?: boolean, fullPath?: boolean): Promise<string[]>;
        readdir(folder: string): Promise<string[]>;
        readFile(file: string, format?: string, fallback?: boolean): Promise<string>;
        stat(file: string): Promise<Stats>;
        getDirectoryname(path: any): any;
        private static _mkdir;
        mkdir(filename: string, options?: {
            recursive?: boolean;
        }): any;
        private loadFileEntry;
        private static _loadFileEntry;
        writeFile(file: string, data: string): any;
        rename(oldPath: string, newPath: string): any;
        private static _removeEntry;
        unlink(file: string): unknown;
        rmdir(dirName: any, options?: {
            recursive?: boolean;
        }): any;
        private exists;
    }
    export function exists(filename: string): Promise<boolean>;
    export function test(tt: Test): any;
}
declare module "jassijs/server/Indexer" {
<<<<<<< HEAD
    import { ts } from "jassijs/server/NativeAdapter";
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    export abstract class Indexer {
        abstract fileExists(name: any): any;
        abstract readFile(name: any): any;
        abstract getFileTime(name: any): any;
        abstract createDirectory(name: any): any;
        abstract writeFile(name: string, content: string): any;
        abstract dirFiles(modul: string, path: string, extensions: string[], ignore: string[]): Promise<string[]>;
        updateModul(root: any, modul: string, isserver: boolean): any;
        convertArgument(arg: any): any;
        collectAnnotations(node: ts.Node, outDecorations: any, depth?: number): void;
    }
}
declare module "jassijs/server/Installserver" {
    var autostart: () => any;
    export { autostart };
}
declare module "jassijs/server/LocalFS" {
    import { Test } from "jassijs/remote/Test";
    class Stats {
        mtimeMs: number;
        isDirectory: () => boolean;
    }
    export class LocalFS {
        private static db;
        private static getDB;
        constructor();
        readdir(folder: string): Promise<string[]>;
        readFile(file: string, format?: string, fallback?: boolean): Promise<string>;
        stat(file: string): Promise<Stats>;
        getDirectoryname(path: any): any;
        mkdir(filename: string, options?: {
            recursive?: boolean;
        }): any;
        private loadFileEntry;
        saveHandle(handle: any): any;
        writeFile(file: string, data: string): any;
        rename(oldPath: string, newPath: string): any;
        unlink(file: string): any;
        rmdir(dirName: any, options?: {
            recursive?: boolean;
        }): any;
        private exists;
    }
    export function exists(filename: string): Promise<boolean>;
    export function deleteHandle(): any;
    export function createHandle(): any;
    export function test(tt: Test): any;
}
declare module "jassijs/server/LocalProtocol" {
    import { Context } from "jassijs/remote/RemoteObject";
    import { RemoteProtocol } from "jassijs/remote/RemoteProtocol";
    export function messageReceived(param: any): any;
    export function test(): any;
    export function localExec(prot: RemoteProtocol, context?: Context): unknown;
}
declare module "jassijs/server/NativeAdapter" {
<<<<<<< HEAD
    export { TypescriptNamespace as ts };
    const ts: any;
=======
    var ts: any;
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
    export { ts };
    var exists: any;
    var myfs: any;
    export { exists };
    export { myfs };
    export function dozip(directoryname: string, serverdir?: boolean): Promise<string>;
    export function reloadJSAll(filenames: string[], afterUnload: () => {}): unknown;
    export function transpile(fileName: string, inServerdirectory?: boolean): any;
    var doNotReloadModule: boolean;
    export { doNotReloadModule };
}
<<<<<<< HEAD
declare module "jassijs/server/NeverCallMe" {
    import * as TypeScript from 'typescript';
    global {
        export import TypescriptNamespace = TypeScript;
        export import ts = TypeScript;
    }
}
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/server/RegistryIndexer" {
    import { Indexer } from "jassijs/server/Indexer";
    export class ServerIndexer extends Indexer {
        updateRegistry(): any;
        dirFiles(modul: string, path: string, extensions: string[], ignore?: string[]): Promise<string[]>;
        writeFile(name: string, content: string): any;
        createDirectory(name: string): any;
        getFileTime(filename: any): Promise<number>;
        fileExists(filename: any): Promise<boolean>;
        readFile(filename: any): Promise<any>;
    }
}
declare module "jassijs/server/Reloader" {
    export class Reloader {
        static cache: {};
        static reloadCodeFromServerIsRunning: boolean;
        static instance: Reloader;
        listener: {};
        /**
         * reloads Code
         */
        private constructor();
        /**
         * check code changes out of the browser if localhost and load the changes in to the browser
         */
        static startReloadCodeFromServer(): void;
        /**
         * listener for code reloaded
         * @param {function} func - callfunction for the event
         */
        addEventCodeReloaded(func: any): void;
        removeEventCodeReloaded(func: any): void;
        private _findScript;
        reloadJS(fileName: string): any;
        reloadJSAll(fileNames: string[], afterUnload?: () => {}, useServerRequire?: boolean): any;
        migrateModul(allModules: any, file: any, modul: any): void;
        migrateClasses(file: any, oldmodul: any, modul: any): void;
    }
}
<<<<<<< HEAD
declare module "jassijs/server/testserver" {
    export {};
}
declare module "jassijs/server/testserver2" {
    export {};
}
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
declare module "jassijs/server/Testuser" {
    export class Testuser {
        id: number;
        firstname: string;
        lastname: string;
    }
}
declare module "jassijs/server/TypeORMListener" {
    import { EntitySubscriberInterface, InsertEvent, RemoveEvent, UpdateEvent } from "typeorm";
    export class TypeORMListener implements EntitySubscriberInterface {
        savetimer: any;
        saveDB(event: any): void;
        /**
         * Called after entity is loaded.
         */
        afterLoad(entity: any): void;
        /**
         * Called before post insertion.
         */
        beforeInsert(event: InsertEvent<any>): void;
        /**
         * Called after entity insertion.
         */
        afterInsert(event: InsertEvent<any>): void;
        /**
         * Called before entity update.
         */
        beforeUpdate(event: UpdateEvent<any>): void;
        /**
         * Called after entity update.
         */
        afterUpdate(event: UpdateEvent<any>): void;
        /**
         * Called before entity removal.
         */
        beforeRemove(event: RemoveEvent<any>): void;
        /**
         * Called after entity removal.
         */
        afterRemove(event: RemoveEvent<any>): void;
        /**
         * Called before transaction start.
         */
        beforeTransactionStart(event: any): void;
        /**
         * Called after transaction start.
         */
        afterTransactionStart(event: any): void;
        /**
         * Called before transaction commit.
         */
        beforeTransactionCommit(event: any): void;
        /**
         * Called after transaction commit.
         */
        afterTransactionCommit(event: any): void;
        /**
         * Called before transaction rollback.
         */
        beforeTransactionRollback(event: any): void;
        /**
         * Called after transaction rollback.
         */
        afterTransactionRollback(event: any): void;
    }
}
declare module "jassijs/modul" {
    const _default: {
        css: {
            "jassijs.css": string;
            "materialdesignicons.min.css": string;
            "jquery-ui.css": string;
            "chosen.css": string;
            "goldenlayout-base.css": string;
            "goldenlayout-light-theme.css": string;
            "contextMenu.css": string;
        };
        types: {
            "node_modules/jquery/JQuery.d.ts": string;
            "node_modules/jquery/JQueryStatic.d.ts": string;
            "node_modules/jquery/legacy.d.ts": string;
            "node_modules/jquery/misc.d.ts": string;
            "node_modules/jqueryui/index.d.ts": string;
            "node_modules/chosen-js/index.d.ts": string;
            "node_modules/jquery.fancytree/index.d.ts": string;
            "node_modules/requirejs/index.d.ts": string;
            "node_modules/sizzle/index.d.ts": string;
            "tabulator-tables.ts": string;
        };
        require: {
            shim: {
                goldenlayout: {};
                "jquery.choosen": {};
                "jquery.contextMenu": {};
                'jquery.fancytree': {};
                'jquery.fancytree.dnd': {};
                'jquery.ui': {};
                'jquery.notify': {};
                'jquery.ui.touch': {};
                spectrum: {};
            };
            paths: {
                'intersection-observer': string;
                goldenlayout: string;
                'jquery.choosen': string;
                'jquery.contextMenu': string;
                'jquery.fancytree': string;
                "jquery.fancytree.ui-deps": string;
                'jquery.fancytree.filter': string;
                'jquery.fancytree.multi': string;
                'jquery.fancytree.dnd': string;
                jquery: string;
                'jquery.ui': string;
                'jquery.ui.touch': string;
                'jquery.notify': string;
                'jquery.language': string;
                'js-cookie': string;
                lodash: string;
                luxon: string;
                papaparse: string;
                'source.map': string;
                spectrum: string;
                splitlib: string;
                tabulatorlib: string;
                tinymcelib: string;
                'tabulator-tables': string;
                "reflect-metadata": string;
<<<<<<< HEAD
                pako: string;
                untar: string;
=======
>>>>>>> d240df83ceb960d653afe75fc93bccd1c67e9279
            };
        };
        server: {
            require: {
                shim: {};
                paths: {
                    'js-cookie': string;
                    "reflect-metadata": string;
                    jszip: string;
                    "js-sql-parser": string;
                    typeorm: string;
                    typeormbrowser: string;
                    "window.SQL": string;
                };
            };
            loadbeforestart: {};
        };
    };
    export default _default;
}
