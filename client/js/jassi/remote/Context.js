var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi"], function (require, exports, Jassi_1) {
    "use strict";
    var Context_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Context = void 0;
    /**
     * get a context object which is registred in a callerfunction
     */
    let Context = Context_1 = class Context {
        constructor() {
            this.objects = {};
            Context_1.all.push(this);
        }
        /**
         * @param name - the contextname
         * @param obj - the object is saved to the context
         * @param func - the function wich calls the childcontext
         */
        register(name, obj, func) {
            var iname = "__context__" + name + Context_1.nextid;
            this.objects[iname] = obj;
            Context_1.nextid++;
            this[iname] = function () {
                return func();
            };
            let ret = this[iname]();
            delete this[iname];
            return ret;
        }
        /**
         * gets the registred object in the context
         */
        static get(name) {
            var stack = new Error().stack;
            var test = stack.split("__context__" + name);
            if (test.length > 1) {
                var iname = "__context__" + name + test[1].substring(0, test[1].indexOf(" ")).replace("]", "");
                for (let x = 0; x < Context_1.all.length; x++) {
                    var con = Context_1.all[x];
                    if (con.objects[iname])
                        return con.objects[iname];
                }
            }
            return undefined;
        }
        destroy() {
            this.objects = {};
            var pos = Context_1.all.indexOf(this);
            Context_1.all.splice(pos, 1);
        }
    };
    Context.nextid = 1;
    Context.all = [];
    Context = Context_1 = __decorate([
        Jassi_1.$Class("jassi/remote/Context"),
        __metadata("design:paramtypes", [])
    ], Context);
    exports.Context = Context;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29udGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2phc3NpL3JlbW90ZS9Db250ZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBRUE7O09BRUc7SUFFSCxJQUFhLE9BQU8sZUFBcEIsTUFBYSxPQUFPO1FBSWhCO1lBSEEsWUFBTyxHQUFHLEVBQUUsQ0FBQTtZQUlSLFNBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLENBQUM7UUFDRDs7OztXQUlHO1FBQ0gsUUFBUSxDQUFDLElBQVksRUFBRSxHQUFHLEVBQUUsSUFBSTtZQUM1QixJQUFJLEtBQUssR0FBRyxhQUFhLEdBQUcsSUFBSSxHQUFHLFNBQU8sQ0FBQyxNQUFNLENBQUM7WUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7WUFDMUIsU0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRztnQkFDVixPQUFPLElBQUksRUFBRSxDQUFDO1lBQ2xCLENBQUMsQ0FBQztZQUNGLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3hCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25CLE9BQU8sR0FBRyxDQUFDO1FBRWYsQ0FBQztRQUNEOztXQUVHO1FBQ0gsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFZO1lBQ25CLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDO1lBQzlCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRTdDLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ2pCLElBQUksS0FBSyxHQUFHLGFBQWEsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQy9GLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDekMsSUFBSSxHQUFHLEdBQUcsU0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQzt3QkFDbEIsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqQzthQUNKO1lBQ0QsT0FBTyxTQUFTLENBQUM7UUFFckIsQ0FBQztRQUNELE9BQU87WUFDSCxJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxTQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxTQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNKLENBQUE7SUE3Q1UsY0FBTSxHQUFHLENBQUMsQ0FBQztJQUNYLFdBQUcsR0FBYyxFQUFFLENBQUM7SUFIbEIsT0FBTztRQURuQixjQUFNLENBQUMsc0JBQXNCLENBQUM7O09BQ2xCLE9BQU8sQ0ErQ25CO0lBL0NZLDBCQUFPIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpL3JlbW90ZS9KYXNzaVwiO1xyXG5cclxuLyoqXHJcbiAqIGdldCBhIGNvbnRleHQgb2JqZWN0IHdoaWNoIGlzIHJlZ2lzdHJlZCBpbiBhIGNhbGxlcmZ1bmN0aW9uXHJcbiAqL1xyXG5AJENsYXNzKFwiamFzc2kvcmVtb3RlL0NvbnRleHRcIilcclxuZXhwb3J0IGNsYXNzIENvbnRleHQge1xyXG4gICAgb2JqZWN0cyA9IHt9XHJcbiAgICBzdGF0aWMgbmV4dGlkID0gMTtcclxuICAgIHN0YXRpYyBhbGw6IENvbnRleHRbXSA9IFtdO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgQ29udGV4dC5hbGwucHVzaCh0aGlzKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogQHBhcmFtIG5hbWUgLSB0aGUgY29udGV4dG5hbWVcclxuICAgICAqIEBwYXJhbSBvYmogLSB0aGUgb2JqZWN0IGlzIHNhdmVkIHRvIHRoZSBjb250ZXh0XHJcbiAgICAgKiBAcGFyYW0gZnVuYyAtIHRoZSBmdW5jdGlvbiB3aWNoIGNhbGxzIHRoZSBjaGlsZGNvbnRleHRcclxuICAgICAqL1xyXG4gICAgcmVnaXN0ZXIobmFtZTogc3RyaW5nLCBvYmosIGZ1bmMpIHtcclxuICAgICAgICB2YXIgaW5hbWUgPSBcIl9fY29udGV4dF9fXCIgKyBuYW1lICsgQ29udGV4dC5uZXh0aWQ7XHJcbiAgICAgICAgdGhpcy5vYmplY3RzW2luYW1lXSA9IG9iajtcclxuICAgICAgICBDb250ZXh0Lm5leHRpZCsrO1xyXG4gICAgICAgIHRoaXNbaW5hbWVdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZnVuYygpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IHJldCA9IHRoaXNbaW5hbWVdKCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXNbaW5hbWVdO1xyXG4gICAgICAgIHJldHVybiByZXQ7XHJcblxyXG4gICAgfVxyXG4gICAgLyoqXHJcbiAgICAgKiBnZXRzIHRoZSByZWdpc3RyZWQgb2JqZWN0IGluIHRoZSBjb250ZXh0XHJcbiAgICAgKi9cclxuICAgIHN0YXRpYyBnZXQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIHN0YWNrID0gbmV3IEVycm9yKCkuc3RhY2s7XHJcbiAgICAgICAgdmFyIHRlc3QgPSBzdGFjay5zcGxpdChcIl9fY29udGV4dF9fXCIgKyBuYW1lKTtcclxuXHJcbiAgICAgICAgaWYgKHRlc3QubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICB2YXIgaW5hbWUgPSBcIl9fY29udGV4dF9fXCIgKyBuYW1lICsgdGVzdFsxXS5zdWJzdHJpbmcoMCwgdGVzdFsxXS5pbmRleE9mKFwiIFwiKSkucmVwbGFjZShcIl1cIiwgXCJcIik7XHJcbiAgICAgICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgQ29udGV4dC5hbGwubGVuZ3RoOyB4KyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBjb24gPSBDb250ZXh0LmFsbFt4XTtcclxuICAgICAgICAgICAgICAgIGlmIChjb24ub2JqZWN0c1tpbmFtZV0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNvbi5vYmplY3RzW2luYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG5cclxuICAgIH1cclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5vYmplY3RzID0ge307XHJcbiAgICAgICAgdmFyIHBvcyA9IENvbnRleHQuYWxsLmluZGV4T2YodGhpcyk7XHJcbiAgICAgICAgQ29udGV4dC5hbGwuc3BsaWNlKHBvcywgMSk7XHJcbiAgICB9XHJcbn0iXX0=