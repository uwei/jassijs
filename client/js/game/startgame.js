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
//# sourceMappingURL=startgame.js.map