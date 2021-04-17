define(["require", "exports", "jassi/remote/security/Group", "jassi/remote/security/User", "de/remote/ARZeile", "de/remote/Kunde", "de/remote/AR", "jassi/remote/Registry", "jassi/remote/RemoteProtocol", "jassi/remote/DBObject", "jassi/remote/security/ParentRight"], function (require, exports, Group_1, User_1, ARZeile_1, Kunde_1, AR_1, Registry_1, RemoteProtocol_1, DBObject_1, ParentRight_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    async function freeNumber(cl) {
        var max = 1000000;
        var c = DBObject_1.DBObject["cache"];
        var num = Math.floor(Math.random() * Math.floor(1000000));
        var ob = await cl.findOne(num);
        while (ob !== undefined) {
            num = Math.floor(Math.random() * Math.floor(1000000));
            ob = await cl.find(num);
        }
        return num;
    }
    async function test(tst) {
        await RemoteProtocol_1.RemoteProtocol.simulateUser();
        //$.removeCookie("openedwindows", {})
        try {
            var kdid = await freeNumber(Kunde_1.Kunde);
            var kd = new Kunde_1.Kunde();
            kd.id = kdid;
            kd.nachname = "Nachname";
            kd.vorname = "Vorname";
            await kd.save();
            var kd5 = new Kunde_1.Kunde();
            kd5.id = await freeNumber(Kunde_1.Kunde);
            kd5.nachname = "Nachname";
            kd5.vorname = "Vorname";
            await kd5.save();
            //cache an reload
            var kd3 = await Kunde_1.Kunde.findOne(kdid);
            var kd2 = await Kunde_1.Kunde.findOne(kdid);
            tst.expectEqual(kd2 === kd3);
            //test removefromCache
            kd2.removeFromCache();
            kd2 = await Kunde_1.Kunde.findOne(kdid);
            tst.expectEqual(kd !== kd2);
            var ar = new AR_1.AR();
            ar.id = 8544 + Number(Registry_1.default.nextID());
            ar.kunde = kd;
            await ar.save();
            var z = new ARZeile_1.ARZeile();
            z.text = "w";
            z.position = 3;
            z.ar = ar;
            await z.save();
            //Load relations
            var arw = await ARZeile_1.ARZeile.findOne({ id: z.id, relations: ["ar.kunde"] });
            tst.expectEqual(arw.ar.kunde.nachname === kd.nachname);
            //wrong relation
            tst.expectError(async () => { await ARZeile_1.ARZeile.findOne({ id: z.id, relations: ["sdafsd"] }); });
            //User
            var user = new User_1.User();
            user.email = "mail" + await freeNumber(User_1.User);
            user.password = "hallo";
            await user.save();
            var group = new Group_1.Group();
            group.id = await freeNumber(Group_1.Group);
            group.name = "Group";
            await group.save();
            user.groups = [group];
            await user.save();
            var sec = new ParentRight_1.ParentRight();
            sec.classname = "de.Kunde";
            sec.name = "Kundennummern";
            sec.i1 = kdid;
            sec.i2 = kdid;
            sec.groups = [group];
            await sec.save();
            await RemoteProtocol_1.RemoteProtocol.simulateUser(user.email, user.password);
            var kunden = await Kunde_1.Kunde.find();
            tst.expectEqual(kunden.length === 1);
            await RemoteProtocol_1.RemoteProtocol.simulateUser();
            kunden = await Kunde_1.Kunde.find();
            tst.expectEqual(kunden.length > 1);
        }
        catch (err) {
            throw err;
        }
        finally {
            if (sec)
                await sec.remove();
            if (user)
                await user.remove();
            if (group)
                await group.remove();
            if (arw)
                await arw.remove();
            if (ar)
                await ar.remove();
            if (kd)
                await kd.remove();
            if (kd5)
                await kd5.remove();
        }
        console.log("ready");
    }
    exports.test = test;
});
//# sourceMappingURL=ParentRightCheck.js.map
//# sourceMappingURL=ParentRightCheck.js.map