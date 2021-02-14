
import { ARZeile } from "de/remote/ARZeile";
import { Kunde } from "de/remote/Kunde";
import { DBObject, $DBObject } from "jassi/remote/DBObject";
import jassi, { $Class } from "jassi/remote/Jassi";
import { JoinColumn, JoinTable, Entity, PrimaryColumn, Column, ManyToMany, ManyToOne, OneToMany, OneToOne } from "jassi/util/DatabaseSchema";
import { $CheckParentRight, $Rights } from "jassi/remote/security/Rights";
/** 
* Ausgangsrechnung 
* @class de.AR  
*/
@$Rights([{ name: "Auftragswesen/Ausgangsrechnung/festschreiben" },
    { name: "Auftragswesen/Ausgangsrechnung/löschen" }])
@$DBObject() 
@$Class("de.AR")
export class AR extends DBObject {
    @PrimaryColumn()
    id: number;
    @Column()
    strasse: string;
    @Column()
    nummer: number;
    @Column({ nullable: true })
    ort: string = "";
    @$CheckParentRight()
    //@JoinTable()
    @ManyToOne(type => Kunde, kunde => kunde.rechnungen)
    kunde: Kunde;
    @OneToMany(type => ARZeile, zeile => zeile.ar)
    zeilen: ARZeile[];
    constructor() {
        super();
        this.id = 0;
        this.strasse = "";
        this.nummer = 0;
    }
    static async myfind(options = undefined): Promise<AR[]> {
        if (!jassi.isServer) {
            return await this.call("myfind", options);
        }
        else {
            //@ts-ignore
            var Brackets = (await import("typeorm")).Brackets;
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            var man2 = man;
            var ret = await man.connection().manager.createQueryBuilder().
                select("me").from(AR, "me").
                leftJoinAndSelect("me.kunde", ",me.kunde").
                where("me.kunde=:id", { id: 5 }).getMany();
            var ret2 = await man.connection().manager.createQueryBuilder().
                select("me").from(ARZeile, "me").
                leftJoin("me.ar", "me_ar").
                leftJoin("me_ar.kunde", "me_ar_kunde").
                where("me_ar_kunde.id>:id", { id: 0 }).
                andWhere(new Brackets(qp => {
                qp.where("me_ar.id>=:p1 and me_ar.id<=:p2", { p1: 1, p2: 90 }).
                    orWhere("me_ar.id>=:p3 and me_ar.id<=:p4", { p3: 500, p4: 1000 });
            })).
                andWhere(new Brackets(qp => {
                qp.where("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 }).
                    orWhere("me_ar_kunde.id>=:von and me_ar_kunde.id<=:bis", { von: 1, bis: 90 });
            })).
                getMany();
            return ret;
        }
    }
    async sample() {
        var all = AR.myfind();
        debugger;
        // $(document.body).html(ret);
        var ar = new AR();
        ar.strasse = "gemeindeberg";
        ar.nummer = 7;
        ar.id = 30;
        ar.save();
        /*        var ar2 = await jassi.db.load("de.AR", 30);
                var test = await ar2.kunden.resolve();
                var kd = await jassi.db.load("de.Kunde", 9);
                ar.kunde = kd;
                await jassi.db.save(ar);
                var arneu = await jassi.db.load("de.AR", 30);
                var test = await arneu.kunde.resolve();
                await jassi.db.save(ar);
        */
        //jassi.db.delete(kunde);
    }
}
export async function test() {
    //jassi.db.clearCache();
    //var ar = await jassi.db.load("de.AR", 30, "kunde");
    //ar.zeilen = await jassi.db.load("de.ARZeile");
    var ak = await AR.myfind();
    return;
    //var z: AR = (await AR.find({ id: 902 }))[0];
    // z.plz="09456";
    //console.log(JSON.stringify(z));
    // z.save();
    /*	var hh=ar.kunde;
        var test=await ar.kunde.resolve();
        var kkk=ar.kunde.rechnungen;
        var kkk=ar.kunde.rechnungen.resolve();
        */
}
