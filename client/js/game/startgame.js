define(["require", "exports", "jassijs/ui/Panel", "jassijs/base/Windows", "game/game"], function (require, exports, Panel_1, Windows_1, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class PPanel extends Panel_1.Panel {
        constructor() {
            super();
            this.game = new game_1.Game();
            this.width = "1050px";
            this.height = "650px";
            this.game.create(this.dom);
        }
        destroy() {
            this.game.destroy();
            super.destroy();
        }
    }
    function test() {
        var ret = new PPanel();
        ret.dom.style.backgroundColor = "white";
        var wd = Windows_1.default.findComponent("Game");
        wd === null || wd === void 0 ? void 0 : wd.destroy();
        Windows_1.default.add(ret, "Game");
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUtBLE1BQU0sTUFBTyxTQUFRLGFBQUs7UUFHdEI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUZaLFNBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBR2QsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztLQUNKO0lBQ0QsU0FBZ0IsSUFBSTtRQUVoQixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBQyxPQUFPLENBQUM7UUFDdEMsSUFBSSxFQUFFLEdBQUMsaUJBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ2QsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuY2xhc3MgUFBhbmVsIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgXHJcbiAgICBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IFwiMTA1MHB4XCI7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBcIjY1MHB4XCI7IFxyXG4gICAgICAgIHRoaXMuZ2FtZS5jcmVhdGUodGhpcy5kb20pOyBcclxuICAgIH1cclxuICAgIFxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmdhbWUuZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxufVxyXG5leHBvcnQgZnVuY3Rpb24gdGVzdCgpIHtcclxuICAgIFxyXG4gICAgdmFyIHJldCA9IG5ldyBQUGFuZWwoKTtcclxuICAgIHJldC5kb20uc3R5bGUuYmFja2dyb3VuZENvbG9yPVwid2hpdGVcIjtcclxuICAgIHZhciB3ZD13aW5kb3dzLmZpbmRDb21wb25lbnQoXCJHYW1lXCIpO1xyXG4gICAgd2Q/LmRlc3Ryb3koKTtcclxuICAgIHdpbmRvd3MuYWRkKHJldCwgXCJHYW1lXCIpO1xyXG59Il19