export declare class Test {
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
    expectErrorAsync(func: any): Promise<void>;
}
