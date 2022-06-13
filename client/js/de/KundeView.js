var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/converters/NumberConverter", "jassijs/ui/Textbox", "jassijs/ui/Property", "jassijs/remote/Jassi", "de/remote/Kunde", "jassijs/ui/DBObjectView"], function (require, exports, NumberConverter_1, Textbox_1, Property_1, Jassi_1, Kunde_1, DBObjectView_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.KundeView = void 0;
    //;
    let KundeView = class KundeView extends DBObjectView_1.DBObjectView {
        constructor() {
            super();
            //this.me = {}; is initialized in super
            this.layout(this.me);
        }
        /*async setdata() {
            var kunden = await Kunde.find()[2];
    
        }*/
        get title() {
            return this.value === undefined ? "Kunde" : "Kunde " + this.value.id;
        }
        layout(me) {
            me.textbox2 = new Textbox_1.Textbox();
            me.textbox1 = new Textbox_1.Textbox();
            me.textbox3 = new Textbox_1.Textbox();
            me.textbox4 = new Textbox_1.Textbox();
            me.textbox6 = new Textbox_1.Textbox();
            me.textbox5 = new Textbox_1.Textbox();
            me.textbox7 = new Textbox_1.Textbox();
            this.me.main.config({
                isAbsolute: true,
                width: "300",
                height: "300",
                children: [
                    me.textbox2.config({
                        x: 5,
                        y: 5,
                        label: "Id",
                        width: 50,
                        bind: [me.databinder, "id"],
                        converter: new NumberConverter_1.NumberConverter()
                    }),
                    me.textbox1.config({
                        x: 5,
                        y: 45,
                        label: "Vorname",
                        width: 95,
                        bind: [me.databinder, "vorname"],
                        css: {
                            color: "#3dbbac",
                        }
                    }),
                    me.textbox3.config({
                        x: 110,
                        y: 45,
                        label: "Nachname",
                        width: 120,
                        bind: [me.databinder, "nachname"]
                    }),
                    me.textbox4.config({
                        x: 5,
                        y: 95,
                        bind: [me.databinder, "strasse"],
                        label: "Straße",
                        width: 145
                    }),
                    me.textbox6.config({
                        x: 160,
                        y: 95,
                        label: "Hausnummer",
                        width: 70,
                        bind: [me.databinder, "hausnummer"]
                    }),
                    me.textbox5.config({
                        x: 5,
                        y: 145,
                        width: 55,
                        bind: [me.databinder, "PLZ"],
                        label: "PLZ"
                    }),
                    me.textbox7.config({
                        x: 75,
                        y: 145,
                        label: "Ort",
                        bind: [me.databinder, "ort"],
                        height: 15,
                        width: 155
                    })
                ]
            });
        }
    };
    __decorate([
        (0, Property_1.$Property)({ isUrlTag: true, id: true, editor: "jassijs.ui.PropertyEditors.DBObjectEditor" }),
        __metadata("design:type", typeof (_a = typeof Kunde_1.Kunde !== "undefined" && Kunde_1.Kunde) === "function" ? _a : Object)
    ], KundeView.prototype, "value", void 0);
    KundeView = __decorate([
        (0, DBObjectView_1.$DBObjectView)({ classname: "de.Kunde" }),
        (0, Jassi_1.$Class)("de.KundeView"),
        __metadata("design:paramtypes", [])
    ], KundeView);
    exports.KundeView = KundeView;
    async function test() {
        var v = new KundeView();
        var test = await Kunde_1.Kunde.findOne(1);
        v.value = test;
        return v;
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiS3VuZGVWaWV3LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZGUvS3VuZGVWaWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0lBbUJBLEdBQUc7SUFHSCxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFVLFNBQVEsMkJBQVk7UUFJdkM7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUNSLHVDQUF1QztZQUN2QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN6QixDQUFDO1FBQ0Q7OztXQUdHO1FBQ0gsSUFBSSxLQUFLO1lBQ0wsT0FBTyxJQUFJLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7UUFDekUsQ0FBQztRQUNELE1BQU0sQ0FBQyxFQUFNO1lBQ1QsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixFQUFFLENBQUMsUUFBUSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1lBQzVCLEVBQUUsQ0FBQyxRQUFRLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7WUFDNUIsRUFBRSxDQUFDLFFBQVEsR0FBRyxJQUFJLGlCQUFPLEVBQUUsQ0FBQztZQUM1QixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7Z0JBQ2hCLFVBQVUsRUFBRSxJQUFJO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixNQUFNLEVBQUUsS0FBSztnQkFDYixRQUFRLEVBQUU7b0JBQ04sRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ2YsQ0FBQyxFQUFFLENBQUM7d0JBQ0osQ0FBQyxFQUFFLENBQUM7d0JBQ0osS0FBSyxFQUFFLElBQUk7d0JBQ1gsS0FBSyxFQUFFLEVBQUU7d0JBQ1QsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUM7d0JBQzNCLFNBQVMsRUFBRSxJQUFJLGlDQUFlLEVBQUU7cUJBQ25DLENBQUM7b0JBQ0YsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ2YsQ0FBQyxFQUFFLENBQUM7d0JBQ0osQ0FBQyxFQUFFLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLFNBQVM7d0JBQ2hCLEtBQUssRUFBRSxFQUFFO3dCQUNULElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO3dCQUNoQyxHQUFHLEVBQUU7NEJBQ0QsS0FBSyxFQUFFLFNBQVM7eUJBQ25CO3FCQUNKLENBQUM7b0JBQ0YsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7d0JBQ2YsQ0FBQyxFQUFFLEdBQUc7d0JBQ04sQ0FBQyxFQUFFLEVBQUU7d0JBQ0wsS0FBSyxFQUFFLFVBQVU7d0JBQ2pCLEtBQUssRUFBRSxHQUFHO3dCQUNWLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO3FCQUNwQyxDQUFDO29CQUNGLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNmLENBQUMsRUFBRSxDQUFDO3dCQUNKLENBQUMsRUFBRSxFQUFFO3dCQUNMLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDO3dCQUNoQyxLQUFLLEVBQUUsUUFBUTt3QkFDZixLQUFLLEVBQUUsR0FBRztxQkFDYixDQUFDO29CQUNGLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUNmLENBQUMsRUFBRSxHQUFHO3dCQUNOLENBQUMsRUFBRSxFQUFFO3dCQUNMLEtBQUssRUFBRSxZQUFZO3dCQUNuQixLQUFLLEVBQUUsRUFBRTt3QkFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLFlBQVksQ0FBQztxQkFDdEMsQ0FBQztvQkFDRixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDZixDQUFDLEVBQUUsQ0FBQzt3QkFDSixDQUFDLEVBQUUsR0FBRzt3QkFDTixLQUFLLEVBQUUsRUFBRTt3QkFDVCxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3QkFDNUIsS0FBSyxFQUFFLEtBQUs7cUJBQ2YsQ0FBQztvQkFDRixFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQzt3QkFDZixDQUFDLEVBQUUsRUFBRTt3QkFDTCxDQUFDLEVBQUUsR0FBRzt3QkFDTixLQUFLLEVBQUUsS0FBSzt3QkFDWixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQzt3QkFDNUIsTUFBTSxFQUFFLEVBQUU7d0JBQ1YsS0FBSyxFQUFFLEdBQUc7cUJBQ2IsQ0FBQztpQkFDTDthQUNKLENBQUMsQ0FBQztRQUNQLENBQUM7S0FDSixDQUFBO0lBbkZHO1FBREMsSUFBQSxvQkFBUyxFQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSwyQ0FBMkMsRUFBRSxDQUFDO3NEQUM5RSxhQUFLLG9CQUFMLGFBQUs7NENBQUM7SUFIWixTQUFTO1FBRnJCLElBQUEsNEJBQWEsRUFBQyxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsQ0FBQztRQUN4QyxJQUFBLGNBQU0sRUFBQyxjQUFjLENBQUM7O09BQ1YsU0FBUyxDQXNGckI7SUF0RlksOEJBQVM7SUF1RmYsS0FBSyxVQUFVLElBQUk7UUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztRQUN4QixJQUFJLElBQUksR0FBRyxNQUFNLGFBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLEtBQUssR0FBVSxJQUFJLENBQUM7UUFDdEIsT0FBTyxDQUFDLENBQUM7SUFDYixDQUFDO0lBTEQsb0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUYWJsZSB9IGZyb20gXCJqYXNzaWpzL3VpL1RhYmxlXCI7XHJcbmltcG9ydCB7IEJ1dHRvbiB9IGZyb20gXCJqYXNzaWpzL3VpL0J1dHRvblwiO1xyXG5pbXBvcnQgeyBOdW1iZXJDb252ZXJ0ZXIgfSBmcm9tIFwiamFzc2lqcy91aS9jb252ZXJ0ZXJzL051bWJlckNvbnZlcnRlclwiO1xyXG5pbXBvcnQgeyBEYXRhYmluZGVyIH0gZnJvbSBcImphc3NpanMvdWkvRGF0YWJpbmRlclwiO1xyXG5pbXBvcnQgeyBUZXh0Ym94IH0gZnJvbSBcImphc3NpanMvdWkvVGV4dGJveFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB7ICRQcm9wZXJ0eSB9IGZyb20gXCJqYXNzaWpzL3VpL1Byb3BlcnR5XCI7XHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9KYXNzaVwiO1xyXG5pbXBvcnQgeyBLdW5kZSB9IGZyb20gXCJkZS9yZW1vdGUvS3VuZGVcIjtcclxuaW1wb3J0IHsgREJPYmplY3RWaWV3LCAkREJPYmplY3RWaWV3LCBEQk9iamVjdFZpZXdNZSB9IGZyb20gXCJqYXNzaWpzL3VpL0RCT2JqZWN0Vmlld1wiO1xyXG50eXBlIE1lID0ge1xyXG4gICAgdGV4dGJveDI/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDE/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDM/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDQ/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDY/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDU/OiBUZXh0Ym94O1xyXG4gICAgdGV4dGJveDc/OiBUZXh0Ym94O1xyXG59ICYgREJPYmplY3RWaWV3TWU7XHJcbi8vO1xyXG5AJERCT2JqZWN0Vmlldyh7IGNsYXNzbmFtZTogXCJkZS5LdW5kZVwiIH0pXHJcbkAkQ2xhc3MoXCJkZS5LdW5kZVZpZXdcIilcclxuZXhwb3J0IGNsYXNzIEt1bmRlVmlldyBleHRlbmRzIERCT2JqZWN0VmlldyB7XHJcbiAgICBkZWNsYXJlIG1lOiBNZTtcclxuICAgIEAkUHJvcGVydHkoeyBpc1VybFRhZzogdHJ1ZSwgaWQ6IHRydWUsIGVkaXRvcjogXCJqYXNzaWpzLnVpLlByb3BlcnR5RWRpdG9ycy5EQk9iamVjdEVkaXRvclwiIH0pXHJcbiAgICBkZWNsYXJlIHZhbHVlOiBLdW5kZTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgLy90aGlzLm1lID0ge307IGlzIGluaXRpYWxpemVkIGluIHN1cGVyXHJcbiAgICAgICAgdGhpcy5sYXlvdXQodGhpcy5tZSk7XHJcbiAgICB9XHJcbiAgICAvKmFzeW5jIHNldGRhdGEoKSB7XHJcbiAgICAgICAgdmFyIGt1bmRlbiA9IGF3YWl0IEt1bmRlLmZpbmQoKVsyXTtcclxuXHJcbiAgICB9Ki9cclxuICAgIGdldCB0aXRsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gXCJLdW5kZVwiIDogXCJLdW5kZSBcIiArIHRoaXMudmFsdWUuaWQ7XHJcbiAgICB9XHJcbiAgICBsYXlvdXQobWU6IE1lKSB7XHJcbiAgICAgICAgbWUudGV4dGJveDIgPSBuZXcgVGV4dGJveCgpO1xyXG4gICAgICAgIG1lLnRleHRib3gxID0gbmV3IFRleHRib3goKTtcclxuICAgICAgICBtZS50ZXh0Ym94MyA9IG5ldyBUZXh0Ym94KCk7XHJcbiAgICAgICAgbWUudGV4dGJveDQgPSBuZXcgVGV4dGJveCgpO1xyXG4gICAgICAgIG1lLnRleHRib3g2ID0gbmV3IFRleHRib3goKTtcclxuICAgICAgICBtZS50ZXh0Ym94NSA9IG5ldyBUZXh0Ym94KCk7XHJcbiAgICAgICAgbWUudGV4dGJveDcgPSBuZXcgVGV4dGJveCgpO1xyXG4gICAgICAgIHRoaXMubWUubWFpbi5jb25maWcoe1xyXG4gICAgICAgICAgICBpc0Fic29sdXRlOiB0cnVlLFxyXG4gICAgICAgICAgICB3aWR0aDogXCIzMDBcIixcclxuICAgICAgICAgICAgaGVpZ2h0OiBcIjMwMFwiLFxyXG4gICAgICAgICAgICBjaGlsZHJlbjogW1xyXG4gICAgICAgICAgICAgICAgbWUudGV4dGJveDIuY29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiSWRcIixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNTAsXHJcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiaWRcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgY29udmVydGVyOiBuZXcgTnVtYmVyQ29udmVydGVyKClcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgbWUudGV4dGJveDEuY29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiA1LFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDQ1LFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlZvcm5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogOTUsXHJcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwidm9ybmFtZVwiXSxcclxuICAgICAgICAgICAgICAgICAgICBjc3M6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzNkYmJhY1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgbWUudGV4dGJveDMuY29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiAxMTAsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogNDUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiTmFjaG5hbWVcIixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTIwLFxyXG4gICAgICAgICAgICAgICAgICAgIGJpbmQ6IFttZS5kYXRhYmluZGVyLCBcIm5hY2huYW1lXCJdXHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIG1lLnRleHRib3g0LmNvbmZpZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogNSxcclxuICAgICAgICAgICAgICAgICAgICB5OiA5NSxcclxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJzdHJhc3NlXCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIlN0cmHDn2VcIixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogMTQ1XHJcbiAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIG1lLnRleHRib3g2LmNvbmZpZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgeDogMTYwLFxyXG4gICAgICAgICAgICAgICAgICAgIHk6IDk1LFxyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsOiBcIkhhdXNudW1tZXJcIixcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogNzAsXHJcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwiaGF1c251bW1lclwiXVxyXG4gICAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgICBtZS50ZXh0Ym94NS5jb25maWcoe1xyXG4gICAgICAgICAgICAgICAgICAgIHg6IDUsXHJcbiAgICAgICAgICAgICAgICAgICAgeTogMTQ1LFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoOiA1NSxcclxuICAgICAgICAgICAgICAgICAgICBiaW5kOiBbbWUuZGF0YWJpbmRlciwgXCJQTFpcIl0sXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiUExaXCJcclxuICAgICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgICAgbWUudGV4dGJveDcuY29uZmlnKHtcclxuICAgICAgICAgICAgICAgICAgICB4OiA3NSxcclxuICAgICAgICAgICAgICAgICAgICB5OiAxNDUsXHJcbiAgICAgICAgICAgICAgICAgICAgbGFiZWw6IFwiT3J0XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgYmluZDogW21lLmRhdGFiaW5kZXIsIFwib3J0XCJdLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogMTUsXHJcbiAgICAgICAgICAgICAgICAgICAgd2lkdGg6IDE1NVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgdmFyIHYgPSBuZXcgS3VuZGVWaWV3KCk7XHJcbiAgICB2YXIgdGVzdCA9IGF3YWl0IEt1bmRlLmZpbmRPbmUoMSk7XHJcbiAgICB2LnZhbHVlID0gPEt1bmRlPnRlc3Q7XHJcbiAgICByZXR1cm4gdjtcclxufVxyXG4iXX0=