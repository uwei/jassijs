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
//# sourceMappingURL=startgame.js.map