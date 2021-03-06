"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
const typeorm_1 = require("typeorm");
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return typeorm_1.Entity; } });
Object.defineProperty(exports, "PrimaryGeneratedColumn", { enumerable: true, get: function () { return typeorm_1.PrimaryGeneratedColumn; } });
Object.defineProperty(exports, "JoinColumn", { enumerable: true, get: function () { return typeorm_1.JoinColumn; } });
Object.defineProperty(exports, "JoinTable", { enumerable: true, get: function () { return typeorm_1.JoinTable; } });
Object.defineProperty(exports, "Column", { enumerable: true, get: function () { return typeorm_1.Column; } });
Object.defineProperty(exports, "PrimaryColumn", { enumerable: true, get: function () { return typeorm_1.PrimaryColumn; } });
Object.defineProperty(exports, "OneToOne", { enumerable: true, get: function () { return typeorm_1.OneToOne; } });
Object.defineProperty(exports, "OneToMany", { enumerable: true, get: function () { return typeorm_1.OneToMany; } });
Object.defineProperty(exports, "ManyToOne", { enumerable: true, get: function () { return typeorm_1.ManyToOne; } });
Object.defineProperty(exports, "ManyToMany", { enumerable: true, get: function () { return typeorm_1.ManyToMany; } });
//export function Entity(options?: EntityOptions): Function;
//export declare type PrimaryGeneratedColumnType = "int" | "int2" | "int4" | "int8" | "integer" | "tinyint" | "smallint" | "mediumint" | "bigint" | "dec" | "decimal" | "fixed" | "numeric" | "number" | "uuid";
//# sourceMappingURL=DatabaseSchema.js.map