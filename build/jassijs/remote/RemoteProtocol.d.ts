export declare class RemoteProtocol {
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
    stringify(obj: any): string;
    static simulateUser(user?: string, password?: string): Promise<void>;
    exec(config: any, object: any): Promise<unknown>;
    /**
   * call the server
   */
    call(): Promise<any>;
    /**
     * converts jsonstring to an object
     */
    parse(text: string): Promise<any>;
    test(): Promise<void>;
}
