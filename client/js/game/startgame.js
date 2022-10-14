var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "jassijs/ui/Panel", "jassijs/base/Windows", "game/game", "jassijs/base/Actions", "jassijs/remote/Registry"], function (require, exports, Panel_1, Windows_1, game_1, Actions_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PPanel = void 0;
    let PPanel = class PPanel extends Panel_1.Panel {
        constructor() {
            super();
            this.game = new game_1.Game();
            //this.width = "1050px";
            // this.height = "650px"; 
            this.game.newGame();
            this.game.render(this.dom);
        }
        destroy() {
            this.game.destroy();
            super.destroy();
        }
        static async show() {
            test();
        }
    };
    __decorate([
        (0, Actions_1.$Action)({
            name: "Game",
            icon: "mdi  mdi-airplane",
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", Promise)
    ], PPanel, "show", null);
    PPanel = __decorate([
        (0, Actions_1.$ActionProvider)("jassijs.base.ActionNode"),
        (0, Registry_1.$Class)("game.PPanel"),
        __metadata("design:paramtypes", [])
    ], PPanel);
    exports.PPanel = PPanel;
    function test() {
        var ret = new PPanel();
        //ret.dom.style.backgroundColor="white";
        var wd = Windows_1.default.findComponent("Game");
        wd === null || wd === void 0 ? void 0 : wd.destroy();
        Windows_1.default.add(ret, "Game");
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSxhQUFLO1FBRzdCO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFGWixTQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUdkLHdCQUF3QjtZQUN6QiwwQkFBMEI7WUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELE9BQU87WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBS0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ2IsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDO0tBQ0osQ0FBQTtJQUhHO1FBSkcsSUFBQSxpQkFBTyxFQUFDO1lBQ1AsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsbUJBQW1CO1NBQzVCLENBQUM7Ozs7NEJBR0Q7SUFyQlEsTUFBTTtRQUZsQixJQUFBLHlCQUFlLEVBQUMseUJBQXlCLENBQUM7UUFDMUMsSUFBQSxpQkFBTSxFQUFDLGFBQWEsQ0FBQzs7T0FDVCxNQUFNLENBc0JsQjtJQXRCWSx3QkFBTTtJQXVCbkIsU0FBZ0IsSUFBSTtRQUVoQixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLHdDQUF3QztRQUN4QyxJQUFJLEVBQUUsR0FBQyxpQkFBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsT0FBTyxFQUFFLENBQUM7UUFDZCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQVBELG9CQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5pbXBvcnQgeyAkQWN0aW9uLCAkQWN0aW9uUHJvdmlkZXIgfSBmcm9tIFwiamFzc2lqcy9iYXNlL0FjdGlvbnNcIjtcclxuaW1wb3J0IHsgJENsYXNzIH0gZnJvbSBcImphc3NpanMvcmVtb3RlL1JlZ2lzdHJ5XCI7XHJcbkAkQWN0aW9uUHJvdmlkZXIoXCJqYXNzaWpzLmJhc2UuQWN0aW9uTm9kZVwiKVxyXG5AJENsYXNzKFwiZ2FtZS5QUGFuZWxcIilcclxuZXhwb3J0IGNsYXNzIFBQYW5lbCBleHRlbmRzIFBhbmVsIHtcclxuICAgIFxyXG4gICAgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vdGhpcy53aWR0aCA9IFwiMTA1MHB4XCI7XHJcbiAgICAgICAvLyB0aGlzLmhlaWdodCA9IFwiNjUwcHhcIjsgXHJcbiAgICAgICAgdGhpcy5nYW1lLm5ld0dhbWUoKTtcclxuICAgICAgICB0aGlzLmdhbWUucmVuZGVyKHRoaXMuZG9tKTsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIkdhbWVcIixcclxuICAgICAgICBpY29uOiBcIm1kaSAgbWRpLWFpcnBsYW5lXCIsXHJcbiAgICB9KVxyXG4gICAgc3RhdGljIGFzeW5jIHNob3coKSB7XHJcbiAgICAgICAgdGVzdCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgXHJcbiAgICB2YXIgcmV0ID0gbmV3IFBQYW5lbCgpO1xyXG4gICAgLy9yZXQuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvcj1cIndoaXRlXCI7XHJcbiAgICB2YXIgd2Q9d2luZG93cy5maW5kQ29tcG9uZW50KFwiR2FtZVwiKTsgXHJcbiAgICB3ZD8uZGVzdHJveSgpO1xyXG4gICAgd2luZG93cy5hZGQocmV0LCBcIkdhbWVcIik7XHJcbn0iXX0=