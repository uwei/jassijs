"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.ValidateIsString = exports.ValidationIsStringOptions = exports.ValidateIsNumber = exports.ValidationIsNumberOptions = exports.ValidateMin = exports.ValidationMinOptions = exports.ValidateMax = exports.ValidationMaxOptions = exports.ValidateIsInt = exports.ValidationIsIntOptions = exports.ValidateIsInstanceOf = exports.ValidationIsInstanceOfOptions = exports.ValidateFunctionParameter = exports.ValidateIsDate = exports.ValidationIsDateOptions = exports.ValidateIsBoolean = exports.ValidationIsBooleanOptions = exports.ValidateIsArray = exports.ValidationIsArrayOptions = exports.validate = exports.ValidationError = exports.registerValidation = exports.ValidationOptions = void 0;
require("reflect-metadata");
const paramMetadataKey = Symbol("paramMetadataKey");
class ValidationOptions {
}
exports.ValidationOptions = ValidationOptions;
function registerValidation(name, options, func) {
    return (target, propertyKey, parameterIndex) => {
        //@ts-ignore
        let params = Reflect.getOwnMetadata(paramMetadataKey, target, propertyKey) || {};
        if (params[parameterIndex] === undefined)
            params[parameterIndex] = {};
        params[parameterIndex][name] = {
            func,
            options
        };
        //@ts-ignore
        Reflect.defineMetadata(paramMetadataKey, params, target, propertyKey);
    };
}
exports.registerValidation = registerValidation;
function translateMessage(msg, rule, property, target, value, options) {
    if (msg === undefined)
        return undefined;
    var ret = (options === null || options === void 0 ? void 0 : options.message) ? options === null || options === void 0 ? void 0 : options.message : msg;
    ret = ret.replaceAll("{rule}", rule).replaceAll("{property}", property).replaceAll("{target}", target).replaceAll("{value}", value);
    if (options) {
        for (var key in options) {
            ret = ret.replaceAll("{" + key + "}", options[key]);
        }
    }
    return ret;
}
class ValidationError {
    constructor(value, target, property, message) {
        this.value = value;
        this.target = target;
        this.property = property;
        this.message = message;
    }
}
exports.ValidationError = ValidationError;
class ValidateOptions {
}
function validate(obj, options = undefined, raiseError = undefined) {
    var _a, _b;
    var ret = [];
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
                    if ((_a = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _a === void 0 ? void 0 : _a.ALL) {
                        opts = Object.assign(opts, (_b = options === null || options === void 0 ? void 0 : options.delegateOptions) === null || _b === void 0 ? void 0 : _b.ALL);
                    }
                    if (options === null || options === void 0 ? void 0 : options.delegateOptions[rule]) {
                        opts = Object.assign(opts, options === null || options === void 0 ? void 0 : options.delegateOptions[rule]);
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
exports.validate = validate;
class ValidationIsArrayOptions extends ValidationOptions {
}
exports.ValidationIsArrayOptions = ValidationIsArrayOptions;
function ValidateIsArray(options) {
    return registerValidation("ValidateIsArray", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!Array.isArray(val))
            return "value {value} is not an array";
        if (options === null || options === void 0 ? void 0 : options.type) {
            for (var x = 0; x < val.length; x++) {
                if (val[x] !== undefined && !(val[x] instanceof options.type)) {
                    if (typeof val[x] === 'string' && options.type == String)
                        continue;
                    if (typeof val[x] === 'number' && options.type == Number)
                        continue;
                    if (typeof val[x] === 'boolean' && options.type == Boolean)
                        continue;
                    if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                        for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                            var key = options.alternativeJsonProperties[x];
                            if (val[x][key] === undefined)
                                return propertyName + " is not array of type " + options.type.name;
                        }
                    }
                    else
                        return "value {value} is not an array ot type " + options.type.name;
                }
            }
        }
    });
}
exports.ValidateIsArray = ValidateIsArray;
class ValidationIsBooleanOptions extends ValidationOptions {
}
exports.ValidationIsBooleanOptions = ValidationIsBooleanOptions;
function ValidateIsBoolean(options) {
    return registerValidation("ValidateIsBoolean", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (typeof val !== 'boolean')
            return propertyName + " is not a Boolean";
    });
}
exports.ValidateIsBoolean = ValidateIsBoolean;
class ValidationIsDateOptions extends ValidationOptions {
}
exports.ValidationIsDateOptions = ValidationIsDateOptions;
function ValidateIsDate(options) {
    return registerValidation("ValidateIsDate", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!(val instanceof Date && !isNaN(val.valueOf())))
            return propertyName + " is not a date";
    });
}
exports.ValidateIsDate = ValidateIsDate;
function ValidateFunctionParameter() {
    return (target, propertyName, descriptor, options) => {
        console.log(propertyName);
        let method = descriptor.value;
        if (method === undefined)
            throw new Error("sdfgsdfgsfd");
        const funcname = method.name;
        const { [funcname]: newfunc } = {
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
        };
        descriptor.value = newfunc;
    };
}
exports.ValidateFunctionParameter = ValidateFunctionParameter;
class ValidationIsInstanceOfOptions extends ValidationOptions {
}
exports.ValidationIsInstanceOfOptions = ValidationIsInstanceOfOptions;
function ValidateIsInstanceOf(options) {
    return registerValidation("ValidateIsInstanceOf", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!(val instanceof (options.type))) {
            if (options === null || options === void 0 ? void 0 : options.alternativeJsonProperties) {
                for (var x = 0; x < options.alternativeJsonProperties.length; x++) {
                    var key = options.alternativeJsonProperties[x];
                    if (val[key] === undefined)
                        return propertyName + " is not of type " + options.type.name;
                }
            }
            else
                return propertyName + " is not of type " + options.type.name;
        }
    });
}
exports.ValidateIsInstanceOf = ValidateIsInstanceOf;
class ValidationIsIntOptions extends ValidationOptions {
}
exports.ValidationIsIntOptions = ValidationIsIntOptions;
function ValidateIsInt(options) {
    return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!Number.isInteger(val))
            return propertyName + " is not an Integer";
    });
}
exports.ValidateIsInt = ValidateIsInt;
class ValidationMaxOptions extends ValidationOptions {
}
exports.ValidationMaxOptions = ValidationMaxOptions;
function ValidateMax(options) {
    return registerValidation("ValidateMax", options, (target, propertyName, val, options) => {
        if ((options === null || options === void 0 ? void 0 : options.max) && val > (options === null || options === void 0 ? void 0 : options.max))
            return "value {value} is not longer then {max}";
    });
}
exports.ValidateMax = ValidateMax;
class ValidationMinOptions extends ValidationOptions {
}
exports.ValidationMinOptions = ValidationMinOptions;
function ValidateMin(options) {
    return registerValidation("ValidateMin", options, (target, propertyName, val, options) => {
        if ((options === null || options === void 0 ? void 0 : options.min) && val < (options === null || options === void 0 ? void 0 : options.min))
            return "value {value} is not smaller then {min}";
    });
}
exports.ValidateMin = ValidateMin;
class ValidationIsNumberOptions extends ValidationOptions {
}
exports.ValidationIsNumberOptions = ValidationIsNumberOptions;
function ValidateIsNumber(options) {
    return registerValidation("ValidateIsNumber", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!(typeof val === 'number' && isFinite(val)))
            return propertyName + " is not a Number";
    });
}
exports.ValidateIsNumber = ValidateIsNumber;
class ValidationIsStringOptions extends ValidationOptions {
}
exports.ValidationIsStringOptions = ValidationIsStringOptions;
function ValidateIsString(options) {
    return registerValidation("ValidateIsInt", options, (target, propertyName, val, options) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (typeof val !== 'string' && !(val instanceof String))
            return propertyName + " is not a String";
    });
}
exports.ValidateIsString = ValidateIsString;
class TestSample {
    constructor() {
        this.test = this;
        this.testarr = [this];
        this.num = 9.1;
        this.bol = true;
    }
    async call(num, text = undefined) {
        return num;
    }
}
__decorate([
    ValidateIsInt({ message: "r:{rule} p:{property} v:{value}" }),
    ValidateMax({ max: 10, message: "{max}" }),
    ValidateMin({ min: 5, message: "{value} is smaller then {min}" }),
    __metadata("design:type", Number)
], TestSample.prototype, "id", void 0);
__decorate([
    ValidateFunctionParameter(),
    __param(0, ValidateIsInt()),
    __param(1, ValidateIsString({ optional: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TestSample.prototype, "call", null);
__decorate([
    ValidateIsString({ optional: true, message: "no string" }),
    __metadata("design:type", Object)
], TestSample.prototype, "str", void 0);
__decorate([
    ValidateIsInstanceOf({ type: TestSample }),
    __metadata("design:type", Object)
], TestSample.prototype, "test", void 0);
__decorate([
    ValidateIsArray({ type: TestSample }),
    __metadata("design:type", Object)
], TestSample.prototype, "testarr", void 0);
__decorate([
    ValidateIsNumber(),
    __metadata("design:type", Object)
], TestSample.prototype, "num", void 0);
__decorate([
    ValidateIsBoolean(),
    __metadata("design:type", Object)
], TestSample.prototype, "bol", void 0);
async function test(test) {
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
}
exports.test = test;
var l;
//# sourceMappingURL=Validator.js.map