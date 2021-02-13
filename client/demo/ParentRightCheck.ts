import { Group } from "jassi/remote/security/Group";
import { User } from "jassi/remote/security/User";
import { ARZeile } from "remote/de/ARZeile";
import { Kunde } from "remote/de/Kunde";
import { AR } from "remote/de/AR";
import registry from "jassi/remote/Registry";
import { Test } from "jassi/base/Tests";
import rights from "jassi/remote/security/Rights";
import { RemoteProtocol } from "jassi/remote/RemoteProtocol";
import { DBObject } from "jassi/remote/DBObject";
import { ParentRight } from "jassi/remote/security/ParentRight";


async function freeNumber(cl: any) {
    var max = 1000000;
    var c = DBObject["cache"];
    var num = Math.floor(Math.random() * Math.floor(1000000));
    var ob = await cl.findOne(num);
    while (ob !== undefined) {
        num = Math.floor(Math.random() * Math.floor(1000000));
        ob = await cl.find(num);
    }
    return num;
}
export async function test(tst: Test) {
    await RemoteProtocol.simulateUser();


    //$.removeCookie("openedwindows", {})
    try {

        var kdid = await freeNumber(Kunde);
        var kd = new Kunde();
        kd.id = kdid;

        kd.nachname = "Nachname";
        kd.vorname = "Vorname";
        await kd.save();
        var kd5 = new Kunde();
        kd5.id = await freeNumber(Kunde);

        kd5.nachname = "Nachname";
        kd5.vorname = "Vorname";
        await kd5.save();
        //cache an reload
        var kd3 = <Kunde>await Kunde.findOne(kdid);
        var kd2 = <Kunde>await Kunde.findOne(kdid);
        tst.expectEqual(kd2 === kd3);
        //test removefromCache
        kd2.removeFromCache();
        kd2 = <Kunde>await Kunde.findOne(kdid);
        tst.expectEqual(kd !== kd2);

        var ar = new AR();
        ar.id = 8544 + Number(registry.nextID());
        ar.kunde = kd;
        await ar.save();

        var z = new ARZeile();
        z.text = "w";
        z.position = 3;
        z.ar = ar;
        await z.save();
        //Load relations
        var arw = <ARZeile>await ARZeile.findOne({ id: z.id, relations: ["ar.kunde"] });
        tst.expectEqual(arw.ar.kunde.nachname === kd.nachname);
        //wrong relation
        tst.expectError(async () => { await ARZeile.findOne({ id: z.id, relations: ["sdafsd"] }) });

        //User

        var user = new User();
        user.email = "mail" + await freeNumber(User);
        user.password = "hallo";
        await user.save();

        var group = new Group();
        group.id = await freeNumber(Group);
        group.name = "Group"
        await group.save();


        user.groups = [group];
        await user.save();
        var sec = new ParentRight();
        sec.classname = "de.Kunde";
        sec.name = "Kundennummern";
        sec.i1 = kdid;
        sec.i2 = kdid;
        sec.groups = [group];
        await sec.save();

        await RemoteProtocol.simulateUser(user.email, user.password);
        var kunden = await Kunde.find();
        tst.expectEqual(kunden.length === 1);
        await RemoteProtocol.simulateUser();
        kunden = await Kunde.find();
        tst.expectEqual(kunden.length > 1);
    } catch (err) {
        throw err;

    } finally {
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


