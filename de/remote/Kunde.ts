import { DBObject, $DBObject } from "jassijs/remote/DBObject";
import { AR } from "de/remote/AR";
import { $Class } from "jassijs/remote/Registry";
import { Entity, PrimaryColumn, Column, OneToOne, ManyToMany, ManyToOne, OneToMany } from "jassijs/util/DatabaseSchema";
import { ExtensionProvider } from "jassijs/remote/Extensions";
import { $DBObjectQuery } from "jassijs/remote/DBObjectQuery";
import { $ParentRights } from "jassijs/remote/security/Rights";
import { Context } from "jassijs/remote/RemoteObject";
import { ValidateIsInt } from "jassijs/remote/Validator";
//import "jassijs/ext/enableExtension.js?de.Kunde";
@$ParentRights([{ name: "Kundennummern", sqlToCheck: "me.id>=:i1 and me.id<=:i2",
        description: {
            text: "Kundennummern",
            i1: "von",
            i2: "bis"
        } }])
@$DBObject()
@$Class("de.Kunde") 
export class Kunde extends DBObject implements ExtensionProvider {
    @PrimaryColumn()
    declare id: number;
    @ValidateIsInt()
    @Column()
    vorname: string;
    @Column()
    nachname: string; 
    @Column()
    strasse: string;
    @Column()
    PLZ: string;
    @Column({ nullable: true })
    ort: string;
    @Column()
    hausnummer: number;
    @OneToMany(type => AR, ar => ar.kunde)
    rechnungen: AR[];
    initExtensions() {
        //this function would be extended
    }
    constructor() {
        super();
        this.id = 0;
        this.vorname = "";
        this.nachname = "";
        this.strasse = "";
        this.PLZ = "";
        this.hausnummer = 0;
        this.initExtensions();
    }
    /**
    * add here all properties for the PropertyEditor
    * @param {[jassijs.ui.ComponentDescriptor]} desc - describe fields for propertyeditor
    * e.g.  desc.fields.push(new jassijs.ui.Property("id","number"));
    */
    static describeComponent(desc) {
        desc.actions.push({
            name: "Bewertung", description: "Bewerte den Kunden", icon: "mdi mdi-car", run: function (kunden) {
                for (var x = 0; x < kunden.length; x++) {
                    // notify("bewerte..." + kunden[x].vorname, "info", { position: "right" });
                    //	alert("bewerten..."+kunden[x].vorname);
                }
            }
        });
    }
    @$DBObjectQuery({ name: "Alle nach Namen", description: "Kundenliste nach Namen" })
    static async alleKundenNachNachname(): Promise<any[]> {
        return await Kunde.find({ order: "nachname" });
    }
    @$DBObjectQuery({ name: "Alle nach Nummer", description: "Kundenliste nach Nummer" })
    static async alleKundenNachNummer(): Promise<any[]> {
        return await Kunde.find({ order: "id" });
    }
    static async find(options = undefined,context:Context=undefined): Promise<any[]> {
        if (!context?.isServer) {
            return await this.call(this.find, options,context);
        } 
        else {
            //@ts-ignore
            var man = await (await import("jassijs/server/DBManager")).DBManager.get();
            return man.find(context,this, options);
        }
    }
    static async sample() {
        var kunde1 = new Kunde();
        Object.assign(kunde1, { id: 1, vorname: "Max", nachname: "Meier", strasse: "Dorfstrße", hausnummer: 100 });
        var kunde2 = new Kunde();
        Object.assign(kunde2, { id: 2, vorname: "Mario", nachname: "Meier", strasse: "Dorfstraße", hausnummer: 87 });
        var kunde3 = new Kunde();
        Object.assign(kunde3, { id: 3, vorname: "Alma", nachname: "Alser", strasse: "Hauptstraße", hausnummer: 7 });
        var kunde4 = new Kunde();
        Object.assign(kunde4, { id: 4, vorname: "Elke", nachname: "Krautz", strasse: "Gehweg", hausnummer: 5 });
        await kunde1.save();
        await kunde2.save();
        await kunde3.save();
        await kunde4.save();
        //jassijs.db.delete(kunde);
    }
    @Column({	nullable: true})
    land: string;
}
export async function test() {
    //var g=test.extFunc2();   
    //var h=test.extFunc();
    
    //await Kunde.sample();
    var k = <Kunde>await Kunde.findOne({ id: 1 });
    if(k===undefined)
        k=new Kunde();
    k.id=1;
    k.vorname = "Ella";
    k.land="Deutschland";
    k.nachname = "Klotz";
    k.ort = "Mainz";
    k.PLZ = "99992";
    var tt=await k.validate(k);
    debugger;
    k.save();

    //	new de.Kunde().generate();
    //jassijs.db.uploadType(de.Kunde);
}
;
