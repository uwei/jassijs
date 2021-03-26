var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassi/remote/Jassi", "./Classes"], function (require, exports, Jassi_1, Classes_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.db = exports.Database = exports.TypeDef = void 0;
    class TypeDef {
        constructor() {
            this.fields = {};
        }
        getRelation(fieldname) {
            var ret = undefined;
            var test = this.fields[fieldname];
            for (let key in test) {
                if (key === "OneToOne" || key === "OneToMany" || key === "ManyToOne" || key === "ManyToMany") {
                    return { type: key, oclass: test[key][0][0]() };
                }
            }
            return ret;
        }
    }
    exports.TypeDef = TypeDef;
    let Database = class Database {
        constructor() {
            this.typeDef = new Map();
            this.decoratorCalls = new Map();
            ;
        }
        removeOld(oclass) {
            var name = Classes_1.classes.getClassName(oclass);
            this.typeDef.forEach((value, key) => {
                var testname = Classes_1.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.typeDef.delete(key);
            });
            this.decoratorCalls.forEach((value, key) => {
                var testname = Classes_1.classes.getClassName(key);
                if (testname === name && key !== oclass)
                    this.decoratorCalls.delete(key);
            });
        }
        _setMetadata(constructor, field, decoratername, fieldprops, decoraterprops, delegate) {
            var def = this.typeDef.get(constructor);
            if (def === undefined) {
                def = new TypeDef();
                this.decoratorCalls.set(constructor, []);
                this.typeDef.set(constructor, def); //new class
            }
            if (field === "this") {
                this.removeOld(constructor);
            }
            this.decoratorCalls.get(constructor).push([delegate, fieldprops, decoraterprops]);
            var afield = def.fields[field];
            if (def.fields[field] === undefined) {
                afield = {};
                def.fields[field] = afield;
            }
            afield[decoratername] = fieldprops;
        }
        fillDecorators() {
            this.decoratorCalls.forEach((allvalues, key) => {
                allvalues.forEach((value) => {
                    value[0](...value[1])(...value[2]);
                });
            });
        }
        getMetadata(sclass) {
            return this.typeDef.get(sclass);
        }
    };
    Database = __decorate([
        Jassi_1.$Class("jassi.remote.Database"),
        __metadata("design:paramtypes", [])
    ], Database);
    exports.Database = Database;
    //@ts-ignore
    var db = new Database();
    exports.db = db;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGF0YWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9qYXNzaS9yZW1vdGUvRGF0YWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQUdBLE1BQWEsT0FBTztRQUFwQjtZQUNDLFdBQU0sR0FBaUQsRUFBRSxDQUFDO1FBWTNELENBQUM7UUFYRyxXQUFXLENBQUMsU0FBUztZQUNqQixJQUFJLEdBQUcsR0FBQyxTQUFTLENBQUM7WUFDbEIsSUFBSSxJQUFJLEdBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNoQyxLQUFJLElBQUksR0FBRyxJQUFJLElBQUksRUFBQztnQkFDaEIsSUFBRyxHQUFHLEtBQUcsVUFBVSxJQUFFLEdBQUcsS0FBRyxXQUFXLElBQUUsR0FBRyxLQUFHLFdBQVcsSUFBRSxHQUFHLEtBQUcsWUFBWSxFQUFDO29CQUMxRSxPQUFPLEVBQUMsSUFBSSxFQUFDLEdBQUcsRUFBQyxNQUFNLEVBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUMsQ0FBQztpQkFFOUM7YUFDSjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2YsQ0FBQztLQUNKO0lBYkQsMEJBYUM7SUFFRCxJQUFhLFFBQVEsR0FBckIsTUFBYSxRQUFRO1FBQ2pCO1lBR0EsWUFBTyxHQUFxQixJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLG1CQUFjLEdBQW1CLElBQUksR0FBRyxFQUFFLENBQUM7WUFIdkMsQ0FBQztRQUNMLENBQUM7UUFHTyxTQUFTLENBQUMsTUFBTTtZQUNwQixJQUFJLElBQUksR0FBQyxpQkFBTyxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtnQkFDOUIsSUFBSSxRQUFRLEdBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUcsUUFBUSxLQUFHLElBQUksSUFBRSxHQUFHLEtBQUcsTUFBTTtvQkFDNUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFDSCxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtnQkFDckMsSUFBSSxRQUFRLEdBQUMsaUJBQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3ZDLElBQUcsUUFBUSxLQUFHLElBQUksSUFBRSxHQUFHLEtBQUcsTUFBTTtvQkFDNUIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0QsWUFBWSxDQUFDLFdBQVcsRUFBQyxLQUFZLEVBQUMsYUFBb0IsRUFBQyxVQUFnQixFQUFDLGNBQW9CLEVBQUMsUUFBUTtZQUNyRyxJQUFJLEdBQUcsR0FBUyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUM5QyxJQUFHLEdBQUcsS0FBRyxTQUFTLEVBQUM7Z0JBQ2YsR0FBRyxHQUFDLElBQUksT0FBTyxFQUFFLENBQUM7Z0JBRWxCLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUEsV0FBVzthQUNoRDtZQUNELElBQUcsS0FBSyxLQUFHLE1BQU0sRUFBQztnQkFDZCxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFDLFVBQVUsRUFBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ2hGLElBQUksTUFBTSxHQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsSUFBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFHLFNBQVMsRUFBQztnQkFDaEMsTUFBTSxHQUFDLEVBQUUsQ0FBQztnQkFDVixHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFDLE1BQU0sQ0FBQzthQUN6QjtZQUNELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBQyxVQUFVLENBQUM7UUFDckMsQ0FBQztRQUNELGNBQWM7WUFDVixJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsRUFBQyxHQUFHLEVBQUMsRUFBRTtnQkFDekMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBQyxFQUFFO29CQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztRQUNELFdBQVcsQ0FBQyxNQUFNO1lBQ2QsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDO0tBQ0osQ0FBQTtJQWhEWSxRQUFRO1FBRHBCLGNBQU0sQ0FBQyx1QkFBdUIsQ0FBQzs7T0FDbkIsUUFBUSxDQWdEcEI7SUFoRFksNEJBQVE7SUFpRHJCLFlBQVk7SUFDWixJQUFJLEVBQUUsR0FBVSxJQUFJLFFBQVEsRUFBRSxDQUFDO0lBQ3ZCLGdCQUFFIiwic291cmNlc0NvbnRlbnQiOlsiXHJcbmltcG9ydCBqYXNzaSwgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2kvcmVtb3RlL0phc3NpXCI7XHJcbmltcG9ydCB7IGNsYXNzZXMgfSBmcm9tIFwiLi9DbGFzc2VzXCI7XHJcbmV4cG9ydCBjbGFzcyBUeXBlRGVme1xyXG5cdGZpZWxkczp7W2ZpZWxkbmFtZTpzdHJpbmddOntbZGVjb3JhdGVyOnN0cmluZ106YW55W119fT17fTtcclxuICAgIGdldFJlbGF0aW9uKGZpZWxkbmFtZSk6e3R5cGU6c3RyaW5nLG9jbGFzc317XHJcbiAgICAgICAgdmFyIHJldD11bmRlZmluZWQ7XHJcbiAgICAgICAgdmFyIHRlc3Q9dGhpcy5maWVsZHNbZmllbGRuYW1lXTtcclxuICAgICAgICBmb3IobGV0IGtleSBpbiB0ZXN0KXtcclxuICAgICAgICAgICAgaWYoa2V5PT09XCJPbmVUb09uZVwifHxrZXk9PT1cIk9uZVRvTWFueVwifHxrZXk9PT1cIk1hbnlUb09uZVwifHxrZXk9PT1cIk1hbnlUb01hbnlcIil7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge3R5cGU6a2V5LG9jbGFzczp0ZXN0W2tleV1bMF1bMF0oKX07XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmV0O1xyXG4gICAgfVxyXG59XHJcbkAkQ2xhc3MoXCJqYXNzaS5yZW1vdGUuRGF0YWJhc2VcIilcclxuZXhwb3J0IGNsYXNzIERhdGFiYXNle1xyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIDtcclxuICAgIH1cclxuICAgIHR5cGVEZWY6TWFwPG9iamVjdCxUeXBlRGVmPj1uZXcgTWFwKCk7XHJcbiAgICBkZWNvcmF0b3JDYWxsczpNYXA8b2JqZWN0LGFueVtdPj1uZXcgTWFwKCk7XHJcbiAgICBwcml2YXRlIHJlbW92ZU9sZChvY2xhc3Mpe1xyXG4gICAgICAgIHZhciBuYW1lPWNsYXNzZXMuZ2V0Q2xhc3NOYW1lKG9jbGFzcyk7XHJcbiAgICAgICAgdGhpcy50eXBlRGVmLmZvckVhY2goKHZhbHVlLGtleSk9PntcclxuICAgICAgICAgICAgdmFyIHRlc3RuYW1lPWNsYXNzZXMuZ2V0Q2xhc3NOYW1lKGtleSk7XHJcbiAgICAgICAgICAgIGlmKHRlc3RuYW1lPT09bmFtZSYma2V5IT09b2NsYXNzKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50eXBlRGVmLmRlbGV0ZShrZXkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZGVjb3JhdG9yQ2FsbHMuZm9yRWFjaCgodmFsdWUsa2V5KT0+e1xyXG4gICAgICAgICAgICB2YXIgdGVzdG5hbWU9Y2xhc3Nlcy5nZXRDbGFzc05hbWUoa2V5KTtcclxuICAgICAgICAgICAgaWYodGVzdG5hbWU9PT1uYW1lJiZrZXkhPT1vY2xhc3MpXHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlY29yYXRvckNhbGxzLmRlbGV0ZShrZXkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgX3NldE1ldGFkYXRhKGNvbnN0cnVjdG9yLGZpZWxkOnN0cmluZyxkZWNvcmF0ZXJuYW1lOnN0cmluZyxmaWVsZHByb3BzOmFueVtdLGRlY29yYXRlcnByb3BzOmFueVtdLGRlbGVnYXRlKXtcclxuICAgICAgICB2YXIgZGVmOlR5cGVEZWY9dGhpcy50eXBlRGVmLmdldChjb25zdHJ1Y3Rvcik7XHJcbiAgICAgICAgaWYoZGVmPT09dW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgZGVmPW5ldyBUeXBlRGVmKCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmRlY29yYXRvckNhbGxzLnNldChjb25zdHJ1Y3RvcixbXSk7XHJcbiAgICAgICAgICAgIHRoaXMudHlwZURlZi5zZXQoY29uc3RydWN0b3IsZGVmKTsvL25ldyBjbGFzc1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZihmaWVsZD09PVwidGhpc1wiKXtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVPbGQoY29uc3RydWN0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRlY29yYXRvckNhbGxzLmdldChjb25zdHJ1Y3RvcikucHVzaChbZGVsZWdhdGUsZmllbGRwcm9wcyxkZWNvcmF0ZXJwcm9wc10pO1xyXG4gICAgICAgIHZhciBhZmllbGQ9ZGVmLmZpZWxkc1tmaWVsZF07XHJcbiAgICAgICAgaWYoZGVmLmZpZWxkc1tmaWVsZF09PT11bmRlZmluZWQpe1xyXG4gICAgICAgIFx0YWZpZWxkPXt9O1xyXG4gICAgICAgIFx0ZGVmLmZpZWxkc1tmaWVsZF09YWZpZWxkO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZmllbGRbZGVjb3JhdGVybmFtZV09ZmllbGRwcm9wcztcclxuICAgIH1cclxuICAgIGZpbGxEZWNvcmF0b3JzKCl7XHJcbiAgICAgICAgdGhpcy5kZWNvcmF0b3JDYWxscy5mb3JFYWNoKChhbGx2YWx1ZXMsa2V5KT0+e1xyXG4gICAgICAgICAgICBhbGx2YWx1ZXMuZm9yRWFjaCgodmFsdWUpPT57XHJcbiAgICAgICAgICAgICAgICB2YWx1ZVswXSguLi52YWx1ZVsxXSkoLi4udmFsdWVbMl0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICAgIGdldE1ldGFkYXRhKHNjbGFzcyk6VHlwZURlZntcclxuICAgICAgICByZXR1cm4gdGhpcy50eXBlRGVmLmdldChzY2xhc3MpO1xyXG4gICAgfVxyXG59XHJcbi8vQHRzLWlnbm9yZVxyXG52YXIgZGI6RGF0YWJhc2U9bmV3IERhdGFiYXNlKCk7XHJcbmV4cG9ydCB7ZGJ9O1xyXG4iXX0=