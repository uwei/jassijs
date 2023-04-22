export declare class JassiError extends Error {
    constructor(msg: string);
}
/**
* manage all registered classes ->jassijs.register("classes")
* @class jassijs.base.Classes
*/
export declare class Classes {
    private _cache;
    private funcRegister;
    constructor();
    destroy(): void;
    /**
     * load the a class
     * @param classname - the class to load
     */
    loadClass(classname: string): Promise<new (...args: any[]) => any>;
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
declare let classes: Classes;
export { classes };
export declare function test(t: any): Promise<void>;
