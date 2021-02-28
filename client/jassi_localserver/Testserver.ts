//import { $Action, $ActionProvider } from "jassi/base/Actions";
import { Kunde } from "de/remote/Kunde";
import { $Class } from "jassi/remote/Jassi";

import { Testuser } from "jassi_localserver/Testuser";
import { createConnection } from "typeorm";
import { AR } from "de/remote/AR";
import { ARZeile } from "de/remote/ARZeile";
import { DBManager } from "jassi/server/DBManager";


//@$ActionProvider("jassi.base.ActionNode")
@$Class("jassi_localserver.Testserver")
class Testserver {
    public static async run() {
        var man=await DBManager.get();
        var kd=new Kunde();
        kd.id=9;
        
        await man.save(kd);
       var all=await man.find(Kunde);
        debugger;
    }

    // @$Action({ name: "Test/Testserver" })
    public static async rundirect() {

        const initSqlJs = window["SQL"];
        // or if you are in a browser:
        // var initSqlJs = window.initSqlJs;

        const SQL = await window["SQL"]({
            // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
            // You can omit locateFile completely when running in node
            locateFile: file => `https://sql.js.org/dist/${file}`
        });

        var con = await createConnection({
            type: "sqljs",
            entities: [
                Kunde,
                AR,
                ARZeile
            ],
            synchronize: true
        });
        var kd = new Kunde();
        kd.id = 500;
        kd.nachname = "Weigelt";
        var ent = await con.manager.save(kd);
        var all = await con.manager.find(Kunde);
        alert(JSON.stringify(all[0]));
        /*var us=new Testuser();
        us.id=1;
        us.firstname="f";
        us.lastname="l"; 
        var ent=await con.manager.save(us);
        var all=await con.manager.find(Testuser);
        alert(JSON.stringify(all[0]));*/

    }
}
export async function test() {
    Testserver.run();
}

