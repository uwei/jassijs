declare global {
    export class ExtensionAction {
    }
}
export declare function $Class(longclassname: string): Function;
export declare function $register(servicename: string, ...params: any[]): Function;
declare global {
    interface String {
        replaceAll: any;
    }
}
/**
* main class for jassi
* @class Jassi
*/
export declare class Jassi {
    [key: string]: any;
    base: {
        [k: string]: any;
    };
    modules: {
        [key: string]: string;
    };
    isServer: boolean;
    constructor();
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
declare var jassi: Jassi;
export default jassi;
