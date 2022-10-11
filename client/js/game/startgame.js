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
        ret.dom.style.backgroundColor = "white";
        var wd = Windows_1.default.findComponent("Game");
        wd === null || wd === void 0 ? void 0 : wd.destroy();
        Windows_1.default.add(ret, "Game");
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSxhQUFLO1FBRzdCO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFGWixTQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUdkLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztRQUtELE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSTtZQUNiLElBQUksRUFBRSxDQUFDO1FBQ1gsQ0FBQztLQUNKLENBQUE7SUFIRztRQUpHLElBQUEsaUJBQU8sRUFBQztZQUNQLElBQUksRUFBRSxNQUFNO1lBQ1osSUFBSSxFQUFFLG1CQUFtQjtTQUM1QixDQUFDOzs7OzRCQUdEO0lBckJRLE1BQU07UUFGbEIsSUFBQSx5QkFBZSxFQUFDLHlCQUF5QixDQUFDO1FBQzFDLElBQUEsaUJBQU0sRUFBQyxhQUFhLENBQUM7O09BQ1QsTUFBTSxDQXNCbEI7SUF0Qlksd0JBQU07SUF1Qm5CLFNBQWdCLElBQUk7UUFFaEIsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUN2QixHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUMsT0FBTyxDQUFDO1FBQ3RDLElBQUksRUFBRSxHQUFDLGlCQUFPLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JDLEVBQUUsYUFBRixFQUFFLHVCQUFGLEVBQUUsQ0FBRSxPQUFPLEVBQUUsQ0FBQztRQUNkLGlCQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBUEQsb0JBT0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaXR5RGlhbG9nIH0gZnJvbSBcImdhbWUvY2l0eWRpYWxvZ1wiO1xyXG5pbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJnYW1lL3dvcmxkXCI7XHJcbmltcG9ydCB7IFBhbmVsIH0gZnJvbSBcImphc3NpanMvdWkvUGFuZWxcIjtcclxuaW1wb3J0IHdpbmRvd3MgZnJvbSBcImphc3NpanMvYmFzZS9XaW5kb3dzXCI7XHJcbmltcG9ydCB7IEdhbWUgfSBmcm9tIFwiZ2FtZS9nYW1lXCI7XHJcbmltcG9ydCB7ICRBY3Rpb24sICRBY3Rpb25Qcm92aWRlciB9IGZyb20gXCJqYXNzaWpzL2Jhc2UvQWN0aW9uc1wiO1xyXG5pbXBvcnQgeyAkQ2xhc3MgfSBmcm9tIFwiamFzc2lqcy9yZW1vdGUvUmVnaXN0cnlcIjtcclxuQCRBY3Rpb25Qcm92aWRlcihcImphc3NpanMuYmFzZS5BY3Rpb25Ob2RlXCIpXHJcbkAkQ2xhc3MoXCJnYW1lLlBQYW5lbFwiKVxyXG5leHBvcnQgY2xhc3MgUFBhbmVsIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgXHJcbiAgICBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IFwiMTA1MHB4XCI7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBcIjY1MHB4XCI7IFxyXG4gICAgICAgIHRoaXMuZ2FtZS5uZXdHYW1lKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnJlbmRlcih0aGlzLmRvbSk7IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG4gICAgICBAJEFjdGlvbih7XHJcbiAgICAgICAgbmFtZTogXCJHYW1lXCIsXHJcbiAgICAgICAgaWNvbjogXCJtZGkgIG1kaS1haXJwbGFuZVwiLFxyXG4gICAgfSlcclxuICAgIHN0YXRpYyBhc3luYyBzaG93KCkge1xyXG4gICAgICAgIHRlc3QoKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIFxyXG4gICAgdmFyIHJldCA9IG5ldyBQUGFuZWwoKTtcclxuICAgIHJldC5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yPVwid2hpdGVcIjtcclxuICAgIHZhciB3ZD13aW5kb3dzLmZpbmRDb21wb25lbnQoXCJHYW1lXCIpOyBcclxuICAgIHdkPy5kZXN0cm95KCk7XHJcbiAgICB3aW5kb3dzLmFkZChyZXQsIFwiR2FtZVwiKTtcclxufSJdfQ==