define(["require", "exports", "jassi/remote/Database", "jassi/remote/Classes"], function (require, exports, Database_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ManyToMany = exports.ManyToOne = exports.OneToMany = exports.OneToOne = exports.PrimaryColumn = exports.Column = exports.JoinTable = exports.JoinColumn = exports.PrimaryGeneratedColumn = exports.Entity = void 0;
    //define Decoraters for typeorm
    let cache = {};
    function addDecorater(decoratername, ...args) {
        return function (...fargs) {
            var con = fargs.length === 1 ? fargs[0] : fargs[0].constructor;
            var clname = Classes_1.classes.getClassName(con);
            var field = fargs.length == 1 ? "this" : fargs[1];
            Database_1.db._setMetadata(con, field, decoratername, args, fargs, undefined);
        };
    }
    function Entity(...param) {
        return addDecorater("Entity", param);
    }
    exports.Entity = Entity;
    function PrimaryGeneratedColumn(...param) {
        return addDecorater("PrimaryGeneratedColumn", param);
    }
    exports.PrimaryGeneratedColumn = PrimaryGeneratedColumn;
    function JoinColumn(...param) {
        return addDecorater("JoinColumn", param);
    }
    exports.JoinColumn = JoinColumn;
    function JoinTable(...param) {
        return addDecorater("JoinTable", param);
    }
    exports.JoinTable = JoinTable;
    function Column(...any) {
        return addDecorater("Column", any);
    }
    exports.Column = Column;
    function PrimaryColumn(...any) {
        return addDecorater("PrimaryColumn", any);
    }
    exports.PrimaryColumn = PrimaryColumn;
    function OneToOne(...any) {
        return addDecorater("OneToOne", any);
    }
    exports.OneToOne = OneToOne;
    function OneToMany(...any) {
        return addDecorater("OneToMany", any);
    }
    exports.OneToMany = OneToMany;
    function ManyToOne(...any) {
        return addDecorater("ManyToOne", any);
    }
    exports.ManyToOne = ManyToOne;
    function ManyToMany(...any) {
        return addDecorater("ManyToMany", any);
    }
    exports.ManyToMany = ManyToMany;
});
//# sourceMappingURL=DatabaseSchema.js.map