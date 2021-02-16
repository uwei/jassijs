define(["require", "exports", "de/remote/AR", "de/remote/Kunde", "de/remote/ARZeile"], function (require, exports, AR_1, Kunde_1, ARZeile_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test3 = exports.test2 = exports.test4 = void 0;
    async function test4() {
        //await Kunde.sample();
        var ar = (await AR_1.AR.find({ id: 900 }))[0];
        var kunde = (await Kunde_1.Kunde.find({ id: 5 }))[0];
        ar.kunde = kunde;
        ar.save();
        var zeile = (await ARZeile_1.ARZeile.find({ id: 5 }))[0];
        zeile.ar = ar;
        zeile.position = 50;
        zeile.text = "kk2k";
        zeile.save();
    }
    exports.test4 = test4;
    ;
    async function test2() {
        //await Kunde.sample();
        var all = await Kunde_1.Kunde.find({ id: 5 });
        var k = all[0];
        k.id = 5;
        k.vorname = "Markus";
        k.nachname = "Beier";
        k.ort = "Mainz";
        k.PLZ = "99992";
        try {
            debugger;
            await k.save();
        }
        catch (ex) {
            debugger;
        }
        //	new de.Kunde().generate();
        //jassi.db.uploadType(de.Kunde);
    }
    exports.test2 = test2;
    ;
    async function test3() {
        var all = await AR_1.AR.find();
        var z = (await AR_1.AR.find({ id: 902 }))[0];
        //console.log(z.nummer++);
        z.save();
        var kd = (await Kunde_1.Kunde.find({ id: 4 }))[0];
        kd.extField = "yes";
        kd.save();
    }
    exports.test3 = test3;
});
//# sourceMappingURL=DBTest.js.map