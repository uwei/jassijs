define(["require", "exports", "jassijs/ui/HTMLPanel", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, HTMLPanel_1, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function KK(props) {
        return Component_1.React.createElement("div", null,
            Component_1.React.createElement(Panel_1.Panel, null, "ddddd"),
            Component_1.React.createElement(HTMLPanel_1.HTMLPanel, { value: "dfgdfg" }),
            "sdfsdf",
            Component_1.React.createElement("br", null),
            Component_1.React.createElement("button", null, "d sdfss"),
            "a dddddsdfsdf",
            Component_1.React.createElement("button", { label: "ff" }, "fsdfg x d a"),
            Component_1.React.createElement("br", null),
            Component_1.React.createElement("div", null),
            Component_1.React.createElement("table", null,
                Component_1.React.createElement("tr", { height: 15 },
                    Component_1.React.createElement("td", null, "ljkvbnvbdnvbnj"),
                    Component_1.React.createElement("td", null, "lj"),
                    Component_1.React.createElement("td", null)),
                Component_1.React.createElement("tr", null,
                    Component_1.React.createElement("td", null, "vvv"),
                    Component_1.React.createElement("td", null, "  sad"),
                    Component_1.React.createElement("td", null, "g4")),
                Component_1.React.createElement("tr", null,
                    Component_1.React.createElement("td", null, "vvv"),
                    Component_1.React.createElement("td", null, "  sad"),
                    Component_1.React.createElement("td", null))),
            "ghgd b ggggg f dddsdf ddd");
    }
    function test() {
        var comp = (0, Component_1.createComponent)(Component_1.React.createElement(KK, null));
        //   comp.config({ color: "red" });
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo6.js.map