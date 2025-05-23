define(["require", "exports", "jassijs/ui/ContextMenu", "jassijs/ui/MenuItem", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Component", "jassijs/ui/State"], function (require, exports, ContextMenu_1, MenuItem_1, Panel_1, Button_1, Component_1, State_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var cm = (0, State_1.createRef)();
    var refs = (0, State_1.createRefs)();
    function MyContextMenuTest(props = {}) {
        return React.createElement(Panel_1.Panel, null,
            React.createElement(Button_1.Button, { contextMenu: cm, text: "btHall" }),
            React.createElement(ContextMenu_1.ContextMenu, { ref: cm },
                React.createElement(MenuItem_1.MenuItem, { text: "Hallo" }),
                React.createElement(MenuItem_1.MenuItem, { text: "Hallo2" })),
            React.createElement(Button_1.Button, { contextMenu: refs.cm, text: "btHal2" }),
            React.createElement(ContextMenu_1.ContextMenu, { ref: refs.cm },
                React.createElement(MenuItem_1.MenuItem, { text: "Hallo4" }),
                React.createElement(MenuItem_1.MenuItem, { text: "Hallo3" })));
    }
    async function test() {
        // kk.o=0;
        var dlg = (0, Component_1.createComponent)(React.createElement(MyContextMenuTest, null));
        // debugger;
        return dlg;
    }
    exports.test = test;
});
//# sourceMappingURL=TestContextmenu2.js.map