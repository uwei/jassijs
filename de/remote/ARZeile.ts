import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { $Class } from "jassijs/remote/Registry";
//import Kunde from "de/Kunde";
import { PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "jassijs/util/DatabaseSchema";
import { $CheckParentRight } from "jassijs/remote/security/Rights";
import { AR } from "de/remote/AR";
import { Context } from "jassijs/remote/RemoteObject";
@$DBObject()
@$Class("de.ARZeile")
export class ARZeile extends DBObject {
    @PrimaryGeneratedColumn()
    public id: number;
    @Column()
    public text: string;
    @Column()
    public position: number;
    @Column({ nullable: true, type: "decimal" })
    public preis: number;
    @$CheckParentRight()
    @ManyToOne(type => AR, ar => ar.zeilen)
    public ar: AR;
    public tt;
    constructor() {
        super();
    }
    static async find(options = undefined, context: Context = undefined): Promise<ARZeile[]> {
        if (!jassijs.isServer) {
            return await this.call(this.find, options, context);
        }
        else {
            //@ts-ignore
            var man = await (await import("jassijs/server/DBManager")).DBManager.get();
            return man.find(context, this, options);
        }
    }
    get oo2() {
        var o = 12;
        var a = 9;
        var t = 1;
        return "gpp";
    }

    async sample() {
        var ret;
        var az = await jassijs.db.load("de.ARZeile", 120);
        var h = await az.ar.resolve();
        var ar2 = await jassijs.db.load("de.AR", 30);
        var az3 = new ARZeile();
        var h = await ar2.zeilen.resolve();
        ar2.zeilen.add(az3);
        ar2.zeilen.remove(az3);
        // $(document.body).html(ret);
        /*var z1=new de.ARZeile();
        z1.id=110;
        z1.text="lkjlk";
        jassijs.db.save(z1);
        var z2=new de.ARZeile();
        z2.id=120;
        z2.text="lddkjlk";
        jassijs.db.save(z2);
        var ar=jassijs.db.load("de.AR",30);
        ar.zeilen=new jassijs.base.DBArray(z1,z2);
        jassijs.db.save(ar);
        var arz=jassijs.db.load("de.ARZeile",1);
        var test=ar.zeilen;*/
    }
}
jassijs.test = async function () {
    //	var k=new Kunde();
    //k=k;
    var test = await jassijs.db.load("de.ARZeile");
    var z: ARZeile = new ARZeile();
    z.id = 150;
    z.text = "jjj";
    //   jassijs.db.save(z);
    return undefined;
}; 
