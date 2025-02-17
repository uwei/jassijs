define(["require", "exports", "jassijs/ui/Panel", "jassijs/ui/Button", "jassijs/ui/Component"], function (require, exports, Panel_1, Button_1, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    /*
    function MyTest2(prop:MyTestProp,states:States<MyTestProp>=undefined) {
       return <Panel>
       <Button text="show" onclick={()=>{ states.showexists.current=true }}></Button>
        <Button text="HalloButton" exists={states.showexists}></Button>
          <Button text="HalloButton" exists={states.showexists}></Button>
        <span exists={states.showexists}>HalloSpan</span>
          <Panel  exists={states.showexists} label="Panel">Hallo</Panel>
    
        <Button text="hide" onclick={()=>{ states.showexists.current=false }}></Button>
        </Panel>
    }*/
    function MyTest2(prop, states = undefined) {
        return React.createElement(Panel_1.Panel, null,
            React.createElement(Button_1.Button, { text: "show", onclick: () => {
                    states.showexists.current = true;
                } }),
            React.createElement(Panel_1.Panel, { exists: states.showexists, label: "Panel" }, "HalloPanel"),
            React.createElement("div", { exists: states.showexists }, "HalloDiv"),
            React.createElement(Button_1.Button, { text: "HalloButton", exists: states.showexists }),
            React.createElement(Button_1.Button, { text: "hide", onclick: () => {
                    states.showexists.current = false;
                } }));
    }
    function test() {
        var ret = React.createElement(MyTest2, { showexists: false });
        return (0, Component_1.createComponent)(ret);
        //      <Button text="show" onclick={()=>{ states.exists.current=true }}> </Button>
        //      <Button text="hide" onclick={()=>{ states.exists.current=true }}> </Button>
        //    //<Button text="hello" exists={states.exists} > </Button>
    }
    exports.test = test;
});
//# sourceMappingURL=ExistsIfTest2.js.map