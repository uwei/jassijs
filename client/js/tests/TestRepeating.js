define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Textbox", "jassijs/ui/Button", "jassijs/ui/Table", "jassijs/ext/jquerylib", "jquery.choosen"], function (require, exports, Component_1, Textbox_1, Button_1, Table_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var data = [
        { id: 1, name: "Max", childs: [{ name: "Anna" }, { name: "Aria" }] },
        { id: 2, name: "Moritz", childs: [{ name: "Clara" }, { name: "Heidi" }] },
        { id: 3, name: "Heinz", childs: [{ name: "Rosa" }, { name: "Luise" }] },
    ];
    function DetailComponent(props, state = {}) {
        var ret = (0, Component_1.jc)("div", {
            children: [
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: state.value.bind.id
                }),
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: state.value.bind.name
                }),
                (0, Component_1.jc)(Table_1.Table, {
                    height: 100,
                    width: 100,
                    bind: state.activeChild.bind,
                    bindItems: state.value.bind.childs
                }),
                (0, Component_1.jc)(Textbox_1.Textbox, {
                    bind: state.activeChild.bind.name
                }),
                (0, Component_1.jc)(Button_1.Button, { text: "erter", onclick: () => {
                        alert(state.activeChild.current.name);
                    } }),
                (0, Component_1.jc)("br")
            ]
        });
        return ret;
    }
    function MainComponent(props, state) {
        var ch = props.items.map(item => (0, Component_1.jc)(DetailComponent, { value: item }));
        var ret = (0, Component_1.jc)("span", {
            children: ch
        });
        return ret;
    }
    async function test() {
        var j = (0, Component_1.jc)(MainComponent, { items: data });
        var pan = (0, Component_1.createComponent)(j);
        return pan;
    }
    exports.test = test;
});
//# sourceMappingURL=TestRepeating.js.map