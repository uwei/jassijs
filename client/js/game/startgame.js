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
            this.game.newGame();
            this.game.render(this.dom);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQUtBLE1BQU0sTUFBTyxTQUFRLGFBQUs7UUFHdEI7WUFDSSxLQUFLLEVBQUUsQ0FBQztZQUZaLFNBQUksR0FBRyxJQUFJLFdBQUksRUFBRSxDQUFDO1lBR2QsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDdEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7WUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELE9BQU87WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDO0tBQ0o7SUFDRCxTQUFnQixJQUFJO1FBRWhCLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7UUFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFDLE9BQU8sQ0FBQztRQUN0QyxJQUFJLEVBQUUsR0FBQyxpQkFBTyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNyQyxFQUFFLGFBQUYsRUFBRSx1QkFBRixFQUFFLENBQUUsT0FBTyxFQUFFLENBQUM7UUFDZCxpQkFBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDN0IsQ0FBQztJQVBELG9CQU9DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2l0eURpYWxvZyB9IGZyb20gXCJnYW1lL2NpdHlkaWFsb2dcIjtcclxuaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZ2FtZS93b3JsZFwiO1xyXG5pbXBvcnQgeyBQYW5lbCB9IGZyb20gXCJqYXNzaWpzL3VpL1BhbmVsXCI7XHJcbmltcG9ydCB3aW5kb3dzIGZyb20gXCJqYXNzaWpzL2Jhc2UvV2luZG93c1wiO1xyXG5pbXBvcnQgeyBHYW1lIH0gZnJvbSBcImdhbWUvZ2FtZVwiO1xyXG5jbGFzcyBQUGFuZWwgZXh0ZW5kcyBQYW5lbCB7XHJcbiAgICBcclxuICAgIGdhbWUgPSBuZXcgR2FtZSgpO1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLndpZHRoID0gXCIxMDUwcHhcIjtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IFwiNjUwcHhcIjsgXHJcbiAgICAgICAgdGhpcy5nYW1lLm5ld0dhbWUoKTtcclxuICAgICAgICB0aGlzLmdhbWUucmVuZGVyKHRoaXMuZG9tKTsgXHJcbiAgICB9XHJcbiAgICBcclxuICAgIGRlc3Ryb3koKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lLmRlc3Ryb3koKTtcclxuICAgICAgICBzdXBlci5kZXN0cm95KCk7XHJcbiAgICB9XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIHRlc3QoKSB7XHJcbiAgICBcclxuICAgIHZhciByZXQgPSBuZXcgUFBhbmVsKCk7XHJcbiAgICByZXQuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvcj1cIndoaXRlXCI7XHJcbiAgICB2YXIgd2Q9d2luZG93cy5maW5kQ29tcG9uZW50KFwiR2FtZVwiKTsgXHJcbiAgICB3ZD8uZGVzdHJveSgpO1xyXG4gICAgd2luZG93cy5hZGQocmV0LCBcIkdhbWVcIik7XHJcbn0iXX0=