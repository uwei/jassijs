define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/BoxPanel", "jassijs/ui/Calendar", "jassijs/ui/Textbox", "jassijs/ui/Checkbox", "jassijs/ui/Table", "jassijs/ui/MenuItem", "jassijs/ui/ContextMenu"], function (require, exports, Component_1, Panel_1, Button_1, BoxPanel_1, Calendar_1, Textbox_1, Checkbox_1, Table_1, MenuItem_1, ContextMenu_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function MyTest() {
        /*
          
        */
        var check = { current: undefined };
        var values = [{ name: "Meier", vorname: "Max" }, { name: "Lehner", vorname: "Felix" }];
        // 
        //
        /*
         
        */
        var contextmenu = { current: undefined };
        return Component_1.React.createElement(Panel_1.Panel, null,
            Component_1.React.createElement(BoxPanel_1.BoxPanel, { label: "BoxPanel", horizontal: true },
                Component_1.React.createElement(Button_1.Button, { label: "Button", text: "Hi", onclick: () => { check.current.value = true; } }),
                Component_1.React.createElement("br", null),
                Component_1.React.createElement(Calendar_1.Calendar, { label: "Calendar" }),
                Component_1.React.createElement(Textbox_1.Textbox, { label: "Textbox", value: "Hi" }),
                Component_1.React.createElement(Checkbox_1.Checkbox, { ref: check, label: "Checkbox", text: "Check", value: true })),
            Component_1.React.createElement(Table_1.Table, { items: values }),
            Component_1.React.createElement(ContextMenu_1.ContextMenu, { ref: contextmenu },
                Component_1.React.createElement(MenuItem_1.MenuItem, { text: "Menuitem2", onclick: () => alert(8) }, " "),
                Component_1.React.createElement(MenuItem_1.MenuItem, { text: "Menuitem2", onclick: () => alert(8) }, " ")),
            Component_1.React.createElement(Button_1.Button, { text: "with Contextmenu", contextMenu: contextmenu }));
    }
    function test() {
        var ret = MyTest();
        return (0, Component_1.createComponent)(ret);
    }
    exports.test = test;
});
//# sourceMappingURL=TestJSX.js.map