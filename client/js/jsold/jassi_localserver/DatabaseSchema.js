define(["require", "exports", "jassi/remote/Classes", "jassi/remote/Database", "typeorm"], function (require, exports, Classes_1, Database_1, typeorm_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityOptions = exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
    Object.defineProperty(exports, "EntityOptions", { enumerable: true, get: function () { return typeorm_1.EntityOptions; } });
    function addDecorater(decoratername, delegate, ...args) {
        return function (...fargs) {
            var con = fargs.length === 1 ? fargs[0] : fargs[0].constructor;
            var clname = Classes_1.classes.getClassName(con);
            var field = fargs.length == 1 ? "this" : fargs[1];
            Database_1.db._setMetadata(con, field, decoratername, args, fargs, delegate);
            if (delegate)
                delegate(...args)(...fargs);
        };
    }
    function Entity(...param) {
        //DEntity(param)(pclass, ...params);
        console.log("Ent:" + JSON.stringify(param));
        return addDecorater("Entity", typeorm_1.Entity, ...param);
    }
    exports.Entity = Entity;
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", typeorm_1.PrimaryGeneratedColumn, ...param);
    }
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", typeorm_1.JoinColumn, ...param);
    }
    exports.JoinColumn = JoinColumn;
    function JoinTable(...param) {
        return addDecorater("JoinTable", typeorm_1.JoinTable, ...param);
    }
    exports.JoinTable = JoinTable;
    function Column(...param) {
        return addDecorater("Column", typeorm_1.Column, ...param);
    }
    exports.Column = Column;
    function PrimaryColumn(...param) {
        return addDecorater("PrimaryColumn", typeorm_1.PrimaryColumn, ...param);
    }
    exports.PrimaryColumn = PrimaryColumn;
    function OneToOne(...param) {
        return addDecorater("OneToOne", typeorm_1.OneToOne, ...param);
    }
    exports.OneToOne = OneToOne;
    function OneToMany(...param) {
        return addDecorater("OneToMany", typeorm_1.OneToMany, ...param);
    }
    exports.OneToMany = OneToMany;
    function ManyToOne(...param) {
        return addDecorater("ManyToOne", typeorm_1.ManyToOne, ...param);
    }
    exports.ManyToOne = ManyToOne;
    function ManyToMany(...param) {
        return addDecorater("ManyToMany", typeorm_1.ManyToMany, ...param);
    }
    exports.ManyToMany = ManyToMany;
});
//export function Entity(options?: EntityOptions): Function;
//export declare type PrimaryGeneratedColumnType = "int" | "int2" | "int4" | "int8" | "integer" | "tinyint" | "smallint" | "mediumint" | "bigint" | "dec" | "decimal" | "fixed" | "numeric" | "number" | "uuid";
//# sourceMappingURL=DatabaseSchema.js.map
//# sourceMappingURL=DatabaseSchema.js.map