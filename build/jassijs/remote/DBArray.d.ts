export declare class DBArray
/**
* Array for jassijs.base.DBObject's
* can be saved to db
* @class jassijs.base.DBArray
*/
 extends Array {
    constructor(...args: any[]);
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
    resolve(): Promise<this>;
    /**
     * remove an object
     * if the object is linked to an other object then update this
     * @param {object} ob - the object to remove
     */
    remove(ob: any): void;
}
