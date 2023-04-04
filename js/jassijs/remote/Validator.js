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
exports.test = exports.validate = exports.ValidateFunctionParameter = exports.ValidationError = exports.ValidateIsString = exports.ValidationIsStringOptions = exports.ValidateIsInt = exports.ValidationIsIntOptions = exports.ValidateMin = exports.ValidationMinOptions = exports.ValidateMax = exports.ValidationMaxOptions = exports.registerValidation = exports.ValidationOptions = void 0;
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
class ValidationMaxOptions extends ValidationOptions {
}
exports.ValidationMaxOptions = ValidationMaxOptions;
function ValidateMax(options) {
    return registerValidation("ValidateMax", options, (target, propertyName, val) => {
        if ((options === null || options === void 0 ? void 0 : options.max) && val > (options === null || options === void 0 ? void 0 : options.max))
            return "value {value} is not longer then {max}";
    });
}
exports.ValidateMax = ValidateMax;
class ValidationMinOptions extends ValidationOptions {
}
exports.ValidationMinOptions = ValidationMinOptions;
function ValidateMin(options) {
    return registerValidation("ValidateMin", options, (target, propertyName, val) => {
        if ((options === null || options === void 0 ? void 0 : options.min) && val < (options === null || options === void 0 ? void 0 : options.min))
            return "value {value} is not smaller then {min}";
    });
}
exports.ValidateMin = ValidateMin;
class ValidationIsIntOptions extends ValidationOptions {
}
exports.ValidationIsIntOptions = ValidationIsIntOptions;
function ValidateIsInt(options) {
    return registerValidation("ValidateIsInt", options, (target, propertyName, val) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (!Number.isInteger(val))
            return "value {value} is not an Integer";
    });
}
exports.ValidateIsInt = ValidateIsInt;
class ValidationIsStringOptions extends ValidationOptions {
}
exports.ValidationIsStringOptions = ValidationIsStringOptions;
function ValidateIsString(options) {
    return registerValidation("ValidateIsInt", options, (target, propertyName, val) => {
        if ((val === undefined || val === null) && (options === null || options === void 0 ? void 0 : options.optional) === true)
            return undefined;
        if (typeof val !== 'string' && !(val instanceof String))
            return "value {value} is not a String";
    });
}
exports.ValidateIsString = ValidateIsString;
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
function ValidateFunctionParameter() {
    return (target, propertyName, descriptor) => {
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
        };
    };
}
exports.ValidateFunctionParameter = ValidateFunctionParameter;
function validate(obj, options = undefined, raiseError = undefined) {
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
                    var err = func(target, propertyName, val);
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
class TestSample {
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
}
exports.test = test;
//# sourceMappingURL=Validator.js.map