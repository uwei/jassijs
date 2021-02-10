

import {DBObject, $DBObject } from "remote/jassi/base/DBObject";
import jassi, { $Class } from "remote/jassi/base/Jassi";
//import Kunde from "de/Kunde";
import { PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "jassi/util/DatabaseSchema";

import { $CheckParentRight } from "remote/jassi/security/Rights";
import { AR } from "remote/de/AR";

@$DBObject()
@$Class("de.ARZeile")
export class ARZeile extends DBObject {
    @PrimaryGeneratedColumn()
    public id: number;
    @Column()
    public text: string;
    @Column()
    public position: number;
    @Column({nullable:true,type:"decimal"})
    public preis:number;
    @$CheckParentRight()
    @ManyToOne(type => AR, ar => ar.zeilen)
    public ar: AR;
    public tt;
    constructor() {
        super();
    }
      static async find(options = undefined): Promise<ARZeile[]> {
        if (!jassi.isServer) {
            return await this.call("find", options);
        } else {
            //@ts-ignore
            var man = await (await import("jassi/server/DBManager")).DBManager.get();
            return man.find(this, options);
        }
    }
    get oo2() {
        var o = 12;
        var a = 9;
        var t = 1;
        return "gpp";
    }
    test() {
        var h = 9;
        var kk = 3;
        var b = 3;

        return this.tt + "pko01" + this.oo2;
    }
    async sample() {
        var ret;
        var az = await jassi.db.load("de.ARZeile", 120);
        var h = await az.ar.resolve();
        var ar2 = await jassi.db.load("de.AR", 30);
        var az3 = new ARZeile();
        var h = await ar2.zeilen.resolve();
        ar2.zeilen.add(az3);
        ar2.zeilen.remove(az3);
        // $(document.body).html(ret);
        /*var z1=new de.ARZeile();  
        z1.id=110;
        z1.text="lkjlk";
        jassi.db.save(z1); 
        var z2=new de.ARZeile();
        z2.id=120;
        z2.text="lddkjlk";
        jassi.db.save(z2);  
        var ar=jassi.db.load("de.AR",30);  
        ar.zeilen=new jassi.base.DBArray(z1,z2); 
        jassi.db.save(ar);
        var arz=jassi.db.load("de.ARZeile",1);
        var test=ar.zeilen;*/


    }
}


jassi.test = async function () {
    //	var k=new Kunde();
    //k=k;

    var test = await jassi.db.load("de.ARZeile");
    var z: ARZeile = new ARZeile();
    z.id = 150;
    z.text = "jjj";
    //   jassi.db.save(z);
    return undefined;
}
