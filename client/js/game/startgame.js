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
            this.width = "1050px";
            this.height = "650px";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSxhQUFLO1FBRzdCO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFGWixTQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUdkLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNiLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQztLQUNKLENBQUE7SUFIRztRQUpHLElBQUEsaUJBQU8sRUFBQztZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLG1CQUFtQjtTQUM1QixDQUFDOzs7OzRCQUdEO0lBckJRLE1BQU07UUFGbEIsSUFBQSx5QkFBZSxFQUFDLHlCQUF5QixDQUFDO1FBQzFDLElBQUEsaUJBQU0sRUFBQyxhQUFhLENBQUM7O09BQ1QsTUFBTSxDQXNCbEI7SUF0Qlksd0JBQU07SUF1Qm5CLFNBQWdCLElBQUk7UUFFaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN2Qix3Q0FBd0M7UUFDeEMsSUFBSSxFQUFFLEdBQUMsaUJBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ2QsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgJEFjdGlvbiwgJEFjdGlvblByb3ZpZGVyIH0gZnJvbSBcImphc3NpanMvYmFzZS9BY3Rpb25zXCI7XHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5AJEFjdGlvblByb3ZpZGVyKFwiamFzc2lqcy5iYXNlLkFjdGlvbk5vZGVcIilcclxuQCRDbGFzcyhcImdhbWUuUFBhbmVsXCIpXHJcbmV4cG9ydCBjbGFzcyBQUGFuZWwgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBcclxuICAgIGdhbWUgPSBuZXcgR2FtZSgpO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gXCIxMDUwcHhcIjtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IFwiNjUwcHhcIjsgXHJcbiAgICAgICAgdGhpcy5nYW1lLm5ld0dhbWUoKTtcclxuICAgICAgICB0aGlzLmdhbWUucmVuZGVyKHRoaXMuZG9tKTsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbiAgICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIkdhbWVcIixcclxuICAgICAgICBpY29uOiBcIm1kaSAgbWRpLWFpcnBsYW5lXCIsXHJcbiAgICB9KVxyXG4gICAgc3RhdGljIGFzeW5jIHNob3coKSB7XHJcbiAgICAgICAgdGVzdCgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgXHJcbiAgICB2YXIgcmV0ID0gbmV3IFBQYW5lbCgpO1xyXG4gICAgLy9yZXQuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvcj1cIndoaXRlXCI7XHJcbiAgICB2YXIgd2Q9d2luZG93cy5maW5kQ29tcG9uZW50KFwiR2FtZVwiKTsgXHJcbiAgICB3ZD8uZGVzdHJveSgpO1xyXG4gICAgd2luZG93cy5hZGQocmV0LCBcIkdhbWVcIik7XHJcbn0iXX0=