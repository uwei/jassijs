define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    function j() {
    }
    function test() {
        var h = 9;
        /*  return <div style={{color:"green"}}>
              hallo
      </div>;*/
        var ret = React.createElement("button", { style: { color: "red" }, onClick: () => alert(8) }, "Hallo");
        return ret;
    }
    exports.test = test;
});
//# sourceMappingURL=hallo.js.map