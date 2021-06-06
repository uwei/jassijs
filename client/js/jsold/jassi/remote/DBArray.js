var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
        r = Reflect.decorate(decorators, target, key, desc);
    else
        for (var i = decorators.length - 1; i >= 0; i--)
            if (d = decorators[i])
                r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
        return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/remote/Jassi", "jassijs/remote/Classes"], function (require, exports, jassijs_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBArray = void 0;
    let cl = Classes_1.classes; //force Classes.
    let DBArray = class DBArray
    /**
    * Array for jassijs.base.DBObject's
    * can be saved to db
    * @class jassijs.base.DBArray
    */
     extends Array {
        constructor(...args) {
            super(...args);
        }
        /**
         * adds an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to add
         */
        add(ob) {
            if (ob === undefined || ob === null)
                throw "Error cannot add object null";
            this.push(ob);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs_1.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) < 0)
                            test.add(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob.__objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, this._parentObject);
                    }
                }
            }
        }
        /**
         * for compatibility
         */
        async resolve() {
            //Object was already resolved   
            return this;
        }
        /**
         * remove an object
         * if the object is linked to an other object then update this
         * @param {object} ob - the object to remove
         */
        remove(ob) {
            var pos = this.indexOf(ob);
            if (pos >= 0)
                this.splice(pos, 1);
            if (this._parentObject !== undefined) {
                //set linked object
                var link = jassijs_1.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
                if (link !== undefined && link.type === "array") { //array can not connected){
                    var test = ob._objectProperties[link.name]; //do not resolve!
                    if (test !== undefined && test.unresolvedclassname === undefined) {
                        if (test.indexOf(this._parentObject) >= 0)
                            test.remove(this._parentObject);
                    }
                }
                if (link !== undefined && link.type === "object") {
                    var test = ob._getObjectProperty(link.name);
                    if (test !== undefined && test.unresolvedclassname !== undefined && test !== this) {
                        ob._setObjectProperty(link.name, null);
                    }
                }
            }
        }
    };
    DBArray = __decorate([
        jassijs_1.$Class("jassijs.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
    exports.DBArray = DBArray;
});
//# sourceMappingURL=DBArray.js.map
//# sourceMappingURL=DBArray.js.map