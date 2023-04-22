declare global {
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
declare global {
    class JassiStatic extends Jassi {
    }
}
