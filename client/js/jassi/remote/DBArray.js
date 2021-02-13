var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "./Jassi", "./Classes"], function (require, exports, Jassi_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DBArray = void 0;
    let cl = Classes_1.classes; //force Classes.
    let DBArray = class DBArray
    /**
    * Array for jassi.base.DBObject's
    * can be saved to db
    * @class jassi.base.DBArray
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
                var link = Jassi_1.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
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
                var link = Jassi_1.default.db.typeDef.linkForField(this._parentObject.__proto__._dbtype, this._parentObjectMember);
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
        Jassi_1.$Class("jassi.remote.DBArray"),
        __metadata("design:paramtypes", [Object])
    ], DBArray);
    exports.DBArray = DBArray;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiREJBcnJheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpL3JlbW90ZS9EQkFycmF5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7SUFFQSxJQUFJLEVBQUUsR0FBQyxpQkFBTyxDQUFDLENBQUEsZ0JBQWdCO0lBRy9CLElBQWMsT0FBTyxHQUFyQixNQUFjLE9BQU87SUFFckI7Ozs7TUFJRTtJQUNGLFNBQVEsS0FBSztRQUNWLFlBQVksR0FBRyxJQUFJO1lBQ2YsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkIsQ0FBQztRQUdEOzs7O1dBSUc7UUFDSCxHQUFHLENBQUMsRUFBRTtZQUNGLElBQUcsRUFBRSxLQUFHLFNBQVMsSUFBRSxFQUFFLEtBQUcsSUFBSTtnQkFDeEIsTUFBTSw4QkFBOEIsQ0FBQztZQUN6QyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2QsSUFBRyxJQUFJLENBQUMsYUFBYSxLQUFHLFNBQVMsRUFBQztnQkFDOUIsbUJBQW1CO2dCQUNuQixJQUFJLElBQUksR0FBQyxlQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUN0RyxJQUFHLElBQUksS0FBRyxTQUFTLElBQUUsSUFBSSxDQUFDLElBQUksS0FBRyxPQUFPLEVBQUMsRUFBQywyQkFBMkI7b0JBQ2pFLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxpQkFBaUI7b0JBQzFELElBQUcsSUFBSSxLQUFHLFNBQVMsSUFBRSxJQUFJLENBQUMsbUJBQW1CLEtBQUcsU0FBUyxFQUFDO3dCQUN0RCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFDLENBQUM7NEJBQ2pDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUNwQztpQkFDSjtnQkFDRCxJQUFHLElBQUksS0FBRyxTQUFTLElBQUUsSUFBSSxDQUFDLElBQUksS0FBRyxRQUFRLEVBQUM7b0JBQ3RDLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxpQkFBaUI7b0JBQzNELElBQUcsSUFBSSxLQUFHLFNBQVMsSUFBRSxJQUFJLENBQUMsbUJBQW1CLEtBQUcsU0FBUyxJQUFFLElBQUksS0FBRyxJQUFJLEVBQUM7d0JBQ25FLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztxQkFDdkQ7aUJBQ0o7YUFDSjtRQUNMLENBQUM7UUFDRDs7V0FFRztRQUNILEtBQUssQ0FBQyxPQUFPO1lBQ1QsZ0NBQWdDO1lBQ2hDLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUM7UUFFRDs7OztXQUlHO1FBQ0gsTUFBTSxDQUFDLEVBQUU7WUFDTCxJQUFJLEdBQUcsR0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLElBQUcsR0FBRyxJQUFFLENBQUM7Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBRyxJQUFJLENBQUMsYUFBYSxLQUFHLFNBQVMsRUFBQztnQkFDL0IsbUJBQW1CO2dCQUNuQixJQUFJLElBQUksR0FBQyxlQUFLLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUV0RyxJQUFHLElBQUksS0FBRyxTQUFTLElBQUUsSUFBSSxDQUFDLElBQUksS0FBRyxPQUFPLEVBQUMsRUFBQywyQkFBMkI7b0JBQ2pFLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQSxpQkFBaUI7b0JBQzFELElBQUcsSUFBSSxLQUFHLFNBQVMsSUFBRSxJQUFJLENBQUMsbUJBQW1CLEtBQUcsU0FBUyxFQUFDO3dCQUN0RCxJQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFFLENBQUM7NEJBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO3FCQUN2QztpQkFDSjtnQkFDRCxJQUFHLElBQUksS0FBRyxTQUFTLElBQUUsSUFBSSxDQUFDLElBQUksS0FBRyxRQUFRLEVBQUM7b0JBQ3RDLElBQUksSUFBSSxHQUFDLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzFDLElBQUcsSUFBSSxLQUFHLFNBQVMsSUFBRSxJQUFJLENBQUMsbUJBQW1CLEtBQUcsU0FBUyxJQUFFLElBQUksS0FBRyxJQUFJLEVBQUM7d0JBQ25FLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN6QztpQkFDSjthQUNKO1FBRUwsQ0FBQztLQUNILENBQUE7SUE3RWEsT0FBTztRQURwQixjQUFNLENBQUMsc0JBQXNCLENBQUM7O09BQ2pCLE9BQU8sQ0E2RXBCO0lBN0VhLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGphc3NpLCB7ICRDbGFzcyB9IGZyb20gXCIuL0phc3NpXCI7XHJcbmltcG9ydCAge2NsYXNzZXN9IGZyb20gXCIuL0NsYXNzZXNcIjtcclxubGV0IGNsPWNsYXNzZXM7Ly9mb3JjZSBDbGFzc2VzLlxyXG5cclxuQCRDbGFzcyhcImphc3NpLnJlbW90ZS5EQkFycmF5XCIpXHJcbmV4cG9ydCAgY2xhc3MgREJBcnJheVxyXG5cclxuLyoqXHJcbiogQXJyYXkgZm9yIGphc3NpLmJhc2UuREJPYmplY3Qnc1xyXG4qIGNhbiBiZSBzYXZlZCB0byBkYlxyXG4qIEBjbGFzcyBqYXNzaS5iYXNlLkRCQXJyYXlcclxuKi9cclxuZXh0ZW5kcyBBcnJheXtcclxuICAgY29uc3RydWN0b3IoLi4uYXJncyl7XHJcbiAgICAgICBzdXBlciguLi5hcmdzKTtcclxuICAgfVxyXG4gICBwcml2YXRlIF9wYXJlbnRPYmplY3Q7XHJcbiAgIHByaXZhdGUgX3BhcmVudE9iamVjdE1lbWJlcjtcclxuICAgLyoqXHJcbiAgICAqIGFkZHMgYW4gb2JqZWN0IFxyXG4gICAgKiBpZiB0aGUgb2JqZWN0IGlzIGxpbmtlZCB0byBhbiBvdGhlciBvYmplY3QgdGhlbiB1cGRhdGUgdGhpc1xyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGUgb2JqZWN0IHRvIGFkZFxyXG4gICAgKi9cclxuICAgYWRkKG9iKXtcclxuICAgICAgIGlmKG9iPT09dW5kZWZpbmVkfHxvYj09PW51bGwpXHJcbiAgICAgICAgICAgdGhyb3cgXCJFcnJvciBjYW5ub3QgYWRkIG9iamVjdCBudWxsXCI7XHJcbiAgICAgICB0aGlzLnB1c2gob2IpO1xyXG4gICAgICAgaWYodGhpcy5fcGFyZW50T2JqZWN0IT09dW5kZWZpbmVkKXsgXHJcbiAgICAgICAgICAgLy9zZXQgbGlua2VkIG9iamVjdFxyXG4gICAgICAgICAgIHZhciBsaW5rPWphc3NpLmRiLnR5cGVEZWYubGlua0ZvckZpZWxkKHRoaXMuX3BhcmVudE9iamVjdC5fX3Byb3RvX18uX2RidHlwZSx0aGlzLl9wYXJlbnRPYmplY3RNZW1iZXIpO1xyXG4gICAgICAgICAgIGlmKGxpbmshPT11bmRlZmluZWQmJmxpbmsudHlwZT09PVwiYXJyYXlcIil7Ly9hcnJheSBjYW4gbm90IGNvbm5lY3RlZCl7XHJcbiAgICAgICAgICAgICAgIHZhciB0ZXN0PW9iLl9vYmplY3RQcm9wZXJ0aWVzW2xpbmsubmFtZV07Ly9kbyBub3QgcmVzb2x2ZSFcclxuICAgICAgICAgICAgICAgaWYodGVzdCE9PXVuZGVmaW5lZCYmdGVzdC51bnJlc29sdmVkY2xhc3NuYW1lPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgICAgIGlmKHRlc3QuaW5kZXhPZih0aGlzLl9wYXJlbnRPYmplY3QpPDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgdGVzdC5hZGQodGhpcy5fcGFyZW50T2JqZWN0KTtcclxuICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgIH1cclxuICAgICAgICAgICBpZihsaW5rIT09dW5kZWZpbmVkJiZsaW5rLnR5cGU9PT1cIm9iamVjdFwiKXtcclxuICAgICAgICAgICAgICAgdmFyIHRlc3Q9b2IuX19vYmplY3RQcm9wZXJ0aWVzW2xpbmsubmFtZV07Ly9kbyBub3QgcmVzb2x2ZSFcclxuICAgICAgICAgICAgICAgaWYodGVzdCE9PXVuZGVmaW5lZCYmdGVzdC51bnJlc29sdmVkY2xhc3NuYW1lIT09dW5kZWZpbmVkJiZ0ZXN0IT09dGhpcyl7XHJcbiAgICAgICAgICAgICAgICAgICBvYi5fc2V0T2JqZWN0UHJvcGVydHkobGluay5uYW1lLHRoaXMuX3BhcmVudE9iamVjdCk7XHJcbiAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICB9XHJcbiAgICAgICB9XHJcbiAgIH1cclxuICAgLyoqXHJcbiAgICAqIGZvciBjb21wYXRpYmlsaXR5XHJcbiAgICAqL1xyXG4gICBhc3luYyByZXNvbHZlKCl7XHJcbiAgICAgICAvL09iamVjdCB3YXMgYWxyZWFkeSByZXNvbHZlZCAgIFxyXG4gICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgIH1cclxuXHJcbiAgIC8qKlxyXG4gICAgKiByZW1vdmUgYW4gb2JqZWN0IFxyXG4gICAgKiBpZiB0aGUgb2JqZWN0IGlzIGxpbmtlZCB0byBhbiBvdGhlciBvYmplY3QgdGhlbiB1cGRhdGUgdGhpc1xyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gb2IgLSB0aGUgb2JqZWN0IHRvIHJlbW92ZVxyXG4gICAgKi9cclxuICAgcmVtb3ZlKG9iKXsgXHJcbiAgICAgICB2YXIgcG9zPXRoaXMuaW5kZXhPZihvYik7IFxyXG4gICAgICAgaWYocG9zPj0wKVxyXG4gICAgICAgICAgIHRoaXMuc3BsaWNlKHBvcywgMSk7XHJcbiAgICAgICAgaWYodGhpcy5fcGFyZW50T2JqZWN0IT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAvL3NldCBsaW5rZWQgb2JqZWN0XHJcbiAgICAgICAgICAgdmFyIGxpbms9amFzc2kuZGIudHlwZURlZi5saW5rRm9yRmllbGQodGhpcy5fcGFyZW50T2JqZWN0Ll9fcHJvdG9fXy5fZGJ0eXBlLHRoaXMuX3BhcmVudE9iamVjdE1lbWJlcik7XHJcbiAgICAgICAgICBcclxuICAgICAgICAgICBpZihsaW5rIT09dW5kZWZpbmVkJiZsaW5rLnR5cGU9PT1cImFycmF5XCIpey8vYXJyYXkgY2FuIG5vdCBjb25uZWN0ZWQpe1xyXG4gICAgICAgICAgICAgICB2YXIgdGVzdD1vYi5fb2JqZWN0UHJvcGVydGllc1tsaW5rLm5hbWVdOy8vZG8gbm90IHJlc29sdmUhXHJcbiAgICAgICAgICAgICAgIGlmKHRlc3QhPT11bmRlZmluZWQmJnRlc3QudW5yZXNvbHZlZGNsYXNzbmFtZT09PXVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICAgICBpZih0ZXN0LmluZGV4T2YodGhpcy5fcGFyZW50T2JqZWN0KT49MClcclxuICAgICAgICAgICAgICAgICAgICAgICB0ZXN0LnJlbW92ZSh0aGlzLl9wYXJlbnRPYmplY3QpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgICAgIGlmKGxpbmshPT11bmRlZmluZWQmJmxpbmsudHlwZT09PVwib2JqZWN0XCIpe1xyXG4gICAgICAgICAgICAgICB2YXIgdGVzdD1vYi5fZ2V0T2JqZWN0UHJvcGVydHkobGluay5uYW1lKTtcclxuICAgICAgICAgICAgICAgaWYodGVzdCE9PXVuZGVmaW5lZCYmdGVzdC51bnJlc29sdmVkY2xhc3NuYW1lIT09dW5kZWZpbmVkJiZ0ZXN0IT09dGhpcyl7XHJcbiAgICAgICAgICAgICAgICAgICBvYi5fc2V0T2JqZWN0UHJvcGVydHkobGluay5uYW1lLG51bGwpO1xyXG4gICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgfVxyXG4gICAgICAgfVxyXG4gICAgICAgXHJcbiAgIH1cclxufVxyXG4iXX0=