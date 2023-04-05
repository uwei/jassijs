import "reflect-metadata";
import { Test } from "jassijs/remote/Test";

const paramMetadataKey = Symbol("paramMetadataKey");

export class ValidationOptions {
    message?: string;
}

export function registerValidation(name: string, options: ValidationOptions, func:(target:any,propertyName:string,value:any)=>string) {
    return (target, propertyKey: string, parameterIndex: number) => {
        //@ts-ignore
        let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
        if (params[parameterIndex] === undefined)
            params[parameterIndex] = {};
        params[parameterIndex][name] = {
            func,
            options
        }
        //@ts-ignore
        Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
    };
}
export class ValidationMaxOptions extends ValidationOptions {
    max: number;
}
export function ValidateMax(options: ValidationMaxOptions): Function {
    return registerValidation("ValidateMax", options,
        (target: any, propertyName: string, val: any) => {
            if (options?.max && val > options?.max)
                return "value {value} is not longer then {max}"
        }
    )
}
export class ValidationMinOptions extends ValidationOptions {
    min: number;
}
export function ValidateMin(options: ValidationMinOptions): Function {
    return registerValidation("ValidateMin", options,
        (target: any, propertyName: string, val: any) => {
            if (options?.min && val < options?.min)
                return "value {value} is not smaller then {min}"
        }
    )
}

export class ValidationIsIntOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsInt(options?: ValidationIsIntOptions): Function {
    return registerValidation("ValidateIsInt", options,
        (target: any, propertyName: string, val: any) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (!Number.isInteger(val))
                return "value {value} is not an Integer"
        }
    )
}

export class ValidationIsStringOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsString(options?: ValidationIsIntOptions): Function {
    return registerValidation("ValidateIsInt", options,
        (target: any, propertyName: string, val: any) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (typeof val !== 'string' && !(val instanceof String))
                return "value {value} is not a String"
        }
    )
}

function translateMessage(msg: string, rule: string, property: string, target, value, options: ValidationOptions) {
    if (msg === undefined)
        return undefined;
    var ret: string = options?.message ? options?.message : msg;
    ret = ret.replaceAll("{rule}", rule).replaceAll("{property}", property).replaceAll("{target}", target).replaceAll("{value}", value);
    if (options) {
        for (var key in options) {
            ret = ret.replaceAll("{" + key + "}", options[key]);
        }
    }
    return ret;
}

export class ValidationError {
    value: object;
    target: object;
    property: string;
    message: string;
    constructor(value, target, property: string, message: string) {
        this.value = value;
        this.target = target;
        this.property = property;
        this.message = message;
    }
}

export function ValidateFunctionParameter(): Function {
    return (target, propertyName, descriptor: PropertyDescriptor) => {
        let method = descriptor.value;
        descriptor.value = function () {
            //@ts-ignore
            let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
            if (params) {
                for (var p in params) {
                    for (var rule in params[p]) {
                        //@ts-ignore
                        var arg = (p > arguments.length) ? undefined : arguments[p];
                        var val = arguments[p];
                        var func = params[p][rule].func;
                        var err = func(target, propertyName, val);
                        var test = translateMessage(err, rule, propertyName, target, val, params[p][rule].options);
                        if (test !== undefined)
                            throw new Error(test);
                    }
                }
            }
            return method.apply(this, arguments);
        }
    };
}


export function validate(obj,options=undefined,raiseError:boolean=undefined): ValidationError[] {
    var ret: ValidationError[] = [];
    var target = obj.__proto__;
    for (var propertyName in obj) {
        //@ts-ignore
        let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
        if (params) {
            for (var p in params) {
                for (var rule in params[p]) {
                    //@ts-ignore
                    var val = obj[propertyName];
                    var func = params[p][rule].func;
                    var err = func(target, propertyName, val);
                    var test = translateMessage(err, rule, propertyName, obj, val, params[p][rule].options);
                    if (test !== undefined)
                        ret.push(new ValidationError(val, target, propertyName, test));
                }
            }
        }
    }
    if(raiseError&&ret.length>0){
        var sret=[];
        ret.forEach((err)=>sret.push("ValidationError "+err.property+": " +err.message));
        throw new Error(sret.join("\r\n"));
    }
    return ret;
}

class TestSample {
    @ValidateIsInt({ message: "r:{rule} p:{property} v:{value}" })
    @ValidateMax({ max: 10 , message:"{max}"})
    @ValidateMin({ min: 5, message: "{value} is smaller then {min}" })
    id: number;
    @ValidateFunctionParameter()
    async call(@ValidateIsInt() num,@ValidateIsString({optional:true}) text=undefined) {
        return num;
    }
    
    @ValidateIsString({optional:true,message:"no string"})
    str;
}

export async function test(test: Test) {
    
    var obj = new TestSample();
    obj.id = 8;
    var hh = validate(obj);
    test.expectEqual(validate(obj).length === 0);
    //@ts-ignore
    obj.id = "8";
    test.expectEqual(validate(obj)[0].message === "r:ValidateIsInt p:id v:8");
    test.expectEqual(await obj.call(8) === 8);
    test.expectError(() => obj.call("8"));
    obj.id = 0;
    test.expectEqual(validate(obj)[0].message==="0 is smaller then 5");
    obj.id=20;
    test.expectEqual(validate(obj)[0].message==="10");
    obj.str=20;
    obj.id = 8;
    var hdh=validate(obj)[0].message;
    test.expectError(() => validate(obj,undefined,true));
    test.expectEqual(validate(obj)[0].message==="no string");
    test.expectEqual(await obj.call(8,"ok") === 8);
    test.expectError(() => obj.call("8",8));

    
}