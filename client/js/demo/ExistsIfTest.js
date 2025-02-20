define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/State"], function (require, exports, Component_1, Panel_1, Button_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = exports.PlaceholderComponentNotExists = void 0;
    class PlaceholderComponentNotExists extends Component_1.Component {
        constructor(properties) {
            super();
            this.dom = document.createComment("ExistsIfTest");
            this.domWrapper = this.dom;
        }
        render() {
            return undefined;
        }
    }
    exports.PlaceholderComponentNotExists = PlaceholderComponentNotExists;
    async function test() {
        var stateExists = (0, State_1.createState)(false);
        var stateText = (0, State_1.createState)("Haa");
        var ret = new Panel_1.Panel();
        var e = new Button_1.Button({
            text: stateText.self, onclick: () => {
                stateExists.current = true;
            }
        });
        ret.add(e);
        var e2 = new Button_1.Button({
            text: stateText.self, exists: stateExists.self,
            onclick: () => {
                stateText.current = "kkk";
                e2.forceUpdate();
            }
        });
        ret.add(e2);
        var e3 = new Button_1.Button({
            text: "hide", onclick: () => {
                debugger;
                stateExists.current = false;
                stateText.current = "textneu";
            }
        });
        ret.add(e3);
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=ExistsIfTest.js.map