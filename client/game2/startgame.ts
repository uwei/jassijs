import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { Game } from "game/game";
import { $Action, $ActionProvider } from "jassijs/base/Actions";
import { $Class } from "jassijs/remote/Registry";
@$ActionProvider("jassijs.base.ActionNode")
@$Class("game.PPanel")
export class PPanel extends Panel {

    game = new Game();
    constructor() {
        super();
        //this.width = "1050px";
        // this.height = "650px"; 
        this.game.newGame();
        this.game.render(this.dom); 
    }

    destroy() {
        this.game.destroy();
        super.destroy();
    }
    @$Action({
        name: "Game",
        icon: "mdi  mdi-airplane",
    })
    static async show() {
        test();
    }
}
function createStyle() {
    var cssId = 'game.css';  // you could encode the css path itself to generate id..
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

export function test() {
    createStyle();
    var ret = new PPanel();

    //ret.dom.style.backgroundColor="white";
    var wd = windows.findComponent("Game");
    wd?.destroy();
    windows.add(ret, "Game");
}