define(["require", "exports", "jassijs/remote/Server", "jassijs/util/Reloader", "jassijs/remote/Registry"], function (require, exports, Server_1, Reloader_1, Registry_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MemoryTest = void 0;
    function test() {
        let j = new Promise((resolve_1, reject_1) => { require(["demo/DK"], resolve_1, reject_1); });
        // let dk=new DK();
        // dk.destroy();
    }
    test();
    class MemoryTest {
        async MemoryTest() {
            let server = new Server_1.Server();
            let test = await server.loadFile("demo/DK.ts");
            await server.saveFile("demo/DK.ts", test);
            await Reloader_1.Reloader.instance.reloadJS("demo/DK.js");
            delete Registry_1.default.data["$Class"]["demo.DK"];
            requirejs.undef("demo/DK.js");
            requirejs.undef("demo/DK");
        }
    }
    exports.MemoryTest = MemoryTest;
});
//# sourceMappingURL=MemoryTest.js.map
//# sourceMappingURL=MemoryTest.js.map