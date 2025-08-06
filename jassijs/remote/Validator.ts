import "reflect-metadata";
import { Test } from "jassijs/remote/Test";

const paramMetadataKey = Symbol("paramMetadataKey");

export class ValidationOptions {
    message?: string;
}

export function registerValidation(name: string, options: ValidationOptions, func: (target: any, propertyName: string, value: any, options: any) => string) {
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
class ValidateOptions {
    /**
     * e.g. {ValidateInt:{optional:false}} delegates optional:false to all ValidateInt rules
     * e.g. {ALL:{optional:false}} delegates optional:false to all Validators rules}
     */
    delegateOptions?: { [ValidatorClassName: string]: any };
}
export function validate(obj, options: ValidateOptions = undefined, raiseError: boolean = undefined): ValidationError[] {
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

                    var opts = Object.assign({}, params[p][rule].options);
                    if (options?.delegateOptions?.ALL) {
                        opts = Object.assign(opts, options?.delegateOptions?.ALL);
                    }
                    if (options?.delegateOptions&&options?.delegateOptions[rule]) {
                        opts = Object.assign(opts, options?.delegateOptions[rule]);
                    }
                    var err = func(target, propertyName, val, opts);
                    var test = translateMessage(err, rule, propertyName, obj, val, params[p][rule].options);
                    if (test !== undefined)
                        ret.push(new ValidationError(val, target, propertyName, test));
                }
            }
        }
    }
    if (raiseError && ret.length > 0) {
        var sret = [];
        ret.forEach((err) => sret.push("ValidationError " + err.property + ": " + err.message));
        throw new Error(sret.join("\r\n"));
    }
    return ret;
}

export class ValidationIsArrayOptions extends ValidationOptions {
    optional?: boolean;
    type?: (type?: any) => any;
    alternativeJsonProperties?: string[];
}

export function ValidateIsArray(options?: ValidationIsArrayOptions): Function {
    return registerValidation("ValidateIsArray", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (!Array.isArray(val))
                return "value {value} is not an array";
            if (options?.type) { 
                for (var x = 0; x < val.length; x++) {
                    var tp=options.type();
                    if (val[x] !== undefined && !(val[x] instanceof tp)) {
                        if (typeof val[x] === 'string' && tp == String)
                            continue;
                        if (typeof val[x] === 'number' && tp == Number)
                            continue;
                        if (typeof val[x] === 'boolean' && tp == Boolean)
                            continue;
                        if (options?.alternativeJsonProperties) {
                            for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                                var key = options.alternativeJsonProperties[x];
                                if (val[x][key] === undefined)
                                    return propertyName + " is not array of type " + tp.name;
                            }
                        } else
                            return "value {value} is not an array ot type " + tp.name;
                    }
                }
            }
        }
    )
}

export class ValidationIsBooleanOptions extends ValidationOptions {
    optional?: boolean;
    type?: any;
}
export function ValidateIsBoolean(options?: ValidationIsBooleanOptions): Function {
    return registerValidation("ValidateIsBoolean", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (typeof val !== 'boolean')
                return propertyName + " is not a Boolean";
        }
    )
}

export class ValidationIsDateOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsDate(options?: ValidationIsDateOptions): Function {
    return registerValidation("ValidateIsDate", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (!(val instanceof Date && !isNaN(val.valueOf())))
                return propertyName + " is not a date"
        }
    )
}

export function ValidateFunctionParameter(): Function {
    return (target, propertyName, descriptor: PropertyDescriptor, options) => {
        let method = descriptor.value;
        if (method === undefined)
            throw new Error("sdfgsdfgsfd");
        const funcname = method.name;
        let smethod: string = target[method.name].toString();
		//save params for MyRemoteObject
        let sparam = smethod.substring(smethod.indexOf('(') + 1, smethod.indexOf(')'));
		let paramnames = sparam.split(',');
		if (method["__originalParams"]) 
			paramnames=method["__originalParams"] 

        const { [funcname]: newfunc } = {//we need named function!
            [funcname]: function () {
                //@ts-ignore
                let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyName);
                if (params) {
                    for (var p in params) {
                        for (var rule in params[p]) {
                            //@ts-ignore
                            var arg = (p > arguments.length) ? undefined : arguments[p];
                            var val = arguments[p];
                            var func = params[p][rule].func;
                            var opt = params[p][rule].options;
                            var err = func(target, "parameter " + p, val, opt);
                            var test = translateMessage(err, rule, propertyName, target, val, params[p][rule].options);
                            if (test !== undefined)
                                throw new Error(test);
                        }
                    }
                }
                return method.apply(this, arguments);
            }
        }
        newfunc["__originalParams"]=paramnames;
        descriptor.value = newfunc;
    };
}
export class ValidationIsInOptions extends ValidationOptions {
    optional?: boolean;
    in: any[];
}
export function ValidateIsIn(options?: ValidationIsInOptions): Function {
    return registerValidation("ValidateIsIn", options,
        (target: any, propertyName: string, val: any, options:ValidationIsInOptions) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if(options.in.indexOf(val)===-1)
                return propertyName + " is not valid";
        }
    )
}
export class ValidationIsInstanceOfOptions extends ValidationOptions {
    optional?: boolean;
    type: (type?: any) => any;
    /**
     * ["id"] means an object {id:9} is also a valid type
     */
    alternativeJsonProperties?: string[];
}
export function ValidateIsInstanceOf(options?: ValidationIsInstanceOfOptions): Function {
    return registerValidation("ValidateIsInstanceOf", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            var tp=options.type();
            if (!(val instanceof tp)) {
                if (options?.alternativeJsonProperties) {
                    for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                        var key = options.alternativeJsonProperties[x];
                        if (val[key] === undefined)
                            return propertyName + " is not of type " + tp.name;
                    }
                } else
                    return propertyName + " is not of type " + tp.name;
            }
        }
    )
}


export class ValidationIsIntOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsInt(options?: ValidationIsIntOptions): Function {
    return registerValidation("ValidateIsInt", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (!Number.isInteger(val))
                return propertyName + " is not an Integer";
        }
    )
}

export class ValidationMaxOptions extends ValidationOptions {
    max: number;
}
export function ValidateMax(options: ValidationMaxOptions): Function {
    return registerValidation("ValidateMax", options,
        (target: any, propertyName: string, val: any, options) => {
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
        (target: any, propertyName: string, val: any, options) => {
            if (options?.min && val < options?.min)
                return "value {value} is not smaller then {min}"
        }
    )
}

export class ValidationIsNumberOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsNumber(options?: ValidationIsNumberOptions): Function {
    return registerValidation("ValidateIsNumber", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (!(typeof val === 'number' && isFinite(val)))
                return propertyName + " is not a Number";
        }
    )
}

export class ValidationIsStringOptions extends ValidationOptions {
    optional?: boolean;
}
export function ValidateIsString(options?: ValidationIsIntOptions): Function {
    return registerValidation("ValidateIsInt", options,
        (target: any, propertyName: string, val: any, options) => {
            if ((val === undefined || val === null) && options?.optional === true)
                return undefined;
            if (typeof val !== 'string' && !(val instanceof String))
                return propertyName + " is not a String";
        }
    )
}







class TestSample {
    @ValidateIsInt({ message: "r:{rule} p:{property} v:{value}" })
    @ValidateMax({ max: 10, message: "{max}" })
    @ValidateMin({ min: 5, message: "{value} is smaller then {min}" })
    id: number;
    @ValidateFunctionParameter()
    async call(@ValidateIsInt() num, @ValidateIsString({ optional: true }) text = undefined) {
        return num;
    }

    @ValidateIsString({ optional: true, message: "no string" })
    str;

    @ValidateIsInstanceOf({ type: t=>TestSample })
    test: any = this;

    @ValidateIsArray({ type: t=>TestSample })
    testarr: any = [this];

    @ValidateIsNumber()
    num: any = 9.1;

    @ValidateIsBoolean()
    bol: any = true;

    @ValidateIsIn({in:[1,"2","3"]})
    inprop:any=1;
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
    test.expectEqual(validate(obj)[0].message === "0 is smaller then 5");
    obj.id = 20;
    test.expectEqual(validate(obj)[0].message === "10");
    obj.str = 20;
    obj.id = 8;
    var hdh = validate(obj)[0].message;
    test.expectError(() => validate(obj, undefined, true));
    test.expectEqual(validate(obj)[0].message === "no string");
    test.expectEqual(await obj.call(8, "ok") === 8);
    test.expectError(() => obj.call("8", 8));
    test.expectEqual(await obj.call(8, "ok") === 8);
    obj.str = "kk";
    test.expectEqual(validate(obj).length === 0);
    obj.num = "1.2";
    test.expectError(() => validate(obj, undefined, true));
    obj.num = 1.2;
    obj.testarr = 8;
    test.expectError(() => validate(obj, undefined, true));
    obj.testarr = [8];
    test.expectError(() => validate(obj, undefined, true));
    obj.testarr = [];
    test.expectEqual(validate(obj).length === 0);

    obj.bol = "";
    test.expectError(() => validate(obj, undefined, true));
    obj.bol = true;
    test.expectEqual(validate(obj).length === 0);

    obj.test = { kk: 9 };
    test.expectError(() => validate(obj, undefined, true));
    obj.test = { id: 9 };
    test.expectEqual(validate(obj, {
        delegateOptions: {
            ValidateIsInstanceOf: { alternativeJsonProperties: ["id"] }
        }
    }).length === 0);
    obj.test = obj;
    obj.testarr = [{ id: 8 }];
    test.expectError(() => validate(obj, undefined, true));

    test.expectEqual(validate(obj, {
        delegateOptions: {
            ValidateIsArray: { alternativeJsonProperties: ["id"] }
        }
    }).length === 0);
    obj.testarr=[];
    test.expectEqual(validate(obj).length === 0);
    obj.inprop=5;
    test.expectError(() => validate(obj, undefined, true));
    obj.inprop="2";
    test.expectEqual(validate(obj).length === 0);

   
}

interface MyOB {
    hallo();

}
var l: MyOB;


