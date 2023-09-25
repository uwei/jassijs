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
        var ret = React.createElement("span", null,
            React.createElement(TC, { name: "Hallo" }),
            ";",
            React.createElement(TC2, { name: "Hallo2" }),
            " ");
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map