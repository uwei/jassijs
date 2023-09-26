define(["require", "exports", "jassijs/ui/Component"], function (require, exports, Component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function j() {
    }
    class TC extends Component_1.Component {
        constructor(prop) {
            super(prop);
        }
        render() {
            return React.createElement("div", null, this.props.name);
        }
    }
    function TC2(data) {
        return React.createElement("div", null, data.name);
    }
    function test() {
        /*  return <div style={{color:"green"}}>
              hallo
      </div>;*/
        // var ret=<button style={{color:"red"}} onClick={()=>alert(8)} >Hallo</button>;
        var ret = React.createElement("div", null,
            React.createElement("div", { style: { display: "inline", minWidth: "5px", minHeight: "2px" } }),
            React.createElement("div", { style: { borderStyle: "ridge", borderWidth: "5px" } },
                React.createElement("div", { style: { display: "inline", minWidth: "5px", minHeight: "2px" } }),
                React.createElement("button", null, "hall"),
                React.createElement("div", { style: { display: "inline", minWidth: "5px", minHeight: "2px" } }),
                React.createElement("button", null, "hall"),
                React.createElement("div", { style: { display: "inline", minWidth: "5px", minHeight: "2px" } }),
                React.createElement("button", null, "hall"),
                React.createElement("div", { style: { display: "inline", minWidth: "5px", minHeight: "2px" } })),
            React.createElement("div", { style: { minWidth: "5px", minHeight: "2px" } }),
            React.createElement("div", null,
                React.createElement("span", null, "\u00A0"),
                React.createElement("button", null, "hall"),
                React.createElement("span", null, "\u00A0"),
                React.createElement("button", null, "hall"),
                React.createElement("span", null, "\u00A0"),
                React.createElement("button", null, "hall"),
                React.createElement("span", null, "\u00A0")),
            React.createElement("span", null, "\u00A0"));
        ret.domWrapper.contentEditable = "true";
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map