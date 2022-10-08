import { CityDialog } from "game/citydialog";
import { World } from "game/world";
import { Panel } from "jassijs/ui/Panel";
import windows from "jassijs/base/Windows";
import { Game } from "game/game";
class PPanel extends Panel {
    
    game = new Game();
    constructor() {
        super();
        this.width = "1050px";
        this.height = "650px"; 
        this.game.create(this.dom); 
    }
    
    destroy() {
        this.game.destroy();
        super.destroy();
    }
}
export function test() {
    
    var ret = new PPanel();
    ret.dom.style.backgroundColor="white";
    var wd=windows.findComponent("Game");
    wd?.destroy();
    windows.add(ret, "Game");
}