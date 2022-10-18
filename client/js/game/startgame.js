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
    function createStyle() {
        var cssId = 'game.css'; // you could encode the css path itself to generate id..
        if (document.getElementById(cssId))
            document.getElementById(cssId).parentNode.removeChild(document.getElementById(cssId));
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = cssId;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = 'game/style.css';
        link.media = 'all';
        head.appendChild(link);
    }
    function test() {
        createStyle();
        var ret = new PPanel();
        //ret.dom.style.backgroundColor="white";
        var wd = Windows_1.default.findComponent("Game");
        wd === null || wd === void 0 ? void 0 : wd.destroy();
        Windows_1.default.add(ret, "Game");
    }
    exports.test = test;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRnYW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vZ2FtZS9zdGFydGdhbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztJQVNBLElBQWEsTUFBTSxHQUFuQixNQUFhLE1BQU8sU0FBUSxhQUFLO1FBRzdCO1lBQ0ksS0FBSyxFQUFFLENBQUM7WUFGWixTQUFJLEdBQUcsSUFBSSxXQUFJLEVBQUUsQ0FBQztZQUdkLHdCQUF3QjtZQUN4QiwwQkFBMEI7WUFDMUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsQ0FBQztRQUVELE9BQU87WUFDSCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3BCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBS0QsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJO1lBQ2IsSUFBSSxFQUFFLENBQUM7UUFDWCxDQUFDO0tBQ0osQ0FBQTtJQUhHO1FBSkMsSUFBQSxpQkFBTyxFQUFDO1lBQ0wsSUFBSSxFQUFFLE1BQU07WUFDWixJQUFJLEVBQUUsbUJBQW1CO1NBQzVCLENBQUM7Ozs7NEJBR0Q7SUFyQlEsTUFBTTtRQUZsQixJQUFBLHlCQUFlLEVBQUMseUJBQXlCLENBQUM7UUFDMUMsSUFBQSxpQkFBTSxFQUFDLGFBQWEsQ0FBQzs7T0FDVCxNQUFNLENBc0JsQjtJQXRCWSx3QkFBTTtJQXVCbkIsU0FBUyxXQUFXO1FBQ2hCLElBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxDQUFFLHdEQUF3RDtRQUNqRixJQUFJLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDMUYsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3BELElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7UUFDeEIsSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7UUFDdkIsSUFBSSxDQUFDLElBQUksR0FBRyxnQkFBZ0IsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBRzNCLENBQUM7SUFFRCxTQUFnQixJQUFJO1FBQ2hCLFdBQVcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztRQUV2Qix3Q0FBd0M7UUFDeEMsSUFBSSxFQUFFLEdBQUcsaUJBQU8sQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsRUFBRSxhQUFGLEVBQUUsdUJBQUYsRUFBRSxDQUFFLE9BQU8sRUFBRSxDQUFDO1FBQ2QsaUJBQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzdCLENBQUM7SUFSRCxvQkFRQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENpdHlEaWFsb2cgfSBmcm9tIFwiZ2FtZS9jaXR5ZGlhbG9nXCI7XHJcbmltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImdhbWUvd29ybGRcIjtcclxuaW1wb3J0IHsgUGFuZWwgfSBmcm9tIFwiamFzc2lqcy91aS9QYW5lbFwiO1xyXG5pbXBvcnQgd2luZG93cyBmcm9tIFwiamFzc2lqcy9iYXNlL1dpbmRvd3NcIjtcclxuaW1wb3J0IHsgR2FtZSB9IGZyb20gXCJnYW1lL2dhbWVcIjtcclxuaW1wb3J0IHsgJEFjdGlvbiwgJEFjdGlvblByb3ZpZGVyIH0gZnJvbSBcImphc3NpanMvYmFzZS9BY3Rpb25zXCI7XHJcbmltcG9ydCB7ICRDbGFzcyB9IGZyb20gXCJqYXNzaWpzL3JlbW90ZS9SZWdpc3RyeVwiO1xyXG5AJEFjdGlvblByb3ZpZGVyKFwiamFzc2lqcy5iYXNlLkFjdGlvbk5vZGVcIilcclxuQCRDbGFzcyhcImdhbWUuUFBhbmVsXCIpXHJcbmV4cG9ydCBjbGFzcyBQUGFuZWwgZXh0ZW5kcyBQYW5lbCB7XHJcblxyXG4gICAgZ2FtZSA9IG5ldyBHYW1lKCk7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIC8vdGhpcy53aWR0aCA9IFwiMTA1MHB4XCI7XHJcbiAgICAgICAgLy8gdGhpcy5oZWlnaHQgPSBcIjY1MHB4XCI7IFxyXG4gICAgICAgIHRoaXMuZ2FtZS5uZXdHYW1lKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lLnJlbmRlcih0aGlzLmRvbSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveSgpIHtcclxuICAgICAgICB0aGlzLmdhbWUuZGVzdHJveSgpO1xyXG4gICAgICAgIHN1cGVyLmRlc3Ryb3koKTtcclxuICAgIH1cclxuICAgIEAkQWN0aW9uKHtcclxuICAgICAgICBuYW1lOiBcIkdhbWVcIixcclxuICAgICAgICBpY29uOiBcIm1kaSAgbWRpLWFpcnBsYW5lXCIsXHJcbiAgICB9KVxyXG4gICAgc3RhdGljIGFzeW5jIHNob3coKSB7XHJcbiAgICAgICAgdGVzdCgpO1xyXG4gICAgfVxyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlKCkge1xyXG4gICAgdmFyIGNzc0lkID0gJ2dhbWUuY3NzJzsgIC8vIHlvdSBjb3VsZCBlbmNvZGUgdGhlIGNzcyBwYXRoIGl0c2VsZiB0byBnZW5lcmF0ZSBpZC4uXHJcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY3NzSWQpKVxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNzc0lkKS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNzc0lkKSk7XHJcbiAgICB2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XHJcbiAgICB2YXIgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcclxuICAgIGxpbmsuaWQgPSBjc3NJZDtcclxuICAgIGxpbmsucmVsID0gJ3N0eWxlc2hlZXQnO1xyXG4gICAgbGluay50eXBlID0gJ3RleHQvY3NzJztcclxuICAgIGxpbmsuaHJlZiA9ICdnYW1lL3N0eWxlLmNzcyc7XHJcbiAgICBsaW5rLm1lZGlhID0gJ2FsbCc7XHJcbiAgICBoZWFkLmFwcGVuZENoaWxkKGxpbmspO1xyXG5cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0ZXN0KCkge1xyXG4gICAgY3JlYXRlU3R5bGUoKTtcclxuICAgIHZhciByZXQgPSBuZXcgUFBhbmVsKCk7XHJcblxyXG4gICAgLy9yZXQuZG9tLnN0eWxlLmJhY2tncm91bmRDb2xvcj1cIndoaXRlXCI7XHJcbiAgICB2YXIgd2QgPSB3aW5kb3dzLmZpbmRDb21wb25lbnQoXCJHYW1lXCIpO1xyXG4gICAgd2Q/LmRlc3Ryb3koKTtcclxuICAgIHdpbmRvd3MuYWRkKHJldCwgXCJHYW1lXCIpO1xyXG59Il19