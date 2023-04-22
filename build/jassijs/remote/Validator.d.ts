import "reflect-metadata";
import { Test } from "jassijs/remote/Test";
export declare class ValidationOptions {
    message?: string;
}
export declare function registerValidation(name: string, options: ValidationOptions, func: (target: any, propertyName: string, value: any, options: any) => string): (target: any, propertyKey: string, parameterIndex: number) => void;
export declare class ValidationError {
    value: object;
    target: object;
    property: string;
    message: string;
    constructor(value: any, target: any, property: string, message: string);
}
declare class ValidateOptions {
    /**
     * e.g. {ValidateInt:{optional:false}} delegates optional:false to all ValidateInt rules
     * e.g. {ALL:{optional:false}} delegates optional:false to all Validators rules}
     */
    delegateOptions?: {
        [ValidatorClassName: string]: any;
    };
}
export declare function validate(obj: any, options?: ValidateOptions, raiseError?: boolean): ValidationError[];
export declare class ValidationIsArrayOptions extends ValidationOptions {
    optional?: boolean;
    type?: (type?: any) => any;
    alternativeJsonProperties?: string[];
}
export declare function ValidateIsArray(options?: ValidationIsArrayOptions): Function;
export declare class ValidationIsBooleanOptions extends ValidationOptions {
    optional?: boolean;
    type?: any;
}
export declare function ValidateIsBoolean(options?: ValidationIsBooleanOptions): Function;
export declare class ValidationIsDateOptions extends ValidationOptions {
    optional?: boolean;
}
export declare function ValidateIsDate(options?: ValidationIsDateOptions): Function;
export declare function ValidateFunctionParameter(): Function;
export declare class ValidationIsInOptions extends ValidationOptions {
    optional?: boolean;
    in: any[];
}
export declare function ValidateIsIn(options?: ValidationIsInOptions): Function;
export declare class ValidationIsInstanceOfOptions extends ValidationOptions {
    optional?: boolean;
    type: (type?: any) => any;
    /**
     * ["id"] means an object {id:9} is also a valid type
     */
    alternativeJsonProperties?: string[];
}
export declare function ValidateIsInstanceOf(options?: ValidationIsInstanceOfOptions): Function;
export declare class ValidationIsIntOptions extends ValidationOptions {
    optional?: boolean;
}
export declare function ValidateIsInt(options?: ValidationIsIntOptions): Function;
export declare class ValidationMaxOptions extends ValidationOptions {
    max: number;
}
export declare function ValidateMax(options: ValidationMaxOptions): Function;
export declare class ValidationMinOptions extends ValidationOptions {
    min: number;
}
export declare function ValidateMin(options: ValidationMinOptions): Function;
export declare class ValidationIsNumberOptions extends ValidationOptions {
    optional?: boolean;
}
export declare function ValidateIsNumber(options?: ValidationIsNumberOptions): Function;
export declare class ValidationIsStringOptions extends ValidationOptions {
    optional?: boolean;
}
export declare function ValidateIsString(options?: ValidationIsIntOptions): Function;
export declare function test(test: Test): Promise<void>;
export {};
