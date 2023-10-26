define(["require", "exports", "jassijs/ui/Component", "jassijs/ui/Panel"], function (require, exports, Component_1, Panel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function test() {
        /*var ret=<Panel height="153">
            <button width="202" contentEditable="false" style={{ color: "red" }} height="42">hall</button>
            <Button text="sdfsdfsdf"></Button>
            dddd
        </Panel>;
       */
        /*  def
             <Button></Button>
             <br />
     
             <Textbox value={"AA"}></Textbox>
             <Textbox value="fffrr3"></Textbox>
     
             <Panel height={400} width={295}>
                 <Button></Button>
                 <Textbox value="fffrr3" width={90}></Textbox>
             </Panel>*/
        /*
       var bt=new Button();
       bt.onclick(()=>ret.tag="u");
       bt.text="Hallo"
       var ret= new HTMLComponent();
       ret.add(bt);
       ret.add(new TextComponent({text:"Hallo" }))
       return ret;
       */
        var ret = Component_1.React.createElement(Panel_1.Panel, null,
            "h a",
            Component_1.React.createElement("button", null, "Hhhhd"),
            "d fsdf",
            Component_1.React.createElement("u", null, "sdfsdfsdf"),
            "ka da",
            Component_1.React.createElement("br", null),
            "dd",
            Component_1.React.createElement("br", null),
            "ddddd",
            Component_1.React.createElement("br", null),
            "asdfa",
            Component_1.React.createElement("br", null),
            "asdfasdfasdf",
            Component_1.React.createElement("br", null),
            "asdf asdf",
            Component_1.React.createElement("br", null),
            Component_1.React.createElement("br", null));
        var comp = (0, Component_1.createComponent)(ret);
        return comp;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo2.js.map