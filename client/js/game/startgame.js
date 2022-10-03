define(["require", "exports", "jassijs/ui/Panel", "jassijs/base/Windows", "game/game"], function (require, exports, Panel_1, Windows_1, game_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    class PPanel extends Panel_1.Panel {
        constructor() {
            super();
            this.game = new game_1.Game();
            this.width = 500;
            this.height = 500;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUtBLE1BQU0sTUFBTyxTQUFRLGFBQUs7UUFHdEI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUZaLFNBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBR2QsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLENBQUM7UUFFRCxPQUFPO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixLQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDcEIsQ0FBQztLQUNKO0lBQ0QsU0FBZ0IsSUFBSTtRQUVoQixJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1FBQ3ZCLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBQyxPQUFPLENBQUM7UUFDdEMsSUFBSSxFQUFFLEdBQUMsaUJBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckMsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ2QsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFQRCxvQkFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuY2xhc3MgUFBhbmVsIGV4dGVuZHMgUGFuZWwge1xyXG4gICAgXHJcbiAgICBnYW1lID0gbmV3IEdhbWUoKTtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IDUwMDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IDUwMDsgXHJcbiAgICAgICAgdGhpcy5nYW1lLmNyZWF0ZSh0aGlzLmRvbSk7IFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBkZXN0cm95KCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZS5kZXN0cm95KCk7XHJcbiAgICAgICAgc3VwZXIuZGVzdHJveSgpO1xyXG4gICAgfVxyXG59XHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgXHJcbiAgICB2YXIgcmV0ID0gbmV3IFBQYW5lbCgpO1xyXG4gICAgcmV0LmRvbS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3I9XCJ3aGl0ZVwiO1xyXG4gICAgdmFyIHdkPXdpbmRvd3MuZmluZENvbXBvbmVudChcIkdhbWVcIik7XHJcbiAgICB3ZD8uZGVzdHJveSgpO1xyXG4gICAgd2luZG93cy5hZGQocmV0LCBcIkdhbWVcIik7XHJcbn0iXX0=