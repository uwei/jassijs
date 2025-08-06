async function testPDF() {
    try {
        debugger;
        var k = jrequire("./servertest/run", "", true);
        k.erstelleZip();
    }
    catch (err) {
        throw err;
    }
}
async function testpdfMake() {
    try {
        var DoServerreport = jrequire("./jassijs_report/server/DoServerreport").DoServerreport;
        var data = await new DoServerreport().getBase64("jassijs_report/server/TestServerreport", undefined);
        debugger;
    }
    catch (err) {
        debugger;
        throw err;
    }
}
async function testLocalServer() {
    await runLocalServerIfNeeded();
    try {
        var testExpress = jrequire("./servertest/run").testExpress;
        var data = await testExpress();
        var http = jrequire("http");
        var server = http.serverListening[5001];
        setTimeout(() => {
            var hh = server.requestListener({ url: "/index.html", method: "get" }, new http.ServerResponse(), () => 1);
        }, 3000);
    }
    catch (err) {
        debugger;
        throw err;
    }
}
async function testJSSQL() {
    try {
        var jssql = jrequire("./servertest/run").jssql;
        var data = await jssql();
    }
    catch (err) {
        debugger;
        throw err;
    }
}
async function testWebpack() {
    try {
        var startWebpack = jrequire("./servertest/startwebpack").startWebpack;
        var data = await startWebpack();
    }
    catch (err) {
        debugger;
        throw err;
    }
}
async function testDB() {
    console.log("TODO DB");
    /* try {
         var testDB = _jrequire("./servertest/run").testDB
         debugger;
         var data = await testDB()
     
     } catch (err) {
 
         debugger;
         throw err;
     }*/
}
//# sourceMappingURL=Testlocalserver.js.map